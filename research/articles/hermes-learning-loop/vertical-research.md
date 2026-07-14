# Vertical Research

Verified at: 2026-07-12.

## Central Question

What mechanisms make Hermes appear to "learn", and where should a careful user insert approval so bad lessons do not persist?

## Mechanism Stack

1. **Session evidence**: the conversation, tool outcomes, corrections, and durable facts observed during work.
2. **Background self-improvement review**: after a turn, Hermes may propose or make memory / Skill updates. This is not model weight training and not a guarantee of correct learning on every turn.
3. **Fact/procedure split**: stable facts and preferences go to bounded built-in memory; reusable multi-step workflows go to Skills.
4. **Write approval gate**: `memory.write_approval: true` and `skills.write_approval: true` stage writes as pending instead of committing them.
5. **Human review**: memory can be reviewed inline; skill diffs require CLI/dashboard or pending JSON because full SKILL.md diffs are too large for chat bubbles.
6. **Next-session effect**: built-in memory affects the next session through a frozen session-start snapshot; Skills load on demand when relevant.
7. **Curator side path**: periodic maintenance can consolidate/archive/restore agent-created skills and manage backups/rollback. It is not the same event as the turn-after background review.

## Failure Modes

- One-off errors become permanent "lessons".
- Credentials or secret-shaped text enter an always-injected store.
- A procedure is compressed into memory, making every session carry irrelevant workflow text.
- A stable preference is converted into a Skill, so the agent forgets it until a skill is loaded.
- Background review is mistaken for guaranteed learning or for model training.
- Local v0.17.0 CLI help is treated as current documentation for v0.18.x.
- Current docs are treated as proof of this local install's exact behavior.

## Boundary Conditions

- Built-in memory is always-on context and intentionally bounded. Use it for compact, durable facts.
- Skills are longer, on-demand procedural instructions. Use them when the "how" takes multiple steps and should not always occupy the prompt.
- External memory providers are optional extensions and do not replace built-in memory.
- Approval gates are consent controls, not quality guarantees; reviewers still need evidence, version scope, and privacy checks.
- Curator maintenance should be described by version. Local v0.17.0 help says bundled and hub-installed skills are never touched. Current online docs as of 2026-07-12 describe a newer boundary where hub skills remain off-limits while bundled built-ins may be archived under `curator.prune_builtins: true`, never patched/consolidated/deleted.
