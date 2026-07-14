import { mkdtempSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

const npmEnv = {
  ...process.env,
  npm_config_cache: path.join(process.cwd(), ".npm-cache")
};

function fail(message, detail) {
  if (detail) {
    console.error(detail.trim());
  }
  console.error(message);
  process.exit(1);
}

const packResult = spawnSync("npm", ["pack", "--json"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: npmEnv
});

if (packResult.status !== 0) {
  fail("npm pack failed", [packResult.stdout, packResult.stderr].filter(Boolean).join(""));
}

const packJson = JSON.parse(packResult.stdout.trim());
const tarballName = packJson[0]?.filename;
if (!tarballName) {
  fail("npm pack did not report a tarball filename", packResult.stdout);
}

const tarballPath = path.join(process.cwd(), tarballName);
const smokeDir = mkdtempSync(path.join(os.tmpdir(), "clip-clean-smoke-"));

const installResult = spawnSync("npm", ["install", tarballPath], {
  cwd: smokeDir,
  encoding: "utf8",
  env: npmEnv
});

if (installResult.status !== 0) {
  fail("Local tarball install failed", [installResult.stdout, installResult.stderr].filter(Boolean).join(""));
}

const binPath = path.join(smokeDir, "node_modules", ".bin", "clip-clean");
const helpResult = spawnSync(binPath, ["--help"], {
  cwd: smokeDir,
  encoding: "utf8"
});

rmSync(smokeDir, { recursive: true, force: true });

if (helpResult.status !== 0) {
  fail("Installed CLI help command failed", [helpResult.stdout, helpResult.stderr].filter(Boolean).join(""));
}

process.stdout.write(
  [
    `tarball=${tarballName}`,
    "install=ok",
    "help=ok"
  ].join("\n")
);
