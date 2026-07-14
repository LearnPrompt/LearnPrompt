import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const articleRoot = path.resolve(scriptDir, "../../..");

const longIdPrefixes = ["thread", "session", "request", "run"];
const shortIdPrefixes = ["item", "turn"];
const uuidHex = "[0-9A-Fa-f]";
const longIdBody = "[A-Za-z0-9-]{6,}";
const shortIdBody = "(?:\\d+|[A-Za-z0-9-]{6,})";

const rules = [
  {
    name: "identifier-like value",
    regexes: [
      new RegExp(`\\b(?:${longIdPrefixes.join("|")})_(?:${longIdBody})\\b`, "g"),
      new RegExp(`\\b(?:${shortIdPrefixes.join("|")})_(?:${shortIdBody})\\b`, "g"),
      new RegExp(`\\b${uuidHex}{8}-${uuidHex}{4}-${uuidHex}{4}-${uuidHex}{4}-${uuidHex}{12}\\b`, "g")
    ]
  },
  {
    name: "absolute temp or home path",
    regexes: [
      new RegExp(
        [
          ["Users"],
          ["private", "tmp"],
          ["tmp"],
          ["var", "folders"]
        ]
          .map((segments) => `/${segments.join("/")}/[^\\s"'<>]+`)
          .join("|"),
        "g"
      )
    ]
  },
  {
    name: "absolute shell path",
    regexes: [
      new RegExp(
        [["bin"], ["usr", "bin"]]
          .map((segments) => `/${segments.join("/")}/(?:zsh|bash|sh)\\b`)
          .join("|"),
        "g"
      )
    ]
  }
];

function collectFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

function scanFile(filePath) {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const findings = [];

  lines.forEach((line, index) => {
    for (const rule of rules) {
      for (const regex of rule.regexes) {
        regex.lastIndex = 0;
        let match;
        while ((match = regex.exec(line)) !== null) {
          findings.push({
            file: path.relative(articleRoot, filePath),
            line: index + 1,
            column: match.index + 1,
            rule: rule.name,
            match: match[0]
          });
        }
      }
    }
  });

  return findings;
}

const files = collectFiles(articleRoot);
const findings = files.flatMap(scanFile);

if (findings.length > 0) {
  console.log("FAIL privacy scan");
  for (const finding of findings) {
    console.log(
      `${finding.file}:${finding.line}:${finding.column} ${finding.rule}: ${finding.match}`
    );
  }
  process.exit(1);
}

console.log("PASS privacy scan");
console.log("root: research/articles/codex-cli-workflow");
console.log(`files_scanned: ${files.length}`);
console.log(
  "checks: identifier-like values, uuid, absolute temp or home paths, absolute shell paths"
);
