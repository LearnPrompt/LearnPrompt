// splitEvenly(totalCents, people): 把账单按人数拆成整数分，返回长度为 people 的数组。
// 约束：每个人金额尽量接近；数组之和必须严格等于 totalCents（不能凭空多出或丢失分）。
export function splitEvenly(totalCents, people) {
  if (!Number.isInteger(totalCents) || totalCents < 0) {
    throw new Error("totalCents 必须是非负整数分");
  }
  if (!Number.isInteger(people) || people <= 0) {
    throw new Error("people 必须是正整数");
  }
  // 切片二：向下取整做基数，再把余数逐分补给前 remainder 个人，保证求和守恒。
  const base = Math.floor(totalCents / people);
  const remainder = totalCents - base * people;
  return Array.from({ length: people }, (_, i) => (i < remainder ? base + 1 : base));
}
