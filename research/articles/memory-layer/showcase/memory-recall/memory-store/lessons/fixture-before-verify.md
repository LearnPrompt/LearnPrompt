---
name: fixture-before-verify
scope: this-repo
trigger: [build-token, verify, fixture]
verified_at: "2026-07-11"
expires: "never"
kind: durable-lesson
---

事实：跑 `node src/build-token.mjs` 之前必须先跑 `node src/setup.mjs`。

为什么：`data/fixture.json` 是 setup 生成的产物，已写进 `.gitignore`、不入库；全新克隆或全新进程里默认不存在，直接校验必然报 `缺少 data/fixture.json`。

怎么用：在任何一次校验前，先执行 `node src/setup.mjs` 生成 fixture，再跑 build-token。这条属于项目事实，跨会话有效，不随某一天的环境变化。

证据指针：showcase/memory-recall/result.txt 阶段 1（无记忆时的真实报错）。
