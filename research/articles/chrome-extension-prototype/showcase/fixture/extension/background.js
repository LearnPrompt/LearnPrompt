const DEFAULT_STATE = {
  latestCard: null,
  lastRun: null,
};

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.local.get(DEFAULT_STATE);
  if (
    !Object.prototype.hasOwnProperty.call(stored, "latestCard") ||
    !Object.prototype.hasOwnProperty.call(stored, "lastRun")
  ) {
    await chrome.storage.local.set(DEFAULT_STATE);
  }
});

async function captureActiveTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  if (!tab?.id) {
    await chrome.storage.local.set({
      lastRun: {
        ok: false,
        message: "抓取失败：当前没有可抓取的活动标签页。",
        attemptedAt: new Date().toISOString(),
      },
    });
    return;
  }

  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const selectedText = window.getSelection()?.toString()?.trim() ?? "";
        return {
          title: document.title,
          url: window.location.href,
          selectedText,
          capturedAt: new Date().toISOString(),
        };
      },
    });

    await chrome.storage.local.set({
      latestCard: result,
      lastRun: {
        ok: true,
        message: "已保存最近一次阅读卡。",
        attemptedAt: result.capturedAt,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error ?? "未知错误");
    await chrome.storage.local.set({
      lastRun: {
        ok: false,
        message: `抓取失败：${message}`,
        attemptedAt: new Date().toISOString(),
      },
    });
  }
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "capture-reading-card") {
    void captureActiveTab();
  }
});
