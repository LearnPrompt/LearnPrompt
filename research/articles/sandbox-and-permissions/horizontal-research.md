# Horizontal research：一手事实、主题地图与教学校准

## 结论先行

这篇教程的事实层不能只靠旧 Orange Book，因为 2026-07 的 Codex 已经同时存在两套权限表面：

1. 交互 CLI 里仍可见旧的 `--sandbox read-only|workspace-write|danger-full-access` 与 `--ask-for-approval ...`。
2. 官方 `Permissions` 页面又引入了 Beta 的 permission profiles：`default_permissions`、`[permissions.<name>]`、`--permissions-profile`。
3. 如果讨论 managed rollout，还要额外把 `allowed_permission_profiles` 这层企业要求例外单独拎出来。

如果不把这两套表面明确拆开，正文很容易把“审批提示”“prompt 规则”“OS 沙箱”“profile deny”写成同一层，最终误导读者把“少提问”理解成“权限更大”。

## 来源对照

| 来源 | 类型 | 能证明什么 | 不能证明什么 |
| --- | --- | --- | --- |
| [Sandbox](https://learn.chatgpt.com/docs/sandboxing) | 官方一手文档 | 旧 sandbox settings 的三档模式、默认网络关闭、`danger-full-access` 移除本地边界 | 不能证明自定义 profile 语法，也不能证明本机某个 deny 文本长什么样 |
| [Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security) | 官方一手文档 | Codex 把“OS 沙箱”和“approval policy”并列说明，常见组合里两者职责不同 | 不能用来推断 `**/*.env` deny 的具体配置写法 |
| [Permissions](https://learn.chatgpt.com/docs/permissions) | 官方一手文档 | permission profiles 是 Beta；内置 `:read-only` / `:workspace` / `:danger-full-access`；对普通本地非 managed 配置，不与旧 sandbox settings 组合；`:workspace` 包含系统 temp 目录 | 不能替代 live probe，也不能说明本机 zsh/Seatbelt 的报错文本 |
| [Managed configuration](https://learn.chatgpt.com/docs/enterprise/managed-configuration) | 官方一手文档 | `allowed_permission_profiles` 是 permission profiles 在企业要求层的官方入口，也是本文“managed 例外”措辞的来源 | 本文不演示 requirements.toml 部署，也不讨论混合版本 fleet |
| [Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference) | 官方一手文档 | `approval_policy` 枚举、`default_permissions`、`extends`、`glob_scan_max_depth`、`**/*.env = "deny"` 语义 | 不能证明读者自己的 profile 就一定合理 |
| `codex --help`（0.142.2） | 本机一手帮助 | 交互 CLI 公开旗标仍有 `--sandbox`、`--ask-for-approval`，并列出 `untrusted` / `on-request` / `never` | 不能证明 OS 沙箱一定会放行或拒绝某个具体路径 |
| `codex sandbox --help`（0.142.2） | 本机一手帮助 | `codex sandbox` 支持 `--permissions-profile <NAME>`，适合做无模型确定性实验 | 不能单独解释 approval 行为 |
| [alchaincyf/codex-orange-book](https://github.com/alchaincyf/codex-orange-book) | 二手主题地图 | 适合作为旧稿线索与中文主题导航，提醒本文要回答“沙箱、权限、风险”这些用户问题 | 不能当 2026-07 事实层权威，不能证明当前 CLI 或官方术语 |

## 对教学结构的影响

- 正文必须先拆“能碰什么”和“何时停下来问”，再讲 built-in / custom profile。
- Showcase 不能用交互式 agent 执行，否则 approval、prompt、模型决策会掺进来；应直接使用 `codex sandbox` 子命令做无模型 probe。
- “旧设置抢优先级”这句话必须收窄到普通本地非 managed 配置；managed `allowed_permission_profiles` 只点出例外，不把企业 rollout 混进本教程主线。
- `danger-full-access` 只能用官方文档与风险说明解释，不做越界写“实证演示”，否则实验本身就变成了真实放权。

## 校准参考

- 站内最近的相关黄金样稿是 `research/articles/plan-auto-approval-boundary/`：它解决“自动执行与人工审批”的教学表达问题，但没有覆盖 permission profiles 的 Beta 事实层和 `**/*.env deny` 实测。
- 本文因此需要把权限模型再下钻一层，补上“审批不是沙箱、规则不是 OS 边界”的解释。
