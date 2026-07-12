#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixturePath = path.join(root, "fixture/synthetic-topology.json");
const contract = JSON.parse(fs.readFileSync(path.join(root, "contracts/route-contract.json"), "utf8"));
const fixtureText = fs.readFileSync(fixturePath, "utf8");
const fixture = JSON.parse(fixtureText);
const reportPath = path.resolve(process.argv[2] ?? path.join(root, "reports/route-audit.json"));
const markdownPath = path.resolve(process.argv[3] ?? path.join(root, "reports/route-audit.md"));

function fail(code, message) {
  console.error(`FAIL ${code}: ${message}`);
  process.exit(code);
}

let report;
let markdown;
try {
  report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  markdown = fs.readFileSync(markdownPath, "utf8");
} catch (error) {
  fail(101, `report missing or invalid: ${error.message}`);
}

const fixtureHash = crypto.createHash("sha256").update(fixtureText).digest("hex");
if (fixtureHash !== contract.fixture_sha256 || report.fixture_id !== fixture.fixture_id) {
  fail(101, "frozen fixture hash or fixture id mismatch");
}

const trace = report.observed_trace ?? [];
if (trace.some((step) => /channel.*->node|node.*->channel/i.test(step))) {
  fail(101, "channel bypasses Gateway or connects directly to Node");
}
if (trace.length !== fixture.expected_trace.length || trace.some((step, index) => step !== fixture.expected_trace[index])) {
  fail(101, "observed trace does not match the complete expected Gateway route");
}

const forbiddenNodeOwnership = new Set(contract.node_forbidden_ownership);
if (report.node_role !== "node" || (report.node_owns ?? []).some((item) => forbiddenNodeOwnership.has(item))) {
  fail(102, "Node impersonates Gateway or owns Gateway state");
}
if (!contract.required_gateway_ownership.every((item) => (report.gateway_owns ?? []).includes(item))) {
  fail(102, "Gateway ownership is incomplete");
}

if (report.operator_role !== "operator" || !(report.operator_scopes ?? []).includes(contract.required_operator_scope)) {
  fail(103, "operator role or scope does not authorize the relay");
}
if (report.device_paired !== true || report.approved_command !== contract.required_node_command) {
  fail(103, "device pairing or approved Node capability is missing");
}

if (report.remote_exposure?.bind !== "loopback" && report.remote_exposure?.auth_present !== true) {
  fail(104, "non-loopback bind has no valid auth path");
}
if (report.remote_exposure?.secure_transport !== true) {
  fail(104, "remote transport is marked insecure");
}

if (report.transport !== contract.required_transport || report.legacy_bridge_current === true) {
  fail(105, "removed bridge is current or Gateway WebSocket transport is absent");
}
if (report.synthetic_only !== true || report.verdict !== "accept-current-gateway-ws-route") {
  fail(105, "report does not preserve the synthetic/current-route boundary");
}

const combined = `${JSON.stringify(report)}\n${markdown}`;
for (const source of contract.privacy_forbid_regex) {
  if (new RegExp(source, "i").test(combined)) {
    fail(104, `privacy pattern present in report: ${source}`);
  }
}

if (!/Channel does not connect directly to Node/i.test(markdown) ||
    !/legacy TCP bridge is not current transport/i.test(markdown) ||
    !/No live OpenClaw was contacted/i.test(markdown) ||
    !/deterministic validator is authoritative/i.test(markdown)) {
  fail(105, "Markdown report omits a required architecture or proof boundary");
}

console.log("PASS valid 0: synthetic route matches current Gateway WebSocket contract");
console.log(`PASS fixture hash: ${fixtureHash}`);
console.log("PASS ownership: Gateway authoritative; Node capability-only");
console.log("PASS access gates: operator.write + device pairing + camera.capture approval");
console.log("PASS exposure: loopback/auth/secure transport");
console.log("PASS legacy boundary: TCP bridge is historical only");
