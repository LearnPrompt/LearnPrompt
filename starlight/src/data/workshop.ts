export type Project = {
  name: string;
  repo: string;
  tagline: string;
  taglineEn: string;
  installCmd?: string;
  articleUrl?: string;
  fallbackStars: number;
};

export const activeProjects: Project[] = [
  {
    name: "ai-news-radar",
    repo: "LearnPrompt/ai-news-radar",
    tagline: "24 小时 AI 新闻雷达，GitHub Actions 自动更新，少刷一点，把注意力留给真正的变化。",
    taglineEn: "An around-the-clock AI news radar, updated automatically with GitHub Actions. Spend less time scrolling and focus on meaningful changes.",
    installCmd: "npx skills add LearnPrompt/ai-news-radar -g",
    articleUrl: "https://mp.weixin.qq.com/s/iW5FVqbHtYi31mJ22Q_cog",
    fallbackStars: 1546,
  },
  {
    name: "luban-skill",
    repo: "LearnPrompt/luban-skill",
    tagline: "Agent Skill 打磨车间：验料、访行、过尺、慢刨、回炉，把能用的 skill 磨成能传播的公共资产。",
    taglineEn: "An Agent Skill workshop: inspect, research, measure, refine, and rework useful skills into public resources others can share.",
    installCmd: "npx skills add LearnPrompt/luban-skill -g",
    articleUrl: "https://mp.weixin.qq.com/s/WX_MNcSmSHUkjkPxzmc9Tg",
    fallbackStars: 813,
  },
  {
    name: "humanize-ppt",
    repo: "LearnPrompt/humanize-ppt",
    tagline: "为演讲而生的 PPT 系统：先把资料编成一条讲述主线，再生成页面，最后自己跑一遍演讲体检。",
    taglineEn: "A presentation system built for speaking: turn source material into a narrative, generate slides, then check the presentation yourself.",
    installCmd: "npx skills add LearnPrompt/humanize-ppt -g",
    articleUrl: "https://mp.weixin.qq.com/s/rGoYnUcBRkfRKQPbIaawyg",
    fallbackStars: 741,
  },
];

export const stableProjects: Project[] = [
  {
    name: "cc-harness-skills",
    repo: "LearnPrompt/cc-harness-skills",
    tagline: "从 coding agent 工程实践提炼的六件套：记忆、压缩、验证、路由、调度。",
    taglineEn: "Six tools distilled from coding agent engineering: memory, compression, verification, routing, and orchestration.",
    installCmd: "npx skills add LearnPrompt/cc-harness-skills -g",
    fallbackStars: 222,
  },
  {
    name: "andrej-karpathy-skills",
    repo: "LearnPrompt/andrej-karpathy-skills",
    tagline:
      "把 Andrej Karpathy 三年公开分享提炼成 14 个可安装的 Agent Skills：自动化研究循环、idea 文件、LLM 模拟辩论、元反思、写代码的行为准则都在。",
    taglineEn: "Three years of Andrej Karpathy’s public work distilled into 14 installable Agent Skills, covering research loops, idea files, LLM debates, reflection, and coding principles.",
    installCmd: "npx skills add LearnPrompt/andrej-karpathy-skills",
    fallbackStars: 92,
  },
  {
    name: "partner-skill",
    repo: "LearnPrompt/partner-skill",
    tagline: "Claude Code 管规划与审查，Codex 管实现与收尾，一张 Session Receipt 记账。",
    taglineEn: "Claude Code handles planning and review; Codex handles implementation and completion. A Session Receipt records the work.",
    installCmd: "npx skills add LearnPrompt/partner-skill -g",
    fallbackStars: 14,
  },
  {
    name: "bugu",
    repo: "LearnPrompt/bugu",
    tagline: "macOS 菜单栏声音信标：agent 开始、完成、要授权、被中断，各叫一声。",
    taglineEn: "A macOS menu bar sound beacon: hear when an agent starts, finishes, needs permission, or gets interrupted.",
    articleUrl: "https://mp.weixin.qq.com/s/hzZ87HG_qiZRYUs8ZIzm1Q",
    fallbackStars: 21,
  },
  {
    name: "paoding-skill",
    repo: "LearnPrompt/paoding-skill",
    tagline: "零 API 拆解任何博主的爆款打法，蒸馏成可安装的内容教练。",
    taglineEn: "Analyze a creator’s successful content without an API and distill their approach into an installable content coach.",
    installCmd: "npx skills add LearnPrompt/paoding-skill -g",
    fallbackStars: 16,
  },
  {
    name: "x-article-publisher-skill",
    repo: "LearnPrompt/x-article-publisher-skill",
    tagline: "飞书文档或本地 Markdown 一键变成 X Article 草稿，媒体自动落回原位。",
    taglineEn: "Turn a Feishu document or local Markdown into an X Article draft, with media restored to its original positions.",
    installCmd:
      "npx skills add LearnPrompt/x-article-publisher-skill --skill x-article-publisher --global --copy --yes --full-depth",
    fallbackStars: 8,
  },
  {
    name: "carl-weread",
    repo: "LearnPrompt/carl-weread",
    tagline: "微信读书行动型阅读教练：按你当前卡住的问题，推荐今天读哪一小节。",
    taglineEn: "An action-oriented WeRead reading coach: choose a section to read today based on the problem you are trying to solve.",
    installCmd:
      "hermes skills install https://raw.githubusercontent.com/LearnPrompt/carl-weread/main/SKILL.md",
    fallbackStars: 22,
  },
  {
    name: "skillrush-town",
    repo: "LearnPrompt/skillrush-town",
    tagline: "淘金小镇：每天盯 ClawHub Top100，看哪些 Skill 正在冒头。",
    taglineEn: "A daily watch on ClawHub’s Top 100, tracking which Skills are gaining momentum.",
    installCmd: "npx skills add LearnPrompt/skillrush-town -g",
    fallbackStars: 104,
  },
  {
    name: "LLMs-cookbook",
    repo: "LearnPrompt/LLMs-cookbook",
    tagline: "早期 LLM 实战示例与指南合集，记录这一切开始的地方。",
    taglineEn: "A collection of early LLM examples and guides, documenting where it all began.",
    fallbackStars: 263,
  },
  {
    name: "loop-engineering",
    repo: "LearnPrompt/loop-engineering",
    tagline: "愚公：别再一轮轮手动催 Agent，把山交给一个会自己挖的循环。",
    taglineEn: "Yugong: give an agent a loop that keeps making progress, without manually prompting every round.",
    installCmd: "npx skills add LearnPrompt/loop-engineering",
    fallbackStars: 3,
  },
  {
    name: "cailun-skill",
    repo: "LearnPrompt/cailun-skill",
    tagline: "蔡伦：对话里聊出来的好东西别埋在聊天记录里，造一页纸传出去。",
    taglineEn: "Cailun: turn useful ideas from a conversation into a shareable page instead of leaving them buried in chat history.",
    installCmd: "npx skills add LearnPrompt/cailun-skill -g",
    fallbackStars: 3,
  },
  {
    name: "afu-llm-todo",
    repo: "LearnPrompt/afu-llm-todo",
    tagline: "阿福：LLM 行动卡片规划台，合并同题、日历同步、今天该做什么一目了然。",
    taglineEn: "Afu: plan actions with LLM cards, combine related tasks, sync calendars, and see what to do today.",
    installCmd: "npx skills add LearnPrompt/afu-llm-todo",
    fallbackStars: 4,
  },
  {
    name: "carl-skills",
    repo: "LearnPrompt/carl-skills",
    tagline: "面向创作者的真实 AI 工作流合集，同门 skill 的总索引。",
    taglineEn: "A collection of real AI workflows for creators and a central index of related skills.",
    fallbackStars: 17,
  },
  {
    name: "carl-irasutoya-illustrations",
    repo: "LearnPrompt/carl-irasutoya-illustrations",
    tagline: "Irasutoya 风格正文配图库，写文章时插图即取即用。",
    taglineEn: "A ready-to-use collection of Irasutoya-style illustrations for articles.",
    fallbackStars: 1,
  },
];

export const archivedProjects: Project[] = [];
