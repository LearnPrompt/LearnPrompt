// setup.mjs
// 生成校验所需的 fixture 产物。这一步是那条教训要求的前置动作。
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "..", "data");
await mkdir(dataDir, { recursive: true });
await writeFile(join(dataDir, "fixture.json"), JSON.stringify({ token: "ready-2026" }) + "\n");
console.log("setup：已生成 data/fixture.json");
