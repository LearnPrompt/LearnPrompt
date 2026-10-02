import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { readFileSync, readdirSync } from "node:fs";

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";
const site = isGitHubPages
  ? "https://learnprompt.github.io"
  : "https://www.learnprompt.pro";
const base = isGitHubPages ? "/LearnPrompt" : "";
const rootContentDirectory = new URL("./src/content/docs/", import.meta.url);
const englishContentDirectory = new URL("./src/content/docs/en/", import.meta.url);
const sourceFilePattern = /\.(?:md|mdx)$/;

function documentRoute(file, locale = "") {
  const route = file
    .replaceAll("\\", "/")
    .replace(sourceFilePattern, "")
    .replace(/\/index$/, "");
  return `/${locale}${locale ? "/" : ""}${route ? `${route}/` : ""}`;
}

function verifiedDate(fileUrl) {
  const source = readFileSync(fileUrl, "utf8");
  return source.match(/^verified_at:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m)?.[1];
}

function collectDocumentLastModified(directory, locale, filter = () => true) {
  return readdirSync(directory, { recursive: true })
    .filter((file) => sourceFilePattern.test(file) && filter(file))
    .flatMap((file) => {
      const date = verifiedDate(new URL(file, directory));
      return date ? [[documentRoute(file, locale), date]] : [];
    });
}

const documentLastModified = new Map([
  ...collectDocumentLastModified(
    rootContentDirectory,
    "",
    (file) => !file.startsWith("en/")
  ),
  ...collectDocumentLastModified(englishContentDirectory, "en"),
]);
const translatedEnglishRoutes = new Set(
  readdirSync(englishContentDirectory, { recursive: true })
    .filter((file) => sourceFilePattern.test(file))
    .map((file) => documentRoute(file, "en")),
);
translatedEnglishRoutes.add("/en/skills/");
const customPageLastModified = new Map([
  ["/", "2026-10-03"],
  ["/en/", "2026-10-03"],
  ["/skills/", "2026-10-03"],
  ["/en/skills/", "2026-10-03"],
]);

function includeInSitemap(page) {
  const pathname = new URL(page).pathname;
  const route = base && pathname.startsWith(`${base}/`)
    ? pathname.slice(base.length)
    : pathname;

  if (route === "/workshop/") return false;
  if (route === "/en/" || !route.startsWith("/en/")) {
    return true;
  }

  return translatedEnglishRoutes.has(route);
}

function serializeSitemapItem(item) {
  const pathname = new URL(item.url).pathname;
  const route = base && pathname.startsWith(`${base}/`)
    ? pathname.slice(base.length)
    : pathname;
  const lastModified = customPageLastModified.get(route) || documentLastModified.get(route);
  return lastModified ? { ...item, lastmod: lastModified } : item;
}

function rewriteRootRelativePaths() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === "element" && node.properties) {
        for (const attribute of ["href", "src"]) {
          const value = node.properties[attribute];
          if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
            node.properties[attribute] = `${base}${value}`;
          }
        }
      }
      for (const child of node.children || []) visit(child);
    };
    visit(tree);
  };
}

export default defineConfig({
  site,
  base: isGitHubPages ? "/LearnPrompt" : undefined,
  markdown: {
    processor: unified({
      rehypePlugins: [rewriteRootRelativePaths],
    }),
  },
  redirects: {
    "/workshop/": "/skills/",
  },
  integrations: [
    sitemap({
      filter: includeInSitemap,
      serialize: serializeSitemapItem,
      i18n: {
        defaultLocale: "root",
        locales: {
          root: "zh-CN",
          en: "en",
        },
      },
    }),
    starlight({
      title: "LearnPrompt",
      description: "面向普通 AI 爱好者和实践者的中文 AI 编程、Agent、Skills 与知识工作台教程。",
      defaultLocale: "root",
      routeMiddleware: "./src/starlight-route-data.ts",
      locales: {
        root: {
          label: "简体中文",
          lang: "zh-CN",
        },
        en: {
          label: "English",
          lang: "en",
        },
      },
      favicon: "/favicon.svg?v=transparent-circle",
      logo: {
        src: "./src/assets/learnprompt-logo.png",
        alt: "LearnPrompt",
      },
      customCss: ["./src/styles/custom.css"],
      components: {
        Head: "./src/components/SeoHead.astro",
        Footer: "./src/components/Footer.astro",
        PageFrame: "./src/components/PageFrame.astro",
      },
      editLink: {
        baseUrl:
          "https://github.com/LearnPrompt/LearnPrompt/edit/main/starlight/",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/LearnPrompt/LearnPrompt",
        },
      ],
      sidebar: [
        {
          label: "Skill 工坊 · Skills",
          translations: { en: "Skill Workshop" },
          link: "/skills/",
        },
        {
          label: "开始",
          translations: { en: "Start Here" },
          items: [{ autogenerate: { directory: "start-here" } }],
        },
        {
          label: "AI 编程",
          translations: { en: "AI Coding" },
          items: [{ autogenerate: { directory: "ai-coding" } }],
        },
        { label: "Claude Code", items: [{ autogenerate: { directory: "claude-code" } }] },
        { label: "Codex", items: [{ autogenerate: { directory: "codex" } }] },
        {
          label: "Agent 工程",
          translations: { en: "Agent Engineering" },
          items: [{ autogenerate: { directory: "agent-engineering" } }],
        },
        { label: "Agent Skills", items: [{ autogenerate: { directory: "agent-skills" } }] },
        { label: "Loop Engineering", items: [{ autogenerate: { directory: "loop-engineering" } }] },
        { label: "Obsidian AI", items: [{ autogenerate: { directory: "obsidian-ai" } }] },
        { label: "Hermes / OpenClaw", items: [{ autogenerate: { directory: "agent-frameworks" } }] },
        {
          label: "多智能体模拟",
          translations: { en: "Multi-Agent Simulations" },
          items: [{ autogenerate: { directory: "llm-agents" } }],
        },
        {
          label: "Stable Diffusion",
          items: [{ autogenerate: { directory: "stable-diffusion" } }],
        },
        {
          label: "AI 视频工作流",
          translations: { en: "AI Video Workflows" },
          items: [{ autogenerate: { directory: "ai-video" } }],
        },
        {
          label: "提示工程与可靠性",
          translations: { en: "Prompting & Reliability" },
          items: [{ autogenerate: { directory: "prompt-engineering" } }],
        },
      ],
      head: [
        {
          tag: "meta",
          attrs: {
            name: "learnprompt-build",
            content: "starlight-migration-no-analytics",
          },
        },
      ],
    }),
    mdx(),
  ],
});
