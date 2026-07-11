# Vertical research：从“别总问我”一直追到 OS 沙箱边界

## 中心问题

为什么很多人会把“让 Codex 少停下来问”和“让 Codex 获得更多本地权限”混成一件事？

因为在交互界面里，这两件事常常同时出现在同一组设置附近：一个是 sandbox/full access 之类的词，一个是 ask for approval 之类的词。用户看到的都是“权限”，但底层控制点并不一样。

## 机制拆解

### 1. permission profile 或 sandbox mode 决定命令的物理可达范围

这层是 OS 级边界。命令最终能否读一个文件、写一个路径、访问一个主机，不取决于模型有没有“克制”，而取决于本地执行环境是否真的允许。

最关键的理解是：

- 允许提问，不等于允许写入。
- 不再提问，也不等于允许越界。
- 即使 agent 认为某个命令“应该执行”，如果 profile deny，命令仍会直接得到 `Operation not permitted`。

这正是本文 Showcase 采用 `codex sandbox` 的原因：它绕开模型，把问题缩到最小，只看 OS 约束。

### 2. approval policy 决定 agent 什么时候停下来向人升级

这一层不是物理边界，而是会话流程控制：

- `untrusted`：已知安全的读取动作自动跑，可能改状态或触发外部执行路径的动作要问。
- `on-request`：由模型判断是否要停下来问。
- `never`：不问，失败直接返回给模型或调用方。

因此 `never` 的真实含义是“不要弹人工确认”，不是“绕过 deny”。本文 probe 全部把 `approval_policy = "never"` 固定下来，正是为了让实验没有交互分叉，但结果仍由 sandbox/profile 决定。

### 3. prompt 规则与 prefix rules 也不是 OS 沙箱

Config reference 里的 `rules.prefix_rules[].decision = prompt|forbidden`，作用是：

- 让某些命令前缀触发提示；
- 或者直接禁止某类命令。

它们可以增加一道治理层，但不能把原本无权读取的 `.env` 变成可读，也不能把原本可写工作区内的 `docs/link.md` 自动改成只读。规则是“该不该放行这次尝试”，OS 沙箱是“就算放行，底层到底能不能碰到资源”。

### 4. `:workspace` 的边界比“仓库目录”更宽

这是本次写作里最容易踩坑、也最值得教给读者的点。官方 `Permissions` 页面明确写到，内置 `:workspace` 允许写：

- 当前 active workspace roots；
- system temp directories。

这意味着如果你把“工作区外 sentinel”也摆在 `/tmp` 或 macOS 的 `TMPDIR` 里，你以为自己在测越界写，实际上还在 profile 的允许范围内。我的第一轮实验正好踩到这个坑，因此正式 Showcase 把实验室放在家目录里，而原始日志仍放在 `os.tmpdir()`。

### 5. “旧设置抢优先级”要限定在普通本地非 managed 配置

官方 `Permissions` 文档的精确说法是：如果任一已加载 config、选中的 config profile 或 CLI `--sandbox` 仍设置旧 `sandbox_mode`，Codex 就会继续走旧 sandbox settings，而不是 `default_permissions`。这句话适合直接教给普通本地用户。

但同一页也给了一个官方例外：managed `allowed_permission_profiles` 会把 Codex 切到 permission profiles 体系，用于企业要求层。本文只点出这个例外，避免把本地最小权限教程和 managed rollout 搅在一起。

### 6. `danger-full-access` 的真正风险

官方文档对这点讲得很直接：它移除本地 sandbox restriction，也就是本地文件系统和网络边界。它不是“更方便的 workspace 模式”，而是“本地命令不再受这层 OS 沙箱保护”。

因此它的适用前提应该来自控制面，而不是来自“模型看起来挺靠谱”：

- 环境本身必须可丢弃，或者已经被外层容器/VM 隔离；
- 任务目标、允许路径与回滚手段都已经冻结；
- 不可逆动作另有人为 gate；
- 结果必须通过 diff、日志、构建或 reviewer 留证。

## 编辑综合判断

用户真正想学会的，不是记住三个模式名，而是建立下面这条判断顺序：

1. 任务的风险半径是什么？
2. 需要让本地命令物理上碰到哪些路径和网络？
3. 哪些动作还需要人批准？
4. 失败时我期待看到“被问住”还是“被 OS 直接拦下”？

只有按这个顺序思考，最小权限才会成为默认值。
