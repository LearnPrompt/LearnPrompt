# MEMORY.md — 项目记忆索引

这是记忆目录的入口索引，每次新进程启动时只读它一条（模型 auto memory 的 MEMORY.md 同理：只加载索引，细节按需再读）。一行一条，指向具体的教训文件。

- [fixture-before-verify](lessons/fixture-before-verify.md) — 校验前必须先跑 setup 生成 fixture（durable，永久有效）
- [mirror-slow-on-0711](lessons/mirror-slow-on-0711.md) — 一次性环境状态，2026-07-12 后应被淘汰（反面示范：污染）

写入纪律：只记跨会话可复用的项目事实和教训；一次性状态标 expires；绝不写入密钥、session id、绝对路径或用户私密历史。
