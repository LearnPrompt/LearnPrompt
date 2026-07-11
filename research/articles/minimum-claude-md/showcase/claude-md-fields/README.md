# Showcase：把「空泛项目说明」和「最小 CLAUDE.md」放进同一个机械验收

这个 Showcase 用一个具体的最小项目（一个 Markdown 转 HTML 的小工具），
把两份文件放进同一套机械检查，回答文章的核心问题：

> 一份能真正减少重复失败的 CLAUDE.md，和一段空泛的项目说明，差别在哪五类信息？

## 目录

```text
claude-md-fields/
├── README.md               # 本文件
├── check-claude-md.mjs     # 五类必要信息的字段完整度检查器（确定性）
├── vague-notes/CLAUDE.md   # 空泛项目说明 → 五类全缺 → 退出码 1
├── minimal/CLAUDE.md       # 最小 CLAUDE.md → 五类齐全 → 退出码 0
├── result.txt             # fail→pass 实测输出与退出码
└── live-read-only-check.md # control-verification：真实只读会话确认文件被读到（在线模型，已披露）
```

## 五类必要信息

检查器逐条验证下面五类信息是否存在且足够具体：

1. 真实命令：出现项目真实可执行命令，而不是「运行测试」这类空话。
2. 允许修改范围：说明先报计划、只改计划内文件。
3. 禁区：点名不能碰的真实路径（如 `.env`、`secrets/`、部署配置）。
4. 最快验收：指定改完后跑哪个最快命令来验收。
5. 输出收尾：要求结尾汇报改动文件、验证命令与剩余风险。

## 复现步骤

前置：Node.js（用于运行检查器）。

```bash
cd claude-md-fields
node check-claude-md.mjs vague-notes/CLAUDE.md   # 预期 5 FAIL，退出码 1
node check-claude-md.mjs minimal/CLAUDE.md       # 预期 5 PASS，退出码 0
```

`result.txt` 保存了 2026-07-11 的实际输出与退出码。

## 这是什么，不是什么

- 这是字段完整度静态检查：它验证文件里是否写齐了五类信息，写得是否具体。
- 这不是模型遵循度实验：它不运行模型，不能证明 Claude 会不会照做。
  这一点很关键——不要把静态 linter 说成「模型遵循度实验」。
- 想确认 CLAUDE.md 是否真的被读进上下文，另做了一次 control-verification：
  受控的真实只读会话，见 `live-read-only-check.md`（在线模型，单次运行，已按要求披露局限）。

## 局限

- 检查器用关键词和路径信号做启发式判断，可能把写得很具体但用词特殊的文件误判，
  也可能被「形式齐全但内容空洞」的文件骗过。它是把关下限，不是质量保证。
- 五类齐全不代表每条规则都正确，也不代表模型长期遵守。官方文档明确 CLAUDE.md 是
  context 而非 enforced configuration；硬约束要用 PreToolUse hook 或 managed settings。
