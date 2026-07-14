# deployment-budget-safety-gate

## Question

Given a frozen synthetic OpenClaw workload, which of local laptop, always-on VPS/container, and managed template is eligible after availability, persistence, exposure/auth/channel policy, and budget are all checked?

## Safety boundary

- Inputs are synthetic; prices are replaceable examples, not quotes.
- No OpenClaw installation or local CLI probe exists in this environment and none is fabricated.
- No real config, state, profile, credential, cloud account, channel account, message, invoice, or network deployment is read.
- The fresh-model layer may read only the fixture and contract and may write only two recommendation reports.
- Deterministic validation, not model prose, decides acceptance.

## Files

- `fixture/deployment-workload.json`: workload, candidates, pricing assumptions, and budget controls.
- `contracts/deployment-contract.json`: formulas, allowed paths, commands, and exit codes.
- `scripts/generate-recommendation.mjs`: deterministic reference generator.
- `scripts/validate-recommendation.mjs`: mechanical formula/security/budget validator.
- `scripts/verify-showcase.mjs`: valid plus 111-115 mutation matrix and fixture-integrity check.
- `scripts/privacy-scan.mjs`: report/result privacy gate.
- `scripts/run-codex-live.mjs`: bounded fresh `gpt-5.4` recommendation attempt.

## Reproduce

```bash
node research/articles/deployment-channels-cost/showcase/scripts/verify-showcase.mjs
node research/articles/deployment-channels-cost/showcase/scripts/privacy-scan.mjs
```

The valid calculation is replayable from the fixture. The fixed host inputs are 0/18/30, the common variable subtotal is 48.24, optional channel plus egress/observability is 14.00, and the eligible VPS total is 80.24 under a 100.00 cap. The local candidate is cheaper but rejected because it does not satisfy 24/7 availability.

## Exit contract

| Exit | Meaning |
| ---: | --- |
| 0 | recommendation is formula-consistent and all hard gates pass |
| 111 | availability/persistence assumptions missing |
| 112 | public exposure/auth/DM/group policy unsafe |
| 113 | variable cost inputs, formulas, fixture integrity, or invoice boundary invalid |
| 114 | credential/account leakage or config-only health claim |
| 115 | cap, rate/concurrency, fallback, or kill switch missing |

## Limits

This Showcase does not benchmark providers, predict a real invoice, prove uptime, or prove a real channel is healthy. Actual production acceptance still requires the operator to fill dated prices, deploy in an isolated environment, and run the official RPC/channel/health/doctor checks.
