// 只按“让日期更好读”这一条模糊指令实现：人类可读，但不是机器格式。
export function formatDate(date) {
  return date.toUTCString().slice(0, 16); // e.g. "Sat, 11 Jul 2026"
}
