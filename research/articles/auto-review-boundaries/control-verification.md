# Control verification

核验日期：2026-07-11。以下记录由当前 writer 会话实际执行；raw JSONL、stderr、临时 repo 与失败审稿日志先写在工作树外，本文件只保留脱敏后的最小结论。

## Showcase 与 deterministic gate

- `refund-window-review` 的 staged JS diff 已在工作树外隔离 Git repo 中真实复现；基线测试 3/3 通过，但 future timestamp 行为复现显示：
  - `future_refund=true`
  - `now=2026-07-11T00:00:00.000Z`
  - `deliveredAt=2026-08-01T00:00:00.000Z`
- 本机真实 `codex exec` 结构化审查使用：
  - `codex-cli 0.142.2`
  - `gpt-5.5`
  - `-a never`
  - `--sandbox read-only`
  - `--ephemeral`
  - `--ignore-user-config`
  - `--ignore-rules`
  - `--json`
  - `--output-schema`
  - `--output-last-message`
- 冻结 finding 见 `showcase/refund-window-review/results/real-finding.json`：
  - `severity=P1`
  - `file=src/refundPolicy.js`
  - `line=15`
  - finding 明确指出 future timestamp / negative elapsed 漏洞，并给出复现时间戳。
- deterministic gate：
  - good gate：PASS，见 `showcase/refund-window-review/results/good-gate.txt`
  - fabricated out-of-diff finding：稳定以 exit 3 失败，见 `showcase/refund-window-review/results/bad-gate.txt`
  - 离线 replay：PASS，`node research/articles/auto-review-boundaries/showcase/refund-window-review/scripts/replay-showcase.mjs` 不再调用模型
- 隐私与脱敏：
  - committed artifacts 未保留真实 item id、thread id、绝对 shell path、临时 repo 路径或 credential-like 内容
  - 研究包只冻结 `real-finding.json`、gate 输出、行为复现与 summary；raw reviewer artifacts 保持在工作树外

## 深度与结构门禁

- `body_chars=16374`
- `cn_explanatory_chars=4959`
- `h2_count=14`
- partial validator：PASS

## 站点与 diff 门禁

- `cd starlight && npm run build`：PASS
- Starlight / Pagefind：49 页生成，目标路由 `/codex/auto-review-boundaries/` 已产出
- staged diff check（临时 index，不污染真实 index）：PASS

## 独立 reviewer 状态

- 已真实发起单独只读 `codex exec` 审稿尝试，并按要求把输出写到工作树外。
- 第二次尝试明确被 usage limit 阻断，错误信息要求等到 2026-07-12 00:36 后再重试。
- 因此当前 writer 交付保持 `showcase_status: partial`，不写 `quality_score`，最终 release review verdict 仍待独立 reviewer。
- 主协调会话随后完成一次与 writer 分离的只读预审，发现教学图 Step 4 最后一行越框且字号偏小；finding 已冻结在工作树外。协调阶段只按该 finding 提高字号、缩短标签并拆行，1400×900 SVG 重新渲染后无越框。该预审不替代配额恢复后的最终独立 reviewer。
- 新的 Codex Spark 独立只读 follow-up 已完成终审，确认视觉、两类 review surface、Showcase、隐私与许可均无剩余 finding；最终 `showcase_status: verified`、`quality_score: 100`。
