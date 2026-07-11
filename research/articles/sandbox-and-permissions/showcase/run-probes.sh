#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
REPO_ROOT=$(cd -- "$SCRIPT_DIR/../../../.." && pwd -P)
SHOWCASE_DIR="$SCRIPT_DIR"
TMP_BASE=$(node -p 'require("node:os").tmpdir()')
TMP_BASE=$(cd -- "$TMP_BASE" && pwd -P)
USER_HOME=$(cd -- "$HOME" && pwd -P)
FIXTURE_ENV_KEY="LP_SANDBOX_$(printf '%s' 'deny-read-fixture-key-v1' | shasum -a 256 | awk '{print toupper(substr($1, 1, 12))}')"
FIXTURE_MARKER_VALUE="$(printf '%s' 'deny-read-fixture-payload-v1' | shasum -a 256 | awk '{print $1}')"
CORE_OUTPUTS=(
  environment.txt
  checksum-manifest.md
  probe-results.md
  verifier-output.txt
)
FROZEN_OUTPUTS=(
  "${CORE_OUTPUTS[@]}"
  replay-stability.txt
)
TEMP_DIRS=()

cleanup() {
  local dir

  for dir in "${TEMP_DIRS[@]-}"; do
    if [[ -n "$dir" && -e "$dir" ]]; then
      rm -rf "$dir"
    fi
  done
}
trap cleanup EXIT

make_temp_dir() {
  local target_var="$1"
  local template="$2"
  local created

  created=$(mktemp -d "$template")
  created=$(cd -- "$created" && pwd -P)
  TEMP_DIRS+=("$created")
  printf -v "$target_var" '%s' "$created"
}

resolve_path() {
  local value="$1"
  local absolute
  local parent
  local base

  if [[ "$value" = /* ]]; then
    absolute="$value"
  else
    absolute="$PWD/$value"
  fi

  parent=$(cd -- "$(dirname -- "$absolute")" && pwd -P)
  base=$(basename -- "$absolute")
  printf '%s/%s\n' "$parent" "$base"
}

path_is_within() {
  local path="$1"
  local root="$2"

  case "$path/" in
    "$root/"*) return 0 ;;
    *) return 1 ;;
  esac
}

record_checksums() {
  local stage="$1"
  local output="$RAW_DIR/$stage.checksum"

  : > "$output"
  while IFS='|' read -r logical_name real_path; do
    if [[ -e "$real_path" ]]; then
      printf '%s %s\n' "$(shasum -a 256 "$real_path" | awk '{print $1}')" "$logical_name" >> "$output"
    else
      printf 'n/a %s\n' "$logical_name" >> "$output"
    fi
  done <<EOF
docs/link.md|$WORKSPACE_DIR/docs/link.md
sentinel.txt|$LAB_ROOT/sentinel.txt
.env|$WORKSPACE_DIR/.env
EOF
}

run_probe() {
  local stage="$1"
  local profile="$2"
  local command="$3"
  local rc

  set +e
  HOME="$LAB_ROOT/home" codex sandbox --log-denials \
    --permissions-profile "$profile" \
    --cd "$WORKSPACE_DIR" \
    /bin/sh -lc "$command" \
    > "$RAW_DIR/$stage.log" 2>&1
  rc=$?
  set -e

  printf '%s\n' "$rc" > "$RAW_DIR/$stage.exit"
  record_checksums "$stage"
}

write_environment() {
  local output="$1"
  local config_rc

  config_rc=$(tr -d '\n' < "$RAW_DIR/config-verify.exit")

  cat > "$output" <<EOF
Verification date: $(date +%F)
Platform: macOS $(sw_vers -productVersion)
Kernel: $(uname -srm)
Node: $(node -v)
Codex CLI: $(codex --version)

Local help surface:
- \`codex --help\` exposes \`--sandbox <SANDBOX_MODE>\` with \`read-only\`, \`workspace-write\`, \`danger-full-access\`
- \`codex --help\` exposes \`--ask-for-approval <APPROVAL_POLICY>\` including \`untrusted\`, \`on-request\`, \`never\`
- \`codex sandbox --help\` exposes \`--permissions-profile <NAME>\`
- \`codex sandbox --help\` exposes \`--log-denials\`

Config verification:
- \`HOME=<LAB_ROOT>/home codex --strict-config help\` exit code: $config_rc
- Purpose: prove the custom TOML profile is accepted by this client

Important methodological note:
- The three probes use permission profiles only (\`--permissions-profile ...\`).
- Approval behavior is explained from official docs and local help, not inferred from \`codex sandbox\`.
- \`approval_policy = "never"\` is fixed only to remove interactive branching from the local probe lab.
- The \`.env\` payload is a deterministic non-credential fixture generated at runtime; its key and value are never frozen into committed outputs.
- Managed \`allowed_permission_profiles\` is the official exception that can force permission profiles in managed requirements; this local lab does not exercise managed config.
EOF
}

reject_lab_root() {
  local candidate="$1"
  local tmpdir_root=""

  if path_is_within "$candidate" "$TMP_BASE"; then
    printf 'LAB_ROOT must not live under os.tmpdir(): %s\n' "$candidate" >&2
    exit 1
  fi

  if [[ -n "${TMPDIR:-}" ]]; then
    tmpdir_root=$(cd -- "$TMPDIR" && pwd -P)
    if path_is_within "$candidate" "$tmpdir_root"; then
      printf 'LAB_ROOT must not live under TMPDIR: %s\n' "$candidate" >&2
      exit 1
    fi
  fi

  if path_is_within "$candidate" "$REPO_ROOT"; then
    printf 'LAB_ROOT must not live inside the current repo: %s\n' "$candidate" >&2
    exit 1
  fi

  if ! path_is_within "$candidate" "$USER_HOME"; then
    printf 'LAB_ROOT must live under the current user home: %s\n' "$candidate" >&2
    exit 1
  fi
}

hash_file() {
  shasum -a 256 "$1" | awk '{print $1}'
}

run_cycle() {
  local output_dir="$1"
  local verifier_output
  local file
  local config_rc

  make_temp_dir LAB_ROOT "$USER_HOME/learnprompt-sandbox-lab.XXXXXX"
  reject_lab_root "$LAB_ROOT"
  make_temp_dir RAW_DIR "$TMP_BASE/learnprompt-sandbox-raw.XXXXXX"
  make_temp_dir GEN_DIR "$TMP_BASE/learnprompt-sandbox-freeze.XXXXXX"
  WORKSPACE_DIR="$LAB_ROOT/workspace"
  verifier_output="$GEN_DIR/verifier-output.txt"

  mkdir -p "$WORKSPACE_DIR/docs" "$LAB_ROOT/home/.codex"

  cat > "$WORKSPACE_DIR/docs/link.md" <<'EOF'
# docs link
status=clean
EOF

  cat > "$WORKSPACE_DIR/.env" <<EOF
$FIXTURE_ENV_KEY=$FIXTURE_MARKER_VALUE
EOF

  cat > "$LAB_ROOT/sentinel.txt" <<'EOF'
sentinel=unchanged
EOF

  cp "$SHOWCASE_DIR/docs-edit.profile.toml" "$LAB_ROOT/home/.codex/config.toml"

  codex --help > "$RAW_DIR/codex-help.log" 2>&1
  codex sandbox --help > "$RAW_DIR/codex-sandbox-help.log" 2>&1

  set +e
  HOME="$LAB_ROOT/home" codex --strict-config help > "$RAW_DIR/config-verify.log" 2>&1
  config_rc=$?
  set -e
  printf '%s\n' "$config_rc" > "$RAW_DIR/config-verify.exit"

  record_checksums initial
  run_probe probe1 :read-only 'printf "probe-1\n" >> docs/link.md'
  run_probe probe2 :workspace 'printf "probe-2\n" >> docs/link.md && printf "probe-2\n" >> ../sentinel.txt'
  run_probe probe3 docs-edit 'printf "probe-3\n" >> docs/link.md && cat .env > /dev/null'

  write_environment "$GEN_DIR/environment.txt"

  RAW_DIR="$RAW_DIR" \
  LAB_ROOT="$LAB_ROOT" \
  FIXTURE_MARKER="$FIXTURE_MARKER_VALUE" \
  CHECKSUM_MANIFEST_OUT="$GEN_DIR/checksum-manifest.md" \
  PROBE_RESULTS_OUT="$GEN_DIR/probe-results.md" \
  "$SHOWCASE_DIR/verifier.sh" > /dev/null

  RAW_DIR="$RAW_DIR" \
  LAB_ROOT="$LAB_ROOT" \
  FIXTURE_MARKER="$FIXTURE_MARKER_VALUE" \
  CHECKSUM_MANIFEST_EXPECTED="$GEN_DIR/checksum-manifest.md" \
  "$SHOWCASE_DIR/verifier.sh" > "$verifier_output"

  for file in "${CORE_OUTPUTS[@]}"; do
    if [[ "$file" == "verifier-output.txt" ]]; then
      cp "$verifier_output" "$output_dir/$file"
    else
      cp "$GEN_DIR/$file" "$output_dir/$file"
    fi
  done
}

write_replay_stability() {
  local baseline_dir="$1"
  local replay_dir="$2"
  local output="$3"
  local file
  local baseline_hash
  local replay_hash
  local stable
  local overall_stable=yes

  {
    cat <<'EOF'
# Replay stability

本文件由 `run-probes.sh` 在同一次调用里连续生成两轮 frozen outputs 后写出。它只列出文件名和 SHA-256，不含任何绝对路径。

| File | Pass 1 SHA-256 | Pass 2 SHA-256 | Stable |
| --- | --- | --- | --- |
EOF

    for file in "${CORE_OUTPUTS[@]}"; do
      baseline_hash=$(hash_file "$baseline_dir/$file")
      replay_hash=$(hash_file "$replay_dir/$file")
      stable=yes
      if [[ "$baseline_hash" != "$replay_hash" ]]; then
        stable=no
        overall_stable=no
      fi
      printf '| `%s` | `%s` | `%s` | `%s` |\n' "$file" "$baseline_hash" "$replay_hash" "$stable"
    done

    printf '\nstable=%s\n' "$overall_stable"
  } > "$output"

  if [[ "$overall_stable" != "yes" ]]; then
    return 1
  fi
}

make_temp_dir PASS1_DIR "$TMP_BASE/learnprompt-sandbox-pass1.XXXXXX"
make_temp_dir PASS2_DIR "$TMP_BASE/learnprompt-sandbox-pass2.XXXXXX"

run_cycle "$PASS1_DIR"
run_cycle "$PASS2_DIR"
write_replay_stability "$PASS1_DIR" "$PASS2_DIR" "$PASS2_DIR/replay-stability.txt"

for file in "${CORE_OUTPUTS[@]}"; do
  cp "$PASS2_DIR/$file" "$SHOWCASE_DIR/$file"
done
cp "$PASS2_DIR/replay-stability.txt" "$SHOWCASE_DIR/replay-stability.txt"

printf '%s\n' "frozen_showcase_outputs=$(IFS=,; printf '%s' "${FROZEN_OUTPUTS[*]}")"
cat "$SHOWCASE_DIR/verifier-output.txt"
awk '/^stable=/' "$SHOWCASE_DIR/replay-stability.txt"
