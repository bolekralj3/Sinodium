# UM-26 Setup Steps — Resend + Cloudflare Worker

All code is already written. These are the manual steps needed to wire it up.

---

## Step 1 — Resend account (~10 min)

1. Go to [resend.com](https://resend.com) → Sign up (free, no credit card)
2. Dashboard → **API Keys** → **Create API key** → name it `villa-sinodium-prod`, permission: Sending access
3. **Copy the key now** — you only see it once. Save it somewhere temporarily (e.g. Notes).
4. Dashboard → **Domains** → **Add Domain** → enter `villasinodium.com`
5. Add the DNS records Resend shows you (MX + TXT) in your domain registrar. Wait for green checkmarks (~5 min).

---

## Step 2 — Cloudflare Worker (~20 min)

```bash
# Install Node.js if needed: https://nodejs.org

# Install Wrangler (Cloudflare's CLI)
npm install -g wrangler

# Log in to Cloudflare (opens browser)
wrangler login

# Go to the Worker project inside this repo
cd /path/to/rental/sinodium-mailer

# Store the Resend API key as a secret (never goes in any file)
wrangler secret put RESEND_API_KEY
# Paste your key when prompted, press Enter

# Deploy
wrangler deploy
```

The deploy output will print a URL like:
```
https://sinodium-mailer.YOUR-SUBDOMAIN.workers.dev
```

**Copy that URL.**

---

## Step 3 — Wire up the URL in index.html (~1 min)

Open `index.html` and find this line near the bottom:

```js
const WORKER_URL = 'REPLACE_WITH_YOUR_WORKER_URL/send';
```

Replace it with your actual Worker URL + `/send`:

```js
const WORKER_URL = 'https://sinodium-mailer.YOUR-SUBDOMAIN.workers.dev/send';
```

Save and commit.

---

## Step 4 — End-to-end smoke test

1. Open the site locally (`open index.html`) or push to GitHub Pages
2. Fill the booking form with a test name, your own email, valid dates, any guest count
3. Click **Send Enquiry**
4. Check `mario.lela1@gmail.com` — email should arrive within ~30 seconds
5. Confirm subject is: `Booking enquiry from {name} — {checkin} to {checkout}`
6. Confirm reply-to is the email you entered in the form

---

## Acceptance criteria checklist

- [ ] Email arrives at `mario.lela1@gmail.com` within 60s
- [ ] Subject includes guest name and dates
- [ ] `reply_to` set to guest's email
- [ ] Honeypot field invisible (inspect element to verify it's clipped)
- [ ] Date validation: submitting checkout ≤ checkin shows inline error
- [ ] Success message shown without page reload
- [ ] Fallback email still visible below the form
- [ ] Form usable on mobile (single column below 540px)
- [ ] `RESEND_API_KEY` never in any committed file
