# 计划（Plan）

- 目标：实现 splitEvenly，使 node --test 全绿。
- 文件范围：只改 split-bill.mjs。
- 禁区：不改 split-bill.test.mjs（验收标准），不动 AGENTS.md 的检查命令。
- 最快检查：node --test
- 最小切片：先实现整除与基本均分，一次只提交一个可读 diff。
- 回滚：未提交前用 git restore split-bill.mjs 退回。
