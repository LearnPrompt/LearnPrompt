function dayKeyForReporter(incident) {
  return new Date(incident.reportedAt).toISOString().slice(0, 10);
}

export function archiveIncident(incident) {
  const archiveDay = dayKeyForReporter(incident);

  return {
    archiveDay,
    archivePath: `archive/${incident.reporter}/${archiveDay}/${incident.id}.json`,
    id: incident.id,
    reporter: incident.reporter,
    reporterTimeZone: incident.reporterTimeZone
  };
}
