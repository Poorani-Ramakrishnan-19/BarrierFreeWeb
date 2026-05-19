# BarrierFreeWeb

A Chrome browser extension that improves web accessibility by letting users customize any website's readability and usability — adjusting text size, spacing, contrast, fonts, cursor size, link highlighting, and more — all from a convenient floating widget.

---

## Table of Contents

- [Purpose](#purpose)
- [Features](#features)
- [Repository Structure](#repository-structure)
- [How It Works](#how-it-works)
- [Installation (Development)](#installation-development)
- [Technologies Used](#technologies-used)

---

## Purpose

BarrierFreeWeb aims to make the internet more accessible for users with different needs, including:

- Low vision
- Dyslexia
- Cognitive disabilities
- Light sensitivity
- Motion sensitivity
- Reading difficulties

The extension helps improve the browsing experience and encourages better alignment with accessibility standards such as WCAG (Web Content Accessibility Guidelines).

---

## Features

### Text & Reading Adjustments
- Increase or decrease text font size
- Adjust line height for improved readability
- Modify letter spacing
- Choose from accessible font families (Arial, Verdana, Georgia, Times New Roman, OpenDyslexic)

### Contrast & Color
- Invert page colors
- Apply dark mode (reduced brightness + higher contrast)
- Apply light mode (increased brightness + higher contrast)
- High contrast mode
- Custom contrast slider
- Desaturate (grayscale) the page

### Cursor Customization
- Default, large, and extra-large cursor sizes using inline SVG cursors

### Link Highlighting
- Toggle colored background highlights on all links to make them easier to identify

### Text Highlighting
- Highlight any selected text with a chosen color
- Clear all highlights at any time

---

## Repository Structure

```
BarrierFreeWeb/
├── manifest.json          # Chrome Extension Manifest V3 — defines metadata, permissions, and content scripts
├── content.js             # Entry point: initialises the floating widget once the page DOM is ready
├── content-widget.js      # Builds and manages the floating accessibility panel UI (HTML + CSS injected into every page)
├── content-utils.js       # Core utility functions: text settings, contrast effects, cursor, link/text highlights
├── style.css              # Base styles (used for the extension popup if one is added in future)
└── BarrierFreeWeb_Icon.png # Extension icon shown in the Chrome toolbar and the floating widget button
```

### File Descriptions

#### `manifest.json`
Declares the extension using Manifest V3. It requests the `activeTab` and `scripting` permissions (the `scripting` permission is declared for potential future use of `chrome.scripting.executeScript`) and registers three content scripts that are injected into **every** webpage the user visits:
1. `content-utils.js` (loaded first — utility functions)
2. `content-widget.js` (loaded second — widget UI builder)
3. `content.js` (loaded last — kicks everything off)

The extension icon (`BarrierFreeWeb_Icon.png`) is declared as a web-accessible resource so the content script can reference it via `chrome.runtime.getURL(...)`.

#### `content.js`
A small entry-point script. It checks whether the DOM is already interactive/complete and, if so, calls `createFloatingAccessWidget()` immediately. Otherwise it waits for `DOMContentLoaded`. This ensures the widget is injected reliably regardless of when the script runs.

#### `content-widget.js`
Contains the single function `createFloatingAccessWidget()`, which:
- Guards against double-initialisation (checks for an existing `#ba-access-widget` element).
- Injects a `<style>` block into `<head>` with all widget CSS (so widget styles are self-contained and don't leak into the page).
- Creates two DOM elements and appends them to `<body>`:
  - **`#ba-access-widget`** — a small circular floating button (bottom-right corner) with the extension icon. Clicking it opens/closes the panel.
  - **`#ba-widget-panel`** — a collapsible side panel with four sections:
    - **Text Dimensions** — sliders for font size, line height, and letter spacing.
    - **Typography** — dropdowns for font family and cursor size.
    - **Contrast & Color** — toggle buttons for each contrast mode plus a custom contrast slider and link/text highlighting.
    - **Highlight** — color buttons to highlight selected text, and a clear-highlights button.
- Wires up all event listeners: panel open/close toggle, collapsible section toggles, slider live-preview, and the Apply / Reset buttons.
- On **Apply**, reads current widget values and calls `applyTextSettings()` and the relevant contrast/cursor helpers from `content-utils.js`.
- On **Reset**, calls `applyTextSettings({ reset: true })` which restores all modified elements to their original styles.

#### `content-utils.js`
Provides all the low-level DOM manipulation functions used by the widget:

| Function | Description |
|---|---|
| `applyTextSettings(settings)` | Iterates over `p, span, div, li, article` elements (skipping widget elements) and applies `fontSize`, `lineHeight`, `letterSpacing`, and `fontFamily`. Also calls `setCursor()`. When `settings.reset` is true, restores all inline styles and clears highlights/contrast. |
| `applyContrastEffect(effect, enable)` | Manages a set of flags (`contrastEffects`) for each contrast mode and builds a combined CSS `filter` string that is applied via a CSS custom property (`--ba-contrast-filter`) on `document.body`. Widget and panel elements are excluded from the filter via a scoped CSS rule. |
| `setCustomContrast(value)` | Updates `customContrastValue` and re-applies the custom contrast filter if it is active. |
| `clearAllContrastEffects()` | Resets all contrast flags and removes the filter from `document.body`. |
| `setCursor(size)` | Injects a `<style>` tag with a custom SVG cursor for `large` or `xlarge` sizes, or removes the tag for the default cursor. |
| `toggleLinkHighlights(color)` | Adds/removes a colored background on all `<a>` elements (excluding those inside the widget). |
| `clearLinkHighlights()` | Removes the highlight class and background color from all highlighted links. |
| `highlightSelection(color)` | Wraps the current (or last saved) text selection in a `<span class="ba-text-highlight">` with the chosen background color. |
| `clearHighlights()` | Unwraps all `ba-text-highlight` spans, restoring the original text nodes. |
| `getActiveRange()` / `baLastSelectionRange` | Persists the user's last text selection so it can still be highlighted even after focus moves to the widget panel. |
| `isElementInWidget(el)` | Walks up the DOM to check whether an element belongs to the widget, preventing the extension from modifying its own UI. |
| `applyParentSafeStyles(el)` / `resetParentSafeStyles(el)` | Sets `overflow: visible` and `height: auto` on ancestor elements to prevent clipping when text size is increased, and restores them on reset. |

A `chrome.runtime.onMessage` listener is also registered so that other parts of the extension (e.g. a future popup) can send settings messages directly.

#### `style.css`
Base CSS for the extension's popup page (not currently wired to a popup HTML file, but ready for future use). It defines styles for sliders, dropdowns, buttons, and toggle controls matching the widget's blue (`#5a7cff`) color scheme.

---

## How It Works

```
User visits any webpage
        │
        ▼
Chrome injects content scripts (manifest.json content_scripts)
        │
        ├── content-utils.js  →  registers utility functions + chrome.runtime.onMessage listener
        ├── content-widget.js →  defines createFloatingAccessWidget()
        └── content.js        →  calls createFloatingAccessWidget() when DOM is ready
                                          │
                                          ▼
                             Floating button injected into page
                                          │
                              User clicks the button
                                          │
                                          ▼
                             Accessibility panel opens
                                          │
                         User adjusts settings and clicks Apply
                                          │
                                          ▼
                    content-utils.js modifies page DOM styles
                    (font size, contrast filters, cursor SVG, etc.)
```

Settings are **not persisted** across page navigations in the current version — each new page load starts fresh.

---

## Installation (Development)

1. Clone the repository:
   ```bash
   git clone https://github.com/Poorani-Ramakrishnan-19/BarrierFreeWeb
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer Mode** (toggle in the top-right corner)
4. Click **Load Unpacked**
5. Select the cloned project folder

The extension icon will appear in the Chrome toolbar, and a floating widget button will appear on every webpage you visit.

---

## Technologies Used

| Technology | Usage |
|---|---|
| JavaScript (ES6+) | All extension logic — DOM manipulation, event handling, CSS injection |
| HTML (injected) | Widget panel markup generated dynamically via `innerHTML` in `content-widget.js` |
| CSS (injected) | Widget styles injected as `<style>` tags; base styles in `style.css` |
| Chrome Extensions API (MV3) | `chrome.runtime.getURL`, `chrome.runtime.onMessage`, content scripts, manifest v3 |
