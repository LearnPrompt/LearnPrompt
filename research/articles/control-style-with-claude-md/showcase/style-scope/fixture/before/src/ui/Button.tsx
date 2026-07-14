import { cx } from "./cx";

export function Button() {
  return (
    <button
      className={cx("btn", "btn-primary")}
      style={{ backgroundColor: "#7c3aed", color: "#ffffff" }}
    >
      Save
    </button>
  );
}
