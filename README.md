# Villa Sinodium – One-Page Site

Static site with optimized hero, **12-tile gallery** (WebP + JPEG), “Things to visit” (Krka, Šibenik, Zrmanja, Split), **Sinodium** history in About, seasonal **Prices** (nightly rates table), **Contact Us** (email, phone, embedded Google Map plus link to open in Maps), lightbox, and SEO meta.

## Images

Run once (or after changing photos):

```bash
npm install
npm run optimize:images
```

- **SOURCE:** folder with villa JPEGs (default: `images/gallery` in this repo — optimizer skips `gallery-01.jpg` … outputs so sources can live beside exports).
- **HERO_FILE:** default `Villa Sinodium_103.jpg` (main hero image).
- **GALLERY_COUNT:** default `12` — diverse mix of landscape / portrait / square shots (hero file excluded).

Outputs:

- `images/main/hero-main-{800,1200,1920}.{webp,jpg}` (+ `hero-main.{webp,jpg}`)
- `images/gallery/gallery-01` … `gallery-12`
- `images/locations/{krka,sibenik,zrmanja,split}` — from `assets/location-sources/*.png` if present, else Unsplash fallbacks.

## Content

- **Body copy:** `index.html` (keep in sync with `content/houseDescription.json` for the about + history text if you use it as a source file).
- **Contact:** Replace the placeholder email (`your@email.com`), phone (`tel:` href and visible label), and confirm the map **iframe** `src` if you regenerate it from Google Maps (Share → Embed a map). The short link in “Open in Google Maps” can stay or be updated alongside.

## Local preview

```bash
python3 -m http.server 8000
# or: npx serve .
```

Replace `villa-sinodium.example.com` in `<head>` when you have a live domain (GitHub Pages URL is fine until a custom domain exists).

## Meta Pixel and cookies (MVP)

- **`privacy.html`** — privacy notice; linked from the footer on `index.html`.
- **Cookie banner** — “Reject” / “Accept marketing”. The Meta Pixel loads **only after Accept** (EU-friendly default).
- **`script.js`** — set `META_PIXEL_ID` to your Pixel ID from Meta Events Manager when you have one. Leave it **empty** until then: no `fbevents.js` request, consent still works.
- **Events sent when the Pixel is active:** standard **PageView**; custom **`LocationMapClick`** (Open in Google Maps link), **`ContactEmailClick`** (`mailto:`), **`ContactPhoneClick`** (`tel:`) in `#contact`.

Step-by-step Meta Business setup and launch checklist: [docs/mvp-meta-measurement-plan.md](docs/mvp-meta-measurement-plan.md). Broader organic + ads context: [docs/facebook-instagram-marketing-plan.md](docs/facebook-instagram-marketing-plan.md).
