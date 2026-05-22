# Resend Email Integration Plan — Villa Sinodium

## Goal

Replace the bare `mailto:` links in the contact section and floating "Book Now" button with a proper booking enquiry form that submits to **Resend** for reliable, trackable email delivery to `mario.lela1@gmail.com`.

---

## The Core Problem: GitHub Pages Is Static-Only

GitHub Pages serves only static files — HTML, CSS, JS. You **cannot** put your Resend API key in frontend JavaScript (anyone can read it in DevTools and abuse it). You need a tiny server-side layer that holds the key and calls the Resend API on the form's behalf.

**Chosen solution: Cloudflare Workers**

- Free tier: 100,000 requests/day — more than enough for a villa
- No credit card required to start
- Deploys in minutes with `wrangler` CLI
- Lives at a separate URL (e.g. `https://sinodium-mailer.your-name.workers.dev`)
- The GitHub Pages site calls it via `fetch()`

---

## Architecture

```
User fills form (GitHub Pages)
        │
        │  POST /send  (JSON body)
        ▼
Cloudflare Worker  ←── RESEND_API_KEY (secret, stored in Worker env)
        │
        │  POST https://api.resend.com/emails
        ▼
Resend → delivers email to mario.lela1@gmail.com
```

---

## Phase 1 — Resend Account Setup

**Steps:**

1. Go to [resend.com](https://resend.com) → Sign up (free plan is fine — 3,000 emails/month, no daily booking form will exceed this)
2. Dashboard → **API Keys** → Create key → name it `villa-sinodium-prod`
3. Copy the key — you only see it once. Store it somewhere safe temporarily.
4. (Optional but recommended) Dashboard → **Domains** → Add `villasinodium.com` and verify DNS records. This means email arrives from `noreply@villasinodium.com` instead of Resend's shared domain — much better for deliverability.

**Free plan limits that matter:**
- 3,000 emails/month — fine
- 1 custom domain
- 100 emails/day max (more than enough)

---

## Phase 2 — Cloudflare Worker (the serverless bridge)

### 2a. Setup

```bash
# Install Wrangler (Cloudflare's CLI)
npm install -g wrangler

# Authenticate
wrangler login

# Create the Worker project
mkdir sinodium-mailer && cd sinodium-mailer
wrangler init
```

### 2b. Worker code (`src/index.js`)

```js
export default {
  async fetch(request, env) {
    // Only allow POST from your domain
    const origin = request.headers.get('Origin') || '';
    const allowed = ['https://villasinodium.com', 'http://localhost'];
    if (!allowed.some(o => origin.startsWith(o))) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method === 'OPTIONS') {
      // CORS preflight
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Bad Request', { status: 400 });
    }

    const { name, email, checkin, checkout, guests, message, honeypot } = body;

    // Spam filter: honeypot field must be empty
    if (honeypot) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 }); // silent accept
    }

    // Basic validation
    if (!name || !email || !checkin || !checkout || !guests) {
      return cors(new Response('Missing required fields', { status: 422 }), origin);
    }

    const emailBody = `
New booking enquiry for Villa Sinodium

Name:        ${name}
Email:       ${email}
Check-in:    ${checkin}
Check-out:   ${checkout}
Guests:      ${guests}

Message:
${message || '(none)'}
    `.trim();

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Villa Sinodium <noreply@villasinodium.com>',
        to: ['mario.lela1@gmail.com'],
        reply_to: email,
        subject: `Booking enquiry from ${name} — ${checkin} to ${checkout}`,
        text: emailBody,
      }),
    });

    if (!res.ok) {
      return cors(new Response('Email failed', { status: 502 }), origin);
    }

    return cors(new Response(JSON.stringify({ ok: true }), { status: 200 }), origin);
  }
};

function cors(response, origin) {
  response.headers.set('Access-Control-Allow-Origin', origin);
  return response;
}
```

### 2c. Add the secret

```bash
# Store your Resend API key as a secret (never in code)
wrangler secret put RESEND_API_KEY
# Paste the key when prompted
```

### 2d. Deploy

```bash
wrangler deploy
# Output: https://sinodium-mailer.YOUR-SUBDOMAIN.workers.dev
```

Note that URL — you'll paste it into the form's JavaScript in Phase 3.

---

## Phase 3 — HTML Form (in `index.html`)

Replace the existing contact section body with the form below (keep the address/phone/map beneath it):

```html
<section class="contact section-block section-alt" id="contact" aria-labelledby="contact-heading">
  <div class="container">
    <h2 id="contact-heading">Book Your Stay</h2>
    <p class="section-lead">Fill in your details and we'll get back to you within 24 hours.</p>

    <form class="booking-form" id="bookingForm" novalidate>
      <!-- Honeypot — hidden from humans, catches bots -->
      <input type="text" name="honeypot" class="booking-form__honeypot" tabindex="-1" autocomplete="off" aria-hidden="true">

      <div class="booking-form__row">
        <div class="booking-form__field">
          <label for="bf-name">Your name <span aria-hidden="true">*</span></label>
          <input type="text" id="bf-name" name="name" required autocomplete="name" placeholder="Ana Horvat">
        </div>
        <div class="booking-form__field">
          <label for="bf-email">Email address <span aria-hidden="true">*</span></label>
          <input type="email" id="bf-email" name="email" required autocomplete="email" placeholder="ana@example.com">
        </div>
      </div>

      <div class="booking-form__row">
        <div class="booking-form__field">
          <label for="bf-checkin">Check-in date <span aria-hidden="true">*</span></label>
          <input type="date" id="bf-checkin" name="checkin" required>
        </div>
        <div class="booking-form__field">
          <label for="bf-checkout">Check-out date <span aria-hidden="true">*</span></label>
          <input type="date" id="bf-checkout" name="checkout" required>
        </div>
      </div>

      <div class="booking-form__field booking-form__field--half">
        <label for="bf-guests">Number of guests <span aria-hidden="true">*</span></label>
        <select id="bf-guests" name="guests" required>
          <option value="">Select…</option>
          <option value="1">1 guest</option>
          <option value="2">2 guests</option>
          <option value="3">3 guests</option>
          <option value="4">4 guests</option>
          <option value="5">5 guests</option>
          <option value="6">6 guests</option>
          <option value="7">7 guests</option>
        </select>
      </div>

      <div class="booking-form__field">
        <label for="bf-message">Message (optional)</label>
        <textarea id="bf-message" name="message" rows="4" placeholder="Any questions or special requests…"></textarea>
      </div>

      <div class="booking-form__actions">
        <button type="submit" class="btn booking-form__submit">Send Enquiry</button>
        <p class="booking-form__status" id="formStatus" aria-live="polite"></p>
      </div>
    </form>

    <!-- Existing contact info stays below -->
    <ul class="contact-list">
      <li>
        <span class="contact-label">Address</span>
        <span>Perina Glavica 4, Umljanović</span>
      </li>
      <li>
        <span class="contact-label">Email</span>
        <a href="mailto:mario.lela1@gmail.com">mario.lela1@gmail.com</a>
      </li>
      <li>
        <span class="contact-label">Phone</span>
        <a href="tel:+385982080071">+385 98 208 007</a>
      </li>
    </ul>
    <p class="contact-map-note"><a href="https://maps.app.goo.gl/ewA48V9qNBCqW8ku8" target="_blank" rel="noopener noreferrer">Open in Google Maps</a></p>
    <div class="contact-map">
      <!-- existing map iframe stays unchanged -->
    </div>
  </div>
</section>
```

---

## Phase 4 — JavaScript (inline at bottom of `index.html`)

Add this before `</body>`:

```html
<script>
  const WORKER_URL = 'https://sinodium-mailer.YOUR-SUBDOMAIN.workers.dev/send';

  const form = document.getElementById('bookingForm');
  const status = document.getElementById('formStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.booking-form__submit');

    // Date validation: checkout must be after checkin
    const checkin = new Date(form.checkin.value);
    const checkout = new Date(form.checkout.value);
    if (checkout <= checkin) {
      status.textContent = 'Check-out must be after check-in.';
      status.className = 'booking-form__status booking-form__status--error';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.textContent = '';

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.value.trim(),
          email: form.email.value.trim(),
          checkin: form.checkin.value,
          checkout: form.checkout.value,
          guests: form.guests.value,
          message: form.message.value.trim(),
          honeypot: form.honeypot.value,
        }),
      });

      if (res.ok) {
        status.textContent = '✓ Enquiry sent! We'll reply within 24 hours.';
        status.className = 'booking-form__status booking-form__status--success';
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      status.textContent = 'Something went wrong. Please email us directly at mario.lela1@gmail.com';
      status.className = 'booking-form__status booking-form__status--error';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Enquiry';
    }
  });
</script>
```

---

## Phase 5 — CSS (additions to `styles.css`)

The form inherits the warm rustic theme via existing CSS variables. Add these rules:

```css
/* ── Booking form ─────────────────────────────────────────── */
.booking-form {
  max-width: 640px;
  margin-block: 2rem 3rem;
}

.booking-form__honeypot {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.booking-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 540px) {
  .booking-form__row { grid-template-columns: 1fr; }
}

.booking-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-block-end: 1rem;
}

.booking-form__field--half {
  max-width: 300px;
}

.booking-form label {
  font-size: var(--text-small);
  font-weight: 600;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.booking-form input,
.booking-form select,
.booking-form textarea {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--color-text-primary);
  background: var(--color-white);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.85rem;
  transition: border-color 0.18s, box-shadow 0.18s;
  width: 100%;
}

.booking-form input:focus,
.booking-form select:focus,
.booking-form textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(166, 95, 60, 0.15);
}

.booking-form textarea {
  resize: vertical;
  min-height: 100px;
}

.booking-form__actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-block-start: 0.5rem;
}

.booking-form__status {
  font-size: var(--text-small);
  font-weight: 500;
}

.booking-form__status--success { color: var(--color-secondary); }
.booking-form__status--error   { color: #c0392b; }
```

---

## Phase 6 — Update the Floating "Book Now" Button

Change the `mailto:` link to scroll to the form:

```html
<!-- Before -->
<a href="mailto:mario.lela1@gmail.com" class="float-book-btn" aria-label="Book Villa Sinodium by email">Book Now</a>

<!-- After -->
<a href="#contact" class="float-book-btn" aria-label="Book Villa Sinodium — send an enquiry">Book Now</a>
```

---

## Verification Checklist

- [ ] Resend account created, API key generated
- [ ] Custom domain `villasinodium.com` verified in Resend dashboard
- [ ] Cloudflare Worker deployed and reachable
- [ ] `RESEND_API_KEY` stored as Worker secret (not in code)
- [ ] WORKER_URL updated in the inline script
- [ ] Form submits → email arrives at `mario.lela1@gmail.com`
- [ ] Honeypot field invisible and functional
- [ ] Date validation blocks checkout ≤ checkin
- [ ] Success / error states display correctly
- [ ] Mobile layout tested (< 540px: single column form)
- [ ] Fallback email still visible in contact list for users who prefer direct email

---

## Effort Estimate

| Phase | Time |
|---|---|
| Resend account + domain DNS | ~20 min |
| Cloudflare Worker deploy | ~30 min |
| HTML form + CSS additions | ~45 min |
| JS wiring + local testing | ~30 min |
| End-to-end smoke test | ~15 min |
| **Total** | **~2.5 hours** |

---

## Out of Scope (explicitly not in this plan)

- Auto-reply email to the guest (can be added in the Worker later with a second Resend call)
- Calendar availability blocking
- Payment / deposit collection
- Admin dashboard / booking management
- Analytics on form submissions
