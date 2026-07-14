# Vertical research: where does one OpenClaw message actually travel?

Verified at: 2026-07-12.

## Surface question

Why is “Gateway = entry, Node = execution, Channel = messaging” too weak for architecture review?

Because it does not identify authority, transport, or policy. The same three labels can be drawn with a Channel directly connected to a Node, a Node owning sessions, or a non-loopback Gateway without auth. All three would preserve the glossary while violating the current architecture.

## Mechanism

1. A channel adapter owned by the Gateway receives an inbound event and applies channel-specific DM/group access policy.
2. The Gateway routes the event to session/agent state it owns.
3. When the run requires an external capability, the Gateway relays `node.invoke` over the current Gateway WebSocket to a connected `role: node` capability host.
4. The Node's declarations are only claims. Device pairing gates connection; capability approval and server allowlists gate the exposed command surface; normal command policy still applies.
5. The result returns to the Gateway, which continues the run and sends the reply through its channel connection.

Operator clients follow the same control plane but use `role: operator` and operator scopes. They do not become Nodes, and a Node does not gain operator RPC methods by declaring a command.

## Boundary layers

- Channel DM/group policy admits senders and groups.
- Device pairing admits the Node connection.
- Node capability approval admits declared capability/command expansion.
- Role and scope gate protocol methods after authentication.
- Gateway auth and bind choices protect the exposed control plane.
- Strong separation requires separate Gateway/OS user/host boundaries; operator scopes do not create hostile multi-tenancy.

## Failure modes

- Direct Channel → Node route: bypasses Gateway-owned routing and has no documented fallback.
- Node-as-Gateway: moves channel/session authority into a capability host and fragments state.
- “Paired means admin”: collapses device admission, capability approval, role, scope, and command policy.
- Non-loopback without auth: expands exposure without a valid auth path; current Gateway should refuse startup.
- Legacy bridge revival: treats a removed TCP JSONL listener and retired `bridge.*` config as current transport.
- Multiple Gateway identity drift: clients, Nodes, and channels talk to different state authorities while operators assume one system.

## Operational proof ladder

Configuration parsing is the weakest evidence. `openclaw gateway status` adds service/connectivity state. `openclaw gateway status --require-rpc` requires a read-scope RPC. `openclaw channels status --probe` adds live per-account probes only when Gateway is reachable; otherwise it can fall back to config-only summaries. A production claim must name which rung actually passed.

The writer environment has no `openclaw` binary, so this research does not claim a local CLI run. The Showcase intentionally validates only a synthetic topology and report contract.

## Trade-offs

Loopback keeps the control plane local but requires Tailscale/VPN or SSH forwarding for remote clients. Direct LAN/tailnet bind can simplify reachability but demands valid auth and explicit exposure review. Multiple Gateways provide isolation or rescue paths but multiply config/state/workspace/port boundaries and introduce identity ambiguity.

## Historical boundary

The official bridge page is still online to explain history, but it begins with a removal warning: current builds do not ship the TCP bridge listener, and `bridge.*` is no longer in schema. Its existence as documentation is not evidence of current availability.

## Editorial synthesis

The “ownership → route → gates → health proof” sequence and rejection rail 101–105 are LearnPrompt teaching devices. They summarize the official model but do not claim to be product-defined error codes.
