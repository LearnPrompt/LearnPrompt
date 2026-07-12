import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const EXIT = {
  OK: 0,
  EVIDENCE_POOR: 51,
  SENSITIVE: 52,
  PRIVATE_TRANSCRIPT: 53
};

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || !value) {
      throw new Error(
        "Usage: node distill-candidate.mjs --receipts <path> --candidate <path> --summary <path>"
      );
    }
    args[key.slice(2)] = value;
  }
  return args;
}

function loadReceipts(receiptsPath) {
  const resolved = path.resolve(receiptsPath);
  if (!existsSync(resolved)) {
    throw new Error(`Receipts path not found: ${receiptsPath}`);
  }

  const stat = resolved && readdirSync ? null : null;
  try {
    return readdirSync(resolved)
      .filter((name) => name.endsWith(".json"))
      .sort()
      .map((name) => JSON.parse(readFileSync(path.join(resolved, name), "utf8")));
  } catch {
    return [JSON.parse(readFileSync(resolved, "utf8"))];
  }
}

function writeSummary(file, payload) {
  const resolved = path.resolve(file);
  mkdirSync(path.dirname(resolved), { recursive: true });
  writeFileSync(resolved, `${JSON.stringify(payload, null, 2)}\n`);
}

function ensureEvidence(receipt) {
  return Boolean(
    receipt.input_snapshot?.content &&
      receipt.accepted_patch &&
      receipt.user_correction &&
      receipt.validator?.command &&
      receipt.validator?.result_excerpt &&
      receipt.known_limitation
  );
}

function readTemplate(root, name) {
  return readFileSync(path.join(root, "assets", name), "utf8");
}

function writeCandidate(candidateDir, templatesRoot) {
  mkdirSync(path.join(candidateDir, "references"), { recursive: true });
  mkdirSync(path.join(candidateDir, "scripts"), { recursive: true });

  writeFileSync(
    path.join(candidateDir, "SKILL.md"),
    readTemplate(templatesRoot, "skill.template.md").replaceAll("__ORDER_FALLBACK__", "999")
  );
  writeFileSync(
    path.join(candidateDir, "references/frontmatter-contract.md"),
    readTemplate(templatesRoot, "frontmatter-contract.template.md").replaceAll(
      "__ORDER_FALLBACK__",
      "999"
    )
  );
  writeFileSync(
    path.join(candidateDir, "scripts/repair-frontmatter.mjs"),
    readTemplate(templatesRoot, "repair-frontmatter.template.mjs").replaceAll(
      "__ORDER_FALLBACK__",
      "999"
    )
  );
}

const args = parseArgs(process.argv.slice(2));
const receipts = loadReceipts(args.receipts);

if (receipts.some((receipt) => receipt.contains_private_transcript || receipt.requests_hidden_chain_of_thought)) {
  writeSummary(args.summary, {
    exit_code: EXIT.PRIVATE_TRANSCRIPT,
    status: "rejected_private_transcript_or_hidden_cot",
    candidate_written: false
  });
  process.exit(EXIT.PRIVATE_TRANSCRIPT);
}

if (receipts.some((receipt) => receipt.contains_sensitive_material)) {
  writeSummary(args.summary, {
    exit_code: EXIT.SENSITIVE,
    status: "rejected_sensitive_marker",
    candidate_written: false
  });
  process.exit(EXIT.SENSITIVE);
}

if (receipts.length === 0 || receipts.some((receipt) => !ensureEvidence(receipt))) {
  writeSummary(args.summary, {
    exit_code: EXIT.EVIDENCE_POOR,
    status: "rejected_evidence_poor",
    candidate_written: false
  });
  process.exit(EXIT.EVIDENCE_POOR);
}

const candidateDir = path.resolve(args.candidate);
writeCandidate(candidateDir, path.resolve(".agents/skills/observable-receipt-distiller"));

const summary = {
  exit_code: EXIT.OK,
  status: "candidate_written",
  training_receipt_ids: receipts.map((receipt) => receipt.id),
  candidate_dir: args.candidate,
  extracted_rules: [
    "title_from_first_h1",
    "description_from_opening_sentence",
    "invalid_sidebar_order_to_999",
    "already_valid_noop"
  ],
  candidate_files: [
    "SKILL.md",
    "references/frontmatter-contract.md",
    "scripts/repair-frontmatter.mjs"
  ]
};

writeSummary(args.summary, summary);
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
