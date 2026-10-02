const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const math = require("remark-math");

async function createConfig() {
  const katex = (await import("rehype-katex")).default;
  return {
    title: "Learn Prompt: Your CookBook to Communicating with AI",
    tagline:
      "A Free, Open Source Course on Communicating with Artificial Intelligence",
    url: "https://v1.learnprompt.pro",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.ico",
    organizationName: "aiwarts",
    projectName: "promptgineering",
    deploymentBranch: "gh-pages",
    trailingSlash: true,
    i18n: {
      defaultLocale: "en",
      locales: [
        "en",
        "zh-Hans",
      ],
      localeConfigs: {
        "zh-Hans": {
          htmlLang: 'zh-Hans',
        },
        en: {
          htmlLang: 'en-GB',
        },
      },
    },
    scripts: [
      {
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7658394488756677',
        async: true,
        crossorigin: 'anonymous',
      },
      {
        src:
          "https://tag.clearbitscripts.com/v1/pk_5621ff511ea83a6ec015bee0a0b5dd79/tags.js",
        async: true,
      },
    ],
    plugins: [
      '@docusaurus/plugin-ideal-image',
      ['mindmap', {}],
      [
        "@docusaurus/plugin-client-redirects",
        {
          redirects: [
            {
              to: "/blog",
              from: "/daily",
            },
            {
              to: "/blog",
              from: "/article/Daily",
            },
            {
              to: "/project",
              from: "/aiMarket",
            },
          ],
        },
      ],
      async function myPlugin(context, options) {
        return {
          name: "docusaurus-tailwindcss",
          configurePostCss(postcssOptions) {
            postcssOptions.plugins.push(require("tailwindcss"));
            postcssOptions.plugins.push(require("autoprefixer"));
            return postcssOptions;
          },
        };
      },
      ["posthog-docusaurus", {
        apiKey: process.env.POSTHOG_API_KEY || "DEV",
        appUrl: "https://app.posthog.com", // optional
        enableInDevelopment: false, // optional
      }],
    ],

    presets: [
      [
        "classic",
        {
          sitemap: {
            changefreq: 'weekly',
            priority: 0.5,
            ignorePatterns: ['/tags/**'],
            filename: 'sitemap.xml',
          },
          gtag: {
            trackingID: "G-LV7H9L9JQ3",
          },
          googleAnalytics: {
            trackingID: "G-LV7H9L9JQ3",
          },
          blog: {
            showReadingTime: true,
            postsPerPage: 6,
          },
          docs: {
            admonitions: {
              tag: ":::",
              keywords: [
                "note",
                "tip",
                "info",
                "caution",
                "danger",
                "takeaways",
              ],
            },
            sidebarPath: require.resolve("./sidebars.js"),
            editUrl: "https://github.com/trigaten/promptgineering/tree/v1.2.3",
            remarkPlugins: [
              math,
              (await import("remark-gfm")).default,
              [
                (await import("@benchmark-urbanism/remark-bibtex")).default,
                { bibtexFile: "bibliography.bib" },
              ],
              [
                (await import("@renatonagliati/remark-auto-glossary")).default,
                { yamlFile: "glossary.yml" },
              ],
            ],
            rehypePlugins: [[katex, { strict: false }]],
            showLastUpdateAuthor: true,
            showLastUpdateTime: true,
          },
          theme: {
            customCss: require.resolve("./src/css/custom.css"),
          },
        },
      ],
    ],
    stylesheets: [
      {
        href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
        type: "text/css",
        integrity:
          "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
        crossorigin: "anonymous",
        defer: true,
      },
      {
        href: "https://fonts.googleapis.com",
        rel: "preconnect",
        async: true,
      },
      {
        href: "https://fonts.gstatic.com",
        rel: "preconnect",
        crossorigin: "",
        async: true,
      },
      {
        href:
          "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
        async: true,
      },
    ],
    headTags: [
      {
        tagName: "script",
        attributes: { type: "application/ld+json" },
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "LearnPrompt",
          url: "https://v1.learnprompt.pro/",
          logo: "https://v1.learnprompt.pro/img/logo.svg",
          sameAs: ["https://github.com/LearnPrompt/LearnPrompt"],
        }),
      },
    ],
    themeConfig: {
      image: "https://v1.learnprompt.pro/img/learnprompt-archive-social.jpg",
      metadata: [
        {
          name: "description",
          content: "LearnPrompt's archived open-source tutorials on prompt engineering, ChatGPT and AI tools. Explore the original course in English and Chinese.",
        },
        {
          name: "keywords",
          content: "LearnPrompt, prompt engineering, AI tutorials, ChatGPT, AI tools",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
      ],
      navbar: {
        title: "Learn Prompt",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "custom-myAwesomeNavbarItem",
            position: "left",
          },
          {
            type: "localeDropdown",
            position: "right",
          },
          { to: '/blog', label: '📰 What\'s Hot', position: 'right' },
          { to: '/friends', label: '👬 Friends', position: 'right'},
          {
            to: "/project",
            label: "🚀 AiStore",
            position: "right",
          },
          {
            href: "https://vip.learnprompt.pro/",
            label: "👑 VIP",
            position: "right",
          },
          // {
          //   href: "https://github.com/trigaten/Learn_Prompting/releases",
          //   label: "Change Log",
          //   position: "right",
          // },
        ],
      },
      announcementBar: {
        id: "announcement",
        content:
          '🌟 If you have any questions, feel free to join our <a href="https://discord.gg/zBsQyq7MHA">Discord</a> 🌟',
        backgroundColor: "#8f77b5",
        textColor: "#000",
        isCloseable: true,
      },
      footer: {
        style: "light",
        copyright: `Copyright © ${new Date().getFullYear()} Learn Prompt.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      giscus: {
        repo: 'LearnPrompt/LP',
        repoId: 'R_kgDOLq34xQ',
        category: 'Announcements',
        categoryId: 'DIC_kwDOLq34xc4CehDO',
        theme: 'light_high_contrast',
        darkTheme: 'dark_tritanopia',
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'K5331H6T58',
        // Public API key: it is safe to commit it
        apiKey: '98a5ad017e1b79a1d41af6f9507bd4e8',
        indexName: 'learnprompt',
        // Optional: see doc section below
        contextualSearch: true,
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: 'external\\.com|domain\\.com',
        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        replaceSearchResultPathname: {
          from: '/docs/', // or as RegExp: /\/docs\//
          to: '/',
        },
        // Optional: Algolia search parameters
        searchParameters: {},
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
        // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
        insights: false,
        //... other Algolia params
      },
    },
    clientModules: [require.resolve('./src/clientModules/routeModules.js')],
    markdown: {
      mermaid: true,
    },
    themes: ["@docusaurus/theme-mermaid"],
  };
}

module.exports = createConfig;