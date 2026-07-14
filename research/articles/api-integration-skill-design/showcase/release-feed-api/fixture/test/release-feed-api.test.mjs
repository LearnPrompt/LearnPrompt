import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  EXIT_CODES,
  runReleaseFeed
} from "../.agents/skills/release-feed-api/scripts/fetch-releases.mjs";
import {
  createMockFetchTransport,
  startMockReleaseApi
} from "../.agents/skills/release-feed-api/scripts/mock-release-api.mjs";

const fixtureRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function createTempRepo() {
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), "release-feed-api-test-"));
  cpSync(fixtureRoot, tempRoot, { recursive: true });
  return tempRoot;
}

function cleanup(directory) {
  rmSync(directory, { recursive: true, force: true });
}

async function withTransport(scenario, callback) {
  const transport = createMockFetchTransport({
    scenario,
    credential: randomUUID()
  });
  return callback(transport);
}

test("two-page success writes redacted reports", async () => {
  await withTransport("two-page-success", async (server) => {
    const tempRepo = createTempRepo();
    try {
      const result = await runReleaseFeed({
        cwd: tempRepo,
        env: {
          ...process.env,
          RELEASE_FEED_BASE_URL: "http://127.0.0.1:39001",
          RELEASE_FEED_TOKEN: server.credential
        },
        fetchImpl: server.fetch,
        wait: async () => {}
      });

      assert.equal(result.exitCode, EXIT_CODES.success);
      const reportJson = readFileSync(path.join(tempRepo, "reports/releases.json"), "utf8");
      const reportMarkdown = readFileSync(path.join(tempRepo, "reports/releases.md"), "utf8");
      const parsed = JSON.parse(reportJson);

      assert.equal(parsed.release_count, 3);
      assert.deepEqual(
        parsed.evidence.requests.map((entry) => entry.path),
        ["/releases?page=1", "/releases?page=2"]
      );
      assert.equal(server.state.requests.length, 2);
      assert.equal(reportJson.includes(server.credential), false);
      assert.equal(reportMarkdown.includes(server.credential), false);
      assert.equal(/authorization/i.test(reportJson), false);
      assert.equal(/authorization/i.test(reportMarkdown), false);
    } finally {
      cleanup(tempRepo);
    }
  });
});

test("429 once then success records one retry", async () => {
  await withTransport("rate-limit-once", async (server) => {
    const tempRepo = createTempRepo();
    try {
      const result = await runReleaseFeed({
        cwd: tempRepo,
        env: {
          ...process.env,
          RELEASE_FEED_BASE_URL: "http://127.0.0.1:39001",
          RELEASE_FEED_TOKEN: server.credential
        },
        fetchImpl: server.fetch,
        wait: async () => {}
      });

      assert.equal(result.exitCode, EXIT_CODES.success);
      const parsed = JSON.parse(readFileSync(path.join(tempRepo, "reports/releases.json"), "utf8"));
      assert.equal(parsed.evidence.retries.length, 1);
      assert.equal(parsed.evidence.retries[0].status, 429);
      assert.deepEqual(
        parsed.evidence.requests.map((entry) => entry.path),
        ["/releases?page=1", "/releases?page=1", "/releases?page=2"]
      );
      assert.equal(server.state.requests.length, 3);
    } finally {
      cleanup(tempRepo);
    }
  });
});

test("missing credential exits 41 before network", async () => {
  await withTransport("two-page-success", async (server) => {
    const tempRepo = createTempRepo();
    try {
      const result = await runReleaseFeed({
        cwd: tempRepo,
        env: {
          ...process.env,
          RELEASE_FEED_BASE_URL: "http://127.0.0.1:39001",
          RELEASE_FEED_TOKEN: ""
        },
        fetchImpl: server.fetch,
        wait: async () => {}
      });

      assert.equal(result.exitCode, EXIT_CODES.missingCredential);
      assert.equal(server.state.requests.length, 0);
    } finally {
      cleanup(tempRepo);
    }
  });
});

test("schema drift exits 42", async () => {
  await withTransport("schema-drift", async (server) => {
    const tempRepo = createTempRepo();
    try {
      const result = await runReleaseFeed({
        cwd: tempRepo,
        env: {
          ...process.env,
          RELEASE_FEED_BASE_URL: "http://127.0.0.1:39001",
          RELEASE_FEED_TOKEN: server.credential
        },
        fetchImpl: server.fetch,
        wait: async () => {}
      });

      assert.equal(result.exitCode, EXIT_CODES.contractViolation);
      assert.equal(server.state.requests.length, 1);
    } finally {
      cleanup(tempRepo);
    }
  });
});

test("503 retry exhausted exits 43", async () => {
  await withTransport("retry-exhausted", async (server) => {
    const tempRepo = createTempRepo();
    try {
      const result = await runReleaseFeed({
        cwd: tempRepo,
        env: {
          ...process.env,
          RELEASE_FEED_BASE_URL: "http://127.0.0.1:39001",
          RELEASE_FEED_TOKEN: server.credential
        },
        fetchImpl: server.fetch,
        wait: async () => {}
      });

      assert.equal(result.exitCode, EXIT_CODES.retryExhausted);
      assert.equal(server.state.requests.length, 3);
    } finally {
      cleanup(tempRepo);
    }
  });
});

test("mutating method is rejected before network", async () => {
  await withTransport("two-page-success", async (server) => {
    const tempRepo = createTempRepo();
    try {
      const configPath = path.join(tempRepo, "release-feed.config.json");
      const config = JSON.parse(readFileSync(configPath, "utf8"));
      config.method = "POST";
      writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

      const result = await runReleaseFeed({
        cwd: tempRepo,
        env: {
          ...process.env,
          RELEASE_FEED_BASE_URL: "http://127.0.0.1:39001",
          RELEASE_FEED_TOKEN: server.credential
        },
        fetchImpl: server.fetch,
        wait: async () => {}
      });

      assert.equal(result.exitCode, EXIT_CODES.mutatingMethodRejected);
      assert.equal(server.state.requests.length, 0);
    } finally {
      cleanup(tempRepo);
    }
  });
});

test("loopback preflight is either available or explicitly blocked by the host", async () => {
  let server;
  try {
    server = await startMockReleaseApi({
      scenario: "two-page-success",
      credential: randomUUID()
    });
  } catch (error) {
    assert.equal(error?.code, "EPERM");
    return;
  }

  await server.close();
  assert.match(server.baseUrl, /^http:\/\/127\.0\.0\.1:\d+$/);
});
