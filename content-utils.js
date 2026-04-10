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

let linksHighlighted = false;

let contrastEffects = {
    invert: false,
    darkContrast: false,
    lightContrast: false,
    high: false,
    custom: false,
    desaturate: false,
    darkTheme: false,
    lightTheme: false
};

let customContrastValue = 100;

function ensureContrastStyleTag() {
    let styleTag = document.getElementById('ba-contrast-style');
    if (styleTag) return styleTag;

    styleTag = document.createElement('style');
    styleTag.id = 'ba-contrast-style';
    styleTag.textContent = `
        body.ba-contrast-active > *:not(#ba-access-widget):not(#ba-widget-panel) {
            filter: var(--ba-contrast-filter, none) !important;
        }

        a.ba-link-highlight,
        a.ba-link-highlight:link,
        a.ba-link-highlight:visited,
        a.ba-link-highlight:hover,
        a.ba-link-highlight:active,
        a.ba-link-highlight:focus {
            background-color: var(--ba-link-highlight-bg, #000000) !important;
            color: var(--ba-link-highlight-color, #fff176) !important;
            -webkit-text-fill-color: var(--ba-link-highlight-color, #fff176) !important;
        }

        a.ba-link-highlight *,
        a.ba-link-highlight *:before,
        a.ba-link-highlight *:after {
            color: var(--ba-link-highlight-color, #fff176) !important;
            -webkit-text-fill-color: var(--ba-link-highlight-color, #fff176) !important;
        }

        body.ba-dark-mode > *:not(#ba-access-widget):not(#ba-widget-panel),
        body.ba-dark-mode > *:not(#ba-access-widget):not(#ba-widget-panel) *:not(img):not(video):not(picture):not(source):not(canvas):not(svg):not(iframe):not(object):not(embed) {
            background-color: #121212 !important;
            color: #f5f7fa !important;
            border-color: #3b4252 !important;
        }

        body.ba-light-mode > *:not(#ba-access-widget):not(#ba-widget-panel),
        body.ba-light-mode > *:not(#ba-access-widget):not(#ba-widget-panel) *:not(img):not(video):not(picture):not(source):not(canvas):not(svg):not(iframe):not(object):not(embed) {
            background-color: #ffffff !important;
            color: #101418 !important;
            border-color: #d0d7de !important;
        }

        body.ba-dark-mode > *:not(#ba-access-widget):not(#ba-widget-panel) img,
        body.ba-dark-mode > *:not(#ba-access-widget):not(#ba-widget-panel) video,
        body.ba-dark-mode > *:not(#ba-access-widget):not(#ba-widget-panel) canvas,
        body.ba-dark-mode > *:not(#ba-access-widget):not(#ba-widget-panel) svg,
        body.ba-dark-mode > *:not(#ba-access-widget):not(#ba-widget-panel) iframe,
        body.ba-light-mode > *:not(#ba-access-widget):not(#ba-widget-panel) img,
        body.ba-light-mode > *:not(#ba-access-widget):not(#ba-widget-panel) video,
        body.ba-light-mode > *:not(#ba-access-widget):not(#ba-widget-panel) canvas,
        body.ba-light-mode > *:not(#ba-access-widget):not(#ba-widget-panel) svg,
        body.ba-light-mode > *:not(#ba-access-widget):not(#ba-widget-panel) iframe {
            background-color: transparent !important;
            color: inherit !important;
        }
    `;
    document.head.appendChild(styleTag);
    return styleTag;
}

function parseRgbString(color) {
    const match = color && color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) return null;
    return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
}

function getLuminance(rgb) {
    if (!rgb) return null;
    const normalized = rgb.map((value) => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    return (0.2126 * normalized[0]) + (0.7152 * normalized[1]) + (0.0722 * normalized[2]);
}

function getEffectiveBackgroundColor() {
    const candidates = [document.body, document.documentElement];
    for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        if (!candidate) continue;
        const computed = window.getComputedStyle(candidate);
        const rgb = parseRgbString(computed.backgroundColor);
        if (!rgb) continue;
        const alphaMatch = computed.backgroundColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([0-9.]+)\)/i);
        const alpha = alphaMatch ? parseFloat(alphaMatch[1]) : 1;
        if (alpha > 0) return rgb;
    }
    return [255, 255, 255];
}

function isPageAlreadyInMode(mode) {
    const backgroundRgb = getEffectiveBackgroundColor();
    const textRgb = parseRgbString(window.getComputedStyle(document.body).color) || [0, 0, 0];
    const bgLum = getLuminance(backgroundRgb);
    const textLum = getLuminance(textRgb);

    if (mode === 'dark') {
        return bgLum !== null && textLum !== null && bgLum < 0.35 && textLum > 0.6;
    }
    if (mode === 'light') {
        return bgLum !== null && textLum !== null && bgLum > 0.7 && textLum < 0.4;
    }
    return false;
}

window.isBarrierFreePageMode = isPageAlreadyInMode;

function applyThemeModeClasses() {
    document.body.classList.remove('ba-dark-mode', 'ba-light-mode');
    document.documentElement.style.colorScheme = '';

    if (contrastEffects.darkTheme) {
        document.body.classList.add('ba-dark-mode');
        document.documentElement.style.colorScheme = 'dark';
    } else if (contrastEffects.lightTheme) {
        document.body.classList.add('ba-light-mode');
        document.documentElement.style.colorScheme = 'light';
    }
}

function applyContrastEffect(effect, enable) {
    let filter = '';
    
    if (enable) {
        contrastEffects[effect] = true;
    } else {
        contrastEffects[effect] = false;
    }
    
    // Build filter string based on active effects
    let filters = [];
    
    if (contrastEffects.invert) filters.push('invert(100%)');
    if (contrastEffects.darkContrast) filters.push('brightness(0.5) contrast(1.5)');
    if (contrastEffects.lightContrast) filters.push('brightness(1.5) contrast(1.5)');
    if (contrastEffects.high) filters.push('contrast(2)');
    if (contrastEffects.custom) filters.push(`contrast(${customContrastValue}%)`);
    if (contrastEffects.desaturate) filters.push('grayscale(100%)');
    
    filter = filters.join(' ');
    
    ensureContrastStyleTag();
    applyThemeModeClasses();

    if (filter) {
        document.body.classList.add('ba-contrast-active');
        document.body.style.setProperty('--ba-contrast-filter', filter);
    } else {
        document.body.classList.remove('ba-contrast-active');
        document.body.style.removeProperty('--ba-contrast-filter');
    }
}

function setCustomContrast(value) {
    customContrastValue = value;
    if (contrastEffects.custom) {
        applyContrastEffect('custom', true);
    }
}

function clearAllContrastEffects() {
    contrastEffects = {
        invert: false,
        darkContrast: false,
        lightContrast: false,
        high: false,
        custom: false,
        desaturate: false,
        darkTheme: false,
        lightTheme: false
    };
    customContrastValue = 100;
    document.body.classList.remove('ba-contrast-active');
    document.body.classList.remove('ba-dark-mode', 'ba-light-mode');
    document.body.style.removeProperty('--ba-contrast-filter');
    document.documentElement.style.colorScheme = '';
}

function toggleLinkHighlights(color) {
    if (linksHighlighted) {
        clearLinkHighlights();
        return false;
    } else {
        const isDarkMode = document.body.classList.contains('ba-dark-mode') ||
            (typeof isPageAlreadyInMode === 'function' && isPageAlreadyInMode('dark'));
        const linkBackground = isDarkMode ? '#fff176' : '#000000';
        const linkColor = isDarkMode ? '#22223b' : '#fff176';

        document.documentElement.style.setProperty('--ba-link-highlight-bg', linkBackground);
        document.documentElement.style.setProperty('--ba-link-highlight-color', linkColor);

        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (isElementInWidget(link)) return;
            link.classList.add('ba-link-highlight');
            link.style.setProperty('background-color', linkBackground, 'important');
            link.style.setProperty('color', linkColor, 'important');
            link.style.setProperty('-webkit-text-fill-color', linkColor, 'important');

            const descendants = link.querySelectorAll('*');
            descendants.forEach((el) => {
                el.style.setProperty('color', linkColor, 'important');
                el.style.setProperty('-webkit-text-fill-color', linkColor, 'important');
            });
        });
        linksHighlighted = true;
        return true;
    }
}

function clearLinkHighlights() {
    const links = document.querySelectorAll('a.ba-link-highlight');
    links.forEach(link => {
        link.classList.remove('ba-link-highlight');
        link.style.removeProperty('background-color');
        link.style.removeProperty('color');
        link.style.removeProperty('-webkit-text-fill-color');

        const descendants = link.querySelectorAll('*');
        descendants.forEach((el) => {
            el.style.removeProperty('color');
            el.style.removeProperty('-webkit-text-fill-color');
        });
    });
    document.documentElement.style.removeProperty('--ba-link-highlight-bg');
    document.documentElement.style.removeProperty('--ba-link-highlight-color');
    linksHighlighted = false;
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
        clearLinkHighlights();
        clearAllContrastEffects();
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
