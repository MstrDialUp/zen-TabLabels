# Zen Tab Labels

A powerful mod for Zen Browser that allows you to add customizable labels to your tabs with colored indicators. Perfect for organizing your browsing sessions and keeping track of important tabs!

## Features

- **Custom Labels**: Add descriptive text labels to any tab
- **Color Coding**: Choose from 12 preset colors or pick your own custom color
- **Context Menu Integration**: Easy access via right-click on any tab
- **Persistent Storage**: Labels are saved across browser sessions using IndexedDB
- **Visual Indicators**: Colored circles next to labels for quick visual identification
- **Clean UI**: Beautiful dialog interface that matches Zen Browser's design

## Installation

1. Download or clone this repository
2. Place the `zen-TabLabels` folder in your Zen Browser mods directory:
   - **Linux**: `~/.zen/mods/`
   - **Windows**: `%APPDATA%\Zen\mods\`
   - **macOS**: `~/Library/Application Support/Zen/mods/`
3. Restart Zen Browser
4. The mod should be automatically loaded

## Usage

### Adding a Label

1. Right-click on any tab
2. Select **"Add Label..."** from the context menu
3. Enter your label text (up to 50 characters)
4. Choose a color from the preset palette or use the custom color picker
5. Click **"Save"**

The label will appear underneath the tab title with your chosen color indicator.

### Editing a Label

1. Right-click on a tab that already has a label
2. Select **"Edit Label..."** from the context menu
3. Modify the text or color
4. Click **"Save"**

### Removing a Label

You can remove a label in two ways:

1. **From the context menu**:
   - Right-click on the tab
   - Select **"Remove Label"**

2. **From the edit dialog**:
   - Open the label dialog
   - Click the **"Remove Label"** button

## How It Works

The mod uses several components:

- **storage.js**: Manages persistent storage using IndexedDB
- **tabLabels.js**: Handles tab label rendering and management
- **contextMenu.js**: Provides the context menu integration and dialog UI
- **tabLabels.css**: Styles for the labels and dialog interface
- **mod.js**: Main entry point that initializes all components

Labels are stored with a stable ID based on the tab's URL and context, ensuring they persist across browser restarts.

## Customization

### Default Colors

The mod comes with 12 preset colors:
- Red (#FF6B6B)
- Teal (#4ECDC4)
- Blue (#45B7D1)
- Coral (#FFA07A)
- Mint (#98D8C8)
- Yellow (#F7DC6F)
- Purple (#BB8FCE)
- Sky Blue (#85C1E2)
- Orange (#F8B739)
- Green (#52B788)
- Crimson (#E63946)
- Navy (#457B9D)

You can also choose any custom color using the color picker!

## Browser Compatibility

This mod is designed for **Zen Browser** and requires:
- Zen Browser 1.0.0 or higher
- Firefox-based browser engine

## Troubleshooting

**Labels not appearing after restart?**
- Check that the mod is properly installed in the mods directory
- Ensure you have the latest version of Zen Browser

**Context menu item not showing?**
- Try restarting the browser
- Check the browser console for any error messages

**Custom colors not working?**
- Make sure you're using a modern version of Zen Browser
- Try using one of the preset colors as a fallback

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

MIT License - feel free to use and modify as needed!

## Credits

Created for the Zen Browser community. Special thanks to all contributors and testers!
