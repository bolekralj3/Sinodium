# Villa Sinodium — MVP measurement plan (Meta)

Version-controlled copy of the MVP Meta measurement plan. Site code: cookie consent, Meta Pixel (when `META_PIXEL_ID` is set in [`script.js`](../script.js)), and custom events on contact actions. Meta Business / Pixel ID setup: see steps in this document and [facebook-instagram-marketing-plan.md](facebook-instagram-marketing-plan.md).

## MVP goal (your scope)

**Measure only:**

1. **How many people opened the website** → Meta Pixel **PageView** (fires once per load when Pixel runs).
2. **How many clicked “location” vs contact (email) vs phone** → three **separate** Pixel signals so you can compare intent, not one blended “Lead”.

Everything else in the earlier full marketing plan (multi-stage funnel, ROAS, LAL, heavy creative matrix) is **out of scope for MVP** until these metrics are reliable.

---

## Sources of truth

- Click targets live in [index.html](../index.html) `#contact`: `mailto:` (email), `tel:` (phone), and the **Open in Google Maps** anchor (`maps.app.goo.gl`).
- Compliance and Pixel placement rules: [facebook-instagram-marketing-plan.md](facebook-instagram-marketing-plan.md) (consent before Pixel, privacy page).

### Hosting decision (confirmed for this phase)

- **Now:** site lives only on **GitHub Pages** — canonical public URL is typically `https://<username>.github.io/<repo>/` (exact path depends on user/org and project vs user site).
- **Later:** you will add a **custom domain**; that becomes a deliberate migration (URLs, Meta domain verification, ad destinations, social bios). Until then, **do not** leave `villa-sinodium.example.com` in [index.html](../index.html) — point all meta tags and ads at the **real `github.io` URL** you are actually using.

---

## 1. Executive summary (MVP)

Ship **privacy + consent-gated Meta Pixel**, then instrument **one PageView** plus **three custom click events** tied to the exact elements above. In **Meta Events Manager** you will see counts per event; in **Ads Manager** you can optionally add **custom conversions** (one per event) for columns and breakdowns. Run **small paid traffic** only if you need distribution; organic + direct link is enough to validate tracking.

**Important nuance — “location”:** the embedded Google **iframe** map is a third-party document; reliable MVP tracking is the **“Open in Google Maps”** link click (clear user intent to open location). If you later need “interacted with map embed,” that requires a different approach (often not worth it on MVP).

---

## 2. Audit findings (MVP-relevant only)

**Strengths:** Single page = one **PageView** per session start (when Pixel loads); three clear outbound intents in `#contact`.

**Gaps blocking clean numbers:**

- No Pixel / no consent / no privacy page yet.
- Placeholder contact still in HTML — clicks will be real but identity is wrong until you replace ([README.md](../README.md)).

**No change required for MVP counting** beyond Pixel + listeners, unless you add more mailto/tel links elsewhere (then dedupe or attach same handlers).

---

## 3–6. Audience, funnel, content, ad structure (MVP = minimal)

- **Audience:** default to broad **Traffic** in your chosen country(ies); no lookalikes required.
- **Funnel:** single step — land → maybe scroll → click map/email/phone. No MOFU/BOFU campaigns required for MVP.
- **Creatives:** reuse existing hero/gallery assets; one or two static ads sufficient.
- **Campaigns:** one **Traffic** (or **Engagement**) campaign, one ad set, a few ads — objective is **learning who clicks**, not scaling ROAS.

Expand using the long-form sections in the previous iteration of this plan when you move past MVP.

---

## 7. Tracking setup (MVP — detailed)

### Events to implement (after marketing consent)

| User action | HTML hook (selector / pattern) | Pixel signal |
|-------------|-------------------------------|--------------|
| Opened site (loaded page with Pixel) | Automatic when base code runs | **PageView** (standard) |
| Clicked **location** (open Maps in new tab) | `a[href*="maps.app.goo.gl"]` in `#contact` | **Custom:** e.g. `LocationMapClick` |
| Clicked **email / contact** | `a[href^="mailto:"]` in `#contact` | **Custom:** e.g. `ContactEmailClick` |
| Clicked **phone** | `a[href^="tel:"]` in `#contact` | **Custom:** e.g. `ContactPhoneClick` |

Implementation pattern (conceptual): in [script.js](../script.js), after consent has enabled `fbq`, attach `click` listeners that call `fbq('trackCustom', 'EventName', { ...optional payload })` and **do not** `preventDefault` (let the mail client / phone UI / maps open).

**Why custom events instead of one `Lead`:** you asked for **breakdowns** (location vs contact vs phone). A single **Lead** on all three would only give one total unless you use parameters (reporting is cleaner with three custom events or three **custom conversions**).

### Meta UI steps

1. **Events Manager** → Pixel → **Test Events** — confirm **PageView** + each custom event fires on desktop and mobile.
2. Optional: **Custom conversions** — one rule per custom event name — so Ads Manager shows **CPA-style** metrics per action if you optimize later.
3. **Domain verification** ([facebook-instagram-marketing-plan.md](facebook-instagram-marketing-plan.md) META-3) — verify the **`github.io` hostname** Meta shows for your live site first; when you move to a custom domain, **verify the new root domain** and treat old `github.io` links as legacy (update ads and bios).
4. **UTMs** on ad URLs — still useful to separate Meta from organic in any future GA4.

### What you will read weekly

- **PageView** count ≈ sessions that accepted marketing cookies and loaded Pixel (undercount vs true traffic if many reject consent — expected in EU).
- Ratios: `ContactEmailClick / PageView`, `ContactPhoneClick / PageView`, `LocationMapClick / PageView` — tells you which CTA people prefer.

**Deferred:** ViewContent on `#prices`, CAPI, offline bookings, ROAS.

---

## 8. Budget plan (MVP)

- **€0–€10/day** total while you only validate tracking is enough; raise only when events look correct for 3–5 days.
- Success = stable event fire rate in Test Events / Overview, not ROAS.

---

## 9. Asset checklist (MVP)


| Asset | MVP need |
|-------|----------|
| GitHub Pages URL + OG/canonical matching that host | Yes (custom domain deferred) |
| privacy.html + footer link + consent banner | Yes (EU) |
| Meta Pixel + PageView + 3 custom click events | Yes |
| Real email/phone in HTML | Strongly yes (meaningful business test) |
| Many ad creatives / LAL / retarget stacks | No |

---

## 10. Execution roadmap (MVP)

| Week | Focus |
|------|--------|
| **1** | Stable **GitHub Pages** URL in meta tags; privacy + consent; Pixel; PageView + three custom clicks in [script.js](../script.js); Test Events QA |
| **2** | Optional tiny Traffic campaign + UTMs; watch event counts vs link clicks |
| **Later** | Re-expand to full funnel / ROAS plan when you add booking or offline conversion data |

---

## All steps to achieve this MVP (ordered)

Follow in order where dependencies apply; steps marked **optional** can wait until core tracking works.

### A — Website URL and on-page truth (no Pixel yet)

1. **Publish the site on GitHub Pages** — repo **Settings → Pages** (branch/folder per [README.md](../README.md)); copy the live **HTTPS** URL (e.g. `https://<user>.github.io/<repo>/`) and open it on phone and desktop.
2. **Freeze the canonical URL for this phase** — the exact `github.io` path you will use until a custom domain exists (changing repo name or Pages type later **will** break old links and ad destinations).
3. **Update [index.html](../index.html) head** — set `link rel="canonical"`, `og:url`, and absolute `og:image` / `twitter:image` URLs using that **same `github.io` base** (replace every `villa-sinodium.example.com` placeholder). For `og:image`, the full URL must resolve (path to `/images/main/hero-main-1200.jpg` under the repo root).
4. **Replace placeholder contact** — real `mailto:` address, visible phone label, matching `tel:` href; confirm **Open in Google Maps** and embed still work ([README.md](../README.md)).

### B — Meta Business and Pixel ID (before pasting ID into code)

5. **Facebook login** — use the profile that will own or admin the assets.
6. **[business.facebook.com](https://business.facebook.com)** — create or open a **Business Portfolio**; create or claim an **Ad account**; add a **payment method** (needed for paid tests later, not for Test Events alone).
7. **Events Manager** — **Connect data sources** → **Web** → create a **Meta Pixel** (dataset); copy the **Pixel ID**; connect the Pixel to your Ad account if prompted.

### C — Legal pages and consent (EU-aligned; required before Pixel runs)

8. **Add [privacy.html](../privacy.html)** (new static page) — describe site operator, contact, cookies, **Meta Pixel** (what Meta receives, why), retention in plain language; linkable from the site. Mention the current site URL (`github.io`) as the processor context; **update this page when the domain changes.**
9. **Cookie / marketing consent UI** on [index.html](../index.html) — **Reject** and **Accept marketing** (or equivalent); persist choice (e.g. `localStorage`) per [facebook-instagram-marketing-plan.md](facebook-instagram-marketing-plan.md).
10. **Gate all marketing scripts** — **do not** load Pixel or call `fbq` until **Accept**; on **Reject**, no Pixel (document this behavior in privacy).

### D — Pixel + events in code

11. **Load Pixel base code** only after consent — initialize with your Pixel ID; first load should fire standard **PageView** (default with base code).
12. **Click listeners in [script.js](../script.js)** (after Pixel is active) on `#contact`:
    - **`a[href*="maps.app.goo.gl"]`** → `fbq('trackCustom', 'LocationMapClick')`
    - **`a[href^="mailto:"]`** → `fbq('trackCustom', 'ContactEmailClick')`
    - **`a[href^="tel:"]`** → `fbq('trackCustom', 'ContactPhoneClick')`
13. **Late consent path** — if the user accepts after the first paint, initialize Pixel then fire **PageView** once and **attach** the same click listeners so later clicks count.

### E — Navigation and deploy

14. **Footer** — add a visible link to `privacy.html` from [index.html](../index.html) footer (currently “Villa Sinodium · Croatia” only).
15. **Deploy** — push to the branch that Pages builds from; hard-refresh the live site and confirm banner + privacy link.

### F — Verification in Meta (must pass before trusting numbers)

16. **Events Manager → Test Events** — open your live site; **Accept** cookies; confirm **PageView** appears; click **Maps link**, **email**, **phone**; confirm **LocationMapClick**, **ContactEmailClick**, **ContactPhoneClick** (use exact names you coded).
17. **Repeat on mobile** (Safari + Chrome) — same four events.
18. **Meta Pixel Helper** browser extension — optional cross-check that the Pixel ID matches and events fire.
19. **Domain verification (GitHub Pages first)** — Business Settings → **Brand safety** → **Domains**: add and verify the hostname you actually use (e.g. `<user>.github.io` or the full host Meta asks for). Meta’s verification method (DNS TXT, HTML file, etc.) depends on what they offer for that host — follow **current** Meta help for **GitHub Pages** / subdomain verification. **When you add a custom domain**, you will verify the **new** domain (often DNS at your registrar) and update Pixel-related settings if Meta prompts you.

### G — Optional: easier Ads Manager reporting

20. **Custom conversions** (Events Manager) — one rule per custom event name if you want dedicated columns / optimization targets later.

### H — Optional: paid traffic to exercise attribution

21. **Facebook Page + Instagram** (Business/Creator) — per [facebook-instagram-marketing-plan.md](facebook-instagram-marketing-plan.md) if you run ads from that brand.
22. **Ads Manager** — one **Traffic** campaign → one ad set → **Website URL** = your **`https://…github.io/…/`** canonical URL (with **UTMs** on the query string, e.g. `utm_source=facebook&utm_medium=paid&utm_campaign=vs_mvp_test`). When you later switch to a custom domain, **pause or duplicate** campaigns and point creatives to the new URL.
23. **Special ad category** — when creating the campaign, confirm whether Meta requires **Housing** (or other) for vacation-rental ads in your region; answer honestly to avoid disapprovals.
24. **Post-launch check** — after a few paid clicks, confirm Events Manager shows **PageView** and custom events with attributed breakdowns (allow reporting delay).

### I — Ongoing

25. **Weekly** — in **Events Manager** (and **Ads Manager** if spending): total **PageView**, each **trackCustom** count, and simple ratios (e.g. email clicks ÷ PageView). Remember **Reject** users are invisible to Pixel — note that when reporting “opens.”

**Dependency cheat sheet:** B7 before D11–D13; C8–C10 before D11; A1–A4 before F19 (verify the host you serve today — `github.io`); D complete before F16.

---

## After you add a custom domain (second pass — not MVP day one)

Do these in one coordinated update so Meta, social profiles, and HTML stay aligned:

1. **GitHub Pages custom domain** — configure DNS + Pages settings per GitHub docs; wait for **HTTPS** to work end-to-end.
2. **[index.html](../index.html)** — replace every `github.io` (and any old domain) in `canonical`, `og:url`, `og:image`, `twitter:image` with the **new** absolute URLs.
3. **privacy.html** — update the stated site URL / data flows if wording references the old host.
4. **Meta Business Settings** — **Domains**: add/verify the **new** domain; keep or remove old `github.io` verification per Meta guidance (old URL may still redirect — if so, decide single canonical for ads).
5. **Events Manager / Pixel** — confirm events still fire on the new host (Test Events on production).
6. **Ads + organic** — update **destination URLs**, saved UTMs, Facebook Page **Website**, Instagram **bio link**, and any printed/QR materials.

Until this pass is done, treating **`github.io` as canonical** is correct and avoids placeholder domains.

---

## 11. Missing elements report (MVP)

- Pixel stack and the three click listeners are **not in repo** yet.
- Map **iframe** interactions are **not** part of MVP “location” metric — only the **Open in Google Maps** link unless you change requirements.
- **Consent** means **PageView** undercounts visitors who reject marketing cookies; document that when reporting “opens.”

---

## Resolved for MVP iteration

- **Primary KPIs:** PageView + three click-type custom events.
- **“Location” definition (confirmed):** count only the **“Open in Google Maps”** outbound link in `#contact` — not iframe interactions.
- **Interim hosting (confirmed):** GitHub Pages URL only for now; custom domain planned later with a documented migration pass above.
