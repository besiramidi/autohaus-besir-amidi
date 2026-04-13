require('dotenv').config();
const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const { Resend } = require('resend');

// ── Resend email client ───────────────────────────────────────────────────────
// Set RESEND_API_KEY in your environment to enable email sending.
//   set RESEND_API_KEY=re_xxxxxxxxxxxx
//
// DEALER_EMAIL — address that receives new booking notifications (required).
// FROM_EMAIL   — verified sender address in your Resend domain (required).
//                Must match a domain verified in your Resend account.
// ─────────────────────────────────────────────────────────────────────────────
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// In-memory booked slots — resets on server restart
// Format: "YYYY-MM-DD|HH:MM"
const bookedSlots = new Set();

function slotKey(date, time) { return `${date}|${time}`; }

// ── Availability by day of week ───────────────────────────────────────────────
function getSlotsForDate(dateStr) {
  const day = new Date(dateStr + 'T12:00:00').getDay();

  // Sunday — closed
  if (day === 0) return [];

  // Mon–Sat: 09:00 opening, 19:00 closing → last slot starts at 18:00
  const startHours = [9,10,11,12,13,14,15,16,17,18];
  return startHours.map(h => ({
    start: String(h).padStart(2,'0') + ':00',
    end:   String(h + 1).padStart(2,'0') + ':00'
  }));
}

// ── Email templates ───────────────────────────────────────────────────────────
function customerEmailHTML({ name, car, date, time, dealerEmail }) {
  const d = new Date(date + 'T12:00:00');
  const formatted = d.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const firstName = name.split(' ')[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  body{margin:0;padding:0;background:#09090D;font-family:Georgia,serif;color:#EDE9E1}
  .wrap{max-width:560px;margin:0 auto;padding:52px 36px}
  .logo{font-family:Arial,sans-serif;font-size:1.1rem;letter-spacing:0.3em;
        text-transform:uppercase;color:#EDE9E1;margin-bottom:44px}
  .logo span{color:#C8A96E}
  h1{font-weight:300;font-size:2rem;line-height:1.15;margin:0 0 10px;color:#EDE9E1}
  h1 em{color:#C8A96E;font-style:italic}
  .sub{color:rgba(237,233,225,.5);font-family:Arial,sans-serif;font-size:.85rem;
       margin-bottom:40px;line-height:1.6}
  .card{background:#111117;border:1px solid rgba(200,169,110,.22);padding:28px 32px;margin-bottom:32px}
  .row{display:flex;justify-content:space-between;align-items:baseline;
       padding:11px 0;border-bottom:1px solid rgba(255,255,255,.06)}
  .row:last-child{border-bottom:none}
  .lbl{font-family:Arial,sans-serif;font-size:.6rem;letter-spacing:.18em;
       text-transform:uppercase;color:rgba(237,233,225,.38)}
  .val{font-family:Arial,sans-serif;font-size:.88rem;color:#EDE9E1;font-weight:500}
  .gold{color:#C8A96E}
  .note{font-family:Arial,sans-serif;font-size:.8rem;color:rgba(237,233,225,.48);
        line-height:1.8;margin-bottom:36px}
  .note a{color:#C8A96E;text-decoration:none}
  .divider{height:1px;background:rgba(255,255,255,.07);margin:32px 0}
  .footer{font-family:Arial,sans-serif;font-size:.72rem;color:rgba(237,233,225,.3);line-height:1.9}
</style>
</head>
<body>
<div class="wrap">
  <div class="logo"><span>AUTO</span>HAUS</div>
  <h1>Your Test Drive<br>is <em>Confirmed</em></h1>
  <p class="sub">We're looking forward to meeting you, ${firstName}.</p>

  <div class="card">
    <div class="row"><span class="lbl">Vehicle</span><span class="val gold">${car}</span></div>
    <div class="row"><span class="lbl">Date</span><span class="val">${formatted}</span></div>
    <div class="row"><span class="lbl">Time</span><span class="val">${time}</span></div>
    <div class="row"><span class="lbl">Name</span><span class="val">${name}</span></div>
  </div>

  <p class="note">
    Please arrive 5 minutes early. Need to reschedule?<br>
    Call or WhatsApp us at <a href="tel:+13234567890">+1 (323) 456-7890</a>
    or email us at <a href="mailto:${dealerEmail}">${dealerEmail}</a>.
  </p>
  <div class="divider"></div>
  <p style="font-family:Arial,sans-serif;font-size:.68rem;color:rgba(237,233,225,.22);
            text-align:center;margin-bottom:20px;letter-spacing:.06em">
    This is an automated no-reply message — please do not reply directly to this email.
  </p>
  <p class="footer">
    AutoHaus — Premium Pre-Owned Vehicles<br>
    ${dealerEmail} &nbsp;·&nbsp; +1 (323) 456-7890<br>
    Mon–Sat: 9AM–7PM &nbsp;|&nbsp; Sun: 11AM–5PM
  </p>
</div>
</body>
</html>`;
}

function dealerEmailHTML({ name, email, phone, car, date, time }) {
  const d = new Date(date + 'T12:00:00');
  const formatted = d.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  return `<h2 style="font-family:Arial,sans-serif">New Test Drive Booking</h2>
<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
  <tr><td style="padding:6px 16px 6px 0;color:#666">Vehicle</td><td><strong>${car}</strong></td></tr>
  <tr><td style="padding:6px 16px 6px 0;color:#666">Date</td><td>${formatted}</td></tr>
  <tr><td style="padding:6px 16px 6px 0;color:#666">Time</td><td><strong>${time}</strong></td></tr>
  <tr><td style="padding:6px 16px 6px 0;color:#666">Customer</td><td>${name}</td></tr>
  <tr><td style="padding:6px 16px 6px 0;color:#666">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
  <tr><td style="padding:6px 16px 6px 0;color:#666">Phone</td><td>${phone || '—'}</td></tr>
</table>`;
}

// ── HTTP Server ───────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.avif': 'image/avif', '.webp': 'image/webp',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // GET /api/slots?date=YYYY-MM-DD
  if (req.method === 'GET' && req.url.startsWith('/api/slots')) {
    const url    = new URL(req.url, 'http://localhost');
    const date   = url.searchParams.get('date');
    if (!date) { res.writeHead(400); res.end(JSON.stringify({ error: 'date required' })); return; }

    const slots  = getSlotsForDate(date).map(({ start, end }) => ({
      start, end,
      available: !bookedSlots.has(slotKey(date, start))
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(slots));
    return;
  }

  // POST /api/book
  if (req.method === 'POST' && req.url === '/api/book') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { name, email, phone, car, date, time, timeDisplay, recaptchaToken } = JSON.parse(body);
        const displayTime = timeDisplay || time;

        if (!name || !email || !car || !date || !time) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields' }));
          return;
        }

        // Verify reCAPTCHA v3 token
        if (process.env.RECAPTCHA_SECRET_KEY) {
          if (!recaptchaToken) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'reCAPTCHA token missing.' }));
            return;
          }
          const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
          });
          const verifyData = await verifyRes.json();
          if (!verifyData.success || verifyData.score < 0.5) {
            console.warn(`reCAPTCHA rejected — success:${verifyData.success} score:${verifyData.score}`);
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Security check failed. Please try again.' }));
            return;
          }
          console.log(`reCAPTCHA passed — score: ${verifyData.score}`);
        }

        const key = slotKey(date, time);
        if (bookedSlots.has(key)) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'This slot was just taken. Please choose another time.' }));
          return;
        }

        bookedSlots.add(key);

        // Send emails if Resend is configured
        if (resend) {
          try {
            const dealerEmail = process.env.DEALER_EMAIL || '';
            const fromEmail   = process.env.FROM_EMAIL   || 'noreply@yourdomain.com';

            await resend.emails.send({
              from:    `AutoHaus — No Reply <${fromEmail}>`,
              to:      email,
              subject: `Test Drive Confirmed — ${car}`,
              html:    customerEmailHTML({ name, car, date, time: displayTime, dealerEmail })
            });

            if (dealerEmail) {
              await resend.emails.send({
                from:    `AutoHaus Booking <${fromEmail}>`,
                to:      dealerEmail,
                subject: `New Test Drive: ${car} — ${date} at ${displayTime}`,
                html:    dealerEmailHTML({ name, email, phone, car, date, time: displayTime })
              });
            }

            console.log(`Booking confirmed: ${car} on ${date} at ${displayTime} for ${name} <${email}>`);
          } catch (emailErr) {
            console.error('Email send error:', emailErr.message);
            // Booking is still confirmed even if email fails
          }
        } else {
          console.log(`[NO EMAIL CONFIG] Booking: ${car} on ${date} at ${displayTime} for ${name} <${email}>`);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error('Booking error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error. Please try again.' }));
      }
    });
    return;
  }

  // Static file serving
  let filePath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  filePath = path.join(__dirname, decodeURIComponent(filePath));

  const ext         = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`\nAutoHaus server running → http://localhost:${PORT}`);
  console.log(`  DEBUG: RESEND_API_KEY=${process.env.RESEND_API_KEY ? 're_****' + process.env.RESEND_API_KEY.slice(-4) : 'undefined'}`);
  if (!process.env.RESEND_API_KEY) {
    console.log('  ⚠  RESEND_API_KEY not set — emails will not be sent.');
    console.log('     Set RESEND_API_KEY, FROM_EMAIL, and DEALER_EMAIL to enable.\n');
  } else {
    console.log(`  ✓  Email provider: Resend (from: ${process.env.FROM_EMAIL || 'FROM_EMAIL not set'})\n`);
  }
});
