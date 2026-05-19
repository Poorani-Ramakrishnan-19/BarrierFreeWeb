/**
 * BarrierFreeWeb Accessibility Widget
 * Main JavaScript file for frontend widget functionality
 * Author: Poorani Ramakrishnan
 * License: MIT
 */

(function() {
    'use strict';

    /**
     * Widget Configuration and Defaults
     */
    const CONFIG = {
        storageKey: 'barrierfreeweb_settings',
        defaults: {
            fontSize: 16,
            lineHeight: 1.5,
            letterSpacing: 0,
            fontFamily: '',
            cursorSize: 'default',
            contrastMode: 'none',
            theme: 'light',
            highlightColor: '#fff176'
        }
    };
    
    /**
     * Track last opened section for Reset Section button
     */
    let lastOpenedSection = null;

    /**
     * Track active preset for toggle functionality
     */
    let activePreset = null;

    /**
     * Initialize widget when DOM is ready
     */
    function init() {
        // Try to get container
        let container = document.getElementById('bfw-widget-container');
        
        if (container) {
            console.log('✅ BarrierFreeWeb: Widget container found, initializing...');
            createWidget();
            return;
        }
        
        // If not found and DOM still loading, wait
        if (document.readyState === 'loading') {
            console.log('⏳ BarrierFreeWeb: DOM still loading, waiting for DOMContentLoaded...');
            document.addEventListener('DOMContentLoaded', function() {
                container = document.getElementById('bfw-widget-container');
                if (container) {
                    console.log('✅ BarrierFreeWeb: Widget container found after DOM load, initializing...');
                    createWidget();
                } else {
                    console.error('❌ BarrierFreeWeb: Widget container NOT found after DOM load');
                }
            });
            return;
        }
        
        console.error('❌ BarrierFreeWeb: Widget container not found and DOM already loaded');
    }

    /**
     * Create the floating widget and attach to page
     */
    function createWidget() {
        const container = document.getElementById('bfw-widget-container');
        if (!container) {
            console.error('❌ BarrierFreeWeb: Container not found');
            return;
        }

        const settings = loadSettings();
        
        // Get plugin URL from localized data if available
        const pluginUrl = (typeof barrierFreeWeb !== 'undefined' && barrierFreeWeb.pluginUrl) 
            ? barrierFreeWeb.pluginUrl 
            : '';
        
        const robotGifUrl = pluginUrl ? pluginUrl + 'images/Robot_gif.gif' : '';
        
        console.log('BarrierFreeWeb: Plugin URL:', pluginUrl);
        console.log('BarrierFreeWeb: Robot GIF URL:', robotGifUrl);

        const widgetHTML = `
            <div class="bfw-widget" id="bfw-widget" role="region" aria-label="Accessibility Controls">
                <!-- Floating Button -->
                <button 
                    class="bfw-widget-button" 
                    id="bfw-toggle-btn" 
                    aria-label="Open accessibility controls"
                    aria-expanded="false"
                    title="BarrierFreeWeb - Accessibility Controls"
                >
                    ${robotGifUrl ? `<img src="${robotGifUrl}" alt="BarrierFreeWeb" class="bfw-icon-image">` : '<span class="bfw-icon">♿</span>'}
                </button>

                <!-- Widget Panel -->
                <div class="bfw-widget-panel" id="bfw-panel" hidden aria-hidden="true">
                    <div class="bfw-panel-header">
                        <h2>Accessibility Controls</h2>
                        <button class="bfw-close-btn" id="bfw-close-btn" aria-label="Close">✕</button>
                    </div>

                    <div class="bfw-panel-content">
                        <!-- Quick Presets Section (Expanded) -->
                        <div class="bfw-group" data-section="presets">
                            <button type="button" class="bfw-group-toggle" aria-expanded="true" aria-label="Quick Presets">
                                <span class="bfw-group-title">Quick Presets</span>
                                <span class="bfw-group-indicator">−</span>
                            </button>
                            <div class="bfw-group-content">
                                <div class="bfw-preset-grid">
                                    <button class="bfw-preset-btn" data-preset="low-vision" title="Optimized for low vision">👁 Low Vision</button>
                                    <button class="bfw-preset-btn" data-preset="dark-mode" title="Dark background">🌙 Dark Mode</button>
                                    <button class="bfw-preset-btn" data-preset="dyslexia" title="Dyslexia friendly">🧠 Dyslexia</button>
                                    <button class="bfw-preset-btn" data-preset="large-text" title="Larger fonts">👵 Large Text</button>
                                </div>
                                <p class="bfw-tip-text">Tip: Customize further below</p>
                            </div>
                        </div>

                        <!-- Theme Section (Expanded) -->
                        <div class="bfw-group" data-section="theme">
                            <button type="button" class="bfw-group-toggle" aria-expanded="true" aria-label="Theme">
                                <span class="bfw-group-title">Theme</span>
                                <span class="bfw-group-indicator">−</span>
                            </button>
                            <div class="bfw-group-content">
                                <div style="display: flex; gap: 8px;">
                                    <button class="bfw-theme-btn ${settings.theme === 'light' ? 'active' : ''}" data-theme="light">☀️ Light</button>
                                    <button class="bfw-theme-btn ${settings.theme === 'dark' ? 'active' : ''}" data-theme="dark">🌙 Dark</button>
                                </div>
                            </div>
                        </div>

                        <!-- Text Dimensions Section (Expanded) -->
                        <div class="bfw-group" data-section="text-dimensions">
                            <button type="button" class="bfw-group-toggle" aria-expanded="true" aria-label="Text Dimensions">
                                <span class="bfw-group-title">Text Dimensions</span>
                                <span class="bfw-group-indicator">−</span>
                            </button>
                            <div class="bfw-group-content">
                                <div class="bfw-control-group">
                                    <label for="bfw-font-size">Font Size: <strong><span id="bfw-font-size-value">${settings.fontSize}</span>px</strong></label>
                                    <input type="range" id="bfw-font-size" min="12" max="28" value="${settings.fontSize}">
                                </div>

                                <div class="bfw-control-group">
                                    <label for="bfw-line-height">Line Height: <strong><span id="bfw-line-height-value">${settings.lineHeight}</span></strong></label>
                                    <input type="range" id="bfw-line-height" min="1" max="3" step="0.1" value="${settings.lineHeight}">
                                </div>

                                <div class="bfw-control-group">
                                    <label for="bfw-letter-spacing">Letter Spacing: <strong><span id="bfw-letter-spacing-value">${settings.letterSpacing}</span>px</strong></label>
                                    <input type="range" id="bfw-letter-spacing" min="0" max="5" step="0.1" value="${settings.letterSpacing}">
                                </div>
                            </div>
                        </div>

                        <!-- Typography Section (Collapsed) -->
                        <div class="bfw-group bfw-group-collapsed" data-section="typography">
                            <button type="button" class="bfw-group-toggle" aria-expanded="false" aria-label="Typography">
                                <span class="bfw-group-title">Typography</span>
                                <span class="bfw-group-indicator">+</span>
                            </button>
                            <div class="bfw-group-content" style="display: none;">
                                <div class="bfw-control-group">
                                    <label for="bfw-font-family">Font Family:</label>
                                    <select id="bfw-font-family">
                                        <option value="">Default (System)</option>
                                        <option value="Arial, sans-serif">Arial (Sans-serif)</option>
                                        <option value="Verdana, sans-serif">Verdana (Clean)</option>
                                        <option value="Georgia, serif">Georgia (Serif)</option>
                                        <option value="'Times New Roman', serif">Times New Roman (Classic)</option>
                                        <option value="'Open Dyslexic', cursive">Open Dyslexic (Dyslexia-friendly)</option>
                                    </select>
                                </div>
                                <div class="bfw-control-group">
                                    <label for="bfw-cursor-size">Cursor Size:</label>
                                    <select id="bfw-cursor-size">
                                        <option value="default">Default</option>
                                        <option value="large">Large</option>
                                        <option value="xlarge">Extra Large</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Highlighting Section (Collapsed) -->
                        <div class="bfw-group bfw-group-collapsed" data-section="highlighting">
                            <button type="button" class="bfw-group-toggle" aria-expanded="false" aria-label="Highlighting">
                                <span class="bfw-group-title">Highlighting</span>
                                <span class="bfw-group-indicator">+</span>
                            </button>
                            <div class="bfw-group-content" style="display: none;">
                                <div style="display: flex; flex-direction: column; gap: 8px;">
                                    <button class="bfw-highlight-btn" id="bfw-highlight-links" title="Highlight/unhighlight all links" style="width: 100%;">🔗 Highlight Links</button>
                                    
                                    <div class="bfw-control-group">
                                        <label for="bfw-highlight-color">🎨 Highlight Color</label>
                                        <input type="color" id="bfw-highlight-color" value="${settings.highlightColor}" style="width: 100%; padding: 6px;">
                                    </div>
                                    
                                    <button class="bfw-highlight-btn" id="bfw-highlight-selection" title="Highlight selected text" style="width: 100%;">✏️ Highlight Selection</button>
                                    <button class="bfw-highlight-btn" id="bfw-clear-highlights" title="Clear all highlights" style="width: 100%;">🗑️ Clear Highlights</button>
                                </div>
                            </div>
                        </div>

                        <!-- Contrast Section (Collapsed) -->
                        <div class="bfw-group bfw-group-collapsed" data-section="contrast">
                            <button type="button" class="bfw-group-toggle" aria-expanded="false" aria-label="Contrast">
                                <span class="bfw-group-title">Contrast</span>
                                <span class="bfw-group-indicator">+</span>
                            </button>
                            <div class="bfw-group-content" style="display: none;">
                                <div class="bfw-contrast-options">
                                    <label class="bfw-contrast-option">
                                        <input type="radio" name="bfw-contrast-mode" value="none" checked aria-label="No contrast mode">
                                        <div class="bfw-contrast-text">
                                            <span class="bfw-contrast-label">None</span>
                                            <span class="bfw-contrast-help">Default colors</span>
                                        </div>
                                    </label>
                                    <label class="bfw-contrast-option">
                                        <input type="radio" name="bfw-contrast-mode" value="invert" aria-label="Invert colors mode">
                                        <div class="bfw-contrast-text">
                                            <span class="bfw-contrast-label">🔄 Invert</span>
                                            <span class="bfw-contrast-help">Reversed colors</span>
                                        </div>
                                    </label>
                                    <label class="bfw-contrast-option">
                                        <input type="radio" name="bfw-contrast-mode" value="dark" aria-label="Dark contrast mode">
                                        <div class="bfw-contrast-text">
                                            <span class="bfw-contrast-label">🌙 Dark</span>
                                            <span class="bfw-contrast-help">Dark background, light text</span>
                                        </div>
                                    </label>
                                    <label class="bfw-contrast-option">
                                        <input type="radio" name="bfw-contrast-mode" value="light" aria-label="Light contrast mode">
                                        <div class="bfw-contrast-text">
                                            <span class="bfw-contrast-label">☀️ Light</span>
                                            <span class="bfw-contrast-help">Light background, dark text</span>
                                        </div>
                                    </label>
                                    <label class="bfw-contrast-option">
                                        <input type="radio" name="bfw-contrast-mode" value="high" aria-label="High contrast mode">
                                        <div class="bfw-contrast-text">
                                            <span class="bfw-contrast-label">⚡ High</span>
                                            <span class="bfw-contrast-help">Maximum contrast</span>
                                        </div>
                                    </label>
                                    <label class="bfw-contrast-option">
                                        <input type="radio" name="bfw-contrast-mode" value="desaturate" aria-label="Desaturate mode">
                                        <div class="bfw-contrast-text">
                                            <span class="bfw-contrast-label">⚪ Desaturate</span>
                                            <span class="bfw-contrast-help">Grayscale colors</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Reset Section (Collapsed) -->
                        <div class="bfw-group bfw-group-collapsed" data-section="reset">
                            <button type="button" class="bfw-group-toggle" aria-expanded="false" aria-label="Reset">
                                <span class="bfw-group-title">Reset</span>
                                <span class="bfw-group-indicator">+</span>
                            </button>
                            <div class="bfw-group-content" style="display: none;">
                                <div style="display: flex; gap: 8px; flex-direction: column;">
                                    <button class="bfw-reset-btn" id="bfw-reset-section-btn">Reset Section</button>
                                    <button class="bfw-reset-btn" id="bfw-reset-all-btn">Reset All</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bfw-panel-footer">
                        <small>Settings saved locally in your browser</small>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = widgetHTML;
        console.log('✅ BarrierFreeWeb: Widget HTML created with', document.querySelectorAll('.bfw-group').length, 'sections');
        applySavedSettings(settings);
        attachEventListeners();
    }

    /**
     * Attach event listeners to widget controls
     */
    function attachEventListeners() {
        const toggleBtn = document.getElementById('bfw-toggle-btn');
        const closeBtn = document.getElementById('bfw-close-btn');
        const panel = document.getElementById('bfw-panel');
        
        if (!toggleBtn || !panel) {
            console.error('❌ BarrierFreeWeb: Critical elements not found. Toggle:', !!toggleBtn, 'Panel:', !!panel);
            return;
        }
        
        console.log('✅ BarrierFreeWeb: Attaching event listeners to', toggleBtn);
        
        const fontSizeSlider = document.getElementById('bfw-font-size');
        const lineHeightSlider = document.getElementById('bfw-line-height');
        const letterSpacingSlider = document.getElementById('bfw-letter-spacing');
        const contrastToggle = document.getElementById('bfw-contrast-toggle');
        const highlightColorInput = document.getElementById('bfw-highlight-color');
        const resetBtn = document.getElementById('bfw-reset-btn');
        const presetBtns = document.querySelectorAll('.bfw-preset-btn');
        const themeBtns = document.querySelectorAll('.bfw-theme-btn');

        // Toggle panel
        toggleBtn.addEventListener('click', () => {
            console.log('BarrierFreeWeb: Toggle button clicked, panel hidden state:', panel.hidden);
            
            if (panel.hidden) {
                // Show panel
                panel.removeAttribute('hidden');
                panel.setAttribute('aria-hidden', 'false');
                toggleBtn.setAttribute('aria-expanded', 'true');
                console.log('✅ BarrierFreeWeb: Panel shown');
            } else {
                // Hide panel
                panel.setAttribute('hidden', '');
                panel.setAttribute('aria-hidden', 'true');
                toggleBtn.setAttribute('aria-expanded', 'false');
                console.log('✅ BarrierFreeWeb: Panel hidden');
            }
        });

        // Close panel
        closeBtn.addEventListener('click', () => {
            panel.setAttribute('hidden', '');
            panel.setAttribute('aria-hidden', 'true');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
            console.log('✅ BarrierFreeWeb: Panel closed via close button');
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !panel.hidden) {
                panel.setAttribute('hidden', '');
                panel.setAttribute('aria-hidden', 'true');
                toggleBtn.setAttribute('aria-expanded', 'false');
                console.log('✅ BarrierFreeWeb: Panel closed via Escape key');
            }
        });

        // Font size slider
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                applyTextSettings();
                document.getElementById('bfw-font-size-value').textContent = e.target.value;
                saveSettings();
            });
        } else {
            console.warn('⚠️ BarrierFreeWeb: Font size slider not found');
        }

        // Line height slider
        if (lineHeightSlider) {
            lineHeightSlider.addEventListener('input', (e) => {
                applyTextSettings();
                document.getElementById('bfw-line-height-value').textContent = parseFloat(e.target.value).toFixed(1);
                saveSettings();
            });
        } else {
            console.warn('⚠️ BarrierFreeWeb: Line height slider not found');
        }

        // Letter spacing slider
        if (letterSpacingSlider) {
            letterSpacingSlider.addEventListener('input', (e) => {
                applyTextSettings();
                document.getElementById('bfw-letter-spacing-value').textContent = e.target.value;
                saveSettings();
            });
        } else {
            console.warn('⚠️ BarrierFreeWeb: Letter spacing slider not found');
        }

        // Contrast mode radio buttons
        const contrastRadios = document.querySelectorAll('input[name="bfw-contrast-mode"]');
        if (contrastRadios.length > 0) {
            contrastRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    applyContrastMode(e.target.value);
                    saveSettings();
                });
            });
            console.log('✅ BarrierFreeWeb: Contrast mode radio buttons attached');
        } else {
            console.warn('⚠️ BarrierFreeWeb: Contrast mode radio buttons not found');
        }

        // Collapsible group toggles
        const groupToggles = document.querySelectorAll('.bfw-group-toggle');
        if (groupToggles.length > 0) {
            groupToggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const group = toggle.closest('.bfw-group');
                    const content = group.querySelector('.bfw-group-content');
                    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                    
                    // Toggle the collapsed state
                    if (isExpanded) {
                        group.classList.add('bfw-group-collapsed');
                        content.style.display = 'none';
                        toggle.setAttribute('aria-expanded', 'false');
                        const indicator = toggle.querySelector('.bfw-group-indicator');
                        indicator.textContent = '+';
                    } else {
                        group.classList.remove('bfw-group-collapsed');
                        content.style.display = 'block';
                        toggle.setAttribute('aria-expanded', 'true');
                        const indicator = toggle.querySelector('.bfw-group-indicator');
                        indicator.textContent = '−';
                    }
                    
                    // Track the opened section
                    const sectionName = group.dataset.section;
                    if (!isExpanded) {
                        lastOpenedSection = sectionName;
                        console.log('✅ BarrierFreeWeb: Opened section:', sectionName);
                    }
                });
            });
            console.log('✅ BarrierFreeWeb: Group toggle buttons attached');
        }

        // Highlight color
        if (highlightColorInput) {
            highlightColorInput.addEventListener('change', () => {
                saveSettings();
            });
        }

        console.log('✅ BarrierFreeWeb: All event listeners attached successfully');
        console.log('📊 Found:', {
            presets: presetBtns.length,
            themeButtons: themeBtns.length,
            resetButton: !!resetBtn
        });

        // Theme buttons
        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                themeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyTheme(btn.dataset.theme);
                saveSettings();
            });
        });

        // Preset buttons
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
        });

        // Highlight buttons
        const highlightLinksBtn = document.getElementById('bfw-highlight-links');
        if (highlightLinksBtn) {
            highlightLinksBtn.addEventListener('click', () => {
                toggleLinkHighlights();
            });
        }
        
        document.getElementById('bfw-highlight-selection').addEventListener('click', highlightSelection);
        document.getElementById('bfw-clear-highlights').addEventListener('click', clearAllHighlights);

        // Font family dropdown
        const fontFamilySelect = document.getElementById('bfw-font-family');
        if (fontFamilySelect) {
            const savedFontFamily = localStorage.getItem(CONFIG.storageKey) 
                ? JSON.parse(localStorage.getItem(CONFIG.storageKey)).fontFamily || ''
                : '';
            fontFamilySelect.value = savedFontFamily;
            
            fontFamilySelect.addEventListener('change', (e) => {
                const fontFamily = e.target.value;
                if (fontFamily) {
                    document.body.style.fontFamily = fontFamily;
                } else {
                    document.body.style.fontFamily = '';
                }
                saveSettings();
            });
        }

        // Cursor size dropdown
        const cursorSizeSelect = document.getElementById('bfw-cursor-size');
        if (cursorSizeSelect) {
            const savedCursorSize = localStorage.getItem(CONFIG.storageKey) 
                ? JSON.parse(localStorage.getItem(CONFIG.storageKey)).cursorSize || 'default'
                : 'default';
            cursorSizeSelect.value = savedCursorSize;
            
            cursorSizeSelect.addEventListener('change', (e) => {
                applyCursorSize(e.target.value);
                saveSettings();
            });
        }

        // Reset Section button - resets only the most recently opened section
        const resetSectionBtn = document.getElementById('bfw-reset-section-btn');
        if (resetSectionBtn) {
            resetSectionBtn.addEventListener('click', () => {
                console.log('BarrierFreeWeb: Reset Section clicked, lastOpenedSection:', lastOpenedSection);
                // For now, reset all text settings as the "current" section
                resetTextSettings();
                saveSettings();
            });
        }

        // Reset All button
        const resetAllBtn = document.getElementById('bfw-reset-all-btn');
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', () => {
                if (confirm('Reset all accessibility settings to default?')) {
                    resetSettings();
                }
            });
        }
    }

    /**
     * Reset text settings to defaults
     */
    function resetTextSettings() {
        document.getElementById('bfw-font-size').value = CONFIG.defaults.fontSize;
        document.getElementById('bfw-line-height').value = CONFIG.defaults.lineHeight;
        document.getElementById('bfw-letter-spacing').value = CONFIG.defaults.letterSpacing;
        document.getElementById('bfw-font-family').value = CONFIG.defaults.fontFamily;
        document.getElementById('bfw-cursor-size').value = CONFIG.defaults.cursorSize;
        
        applyTextSettings();
        applyCursorSize(CONFIG.defaults.cursorSize);
        updateDisplayValues();
    }

    /**
     * Apply text styling based on current slider values
     */
    function applyTextSettings() {
        const fontSize = document.getElementById('bfw-font-size').value;
        const lineHeight = document.getElementById('bfw-line-height').value;
        const letterSpacing = document.getElementById('bfw-letter-spacing').value;
        const fontFamily = document.getElementById('bfw-font-family').value;

        document.documentElement.style.fontSize = fontSize + 'px';
        document.body.style.fontSize = fontSize + 'px';
        document.body.style.lineHeight = lineHeight;
        document.body.style.letterSpacing = letterSpacing + 'px';
        
        if (fontFamily) {
            document.body.style.fontFamily = fontFamily;
        }
    }

    /**
     * Apply contrast mode
     */
    function applyContrastMode(mode) {
        // Remove all contrast mode classes
        document.body.classList.remove(
            'bfw-contrast-invert',
            'bfw-contrast-dark',
            'bfw-contrast-light',
            'bfw-contrast-high',
            'bfw-contrast-desaturate'
        );
        
        // Add the selected mode class (if not 'none')
        if (mode !== 'none') {
            document.body.classList.add('bfw-contrast-' + mode);
        }
        
        console.log('✅ BarrierFreeWeb: Contrast mode applied:', mode);
    }

    /**
     * Apply theme (light or dark)
     */
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('bfw-dark-theme');
        } else {
            document.body.classList.remove('bfw-dark-theme');
        }
    }

    /**
     * Apply cursor size
     */
    function applyCursorSize(size) {
        // Remove all cursor classes
        document.body.classList.remove('bfw-cursor-large', 'bfw-cursor-xlarge');
        
        // Add appropriate class
        if (size === 'large') {
            document.body.classList.add('bfw-cursor-large');
        } else if (size === 'xlarge') {
            document.body.classList.add('bfw-cursor-xlarge');
        }
    }

    /**
     * Apply preset configurations
     */
    function applyPreset(preset) {
        const presets = {
            'low-vision': { fontSize: 20, lineHeight: 1.8, letterSpacing: 1, fontFamily: 'Arial, sans-serif', contrastMode: 'high' },
            'dark-mode': { fontSize: 16, lineHeight: 1.6, letterSpacing: 0, theme: 'dark', contrastMode: 'none' },
            'dyslexia': { fontSize: 18, lineHeight: 1.8, letterSpacing: 0.2, fontFamily: "'Open Dyslexic', cursive", contrastMode: 'none' },
            'large-text': { fontSize: 24, lineHeight: 1.8, letterSpacing: 0.1, contrastMode: 'none' }
        };

        // Toggle functionality: if clicking the same preset, deactivate it
        if (activePreset === preset) {
            console.log('🔄 BarrierFreeWeb: Deactivating preset:', preset);
            
            // Reset to defaults
            document.getElementById('bfw-font-size').value = CONFIG.defaults.fontSize;
            document.getElementById('bfw-line-height').value = CONFIG.defaults.lineHeight;
            document.getElementById('bfw-letter-spacing').value = CONFIG.defaults.letterSpacing;
            document.getElementById('bfw-font-family').value = CONFIG.defaults.fontFamily;
            
            // Reset contrast to none
            const contrastRadio = document.querySelector('input[name="bfw-contrast-mode"][value="none"]');
            if (contrastRadio) {
                contrastRadio.checked = true;
                applyContrastMode('none');
            }

            // Reset theme buttons to default (light)
            document.querySelectorAll('.bfw-theme-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.theme === CONFIG.defaults.theme);
            });
            applyTheme(CONFIG.defaults.theme);

            // Remove active button styling
            document.querySelectorAll('.bfw-preset-btn').forEach(btn => btn.classList.remove('active'));
            
            activePreset = null;
            applyTextSettings();
            updateDisplayValues();
            saveSettings();
            return;
        }

        // Apply new preset
        if (presets[preset]) {
            console.log('✅ BarrierFreeWeb: Applying preset:', preset);
            
            const p = presets[preset];
            
            // Update UI controls
            document.getElementById('bfw-font-size').value = p.fontSize;
            document.getElementById('bfw-line-height').value = p.lineHeight;
            document.getElementById('bfw-letter-spacing').value = p.letterSpacing;
            
            if (p.fontFamily) {
                document.getElementById('bfw-font-family').value = p.fontFamily;
            }
            
            if (p.contrastMode !== undefined) {
                const contrastRadio = document.querySelector(`input[name="bfw-contrast-mode"][value="${p.contrastMode}"]`);
                if (contrastRadio) {
                    contrastRadio.checked = true;
                    applyContrastMode(p.contrastMode);
                }
            }
            
            if (p.theme) {
                document.querySelectorAll('.bfw-theme-btn').forEach(btn => {
                    const isActive = btn.dataset.theme === p.theme;
                    btn.classList.toggle('active', isActive);
                });
                applyTheme(p.theme);
            }

            // Apply settings
            applyTextSettings();
            
            // Visual feedback - update preset button styling
            document.querySelectorAll('.bfw-preset-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`[data-preset="${preset}"]`).classList.add('active');
            
            // Update display values
            document.getElementById('bfw-font-size-value').textContent = p.fontSize;
            document.getElementById('bfw-line-height-value').textContent = p.lineHeight.toFixed(1);
            document.getElementById('bfw-letter-spacing-value').textContent = p.letterSpacing;
            
            activePreset = preset;
            saveSettings();
        }
    }

    /**
     * Update display values
     */
    function updateDisplayValues() {
        const fontSize = document.getElementById('bfw-font-size').value;
        const lineHeight = document.getElementById('bfw-line-height').value;
        const letterSpacing = document.getElementById('bfw-letter-spacing').value;

        document.getElementById('bfw-font-size-value').textContent = fontSize;
        document.getElementById('bfw-line-height-value').textContent = parseFloat(lineHeight).toFixed(1);
        document.getElementById('bfw-letter-spacing-value').textContent = letterSpacing;
    }

    /**
     * Toggle link highlights on/off
     */
    function toggleLinkHighlights() {
        const button = document.getElementById('bfw-highlight-links');
        const links = document.querySelectorAll('a[data-bfw-highlighted]');
        
        const isHighlighted = links.length > 0;
        
        if (isHighlighted) {
            // Remove highlights
            links.forEach(link => {
                link.style.backgroundColor = '';
                link.style.color = '';
                link.style.fontWeight = '';
                link.style.textDecoration = '';
                link.style.borderRadius = '';
                link.style.padding = '';
                delete link.dataset.bfwHighlighted;
            });
            button.textContent = '🔗 Highlight Links';
            console.log('✅ BarrierFreeWeb: Links unhighlighted');
        } else {
            // Add highlights - black background with yellow text
            const allLinks = document.querySelectorAll('a');
            allLinks.forEach(link => {
                link.dataset.bfwHighlighted = 'true';
                link.style.backgroundColor = '#000000';
                link.style.color = '#ffff00';
                link.style.fontWeight = 'bold';
                link.style.textDecoration = 'underline';
                link.style.borderRadius = '3px';
                link.style.padding = '2px 6px';
                link.style.transition = 'background-color 0.2s ease';
            });
            button.textContent = '🔗 Unhighlight Links';
            console.log('✅ BarrierFreeWeb: All links highlighted - Black background with yellow text');
        }
    }

    /**
     * Highlight selected text
     */
    function highlightSelection() {
        const selection = window.getSelection();
        
        if (!selection.rangeCount || selection.isCollapsed) {
            alert('Please select some text first');
            return;
        }

        const highlightColor = document.getElementById('bfw-highlight-color').value;
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        
        span.setAttribute('data-bfw-highlighted', 'true');
        span.style.backgroundColor = highlightColor;
        span.style.transition = 'background-color 0.2s ease';

        try {
            range.surroundContents(span);
        } catch (e) {
            // If surroundContents fails, use replaceChild with a div
            const div = document.createElement('div');
            div.style.backgroundColor = highlightColor;
            div.style.display = 'inline';
            div.setAttribute('data-bfw-highlighted', 'true');
            
            try {
                range.insertNode(div);
                const contents = range.extractContents();
                div.appendChild(contents);
            } catch (error) {
                console.warn('Could not highlight selection:', error);
            }
        }
    }

    /**
     * Clear all highlights on page
     */
    function clearAllHighlights() {
        // Clear link highlights
        const highlightedLinks = document.querySelectorAll('a[data-bfw-highlighted]');
        highlightedLinks.forEach(link => {
            link.style.backgroundColor = '';
            delete link.dataset.bfwHighlighted;
        });

        // Clear text highlights
        const highlightedSpans = document.querySelectorAll('[data-bfw-highlighted]');
        highlightedSpans.forEach(span => {
            if (span.textContent) {
                // Replace span with just the text content
                const parent = span.parentNode;
                while (span.firstChild) {
                    parent.insertBefore(span.firstChild, span);
                }
                parent.removeChild(span);
            }
        });
    }

    /**
     * Apply saved settings to page
     */
    function applySavedSettings(settings) {
        // Set contrast mode radio button
        const contrastRadio = document.querySelector(`input[name="bfw-contrast-mode"][value="${settings.contrastMode || 'none'}"]`);
        if (contrastRadio) {
            contrastRadio.checked = true;
        }
        
        applyTextSettings();
        applyContrastMode(settings.contrastMode || 'none');
        applyTheme(settings.theme);
        applyCursorSize(settings.cursorSize || 'default');
        updateDisplayValues();
    }

    /**
     * Save settings to localStorage
     */
    function saveSettings() {
        const settings = {
            fontSize: document.getElementById('bfw-font-size').value,
            lineHeight: document.getElementById('bfw-line-height').value,
            letterSpacing: document.getElementById('bfw-letter-spacing').value,
            fontFamily: document.getElementById('bfw-font-family').value,
            cursorSize: document.getElementById('bfw-cursor-size').value,
            contrastMode: document.querySelector('input[name="bfw-contrast-mode"]:checked')?.value || 'none',
            theme: document.querySelector('.bfw-theme-btn.active')?.dataset.theme || 'light',
            highlightColor: document.getElementById('bfw-highlight-color').value
        };
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(settings));
    }

    /**
     * Load settings from localStorage
     */
    function loadSettings() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load accessibility settings:', e);
        }
        
        return CONFIG.defaults;
    }

    /**
     * Reset all settings to defaults
     */
    function resetSettings() {
        // Reset to defaults
        document.getElementById('bfw-font-size').value = CONFIG.defaults.fontSize;
        document.getElementById('bfw-line-height').value = CONFIG.defaults.lineHeight;
        document.getElementById('bfw-letter-spacing').value = CONFIG.defaults.letterSpacing;
        document.getElementById('bfw-font-family').value = CONFIG.defaults.fontFamily;
        document.getElementById('bfw-cursor-size').value = CONFIG.defaults.cursorSize;
        
        // Reset contrast mode radio button
        const contrastRadio = document.querySelector(`input[name="bfw-contrast-mode"][value="${CONFIG.defaults.contrastMode}"]`);
        if (contrastRadio) {
            contrastRadio.checked = true;
        }
        
        document.getElementById('bfw-highlight-color').value = CONFIG.defaults.highlightColor;
        
        // Reset theme buttons
        document.querySelectorAll('.bfw-theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === CONFIG.defaults.theme);
        });

        // Reset preset buttons
        document.querySelectorAll('.bfw-preset-btn').forEach(btn => btn.classList.remove('active'));
        activePreset = null;

        // Apply
        applyTextSettings();
        applyContrastMode(CONFIG.defaults.contrastMode);
        applyTheme(CONFIG.defaults.theme);
        applyCursorSize(CONFIG.defaults.cursorSize);
        updateDisplayValues();

        // Clear storage
        localStorage.removeItem(CONFIG.storageKey);
    }

    /**
     * Announce message to screen readers
     */
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }

    // Initialize widget on page load
    init();
})();
