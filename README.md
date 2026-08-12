# Family Fish Records

A responsive replacement for the Family Fish Records Tableau dashboard, built from the original Excel and packaged Tableau workbooks.

## Run locally

```bash
npm install
npm run data:build
npm run dev
```

Open `http://localhost:3000`. Explorer Atlas is the selected primary experience and loads at the root URL. The site works immediately with the generated static archive; authentication and moderation show a safe preview state until Supabase is connected.

## Data workflow

- `scripts/build-data.py` reads `FishRecords2b.xlsx`, imports `Index Sheet` and `Micro`, reads verified ID-to-photo mappings from `Family Fish Records.twbx`, recovers explicitly matched loose/archive photos, and generates `data/records.json` plus `public/fish/*`.
- Missing exact coordinates use labeled city/state or state centroids. Exact and estimated points remain distinguishable in the data and map UI; records without even a state remain unmapped.
- The source folder is never modified.
- In production, apply `supabase/schema.sql`, configure `.env.example`, then run `npm run db:seed` once. Approved submissions are stored in Postgres and appear through `/api/catches`.
- Admins can download a Tableau-compatible Excel backup from `/api/admin/export`.

## Supabase setup

1. Create a Supabase project through the Vercel integration.
2. Run `supabase/schema.sql` in the SQL editor.
3. Add the environment variables from `.env.example` to Vercel.
4. Run `npm run db:seed` with the production variables.
5. Invite family users in Supabase Auth. Insert a matching `profiles` row for each user; set designated reviewers to `role = 'admin'`.
6. Configure the production URL as an allowed Auth redirect and set up Resend for moderation emails.

The admin approval transaction intentionally leaves current-record classification to the reviewer, allowing legitimate ties. The queue displays the chosen classification before publication.

## Appearance

Explorer Atlas is the single supported design at `/concepts/atlas`. Its header theme menu offers Coastal, Heritage, and Nightfall palettes without changing the site structure or functionality. A visitor's selection is retained in their browser.
