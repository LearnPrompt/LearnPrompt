// orchestrator（编排层）：一个最小状态机。
// 它不写代码、也不判对错，只决定：顺序、角色路由、重试预算、停止与升级。
//
// 状态：INSPECT → IMPLEMENT → VERIFY →（PASS?→STOP_DONE | 还有预算?→IMPLEMENT | 否则→ESCALATE）
//
// 关键分工：
//   - worker 产出候选（执行）；evaluator 跑验收（判定）；orchestrator 读判定后决定去哪一步（控制流）。
//   - 做事的和判分的不是同一个角色，这样“我觉得写完了”不能替代一次真实验收。

import { evaluate } from "./evaluator.mjs";
import { makeWorker } from "./worker.mjs";
import { acceptance } from "./acceptance.mjs";

const pad = (label) => label.padEnd(11, " ");

export async function orchestrate({ scenario, retryBudget }) {
  const log = [];
  const record = (line) => log.push(line);

  const worker = makeWorker(scenario);
  // 一次 IMPLEMENT + 一次 VERIFY = 一次尝试；总尝试数 = 首次 + retryBudget 次重试。
  const maxAttempts = retryBudget + 1;
  let attempt = 0;
  let state = "INSPECT";
  let result = null;

  // INSPECT：先看清任务边界与验收标准，再动工。
  record(
    `[state] ${pad("INSPECT")} task=slugify  acceptance=${acceptance.length} cases  retry_budget=${retryBudget}`,
  );

  state = "IMPLEMENT";
  while (true) {
    if (state === "IMPLEMENT") {
      attempt += 1;
      const source = worker.next();
      if (source === null) {
        // worker 没有更多候选：直接升级，不假装通过。
        record(
          `[state] ${pad("IMPLEMENT")} attempt=${attempt}/${maxAttempts}  worker exhausted candidates`,
        );
        state = "ESCALATE";
        continue;
      }
      record(
        `[state] ${pad("IMPLEMENT")} attempt=${attempt}/${maxAttempts}  worker applied candidate #${attempt}`,
      );
      state = "VERIFY";
      // 把候选源码挂到闭包上，交给 VERIFY 分支的评估器。
      state = { name: "VERIFY", source };
      continue;
    }

    if (typeof state === "object" && state.name === "VERIFY") {
      const verdict = await evaluate(state.source);
      if (verdict.pass) {
        record(
          `[state] ${pad("VERIFY")} attempt=${attempt}       PASS  ${verdict.total}/${verdict.total} cases`,
        );
        state = "STOP_DONE";
        continue;
      }
      const f = verdict.failing;
      record(
        `[state] ${pad("VERIFY")} attempt=${attempt}       FAIL  case="${f.name}"  expected=${f.expected}  actual=${f.actual}`,
      );
      // ROUTE：读判定后决定去哪一步。还有预算就回 IMPLEMENT，否则升级。
      if (attempt < maxAttempts) {
        const used = attempt;
        const left = maxAttempts - attempt - 1;
        record(
          `[route] ${pad("RETRY")} budget used ${used}/${retryBudget}, ${left} left -> IMPLEMENT`,
        );
        state = "IMPLEMENT";
      } else {
        record(
          `[route] ${pad("BUDGET")} exhausted after ${attempt} attempts -> ESCALATE`,
        );
        state = "ESCALATE";
      }
      continue;
    }

    if (state === "STOP_DONE") {
      record(`[stop]  ${pad("STOP_DONE")} reason=all-acceptance-passed  exit=0`);
      result = { outcome: "done", attempts: attempt, exit: 0 };
      break;
    }

    if (state === "ESCALATE") {
      record(
        `[stop]  ${pad("ESCALATE")} reason=retry-budget-exhausted  handoff=human  exit=1`,
      );
      result = { outcome: "escalated", attempts: attempt, exit: 1 };
      break;
    }
  }

  return { ...result, log };
}
