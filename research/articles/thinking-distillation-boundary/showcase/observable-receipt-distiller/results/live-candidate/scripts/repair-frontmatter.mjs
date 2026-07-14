import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || !value) {
      fail("Usage: node scripts/repair-frontmatter.mjs --file <path>");
    }
    args[key.slice(2)] = value;
  }
  return args;
}

function extractFrontmatter(text) {
  if (!text.startsWith("---\n")) fail("file has no YAML frontmatter");
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) fail("frontmatter is not closed");
  return {
    raw: text.slice(4, end),
    body: text.slice(end + 5)
  };
}

function parseFrontmatter(raw) {
  const lines = raw.split("\n");
  const fields = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const fieldMatch = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!fieldMatch) {
      index += 1;
      continue;
    }

    const key = fieldMatch[1];
    const value = fieldMatch[2];

    if (key === "sidebar") {
      const nested = [];
      index += 1;
      while (index < lines.length && /^  /.test(lines[index])) {
        nested.push(lines[index]);
        index += 1;
      }
      fields.push({ key, value: null, nested });
      continue;
    }

    fields.push({ key, value, nested: [] });
    index += 1;
  }

  return fields;
}

function stripMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}

function getFirstH1(body) {
  const match = body.match(/^#\s+(.+?)\s*$/m);
  return match ? stripMarkdown(match[1]) : "";
}

function getOpeningSentence(body) {
  const lines = body.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("|") ||
      trimmed.startsWith(":::") ||
      trimmed.startsWith(">") ||
      trimmed.startsWith("*图注：")
    ) {
      continue;
    }
    return stripMarkdown(trimmed);
  }
  return "";
}

function isPositiveInteger(value) {
  return /^\d+$/.test(value) && Number(value) > 0;
}

function quoteIfNeeded(value) {
  if (/[:#]/.test(value)) {
    return `"${value.replaceAll('"', '\\"')}"`;
  }
  return value;
}

const args = parseArgs(process.argv.slice(2));
const filePath = path.resolve(args.file);
const original = readFileSync(filePath, "utf8");
const { raw, body } = extractFrontmatter(original);
const fields = parseFrontmatter(raw);

const fieldMap = new Map(fields.map((field) => [field.key, field]));
const h1Title = getFirstH1(body);
const openingSentence = getOpeningSentence(body);

if (!h1Title) fail("cannot repair title without a first H1");
if (!openingSentence) fail("cannot repair description without an opening paragraph sentence");

const titleField = fieldMap.get("title");
const descriptionField = fieldMap.get("description");
const sidebarField = fieldMap.get("sidebar");

const currentTitle = titleField?.value?.trim() ?? "";
const currentDescription = descriptionField?.value?.trim() ?? "";
const currentSidebarOrder =
  sidebarField?.nested
    .map((line) => line.match(/^  order:\s*(.+)$/)?.[1] ?? "")
    .find(Boolean) ?? "";

const nextTitle = currentTitle || h1Title;
const nextDescription = currentDescription || openingSentence;
const nextSidebarOrder = isPositiveInteger(currentSidebarOrder)
  ? currentSidebarOrder
  : "999";

const changed =
  nextTitle !== currentTitle ||
  nextDescription !== currentDescription ||
  nextSidebarOrder !== currentSidebarOrder;

if (!changed) {
  process.stdout.write(
    `${JSON.stringify({ file: args.file, changed: false, title: nextTitle, description: nextDescription, sidebar_order: Number(nextSidebarOrder) })}\n`
  );
  process.exit(0);
}

const orderedKeys = ["title", "description", "sidebar"];
const remainder = fields.filter((field) => !orderedKeys.includes(field.key));
const rendered = [
  "---",
  `title: ${quoteIfNeeded(nextTitle)}`,
  `description: ${quoteIfNeeded(nextDescription)}`,
  "sidebar:",
  `  order: ${nextSidebarOrder}`,
  ...remainder.map((field) =>
    field.nested.length === 0
      ? `${field.key}: ${field.value}`
      : [`${field.key}:`, ...field.nested].join("\n")
  ),
  "---",
  body
].join("\n");

writeFileSync(filePath, `${rendered.replace(/\n*$/, "\n")}`);
process.stdout.write(
  `${JSON.stringify({ file: args.file, changed: true, title: nextTitle, description: nextDescription, sidebar_order: Number(nextSidebarOrder) })}\n`
);
