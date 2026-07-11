#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EXIT_CODES = {
  OK: 0,
  MISSING_REQUIRED_FIELD: 21,
  VERIFY_FAILED: 23,
  MISSING_APPROVAL: 31,
};

const REQUIRED_ITEM_FIELDS = [
  "id",
  "title",
  "source_url",
  "published_at",
  "summary",
  "tags",
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FIXTURES_DIR = path.join(ROOT, "fixtures");
const RESULTS_DIR = path.join(ROOT, "results");
const REPORT_DATE = "2026-07-11";
const REPORT_SLUG = `${REPORT_DATE}-dual-source-ai-weekly`;

const SCENARIOS = {
  success: {
    name: "success",
    sources: [
      "source-anthropic.snapshot.json",
      "source-openai.snapshot.json",
    ],
    approval: "approval-approved.json",
  },
  "verify-failed": {
    name: "verify-failed",
    sources: [
      "source-anthropic.snapshot.json",
      "source-openai.snapshot.json",
    ],
    approval: "approval-approved.json",
    draft_tamper: {
      type: "replace-source-url",
      target_id: "openai-codex-cli",
      replacement: "https://invalid.local/verify-failed-contract-breach",
    },
  },
  "missing-source-field": {
    name: "missing-source-field",
    sources: [
      "source-anthropic.snapshot.json",
      "source-openai-missing-source-url.snapshot.json",
    ],
    approval: "approval-approved.json",
  },
  "no-approval": {
    name: "no-approval",
    sources: [
      "source-anthropic.snapshot.json",
      "source-openai.snapshot.json",
    ],
    approval: null,
  },
};

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function stageSummary(stage, status, details) {
  return { stage, status, ...details };
}

async function ensureCleanOutput(directory) {
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
}

async function writeJson(file, data) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function writeText(file, text) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, text, "utf8");
}

function scoreItem(item) {
  let score = 0;
  const reasons = [];
  const tags = new Set(item.tags);

  if (tags.has("claude-code") || tags.has("codex")) {
    score += 35;
    reasons.push("命中核心 AI coding 工具主题");
  }
  if (
    tags.has("workflow") ||
    tags.has("hooks") ||
    tags.has("permissions") ||
    tags.has("verification")
  ) {
    score += 25;
    reasons.push("直接解释工作流、门禁或验证机制");
  }
  if (tags.has("docs")) {
    score += 10;
    reasons.push("来源是官方文档快照，适合做本周基线");
  }
  if (tags.has("syndicated")) {
    score -= 15;
    reasons.push("来源是转载型快照，作为辅助证据而非主条目");
  }

  score += item.importance * 10;
  reasons.push(`人工重要度=${item.importance}`);

  return {
    ...item,
    score,
    selection_reason: reasons.join("；"),
  };
}

function renderDraft(selectedItems) {
  const lines = [
    `# 双来源 AI 周报草稿（${REPORT_DATE}）`,
    "",
    "状态：draft",
    "说明：本文件是离线回放生成的草稿，未外发，只有在 approve 阶段收到人工批准工件后才会进入本地 publish-candidate。",
    "",
    "## 本周入选条目",
    "",
  ];

  for (const item of selectedItems) {
    lines.push(`### ${item.title}`);
    lines.push(`- source_url: ${item.source_url}`);
    lines.push(`- 来源快照: ${item.snapshot_source}`);
    lines.push(`- 发布时间: ${item.published_at}`);
    lines.push(`- 筛选理由: ${item.selection_reason}`);
    lines.push(`- 摘要: ${item.summary}`);
    lines.push("");
  }

  lines.push("## 编辑提示");
  lines.push("");
  lines.push("- 如果后续要接模型改写，只允许替换“摘要”文本，不允许绕过 source_url、筛选理由、verify 或 approve。");
  lines.push("- publish-candidate 仍只是本地发布候选，不代表已发往外部平台。");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

function tamperDraftIfNeeded(draftText, selectedItems, scenario) {
  if (!scenario.draft_tamper) {
    return { draftText, tamperRecord: null };
  }

  const tamper = scenario.draft_tamper;
  if (
    tamper.type !== "replace-selection-reason" &&
    tamper.type !== "replace-source-url"
  ) {
    throw new Error(`Unsupported draft tamper type: ${tamper.type}`);
  }

  const targetItem = selectedItems.find((item) => item.id === tamper.target_id);
  if (!targetItem) {
    throw new Error(`Draft tamper target not selected: ${tamper.target_id}`);
  }

  const fieldName =
    tamper.type === "replace-selection-reason" ? "selection_reason" : "source_url";
  const originalLine =
    tamper.type === "replace-selection-reason"
      ? `- 筛选理由: ${targetItem.selection_reason}`
      : `- source_url: ${targetItem.source_url}`;
  if (!draftText.includes(originalLine)) {
    throw new Error(`Draft tamper source line missing for: ${tamper.target_id}`);
  }

  const mutatedLine =
    tamper.type === "replace-selection-reason"
      ? `- 筛选理由: ${tamper.replacement}`
      : `- source_url: ${tamper.replacement}`;
  return {
    draftText: draftText.replace(originalLine, mutatedLine),
    tamperRecord: {
      type: tamper.type,
      target_id: tamper.target_id,
      mutated_field: fieldName,
      original_line: originalLine,
      mutated_line: mutatedLine,
    },
  };
}

async function fileExists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const scenarioName = args.scenario ?? "success";
  const scenario = SCENARIOS[scenarioName];

  if (!scenario) {
    console.error(`Unknown scenario: ${scenarioName}`);
    process.exit(64);
  }

  const outputDir = path.join(RESULTS_DIR, scenario.name);
  await ensureCleanOutput(outputDir);

  const state = {
    scenario: scenario.name,
    report_date: REPORT_DATE,
    summary_boundary: "frozen-fixture-summary",
    status: "running",
    stages: [],
  };

  console.log(`RUN scenario=${scenario.name}`);

  const loadedSnapshots = [];
  let snapshotItemCount = 0;
  for (const fixtureName of scenario.sources) {
    const fixturePath = path.join(FIXTURES_DIR, fixtureName);
    const raw = await readFile(fixturePath, "utf8");
    const parsed = JSON.parse(raw);
    loadedSnapshots.push({
      fixture: fixtureName,
      snapshot_id: parsed.snapshot_id,
      source_name: parsed.source_name,
      captured_at: parsed.captured_at,
      sha256: sha256(raw),
      item_count: parsed.items.length,
      items: parsed.items,
    });
    snapshotItemCount += parsed.items.length;
  }

  const snapshotManifest = {
    scenario: scenario.name,
    stage: "snapshot",
    status: "ok",
    source_count: loadedSnapshots.length,
    item_count: snapshotItemCount,
    sources: loadedSnapshots.map((snapshot) => ({
      fixture: snapshot.fixture,
      snapshot_id: snapshot.snapshot_id,
      source_name: snapshot.source_name,
      captured_at: snapshot.captured_at,
      sha256: snapshot.sha256,
      item_count: snapshot.item_count,
    })),
  };
  await writeJson(path.join(outputDir, "snapshot.manifest.json"), snapshotManifest);
  state.stages.push(stageSummary("snapshot", "ok", snapshotManifest));
  console.log(`PASS snapshot sources=${loadedSnapshots.length} items=${snapshotItemCount}`);

  const normalized = [];
  const normalizeErrors = [];

  for (const snapshot of loadedSnapshots) {
    for (const item of snapshot.items) {
      const missingFields = REQUIRED_ITEM_FIELDS.filter((field) => {
        const value = item[field];
        if (Array.isArray(value)) return value.length === 0;
        return value === undefined || value === null || value === "";
      });

      if (missingFields.length > 0) {
        normalizeErrors.push({
          snapshot_id: snapshot.snapshot_id,
          source_name: snapshot.source_name,
          entry_key: item.id ?? "(missing-entry-key)",
          missing_fields: missingFields,
        });
        continue;
      }

      normalized.push({
        ...item,
        snapshot_id: snapshot.snapshot_id,
        snapshot_source: snapshot.source_name,
      });
    }
  }

  if (normalizeErrors.length > 0) {
    const normalizeManifest = {
      scenario: scenario.name,
      stage: "normalize",
      status: "blocked_data_quality",
      normalized_count: normalized.length,
      error_count: normalizeErrors.length,
      reason: "required field missing",
      errors: normalizeErrors,
      no_content: false,
      note: "字段缺失被视为数据质量阻断，不等于今日无内容。",
    };
    await writeJson(path.join(outputDir, "normalize.manifest.json"), normalizeManifest);
    state.status = "blocked_data_quality";
    state.exit_code = EXIT_CODES.MISSING_REQUIRED_FIELD;
    state.stages.push(stageSummary("normalize", "blocked_data_quality", normalizeManifest));
    await writeJson(path.join(outputDir, "pipeline-state.json"), state);
    console.log(
      `FAIL normalize missing_required_field=${normalizeErrors[0].missing_fields.join(",")} entry=${normalizeErrors[0].entry_key}`,
    );
    console.log(`RESULT blocked_data_quality exit=${EXIT_CODES.MISSING_REQUIRED_FIELD}`);
    process.exit(EXIT_CODES.MISSING_REQUIRED_FIELD);
  }

  const normalizeManifest = {
    scenario: scenario.name,
    stage: "normalize",
    status: "ok",
    normalized_count: normalized.length,
    required_fields: REQUIRED_ITEM_FIELDS,
  };
  await writeJson(path.join(outputDir, "normalize.manifest.json"), normalizeManifest);
  state.stages.push(stageSummary("normalize", "ok", normalizeManifest));
  console.log(`PASS normalize normalized=${normalized.length}`);

  const byUrl = new Map();
  const duplicates = [];
  for (const item of normalized) {
    if (!byUrl.has(item.source_url)) {
      byUrl.set(item.source_url, item);
      continue;
    }
    duplicates.push({
      kept_record: byUrl.get(item.source_url).id,
      dropped_record: item.id,
      source_url: item.source_url,
    });
  }

  const deduped = [...byUrl.values()];
  const dedupeManifest = {
    scenario: scenario.name,
    stage: "dedupe",
    status: "ok",
    input_count: normalized.length,
    unique_count: deduped.length,
    duplicate_count: duplicates.length,
    duplicates,
  };
  await writeJson(path.join(outputDir, "dedupe.manifest.json"), dedupeManifest);
  state.stages.push(stageSummary("dedupe", "ok", dedupeManifest));
  console.log(`PASS dedupe unique=${deduped.length} removed=${duplicates.length}`);

  const scored = deduped
    .map(scoreItem)
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title));
  const selected = scored.filter((item) => item.score >= 65).slice(0, 4);

  const scoreManifest = {
    scenario: scenario.name,
    stage: "score",
    status: "ok",
    scored_count: scored.length,
    selected_count: selected.length,
    threshold: 65,
    selected_items: selected.map((item) => ({
      id: item.id,
      title: item.title,
      source_url: item.source_url,
      score: item.score,
      selection_reason: item.selection_reason,
    })),
  };
  await writeJson(path.join(outputDir, "score.manifest.json"), scoreManifest);
  state.stages.push(stageSummary("score", "ok", scoreManifest));
  console.log(`PASS score selected=${selected.length}`);

  const renderedDraft = renderDraft(selected);
  const { draftText, tamperRecord } = tamperDraftIfNeeded(renderedDraft, selected, scenario);
  const draftFile = path.join(outputDir, "drafts", `${REPORT_SLUG}.md`);
  await writeText(draftFile, draftText);
  const draftManifest = {
    scenario: scenario.name,
    stage: "draft",
    status: "ok",
    draft_file: `drafts/${REPORT_SLUG}.md`,
    selected_count: selected.length,
    summary_boundary: "frozen-fixture-summary",
    ...(tamperRecord
      ? {
          post_draft_tamper: {
            ...tamperRecord,
            note: "该场景故意在 verify 之前破坏草稿 contract，用于冻结 VERIFY_FAILED=23。",
          },
        }
      : {}),
  };
  await writeJson(path.join(outputDir, "draft.manifest.json"), draftManifest);
  state.stages.push(stageSummary("draft", "ok", draftManifest));
  console.log(`PASS draft file=drafts/${REPORT_SLUG}.md`);
  if (tamperRecord) {
    console.log(
      `TAMPER draft mutated_field=${tamperRecord.mutated_field} target=${tamperRecord.target_id}`,
    );
  }

  const verifyErrors = [];
  for (const item of selected) {
    if (!draftText.includes(`source_url: ${item.source_url}`)) {
      verifyErrors.push(`draft missing source_url for ${item.id}`);
    }
    if (!draftText.includes(`筛选理由: ${item.selection_reason}`)) {
      verifyErrors.push(`draft missing selection_reason for ${item.id}`);
    }
  }
  if (new Set(selected.map((item) => item.source_url)).size !== selected.length) {
    verifyErrors.push("draft contains duplicate source_url after dedupe");
  }

  if (verifyErrors.length > 0) {
    const verifyManifest = {
      scenario: scenario.name,
      stage: "verify",
      status: "failed_contract",
      error_count: verifyErrors.length,
      errors: verifyErrors,
    };
    await writeJson(path.join(outputDir, "verify.manifest.json"), verifyManifest);
    state.status = "failed_contract";
    state.exit_code = EXIT_CODES.VERIFY_FAILED;
    state.stages.push(stageSummary("verify", "failed_contract", verifyManifest));
    await writeJson(path.join(outputDir, "pipeline-state.json"), state);
    console.log(`FAIL verify error_count=${verifyErrors.length}`);
    console.log(`RESULT failed_contract exit=${EXIT_CODES.VERIFY_FAILED}`);
    process.exit(EXIT_CODES.VERIFY_FAILED);
  }

  const verifyManifest = {
    scenario: scenario.name,
    stage: "verify",
    status: "ok",
    checks: [
      "every selected item keeps source_url",
      "every selected item keeps selection_reason",
      "dedupe removed duplicate source_url before drafting",
    ],
  };
  await writeJson(path.join(outputDir, "verify.manifest.json"), verifyManifest);
  state.stages.push(stageSummary("verify", "ok", verifyManifest));
  console.log("PASS verify fields=source_url+selection_reason");

  const approvalFile = scenario.approval
    ? path.join(FIXTURES_DIR, scenario.approval)
    : null;

  if (!approvalFile || !(await fileExists(approvalFile))) {
    const approveManifest = {
      scenario: scenario.name,
      stage: "approve",
      status: "awaiting_human_approval",
      approval_present: false,
      candidate_created: false,
      reason: "no approval artifact supplied",
      note: "草稿已经生成，但没有人工批准工件，因此不会进入 publish-candidate。",
    };
    await writeJson(path.join(outputDir, "approve.manifest.json"), approveManifest);
    state.status = "awaiting_human_approval";
    state.exit_code = EXIT_CODES.MISSING_APPROVAL;
    state.stages.push(stageSummary("approve", "awaiting_human_approval", approveManifest));
    await writeJson(path.join(outputDir, "pipeline-state.json"), state);
    console.log("BLOCK approve missing_human_approval");
    console.log(`RESULT awaiting_human_approval exit=${EXIT_CODES.MISSING_APPROVAL}`);
    process.exit(EXIT_CODES.MISSING_APPROVAL);
  }

  const approval = JSON.parse(await readFile(approvalFile, "utf8"));
  const candidateText = [
    `# 发布候选（本地）`,
    "",
    `approval_id: ${approval.approval_id}`,
    `approved_by: ${approval.approved_by}`,
    `approved_at: ${approval.approved_at}`,
    "状态：publish-candidate（仅本地候选，未外发）",
    "",
    draftText.trimEnd(),
    "",
  ].join("\n");
  const candidateFile = path.join(outputDir, "publish-candidate", `${REPORT_SLUG}.md`);
  await writeText(candidateFile, candidateText);

  const approveManifest = {
    scenario: scenario.name,
    stage: "approve",
    status: "candidate_ready",
    approval_present: true,
    approval_id: approval.approval_id,
    candidate_created: true,
    candidate_file: `publish-candidate/${REPORT_SLUG}.md`,
    external_publish_triggered: false,
  };
  await writeJson(path.join(outputDir, "approve.manifest.json"), approveManifest);
  state.status = "candidate_ready";
  state.exit_code = EXIT_CODES.OK;
  state.stages.push(stageSummary("approve", "candidate_ready", approveManifest));
  await writeJson(path.join(outputDir, "pipeline-state.json"), state);
  console.log(`PASS approve candidate=publish-candidate/${REPORT_SLUG}.md`);
  console.log(`RESULT candidate_ready exit=${EXIT_CODES.OK}`);
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
