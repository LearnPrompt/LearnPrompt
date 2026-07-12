# Horizontal research

Verified at: 2026-07-12.

## Official OpenClaw documentation

| Source | What it supports | What it cannot prove |
| --- | --- | --- |
| Network | Single long-running Gateway, channel connections, default WS address, auth requirement for non-loopback, remote access choices | The health of any user's installation |
| Gateway runbook | Ownership/runtime model, status/RPC/channel probe semantics, one-Gateway recommendation, remote tunnel behavior | That commands were run locally in this writer environment |
| Gateway protocol | Current WS control plane/node transport, roles/scopes handshake, node capability claims and server filtering | Security of a topology that ignores the documented protocol |
| Operator scopes | `operator`/`node` role split and read/write/admin scope semantics; scopes are not hostile multi-tenant isolation | Host or tenant isolation by itself |
| Node pairing + Nodes | Device pairing and capability approval as two layers; Node as capability host using `node.invoke` | Automatic approval of every declared command |
| Channel configuration | Default DM pairing, group/allowlist policies, current core/plugin boundary examples | A permanent inventory of every plugin/channel feature |
| Remote access | Gateway owns sessions, auth profiles, channels, state; Tailscale/SSH choices | That a tunnel bypasses Gateway auth |
| Bridge protocol | TCP bridge is removed and historical only | Permission to keep `bridge.*` in a current topology |
| v2026.6.11 release | Stable release tag and publication date | That online docs are frozen to precisely that tag |

## OpenClaw Orange Book

The repository by Huashu/花叔/alchaincyf was inspected only as a Chinese topic map. It provides downloadable PDFs, screenshots, and a broad architecture learning path. GitHub's repository metadata returned `license: null`, and the root contained no `LICENSE` file on 2026-07-12. Its README describes educational use but does not grant a standard CC/OSI reuse license.

Therefore this tutorial does not reproduce or adapt the book's PDF prose, screenshots, diagrams, cover, or images. It preserves the repository link and attribution at the bottom, while every current product claim goes back to official OpenClaw material.

## Teaching calibration

The closest LearnPrompt examples were `hermes-learning-loop.mdx`, `what-is-harness.mdx`, and `choose-claude-code-or-codex.mdx`. Their reusable pedagogical pattern is: start with a consequential decision, distinguish adjacent concepts, anchor a concrete Showcase in a deterministic gate, state what the experiment cannot prove, and end with an observable exercise. Their product claims and prose were not copied.

## Editorial synthesis

The article is organized around ownership and one message trace instead of a three-box glossary. This is an editorial synthesis: it is consistent with the official protocol and runtime model but is not presented as an OpenClaw-owned taxonomy or industry standard.
