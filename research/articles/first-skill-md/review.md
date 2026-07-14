# Review：第一个 SKILL.md 怎么写

审稿日期：2026-07-11
独立审稿器：Codex CLI / `gpt-5.4` / read-only / never approval
评审证据：每轮原始评审输出均在仓库外捕获；本文件是会话结束后的脱敏定稿，不是评审中的实时日志。
隔离声明：reviewer 使用独立只读会话，writer 未参与打分或修改评审结果。

## 初审结论：FAIL（59/100）

初审发现 blocker 2 / major 2 / minor 1。除当时尚未机械收口的 PENDING 状态外，实质问题包括：官方 `quick_validate.py` 已加入 `compatibility`，稿件仍使用旧字段集合；commit 与核验日期前后不一致；错误声称脚本不检查 `description` 的尖括号；把 `description` 写成“唯一触发器”。

## 修复记录

1. 以 2026-07-11 的官方 `anthropics/skills` main HEAD `9d2f1ae` 重新核对并运行 `quick_validate.py` 与 `package_skill.py`。
2. 将字段集合更新为 name、description、license、allowed-tools、metadata、compatibility，并补充 `compatibility` 的字符串与 500 字符边界。
3. 把来源统一为 skill-creator 目录级 Apache License 2.0、同一 commit 和同一核验日期；更新冻结输出中的 kebab-case 与允许字段列表。
4. 准确限定脚本覆盖：它拒绝 `description` 尖括号，kebab-case 正则排除 `name` 尖括号，但没有单独拒绝 `anthropic` / `claude` 保留词。
5. 把“唯一触发器”改为：`name` 与 `description` 始终加载，官方以请求是否匹配 `description` 作为读取正文条件，因此 `description` 是主要匹配依据。

第一轮全新只读 follow-up 确认原有 finding 全部关闭（blocker 0 / major 0 / minor 0），但未按项目六维量表输出，因此不直接采用其满分。第二个全新只读会话重新完整校准正文、研究包、当前官方脚本、Showcase 与 SVG，给出以下终审分数。

## 视觉与内容终审结论：PASS（93/100）

Visual assessment: PASS
Asset: `/images/articles/first-skill-md/progressive-disclosure.svg`
Teaching role: 用一张原创结构图把 Skill 的三级加载、触发条件与上下文成本压缩成可直接指导分层写法的教学支架
Decorative-only: no
Rights: CC BY-NC-SA 4.0

| 维度 | 终审分数 |
| --- | ---: |
| 事实与证据 | 24/25 |
| 解释深度 | 18/20 |
| Showcase | 18/20 |
| 教学设计 | 14/15 |
| 时效性 | 10/10 |
| 编辑质量 | 9/10 |

未关闭问题：blocker 0 / major 0 / minor 0。

最终状态：PASS
