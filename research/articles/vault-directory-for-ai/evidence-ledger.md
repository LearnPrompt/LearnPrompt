# Evidence Ledger：vault placement contract

| Claim | Evidence | Evidence type | Verification date | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- |
| Vault 是本地文件系统文件夹，包含 subfolders | https://obsidian.md/help/Files%2Band%2Bfolders/How%2BObsidian%2Bstores%2Bdata | 官方文档 | 2026-07-12 | 高 | 官方文案未来可能调整，但语义稳定 |
| Obsidian 把 notes 存成 Markdown-formatted plain text files | https://obsidian.md/help/Files%2Band%2Bfolders/How%2BObsidian%2Bstores%2Bdata | 官方文档 | 2026-07-12 | 高 | 只证明文件格式，不证明目录角色 |
| 外部 editor / file manager 改动会被 Obsidian refresh | https://obsidian.md/help/Files%2Band%2Bfolders/How%2BObsidian%2Bstores%2Bdata | 官方文档 | 2026-07-12 | 高 | 不证明任何 placement policy |
| `.obsidian` 位于 vault root，保存 vault-specific settings | https://obsidian.md/help/Files%2Band%2Bfolders/How%2BObsidian%2Bstores%2Bdata ; https://obsidian.md/help/Files%2Band%2Bfolders/Manage%2Bvaults | 官方文档 | 2026-07-12 | 高 | 不等于本文的 `99_系统` 目录 |
| Obsidian 官方不建议 nested vaults | https://obsidian.md/help/Files%2Band%2Bfolders/How%2BObsidian%2Bstores%2Bdata | 官方文档 | 2026-07-12 | 高 | 只证明 warning，不规定其他组织方法 |
| properties 适合小而原子的 human-/machine-readable values，并以 YAML 存于文件顶部 | https://obsidian.md/help/properties | 官方文档 | 2026-07-12 | 高 | 不定义 folder contract |
| Codex 可读取 repo 内的 `AGENTS.md` 一类指导文件 | https://openai.com/index/introducing-codex/ | 官方文档 | 2026-07-12 | 中高 | 只说明 instruction surface，不说明 vault 标准 |
| Claude Code 把 `CLAUDE.md` 当 context 而非 enforced configuration | https://code.claude.com/docs/en/memory | 官方文档 | 2026-07-12 | 高 | 只说明 instruction surface，不说明目录规则 |
| Johnny.Decimal 强调 shallow, predictable structure，但不定义本文角色映射 | https://johnnydecimal.com/ | 官方教学参考 | 2026-07-12 | 中高 | 是教学参考，不是 Obsidian 规范 |
| `vault-placement-contract` 的 valid reference plan 为 12/12 accounted、11 placed、1 rejected | `research/articles/vault-directory-for-ai/showcase/vault-placement-contract/cases/valid-plan.json` | 冻结 showcase 参考答案 | 2026-07-12 | 高 | 这是合成 fixture，不是读者真实 vault |
| Deterministic validator 可稳定返回 `0/51/52/53/54/55` | `research/articles/vault-directory-for-ai/showcase/vault-placement-contract/scripts/verify-showcase.mjs` 输出 | 本地真实运行 | 2026-07-12 | 高 | 只证明本文 fixture 与 validator |
| Showcase 含 Unicode 路径且通过验证 | `cases/valid-plan.json` + `verify-showcase.mjs` 输出中的 `unicode_paths_present: true` | 本地真实运行 | 2026-07-12 | 高 | 只覆盖当前 fixture 的中文路径 |
| Showcase 运行后 manifest unchanged，synthetic vault inventory unchanged | `verify-showcase.mjs` 输出 | 本地真实运行 | 2026-07-12 | 高 | 只覆盖当前脚本集 |
| writer-side 首次 nested run 被只读 state DB 阻断；外层控制器随后按同一冻结合同用 fresh `gpt-5.5` 成功生成两份 plan 报告，validator exit `0`，且只新增 `reports/` 下两份文件 | `showcase/vault-placement-contract/results/live-attempt-summary.json`、`results/codex-last-message-sanitized.json`、`reports/placement-plan.json` | 本地真实运行 | 2026-07-12 | 高 | 证明当前合成 fixture，不代表可以对真实 vault 无审查自动移动 |
| 本文关于 `00/10/20/30/50/99` 角色、canonical path 和 audit gates 是 LearnPrompt 编辑综合 | `brief.md`、`vertical-research.md`、`showcase/vault-placement-contract/fixture/vault-policy.json` | 编辑综合判断 | 2026-07-12 | 高 | 不是官方标准 |
