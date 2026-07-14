# 纵向研究：为什么部署选择必须先过硬门槛再比较成本

核验日期：2026-07-12。

## 1. Surface: “哪里最便宜”不是中心问题

同一工作负载在本地、VPS 和托管模板上可能有不同固定成本，但上线失败往往来自不可用、状态丢失、公开入口失控或渠道假健康。单独比较 host price 会把这些硬约束误当成可折价的软偏好。

## 2. Mechanism: Gateway 是常驻控制面

官方 Gateway runbook 把 Gateway 描述为路由、控制平面和渠道连接的 always-on process。需要 24/7 渠道连接时，运行主体也必须持续在线；笔记本合盖或会休眠的平台无法凭“低价”满足需求。

容器只是进程封装。Railway、Render、Fly.io 官方路径都把持久 volume 作为状态保留的显式条件。没有 volume/backup/recovery，restart 只能重建进程，不能恢复状态。

## 3. Exposure and trust boundary

默认 loopback 缩小网络暴露。远程可用 SSH tunnel/Tailscale 保持这一边界。non-loopback/public path 必须增加 gateway auth、origin、TLS、firewall 和渠道入口策略。

DM pairing/allowlist 决定谁能发消息；group allowlist 与 mention gating 决定群内入口。`open` 是扩大信任域，不是连通性的同义词。官方安全与 multi-tenant 文档进一步限定：operator scopes 是一个可信 Gateway domain 内的 guardrail，不是 hostile multi-tenant isolation。互不信任者要拆分 Gateway/OS user/host，风险更高时拆 VM/机器。

## 4. Cost mechanism

月总成本至少有三层：

- fixed infra: 主机、volume、备份等相对固定输入；
- variable usage: model input/output/cache、tool/search/media/voice/embedding 等；
- operations: channel/plugin、egress、observability、告警和维护。

OpenClaw 会追踪 token，并可用本地 pricing metadata 计算 estimate；session-derived totals 不是 provider invoice。订阅/OAuth 与 API-key 还可能位于不同账单面。因此预算 gate 应同时使用本地快速估算与 provider-reported 对账，且所有单价带核验日期。

## 5. Formula and peak behavior

Showcase 冻结：

```text
R = requests/day × days/month
input = R × input_tokens/request ÷ 1M × input_price/M
output = R × output_tokens/request ÷ 1M × output_price/M
tool = R × tool_calls/request × tool_price/call
media = media_calls/day × days/month × media_price/call
total = fixed + input + output + tool + media + channel + egress/observability
```

平均月值不能描述瞬时拥塞，所以另设 peak concurrency、rate limit 和 concurrency limit。per-run cap 防止单次 agent loop 放大；monthly cap 控制累计；fallback 与 kill switch 定义超过上限后的动作。

## 6. Health proof ladder

配置存在是最弱证据。`gateway status --require-rpc` 要求 read RPC 成功；`channels status --probe` 在 Gateway 可达时做 per-account live probe/audit，但不可达时可能回退到 config-only summary。health、doctor、logs 和真实消息往返分别覆盖不同层，不能互相替代。

## 7. Failure modes

- availability/persistence 未写：选型不可证伪，对应 111。
- public exposure 无 auth 或 DM/group open：扩大攻击面，对应 112。
- 漏 token/media/tool 或宣称 invoice：成本不可重算，对应 113。
- secret/account ID 泄漏或假装 channel live：安全与证据失败，对应 114。
- 无 cap/rate/concurrency/fallback/kill switch：超过预算后没有动作，对应 115。

## 8. Editorial synthesis

“先硬门槛，后总成本”是本文的编辑综合，不是 OpenClaw 官方命名的标准流程。它把官方分散在部署、Gateway、channels、security、secrets 和 usage 文档中的约束组装成一条可验证决策链。Showcase 用固定 fixture 和机械 validator 证明这一综合可以重放，但不声称为行业标准或真实性能基准。
