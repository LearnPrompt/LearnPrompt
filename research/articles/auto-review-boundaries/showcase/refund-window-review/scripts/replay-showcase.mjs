import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const showcaseRoot = path.resolve(__dirname, "..");
const verifyScript = path.join(__dirname, "verify-review-finding.mjs");
const goodFinding = path.join(showcaseRoot, "results", "real-finding.json");
const badFinding = path.join(
  showcaseRoot,
  "results",
  "fabricated-out-of-diff-finding.json",
);

const goodOutput = execFileSync("node", [verifyScript, goodFinding], {
  encoding: "utf8",
});
process.stdout.write(goodOutput);

try {
  execFileSync("node", [verifyScript, badFinding], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  process.stderr.write("FAIL fabricated out-of-diff finding unexpectedly passed\n");
  process.exit(9);
} catch (error) {
  const code = error.status ?? 1;
  const stderr = String(error.stderr ?? "").trim();
  if (code !== 3) {
    process.stderr.write(
      `FAIL fabricated out-of-diff finding exited with ${code}, expected 3\n`,
    );
    process.exit(9);
  }

  process.stdout.write(`${stderr}\n`);
  process.stdout.write("PASS fabricated out-of-diff finding rejected with exit 3\n");
}
