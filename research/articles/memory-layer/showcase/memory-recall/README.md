# Showcase：memory-recall —— 没有记忆就重复犯错，写入一条可审计教训后独立进程能读取并避开

## 它证明什么

同一个非显然的坑（校验前必须先生成 gitignore 的 fixture），在三种记忆状态下的真实结局：

1. 无记忆：两个独立进程各自撞上同一个报错（重复犯错 / 重复盘点）。
2. 写入一条结构化、可审计的教训后：召回闸门能按相关性取出它。
3. 一个全新独立进程先召回再行动：先跑 setup 再校验，一次通过（exit 0）。
4. 过期淘汰：时间推进到 expires 之后，一次性状态条目被 EVICT，durable 教训存活。
5. 记忆在盘上但进程不召回：照样重复犯错——证明记忆不等于模型自动记住。

## 它不证明什么

- 不构成任何模型排名：全程无网络、未运行任何在线大模型，跑的是确定性脚本。
- `recall.mjs` 只是「相关性门控 + 过期淘汰」两条读取纪律的最小可复现模型，不是任何产品本身；真实产品（Claude Code auto memory、Codex 实验特性 memories）的召回与淘汰语义以其官方为准。
- 一次召回成功，不代表记忆内容本身正确：教训写错了、trigger 标窄了，闸门照样会取出错的或漏掉对的。

## 目录

```text
memory-recall/
├── repo/
│   ├── .gitignore              # data/fixture.json 不入库（这正是坑的来源）
│   └── src/
│       ├── build-token.mjs     # 校验：缺 fixture 时报出那条值得记住的错
│       └── setup.mjs           # 生成 fixture 的前置动作
├── memory-store/
│   ├── MEMORY.md               # 索引，只加载它一条（细节按需再读）
│   └── lessons/
│       ├── fixture-before-verify.md   # durable 教训
│       └── mirror-slow-on-0711.md     # 一次性状态，演示过期淘汰（反面示范：污染）
├── scripts/
│   ├── recall.mjs              # 召回闸门：相关性门控 + 过期淘汰
│   └── run-session.mjs         # 模拟独立进程：no-memory / skip-recall / with-memory
└── result.txt                  # 冻结的脱敏运行结果
```

## 复现

```bash
cd research/articles/memory-layer/showcase/memory-recall
node scripts/run-session.mjs --mode no-memory   --today 2026-07-11   # 复现报错，exit 1
node scripts/recall.mjs build-token             --today 2026-07-11   # 召回教训
node scripts/run-session.mjs --mode with-memory --today 2026-07-11   # 先召回再行动，exit 0
node scripts/recall.mjs build-token             --today 2026-07-13   # 过期淘汰一次性状态
node scripts/run-session.mjs --mode skip-recall --today 2026-07-11   # 有记忆但不召回，仍报错
```

`--today` 让过期判定可复现，不依赖真实系统时钟。

## 边界与脱敏

- 无网络依赖；不触碰真实密钥、不 push、不部署。
- 记忆条目里不含密钥、session id、绝对路径或用户私密历史——这是记忆写入纪律，也是本 Showcase 自身的约束。
- 原始日志在工作树外（`$TMPDIR`）采集，进程退出后冻结；`result.txt` 为脱敏摘录。
