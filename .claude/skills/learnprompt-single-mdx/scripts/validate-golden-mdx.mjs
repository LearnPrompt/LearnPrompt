#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || !value) {
      throw new Error("Usage: validate-golden-mdx.mjs --article <path> --research <path>");
    }
    values[key.slice(2)] = value;
  }
  return values;
}

function readFrontmatter(text) {
  if (!text.startsWith("---\n")) throw new Error("article has no YAML frontmatter");
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) throw new Error("article frontmatter is not closed");
  const raw = text.slice(4, end);
  const data = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^([a-z_]+):\s*(.+)$/);
    if (!match) continue;
    data[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
  return { data, body: text.slice(end + 5) };
}

function walk(directory) {
  const files = [];
  for (const name of readdirSync(directory)) {
    const file = path.join(directory, name);
    if (statSync(file).isDirectory()) files.push(...walk(file));
    else files.push(file);
  }
  return files;
}

const RESEARCH_PRIVACY_RULES = [
  {
    label: "runtime identifier",
    pattern:
      /\b(?:session|thread|turn|item|request)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/i,
  },
  {
    label: "account identifier or account header",
    pattern:
      /\b(?:account[ _-]?id|chatgpt-account-id(?:\s+header)?)\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/i,
  },
  {
    label: "user-specific local path",
    pattern:
      /(?:^|[\s="'(:`])(?:file:\/\/)?(?:\/Users\/[^/\s]+\/|\/home\/[^/\s]+\/|\/private\/tmp\/|\/tmp\/|\/var\/folders\/[^/\s]+\/[^/\s]+\/T\/)/im,
  },
  {
    label: "credential-shaped secret",
    pattern:
      /(?:\bsk-ant-[A-Za-z0-9_-]{16,}|\bsk-[A-Za-z0-9_-]{16,}|\bgh[pousr]_[A-Za-z0-9]{20,}|\bBearer\s+(?!REDACTED\b|YOUR_|<|\$|\{|\[)[A-Za-z0-9._~+\/-]{16,}|\bAuthorization\s*:\s*(?:(?:Bearer|Basic|Token)\s+)?(?!REDACTED\b|YOUR_|<|\$|\{|\[)[A-Za-z0-9._~+\/=\-]{12,}|\b(?:x-api-key|api[_-]?key)\b\s*[:=]\s*(?!REDACTED\b|YOUR_|<|\$|\{|\[)[A-Za-z0-9._~+\/-]{16,}|\bCookie\s*:\s*(?!REDACTED\b|<|\$|\{|\[)[^\r\n]{16,}|\b__Secure-next-auth\.session-token\s*=\s*(?!REDACTED\b|<|\$|\{|\[)[A-Za-z0-9._~-]{16,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/i,
  },
];

function readTextCandidate(file) {
  const content = readFileSync(file);
  if (content.includes(0)) return null;

  let controlBytes = 0;
  for (const byte of content) {
    if (byte < 9 || (byte > 13 && byte < 32)) controlBytes += 1;
  }
  if (controlBytes > Math.max(8, content.length * 0.02)) return null;
  return content.toString("utf8");
}

function scanResearchPrivacy(directory) {
  for (const file of walk(directory)) {
    const content = readTextCandidate(file);
    if (content === null) continue;
    for (const rule of RESEARCH_PRIVACY_RULES) {
      if (rule.pattern.test(content)) {
        fail(
          `research pack contains ${rule.label} in ${path.relative(directory, file)}`,
        );
      }
    }
  }
}

function validateReviewReport(review, score) {
  const reportPatterns = [
    [/(独立审稿器|Reviewer)/i, "reviewer identity"],
    [/(read-only|只读)/i, "read-only isolation"],
    [
      /(隔离声明[：:][^\n]*(?:独立只读会话|separate read-only session)[^\n]*(?:writer 未参与打分或修改评审结果|writer did not (?:score|grade) or (?:change|alter) the verdict))/i,
      "independent reviewer isolation",
    ],
    [
      /(原始(?:评审)?输出[^\n]*(仓库外|工作树外)|raw (?:review )?output[^\n]*outside)/i,
      "outside-worktree capture attestation",
    ],
  ];

  for (const [pattern, label] of reportPatterns) {
    if (!pattern.test(review)) fail(`verified article review is missing ${label}`);
  }

  const lines = review.split("\n");
  let finalPassIndex = -1;
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index];
    const isFinalVerdict = /(终审结论|最终结论|Follow-up\s*\d+|Final (?:review|verdict))/i.test(line);
    if (isFinalVerdict && /PASS/i.test(line) && line.includes(`${score}/100`)) {
      finalPassIndex = index;
      break;
    }
  }
  if (finalPassIndex === -1) {
    fail("verified article review has no final PASS line matching quality_score");
    return;
  }

  const finalReview = lines.slice(finalPassIndex).join("\n");
  const finalPatterns = [
    [
      /未关闭问题[：:]\s*blocker\s*(?:=|:)?\s*0\s*\/\s*major\s*(?:=|:)?\s*0\s*\/\s*minor\s*(?:=|:)?\s*0/i,
      "zero unresolved finding counts",
    ],
    [/事实与证据/i, "facts and evidence score"],
    [/解释深度/i, "explanatory depth score"],
    [/Showcase/i, "Showcase score"],
    [/教学设计/i, "teaching design score"],
    [/时效性/i, "currency score"],
    [/编辑质量/i, "editorial quality score"],
  ];
  for (const [pattern, label] of finalPatterns) {
    if (!pattern.test(finalReview)) {
      fail(`verified article final review is missing ${label}`);
    }
  }

  const finalStatusLines = lines.filter((line) => /^\s*-?\s*最终状态[：:]/.test(line));
  if (finalStatusLines.length !== 1) {
    fail("verified article review must have exactly one final status line");
    return;
  }
  const nonPassingStatus = lines.find(
    (line) =>
      /^\s*-?\s*(?:当前状态|最终状态)[：:].*\b(?:FAIL|PENDING)\b/i.test(line),
  );
  if (nonPassingStatus) {
    fail("verified article review contains a non-PASS current or final status");
  }
  const lastNonEmptyLine = [...lines].reverse().find((line) => line.trim());
  if (!/^\s*-?\s*最终状态[：:]\s*PASS(?:[。.].*)?$/.test(lastNonEmptyLine ?? "")) {
    fail("verified article review last non-empty line must be final PASS");
  }
}

const args = parseArgs(process.argv.slice(2));
if (!args.article || !args.research) {
  throw new Error("Both --article and --research are required");
}

const root = process.cwd();
const articleFile = path.resolve(root, args.article);
const researchDir = path.resolve(root, args.research);

if (!existsSync(articleFile)) throw new Error(`Article not found: ${args.article}`);
if (!existsSync(researchDir)) throw new Error(`Research directory not found: ${args.research}`);

const article = readFileSync(articleFile, "utf8");
const { data, body } = readFrontmatter(article);
const requiredFields = [
  "title",
  "description",
  "difficulty",
  "updated_from",
  "author",
  "verified_at",
  "reading_time",
  "research_path",
  "showcase_path",
  "showcase_status",
  "legacy_status",
];

for (const field of requiredFields) {
  if (!data[field]) fail(`frontmatter is missing ${field}`);
}

const declaredResearchDir = path.resolve(root, data.research_path ?? "missing-research");
if (declaredResearchDir !== researchDir) {
  fail(`frontmatter research_path does not match --research: ${data.research_path}`);
}

if (Boolean(data.source_repo) !== Boolean(data.source_url)) {
  fail("legacy source_repo and source_url must either both be present or both be absent");
}
if (data.source_url && !/^https:\/\//.test(data.source_url)) fail("source_url must be HTTPS");
if (!/^\d{4}-\d{2}-\d{2}$/.test(data.verified_at ?? "")) {
  fail("verified_at must be a quoted YYYY-MM-DD string");
}
if (body.length < 2500) fail(`article body is too short (${body.length} characters)`);
if (/\bSourceCard\b/.test(body)) fail("public article must not import, render, or mention SourceCard");

const h2Headings = [...body.matchAll(/^##\s+(.+?)\s*$/gm)];
const sourceHeading = [...h2Headings]
  .reverse()
  .find((heading) => /(来源|参考资料|延伸阅读)/.test(heading[1]));

if (!sourceHeading) {
  fail("article is missing a bottom source section");
} else {
  const sourcePosition = sourceHeading.index ?? -1;
  const laterHeading = h2Headings.find((heading) => (heading.index ?? -1) > sourcePosition);
  const sourceSection = body.slice(sourcePosition, laterHeading?.index ?? body.length);

  if (laterHeading) fail("source section must be the final H2 section");
  if (!/\[[^\]]+\]\(https:\/\/[^)]+\)/.test(sourceSection)) {
    fail("source section must contain at least one inspectable HTTPS Markdown link");
  }
  if (!/(官方|一手|原始(?:资料|文章|研究|工程)|primary)/i.test(sourceSection)) {
    fail("source section must identify primary, official, or original material");
  }
  if (/橙皮书/.test(sourceSection) && !/(主题地图|二手(?:资料|来源)|secondary(?: source| topic map)?)/i.test(sourceSection)) {
    fail("Orange Book usage must be labeled as a secondary topic map");
  }
  if (/橙皮书/.test(sourceSection) && !/(CC BY(?:-NC-SA)?\s*4\.0|MIT(?: License| 许可证)?|许可|署名|credit)/i.test(sourceSection)) {
    fail("Orange Book usage must retain an attribution or license note in the source section");
  }
}

const sectionChecks = [
  [/(读完|你会学到|学习目标)/, "learning outcomes"],
  [/Showcase/i, "Showcase"],
  [/(练习|动手做)/, "exercise"],
  [/(边界|不适用|什么时候不要|常见反模式|失败模式)/, "boundaries or failure modes"],
];
for (const [pattern, label] of sectionChecks) {
  if (!pattern.test(body)) fail(`article is missing ${label}`);
}

const researchFiles = [
  "brief.md",
  "horizontal-research.md",
  "vertical-research.md",
  "evidence-ledger.md",
  "review.md",
];
for (const name of researchFiles) {
  if (!existsSync(path.join(researchDir, name))) fail(`research pack is missing ${name}`);
}
scanResearchPrivacy(researchDir);

const showcaseDir = path.resolve(root, data.showcase_path ?? "missing-showcase");
const showcaseRelativeToResearch = path.relative(researchDir, showcaseDir);
if (
  showcaseRelativeToResearch === ".." ||
  showcaseRelativeToResearch.startsWith(`..${path.sep}`) ||
  path.isAbsolute(showcaseRelativeToResearch)
) {
  fail(`showcase_path must stay inside research_path: ${data.showcase_path}`);
}
if (!existsSync(showcaseDir)) {
  fail(`showcase_path does not exist: ${data.showcase_path}`);
} else {
  const showcaseFiles = walk(showcaseDir);
  if (!showcaseFiles.some((file) => path.basename(file).toLowerCase() === "readme.md")) {
    fail("showcase has no README.md");
  }
  if (!showcaseFiles.some((file) => /result|output|transcript/i.test(path.basename(file)))) {
    fail("showcase has no archived result, output, or transcript");
  }
}

if (data.showcase_status === "verified") {
  const score = Number(data.quality_score);
  if (!Number.isInteger(score) || score < 85 || score > 100) {
    fail("verified article must have an integer quality_score from 85 to 100");
  }
  const review = readFileSync(path.join(researchDir, "review.md"), "utf8");
  validateReviewReport(review, score);
}

if (!process.exitCode) {
  console.log(`PASS article: ${args.article}`);
  console.log(`PASS research: ${args.research}`);
  console.log(`PASS status: ${data.showcase_status}${data.quality_score ? ` (${data.quality_score}/100)` : ""}`);
}
