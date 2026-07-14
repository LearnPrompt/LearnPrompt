import { cx } from "./cx";

const tokens = {
  brandPrimary: "var(--brand-primary)",
  onBrand: "var(--text-on-brand)",
};

export function Button() {
  return (
    <button
      className={cx("btn", "btn-primary")}
      style={{ backgroundColor: tokens.brandPrimary, color: tokens.onBrand }}
    >
      Save
    </button>
  );
}
