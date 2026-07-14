import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

export const EXIT_CODES = {
  normal: 0,
  missingEvidence: 41,
  contradictory: 42,
  sensitive: 43,
  binaryOnly: 44,
  blockedLive: 90,
};

export const EXPECTED_PACKET_FILES = [
  "MEMORY_INDEX.md",
  "memory/context.md",
  "memory/decision.md",
  "memory/runbook.md",
  "memory/status.md",
];

const REQUIRED_COMMON_FIELDS = ["Record kind", "Scope", "Verified at", "Provenance"];
const REQUIRED_BY_FILE = {
  "MEMORY_INDEX.md": ["Packet files"],
  "memory/context.md": [
    "Incident",
    "Why it matters",
    "Evidence summary",
    "Evidence path",
    "Known limitation",
  ],
  "memory/decision.md": [
    "Accepted decision",
    "Canonical timezone",
    "Decision rationale",
    "Evidence path",
  ],
  "memory/runbook.md": ["Next command", "Verification command", "Evidence path"],
  "memory/status.md": [
    "Current status",
    "Canonical timezone",
    "Observed symptom",
    "Evidence path",
    "Next command",
    "Known limitation",
  ],
};

const SENSITIVE_RULES = [
  {
    label: "runtime identifier",
    regexes: [
      /\b(?:session|thread|turn|item|request|run)[ _-]?id\b["']?\s*:\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/gi,
      /\b[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\b/g,
    ],
  },
  {
    label: "credential-shaped secret",
    regexes: [
      /\bBearer\s+(?!REDACTED\b|<)[A-Za-z0-9._~+/-]{16,}\b/g,
      /\b(?:api[_-]?key|token|authorization)\b["']?\s*:\s*(?!REDACTED\b|<)[A-Za-z0-9._~+/-]{10,}/gi,
      /\bsk-[A-Za-z0-9_-]{16,}\b/g,
    ],
  },
  {
    label: "structured sensitive marker",
    regexes: [/^Sensitive marker:\s*(?:SESSION_ID_PLACEHOLDER|API_KEY_PLACEHOLDER)$/gim],
  },
  {
    label: "absolute local path",
    regexes: [/\/Users\/[^\s"'<>]+/g, /\/private\/tmp\/[^\s"'<>]+/g, /\/var\/folders\/[^\s"'<>]+/g],
  },
];

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n");
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function sortedDirectoryEntries(directory) {
  return readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
    left.name.localeCompare(right.name),
  );
}

export function snapshotPacket(packetRoot) {
  const snapshot = {};
  for (const relativePath of EXPECTED_PACKET_FILES) {
    const absolutePath = path.join(packetRoot, relativePath);
    const content = readFileSync(absolutePath);
    snapshot[relativePath] = sha256(content);
  }
  return snapshot;
}

export function packetUnchanged(before, after) {
  return stableStringify(before) === stableStringify(after);
}

export function readTextCandidate(filePath) {
  const content = readFileSync(filePath);
  if (content.includes(0)) {
    return null;
  }

  let controlBytes = 0;
  for (const byte of content) {
    if (byte < 9 || (byte > 13 && byte < 32)) {
      controlBytes += 1;
    }
  }
  if (controlBytes > Math.max(8, content.length * 0.02)) {
    return null;
  }
  return normalizeNewlines(content.toString("utf8"));
}

export function parseFields(markdownText) {
  const fields = {};
  for (const line of normalizeNewlines(markdownText).split("\n")) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9 /_-]+):\s*(.+)$/);
    if (!match) {
      continue;
    }
    fields[match[1].trim()] = match[2].trim();
  }
  return fields;
}

function packetFilesValue() {
  return EXPECTED_PACKET_FILES.join(", ");
}

function buildReport(records) {
  return {
    packet_root: ".",
    index_citation: "MEMORY_INDEX.md",
    current_status: {
      answer: records["memory/status.md"]["Current status"],
      citations: ["memory/status.md"],
    },
    accepted_decision: {
      answer: records["memory/decision.md"]["Accepted decision"],
      citations: ["memory/decision.md"],
    },
    rationale_and_evidence: {
      answer: `${records["memory/decision.md"]["Decision rationale"]} Evidence: ${records["memory/context.md"]["Evidence summary"]}`,
      citations: ["memory/decision.md", "memory/context.md"],
    },
    next_command: {
      answer: records["memory/runbook.md"]["Next command"],
      citations: ["memory/runbook.md"],
    },
    known_limitation: {
      answer: records["memory/status.md"]["Known limitation"],
      citations: ["memory/status.md", "memory/context.md"],
    },
    verification_date: {
      answer: records["memory/status.md"]["Verified at"],
      citations: ["memory/status.md"],
    },
    all_cited_paths: [
      "MEMORY_INDEX.md",
      "memory/context.md",
      "memory/decision.md",
      "memory/runbook.md",
      "memory/status.md",
    ],
  };
}

export function renderMarkdownReport(report) {
  return [
    "# Handoff report",
    "",
    "## Current status",
    report.current_status.answer,
    "Citation: memory/status.md",
    "",
    "## Accepted decision",
    report.accepted_decision.answer,
    "Citation: memory/decision.md",
    "",
    "## Rationale and evidence",
    report.rationale_and_evidence.answer,
    "Citations: memory/decision.md, memory/context.md",
    "",
    "## Next command",
    report.next_command.answer,
    "Citation: memory/runbook.md",
    "",
    "## Known limitation",
    report.known_limitation.answer,
    "Citations: memory/status.md, memory/context.md",
    "",
    "## Verification date",
    report.verification_date.answer,
    "Citation: memory/status.md",
    "",
    "## Exact packet files cited",
    "- MEMORY_INDEX.md",
    "- memory/context.md",
    "- memory/decision.md",
    "- memory/runbook.md",
    "- memory/status.md",
    "",
  ].join("\n");
}

export function evaluatePacket(packetRoot) {
  const texts = {};
  for (const relativePath of EXPECTED_PACKET_FILES) {
    const absolutePath = path.join(packetRoot, relativePath);
    if (!existsSync(absolutePath)) {
      return {
        exitCode: EXIT_CODES.missingEvidence,
        reason: `missing packet file: ${relativePath}`,
      };
    }

    const text = readTextCandidate(absolutePath);
    if (text === null) {
      return {
        exitCode: EXIT_CODES.binaryOnly,
        reason: `non-text memory record: ${relativePath}`,
      };
    }
    texts[relativePath] = text;
  }

  for (const [relativePath, text] of Object.entries(texts)) {
    for (const rule of SENSITIVE_RULES) {
      for (const regex of rule.regexes) {
        regex.lastIndex = 0;
        if (regex.test(text)) {
          return {
            exitCode: EXIT_CODES.sensitive,
            reason: `${rule.label} found in ${relativePath}`,
          };
        }
      }
    }
  }

  const records = {};
  for (const [relativePath, text] of Object.entries(texts)) {
    records[relativePath] = parseFields(text);
  }

  for (const [relativePath, fields] of Object.entries(records)) {
    for (const requiredField of REQUIRED_COMMON_FIELDS) {
      if (!fields[requiredField]) {
        return {
          exitCode: EXIT_CODES.missingEvidence,
          reason: `missing ${requiredField} in ${relativePath}`,
        };
      }
    }
    for (const requiredField of REQUIRED_BY_FILE[relativePath] ?? []) {
      if (!fields[requiredField]) {
        return {
          exitCode: EXIT_CODES.missingEvidence,
          reason: `missing ${requiredField} in ${relativePath}`,
        };
      }
    }
  }

  if (records["MEMORY_INDEX.md"]["Packet files"] !== packetFilesValue()) {
    return {
      exitCode: EXIT_CODES.missingEvidence,
      reason: "MEMORY_INDEX.md packet file list is incomplete",
    };
  }

  const statusTimezone = records["memory/status.md"]["Canonical timezone"];
  const decisionTimezone = records["memory/decision.md"]["Canonical timezone"];
  if (statusTimezone !== decisionTimezone) {
    return {
      exitCode: EXIT_CODES.contradictory,
      reason: `status timezone ${statusTimezone} contradicts decision timezone ${decisionTimezone}`,
    };
  }

  return {
    exitCode: EXIT_CODES.normal,
    reason: "packet accepted",
    records,
    report: buildReport(records),
  };
}

export function writeReports(packetRoot, report) {
  const reportsDir = path.join(packetRoot, "reports");
  mkdirSync(reportsDir, { recursive: true });

  const jsonPath = path.join(reportsDir, "handoff.json");
  const markdownPath = path.join(reportsDir, "handoff.md");
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(markdownPath, renderMarkdownReport(report));

  return {
    jsonPath,
    markdownPath,
  };
}

export function assertNormalReports(packetRoot, expectedReport) {
  const reportsDir = path.join(packetRoot, "reports");
  if (!existsSync(reportsDir) || !statSync(reportsDir).isDirectory()) {
    throw new Error("reports directory was not created");
  }

  const reportFiles = sortedDirectoryEntries(reportsDir)
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);
  const expectedFiles = ["handoff.json", "handoff.md"];
  if (stableStringify(reportFiles) !== stableStringify(expectedFiles)) {
    throw new Error(`reports directory must contain only ${expectedFiles.join(", ")}`);
  }

  const actualJson = JSON.parse(readFileSync(path.join(reportsDir, "handoff.json"), "utf8"));
  const expectedJson = expectedReport;
  if (stableStringify(actualJson) !== stableStringify(expectedJson)) {
    throw new Error("reports/handoff.json does not match the expected packet-derived report");
  }

  const actualMarkdown = normalizeNewlines(
    readFileSync(path.join(reportsDir, "handoff.md"), "utf8"),
  ).trim();
  const expectedMarkdown = renderMarkdownReport(expectedReport).trim();
  if (actualMarkdown !== expectedMarkdown) {
    throw new Error("reports/handoff.md does not match the expected packet-derived markdown");
  }

  return {
    reportFiles,
    citedPaths: expectedReport.all_cited_paths,
  };
}
