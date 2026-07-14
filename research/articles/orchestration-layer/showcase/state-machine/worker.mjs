// worker（执行角色）：只负责产出候选实现，不判断自己对不对。
//
// 重要说明：这里的 worker 是一个确定性桩（deterministic stub），不是在线大模型。
// 它按顺序吐出预先准备好的候选函数，用来代表“执行角色每一轮交出的产物”。
// 本 Showcase 要演示的是编排层的控制流（顺序、路由、预算、停止、升级），
// 不是模型智能，也不构成任何模型排名。
//
// 每个候选是一段 slugify 源码字符串；编排层把它交给独立评估器去跑验收。

const CANDIDATES = {
  // 场景 A：第一版漏掉小写化 → 失败；第二版补上 → 通过。
  converging: [
    // 候选 1（错误）：忘了 toLowerCase，"Hello World" 会得到 "Hello-World"
    `export const slugify = (s) =>
       s.trim().replace(/[^A-Za-z0-9\\s-]/g, "").replace(/\\s+/g, "-");`,
    // 候选 2（正确）：在 trim 之后补一步 toLowerCase
    `export const slugify = (s) =>
       s.trim().toLowerCase().replace(/[^a-z0-9\\s-]/g, "").replace(/\\s+/g, "-");`,
  ],
  // 场景 B：worker 卡住，每一版都还是漏掉小写化 → 用尽预算仍不过。
  stuck: [
    `export const slugify = (s) =>
       s.trim().replace(/[^A-Za-z0-9\\s-]/g, "").replace(/\\s+/g, "-");`,
    `export const slugify = (s) =>
       s.trim().replace(/[^A-Za-z0-9\\s-]/g, "").replace(/\\s+/g, "_").replace(/_/g, "-");`,
  ],
};

export function makeWorker(scenario) {
  const queue = CANDIDATES[scenario];
  let index = 0;
  return {
    // 返回下一版候选源码；用尽后返回 null（worker 无更多想法）。
    next() {
      if (index >= queue.length) return null;
      return queue[index++];
    },
  };
}
