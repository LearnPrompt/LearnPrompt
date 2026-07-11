import { slugify } from "../src/slugify.js";

const cases = [
  {
    name: "keeps simple words",
    input: "Hello World",
    expected: "hello-world",
  },
  {
    name: "collapses punctuation gaps into one hyphen",
    input: "Rock & Roll",
    expected: "rock-roll",
  },
  {
    name: "trims surrounding whitespace",
    input: "  Docs v2 Launch  ",
    expected: "docs-v2-launch",
  },
];

let failed = 0;

for (const testCase of cases) {
  const actual = slugify(testCase.input);
  if (actual === testCase.expected) {
    console.log(`PASS ${testCase.name}`);
  } else {
    failed += 1;
    console.log(
      `FAIL ${testCase.name} expected=${testCase.expected} actual=${actual}`,
    );
  }
}

if (failed > 0) {
  console.log(`SUMMARY failed=${failed} passed=${cases.length - failed}`);
  process.exit(1);
}

console.log(`SUMMARY failed=0 passed=${cases.length}`);
