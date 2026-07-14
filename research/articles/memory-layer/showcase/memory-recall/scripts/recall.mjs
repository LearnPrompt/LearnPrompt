// recall.mjs —— 召回闸门：按相关性与时效从记忆库取出可用教训。
// 用法：node scripts/recall.mjs <task-tag> [--today YYYY-MM-DD] [--store DIR]
//
// 它模型化 auto memory 的两条纪律：
//  1) 相关性门控：只返回 trigger 命中当前 task-tag 的条目，不是把整库倒进上下文。
//  2) 时效淘汰：超过 expires 的条目直接过滤掉，不再注入（过期即淘汰）。
// 它是记忆读取机制的最小可复现模型，不是任何产品本身。
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const tag = args.find((a) => !a.startsWith("--"));
const today = valueOf("--today") ?? "2026-07-11";
const storeDir = valueOf("--store") ?? join(here, "..", "memory-store", "lessons");

function valueOf(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let [, k, v] = kv;
    v = v.trim().replace(/^"(.*)"$/, "$1");
    if (v.startsWith("[") && v.endsWith("]")) {
      v = v.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
    }
    fm[k] = v;
  }
  return fm;
}

const files = (await readdir(storeDir)).filter((f) => f.endsWith(".md"));
const recalled = [];
const evicted = [];
for (const f of files) {
  const fm = parseFrontmatter(await readFile(join(storeDir, f), "utf8"));
  const triggers = Array.isArray(fm.trigger) ? fm.trigger : [fm.trigger].filter(Boolean);
  const relevant = tag ? triggers.includes(tag) : true;
  const expired = fm.expires && fm.expires !== "never" && fm.expires < today;
  if (!relevant) continue;
  if (expired) {
    evicted.push({ name: fm.name, expires: fm.expires });
    continue;
  }
  recalled.push({ name: fm.name, kind: fm.kind });
}

console.log(`recall tag=${tag ?? "(all)"} today=${today}`);
for (const r of recalled) console.log(`RECALL ${r.name} [${r.kind}]`);
for (const e of evicted) console.log(`EVICT  ${e.name} — 已过期（expires ${e.expires} < ${today}），不注入`);
console.log(`summary: ${recalled.length} recalled, ${evicted.length} evicted`);
process.exit(recalled.length > 0 ? 0 : 3);
