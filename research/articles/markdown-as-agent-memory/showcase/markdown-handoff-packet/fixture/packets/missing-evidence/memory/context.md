# Context record

Record kind: context
Scope: scheduled digest timezone drift tutorial fixture
Verified at: 2026-07-12
Provenance: synthetic LearnPrompt fixture for markdown-as-agent-memory
Incident: The scheduled digest preview drifted because the worker fell back to UTC while the acceptance fixture still expected Asia/Shanghai.
Why it matters: A fresh agent must explain the drift and continue the replay without rereading prior chat or guessing the timezone policy.
Evidence summary: The fixture comparison showed the generated digest at 00:00 UTC instead of the expected 08:00 Asia/Shanghai slot.
Evidence path: memory/status.md
Known limitation: The fixture only covers Asia/Shanghai and does not test DST regions.
