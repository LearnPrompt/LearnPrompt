const assert = require("node:assert");
const { wordCount } = require("./wordcount.js");
assert.strictEqual(wordCount(""), 0);
assert.strictEqual(wordCount("  "), 0);
assert.strictEqual(wordCount("hello"), 1);
assert.strictEqual(wordCount("hello world"), 2);
assert.strictEqual(wordCount("  a   b  c "), 3);
console.log("all tests passed");
