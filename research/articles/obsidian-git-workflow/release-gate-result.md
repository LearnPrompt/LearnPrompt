# Release gate result

Verified at: 2026-07-12

## Gate status

Overall: PASS, verified 86/100.

Reason: Writer completed research, Showcase, article draft, deterministic checks, privacy check, single-article validator, Starlight build, and diff whitespace check. A fresh independent read-only Codex Spark reviewer then passed the article at 86/100 with blocker/major/minor = 0/0/0 and visual PASS, so the final article is `verified`.

## Actual command results

```bash
node research/articles/obsidian-git-workflow/showcase/vault-git-change-gate/scripts/verify-showcase.mjs
# PASS vault-git-change-gate deterministic verifier
# valid 0; 81/82/83/84/85 negative gates matched; baseline main unchanged

node research/articles/obsidian-git-workflow/showcase/vault-git-change-gate/scripts/privacy-scan.mjs
# PASS privacy scan

CODEX_NESTED_MODEL=gpt-5.5 node research/articles/obsidian-git-workflow/showcase/vault-git-change-gate/scripts/run-codex-live.mjs
# writer attempt blocked before model; outer retry 1 rejected with validator 85; final allowed retry exit 0
# final: three allowed paths, diff 13 lines, candidate commit in history, main unchanged

node .claude/skills/learnprompt-single-mdx/scripts/validate-golden-mdx.mjs --article starlight/src/content/docs/obsidian-ai/obsidian-git-workflow.mdx --research research/articles/obsidian-git-workflow
# PASS article; PASS research; PASS status: verified; score 86

npm --prefix starlight run build
# PASS: 49 pages built

git diff --check
# PASS
```

提交前 `git diff --cached --check` 还发现原始 unified diff 归档的三个空 context marker 会形成仓库尾随空格。最终工件改用可无损重建的 JSON 行数组并保存原始 SHA-256；Showcase verifier 会重建并拒绝 hash 不匹配。格式修复后的 staged diff check、Showcase、privacy、verified validator 与 49 页构建均再次通过，独立只读窄审维持 86/100、0/0/0 与视觉 PASS。
