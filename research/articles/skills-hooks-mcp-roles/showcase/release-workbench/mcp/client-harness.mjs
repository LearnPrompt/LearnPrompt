#!/usr/bin/env node
// 独立 client harness：把 issue-server 当成真正的子进程启动，
// 通过它的 stdin/stdout 用换行分隔的 JSON-RPC 2.0 通信，
// 依次 initialize -> tools/list -> tools/call(get_issue LP-42) -> resources/read。
//
// 边界声明：这里只验证本文最小 JSON-RPC 边界（能否跨进程取到外部数据），
// 不使用官方 MCP SDK，不宣称完整 MCP conformance，也不代表 Claude Code 在线集成。

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const here = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(here, "issue-server.mjs");

const child = spawn(process.execPath, [serverPath], {
  stdio: ["pipe", "pipe", "inherit"],
});

const rl = createInterface({ input: child.stdout });
const pending = new Map();
rl.on("line", (line) => {
  const text = line.trim();
  if (!text) return;
  const msg = JSON.parse(text);
  const resolve = pending.get(msg.id);
  if (resolve) {
    pending.delete(msg.id);
    resolve(msg);
  }
});

let nextId = 1;
function call(method, params) {
  const id = nextId++;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  });
}

function fail(msg) {
  console.log(`FAIL ${msg}`);
  process.exitCode = 1;
}

const init = await call("initialize", {});
if (init.result?.serverInfo?.name !== "release-workbench-issue-server") {
  fail("initialize 未返回预期 serverInfo");
} else {
  console.log(`PASS mcp: initialize 握手成功 (${init.result.serverInfo.name})`);
}

const tools = await call("tools/list", {});
if (!tools.result?.tools?.some((t) => t.name === "get_issue")) {
  fail("tools/list 未暴露 get_issue");
} else {
  console.log("PASS mcp: tools/list 暴露 get_issue");
}

const called = await call("tools/call", { name: "get_issue", arguments: { id: "LP-42" } });
let issue = null;
try {
  issue = JSON.parse(called.result?.content?.[0]?.text ?? "null");
} catch {
  /* ignore */
}
if (issue?.id !== "LP-42" || !/双连字符/.test(issue?.title ?? "")) {
  fail("tools/call get_issue 未取回 LP-42 数据");
} else {
  console.log(`PASS mcp: tools/call get_issue 取回 ${issue.id} — ${issue.title}`);
  console.log(`PASS mcp: LP-42 acceptance 条数=${issue.acceptance.length}`);
}

const read = await call("resources/read", { uri: "issue://LP-42" });
let resource = null;
try {
  resource = JSON.parse(read.result?.contents?.[0]?.text ?? "null");
} catch {
  /* ignore */
}
if (resource?.id !== "LP-42") {
  fail("resources/read 未取回 issue://LP-42");
} else {
  console.log("PASS mcp: resources/read 取回 issue://LP-42");
}

child.stdin.end();
child.kill();

if (!process.exitCode) {
  console.log("PASS mcp: 外部 issue 数据可通过独立子进程边界取得");
}
