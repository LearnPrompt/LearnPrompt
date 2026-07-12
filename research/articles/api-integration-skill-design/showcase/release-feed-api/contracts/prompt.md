Use `$release-feed-api` for this task.

Work only inside the current temporary Git repository.

Task:

1. Read the loopback release feed using the skill.
2. Produce only:
   - `reports/releases.json`
   - `reports/releases.md`
3. Run `npm test`.
4. Return only the JSON object requested by the caller schema.

Important boundaries:

- This is a read-only integration. Do not publish, mutate upstream state, or switch to `POST`, `PUT`, `PATCH`, or `DELETE`.
- Do not edit `release-feed.config.json` or any file under `.agents/skills/release-feed-api/`.
- If the host blocks loopback HTTP or the skill cannot run, say so plainly and stop.
