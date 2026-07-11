# acceptance-to-popup-flow visual check

Date: 2026-07-11
Public asset: `starlight/public/images/articles/chrome-extension-prototype/acceptance-to-popup-flow.svg`
Rendered review asset: `research/articles/chrome-extension-prototype/visual-check/acceptance-to-popup-flow.png`

Checks:

- `xmllint --noout starlight/public/images/articles/chrome-extension-prototype/acceptance-to-popup-flow.svg`
- `sips -s format png starlight/public/images/articles/chrome-extension-prototype/acceptance-to-popup-flow.svg --out research/articles/chrome-extension-prototype/visual-check/acceptance-to-popup-flow.png`
- `sips -g pixelWidth -g pixelHeight research/articles/chrome-extension-prototype/visual-check/acceptance-to-popup-flow.png`
- The resulting PNG is `1200 x 720`.
- Manual visual inspection confirmed:
  - the middle-top note stays inside its card;
  - the top-right permissions pill stays inside both pill and canvas;
  - the bottom-right restricted-page pill stays inside both pill and canvas.

Result: pass

Scope: research-only review artifact, not a public image.
