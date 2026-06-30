/**
 * BarrierFreeWeb - Accessibility Widget
 * Chrome Extension: Main widget and UI functionality
 * Author: Poorani Ramakrishnan
 * License: MIT
 */

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
        <img src="${chrome.runtime.getURL('images/Robot_gif.gif')}" alt="BarrierFreeWeb Accessibility Controls" style="width: 100%; height: 100%; max-width: 46px; max-height: 46px; object-fit: contain; pointer-events: none; display: block;" />
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

    // Track active preset and backup settings before applying preset
    let activePreset = null;
    let presetBackup = null;
    let manuallyChanged = {
        fontSize: false,
        lineHeight: false,
        spacing: false,
        fontFamily: false
    };

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
            contrast: 'none',
            theme: 'dark'
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

        // Toggle functionality: if clicking the same preset, deactivate it
        if (activePreset === presetName) {
            console.log('🔄 BarrierFreeWeb: Deactivating preset:', presetName);
            
            // Restore all settings that were active BEFORE the preset
            if (presetBackup) {
                fontSize.value = presetBackup.fontSize;
                lineHeight.value = presetBackup.lineHeight;
                spacing.value = presetBackup.spacing;
                fontFamily.value = presetBackup.fontFamily;
                fontFamily.dispatchEvent(new Event('change'));
                
                // Restore contrast mode
                const contrastRadio = document.querySelector(`input[name="ba-contrast-mode"][value="${presetBackup.contrast}"]`);
                if (contrastRadio) {
                    contrastRadio.checked = true;
                    applyContrastFromRadio(presetBackup.contrast);
                }
                
                // Restore theme
                if (presetBackup.theme) {
                    document.querySelectorAll('.ba-theme-btn').forEach(btn => {
                        const isActive = btn.id === `ba-theme-${presetBackup.theme}`;
                        btn.classList.toggle('active', isActive);
                        btn.setAttribute('aria-pressed', isActive);
                    });
                    applyTheme(presetBackup.theme);
                }
            } else {
                // Fallback to defaults if backup is missing
                fontSize.value = 16;
                lineHeight.value = 1.5;
                spacing.value = 0;
                fontFamily.value = '';
                fontFamily.dispatchEvent(new Event('change'));
                
                // Restore to no contrast
                const noneRadio = document.querySelector('input[name="ba-contrast-mode"][value="none"]');
                if (noneRadio) {
                    noneRadio.checked = true;
                    applyContrastFromRadio('none');
                }
                
                // Restore to light theme
                document.querySelectorAll('.ba-theme-btn').forEach(btn => {
                    const isLight = btn.id === 'ba-theme-light';
                    btn.classList.toggle('active', isLight);
                    btn.setAttribute('aria-pressed', isLight);
                });
                applyTheme('light');
            }
            
            // Apply settings
            applyWidgetSettings();

            // Remove active button styling
            document.querySelectorAll('.ba-preset-btn').forEach(btn => btn.classList.remove('active'));
            
            activePreset = null;
            presetBackup = null;
            // Reset manually changed flags
            manuallyChanged = {
                fontSize: false,
                lineHeight: false,
                spacing: false,
                fontFamily: false
            };
            announceToScreenReader(`${presetName.replace('-', ' ')} preset deactivated`);
            return;
        }

        // Apply new preset
        console.log('✅ BarrierFreeWeb: Applying preset:', presetName);

        // Backup current settings BEFORE applying preset (including contrast mode and theme)
        const currentContrastRadio = document.querySelector('input[name="ba-contrast-mode"]:checked');
        const activeThemeBtn = document.querySelector('.ba-theme-btn.active');
        presetBackup = {
            fontSize: parseInt(fontSize.value),
            lineHeight: parseFloat(lineHeight.value),
            spacing: parseFloat(spacing.value),
            fontFamily: fontFamily.value,
            contrast: currentContrastRadio ? currentContrastRadio.value : 'none',
            theme: activeThemeBtn ? activeThemeBtn.id.replace('ba-theme-', '') : 'light'
        };

        // Only apply preset values to fields that haven't been manually changed
        // If a field was manually changed, preserve the current value
        if (!manuallyChanged.fontSize) {
            fontSize.value = config.fontSize;
        }
        if (!manuallyChanged.lineHeight) {
            lineHeight.value = config.lineHeight;
        }
        if (!manuallyChanged.spacing) {
            spacing.value = config.spacing;
        }
        if (!manuallyChanged.fontFamily) {
            fontFamily.value = config.fontFamily;
        }
        
        // Apply settings
        applyWidgetSettings();

        // Trigger font family change listener if font was set
        if (config.fontFamily) {
            fontFamily.dispatchEvent(new Event('change'));
        }

        // Apply contrast ONLY if preset explicitly specifies it
        if (config.contrast && config.contrast !== 'none') {
            const radioButton = document.querySelector(`input[name="ba-contrast-mode"][value="${config.contrast}"]`);
            if (radioButton) {
                radioButton.checked = true;
                applyContrastFromRadio(config.contrast);
            }
        } else if (config.contrast === 'none') {
            // Only set to none if preset explicitly defines it
            document.querySelector(`input[name="ba-contrast-mode"][value="none"]`).checked = true;
            applyContrastFromRadio('none');
        }
        // If preset doesn't specify contrast, leave current contrast mode as is

        // Apply theme ONLY if preset explicitly specifies it
        if (config.theme) {
            document.querySelectorAll('.ba-theme-btn').forEach(btn => {
                const isActive = btn.id === `ba-theme-${config.theme}`;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive);
            });
            applyTheme(config.theme);
        }
        // If preset doesn't specify theme, leave current theme as is

        // Visual feedback - update preset button styling
        document.querySelectorAll('.ba-preset-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-preset="${presetName}"]`).classList.add('active');

        activePreset = presetName;
        // Reset manually changed flags for the new preset
        manuallyChanged = {
            fontSize: false,
            lineHeight: false,
            spacing: false,
            fontFamily: false
        };

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
                * {
                    background-color: transparent !important;
                    color: #e0e0e0 !important;
                }
                a { color: #64b5f6 !important; }
                button, input, textarea, select {
                    background-color: #2a2a2a !important;
                    color: #e0e0e0 !important;
                    border-color: #444 !important;
                }
                /* Exclude widget from theme */
                #ba-access-widget, #ba-access-widget *, #ba-widget-panel, #ba-widget-panel * {
                    background-color: initial !important;
                    color: initial !important;
                }
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

    /**
     * Apply text styling to the page with !important flags to override existing CSS
     * Widget panel is excluded from these changes
     */
    function applyTextSettings(settings) {
        // Create or update the text settings style tag
        let textSettingsStyle = document.getElementById('ba-text-settings-style');
        if (!textSettingsStyle) {
            textSettingsStyle = document.createElement('style');
            textSettingsStyle.id = 'ba-text-settings-style';
            document.head.appendChild(textSettingsStyle);
            console.log('✅ BFW: Created ba-text-settings-style tag');
        }

        if (settings && settings.reset) {
            textSettingsStyle.textContent = '';
            console.log('✅ BFW: Reset text settings CSS');
            return;
        }

        // Use settings or get from form values
        const fontSize = settings?.fontSize || parseFloat(document.getElementById('ba-fontSize').value);
        const lineHeight = settings?.lineHeight || document.getElementById('ba-lineHeight').value;
        const spacing = settings?.spacing || parseFloat(document.getElementById('ba-spacing').value);
        const fontFamily = settings?.fontFamily || document.getElementById('ba-fontFamily').value;
        const cursorSize = settings?.cursorSize || document.getElementById('ba-cursorSize').value;

        console.log('🎨 BFW: applyTextSettings - fontSize:', fontSize, 'lineHeight:', lineHeight, 'spacing:', spacing, 'fontFamily:', fontFamily);

        let cssRules = `
            @import url('https://fonts.googleapis.com/css2?family=Open+Dyslexic:wght@400;700&display=swap');
            
            /* Apply to all elements with high specificity */
            * {
                font-size: ${fontSize}px !important;
                line-height: ${lineHeight} !important;
                letter-spacing: ${spacing}px !important;
            }
            
            html {
                font-size: ${fontSize}px !important;
            }
            
            /* Exclude widget panel from text settings - triple specificity */
            body #ba-access-widget,
            body #ba-access-widget *,
            body #ba-widget-panel,
            body #ba-widget-panel * {
                font-size: initial !important;
                line-height: initial !important;
                letter-spacing: initial !important;
            }
            
            /* Exclude header and navigation elements from font size changes */
            header,
            header *,
            nav,
            nav *,
            .navbar,
            .navbar *,
            .site-header,
            .site-header *,
            .header,
            .header *,
            .navigation,
            .navigation *,
            .menu,
            .menu *,
            [role="navigation"],
            [role="navigation"] * {
                font-size: initial !important;
                line-height: initial !important;
                letter-spacing: initial !important;
            }
        `;

        if (fontFamily) {
            cssRules += `
                /* Apply font family to all elements */
                * {
                    font-family: ${fontFamily} !important;
                }
                
                /* Exclude widget panel from font family changes - triple specificity */
                body #ba-access-widget,
                body #ba-access-widget *,
                body #ba-widget-panel,
                body #ba-widget-panel * {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
                }
                
                /* Exclude header and navigation from font family changes */
                header,
                header *,
                nav,
                nav *,
                .navbar,
                .navbar *,
                .site-header,
                .site-header *,
                .header,
                .header *,
                .navigation,
                .navigation *,
                .menu,
                .menu *,
                [role="navigation"],
                [role="navigation"] * {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
                }
            `;
        }

        // Apply cursor size
        if (cursorSize && cursorSize !== 'default') {
            const cursorUrl = chrome.runtime.getURL(`images/${cursorSize}-cursor.svg`);
            let cursorCSS = ``;
            if (cursorSize === 'large') {
                cursorCSS = `
                    body { cursor: url('${cursorUrl}') 12 12, auto !important; }
                `;
            } else if (cursorSize === 'xlarge') {
                cursorCSS = `
                    body { cursor: url('${cursorUrl}') 16 16, auto !important; }
                `;
            }
            cssRules += cursorCSS;
        }

        textSettingsStyle.textContent = cssRules;
        console.log('✅ BFW: Text settings CSS applied to page');
    }

    /**
     * Clear contrast effects from the page
     */
    function clearAllContrastEffects() {
        const contrastStyle = document.getElementById('ba-contrast-style');
        if (contrastStyle) {
            contrastStyle.remove();
        }
    }

    /**
     * Clear cursor size
     */
    function clearCursorSize() {
        // This is handled by applyTextSettings
    }

    /**
     * Apply contrast effect
     */
    function applyContrastEffect(mode, shouldApply) {
        let contrastStyle = document.getElementById('ba-contrast-style');
        if (!contrastStyle) {
            contrastStyle = document.createElement('style');
            contrastStyle.id = 'ba-contrast-style';
            document.head.appendChild(contrastStyle);
        }

        if (!shouldApply) {
            contrastStyle.remove();
            return;
        }

        let css = '';
        const widgetExclusion = `
            /* Exclude widget panel from contrast effects */
            #ba-access-widget,
            #ba-access-widget *,
            #ba-widget-panel,
            #ba-widget-panel * {
                filter: none !important;
                background-color: initial !important;
                color: initial !important;
            }
        `;

        switch(mode) {
            case 'invert':
                css = `
                    * { filter: invert(1) !important; }
                    ${widgetExclusion}
                `;
                break;
            case 'dark':
                css = `
                    * {
                        background-color: transparent !important;
                        color: #e0e0e0 !important;
                    }
                    body {
                        background-color: #1a1a1a !important;
                    }
                    a { color: #64b5f6 !important; }
                    ${widgetExclusion}
                `;
                break;
            case 'light':
                css = `
                    * {
                        background-color: transparent !important;
                        color: #000000 !important;
                    }
                    body {
                        background-color: #f5f5f5 !important;
                    }
                    a { color: #0066cc !important; }
                    ${widgetExclusion}
                `;
                break;
            case 'high':
                css = `
                    * {
                        background-color: transparent !important;
                        color: #ffffff !important;
                        border-color: #ffffff !important;
                    }
                    body {
                        background-color: #000000 !important;
                    }
                    a { color: #ffff00 !important; }
                    button, input, select, textarea {
                        border: 2px solid #ffffff !important;
                        background-color: #1a1a1a !important;
                    }
                    ${widgetExclusion}
                `;
                break;
            case 'desaturate':
                css = `
                    * { filter: saturate(0) !important; }
                    ${widgetExclusion}
                `;
                break;
        }
        contrastStyle.textContent = css;
    }

    function updateValues() {
        const fontSize = parseInt(document.getElementById('ba-fontSize').value);
        fontSizeLabel.textContent = getFontSizeLabel(fontSize);
        lineHeightValue.textContent = lineHeight.value;
        spacingValue.textContent = spacing.value;
    }

    function applyWidgetSettings() {
        console.log('🔧 BFW: applyWidgetSettings called');
        updateValues();
        const settings = {
            fontSize: parseFloat(fontSize.value),
            lineHeight: lineHeight.value,
            spacing: parseFloat(spacing.value),
            fontFamily: fontFamily.value,
            cursorSize: cursorSize.value,
        };
        console.log('🔧 BFW: Applying settings:', settings);
        applyTextSettings(settings);
    }

    // Track manual changes to text dimensions while preset is active
    fontSize.addEventListener('input', () => {
        applyWidgetSettings();
        // Mark as manually changed if a preset is active
        if (activePreset) {
            manuallyChanged.fontSize = true;
        }
    });
    lineHeight.addEventListener('input', () => {
        applyWidgetSettings();
        // Mark as manually changed if a preset is active
        if (activePreset) {
            manuallyChanged.lineHeight = true;
        }
    });
    spacing.addEventListener('input', () => {
        applyWidgetSettings();
        // Mark as manually changed if a preset is active
        if (activePreset) {
            manuallyChanged.spacing = true;
        }
    });
    fontFamily.addEventListener('change', () => {
        applyWidgetSettings();
        // Mark as manually changed if a preset is active
        if (activePreset) {
            manuallyChanged.fontFamily = true;
        }
    });
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
        const isCurrentlyLight = document.getElementById('ba-theme-light').getAttribute('aria-pressed') === 'true';
        if (isCurrentlyLight) {
            // Already light, do nothing
            return;
        }
        applyTheme('light');
        
        // Deactivate any preset since theme was manually changed
        if (activePreset) {
            document.querySelectorAll('.ba-preset-btn').forEach(b => b.classList.remove('active'));
            activePreset = null;
            presetBackup = null;
        }
    });
    document.getElementById('ba-theme-dark').addEventListener('click', () => {
        const isCurrentlyDark = document.getElementById('ba-theme-dark').getAttribute('aria-pressed') === 'true';
        if (isCurrentlyDark) {
            // Toggle off: revert to light theme
            applyTheme('light');
            
            // Deactivate Dark Mode preset if it's active
            if (activePreset === 'dark-mode') {
                document.querySelectorAll('.ba-preset-btn').forEach(b => b.classList.remove('active'));
                activePreset = null;
                presetBackup = null;
            }
        } else {
            // Toggle on: apply dark theme
            applyTheme('dark');
            
            // Deactivate any other preset since theme was manually changed
            if (activePreset) {
                document.querySelectorAll('.ba-preset-btn').forEach(b => b.classList.remove('active'));
                activePreset = null;
                presetBackup = null;
            }
        }
    });

    // Contrast radio buttons
    document.querySelectorAll('input[name="ba-contrast-mode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            applyContrastFromRadio(e.target.value);
        });
    });

    /**
     * Reset a specific section to defaults
     */
    function resetSection(section) {
        switch(section) {
            case 'text-dimensions':
                fontSize.value = 16;
                lineHeight.value = 1.5;
                spacing.value = 0;
                updateValues();
                applyWidgetSettings();
                break;
            case 'typography':
                fontFamily.value = '';
                fontFamily.dispatchEvent(new Event('change'));
                break;
            case 'highlight':
                clearAllHighlights();
                highlightColor.value = '#fff176';
                break;
            case 'contrast':
                clearAllContrastEffects();
                document.querySelector('input[name="ba-contrast-mode"][value="none"]').checked = true;
                break;
            case 'presets':
                activePreset = null;
                document.querySelectorAll('.ba-preset-btn').forEach(btn => btn.classList.remove('active'));
                break;
        }
    }

    /**
     * Clear all highlights from the page
     */
    function clearAllHighlights() {
        document.querySelectorAll('.ba-highlighted').forEach(el => {
            const styles = el.getAttribute('data-original-style');
            if (styles) {
                el.setAttribute('style', styles);
            } else {
                el.removeAttribute('style');
            }
            el.classList.remove('ba-highlighted');
            el.removeAttribute('data-original-style');
        });
    }

    /**
     * Highlight selected text on the page
     */
    function highlightSelection(color) {
        const selection = window.getSelection();
        if (!selection.toString()) {
            announceToScreenReader('No text selected. Please select text to highlight.');
            return;
        }

        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'ba-highlighted';
        span.style.backgroundColor = color;
        span.style.color = 'inherit';
        
        try {
            range.surroundContents(span);
        } catch (e) {
            // If surroundContents fails, use insertNode as fallback
            const fragment = range.extractContents();
            span.appendChild(fragment);
            range.insertNode(span);
        }

        selection.removeAllRanges();
        announceToScreenReader('Text highlighted with color ' + color);
    }

    /**
     * Toggle highlighting of all links on the page
     */
    function toggleLinkHighlights(color) {
        const links = document.querySelectorAll('a');
        let isHighlighting = false;

        links.forEach(link => {
            if (link.classList.contains('ba-highlighted')) {
                const styles = link.getAttribute('data-original-style');
                if (styles) {
                    link.setAttribute('style', styles);
                } else {
                    link.removeAttribute('style');
                }
                link.classList.remove('ba-highlighted');
                link.removeAttribute('data-original-style');
            } else {
                link.setAttribute('data-original-style', link.getAttribute('style') || '');
                link.style.backgroundColor = color;
                link.classList.add('ba-highlighted');
                isHighlighting = true;
            }
        });

        return isHighlighting;
    }

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
        clearAllContrastEffects();
        clearCursorSize();
        clearAllHighlights();
        document.querySelectorAll('.ba-preset-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('input[name="ba-contrast-mode"][value="none"]').checked = true;
        activePreset = null;
        presetBackup = null;
        // Reset manually changed flags
        manuallyChanged = {
            fontSize: false,
            lineHeight: false,
            spacing: false,
            fontFamily: false
        };
        applyTheme('light');
        
        // Collapse all sections except Quick Presets
        document.querySelectorAll('.ba-group').forEach(group => {
            const section = group.getAttribute('data-section');
            const toggle = group.querySelector('.ba-group-toggle');
            const indicator = toggle ? toggle.querySelector('.ba-group-indicator') : null;
            
            if (section === 'presets') {
                // Keep Quick Presets expanded
                group.classList.remove('collapsed');
                toggle.setAttribute('aria-expanded', 'true');
                if (indicator) indicator.textContent = '-';
            } else {
                // Collapse all other sections
                group.classList.add('collapsed');
                toggle.setAttribute('aria-expanded', 'false');
                if (indicator) indicator.textContent = '+';
            }
        });
        
        // Reset icon position to default (bottom-right)
        icon.style.left = 'auto';
        icon.style.top = 'auto';
        icon.style.right = '20px';
        icon.style.bottom = '20px';
        panel.style.left = 'auto';
        panel.style.top = 'auto';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        
        // Re-run positioning logic so the panel remains on-screen
        if (typeof updateWidgetPosition === 'function' && icon) {
            const defaultX = window.innerWidth - 70; // icon width ~50px + 20px margin
            const defaultY = window.innerHeight - 70; // icon height ~50px + 20px margin
            updateWidgetPosition(defaultX, defaultY);
        }
        
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
