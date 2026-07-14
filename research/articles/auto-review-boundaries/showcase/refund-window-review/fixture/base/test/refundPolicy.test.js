import assert from "node:assert/strict";
import test from "node:test";

import {
  REFUND_WINDOW_MS,
  isRefundEligible,
} from "../src/refundPolicy.js";

test("returns true when delivery is inside the refund window", () => {
  const now = new Date("2026-07-11T12:00:00.000Z");
  const deliveredAt = new Date(now.getTime() - REFUND_WINDOW_MS + 60_000);

  assert.equal(
    isRefundEligible({ deliveredAt: deliveredAt.toISOString(), now }),
    true,
  );
});

test("returns false when delivery is older than the refund window", () => {
  const now = new Date("2026-07-11T12:00:00.000Z");
  const deliveredAt = new Date(now.getTime() - REFUND_WINDOW_MS - 60_000);

  assert.equal(
    isRefundEligible({ deliveredAt: deliveredAt.toISOString(), now }),
    false,
  );
});

test("throws when deliveredAt is invalid", () => {
  assert.throws(
    () => isRefundEligible({ deliveredAt: "not-a-date" }),
    /deliveredAt must be an ISO timestamp/,
  );
});
