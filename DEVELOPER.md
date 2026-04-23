# Developer Guide

## Architecture Overview

BarrierFreeWeb is a Chrome extension that injects accessibility controls into web pages via content scripts.

### How It Works

1. **Manifest** (`manifest.json`) - Declares extension permissions and content scripts
2. **Content Scripts** - Load on every page
   - `content-utils.js` - Utility functions for text effects and styling
   - `content-widget.js` - Creates and manages the UI widget
   - `content.js` - Entry point that initializes the widget
3. **Styles** (`assets/widget.css`) - External CSS for the widget UI
4. **Assets** (`images/`) - Icons and resources

## File Structure

### `manifest.json`
Extension configuration file following Manifest V3 standard.

**Key sections:**
- `permissions` - Required browser permissions
- `content_scripts` - Files to inject into web pages
- `web_accessible_resources` - Files the extension can access

### `content-widget.js`
Main UI component file (~1000+ lines).

**Key functions:**
- `createFloatingAccessWidget()` - Creates the main widget and panel
- `applyPreset(name)` - Applies preset accessibility settings
- `applyTheme(theme)` - Changes the color theme
- `saveSettings()` - Persists user preferences to localStorage
- `loadSettings()` - Restores saved preferences

**Widget Elements:**
- Dark circular button with animated Robot GIF (bottom-right corner)
- Control panel with accessibility options
- Quick presets grid
- Theme, text, and visual controls

### `content-utils.js`
Utility functions for text and styling manipulation (~300+ lines).

**Key functions:**
- Text effect application
- DOM manipulation helpers
- Contrast and highlighting utilities

### `assets/widget.css`
External stylesheet for the widget (~600+ lines).

**Includes:**
- Widget layout and positioning
- Button and panel styling
- Responsive design
- Accessibility focus states
- Theme color definitions
- Animation and transition effects

### `images/`
Icon assets folder.

**Files:**
- `Robot_gif.gif` - Animated Robot icon for the floating widget
- `BarrierFreeWeb_Icon.png` - Fallback static icon

## Code Flow

1. **Page Load**: Content scripts automatically execute
2. **Initialization**: `content.js` calls `createFloatingAccessWidget()`
3. **Widget Creation**: JavaScript creates:
   - Dark circular button with Robot GIF icon (bottom-right)
   - Control panel (hidden by default)
   - Event listeners for interaction
4. **User Interaction**: 
   - Click icon → show/hide panel
   - Adjust settings → apply to page
   - Save preferences → localStorage
5. **Next Visit**: Load saved preferences automatically

## Key Features Implementation

### Quick Presets
Located in `content-widget.js` around line 100.
```javascript
const presets = {
    'low-vision': { fontSize: 130, contrast: 'high', ... },
    'dark-mode': { theme: 'dark', ... },
    'dyslexia': { fontFamily: 'OpenDyslexic', ... },
    'large-text': { fontSize: 150, lineHeight: 1.8, ... }
};
```

### Theme Customization
Implemented through CSS variable overrides in `widget.css`.
Theme options: Light, Dark, Blue, High Contrast, etc.

### Text Controls
Modifies global CSS properties:
- Font size (percentage based)
- Line height (spacing between lines)
- Letter spacing (spacing between characters)
- Word spacing

### Visual Effects & Highlighting
- 🔗 **Link Highlighting** - Highlights all links on the page in yellow
- ✏️ **Selection Highlighting** - Highlights selected/marked text in yellow
- 🎨 **Highlight Color** - Color picker to customize highlight color
- 🗑️ **Clear Highlights** - Removes all active highlights
- High contrast mode
- Cursor size increase
- Focus indicators

### Reset Functionality
The plugin provides two distinct reset options:

**Reset Section:**
- Resets only the **most recently opened section**
- Tracks which section was last interacted with using `lastOpenedSection` variable
- Example: If you open Typography then click Highlight, clicking Reset Section will reset Highlight (not Typography)
- All other settings remain unchanged
- Implemented in `content-widget.js` event listeners

**Reset All:**
- Resets **all settings** back to defaults
- Shows a confirmation dialog to prevent accidental resets
- Restores everything: font, size, spacing, color, contrast, themes, highlights
- Triggers `fontFamily.dispatchEvent()` to update dropdown UI
- Located in Reset section at bottom of panel

## Extending the Plugin

### Adding a New Preset
1. Open `content-widget.js`
2. Find the presets object in `createFloatingAccessWidget()`
3. Add new preset configuration:
```javascript
'new-preset': {
    fontSize: 120,
    contrast: 'medium',
    theme: 'light',
    fontFamily: 'sans-serif',
    lineHeight: 1.6
}
```

### Adding a New Control
1. Add HTML in `content-widget.js` (the panel HTML section)
2. Add CSS in `assets/widget.css`
3. Add JavaScript handler in `content-widget.js` event listeners

### Modifying Styles
Edit `assets/widget.css` directly. No recompilation needed.

### Modifying Widget Appearance
Update the hardcoded styles in the HTML/CSS sections of files.

## Testing & Debugging

### Loading in Chrome
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → select this folder
4. Reload the page to see changes

### Debugging
1. Right-click on any web page → "Inspect"
2. In DevTools console, you can access:
   - Window variables containing settings
   - DOM elements with `ba-` class names
   - Check localStorage for saved settings

### Common Issues

**Icon not showing:**
- Check `manifest.json` web_accessible_resources
- Verify `images/BarrierFreeWeb_Icon.png` exists
- Clear browser cache and hard reload

**Styles not applying:**
- Verify `assets/widget.css` path in `content-widget.js`
- Check Chrome DevTools for CSS errors
- Ensure CSS specificity isn't being overridden

**Settings not saving:**
- Check browser localStorage is enabled
- Verify no browser extensions blocking storage
- Check browser console for errors

## Best Practices

1. **Always test** in multiple websites
2. **Use semantic HTML** for accessibility
3. **Maintain CSS** in external file (`widget.css`)
4. **Test keyboard navigation** thoroughly
5. **Keep file sizes** reasonable
6. **Comment complex logic** for future maintainers

## Performance Considerations

- Widget is injected after page load
- CSS is loaded via external file (better caching)
- Settings use localStorage (no server calls)
- Minimal DOM manipulation for efficiency
- CSS transitions use `transform` for performance

## Browser Compatibility

- Chrome/Chromium 88+
- Edge 88+
- Opera 74+
- Brave 1.20+

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/)
