# Control verification

核验日期：2026-07-12。Showcase、独立终审、verified validator、49 页构建、privacy scan 与 diff check 均已通过；正文为 `showcase_status: verified`、`quality_score: 94`。

## 真实 lane 状态

- Claude health：两次探针都没有 model result，只保留脱敏 outer-harness summary；没有伪造 diagnosis receipt。
- writer 内嵌 Codex preflight：宿主 runtime 初始化失败，未进入模型完成阶段，fixture 保持干净。
- 外层 Codex implementation：`codex-cli 0.142.2` / `gpt-5.5` / `workspace-write` / approval `never`，真实成功。
- 外层 run 只修改 `src/archiveIncident.js`；结构化 receipt 的 baseline SHA、contract SHA 与 changed files 均匹配冻结 contract；`npm test` 为 2/2。
- 当前流程状态：`degraded_single_lane`，不是 `dual_track_complete`。

## 机械门禁结果

- Showcase replay：PASS。
  - `degraded_single_lane`：exit `0`
  - 缺 Claude diagnosis 却声明双线完成：exit `30`
  - 写集越界 `README.md`：exit `31`
  - contract SHA drift：exit `32`
  - privacy scan：exit `0`
  - 第三次离线 replay：冻结结果与前一次一致
- 单篇 partial validator：PASS，exit `0`。
- Starlight 完整构建：PASS，49 pages，exit `0`。
- `git diff --check`：PASS，exit `0`。
- 1400×900 SVG：Chrome headless 实际渲染后检查，标题、两条 lane 与三张负例卡均无越框。

## 独立终审

- 独立只读 Codex Spark reviewer：PASS 94/100。
- 未关闭问题：blocker 0 / major 0 / minor 0。
- Visual assessment：PASS；教学作用、非装饰性与 CC BY-NC-SA 4.0 权利声明均确认。
- reviewer 原始输出保存在工作树外，writer 未参与评分或 verdict。
