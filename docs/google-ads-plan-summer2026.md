# Villa Sinodium — Google Ads Plan (Summer 2026)

_Last updated: 6 July 2026. Replaces the Meta plan (`meta-ads-plan-summer2026.md`) — Meta account blocked, that channel is dead until an appeal succeeds._

## 1. The honest framing

**Budget is €150 total.** At travel-search CPCs (~€0.50–1.00 for long-tail German villa terms) that buys roughly **150–250 clicks, ever**. With the live enquiry form converting at a typical 2–5%, that's **4–10 enquiries**. Realistic target: **1–2 bookings**. One August week (€2,800) or September week (€2,100) pays for the campaign ~15× over — but zero bookings is also a possible outcome at this spend. Know that going in.

Three markets on €150 is a stretch. It works only because one campaign shares budget dynamically across ad groups — German keywords serve DE+AT, Dutch keywords serve NL, and money flows to whatever gets clicked. **If Dutch clicks come in expensive, cut NL and concentrate on DE+AT** (decision rule in §8).

**Timing:** it's 6 July. Setup needs 2–3 days (account, billing, conversion tag, ad review). Target: **live by 9–10 July, run ~15 days at €10/day through ~24 July.** That window catches last-minute August deciders and the September (€300/night) market, which still has a long booking runway.

## 2. Locked decisions

| Decision | Value | Why |
|---|---|---|
| Budget | **€10/day × 15 days = €150** | Your ceiling; concentrated burst > thin trickle |
| Markets | **DE + AT + NL** | Drive-to-Croatia, short decision cycle |
| Campaign type | **1 Search campaign only** | Highest intent. No Performance Max, no Display — they'd eat €150 with nothing to show |
| Bidding | **Maximise clicks, max CPC €1.00** | Not enough conversions in 15 days for smart bidding to learn |
| Languages | **German + Dutch ads → English landing page** | Same logic as the Meta plan; native-language ads lift CTR, DE/NL/AT travellers read English fine |

## 3. Setup gotchas (do these or waste money)

1. **Switch to Expert Mode immediately.** New accounts default to "Smart" mode, which hides everything that matters. Look for the tiny "Switch to Expert Mode" link during signup — before creating any campaign.
2. **Untick both networks.** Campaign settings → Networks → disable **Search Partners** and **Display Network**. Both are checked by default and both burn small budgets on junk.
3. **Location setting = "Presence."** Settings → Locations → Location options → "Presence: people in or regularly in your targeted locations." The default ("Presence or interest") shows your ads to people in Croatia googling their own competition.
4. **Turn off auto-apply recommendations.** Settings → Recommendations auto-apply → disable all. Google will otherwise "helpfully" broaden your keywords.
5. **Conversion tracking before spending** (§6). Without it you can't tell a €150 lesson from €150 lost.

## 4. Campaign structure

```
Campaign: VS Summer 2026 — Search
├── Budget: €10/day | Bidding: Maximise clicks, max CPC €1.00
├── Locations: Germany, Austria, Netherlands (Presence)
├── Languages: German, Dutch, English
├── Networks: Google Search only
│
├── Ad group 1: DE — Villa mit Pool     (serves DE + AT)
├── Ad group 2: DE — Dalmatien / Krka   (serves DE + AT)
└── Ad group 3: NL — Vakantiehuis       (serves NL)
```

No English ad group — Nordics/UK aren't targeted, and English keywords in DE/NL mostly match lower-intent searches. Keep it to three tight groups.

### Keywords (phrase match unless noted)

**Ad group 1 — DE Villa mit Pool**
- "ferienhaus kroatien mit pool"
- "villa kroatien mit pool"
- "ferienhaus kroatien privater pool"
- "ferienvilla kroatien"
- "last minute ferienhaus kroatien pool"

**Ad group 2 — DE Dalmatien / Krka**
- "ferienhaus dalmatien mit pool"
- "villa dalmatien"
- "ferienhaus krka nationalpark"
- "ferienhaus šibenik"
- "ferienhaus hinterland dalmatien"

**Ad group 3 — NL Vakantiehuis**
- "vakantiehuis kroatië met zwembad"
- "villa kroatië privézwembad"
- "vakantiehuis dalmatië"
- "last minute villa kroatië"

### Negative keywords (campaign level, day one)

`kaufen, kauf, immobilien, immobilie, kopen, te koop, jobs, arbeit, stellen, camping, wohnmobil, mobilheim, hostel, hotel, apartment, appartement, kreuzfahrt, boot mieten, günstig unter 50`

Check the **search terms report every 2–3 days** during the burst and add negatives aggressively — on €150 every wasted click hurts.

## 5. Ad copy (ready to paste)

Final URL for all ads:
`https://villasinodium.com/?utm_source=google&utm_medium=cpc&utm_campaign=summer2026`

### German RSA (ad groups 1 & 2)

**Headlines** (≤30 chars — pin nothing, give Google all of them):
- `Villa mit Pool in Kroatien` (26)
- `Privatvilla in Dalmatien` (24)
- `Eigener Pool, 7 Gäste` (21)
- `Nähe Krka & Šibenik` (19)
- `Noch Termine im Sommer 2026` (27)
- `Direkt buchen, ohne Portal` (26)
- `Ruhe im Hinterland` (18)
- `Klimaanlage & Kamin` (19)

**Descriptions** (≤90 chars):
- `Private Villa mit eigenem Pool im ruhigen dalmatinischen Hinterland. Für bis zu 7 Gäste.` (89)
- `Kurze Fahrt zu Küste, Krka-Nationalpark und Šibenik. Wochenaufenthalte, direkt buchen.` (87)
- `3 Schlafzimmer, 2 Bäder, Klimaanlage, Grill, kostenlose Parkplätze. Sommer 2026 anfragen.` (89)

### Dutch RSA (ad group 3)

**Headlines:**
- `Villa met zwembad, Kroatië` (26)
- `Privévilla in Dalmatië` (22)
- `Eigen zwembad, 7 gasten` (23)
- `Vlakbij Krka & Šibenik` (22)
- `Zomer 2026 — nog data vrij` (26)
- `Boek direct, geen platform` (26)

**Descriptions:**
- `Privévilla met eigen zwembad in het rustige Dalmatische binnenland. Tot 7 gasten.` (81)
- `Korte rit naar de kust, Krka en Šibenik. Weekverblijven, boek direct bij de eigenaar.` (85)

### Assets (extensions)

- **Sitelinks:** Galerie/Foto's → `/#gallery` · Preise/Prijzen → `/#prices` · Lage/Locatie → `/#visit` · Kontakt/Contact → `/#contact`
- **Callouts (DE):** Privater Pool · Bis 7 Gäste · Klimaanlage · Kostenlose Parkplätze
- **Callouts (NL):** Privézwembad · Tot 7 gasten · Airco · Gratis parkeren
- No price in ad copy (dates fast, attracts price-shoppers) — but **do** add a price asset later if CTR is weak; €300/night filters clicks honestly.

## 6. Conversion tracking (blocker — must precede launch)

The site currently has only the Meta Pixel. Google Ads needs its own tag, consent-gated exactly like the Pixel.

**Conversion actions to create in Google Ads** (Tools → Conversions):

| Action | Trigger | Category | Value |
|---|---|---|---|
| Enquiry form submit | Resend form success | Submit lead form | Primary — the KPI |
| Phone click | `tel:` link click | Contact | Secondary |
| Email click | `mailto:` link click | Contact | Secondary |

**Division of labour:** you create the Google Ads account and the three conversion actions, then give me the conversion ID + labels (`AW-XXXXXXXXX/xxxxx`). I write the consent-gated gtag code into the site, reusing the existing cookie-consent gate and the same click selectors as the Pixel events (UM-18). ~1h of my work once IDs exist.

**QA before launch:** submit a test enquiry + click phone/email on a real phone, confirm all three fire in Google Ads → Conversions (shows "Recording conversions" within a few hours).

_Status update 6 July: the consent-gated tag code is implemented (UM-30) — script.js has a `GADS_ID`/`GADS_LABELS` config block awaiting the real IDs._

## 7. Google Business Profile (free, parallel, 30 min)

The villa already has a Google Maps place (it's embedded on the site). **Claim it** at business.google.com → "Villa Sinodium". Add all 18 gallery photos, website link, phone, and category "Villa" / "Holiday home". Free visibility on Maps + brand searches, and it strengthens the ads' credibility. Not a launch blocker.

## 8. Monitoring & decision rules

Short flight → check **every 2–3 days**, not weekly. Screenshot clicks, CTR, avg CPC, search terms.

| Signal | Threshold | Action |
|---|---|---|
| CTR (search) | < 2% after ~50 impressions per ad group | Rework headlines in that group; Search CTR below 2% means the ad doesn't match the query |
| Avg CPC | > €1.00 sustained in NL group | **Pause NL, concentrate on DE+AT** |
| Search terms | Irrelevant queries appearing | Add negatives same day |
| Enquiries | ≥ 1 genuine enquiry | Working — consider topping up budget |
| Spend | €75 spent, zero enquiries, CTR < 2% | **Pause everything.** Problem is copy/offer/landing page, not budget |

**The real KPI is enquiries via the form, not clicks.** Track replies in your inbox against the campaign window.

**After the burst (~24 July):** if it produced a booking, the playbook is proven — rerun it in spring 2027 with a bigger budget and all six markets. If not, the search-terms report tells you why, for €150.

## 9. Execution order

Critical path: **account → conversion tag → campaign build → QA → launch → monitor.**

Jira: epic **UM-27**, tickets **UM-28 → UM-34**.

| # | Step | Ticket | Owner | Notes |
|---|---|---|---|---|
| 1 | Google Ads account (Expert Mode) + billing | UM-28 | **You** | ads.google.com. §3 gotchas apply from minute one |
| 2 | Create 3 conversion actions, send me IDs | UM-29 | **You** | §6 table |
| 3 | Consent-gated gtag + conversion events on site | UM-30 | **Me** | DONE — awaiting IDs from step 2 |
| 4 | QA conversions on a real phone | UM-31 | **You** | Test form submit + tel/mailto clicks |
| 5 | Build campaign per §4–5 | UM-32 | **You** (I walk you click-by-click) | I can't operate the ad account |
| 6 | Launch, confirm "Eligible" status within 24h | UM-33 | **You** | Ad review is usually < 1 day |
| 7 | Monitor per §8, every 2–3 days | UM-33 | **You** | I can set a scheduled reminder |
| — | Claim Google Business Profile | UM-34 | **You** | Parallel, free, not blocking |
