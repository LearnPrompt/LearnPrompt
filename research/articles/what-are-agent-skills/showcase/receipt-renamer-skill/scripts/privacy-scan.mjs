import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const articleRoot = path.resolve(scriptDir, "../..");

const rules = [
  {
    name: "uuid or runtime identifier",
    regexes: [
      /\b[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\b/g,
      /\b(?:session|thread|turn|item|request|run)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/gi
    ]
  },
  {
    name: "absolute home or temp path",
    regexes: [/\/Users\/[^\s"'<>]+/g, /\/private\/tmp\/[^\s"'<>]+/g, /\/var\/folders\/[^\s"'<>]+/g]
  },
  {
    name: "absolute shell path",
    regexes: [/\/(?:usr\/)?bin\/(?:zsh|bash|sh)\b/g]
  }
];

function collectFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
    left.name.localeCompare(right.name)
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

const files = collectFiles(articleRoot);
const findings = [];

for (const filePath of files) {
  const lines = readFileSync(filePath, "utf8").split("\n");
  lines.forEach((line, index) => {
    for (const rule of rules) {
      for (const regex of rule.regexes) {
        regex.lastIndex = 0;
        let match;
        while ((match = regex.exec(line)) !== null) {
          findings.push(
            `${path.relative(articleRoot, filePath)}:${index + 1}:${match.index + 1} ${rule.name}: ${match[0]}`
          );
        }
      }
    }
  });
}

if (findings.length > 0) {
  console.log("FAIL privacy scan");
  for (const finding of findings) {
    console.log(finding);
  }
  process.exit(1);
}

console.log(
  "PASS privacy scan: no runtime IDs, absolute temp paths, user home paths, or shell paths were committed."
);
