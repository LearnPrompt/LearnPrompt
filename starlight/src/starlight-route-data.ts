import { defineRouteMiddleware, type StarlightRouteData } from "@astrojs/starlight/route-data";

// Keep Chinese-only guides available without presenting their Chinese titles
// as untranslated English navigation. The destination makes the language explicit.
const chineseGuides: Record<string, string> = {
  "agent-engineering/mac-workflow-storage-cleanup/": "Mac storage cleanup for AI workflows (Chinese)",
};

type SidebarEntry = StarlightRouteData["sidebar"][number];

export const onRequest = defineRouteMiddleware((context) => {
  const { lang, sidebar, pagination } = context.locals.starlightRoute;
  if (lang !== "en") return;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const localize = (entry: SidebarEntry) => {
    if (entry.type === "group") {
      entry.entries.forEach(localize);
      return;
    }
    const prefix = `${base}/en/`;
    if (!entry.href.startsWith(prefix)) return;
    const route = entry.href.slice(prefix.length);
    const label = chineseGuides[route];
    if (!label) return;
    entry.label = label;
    entry.href = `${base}/${route}`;
    entry.attrs.lang = "zh-CN";
  };
  sidebar.forEach(localize);
  if (pagination.prev) localize(pagination.prev);
  if (pagination.next) localize(pagination.next);
});
