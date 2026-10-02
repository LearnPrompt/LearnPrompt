import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const project = fileURLToPath(new URL("../", import.meta.url));
const dist = join(project, "dist");
const base = (process.env.EXPECTED_BASE || "").replace(/\/$/, "");
const site = process.env.EXPECTED_SITE || (base ? "https://learnprompt.github.io" : "https://www.learnprompt.pro");
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value]));
const files = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) await collect(file);
    else if (entry.name.endsWith(".html")) files.push(file);
  }
}
await collect(dist);
const sitemap = await readFile(join(dist, "sitemap-0.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
assert.ok(urls.length > 0, "Sitemap is empty");
const indexedUrls = new Set();
for (const file of files) {
  const path = relative(dist, file).replaceAll("\\", "/");
  if (path === "404.html") continue;
  const html = await readFile(file, "utf8");
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/)?.[1] || html.split(/<body/i)[0];
  const metas = [...head.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attributes(tag));
  const links = [...head.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attributes(tag));
  const route = `/${path.replace(/index\.html$/, "")}`;
  const url = `${site}${base}${route}`;
  if (metas.some((meta) => /refresh/i.test(meta["http-equiv"] || ""))) {
    assert.ok(!urls.includes(url), `Redirect is in sitemap: ${route}`);
    continue;
  }
  if (metas.some((meta) => meta.name === "robots" && /noindex/.test(meta.content))) {
    assert.ok(!urls.includes(url), `Noindex page is in sitemap: ${route}`);
    continue;
  }
  indexedUrls.add(url);
  const canonical = links.filter((link) => link.rel === "canonical");
  assert.equal(canonical.length, 1, `Expected one canonical: ${route}`);
  assert.equal(canonical[0].href, url, `Canonical must be the current page: ${route}`);
  for (const name of ["og:image", "twitter:image"]) {
    const meta = metas.find((item) => (item.property || item.name) === name);
    assert.ok(meta?.content.startsWith(`${site}${base}/images/`), `Foreign/missing ${name}: ${route}`);
  }
  const schemas = [...head.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(([, content]) => JSON.parse(content));
  const organization = schemas.find((schema) => schema["@type"] === "Organization") || schemas.find((schema) => schema.publisher)?.publisher;
  assert.ok(organization?.sameAs?.includes("https://github.com/LearnPrompt/LearnPrompt"), `Missing verified identity: ${route}`);
}
assert.deepEqual(new Set(urls), indexedUrls, "Sitemap must contain exactly the indexable canonical pages");
for (const route of ["/", "/en/", "/skills/", "/en/skills/"]) {
  const url = `${site}${base}${route}`;
  const entry = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(([, content]) => content.includes(`<loc>${url}</loc>`));
  assert.ok(entry, `Custom page missing from sitemap: ${route}`);
  assert.match(entry[1], /<lastmod>2026-10-03T00:00:00.000Z<\/lastmod>/);
}
const reel = await stat(join(dist, "videos/wiki-transition-v2.mp4"));
assert.ok(reel.size < 3_000_000, "Hero reel exceeds its 3 MB budget");
for (const route of ["", "en/"]) {
  const html = await readFile(join(dist, route, "index.html"), "utf8");
  const video = html.match(/<video\b[^>]*>/)?.[0];
  assert.ok(video && !/\ssrc=|\sautoplay(?:[\s=>])/.test(video), "Hero video must wait until after the page loads");
  assert.match(video, /preload="none"/);
  assert.match(video, /data-reel-src="[^"]+wiki-transition-v2\.mp4"/);
}
console.log(`SEO PASS: ${indexedUrls.size} canonical pages, matching sitemap, official identities, deferred ${reel.size}-byte hero reel.`);
