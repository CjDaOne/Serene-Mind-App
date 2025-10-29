# App Icons

Current icons are placeholders with purple background (#7c3aed) and "SM" text.

## Generating Production Icons

Use one of these tools to create professional PWA icons:

### Option 1: PWA Asset Generator (Recommended)
```bash
npx @vite-pwa/assets-generator --preset minimal public/icon-source.svg public/icons
```

### Option 2: PWA Icon Generator Online
- Visit: https://www.pwabuilder.com/imageGenerator
- Upload a 512x512 source image
- Download the generated icon set

### Option 3: Favicon.io
- Visit: https://favicon.io/favicon-converter/
- Upload your logo/design
- Download and replace files in this directory

### Icon Requirements
- **Source**: 512x512 PNG or SVG with transparent background
- **Sizes**: 192x192, 384x384, 512x512
- **Format**: PNG with transparency
- **Purpose**: Icons should work as both regular and maskable icons
