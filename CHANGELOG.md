# AutoHaus — Changelog

---

## Update 9 — Berlin Timezone Fix

- Past slot detection now uses Europe/Berlin time instead of server UTC — slots hide correctly for German customers

---

## Update 8 — Smart Slot Availability

- Booked time slots are now tracked per car — booking a BMW at 10:00 does not block an Audi at 10:00
- Past time slots on today's date are automatically shown as unavailable

---

## Update 7 — Test Drive Email Confirmation

- Booking a test drive now sends a confirmation email to the customer
- Dealer receives a notification email with full booking details (name, email, phone, car, date, time)
- Emails powered by Resend — configured via `RESEND_API_KEY`, `FROM_EMAIL`, and `DEALER_EMAIL` environment variables

---

## Update 6 — Bug Fixes (Live Testing)

- Fixed single-result grid leaving empty dark space (`auto-fill` → `auto-fit`)
- Fixed 3 Mercedes thumbnails with spaces in filenames returning 404 (server now decodes URLs)
- Fixed modal showing "Preis auf Anfrage" in German — now "Price on Request"

---

## Update 5 — Full Visual Redesign

- Dark luxury automotive aesthetic (near-black background, warm gold accents)
- New font pairing: Cormorant Garamond (headings) + Barlow (UI/body)
- Staggered fade-up hero animations
- Editorial inventory grid with 1px border lines between cards, gold reveal on hover
- Feature cards replaced emoji icons with expanding gold line accents
- Contact form, modal, and lightbox all restyled to match dark theme
- Removed all emojis site-wide — clean typographic labels throughout
- Navbar transparent over hero, solid dark on scroll

---

## Update 4 — Fullscreen Image Lightbox

- Clicking the main gallery image in any car modal now opens a fullscreen lightbox
- Dark overlay covers the entire screen with the image displayed large
- Left / right arrows to navigate between all photos in fullscreen
- ✕ button to close, or click anywhere on the dark background
- Keyboard support: ← → arrows to navigate, Escape to close
- Gallery image shows a zoom cursor to hint it's clickable

---

## Update 3 — Real Car Listings with Photos & Brand Filters

- Hero background replaced with real showroom photo from mobile folder
- Removed all placeholder/fake car data
- Added 5 real cars from the mobile folder:
  - Mercedes-Benz E 220 d (W213) — 16 photos, full specs from txt
  - Audi A4 — 13 photos
  - Audi A6 sport 50 TFSI e quattro — 14 photos, full specs from txt
  - BMW M5 (F10) — 17 photos, full specs from txt
  - Volkswagen Golf 6 Variant — 10 photos, full specs from txt
- Make filter bar: All Cars / Mercedes Benz / Audi / BMW / Volkswagen
- Cascading model sub-filter (e.g. Audi → A4 or A6)
- Hero search now filters by Make, Model, and Fuel type
- Photo gallery in modal with thumbnails + left/right arrows + keyboard navigation
- All prices set to "Preis auf Anfrage" (Price on request)
- Real specs pulled from txt files: km, power, engine, fuel, transmission, color, interior, features list

---

## Update 2 — AutoHaus Car Selling Website (Initial Build)

- Built full car selling website from scratch (HTML/CSS/JS)
- Hero section with search filters (Make, Type, Max Price)
- Inventory grid with 9 placeholder car listings
- Category filter tabs (SUV, Sedan, Coupe, Electric, Truck)
- Car detail modal with specs and action buttons
- Favourites (heart button per card)
- Why Us section with 6 feature cards
- About section with company story
- Testimonials section
- Contact form with inquiry type selector
- Mobile-responsive layout with hamburger menu
- Footer with brand links and quick nav

---

## Update 1 — Project Setup

- Created GitHub repo: autohaus-besir-amidi
- Initial project structure with index.html, style.css, script.js
