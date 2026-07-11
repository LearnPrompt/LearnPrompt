# vertical-research.md — 中心问题向下追

中心问题：**第一次用 Claude Code，什么才算成功？** 追到机制、失败模式、权衡与边界。
标注：【事实】来自一手来源/本机实测；【综合】是 LearnPrompt 的编辑判断。

## 表层现象

新手的默认判据是“工具装好了、能对话了”。但装好只证明二进制可运行、认证通过，不证明它
能在你的仓库里做对一次改动。【综合】把“工具能打开”当成功，会掩盖真正的风险：模型可能改了
无关文件、破坏了构建、或口头说“已完成”却没有可验收证据。

## 机制：为什么需要一个闭环

Claude Code 的默认交互不是“它直接改完”，而是**改文件前要授权**（Quickstart Step 5 明确
Find file → Show proposed changes → Ask for approval → Make edit）【事实】。这意味着安全首日
路径天然是分步的：先只读盘点，再计划，再改，再验收。

官方 best-practices 把它归纳成 Explore → Plan → Code → Commit：先进 plan 模式只读探索，
再写详细计划，退出 plan 后对照计划编码并跑测试，最后让它写 commit【事实】。本文把可复现的
核心提炼为五步控制环 INSPECT→PLAN→EDIT→VERIFY→DIFF【综合】，其中 VERIFY 强调“看退出码，
不听自述”，DIFF 强调“确认没改错文件”。

关键机制点：**验收应独立于执行者**。best-practices 明确要给模型一个能跑出 pass/fail 的
检查（测试、build 退出码、linter），并要它展示证据而非断言成功【事实】。这正是本文
Showcase 第二层（确定性验收门）存在的理由——它不问模型觉得完成没有，只检查三条事实。

## 权衡：计划的成本

不是每次改动都要写计划。best-practices 原文：“If you could describe the diff in one
sentence, skip the plan.”计划最值当：方法不确定、跨多文件、或对被改代码不熟【事实】。
【综合】对第一次练手，任务本身就该选小到“一句话能说清”的那种，所以真正要严守的不是长计划，
而是把范围和硬约束一句话钉死（PLAN=冻结，而非长篇）。

## 权衡：权限放行的范围

第一天该收紧。六种 permission mode 里，default（CLI 标签 Manual）只读免问、其余都问，适合
起步；plan 只读，适合探索陌生代码；acceptEdits 会免问放行编辑与常见文件命令，第一天不建议
默认开【事实】。规则求值顺序 deny → ask → allow，第一个匹配即决定，broad deny 会盖住更窄的
allow【事实】。【综合】第一天够用的边界：Manual 起步 + 需要探索时切 plan + 只 allow 明确安全
命令（如 `npm run lint`、`git commit`）+ deny 危险命令（如 `git push`）。更细的权限设计留给
后续文章，本文不展开。

## 失败模式

1. **把安装当成功**：只验证 `claude --version`，没跑过一次可验收改动。【综合】
2. **不先盘点就改**：跳过只读阶段，模型缺地图、乱改。best-practices 的 Explore 阶段正是
   为此【事实】。
3. **听模型自述当验收**：模型说“已完成”不等于测试通过。best-practices 要求展示证据【事实】；
   Showcase 的失败路径演示了门如何在“README 段落齐、测试也过”的情况下仍因代码被改而判失败。
4. **失败后继续硬修**：一次纠正没解决就再补一句提示，往往越修越乱。best-practices 建议纠正
   超过两次就 /clear 重开、写更精确的 prompt【事实】；本文让失败回到 PLAN/EDIT 而非原地继续。
5. **在没有 git 状态时连续多轮改动**：无法回滚、无法看 diff。【综合】

## 边界条件（何时不必按本文做）

- 空目录里的一次性玩具实验，可以不建仓库、不写计划。【综合】
- 改一个 typo、加一行日志这种一句话能说清的改动，可跳过 plan 直接做【事实】。
- 生产核心仓库、含真实密钥/部署配置的项目，第一天不要拿来练手。【综合】

## 一句话综合

第一次成功 =（对一个可验收的最小改动）跑通 INSPECT→PLAN→EDIT→VERIFY→DIFF，且验收由
独立检查而非模型自述决定，失败时回到 PLAN/EDIT 而不是硬修。【综合】
