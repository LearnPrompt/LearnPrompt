---
name: mirror-slow-on-0711
scope: this-repo
trigger: [build-token, verify, fixture]
verified_at: "2026-07-11"
expires: "2026-07-12"
kind: one-time-state
---

事实：2026-07-11 这天，内网镜像临时抽风，setup 偶发慢。

为什么标注过期：这是某一天的一次性环境状态，不是长期项目事实。把它当永久记忆保存，就是污染——下一次进程会据此做出已经不成立的判断。

怎么用：过了 expires（2026-07-12）后，召回闸门必须把它淘汰，不再注入。它留在这里只是为了演示过期淘汰，正文说明其反面示范意义。
