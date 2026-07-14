# Showcase：从一句模糊需求到一个可运行的最小切片

这个 Showcase 不给抽象模板。它完整保留一次真实过程：拿到一句模糊的产品想法，
经过澄清与冻结，落成一张任务卡，再实现一个很小但真的能跑、能验收的 MVP，
并把命令、输出、失败态和明确不做的 backlog 都留在原地。

中心问题：**怎样把“我想做个 AI 新闻雷达”冻结成一个 coding agent 能一次实现的切片？**

## 一、原始自然语言需求（未加工）

```text
我想做一个 AI 新闻雷达，帮我盯住最重要的 AI 动态，别让我错过。
```

这句话不能直接交给 Agent：谁是用户、盯什么、从哪来数据、什么算“重要”、
做到什么程度算完成，全都没定义。

## 二、澄清（把不能猜的决定问出来）

只问会改变成稿的问题，其余先按最小假设冻结：

| 要决定什么 | 冻结结论 | 为什么不能让 Agent 猜 |
| --- | --- | --- |
| 数据从哪来 | 首版读一个本地 `feed.json`（假设已抓好的条目），不联网 | 抓取会牵出反爬、限流、鉴权，淹没主流程 |
| “重要”怎么定义 | 命中一组关注标签就算相关，命中越多越靠前 | 决定核心算法，不能默认 |
| 输出是什么 | 一份 Markdown 摘要打到 stdout | 决定验收动作 |
| 首版规模 | 单文件脚本 + 验收脚本，可本地一条命令跑通 | 防止第一版就背上 Web、登录、定时 |

## 三、冻结任务卡（交给 Agent 的东西）

```yaml
goal: 从本地 feed.json 生成一份 Top N 的 AI 新闻摘要
user_value: 让我一眼看到命中关注标签的最重要几条，别的先不看
input:
  - feed.json：数组，每条含 title / source / url / published / tags
process:
  - 按关注标签 {anthropic, openai, coding-agent, model-release} 打分
  - 同标题去重
  - 按分数、其次按日期排序，取 Top N（默认 3）
output: Markdown 摘要，含标题、来源、命中标签数、链接
failure_states:
  - 输入文件缺失 / 非法 JSON / 顶层非数组 → 非零退出并给可读错误
  - 某条缺 title/source/tags → 判为坏数据，非零退出
  - 零命中 → 非零退出（摘要为空不算成功）
acceptance:
  - node radar.mjs feed.json --top 3 输出恰好 3 条且含来源
  - node verify.mjs 全绿、退出码 0
allowed_paths: [radar.mjs, verify.mjs, feed.json]
backlog_not_now:
  - 真实抓取（网页 / RSS / GitHub / 邮件 / X）
  - 多平台去噪与相似度合并
  - Web UI、登录、定时任务、通知推送
```

## 四、目录

```text
news-radar-mvp/
├── feed.json        # 正常路径 fixture（含一条重复标题、若干无关条目）
├── empty-feed.json  # 零命中失败态的静态 fixture
├── radar.mjs        # 冻结切片的实现：打分 + 去重 + Top N + 失败态
├── verify.mjs       # 把“怎么算完成”写成 4 条确定性检查
└── result.txt       # 冻结的真实运行输出（已脱敏）
```

## 五、环境

- Node v24（本地），无网络依赖，纯本地 fixture。
- 无第三方依赖，不需要 `npm install`。

## 六、复现步骤

```bash
cd news-radar-mvp

# 1. 主流程：Top 3，应输出恰好三条并含来源与链接
node radar.mjs feed.json --top 3

# 2. 失败态：输入缺失应打印可读错误并非零退出
node radar.mjs nope.json

# 3. 验收：四条检查应全绿，退出码 0
node verify.mjs
```

`verify.mjs` 用脚本自身位置解析实现与 fixture，不依赖调用者的当前目录，也不在验收时写入源目录；因此可以从仓库根目录调用，并适用于只读复核。

冻结输出见 `result.txt`。

## 七、这个 Showcase 证明了什么

- 一句模糊需求可以被削减成一个当天能跑通、能验收的切片。
- 输入 / 输出 / 失败态 / 验收动作四件事写清楚后，实现就变得确定。
- backlog 显式记录后，首版不会被“顺便加一下”撑爆。

## 八、它没有证明什么

- 没有证明真实抓取、去噪、跨平台合并可行——那些正是被推到 backlog 的部分。
- fixture 是构造的最小数据，不代表真实新闻源的脏数据分布。
- 关注标签是硬编码的示例，不是一套通用的“重要性”定义。
