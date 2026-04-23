function createFloatingAccessWidget() {
    if (document.getElementById('ba-access-widget')) return;

    // Load external CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('assets/widget.css');
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.id = 'ba-widget-styles';
    style.textContent = '';
    document.head.appendChild(style);

    const icon = document.createElement('div');
    icon.id = 'ba-access-widget';
    icon.className = 'ba-widget-element';
    icon.title = 'Barrier Free Web - Accessibility Controls';
    icon.setAttribute('role', 'button');
    icon.setAttribute('tabindex', '0');
    icon.setAttribute('aria-label', 'Accessibility Controls - Press Enter or Space to open');
    
    icon.innerHTML = `
        <img src="${chrome.runtime.getURL('images/Robot_gif.gif')}" alt="BarrierFreeWeb Accessibility Controls" style="width: 100%; height: 100%; object-fit: contain;" />
    `;

    const panel = document.createElement('div');
    panel.id = 'ba-widget-panel';
    panel.className = 'ba-widget-element';
    panel.innerHTML = `
        <h3>Accessibility Controls</h3>
        
        <!-- Quick Presets Section -->
        <div class="ba-group" data-section="presets">
            <button type="button" class="ba-group-toggle" aria-expanded="true" aria-label="Quick Presets">
                <span class="ba-group-title">Quick Presets</span>
                <span class="ba-group-indicator" aria-hidden="true">-</span>
            </button>
            <div class="ba-group-content">
                <div class="ba-preset-grid">
                    <button type="button" class="ba-preset-btn" data-preset="low-vision" aria-label="Low Vision preset" title="Optimized for low vision">👁 Low Vision</button>
                    <button type="button" class="ba-preset-btn" data-preset="dark-mode" aria-label="Dark Mode preset" title="Dark background, light text">🌙 Dark Mode</button>
                    <button type="button" class="ba-preset-btn" data-preset="dyslexia" aria-label="Dyslexia Friendly preset" title="OpenDyslexic font, increased spacing">🧠 Dyslexia</button>
                    <button type="button" class="ba-preset-btn" data-preset="large-text" aria-label="Large Text preset" title="Larger fonts and spacing">👵 Large Text</button>
                </div>
                <p style="font-size: 0.8rem; color: #666; margin-top: 8px; margin-bottom: 0;">💡 Tip: Customize further below</p>
            </div>
        </div>

        <!-- Theme Toggle Section -->
        <div class="ba-group" data-section="theme">
            <button type="button" class="ba-group-toggle" aria-expanded="true" aria-label="Theme settings">
                <span class="ba-group-title">Theme</span>
                <span class="ba-group-indicator" aria-hidden="true">-</span>
            </button>
            <div class="ba-group-content">
                <div style="display: flex; gap: 8px;">
                    <button type="button" class="ba-theme-btn ba-theme-btn-light" id="ba-theme-light" aria-pressed="true" aria-label="Light theme">☀️ Light</button>
                    <button type="button" class="ba-theme-btn ba-theme-btn-dark" id="ba-theme-dark" aria-pressed="false" aria-label="Dark theme">🌙 Dark</button>
                </div>
            </div>
        </div>

        <div class="ba-group" data-section="text-dimensions">
            <button type="button" class="ba-group-toggle" aria-expanded="true">
                <span class="ba-group-title">Text Dimensions</span>
                <span class="ba-group-indicator" aria-hidden="true">-</span>
            </button>
            <div class="ba-group-content">
            <div class="ba-setting-grid">
                <div class="ba-setting-item">
                    <label for="ba-fontSize">Font Size <strong><span id="ba-fontSize-label">Normal</span></strong></label>
                    <input type="range" id="ba-fontSize" min="12" max="40" value="16" aria-describedby="ba-fontSize-help">
                    <span id="ba-fontSize-help" style="font-size: 0.75rem; color: #888;">12px (Tiny) to 40px (Jumbo)</span>
                </div>
                <div class="ba-setting-item">
                    <label for="ba-lineHeight">Line Height <strong><span id="ba-lineHeight-value">1.5</span></strong></label>
                    <input type="range" id="ba-lineHeight" min="1" max="3" step="0.1" value="1.5" aria-label="Line height, adjusts spacing between lines">
                </div>
                <div class="ba-setting-item">
                    <label for="ba-spacing">Letter Spacing <strong><span id="ba-spacing-value">0</span>px</strong></label>
                    <input type="range" id="ba-spacing" min="0" max="5" step="0.1" value="0" aria-label="Letter spacing, adjusts space between characters">
                </div>
            </div>
            </div>
        </div>

        <div class="ba-group collapsed" data-section="typography">
            <button type="button" class="ba-group-toggle" aria-expanded="false" aria-label="Typography options">
                <span class="ba-group-title">Typography</span>
                <span class="ba-group-indicator" aria-hidden="true">+</span>
            </button>
            <div class="ba-group-content">
            <div class="ba-setting-grid">
                <div class="ba-setting-item">
                    <label for="ba-fontFamily">Font Family</label>
                    <select id="ba-fontFamily" aria-label="Select font family for text">
                        <option value="">Default (System)</option>
                        <option value="Arial, sans-serif">Arial (Sans-serif)</option>
                        <option value="Verdana, sans-serif">Verdana (Clean)</option>
                        <option value="Georgia, serif">Georgia (Serif)</option>
                        <option value="'Times New Roman', serif">Times New Roman (Classic)</option>
                        <option value="'Open Dyslexic', cursive">Open Dyslexic (Dyslexia-friendly)</option>
                    </select>
                </div>
                <div class="ba-setting-item">
                    <label for="ba-cursorSize">Cursor Size</label>
                    <select id="ba-cursorSize" aria-label="Select cursor size">
                        <option value="default">Default</option>
                        <option value="large">Large</option>
                        <option value="xlarge">Extra Large</option>
                    </select>
                </div>
            </div>
            </div>
        </div>

        <div class="ba-group collapsed" data-section="highlight">
            <button type="button" class="ba-group-toggle" aria-expanded="false" aria-label="Highlight options">
                <span class="ba-group-title">Highlight</span>
                <span class="ba-group-indicator" aria-hidden="true">+</span>
            </button>
            <div class="ba-group-content">
                <div style="display:flex; gap:6px; margin-bottom:8px;">
                    <button id="ba-highlight-links" style="flex:1;" aria-label="Highlight all links on the page">🔗 Highlight Links</button>
                </div>
                <label for="ba-highlightColor">🎨 Highlight Color</label>
                <input id="ba-highlightColor" type="color" value="#fff176" aria-label="Choose highlight color">
                <button id="ba-highlight" style="width:100%; margin-top:8px;" aria-label="Highlight selected text with chosen color">✏️ Highlight Selection</button>
                <button id="ba-clearHighlights" class="secondary" style="width:100%; margin-top:4px;" aria-label="Remove all highlights">🗑️ Clear Highlights</button>
            </div>
        </div>

        <div class="ba-group collapsed" data-section="contrast">
            <button type="button" class="ba-group-toggle" aria-expanded="false" aria-label="Contrast modes">
                <span class="ba-group-title">Contrast</span>
                <span class="ba-group-indicator" aria-hidden="true">+</span>
            </button>
            <div class="ba-group-content">
                <fieldset class="ba-contrast-fieldset">
                    <legend style="font-size: 0.8rem; color: #666; margin-bottom: 8px;">Select one mode:</legend>
                    <div class="ba-contrast-options">
                        <label class="ba-contrast-option">
                            <input type="radio" name="ba-contrast-mode" value="none" checked aria-label="No contrast mode">
                            <div class="ba-contrast-text">
                                <span class="ba-contrast-label">None</span>
                                <span class="ba-contrast-help">Default colors</span>
                            </div>
                        </label>
                        <label class="ba-contrast-option">
                            <input type="radio" name="ba-contrast-mode" value="invert" aria-label="Invert colors mode">
                            <div class="ba-contrast-text">
                                <span class="ba-contrast-label">🔄 Invert</span>
                                <span class="ba-contrast-help">Reversed colors</span>
                            </div>
                        </label>
                        <label class="ba-contrast-option">
                            <input type="radio" name="ba-contrast-mode" value="dark" aria-label="Dark contrast mode">
                            <div class="ba-contrast-text">
                                <span class="ba-contrast-label">🌙 Dark</span>
                                <span class="ba-contrast-help">Dark background, light text</span>
                            </div>
                        </label>
                        <label class="ba-contrast-option">
                            <input type="radio" name="ba-contrast-mode" value="light" aria-label="Light contrast mode">
                            <div class="ba-contrast-text">
                                <span class="ba-contrast-label">☀️ Light</span>
                                <span class="ba-contrast-help">Light background, dark text</span>
                            </div>
                        </label>
                        <label class="ba-contrast-option">
                            <input type="radio" name="ba-contrast-mode" value="high" aria-label="High contrast mode">
                            <div class="ba-contrast-text">
                                <span class="ba-contrast-label">⚡ High</span>
                                <span class="ba-contrast-help">Maximum contrast</span>
                            </div>
                        </label>
                        <label class="ba-contrast-option">
                            <input type="radio" name="ba-contrast-mode" value="desaturate" aria-label="Desaturate mode">
                            <div class="ba-contrast-text">
                                <span class="ba-contrast-label">⚪ Desaturate</span>
                                <span class="ba-contrast-help">Grayscale colors</span>
                            </div>
                        </label>
                    </div>
                </fieldset>
            </div>
        </div>

        <!-- Reset Section -->
        <div class="ba-group" data-section="reset">
            <button type="button" class="ba-group-toggle" aria-expanded="false" aria-label="Reset options">
                <span class="ba-group-title">Reset</span>
                <span class="ba-group-indicator" aria-hidden="true">+</span>
            </button>
            <div class="ba-group-content">
                <button id="ba-reset-section" class="ba-reset-btn secondary" aria-label="Reset current section">Reset Section</button>
                <button id="ba-reset-all" class="ba-reset-btn secondary" aria-label="Reset all settings">Reset All</button>
            </div>
        </div>
    `;

    // Confirmation Dialog
    const dialogContainer = document.createElement('div');
    dialogContainer.id = 'ba-dialog-overlay';
    dialogContainer.className = 'ba-widget-element ba-dialog-hidden';
    dialogContainer.innerHTML = `
        <div class="ba-dialog" role="alertdialog" aria-modal="true" aria-labelledby="ba-dialog-title">
            <h2 id="ba-dialog-title">Reset All Settings?</h2>
            <p>This will reset all accessibility settings to their default values. This action cannot be undone.</p>
            <div class="ba-dialog-buttons">
                <button id="ba-dialog-cancel" class="ba-btn-cancel">Cancel</button>
                <button id="ba-dialog-confirm" class="ba-btn-confirm">Reset All</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialogContainer);

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
        if (panel.style.display === 'block') {
            // Focus the first focusable element in the panel
            const firstFocusable = panel.querySelector('button, input, select, [tabindex]');
            if (firstFocusable) firstFocusable.focus();
        }
    });

    // Keyboard support for icon button
    icon.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
            if (panel.style.display === 'block') {
                const firstFocusable = panel.querySelector('button, input, select, [tabindex]');
                if (firstFocusable) firstFocusable.focus();
            }
        }
    });

    document.body.appendChild(icon);
    document.body.appendChild(panel);

    // Track the last opened section for Reset Section button
    let lastOpenedSection = null;

    panel.querySelectorAll('.ba-group-toggle').forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const group = toggle.closest('.ba-group');
            if (!group) return;

            const isCollapsed = group.classList.toggle('collapsed');
            toggle.setAttribute('aria-expanded', String(!isCollapsed));

            // Track which section was opened
            if (!isCollapsed) {
                lastOpenedSection = group.getAttribute('data-section');
            }

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

    // Preset Configurations
    const presetConfigs = {
        'low-vision': {
            fontSize: 20,
            lineHeight: 1.8,
            spacing: 0.2,
            fontFamily: 'Arial, sans-serif',
            contrast: 'high'
        },
        'dark-mode': {
            fontSize: 16,
            lineHeight: 1.6,
            spacing: 0,
            fontFamily: '',
            contrast: 'dark'
        },
        'dyslexia': {
            fontSize: 18,
            lineHeight: 1.8,
            spacing: 0.2,
            fontFamily: "'Open Dyslexic', cursive",
            contrast: 'none'
        },
        'large-text': {
            fontSize: 24,
            lineHeight: 1.8,
            spacing: 0.1,
            fontFamily: '',
            contrast: 'none'
        }
    };

    // Apply preset configuration
    function applyPreset(presetName) {
        const config = presetConfigs[presetName];
        if (!config) return;

        // Update font settings
        fontSize.value = config.fontSize;
        lineHeight.value = config.lineHeight;
        spacing.value = config.spacing;
        fontFamily.value = config.fontFamily;
        
        // Apply settings
        applyWidgetSettings();

        // Apply contrast if needed
        if (config.contrast && config.contrast !== 'none') {
            const radioButton = document.querySelector(`input[name="ba-contrast-mode"][value="${config.contrast}"]`);
            if (radioButton) {
                radioButton.checked = true;
                applyContrastFromRadio(config.contrast);
            }
        } else {
            // Reset to none
            document.querySelector(`input[name="ba-contrast-mode"][value="none"]`).checked = true;
            clearAllContrastEffects();
        }

        // Visual feedback
        document.querySelectorAll('.ba-preset-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-preset="${presetName}"]`).classList.add('active');

        // Announce to screen readers
        announceToScreenReader(`${presetName.replace('-', ' ')} preset applied`);
    }

    // Screen reader announcements
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    // Theme toggle functions
    function applyTheme(theme) {
        const isDark = theme === 'dark';
        
        let themeStyles = document.getElementById('ba-theme-styles');
        if (themeStyles) themeStyles.remove();

        if (isDark) {
            themeStyles = document.createElement('style');
            themeStyles.id = 'ba-theme-styles';
            themeStyles.textContent = `
                body {
                    background-color: #1a1a1a !important;
                    color: #e0e0e0 !important;
                }
                body * {
                    background-color: inherit;
                    color: inherit;
                }
                a { color: #64b5f6 !important; }
            `;
            document.head.appendChild(themeStyles);
        }

        // Update button states
        document.getElementById('ba-theme-light').setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        document.getElementById('ba-theme-dark').setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');

        announceToScreenReader(`${theme} theme applied`);
    }

    // Contrast radio button handler
    function applyContrastFromRadio(value) {
        clearAllContrastEffects();
        if (value && value !== 'none') {
            applyContrastEffect(value, true);
        }
        announceToScreenReader(`${value} contrast mode applied`);
    }

    const fontSizeLabel = document.getElementById('ba-fontSize-label');
    const lineHeightValue = document.getElementById('ba-lineHeight-value');
    const spacingValue = document.getElementById('ba-spacing-value');

    // Font size to readable label mapping
    const fontSizeLabels = {
        12: 'Tiny',
        14: 'Small',
        16: 'Normal',
        18: 'Large',
        20: 'Large+',
        24: 'Extra Large',
        32: 'Jumbo',
        40: 'Maximum'
    };

    function getFontSizeLabel(px) {
        if (fontSizeLabels[px]) return fontSizeLabels[px];
        if (px < 14) return 'Tiny';
        if (px < 18) return 'Small';
        if (px < 20) return 'Normal';
        if (px < 24) return 'Large';
        if (px < 32) return 'Extra Large';
        return 'Jumbo';
    }

    function updateValues() {
        const fontSize = parseInt(document.getElementById('ba-fontSize').value);
        fontSizeLabel.textContent = getFontSizeLabel(fontSize);
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

    // Preset buttons
    document.querySelectorAll('.ba-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.getAttribute('data-preset');
            applyPreset(preset);
        });
    });

    // Theme buttons
    document.getElementById('ba-theme-light').addEventListener('click', () => {
        applyTheme('light');
    });
    document.getElementById('ba-theme-dark').addEventListener('click', () => {
        applyTheme('dark');
    });

    // Contrast radio buttons
    document.querySelectorAll('input[name="ba-contrast-mode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            applyContrastFromRadio(e.target.value);
        });
    });

    // Reset section button
    document.getElementById('ba-reset-section').addEventListener('click', () => {
        if (lastOpenedSection) {
            resetSection(lastOpenedSection);
            announceToScreenReader(`${lastOpenedSection} section reset`);
        } else {
            announceToScreenReader('No section to reset. Expand a section first.');
        }
    });

    // Reset all button with confirmation
    document.getElementById('ba-reset-all').addEventListener('click', () => {
        document.getElementById('ba-dialog-overlay').classList.remove('ba-dialog-hidden');
        document.getElementById('ba-dialog-confirm').focus();
    });

    // Dialog handlers
    document.getElementById('ba-dialog-cancel').addEventListener('click', () => {
        document.getElementById('ba-dialog-overlay').classList.add('ba-dialog-hidden');
    });

    document.getElementById('ba-dialog-confirm').addEventListener('click', () => {
        fontSize.value = 16;
        lineHeight.value = 1.5;
        spacing.value = 0;
        fontFamily.value = '';
        cursorSize.value = 'default';
        highlightColor.value = '#fff176';
        updateValues();
        fontFamily.dispatchEvent(new Event('change'));
        applyTextSettings({ reset: true });
        document.querySelectorAll('.ba-preset-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('input[name="ba-contrast-mode"][value="none"]').checked = true;
        applyTheme('light');
        document.getElementById('ba-dialog-overlay').classList.add('ba-dialog-hidden');
        announceToScreenReader('All settings have been reset');
    });

    // Close dialog on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const dialog = document.getElementById('ba-dialog-overlay');
            if (!dialog.classList.contains('ba-dialog-hidden')) {
                dialog.classList.add('ba-dialog-hidden');
                document.getElementById('ba-reset-all').focus();
            }
        }
    });

    // Trap focus in dialog when open
    document.addEventListener('keydown', (e) => {
        const dialog = document.getElementById('ba-dialog-overlay');
        if (!dialog.classList.contains('ba-dialog-hidden') && e.key === 'Tab') {
            const focusableElements = dialog.querySelectorAll('button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
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


    document.addEventListener('click', (event) => {
        if (!panel.contains(event.target) && !icon.contains(event.target)) {
            panel.style.display = 'none';
        }
    });

    // Close panel on Escape key (but not dialog)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const dialog = document.getElementById('ba-dialog-overlay');
            // Only close panel if dialog is not open
            if (dialog.classList.contains('ba-dialog-hidden')) {
                panel.style.display = 'none';
            }
        }
    });
}
