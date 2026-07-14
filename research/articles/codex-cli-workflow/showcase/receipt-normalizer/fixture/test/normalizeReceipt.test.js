import test from "node:test";
import assert from "node:assert/strict";

import { normalizeReceipt } from "../src/normalizeReceipt.js";

test("normalizes a plain number", () => {
  assert.equal(normalizeReceipt("7"), "RCPT-0007");
});

test("normalizes common aliases", () => {
  assert.equal(normalizeReceipt("receipt # 42"), "RCPT-0042");
  assert.equal(normalizeReceipt("RCP:0007"), "RCPT-0007");
});

test("keeps the last four digits when upstream scanners prepend store codes", () => {
  assert.equal(normalizeReceipt("rcpt-12034"), "RCPT-2034");
});

test("rejects inputs without digits", () => {
  assert.throws(() => normalizeReceipt("receipt only"), /must contain digits/);
});
