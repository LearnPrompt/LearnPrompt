# Route Report Contract

`reports/routes.json` must contain:

```json
{
  "generated_at": "2026-07-12",
  "model": "deterministic-replay or gpt-5.5",
  "budget": {
    "routed_reads": 10,
    "naive_inventory_files": 26
  },
  "routes": [
    {
      "task_id": "task-release-checklist",
      "route_key": "release-checklist",
      "area": "projects",
      "area_index": "projects/index.md",
      "target": "projects/release-checklist.md",
      "owner": "Project editor",
      "verified_date": "2026-07-12",
      "fallback": "Ask owner before broad scan",
      "citation": "projects/release-checklist.md",
      "target_heading": "Release checklist"
    }
  ]
}
```

Validation rules:

- exactly four routes;
- no duplicate task route;
- exact canonical target for each frozen task;
- `citation` equals canonical target;
- `verified_date` is `2026-07-12`;
- no private/sensitive target;
- exact 10-line read trace in required order;
- budget says `10/26`;
- fixture source files remain byte-identical during verification.
