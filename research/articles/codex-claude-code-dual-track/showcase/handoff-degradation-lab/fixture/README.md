# incident-archive-lab

This fixture archives incidents under `archive/<reporter>/<local-day>/<incident-id>.json`.

Known bug: the current implementation derives `local-day` from UTC, so reporters who file near midnight can land in the wrong day folder.

Do not change this README in the good path. The deterministic gate treats README edits as out of scope.
