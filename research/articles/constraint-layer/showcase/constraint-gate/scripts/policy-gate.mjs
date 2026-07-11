#!/usr/bin/env node
// 确定性约束闸门：在动作执行之前做 allow/deny 判定。
// 这不是任何产品本身，而是把 Claude Code 的 deny 规则与 PreToolUse 钩子的
// “执行前拒绝” 形状做成一个可复现的最小模型：读策略、判定动作、给退出码。
// DENY 时以退出码 2 退出，对应 PreToolUse 钩子用 exit 2 阻断一次工具调用。
import { readFileSync } from "node:fs";

const [, , policyFile, actionsFile] = process.argv;
if (!policyFile || !actionsFile) {
  console.error("usage: policy-gate.mjs <policy.json> <actions.json>");
  process.exit(64);
}

const policy = JSON.parse(readFileSync(policyFile, "utf8"));
const actions = JSON.parse(readFileSync(actionsFile, "utf8"));

const matchPath = (path, patterns) =>
  patterns.some((p) => {
    const re = new RegExp("^" + p.replace(/[.]/g, "\\.").replace(/\*/g, ".*") + "$");
    return re.test(path);
  });
const matchCommand = (cmd, patterns) =>
  patterns.some((p) => new RegExp(p).test(cmd));

function decide(action) {
  if (action.type === "run") {
    if (matchCommand(action.command, policy.denyCommands ?? [])) {
      return { decision: "DENY", reason: `命令命中 deny 规则：${action.command}` };
    }
    return { decision: "ALLOW", reason: "命令未命中任何 deny 规则" };
  }
  if (action.type === "write") {
    if (matchPath(action.path, policy.denyPaths ?? [])) {
      return { decision: "DENY", reason: `写入路径命中 deny 规则：${action.path}` };
    }
    if (matchPath(action.path, policy.allowWritePaths ?? [])) {
      return { decision: "ALLOW", reason: `写入路径在 allow 白名单内：${action.path}` };
    }
    return { decision: "DENY", reason: `写入路径不在 allow 白名单内：${action.path}` };
  }
  if (action.type === "read") {
    if (matchPath(action.path, policy.denyPaths ?? [])) {
      return { decision: "DENY", reason: `读取路径命中 deny 规则：${action.path}` };
    }
    return { decision: "ALLOW", reason: `读取未受限：${action.path}` };
  }
  return { decision: "DENY", reason: `未知动作类型：${action.type}` };
}

let denied = 0;
for (const action of actions) {
  const { decision, reason } = decide(action);
  if (decision === "DENY") denied += 1;
  console.log(`${decision.padEnd(5)} ${action.label} — ${reason}`);
}
console.log(`summary: ${actions.length - denied}/${actions.length} allowed, ${denied} denied`);
// 只要有一个禁止动作被放行，闸门就没有尽到边界职责；这里用退出码把结果变成可判定信号。
process.exit(denied > 0 ? 2 : 0);
