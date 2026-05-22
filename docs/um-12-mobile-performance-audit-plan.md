# UM-12 — Mobile & Performance Audit Plan
## [QA] Mobile and performance audit — fix blockers only

**Goal:** Hit Lighthouse Mobile Performance ≥ 80 and Accessibility ≥ 90. Fix only what fails — no redesign.

---

## Pre-Audit: What I Already Know From Code

I audited the source before opening a browser. Here's the verdict:

### ✅ Already solid — won't cause failures
| What | Why it's fine |
|---|---|
| Hero image | WebP + JPG fallback, `fetchpriority="high"`, `decoding="async"`, explicit `width`/`height` — LCP and CLS covered |
| Gallery (18 imgs) | All `loading="lazy"`, explicit dimensions, WebP — won't delay page load |
| Location images | Same — lazy, WebP, explicit dimensions |
| Viewport tag | `width=device-width, initial-scale=1.0` — correct |
| Hamburger | `aria-expanded` toggled correctly in JS, `aria-label` updates — accessible |
| Map iframe | `loading="lazy"` — won't block |
| Fonts | Google Fonts preconnects present, Google auto-adds `font-display=swap` |
| Image file sizes | Hero 800w = 56 KB WebP, 1200w = 124 KB — good |

### ❌ Two confirmed bugs to fix before Lighthouse

**Bug 1 — Hero preload ignores responsive srcset (affects LCP)**

Current:
```html
<link rel="preload" as="image" href="images/main/hero-main-1200.webp" type="image/webp">
```

On a 375px mobile screen the browser picks the 800w image from the srcset — but the preload
always fetches 1200w (124 KB) regardless. That's wasted bandwidth and Lighthouse flags it as
"Preloaded image not used" when the 800w is what actually renders.

Fix:
```html
<link rel="preload" as="image"
  href="images/main/hero-main-1200.webp"
  imagesrcset="images/main/hero-main-800.webp 800w,
               images/main/hero-main-1200.webp 1200w,
               images/main/hero-main-1920.webp 1920w"
  imagesizes="100vw"
  type="image/webp">
```

**Bug 2 — `script.js` loaded without `defer`**

Current (line 277):
```html
<script src="script.js"></script>
```

It's at the bottom of `<body>` so it's not blocking render in practice, but Lighthouse still
flags it and it delays the first interactive moment on slow mobile connections.

Fix:
```html
<script src="script.js" defer></script>
```

### ⚠️ Likely — needs Lighthouse to confirm
- **Tap target sizes** — nav links, gallery buttons, contact links. Min 44×44 px required. CSS uses `clamp()` font sizes so they might be tight on mobile — needs visual check.
- **Color contrast** — `--color-text-secondary: #6f5a4a` on `--color-background: #f4efe6` — warm palette, need to confirm ratio ≥ 4.5:1.
- **Location images missing responsive srcset** — served at 1400px wide to all viewports. Lazy-loaded so no LCP hit, but Lighthouse may flag "Properly size images".

---

## Step-by-Step Execution Plan

### Step 1 — Apply the two confirmed fixes (10 min)

**1a. Fix the hero preload in `index.html` line 21:**
```html
<!-- BEFORE -->
<link rel="preload" as="image" href="images/main/hero-main-1200.webp" type="image/webp">

<!-- AFTER -->
<link rel="preload" as="image"
  href="images/main/hero-main-1200.webp"
  imagesrcset="images/main/hero-main-800.webp 800w,
               images/main/hero-main-1200.webp 1200w,
               images/main/hero-main-1920.webp 1920w"
  imagesizes="100vw"
  type="image/webp">
```

**1b. Add `defer` to script tag in `index.html` line 277:**
```html
<!-- BEFORE -->
<script src="script.js"></script>

<!-- AFTER -->
<script src="script.js" defer></script>
```

Commit and push both changes to GitHub before running Lighthouse (GitHub Pages needs ~60s to deploy).

---

### Step 2 — Run Lighthouse (5 min)

Open Chrome → DevTools → Lighthouse tab.

Settings:
- Mode: **Navigation**
- Device: **Mobile**
- Categories: ✅ Performance, ✅ Accessibility (uncheck others for speed)

Run against: `https://villasinodium.com`

**Save the report** — screenshot or export JSON. Attach to UM-12.

Target scores:
- Performance ≥ 80
- Accessibility ≥ 90

---

### Step 3 — Triage the report (10 min)

Work through the "Opportunities" and "Diagnostics" sections. Apply this filter:

| Lighthouse finding | Fix it? |
|---|---|
| Preloaded image not used | ✅ Fixed in Step 1 |
| Render-blocking script | ✅ Fixed in Step 1 |
| Properly size images (location images) | ✅ Yes — see Step 4 |
| Unused CSS | ❌ Skip — not a blocker |
| Eliminate render-blocking resources (Fonts) | ❌ Skip — Google Fonts already optimised |
| Serve images in next-gen format (anything already WebP) | ❌ Skip — already done |
| Tap targets too small | ✅ Fix if flagged — see Step 5 |
| Color contrast failures | ✅ Fix if flagged — see Step 6 |

---

### Step 4 — If "Properly size images" is flagged: add srcset to location images (20 min)

The four location images (`krka`, `sibenik`, `zrmanja`, `split`) are served at 1400px with no
responsive srcset. You'll need smaller variants.

**4a. Generate 800w versions** (one-time, run in terminal):
```bash
# Requires: brew install imagemagick
# Or use: npx sharp-cli (no install needed beyond node)

for img in images/locations/*.jpg; do
  convert "$img" -resize 800x -quality 80 "${img%.jpg}-800.jpg"
  cwebp -q 80 "${img%.jpg}-800.jpg" -o "${img%.jpg}-800.webp"
done
```

**4b. Update each `<picture>` block** (example for Krka):
```html
<!-- BEFORE -->
<source type="image/webp" srcset="images/locations/krka.webp">
<img src="images/locations/krka.jpg" width="1400" height="933" ...>

<!-- AFTER -->
<source type="image/webp"
  srcset="images/locations/krka-800.webp 800w, images/locations/krka.webp 1400w"
  sizes="(min-width: 48rem) 50vw, 100vw">
<img src="images/locations/krka.jpg"
  srcset="images/locations/krka-800.jpg 800w, images/locations/krka.jpg 1400w"
  sizes="(min-width: 48rem) 50vw, 100vw"
  width="1400" height="933" ...>
```

Repeat for sibenik, zrmanja, split.

---

### Step 5 — If tap targets are flagged: increase touch sizes (15 min)

Lighthouse flags elements with a clickable area smaller than 48×48 px. Most likely candidates:
nav links on mobile, the `.float-book-btn`, and contact email/phone links.

Add to `styles.css` under the mobile breakpoint (`@media (max-width: 47.9375rem)`):

```css
/* Minimum tap target sizes on mobile */
.nav-list a {
  padding-block: 0.75rem;
  display: block;
}

.contact-list a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
```

---

### Step 6 — If color contrast is flagged (5 min)

Run the flagged elements through [contrast checker](https://webaim.org/resources/contrastchecker/).

Most likely culprit: `--color-text-secondary: #6f5a4a` on `--color-background: #f4efe6`.

If ratio is < 4.5:1, darken the secondary text color slightly:
```css
/* In :root — darken just enough to pass */
--color-text-secondary: #5a4739; /* was #6f5a4a */
```

Check that no section looks visually wrong after the change.

---

### Step 7 — Manual mobile checks (10 min)

Do these on a **real phone** (or Chrome DevTools mobile emulation as backup):

| Check | How |
|---|---|
| Hero image loads | Open `villasinodium.com` on mobile — hero should appear immediately, not blank |
| Hamburger opens/closes | Tap ☰ → menu slides in. Tap again → closes. Tap a link → closes. |
| Gallery scrolls | Swipe through gallery grid — no overflow cut off |
| Price table scrollable | Swipe horizontally on the prices table |
| Email link works | Tap `mario.lela1@gmail.com` → mail app opens |
| Phone link works | Tap `+385 98 208 007` → dialler opens |
| Zero JS errors | Open DevTools → Console → reload — no red errors |
| Cookie banner usable | Fresh visit (incognito) → banner visible → buttons tappable |

---

### Step 8 — Re-run Lighthouse after all fixes (5 min)

Re-run in the same Chrome Lighthouse tab to confirm both scores hit their targets.

Take a screenshot and attach to UM-12 as the **Definition of Done** evidence.

---

### Step 9 — Commit, push, and close the ticket

```bash
git add index.html styles.css images/locations/
git commit -m "fix(perf): responsive hero preload, defer script, location image srcsets"
git push
```

Transition UM-12 to Done in Jira.

---

## Summary of Changes

| File | Change | Impact |
|---|---|---|
| `index.html` line 21 | Hero preload → `imagesrcset` + `imagesizes` | Fixes "Preloaded image not used" on mobile |
| `index.html` line 277 | Add `defer` to script tag | Faster time-to-interactive |
| `index.html` lines 139–180 | Location images → responsive srcset | Fixes "Properly size images" if flagged |
| `styles.css` | Tap target padding (if flagged) | Accessibility score |
| `styles.css` | Text contrast tweak (if flagged) | Accessibility score |

**Confident fixes (do unconditionally):** Steps 1 → confirmed bugs in code  
**Conditional fixes (only if Lighthouse flags them):** Steps 4–6

---

## Estimated Effort

| Step | Time |
|---|---|
| Apply 2 confirmed fixes + push | 10 min |
| Run Lighthouse, save report | 5 min |
| Conditional fixes (location srcsets) | 20 min |
| Conditional fixes (tap targets / contrast) | 15 min |
| Manual mobile checks | 10 min |
| Re-run Lighthouse + commit | 10 min |
| **Total (worst case)** | **~70 min** |
