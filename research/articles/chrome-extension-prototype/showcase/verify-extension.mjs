#!/usr/bin/env node

import http from "node:http";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensionDir = path.join(__dirname, "fixture", "extension");
const fixturePagePath = path.join(__dirname, "fixture", "page.html");
const overreachManifestPath = path.join(
  __dirname,
  "fixture",
  "negative",
  "manifest-overreach.json",
);
const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const require = createRequire(import.meta.url);

const lines = [];
let failed = false;

function record(status, label, detail = "") {
  const line = `${status} ${label}${detail ? `: ${detail}` : ""}`;
  lines.push(line);
  console.log(line);
}

function pass(label, detail = "") {
  record("PASS", label, detail);
}

function fail(label, detail = "") {
  failed = true;
  record("FAIL", label, detail);
}

function assert(condition, label, passDetail, failDetail = passDetail) {
  if (condition) pass(label, passDetail);
  else fail(label, failDetail);
}

function sanitizeUrl(value) {
  return value.replace(/127\.0\.0\.1:\d+/g, "127.0.0.1:<PORT>");
}

function sanitizeCard(card) {
  return {
    title: card.title,
    url: sanitizeUrl(card.url),
    selectedText: card.selectedText,
    capturedAt: "<ISO_TIMESTAMP>",
  };
}

function startFixtureServer() {
  const html = readFileSync(fixturePagePath, "utf8");
  const server = http.createServer((request, response) => {
    if (request.url === "/" || request.url?.startsWith("/page.html")) {
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      });
      response.end(html);
      return;
    }

    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        server,
        url: `http://127.0.0.1:${address.port}/page.html`,
      });
    });
  });
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function assertManifest() {
  const manifest = readJson(path.join(extensionDir, "manifest.json"));
  const permissions = [...manifest.permissions].sort();
  assert(
    JSON.stringify(permissions) === JSON.stringify(["activeTab", "scripting", "storage"]),
    "main manifest keeps minimal permissions",
    permissions.join(", "),
    `got ${permissions.join(", ")}`,
  );
  assert(
    !manifest.host_permissions,
    "main manifest has no host_permissions",
    "none",
    JSON.stringify(manifest.host_permissions),
  );
  assert(
    !permissions.includes("tabs"),
    "main manifest does not request tabs permission",
    "tabs absent",
    "tabs present",
  );
  assert(
    !permissions.includes("unlimitedStorage"),
    "main manifest does not request unlimitedStorage",
    "unlimitedStorage absent",
    "unlimitedStorage present",
  );
  assert(
    manifest.background?.service_worker === "background.js",
    "manifest registers an MV3 service worker",
    "background.js",
    JSON.stringify(manifest.background),
  );
  assert(
    manifest.action?.default_popup === "popup.html",
    "manifest wires the popup entrypoint",
    "popup.html",
    JSON.stringify(manifest.action),
  );
}

function assertOverreachNegative() {
  const manifest = readJson(overreachManifestPath);
  const permissions = manifest.permissions ?? [];
  const hasOverreach =
    permissions.includes("tabs") &&
    permissions.includes("unlimitedStorage") &&
    (manifest.host_permissions ?? []).includes("<all_urls>");

  assert(
    hasOverreach,
    "overreach manifest is rejected by permission audit",
    "contains tabs + unlimitedStorage + <all_urls>",
    "negative example no longer demonstrates overreach",
  );
}

function assertNoRemoteHostedCode() {
  const popupHtml = readFileSync(path.join(extensionDir, "popup.html"), "utf8");
  const popupJs = readFileSync(path.join(extensionDir, "popup.js"), "utf8");
  const remotePattern = /https?:\/\//i;
  const inlineScriptPattern = /<script(?![^>]*src=)[^>]*>/i;

  assert(
    !remotePattern.test(popupHtml) && !remotePattern.test(popupJs),
    "extension code has no remote hosted script references",
    "no http(s) references inside popup assets",
    "found a remote script reference",
  );
  assert(
    !inlineScriptPattern.test(popupHtml),
    "popup keeps JavaScript in packaged files",
    "script tag only uses src",
    "inline script found in popup.html",
  );
}

async function triggerCaptureShortcut(page) {
  await page.bringToFront();

  const appBundle = chromePath.match(/\/([^/]+)\.app\//)?.[1] || "Google Chrome";

  if (process.platform === "darwin") {
    execFileSync("osascript", [
      "-e",
      `tell application "${appBundle}" to activate`,
      "-e",
      'tell application "System Events" to keystroke "y" using {command down, shift down}',
    ]);
    return;
  }

  await page.keyboard.down("Control");
  await page.keyboard.down("Shift");
  await page.keyboard.press("Y");
  await page.keyboard.up("Shift");
  await page.keyboard.up("Control");
}

async function waitForStorage(worker, predicate, label) {
  const deadline = Date.now() + 15000;

  while (Date.now() < deadline) {
    const snapshot = await worker.evaluate(async () => {
      return chrome.storage.local.get(["latestCard", "lastRun"]);
    });

    if (predicate(snapshot)) return snapshot;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out while waiting for ${label}`);
}

async function runBrowserFlow() {
  const { launch } = require("puppeteer-core");

  const fixture = await startFixtureServer();
  const userDataDir = mkdtempSync(path.join(os.tmpdir(), "reading-card-profile-"));
  let browser;

  try {
    browser = await launch({
      executablePath: chromePath,
      headless: false,
      userDataDir,
      ignoreDefaultArgs: ["--disable-extensions"],
      args: [
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-background-networking",
        `--disable-extensions-except=${extensionDir}`,
        `--load-extension=${extensionDir}`,
      ],
    });

    const workerTarget = await browser.waitForTarget(
      (target) =>
        target.type() === "service_worker" &&
        target.url().startsWith("chrome-extension://") &&
        target.url().endsWith("/background.js"),
      { timeout: 15000 },
    );

    const extensionId = new URL(workerTarget.url()).host;
    pass("extension service worker loaded in Chrome", extensionId);

    const worker = await workerTarget.worker();
    if (!worker) {
      fail("service worker target is unavailable to automation");
      return;
    }

    const page = await browser.newPage();
    await page.goto(fixture.url, { waitUntil: "networkidle0" });
    await page.bringToFront();
    await page.evaluate(() => {
      const node = document.querySelector("#selection-source");
      const range = document.createRange();
      range.selectNodeContents(node);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
    pass(
      "fixture page prepared for selection capture",
      sanitizeUrl(fixture.url),
    );

    await triggerCaptureShortcut(page);
    pass("capture command triggered on fixture page", "Command/Ctrl+Shift+Y");

    const successSnapshot = await waitForStorage(
      worker,
      (snapshot) => snapshot.lastRun?.ok === true && !!snapshot.latestCard?.title,
      "successful reading-card capture",
    );

    const popupPage = await browser.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`, {
      waitUntil: "networkidle0",
    });
    pass("popup page opened for audit", extensionId);

    const successState = await popupPage.evaluate(async () => {
      const stored = await chrome.storage.local.get(["latestCard", "lastRun"]);
      return {
        status: document.querySelector("#status").textContent.trim(),
        title: document.querySelector('[data-field="title"]').textContent.trim(),
        url: document.querySelector('[data-field="url"]').textContent.trim(),
        selectedText: document
          .querySelector('[data-field="selectedText"]')
          .textContent.trim(),
        latestCard: stored.latestCard,
        lastRun: stored.lastRun,
      };
    });

    const expectedSelection =
      "Acceptance criteria are safer than vibes. 先写清楚要抓什么、保存到哪里、哪些权限不该申请，再让 Claude Code 生成最小原型，通常比“先把功能都做出来”更快到达可验收状态。";
    assert(
      successSnapshot.latestCard?.title === "Fixture Article: Chrome Prototype Notes",
      "browser capture on fixture page keeps the real page title",
      successSnapshot.latestCard.title,
      JSON.stringify(successSnapshot.latestCard),
    );
    assert(
      sanitizeUrl(successSnapshot.latestCard?.url || "") === sanitizeUrl(fixture.url),
      "browser capture on fixture page keeps the real page URL",
      sanitizeUrl(successSnapshot.latestCard.url),
      JSON.stringify(successSnapshot.latestCard),
    );
    assert(
      successSnapshot.latestCard?.selectedText === expectedSelection,
      "browser capture on fixture page keeps the selected text",
      "selected text matches fixture paragraph",
      JSON.stringify(successSnapshot.latestCard),
    );
    assert(
      successState.status === "已保存最近一次阅读卡。",
      "popup displays the latest successful run status",
      successState.status,
      successState.status,
    );
    pass(
      "frozen reading card",
      JSON.stringify(sanitizeCard(successSnapshot.latestCard)),
    );

    const restrictedPage = await browser.newPage();
    await restrictedPage.goto("chrome://extensions/", { waitUntil: "load" });
    await triggerCaptureShortcut(restrictedPage);
    pass("capture command triggered on restricted page", "chrome://extensions/");

    const failureSnapshot = await waitForStorage(
      worker,
      (snapshot) =>
        snapshot.lastRun?.ok === false &&
        typeof snapshot.lastRun?.message === "string" &&
        snapshot.lastRun.message.includes("抓取失败"),
      "restricted-page failure status",
    );

    await popupPage.reload({ waitUntil: "networkidle0" });
    const failureState = await popupPage.evaluate(async () => {
      const stored = await chrome.storage.local.get(["latestCard", "lastRun"]);
      return {
        status: document.querySelector("#status").textContent.trim(),
        latestCard: stored.latestCard,
        lastRun: stored.lastRun,
      };
    });

    assert(
      /抓取失败/.test(failureSnapshot.lastRun?.message || ""),
      "restricted page failure is surfaced",
      failureSnapshot.lastRun.message.replace(/\s+/g, " "),
      failureSnapshot.lastRun.message.replace(/\s+/g, " "),
    );
    assert(
      /抓取失败/.test(failureState.status),
      "popup displays the restricted-page failure message",
      failureState.status.replace(/\s+/g, " "),
      failureState.status.replace(/\s+/g, " "),
    );
    assert(
      failureState.latestCard?.title === successSnapshot.latestCard?.title,
      "restricted page failure does not overwrite last successful card",
      successSnapshot.latestCard.title,
      JSON.stringify(sanitizeCard(failureState.latestCard)),
    );
  } finally {
    fixture.server.close();
    if (browser) await browser.close();
    rmSync(userDataDir, { recursive: true, force: true });
  }
}

async function main() {
  assertManifest();
  assertOverreachNegative();
  assertNoRemoteHostedCode();
  await runBrowserFlow();

  if (failed) {
    console.error(`SUMMARY FAIL ${lines.length} checks`);
    process.exitCode = 1;
    return;
  }

  console.log(`SUMMARY PASS ${lines.length} checks`);
}

main().catch((error) => {
  fail("verification script crashed", error instanceof Error ? error.message : String(error));
  console.error(`SUMMARY FAIL ${lines.length} checks`);
  process.exitCode = 1;
});
