#!/usr/bin/env node
// 最小 stdio MCP-风格 issue 服务器。
// 通过 stdin/stdout 收发换行分隔的 JSON-RPC 2.0 报文，从 fixture 提供 issue 数据。
//
// 重要边界声明：本文件仅实现演示所需的最小 JSON-RPC 方法
// (initialize / tools/list / tools/call / resources/list / resources/read)，
// 用来说明“MCP = Agent 通过一个进程边界访问外部系统/数据”这一机制。
// 它不使用官方 SDK，不宣称完整 MCP conformance，也不代表 Claude Code 在线集成行为。

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const here = path.dirname(fileURLToPath(import.meta.url));
const issuesDir = path.resolve(here, "..", "fixtures", "issues");

function loadIssue(id) {
  // 只允许读取 fixtures/issues 下、形如 LP-42 的白名单标识，防止路径穿越。
  if (!/^[A-Z]{2}-\d+$/.test(id)) return null;
  try {
    return JSON.parse(readFileSync(path.join(issuesDir, `${id}.json`), "utf8"));
  } catch {
    return null;
  }
}

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}

function reply(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function replyError(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

const rl = createInterface({ input: process.stdin });
rl.on("line", (line) => {
  const text = line.trim();
  if (!text) return;
  let req;
  try {
    req = JSON.parse(text);
  } catch {
    return;
  }
  const { id, method, params } = req;

  switch (method) {
    case "initialize":
      reply(id, {
        protocolVersion: "demo-0.1",
        serverInfo: { name: "release-workbench-issue-server", version: "0.1.0" },
        capabilities: { tools: {}, resources: {} },
      });
      break;

    case "tools/list":
      reply(id, {
        tools: [
          {
            name: "get_issue",
            description: "按 issue 标识返回 issue 详情",
            inputSchema: {
              type: "object",
              properties: { id: { type: "string" } },
              required: ["id"],
            },
          },
        ],
      });
      break;

    case "tools/call": {
      if (params?.name !== "get_issue") {
        replyError(id, -32601, `未知 tool: ${params?.name}`);
        break;
      }
      const issue = loadIssue(params?.arguments?.id);
      if (!issue) {
        replyError(id, -32602, `未找到 issue: ${params?.arguments?.id}`);
        break;
      }
      reply(id, {
        content: [{ type: "text", text: JSON.stringify(issue) }],
        isError: false,
      });
      break;
    }

    case "resources/list":
      reply(id, {
        resources: [
          { uri: "issue://LP-42", name: "LP-42", mimeType: "application/json" },
        ],
      });
      break;

    case "resources/read": {
      const uri = params?.uri ?? "";
      const match = uri.match(/^issue:\/\/([A-Z]{2}-\d+)$/);
      const issue = match ? loadIssue(match[1]) : null;
      if (!issue) {
        replyError(id, -32602, `无法读取 resource: ${uri}`);
        break;
      }
      reply(id, {
        contents: [
          { uri, mimeType: "application/json", text: JSON.stringify(issue) },
        ],
      });
      break;
    }

    default:
      replyError(id, -32601, `未实现的方法: ${method}`);
  }
});
