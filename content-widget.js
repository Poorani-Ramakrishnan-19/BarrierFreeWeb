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
            transition: all 0.2s ease;
        }
        #ba-access-widget:hover {
            box-shadow: 0 6px 20px rgba(60, 60, 90, 0.35);
            transform: translateY(-2px);
        }
        #ba-access-widget svg { width: 26px; height: 26px; fill: white; }

        #ba-widget-panel {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 280px;
            background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(60, 60, 90, 0.15);
            z-index: 2147483647;
            padding: 16px;
            display: none;
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #22223b;
        }
        #ba-widget-panel h3 { margin: 0 0 12px; font-size: 1.1em; font-weight: 600; color: #3a3a5a; }
        #ba-widget-panel .ba-setting-group { margin-bottom: 8px; }
        #ba-widget-panel .ba-toggle-slider {
            width: 100%;
            padding: 8px;
            border: none;
            border-radius: 8px;
            background: #e7eaf6;
            color: #3a5ad7;
            font-size: 0.95em;
            font-weight: 500;
            margin-bottom: 2px;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
        }
        #ba-widget-panel .ba-toggle-slider:hover, #ba-widget-panel .ba-toggle-slider.active {
            background: #5a7cff;
            color: #fff;
        }
        #ba-widget-panel .ba-slider-container, #ba-widget-panel .ba-dropdown-container {
            padding: 6px 0 0 0;
            display: none;
            animation: fadeIn 0.2s;
        }
        #ba-widget-panel .ba-slider-container.active, #ba-widget-panel .ba-dropdown-container.active {
            display: block;
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
        #ba-widget-panel input[type="color"] {
            width: 100%;
            height: 30px;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
            margin-bottom: 8px;
            padding: 2px;
        }
        #ba-widget-panel label { display: block; font-size: 0.9em; color: #4a4a6a; margin-bottom: 4px; }
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
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);

    const icon = document.createElement('div');
    icon.id = 'ba-access-widget';
    icon.className = 'ba-widget-element';
    icon.title = 'Barrier Free Web';
    icon.innerHTML = `
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 2C15.4 2 2 15.4 2 32s13.4 30 30 30 30-13.4 30-30S48.6 2 32 2zm0 8c4.4 0 8 3.6 8 8 0 2.5-1.2 4.7-3.1 6.1L42 34v6h-4v14h-4V40h-4v-6l5.1-3.9C29.7 31.3 28.5 29.1 28.5 26.5c0-4.4 3.6-8 8-8z"/></svg>
    `;

    const panel = document.createElement('div');
    panel.id = 'ba-widget-panel';
    panel.className = 'ba-widget-element';
    panel.innerHTML = `
        <h3>Accessibility Controls</h3>
        <div class="ba-setting-group">
            <button class="ba-toggle-slider" data-target="fontSize">Font Size</button>
            <div class="ba-slider-container" id="ba-fontSize-container">
                <label>Size: <span id="ba-fontSize-value">16</span>px</label>
                <input type="range" id="ba-fontSize" min="12" max="40" value="16">
            </div>
        </div>
        <div class="ba-setting-group">
            <button class="ba-toggle-slider" data-target="lineHeight">Line Height</button>
            <div class="ba-slider-container" id="ba-lineHeight-container">
                <label>Height: <span id="ba-lineHeight-value">1.5</span></label>
                <input type="range" id="ba-lineHeight" min="1" max="3" step="0.1" value="1.5">
            </div>
        </div>
        <div class="ba-setting-group">
            <button class="ba-toggle-slider" data-target="spacing">Letter Spacing</button>
            <div class="ba-slider-container" id="ba-spacing-container">
                <label>Spacing: <span id="ba-spacing-value">0</span>px</label>
                <input type="range" id="ba-spacing" min="0" max="5" step="0.1" value="0">
            </div>
        </div>
        <div class="ba-setting-group">
            <button class="ba-toggle-slider" data-target="fontFamily">Font</button>
            <div class="ba-dropdown-container" id="ba-fontFamily-container">
                <select id="ba-fontFamily"><option value="">Default (No Change)</option><option value="Arial">Arial</option><option value="Verdana">Verdana</option><option value="Georgia">Georgia</option><option value="Times New Roman">Times</option><option value="OpenDyslexic">OpenDyslexic</option></select>
            </div>
        </div>
        <div class="ba-setting-group">
            <button class="ba-toggle-slider" data-target="cursorSize">Cursor Size</button>
            <div class="ba-dropdown-container" id="ba-cursorSize-container">
                <select id="ba-cursorSize"><option value="default">Default</option><option value="large">Large</option><option value="xlarge">Extra Large</option></select>
            </div>
        </div>
        <div class="ba-setting-group">
            <button class="ba-toggle-slider" data-target="highlight">Highlight Text</button>
            <div class="ba-dropdown-container" id="ba-highlight-container">
                <label for="ba-highlightColor">Highlight Color</label>
                <input id="ba-highlightColor" type="color" value="#fff176">
                <button id="ba-highlight">Highlight Selection</button>
                <button id="ba-clearHighlights" class="secondary">Clear Highlights</button>
            </div>
        </div>
        <button id="ba-reset" class="secondary">Reset</button>
    `;

    let isDragging = false;
    let hasDragged = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    function updateWidgetPosition(x, y) {
        icon.style.left = x + 'px';
        icon.style.top = y + 'px';
        icon.style.right = 'auto';
        icon.style.bottom = 'auto';
        panel.style.left = x + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        panel.style.top = (y - panel.offsetHeight - 10) + 'px';
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

    const fontSize = document.getElementById('ba-fontSize');
    const lineHeight = document.getElementById('ba-lineHeight');
    const spacing = document.getElementById('ba-spacing');
    const fontFamily = document.getElementById('ba-fontFamily');
    const cursorSize = document.getElementById('ba-cursorSize');
    const highlightColor = document.getElementById('ba-highlightColor');

    const fontSizeValue = document.getElementById('ba-fontSize-value');
    const lineHeightValue = document.getElementById('ba-lineHeight-value');
    const spacingValue = document.getElementById('ba-spacing-value');

    const toggleButtons = panel.querySelectorAll('.ba-toggle-slider');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const containerId = `ba-${target}-container`;
            const containers = panel.querySelectorAll('.ba-slider-container, .ba-dropdown-container');

            containers.forEach(c => {
                if (c.id !== containerId) c.classList.remove('active');
            });
            toggleButtons.forEach(b => {
                if (b !== this) b.classList.remove('active');
            });

            const container = document.getElementById(containerId);
            if (container) {
                container.classList.toggle('active');
                this.classList.toggle('active');
            }
        });
    });

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

    document.getElementById('ba-reset').addEventListener('click', () => {
        fontSize.value = 16;
        lineHeight.value = 1.5;
        spacing.value = 0;
        fontFamily.value = '';
        cursorSize.value = 'default';
        highlightColor.value = '#fff176';
        updateValues();
        applyTextSettings({ reset: true });
    });
    document.getElementById('ba-highlight').addEventListener('click', () => {
        highlightSelection(highlightColor.value || '#fff176');
    });
    document.getElementById('ba-clearHighlights').addEventListener('click', clearHighlights);

    document.addEventListener('click', (event) => {
        if (!panel.contains(event.target) && !icon.contains(event.target)) {
            panel.style.display = 'none';
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            panel.querySelectorAll('.ba-slider-container, .ba-dropdown-container').forEach(c => c.classList.remove('active'));
        }
    });
}
