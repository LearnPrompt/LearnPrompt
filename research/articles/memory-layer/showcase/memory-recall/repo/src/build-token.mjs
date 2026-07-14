// build-token.mjs
// 任务对象：读取生成物 data/fixture.json，校验其中的 token。
// 非显然的坑：data/fixture.json 是 setup 阶段生成的产物，不入库（见 .gitignore），
// 全新克隆或全新进程里默认不存在。直接跑校验会失败，且报错本身就是那条值得记住的教训。
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const fixture = join(here, "..", "data", "fixture.json");
const EXPECTED = "ready-2026";

try {
  const raw = await readFile(fixture, "utf8");
  const token = JSON.parse(raw).token;
  if (token === EXPECTED) {
    console.log(`PASS build-token：fixture.json 就位，token=${token}`);
    process.exit(0);
  }
  console.log(`FAIL build-token：token 不匹配，期望 ${EXPECTED}，实际 ${token}`);
  process.exit(1);
} catch (err) {
  if (err.code === "ENOENT") {
    console.log(
      "FAIL build-token：缺少 data/fixture.json —— 该文件由 setup 生成、不入库（.gitignore），全新进程默认不存在；必须先运行 node src/setup.mjs"
    );
    process.exit(1);
  }
  console.log(`FAIL build-token：${err.message}`);
  process.exit(1);
}
