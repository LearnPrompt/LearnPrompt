# 横向研究：部署、渠道与成本资料面

核验日期：2026-07-12。

| Source family | Supports | Cannot prove / limitation |
| --- | --- | --- |
| OpenClaw `install` / Docker | 官方安装路径、Docker 可选、2 GB build RAM、public host hardening、volume/health 责任 | 不能证明任一厂商在所有地区的实时价格或 SLA |
| Railway / Render / Fly.io official guides | volume、休眠、持久化、公开入口和平台特定运行边界 | 不是跨厂商可靠性基准；页面会随平台变化 |
| Kubernetes official guide | 当前示例只是 minimal starting point，不是 production-ready | 不能替代团队自己的 K8s production design |
| Gateway / remote / security | always-on control plane、默认 loopback、remote tunnel、auth、DM/group policy、多租户信任边界 | 不能证明某个实际实例已正确配置；必须 live probe |
| Gateway CLI / Channels CLI | `gateway status --require-rpc` 与 `channels status --probe` 的证明范围、config-only fallback | 不等于端到端业务成功或 provider invoice |
| Token use / API costs / usage tracking | token 记账、local estimates、外部付费面、provider-reported 与 session-derived 边界 | 不提供对所有 provider 永久有效的价格；本地估算不是发票 |
| Secrets management | SecretRef、runtime snapshot、audit/configure/apply/reload、明文残留边界 | SecretRef 不是进程/主机隔离，也不保护 agent 可读的任意文件 |
| GitHub release `v2026.6.11` | 2026-06-30 的官方稳定版时间锚点 | docs 可能领先 release；不能从 release 推断所有文档字段已存在于旧版本 |
| OpenClaw Orange Book | 2026-04 中文主题地图，提示部署/渠道/成本选题 | 二手资料；README 仅 educational purposes，无标准 CC/OSI LICENSE，不得复制其素材或段落 |

## Pedagogical comparison

相邻 verified 教程 `hermes-learning-loop.mdx` 的可取结构是：先拆可观察机制，再给分流表、确定性 Showcase、失败码、边界、练习和一手来源。本篇沿用这种教学节奏，但不复制正文或示例。

本篇特别避免两种常见写法：

1. 云厂商 logo/价格表导向：价格会变，且不能解释安全和状态。
2. 部署命令堆叠：安装成功不证明 24/7、持久化、渠道健康或预算可控。

## Orange Book boundary

仓库 API 在 2026-07-12 返回 `license: null`；README 的 License 段只说内容用于 educational purposes，并署名 Huashu、发布于 2026-04。本文只保留链接、作者和主题地图作用；没有读取或复制 PDF 正文、截图、图表、图片或段落。
