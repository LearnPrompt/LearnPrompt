# Evidence ledger

核验日期：2026-07-12。

| Claim | Evidence | Evidence type | Verified at | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- |
| Latest stable is v2026.6.11, published 2026-06-30 | GitHub release API and official release page | Primary release | 2026-07-12 | High | Docs may update faster than releases |
| Gateway is an always-on routing/control/channel process; default bind is loopback, container effective default may resolve to 0.0.0.0 | `https://docs.openclaw.ai/gateway` | Primary official docs | 2026-07-12 | High | Actual deployment must inspect effective config |
| Remote loopback access can use SSH tunnel; explicit remote URL does not silently reuse credentials | `https://docs.openclaw.ai/gateway/remote` | Primary official docs | 2026-07-12 | High | Tailscale/proxy details vary by environment |
| Docker source build needs at least 2 GB RAM and public hosts require network hardening review | `https://docs.openclaw.ai/install/docker` | Primary official docs | 2026-07-12 | High | Runtime workload sizing still local |
| Railway requires `/data` volume for persistent state | `https://docs.openclaw.ai/install/railway` | Primary official docs | 2026-07-12 | High | Platform UI and prices can change |
| Render free tier sleeps and lacks persistent disk; state resets on redeploy | `https://docs.openclaw.ai/install/render` | Primary official docs | 2026-07-12 | High | Plan behavior can change; re-check before purchase |
| Fly path requires volume/state dir and secrets | `https://docs.openclaw.ai/install/fly` | Primary official docs | 2026-07-12 | High | Example is provider-specific |
| Kubernetes guide is a minimal starting point, not production-ready | `https://docs.openclaw.ai/install/kubernetes` | Primary official docs | 2026-07-12 | High | Does not define the reader's production design |
| DM pairing/allowlist/open/disabled and group policies gate inbound identities | `https://docs.openclaw.ai/gateway/security` and `/gateway/config-channels` | Primary official docs | 2026-07-12 | High | Per-channel fields differ; verify selected channel |
| Operator scopes are not hostile multi-tenant isolation | `https://docs.openclaw.ai/gateway/operator-scopes` and `/gateway/multi-tenant-hosting` | Primary official docs | 2026-07-12 | High | Fleet is experimental and not prescribed here |
| SecretRefs reduce plaintext at rest but are not process isolation; audit must be clean | `https://docs.openclaw.ai/gateway/secrets` | Primary official docs | 2026-07-12 | High | Supported credential surface/version may change |
| `gateway status --require-rpc` proves read RPC; `channels status --probe` is live only with reachable Gateway | official Gateway/Channels CLI docs | Primary official docs | 2026-07-12 | High | Neither alone proves end-to-end business success |
| OpenClaw token/cost UI can show estimates; session totals are not provider invoice | token-use, api-usage-costs, usage-tracking official docs | Primary official docs | 2026-07-12 | High | Provider metadata and pricing availability differ |
| Showcase formulas produce variable 48.24, VPS total 80.24, managed total 92.24 | frozen fixture + deterministic generator/validator | Reproducible synthetic run | 2026-07-12 | High | Inputs are examples, not prices or forecast |
| Deterministic matrix returns 0/111/112/113/114/115 and privacy 0 | `showcase/results/deterministic-verifier.txt` | Reproducible synthetic run | 2026-07-12 | High | Validator proves its contract, not real deployment health |
| Orange Book has no standard repo license and states educational purposes | GitHub repository API (`license: null`) and README | Secondary topic map metadata | 2026-07-12 | High | Repository owner may change terms later |
