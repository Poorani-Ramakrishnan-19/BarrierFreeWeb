function createFloatingAccessWidget() {
    if (document.getElementById('ba-access-widget')) return;

    const style = document.createElement('style');
    style.id = 'ba-widget-styles';
    style.textContent = `
        body.ba-widget-open {
            font-family: 'Segoe UI', Arial, sans-serif;
        }
        #ba-access-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #5a7cff, #3a5ad7);
            border: 2px solid white;
            box-shadow: 0 4px 16px rgba(60, 60, 90, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2147483647;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        #ba-access-widget:hover {
            box-shadow: 0 8px 26px rgba(60, 60, 90, 0.45);
            transform: translateY(-2px) scale(1.28);
        }
        #ba-access-widget:hover #ba-access-widget-img {
            transform: scale(1.35);
        }
        #ba-access-widget.ba-widget-dark {
            background: linear-gradient(135deg, #2a3348, #111827);
            border-color: #334155;
        }

        #ba-widget-panel {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 320px;
            max-height: calc(100vh - 110px);
            background: #ffffff;
            border: 1px solid #dbe2ef;
            border-radius: 14px;
            box-shadow: 0 18px 40px rgba(20, 24, 51, 0.18);
            z-index: 2147483647;
            padding: 14px;
            display: none;
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #1f2a44;
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-width: thin;
            scrollbar-color: #93a3c9 #eef3ff;
        }
        #ba-widget-panel::-webkit-scrollbar {
            width: 8px;
        }
        #ba-widget-panel::-webkit-scrollbar-track {
            background: #eef3ff;
            border-radius: 999px;
        }
        #ba-widget-panel::-webkit-scrollbar-thumb {
            background: #93a3c9;
            border-radius: 999px;
        }
        #ba-widget-panel.ba-panel-dark {
            background: #0f172a;
            border-color: #334155;
            color: #e2e8f0;
            box-shadow: 0 18px 40px rgba(2, 6, 23, 0.45);
            scrollbar-color: #64748b #1e293b;
        }
        #ba-widget-panel.ba-panel-dark::-webkit-scrollbar-track {
            background: #1e293b;
        }
        #ba-widget-panel.ba-panel-dark::-webkit-scrollbar-thumb {
            background: #64748b;
        }
        #ba-widget-panel h3 {
            margin: 0 0 10px;
            font-size: 1rem;
            font-weight: 700;
            color: #1f2a44;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }
        #ba-widget-panel.ba-panel-dark h3 {
            color: #f1f5f9;
        }
        #ba-widget-panel .ba-group {
            margin-bottom: 10px;
            background: #f6f8fd;
            border: 1px solid #e3e9f5;
            border-radius: 10px;
            overflow: hidden;
        }
        #ba-widget-panel.ba-panel-dark .ba-group {
            background: #1e293b;
            border-color: #334155;
        }
        #ba-widget-panel .ba-group-toggle {
            width: 100%;
            margin: 0;
            border-radius: 0;
            border: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            background: transparent;
            color: #3a4b72;
            cursor: pointer;
        }
        #ba-widget-panel .ba-group-toggle:hover {
            background: #edf2ff;
        }
        #ba-widget-panel .ba-group-title {
            margin: 0;
            font-size: 0.86rem;
            font-weight: 650;
            color: #3a4b72;
            text-align: left;
        }
        #ba-widget-panel.ba-panel-dark .ba-group-title {
            color: #e2e8f0;
        }
        #ba-widget-panel .ba-group-indicator {
            font-size: 1rem;
            font-weight: 700;
            color: #526389;
            line-height: 1;
        }
        #ba-widget-panel.ba-panel-dark .ba-group-indicator {
            color: #94a3b8;
        }
        #ba-widget-panel .ba-group-content {
            padding: 8px 10px 10px;
        }
        #ba-widget-panel .ba-group.collapsed .ba-group-content {
            display: none;
        }
        #ba-widget-panel .ba-setting-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        #ba-widget-panel .ba-setting-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        #ba-widget-panel .ba-setting-item label {
            font-size: 0.78rem;
            color: #59687f;
        }
        #ba-widget-panel.ba-panel-dark .ba-setting-item label,
        #ba-widget-panel.ba-panel-dark label {
            color: #cbd5e1;
        }
        #ba-widget-panel input[type="range"] {
            width: 100%;
            margin: 0 0 6px 0;
            accent-color: #5a7cff;
            height: 3px;
            background: #e2e8f0;
            border-radius: 2px;
            outline: none;
        }
        #ba-widget-panel select {
            width: 100%;
            padding: 6px 8px;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
            background: #f4f7fa;
            font-size: 0.95em;
            color: #22223b;
            margin-bottom: 10px;
        }
        #ba-widget-panel.ba-panel-dark select {
            background: #0f172a;
            border-color: #475569;
            color: #e2e8f0;
        }
        #ba-widget-panel input[type="color"] {
            width: 100%;
            height: 30px;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
            margin-bottom: 8px;
            padding: 2px;
        }
        #ba-widget-panel.ba-panel-dark input[type="color"] {
            border-color: #475569;
            background: #0f172a;
        }
        #ba-widget-panel label {
            display: block;
            font-size: 0.9em;
            color: #4a4a6a;
            margin-bottom: 4px;
        }
        #ba-widget-panel button {
            width: 100%;
            padding: 8px;
            margin-top: 6px;
            border-radius: 8px;
            border: none;
            background: linear-gradient(90deg, #5a7cff 0%, #3a5ad7 100%);
            color: #fff;
            font-weight: 600;
            font-size: 0.95em;
            cursor: pointer;
            transition: background 0.2s, box-shadow 0.2s;
        }
        #ba-widget-panel button:hover {
            background: linear-gradient(90deg, #3a5ad7 0%, #5a7cff 100%);
        }
        #ba-widget-panel button.secondary {
            background: #fff;
            color: #5a7cff;
            border: 1.5px solid #5a7cff;
            margin-top: 4px;
        }
        #ba-widget-panel button.secondary:hover {
            background: #f8fafc;
        }
        #ba-widget-panel .ba-contrast-actions {
            display: grid;
            grid-template-columns: 1fr;
            gap: 6px;
            margin-top: 2px;
        }
        #ba-widget-panel .ba-contrast-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #e9efff;
            color: #334155;
            border: 1px solid #c7d2fe;
            box-shadow: none;
        }
        #ba-widget-panel .ba-contrast-btn:hover {
            background: #dbe7ff;
            color: #1e293b;
        }
        #ba-widget-panel.ba-panel-dark .ba-contrast-btn {
            background: #0b1220;
            color: #cbd5e1;
            border: 1px solid #334155;
        }
        #ba-widget-panel.ba-panel-dark .ba-contrast-btn:hover {
            background: #111c33;
            color: #e2e8f0;
        }
        #ba-widget-panel .ba-contrast-btn.active {
            background: linear-gradient(90deg, #5a7cff 0%, #3a5ad7 100%);
            color: #ffffff;
            border-color: transparent;
            box-shadow: 0 0 0 2px rgba(90, 124, 255, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.28);
        }
        #ba-widget-panel .ba-contrast-btn.active:hover,
        #ba-widget-panel.ba-panel-dark .ba-contrast-btn.active:hover {
            background: linear-gradient(90deg, #5a7cff 0%, #3a5ad7 100%);
            color: #ffffff;
            border-color: transparent;
            box-shadow: 0 0 0 2px rgba(90, 124, 255, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.28);
        }
        #ba-widget-panel .ba-contrast-btn img {
            width: 16px;
            height: 16px;
            border-radius: 4px;
            object-fit: contain;
            background: rgba(255, 255, 255, 0.65);
            padding: 1px;
        }
        #ba-widget-panel .ba-contrast-btn.active img {
            background: rgba(255, 255, 255, 0.2);
        }
        #ba-widget-panel #ba-custom-contrast-wrap {
            display: none;
            margin-top: 8px;
        }
        .ba-link-highlight {
            border-radius: 2px;
            transition: background-color 0.2s;
        }
        .ba-toggle-btn.active {
            box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.4);
        }
    `;
    document.head.appendChild(style);

    const icon = document.createElement('div');
    icon.id = 'ba-access-widget';
    icon.className = 'ba-widget-element';
    icon.title = 'Barrier Free Web';
    icon.innerHTML = `
        <img id="ba-access-widget-img" src="${chrome.runtime.getURL('BarrierFreeWeb_Icon.png')}" alt="BarrierFreeWeb" style="width:100%; height:100%; object-fit:contain; border-radius:50%; transition: transform 0.2s ease;" />
    `;

    const panel = document.createElement('div');
    panel.id = 'ba-widget-panel';
    panel.className = 'ba-widget-element';
    const invertActionIcon = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#ffffff" stroke="#3655c6" stroke-width="2"/><path d="M12 3a9 9 0 0 1 0 18z" fill="#3655c6"/></svg>');
    const desaturateActionIcon = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="2" fill="#ffffff" stroke="#3655c6" stroke-width="2"/><path d="M12 5v14" stroke="#3655c6" stroke-width="2"/><rect x="4" y="5" width="8" height="14" rx="2" fill="#3655c6"/></svg>');
    const darkActionIcon = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#3655c6" stroke="#3655c6" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#ffffff"/></svg>');
    const lightActionIcon = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#ffffff" stroke="#3655c6" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#3655c6"/></svg>');
    const adjustActionIcon = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#ffffff" stroke="#3655c6" stroke-width="2"/><path d="M7 12h10M12 7v10" stroke="#3655c6" stroke-width="2" stroke-linecap="round"/></svg>');
    panel.innerHTML = `
        <h3>Accessibility Controls</h3>
        <div class="ba-group" data-section="text-dimensions">
            <button type="button" class="ba-group-toggle" aria-expanded="true">
                <span class="ba-group-title">Text Dimensions</span>
                <span class="ba-group-indicator" aria-hidden="true">-</span>
            </button>
            <div class="ba-group-content">
            <div class="ba-setting-grid">
                <div class="ba-setting-item">
                    <label for="ba-fontSize">Font Size <strong><span id="ba-fontSize-value">16</span>px</strong></label>
                    <input type="range" id="ba-fontSize" min="12" max="40" value="16">
                </div>
                <div class="ba-setting-item">
                    <label for="ba-lineHeight">Line Height <strong><span id="ba-lineHeight-value">1.5</span></strong></label>
                    <input type="range" id="ba-lineHeight" min="1" max="3" step="0.1" value="1.5">
                </div>
                <div class="ba-setting-item">
                    <label for="ba-spacing">Letter Spacing <strong><span id="ba-spacing-value">0</span>px</strong></label>
                    <input type="range" id="ba-spacing" min="0" max="5" step="0.1" value="0">
                </div>
            </div>
            </div>
        </div>

        <div class="ba-group collapsed" data-section="typography">
            <button type="button" class="ba-group-toggle" aria-expanded="false">
                <span class="ba-group-title">Typography</span>
                <span class="ba-group-indicator" aria-hidden="true">+</span>
            </button>
            <div class="ba-group-content">
            <div class="ba-setting-grid">
                <div class="ba-setting-item">
                    <label for="ba-fontFamily">Font Family</label>
                    <select id="ba-fontFamily"><option value="">Default</option><option value="Arial">Arial</option><option value="Verdana">Verdana</option><option value="Georgia">Georgia</option><option value="Times New Roman">Times</option><option value="OpenDyslexic">OpenDyslexic</option></select>
                </div>
                <div class="ba-setting-item">
                    <label for="ba-cursorSize">Cursor Size</label>
                    <select id="ba-cursorSize"><option value="default">Default</option><option value="large">Large</option><option value="xlarge">Extra Large</option></select>
                </div>
            </div>
            </div>
        </div>

        <div class="ba-group collapsed" data-section="highlight">
            <button type="button" class="ba-group-toggle" aria-expanded="false">
                <span class="ba-group-title">Highlight</span>
                <span class="ba-group-indicator" aria-hidden="true">+</span>
            </button>
            <div class="ba-group-content">
            <div style="display:flex; gap:6px; margin-bottom:8px;">
                <button id="ba-highlight-links" style="flex:1;">Highlight Links</button>
            </div>
            <label for="ba-highlightColor">Highlight Color</label>
            <input id="ba-highlightColor" type="color" value="#fff176">
            <button id="ba-highlight" style="width:100%; margin-top:8px;">Highlight Selection</button>
            <button id="ba-clearHighlights" class="secondary" style="width:100%; margin-top:4px;">Clear Highlights</button>
            </div>
        </div>

        <div class="ba-group collapsed" data-section="contrast">
            <button type="button" class="ba-group-toggle" aria-expanded="false">
                <span class="ba-group-title">Appearance</span>
                <span class="ba-group-indicator" aria-hidden="true">+</span>
            </button>
            <div class="ba-group-content">
                <div class="ba-contrast-actions">
                    <button id="ba-contrast-invert" class="ba-contrast-btn" type="button">
                        <img src="${invertActionIcon}" alt="Invert color">
                        <span>Invert Color</span>
                    </button>
                    <button id="ba-contrast-desaturate" class="ba-contrast-btn" type="button">
                        <img src="${desaturateActionIcon}" alt="Desaturate">
                        <span>Desaturate</span>
                    </button>
                    <button id="ba-contrast-theme" class="ba-contrast-btn" type="button">
                        <img id="ba-contrast-theme-icon" src="${lightActionIcon}" alt="Theme: Light">
                        <span id="ba-contrast-theme-label">Theme: Light</span>
                    </button>
                    <button id="ba-contrast-adjust" class="ba-contrast-btn" type="button">
                        <img src="${adjustActionIcon}" alt="Adjust contrast">
                        <span id="ba-contrast-adjust-label">Adjust Contrast</span>
                    </button>
                </div>
                <div id="ba-custom-contrast-wrap">
                    <label for="ba-custom-contrast">Custom Contrast <strong><span id="ba-custom-contrast-value">100</span>%</strong></label>
                    <input type="range" id="ba-custom-contrast" min="50" max="200" value="100" step="5">
                </div>
            </div>
        </div>

        <button id="ba-reset" class="secondary" style="width:100%; margin-top:4px;">Reset All</button>
    `;

    let isDragging = false;
    let hasDragged = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    function updateWidgetPosition(x, y) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const iconWidth = icon.offsetWidth || 50;
        const iconHeight = icon.offsetHeight || 50;
        const defaultPanelWidth = 320;
        const defaultPanelHeight = 400;

        let panelWidth = panel.offsetWidth;
        let panelHeight = panel.offsetHeight;

        if ((panelWidth === 0 || panelHeight === 0) && getComputedStyle(panel).display === 'none') {
            panel.style.position = 'absolute';
            panel.style.left = '-9999px';
            panel.style.display = 'block';
            panelWidth = panel.offsetWidth;
            panelHeight = panel.offsetHeight;
            panel.style.display = 'none';
            panel.style.position = 'fixed';
            panel.style.left = '';
        }

        if (!panelWidth) panelWidth = defaultPanelWidth;
        if (!panelHeight) panelHeight = defaultPanelHeight;

        const clampedX = Math.max(0, Math.min(x, viewportWidth - iconWidth));
        const clampedY = Math.max(0, Math.min(y, viewportHeight - iconHeight));

        icon.style.left = clampedX + 'px';
        icon.style.top = clampedY + 'px';
        icon.style.right = 'auto';
        icon.style.bottom = 'auto';

        const positions = [
            { left: clampedX, top: clampedY - panelHeight - 10 },
            { left: clampedX, top: clampedY + iconHeight + 10 },
            { left: clampedX - panelWidth + iconWidth, top: clampedY - panelHeight - 10 },
            { left: clampedX - panelWidth + iconWidth, top: clampedY + iconHeight + 10 }
        ];

        let bestPosition = positions[0];
        let bestScore = Infinity;

        for (const pos of positions) {
            const panelLeft = pos.left;
            const panelTop = pos.top;
            const panelRight = panelLeft + panelWidth;
            const panelBottom = panelTop + panelHeight;

            const offLeft = Math.max(0, -panelLeft);
            const offRight = Math.max(0, panelRight - viewportWidth);
            const offTop = Math.max(0, -panelTop);
            const offBottom = Math.max(0, panelBottom - viewportHeight);

            const overflow = offLeft + offRight + offTop + offBottom;

            if (overflow === 0) {
                bestPosition = { left: panelLeft, top: panelTop };
                break;
            }

            if (overflow < bestScore) {
                bestScore = overflow;
                bestPosition = { left: panelLeft, top: panelTop };
            }
        }

        const finalLeft = Math.max(0, Math.min(bestPosition.left, viewportWidth - panelWidth));
        const finalTop = Math.max(0, Math.min(bestPosition.top, viewportHeight - panelHeight));

        panel.style.left = finalLeft + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        panel.style.top = finalTop + 'px';
    }

    icon.addEventListener('mousedown', (event) => {
        if (event.button !== 0) return;
        isDragging = true;
        dragOffsetX = event.clientX - icon.getBoundingClientRect().left;
        dragOffsetY = event.clientY - icon.getBoundingClientRect().top;
        event.preventDefault();
    });

    document.addEventListener('mousemove', (event) => {
        if (!isDragging) return;
        hasDragged = true;
        const x = event.clientX - dragOffsetX;
        const y = event.clientY - dragOffsetY;
        updateWidgetPosition(x, y);
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        setTimeout(() => { hasDragged = false; }, 0);
    });

    icon.addEventListener('click', (event) => {
        if (hasDragged) {
            event.preventDefault();
            return;
        }
        event.stopPropagation();
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    });

    document.body.appendChild(icon);
    document.body.appendChild(panel);

    panel.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    panel.querySelectorAll('.ba-group-toggle').forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const group = toggle.closest('.ba-group');
            if (!group) return;

            const isCollapsed = group.classList.toggle('collapsed');
            toggle.setAttribute('aria-expanded', String(!isCollapsed));

            const indicator = toggle.querySelector('.ba-group-indicator');
            if (indicator) indicator.textContent = isCollapsed ? '+' : '-';

            // Re-run positioning logic so the panel remains on-screen after height changes.
            if (typeof updateWidgetPosition === 'function' && icon) {
                const iconRect = icon.getBoundingClientRect();
                const iconCenterX = iconRect.left + (iconRect.width / 2);
                const iconCenterY = iconRect.top + (iconRect.height / 2);
                updateWidgetPosition(iconCenterX, iconCenterY);
            }
        });
    });

    const fontSize = document.getElementById('ba-fontSize');
    const lineHeight = document.getElementById('ba-lineHeight');
    const spacing = document.getElementById('ba-spacing');
    const fontFamily = document.getElementById('ba-fontFamily');
    const cursorSize = document.getElementById('ba-cursorSize');
    const highlightColor = document.getElementById('ba-highlightColor');

    const fontSizeValue = document.getElementById('ba-fontSize-value');
    const lineHeightValue = document.getElementById('ba-lineHeight-value');
    const spacingValue = document.getElementById('ba-spacing-value');

    function updateValues() {
        fontSizeValue.textContent = fontSize.value;
        lineHeightValue.textContent = lineHeight.value;
        spacingValue.textContent = spacing.value;
    }

    function applyWidgetSettings() {
        updateValues();
        applyTextSettings({
            fontSize: parseFloat(fontSize.value),
            lineHeight: lineHeight.value,
            spacing: parseFloat(spacing.value),
            fontFamily: fontFamily.value,
            cursorSize: cursorSize.value,
        });
    }

    fontSize.addEventListener('input', applyWidgetSettings);
    lineHeight.addEventListener('input', applyWidgetSettings);
    spacing.addEventListener('input', applyWidgetSettings);
    fontFamily.addEventListener('change', applyWidgetSettings);
    cursorSize.addEventListener('change', applyWidgetSettings);

    const customContrast = document.getElementById('ba-custom-contrast');
    const customContrastValue = document.getElementById('ba-custom-contrast-value');
    const customContrastWrap = document.getElementById('ba-custom-contrast-wrap');
    const contrastInvertButton = document.getElementById('ba-contrast-invert');
    const contrastDesaturateButton = document.getElementById('ba-contrast-desaturate');
    const contrastThemeButton = document.getElementById('ba-contrast-theme');
    const contrastThemeButtonLabel = document.getElementById('ba-contrast-theme-label');
    const contrastThemeButtonIcon = document.getElementById('ba-contrast-theme-icon');
    const contrastAdjustButton = document.getElementById('ba-contrast-adjust');
    const contrastAdjustButtonLabel = document.getElementById('ba-contrast-adjust-label');

    document.getElementById('ba-reset').addEventListener('click', () => {
        fontSize.value = 16;
        lineHeight.value = 1.5;
        spacing.value = 0;
        fontFamily.value = '';
        cursorSize.value = 'default';
        highlightColor.value = '#fff176';
        customContrast.value = 100;
        customContrastValue.textContent = '100';
        updateValues();
        applyTextSettings({ reset: true });
        document.getElementById('ba-highlight-links').textContent = 'Highlight Links';
        currentAdjustModeIndex = 0;
        setActiveContrastMode('none');
    });

    document.getElementById('ba-highlight').addEventListener('click', () => {
        highlightSelection(highlightColor.value || '#fff176');
    });

    document.getElementById('ba-highlight-links').addEventListener('click', () => {
        const isHighlighted = toggleLinkHighlights(highlightColor.value || '#fff176');
        const button = document.getElementById('ba-highlight-links');
        button.textContent = isHighlighted ? 'Unhighlight Links' : 'Highlight Links';
    });

    document.getElementById('ba-clearHighlights').addEventListener('click', clearHighlights);

    const contrastModeLabels = {
        none: 'None',
        invert: 'Invert Colors',
        darkContrast: 'Dark Contrast',
        lightContrast: 'Light Contrast',
        high: 'High Contrast',
        custom: 'Custom Contrast',
        desaturate: 'Desaturate'
    };
    const themeModeLabels = {
        darkTheme: 'Theme: Dark',
        lightTheme: 'Theme: Light'
    };
    const themeModeIcons = {
        darkTheme: darkActionIcon,
        lightTheme: lightActionIcon
    };
    const themeModes = ['darkTheme', 'lightTheme'];
    const adjustableContrastModes = ['none', 'darkContrast', 'lightContrast', 'high', 'custom'];
    let currentAdjustModeIndex = 0;
    let currentThemeModeIndex = 0;
    let activeContrastMode = 'none';

    function detectCurrentThemeMode() {
        if (typeof isPageAlreadyInMode === 'function' && isPageAlreadyInMode('dark')) {
            return 'darkTheme';
        }
        return 'lightTheme';
    }

    function updateWidgetThemeAppearance(mode) {
        const appliedMode = mode || activeContrastMode;
        const isDarkTheme = appliedMode === 'darkTheme' || (appliedMode !== 'lightTheme' && detectCurrentThemeMode() === 'darkTheme');
        panel.classList.toggle('ba-panel-dark', isDarkTheme);
        icon.classList.toggle('ba-widget-dark', isDarkTheme);
    }

    function setActiveContrastMode(mode) {
        clearAllContrastEffects();
        if (mode !== 'none') applyContrastEffect(mode, true);
        activeContrastMode = mode;

        contrastInvertButton.classList.toggle('active', mode === 'invert');
        contrastDesaturateButton.classList.toggle('active', mode === 'desaturate');
        const isThemeMode = themeModes.includes(mode);
        contrastThemeButton.classList.toggle('active', isThemeMode);
        const activeThemeMode = themeModes.includes(mode) ? mode : detectCurrentThemeMode();
        contrastThemeButtonLabel.textContent = themeModeLabels[activeThemeMode];
        contrastThemeButtonIcon.setAttribute('src', themeModeIcons[activeThemeMode]);
        contrastThemeButtonIcon.setAttribute('alt', themeModeLabels[activeThemeMode]);
        contrastAdjustButton.classList.toggle('active', adjustableContrastModes.includes(mode) && mode !== 'none');

        contrastAdjustButtonLabel.textContent = (adjustableContrastModes.includes(mode) && mode !== 'none')
            ? contrastModeLabels[mode]
            : 'Adjust Contrast';

        customContrastWrap.style.display = mode === 'custom' ? 'block' : 'none';
        updateWidgetThemeAppearance(mode);
    }

    contrastInvertButton.addEventListener('click', () => {
        const nextMode = activeContrastMode === 'invert' ? 'none' : 'invert';
        setActiveContrastMode(nextMode);
    });

    contrastDesaturateButton.addEventListener('click', () => {
        const nextMode = activeContrastMode === 'desaturate' ? 'none' : 'desaturate';
        setActiveContrastMode(nextMode);
    });

    contrastThemeButton.addEventListener('click', () => {
        if (themeModes.includes(activeContrastMode)) {
            currentThemeModeIndex = themeModes.indexOf(activeContrastMode);
        } else {
            currentThemeModeIndex = themeModes.indexOf(detectCurrentThemeMode());
        }

        let attempts = 0;
        while (attempts < themeModes.length) {
            currentThemeModeIndex = (currentThemeModeIndex + 1) % themeModes.length;
            const nextMode = themeModes[currentThemeModeIndex];
            const switchingFromNonTheme = !themeModes.includes(activeContrastMode);
            const blockedDark = switchingFromNonTheme && nextMode === 'darkTheme' && typeof isPageAlreadyInMode === 'function' && isPageAlreadyInMode('dark');
            const blockedLight = switchingFromNonTheme && nextMode === 'lightTheme' && typeof isPageAlreadyInMode === 'function' && isPageAlreadyInMode('light');
            if (!blockedDark && !blockedLight) {
                setActiveContrastMode(nextMode);
                break;
            }
            attempts += 1;
        }
    });

    contrastAdjustButton.addEventListener('click', () => {
        if (adjustableContrastModes.includes(activeContrastMode)) {
            currentAdjustModeIndex = adjustableContrastModes.indexOf(activeContrastMode);
        } else {
            currentAdjustModeIndex = 0;
        }
        currentAdjustModeIndex = (currentAdjustModeIndex + 1) % adjustableContrastModes.length;
        setActiveContrastMode(adjustableContrastModes[currentAdjustModeIndex]);
    });

    customContrast.addEventListener('input', function() {
        customContrastValue.textContent = this.value;
        setCustomContrast(parseInt(this.value, 10));
        if (activeContrastMode === 'custom') {
            applyContrastEffect('custom', true);
        }
    });

    setActiveContrastMode('none');
    updateWidgetThemeAppearance('none');

    document.addEventListener('click', (event) => {
        if (!panel.contains(event.target) && !icon.contains(event.target)) {
            panel.style.display = 'none';
        }
    });
}
