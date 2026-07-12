# Learning Proposals

| Candidate | Action | Target store | Human approval | Reason |
| --- | --- | --- | --- | --- |
| c01-user-pref-brief-chinese | stage-memory | memory:user | true | Stable fact or preference that should be available at the next session start. |
| c02-project-env-starlight | stage-memory | memory:memory | true | Stable fact or preference that should be available at the next session start. |
| c03-publish-flow | stage-skill | skill | true | Reusable multi-step workflow belongs in an on-demand procedure, not always-on memory. |
| c04-one-time-503 | reject-transient | none | false | One-off failure is not durable enough to become memory or procedure. |
| c05-secret-shaped-token | reject-sensitive | none | false | Credential-shaped material must never enter memory or skill proposals. |
| c06-single-tool-behavior | needs-more-evidence | none | false | Single observation needs repeatable evidence before learning. |
