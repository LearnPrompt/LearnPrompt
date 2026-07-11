# 纵向研究：从“说了不要”到“真的拦住”

核心问题：一条“不要做什么”，怎么从软提醒变成执行前判定或执行时拦截？逐层向下追。标注【事实】【实测】【综合】。

## 现象层：软约束经常失效

【事实】把“不要碰密钥”“不要 push”写进 CLAUDE.md/AGENTS.md，是把边界当成对模型的礼貌请求。Claude Code 官方把 CLAUDE.md/记忆定位为上下文而非强制配置；AGENTS.md 也是自定义指令，不是权限。

【实测】Showcase 阶段 1：AGENTS.md 明文写“不要动 config/”，但一条普通 shell `echo TAMPERED >> config/app.env` 直接把禁止文件改了，退出码 0。文字没有任何拦截点。这说明软约束有两个问题：可被无视，且无法验证（你事后才发现文件被改）。

## 机制层：约束落到哪里才算硬边界

约束层的产物必须接到执行路径上的某个判定点。可用的强制机制有两类，分属不同产品，不能混为一谈。

### A. 执行前判定（决策层）

【事实】Claude Code 用 `permissions` 做规则判定：`deny`/`ask`/`allow` 三类，优先级 `deny > ask > allow`，`deny` 命中即拦。规则形如 `Read(./.env)`、`Bash(rm -rf *)`。这是在工具调用发生前，由工具层决定放不放行。

【事实】更灵活的执行前判定是 `PreToolUse` 钩子：它在工具调用执行前触发，可返回 `hookSpecificOutput.permissionDecision: "deny"`（配 `permissionDecisionReason`），或用退出码 2 阻断该次调用。逻辑由你写，判定是确定性的。

【实测】Showcase 阶段 2：`policy-gate.mjs` 把这套“执行前判定”的形状做成最小模型——读 policy（deny 路径/命令、allow 白名单），对五个候选动作判定，合法写/读 ALLOW，禁止写与 `git push`、`rm -rf` DENY，`2/5 allowed, 3 denied`，退出码 2（对应 PreToolUse 的 exit 2）。判定发生在任何动作执行之前。

### B. 执行时拦截（沙箱层）

【事实】Codex 用 `sandbox_mode` 做操作系统级隔离：`read-only`（禁写禁网）、`workspace-write`（可写工作区加 `/tmp`、`$TMPDIR`，默认禁网）、`danger-full-access`。这不是让模型判断，而是让内核/seatbelt 在系统调用层拦。`approval_policy` 支持 untrusted/on-request/never 字符串或 granular 对象，决定哪些类别的批准提示可以出现；它与沙箱是正交配置轴。

【实测】Showcase 阶段 3：`codex sandbox` 默认 read-only（macOS seatbelt），写文件被拒 `Operation not permitted` 退出 1，读文件退出 0，被拒的文件从未创建。这是不依赖模型自觉的硬边界。

【实测】另一处验证：`workspace-write` 下写 `$TMPDIR` 里的路径也成功——正好印证官方“workspace-write 默认把 `$TMPDIR` 设为可写根”。这提醒“写到 /tmp 就算越界所以会被拦”是错的，边界的实际范围要以配置和实测为准，不能凭直觉。

## 分工层：约束层与其他四层的边界

【综合】约束层只回答“什么绝对不能做”，把它和相邻层分清，才不会把问题塞错地方：

- 指令层（instruction-layer）回答“应该怎样工作”。把“不要碰密钥”写进指令只是软提醒，真正拦住要靠 deny 规则、钩子或沙箱。
- 能力层回答“实际能做什么”。少给一个高风险工具，从源头缩小失败半径；约束是在已给的能力上再设边界。
- 状态层回答“下一轮记住什么”。被拒的动作、拒绝原因应留证据，供审计与恢复。
- 编排层回答“谁验收、失败回哪步、何时停”。审批（approval）到人就是编排与约束的交界。

## 失败模式与边界

【综合】

- 只写软提醒，不设判定点：最常见，Showcase 阶段 1 即是。
- 把不同产品术语当成一套：以为 Claude Code 的 `deny` 等于 Codex 的 `read-only`，其实一个是决策层规则、一个是 OS 沙箱。混用会写出错误的配置。
- 以为声明即强制：JSON/TOML 里写了 deny，只有执行器真的读取并强制它才成立；`policy-gate.mjs` 若没被调用，禁止动作照样执行。
- 边界范围凭直觉：workspace-write 可写 `$TMPDIR` 就是反直觉的一例；不实测就可能把敏感目录暴露。
- 策略本身写错：白名单太宽、deny 漏一类路径，判定通过也不代表安全。约束要和能力、状态、编排一起审计。

## 什么时候不该用约束层解决

【综合】

- 问题是工具缺失或路径不可写：那是能力层，加 deny 规则无用。
- 你要的是“记住上次被拒了什么”：那是状态层。
- 你要的是“失败后升级给人”：那是编排层的 stop/approval 设计，约束只提供触发点。
- 需求本身合法且必要：不该用 deny 一刀切，而应缩小到精确的路径/命令白名单，放行合法动作。
