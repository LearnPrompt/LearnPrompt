#!/usr/bin/env node

import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptFile = fileURLToPath(import.meta.url);
const validatorFile = path.join(path.dirname(scriptFile), "validate-golden-mdx.mjs");
const repositoryRoot = path.resolve(path.dirname(scriptFile), "../../../..");
const articleRelative = "starlight/src/content/docs/codex/codex-form-factors.mdx";
const researchRelative = "research/articles/codex-form-factors";
const temporaryRoot = mkdtempSync(path.join(os.tmpdir(), "golden-mdx-validator-"));

function runValidator() {
  return spawnSync(
    process.execPath,
    [
      validatorFile,
      "--article",
      articleRelative,
      "--research",
      researchRelative,
    ],
    { cwd: temporaryRoot, encoding: "utf8" },
  );
}

try {
  const articleTarget = path.join(temporaryRoot, articleRelative);
  const researchTarget = path.join(temporaryRoot, researchRelative);
  mkdirSync(path.dirname(articleTarget), { recursive: true });
  mkdirSync(path.dirname(researchTarget), { recursive: true });
  cpSync(path.join(repositoryRoot, articleRelative), articleTarget);
  cpSync(path.join(repositoryRoot, researchRelative), researchTarget, {
    recursive: true,
  });

  const baseline = runValidator();
  if (baseline.status !== 0) {
    throw new Error(`valid fixture failed:\n${baseline.stdout}${baseline.stderr}`);
  }

  const leakFile = path.join(researchTarget, "showcase", "validator-leak");
  const negativeCases = [
    {
      label: "runtime identifier",
      content: "session id: 019f4cfe-f4e3-7e41-b61b-ddfcc767e3e0\n",
    },
    {
      label: "runtime identifier",
      content: "thread id: 019f4cfe-f4e3-7e41-b61b-ddfcc767e3e0\n",
    },
    {
      label: "runtime identifier",
      content: "turn-id: 019f4cfe-f4e3-7e41-b61b-ddfcc767e3e0\n",
    },
    {
      label: "user-specific local path",
      content: "workspace=/Users/example/private/project\n",
    },
    {
      label: "user-specific local path",
      content: "log=/private/tmp/review-output.log\n",
    },
    {
      label: "user-specific local path",
      content: "log=/var/folders/04/random/T/review-output.log\n",
    },
    {
      label: "account identifier or account header",
      content: "account_id=c076699f-4141-4446-9303-9f7de73b7ab5\n",
    },
    {
      label: "credential-shaped secret",
      content: "token=sk-ant-abcdefghijklmnopqrstuvwx\n",
    },
    {
      label: "credential-shaped secret",
      content: "Authorization: Basic dXNlcjpwYXNzd29yZA==\n",
    },
    {
      label: "credential-shaped secret",
      content: "x-api-key: abcdefghijklmnopqrstuvwxyz123456\n",
    },
    {
      label: "credential-shaped secret",
      content: "Cookie: __Secure-next-auth.session-token=abc123def456ghi789jkl012mno345\n",
    },
  ];

  for (const testCase of negativeCases) {
    writeFileSync(leakFile, testCase.content);
    const result = runValidator();
    const output = `${result.stdout}${result.stderr}`;
    if (result.status === 0 || !output.includes(testCase.label)) {
      throw new Error(
        `${testCase.label} was not rejected as expected:\n${output}`,
      );
    }
  }

  unlinkSync(leakFile);
  const reviewFile = path.join(researchTarget, "review.md");
  const validReview = readFileSync(reviewFile, "utf8");
  const reviewCases = [
    {
      label: "independent reviewer isolation",
      content: validReview.replace(
        /^-?\s*隔离声明：.*$/m,
        "- 隔离声明：reviewer 独立完成评审，writer 未参与打分。",
      ),
    },
    {
      label: "outside-worktree capture attestation",
      content: validReview.replace(/^-?\s*评审证据：.*\n/m, ""),
    },
    {
      label: "zero unresolved finding counts",
      content: validReview.replace(
        /未关闭问题：blocker 0 \/ major 0 \/ minor 0/,
        "未关闭问题：blocker 0 / major 1 / minor 0",
      ),
    },
    {
      label: "final PASS line matching quality_score",
      content: validReview.replace("93/100，**PASS**", "92/100，**PASS**"),
    },
    {
      label: "editorial quality score",
      content: validReview.replaceAll("编辑质量", "文字质量"),
    },
    {
      label: "exactly one final status line",
      content: `${validReview.trimEnd()}\n- 最终状态：FAIL\n`,
    },
    {
      label: "non-PASS current or final status",
      content: validReview.replace(
        /^(-?\s*最终状态：)/m,
        "- 当前状态：FAIL\n$1",
      ),
    },
  ];

  for (const testCase of reviewCases) {
    writeFileSync(reviewFile, testCase.content);
    const result = runValidator();
    const output = `${result.stdout}${result.stderr}`;
    if (result.status === 0 || !output.includes(testCase.label)) {
      throw new Error(
        `${testCase.label} was not rejected as expected:\n${output}`,
      );
    }
  }
  writeFileSync(reviewFile, validReview);

  console.log(
    `PASS validator regression suite: 1 positive, ${negativeCases.length} privacy negatives, ${reviewCases.length} review negatives`,
  );
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
