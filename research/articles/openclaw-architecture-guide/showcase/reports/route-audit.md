# Synthetic route audit

- Verdict: accept current Gateway WebSocket route.
- Trace: Channel inbound → Gateway channel adapter → Gateway session/agent → Gateway node.invoke → paired Node capability → Gateway channel reply.
- Channel does not connect directly to Node.
- Node owns no Gateway, channel, session, pairing, registry, or control-plane state.
- Device pairing and camera capability approval are present; operator.write covers the synthetic relay request.
- Bind is loopback with a placeholder auth path; no credential value is stored.
- The legacy TCP bridge is not current transport.
- No live OpenClaw was contacted.
- The outer deterministic validator is authoritative; this report cannot self-approve.
