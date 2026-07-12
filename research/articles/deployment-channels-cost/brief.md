# Article card: deployment-channels-cost

- Topic: OpenClaw 部署形态、渠道安全与可重算成本控制。
- Target reader: 已在本地跑通 OpenClaw，准备迁移到常驻实例或接入团队渠道的个人开发者、小团队维护者。
- One-sentence outcome: 读者能用工作负载、信任边界、持久化与预算公式选出可运营的部署方案，并用 live probes 验收。
- Destination: `starlight/src/content/docs/agent-frameworks/deployment-channels-cost.mdx`
- Research path: `research/articles/deployment-channels-cost/`
- Showcase: `deployment-budget-safety-gate`，在三种合成拓扑中由硬约束和公式选出候选，并机械拒绝 111-115。
- Build: `npm --prefix starlight run build`
- Verification date: 2026-07-12

## Problem

旧稿只有部署/渠道/模型/日志/权限清单，没有解释 Gateway 常驻机制、状态持久化、暴露面、渠道 live probe、完整成本面或预算熔断，无法支持上线决策。

## Learning outcomes

1. 区分 local、VPS/container、managed template 的可用性、持久化、暴露与维护责任。
2. 将 fixed infra 与 model/tool/media/channel/egress/observability variable costs 分开。
3. 使用可替换价格输入和公式，不硬编码会过期的报价。
4. 设计 Gateway auth、DM pairing/group allowlist、SecretRef、rate/concurrency limit、fallback/kill switch。
5. 区分配置摘要、RPC 证明、channel live probe 与业务消息往返。

## Central claim

部署选择必须先通过 availability、persistence、exposure、auth 与 channel policy 的硬门槛，再在合格候选中比较可重算总成本；最便宜的基础设施不一定是可上线方案。

## Non-goals

- 不提供任何云厂商的长期价格表或采购建议。
- 不执行真实部署，不连接云账号、真实渠道或真实 OpenClaw profile。
- 不读取真实 config、credentials、token、account ID、消息或账单。
- 不把 Kubernetes 示例包装成 production-ready。
- 不将一个共享 Gateway 描述为 hostile multi-tenant isolation。

## Required proof

- OpenClaw 官方文档与官方 release 支撑当前行为和版本。
- 完全合成 fixture、固定 SHA-256、可重放公式、111-115 负例矩阵、privacy 0。
- fresh-model 层只读合成材料、最多写两份报告；若额度阻断则真实记录 blocked。
- 1400x900 原创教学图通过视觉检查。

## Acceptance criteria for writer stage

- 公开正文无旧来源组件，底部保留一手来源及 Orange Book 主题地图/许可边界。
- writer 阶段保持 `showcase_status: partial`、无 `quality_score`；独立只读终审 PASS 后，最终为 `showcase_status: verified`、`quality_score: 100`。
- Showcase deterministic verifier、privacy scan、partial validator、Starlight build 与 `git diff --check` 通过。
