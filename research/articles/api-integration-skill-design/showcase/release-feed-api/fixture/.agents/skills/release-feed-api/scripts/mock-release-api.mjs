#!/usr/bin/env node

import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const successPages = {
  1: {
    releases: [
      {
        id: "release-240",
        tag: "v2.4.0",
        title: "Release Feed API",
        published_at: "2026-07-01",
        summary_url: "/notes/v2.4.0",
        notes: "Adds explicit request contract guards."
      },
      {
        id: "release-231",
        tag: "v2.3.1",
        title: "Rate Limit Retry",
        published_at: "2026-06-22",
        summary_url: "/notes/v2.3.1",
        notes: "Documents Retry-After handling."
      }
    ],
    next_page: 2
  },
  2: {
    releases: [
      {
        id: "release-230",
        tag: "v2.3.0",
        title: "Schema Validation",
        published_at: "2026-06-12",
        summary_url: "/notes/v2.3.0",
        notes: "Rejects empty payloads as contract drift."
      }
    ],
    next_page: null
  }
};

function json(response, statusCode, payload, headers = {}) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    ...headers
  });
  response.end(`${JSON.stringify(payload)}\n`);
}

function pagePath(requestUrl) {
  return `${requestUrl.pathname}${requestUrl.search}`;
}

function createHandler(scenario, credential, state) {
  return ({ method, url, headers }) => {
    const requestUrl = typeof url === "string" ? new URL(url) : url;
    const authorization = headers.authorization || headers.Authorization;
    const page = Number.parseInt(requestUrl.searchParams.get("page") || "1", 10);
    state.requests.push({
      method,
      path: pagePath(requestUrl),
      auth_present: Boolean(authorization)
    });

    if (method !== "GET") {
      return {
        status: 405,
        payload: { error: "method_not_allowed" },
        headers: {}
      };
    }

    if (authorization !== `Bearer ${credential}`) {
      return {
        status: 401,
        payload: { error: "missing_or_invalid_credential" },
        headers: {}
      };
    }

    if (scenario === "rate-limit-once" && state.rate_limit_hits === 0 && page === 1) {
      state.rate_limit_hits += 1;
      return {
        status: 429,
        payload: { error: "too_many_requests", retry_after: 0 },
        headers: { "retry-after": "0" }
      };
    }

    if (scenario === "retry-exhausted") {
      return {
        status: 503,
        payload: { error: "upstream_unavailable" },
        headers: {}
      };
    }

    if (scenario === "schema-drift") {
      return {
        status: 200,
        payload: {
          releases: [
            {
              id: "release-240",
              tag: "v2.4.0",
              title: "Broken Release Contract",
              summary_url: "/notes/v2.4.0",
              notes: "published_at was removed"
            }
          ],
          next_page: null
        },
        headers: {}
      };
    }

    const payload = successPages[page];
    if (!payload) {
      return {
        status: 404,
        payload: { error: "page_not_found" },
        headers: {}
      };
    }

    return {
      status: 200,
      payload,
      headers: {}
    };
  };
}

export function createMockFetchTransport(options = {}) {
  const scenario = options.scenario || "two-page-success";
  const credential = options.credential || randomUUID();
  const state = {
    scenario,
    credential_required: true,
    rate_limit_hits: 0,
    requests: []
  };
  const handler = createHandler(scenario, credential, state);

  return {
    credential,
    state,
    async fetch(url, requestOptions = {}) {
      const headers = requestOptions.headers || {};
      const result = handler({
        method: requestOptions.method || "GET",
        url,
        headers
      });
      return {
        ok: result.status >= 200 && result.status < 300,
        status: result.status,
        headers: {
          get(name) {
            const exact = result.headers[name];
            if (exact) {
              return exact;
            }
            return result.headers[name.toLowerCase()] || null;
          }
        },
        async json() {
          return result.payload;
        }
      };
    }
  };
}

export async function startMockReleaseApi(options = {}) {
  const scenario = options.scenario || "two-page-success";
  const credential = options.credential || randomUUID();
  const state = {
    scenario,
    credential_required: true,
    rate_limit_hits: 0,
    requests: []
  };
  const handler = createHandler(scenario, credential, state);
  const server = createServer((request, response) => {
    const result = handler({
      method: request.method,
      url: new URL(request.url, "http://127.0.0.1"),
      headers: request.headers
    });
    json(response, result.status, result.payload, result.headers);
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  return {
    baseUrl,
    credential,
    state,
    close() {
      return new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const scenario = process.argv[2] || "two-page-success";
  const credential = process.env.RELEASE_FEED_TOKEN || randomUUID();
  const server = await startMockReleaseApi({ scenario, credential });
  process.stdout.write(
    `${JSON.stringify(
      {
        scenario,
        base_url: server.baseUrl,
        credential_source: "env:RELEASE_FEED_TOKEN"
      },
      null,
      2
    )}\n`
  );
}
