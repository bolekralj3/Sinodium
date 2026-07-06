# Villa Sinodium — Meta Ads Plan (Summer 2026)

_Last updated: 16 June 2026_

> **SUPERSEDED 6 July 2026:** Meta ad account blocked. This plan is on hold pending the appeal.
> Active replacement: `google-ads-plan-summer2026.md` (epic UM-27). Kept for the Pixel/tracking
> reference and as the playbook if ad access returns.

## 1. The honest framing

It is mid-June. Peak season (July–August, €400/night) starts in ~2 weeks and
booking lead time for a villa is short. €150–300/month will **not** "fill the
season." What it can realistically do, if concentrated, is generate a handful of
genuine inquiries that convert to **1–3 bookings**. At €400/night even one peak
week booked (~€2,800) is a strong return on ~€200 of ad spend.

The whole strategy below follows from one principle: **concentrate, don't
spread.** A short, intense burst aimed at people deciding *right now* beats a
thin trickle that never exits Meta's learning phase.

## 2. Locked decisions

| Decision | Value | Why |
|---|---|---|
| Budget | **€10/day** | Functional minimum to exit Traffic learning; covers ~2 markets |
| Flighting | **~3-week burst** (~€210), end date TBD by owner | Hits the late-July / August decision window |
| Markets | **Germany + Austria** | Biggest drive-to-Croatia markets, short lead time, moderate CPM |
| Objective | **Traffic (Phase 1)** | At €10/day, Leads/Conversions can't reach the ~50 events/week needed to optimize. Traffic builds Pixel signal cheaply |
| Language | **German ad copy → English landing page** | DE/AT travelers read English fine; German ads dramatically lift CTR |

**Note on spend:** €10/day = €300 for a full month, or ~€150 for a 15-day run.
Pick the end date based on your ceiling. Recommendation: run from launch through
~20 July, then reassess.

## 3. Why these markets (and not the others)

People who **fly** (UK, Nordics) book earlier and are largely committed for July
already — they're a *2027* audience, not a "fill now" one, and UK/Norway carry
the highest CPMs on the original list. People who **drive** (Germany, Austria,
plus Czechia/Slovenia as later expansion) decide on a shorter cycle and are
exactly who's choosing a destination right now. Start with the two biggest
(DE, AT). If results are good and you raise budget, add Czechia and Slovenia at
~€5/day each.

## 4. Campaign structure

```
Campaign: VS Summer 2026 — Traffic
└── Ad Set: DE+AT — Families — Advantage+
    ├── Budget: €10/day (CBO at campaign level is fine too)
    ├── Optimization: Landing page views
    ├── Locations: Germany, Austria
    ├── Age: 33–55
    ├── Gender: All
    ├── Audience: Advantage+ Audience (let Meta find them; no manual interests)
    ├── Placements: Advantage+ (automatic)
    └── Ads: 2 image ads (Feed 1:1 + Reels 9:16), same creative resized
```

Keep it to **one ad set**. Splitting €10/day across multiple ad sets re-creates
the spreading problem. Let Advantage+ Audience do the targeting — at this budget,
manual interest stacking just starves the algorithm of data.

## 5. Creative brief (ticket UM-23)

**Formats required**
- Feed: 1080 × 1080 px (1:1) — min 2 images
- Reels/Stories: 1080 × 1920 px (9:16) — min 2 images
- Optional but recommended: 1 short video (6–15s slow pan of pool + interior)

**Shot selection from your existing gallery** (highest-converting villa imagery
is pool + exterior at golden hour, then bright interiors):
1. **Hero / pool shot** — your `hero-main` image or `Villa Sinodium_002`. Lead with the pool; it's the single biggest driver for villa ads.
2. **Pool + house wide** — shows privacy and space (a `gallery` exterior).
3. **Bright living/kitchen interior** — signals comfort for families.
4. **Detail / terrace at dusk** — aspirational, good for Reels.

Rules: real photos only (no stock, no heavy filters), minimal text on the image
(Meta suppresses text-heavy creative), and make sure the pool is visible in the
first frame of any video.

**What I can do vs. you:** I can't crop/export your JPEGs to exact ad dimensions
from here reliably, but I can generate the crops if you want — say the word and
I'll produce 1:1 and 9:16 versions of the chosen shots in the repo.

## 6. Ad copy

Destination URL (with tracking):
`https://villasinodium.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=summer2026`

### German (primary — for DE + AT)

**Primary text**
> Privatvilla mit eigenem Pool im ruhigen dalmatinischen Hinterland — nur eine
> kurze Fahrt von der Küste, dem Krka-Nationalpark und Šibenik entfernt.
> Ideal für einen entspannten Familienurlaub. Noch freie Termine im Sommer 2026.

**Headline** (≤27 chars): `Villa mit Pool in Kroatien`
**Description**: `Sommer 2026 — jetzt anfragen`
**CTA button**: `Learn More` (Mehr dazu)

### English (fallback / for any English placements)

**Primary text**
> Private villa with its own pool in the peaceful Dalmatian countryside — a short
> drive from the coast, Krka National Park, and Šibenik. Perfect for a relaxed
> family holiday. Limited summer 2026 dates still open.

**Headline** (≤27 chars): `Croatia Villa with Pool`
**Description**: `Summer 2026 — enquire now`
**CTA button**: `Learn More`

Price accuracy: site shows €300/night (Jun & Sep) and €400/night (Jul & Aug).
Don't put a price in the ad copy — it dates fast and invites price-shoppers;
let them find it on the prices section (which also fires your ViewContent event).

## 7. Tracking status (already built)

Pixel `2640755696321208` is live behind cookie consent and verified firing:
- `PageView` on consent accept ✅
- `Lead` + `Contact` on Book Now / email / phone clicks ✅
- `ViewContent` on prices section (logic in place; verify on mobile)

This means even the Traffic campaign builds real conversion signal for a future
Phase 2 (Leads objective) once volume justifies it.

## 8. Launch checklist (ticket UM-24)

Pre-flight (must be done before ads can run):
- [ ] **UM-5** — Meta Business Portfolio + Facebook Page + Ad Account + billing (your hands; account/billing setup is something only you can do)
- [ ] **UM-21** — Domain verification via DNS TXT record (`facebook-domain-verification=...`); allow 24–48h propagation
- [ ] **UM-20** — Confirm all Pixel events in Test Events on a **real phone**, screenshot attached
- [ ] **UM-23** — Creatives + copy ready (this doc covers copy; creatives pending)

Launch:
- [ ] Campaign `VS Summer 2026 — Traffic`, objective Traffic
- [ ] Ad set as section 4; €10/day; DE + AT
- [ ] 2 ads uploaded, UTM URL set
- [ ] Status Active/In Review within 1h
- [ ] Pixel Helper green on landing page
- [ ] No policy rejection in 24h

## 9. Monitoring & decision rules (ticket UM-25)

Check **every Monday**. Screenshot CTR, CPC, reach, frequency.

| Signal | Threshold | Action |
|---|---|---|
| CTR (link) | < 1% for 7 days | Swap creative (try pool-forward variant) |
| Frequency | > 3.0 | Audience fatigue — refresh creative or pause |
| CPC | > €0.80 sustained | Tighten geo to Germany only |
| Lead events | ≥ 50 in any 7-day window | Consider Phase 2 (Leads objective) |
| Inquiries | Track replies to email/phone | The real KPI — bookings, not clicks |

**Kill criterion:** if after €100 spend there are zero genuine inquiries AND
CTR < 0.6%, stop and rethink creative/offer before spending more.

The honest 90-day target at this budget: **≥ 1–3 real booking inquiries**, not
the 15 in the original UM-25 acceptance criteria (that assumed higher spend).

## 10. Optional builds

- **UM-26 — Resend booking form:** replaces mailto with a real enquiry form →
  better conversion + cleaner Lead tracking. ~2.5h, needs a Cloudflare Worker +
  Resend account. Worth doing *before* a bigger 2027 push, not blocking this burst.
- **UM-22 — GA4:** independent traffic-source view. I can write the gated gtag
  code; you create the property. Optional, doesn't block ads.

## 11. Ticket execution order

Critical path to ads live: **UM-5 → UM-21 → UM-20 → UM-23 → UM-24 → UM-25.**

| # | Ticket | Owner | Status / action | Blocks |
|---|---|---|---|---|
| 1 | **UM-5** Meta Business Foundation | **You** | Create Business Portfolio, FB Page, Ad Account + billing. Only you can do account/billing. | UM-21, UM-24 |
| 2 | **UM-21** Domain verification (DNS TXT) | **You** (I can give exact steps) | Add `facebook-domain-verification=...` TXT record at your DNS host; wait 24–48h. | UM-24 |
| 3 | **UM-20** QA Pixel events | **Shared** | Desktop already verified by me. You: confirm on a real phone + attach Test Events screenshot. | UM-24 |
| 4 | **UM-23** Creatives + copy | **Shared** | Copy = done (section 6). Creatives: I can export 1:1 + 9:16 crops from your gallery on request. | UM-24 |
| 5 | **UM-24** Launch Phase 1 | **You** | Build campaign per sections 4 & 8 in Ads Manager. I can't operate your ad account, but I'll walk you click-by-click. | UM-25 |
| 6 | **UM-25** Monitor + Phase 2 | **You** | Weekly check per section 9 rules. I can set up a scheduled weekly reminder. | — |
| — | **UM-22** GA4 (optional) | **Shared** | You create property + give me the `G-XXXX` ID; I write the consent-gated gtag code. | — |
| — | **UM-26** Resend form (optional) | **Shared** | I build the form + Worker code; you create Resend account, deploy Worker, set the secret. | — |
| — | **UM-2 / UM-5 / UM-6** epics | Auto | Close when their child tickets are done. | — |

**What I can finish right now (just say go):**
- Export ad-ready 1:1 and 9:16 crops of your chosen photos (UM-23)
- Write the GA4 consent-gated code (UM-22) — needs your Measurement ID
- Build the Resend booking form + Cloudflare Worker (UM-26)
- Update UM-23 in Jira with the finalized copy from section 6
- Set a weekly Monday reminder for UM-25 monitoring

**What only you can do:** anything inside Meta (account, billing, campaign
publish) and your DNS record. I'll give exact instructions for each.
