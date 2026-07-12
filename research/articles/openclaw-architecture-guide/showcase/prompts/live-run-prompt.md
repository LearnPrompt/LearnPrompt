You are auditing a fully synthetic OpenClaw topology. This is not a real Gateway, channel, node, profile, or account.

Read only:
- `fixture/synthetic-topology.json`
- `contracts/route-contract.json`

Write only:
- `reports/route-audit.json`
- `reports/route-audit.md`

Do not read or write any path outside this Showcase. Do not launch or probe OpenClaw. Do not inspect environment variables, user configuration, credentials, runtime state, local paths, sessions, devices, channel accounts, or messages beyond the synthetic fixture.

The JSON report must:

- use `fixture_id: "gateway-node-channel-route-gate"`
- use `generated_at: "2026-07-12"`
- use `generated_by: "fresh-gpt-5.4-route-audit"`
- set `synthetic_only: true`
- set `verdict: "accept-current-gateway-ws-route"`
- set `transport: "gateway-websocket"`
- copy the exact `expected_trace` array as `observed_trace`
- copy the Gateway `owns` array as `gateway_owns`
- set `node_owns: []`
- record `operator_role: "operator"`, `operator_scopes` from the fixture, `node_role: "node"`, `device_paired: true`, and `approved_command: "camera.capture"`
- set `remote_exposure` to `{ "bind": "loopback", "auth_present": true, "secure_transport": true }`
- set `legacy_bridge_current: false`
- set `protected_files_unchanged: true`
- include `limitations` stating that this is synthetic, no live OpenClaw was contacted, and the model message is not the release gate

The Markdown report must summarize the same route and explicitly state that Channel does not connect directly to Node, Node owns no Gateway/channel/session state, the legacy bridge is not current, no live OpenClaw was contacted, and the outer deterministic validator is authoritative.
