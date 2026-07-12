# Evidence ledger

Verified at: 2026-07-12.

| Claim | Evidence | Evidence type | Verification date | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- |
| Current stable release is `v2026.6.11`, published 2026-06-30. | GitHub official latest release API and release page. | Primary release record | 2026-07-12 | High | Online docs can continue changing after the release. |
| Most operations flow through one long-running Gateway that owns channel connections and WS control plane. | Official Network core model; Gateway runtime model. | Primary docs | 2026-07-12 | High | Does not prove a user's deployment health. |
| Gateway owns sessions, auth profiles, channels, and state; others are clients. | Official Remote access page. | Primary docs | 2026-07-12 | High | “Everything else” is interpreted within the documented remote topology. |
| Gateway WS is the current single control plane and node transport; clients declare role/scope at handshake. | Official Gateway protocol. | Primary docs | 2026-07-12 | High | Optional Watch transport exception is not central to this tutorial. |
| Default WS is `ws://127.0.0.1:18789`; non-loopback requires a valid auth path. | Official Network and Gateway runbook. | Primary docs | 2026-07-12 | High | Container `auto` behavior is a documented exception; article focuses on default local mode. |
| Operator role/scopes and Node role are distinct; scopes are not hostile multi-tenant isolation. | Official Operator scopes. | Primary docs | 2026-07-12 | High | Strong isolation design still depends on OS/host configuration. |
| Node is a capability host using `node.invoke`, not a Gateway. | Official Nodes and Operator scopes. | Primary docs | 2026-07-12 | High | Some platform transports have special cases, but state ownership remains Gateway-centered. |
| Node pairing has device admission and capability approval layers. | Official Node pairing. | Primary docs | 2026-07-12 | High | Approval still remains subject to normal command policy. |
| Node caps/commands/permissions are claims filtered by Gateway allowlists. | Official Gateway protocol node capability section. | Primary docs | 2026-07-12 | High | Implementation may evolve after verification. |
| DM policy defaults to pairing; group access is policy/allowlist controlled. | Official Channel configuration. | Primary docs | 2026-07-12 | High | Exact plugin/channel keys evolve. |
| SSH/Tailscale are documented remote paths; SSH does not bypass Gateway auth. | Official Gateway runbook and Remote access. | Primary docs | 2026-07-12 | High | Network security still depends on surrounding configuration. |
| `gateway status --require-rpc` proves read-scope RPC; channel probe can fall back to config-only if unreachable. | Official Gateway runbook. | Primary docs | 2026-07-12 | High | Commands were not run locally because OpenClaw is absent. |
| TCP bridge has been removed; `bridge.*` is no longer in schema. | Official Bridge protocol warning; Node pairing. | Primary docs | 2026-07-12 | High | Page remains accessible as historical reference. |
| Deterministic Showcase returns valid `0`, architecture rejection `101`–`105`, unexpected-write rejection `106`, and privacy `0`. | `showcase/results/deterministic-verifier.txt` and `showcase-result.txt`. | Local deterministic run | 2026-07-12 | High | Synthetic topology only; no live OpenClaw. |
| Fresh `gpt-5.4` route-audit attempts stopped at usage limit before writing either allowed report; all three attempts have exact report flags, complete changed/unexpected path arrays, and protected-file verdicts. | Prompt, controller, and `showcase/results/live-controller-summary.json`. | Controlled model attempt, blocked | 2026-07-12 | High for the recorded blocked layer | Initial plus two retries all hit the same account-level limit; no model-generated route report was accepted. |
| The controller runs from a minimal repository-external synthetic workspace and rejects any path other than the exact two reports. | `scripts/write-boundary-lib.mjs`, `scripts/run-codex-live.mjs`, and the injected unexpected-report `106` case in `verify-showcase.mjs`. | Local deterministic boundary test | 2026-07-12 | High | Proves the execution workspace boundary, not writes elsewhere permitted by the host OS. |
| Writer machine has no `openclaw` executable. | `command -v openclaw` returned no path. | Local no-model probe | 2026-07-12 | High for this environment | Says nothing about readers' machines. |
| Orange Book has no root LICENSE and GitHub reports `license: null`; README identifies Huashu and educational material. | GitHub repository API/root and README. | Secondary repository metadata | 2026-07-12 | High | Absence of a standard license is not a statement about private permission. |
