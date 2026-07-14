const DEFAULT_STATE = { latestCard: null, lastRun: null };
const statusNode = document.querySelector("#status");

const fieldNodes = {
  title: document.querySelector('[data-field="title"]'),
  url: document.querySelector('[data-field="url"]'),
  selectedText: document.querySelector('[data-field="selectedText"]'),
  capturedAt: document.querySelector('[data-field="capturedAt"]'),
};

function setStatus(message, tone = "") {
  statusNode.textContent = message;
  statusNode.classList.toggle("is-ok", tone === "ok");
  statusNode.classList.toggle("is-error", tone === "error");
}

function formatTime(isoString) {
  if (!isoString) return "暂无";

  try {
    return new Intl.DateTimeFormat("zh-CN", {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

function renderCard(card) {
  fieldNodes.title.textContent = card?.title || "暂无";
  fieldNodes.url.textContent = card?.url || "暂无";
  fieldNodes.selectedText.textContent =
    card?.selectedText || "这次没有选中文本。";
  fieldNodes.capturedAt.textContent = formatTime(card?.capturedAt);
}

async function readStoredState() {
  const stored = await chrome.storage.local.get(DEFAULT_STATE);
  renderCard(stored.latestCard);
  if (!stored.lastRun) {
    setStatus("尚未抓取，下面显示最近一次成功保存的结果。");
    return;
  }

  setStatus(
    stored.lastRun.message,
    stored.lastRun.ok ? "ok" : "error",
  );
}

readStoredState().catch((error) => {
  const message =
    error instanceof Error ? error.message : String(error ?? "未知错误");
  setStatus(`读取本地结果失败：${message}`, "error");
});
