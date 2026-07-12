# Starlight build result

Date: 2026-07-12.

## First attempt: environment failure

`npm --prefix starlight run build` exited `127` because this isolated lane had no `starlight/node_modules`; shell reported `astro: command not found`. This was not treated as an MDX result.

## Lane-local dependency install

`npm --prefix starlight ci` completed and installed 427 packages in this lane. The audit summary reported 4 dependency vulnerabilities (1 low, 1 moderate, 2 high); no automated audit fix was run because it is outside this single-article scope.

## Successful build

The same `npm --prefix starlight run build` command then exited `0`:

- static routes generated, including `/agent-frameworks/deployment-channels-cost/`;
- Pagefind found 49 HTML files;
- `49 page(s) built`;
- build complete.
