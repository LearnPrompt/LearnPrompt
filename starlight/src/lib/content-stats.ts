import { getCollection } from "astro:content";

// Count tutorials, excluding path overview pages and the source directory.
export async function countGuides(locale: "" | "en", directory = "") {
  const entries = await getCollection("docs");
  return entries.filter((entry) => {
    const file = (entry.filePath || "").replaceAll("\\", "/").split("src/content/docs/")[1];
    if (!file || file.startsWith("en/") !== (locale === "en")) return false;
    const localFile = locale ? file.slice(3) : file;
    return (!directory || localFile.startsWith(`${directory}/`)) &&
      !localFile.startsWith("sources/") &&
      !/(?:^|\/)index\.(?:md|mdx)$/.test(localFile);
  }).length;
}
