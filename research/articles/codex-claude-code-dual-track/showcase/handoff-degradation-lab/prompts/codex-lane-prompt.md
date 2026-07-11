The outer harness will append the frozen contract JSON after this prompt. Treat that appended JSON as the only source of truth.

Task:

1. Fix the incident archive bug so the archive day uses the reporter's local calendar day.
2. Only edit `src/archiveIncident.js`.
3. Run `npm test`.
4. Return JSON that matches the schema file passed by the outer harness.

Rules:

- Do not edit `README.md`, `AGENTS.md`, `package.json`, or files under `test/`.
- Keep the patch minimal.
- Report the exact changed files and the test exit code.
