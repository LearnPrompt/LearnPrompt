// 跑两个场景，验证同一台状态机的两条出口都真实触发：
//   场景 A：一次失败 → 重试 → 修正后通过 → STOP_DONE（用掉 1 次重试，预算内收敛）。
//   场景 B：worker 卡住 → 用尽重试预算仍不过 → ESCALATE（升级给人，不死循环）。
// 两个场景跑的是同一个 orchestrator、同一份验收契约，只换 worker 候选与预算。

import { orchestrate } from "./orchestrator.mjs";

function printScenario(title, result) {
  console.log(`===== ${title} =====`);
  for (const line of result.log) console.log(line);
  console.log(
    `[result] outcome=${result.outcome}  attempts=${result.attempts}  exit=${result.exit}`,
  );
  console.log("");
}

const a = await orchestrate({ scenario: "converging", retryBudget: 2 });
printScenario("场景 A：预算内收敛（fail → retry → pass → stop）", a);

const b = await orchestrate({ scenario: "stuck", retryBudget: 1 });
printScenario("场景 B：撞预算升级（fail → retry → fail → escalate）", b);

// 进程退出码：只要有场景以升级收尾，整体判为需要人接手。
const anyEscalated = [a, b].some((r) => r.outcome === "escalated");
process.exit(anyEscalated ? 2 : 0);
