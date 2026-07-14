# Vertical research：为什么触发边界和目录分层要一起设计

## 1. 触发边界首先是 metadata 问题

无论是 Codex 还是 Claude Code，隐式调用的第一道门都不是 `Workflow` 小节，而是一个更短的 listing：

- Codex 会把 skills 列表放进初始上下文，靠 `description` 匹配任务，再决定是否读取完整 `SKILL.md`。
- Claude Code 默认也先把技能描述放进上下文，再按描述决定是否自动加载正文。

这意味着“正文里写得很清楚”并不能拯救“路由入口很含混”。路由阶段根本没看见你的长正文。

## 2. broad 与 bounded 的差别，本质是 FP / FN 的权衡

对同一个 `release-weekly` Skill：

- broad description 往往覆盖太多相邻词，例如 release、update、weekly、summary、notes，全都放进去时，正例命中率可能上升，但 single-note copyedit 和 generic weekly report 也更容易被误收。
- bounded description 把核心任务前置，例如“多版本 release notes -> 中文 weekly digest”，并明确排除单条措辞审校、会议纪要、团队周报。它的目标不是“更像人写的说明”，而是降低 FP。

因此评估边界不能只看“有无命中”，而要同时看：

- broad 的 FP 是否显著更高；
- bounded 是否把 FP 压下去；
- bounded 是否顺手带来了新的 FN。

## 3. 近邻反例比无关反例更能暴露问题

无关反例当然要测，但更有价值的是近邻反例，例如：

- “审校一条 release note 的措辞，不生成周报”

它与正例共享 release note 语境，却不是同一个任务。如果一个 Skill 连这种边界都划不清，说明 description 没把“工作对象”和“目标产出”绑在一起，只写了主题词。

## 4. 目录分层是在配合渐进披露

开放规范允许 `scripts/`、`references/`、`assets/` 作为按需加载层。把它们拆开，不是为了看着专业，而是为了配合三个加载阶段：

1. metadata：`name` / `description`，负责发现；
2. 正文：短流程、判断顺序、资源索引；
3. 资源：只有命中后才需要的合同、模板、脚本和例外。

如果把完整边界、模板和脚本说明都留在 `SKILL.md` 正文，实际后果有三个：

- description 更容易被“写短一点”这件事掩盖；
- 正文变长后，触发与执行逻辑更难分离；
- 出问题时你不知道该改 metadata、正文还是资源。

## 5. 显式调用与隐式匹配是两条不同的验收线

显式调用证明：

- `SKILL.md` 正文没有语法或路径问题；
- references / scripts / assets 可以被正文正确引用；
- canary 能经由正文出现在最终输出里。

隐式匹配证明：

- metadata 的关键词、任务边界和否定条件足够清楚；
- listing 预算没有把关键触发词截掉；
- 没有更近的邻居 Skill 抢路由。

二者互相补充，但谁也不能替代谁。

## 6. writer 阻塞之后，外层补跑得到了什么

writer 环境里做了三次嵌套 Codex preflight：

1. 第一次直接用了错误参数，`codex exec` 真实返回“unexpected argument '-a'”，说明 `codex exec` 与顶层 `codex` 的参数面不同。
2. 第二次在默认宿主目录下运行，真实命中 `state_5.sqlite` 只读与 app-server 初始化权限错误。
3. 第三次把 `CODEX_HOME` 挪到临时可写目录，仍真实卡在 `api.openai.com` 解析失败。

这组失败说明 writer sandbox 里无法完成真正的隐式调用实验。主控随后保持实验环境、fixture、prompt、共享 ground truth 和 evaluator 不变，从外层固定 `gpt-5.5` 补跑九个 fresh ephemeral sessions。broad 与 bounded 都得到 TP 2 / FP 0 / FN 0 / TN 2，显式 bounded 控制组 loaded=true。

这次结果没有复现 broad 比 bounded 更多的误触发。它只能说明本次四请求单次运行里两版表现相同，不能证明 description 边界无关，也不能证明未来运行稳定为 100%。因此文章把“宽描述可能提高 FP”保留为待扩大样本验证的机制假设，而不把它伪装成本轮结论。当前 partial 只因独立只读 reviewer 尚未执行。
