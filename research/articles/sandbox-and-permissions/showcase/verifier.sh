#!/usr/bin/env bash
set -euo pipefail

: "${RAW_DIR:?set RAW_DIR to the outside-worktree raw capture directory}"
: "${FIXTURE_MARKER:?set FIXTURE_MARKER to the runtime test marker written into .env}"
: "${LAB_ROOT:?set LAB_ROOT to the lab root used for redaction}"

CHECKSUM_MANIFEST_OUT="${CHECKSUM_MANIFEST_OUT:-}"
CHECKSUM_MANIFEST_EXPECTED="${CHECKSUM_MANIFEST_EXPECTED:-}"
PROBE_RESULTS_OUT="${PROBE_RESULTS_OUT:-}"

tmp_dir=$(mktemp -d "${TMPDIR:-/tmp}/sandbox-permissions-verifier.XXXXXX")
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT

read_exit() {
  tr -d '\n' < "$RAW_DIR/$1.exit"
}

read_checksum() {
  local stage="$1"
  local logical_path="$2"
  local value

  value="$(awk -v target="$logical_path" '$2 == target { print $1 }' "$RAW_DIR/$stage.checksum" | head -n 1)"
  if [[ -z "$value" ]]; then
    printf 'n/a'
  else
    printf '%s' "$value"
  fi
}

redact_line() {
  local line="$1"

  line="${line//$LAB_ROOT/<LAB_ROOT>}"
  printf '%s\n' "$line"
}

first_matching_line() {
  local file="$1"
  local pattern="$2"

  awk -v target="$pattern" '$0 ~ target { print; exit }' "$file"
}

write_checksum_manifest() {
  cat > "$1" <<EOF
# Checksum manifest

本表由 \`verifier.sh\` 根据工作树外 raw checksum 生成。所有路径都只保留逻辑名，不含用户绝对路径。

| Stage | \`docs/link.md\` | \`sentinel.txt\` | \`.env\` |
| --- | --- | --- | --- |
| initial | $initial_link | $initial_sentinel | $initial_env |
| probe1 | $probe1_link | $probe1_sentinel | $probe1_env |
| probe2 | $probe2_link | $probe2_sentinel | $probe2_env |
| probe3 | $probe3_link | $probe3_sentinel | $probe3_env |

## Derived checks

- \`docs/link.md\`：\`initial == probe1\`、\`probe2 != probe1\`、\`probe3 != probe2\`
- \`sentinel.txt\`：\`initial == probe1 == probe2 == probe3\`
- \`.env\`：\`initial == probe1 == probe2 == probe3\`
EOF
}

write_probe_results() {
  cat > "$1" <<EOF
# Probe results

本文件由 \`run-probes.sh\` 实跑后冻结。原始日志和 checksum 先写入 \`os.tmpdir()\` 下的工作树外目录，再由 \`verifier.sh\` 生成本脱敏摘要和同目录的 \`checksum-manifest.md\`。
本次 \`.env\` 写入的是运行时确定性生成的非 credential 测试标记，只用于验证 deny-read 和日志检索；其 key/value 不进入冻结产物。

| Probe | Profile | Command intent | Exit code | \`docs/link.md\` | \`sentinel.txt\` | \`.env\` | Proof |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| 1 | \`:read-only\` | 追加写 \`docs/link.md\` | $probe1_rc | 未改（\`initial == probe1\`） | 未改（\`initial == probe1\`） | 未改（\`initial == probe1\`） | \`checksum-manifest.md\` |
| 2 | \`:workspace\` | 先写 \`docs/link.md\`，再越界写同级 \`sentinel.txt\` | $probe2_rc | 已追加 \`probe-2\`（\`probe2 != probe1\`） | 未改（\`probe2 == initial\`） | 未改（\`probe2 == initial\`） | \`checksum-manifest.md\` |
| 3 | \`docs-edit\` | 先写 \`docs/link.md\`，再读取 \`.env\` | $probe3_rc | 已追加 \`probe-3\`（\`probe3 != probe2\`） | 未改（\`probe3 == initial\`） | 读取失败且未改（\`probe3 == initial\`） | \`checksum-manifest.md\` |

## Probe 1：\`:read-only\`

命令意图：

\`\`\`bash
HOME=<LAB_ROOT>/home \\
codex sandbox --log-denials \\
  --permissions-profile :read-only \\
  --cd <LAB_ROOT>/workspace \\
  /bin/sh -lc 'printf "probe-1\\n" >> docs/link.md'
\`\`\`

最小日志：

\`\`\`text
$probe1_error_line
$probe1_denial_line
\`\`\`

副作用：

- 退出码：\`$probe1_rc\`
- \`docs/link.md\`、\`sentinel.txt\`、\`.env\` 的 SHA-256 见 \`checksum-manifest.md\`

## Probe 2：\`:workspace\`

命令意图：

\`\`\`bash
HOME=<LAB_ROOT>/home \\
codex sandbox --log-denials \\
  --permissions-profile :workspace \\
  --cd <LAB_ROOT>/workspace \\
  /bin/sh -lc 'printf "probe-2\\n" >> docs/link.md && printf "probe-2\\n" >> ../sentinel.txt'
\`\`\`

最小日志：

\`\`\`text
$probe2_error_line
$probe2_denial_line
\`\`\`

副作用：

- 退出码：\`$probe2_rc\`
- \`docs/link.md\` 在 \`probe2\` 与 \`probe1\` 之间发生递进；\`sentinel.txt\` 与 \`.env\` 仍与 \`initial\` 一致，见 \`checksum-manifest.md\`

说明：这次实验室故意不放在 temp 目录下。因为官方 \`Permissions\` 文档明确写到，内置 \`:workspace\` 也允许 system temp directories；如果 \`sentinel\` 也在 temp，越界写测试会失真。

## Probe 3：\`docs-edit\`

命令意图：

\`\`\`bash
HOME=<LAB_ROOT>/home \\
codex sandbox --log-denials \\
  --permissions-profile docs-edit \\
  --cd <LAB_ROOT>/workspace \\
  /bin/sh -lc 'printf "probe-3\\n" >> docs/link.md && cat .env > /dev/null'
\`\`\`

最小日志：

\`\`\`text
$probe3_error_line
$probe3_denial_line
\`\`\`

副作用：

- 退出码：\`$probe3_rc\`
- \`docs/link.md\` 在 \`probe3\` 与 \`probe2\` 之间发生递进；\`sentinel.txt\` 与 \`.env\` 仍与 \`initial\` 一致，见 \`checksum-manifest.md\`
EOF
}

config_rc=$(read_exit config-verify)
probe1_rc=$(read_exit probe1)
probe2_rc=$(read_exit probe2)
probe3_rc=$(read_exit probe3)

initial_link=$(read_checksum initial docs/link.md)
initial_sentinel=$(read_checksum initial sentinel.txt)
initial_env=$(read_checksum initial .env)
probe1_link=$(read_checksum probe1 docs/link.md)
probe1_sentinel=$(read_checksum probe1 sentinel.txt)
probe1_env=$(read_checksum probe1 .env)
probe2_link=$(read_checksum probe2 docs/link.md)
probe2_sentinel=$(read_checksum probe2 sentinel.txt)
probe2_env=$(read_checksum probe2 .env)
probe3_link=$(read_checksum probe3 docs/link.md)
probe3_sentinel=$(read_checksum probe3 sentinel.txt)
probe3_env=$(read_checksum probe3 .env)

probe1_error_line=$(redact_line "$(first_matching_line "$RAW_DIR/probe1.log" "Operation not permitted")")
probe1_denial_line=$(redact_line "$(first_matching_line "$RAW_DIR/probe1.log" "file-write-data .*docs/link\\.md$")")
probe2_error_line=$(redact_line "$(first_matching_line "$RAW_DIR/probe2.log" "Operation not permitted")")
probe2_denial_line=$(redact_line "$(first_matching_line "$RAW_DIR/probe2.log" "file-write-data .*sentinel\\.txt$")")
probe3_error_line=$(redact_line "$(first_matching_line "$RAW_DIR/probe3.log" "Operation not permitted")")
probe3_denial_line=$(redact_line "$(first_matching_line "$RAW_DIR/probe3.log" "file-read-data .*\\.env$")")

if rg -F -n -- "$FIXTURE_MARKER" "$RAW_DIR"/*.log >/dev/null 2>&1; then
  fixture_marker_in_logs=yes
else
  fixture_marker_in_logs=no
fi

if [[ "$initial_sentinel" == "$probe1_sentinel" && "$initial_sentinel" == "$probe2_sentinel" && "$initial_sentinel" == "$probe3_sentinel" ]]; then
  sentinel_unchanged=yes
else
  sentinel_unchanged=no
fi

if [[ "$initial_link" == "$probe1_link" ]]; then
  link_probe1_matches_initial=yes
else
  link_probe1_matches_initial=no
fi

if [[ "$probe2_link" != "$probe1_link" ]]; then
  link_probe2_differs_from_probe1=yes
else
  link_probe2_differs_from_probe1=no
fi

if [[ "$probe3_link" != "$probe2_link" ]]; then
  link_probe3_differs_from_probe2=yes
else
  link_probe3_differs_from_probe2=no
fi

if [[ "$initial_env" == "$probe1_env" && "$initial_env" == "$probe2_env" && "$initial_env" == "$probe3_env" ]]; then
  env_unchanged=yes
else
  env_unchanged=no
fi

if [[ -n "$CHECKSUM_MANIFEST_OUT" ]]; then
  write_checksum_manifest "$CHECKSUM_MANIFEST_OUT"
fi

if [[ -n "$PROBE_RESULTS_OUT" ]]; then
  write_probe_results "$PROBE_RESULTS_OUT"
fi

checksum_manifest_matches_expected=skipped
if [[ -n "$CHECKSUM_MANIFEST_EXPECTED" ]]; then
  generated_manifest="$tmp_dir/generated-checksum-manifest.md"
  write_checksum_manifest "$generated_manifest"
  if cmp -s "$generated_manifest" "$CHECKSUM_MANIFEST_EXPECTED"; then
    checksum_manifest_matches_expected=yes
  else
    checksum_manifest_matches_expected=no
  fi
fi

failure=0
if [[ "$config_rc" != "0" ]]; then
  failure=1
fi
if [[ "$probe1_rc" != "1" || "$probe2_rc" != "1" || "$probe3_rc" != "1" ]]; then
  failure=1
fi
if [[ "$link_probe1_matches_initial" != "yes" || "$link_probe2_differs_from_probe1" != "yes" || "$link_probe3_differs_from_probe2" != "yes" ]]; then
  failure=1
fi
if [[ "$sentinel_unchanged" != "yes" || "$env_unchanged" != "yes" || "$fixture_marker_in_logs" != "no" ]]; then
  failure=1
fi
if [[ -z "$probe1_error_line" || -z "$probe1_denial_line" || -z "$probe2_error_line" || -z "$probe2_denial_line" || -z "$probe3_error_line" || -z "$probe3_denial_line" ]]; then
  failure=1
fi
if [[ "$checksum_manifest_matches_expected" == "no" ]]; then
  failure=1
fi

printf '%s\n' \
  "config_rc=$config_rc" \
  "probe1_rc=$probe1_rc" \
  "probe2_rc=$probe2_rc" \
  "probe3_rc=$probe3_rc" \
  "link_probe1_matches_initial=$link_probe1_matches_initial" \
  "link_probe2_differs_from_probe1=$link_probe2_differs_from_probe1" \
  "link_probe3_differs_from_probe2=$link_probe3_differs_from_probe2" \
  "sentinel_unchanged=$sentinel_unchanged" \
  "env_unchanged=$env_unchanged" \
  "fixture_marker_in_logs=$fixture_marker_in_logs" \
  "checksum_manifest_matches_expected=$checksum_manifest_matches_expected"

if (( failure != 0 )); then
  exit 1
fi
