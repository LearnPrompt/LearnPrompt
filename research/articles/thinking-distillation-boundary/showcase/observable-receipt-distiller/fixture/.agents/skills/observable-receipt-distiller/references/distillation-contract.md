# Observable Distillation Contract

This Skill uses a **LearnPrompt teaching contract**, not an official product standard.

## Allowed distillation inputs

Only the following observable fields may influence the candidate Skill:

- `input_snapshot`
- `accepted_patch`
- `user_correction`
- `validator.command`
- `validator.result_excerpt`
- `known_limitation`

## Rejection boundary

- Exit `51`: the receipts are evidence-poor. Example: they contain only conclusions without input snapshots, accepted patches, or validator evidence.
- Exit `52`: a receipt sets `contains_sensitive_material: true`.
- Exit `53`: a receipt sets `contains_private_transcript: true` or `requests_hidden_chain_of_thought: true`.
- Exit `54`: a candidate was generated, but it failed the holdout evaluation.

## Candidate boundary

- Write the candidate only to `.agents/skills/frontmatter-repair/`.
- Do not overwrite any existing team skill outside that path.
- Keep the training receipts unchanged.
- The candidate is a proposal, not an automatically approved team skill.

## Learned rules in this synthetic lab

The candidate may only generalize rules that appear in multiple observable artifacts:

1. Missing `title` can be repaired from the first H1 in the body.
2. Missing `description` can be repaired from the opening paragraph’s first sentence.
3. Invalid `sidebar.order` should fall back to `999` when no trustworthy order evidence exists.
4. Already-valid files must remain a no-op.

Everything else stays out of scope.
