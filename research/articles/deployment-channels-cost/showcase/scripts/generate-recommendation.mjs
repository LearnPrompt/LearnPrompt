#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixturePath = path.join(root, "fixture/deployment-workload.json");
const fixtureText = fs.readFileSync(fixturePath, "utf8");
const fixture = JSON.parse(fixtureText);
const { workload: w, pricing_assumptions: p, budget } = fixture;

const round = (value) => Number(value.toFixed(4));
const monthlyRequests = w.requests_per_day * w.days_per_month;
const common = {
  model_input: round(monthlyRequests * w.input_tokens_per_request / 1_000_000 * p.input_per_million),
  model_output: round(monthlyRequests * w.output_tokens_per_request / 1_000_000 * p.output_per_million),
  tool: round(monthlyRequests * w.tool_calls_per_request * p.tool_per_call),
  media: round(w.media_calls_per_day * w.days_per_month * p.media_per_call),
};
const variableSubtotal = round(Object.values(common).reduce((sum, value) => sum + value, 0));
const optionalSubtotal = round(p.channel_plugin_monthly + p.egress_observability_monthly);

function compatible(candidate) {
  if (w.availability_required === "24/7" && candidate.availability !== "24/7") return false;
  if (w.persistence_required && !candidate.persistent_state) return false;
  if (w.local_device_required && !candidate.local_device_access) return false;
  if (candidate.max_concurrency < w.peak_concurrency) return false;
  if (w.exposure === "public-reverse-proxy" && candidate.exposure !== "public-reverse-proxy") return false;
  return true;
}

const evaluated = fixture.candidates.map((candidate) => ({
  ...candidate,
  compatible: compatible(candidate),
  monthly_total: round(candidate.fixed_infra_monthly + variableSubtotal + optionalSubtotal),
}));
const selected = evaluated
  .filter((candidate) => candidate.compatible)
  .sort((a, b) => a.monthly_total - b.monthly_total)[0];
if (!selected) throw new Error("No candidate satisfies the frozen workload");

const perRunModelAndTools = round(
  w.input_tokens_per_request / 1_000_000 * p.input_per_million
  + w.output_tokens_per_request / 1_000_000 * p.output_per_million
  + w.tool_calls_per_request * p.tool_per_call,
);
const report = {
  fixture_id: fixture.fixture_id,
  fixture_sha256: crypto.createHash("sha256").update(fixtureText).digest("hex"),
  generated_at: fixture.as_of,
  status: "accept",
  selected_candidate: selected.id,
  rationale: "Meets 24/7 availability, persistence, public exposure/auth/channel-policy constraints and has the lowest replayed total among compatible candidates.",
  cost_assumptions_are_examples: true,
  provider_invoice: false,
  decision_requirements: {
    availability_required: w.availability_required,
    persistence_required: w.persistence_required,
    local_device_required: w.local_device_required,
    trust_boundary: w.trust_boundary,
  },
  security: {
    exposure: w.exposure,
    gateway_auth: w.gateway_auth,
    dm_policy: w.dm_policy,
    group_policy: w.group_policy,
    secret_handling: "SecretRef plus clean audit and documented rotation; no plaintext in reports",
  },
  channel_health: {
    mode: "live-probe-required",
    command: "openclaw channels status --probe",
    config_only_is_healthy: false,
  },
  acceptance_commands: [
    "openclaw gateway status --require-rpc",
    "openclaw channels status --probe",
    "openclaw health --json",
    "openclaw doctor",
  ],
  inputs: {
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
  },
  monthly_cost: {
    currency: p.currency,
    monthly_requests: monthlyRequests,
    fixed_infra: selected.fixed_infra_monthly,
    ...common,
    variable_subtotal: variableSubtotal,
    channel_plugin: p.channel_plugin_monthly,
    egress_observability: p.egress_observability_monthly,
    optional_subtotal: optionalSubtotal,
    total: selected.monthly_total,
    monthly_cap: budget.monthly_cap,
    headroom: round(budget.monthly_cap - selected.monthly_total),
  },
  per_run: {
    model_and_tools: perRunModelAndTools,
    cap: budget.per_run_cap,
  },
  budget_controls: {
    monthly_cap: budget.monthly_cap,
    per_run_cap: budget.per_run_cap,
    rate_limit_rpm: budget.rate_limit_rpm,
    concurrency_limit: budget.concurrency_limit,
    fallback: budget.fallback,
    kill_switch: budget.kill_switch,
  },
  candidates: evaluated.map(({ id, compatible: ok, monthly_total: total, availability, persistent_state, exposure, max_concurrency }) => ({
    id, compatible: ok, monthly_total: total, availability, persistent_state, exposure, max_concurrency,
  })),
};

fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(path.join(root, "reports/deployment-recommendation.json"), `${JSON.stringify(report, null, 2)}\n`);
const markdown = `# Synthetic deployment recommendation\n\n- Status: accept\n- Selected: ${report.selected_candidate}\n- Example monthly total: ${p.currency} ${report.monthly_cost.total.toFixed(2)}\n- Monthly cap: ${p.currency} ${budget.monthly_cap.toFixed(2)}\n- Provider invoice: no; all prices are replaceable example assumptions.\n- Channel health: live probe required; config-only is insufficient.\n- No deployment, account connection, credential read, or external side effect occurred.\n`;
fs.writeFileSync(path.join(root, "reports/deployment-recommendation.md"), markdown);
console.log(JSON.stringify({ status: report.status, selected: report.selected_candidate, total: report.monthly_cost.total, fixture_sha256: report.fixture_sha256 }, null, 2));
