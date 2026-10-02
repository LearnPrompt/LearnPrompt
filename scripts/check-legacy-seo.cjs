const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const build = path.resolve(process.argv[2] || 'build');
const origin = 'https://v1.learnprompt.pro';
const socialImage = `${origin}/img/learnprompt-archive-social.jpg`;
const errors = [];
let canonicalCount = 0;
let alternateCount = 0;
const files = [];
const sitemapFiles = [];
function visit(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) visit(file);
    else if (file.endsWith('.html')) files.push(file);
    else if (item.name === 'sitemap.xml') sitemapFiles.push(file);
  }
}
assert.ok(fs.existsSync(build), 'Build the archive before checking SEO.');
visit(build);
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]));
}
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
  const links = [...head.matchAll(/<link\b[^>]*>/g)].map((match) => attributes(match[0]));
  const canonicals = links.filter((link) => link.rel === 'canonical');
  // Docusaurus redirect stubs and 404 pages intentionally have no canonical.
  if (!canonicals.length) continue;
  const relative = path.relative(build, file);
  // Client redirect stubs use relative canonical destinations and omit social cards.
  if (/<meta[^>]+http-equiv="refresh"/.test(head)) {
    if (canonicals.length !== 1 || new URL(canonicals[0].href, origin).origin !== origin) errors.push(`${relative}: foreign redirect canonical`);
    continue;
  }
  canonicalCount++;
  if (canonicals.length !== 1 || !canonicals[0].href.startsWith(`${origin}/`)) errors.push(`${relative}: invalid canonical`);
  const route = relative.replaceAll(path.sep, '/').replace(/index\.html$/, '');
  if (canonicals[0]?.href && new URL(canonicals[0].href).href !== new URL(`/${route}`, origin).href) errors.push(`${relative}: canonical does not identify this archive page`);
  for (const link of links.filter((link) => link.rel === 'alternate' && link.hreflang)) {
    alternateCount++;
    if (!link.href.startsWith(`${origin}/`)) errors.push(`${relative}: foreign hreflang URL ${link.href}`);
  }
  const metas = [...head.matchAll(/<meta\b[^>]*>/g)].map((match) => attributes(match[0]));
  for (const key of ['og:image', 'twitter:image']) {
    const values = metas.filter((meta) => (meta.property || meta.name) === key).map((meta) => meta.content);
    if (values.length !== 1 || values[0] !== socialImage) errors.push(`${relative}: invalid ${key}: ${values.join(', ')}`);
  }
  // Archived legal text needs an ownership review before its copied wording changes.
  const isArchivedLegalPage = /(?:terms_of_use|privacy_policy)\/index\.html$/.test(relative.replaceAll(path.sep, '/'));
  if (isArchivedLegalPage) {
    if (!metas.some((meta) => meta.name === 'robots' && meta.content === 'noindex,follow')) errors.push(`${relative}: archived legal template must be noindex,follow`);
    if (!html.includes('Archived legal template, not current LearnPrompt policy.')) errors.push(`${relative}: archive notice missing`);
  }
  if (!isArchivedLegalPage && /learnprompting\.org|Learn Prompting|translated into (?:9|13) languages/.test(head)) errors.push(`${relative}: stale competitor metadata`);
  for (const meta of metas.filter((meta) => ['og:url', 'twitter:url'].includes(meta.property || meta.name))) {
    if (!meta.content.startsWith(`${origin}/`)) errors.push(`${relative}: foreign social URL`);
  }
}
assert.ok(canonicalCount > 0, 'No canonical pages found.');
assert.ok(alternateCount > 0, 'No hreflang links found.');
const urls = sitemapFiles.flatMap((file) => [...fs.readFileSync(file, 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]));
assert.ok(sitemapFiles.length >= 2, 'Both locale sitemaps must exist.');
assert.ok(urls.length > 0, 'Sitemap is empty.');
for (const url of urls) {
  if (/\/(?:terms_of_use|privacy_policy)\//.test(url)) errors.push(`Sitemap includes archived legal template: ${url}`);
  if (!url.startsWith(`${origin}/`)) errors.push(`Sitemap: foreign URL ${url}`);
  else {
    const pathname = decodeURIComponent(new URL(url).pathname);
    if (!fs.existsSync(path.join(build, pathname, 'index.html')) && !fs.existsSync(path.join(build, pathname))) errors.push(`Sitemap: missing output for ${url}`);
  }
}
const robots = fs.readFileSync(path.join(build, 'robots.txt'), 'utf8');
assert.match(robots, /^Sitemap: https:\/\/v1\.learnprompt\.pro\/sitemap\.xml$/m);
assert.match(robots, /^Sitemap: https:\/\/v1\.learnprompt\.pro\/zh-Hans\/sitemap\.xml$/m);
assert.ok(fs.statSync(path.join(build, 'img/learnprompt-archive-social.jpg')).size > 0, 'Social image missing.');
const homepage = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
const organization = [...homepage.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1])).find((schema) => schema['@type'] === 'Organization');
assert.equal(organization?.url, `${origin}/`, 'Archive Organization URL is incorrect.');
assert.ok(organization.sameAs.includes('https://github.com/LearnPrompt/LearnPrompt'), 'Official repository missing from Organization.');
assert.ok(homepage.includes('href="/docs/intro/"'), 'Homepage learning link missing.');
assert.ok(!homepage.includes('href="https://learnprompt.pro/docs/intro'), 'Homepage leaves archive for the course.');
assert.equal(errors.length, 0, errors.slice(0, 25).join('\n'));
console.log(`Legacy SEO passed: ${canonicalCount} canonical pages, ${alternateCount} hreflang links, ${urls.length} sitemap URLs, self-hosted social previews and archive learning links.`);
