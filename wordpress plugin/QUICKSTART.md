# WordPress Plugin - Quick Start Guide

## 5-Minute Installation

### Step 1: Prepare Files
- Locate the `wordpress-plugin` folder in your BarrierFreeWeb project
- Rename it to `barrierfreeweb-accessibility` (recommended)

### Step 2: Upload to WordPress
Via **FTP/SFTP**:
```
Upload to: /wp-content/plugins/barrierfreeweb-accessibility/
```

Directory structure:
```
barrierfreeweb-accessibility/
├── accessibility-plugin.php
├── js/
│   └── accessibility.js
└── css/
    └── accessibility.css
```

### Step 3: Activate
1. Go to **WordPress Admin** → **Plugins**
2. Find **"BarrierFreeWeb - Accessibility Widget"**
3. Click **"Activate"**

### Step 4: Verify
1. Visit any public page on your WordPress site
2. Look for **♿ icon** in bottom-right corner
3. Click to open accessibility panel
4. Test font size, contrast, and reset buttons

✅ **Done!** The widget is now active on your site.

## How It Works

- **Floating Button**: Dark button with Robot GIF icon (♿)
- **Panel**: Opens on click, shows multiple accessibility controls
- **Features**: 
  - Quick Presets (👁 Low Vision, 🌙 Dark Mode, 🧠 Dyslexia, 👵 Large Text)
  - Text adjustments (Font size, Line height, Letter spacing)
  - Typography (Font family, Cursor size)
  - Theme toggle (☀️ Light / 🌙 Dark modes)
  - High contrast mode
  - Highlighting (🔗 Links, ✏️ Selection, 🎨 Color, 🗑️ Clear)
  - Reset buttons (Reset Section, Reset All)
- **Settings**: Saved to browser localStorage (not database)
- **All Pages**: Widget appears on every public page automatically

## Customize

### Change Button Color
Edit `css/accessibility.css`, find `.bfw-widget-button`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Change these hex colors */
```

### Move Widget Position
Edit `css/accessibility.css`, find `#bfw-widget-container`:
```css
bottom: 20px;  /* Distance from bottom */
right: 20px;   /* Distance from right */
```

### Add to Specific Pages Only
Add to theme's `functions.php`:
```php
add_action('wp_enqueue_scripts', function() {
    // Only load on homepage and blog
    if (!is_home() && !is_front_page()) {
        wp_dequeue_style('barrierfreeweb-accessibility-style');
        wp_dequeue_script('barrierfreeweb-accessibility-script');
    }
}, 99);
```

## No Configuration Needed

✅ Works immediately after activation
✅ No database tables created
✅ No settings page to configure
✅ No dependencies or conflicts

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Widget not visible | Clear browser cache, hard refresh (Ctrl+Shift+R) |
| Settings not saving | Enable localStorage in browser settings |
| Styling broken | Deactivate other plugins to check for conflicts |
| Not on admin pages | Widget only shows on frontend (working as designed) |

## Uninstall

Simply **deactivate and delete** the plugin from WordPress Admin → Plugins.
No database cleanup needed - settings are in browser localStorage only.

## Files Included

| File | Purpose | Size |
|------|---------|------|
| `accessibility-plugin.php` | Main WordPress plugin file | ~2KB |
| `js/accessibility.js` | Widget functionality | ~8KB |
| `css/accessibility.css` | Widget styling | ~6KB |
| `README.md` | Full documentation | Detailed |

## Support

See `README.md` in the `wordpress-plugin` folder for:
- Complete feature list
- Customization options
- Accessibility details
- Browser compatibility
- Development guide

## Next Steps

1. ✅ Upload plugin to `/wp-content/plugins/`
2. ✅ Activate from WordPress Admin
3. ✅ Test on public pages
4. ✅ Customize colors/position if desired
5. ✅ Share widget with your users!

**Questions?** Review the full README.md in the plugin folder.
