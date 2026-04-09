const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const crypto  = require('crypto');
const busboy  = require('busboy');
const { Resend } = require('resend');

// ── Paths ─────────────────────────────────────────────────────────────────────
const DATA_DIR      = path.join(__dirname, 'data');
const CARS_FILE     = path.join(DATA_DIR, 'cars.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const UPLOADS_DIR   = path.join(__dirname, 'images', 'uploads');

// Ensure directories exist
[DATA_DIR, UPLOADS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return fallback; }
}
function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── Data ──────────────────────────────────────────────────────────────────────
let carsDB     = loadJSON(CARS_FILE, []);
let bookingsDB = loadJSON(BOOKINGS_FILE, []);

// ── Resend ────────────────────────────────────────────────────────────────────
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// ── Booking slots ─────────────────────────────────────────────────────────────
function slotKey(date, time, car) { return `${date}|${time}|${car}`; }

function berlinDateStr() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
}

// Re-populate bookedSlots from saved future bookings
const bookedSlots = new Set();
bookingsDB.forEach(b => {
  if (b.date >= berlinDateStr()) bookedSlots.add(slotKey(b.date, b.time, b.car));
});

// ── Admin sessions ────────────────────────────────────────────────────────────
const adminSessions = new Set();

function isAdmin(req) {
  const cookie = req.headers.cookie || '';
  const match  = cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match && adminSessions.has(match[1]);
}

function getAdminToken(req) {
  const cookie = req.headers.cookie || '';
  const match  = cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? match[1] : null;
}

// ── Availability ──────────────────────────────────────────────────────────────
function getSlotsForDate(dateStr) {
  const day = new Date(dateStr + 'T12:00:00').getDay();
  if (day === 0) return [];
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

// ── MIME types ────────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.avif': 'image/avif', '.webp': 'image/webp',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2'
};

// ── HTTP Server ───────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // ── GET /api/cars ──────────────────────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/api/cars') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(carsDB));
    return;
  }

  // ── GET /api/slots ─────────────────────────────────────────────────────────
  if (req.method === 'GET' && req.url.startsWith('/api/slots')) {
    const url  = new URL(req.url, 'http://localhost');
    const date = url.searchParams.get('date');
    const car  = url.searchParams.get('car') || '';
    if (!date) { res.writeHead(400); res.end(JSON.stringify({ error: 'date required' })); return; }

    const now        = new Date();
    const todayStr   = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    const berlinTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
    const [bh, bm]   = berlinTime.split(':').map(Number);
    const nowMinutes = bh * 60 + bm;

    const slots = getSlotsForDate(date).map(({ start, end }) => {
      const slotMinutes = parseInt(start.split(':')[0]) * 60;
      const isPast      = date === todayStr && slotMinutes <= nowMinutes;
      return {
        start, end,
        available: !isPast && !bookedSlots.has(slotKey(date, start, car))
      };
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(slots));
    return;
  }

  // ── POST /api/book ─────────────────────────────────────────────────────────
  if (req.method === 'POST' && req.url === '/api/book') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { name, email, phone, car, date, time, timeDisplay } = JSON.parse(body);
        const displayTime = timeDisplay || time;

        if (!name || !email || !car || !date || !time) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields' }));
          return;
        }

        const key = slotKey(date, time, car);
        if (bookedSlots.has(key)) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'This slot was just taken. Please choose another time.' }));
          return;
        }

        bookedSlots.add(key);

        // Save booking to file
        const booking = {
          id:          crypto.randomUUID(),
          name, email, phone: phone || '',
          car, date, time, timeDisplay: displayTime,
          bookedAt:    new Date().toISOString()
        };
        bookingsDB.push(booking);
        saveJSON(BOOKINGS_FILE, bookingsDB);

        // Send emails
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

  // ── Admin: GET /admin ──────────────────────────────────────────────────────
  if (req.method === 'GET' && (req.url === '/admin' || req.url === '/admin/')) {
    fs.readFile(path.join(__dirname, 'admin.html'), (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // ── Admin: POST /admin/login ───────────────────────────────────────────────
  if (req.method === 'POST' && req.url === '/admin/login') {
    let body = '';
    req.on('data', c => { body += c; });
    req.on('end', () => {
      try {
        const { password } = JSON.parse(body);
        if (password && password === process.env.ADMIN_PASSWORD) {
          const token = crypto.randomBytes(32).toString('hex');
          adminSessions.add(token);
          res.writeHead(200, {
            'Set-Cookie': `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict`,
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify({ ok: true }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Wrong password' }));
        }
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad request' }));
      }
    });
    return;
  }

  // ── Admin: POST /admin/logout ──────────────────────────────────────────────
  if (req.method === 'POST' && req.url === '/admin/logout') {
    const token = getAdminToken(req);
    if (token) adminSessions.delete(token);
    res.writeHead(200, {
      'Set-Cookie': 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // ── Admin: GET /admin/api/bookings ─────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/admin/api/bookings') {
    if (!isAdmin(req)) { res.writeHead(401); res.end('Unauthorized'); return; }
    const sorted = [...bookingsDB].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sorted));
    return;
  }

  // ── Admin: DELETE /admin/api/bookings/:id ──────────────────────────────────
  if (req.method === 'DELETE' && req.url.startsWith('/admin/api/bookings/')) {
    if (!isAdmin(req)) { res.writeHead(401); res.end('Unauthorized'); return; }
    const id  = decodeURIComponent(req.url.slice('/admin/api/bookings/'.length));
    const idx = bookingsDB.findIndex(b => b.id === id);
    if (idx === -1) { res.writeHead(404); res.end(JSON.stringify({ error: 'Not found' })); return; }
    const booking = bookingsDB[idx];
    bookedSlots.delete(slotKey(booking.date, booking.time, booking.car));
    bookingsDB.splice(idx, 1);
    saveJSON(BOOKINGS_FILE, bookingsDB);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // ── Admin: GET /admin/api/cars ─────────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/admin/api/cars') {
    if (!isAdmin(req)) { res.writeHead(401); res.end('Unauthorized'); return; }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(carsDB));
    return;
  }

  // ── Admin: POST /admin/api/cars (add car + file upload) ───────────────────
  if (req.method === 'POST' && req.url === '/admin/api/cars') {
    if (!isAdmin(req)) { res.writeHead(401); res.end('Unauthorized'); return; }

    const bb       = busboy({ headers: req.headers, limits: { fileSize: 20 * 1024 * 1024 } });
    const fields   = {};
    const imagePaths = [];
    const fileWritePromises = [];

    bb.on('field', (name, val) => { fields[name] = val; });

    bb.on('file', (fieldName, file, info) => {
      const ext      = path.extname(info.filename || '').toLowerCase() || '.jpg';
      const safeName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
      const savePath = path.join(UPLOADS_DIR, safeName);
      const relPath  = `images/uploads/${safeName}`;
      imagePaths.push(relPath);

      const writePromise = new Promise((resolve, reject) => {
        const ws = fs.createWriteStream(savePath);
        file.pipe(ws);
        ws.on('finish', resolve);
        ws.on('error', reject);
      });
      fileWritePromises.push(writePromise);
    });

    bb.on('close', async () => {
      try {
        await Promise.all(fileWritePromises);

        const features = fields.features
          ? fields.features.split('\n').map(f => f.trim()).filter(Boolean)
          : [];

        const newCar = {
          id:           Date.now(),
          name:         fields.name        || 'Unnamed Car',
          make:         fields.make        || '—',
          model:        fields.model       || '—',
          year:         fields.year        ? parseInt(fields.year) : null,
          km:           fields.km          || 'Auf Anfrage',
          power:        fields.power       || 'Auf Anfrage',
          fuel:         fields.fuel        || 'Auf Anfrage',
          transmission: fields.transmission || 'Auf Anfrage',
          engine:       fields.engine      || '—',
          color:        fields.color       || '—',
          interior:     fields.interior    || '—',
          condition:    fields.condition   || 'Gebrauchtfahrzeug',
          status:       fields.status      || 'used',
          features,
          thumb:        imagePaths[0]      || '',
          images:       imagePaths
        };

        carsDB.push(newCar);
        saveJSON(CARS_FILE, carsDB);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newCar));
      } catch (err) {
        console.error('Add car error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to save car' }));
      }
    });

    req.pipe(bb);
    return;
  }

  // ── Admin: DELETE /admin/api/cars/:id ──────────────────────────────────────
  if (req.method === 'DELETE' && req.url.startsWith('/admin/api/cars/')) {
    if (!isAdmin(req)) { res.writeHead(401); res.end('Unauthorized'); return; }
    const id  = parseInt(req.url.slice('/admin/api/cars/'.length));
    const idx = carsDB.findIndex(c => c.id === id);
    if (idx === -1) { res.writeHead(404); res.end(JSON.stringify({ error: 'Not found' })); return; }
    carsDB.splice(idx, 1);
    saveJSON(CARS_FILE, carsDB);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // ── Static files ───────────────────────────────────────────────────────────
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
  console.log(`  Admin panel: http://localhost:${PORT}/admin`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log('  ⚠  ADMIN_PASSWORD not set — admin panel login will fail.\n');
  }
});
