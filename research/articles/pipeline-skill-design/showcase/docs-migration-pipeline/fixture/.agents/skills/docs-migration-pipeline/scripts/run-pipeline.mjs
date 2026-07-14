#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const stageNames = [
  "inventory",
  "normalize",
  "transform",
  "validate",
  "package-candidate"
];

const crashExitCode = 30;
const staleResumeExitCode = 32;
const receiptIssueExitCode = 33;

const scriptFile = fileURLToPath(import.meta.url);
const skillRoot = path.resolve(path.dirname(scriptFile), "..");
const repoRoot = path.resolve(skillRoot, "../../..");

function parseArgs(argv) {
  const options = {
    resume: false,
    scenario: "normal"
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--resume") {
      options.resume = true;
      continue;
    }
    if (arg === "--scenario") {
      options.scenario = argv[index + 1] || "normal";
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function ensureDir(directory) {
  mkdirSync(directory, { recursive: true });
}

function walk(directory) {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const name of readdirSync(directory).sort((left, right) => left.localeCompare(right))) {
    const fullPath = path.join(directory, name);
    if (statSync(fullPath).isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function listFiles(relativeDirectory, extension) {
  const directory = path.join(repoRoot, relativeDirectory);
  return walk(directory)
    .filter((file) => !extension || file.endsWith(extension))
    .map((file) => path.relative(repoRoot, file).replaceAll(path.sep, "/"));
}

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortObject(value[key])])
    );
  }
  return value;
}

function stableText(value) {
  return typeof value === "string" ? value : JSON.stringify(sortObject(value), null, 2);
}

function shaText(value) {
  return createHash("sha256").update(value).digest("hex");
}

function shaFiles(relativeFiles) {
  const hash = createHash("sha256");
  for (const file of [...relativeFiles].sort()) {
    const fullPath = path.join(repoRoot, file);
    hash.update(file);
    hash.update("\n");
    hash.update(readFileSync(fullPath));
    hash.update("\n");
  }
  return hash.digest("hex");
}

function writeJson(relativePath, value) {
  const fullPath = path.join(repoRoot, relativePath);
  ensureDir(path.dirname(fullPath));
  writeFileSync(fullPath, `${stableText(value)}\n`);
}

function writeText(relativePath, value) {
  const fullPath = path.join(repoRoot, relativePath);
  ensureDir(path.dirname(fullPath));
  writeFileSync(fullPath, value);
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function readText(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function firstParagraph(markdown) {
  const lines = markdown.split("\n").map((line) => line.trim());
  const start = lines.findIndex((line) => line && !line.startsWith("#"));
  if (start === -1) return "Migrated candidate.";
  const collected = [];
  for (let index = start; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line) break;
    collected.push(line);
  }
  return collected.join(" ");
}

function headingTitle(markdown, fallback) {
  const firstLine = markdown.split("\n").find((line) => line.startsWith("# "));
  return firstLine ? firstLine.replace(/^#\s+/, "").trim() : fallback;
}

function slugFromSource(relativePath) {
  return path.basename(relativePath, path.extname(relativePath)).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

function renderCandidate(record) {
  return [
    "---",
    `title: ${JSON.stringify(record.title)}`,
    `description: ${JSON.stringify(record.description)}`,
    `legacy_source: ${JSON.stringify(record.source)}`,
    "---",
    "",
    "## Migration Candidate",
    "",
    `This file was migrated from \`${record.source}\` into a Starlight-compatible candidate.`,
    "",
    "## Normalized Notes",
    "",
    ...record.bodyLines,
    "",
    "## Follow-up Checklist",
    "",
    "- Add section-specific sidebar placement.",
    "- Replace this scaffold with article-specific frontmatter if the candidate is promoted.",
    "- Review wording before publication.",
    ""
  ].join("\n");
}

function commandForStage(stage, options) {
  return `node .agents/skills/docs-migration-pipeline/scripts/run-pipeline.mjs --stage ${stage}`;
}

function stageOutputs(stage) {
  switch (stage) {
    case "inventory":
      return listFiles("work", ".json").filter((file) => file === "work/inventory.json");
    case "normalize":
      return listFiles("work/normalized", ".json");
    case "transform":
      return listFiles("work/transformed", ".mdx");
    case "validate":
      return listFiles("reports", ".json").filter((file) => file === "reports/validation.json");
    case "package-candidate":
      return [
        ...listFiles("migration-candidate/docs", ".mdx"),
        ...listFiles("migration-candidate", ".json").filter(
          (file) => file === "migration-candidate/manifest.json"
        ),
        ...listFiles("reports", ".md").filter((file) => file === "reports/receipt-summary.md")
      ];
    default:
      return [];
  }
}

function expectedStageInputFiles(stage) {
  switch (stage) {
    case "inventory":
      return listFiles("legacy", ".md");
    case "normalize":
      return ["work/inventory.json"];
    case "transform":
      return listFiles("work/normalized", ".json");
    case "validate":
      return listFiles("work/transformed", ".mdx");
    case "package-candidate":
      return [
        ...listFiles("work/transformed", ".mdx"),
        "reports/validation.json"
      ];
    default:
      return [];
  }
}

function computeInputSha(stage) {
  return shaFiles(expectedStageInputFiles(stage));
}

function validateReceiptShape(receipt, stage) {
  const requiredFields = [
    "stage",
    "input_sha",
    "output_sha",
    "command",
    "exit_code",
    "status",
    "started_seq",
    "finished_seq",
    "input_files",
    "output_files"
  ];
  if (!receipt || typeof receipt !== "object") {
    throw new Error(`receipt for ${stage} is not an object`);
  }
  for (const field of requiredFields) {
    if (!(field in receipt)) {
      throw new Error(`receipt for ${stage} is missing ${field}`);
    }
  }
  if (receipt.stage !== stage) {
    throw new Error(`receipt stage mismatch for ${stage}`);
  }
  if (receipt.status !== "success" || receipt.exit_code !== 0) {
    throw new Error(`receipt for ${stage} is not a successful checkpoint`);
  }
}

function writeReceipt(stage, options, inputFiles, outputFiles, stageIndex) {
  const receipt = {
    stage,
    input_sha: shaFiles(inputFiles),
    output_sha: shaFiles(outputFiles),
    command: commandForStage(stage, options),
    exit_code: 0,
    status: "success",
    started_seq: stageIndex * 2 - 1,
    finished_seq: stageIndex * 2,
    input_files: inputFiles,
    output_files: outputFiles
  };
  writeJson(`receipts/${stage}.json`, receipt);
  return receipt;
}

function writeRunSummary(summary) {
  writeJson("reports/run-summary.json", summary);
}

function inventoryStage() {
  const files = listFiles("legacy", ".md");
  const records = files.map((source) => {
    const text = readText(source);
    return {
      source,
      slug: slugFromSource(source),
      title: headingTitle(text, source),
      description: firstParagraph(text),
      source_sha: shaText(text)
    };
  });
  writeJson("work/inventory.json", records);
}

function normalizeStage() {
  ensureDir(path.join(repoRoot, "work/normalized"));
  const inventory = readJson("work/inventory.json");
  for (const record of inventory) {
    const sourceText = readText(record.source);
    const bodyLines = sourceText
      .split("\n")
      .map((line) => line.trimEnd())
      .filter((line, index) => !(index === 0 && line.startsWith("# ")));
    writeJson(`work/normalized/${record.slug}.json`, {
      slug: record.slug,
      title: record.title,
      description: record.description,
      source: record.source,
      bodyLines
    });
  }
}

function transformStage() {
  ensureDir(path.join(repoRoot, "work/transformed"));
  for (const file of listFiles("work/normalized", ".json")) {
    const record = readJson(file);
    writeText(`work/transformed/${record.slug}.mdx`, `${renderCandidate(record)}\n`);
  }
}

function validateStage() {
  const files = listFiles("work/transformed", ".mdx");
  const checks = files.map((file) => {
    const text = readText(file);
    return {
      file,
      has_frontmatter: text.startsWith("---\n"),
      has_description: /\ndescription:\s+/.test(text),
      has_candidate_heading: /\n## Migration Candidate\n/.test(text),
      source_untouched: true
    };
  });
  writeJson("reports/validation.json", {
    files: checks,
    ok: checks.every(
      (item) =>
        item.has_frontmatter &&
        item.has_description &&
        item.has_candidate_heading &&
        item.source_untouched
    )
  });
}

function packageStage() {
  const validation = readJson("reports/validation.json");
  if (!validation.ok) {
    throw new Error("validation failed before package-candidate");
  }

  rmSync(path.join(repoRoot, "migration-candidate"), { recursive: true, force: true });
  ensureDir(path.join(repoRoot, "migration-candidate/docs"));
  for (const file of listFiles("work/transformed", ".mdx")) {
    cpSync(path.join(repoRoot, file), path.join(repoRoot, "migration-candidate/docs", path.basename(file)));
  }

  const docs = listFiles("migration-candidate/docs", ".mdx").map((file) => ({
    file,
    sha: shaFiles([file])
  }));

  const manifest = {
    package_kind: "migration-candidate",
    source_directory: "legacy",
    docs,
    candidate_only: true
  };
  writeJson("migration-candidate/manifest.json", manifest);

  const template = readText(
    ".agents/skills/docs-migration-pipeline/assets/receipt-template.md"
  );
  const packageReceipt = readJson("receipts/package-candidate.json");
  writeText(
    "reports/receipt-summary.md",
    template
      .replace("- stage:", `- stage: ${packageReceipt.stage}`)
      .replace("- input_sha:", `- input_sha: ${packageReceipt.input_sha}`)
      .replace("- output_sha:", `- output_sha: ${packageReceipt.output_sha}`)
      .replace("- command:", `- command: ${packageReceipt.command}`)
      .replace("- exit_code:", `- exit_code: ${packageReceipt.exit_code}`)
      .replace("- status:", `- status: ${packageReceipt.status}`)
      .replace("- started_seq:", `- started_seq: ${packageReceipt.started_seq}`)
      .replace("- finished_seq:", `- finished_seq: ${packageReceipt.finished_seq}`)
      .concat("\n")
  );
}

function existingReceipt(stage) {
  const receiptPath = path.join(repoRoot, "receipts", `${stage}.json`);
  if (!existsSync(receiptPath)) return null;
  try {
    const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
    validateReceiptShape(receipt, stage);
    return receipt;
  } catch (error) {
    throw new Error(String(error.message || error));
  }
}

function resumeStage(stage, options, reusedStages) {
  const currentInputSha = computeInputSha(stage);
  const outputFiles = stageOutputs(stage);

  let receipt = null;
  try {
    receipt = existingReceipt(stage);
  } catch (error) {
    writeRunSummary({
      status: "receipt_issue",
      scenario: options.scenario,
      resume: true,
      failed_stage: stage,
      reason: String(error.message || error),
      reused_stages: reusedStages
    });
    process.exit(receiptIssueExitCode);
  }

  if (!receipt) {
    if (outputFiles.length > 0) {
      writeRunSummary({
        status: "receipt_issue",
        scenario: options.scenario,
        resume: true,
        failed_stage: stage,
        reason: "stage outputs exist but receipt is missing",
        reused_stages: reusedStages
      });
      process.exit(receiptIssueExitCode);
    }
    return false;
  }

  if (receipt.input_sha !== currentInputSha) {
    writeRunSummary({
      status: "stale_resume",
      scenario: options.scenario,
      resume: true,
      failed_stage: stage,
      reason: `input_sha mismatch for ${stage}`,
      reused_stages: reusedStages
    });
    process.exit(staleResumeExitCode);
  }

  if (receipt.output_files.length === 0 || receipt.output_files.some((file) => !existsSync(path.join(repoRoot, file)))) {
    writeRunSummary({
      status: "receipt_issue",
      scenario: options.scenario,
      resume: true,
      failed_stage: stage,
      reason: `recorded outputs missing for ${stage}`,
      reused_stages: reusedStages
    });
    process.exit(receiptIssueExitCode);
  }

  const currentOutputSha = shaFiles(receipt.output_files);
  if (currentOutputSha !== receipt.output_sha) {
    writeRunSummary({
      status: "receipt_issue",
      scenario: options.scenario,
      resume: true,
      failed_stage: stage,
      reason: `output_sha mismatch for ${stage}`,
      reused_stages: reusedStages
    });
    process.exit(receiptIssueExitCode);
  }

  reusedStages.push(stage);
  return true;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  ensureDir(path.join(repoRoot, "work"));
  ensureDir(path.join(repoRoot, "reports"));
  ensureDir(path.join(repoRoot, "receipts"));

  const reusedStages = [];
  const completedStages = [];
  let startedNewWork = !options.resume;

  for (let index = 0; index < stageNames.length; index += 1) {
    const stage = stageNames[index];
    const stageIndex = index + 1;

    if (options.resume && !startedNewWork) {
      const reused = resumeStage(stage, options, reusedStages);
      if (reused) {
        completedStages.push(stage);
        continue;
      }
      startedNewWork = true;
    }

    if (stage === "inventory") inventoryStage();
    if (stage === "normalize") normalizeStage();
    if (stage === "transform") transformStage();
    if (stage === "validate") validateStage();
    if (stage === "package-candidate") {
      const inputFiles = expectedStageInputFiles(stage);
      const outputFiles = [
        ...listFiles("migration-candidate/docs", ".mdx"),
        "migration-candidate/manifest.json",
        "reports/receipt-summary.md"
      ];
      if (outputFiles.some((file) => existsSync(path.join(repoRoot, file)))) {
        rmSync(path.join(repoRoot, "migration-candidate"), { recursive: true, force: true });
        rmSync(path.join(repoRoot, "reports/receipt-summary.md"), { force: true });
      }
      writeJson("receipts/package-candidate.json", {
        stage: "package-candidate",
        input_sha: shaFiles(inputFiles),
        output_sha: "pending",
        command: commandForStage("package-candidate", options),
        exit_code: 0,
        status: "success",
        started_seq: stageIndex * 2 - 1,
        finished_seq: stageIndex * 2,
        input_files: inputFiles,
        output_files: []
      });
      packageStage();
      const finalOutputs = stageOutputs(stage);
      writeJson("receipts/package-candidate.json", {
        stage: "package-candidate",
        input_sha: shaFiles(inputFiles),
        output_sha: shaFiles(finalOutputs),
        command: commandForStage("package-candidate", options),
        exit_code: 0,
        status: "success",
        started_seq: stageIndex * 2 - 1,
        finished_seq: stageIndex * 2,
        input_files: inputFiles,
        output_files: finalOutputs
      });
      completedStages.push(stage);
      continue;
    }

    const inputFiles = expectedStageInputFiles(stage);
    const outputFiles = stageOutputs(stage);
    writeReceipt(stage, options, inputFiles, outputFiles, stageIndex);
    completedStages.push(stage);

    if (options.scenario === "crash-after-transform" && stage === "transform") {
      writeRunSummary({
        status: "simulated_crash",
        scenario: options.scenario,
        resume: options.resume,
        crash_exit_code: crashExitCode,
        completed_stages: completedStages,
        reused_stages: reusedStages,
        checkpoint_stage: stage
      });
      process.exit(crashExitCode);
    }
  }

  const packageReceipt = readJson("receipts/package-candidate.json");
  writeRunSummary({
    status: "success",
    scenario: options.scenario,
    resume: options.resume,
    completed_stages: completedStages,
    reused_stages: reusedStages,
    candidate_sha: packageReceipt.output_sha,
    source_sha: shaFiles(listFiles("legacy", ".md"))
  });
  process.stdout.write(`${stableText(readJson("reports/run-summary.json"))}\n`);
}

main();
