// 遵循可执行指令：目标格式 YYYY-MM-DD，纯函数，用 UTC 避免时区漂移。
export function formatDate(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
