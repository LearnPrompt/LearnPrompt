# clip-clean

`clip-clean` is a tiny npm CLI that normalizes repeated blank lines in Markdown snippets before they land in changelogs, release notes, or copied issue summaries.

## Release candidate scope

- Target version: `1.4.0`
- Release type: dry-run only
- No external publish step is allowed in this fixture

## Local release smoke command

The pre-publish install check for this release candidate is committed as:

```bash
npm run release:smoke
```

It must finish locally without `npm publish`, registry writes, or version edits.
