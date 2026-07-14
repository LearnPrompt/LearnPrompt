# clip-clean release readiness report (1.4.0)

- Final exit code: `0`
- Decision: ready
- Tests: recorded separately by the caller

| id | question | result | severity | pass_rule | evidence | not_applicable_policy |
| --- | --- | --- | --- | --- | --- | --- |
| PACK-00 | Does npm pack dry-run assemble a local tarball for clip-clean 1.4.0 without publishing? | pass | major | npm pack --dry-run --json exits 0 and reports clip-clean-1.4.0.tgz. | npm pack --dry-run --json exit 0; filename=clip-clean-1.4.0.tgz; entryCount=5 | Never N/A for an npm CLI release candidate; a package that cannot be packed cannot ship. |
| CHANGELOG-21 | Does CHANGELOG.md contain a 1.4.0 section with at least one user-visible change? | pass | blocker | CHANGELOG.md exists and includes a 1.4.0 heading plus at least one bullet item. | CHANGELOG.md inspected; first release heading=1.4.0 | Never N/A for this fixture. If there is no changelog, fail the gate instead of waiving it. |
| VERSION-22 | Do package.json, the changelog heading, and the install contract agree on 1.4.0? | pass | blocker | package.json.version is 1.4.0; CHANGELOG.md headline is 1.4.0; the install contract does not contradict that version. | package.json=1.4.0; changelog=1.4.0; install-command=local-smoke-only | Only N/A if the repo proves there is no versioned package surface; cite the inspected file in evidence. |
| INSTALL-23 | Can the committed install command be verified locally without npm publish or registry writes? | pass | blocker | The committed install command is local-only and its smoke run exits 0 after packaging the tarball. | release/install-command.txt=npm run release:smoke; smoke output=> clip-clean@1.4.0 release:smoke<br>> node scripts/release-smoke.mjs<br><br>tarball=clip-clean-1.4.0.tgz<br>install=ok<br>help=ok | Only N/A if the package has no executable surface and the inspected bin mapping or CLI entrypoint proves that absence. |

## Remaining gate notes

- All frozen release rows passed in dry-run mode.
- This report does not publish the package. It only checks local dry-run evidence.
