# Handoff report

## Current status
Blocked until the digest fixture is replayed with Asia/Shanghai as the canonical timezone.
Citation: memory/status.md

## Accepted decision
Keep Asia/Shanghai as the canonical scheduler timezone for this tutorial fixture.
Citation: memory/decision.md

## Rationale and evidence
The tutorial examples and acceptance fixture were authored around an Asia/Shanghai workday, so preserving that canonical timezone fixes the drift without rewriting the teaching baseline. Evidence: The fixture comparison showed the generated digest at 00:00 UTC instead of the expected 08:00 Asia/Shanghai slot.
Citations: memory/decision.md, memory/context.md

## Next command
node scripts/replay-digest.mjs --timezone Asia/Shanghai
Citation: memory/runbook.md

## Known limitation
The fixture does not cover DST regions, so this packet only proves the Asia/Shanghai path.
Citations: memory/status.md, memory/context.md

## Verification date
2026-07-12
Citation: memory/status.md

## Exact packet files cited
- MEMORY_INDEX.md
- memory/context.md
- memory/decision.md
- memory/runbook.md
- memory/status.md
