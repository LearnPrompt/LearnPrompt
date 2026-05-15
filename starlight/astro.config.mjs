import mdx from "@astrojs/mdx";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";

export default defineConfig({
  site: isGitHubPages ? "https://learnprompt.github.io" : "https://www.learnprompt.pro",
  base: isGitHubPages ? "/LearnPrompt" : undefined,
  integrations: [
    starlight({
      title: "LearnPrompt AI 实战 Wiki",
      description: "面向普通 AI 爱好者和实践者的中文 AI 编程、Agent、Skills 与知识工作台教程。",
      customCss: ["./src/styles/custom.css"],
      editLink: {
        baseUrl:
          "https://github.com/LearnPrompt/LearnPrompt/edit/codex/starlight-wiki-migration/starlight/",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/LearnPrompt/LearnPrompt",
        },
      ],
      sidebar: [
        { label: "开始", items: [{ autogenerate: { directory: "start-here" } }] },
        { label: "AI 编程", items: [{ autogenerate: { directory: "ai-coding" } }] },
        { label: "Claude Code", items: [{ autogenerate: { directory: "claude-code" } }] },
        { label: "Codex", items: [{ autogenerate: { directory: "codex" } }] },
        { label: "Agent 工程", items: [{ autogenerate: { directory: "agent-engineering" } }] },
        { label: "Agent Skills", items: [{ autogenerate: { directory: "agent-skills" } }] },
        { label: "Obsidian AI", items: [{ autogenerate: { directory: "obsidian-ai" } }] },
        { label: "Hermes / OpenClaw", items: [{ autogenerate: { directory: "agent-frameworks" } }] },
        { label: "来源与归档", items: [{ autogenerate: { directory: "sources" } }] },
        { label: "旧内容归档", items: [{ autogenerate: { directory: "archive" } }] },
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
