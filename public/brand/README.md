# Brand assets

Place Matt's logo and hero photography here.

## Logo
- Add `logo.svg` (or `logo.png`) here.
- The current logo is a simple inline SVG monogram in
  `src/components/marketing/Nav.tsx` and `Footer.tsx`. Search for the comment
  "swap for Matt's real logo" and replace the inline `<svg>` with an
  `<Image src="/brand/logo.svg" ... />` once you have a real mark.

## Hero image
- Add a real photo of a freshly cleaned roofline/gutters as `hero.jpg` in
  `/public` (not this folder), then open `src/components/marketing/Hero.tsx`
  and change the `<Image src=...>` from the `picsum.photos` placeholder to
  `src="/hero.jpg"`.

## Social share image
- The Open Graph / Twitter card is generated automatically by
  `src/app/opengraph-image.tsx`. Edit that file to change colours or text.
