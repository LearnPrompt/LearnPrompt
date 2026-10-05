import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const expectedBase = (process.env.EXPECTED_BASE || "").replace(/\/$/, "");
const scriptDirectory = fileURLToPath(new URL(".", import.meta.url));
const projectDirectory = join(scriptDirectory, "..");
const distDirectory = join(projectDirectory, "dist");
const baselineFile = join(scriptDirectory, "i18n-baseline-routes.txt");
const translatedDirectory = join(
  projectDirectory,
  "src",
  "content",
  "docs",
  "en"
);
const chineseSourceDirectory = join(
  projectDirectory,
  "src",
  "content",
  "docs"
);

const excludedFromLocaleMirror = new Set([
  "./404.html",
  "./index.html",
  "./skills/index.html",
  "./workshop/index.html",
]);

const routeFile = (route) =>
  join(distDirectory, route.replace(/^\/|\/$/g, ""), "index.html");

const assertFile = async (file, label) => {
  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error();
  } catch {
    throw new Error(`Missing ${label}: ${file}`);
  }
};

const collectHtmlFiles = async (directory, files = []) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const child = join(directory, entry.name);
    if (entry.isDirectory()) await collectHtmlFiles(child, files);
    if (entry.isFile() && entry.name.endsWith(".html")) {
      const path = relative(distDirectory, child).split(sep).join("/");
      files.push(`./${path}`);
    }
  }
  return files;
};

const collectSourceFiles = async (directory, files = []) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const child = join(directory, entry.name);
    if (entry.isDirectory()) await collectSourceFiles(child, files);
    if (entry.isFile() && /\.(?:md|mdx)$/.test(entry.name)) {
      files.push(relative(translatedDirectory, child));
    }
  }
  return files;
};

const routeForTranslatedSource = (sourceName) => {
  const slug = sourceName
    .split(sep)
    .join("/")
    .replace(/\.(?:md|mdx)$/, "")
    .replace(/\/index$/, "");
  return `/en/${slug ? `${slug}/` : ""}`;
};

const assertSameList = (label, expected, actual) => {
  const expectedJson = JSON.stringify([...expected].sort());
  const actualJson = JSON.stringify([...actual].sort());
  if (expectedJson !== actualJson) {
    throw new Error(
      `${label} mismatch.\nExpected:\n${[...expected].sort().join("\n")}\nActual:\n${[
        ...actual,
      ]
        .sort()
        .join("\n")}`
    );
  }
};

const assertBaseAwareUrls = (html, route) => {
  const internalUrls = [...html.matchAll(/\b(?:href|src)="(\/[^"]*)"/g)].map(
    (match) => match[1]
  );
  const badUrls = expectedBase
    ? internalUrls.filter(
        (url) => url !== expectedBase && !url.startsWith(`${expectedBase}/`)
      )
    : internalUrls.filter((url) => url.startsWith("//"));
  if (badUrls.length) {
    throw new Error(
      `Base URL mismatch in ${route}: ${[...new Set(badUrls)].join(", ")}`
    );
  }
};

const withExpectedBase = (route) => `${expectedBase}${route}`;
const hasChinese = (text) => /[\u4e00-\u9fff]/.test(text);
const anchorsIn = (html) =>
  [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attributes, body]) => ({
    href: attributes.match(/\bhref="([^"]*)"/)?.[1],
    lang: attributes.match(/\blang="([^"]*)"/)?.[1],
    hreflang: attributes.match(/\bhreflang="([^"]*)"/)?.[1],
    text: body.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim(),
  }));

const frontmatterContract = (source) => {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error("Missing frontmatter");
  const block = match[1];
  const keys = [...block.matchAll(/^([a-zA-Z0-9_-]+):/gm)].map(
    (item) => item[1]
  );
  const order = block.match(/^sidebar:\s*\n\s+order:\s*(\d+)/m)?.[1];
  return { keys, order };
};

const countMatches = (source, pattern) => (source.match(pattern) || []).length;
const sourceShape = (source) => ({
  headings: countMatches(source, /^## (?!#)/gm),
  codeFences: countMatches(source, /^```/gm),
  tableRows: countMatches(source, /^\|/gm),
  images: countMatches(source, /^!\[[^\]]*\]\([^)]*\)/gm),
  directives: countMatches(source, /^:::/gm),
  links: countMatches(source, /\]\(([^)\s]+)\)/g),
});

const baselineRoutes = (await readFile(baselineFile, "utf8"))
  .trim()
  .split("\n")
  .filter(Boolean);
const translatedPages = (await collectSourceFiles(translatedDirectory))
  .sort()
  .map((sourceName) => [sourceName, routeForTranslatedSource(sourceName)]);
const allHtmlFiles = await collectHtmlFiles(distDirectory);
const actualRootRoutes = allHtmlFiles.filter((file) => !file.startsWith("./en/"));
assertSameList("Chinese/root route baseline", baselineRoutes, actualRootRoutes);

const mirroredDocRoutes = baselineRoutes
  .filter((file) => !excludedFromLocaleMirror.has(file))
  .map((file) => `./en/${file.slice(2)}`);
const expectedEnglishRoutes = [
  "./en/index.html",
  "./en/skills/index.html",
  ...mirroredDocRoutes,
];
const actualEnglishRoutes = allHtmlFiles.filter((file) => file.startsWith("./en/"));
assertSameList("English route contract", expectedEnglishRoutes, actualEnglishRoutes);

for (const [sourceName, route] of translatedPages) {
  const source = await readFile(join(translatedDirectory, sourceName), "utf8");
  const chineseSource = await readFile(
    join(chineseSourceDirectory, sourceName),
    "utf8"
  );
  const translatedFrontmatter = frontmatterContract(source);
  const chineseFrontmatter = frontmatterContract(chineseSource);
  assertSameList(
    `Frontmatter keys for ${sourceName}`,
    chineseFrontmatter.keys,
    translatedFrontmatter.keys
  );
  if (translatedFrontmatter.order !== chineseFrontmatter.order) {
    throw new Error(
      `Sidebar order mismatch in ${sourceName}: expected ${chineseFrontmatter.order}, got ${translatedFrontmatter.order}`
    );
  }
  const sourceLineCount = chineseSource.trimEnd().split("\n").length;
  const translatedLineCount = source.trimEnd().split("\n").length;
  if (translatedLineCount < Math.ceil(sourceLineCount * 0.9)) {
    throw new Error(
      `Translated source is suspiciously shorter than its source: ${sourceName} (${translatedLineCount}/${sourceLineCount} lines)`
    );
  }
  const expectedShape = sourceShape(chineseSource);
  const actualShape = sourceShape(source);
  for (const [part, expectedCount] of Object.entries(expectedShape)) {
    if (actualShape[part] !== expectedCount) {
      throw new Error(
        `Translated source ${part} mismatch in ${sourceName}: expected ${expectedCount}, got ${actualShape[part]}`
      );
    }
  }
  const translatedFrontmatterBlock = source.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
  if (/[\u4e00-\u9fff]/.test(translatedFrontmatterBlock)) {
    throw new Error(`Unexpected Chinese text in translated frontmatter: ${sourceName}`);
  }
  const prose = source
    .replace(/^---\n[\s\S]*?\n---\n?/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "");
  if (/[\u4e00-\u9fff]/.test(prose)) {
    throw new Error(`Unexpected Chinese text in translated source: ${sourceName}`);
  }
  const markdownLinks = [...source.matchAll(/\]\(([^)\s]+)\)/g)].map(
    (match) => match[1]
  );
  for (const href of markdownLinks) {
    if (/^(?:https?:|mailto:|#|\/images\/|\/videos\/)/.test(href)) continue;
    const target = new URL(href, `https://learnprompt.test${route}`);
    if (!target.pathname.startsWith("/en/")) {
      throw new Error(
        `Translated source links outside the English locale in ${sourceName}: ${href}`
      );
    }
    await assertFile(
      routeFile(target.pathname),
      `translated internal link ${href} from ${sourceName}`
    );
  }

  const file = routeFile(route);
  await assertFile(file, `translated route ${route}`);
  const html = await readFile(file, "utf8");
  if (!/<html[^>]*lang="en"/.test(html)) {
    throw new Error(`Missing lang=en: ${route}`);
  }
  if (html.includes("This content is not available in your language yet")) {
    throw new Error(`Translated route still renders fallback notice: ${route}`);
  }
  if (html.includes('name="robots" content="noindex,follow"')) {
    throw new Error(`Translated route is marked noindex: ${route}`);
  }
  if (!html.includes('type="application/ld+json"')) {
    throw new Error(`Missing structured data on translated route: ${route}`);
  }
  if (!html.includes('property="og:image"')) {
    throw new Error(`Missing Open Graph image on translated route: ${route}`);
  }
  assertBaseAwareUrls(html, route);
}

const englishHome = await readFile(routeFile("/en/"), "utf8");
const englishWorkshop = await readFile(routeFile("/en/skills/"), "utf8");
if (!/<html[^>]*lang="en"/.test(englishWorkshop) || /http-equiv="refresh"/i.test(englishWorkshop)) {
  throw new Error("English Workshop must be an English page, not a redirect");
}
for (const marker of ["Build your own tools", "Copy", 'rel="canonical"', 'property="og:image"', 'type="application/ld+json"']) {
  if (!englishWorkshop.includes(marker)) throw new Error(`Missing English Workshop marker: ${marker}`);
}
assertBaseAwareUrls(englishWorkshop, "/en/skills/");
const englishHomeLinks = anchorsIn(englishHome);
if (englishHomeLinks.some(({ href }) => href === withExpectedBase("/skills/"))) {
  throw new Error("English homepage sends Workshop visitors to Chinese content");
}
if (!englishHomeLinks.some(({ href }) => href === withExpectedBase("/en/skills/"))) {
  throw new Error("English homepage does not link to the English Workshop");
}
const englishWorkshopLinks = anchorsIn(englishWorkshop);
const chineseWorkshopSwitch = englishWorkshopLinks.find(
  ({ href }) => href === withExpectedBase("/skills/")
);
if (
  chineseWorkshopSwitch?.lang !== "zh-CN" ||
  chineseWorkshopSwitch.hreflang !== "zh-CN" ||
  !hasChinese(chineseWorkshopSwitch.text)
) {
  throw new Error("English Workshop language switch must be a Chinese-labeled zh-CN link");
}
for (const link of englishWorkshopLinks.filter(({ text }) => text.includes("Article (Chinese)"))) {
  if (link.hreflang !== "zh-CN") {
    throw new Error(`Chinese article link on English Workshop lacks hreflang: ${link.href}`);
  }
}
const chineseWorkshop = await readFile(routeFile("/skills/"), "utf8");
const englishWorkshopSwitch = anchorsIn(chineseWorkshop).find(
  ({ href }) => href === withExpectedBase("/en/skills/")
);
if (englishWorkshopSwitch?.lang !== "en" || englishWorkshopSwitch.hreflang !== "en") {
  throw new Error("Chinese Workshop language switch must be an en link to the English Workshop");
}
if (!/<html[^>]*lang="en"/.test(englishHome)) {
  throw new Error("Missing lang=en on English homepage");
}
for (const language of ["zh-CN", "en", "x-default"]) {
  if (!englishHome.includes(`hreflang="${language}"`)) {
    throw new Error(`Missing ${language} alternate on English homepage`);
  }
}
assertBaseAwareUrls(englishHome, "/en/");
for (const marker of [
  'type="application/ld+json"',
  'property="og:image"',
  'rel="sitemap"',
]) {
  if (!englishHome.includes(marker)) {
    throw new Error(`Missing SEO marker on English homepage: ${marker}`);
  }
}

const chineseHome = await readFile(routeFile("/"), "utf8");
if (!/<html[^>]*lang="zh-CN"/.test(chineseHome)) {
  throw new Error("Chinese homepage is not lang=zh-CN");
}
for (const language of ["zh-CN", "en", "x-default"]) {
  if (!chineseHome.includes(`hreflang="${language}"`)) {
    throw new Error(`Missing ${language} alternate on Chinese homepage`);
  }
}
assertBaseAwareUrls(chineseHome, "/");
for (const marker of [
  'type="application/ld+json"',
  'property="og:image"',
  'rel="sitemap"',
]) {
  if (!chineseHome.includes(marker)) {
    throw new Error(`Missing SEO marker on Chinese homepage: ${marker}`);
  }
}

const chineseSample = await readFile(routeFile("/start-here/"), "utf8");
if (!/<html[^>]*lang="zh-CN"/.test(chineseSample)) {
  throw new Error("Chinese root sample is not lang=zh-CN");
}
for (const label of ["搜索", "本页内容", "上一页", "下一页"]) {
  if (!chineseSample.includes(label)) {
    throw new Error(`Missing Chinese UI label on root sample: ${label}`);
  }
}

const translatedRouteSet = new Set(translatedPages.map(([, route]) => route));
const fallbackRoutes = mirroredDocRoutes
  .map((file) => `/${file.slice(2).replace(/index\.html$/, "")}`)
  .filter((route) => !translatedRouteSet.has(route));
for (const route of fallbackRoutes) {
  const fallbackHtml = await readFile(routeFile(route), "utf8");
  if (!/<html[^>]*lang="en"/.test(fallbackHtml)) {
    throw new Error(`Fallback route is not lang=en: ${route}`);
  }
  if (!fallbackHtml.includes("This content is not available in your language yet")) {
    throw new Error(`Missing fallback notice: ${route}`);
  }
  if (!fallbackHtml.includes('name="robots" content="noindex,follow"')) {
    throw new Error(`Fallback route is indexable: ${route}`);
  }
  if (fallbackHtml.includes('type="application/ld+json"')) {
    throw new Error(`Fallback route exposes duplicate structured data: ${route}`);
  }
}

// Every untranslated guide must surface in English navigation as an explicitly
// labeled link to the Chinese page, never as a Chinese title under /en/.
const englishNavigationSample = anchorsIn(
  await readFile(routeFile("/en/agent-engineering/"), "utf8")
);
for (const route of fallbackRoutes) {
  const chineseRoute = route.replace(/^\/en\//, "/");
  if (englishNavigationSample.some(({ href }) => href === withExpectedBase(route))) {
    throw new Error(`English navigation links to untranslated fallback: ${route}`);
  }
  const link = englishNavigationSample.find(
    ({ href }) => href === withExpectedBase(chineseRoute)
  );
  if (
    !link ||
    link.lang !== "zh-CN" ||
    !link.text.endsWith("(Chinese)") ||
    hasChinese(link.text)
  ) {
    throw new Error(`Chinese-only guide is not clearly labeled in English navigation: ${chineseRoute}`);
  }
}

const robots = await readFile(join(distDirectory, "robots.txt"), "utf8");
if (
  !robots.includes("User-agent: *") ||
  !robots.includes("Allow: /") ||
  !robots.includes("Sitemap: https://www.learnprompt.pro/sitemap-index.xml")
) {
  throw new Error("robots.txt does not expose the production sitemap");
}

const sitemap = await readFile(join(distDirectory, "sitemap-0.xml"), "utf8");
const sitemapEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
  ([, entry]) => {
    const location = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!location) throw new Error("Sitemap entry is missing <loc>");
    const pathname = new URL(location).pathname;
    const route = expectedBase && pathname.startsWith(`${expectedBase}/`)
      ? pathname.slice(expectedBase.length)
      : pathname;
    return { route, lastmod: entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] };
  }
);
const normalizedSitemapRoutes = sitemapEntries.map(({ route }) => route);
const actualEnglishSitemapRoutes = normalizedSitemapRoutes.filter((route) =>
  route.startsWith("/en/")
);
assertSameList(
  "English sitemap routes",
  ["/en/", "/en/skills/", ...translatedPages.map(([, route]) => route)],
  actualEnglishSitemapRoutes
);

const sitemapLastmodByRoute = new Map(
  sitemapEntries.map(({ route, lastmod }) => [route, lastmod])
);
for (const [sourceName, route] of translatedPages) {
  const source = await readFile(join(translatedDirectory, sourceName), "utf8");
  const verifiedAt = source.match(
    /^verified_at:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m
  )?.[1];
  if (!verifiedAt) continue;
  const expectedLastmod = `${verifiedAt}T00:00:00.000Z`;
  if (sitemapLastmodByRoute.get(route) !== expectedLastmod) {
    throw new Error(
      `Unexpected sitemap lastmod for ${route}: expected ${expectedLastmod}, got ${
        sitemapLastmodByRoute.get(route) || "missing"
      }`
    );
  }
}

const pagefind = JSON.parse(
  await readFile(join(distDirectory, "pagefind", "pagefind-entry.json"), "utf8")
);
for (const language of ["en", "zh-cn"]) {
  if (pagefind.languages?.[language]?.page_count !== mirroredDocRoutes.length) {
    throw new Error(
      `Unexpected Pagefind ${language} count: ${
        pagefind.languages?.[language]?.page_count ?? "missing"
      }`
    );
  }
}

console.log(
  `i18n/SEO PASS: ${translatedPages.length} translated guides, ${
    fallbackRoutes.length
  } fallback guides, ${baselineRoutes.length} preserved root routes, base=${
    expectedBase || "/"
  }`
);
