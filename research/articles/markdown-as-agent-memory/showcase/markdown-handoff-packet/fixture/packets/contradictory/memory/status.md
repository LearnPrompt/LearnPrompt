# Status record

Record kind: status
Scope: scheduled digest timezone drift tutorial fixture
Verified at: 2026-07-12
Provenance: synthetic LearnPrompt fixture for markdown-as-agent-memory
Current status: Blocked until the digest fixture is replayed with UTC as the canonical timezone.
Canonical timezone: UTC
Observed symptom: The scheduled digest shifted by eight hours when the worker defaulted to UTC.
Evidence path: memory/context.md
Next command: node scripts/replay-digest.mjs --timezone UTC
Known limitation: The fixture does not cover DST regions, so this packet only proves the Asia/Shanghai path.
