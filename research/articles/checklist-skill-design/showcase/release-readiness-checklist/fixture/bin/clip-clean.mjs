#!/usr/bin/env node

import { readFileSync } from "node:fs";

function normalize(text) {
  return text.replace(/\n{3,}/g, "\n\n");
}

if (process.argv.includes("--help")) {
  process.stdout.write(
    [
      "clip-clean",
      "",
      "Usage:",
      "  clip-clean <file>",
      "  clip-clean --stdin",
      "",
      "Flags:",
      "  --help   Show this help text"
    ].join("\n")
  );
  process.exit(0);
}

if (process.argv.includes("--stdin")) {
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    input += chunk;
  });
  process.stdin.on("end", () => {
    process.stdout.write(normalize(input));
  });
  process.stdin.resume();
} else if (process.argv[2]) {
  const input = readFileSync(process.argv[2], "utf8");
  process.stdout.write(normalize(input));
} else {
  process.stderr.write("Expected a file path or --stdin.\n");
  process.exit(1);
}
