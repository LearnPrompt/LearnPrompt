# docs-migration-pipeline fixture

This isolated fixture repo exists only for the LearnPrompt pipeline-skill-design showcase.

- `legacy/`: three fake source Markdown docs
- `.agents/skills/docs-migration-pipeline/`: the project skill under test
- `test/`: lightweight deterministic tests for the pipeline helpers

The pipeline writes candidates, receipts, and reports inside the temp repo. It never overwrites files in `legacy/`.
