# vertical-research.md — markdown-as-agent-memory

## 1. Central claim

A Markdown file becomes a durable handoff record only when it is explicit enough
for a fresh agent to answer the next-action questions without chat history, and
auditable enough that a human can trace every answer back to a stable file path.

That requires two layers at once:

- transport layer: plain text in the filesystem, readable by humans, tools, and Git;
- record layer: explicit status, decision, evidence pointer, next command,
  limitation, scope, verification date, and provenance.

Markdown gives the first layer cheaply. The second layer has to be designed.

## 2. Why the contract is about fields, not prose style

The easiest way to fake a handoff is to write fluent prose that still leaves one
critical question unstated. Most failed handoffs are not unreadable; they are
underspecified.

The packet in this article is intentionally small because smaller packets make
omissions obvious. If `memory/decision.md` has an accepted decision but no
`Evidence path`, the gap is easy to detect and easy to reject. If the same fact
is buried in a long narrative note, the next session often has to summarize it
again before it can decide whether the note is trustworthy.

That is why the fixture records use `Key: value` lines. The article is not
claiming every real project should look exactly like this; it is showing the
minimum degree of field explicitness required for durable handoff.

## 3. Why exact path citations matter

Without exact packet citations, a handoff report still leaves the reviewer with
one more inference step: "Which file said that?" The whole point of a durable
record is to collapse that uncertainty.

Exact path citations serve three jobs:

1. They let a human re-open the source record immediately.
2. They constrain the agent to the actual packet instead of the vibe of the packet.
3. They make replay and diff review deterministic, because the output can be
   compared to a fixed list of expected paths.

This is also why `MEMORY_INDEX.md` stays in the cited path set even though the
other four files carry most of the content. The index proves which files belong
to the packet.

## 4. Failure modes the gate must reject

The four negative exits are not arbitrary. Each corresponds to a different way
teams accidentally label non-handoff material as "memory":

- `41`: missing evidence or provenance. This is the "trust me" packet.
- `42`: contradictory status and decision. This is the "multiple truths" packet.
- `43`: structured sensitive marker. This is the "handoff secretly became secret storage" packet.
- `44`: binary-only or non-text memory. This is the "artifact dump disguised as Markdown" packet.

The important part is not the number itself. The important part is that these
packets do not enter the same channel as a valid handoff.

## 5. Product boundaries

Claude Code memory docs and Codex `AGENTS.md` docs both help by stating what the
platforms do load, but they should not be stretched beyond that.

- `CLAUDE.md` and Codex `AGENTS.md` are instruction surfaces. They define rules,
  expectations, or project conventions for the agent.
- Claude auto memory is product-managed context material.
- This article's packet is a project-authored record bundle. It becomes useful
  only when a prompt, tool, or outer workflow points the fresh agent to it.

So the pedagogical sentence is:

> A packet is durable because it is explicit, readable, and auditable, not
> because the product magically recognizes all Markdown as memory.

## 6. Deterministic replay versus writer-side live evidence

The showcase deliberately preserves two evidence layers:

1. deterministic offline replay that always proves the packet contract,
   negative exits, exact citations, and privacy scan;
2. one fresh `gpt-5.5` live run of the same frozen packet contract.

This separation matters because live generation and deterministic validation
prove different things. The writer-side first invocation failed after `codex
exec` rejected its initial command shape; that history was not rewritten. The
outer controller then ran the corrected script against the same frozen
prompt/schema/fixture. The fresh run completed, wrote only the two expected
reports, preserved the packet, matched the deterministic reference, and passed
all assertions. The article therefore has model-behavior evidence without asking
the reviewer to trust the model's own success message.

## 7. Editorial synthesis used in the article

The article makes three explicit LearnPrompt syntheses:

1. the six-question handoff contract;
2. the five-file packet layout;
3. the `41 / 42 / 43 / 44` gate semantics.

None of these are presented as external standards. They are a local teaching
contract built from primary-source boundaries plus a reproducible fixture.
