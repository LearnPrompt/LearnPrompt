# Showcase: gateway-node-channel-route-gate

This Showcase audits a fully synthetic OpenClaw route. It does not read a real profile, config, state database, channel message, account, token, pairing record, Gateway, or Node.

## Frozen inputs

- `fixture/synthetic-topology.json`: synthetic Gateway ownership, channel event, operator/node declarations, approvals, and expected trace.
- `contracts/route-contract.json`: fixture hash, exact allowed report paths, required ownership/transport, rejection codes, and privacy patterns.
- `prompts/live-run-prompt.md`: narrow fresh-model task that may write only two reports.

## Commands

```bash
node research/articles/openclaw-architecture-guide/showcase/scripts/build-route-audit.mjs
node research/articles/openclaw-architecture-guide/showcase/scripts/validate-route-audit.mjs
node research/articles/openclaw-architecture-guide/showcase/scripts/verify-showcase.mjs
node research/articles/openclaw-architecture-guide/showcase/scripts/privacy-scan.mjs
CODEX_NESTED_MODEL=gpt-5.4 node research/articles/openclaw-architecture-guide/showcase/scripts/run-codex-live.mjs
```

## Exit contract

- `0`: current Gateway WS route, ownership, authorization, exposure, and bridge boundary all match.
- `101`: channel bypasses Gateway or directly targets Node.
- `102`: Node impersonates Gateway or owns channel/session/control-plane state.
- `103`: operator role/scope, device pairing, or Node capability approval is exceeded.
- `104`: non-loopback bind lacks auth or remote transport is marked insecure.
- `105`: removed legacy bridge is treated as current, or current Gateway WS is missing.
- `106`: any file or directory outside the two exact report paths changes in the minimal execution workspace.

The live controller copies only the synthetic fixture and contract into a repository-external temporary workspace. It snapshots the complete directory/file set and file hashes before and after execution. The deterministic verifier proves that the two exact report paths pass and an injected `reports/unexpected.txt` fails with `106`.
- privacy `0`: reports/results contain no local absolute path, credential, runtime identifier, account/channel identifier, or private message.

## Proof boundary

The deterministic validator is authoritative. A model completion message is not a gate. Even a successful model report proves only that the synthetic fixture can be mapped to the frozen report contract; it does not prove any live OpenClaw deployment is healthy or secure.
