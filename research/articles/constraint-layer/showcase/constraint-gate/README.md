# Showcase：把“不要做什么”从软提醒变成可执行边界

这个 Showcase 用一个最小仓库回答一个问题：对同一组允许/禁止动作，三种约束方式各自能不能真正拦住禁止动作。它保留一份可复现的三段对照——软提醒放行、确定性闸门执行前拒绝、操作系统沙箱在执行时拒绝。

它证明的不是某个模型更聪明，而是：只有当约束落到执行前的判定或执行时的沙箱上，禁止动作才会被真正拦下；写在文档里的“不要”只是意图声明。

## 同一组动作

`repo/actions.json` 定义了五个候选动作，允许与禁止混在一起：

- 合法：写 `docs/notes.md`、读 `tracked.txt`。
- 禁止：改 `config/app.env`（占位配置，非真实密钥）、`git push origin main`、`rm -rf build`。

三个阶段面对的是同一组动作，只是换了约束的强制方式。

## 目录

```text
constraint-gate/
├── repo/
│   ├── AGENTS.md        # 软约束：只有文字提醒，不构成强制
│   ├── policy.json      # deny 路径 / deny 命令 / allow 写白名单
│   ├── actions.json     # 五个候选动作（允许 + 禁止混合）
│   ├── config/app.env   # 禁止修改的占位配置（无真实密钥）
│   ├── docs/notes.md    # 允许写入的目标
│   └── tracked.txt      # 允许读取的目标
├── scripts/
│   └── policy-gate.mjs  # 确定性闸门：执行前 allow/deny 判定
└── result.txt           # 冻结的真实运行输出（已脱敏）
```

## 环境

- macOS 26.5.1，codex-cli 0.142.2，Node v24.11.0，无网络依赖。
- 全程不触碰真实密钥，不 push、不部署、不调用外部系统。禁止命令只被判定，从不执行。

## 复现步骤

```bash
cd repo

# 阶段 1：软提醒——直接执行禁止写入，观察文字提醒是否拦得住
sh -c 'echo TAMPERED >> config/app.env'   # 预期：写入成功，禁止文件被改
printf '# 占位配置，非真实密钥\nAPI_KEY=YOUR_KEY_HERE\n' > config/app.env  # 复原

# 阶段 2：确定性闸门——执行前对五个动作做 allow/deny 判定
node ../scripts/policy-gate.mjs policy.json actions.json   # 预期：2/5 allowed，退出码 2

# 阶段 3：操作系统沙箱——read-only 沙箱内写/读
codex sandbox -c sandbox_mode='"read-only"' -- sh -c 'echo hi > sandbox-blocked.txt'  # 预期：拒绝，exit 1
codex sandbox -c sandbox_mode='"read-only"' -- cat tracked.txt                        # 预期：放行，exit 0
```

## 2026-07-11 的真实结果

- 阶段 1：无闸门时禁止写入成功，`config/app.env` 尾部被追加 `TAMPERED`。软约束不可验证、可被无视。
- 阶段 2：闸门对同一组动作给出 `2/5 allowed, 3 denied`，退出码 2；合法写/读 ALLOW，禁止写与禁止命令 DENY，判定发生在执行之前。
- 阶段 3：read-only 沙箱把写入直接拒绝（`Operation not permitted`，exit 1），读取放行（exit 0），`sandbox-blocked.txt` 从未被创建。

完整脱敏输出见 `result.txt`。

## 它证明了什么

- 同一句“不要碰配置、不要 push”，写在 AGENTS.md 里拦不住，落到 deny 判定或沙箱里才拦得住。
- 约束可以做成执行前判定（闸门给退出码 2，对应 PreToolUse 钩子的 exit 2）或执行时拦截（沙箱），两者都不依赖模型自觉。
- 合法动作在硬边界下照常通过，说明边界收紧的是禁止动作，不是把 Agent 一并锁死。

## 它没有证明什么

- `policy-gate.mjs` 是把 Claude Code 的 deny 规则与 PreToolUse 执行前拒绝的“形状”做成的最小可复现模型，不是这些产品本身；真实产品的匹配语义、作用域合并与优先级以官方文档为准。
- 阶段 3 的 seatbelt 是 macOS 特有实现，Linux/容器下的沙箱后端不同；这里演示的是 Codex `sandbox_mode` 的行为，不代表所有平台细节一致。
- 一次判定/拦截通过不等于策略设计正确：白名单写宽了、deny 漏了一类路径，闸门照样放行。约束层要和能力、状态、编排一起审计，不能只看单点。
