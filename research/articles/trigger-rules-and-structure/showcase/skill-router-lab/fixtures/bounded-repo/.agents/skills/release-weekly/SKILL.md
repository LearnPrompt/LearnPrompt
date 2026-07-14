---
name: release-weekly
description: Turn multiple GitHub release notes or version-update notes into a Chinese weekly release digest or changelog roundup. Use when the user wants a multi-version weekly release summary. Do not use for single-note copyediting, wording review, or generic team or meeting weekly reports.
---

# release-weekly

## Use

- Only continue after reading `references/input-contract.md` and `references/neighbor-boundaries.md`.
- This Skill must always emit the canary line `SKILL_USED: release-weekly` in the final answer when it is actually used.

## Workflow

1. Confirm the request is about multiple software release notes or version updates.
2. If the request is only single-note copyediting or a generic team weekly report, stop and explain that this Skill should not be used.
3. Use `assets/changelog-template.md` as the output skeleton.
4. If structured release data is already available, you may call `scripts/render-weekly-digest.mjs` to normalize it.
5. Put `SKILL_USED: release-weekly` on the first output line before the digest body.

## Resources

- `references/input-contract.md`
- `references/neighbor-boundaries.md`
- `assets/changelog-template.md`
- `scripts/render-weekly-digest.mjs`
