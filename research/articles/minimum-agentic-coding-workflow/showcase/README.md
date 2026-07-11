# Showcase：在一个最小受控任务上跑完整四步

本 Showcase 演示文章的中心决定：把一次真实的小改动跑成 Plan → Patch → Verify → Learn 闭环，
而不是只展示提示词。任务是一个纯本地、无第三方依赖、结果确定的函数：
`splitEvenly(totalCents, people)`——把账单按人数拆成整数分，要求各份之和严格等于总额。

## 任务为什么选它

- 纯标准库（`node:test` + `node:assert`），任何较新的 Node 都能复现，不依赖网络或账号。
- 有一个天然的边界：向下取整或四舍五入都会漏掉余数，于是 Verify 步能抓到一个真实的、可打印的失败。
- 改动足够小，能把「一次 patch 只承载一个决定」演示清楚。

## 目录

```text
showcase/
├── plan.md                    # 第一步 Plan：文件范围、禁区、最快检查、回滚
├── split-bill.test.mjs        # 验收测试（Verify 的最快检查，含守恒断言）
├── slice-1-naive/
│   └── split-bill.mjs         # 第二步 Patch·切片一：只做均分，故意不处理余数
├── slice-2-fixed/
│   └── split-bill.mjs         # 第二步 Patch·切片二：补余数，守恒
├── patch-01-slice.diff        # 切片一的 git diff（+3 / −2）
├── patch-02-fix.diff          # 切片二相对切片一的连续增量 diff
├── AGENTS.before.md           # 第四步 Learn 之前的项目规则
├── AGENTS.after.md            # 写回复盘规则之后
├── learn-agents.diff          # Learn 写回 AGENTS.md 的 before/after diff
└── results/
    ├── result-verify-01-fail.txt     # 切片一：node --test 退出码 1（sum 9999≠10000）
    └── result-verify-02-pass.txt     # 切片二：node --test 退出码 0，3 个测试全绿
```

## 四步对应

- Plan：`plan.md`。约束只有四条——只改 `split-bill.mjs`、不改测试、最快检查是 `node --test`、未提交前用 `git restore` 回滚。
- Patch：切片一（`slice-1-naive/`）只做均分这一个决定，`patch-01-slice.diff` 是 +3/−2 的可读改动。
- Verify：`results/result-verify-01-fail.txt` 是真实运行结果，退出码 1，断言直接打印 `sum(3333,3333,3333) 应为 10000，实际 9999`。这是环境给的事实，不是模型自述。
- Learn：把「金额拆分先写求和守恒断言、余数单独切一片」写回 `AGENTS.md`（`learn-agents.diff`）。`patch-02-fix.diff` 保存切片二相对切片一的连续增量，切片二（`slice-2-fixed/`）据此补余数，`results/result-verify-02-pass.txt` 退出码 0。

## 复现步骤

```bash
cd research/articles/minimum-agentic-coding-workflow/showcase

# 复现 Verify 的边界失败（切片一）
cp slice-1-naive/split-bill.mjs ./split-bill.mjs
node --test        # 期望退出码 1，守恒断言失败

# 复现修复后的通过（切片二）
cp slice-2-fixed/split-bill.mjs ./split-bill.mjs
node --test        # 期望退出码 0，3 个测试全绿

# 清理临时拷贝
rm -f split-bill.mjs
```

## 环境

- Node.js v24.11.0（脚本只用标准库，任意支持 `node --test` 的较新 Node 均可）。
- 核验日期：2026-07-11。

## 复现限制与脱敏

- 原始运行在仓库外的临时目录完成（`git init` 的独立 repo），原始未脱敏日志只留在仓库外，未纳入研究包。
- 进入研究包的是脱敏冻结的最小证据：`results/*.txt` 里的绝对临时路径已替换为 `<workdir>`，退出码在文件头标注。
- 本 Showcase 证明的是「四步循环在一次真实改动上如何展开」，不是账单算法的通用最优解；`splitEvenly` 的守恒策略只是承载四步的载体。
- 站点构建 `cd starlight && npm run build` 单独验证，不在本目录内。
