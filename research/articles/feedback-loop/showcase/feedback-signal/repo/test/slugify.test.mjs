import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "../src/slugify.mjs";

test("lowercases and hyphenates words", () => {
  assert.equal(slugify("Hello World"), "hello-world");
});
test("collapses repeated whitespace", () => {
  assert.equal(slugify("x   y"), "x-y");
});
test("drops punctuation", () => {
  assert.equal(slugify("a, b"), "a-b");
});
