# slugify fixture

这是一个一次性 bug 仓库，用来演示两阶段 handoff 流程。

- 目标函数：`src/slugify.js`
- 症状：输入 `Rock & Roll` 时，错误地输出 `rock--roll`
- 期望：输出 `rock-roll`
- 验收命令：`node tests/run-tests.mjs`

该 fixture 不依赖网络，不需要安装第三方包。
