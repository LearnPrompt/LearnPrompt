function utcDayKey(instant) {
  return instant.toISOString().slice(0, 10);
}

export function rollupByReporterDay(entries, timeZone) {
  if (!Array.isArray(entries)) {
    throw new TypeError("entries must be an array");
  }

  if (!timeZone) {
    throw new TypeError("timeZone is required");
  }

  const totals = new Map();

  for (const entry of entries) {
    const instant = new Date(entry.timestamp);
    if (Number.isNaN(instant.getTime())) {
      throw new Error(`Invalid timestamp: ${entry.timestamp}`);
    }

    const day = utcDayKey(instant);
    totals.set(day, (totals.get(day) ?? 0) + entry.minutes);
  }

  return [...totals.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([day, totalMinutes]) => ({ day, totalMinutes }));
}
