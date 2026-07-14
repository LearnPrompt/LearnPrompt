# Showcase：从模糊指令到可执行项目地图

这个 Showcase 用一个最小仓库回答一个问题：指令层到底把什么变成了 Agent 能执行的东西。它保留一份可复现的前后对照——指令不足时任务跑偏、被验收拒绝；补齐可执行指令后同一验收通过。

它证明的不是某个模型更聪明，而是：只有当目标、范围、顺序、验收、冲突优先级都落到可定位的资源上时，一次执行的对错才可判定。

## 目录

```text
instruction-map/
├── repo/
│   ├── src/format-date.mjs        # 任务对象（当前保存为通过验收的版本）
│   └── test/format-date.test.mjs  # 隐藏的验收标准：YYYY-MM-DD、纯函数、不改入参
├── before/
│   ├── AGENTS.md                  # 模糊指令：只说“让日期更好读”
│   └── candidate-format-date.mjs  # 顺着模糊指令写出的候选实现
├── after/
│   ├── AGENTS.md                  # 可执行指令：目标/范围/顺序/验收/冲突优先级
│   └── candidate-format-date.mjs  # 顺着可执行指令写出的候选实现
├── scripts/
│   └── verify-instruction-map.mjs # 确定性检查器：五个维度是否可执行
└── result.txt                     # 冻结的真实运行输出（已脱敏）
```

## 环境

- macOS，Node v24.11.0，无网络依赖。
- 所有命令都在本目录内以相对路径运行。

## 复现步骤

```bash
# A. 确定性检查：一份指令能否被解析成可执行项目地图
node scripts/verify-instruction-map.mjs before/AGENTS.md   # 期望 0/5，退出码 1
node scripts/verify-instruction-map.mjs after/AGENTS.md    # 期望 5/5，退出码 0

# B. 模糊指令导向的候选实现跑同一份验收
cp before/candidate-format-date.mjs repo/src/format-date.mjs
(cd repo && node --test)                                   # 期望 3 条里挂 2 条

# C. 可执行指令导向的候选实现跑同一份验收
cp after/candidate-format-date.mjs repo/src/format-date.mjs
(cd repo && node --test)                                   # 期望 3 条全过
```

## 2026-07-11 的真实结果

- 检查器：`before/AGENTS.md` 得 0/5，`after/AGENTS.md` 得 5/5。
- 验收：模糊指令导向的实现返回 `Sat, 11 Jul 2026`，被 `2026-07-11` 的断言拒绝，3 条挂 2 条；可执行指令导向的实现 3 条全过。

完整脱敏输出见 `result.txt`。

## 它证明了什么

- 指令层的产物是一张能落到真实文件、命令和判定上的项目地图，而不是形容词。
- “让日期更好读”这类模糊目标会和隐藏的机器验收冲突；补上冲突优先级（以测试为准）后，同一次执行才有确定的对错。
- 验收命令写进指令，才能把“我觉得做完了”换成“三条用例全过”。

## 它没有证明什么

- 检查器只判断五个维度是否可定位，不判断内容设计得是否明智；一份 5/5 的指令仍可能把目标写错。
- 两个候选实现由作者手写，用来代表“模糊 vs 精确指令各自会把人导向哪里”。可复现、确定的部分是验收 harness（`node --test`）和它的真实输出。本 Showcase 未运行在线大模型，因此不构成任何模型排名。
- 一次验收通过不等于真实任务长期可靠；范围、约束的真正强制要落到沙箱、权限与 CI，而不是指令措辞。
