function applyParentSafeStyles(el) {
    let parent = el.parentElement;
    while (parent && parent !== document.body) {
        parent.style.overflow = 'visible';
        parent.style.minHeight = 'unset';
        parent.style.height = 'auto';
        parent = parent.parentElement;
    }
}

function resetParentSafeStyles(el) {
    let parent = el.parentElement;
    while (parent && parent !== document.body) {
        parent.style.overflow = '';
        parent.style.minHeight = '';
        parent.style.height = '';
        parent = parent.parentElement;
    }
}

function setCursor(size) {
    let styleTag = document.getElementById('ba-cursor-style');
    if (styleTag) styleTag.remove();
    if (!size || size === 'default') return;

    styleTag = document.createElement('style');
    styleTag.id = 'ba-cursor-style';
    let css = '';

    if (size === 'large') {
        css = `*, *:hover, a, a:hover, button, button:hover, input, input:hover, textarea, textarea:hover, select, select:hover { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><polygon points='0,0 12,44 20,36 28,44 32,40 24,32 36,24' fill='black' stroke='white' stroke-width='2'/></svg>") 0 0, auto !important; }`;
    } else if (size === 'xlarge') {
        css = `*, *:hover, a, a:hover, button, button:hover, input, input:hover, textarea, textarea:hover, select, select:hover { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><polygon points='0,0 16,60 28,48 40,60 46,54 34,42 54,32' fill='black' stroke='white' stroke-width='2'/></svg>") 0 0, auto !important; }`;
    }

    if (css) {
        styleTag.textContent = css;
        document.head.appendChild(styleTag);
    }
}

let baLastSelectionRange = null;

document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;

    const currentRange = selection.getRangeAt(0);
    if (currentRange.collapsed) return;

    const ancestor = currentRange.commonAncestorContainer;
    if (ancestor.nodeType === Node.ELEMENT_NODE && ancestor.closest && ancestor.closest('.ba-widget-element')) {
        return;
    }

    baLastSelectionRange = currentRange.cloneRange();
});

function getActiveRange() {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
        return selection.getRangeAt(0).cloneRange();
    }
    return baLastSelectionRange ? baLastSelectionRange.cloneRange() : null;
}

function clearHighlights() {
    const highlights = document.querySelectorAll('span.ba-text-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        while (highlight.firstChild) {
            parent.insertBefore(highlight.firstChild, highlight);
        }
        parent.removeChild(highlight);
    });
}

function highlightSelection(color) {
    const range = getActiveRange();
    if (!range || range.collapsed) return;

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    for (let i = selection.rangeCount - 1; i >= 0; i--) {
        const r = selection.getRangeAt(i);
        if (r.collapsed) continue;

        const span = document.createElement('span');
        span.classList.add('ba-text-highlight');
        span.style.backgroundColor = color;
        span.style.color = 'inherit';

        try {
            r.surroundContents(span);
        } catch (e) {
            const contents = r.extractContents();
            span.appendChild(contents);
            r.insertNode(span);
        }
    }

    selection.removeAllRanges();
    baLastSelectionRange = null;
}

function isElementInWidget(el) {
    let current = el;
    while (current) {
        if (current.classList && current.classList.contains('ba-widget-element')) {
            return true;
        }
        current = current.parentElement;
    }
    return false;
}

function applyTextSettings(settings) {
    const elements = document.querySelectorAll('p, span, div, li, article');

    if (!settings) return;

    if (settings.reset) {
        elements.forEach(el => {
            if (isElementInWidget(el)) return;
            el.style.fontSize = '';
            el.style.lineHeight = '';
            el.style.letterSpacing = '';
            el.style.fontFamily = '';
            el.style.overflow = '';
            el.style.minHeight = '';
            el.style.boxSizing = '';
            el.style.wordBreak = '';
            el.style.whiteSpace = '';
            resetParentSafeStyles(el);
        });
        clearHighlights();
        setCursor(null);
        return;
    }

    elements.forEach(el => {
        if (isElementInWidget(el)) return;
        if (settings.fontSize !== undefined) el.style.fontSize = settings.fontSize + 'px';
        if (settings.lineHeight !== undefined) el.style.lineHeight = settings.lineHeight;
        if (settings.spacing !== undefined) el.style.letterSpacing = settings.spacing + 'px';
        if (settings.fontFamily) el.style.fontFamily = settings.fontFamily;
        el.style.overflow = 'visible';
        el.style.minHeight = 'unset';
        el.style.boxSizing = 'border-box';
        el.style.wordBreak = 'break-word';
        el.style.whiteSpace = 'normal';
        applyParentSafeStyles(el);
    });

    setCursor(settings.cursorSize);
}

chrome.runtime.onMessage.addListener((settings) => {
    if (settings && settings.highlightClear) {
        clearHighlights();
        return;
    }
    if (settings && settings.highlight) {
        highlightSelection(settings.color || '#fff176');
        return;
    }
    applyTextSettings(settings);
});
