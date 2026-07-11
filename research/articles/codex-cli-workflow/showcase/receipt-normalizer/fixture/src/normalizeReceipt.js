export function normalizeReceipt(input) {
  const raw = String(input ?? "").trim().toUpperCase();

  if (!raw) {
    throw new Error("receipt reference is required");
  }

  const withoutAlias = raw.replace(/^(RECEIPT|RCPT|RCP)\s*[-:#]?\s*/, "");
  const digits = withoutAlias.replace(/\D/g, "");

  if (!digits) {
    throw new Error("receipt reference must contain digits");
  }

  return `RCPT-${digits.slice(0, 4).padStart(4, "0")}`;
}
