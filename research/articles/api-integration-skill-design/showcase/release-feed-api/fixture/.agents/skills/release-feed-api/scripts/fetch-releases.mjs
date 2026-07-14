#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export const EXIT_CODES = {
  success: 0,
  missingCredential: 41,
  contractViolation: 42,
  retryExhausted: 43,
  mutatingMethodRejected: 44
};

function parseArgs(argv) {
  const parsed = {
    configPath: path.resolve("release-feed.config.json")
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--config") {
      parsed.configPath = path.resolve(argv[index + 1]);
      index += 1;
    }
  }

  return parsed;
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeNormalized(filePath, value) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${value.trimEnd()}\n`);
}

function parseRetryAfter(value) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }

  const targetTime = Date.parse(trimmed);
  if (Number.isNaN(targetTime)) {
    return null;
  }

  return Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
}

function validateRelease(release) {
  const requiredFields = ["id", "tag", "title", "published_at", "summary_url", "notes"];
  for (const field of requiredFields) {
    if (typeof release?.[field] !== "string" || release[field].trim() === "") {
      return {
        ok: false,
        message: `release field missing: ${field}`
      };
    }
  }

  return { ok: true };
}

function validatePage(pageBody) {
  if (!pageBody || typeof pageBody !== "object") {
    return { ok: false, message: "page body must be an object" };
  }

  if (!Array.isArray(pageBody.releases)) {
    return { ok: false, message: "releases must be an array" };
  }

  if (pageBody.releases.length === 0) {
    return { ok: false, message: "empty releases are a contract failure" };
  }

  if (pageBody.next_page !== null && !Number.isInteger(pageBody.next_page)) {
    return { ok: false, message: "next_page must be an integer or null" };
  }

  for (const release of pageBody.releases) {
    const releaseValidation = validateRelease(release);
    if (!releaseValidation.ok) {
      return releaseValidation;
    }
  }

  return { ok: true };
}

function renderReleaseRows(releases) {
  return releases
    .map(
      (release) =>
        `- \`${release.tag}\` | ${release.title} | ${release.published_at} | ${release.summary_url}`
    )
    .join("\n");
}

function renderMarkdown(template, report) {
  const replacements = {
    "{{status}}": report.status,
    "{{release_count}}": String(report.release_count),
    "{{method}}": report.request_contract.method,
    "{{pagination}}": report.request_contract.pagination,
    "{{retry_429}}": String(report.evidence.retries.filter((entry) => entry.kind === "429").length),
    "{{retry_5xx}}": String(report.evidence.retries.filter((entry) => entry.kind === "5xx").length),
    "{{release_rows}}": renderReleaseRows(report.releases),
    "{{base_url_source}}": report.request_contract.base_url_source,
    "{{credential_source}}": report.request_contract.credential_source,
    "{{request_order}}": report.evidence.requests.map((entry) => entry.path).join(" -> "),
    "{{response_schema}}": report.request_contract.response_schema,
    "{{notes}}":
      "Evidence stores request paths, page order, statuses, and retry counts only; secret transport material stays redacted."
  };

  return Object.entries(replacements).reduce(
    (content, [placeholder, value]) => content.replaceAll(placeholder, value),
    template
  );
}

function failure(exitCode, status, message, evidence) {
  return {
    exitCode,
    summary: {
      status,
      exit_code: exitCode,
      message,
      request_count: evidence.requests.length,
      retry_count: evidence.retries.length,
      reports_written: false
    }
  };
}

export async function runReleaseFeed(options = {}) {
  const cwd = options.cwd || process.cwd();
  const env = options.env || process.env;
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const wait = options.wait || ((milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)));
  const configPath = options.configPath || path.join(cwd, "release-feed.config.json");
  const config = readJson(configPath);

  if (typeof fetchImpl !== "function") {
    throw new Error("global fetch is not available in this Node runtime");
  }

  const method = String(config.method || "GET").toUpperCase();
  const baseUrl = env[config.base_url_env];
  const credential = env[config.credential_env];
  const evidence = {
    requests: [],
    pages: [],
    retries: []
  };

  if (!credential) {
    return failure(
      EXIT_CODES.missingCredential,
      "missing_credential",
      `missing required credential env: ${config.credential_env}`,
      evidence
    );
  }

  if (method !== "GET") {
    return failure(
      EXIT_CODES.mutatingMethodRejected,
      "mutating_method_rejected",
      `configured method ${method} is not allowed for this read-only integration`,
      evidence
    );
  }

  const releases = [];
  let page = 1;

  while (page !== null) {
    let completed = false;
    let attempt = 0;
    while (!completed) {
      attempt += 1;
      const requestUrl = new URL(config.feed_path, baseUrl);
      requestUrl.searchParams.set(config.page_param, String(page));
      evidence.requests.push({
        sequence: evidence.requests.length + 1,
        method,
        path: `${requestUrl.pathname}${requestUrl.search}`,
        auth_present: true
      });

      const response = await fetchImpl(requestUrl, {
        method,
        headers: {
          accept: "application/json",
          authorization: `Bearer ${credential}`
        }
      });

      if (response.status === 429) {
        const retryAfterSeconds = parseRetryAfter(response.headers.get("retry-after"));
        evidence.retries.push({
          kind: "429",
          page,
          status: 429,
          attempt,
          retry_after_seconds: retryAfterSeconds
        });
        await wait(Math.max(0, retryAfterSeconds || 0) * 1000);
        continue;
      }

      if (response.status >= 500 && response.status <= 599) {
        evidence.retries.push({
          kind: "5xx",
          page,
          status: response.status,
          attempt
        });
        if (attempt > config.max_5xx_retries) {
          return failure(
            EXIT_CODES.retryExhausted,
            "retry_exhausted",
            `received ${response.status} after ${config.max_5xx_retries} retries`,
            evidence
          );
        }
        continue;
      }

      if (!response.ok) {
        return failure(
          EXIT_CODES.contractViolation,
          "unexpected_status",
          `unexpected status ${response.status}`,
          evidence
        );
      }

      const pageBody = await response.json();
      const validation = validatePage(pageBody);
      if (!validation.ok) {
        return failure(
          EXIT_CODES.contractViolation,
          "contract_violation",
          validation.message,
          evidence
        );
      }

      evidence.pages.push({
        page,
        status: response.status,
        release_count: pageBody.releases.length,
        next_page: pageBody.next_page
      });
      releases.push(...pageBody.releases);
      page = pageBody.next_page;
      completed = true;
    }
  }

  const report = {
    status: "success",
    generated_by: "release-feed-api-fixture",
    release_count: releases.length,
    releases,
    request_contract: {
      base_url_source: `env:${config.base_url_env}`,
      credential_source: `env:${config.credential_env}`,
      method,
      pagination: "serial",
      retry_policy: {
        respect_retry_after_on_429: true,
        max_5xx_retries: config.max_5xx_retries
      },
      response_schema: config.response_schema
    },
    evidence: {
      requests: evidence.requests.map((entry) => ({
        sequence: entry.sequence,
        method: entry.method,
        path: entry.path
      })),
      pages: evidence.pages,
      retries: evidence.retries,
      credential_material: "redacted"
    }
  };

  const jsonOutputPath = path.join(cwd, config.output_json);
  const markdownOutputPath = path.join(cwd, config.output_md);
  const templatePath = path.join(
    cwd,
    ".agents/skills/release-feed-api/assets/report-template.md"
  );
  const template = readFileSync(templatePath, "utf8");
  writeNormalized(jsonOutputPath, JSON.stringify(report, null, 2));
  writeNormalized(markdownOutputPath, renderMarkdown(template, report));

  return {
    exitCode: EXIT_CODES.success,
    summary: {
      status: "success",
      exit_code: 0,
      release_count: releases.length,
      report_json: config.output_json,
      report_markdown: config.output_md,
      request_count: evidence.requests.length,
      retry_count: evidence.retries.length,
      reports_written: true
    }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { configPath } = parseArgs(process.argv.slice(2));
  const result = await runReleaseFeed({ configPath });
  process.stdout.write(`${JSON.stringify(result.summary, null, 2)}\n`);
  process.exit(result.exitCode);
}
