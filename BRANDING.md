# XAVIC-Labs official identity — V1.2

Founder-approved reference: the emblem uploaded for Mission 005, approved October 14, 2026. The uploaded image remains the authoritative visual reference.

The SVG is a **manual silhouette trace**, preserving the reference's long diagonal, hooked arms, open cutouts, and relative proportions. It is not claimed to be a pixel-exact reproduction of the raster artwork. The raster's bevel, bloom, and background have intentionally not been reproduced: production assets use a flat gradient and transparent canvas, with no additional decoration or redesigned geometry.

## Palette

| Color         | Value     |
| ------------- | --------- |
| Electric Cyan | `#57E4E8` |
| Deep Blue     | `#477FE8` |
| Soft Violet   | `#9585F5` |
| Midnight Navy | `#0B0F1A` |
| Ice White     | `#EAF2FF` |

The emblem uses the first three colors. Midnight Navy is used for asset inspection backgrounds and Ice White for the downloadable horizontal wordmark. The approved website's existing background and typography remain unchanged.

## Production assets

- `public/xavic-emblem.svg`: primary scalable emblem; transparent, square canvas with proportional internal silhouette.
- `public/xavic-emblem.png`: 1024×1024 transparent PNG derived from the SVG.
- `public/favicon.png`: 32×32 transparent favicon fallback, derived from the same SVG without changing its silhouette.
- `public/xavic-wordmark.svg`: self-contained horizontal emblem plus the existing XAVIC / LABS wordmark.

The website uses `BrandWordmark` for header/footer and project-page identity. Its accessible home-link label is “XAVIC-Labs home”; the image is decorative within that labeled link, avoiding duplicate announcements. The SVG has its own accessible title for standalone use. Nested static project pages resolve both logo and favicon relative to the site root, including repository-subdirectory hosting.

## Regeneration and checks

With the existing Playwright dependency and system Chromium:

```sh
node scripts/generate-logo-assets.mjs
npm test
npm run build
npm run preview -- --port 4173
# In another terminal:
npm run test:browser
node scripts/branding-smoke.mjs
```

`CHROMIUM_PATH` may select another browser executable. `XAVIC_CHECK_URL` may select another preview URL or subdirectory. PNG/wordmark generation derives from the authoritative vector asset and adds no dependency. The generator also writes inspection rasters at 16px, 64px, and 256px to `/tmp`. Branding checks verify all six pages at four viewport widths, accessible brand links, loaded images/favicons, horizontal overflow, console/runtime errors, and 16/32/64/256px SVG rendering on Midnight Navy. Screenshots are inspection artifacts, not committed production assets.

All shapes remain unchanged between rendering sizes. Very small favicon sizes naturally lose fine edge detail through rasterization; the underlying silhouette is not simplified or redesigned. The Founder can compare the vector against the uploaded raster before final visual approval.
