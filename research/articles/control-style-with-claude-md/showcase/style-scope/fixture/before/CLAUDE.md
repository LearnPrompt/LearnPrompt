# Repo Rules

- Read `README.md` and `package.json` before editing so you use real commands.
- Keep root rules limited to repo-wide instructions.
- UI and API details belong in `.claude/rules/`, not in this root file.
- Run `node ../verify-style-scope.mjs before` before handoff.
- If a style rule can be checked deterministically, prefer the checker over a longer explanation here.
