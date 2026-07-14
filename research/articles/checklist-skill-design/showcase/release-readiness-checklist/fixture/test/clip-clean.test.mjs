import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("clip-clean collapses repeated blank lines from stdin", () => {
  const result = spawnSync(
    process.execPath,
    ["bin/clip-clean.mjs", "--stdin"],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      input: "A\n\n\nB\n"
    }
  );

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "A\n\nB\n");
});

test("clip-clean prints help text", () => {
  const result = spawnSync(process.execPath, ["bin/clip-clean.mjs", "--help"], {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage:/);
});
