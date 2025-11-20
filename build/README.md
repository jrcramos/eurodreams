# Application Icons

This directory contains the application icons for different platforms:

- `icon.ico` - Windows icon (contains multiple sizes: 256x256, 128x128, etc.)
- `icon.icns` - macOS icon (Apple ICNS format)
- `icon.png` - Linux icon (512x512 PNG)

## Regenerating Icons

If you need to regenerate the icons from the source PNG file (`icon-512.png` in the root directory), run:

```bash
npm run generate-icons
```

This will use the `scripts/generate-icons.cjs` script to convert the PNG to all required formats.

## Source

These icons are generated from `/icon-512.png` using the `png2icons` library.
