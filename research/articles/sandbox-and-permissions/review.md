# 独立审稿记录：sandbox-and-permissions

## 评审元数据

- Reviewer：Codex GPT-5.4，独立只读初审与 follow-up 会话。
- 只读模式：reviewer 使用 read-only sandbox，只检查正文、研究包、Showcase、教学图和冻结门禁工件。
- 隔离声明：reviewer 使用独立只读会话；writer 未参与打分或修改评审结果。
- 原始评审输出在工作树外采集；进程退出后才把脱敏结论写入本文件。
- 评审对象：`starlight/src/content/docs/codex/sandbox-and-permissions.mdx`、完整研究包、`docs-link-fix` Showcase 与教学图。

## 评审链与修正

首轮终审确认三次 permission-profile probe、49 页构建与教学图有效，但要求补齐 checksum 证据、一键 runner 与 managed 例外。follow-up 又发现随机 fixture 会让冻结输出漂移，并要求去掉 stdout 绝对路径。writer 改成确定性 runner、增加 `checksum-manifest.md` 与 `replay-stability.txt` 后，第三轮 reviewer 继续发现固定 marker key/value 被回写进 committed 摘要。

最终回修把 `.env` 测试标记改为由固定非敏感种子在运行时派生；最终 key/value 只存在于一次性 lab/raw capture。committed 研究包只保留 checksum、退出码与 `fixture_marker_in_logs=no` 等布尔证据。新的独立只读 reviewer 逐项确认 finding 已关闭。

## 独立复审结论

终审结论：PASS 98/100

未关闭问题：blocker 0 / major 0 / minor 0

- 事实与证据：25/25。官方文档、本机 0.142.2 help、三次真实 sandbox probe、checksum 与跨次稳定性证据构成闭环。
- 解释深度：20/20。正文清楚拆开 task risk、permission profile、approval policy、rules 与 OS 边界，并说明 managed 例外与不实跑 full access 的理由。
- Showcase：20/20。`docs-link-fix` 同时证明工作区内 allow、越界 deny 与 `.env` deny；runner、verifier、manifest、replay 和 release gate 可机械互证。
- 教学设计：14/15。学习目标、递进 probe、练习和教学图完整；验收项嵌入 Showcase，而非另设独立清单。
- 时效性：10/10。命令、参数与 Beta 边界按 2026-07-11 官方资料和本机 CLI 核对。
- 编辑质量：9/10。结构可扫读，无公开 SourceCard，底部来源与 Orange Book 许可完整；中段信息密度略高。

## 最终视觉评估：PASS

Visual assessment: PASS
Asset: /images/articles/sandbox-and-permissions/decision-chain.svg
Teaching role: 展示任务风险、permission profile、approval policy 到 allow/deny 结果的四段决策链。
Decorative-only: no
Rights: CC BY-NC-SA 4.0
Issues: none

最终状态：PASS
