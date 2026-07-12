import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function fingerprint(file) {
  const stat = fs.lstatSync(file);
  if (stat.isSymbolicLink()) return `symlink:${fs.readlinkSync(file)}`;
  if (stat.isDirectory()) return "directory";
  return `file:${crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")}`;
}

export function snapshotTree(root) {
  const snapshot = {};
  function walk(directory) {
    for (const name of fs.readdirSync(directory).sort()) {
      const file = path.join(directory, name);
      const relative = path.relative(root, file).split(path.sep).join("/");
      snapshot[fs.lstatSync(file).isDirectory() ? `${relative}/` : relative] = fingerprint(file);
      if (fs.lstatSync(file).isDirectory()) walk(file);
    }
  }
  walk(root);
  return snapshot;
}

export function evaluateWriteBoundary(before, after, allowedPaths) {
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  const changedPaths = keys.filter((key) => before[key] !== after[key]);
  const allowed = new Set(allowedPaths);
  const unexpectedPaths = changedPaths.filter((key) => !allowed.has(key));
  return {
    code: unexpectedPaths.length === 0 ? 0 : 106,
    changed_paths: changedPaths,
    unexpected_paths: unexpectedPaths,
    protected_files_unchanged: unexpectedPaths.length === 0
  };
}
