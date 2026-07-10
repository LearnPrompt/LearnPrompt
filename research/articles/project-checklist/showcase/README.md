# Showcase：把开工清单变成一道确定性闸门

本 Showcase 演示文章的中心决定：把“项目开工清单”从散文变成机器可校验的项目卡，
让“到底写没写清楚”从主观判断变成退出码。

## 目录

```text
showcase/
├── verify-checklist.mjs          # 校验脚本，无第三方依赖
├── checklist/
│   ├── AGENTS.md                 # 人读版开工清单（六节）
│   ├── project-card.yaml         # 机器读版：完整，应通过
│   └── project-card-incomplete.yaml  # 机器读版：缺项，应被拦截
└── results/
    └── verify-output.txt         # 脱敏冻结的真实运行结果
```

## 复现步骤

```bash
cd research/articles/project-checklist/showcase
node verify-checklist.mjs checklist/project-card.yaml            # 期望退出码 0
node verify-checklist.mjs checklist/project-card-incomplete.yaml # 期望退出码 1
```

## 环境

- Node.js v24.11.0（脚本只用标准库，任意较新 Node 均可）。
- 核验日期：2026-07-11。

## 复现限制

- 校验的是清单结构完整度，不校验清单内容是否与真实仓库一致。
- 验收命令是否真的通过，需要在目标仓库另跑一次（本文用 `cd starlight && npm run build` 单独验证站点构建）。
- 原始未脱敏日志只留在仓库外的临时目录，未纳入研究包。
