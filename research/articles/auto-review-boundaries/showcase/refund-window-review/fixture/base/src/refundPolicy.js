export const REFUND_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function isRefundEligible({ deliveredAt, now = new Date() }) {
  const deliveredAtMs = Date.parse(deliveredAt);
  if (Number.isNaN(deliveredAtMs)) {
    throw new Error("deliveredAt must be an ISO timestamp");
  }

  const nowMs = now instanceof Date ? now.getTime() : Date.parse(now);
  if (Number.isNaN(nowMs)) {
    throw new Error("now must be a Date or ISO timestamp");
  }

  const elapsedMs = nowMs - deliveredAtMs;
  return elapsedMs >= 0 && elapsedMs <= REFUND_WINDOW_MS;
}
