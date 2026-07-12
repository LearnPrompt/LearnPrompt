# Vertical research：为什么 API Skill 必须先写 request contract

## 1. 只是“能请求”不够

如果一个 Skill 只写“去调用某个 API 并整理结果”，Agent 仍然要临场猜：

- credential 从命令行、环境变量还是 repo 文件拿？
- 到底允许 `GET` 还是也允许 `POST`？
- 429 是立刻重试、指数退避，还是直接当失败？
- 空 payload 是真的“没有新版本”，还是上游 contract 已经 drift？
- 报告里哪些字段可以留下，哪些会泄露 header、token 或本地路径？

这几件事里，只有第一步“发请求”是 HTTP 能力；剩下全是工作流 contract。

## 2. request contract 的六个面

### credential source

这一步不是“安全建议”而已，而是 request 是否可交接的前提。credential 一旦混进 repo、日志或报告，后续再漂亮的分页与 schema 都没有意义。

### request envelope

本文冻结 `method / path / page param / outputs / max_5xx_retries`。这样调用前就知道什么是合法请求，什么需要直接拒绝。

### read-only boundary

RFC 9110 能证明 `GET` 是检索语义；GitHub best practices 能证明大量 mutative requests 应额外节流。这两者组合后的工程结论是：**如果本文只是读 release feed，就不要把 method 选择权交给 Agent。**

### retry policy

`429` 和 `5xx` 不是同一类失败：

- `429` 代表服务端告诉你“暂时别再打了”，应尊重 `Retry-After`。
- `5xx` 代表服务端出错，可以有限重试，但超过上限后必须明确失败。

### schema validation

只要 release 对象缺一个关键字段，或者整页是空数组，报告就不该自动写成“没有新版本”。这是 contract failure，不是业务结论。

### report and evidence

真正可复跑的不是一段叙述，而是最小证据：请求顺序、分页页码、状态码、retry 次数、输出路径、红线字段的脱敏说明。

## 3. 为什么要先有退出码，再有自然语言

自然语言总结适合给人看，但它不足以驱动下游：

- `41` 让调用方知道问题在 credential 注入，不是上游 API 崩了。
- `42` 让调用方知道问题在 response contract，而不是“没有新版本”。
- `43` 让调用方知道重试预算耗尽，应停下而不是无限抖动。
- `44` 让调用方知道 method 配置越界，甚至不该发第一包网络请求。

这和 `pipeline-skill-design` 的结论一致：**失败原因必须被编码成可分流状态，而不是留给下一轮 Agent 猜。**

## 4. writer blocked 与外层 success 如何一起解释

两层环境合起来能确认四件事：

1. 同一份 request contract 在 in-process transport 下可稳定覆盖 `0 / 41 / 42 / 43 / 44` 语义，fixture tests 7/7 通过。
2. writer sandbox 的 `EPERM listen 127.0.0.1` 是宿主限制，必须冻结为 blocked evidence，不能改写成接口失败。
3. 外层真实 loopback 重跑命中六个场景的冻结退出码；同步 runner 必须让出事件循环，否则 mock server 会被自己锁死。
4. 真实 nested Codex `gpt-5.5` 显式调用成功写出两份报告、读取 3 个 release、测试 7/7 通过，且只新增 `reports/`。

## 5. Editorial synthesis

下面这些属于 LearnPrompt 的编辑综合，不是官方标准：

- 把 API Skill 收束成“credential -> request envelope -> pagination -> retry -> schema -> report”的教学骨架。
- `41 / 42 / 43 / 44` 这套退出码定义。
- “空 payload 也算 contract failure”这一教学立场。
- `release-feed-api` fixture 的报告形状与 evidence 最小面。
