# Extension Icons

This directory should contain the following icon files:
- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

## Generating Icons

You can use the provided `icon.svg` file to generate PNG icons at the required sizes using any SVG to PNG converter, such as:

### Using ImageMagick (if installed):
```bash
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

### Using Inkscape (if installed):
```bash
inkscape icon.svg -w 16 -h 16 -o icon16.png
inkscape icon.svg -w 48 -h 48 -o icon48.png
inkscape icon.svg -w 128 -h 128 -o icon128.png
```

### Online Tools:
- https://cloudconvert.com/svg-to-png
- https://svgtopng.com/

## Temporary Development

For development purposes, you can temporarily modify the `manifest.json` to remove the icon references, though this will result in a default extension icon being displayed.
