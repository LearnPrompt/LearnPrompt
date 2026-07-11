#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

export function evaluateCloudFit(task, environment) {
  const localFiles = task.host_dependencies?.local_files ?? [];
  const browserLogin = task.host_dependencies?.browser_login === true;
  const localApps = task.host_dependencies?.local_apps ?? [];
  const hasAcceptanceCommand =
    typeof task.acceptance_command === "string" &&
    task.acceptance_command.trim().length > 0;
  const directionFrozen =
    task.direction_status === "frozen" &&
    typeof task.expected_fix === "string" &&
    task.expected_fix.trim().length > 0;
  const cleanCheckoutReady =
    task.requires_clean_checkout === true &&
    environment.checkout_mode === "selected-branch-or-commit" &&
    environment.agent_phase?.home === "clean-temp-home";
  const repoContained =
    localFiles.length === 0 &&
    browserLogin === false &&
    localApps.length === 0 &&
    (task.requires_secret_names ?? []).length === 0 &&
    task.requires_agent_internet === false;

  const gateChecks = {
    repo_contained: repoContained,
    deterministic: directionFrozen,
    clean_checkout: cleanCheckoutReady,
    acceptance_command: hasAcceptanceCommand,
    agent_network_off: environment.agent_phase?.internet_access === "off",
    agent_has_no_secrets: environment.agent_phase?.secrets_available === false,
  };

  let exitCode = 0;
  let reason = "task is suitable for a Codex Cloud handoff";

  if (localFiles.some((value) => value.includes("Keychains"))) {
    exitCode = 21;
    reason = "host-only local file dependency: ~/Library/Keychains";
  } else if (browserLogin) {
    exitCode = 22;
    reason = "browser login state dependency";
  } else if (!hasAcceptanceCommand) {
    exitCode = 23;
    reason = "missing acceptance command";
  } else if (!directionFrozen) {
    exitCode = 24;
    reason = "task direction is not frozen";
  } else if (!cleanCheckoutReady || !repoContained) {
    exitCode = 25;
    reason = "task still depends on state outside a clean checkout";
  } else if (
    environment.agent_phase?.internet_access !== "off" ||
    environment.agent_phase?.secrets_available !== false
  ) {
    exitCode = 26;
    reason = "environment contract does not match the intended cloud boundary";
  }

  return {
    scenario_id: task.scenario_id,
    decision: exitCode === 0 ? "accept" : "reject",
    exit_code: exitCode,
    reason,
    gate_checks: gateChecks,
  };
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || !value) {
      throw new Error(
        "Usage: cloud-fit-gate.mjs --task <task.json> --env <environment.json> [--json true]",
      );
    }
    values[key.slice(2)] = value;
  }
  return values;
}

function formatText(result) {
  const lines = [
    `scenario=${result.scenario_id}`,
    `decision=${result.decision}`,
    `exit_code=${result.exit_code}`,
    `reason=${result.reason}`,
  ];

  for (const [name, passed] of Object.entries(result.gate_checks)) {
    lines.push(`${name}=${passed ? "pass" : "fail"}`);
  }

  return lines.join("\n");
}

const scriptFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === scriptFile) {
  const args = parseArgs(process.argv.slice(2));
  const task = readJson(args.task);
  const environment = readJson(args.env);
  const result = evaluateCloudFit(task, environment);

  if (args.json === "true") {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    process.stdout.write(`${formatText(result)}\n`);
  }

  process.exit(result.exit_code);
}
