You are reading a frozen Markdown handoff packet. Do not invent facts, do not
use prior chat, and do not read files outside this packet.

Allowed input files:

- MEMORY_INDEX.md
- memory/context.md
- memory/decision.md
- memory/runbook.md
- memory/status.md

Requirements:

1. Read only the five packet files above.
2. Do not modify, rename, or delete any packet file.
3. Write exactly two files:
   - reports/handoff.json
   - reports/handoff.md
4. Copy packet field values verbatim into the report. Do not paraphrase.
5. Cite exact packet file paths in both report files.
6. Do not write any other file.

Write `reports/handoff.json` with this exact JSON shape:

```json
{
  "packet_root": ".",
  "index_citation": "MEMORY_INDEX.md",
  "current_status": {
    "answer": "<copy Current status from memory/status.md>",
    "citations": ["memory/status.md"]
  },
  "accepted_decision": {
    "answer": "<copy Accepted decision from memory/decision.md>",
    "citations": ["memory/decision.md"]
  },
  "rationale_and_evidence": {
    "answer": "<copy Decision rationale from memory/decision.md> Evidence: <copy Evidence summary from memory/context.md>",
    "citations": ["memory/decision.md", "memory/context.md"]
  },
  "next_command": {
    "answer": "<copy Next command from memory/runbook.md>",
    "citations": ["memory/runbook.md"]
  },
  "known_limitation": {
    "answer": "<copy Known limitation from memory/status.md>",
    "citations": ["memory/status.md", "memory/context.md"]
  },
  "verification_date": {
    "answer": "<copy Verified at from memory/status.md>",
    "citations": ["memory/status.md"]
  },
  "all_cited_paths": [
    "MEMORY_INDEX.md",
    "memory/context.md",
    "memory/decision.md",
    "memory/runbook.md",
    "memory/status.md"
  ]
}
```

Write `reports/handoff.md` with this exact Markdown template:

```markdown
# Handoff report

## Current status
<copy Current status from memory/status.md>
Citation: memory/status.md

## Accepted decision
<copy Accepted decision from memory/decision.md>
Citation: memory/decision.md

## Rationale and evidence
<copy Decision rationale from memory/decision.md> Evidence: <copy Evidence summary from memory/context.md>
Citations: memory/decision.md, memory/context.md

## Next command
<copy Next command from memory/runbook.md>
Citation: memory/runbook.md

## Known limitation
<copy Known limitation from memory/status.md>
Citations: memory/status.md, memory/context.md

## Verification date
<copy Verified at from memory/status.md>
Citation: memory/status.md

## Exact packet files cited
- MEMORY_INDEX.md
- memory/context.md
- memory/decision.md
- memory/runbook.md
- memory/status.md
```

After writing the files, return a JSON object matching the output schema with:

- `status`: `"completed"`
- `written_files`: `["reports/handoff.json", "reports/handoff.md"]`
- `all_cited_paths`: the same five packet paths
- the same answer strings used in the written JSON report
