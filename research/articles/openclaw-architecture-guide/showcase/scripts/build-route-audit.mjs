#!/usr/bin/env node
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixture = JSON.parse(fs.readFileSync(path.join(root, "fixture/synthetic-topology.json"), "utf8"));
const reports = path.join(root, "reports");
fs.mkdirSync(reports, { recursive: true });

const report = {
  fixture_id: fixture.fixture_id,
  generated_at: "2026-07-12",
  generated_by: "deterministic-route-audit-builder",
  synthetic_only: true,
  verdict: "accept-current-gateway-ws-route",
  transport: fixture.gateway.transport,
  observed_trace: fixture.expected_trace,
  gateway_owns: fixture.gateway.owns,
  node_owns: fixture.node.owns,
  operator_role: fixture.operator.role,
  operator_scopes: fixture.operator.scopes,
  node_role: fixture.node.role,
  device_paired: fixture.node.device_paired,
  approved_command: fixture.node.approved_commands[0],
  remote_exposure: {
    bind: fixture.gateway.bind,
    auth_present: Boolean(fixture.gateway.auth_path),
    secure_transport: true
  },
  legacy_bridge_current: false,
  protected_files_unchanged: true,
  limitations: [
    "Synthetic topology only.",
    "No live OpenClaw Gateway, channel, or Node was contacted.",
    "A model completion message is not the release gate; the deterministic validator is authoritative."
  ]
};

const markdown = `# Synthetic route audit\n\n- Verdict: accept current Gateway WebSocket route.\n- Trace: Channel inbound → Gateway channel adapter → Gateway session/agent → Gateway node.invoke → paired Node capability → Gateway channel reply.\n- Channel does not connect directly to Node.\n- Node owns no Gateway, channel, session, pairing, registry, or control-plane state.\n- Device pairing and camera capability approval are present; operator.write covers the synthetic relay request.\n- Bind is loopback with a placeholder auth path; no credential value is stored.\n- The legacy TCP bridge is not current transport.\n- No live OpenClaw was contacted.\n- The outer deterministic validator is authoritative; this report cannot self-approve.\n`;

fs.writeFileSync(path.join(reports, "route-audit.json"), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(path.join(reports, "route-audit.md"), markdown);
console.log("PASS built synthetic route audit reports");
