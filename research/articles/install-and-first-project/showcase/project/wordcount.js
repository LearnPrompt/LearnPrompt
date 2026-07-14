#!/usr/bin/env node
// wordcount: count words in a string. Pure, no dependencies.
function wordCount(text) {
  if (typeof text !== "string") return 0;
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  return trimmed.split(/\s+/).length;
}
module.exports = { wordCount };

if (require.main === module) {
  const input = process.argv.slice(2).join(" ");
  console.log(wordCount(input));
}
