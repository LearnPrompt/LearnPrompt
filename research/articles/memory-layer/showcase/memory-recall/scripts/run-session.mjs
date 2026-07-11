// run-session.mjs —— 模拟一个独立进程（全新上下文）跑同一个任务。
// 用法：node scripts/run-session.mjs --mode <no-memory|skip-recall|with-memory> [--today YYYY-MM-DD]
//
// 三种模式讲完整个故事：
//  no-memory   ：记忆库为空（什么都没写过）→ 直接校验 → 复现同一个报错。
//  skip-recall ：记忆库里有那条教训，但进程不去读它 → 直接校验 → 照样报错。
//                （证明记忆不等于模型自动记住：不读取+注入，教训在盘上也零作用。）
//  with-memory ：进程先召回教训 → 据此先跑 setup → 校验通过。
//
// 每种模式都是全新进程：不共享上一次的上下文，只可能共享磁盘上的记忆库。
import { execFileSync } from "node:child_process";
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "repo");
const args = process.argv.slice(2);
const mode = valueOf("--mode") ?? "no-memory";
const today = valueOf("--today") ?? "2026-07-11";

function valueOf(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}
function run(cmd, cmdArgs, cwd) {
  try {
    const out = execFileSync(cmd, cmdArgs, { cwd, encoding: "utf8" });
    return { code: 0, out: out.trim() };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout ?? "").trim() };
  }
}

// 每个进程都从干净状态开始：删除上一次可能留下的 fixture 产物。
await rm(join(repo, "data", "fixture.json"), { force: true });
console.log(`--- session mode=${mode} today=${today} ---`);

let didRecall = false;
if (mode === "with-memory") {
  const recall = run("node", [join(here, "recall.mjs"), "build-token", "--today", today], here);
  console.log(recall.out);
  didRecall = recall.code === 0;
}

// 决定要不要先做前置 setup：只有真正召回到教训并据此行动时才做。
if (didRecall) {
  console.log(run("node", [join(repo, "src", "setup.mjs")], repo).out);
}

const verify = run("node", [join(repo, "src", "build-token.mjs")], repo);
console.log(verify.out);
console.log(`result: exit=${verify.code}`);
process.exit(verify.code);
