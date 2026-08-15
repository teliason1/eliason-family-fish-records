# Family Fish Records

A responsive replacement for the Family Fish Records Tableau dashboard, built from the original Excel and packaged Tableau workbooks.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The archive loads at the root URL and record details use `/records/:id`.

## Data workflow

- `data/records.json` is the site's single source of truth. Edit that file, commit the change, and push it; Vercel will rebuild the site automatically.
- Store record photos in `public/fish/` and set the record's `photo` value to a path such as `/fish/15-striped-bass.jpg`.
- Each record must retain a unique `id`. Valid `status` values are `current` and `historical`.
- `npm run data:build` is an optional legacy-import tool. It rebuilds `data/records.json` and `public/fish/*` from the original Excel/Tableau archive, so do not run it after manual JSON edits unless you intend to replace them.
- Missing exact coordinates can use labeled estimated coordinates. Records with no coordinates remain absent from the map.

## Appearance

Explorer Atlas is the single production design at `/`. Its header theme menu offers Coastal, Heritage, and Nightfall palettes without changing the site structure or functionality. A visitor's selection is retained in their browser. Old `/concepts/atlas` links redirect to their clean replacements.
