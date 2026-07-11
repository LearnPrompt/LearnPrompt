# Brief：约束层——把“不要做什么”变成可执行边界

## 问题

多数人把 Agent 的安全寄托在提示词里的“不要碰密钥”“不要 push”。但这些句子只是软提醒：模型可能无视，即使它这轮听话，你也无法验证、无法在下一次执行前拦截。旧占位稿只讲了“风险分级 + 人工确认”，没有讲清约束怎么从文字变成系统会强制执行的边界，也没有把不同产品的机制讲清楚。

## 目标读者

已经在用 Claude Code 或 Codex、写过 CLAUDE.md/AGENTS.md，但被“说了不要还是做了”坑过、想知道怎么让边界真正生效的开发者。进阶难度。

## 一句话结果

读完能把一条“不要做什么”落到路径/命令权限、执行前钩子或沙箱上，并说清它属于约束层而不是指令层。

## 核心主张

约束层回答“什么绝对不能做”，而且答案必须落到执行前判定或执行时拦截，不能停留在文字。软约束不可验证；硬边界不依赖模型自觉。

## 非目标

- 不做 Claude Code 与 Codex 的安全能力排名或“谁更强”。
- 不把 Claude Code 的 permissions/hooks 与 Codex 的 sandbox_mode/approval_policy 混成同一套术语。
- 不覆盖 Bedrock/Vertex 企业策略、MCP 服务器细粒度授权的全部细节。
- 不触碰真实密钥、不 push、不部署、不调用外部系统。

## 需要的证明

- 一手来源核对 Claude Code 权限（deny/ask/allow 优先级、规则语法、模式）与 PreToolUse 钩子（permissionDecision、exit 2）。
- 一手来源核对 Codex sandbox_mode（read-only / workspace-write / danger-full-access，可写根、网络默认关闭）与 approval_policy。
- 一个可复现 Showcase：对同一组允许/禁止动作，展示软提醒放行、确定性闸门执行前拒绝、操作系统沙箱执行时拒绝、合法动作通过。

## 验收条件

- 正文 ≥ 5000 字符，去代码后中文解释 ≥ 1800 字符，H2 ≥ 6。
- 删除 SourceCard，底部保留真实一手来源与橙皮书二手署名。
- 至少一张原创教学图（软约束→硬边界 / 多层防线），asset-ledger 许可闭环。
- Showcase 可复现，raw 日志在工作树外采集、脱敏后入库。
- partial validator 通过，starlight 构建通过（49 页）。writer 阶段保持 partial，不写 quality_score，不写 PASS。

## 与相邻文章的分工

- what-is-harness.mdx（order 1）：五组件总览，约束只是其一。
- instruction-layer.mdx（order 2）：指令层，回答“应该怎样工作”。
- 本文（order 3）：约束层，回答“什么绝对不能做”，与指令/能力/状态/编排划清边界。
