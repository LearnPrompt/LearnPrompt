# Visual asset contract

## Required outcome

Every deep tutorial must render at least one local image that materially teaches a mechanism, decision, sequence, comparison, or verified result. A cover, logo, mascot, or decorative banner alone is not sufficient.

Use this exact public layout:

```text
starlight/public/images/articles/<article-slug>/<filename>
```

Reference the file from MDX as `/images/articles/<article-slug>/<filename>`. Add a descriptive alt and an immediate italic caption beginning with `图注：`. Keep the caption focused on what the reader should notice, not on visual decoration.

## Asset ledger

Create `asset-ledger.md` in the article research directory with these columns:

```markdown
| Public path | Teaching purpose | Original source | Creator | License | Modifications | Verified at |
| --- | --- | --- | --- | --- | --- | --- |
```

Use an immutable source URL for copied assets when possible. For an original diagram, name the exact repository-relative source section or evidence file that it visualizes; generic provenance such as “article-derived diagram” is not enough on its own. State `none` for no modification; otherwise name cropping, annotation, translation, recomposition, or redaction. The article's bottom source section must also credit external visual sources and their licenses.

The `Teaching purpose` cell must state the mechanism, decision, sequence, comparison, or result the reader should understand. `装饰`, `封面`, `横幅`, `logo`, or similar display-only purposes do not qualify. The `License` cell must contain a specific license or an explicit permission reference; `原创`, `自有`, and `project-owned` are ownership claims, not licenses.

For a verified article, the last independent review must contain one machine-readable block covering every rendered image:

```text
Visual assessment: PASS
Asset: /images/articles/<article-slug>/<filename>
Teaching role: <what the reader learns>
Decorative-only: no
Rights: <exact license or explicit permission reference>
```

The validator checks this attestation and the independent reviewer judges whether it is truthful.

## Source order

1. Original LearnPrompt diagram derived from the article's verified model.
2. Redacted screenshot or output from the article's own Showcase.
3. Current official product visual with an explicit reusable license or permission.
4. Orange Book visual whose repository terms cover the intended use.

Do not use a third-party screenshot merely because it appears in an otherwise licensed book. Product logos and trademarks are not automatically licensed. If ownership or reuse rights are unclear, link to the source instead of copying the image.

## Orange Book license matrix

- `codex-orange-book` and `claude-code-orange-book`: repository README declares CC BY-NC-SA 4.0. Preserve author credit, repository URL, license link, and modification notice. Do not use for commercial purposes.
- `loop-engineering-orange-book`: MIT License covers the work and associated files. Preserve the copyright and permission notice in the ledger and article sources.
- `harness-engineering-orange-book`: repository states educational sharing with attribution but does not publish a standard open license. Do not copy or adapt its images unless the project owner records explicit permission; a citation alone is not permission to redistribute.
- Treat every other Orange Book independently. Never infer one repository's license from another.

Orange Book screenshots are snapshots, not proof of current product behavior. Re-check current features, commands, versions, prices, permissions, and UI against official sources or a dated live run.
