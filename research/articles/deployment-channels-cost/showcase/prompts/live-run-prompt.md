# Synthetic deployment recommendation task

Read only these inputs:

- `fixture/deployment-workload.json`
- `contracts/deployment-contract.json`

Do not read any user profile, OpenClaw config/state, credentials, environment secrets, cloud account, channel account, repository file outside those two inputs, or network resource. Do not deploy, install, connect, probe a real channel, invoke OpenClaw, or claim provider billing.

Write exactly these two files and nothing else:

- `reports/deployment-recommendation.json`
- `reports/deployment-recommendation.md`

The JSON must preserve the fixture id and SHA-256; state that prices are replaceable examples and `provider_invoice` is false; replay all cost formulas; select only after availability, persistence, exposure, auth and channel policy pass; include the exact live-probe contract and all five budget controls. The Markdown is a human summary of the same JSON. Never include a credential, account identifier, local absolute path, or runtime identifier.
