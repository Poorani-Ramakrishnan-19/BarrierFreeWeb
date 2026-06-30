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
     * 
     * Note: fontSize is NOT hardcoded. It's detected from the page on first load.
     * This respects the page's existing typography instead of imposing a default.
     */
    const CONFIG = {
        storageKey: 'barrierfreeweb_settings',
        defaults: {
            fontSize: null, // Will be auto-detected from page on first load
            lineHeight: null, // Will be auto-detected from page on first load
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
     * Track active preset and backup settings before applying preset
     */
    let activePreset = null;
    let presetBackup = null;
    let manuallyChanged = {
        fontSize: false,
        lineHeight: false,
        letterSpacing: false,
        fontFamily: false
    };
    
    // Store original page measurements and styles on first load for proper reset
    let originalPageFontSize = null;
    let originalPageLineHeight = null;
    let originalPageLetterSpacing = null;
    let originalPageFontFamily = null;
    let originalPageBgColor = null;
    let originalPageTextColor = null;
    let originalPageLinkColor = null;

    /**
     * Preload Google Fonts immediately - don't wait for widget to initialize
     * This ensures the font is available when CSS is applied later
     */
    function preloadGoogleFonts() {
        // Check if font already loaded
        if (document.getElementById('bfw-google-fonts')) {
            console.log('✅ BarrierFreeWeb: Google Fonts already loaded, skipping');
            return;
        }
        
        // Check if font link already exists
        const existingLink = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
            .find(link => link.href && link.href.includes('fonts.googleapis.com'));
        
        if (existingLink) {
            console.log('✅ BarrierFreeWeb: Google Fonts link already exists, marking as ours');
            existingLink.id = 'bfw-google-fonts';
            return;
        }
        
        try {
            const fontLink = document.createElement('link');
            fontLink.id = 'bfw-google-fonts';
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Open+Dyslexic&display=swap';
            document.head.appendChild(fontLink);
            console.log('🔤 BarrierFreeWeb: Preloading Google Fonts (Open Dyslexic)...');
        } catch (error) {
            console.error('❌ BarrierFreeWeb: Error preloading Google Fonts:', error);
        }
    }
    
    // Preload Google Fonts immediately when script loads
    preloadGoogleFonts();

    /**
     * Detect current page body font size
     */
    function detectCurrentPageFontSize() {
        const bodyElement = document.body;
        if (bodyElement) {
            const computedStyle = window.getComputedStyle(bodyElement);
            const currentFontSize = parseFloat(computedStyle.fontSize);
            return currentFontSize;
        }
        return CONFIG.defaults.fontSize;
    }

    /**
     * Detect current page body line height
     */
    function detectCurrentPageLineHeight() {
        const bodyElement = document.body;
        if (bodyElement) {
            const computedStyle = window.getComputedStyle(bodyElement);
            const currentLineHeight = parseFloat(computedStyle.lineHeight);
            // Convert pixel value to ratio (divide by font size)
            const currentFontSize = parseFloat(computedStyle.fontSize);
            const lineHeightRatio = currentLineHeight / currentFontSize;
            return lineHeightRatio;
        }
        return CONFIG.defaults.lineHeight;
    }

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
        
        // Save original page styles on first load (before any CSS is applied)
        if (originalPageFontSize === null) {
            originalPageFontSize = Math.round(detectCurrentPageFontSize());
            originalPageLineHeight = Math.round(detectCurrentPageLineHeight() * 10) / 10;
            
            // Get original letter spacing
            const bodyStyle = window.getComputedStyle(document.body);
            originalPageLetterSpacing = parseFloat(bodyStyle.letterSpacing) || 0;
            originalPageFontFamily = bodyStyle.fontFamily;
            originalPageBgColor = bodyStyle.backgroundColor;
            originalPageTextColor = bodyStyle.color;
            
            // Get original link color
            const link = document.querySelector('a');
            if (link) {
                originalPageLinkColor = window.getComputedStyle(link).color;
            }
            
            console.log('💾 BarrierFreeWeb: Saved original page styles - fontSize:', originalPageFontSize, 'lineHeight:', originalPageLineHeight, 'fontFamily:', originalPageFontFamily, 'bgColor:', originalPageBgColor, 'textColor:', originalPageTextColor);
        }
        
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

                        <!-- Theme Section (Collapsed) -->
                        <div class="bfw-group bfw-group-collapsed" data-section="theme">
                            <button type="button" class="bfw-group-toggle" aria-expanded="false" aria-label="Theme">
                                <span class="bfw-group-title">Theme</span>
                                <span class="bfw-group-indicator">+</span>
                            </button>
                            <div class="bfw-group-content" style="display: none;">
                                <div style="display: flex; gap: 8px;">
                                    <button class="bfw-theme-btn ${settings.theme === 'light' ? 'active' : ''}" data-theme="light">☀️ Light</button>
                                    <button class="bfw-theme-btn ${settings.theme === 'dark' ? 'active' : ''}" data-theme="dark">🌙 Dark</button>
                                </div>
                            </div>
                        </div>

                        <!-- Text Dimensions Section (Collapsed) -->
                        <div class="bfw-group bfw-group-collapsed" data-section="text-dimensions">
                            <button type="button" class="bfw-group-toggle" aria-expanded="false" aria-label="Text Dimensions">
                                <span class="bfw-group-title">Text Dimensions</span>
                                <span class="bfw-group-indicator">+</span>
                            </button>
                            <div class="bfw-group-content" style="display: none;">
                                <div class="bfw-control-group">
                                    <label for="bfw-font-size">Font Size: <strong><span id="bfw-font-size-value">${settings.fontSize || '16'}</span>px</strong></label>
                                    <input type="range" id="bfw-font-size" min="12" max="28" value="${settings.fontSize || '16'}">
                                </div>

                                <div class="bfw-control-group">
                                    <label for="bfw-line-height">Line Height: <strong><span id="bfw-line-height-value">${settings.lineHeight || '1.5'}</span></strong></label>
                                    <input type="range" id="bfw-line-height" min="1" max="3" step="0.1" value="${settings.lineHeight || '1.5'}">
                                </div>

                                <div class="bfw-control-group">
                                    <label for="bfw-letter-spacing">Letter Spacing: <strong><span id="bfw-letter-spacing-value">${settings.letterSpacing || '0'}</span>px</strong></label>
                                    <input type="range" id="bfw-letter-spacing" min="0" max="5" step="0.1" value="${settings.letterSpacing || '0'}">
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
        
        // Load Google Fonts FIRST before applying settings
        loadGoogleFonts().then(() => {
            console.log('✅ BarrierFreeWeb: Google Fonts loaded, now applying saved settings...');
            
            // Check if user has saved settings in localStorage
            let hasSavedSettings = false;
            try {
                const saved = localStorage.getItem(CONFIG.storageKey);
                hasSavedSettings = saved !== null && saved !== '';
            } catch (e) {
                hasSavedSettings = false;
            }
            
            applySavedSettings(settings, hasSavedSettings);
        }).catch(error => {
            console.warn('⚠️ BarrierFreeWeb: Google Fonts failed to load, but continuing anyway:', error);
            
            // Check if user has saved settings in localStorage
            let hasSavedSettings = false;
            try {
                const saved = localStorage.getItem(CONFIG.storageKey);
                hasSavedSettings = saved !== null && saved !== '';
            } catch (e) {
                hasSavedSettings = false;
            }
            
            applySavedSettings(settings, hasSavedSettings);
        });
        
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
        
        console.log('1✅ BarrierFreeWeb: Attaching event listeners to', toggleBtn);
        
        const fontSizeSlider = document.getElementById('bfw-font-size');
        const lineHeightSlider = document.getElementById('bfw-line-height');
        const letterSpacingSlider = document.getElementById('bfw-letter-spacing');
        const contrastToggle = document.getElementById('bfw-contrast-toggle');
        const highlightColorInput = document.getElementById('bfw-highlight-color');
        const resetBtn = document.getElementById('bfw-reset-btn');
        const presetBtns = document.querySelectorAll('.bfw-preset-btn');
        const themeBtns = document.querySelectorAll('.bfw-theme-btn');

        // Function to reposition panel so it's always visible on screen
        function repositionPanel() {
            if (panel.hidden) return;
            
            const containerRect = container.getBoundingClientRect();
            const panelWidth = panel.offsetWidth || 300;
            const panelHeight = panel.offsetHeight || 400;
            const buttonHeight = toggleBtn.offsetHeight || 50;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Try positions: below, above, left-below, left-above
            const positions = [
                { 
                    left: containerRect.right - panelWidth, 
                    top: containerRect.bottom + 10 
                },
                { 
                    left: containerRect.right - panelWidth, 
                    top: containerRect.top - panelHeight - 10 
                },
                { 
                    left: containerRect.left, 
                    top: containerRect.bottom + 10 
                },
                { 
                    left: containerRect.left, 
                    top: containerRect.top - panelHeight - 10 
                }
            ];
            
            let bestPosition = positions[0];
            let bestScore = Infinity;
            
            for (const pos of positions) {
                const panelRight = pos.left + panelWidth;
                const panelBottom = pos.top + panelHeight;
                
                const offLeft = Math.max(0, -pos.left);
                const offRight = Math.max(0, panelRight - viewportWidth);
                const offTop = Math.max(0, -pos.top);
                const offBottom = Math.max(0, panelBottom - viewportHeight);
                
                const overflow = offLeft + offRight + offTop + offBottom;
                
                if (overflow === 0) {
                    bestPosition = pos;
                    break;
                }
                
                if (overflow < bestScore) {
                    bestScore = overflow;
                    bestPosition = pos;
                }
            }
            
            const finalLeft = Math.max(0, Math.min(bestPosition.left, viewportWidth - panelWidth));
            const finalTop = Math.max(0, Math.min(bestPosition.top, viewportHeight - panelHeight));
            
            panel.style.position = 'fixed';
            panel.style.left = finalLeft + 'px';
            panel.style.top = finalTop + 'px';
            panel.style.bottom = 'auto';
            panel.style.right = 'auto';
        }

        // Toggle panel
        toggleBtn.addEventListener('click', () => {
            console.log('BarrierFreeWeb: Toggle button clicked, panel hidden state:', panel.hidden);
            
            if (panel.hidden) {
                // Show panel
                panel.removeAttribute('hidden');
                panel.setAttribute('aria-hidden', 'false');
                toggleBtn.setAttribute('aria-expanded', 'true');
                
                // Reposition panel to be visible on screen
                setTimeout(() => {
                    repositionPanel();
                }, 0);
                
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

        // Drag functionality for the widget
        const container = document.getElementById('bfw-widget-container');
        if (container) {
            let isDragging = false;
            let hasDragged = false;
            let dragOffsetX = 0;
            let dragOffsetY = 0;

            toggleBtn.addEventListener('mousedown', (event) => {
                if (event.button !== 0) return;
                isDragging = true;
                hasDragged = false;
                toggleBtn.classList.add('bfw-dragging');
                
                const rect = container.getBoundingClientRect();
                dragOffsetX = event.clientX - rect.left;
                dragOffsetY = event.clientY - rect.top;
                event.preventDefault();
            });

            document.addEventListener('mousemove', (event) => {
                if (!isDragging) return;
                hasDragged = true;
                
                const x = event.clientX - dragOffsetX;
                const y = event.clientY - dragOffsetY;
                
                // Clamp position to viewport
                const maxX = window.innerWidth - container.offsetWidth;
                const maxY = window.innerHeight - container.offsetHeight;
                const clampedX = Math.max(0, Math.min(x, maxX));
                const clampedY = Math.max(0, Math.min(y, maxY));
                
                container.style.left = clampedX + 'px';
                container.style.top = clampedY + 'px';
                container.style.right = 'auto';
                container.style.bottom = 'auto';
            });

            document.addEventListener('mouseup', () => {
                if (!isDragging) return;
                isDragging = false;
                toggleBtn.classList.remove('bfw-dragging');
                
                // Reposition panel if it's open after dragging
                if (!panel.hidden) {
                    setTimeout(() => {
                        repositionPanel();
                    }, 0);
                }
                
                setTimeout(() => { hasDragged = false; }, 0);
            });

            // Prevent panel toggle when just dragging
            toggleBtn.addEventListener('click', (event) => {
                if (hasDragged) {
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }
            });

            // Reposition panel on window resize
            window.addEventListener('resize', () => {
                if (!panel.hidden) {
                    repositionPanel();
                }
            });
        }

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
                console.log('📏 BarrierFreeWeb: Font size changed to:', e.target.value);
                applyTextSettings();
                document.getElementById('bfw-font-size-value').textContent = e.target.value;
                // Mark as manually changed if a preset is active
                if (activePreset) {
                    manuallyChanged.fontSize = true;
                }
                saveSettings();
            });
        } else {
            console.warn('⚠️ BarrierFreeWeb: Font size slider not found');
        }

        // Line height slider
        if (lineHeightSlider) {
            lineHeightSlider.addEventListener('input', (e) => {
                console.log('📏 BarrierFreeWeb: Line height changed to:', e.target.value);
                applyTextSettings();
                document.getElementById('bfw-line-height-value').textContent = parseFloat(e.target.value).toFixed(1);
                // Mark as manually changed if a preset is active
                if (activePreset) {
                    manuallyChanged.lineHeight = true;
                }
                saveSettings();
            });
        } else {
            console.warn('⚠️ BarrierFreeWeb: Line height slider not found');
        }

        // Letter spacing slider
        if (letterSpacingSlider) {
            letterSpacingSlider.addEventListener('input', (e) => {
                console.log('📏 BarrierFreeWeb: Letter spacing changed to:', e.target.value);
                applyTextSettings();
                document.getElementById('bfw-letter-spacing-value').textContent = e.target.value;
                // Mark as manually changed if a preset is active
                if (activePreset) {
                    manuallyChanged.letterSpacing = true;
                }
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
                        
                        // If Text Dimensions section is expanded, detect current page measurements
                        if (group.dataset.section === 'text-dimensions') {
                            const currentPageFontSize = detectCurrentPageFontSize() || 16;
                            const currentPageLineHeight = detectCurrentPageLineHeight() || 1.5;
                            const roundedFontSize = Math.round(currentPageFontSize);
                            const roundedLineHeight = Math.round(currentPageLineHeight * 10) / 10;
                            document.getElementById('bfw-font-size').value = roundedFontSize;
                            document.getElementById('bfw-font-size-value').textContent = roundedFontSize;
                            document.getElementById('bfw-line-height').value = roundedLineHeight;
                            document.getElementById('bfw-line-height-value').textContent = roundedLineHeight.toFixed(1);
                            console.log('📏 BarrierFreeWeb: Detected current page font size:', roundedFontSize + 'px');
                            console.log('📏 BarrierFreeWeb: Detected current page line height:', roundedLineHeight.toFixed(1));
                        }
                    }
                    
                    // Track the opened section
                    const sectionName = group.dataset.section;
                    if (!isExpanded) {
                        lastOpenedSection = sectionName;
                        console.log('✅ BarrierFreeWeb: Opened section:', sectionName);
                    }
                    
                    // Reposition panel after height changes
                    if (!panel.hidden) {
                        setTimeout(() => {
                            repositionPanel();
                        }, 150);
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
                const selectedTheme = btn.dataset.theme;
                const isCurrentlyActive = btn.classList.contains('active');
                
                console.log('🌙 BarrierFreeWeb: Theme button clicked - theme:', selectedTheme, 'currently active:', isCurrentlyActive);
                
                if (isCurrentlyActive) {
                    // Toggle off: revert to light theme
                    console.log('🌙 BarrierFreeWeb: Toggling OFF -', selectedTheme, 'theme. Activating light theme.');
                    themeBtns.forEach(b => {
                        b.classList.remove('active');
                        console.log('✅ BarrierFreeWeb: Removed active class from', b.dataset.theme, 'button');
                    });
                    const lightBtn = document.querySelector('.bfw-theme-btn[data-theme="light"]');
                    if (lightBtn) {
                        lightBtn.classList.add('active');
                        console.log('✅ BarrierFreeWeb: Added active class to light button');
                    }
                    applyTheme('light');
                    
                    // Deactivate preset if Dark Mode is active
                    if (activePreset === 'dark-mode') {
                        document.querySelectorAll('.bfw-preset-btn').forEach(b => b.classList.remove('active'));
                        activePreset = null;
                        presetBackup = null;
                        console.log('✅ BarrierFreeWeb: Deactivated dark-mode preset');
                    }
                } else {
                    // Toggle on: activate the clicked theme
                    console.log('🌙 BarrierFreeWeb: Toggling ON -', selectedTheme, 'theme');
                    themeBtns.forEach(b => {
                        b.classList.remove('active');
                        console.log('✅ BarrierFreeWeb: Removed active class from', b.dataset.theme, 'button');
                    });
                    btn.classList.add('active');
                    console.log('✅ BarrierFreeWeb: Added active class to', selectedTheme, 'button');
                    applyTheme(selectedTheme);
                    
                    // Deactivate any preset since theme was manually changed
                    if (activePreset) {
                        document.querySelectorAll('.bfw-preset-btn').forEach(b => b.classList.remove('active'));
                        activePreset = null;
                        presetBackup = null;
                        console.log('✅ BarrierFreeWeb: Deactivated preset:', activePreset);
                    }
                }
                saveSettings();
                console.log('✅ BarrierFreeWeb: Theme settings saved');
            });
        });

        // Preset buttons
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('🎯 BarrierFreeWeb: Preset button clicked:', btn.dataset.preset);
                applyPreset(btn.dataset.preset);
            });
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
            setFontFamilyValue(savedFontFamily);  // Use safe setter
            console.log('🔤 BarrierFreeWeb: Font family dropdown initialized with:', savedFontFamily);
            
            fontFamilySelect.addEventListener('change', (e) => {
                const fontFamily = e.target.value;
                console.log('🔤 BarrierFreeWeb: Font family changed to:', fontFamily);
                
                // If changing to Open Dyslexic, ensure Google Fonts is loaded first
                if (fontFamily.includes('Open Dyslexic')) {
                    console.log('🔤 BarrierFreeWeb: Applying Open Dyslexic font, waiting for Google Fonts to be available...');
                    // Wait a moment to ensure Google Fonts is fully loaded and parsed
                    setTimeout(() => {
                        applyTextSettings();
                        saveSettings();
                        console.log('🔤 BarrierFreeWeb: Font family settings applied and saved');
                    }, 200);
                } else {
                    // For system fonts (Arial, Verdana, Georgia, Times New Roman), apply immediately
                    console.log('🔤 BarrierFreeWeb: Applying system font, no delay needed');
                    applyTextSettings();
                    saveSettings();
                    console.log('🔤 BarrierFreeWeb: Font family settings applied and saved');
                }
                
                // Mark as manually changed if a preset is active
                if (activePreset) {
                    manuallyChanged.fontFamily = true;
                }
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
                console.log('✅ BarrierFreeWeb: Reset Section clicked');
                // Reset all text settings
                resetTextSettings();
                // Save the reset state to localStorage
                saveSettings();
                console.log('✅ BarrierFreeWeb: Reset Section complete - page returned to original styling');
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
        // Clear any active preset
        activePreset = null;
        presetBackup = null;
        
        // Reset UI sliders and dropdowns to ORIGINAL page values
        document.getElementById('bfw-font-size').value = originalPageFontSize || CONFIG.defaults.fontSize || 16;
        document.getElementById('bfw-line-height').value = originalPageLineHeight || CONFIG.defaults.lineHeight || 1.5;
        document.getElementById('bfw-letter-spacing').value = originalPageLetterSpacing || CONFIG.defaults.letterSpacing || 0;
        setFontFamilyValue(originalPageFontFamily || CONFIG.defaults.fontFamily || '');  // Use safe setter
        document.getElementById('bfw-cursor-size').value = CONFIG.defaults.cursorSize;
        
        console.log('✅ BarrierFreeWeb: Reset Section - Reset sliders to original values');
        
        // REMOVE all text CSS from page (return to original)
        const textSettingsStyle = document.getElementById('bfw-text-settings-style');
        if (textSettingsStyle) {
            textSettingsStyle.remove();
            console.log('✅ BarrierFreeWeb: Removed text settings CSS - text reset to page defaults');
        }
        
        // CRITICAL: Also remove ALL theme and contrast classes that presets add to body
        document.body.classList.remove('bfw-dark-theme');
        document.body.classList.remove('bfw-contrast-invert');
        document.body.classList.remove('bfw-contrast-dark');
        document.body.classList.remove('bfw-contrast-light');
        document.body.classList.remove('bfw-contrast-high');
        document.body.classList.remove('bfw-contrast-desaturate');
        document.body.classList.remove('bfw-cursor-large');
        document.body.classList.remove('bfw-cursor-xlarge');
        console.log('✅ BarrierFreeWeb: Removed all preset styling classes from body');
        
        // Remove all preset buttons active state
        document.querySelectorAll('.bfw-preset-btn').forEach(btn => btn.classList.remove('active'));
        
        // Reset contrast radio to NONE and APPLY IT
        const noneRadio = document.querySelector('input[name="bfw-contrast-mode"][value="none"]');
        if (noneRadio) {
            noneRadio.checked = true;
            applyContrastMode('none');  // Explicitly apply the reset contrast mode
        }
        
        // Reset theme to LIGHT and APPLY IT
        const lightBtn = document.querySelector('.bfw-theme-btn[data-theme="light"]');
        if (lightBtn) {
            document.querySelectorAll('.bfw-theme-btn').forEach(btn => btn.classList.remove('active'));
            lightBtn.classList.add('active');
            applyTheme('light');  // Explicitly apply the reset theme
        }
        
        // Update display values
        updateDisplayValues();
    }

    /**
     * Safely set font family dropdown value - validates that option exists
     */
    function setFontFamilyValue(value) {
        const fontFamilySelect = document.getElementById('bfw-font-family');
        if (!fontFamilySelect) {
            console.warn('⚠️ BarrierFreeWeb: Font family select element not found');
            return;
        }
        
        // Check if value exists as an option
        const optionExists = Array.from(fontFamilySelect.options).some(option => option.value === value);
        
        if (optionExists) {
            fontFamilySelect.value = value;
            console.log('✅ BarrierFreeWeb: Set font family dropdown to:', value);
        } else {
            // Value doesn't exist in dropdown, set to Default (empty string)
            fontFamilySelect.value = '';
            console.log('⚠️ BarrierFreeWeb: Font family "' + value + '" not in dropdown options. Available options:', 
                Array.from(fontFamilySelect.options).map(o => o.value));
            console.log('   Setting to Default (empty string) instead');
        }
    }

    /**
     * Apply text styling based on current slider values
     * 
     * WCAG 2.1 AA Compliant Implementation:
     * - Applies font-size, line-height, letter-spacing to all semantic content elements
     * - Headings (h1-h6) scale proportionally with body text to preserve visual hierarchy
     * - Navigation and UI controls are explicitly excluded to maintain layout integrity
     * - Uses CSS specificity layers to ensure clean reflow and prevent text overlap
     */
    function applyTextSettings() {
        const fontSize = document.getElementById('bfw-font-size').value;
        const lineHeight = document.getElementById('bfw-line-height').value;
        const letterSpacing = document.getElementById('bfw-letter-spacing').value;
        const fontFamily = document.getElementById('bfw-font-family').value;

        console.log('🎨 BarrierFreeWeb: applyTextSettings called - fontSize:', fontSize, 'lineHeight:', lineHeight, 'letterSpacing:', letterSpacing, 'fontFamily:', fontFamily);

        // Create or update the text settings style tag for consistent application
        let textSettingsStyle = document.getElementById('bfw-text-settings-style');
        if (!textSettingsStyle) {
            textSettingsStyle = document.createElement('style');
            textSettingsStyle.id = 'bfw-text-settings-style';
            document.head.appendChild(textSettingsStyle);
            console.log('✅ BarrierFreeWeb: Created bfw-text-settings-style tag');
        }

        let cssRules = `
/* ============================================
   LAYER 1: Core Content Scaling
   Apply to all body text and semantic content
   ============================================ */
body,
p,
span,
div,
li,
td,
th,
label,
button,
input,
textarea,
a,
article,
section,
main,
aside,
blockquote,
strong,
em,
code,
pre,
small {
    font-size: ${fontSize}px !important;
    line-height: ${lineHeight} !important;
    letter-spacing: ${letterSpacing}px !important;
}

/* ============================================
   LAYER 2: Semantic Heading Styling
   Headings maintain original size and styling
   Only inherit line-height and letter-spacing
   ============================================ */
h1,
h2,
h3,
h4,
h5,
h6 {
    line-height: ${lineHeight} !important;
    letter-spacing: ${letterSpacing}px !important;
}

/* ============================================
   LAYER 3a: Widget Exclusions (Critical UI)
   Accessibility widget container/panel must NOT scale
   These elements need to remain readable and functional
   ============================================ */
#bfw-widget-container,
#bfw-widget-container *,
#bfw-panel,
#bfw-panel * {
    font-size: initial !important;
    line-height: initial !important;
    letter-spacing: initial !important;
}

/* ============================================
   LAYER 3b: Navigation Exclusions (Site Structure)
   Top navigation must maintain fixed size for usability
   Prevents layout collapse and navigation overflow
   ============================================ */
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
.wp-block-navigation,
.wp-block-navigation * {
    font-size: initial !important;
    line-height: initial !important;
    letter-spacing: initial !important;
}

/* ============================================
   LAYER 4: Font Family Application
   Apply selected font to all scalable content
   ============================================ */
body,
p,
span,
div,
li,
td,
th,
label,
button,
input,
textarea,
a,
article,
section,
main,
aside,
blockquote,
strong,
em,
code,
pre,
small,
h1,
h2,
h3,
h4,
h5,
h6 {
    ${fontFamily ? `font-family: ${fontFamily} !important;` : '/* Using system defaults */'}
}

/* ============================================
   LAYER 5: Font Family Exclusions
   UI and navigation use system font for consistency
   ============================================ */
#bfw-widget-container,
#bfw-widget-container *,
#bfw-panel,
#bfw-panel *,
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
.wp-block-navigation,
.wp-block-navigation * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
}

/* ============================================
   LAYER 6: Reflow Optimization
   Ensure smooth text reflow without clipping
   ============================================ */
body,
article,
section,
main,
aside {
    overflow-wrap: break-word !important;
    word-wrap: break-word !important;
    word-break: break-word !important;
}

p,
li,
td,
th,
label {
    overflow-wrap: break-word !important;
    word-wrap: break-word !important;
}
        `;

        textSettingsStyle.textContent = cssRules;
        console.log('✅ BarrierFreeWeb: Text settings CSS applied to page (WCAG 2.1 AA compliant)');
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
        console.log('🌙 BarrierFreeWeb: applyTheme called with theme:', theme);
        if (theme === 'dark') {
            document.body.classList.add('bfw-dark-theme');
            console.log('✅ BarrierFreeWeb: Dark theme applied - body has bfw-dark-theme class');
        } else {
            document.body.classList.remove('bfw-dark-theme');
            console.log('✅ BarrierFreeWeb: Light theme applied - removed bfw-dark-theme class');
        }
        
        // Update theme button states
        const lightBtn = document.querySelector('.bfw-theme-btn[data-theme="light"]');
        const darkBtn = document.querySelector('.bfw-theme-btn[data-theme="dark"]');
        if (lightBtn && darkBtn) {
            lightBtn.classList.toggle('active', theme === 'light');
            darkBtn.classList.toggle('active', theme === 'dark');
            console.log('✅ BarrierFreeWeb: Updated theme button states - Light active:', theme === 'light', 'Dark active:', theme === 'dark');
        }
    }

    /**
     * Load Google Fonts (called once on initialization)
     */
    function loadGoogleFonts() {
        // Check if font is already loaded
        if (document.getElementById('bfw-google-fonts')) {
            console.log('✅ BarrierFreeWeb: Google Fonts already loaded, skipping');
            return Promise.resolve();
        }
        
        // Check if font link already exists in DOM (might be there from earlier)
        const existingLink = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
            .find(link => link.href && link.href.includes('fonts.googleapis.com'));
        
        if (existingLink) {
            console.log('✅ BarrierFreeWeb: Google Fonts link already exists in DOM, skipping');
            existingLink.id = 'bfw-google-fonts'; // Mark it as ours
            return Promise.resolve();
        }
        
        return new Promise((resolve, reject) => {
            try {
                const fontLink = document.createElement('link');
                fontLink.id = 'bfw-google-fonts';
                fontLink.rel = 'stylesheet';
                fontLink.href = 'https://fonts.googleapis.com/css2?family=Open+Dyslexic&display=swap';
                
                // Add load handler
                fontLink.addEventListener('load', () => {
                    console.log('✅ BarrierFreeWeb: Google Fonts stylesheet loaded successfully');
                    resolve();
                });
                
                // Add error handler - still resolve to allow fallback fonts
                fontLink.addEventListener('error', () => {
                    console.error('❌ BarrierFreeWeb: Failed to load Google Fonts stylesheet');
                    console.warn('⚠️ BarrierFreeWeb: Open Dyslexic font will use system fallback');
                    resolve(); // Resolve anyway so CSS can still be applied
                });
                
                document.head.appendChild(fontLink);
                console.log('🔤 BarrierFreeWeb: Attempting to load Google Fonts (Open Dyslexic)...');
            } catch (error) {
                console.error('❌ BarrierFreeWeb: Error loading Google Fonts:', error);
                reject(error);
            }
        });
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
        console.log('🎯 BarrierFreeWeb: applyPreset called - preset:', preset, 'activePreset:', activePreset, 'match:', activePreset === preset);
        
        const presets = {
            'low-vision': { fontSize: 20, lineHeight: 1.8, letterSpacing: 0.2, fontFamily: 'Arial, sans-serif', contrastMode: 'high' },
            'dark-mode': { fontSize: 16, lineHeight: 1.6, letterSpacing: 0, theme: 'dark', contrastMode: 'none' },
            'dyslexia': { fontSize: 18, lineHeight: 1.8, letterSpacing: 0.2, fontFamily: "'Open Dyslexic', cursive", contrastMode: 'none' },
            'large-text': { fontSize: 24, lineHeight: 1.8, letterSpacing: 0.1, contrastMode: 'none' }
        };
        
        // DEBUG: Show decision tree
        if (activePreset === preset) {
            console.log('   ✅ WILL DEACTIVATE: activePreset === preset');
        } else {
            console.log('   ⚙️ WILL ACTIVATE: activePreset !== preset');
        }

        // Toggle functionality: if clicking the same preset, deactivate it
        if (activePreset === preset) {
            console.log('🔄 🔄 🔄 DEACTIVATION TRIGGERED 🔄 🔄 🔄 - Deactivating preset:', preset);
            console.log('   Current activePreset:', activePreset, 'Clicked preset:', preset, 'Match:', activePreset === preset);
            
            // Step 1: CRITICAL - Remove CSS injection FIRST
            const textSettingsStyle = document.getElementById('bfw-text-settings-style');
            if (textSettingsStyle) {
                textSettingsStyle.remove();
                console.log('✅ BarrierFreeWeb: Removed text settings CSS injection');
            }
            
            // Step 2: Remove ALL theme and contrast classes from body
            document.body.classList.remove('bfw-dark-theme');
            document.body.classList.remove('bfw-contrast-invert');
            document.body.classList.remove('bfw-contrast-dark');
            document.body.classList.remove('bfw-contrast-light');
            document.body.classList.remove('bfw-contrast-high');
            document.body.classList.remove('bfw-contrast-desaturate');
            console.log('✅ BarrierFreeWeb: Removed all theme/contrast classes from body');
            
            // Step 3: Clear preset state
            activePreset = null;
            presetBackup = null;
            manuallyChanged = {
                fontSize: false,
                lineHeight: false,
                letterSpacing: false,
                fontFamily: false
            };
            
            // Step 4: Clear localStorage COMPLETELY so page returns to original on refresh
            try {
                localStorage.removeItem(CONFIG.storageKey);
                console.log('✅ BarrierFreeWeb: Cleared localStorage - page will be original on refresh');
            } catch (e) {
                console.warn('⚠️ BarrierFreeWeb: Could not clear localStorage:', e);
            }
            
            // Step 5: Update preset button state
            document.querySelectorAll('.bfw-preset-btn').forEach(btn => btn.classList.remove('active'));
            
            // Step 6: Reset theme buttons to Light (sync theme buttons with preset deactivation)
            document.querySelectorAll('.bfw-theme-btn').forEach(btn => btn.classList.remove('active'));
            const lightBtn = document.querySelector('.bfw-theme-btn[data-theme="light"]');
            if (lightBtn) {
                lightBtn.classList.add('active');
                applyTheme('light');
                console.log('✅ BarrierFreeWeb: Reset theme buttons to Light after preset deactivation');
            }
            
            // Step 7: Reset contrast radio to NONE (sync contrast with preset deactivation)
            const noneRadio = document.querySelector('input[name="bfw-contrast-mode"][value="none"]');
            if (noneRadio) {
                noneRadio.checked = true;
                applyContrastMode('none');
                console.log('✅ BarrierFreeWeb: Reset contrast to None after preset deactivation');
            }
            
            // Step 8: Reset font family to Default (sync typography with preset deactivation)
            const fontFamilySelect = document.getElementById('bfw-font-family');
            if (fontFamilySelect) {
                fontFamilySelect.value = '';  // Empty string = Default (System)
                console.log('✅ BarrierFreeWeb: Reset font family to Default after preset deactivation');
            }
            
            // Step 9: Update display to show current slider values
            updateDisplayValues();
            
            console.log('✅ BarrierFreeWeb: Preset deactivated - page content returned to original source');
            console.log('   Final state - activePreset:', activePreset, 'presetBackup:', presetBackup, 'localStorage:', localStorage.getItem(CONFIG.storageKey));
            return;  // Exit after deactivation - do NOT apply preset again
        }

        // Apply new preset
        if (presets[preset]) {
            console.log('✅ BarrierFreeWeb: Applying preset:', preset);
            
            // If switching FROM another preset, deactivate the old one first
            if (activePreset && activePreset !== preset) {
                console.log('🔄 BarrierFreeWeb: Switching presets - deactivating old preset:', activePreset);
                
                // Remove old CSS injection
                const textSettingsStyle = document.getElementById('bfw-text-settings-style');
                if (textSettingsStyle) {
                    textSettingsStyle.remove();
                    console.log('✅ BarrierFreeWeb: Removed old preset CSS');
                }
            }
            
            // Clean up any old preset styling before applying new one
            document.body.classList.remove(
                'bfw-dark-theme',
                'bfw-contrast-invert',
                'bfw-contrast-dark',
                'bfw-contrast-light',
                'bfw-contrast-high',
                'bfw-contrast-desaturate',
                'bfw-cursor-large',
                'bfw-cursor-xlarge'
            );
            console.log('🧹 BarrierFreeWeb: Cleaned up all old preset styling');
            
            // Backup current settings BEFORE applying preset (including contrast and theme)
            const currentContrastRadio = document.querySelector('input[name="bfw-contrast-mode"]:checked');
            const activeThemeBtn = document.querySelector('.bfw-theme-btn.active');
            const currentFontFamily = document.getElementById('bfw-font-family').value;
            presetBackup = {
                fromPreset: activePreset,  // Track which preset we're backing up FROM
                fontSize: parseInt(document.getElementById('bfw-font-size').value),
                lineHeight: parseFloat(document.getElementById('bfw-line-height').value),
                letterSpacing: parseFloat(document.getElementById('bfw-letter-spacing').value),
                fontFamily: currentFontFamily,
                contrastMode: currentContrastRadio ? currentContrastRadio.value : 'none',
                theme: activeThemeBtn ? activeThemeBtn.dataset.theme : 'light'
            };
            
            const p = presets[preset];
            
            // Reset manually changed flags for the new preset
            manuallyChanged = {
                fontSize: false,
                lineHeight: false,
                letterSpacing: false,
                fontFamily: false
            };
            
            // Apply preset values to UI sliders
            document.getElementById('bfw-font-size').value = p.fontSize;
            document.getElementById('bfw-line-height').value = p.lineHeight;
            document.getElementById('bfw-letter-spacing').value = p.letterSpacing;
            
            // Apply preset font family or reset to default
            if (p.fontFamily) {
                setFontFamilyValue(p.fontFamily);  // Use safe setter
            } else {
                setFontFamilyValue('');  // Reset to default
            }
            
            // Apply text settings with delay if using Google Font (Open Dyslexic)
            const applySettingsCallback = () => {
                applyTextSettings();
                
                // Trigger font family change listener if font was set
                if (p.fontFamily) {
                    const fontFamilySelect = document.getElementById('bfw-font-family');
                    if (fontFamilySelect) {
                        fontFamilySelect.dispatchEvent(new Event('change'));
                    }
                }
                console.log('🔤 BarrierFreeWeb: Preset font applied:', p.fontFamily);
            };
            
            // Add delay if preset uses Open Dyslexic to ensure font is loaded
            if (p.fontFamily && p.fontFamily.includes('Open Dyslexic')) {
                console.log('🔤 BarrierFreeWeb: Preset uses Open Dyslexic, waiting for font to load...');
                setTimeout(applySettingsCallback, 200);
            } else {
                applySettingsCallback();
            }

            // Apply contrast - reset to none if preset doesn't specify
            const contrastMode = p.contrastMode !== undefined ? p.contrastMode : 'none';
            const contrastRadio = document.querySelector(`input[name="bfw-contrast-mode"][value="${contrastMode}"]`);
            if (contrastRadio) {
                contrastRadio.checked = true;
                applyContrastMode(contrastMode);
                console.log('✅ BarrierFreeWeb: Applied contrast mode:', contrastMode);
            }
            
            // Apply theme ONLY if preset explicitly specifies it
            if (p.theme) {
                document.querySelectorAll('.bfw-theme-btn').forEach(btn => {
                    const isActive = btn.dataset.theme === p.theme;
                    btn.classList.toggle('active', isActive);
                });
                applyTheme(p.theme);
                console.log('✅ BarrierFreeWeb: Applied theme from preset:', p.theme);
            } else {
                // If preset doesn't define theme, reset to light (default)
                document.querySelectorAll('.bfw-theme-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelector('.bfw-theme-btn[data-theme="light"]').classList.add('active');
                applyTheme('light');
                console.log('✅ BarrierFreeWeb: Preset does not specify theme, reset to light');
            }
            
            // Visual feedback - update preset button styling
            document.querySelectorAll('.bfw-preset-btn').forEach(btn => btn.classList.remove('active'));
            const presetBtn = document.querySelector(`.bfw-preset-btn[data-preset="${preset}"]`);
            if (presetBtn) {
                presetBtn.classList.add('active');
                console.log('✅ BarrierFreeWeb: Highlighted preset button for:', preset);
            } else {
                console.error('❌ BarrierFreeWeb: Could not find preset button for:', preset);
            }
            
            // Update display values
            document.getElementById('bfw-font-size-value').textContent = document.getElementById('bfw-font-size').value;
            document.getElementById('bfw-line-height-value').textContent = parseFloat(document.getElementById('bfw-line-height').value).toFixed(1);
            document.getElementById('bfw-letter-spacing-value').textContent = document.getElementById('bfw-letter-spacing').value;
            
            activePreset = preset;
            console.log('✅ BarrierFreeWeb: Preset activated and saved - activePreset is now:', activePreset);
            
            saveSettings();
            console.log('   Final state - activePreset:', activePreset, 'presetBackup:', presetBackup, 'localStorage:', localStorage.getItem(CONFIG.storageKey));
        }
    }

    /**
     * Update display values
     */
    function updateDisplayValues() {
        const fontSize = document.getElementById('bfw-font-size').value;
        const lineHeight = document.getElementById('bfw-line-height').value;
        const letterSpacing = document.getElementById('bfw-letter-spacing').value;

        document.getElementById('bfw-font-size-value').textContent = fontSize || '16';
        
        // Ensure lineHeight is a valid number before formatting
        const lineHeightValue = parseFloat(lineHeight);
        document.getElementById('bfw-line-height-value').textContent = isNaN(lineHeightValue) ? '1.5' : lineHeightValue.toFixed(1);
        
        document.getElementById('bfw-letter-spacing-value').textContent = letterSpacing || '0';
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
            // Add highlights - black background with yellow text (NO padding to prevent size change)
            const allLinks = document.querySelectorAll('a');
            allLinks.forEach(link => {
                link.dataset.bfwHighlighted = 'true';
                link.style.backgroundColor = '#000000';
                link.style.color = '#ffff00';
                link.style.fontWeight = 'bold';
                link.style.textDecoration = 'underline';
                link.style.borderRadius = '3px';
                link.style.padding = '0';  // NO padding to avoid size change
                link.style.margin = '0';   // Ensure no margin
                link.style.transition = 'background-color 0.2s ease';
            });
            button.textContent = '🔗 Unhighlight Links';
            console.log('✅ BarrierFreeWeb: All links highlighted - Black background with yellow text (no padding)');
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
        // Prevent size changes - use inline display with no padding/margin
        span.style.display = 'inline';
        span.style.padding = '0';
        span.style.margin = '0';
        span.style.border = 'none';
        span.style.lineHeight = 'inherit';

        try {
            range.surroundContents(span);
        } catch (e) {
            // If surroundContents fails, use insertNode
            const wrapper = document.createElement('span');
            wrapper.setAttribute('data-bfw-highlighted', 'true');
            wrapper.style.backgroundColor = highlightColor;
            wrapper.style.display = 'inline';
            wrapper.style.padding = '0';
            wrapper.style.margin = '0';
            wrapper.style.border = 'none';
            wrapper.style.lineHeight = 'inherit';
            wrapper.style.transition = 'background-color 0.2s ease';
            
            try {
                range.insertNode(wrapper);
                const contents = range.extractContents();
                wrapper.appendChild(contents);
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
     * Only applies CSS if settings were actually saved by the user
     * On first load, just populates the UI without changing the page
     */
    function applySavedSettings(settings, hasSavedSettings) {
        // First-time users: do NOTHING to the page
        // Just populate the UI with current page values
        // NO CSS injection, NO class changes - completely unchanged
        if (!hasSavedSettings) {
            console.log('✅ BarrierFreeWeb: First-time user - page remains completely unchanged, UI populated with page values');
            updateDisplayValues();
            return;
        }
        
        // Returning user: populate UI sliders FIRST from saved settings
        console.log('✅ BarrierFreeWeb: Returning user - loading saved settings');
        
        // Set all slider values from saved settings
        document.getElementById('bfw-font-size').value = settings.fontSize || 16;
        document.getElementById('bfw-line-height').value = settings.lineHeight || 1.5;
        document.getElementById('bfw-letter-spacing').value = settings.letterSpacing || 0;
        setFontFamilyValue(settings.fontFamily || '');  // Use safe setter for font family
        document.getElementById('bfw-cursor-size').value = settings.cursorSize || 'default';
        document.getElementById('bfw-highlight-color').value = settings.highlightColor || '#fff176';
        
        console.log('✅ BarrierFreeWeb: UI sliders populated from saved settings');
        
        // Set contrast radio
        const contrastRadio = document.querySelector(`input[name="bfw-contrast-mode"][value="${settings.contrastMode || 'none'}"]`);
        if (contrastRadio) {
            contrastRadio.checked = true;
        }
        
        // Now apply the settings to the page - with delay if using Open Dyslexic font
        const applySettings = () => {
            applyTextSettings();
            applyContrastMode(settings.contrastMode || 'none');
            applyTheme(settings.theme);
            applyCursorSize(settings.cursorSize || 'default');
            
            // Restore active preset button if a preset was active
            if (activePreset) {
                const presetBtn = document.querySelector(`[data-preset="${activePreset}"]`);
                if (presetBtn) {
                    presetBtn.classList.add('active');
                    console.log('✅ BarrierFreeWeb: Restored active preset button:', activePreset);
                }
            }
            
            updateDisplayValues();
            console.log('✅ BarrierFreeWeb: All saved settings applied to page');
        };
        
        // Add delay if using Open Dyslexic font to ensure Google Fonts are ready
        if (settings.fontFamily && settings.fontFamily.includes('Open Dyslexic')) {
            console.log('🔤 BarrierFreeWeb: Saved settings use Open Dyslexic, waiting for font to load...');
            setTimeout(applySettings, 200);
        } else {
            applySettings();
        }
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
            highlightColor: document.getElementById('bfw-highlight-color').value,
            activePreset: activePreset,
            presetBackup: presetBackup
        };
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(settings));
    }

    /**
     * Load settings from localStorage
     * Auto-detects page font size on first load if not previously saved
     */
    function loadSettings() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            if (saved) {
                const settings = JSON.parse(saved);
                // Restore activePreset and presetBackup if they exist
                if (settings.activePreset) {
                    activePreset = settings.activePreset;
                    presetBackup = settings.presetBackup;
                    console.log('✅ BarrierFreeWeb: Restored active preset:', activePreset);
                }
                return settings;
            }
        } catch (e) {
            console.warn('⚠️ BarrierFreeWeb: Could not parse saved settings:', e);
        }
        
        // No saved settings - use defaults but auto-detect page measurements
        const defaults = { ...CONFIG.defaults };
        if (defaults.fontSize === null) {
            defaults.fontSize = Math.round(detectCurrentPageFontSize());
            console.log('📏 BarrierFreeWeb: Auto-detected page font size:', defaults.fontSize + 'px');
        }
        if (defaults.lineHeight === null) {
            defaults.lineHeight = Math.round(detectCurrentPageLineHeight() * 10) / 10; // Round to 1 decimal
            console.log('📏 BarrierFreeWeb: Auto-detected page line height:', defaults.lineHeight);
        }
        return defaults;
    }

    /**
     * Reset all settings to defaults
     */
    function resetSettings() {
        console.log('🔄 BarrierFreeWeb: resetSettings() called - REMOVING ALL CUSTOMIZATIONS AND RESTORING ORIGINAL PAGE STYLE');
        
        // Reset UI to ORIGINAL PAGE VALUES (saved on first load)
        // This ensures we always return to the exact original page appearance
        document.getElementById('bfw-font-size').value = originalPageFontSize || CONFIG.defaults.fontSize || 16;
        document.getElementById('bfw-line-height').value = originalPageLineHeight || CONFIG.defaults.lineHeight || 1.5;
        document.getElementById('bfw-letter-spacing').value = originalPageLetterSpacing || CONFIG.defaults.letterSpacing || 0;
        setFontFamilyValue(originalPageFontFamily || CONFIG.defaults.fontFamily || '');  // Use safe setter
        document.getElementById('bfw-cursor-size').value = CONFIG.defaults.cursorSize;
        
        console.log('✅ BarrierFreeWeb: Reset UI to original values - fontSize:', originalPageFontSize, 'lineHeight:', originalPageLineHeight, 'letterSpacing:', originalPageLetterSpacing, 'fontFamily:', originalPageFontFamily);
        
        // Reset contrast mode radio button
        const contrastRadio = document.querySelector(`input[name="bfw-contrast-mode"][value="${CONFIG.defaults.contrastMode}"]`);
        if (contrastRadio) {
            contrastRadio.checked = true;
        }
        
        document.getElementById('bfw-highlight-color').value = CONFIG.defaults.highlightColor;
        
        // Reset theme buttons - ensure Light is active
        document.querySelectorAll('.bfw-theme-btn').forEach(btn => {
            const isLight = btn.dataset.theme === 'light';
            btn.classList.toggle('active', isLight);
            console.log('✅ BarrierFreeWeb: Reset theme button', btn.dataset.theme, 'to active:', isLight);
        });

        // Reset preset buttons
        document.querySelectorAll('.bfw-preset-btn').forEach(btn => btn.classList.remove('active'));
        activePreset = null;
        presetBackup = null;
        
        // Reset manually changed flags
        manuallyChanged = {
            fontSize: false,
            lineHeight: false,
            letterSpacing: false,
            fontFamily: false
        };

        // ========== CRITICAL: REMOVE ALL CSS CHANGES FROM PAGE ==========
        
        // Remove the injected text settings CSS
        const textSettingsStyle = document.getElementById('bfw-text-settings-style');
        if (textSettingsStyle) {
            textSettingsStyle.remove();
            console.log('✅ BarrierFreeWeb: Removed text settings CSS injection');
        }
        
        // Remove all contrast classes from body
        document.body.classList.remove(
            'bfw-contrast-invert',
            'bfw-contrast-dark',
            'bfw-contrast-light',
            'bfw-contrast-high',
            'bfw-contrast-desaturate'
        );
        
        // Remove dark theme class
        document.body.classList.remove('bfw-dark-theme');
        
        // Remove cursor classes
        document.body.classList.remove('bfw-cursor-large', 'bfw-cursor-xlarge');
        
        console.log('✅ BarrierFreeWeb: Removed all CSS classes from page');
        
        // Update display values
        updateDisplayValues();
        
        // ========== Clear localStorage ==========
        try {
            localStorage.removeItem(CONFIG.storageKey);
            console.log('✅ BarrierFreeWeb: Cleared localStorage - no saved settings');
        } catch (e) {
            console.warn('⚠️ BarrierFreeWeb: Could not clear localStorage:', e);
        }
        
        console.log('🔄 BarrierFreeWeb: Collapsing all sections except presets');
        
        // Collapse all sections except Quick Presets
        document.querySelectorAll('.bfw-group').forEach(group => {
            const section = group.getAttribute('data-section');
            const toggle = group.querySelector('.bfw-group-toggle');
            const content = group.querySelector('.bfw-group-content');
            const indicator = toggle ? toggle.querySelector('.bfw-group-indicator') : null;
            
            if (section === 'presets') {
                // Keep Quick Presets expanded
                group.classList.remove('bfw-group-collapsed');
                if (toggle) toggle.setAttribute('aria-expanded', 'true');
                if (content) content.style.display = 'block';
                if (indicator) indicator.textContent = '−';
                console.log('✅ BarrierFreeWeb: Presets section - EXPANDED (default)');
            } else {
                // Collapse all other sections
                group.classList.add('bfw-group-collapsed');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
                if (content) content.style.display = 'none';
                if (indicator) indicator.textContent = '+';
                console.log('✅ BarrierFreeWeb: Section', section, '- COLLAPSED');
            }
        });

        // Reset widget container position to default (bottom-right)
        const container = document.getElementById('bfw-widget-container');
        if (container) {
            container.style.left = 'auto';
            container.style.top = 'auto';
            container.style.right = '20px';
            container.style.bottom = '20px';
            console.log('✅ BarrierFreeWeb: Widget position reset to bottom-right');
        }
        
        console.log('✅ BarrierFreeWeb: resetSettings() completed - PAGE RETURNED TO ORIGINAL STATE');
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
