# Before & After photos

Drop Matt's real job photos in this folder, then point the gallery at them.

## How to add real photos

1. Save image pairs here, e.g.:
   - `oughtibridge-1-before.jpg`
   - `oughtibridge-1-after.jpg`
2. Open `src/lib/content.ts` and edit the `gallery` array. Replace the
   `picsum.photos` placeholder URLs with local paths:

   ```ts
   { id: "g1", caption: "Moss-clogged gutters, Oughtibridge",
     before: "/gallery/oughtibridge-1-before.jpg",
     after:  "/gallery/oughtibridge-1-after.jpg" },
   ```

## Recommended

- JPG or WebP, roughly 1200px on the long edge (Next.js optimises them automatically).
- Keep before/after of the same property at the same aspect ratio so the lightbox looks tidy.
- 6 to 12 pairs is plenty for the homepage gallery.
