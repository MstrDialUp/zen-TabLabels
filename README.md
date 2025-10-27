# Tab Labels for Zen Browser

A Firefox extension compatible with Zen Browser that allows you to add customizable, color-coded labels to your tabs via the context menu.

## Features

- **Context Menu Integration**: Right-click on any tab or page to add labels
- **Color-Coded Labels**: Each label has a colored circle indicator (randomly selected by default)
- **Custom Colors**: Choose your own colors when creating labels
- **Quick Label Selection**: Previously created labels appear in the context menu for quick reuse
- **Visual Indicators**: Labels appear in the tab title with color-coded circles
- **Session Persistence**: Labels are saved across browser sessions
- **Label Management**: View all active labels and their usage in the extension popup

## Installation

### Development Installation (Temporary)

1. Clone this repository:
   ```bash
   git clone https://github.com/MstrDialUp/zen-TabLabels.git
   cd zen-TabLabels
   ```

2. Generate icon files (see `icons/README.md` for instructions) or temporarily remove icon references from `manifest.json`

3. Open Zen Browser (or Firefox)

4. Navigate to `about:debugging#/runtime/this-firefox`

5. Click "Load Temporary Add-on"

6. Select the `manifest.json` file from the extension directory

7. The extension will now be loaded and active

### Permanent Installation

To install permanently:

1. Generate the required icon files (see `icons/README.md`)

2. Package the extension as a `.xpi` file:
   ```bash
   zip -r tab-labels.xpi * -x "*.git*" -x "*node_modules*" -x "*.DS_Store"
   ```

3. Sign the extension through [addons.mozilla.org](https://addons.mozilla.org/developers/)

4. Install the signed `.xpi` file in your browser

## Usage

### Adding a New Label

1. Right-click on any tab (or anywhere on the page)
2. Select **"Add Label to Tab"** → **"Create New Label..."**
3. Enter your label text in the dialog
4. Choose a color or click "Random" for a random color
5. Click "Save"

The tab title will now include your label with a colored indicator: `[Label] Page Title`

### Using Existing Labels

1. Right-click on any tab
2. Select **"Add Label to Tab"**
3. Choose from the list of previously created labels (shown with their color indicators)

### Removing Labels

1. Right-click on the labeled tab
2. Select **"Remove Label from Tab"**

### Viewing Label Statistics

1. Click the extension icon in the toolbar
2. A popup will show all active labels and how many tabs use each label

## How It Works

### Label Display

Labels are displayed in two ways:
1. **Tab Title**: The label is prepended to the tab title in brackets with a color indicator: `[Label] Original Title`
2. **Context Menu**: Labels with their color indicators (●) appear in the context menu for quick reuse

### Storage

- Labels are stored locally using the browser's `storage.local` API
- Each tab's label is associated with its tab ID
- Labels persist across browser sessions
- Labels are automatically cleaned up when tabs are closed

### Session Labels

- The extension tracks all labels created during the current browser session
- These labels appear in the context menu for quick access
- The list updates dynamically as you create new labels

## Browser Compatibility

This extension is built for:
- **Zen Browser** (Primary target)
- **Firefox** 109.0 and later
- Other Firefox-based browsers

The extension uses Manifest V2 for maximum compatibility with Firefox and Zen Browser.

## File Structure

```
tab-labels/
├── manifest.json          # Extension manifest
├── background.js          # Background script (context menus, storage)
├── content.js             # Content script (label UI, dialogs)
├── styles.css             # Styles for label dialogs
├── popup.html             # Extension popup HTML
├── popup.js               # Extension popup JavaScript
├── icons/                 # Extension icons
│   ├── icon.svg          # SVG icon source
│   ├── icon16.png        # 16x16 icon
│   ├── icon48.png        # 48x48 icon
│   └── icon128.png       # 128x128 icon
└── README.md             # This file
```

## Development

### Prerequisites

- Zen Browser or Firefox 109+
- Basic knowledge of WebExtensions API

### Making Changes

1. Edit the source files
2. Reload the extension in `about:debugging`
3. Test your changes

### Key Components

- **background.js**: Handles context menu creation, label storage, and inter-script communication
- **content.js**: Manages the label dialog UI and updates tab titles
- **styles.css**: Provides styling for the label creation dialog
- **popup.html/popup.js**: Displays label statistics in the toolbar popup

## Permissions

This extension requires the following permissions:

- `tabs`: To access and modify tab information
- `storage`: To save labels persistently
- `contextMenus`: To add items to the context menu
- `<all_urls>`: To inject label UI into all pages

## Known Limitations

1. **Tab Display**: Due to browser security restrictions, labels appear in the tab title rather than as separate visual elements in the tab bar itself. This is a limitation of the WebExtensions API.

2. **Icon Files**: The repository includes an SVG source but requires PNG files to be generated for the extension to display icons properly.

3. **Tab Identification**: Labels are tied to tab IDs, which may change if tabs are restored from a previous session. Future versions may implement URL-based label persistence.

## Future Enhancements

Potential features for future versions:
- [ ] URL-based label persistence (labels that follow specific URLs)
- [ ] Label groups and categories
- [ ] Keyboard shortcuts for quick labeling
- [ ] Export/import label configurations
- [ ] Custom label templates
- [ ] Search and filter tabs by label

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is open source. See the repository for license details.

## Credits

Created for Zen Browser users who want better tab organization.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.
