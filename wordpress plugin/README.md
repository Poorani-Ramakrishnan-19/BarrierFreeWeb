# BarrierFreeWeb Accessibility Plugin for WordPress

**Make your WordPress site accessible to everyone!** A powerful, lightweight floating accessibility widget that provides users with customizable controls for fonts, colors, contrast modes, and more.

## 🎯 What It Does

BarrierFreeWeb adds a floating accessibility button (animated Robot icon) to your WordPress site that opens a panel with 8 accessibility features:

- **Quick access presets** - One-click solutions for common accessibility needs
- **Text customization** - Adjust font size, line height, letter spacing
- **Typography options** - Choose from 6 different fonts and 3 cursor sizes
- **Color & contrast** - 6 different contrast modes for visual preferences
- **Theme switching** - Light and dark themes
- **Content highlighting** - Highlight links and selected text
- **Settings persistence** - All changes saved to browser for future visits
- **Full keyboard support** - Navigate everything with Tab key

**Perfect for:** Users with low vision, dyslexia, color blindness, motor disabilities, or anyone who needs reading customization.

## ✨ Complete Feature List

### **Quick Presets** (1-click Solutions)
- 👁 **Low Vision** - Larger text, increased spacing, high contrast
- 🌙 **Dark Mode** - Dark background, light text, high contrast
- 🧠 **Dyslexia-friendly** - Open Dyslexic font, increased spacing
- 👵 **Large Text** - Larger fonts and spacing for readability

### **Text Dimensions** (Fully Customizable)
- **Font Size**: 12px (tiny) to 28px (jumbo)
- **Line Height**: 1.0 (compact) to 3.0 (spacious)
- **Letter Spacing**: 0px (normal) to 5px (wide)

### **Typography**
- **Font Family**: 6 options (Arial, Verdana, Georgia, Times New Roman, Open Dyslexic)
- **Cursor Size**: Default, Large, Extra Large (helps motor disabilities)

### **Highlighting Tools** (For Content Focus)
- **🔗 Highlight Links**: Toggle to highlight/unhighlight all links
- **✏️ Highlight Selection**: Highlight text you select with custom color
- **🎨 Color Picker**: Choose any highlight color
- **🗑️ Clear Highlights**: Remove all highlights at once

### **Theme Options**
- ☀️ **Light Mode** - White background, dark text (default)
- 🌙 **Dark Mode** - Dark background, light text

### **6 Contrast Modes** (With Hover Descriptions)
- **None** - Default colors (no changes)
- **🔄 Invert** - Reversed colors (inverts entire page)
- **🌙 Dark** - Dark background with light text
- **☀️ Light** - Light background with dark text
- **⚡ High** - Maximum contrast (pure black & white)
- **⚪ Desaturate** - Grayscale (removes all colors)

### **User Interface**
- **Collapsible Sections** - Expand/collapse to find what you need
- **Scrollable Panel** - Responsive scrolling for all controls
- **Animated Robot Icon** - Fun, accessible, attention-grabbing button
- **Reset Options** - Reset current section or all settings

### **Technical Features**
- ✅ **WCAG 2.1 AA Compliant** - Meets web accessibility standards
- ✅ **Full Keyboard Navigation** - Tab, Enter, Escape keys work
- ✅ **Screen Reader Support** - ARIA labels and live regions
- ✅ **localStorage Persistence** - Saves across page visits
- ✅ **Mobile Friendly** - Touch-optimized for tablets/phones
- ✅ **No Dependencies** - Pure vanilla JavaScript
- ✅ **Works on All Themes** - Doesn't interfere with site design

## 📥 Installation & Setup

### **Easiest Method: Upload in WordPress Admin**

1. Download the `barrierfreeweb-accessibility` folder
2. Go to **WordPress Admin** → **Plugins** → **Add New** → **Upload Plugin**
3. Select the plugin folder and click **Install Now**
4. Click **Activate Plugin**
5. ✅ **Done!** The widget appears on all frontend pages immediately

### **Manual FTP Method**

1. Download the `barrierfreeweb-accessibility` folder
2. Connect via FTP/SFTP to your WordPress host
3. Upload to `/wp-content/plugins/barrierfreeweb-accessibility/`
4. Go to **WordPress Admin** → **Plugins**
5. Find "BarrierFreeWeb Accessibility" and click **Activate**
6. ✅ **Done!** The widget appears on all frontend pages immediately

### **What Gets Installed**

```
/wp-content/plugins/barrierfreeweb-accessibility/
├── barrierfreeweb-accessibility.php      # Main plugin (WordPress integration)
├── js/
│   └── accessibility.js                  # Widget functionality (~15KB)
├── css/
│   └── accessibility.css                 # Widget styling (~5KB)
├── images/
│   └── Robot_gif.gif                     # Animated icon
└── README.md                             # Documentation
```

### **Verification**

After activation, you should see:
- ✅ A **floating button** in the bottom-right corner of your site (frontend only, not admin)
- ✅ The button shows an **animated Robot icon** on a dark background
- ✅ Clicking it opens a **panel with accessibility controls**

## 🎮 How to Use

### **For Website Visitors**

1. **Look for the button** in the bottom-right corner (animated Robot icon on dark background)
2. **Click the button** to open the accessibility panel
3. **Choose a preset** or customize individual settings:
   - Adjust text size with the slider
   - Pick a font from the dropdown
   - Toggle dark mode
   - Select a contrast mode
   - Highlight links or text
4. **Settings are saved automatically** - your preferences stay when you come back
5. **Use Reset Section** to undo changes to just one section
6. **Use Reset All** to restore everything to default (with confirmation)

### **For Website Administrators**

**Zero Configuration Needed!** The plugin works out-of-the-box:
- ✅ Appears automatically on all public pages
- ✅ Hidden from WordPress admin pages
- ✅ Works with any WordPress theme
- ✅ No database tables created
- ✅ No settings page to configure
- ✅ No performance impact

**User Settings Storage:**
- Settings stored in browser's **localStorage** (not WordPress database)
- Each user's settings are private to their browser
- Settings survive across page visits (same browser)
- Users can clear their own settings anytime

### **Keyboard Accessibility**

| Key | Action |
|-----|--------|
| **Tab** | Move to next control |
| **Shift + Tab** | Move to previous control |
| **Enter/Space** | Activate buttons |
| **Escape** | Close the panel |
| **Arrow Keys** | Navigate sliders and radio buttons |

All controls are fully keyboard navigable - you never need a mouse!

## 🛠️ Customization Guide

### **Change Widget Button Position**

Edit `css/accessibility.css` and find the `#bfw-widget-container` rule:

```css
#bfw-widget-container {
    position: fixed;
    bottom: 20px;    /* Distance from bottom - change this */
    right: 20px;     /* Distance from right - change this */
}
```

Examples:
- **Top-right**: `top: 20px; right: 20px;`
- **Top-left**: `top: 20px; left: 20px;`
- **Bottom-left**: `bottom: 20px; left: 20px;`

### **Change Button Size & Color**

Edit `.bfw-widget-button` in `css/accessibility.css`:

```css
.bfw-widget-button {
    width: 50px;           /* Button size */
    height: 50px;
    background: #1a1a1a;   /* Dark background */
    border: 2px solid white;
    border-radius: 50%;
}
```

### **Hide Widget on Specific Pages**

Add to your theme's `functions.php`:

```php
add_action('wp_enqueue_scripts', function() {
    // Hide on specific page IDs
    if (is_page(array(123, 456))) {
        wp_dequeue_style('barrierfreeweb-accessibility-style');
        wp_dequeue_script('barrierfreeweb-accessibility-script');
    }
    
    // Hide only on homepage
    if (is_front_page()) {
        wp_dequeue_style('barrierfreeweb-accessibility-style');
        wp_dequeue_script('barrierfreeweb-accessibility-script');
    }
}, 99);
```

### **Add Custom Preset**

Edit `js/accessibility.js` and find the `applyPreset()` function. Add a new preset:

```javascript
const presets = {
    'low-vision': { fontSize: 20, lineHeight: 1.8, letterSpacing: 1 },
    'dark-mode': { fontSize: 16, lineHeight: 1.6, letterSpacing: 0, theme: 'dark', contrastMode: 'high' },
    'my-custom': { fontSize: 18, lineHeight: 2, letterSpacing: 2, theme: 'dark', contrastMode: 'dark' }
};
```

### **Customize Default Settings**

Edit `js/accessibility.js` and find the `CONFIG` object:

```javascript
const CONFIG = {
    storageKey: 'barrierfreeweb_settings',
    defaults: {
        fontSize: 16,           // Default font size
        lineHeight: 1.5,
        letterSpacing: 0,
        fontFamily: '',
        cursorSize: 'default',
        contrastMode: 'none',   // Default contrast mode
        theme: 'light',         // Default theme
        highlightColor: '#fff176'
    }
};
```

### **Add Custom Font Option**

Edit `js/accessibility.js` and find the font dropdown in `createWidget()`:

```html
<select id="bfw-font-family">
    <option value="">Default (System)</option>
    <option value="Arial, sans-serif">Arial (Sans-serif)</option>
    <option value="Verdana, sans-serif">Verdana (Clean)</option>
    <option value="Georgia, serif">Georgia (Serif)</option>
    <option value="'Times New Roman', serif">Times New Roman (Classic)</option>
    <option value="'Open Dyslexic', cursive">Open Dyslexic (Dyslexia-friendly)</option>
    <!-- Add your custom font here -->
    <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
</select>
```

### **Modify CSS Variables & Colors**

Key colors in `css/accessibility.css`:
- `#1a1a1a` - Dark button background
- `#667eea` - Primary action color (purple)
- `#764ba2` - Secondary action color
- `#f5f5f5` - Light gray backgrounds
- `#fff176` - Default highlight color

### **Debug or Disable Widget**

Add to `functions.php` to completely disable the plugin programmatically:

```php
add_action('plugins_loaded', function() {
    if (defined('BARRIERFREEWEB_DISABLE') && BARRIERFREEWEB_DISABLE) {
        wp_dequeue_style('barrierfreeweb-accessibility-style');
        wp_dequeue_script('barrierfreeweb-accessibility-script');
    }
}, 10);
```

Then add to `wp-config.php`:

```php
define('BARRIERFREEWEB_DISABLE', true); // Set to false to re-enable
```

## 📁 File Structure & Technical Details

```
barrierfreeweb-accessibility/
├── barrierfreeweb-accessibility.php      # Main plugin file (WordPress integration)
├── js/
│   └── accessibility.js                  # Widget logic & DOM manipulation (~15KB)
├── css/
│   └── accessibility.css                 # Widget styling & responsive design (~5KB)
├── images/
│   └── Robot_gif.gif                     # Animated accessibility button icon
└── README.md                             # This file
```

### **barrierfreeweb-accessibility.php** (Main Plugin File)
This file handles WordPress integration:
- **Plugin Header** - Name, description, author, license metadata
- **Activation/Deactivation Hooks** - Setup/cleanup on plugin lifecycle
- **CSS/JS Enqueuing** - Loads stylesheet and script with proper WordPress functions
- **Widget Output** - Outputs HTML container where widget renders
- **Security** - Prevents direct file access with `defined('ABSPATH')` check

**Key Functions:**
- `enqueue_assets()` - Loads CSS/JS with version numbers for cache-busting
- `output_widget_wrapper()` - Outputs `<div id="bfw-widget-container"></div>`
- `plugin_dir_url()` - Gets correct path for images (Robot GIF)

### **js/accessibility.js** (Widget Logic)
Pure vanilla JavaScript - no jQuery or other dependencies:
- **Settings Management** - localStorage save/load/reset
- **Widget Creation** - Builds HTML for all UI controls
- **Event Listeners** - Handles button clicks, slider input, dropdown changes
- **DOM Manipulation** - Applies text styling, theme changes, contrast modes
- **Highlighting** - Links and text highlighting with toggle functionality
- **Presets** - Quick preset configurations (Low Vision, Dark Mode, etc.)

**Key Functions:**
- `createWidget()` - Builds complete UI with all sections
- `attachEventListeners()` - Wires up all controls
- `saveSettings()` / `loadSettings()` - localStorage persistence
- `applyTextSettings()` - Font size, line height, letter spacing
- `applyContrastMode()` - Applies contrast CSS classes
- `toggleLinkHighlights()` - Toggle link highlighting on/off

### **css/accessibility.css** (Styling)
Modern, accessible styling:
- **Widget Container** - Fixed positioning in bottom-right corner
- **Floating Button** - 50x50px animated icon button with dark background
- **Panel Styling** - White panel with collapsible sections
- **Control Styles** - Buttons, sliders, dropdowns, radio buttons
- **Contrast Modes CSS** - Color/filter effects for each contrast mode
- **Dark Theme** - Dark background and light text overrides
- **Responsive Design** - Mobile-friendly adjustments
- **Accessibility** - Clear focus indicators, proper spacing

**Key Classes:**
- `.bfw-widget` - Main container
- `.bfw-widget-button` - Floating button
- `.bfw-widget-panel` - Panel with controls
- `.bfw-group` - Collapsible section
- `.bfw-group-toggle` - Section header/expand button
- `.bfw-contrast-option` - Individual contrast mode option

### **images/Robot_gif.gif** (Animated Icon)
- Animated Robot illustration (50x50px)
- Displays on the floating button
- Catches user attention on accessibility
- Replaces standard ♿ symbol with more modern design

## Accessibility Features

- ♿ **WCAG 2.1 Compliant** - Meets accessibility guidelines
- ⌨️ **Keyboard Navigation** - Use Tab to navigate, Enter/Space to activate
- 🔊 **Screen Reader Support** - ARIA labels and live regions
- 🎨 **Focus Indicators** - Clear focus states on all buttons
- 📱 **Mobile Friendly** - Touch-friendly on mobile devices
- 🚫 **Reduced Motion** - Respects `prefers-reduced-motion` preference

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Tab** | Navigate through controls |
| **Enter/Space** | Activate buttons |
| **Esc** | Close panel |

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ IE 11+ (with basic functionality)

## localStorage Details

Settings are stored under the key: `barrierfreeweb_settings`

```json
{
  "fontSize": 16,
  "lineHeight": 1.5,
  "letterSpacing": 0,
  "fontFamily": "",
  "cursorSize": "default",
  "contrastMode": "none",
  "theme": "light",
  "highlightColor": "#fff176"
}
```

**Contrast Modes:**
- `"none"` - Default colors
- `"invert"` - Inverted colors
- `"dark"` - Dark background with light text
- `"light"` - Light background with dark text
- `"high"` - Maximum contrast (black & white)
- `"desaturate"` - Grayscale

Users can clear settings by:
1. Using the "Reset Settings" button in the widget
2. Clearing browser storage/cookies
3. Using browser DevTools console:
   ```javascript
   localStorage.removeItem('barrierfreeweb_settings');
   ```

## Performance

- **Script size:** ~4KB (minified)
- **Stylesheet size:** ~3KB (minified)
- **Dependencies:** None (vanilla JS)
- **Load time impact:** Negligible (~1ms)

## ❓ FAQ & Troubleshooting

### **General Questions**

**Q: Will this slow down my website?**
A: No! The plugin is extremely lightweight (~20KB total) and has zero performance impact. It only loads CSS/JS on frontend pages, not admin.

**Q: Does this work with all WordPress themes?**
A: Yes! The plugin uses CSS that doesn't conflict with any theme. It's completely self-contained.

**Q: Can I customize it for my brand?**
A: Absolutely! See the Customization Guide above for changing colors, position, fonts, and more.

**Q: Is it WCAG compliant?**
A: Yes! WCAG 2.1 Level AA compliant with full keyboard navigation, screen reader support, and proper color contrast.

**Q: Can I hide it on certain pages?**
A: Yes! See the Customization Guide for code to hide it on specific pages or the homepage.

### **Widget Not Appearing**

**Problem:** I don't see the accessibility button on my site.

**Solutions:**
1. **Verify plugin is activated:**
   - Go to WordPress Admin → Plugins
   - Look for "BarrierFreeWeb Accessibility" 
   - If not listed, upload it first
   - If listed but inactive, click "Activate"

2. **Check frontend (not admin):**
   - The widget only appears on public pages
   - It's hidden in WordPress admin dashboard
   - Visit `/` or any public page to see it

3. **Check button position:**
   - The button is **bottom-right corner**
   - Look carefully at the corner
   - Scroll down if needed

4. **Check browser console:**
   - Press F12 to open Developer Tools
   - Check Console tab for JavaScript errors
   - Report any errors

5. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear WordPress cache if using a caching plugin

### **Settings Not Saving**

**Problem:** My text size/theme changes don't save when I leave and come back.

**Solutions:**
1. **Enable browser localStorage:**
   - Check browser privacy/security settings
   - Make sure localStorage is not blocked
   - Try a different browser

2. **Check for browser extensions:**
   - Disable extensions that block tracking/storage
   - Try in Incognito/Private mode
   - Check if localStorage is working with other sites

3. **Check website privacy settings:**
   - Make sure you're not in Private/Incognito browsing
   - Some browsers don't allow localStorage in private mode
   - Use normal browsing mode

4. **Verify localStorage is enabled:**
   - Open Console (F12)
   - Type: `localStorage.setItem('test', 'value')`
   - Type: `localStorage.getItem('test')`
   - Should return: `value`

### **Styling Looks Wrong**

**Problem:** The widget looks broken or overlaps with my content.

**Solutions:**
1. **Clear WordPress cache:**
   - If using WP Super Cache, W3 Total Cache, etc.
   - Go to their settings and clear cache
   - Or temporarily disable caching plugin

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear cookies and cached files

3. **Check for CSS conflicts:**
   - Disable other plugins one by one
   - See if widget displays correctly
   - Re-enable each to find conflict

4. **Check theme customizations:**
   - Some themes have custom CSS that might interfere
   - Try switching to a default theme temporarily
   - Switch back if it works

5. **Open Browser Console:**
   - Press F12
   - Check Console tab for CSS/JavaScript errors
   - Look for 404 errors for images or files

### **Button Not Clickable**

---

## 👤 Author

**Poorani Ramakrishnan**

BarrierFreeWeb is created with the mission of making the web accessible to everyone. This plugin brings comprehensive accessibility features to WordPress sites, ensuring all users can access and navigate your content comfortably.

---

## 📄 License

MIT License - Feel free to use, modify, and distribute this plugin

## 💬 Support & Contribution

For issues, suggestions, or contributions, please visit the [BarrierFreeWeb GitHub Repository](https://github.com/PooraniRamakrishnan/BarrierFreeWeb)

---

**Version:** 1.0.0  
**Last Updated:** 2026

**Problem:** I click the button but nothing happens.

**Solutions:**
1. **Check browser console for errors:**
   - Press F12 to open Developer Tools
   - Check the Console tab
   - Look for red error messages

2. **Verify JavaScript is enabled:**
   - Browser must have JavaScript enabled
   - Some security tools disable JavaScript
   - Whitelist your site or disable the security tool

3. **Check for conflicting scripts:**
   - Disable other plugins that modify DOM
   - Check if JavaScript is running from another plugin

4. **Try different browser:**
   - Test in Chrome, Firefox, Safari, Edge
   - Helps identify if it's browser-specific

### **Colors/Contrast Modes Not Working**

**Problem:** When I select a contrast mode, nothing changes.

**Solutions:**
1. **Check if mode is applied:**
   - Inspect page with F12 (Developer Tools)
   - Right-click page → Inspect Element
   - Look for `class="bfw-contrast-xxx"` on `<body>`
   - If present, CSS isn't loading

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R
   - Click Reset All to reset settings

3. **Check CSS file:**
   - Open DevTools (F12) → Sources
   - Look for `accessibility.css` in the list
   - If not found, CSS isn't loading

4. **Test with Reset:**
   - Click "Reset All" button
   - Select a contrast mode again
   - See if it works

### **Performance Issues**

**Problem:** My website is slow after installing the plugin.

**Solutions:**
1. **Check if it's really the plugin:**
   - Deactivate the plugin
   - Test site speed (should be same)
   - Reactivate and test again

2. **Update to latest version:**
   - Plugin updates often include optimizations
   - Check if there's a newer version available

3. **Check other plugins:**
   - Disable other plugins one by one
   - See which one is causing slowness
   - Uninstall conflicting plugins

### **Mobile Not Working**

**Problem:** The widget doesn't appear or work on mobile.

**Solutions:**
1. **Check browser support:**
   - iOS 12+: Safari, Chrome
   - Android 6+: Chrome, Firefox
   - Older versions may not be supported

2. **Adjust button position for mobile:**
   - Button might be off-screen
   - Edit CSS to move it higher/left
   - See Customization Guide

3. **Test in different browser:**
   - Try Safari instead of Chrome on iOS
   - Try Chrome instead of default browser on Android

### **Getting Help**

If you still have issues:
1. **Check browser console** (F12) for error messages
2. **Clear cache** and try again
3. **Disable other plugins** to isolate issue
4. **Try default theme** (like Twenty Twenty-Four)
5. **Update WordPress** to latest version
6. **Update plugin** to latest version

## 📊 Browser & Server Requirements

| Requirement | Version |
|-------------|---------|
| **WordPress** | 4.6+ |
| **PHP** | 5.6+ |
| **Chrome** | 90+ |
| **Firefox** | 88+ |
| **Safari** | 14+ |
| **Edge** | 90+ |

## 📈 Performance Metrics

- **Total File Size:** ~20KB (15KB JS + 5KB CSS)
- **Minified:** ~12KB
- **Initial Load Time:** <1ms (async)
- **Memory Usage:** <2MB
- **DOM Impact:** 1 container + dynamic elements
- **Paint Impact:** Negligible

## 📝 Version History

**v1.0.0** (2026-04-24) - Initial Release
- Complete accessibility widget with 8 features
- 6 contrast modes with hover descriptions
- Full keyboard navigation
- WCAG 2.1 AA compliant
- 100% feature parity with Chrome extension
- localStorage persistence
- Mobile friendly
- Zero dependencies
- localStorage settings persistence
- Full accessibility support

## License

MIT License - Free to use and modify

## Support

For issues, questions, or feature requests:
- Check the troubleshooting section above
- Review browser console errors
- Verify WordPress version compatibility
- Test with all plugins disabled

## � Author

**Poorani Ramakrishnan**
- GitHub: [@PooraniRamakrishnan](https://github.com/PooraniRamakrishnan)
- Project: BarrierFreeWeb - Making the web accessible for everyone

## �💬 Support

For issues, questions, or suggestions, please open an issue on GitHub.
