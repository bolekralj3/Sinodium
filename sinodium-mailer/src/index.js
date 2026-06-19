const ALLOWED_ORIGINS = [
  'https://villasinodium.com',
  'https://www.villasinodium.com',
  'http://localhost',
  'http://127.0.0.1',
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? '';
    const allowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));

    // CORS preflight
    if (request.method === 'OPTIONS') {
      if (!allowed) return new Response('Forbidden', { status: 403 });
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    if (!allowed) return new Response('Forbidden', { status: 403 });
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    let body;
    try {
      body = await request.json();
    } catch {
      return cors(new Response('Bad Request', { status: 400 }), origin);
    }

    const { name, email, checkin, checkout, guests, message, honeypot } = body;

    // Honeypot: silently accept bots so they don't know they're blocked
    if (honeypot) {
      return cors(new Response(JSON.stringify({ ok: true }), { status: 200 }), origin);
    }

    // Required field validation
    if (!name?.trim() || !email?.trim() || !checkin || !checkout || !guests) {
      return cors(new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 422 }), origin);
    }

    // Date sanity (server-side mirror of client validation)
    if (new Date(checkout) <= new Date(checkin)) {
      return cors(new Response(JSON.stringify({ error: 'Check-out must be after check-in' }), { status: 422 }), origin);
    }

    const emailText = [
      'New booking enquiry for Villa Sinodium',
      '',
      `Name:       ${name.trim()}`,
      `Email:      ${email.trim()}`,
      `Check-in:   ${checkin}`,
      `Check-out:  ${checkout}`,
      `Guests:     ${guests}`,
      '',
      'Message:',
      message?.trim() || '(none)',
    ].join('\n');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Villa Sinodium <noreply@villasinodium.com>',
        to: ['mario.lela1@gmail.com'],
        reply_to: email.trim(),
        subject: `Booking enquiry from ${name.trim()} — ${checkin} to ${checkout}`,
        text: emailText,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('Resend error:', res.status, detail);
      return cors(new Response(JSON.stringify({ error: 'Email delivery failed' }), { status: 502 }), origin);
    }

    return cors(new Response(JSON.stringify({ ok: true }), { status: 200 }), origin);
  },
};

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function cors(response, origin) {
  const r = new Response(response.body, response);
  Object.entries(corsHeaders(origin)).forEach(([k, v]) => r.headers.set(k, v));
  r.headers.set('Content-Type', 'application/json');
  return r;
}
