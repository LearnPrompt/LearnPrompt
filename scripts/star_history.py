#!/usr/bin/env python3
"""Self-hosted Star History chart generator.

Fetches stargazer timestamps for a set of repos via the GitHub API and
renders a cumulative-stars-over-time line chart as a hand-written SVG.

Usage:
    GITHUB_TOKEN=$(gh auth token) python3 scripts/star_history.py

Only the Python standard library is used.
"""

import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone

REPOS = [
    "LearnPrompt/LearnPrompt",
    "LearnPrompt/ai-news-radar",
    "LearnPrompt/luban-skill",
    "LearnPrompt/humanize-ppt",
]

COLORS = ["#1B365D", "#b4533a", "#147968", "#a67413"]

OUTPUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                      "assets", "star-history.svg")

API = "https://api.github.com"
PER_PAGE = 100
MAX_PAGES = 400  # GitHub stargazers pagination hard limit
RETRIES = 3

FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

WIDTH, HEIGHT = 900, 420
MARGIN_LEFT, MARGIN_RIGHT = 60, 220
MARGIN_TOP, MARGIN_BOTTOM = 30, 50


def http_get(url, token):
    req = urllib.request.Request(url, headers={
        "Accept": "application/vnd.github.star+json",
        "User-Agent": "star-history-script",
        "X-GitHub-Api-Version": "2022-11-28",
        **({"Authorization": f"Bearer {token}"} if token else {}),
    })
    last_err = None
    for attempt in range(1, RETRIES + 1):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
            last_err = e
            if isinstance(e, urllib.error.HTTPError) and e.code in (403, 429):
                # rate limited: brief backoff
                time.sleep(5 * attempt)
            elif isinstance(e, urllib.error.HTTPError) and 400 <= e.code < 500 and e.code != 404:
                time.sleep(2 * attempt)
            elif isinstance(e, urllib.error.HTTPError) and e.code == 404:
                raise
            else:
                time.sleep(2 * attempt)
    raise last_err


def fetch_stars(repo, token):
    """Return sorted list of starred_at datetimes for a repo.

    Falls back to unauthenticated requests on 403: the Actions-provided
    GITHUB_TOKEN is scoped to the current repository only, but all target
    repos are public.
    """
    dates = []
    page = 1
    while page <= MAX_PAGES:
        url = f"{API}/repos/{repo}/stargazers?per_page={PER_PAGE}&page={page}"
        try:
            batch = http_get(url, token)
        except urllib.error.HTTPError as e:
            if e.code == 403 and token:
                print(f"warning: 403 with token for {repo}, retrying "
                      f"unauthenticated", file=sys.stderr)
                token = None
                continue
            raise
        if not isinstance(batch, list) or not batch:
            break
        for item in batch:
            ts = item.get("starred_at")
            if ts:
                dates.append(datetime.strptime(ts, "%Y-%m-%dT%H:%M:%SZ")
                             .replace(tzinfo=timezone.utc))
        if len(batch) < PER_PAGE:
            break
        page += 1
    dates.sort()
    return dates


def month_key(dt):
    return dt.year * 12 + (dt.month - 1)


def key_to_label(key):
    return f"{key // 12}-{key % 12 + 1:02d}"


def build_series(dates):
    """Aggregate to cumulative count at end of each month.

    Returns list of (month_key, cumulative_count).
    """
    if not dates:
        return []
    counts = {}
    for d in dates:
        k = month_key(d)
        counts[k] = counts.get(k, 0) + 1
    first, last = min(counts), max(counts)
    now_key = month_key(datetime.now(timezone.utc))
    last = max(last, now_key)
    series = []
    total = 0
    for k in range(first, last + 1):
        total += counts.get(k, 0)
        series.append((k, total))
    return series


def render_svg(all_series):
    """all_series: list of (repo, color, series) where series is [(key, count)]."""
    plot_w = WIDTH - MARGIN_LEFT - MARGIN_RIGHT
    plot_h = HEIGHT - MARGIN_TOP - MARGIN_BOTTOM

    min_key = min(s[0][0] for _, _, s in all_series)
    max_key = max(s[-1][0] for _, _, s in all_series)
    max_val = max(s[-1][1] for _, _, s in all_series)
    key_span = max(max_key - min_key, 1)

    # y-axis: round max up to a nice number
    def nice_ceiling(v):
        if v <= 10:
            return 10
        mag = 10 ** (len(str(v)) - 1)
        for mult in (1, 2, 2.5, 5, 10):
            if v <= mag * mult:
                return int(mag * mult)
        return v
    y_max = nice_ceiling(max_val)

    def x(key):
        return MARGIN_LEFT + (key - min_key) / key_span * plot_w

    def y(val):
        return MARGIN_TOP + plot_h - (val / y_max) * plot_h

    parts = []
    parts.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" '
        f'viewBox="0 0 {WIDTH} {HEIGHT}">')
    parts.append(f'<rect width="{WIDTH}" height="{HEIGHT}" fill="#fbfaf7"/>')

    # y-axis gridlines + labels (5 divisions)
    for i in range(6):
        val = y_max * i // 5
        yy = y(val)
        parts.append(
            f'<line x1="{MARGIN_LEFT}" y1="{yy:.1f}" x2="{MARGIN_LEFT + plot_w}" '
            f'y2="{yy:.1f}" stroke="#e3e0d8" stroke-width="1"/>')
        parts.append(
            f'<text x="{MARGIN_LEFT - 8}" y="{yy + 4:.1f}" text-anchor="end" '
            f'font-family="{FONT}" font-size="11" fill="#6b675e">{val}</text>')

    # x-axis ticks: pick ~6 evenly spaced month keys
    n_ticks = min(6, key_span + 1)
    tick_keys = sorted({min_key + round(i * key_span / (n_ticks - 1)) for i in range(n_ticks)}) \
        if n_ticks > 1 else [min_key]
    axis_y = MARGIN_TOP + plot_h
    for k in tick_keys:
        xx = x(k)
        parts.append(
            f'<line x1="{xx:.1f}" y1="{axis_y}" x2="{xx:.1f}" y2="{axis_y + 5}" '
            f'stroke="#6b675e" stroke-width="1"/>')
        parts.append(
            f'<text x="{xx:.1f}" y="{axis_y + 20}" text-anchor="middle" '
            f'font-family="{FONT}" font-size="11" fill="#6b675e">{key_to_label(k)}</text>')

    # axes
    parts.append(
        f'<line x1="{MARGIN_LEFT}" y1="{MARGIN_TOP}" x2="{MARGIN_LEFT}" '
        f'y2="{axis_y}" stroke="#6b675e" stroke-width="1"/>')
    parts.append(
        f'<line x1="{MARGIN_LEFT}" y1="{axis_y}" x2="{MARGIN_LEFT + plot_w}" '
        f'y2="{axis_y}" stroke="#6b675e" stroke-width="1"/>')

    # lines + end labels
    label_slots = []
    for repo, color, series in all_series:
        pts = " ".join(f"{x(k):.1f},{y(v):.1f}" for k, v in series)
        parts.append(
            f'<polyline points="{pts}" fill="none" stroke="{color}" '
            f'stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>')
        end_y = y(series[-1][1])
        label_slots.append([end_y, repo.split("/")[-1], series[-1][1], color])

    # de-overlap end labels (min 16px apart)
    label_slots.sort(key=lambda s: s[0])
    for i in range(1, len(label_slots)):
        if label_slots[i][0] - label_slots[i - 1][0] < 16:
            label_slots[i][0] = label_slots[i - 1][0] + 16
    label_x = MARGIN_LEFT + plot_w + 10
    for ly, name, count, color in label_slots:
        parts.append(
            f'<text x="{label_x}" y="{ly + 4:.1f}" font-family="{FONT}" '
            f'font-size="12" fill="{color}">{name} ({count})</text>')

    # title
    parts.append(
        f'<text x="{MARGIN_LEFT}" y="{MARGIN_TOP - 10}" font-family="{FONT}" '
        f'font-size="13" font-weight="600" fill="#3b382f">Star History</text>')

    parts.append("</svg>")
    return "\n".join(parts) + "\n"


def main():
    token = os.environ.get("GITHUB_TOKEN", "")
    if not token:
        print("warning: GITHUB_TOKEN not set, using unauthenticated requests "
              "(low rate limit)", file=sys.stderr)

    all_series = []
    for repo, color in zip(REPOS, COLORS):
        try:
            dates = fetch_stars(repo, token)
        except Exception as e:
            print(f"warning: failed to fetch stargazers for {repo}: {e}",
                  file=sys.stderr)
            continue
        series = build_series(dates)
        if not series:
            print(f"warning: no stargazer data for {repo}, skipping",
                  file=sys.stderr)
            continue
        all_series.append((repo, color, series))
        print(f"{repo}: {series[-1][1]} stars across {len(series)} months",
              file=sys.stderr)

    if not all_series:
        print("error: no data for any repo", file=sys.stderr)
        sys.exit(1)

    svg = render_svg(all_series)
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"wrote {OUTPUT} ({len(svg)} bytes)", file=sys.stderr)


if __name__ == "__main__":
    main()
