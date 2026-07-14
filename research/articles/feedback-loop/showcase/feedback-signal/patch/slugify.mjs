// 任务对象：把标题转成 URL slug。
// 当前保存为“失败”状态：漏掉了小写化这一步。
export function slugify(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");
}
