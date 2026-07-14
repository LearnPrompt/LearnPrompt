---
name: link-to-obsidian
description: Save a shared web link as a clean Obsidian note. Use when the user gives a URL and asks to save, clip, or archive it into their Obsidian vault as a markdown note with title, source, and summary.
---

# Link to Obsidian

## When to use

Use when the user provides one URL and asks to store it in Obsidian as a note.

## Inputs

- One source URL.
- Optional vault subfolder (default: `Inbox`).

## Workflow

1. Fetch the page and extract title, author, and main text.
2. Write a 3-sentence summary.
3. Create `<subfolder>/<slug>.md` with frontmatter: title, url, saved date.
4. Append the summary and up to five key points.
5. Report the created note path.

## Verification

- The note file exists under the chosen subfolder.
- Frontmatter contains the original url and a saved date.
- The summary is grounded in the fetched page, not invented.

## Safety

- Do not fetch authenticated or paywalled pages without permission.
- Do not overwrite an existing note; suffix the slug instead.
