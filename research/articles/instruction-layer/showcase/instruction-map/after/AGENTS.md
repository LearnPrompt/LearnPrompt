# format-date 任务地图

## 目标
让 `formatDate(date)` 返回机器可解析的日历日期，格式固定为 `YYYY-MM-DD`。

## 范围
只允许修改 `src/format-date.mjs`。不要改测试、不要改其他文件。

## 顺序
1. 先读 `test/format-date.test.mjs`，它是验收标准的唯一来源。
2. 再实现 `src/format-date.mjs`，保持纯函数、用 UTC 取值。
3. 最后运行验收命令。

## 验收
运行 `node --test` ，三条用例必须全部通过才算完成。

## 冲突优先级
当“让日期更好读”这类人类可读诉求与测试规定的机器格式冲突时，以测试规定为准。
安全与范围约束高于一切风格偏好。
