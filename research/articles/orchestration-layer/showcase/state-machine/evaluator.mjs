// evaluator（评估角色）：与 worker 分开的独立判定者。
// 它只做一件事——把候选实现跑过验收契约，返回第一条失败用例的 file-free 证据，
// 或在全部通过时返回 null。它不改代码、不给建议，只给 pass/fail 加定位。

import { acceptance } from "./acceptance.mjs";

// 把候选源码字符串加载成一个函数（隔离在一次性模块里，避免污染编排器进程）。
async function loadSlugify(source) {
  const encoded = Buffer.from(source, "utf8").toString("base64");
  const mod = await import(`data:text/javascript;base64,${encoded}`);
  return mod.slugify;
}

export async function evaluate(source) {
  const slugify = await loadSlugify(source);
  for (const testCase of acceptance) {
    const actual = slugify(testCase.input);
    if (actual !== testCase.expected) {
      return {
        pass: false,
        failing: { name: testCase.name, expected: testCase.expected, actual },
      };
    }
  }
  return { pass: true, total: acceptance.length };
}
