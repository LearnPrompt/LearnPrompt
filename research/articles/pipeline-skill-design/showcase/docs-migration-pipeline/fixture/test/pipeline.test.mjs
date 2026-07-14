import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

test("sha256 digest stays stable for identical input", () => {
  const value = JSON.stringify({ stage: "transform", files: 3 });
  const digestA = createHash("sha256").update(value).digest("hex");
  const digestB = createHash("sha256").update(value).digest("hex");
  assert.equal(digestA, digestB);
});
