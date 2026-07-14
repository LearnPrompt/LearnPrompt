import test from "node:test";
import assert from "node:assert/strict";

import { archiveIncident } from "../src/archiveIncident.js";

test("uses reporter local day instead of UTC day for Los Angeles", () => {
  const incident = {
    id: "inc-204",
    reporter: "maya",
    reporterTimeZone: "America/Los_Angeles",
    reportedAt: "2026-01-15T01:30:00Z"
  };

  const archived = archiveIncident(incident);
  assert.equal(archived.archiveDay, "2026-01-14");
  assert.equal(archived.archivePath, "archive/maya/2026-01-14/inc-204.json");
});

test("keeps same day when reporter local day already matches UTC day", () => {
  const incident = {
    id: "inc-305",
    reporter: "aki",
    reporterTimeZone: "Asia/Tokyo",
    reportedAt: "2026-01-15T01:30:00Z"
  };

  const archived = archiveIncident(incident);
  assert.equal(archived.archiveDay, "2026-01-15");
  assert.equal(archived.archivePath, "archive/aki/2026-01-15/inc-305.json");
});
