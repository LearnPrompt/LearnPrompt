import assert from "node:assert/strict";
import test from "node:test";

import { rollupByReporterDay } from "../src/rollupByReporterDay.js";

test("rolls late-night usage into the reporter local day", () => {
  const rows = [
    { timestamp: "2026-02-04T07:55:00.000Z", minutes: 15 },
    { timestamp: "2026-02-04T08:10:00.000Z", minutes: 20 },
    { timestamp: "2026-02-05T07:40:00.000Z", minutes: 25 }
  ];

  assert.deepEqual(rollupByReporterDay(rows, "America/Los_Angeles"), [
    { day: "2026-02-03", totalMinutes: 15 },
    { day: "2026-02-04", totalMinutes: 45 }
  ]);
});

test("keeps buckets sorted even if input order is shuffled", () => {
  const rows = [
    { timestamp: "2026-03-01T16:10:00.000Z", minutes: 10 },
    { timestamp: "2026-03-01T15:10:00.000Z", minutes: 5 }
  ];

  assert.deepEqual(rollupByReporterDay(rows, "Asia/Shanghai"), [
    { day: "2026-03-01", totalMinutes: 5 },
    { day: "2026-03-02", totalMinutes: 10 }
  ]);
});

test("throws on invalid timestamps", () => {
  assert.throws(
    () =>
      rollupByReporterDay(
        [{ timestamp: "not-a-real-timestamp", minutes: 5 }],
        "UTC",
      ),
    /Invalid timestamp/,
  );
});
