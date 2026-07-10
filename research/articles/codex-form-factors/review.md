# 独立评审记录

## Reviewer 与隔离方式

- Reviewer：OpenAI Codex `gpt-5.4`，与 Claude writer 不同模型和全新会话。
- 模式：`read-only` sandbox、`approval=never`、ephemeral、忽略用户配置；只读正文、研究包、Showcase、量表和 article contract。
- Writer 未参与打分，reviewer 未编辑文件。

## 初审

- 日期：2026-07-11
- 结论：**FAIL**
- Finding：blocker 2 / major 3 / minor 1

### Blocker

1. Chrome extension / ChatGPT web / desktop app 的关系写反。官方仍单列 Chrome extension，并把 web 与 desktop app 列为不同 surface。
2. Showcase 原始日志含 session、thread、turn、item 等运行标识，违反 research contract。

### Major

1. “同一套模型、同一个账号、共享同一份 config.toml”把不同边界说成一个确定事实。
2. Windows PowerShell / WSL2 只靠搜索摘要就进入正文，证据链未闭合。
3. Showcase 只实测本地 CLI 和 Cloud 前置条件，却外推成四个执行面的现场能力证明。

### Minor

1. 底部来源列表没有逐项标注官方文档与二手主题地图。

### 初审六维评分

| 维度 | 得分 |
| --- | ---: |
| 事实与证据 | 9/25 |
| 解释深度 | 15/20 |
| Showcase | 11/20 |
| 教学设计 | 13/15 |
| 时效性 | 5/10 |
| 编辑质量 | 8/10 |
| 合计 | **61/100** |

## 修复记录

1. 用当前官方文档重写产品层级：Chrome extension 仍存在，是桌面 App Plugins 中用于已登录浏览器状态的能力；ChatGPT web 是单独 surface，本文把它作为 Cloud 的发起与审查界面说明。
2. 将配置共享限定为官方明确支持的本地 agent surface：桌面 App 中的 Codex agent、IDE extension 与 CLI；明确 ChatGPT web Work 不读取本地 `config.toml`，Cloud environment 单独配置。
3. 直接核对 Windows desktop app 与 WSL 官方页面，补齐 PowerShell / Windows sandbox / WSL2 一手证据。
4. 缩窄学习目标和 Showcase 结论：只声称实测 CLI sandbox、一次未隔离 review 的失败与当前 workspace 的 Cloud environment 前置检查；IDE、桌面 App 和 Chrome extension 标为“仅官方文档，未现场实测”。
5. 将 Card 2 改为失败任务卡：记录继承 `danger-full-access`、读取范围扩大、未产出预期结论；退出码 0 不再被当成评审成功。
6. 删除三份原始运行日志，改存脱敏证据摘录；移除本机绝对路径和 session / thread / turn / item / request 标识。
7. 删除与本文中心无关的本机默认模型配置记录。
8. 底部来源逐项标注“官方文档”或“中文二手主题地图”，保留橙皮书 CC BY-NC-SA 4.0。

## Follow-up review

- Follow-up 1：全新 Codex `gpt-5.4` 只读会话，blocker 0 / major 0 / minor 1，95/100，**FAIL**。
- 新发现：正文把 Card 2 单次继承到的 `danger-full-access` 写成 CLI 的通用“默认值”，证据不足。
- 修复：改为“显式选择并核对实际模式，不能假设继承到的权限配置已经安全”，不再外推通用默认值。
- Follow-up 2：第三个全新 Codex `gpt-5.4` 只读会话，blocker 0 / major 0 / minor 0，93/100，**PASS**。
- Follow-up 2 六维评分：事实与证据 24/25、解释深度 18/20、Showcase 18/20、教学设计 14/15、时效性 10/10、编辑质量 9/10。
- 放行条件：blocker=0、major=0、minor=0、总分至少 85，validator 与完整 Starlight build 均通过。
- 未关闭问题：0
- 最终状态：PASS。允许正文写入 `showcase_status: verified` 与 `quality_score: 93`；仍需控制面完成最终 validator、完整构建和 diff 检查。
