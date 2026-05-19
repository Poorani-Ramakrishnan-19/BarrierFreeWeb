# BarrierFreeWeb - Accessibility Plugin

A powerful Chrome extension that enhances website accessibility with customizable features for users with different abilities.

## 🚀 Quick Start

### Installation

1. **Clone or download** this repository
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable** "Developer mode" (toggle in top right)
4. **Click** "Load unpacked" and select this folder
5. **Done!** The accessibility icon will appear on all websites

## ✨ Features

- **Quick Presets**: 👁 Low Vision, 🌙 Dark Mode, 🧠 Dyslexia-friendly, 👵 Large Text
- **Theme Options**: ☀️ Light and 🌙 Dark themes
- **Text Dimensions**: Font size (12-40px), line height (1-3), letter spacing (0-5px)
- **Typography**: Font family (6 options) and cursor size (3 options)
- **Highlighting**: 🔗 Highlight Links, ✏️ Highlight Selection, 🎨 Color Picker, 🗑️ Clear Highlights
- **Contrast Modes**: None, 🔄 Invert, 🌙 Dark, ☀️ Light, ⚡ High, ⚪ Desaturate
- **Accessibility**: Full keyboard navigation, screen reader support, ARIA labels
- **Reset Options**: Reset Section (current only), Reset All (with confirmation)

## 🆕 Recent Updates

- **Animated Robot Icon**: Replaced static blue icon with animated Robot GIF on dark background for better visibility
- **Enhanced Highlighting**: Added emoji icons for highlight features (🔗 Links, ✏️ Selection, 🎨 Color, 🗑️ Clear)
- **Improved Reset Section**: Now correctly resets only the most recently opened section
- **Better Font Reset**: Font dropdown now properly updates when using Reset All

## 📖 How to Use

1. Look for the **Robot GIF icon** in the bottom-right corner (on dark background)
2. **Click it** to open the accessibility controls panel
3. **Choose a preset** or customize individual settings
4. **Your settings are saved** in your browser

## 📁 Project Structure

```
BarrierFreeWeb/
├── manifest.json              # Extension configuration
├── content-widget.js          # UI and widget logic
├── content-utils.js           # Utility functions
├── content.js                 # Content script loader
├── assets/
│   └── widget.css             # Widget styling
├── images/
│   ├── Robot_gif.gif          # Animated Robot icon
│   └── BarrierFreeWeb_Icon.png  # Fallback icon
└── README.md                  # This file
```

## 🛠️ For Developers

See [DEVELOPER.md](DEVELOPER.md) for:
- Architecture overview
- Code structure explanation
- How to modify and extend features
- Testing and debugging

## 📝 License

MIT License - Feel free to use, modify, and distribute

## � Author

**Poorani Ramakrishnan**
- GitHub: [@PooraniRamakrishnan](https://github.com/PooraniRamakrishnan)
- Project: BarrierFreeWeb - Making the web accessible for everyone

## �💬 Support

For issues, questions, or suggestions, please open an issue on GitHub.
