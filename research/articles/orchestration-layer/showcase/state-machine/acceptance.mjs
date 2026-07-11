// 验收契约（acceptance contract）：先定义 done 长什么样，再动工。
// 每条用例是一对 输入 → 期望输出；评估器只认这三条，不看实现路径。
export const acceptance = [
  { name: "lowercases and hyphenates", input: "Hello World", expected: "hello-world" },
  { name: "collapses repeated whitespace", input: "a   b", expected: "a-b" },
  { name: "drops punctuation", input: "Hi, there!", expected: "hi-there" },
];
