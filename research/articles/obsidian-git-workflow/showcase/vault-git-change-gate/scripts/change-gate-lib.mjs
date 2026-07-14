import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const showcaseRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
export const fixtureRoot = path.join(showcaseRoot, "fixture", "vault");
export const resultsDir = path.join(showcaseRoot, "results");
export const reportsDir = path.join(showcaseRoot, "reports");
export const casesDir = path.join(showcaseRoot, "cases");
export const contractPath = path.join(showcaseRoot, "contracts", "change-contract.json");
export const contract = JSON.parse(readFileSync(contractPath, "utf8"));

export function ensureDirs() {
  mkdirSync(resultsDir, { recursive: true });
  mkdirSync(reportsDir, { recursive: true });
  mkdirSync(casesDir, { recursive: true });
}

export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    ...options
  });
  if (options.check && result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed\n${result.stdout}\n${result.stderr}`);
  }
  return result;
}

export function git(cwd, args, check = true) {
  return run("git", args, { cwd, check });
}

export function walk(directory, base = directory, acc = []) {
  for (const name of readdirSync(directory)) {
    if (name === ".git") continue;
    const file = path.join(directory, name);
    const stat = statSync(file);
    if (stat.isDirectory()) walk(file, base, acc);
    else acc.push(path.relative(base, file).split(path.sep).join("/"));
  }
  return acc.sort();
}

export function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

export function treeHash(root) {
  const files = walk(root);
  const digest = createHash("sha256");
  for (const relative of files) {
    digest.update(relative);
    digest.update("\0");
    digest.update(readFileSync(path.join(root, relative)));
    digest.update("\0");
  }
  return digest.digest("hex");
}

export function setupTempRepo() {
  ensureDirs();
  const lab = mkdtempSync(path.join(tmpdir(), "vault-git-change-gate-"));
  const main = path.join(lab, "main");
  const candidate = path.join(lab, "candidate");
  cpSync(fixtureRoot, main, { recursive: true });
  git(main, ["init", "-b", contract.default_branch]);
  git(main, ["config", "user.email", "synthetic@example.invalid"]);
  git(main, ["config", "user.name", "Synthetic Reviewer"]);
  git(main, ["add", "."]);
  git(main, ["commit", "-m", "baseline synthetic vault"]);
  const baselineTree = git(main, ["rev-parse", "HEAD^{tree}"]).stdout.trim();
  const baselineHash = treeHash(main);
  git(main, ["worktree", "add", "-b", contract.candidate_branch, candidate, "HEAD"]);
  return { lab, main, candidate, baselineTree, baselineHash };
}

export function append(file, text) {
  writeFileSync(file, `${readFileSync(file, "utf8").trimEnd()}\n\n${text.trim()}\n`);
}

export function writeValidCandidate(candidate, baselineTree) {
  append(
    path.join(candidate, "notes/projects/alpha-plan.md"),
    "Candidate update: sync propagates the current state, backup preserves a separate recovery copy, and Git keeps reviewable snapshots before acceptance."
  );
  append(
    path.join(candidate, "notes/research/git-boundaries.md"),
    "Agent boundary: bulk edits stay on a candidate worktree until `git diff` and link checks pass. Only then should a human accept the commit."
  );
  mkdirSync(path.join(candidate, "receipts"), { recursive: true });
  writeFileSync(
    path.join(candidate, contract.required_receipt),
    [
      "# Candidate receipt",
      "",
      "accepted: true",
      "",
      "changed_paths:",
      "- notes/projects/alpha-plan.md",
      "- notes/research/git-boundaries.md",
      "- receipts/candidate-receipt.md",
      "",
      "link_check: passed",
      `baseline_tree_hash: ${baselineTree}`,
      "candidate_commit: pending-before-commit",
      "summary: synthetic candidate prepared for human diff review."
    ].join("\n") + "\n"
  );
}

export function commitCandidate(candidate, message = "candidate agent note update") {
  git(candidate, ["add", "."]);
  git(candidate, ["commit", "-m", message]);
  return git(candidate, ["rev-parse", "HEAD"]).stdout.trim();
}

export function updateReceiptCommit(candidate, commit) {
  const receipt = path.join(candidate, contract.required_receipt);
  const text = readFileSync(receipt, "utf8").replace("candidate_commit: pending-before-commit", `candidate_commit: ${commit}`);
  writeFileSync(receipt, text);
  git(candidate, ["add", contract.required_receipt]);
  git(candidate, ["commit", "-m", "record candidate receipt commit"]);
  return git(candidate, ["rev-parse", "HEAD"]).stdout.trim();
}

export function changedPaths(candidate) {
  return git(candidate, ["diff", "--name-only", `${contract.default_branch}...HEAD`]).stdout
    .trim()
    .split("\n")
    .filter(Boolean)
    .sort();
}

export function diffStatLines(candidate) {
  const diff = git(candidate, ["diff", "--numstat", `${contract.default_branch}...HEAD`]).stdout.trim();
  if (!diff) return 0;
  return diff.split("\n").reduce((sum, line) => {
    const [adds, dels] = line.split(/\s+/);
    const a = adds === "-" ? contract.max_diff_lines + 1 : Number(adds);
    const d = dels === "-" ? contract.max_diff_lines + 1 : Number(dels);
    return sum + a + d;
  }, 0);
}

export function notePaths(root) {
  return walk(root).filter((relative) => relative.endsWith(".md"));
}

function stripExtension(relative) {
  return relative.replace(/\.md$/i, "");
}

function linkTargetExists(root, fromRelative, rawTarget) {
  if (/^[a-z]+:\/\//i.test(rawTarget) || rawTarget.startsWith("#")) return true;
  const clean = rawTarget.split("#")[0].split("|")[0].trim();
  if (!clean) return true;
  const baseDir = path.dirname(fromRelative);
  const candidates = [];
  if (clean.startsWith("/") || clean.includes("/")) {
    candidates.push(clean.replace(/^\//, ""));
    candidates.push(`${clean.replace(/^\//, "")}.md`);
    candidates.push(path.normalize(path.join(baseDir, clean)).split(path.sep).join("/"));
    candidates.push(`${path.normalize(path.join(baseDir, clean)).split(path.sep).join("/")}.md`);
  } else {
    for (const note of notePaths(root)) {
      if (path.basename(stripExtension(note)) === clean || stripExtension(note).endsWith(`/${clean}`)) {
        candidates.push(note);
      }
    }
  }
  return candidates.some((candidate) => existsSync(path.join(root, candidate)));
}

export function brokenLinks(root) {
  const broken = [];
  for (const relative of notePaths(root)) {
    const text = readFileSync(path.join(root, relative), "utf8");
    for (const match of text.matchAll(/\[\[([^\]]+)\]\]/g)) {
      if (!linkTargetExists(root, relative, match[1])) broken.push(`${relative} -> [[${match[1]}]]`);
    }
    for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      if (!linkTargetExists(root, relative, match[1])) broken.push(`${relative} -> ${match[1]}`);
    }
  }
  return broken;
}

export function hasSecretShape(root) {
  const patterns = [
    /\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*['"]?[A-Za-z0-9_./+=-]{12,}/i,
    /\bBearer\s+[A-Za-z0-9._-]{16,}/i,
    /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/
  ];
  for (const relative of walk(root)) {
    const file = path.join(root, relative);
    const stat = statSync(file);
    if (stat.size > contract.max_binary_bytes) return { path: relative, reason: "large-file" };
    const sample = readFileSync(file);
    if (sample.includes(0)) return { path: relative, reason: "binary" };
    const text = sample.toString("utf8");
    if (patterns.some((pattern) => pattern.test(text))) return { path: relative, reason: "secret-shape" };
  }
  return null;
}

export function validateCandidate(main, candidate, baselineTree) {
  const branch = git(candidate, ["branch", "--show-current"]).stdout.trim();
  if (!branch || branch === contract.default_branch) {
    return { code: 81, reason: "candidate is not isolated from default branch" };
  }
  const commonDir = git(candidate, ["rev-parse", "--path-format=absolute", "--git-common-dir"]).stdout.trim();
  const mainCommonDir = git(main, ["rev-parse", "--path-format=absolute", "--git-common-dir"]).stdout.trim();
  if (path.resolve(commonDir) !== path.resolve(mainCommonDir)) {
    return { code: 81, reason: "candidate is not a linked worktree of the baseline repo" };
  }
  const mainTree = git(main, ["rev-parse", "HEAD^{tree}"]).stdout.trim();
  if (mainTree !== baselineTree) {
    return { code: 81, reason: "main baseline tree changed" };
  }
  const paths = changedPaths(candidate);
  if (paths.length === 0) {
    return { code: 85, reason: "empty candidate diff" };
  }
  const disallowed = paths.filter((item) => !contract.allowed_paths.includes(item));
  if (disallowed.length) {
    return { code: 82, reason: `disallowed paths: ${disallowed.join(", ")}` };
  }
  const secret = hasSecretShape(candidate);
  if (secret) return { code: 83, reason: `${secret.reason}: ${secret.path}` };
  const diffLines = diffStatLines(candidate);
  if (diffLines > contract.max_diff_lines) {
    return { code: 83, reason: `diff line budget exceeded: ${diffLines}` };
  }
  const links = brokenLinks(candidate);
  if (links.length) return { code: 84, reason: `broken links: ${links.join("; ")}` };
  const receipt = path.join(candidate, contract.required_receipt);
  if (!existsSync(receipt)) return { code: 85, reason: "missing receipt" };
  const receiptText = readFileSync(receipt, "utf8");
  const receiptCommit = receiptText.match(/candidate_commit:\s*([0-9a-f]{7,40})/)?.[1];
  if (!/accepted:\s*true/.test(receiptText) || !receiptCommit) {
    return { code: 85, reason: "receipt missing acceptance or candidate commit" };
  }
  if (!/link_check:\s*passed/.test(receiptText) || !receiptText.includes(`baseline_tree_hash: ${baselineTree}`)) {
    return { code: 85, reason: "receipt missing link check or exact baseline tree hash" };
  }
  if (git(candidate, ["cat-file", "-e", `${receiptCommit}^{commit}`], false).status !== 0) {
    return { code: 85, reason: "receipt candidate commit does not exist" };
  }
  if (git(candidate, ["merge-base", "--is-ancestor", receiptCommit, "HEAD"], false).status !== 0) {
    return { code: 85, reason: "receipt candidate commit is not in candidate history" };
  }
  if (paths.some((item) => !receiptText.includes(item))) {
    return { code: 85, reason: "receipt does not enumerate every changed path" };
  }
  return { code: 0, reason: "valid candidate", changed_paths: paths, diff_lines: diffLines };
}

export function sanitize(text) {
  return (text || "")
    .replaceAll(showcaseRoot, "<showcase>")
    .replace(/\/Users\/[^/\s]+\/[\S]*/g, "<user-path>")
    .replace(/\/private\/tmp\/[\S]*/g, "<tmp-path>")
    .replace(/\/var\/folders\/[\S]*/g, "<tmp-path>")
    .replace(/\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/gi, "<runtime-id>")
    .replace(/\bsk-[A-Za-z0-9_-]+\b/g, "<credential>");
}

export function cleanupLab(lab) {
  rmSync(lab, { recursive: true, force: true });
}
