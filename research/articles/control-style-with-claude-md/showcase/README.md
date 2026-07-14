# Showcase 总览：style-scope

本文的核心 showcase 位于 `style-scope/`，目标不是做模型排名，而是把“规则该放哪一层”变成可重跑证据。

## 回答的问题

在一个同时包含 UI 与 API 的小仓库里：

1. 哪些约束应该留在根级 `CLAUDE.md`？
2. 哪些约束应该拆成 path-scoped rules？
3. 哪些约束已经可以交给机械检查？
4. 为什么 UI 规则不应作用于 API？

## 目录

```text
style-scope/
├── README.md
├── verify-style-scope.mjs
├── result.txt
└── fixture/
    ├── before/
    │   ├── CLAUDE.md
    │   ├── README.md
    │   ├── package.json
    │   ├── .claude/rules/ui-style.md
    │   ├── .claude/rules/api-contract.md
    │   └── src/
    │       ├── ui/Button.tsx
    │       └── api/handlers/profile.ts
    └── after/
        ├── CLAUDE.md
        ├── README.md
        ├── package.json
        ├── .claude/rules/ui-style.md
        ├── .claude/rules/api-contract.md
        └── src/
            ├── ui/Button.tsx
            └── api/handlers/profile.ts
```

## 复现命令

```bash
cd research/articles/control-style-with-claude-md/showcase/style-scope
node verify-style-scope.mjs before
node verify-style-scope.mjs after
```

## 这是什么，不是什么

- 这是确定性检查：它验证根规则是否只保留全局信息、path-scoped rules 是否命中正确目录、UI/API 代码是否满足可机械判断的约束。
- 这不是在线 Claude Code 服从性测试：脚本不调用模型，不能证明 Claude 为什么会遵守，也不能证明下一次真实会话一定成功。
- 由于本轮任务已知存在原始认证失败且明确禁止重走那条链路，本文不伪造“真实产品端到端已验证”。限制已公开记录。

## 预期结果

- `before`：FAIL，原因是 UI 仍有硬编码颜色，API 仍直接返回裸对象。
- `after`：PASS，且两次都出现 `SKIP ui-token rule for src/api/handlers/profile.ts ...`。

`result.txt` 保存了 2026-07-11 的实际输出。
