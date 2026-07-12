#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixtureText = fs.readFileSync(path.join(root, "fixture/deployment-workload.json"), "utf8");
const fixture = JSON.parse(fixtureText);
const reportPath = path.resolve(process.argv[2] ?? path.join(root, "reports/deployment-recommendation.json"));
const markdownPath = path.resolve(process.argv[3] ?? path.join(root, "reports/deployment-recommendation.md"));
const reportText = fs.readFileSync(reportPath, "utf8");
const markdown = fs.readFileSync(markdownPath, "utf8");
const report = JSON.parse(reportText);
const expectedFixtureHash = "4cf82e987c89769cb648b647ea9fca0aa1732fc685a7fabb9f2a01a6c139bdc3";

function reject(code, message) {
  console.error(`FAIL ${code}: ${message}`);
  process.exit(code);
}
function near(actual, expected) {
  return Math.abs(Number(actual) - Number(expected)) < 0.0001;
}

const actualHash = crypto.createHash("sha256").update(fixtureText).digest("hex");
if (actualHash !== expectedFixtureHash || report.fixture_sha256 !== actualHash || report.fixture_id !== fixture.fixture_id) {
  reject(113, "fixture hash/id does not match the frozen workload");
}

const requirements = report.decision_requirements ?? {};
if (!requirements.availability_required || requirements.persistence_required !== true) {
  reject(111, "availability or persistence assumption is missing");
}

const security = report.security ?? {};
const publicExposure = /public|non-loopback/i.test(security.exposure ?? "");
if (
  (publicExposure && !/token|password|trusted-proxy/i.test(security.gateway_auth ?? ""))
  || /open/i.test(security.dm_policy ?? "")
  || /open/i.test(security.group_policy ?? "")
) {
  reject(112, "public exposure lacks auth or inbound channel policy is open");
}

const combined = `${reportText}\n${markdown}`;
const sensitivePatterns = [
  /\bs[k]-[A-Za-z0-9_-]{16,}/i,
  /\bgh[pousr]_[A-Za-z0-9]{20,}/i,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
  /\baccount[_ -]?id\b\s*[:=]\s*[A-Za-z0-9_-]{8,}/i,
];
if (sensitivePatterns.some((pattern) => pattern.test(combined))) {
  reject(114, "credential or account identifier appears in recommendation");
}
if (
  report.channel_health?.mode !== "live-probe-required"
  || report.channel_health?.command !== "openclaw channels status --probe"
  || report.channel_health?.config_only_is_healthy !== false
) {
  reject(114, "channel health does not require the live probe contract");
}

const controls = report.budget_controls ?? {};
if (
  !(controls.monthly_cap > 0)
  || !(controls.per_run_cap > 0)
  || !(controls.rate_limit_rpm > 0)
  || controls.concurrency_limit !== fixture.workload.peak_concurrency
  || !controls.fallback
  || controls.kill_switch !== true
) {
  reject(115, "budget cap, rate/concurrency limit, fallback, or kill switch is missing");
}

const w = fixture.workload;
const p = fixture.pricing_assumptions;
const i = report.inputs ?? {};
const requiredInputs = [
  "input_tokens_per_request", "output_tokens_per_request", "tool_calls_per_request", "media_calls_per_day", "peak_concurrency",
  "input_per_million", "output_per_million", "tool_per_call", "media_per_call",
];
if (requiredInputs.some((key) => i[key] === undefined) || report.provider_invoice !== false || report.cost_assumptions_are_examples !== true) {
  reject(113, "variable cost inputs or provider-invoice boundary is missing");
}
const expectedInputs = {
  requests_per_day: w.requests_per_day,
  days_per_month: w.days_per_month,
  input_tokens_per_request: w.input_tokens_per_request,
  output_tokens_per_request: w.output_tokens_per_request,
  tool_calls_per_request: w.tool_calls_per_request,
  media_calls_per_day: w.media_calls_per_day,
  peak_concurrency: w.peak_concurrency,
  input_per_million: p.input_per_million,
  output_per_million: p.output_per_million,
  tool_per_call: p.tool_per_call,
  media_per_call: p.media_per_call,
};
if (Object.entries(expectedInputs).some(([key, value]) => !near(i[key], value))) {
  reject(113, "reported workload or pricing inputs differ from the frozen fixture");
}
const selected = fixture.candidates.find((candidate) => candidate.id === report.selected_candidate);
if (!selected) reject(113, "selected candidate is not in fixture");
if (selected.max_concurrency < w.peak_concurrency) reject(113, "selected candidate cannot satisfy peak concurrency");
const requests = w.requests_per_day * w.days_per_month;
const input = requests * w.input_tokens_per_request / 1_000_000 * p.input_per_million;
const output = requests * w.output_tokens_per_request / 1_000_000 * p.output_per_million;
const tool = requests * w.tool_calls_per_request * p.tool_per_call;
const media = w.media_calls_per_day * w.days_per_month * p.media_per_call;
const variable = input + output + tool + media;
const optional = p.channel_plugin_monthly + p.egress_observability_monthly;
const total = selected.fixed_infra_monthly + variable + optional;
const cost = report.monthly_cost ?? {};
const formulaChecks = [
  [cost.monthly_requests, requests], [cost.fixed_infra, selected.fixed_infra_monthly],
  [cost.model_input, input], [cost.model_output, output], [cost.tool, tool], [cost.media, media],
  [cost.variable_subtotal, variable], [cost.optional_subtotal, optional], [cost.total, total],
];
if (formulaChecks.some(([actual, expected]) => !near(actual, expected))) {
  reject(113, "monthly cost formula is not replayable from frozen inputs");
}
if (report.status !== "accept" || report.selected_candidate !== "vps-container" || !(cost.total <= controls.monthly_cap)) {
  reject(113, "selection does not match hard constraints and budget formula");
}

console.log("PASS valid 0: recommendation matches workload, trust boundary, and budget formula");
console.log(`PASS fixture hash: ${actualHash}`);
console.log("PASS total: 80.24; selected: vps-container; provider_invoice: false");
