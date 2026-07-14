# Five-move Loop Showcase

这个可运行示例把一次 Loop 分成五个可观察动作：

1. Discover：从任务队列中找到尚未完成的任务。
2. Handoff：写出结构化任务和验收条件。
3. Verify：由确定性的检查器比较结果与验收条件。
4. Persist：把完成状态保存到磁盘。
5. Schedule：根据剩余任务决定继续、重试或空闲。

示例中的 worker 是确定性的 mock，不会调用模型。这样可以单独验证 Loop 的控制结构；接入 Claude Code、Codex 或其他 Agent 时，只需要替换 `mock-worker.mjs`。

运行前提：Node.js 18 或更高版本，并且进程可以写入操作系统临时目录。只读沙箱会在 `mkdtemp` 阶段失败。

```bash
node research/golden-samples/loop-five-moves/showcase/demo-run.mjs
node --test research/golden-samples/loop-five-moves/showcase/test/loop-demo.test.mjs
```

`demo-result.txt` 与 `result.txt` 分别保存 demo 和测试的实际输出。
