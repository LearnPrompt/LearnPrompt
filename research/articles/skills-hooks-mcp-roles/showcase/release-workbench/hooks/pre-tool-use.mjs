#!/usr/bin/env node
// PreToolUse hook：在“工具即将执行”这个事件时点做拦截判断。
// 从 stdin 读取 Claude Code 传入的 JSON 事件，只对 Bash 工具生效：
//   - 命令里出现 `git push`  -> 返回 permissionDecision: "deny"，阻止这次调用。
//   - 命令里出现 `npm test`  -> 静默退出（无输出、exit 0），把决定权交回正常权限流程。
//     注意：静默 != 预先批准；它只是“本 hook 不表态”。
// 参考事件/输出结构：https://code.claude.com/docs/en/hooks

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  let event;
  try {
    event = JSON.parse(raw || "{}");
  } catch {
    // 输入不是合法 JSON：不表态，交回正常流程。
    process.exit(0);
  }

  const toolName = event.tool_name ?? "";
  const command = event?.tool_input?.command ?? "";

  if (toolName !== "Bash") {
    process.exit(0); // 只关心 Bash，其它工具不表态。
  }

  if (/\bgit\s+push\b/.test(command)) {
    const out = {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason:
          "release-workbench 策略：git push 属于对外发布动作，必须人工执行，hook 直接拒绝。",
      },
    };
    process.stdout.write(JSON.stringify(out) + "\n");
    process.exit(0);
  }

  if (/\bnpm\s+test\b/.test(command)) {
    // 安全命令：本 hook 不做决定，静默交回正常权限流程。
    process.exit(0);
  }

  // 其它命令：同样不表态。
  process.exit(0);
});
