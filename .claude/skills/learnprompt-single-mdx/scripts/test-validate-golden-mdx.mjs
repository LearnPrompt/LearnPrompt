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
const visualRelative =
  "starlight/public/images/articles/codex-form-factors/codex-four-surfaces.svg";
const visualPublicPath =
  "/images/articles/codex-form-factors/codex-four-surfaces.svg";
// This mutation suite intentionally needs a writable OS temp directory. The
// control plane runs it; a read-only reviewer inspects the recorded result.
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

function replaceLedgerCell(content, publicPath, cellIndex, value) {
  return content
    .split("\n")
    .map((line) => {
      if (!line.includes(publicPath)) return line;
      const cells = line.split("|");
      cells[cellIndex + 1] = ` ${value} `;
      return cells.join("|");
    })
    .join("\n");
}

try {
  const articleTarget = path.join(temporaryRoot, articleRelative);
  const researchTarget = path.join(temporaryRoot, researchRelative);
  const visualTarget = path.join(temporaryRoot, visualRelative);
  mkdirSync(path.dirname(articleTarget), { recursive: true });
  mkdirSync(path.dirname(researchTarget), { recursive: true });
  mkdirSync(path.dirname(visualTarget), { recursive: true });
  cpSync(path.join(repositoryRoot, articleRelative), articleTarget);
  cpSync(path.join(repositoryRoot, researchRelative), researchTarget, {
    recursive: true,
  });
  cpSync(path.join(repositoryRoot, visualRelative), visualTarget);

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
  const validArticle = readFileSync(articleTarget, "utf8");
  const assetLedgerFile = path.join(researchTarget, "asset-ledger.md");
  const validAssetLedger = readFileSync(assetLedgerFile, "utf8");
  const visualCases = [
    {
      label: "at least one teaching image",
      content: validArticle.replace(
        /^!\[[^\n]+\]\([^\n]+\)\n\*图注：[^\n]+\*\n/m,
        "",
      ),
    },
    {
      label: "generic or too-short alt",
      content: validArticle.replace(/^!\[[^\n]+\]/m, "![图片]"),
    },
    {
      label: "missing an immediate 图注 line",
      content: validArticle.replace(/^\*图注：[^\n]+\*\n/m, ""),
    },
  ];

  for (const testCase of visualCases) {
    writeFileSync(articleTarget, testCase.content);
    const result = runValidator();
    const output = `${result.stdout}${result.stderr}`;
    if (result.status === 0 || !output.includes(testCase.label)) {
      throw new Error(
        `${testCase.label} was not rejected as expected:\n${output}`,
      );
    }
  }
  writeFileSync(articleTarget, validArticle);

  unlinkSync(visualTarget);
  const missingVisual = runValidator();
  const missingVisualOutput = `${missingVisual.stdout}${missingVisual.stderr}`;
  if (
    missingVisual.status === 0 ||
    !missingVisualOutput.includes("file does not exist")
  ) {
    throw new Error(
      `missing teaching image was not rejected as expected:\n${missingVisualOutput}`,
    );
  }
  cpSync(path.join(repositoryRoot, visualRelative), visualTarget);

  writeFileSync(
    assetLedgerFile,
    validAssetLedger.replace(
      "/images/articles/codex-form-factors/codex-four-surfaces.svg",
      "/images/articles/codex-form-factors/unlisted.svg",
    ),
  );
  const missingLedgerEntry = runValidator();
  const missingLedgerOutput = `${missingLedgerEntry.stdout}${missingLedgerEntry.stderr}`;
  if (
    missingLedgerEntry.status === 0 ||
    !missingLedgerOutput.includes("asset ledger is missing teaching image")
  ) {
    throw new Error(
      `missing asset ledger entry was not rejected as expected:\n${missingLedgerOutput}`,
    );
  }
  writeFileSync(assetLedgerFile, validAssetLedger);

  writeFileSync(
    assetLedgerFile,
    validAssetLedger.replace("CC BY-NC-SA 4.0", "license pending"),
  );
  const missingLicense = runValidator();
  const missingLicenseOutput = `${missingLicense.stdout}${missingLicense.stderr}`;
  if (
    missingLicense.status === 0 ||
    !missingLicenseOutput.includes("no inspectable license")
  ) {
    throw new Error(
      `missing inspectable license was not rejected as expected:\n${missingLicenseOutput}`,
    );
  }
  writeFileSync(assetLedgerFile, validAssetLedger);

  writeFileSync(
    assetLedgerFile,
    replaceLedgerCell(validAssetLedger, visualPublicPath, 1, "装饰封面"),
  );
  const decorativePurpose = runValidator();
  const decorativePurposeOutput = `${decorativePurpose.stdout}${decorativePurpose.stderr}`;
  if (
    decorativePurpose.status === 0 ||
    !decorativePurposeOutput.includes("decorative or too vague")
  ) {
    throw new Error(
      `decorative teaching purpose was not rejected as expected:\n${decorativePurposeOutput}`,
    );
  }
  writeFileSync(assetLedgerFile, validAssetLedger);

  writeFileSync(
    assetLedgerFile,
    replaceLedgerCell(validAssetLedger, visualPublicPath, 4, "原创"),
  );
  const ownershipOnlyLicense = runValidator();
  const ownershipOnlyOutput = `${ownershipOnlyLicense.stdout}${ownershipOnlyLicense.stderr}`;
  if (
    ownershipOnlyLicense.status === 0 ||
    !ownershipOnlyOutput.includes("no inspectable license")
  ) {
    throw new Error(
      `ownership-only license was not rejected as expected:\n${ownershipOnlyOutput}`,
    );
  }
  writeFileSync(assetLedgerFile, validAssetLedger);

  const reviewFile = path.join(researchTarget, "review.md");
  const validReview = readFileSync(reviewFile, "utf8");

  writeFileSync(
    reviewFile,
    validReview.replace(/^Decorative-only:\s*no\s*\n/im, ""),
  );
  const missingNonDecorativeAttestation = runValidator();
  const missingNonDecorativeOutput = `${missingNonDecorativeAttestation.stdout}${missingNonDecorativeAttestation.stderr}`;
  if (
    missingNonDecorativeAttestation.status === 0 ||
    !missingNonDecorativeOutput.includes("non-decorative attestation")
  ) {
    throw new Error(
      `missing non-decorative attestation was not rejected as expected:\n${missingNonDecorativeOutput}`,
    );
  }
  writeFileSync(reviewFile, validReview);

  writeFileSync(
    reviewFile,
    validReview.replace(
      visualPublicPath,
      "/images/articles/codex-form-factors/unreviewed.svg",
    ),
  );
  const missingVisualReview = runValidator();
  const missingVisualReviewOutput = `${missingVisualReview.stdout}${missingVisualReview.stderr}`;
  if (
    missingVisualReview.status === 0 ||
    !missingVisualReviewOutput.includes("final visual assessment is missing")
  ) {
    throw new Error(
      `missing asset in final visual review was not rejected as expected:\n${missingVisualReviewOutput}`,
    );
  }
  writeFileSync(reviewFile, validReview);

  writeFileSync(
    reviewFile,
    validReview.replace("Rights: CC BY-NC-SA 4.0", "Rights: 原创"),
  );
  const missingReviewRights = runValidator();
  const missingReviewRightsOutput = `${missingReviewRights.stdout}${missingReviewRights.stderr}`;
  if (
    missingReviewRights.status === 0 ||
    !missingReviewRightsOutput.includes("rights attestation")
  ) {
    throw new Error(
      `ownership-only review rights were not rejected as expected:\n${missingReviewRightsOutput}`,
    );
  }
  writeFileSync(reviewFile, validReview);

  const reviewCases = [
    {
      label: "independent reviewer isolation",
      content: validReview
        .replaceAll("独立只读会话", "只读会话")
        .replaceAll(
          "writer 未参与打分或修改评审结果",
          "writer 未参与写作",
        )
        .replaceAll("writer 未参与打分或修改结论", "writer 未参与写作"),
    },
    {
      label: "outside-worktree capture attestation",
      content: validReview.replace(
        /^.*原始(?:评审)?输出.*(?:仓库外|工作树外).*\n/gm,
        "",
      ),
    },
    {
      label: "zero unresolved finding counts",
      content: validReview.replaceAll(
        /未关闭问题：blocker 0 \/ major 0 \/ minor 0/g,
        "未关闭问题：blocker 0 / major 1 / minor 0",
      ),
    },
    {
      label: "final PASS line matching quality_score",
      content: validReview.replaceAll("93/100", "92/100"),
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
    `PASS validator regression suite: 1 positive, ${negativeCases.length} privacy negatives, ${visualCases.length + 8} visual negatives, ${reviewCases.length} review negatives`,
  );
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
