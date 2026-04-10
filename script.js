// ===== CAR DATA (loaded from API) =====
let cars       = [];
let makesModels = {};

// ===== STATE =====
let activeMake = "";
let activeModel = "";
let currentGalleryIndex = 0;
let currentGalleryCar = null;

// ===== INIT =====
document.addEventListener("DOMContentLoaded", async () => {
  setupNavbar();
  setupHamburger();
  setupContactForm();

  try {
    const res = await fetch('/api/cars');
    cars = await res.json();
  } catch {
    cars = [];
  }

  // Build makesModels dynamically from fetched cars
  makesModels = {};
  cars.forEach(car => {
    if (!makesModels[car.make]) makesModels[car.make] = [];
    if (car.model && !makesModels[car.make].includes(car.model)) {
      makesModels[car.make].push(car.model);
    }
  });

  // Rebuild make filter bar from live data
  const filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    const makes = [...new Set(cars.map(c => c.make))];
    filterBar.innerHTML = `<button class="filter-btn active" data-make="">All Cars</button>` +
      makes.map(m => `<button class="filter-btn" data-make="${m}">${m}</button>`).join('');
  }

  // Rebuild hero make dropdown
  const makeSelect = document.getElementById('filterMake');
  if (makeSelect) {
    const makes = [...new Set(cars.map(c => c.make))];
    makeSelect.innerHTML = '<option value="">All Makes</option>' +
      makes.map(m => `<option value="${m}">${m}</option>`).join('');
  }

  renderCars(cars);
  setupMakeFilterButtons();
  updateModelFilter();
});

// ===== RENDER CARS =====
function renderCars(list) {
  const grid = document.getElementById("carsGrid");
  const noResults = document.getElementById("noResults");

  if (list.length === 0) {
    grid.innerHTML = "";
    noResults.classList.remove("hidden");
    return;
  }
  noResults.classList.add("hidden");

  grid.innerHTML = list.map(car => `
    <div class="car-card" onclick="openModal(${car.id})">
      <div class="car-img-real">
        <img src="${encodePath(car.thumb)}" alt="${car.name}" loading="lazy" />
        <span class="car-badge ${car.status}">${badgeLabel(car.status)}</span>
        <span class="car-photo-count">${car.images.length} photos</span>
      </div>
      <div class="car-info">
        <div class="car-make-tag">${car.make}</div>
        <h3>${car.year ? car.year + ' ' : ''}${car.name}</h3>
        <div class="car-meta">
          <span>${car.km}</span>
          <span>${car.power}</span>
          <span>${car.fuel}</span>
          <span>${car.transmission}</span>
        </div>
        <div class="car-price-row">
          <span class="car-price-poa">Price on Request</span>
          <button class="btn-details" onclick="event.stopPropagation(); openModal(${car.id})">View Details</button>
        </div>
      </div>
    </div>
  `).join("");
}

function badgeLabel(status) {
  if (status === "certified") return "Geprüft";
  return "Gebraucht";
}

function encodePath(path) {
  return path.split("/").map((seg, i) => i === 0 ? seg : encodeURIComponent(seg)).join("/");
}

// ===== MAKE FILTER BUTTONS =====
function setupMakeFilterButtons() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeMake = btn.dataset.make;
      activeModel = "";
      renderModelSubFilter(activeMake);
      applyCurrentFilter();
    });
  });
}

function renderModelSubFilter(make) {
  const bar = document.getElementById("modelFilterBar");
  if (!make || !makesModels[make]) {
    bar.innerHTML = "";
    return;
  }
  const models = makesModels[make];
  bar.innerHTML = `
    <button class="model-btn active" data-model="" onclick="selectModel(this, '')">All ${make}</button>
    ${models.map(m => `<button class="model-btn" data-model="${m}" onclick="selectModel(this, '${m}')">${m}</button>`).join("")}
  `;
}

function selectModel(btn, model) {
  document.querySelectorAll(".model-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  activeModel = model;
  applyCurrentFilter();
}

function applyCurrentFilter() {
  let list = cars;
  if (activeMake) list = list.filter(c => c.make === activeMake);
  if (activeModel) list = list.filter(c => c.model === activeModel);
  renderCars(list);
}

// ===== HERO SEARCH =====
function updateModelFilter() {
  const make = document.getElementById("filterMake").value;
  const modelSelect = document.getElementById("filterModel");
  modelSelect.innerHTML = '<option value="">All Models</option>';
  if (make && makesModels[make]) {
    makesModels[make].forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      modelSelect.appendChild(opt);
    });
  }
}

function applyFilters() {
  const make = document.getElementById("filterMake").value;
  const model = document.getElementById("filterModel").value;
  const fuel = document.getElementById("filterFuel").value;

  let result = cars.filter(car => {
    if (make && car.make !== make) return false;
    if (model && car.model !== model) return false;
    if (fuel && car.fuel !== fuel) return false;
    return true;
  });

  document.getElementById("inventory").scrollIntoView({ behavior: "smooth" });

  // Sync filter bar
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  document.querySelector(".filter-btn[data-make='']").classList.add("active");
  activeMake = ""; activeModel = "";
  document.getElementById("modelFilterBar").innerHTML = "";

  setTimeout(() => renderCars(result), 400);
}

function resetFilters() {
  document.getElementById("filterMake").value = "";
  document.getElementById("filterModel").innerHTML = '<option value="">All Models</option>';
  document.getElementById("filterFuel").value = "";
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  document.querySelector(".filter-btn[data-make='']").classList.add("active");
  document.getElementById("modelFilterBar").innerHTML = "";
  activeMake = ""; activeModel = "";
  renderCars(cars);
}

function filterByMakeLink(make) {
  const btn = document.querySelector(`.filter-btn[data-make="${make}"]`);
  if (btn) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeMake = make;
    activeModel = "";
    renderModelSubFilter(make);
    applyCurrentFilter();
    document.getElementById("inventory").scrollIntoView({ behavior: "smooth" });
  }
}

// ===== MODAL =====
function openModal(id) {
  const car = cars.find(c => c.id === id);
  if (!car) return;
  currentGalleryCar = car;
  currentGalleryIndex = 0;

  const specs = [
    ["Year", car.year || "—"],
    ["Mileage", car.km],
    ["Power", car.power],
    ["Engine", car.engine],
    ["Fuel", car.fuel],
    ["Transmission", car.transmission],
    ["Series", car.series],
    ["Color", car.color],
    ["Interior", car.interior],
    ["Seats", car.seats],
    ["Doors", car.doors],
    ["Euro Norm", car.eu],
    ["HU / TÜV", car.hu],
    ["Owners", car.owners ? `${car.owners}` : "—"],
    ["Condition", car.condition],
    ...(car.battery ? [["Battery", car.battery]] : []),
    ...(car.available ? [["Available", car.available]] : []),
  ];

  document.getElementById("modalContent").innerHTML = `
    <!-- GALLERY -->
    <div class="modal-gallery">
      <div class="gallery-main" id="galleryMain">
        <img src="${encodePath(car.images[0])}" alt="${car.name}" id="galleryMainImg" onclick="openLightbox()" />
        <button class="gallery-arrow left" onclick="galleryPrev()">‹</button>
        <button class="gallery-arrow right" onclick="galleryNext()">›</button>
        <span class="gallery-counter" id="galleryCounter">1 / ${car.images.length}</span>
      </div>
      <div class="gallery-thumbs" id="galleryThumbs">
        ${car.images.map((img, i) => `
          <img src="${encodePath(img)}"
               class="gallery-thumb ${i === 0 ? 'active' : ''}"
               onclick="setGalleryImage(${i})"
               alt="Photo ${i+1}" loading="lazy" />
        `).join("")}
      </div>
    </div>

    <!-- INFO -->
    <div class="modal-body">
      <div class="modal-header-row">
        <div>
          <span class="car-make-tag">${car.make}</span>
          <h2>${car.year ? car.year + ' ' : ''}${car.name}</h2>
        </div>
        <span class="car-price-poa large">Price on Request</span>
      </div>

      <div class="modal-specs">
        ${specs.map(([label, val]) => `
          <div class="spec-item">
            <div class="spec-label">${label}</div>
            <div class="spec-value">${val}</div>
          </div>
        `).join("")}
      </div>

      <div class="modal-features">
        <h4>Ausstattung</h4>
        <div class="features-tags">
          ${car.features.map(f => `<span class="feat-tag">${f}</span>`).join("")}
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-primary" onclick="contactCar('${car.name}')">Inquire / Request Price</button>
        <button class="btn-outline" onclick="closeModal(); openBooking('${car.name.replace(/'/g, "\\'")}')">Book a Test Drive</button>
      </div>
    </div>
  `;

  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function setGalleryImage(index) {
  if (!currentGalleryCar) return;
  currentGalleryIndex = index;
  document.getElementById("galleryMainImg").src = encodePath(currentGalleryCar.images[index]);
  document.getElementById("galleryCounter").textContent = `${index + 1} / ${currentGalleryCar.images.length}`;
  document.querySelectorAll(".gallery-thumb").forEach((t, i) => {
    t.classList.toggle("active", i === index);
  });
  // Scroll thumb into view
  const thumb = document.querySelectorAll(".gallery-thumb")[index];
  if (thumb) thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
}

function galleryNext() {
  if (!currentGalleryCar) return;
  const next = (currentGalleryIndex + 1) % currentGalleryCar.images.length;
  setGalleryImage(next);
}

function galleryPrev() {
  if (!currentGalleryCar) return;
  const prev = (currentGalleryIndex - 1 + currentGalleryCar.images.length) % currentGalleryCar.images.length;
  setGalleryImage(prev);
}

function closeModal() {
  closeLightbox();
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
  currentGalleryCar = null;
}

document.addEventListener("keydown", e => {
  if (document.getElementById("bookingOverlay").classList.contains("open")) return;
  if (document.getElementById("lightbox").classList.contains("open")) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") lightboxNext();
    if (e.key === "ArrowLeft") lightboxPrev();
    return;
  }
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowRight") galleryNext();
  if (e.key === "ArrowLeft") galleryPrev();
});

// ===== LIGHTBOX =====
function openLightbox() {
  if (!currentGalleryCar) return;
  const lb = document.getElementById("lightbox");
  document.getElementById("lightboxImg").src = encodePath(currentGalleryCar.images[currentGalleryIndex]);
  document.getElementById("lightboxCounter").textContent =
    `${currentGalleryIndex + 1} / ${currentGalleryCar.images.length}`;
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
}

function lightboxNext() {
  if (!currentGalleryCar) return;
  const next = (currentGalleryIndex + 1) % currentGalleryCar.images.length;
  setGalleryImage(next);
  document.getElementById("lightboxImg").src = encodePath(currentGalleryCar.images[next]);
  document.getElementById("lightboxCounter").textContent =
    `${next + 1} / ${currentGalleryCar.images.length}`;
}

function lightboxPrev() {
  if (!currentGalleryCar) return;
  const prev = (currentGalleryIndex - 1 + currentGalleryCar.images.length) % currentGalleryCar.images.length;
  setGalleryImage(prev);
  document.getElementById("lightboxImg").src = encodePath(currentGalleryCar.images[prev]);
  document.getElementById("lightboxCounter").textContent =
    `${prev + 1} / ${currentGalleryCar.images.length}`;
}

// ===== CONTACT =====
function contactCar(carName) {
  const select = document.getElementById("cfInterest");
  if (select) {
    const lower = carName.toLowerCase();
    for (let opt of select.options) {
      if (opt.value.toLowerCase().includes(lower.split(" ")[1] || "")) {
        select.value = opt.value;
        break;
      }
    }
  }
  closeModal();
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  showToast("Fill in the form below to get in touch.");
}

// ===== FORM VALIDATION =====
function cfValidate(id, errorId, check, msg) {
  const field = document.getElementById("field-" + id);
  const el = document.getElementById(id === "firstName" ? "cfFirstName"
    : id === "lastName" ? "cfLastName"
    : id === "email" ? "cfEmail"
    : id === "message" ? "cfMessage" : "cf" + id.charAt(0).toUpperCase() + id.slice(1));
  const err = errorId ? document.getElementById(errorId) : null;
  if (!el || !field) return true;
  const valid = check(el.value.trim());
  field.classList.toggle("has-error", !valid);
  field.classList.toggle("is-valid", valid && el.value.trim() !== "");
  if (err) err.textContent = valid ? "" : msg;
  return valid;
}

function handleFormSubmit(event) {
  event.preventDefault();

  const firstOk = cfValidate("firstName", "err-firstName",
    v => v.length >= 2, "Please enter your first name.");
  const lastOk  = cfValidate("lastName",  "err-lastName",
    v => v.length >= 2, "Please enter your last name.");
  const emailOk = cfValidate("email", "err-email",
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Please enter a valid email.");

  if (!firstOk || !lastOk || !emailOk) return;

  const btn = document.getElementById("cfSubmit");
  btn.classList.add("loading");
  btn.disabled = true;

  setTimeout(() => {
    btn.classList.remove("loading");
    btn.disabled = false;
    showSuccessState();
  }, 1400);
}

function showSuccessState() {
  const form    = document.getElementById("contactForm");
  const success = document.getElementById("cfSuccess");

  // Hide all form fields and button
  [...form.children].forEach(el => {
    if (!el.classList.contains("cf-success")) el.style.display = "none";
  });

  success.style.display = "flex";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => success.classList.add("visible"));
  });
}

function resetContactForm() {
  const form    = document.getElementById("contactForm");
  const success = document.getElementById("cfSuccess");

  success.classList.remove("visible");
  setTimeout(() => {
    success.style.display = "none";
    [...form.children].forEach(el => {
      if (!el.classList.contains("cf-success")) el.style.display = "";
    });
    form.reset();
    document.getElementById("cfMsgCount").textContent = "0";
    document.querySelectorAll(".cf-field").forEach(f => {
      f.classList.remove("has-error", "is-valid");
    });
    document.querySelectorAll(".cf-error").forEach(e => e.textContent = "");
  }, 400);
}

// ===== CONTACT FORM SETUP =====
function setupContactForm() {
  const rules = [
    { id: "cfFirstName", fieldId: "firstName", errId: "err-firstName",
      check: v => v.length >= 2, msg: "Please enter your first name." },
    { id: "cfLastName",  fieldId: "lastName",  errId: "err-lastName",
      check: v => v.length >= 2, msg: "Please enter your last name." },
    { id: "cfEmail",     fieldId: "email",     errId: "err-email",
      check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: "Please enter a valid email." },
  ];

  rules.forEach(({ id, fieldId, errId, check, msg }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("blur", () => {
      if (el.value.trim()) cfValidate(fieldId, errId, check, msg);
    });
    el.addEventListener("input", () => {
      const field = document.getElementById("field-" + fieldId);
      if (field && field.classList.contains("has-error")) {
        cfValidate(fieldId, errId, check, msg);
      }
    });
  });

  const msgEl   = document.getElementById("cfMessage");
  const counter = document.getElementById("cfMsgCount");
  if (msgEl && counter) {
    msgEl.addEventListener("input", () => { counter.textContent = msgEl.value.length; });
  }
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

// ===== NAVBAR =====
function setupNavbar() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });
}

function setupHamburger() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

// =====================================================================
// ===== BOOKING SYSTEM ================================================
// =====================================================================
const MONTH_NAMES = ["January","February","March","April","May","June",
                     "July","August","September","October","November","December"];
const DAY_NAMES   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

let bookingCar         = "";
let bookingDate        = "";
let bookingTime        = "";   // start time "09:00"
let bookingTimeDisplay = "";   // "09:00 – 10:00"
let calYear, calMonth;

// ── Open / Close ──────────────────────────────────────────────────────
function openBooking(carName) {
  bookingCar         = carName;
  bookingDate        = "";
  bookingTime        = "";
  bookingTimeDisplay = "";

  document.getElementById("bCarName").textContent = carName;

  const now = new Date();
  calYear  = now.getFullYear();
  calMonth = now.getMonth();

  renderCalendar();
  bookingGoTo(1);

  document.getElementById("bookingProgress").style.display = "";
  document.getElementById("bookingOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeBooking() {
  document.getElementById("bookingOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

// ── Step navigation ───────────────────────────────────────────────────
function bookingGoTo(step) {
  for (let i = 1; i <= 4; i++) {
    const panel = document.getElementById("bPanel" + i);
    if (panel) panel.classList.toggle("hidden", i !== step);
  }

  // Update progress indicators (only steps 1-3)
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById("bpStep" + i);
    if (!el) continue;
    el.classList.remove("active", "done");
    if (i < step)      el.classList.add("done");
    else if (i === step) el.classList.add("active");
  }

  // Hide progress bar on success panel
  const progress = document.getElementById("bookingProgress");
  if (progress) progress.style.display = step === 4 ? "none" : "";

  // Animate success checkmark
  if (step === 4) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById("bPanel4").classList.add("animate");
      });
    });
  }
}

// ── Calendar ──────────────────────────────────────────────────────────
function renderCalendar() {
  document.getElementById("calMonthYear").textContent =
    MONTH_NAMES[calMonth] + " " + calYear;

  const now     = new Date();
  const today   = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 45);

  // Monday-first offset
  const firstDow    = new Date(calYear, calMonth, 1).getDay();
  const startOffset = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  let html = "";

  for (let i = 0; i < startOffset; i++) html += `<span class="cal-day empty"></span>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(calYear, calMonth, d);
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isPast  = date < today;
    const isFar   = date > maxDate;
    const isOff   = isPast || isFar;
    const isSel   = dateStr === bookingDate;
    const isTodayFlag = date.getTime() === today.getTime();

    const isSun = date.getDay() === 0;
    let cls = "cal-day";
    if (isOff || isSun) cls += " disabled";
    else if (isSel)     cls += " selected";
    else if (isTodayFlag) cls += " today";

    html += `<span class="${cls}" ${(isOff || isSun) ? "" : `onclick="selectDate('${dateStr}')"`}>${d}</span>`;
  }

  document.getElementById("calDays").innerHTML = html;

  // Disable prev button when already at current month
  document.getElementById("calPrev").disabled =
    calYear === now.getFullYear() && calMonth === now.getMonth();
}

function calNav(dir) {
  calMonth += dir;
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  if (calMonth > 11) { calMonth = 0;  calYear++; }
  renderCalendar();
}

async function selectDate(dateStr) {
  bookingDate = dateStr;
  renderCalendar();

  const d = new Date(dateStr + 'T12:00:00');
  document.getElementById("bDateLabel").textContent =
    DAY_NAMES[d.getDay()] + ", " + MONTH_NAMES[d.getMonth()] + " " + d.getDate();

  bookingGoTo(2);

  // Show loading
  document.getElementById("timeSlots").innerHTML =
    `<div class="slots-loading"><span></span><span></span><span></span></div>`;

  try {
    const res   = await fetch(`/api/slots?date=${dateStr}&car=${encodeURIComponent(bookingCar)}`);
    const slots = await res.json();
    renderTimeSlots(slots);
  } catch {
    document.getElementById("timeSlots").innerHTML =
      `<p class="slots-empty">Could not load slots. Please try again.</p>`;
  }
}

function renderTimeSlots(slots) {
  if (!slots || !slots.length) {
    document.getElementById("timeSlots").innerHTML =
      `<p class="slots-empty">No available time slots for this date.</p>`;
    return;
  }

  const html = slots.map(({ start, end, available }) => `
    <button class="time-slot ${available ? "" : "taken"}"
            data-start="${start}"
            ${available ? `onclick="selectTime('${start}','${end}')"` : "disabled"}>
      <span class="slot-start">${start}</span>
      <span class="slot-dash">–</span>
      <span class="slot-end">${end}</span>
      ${!available ? `<span class="slot-taken">booked</span>` : ""}
    </button>
  `).join("");

  document.getElementById("timeSlots").innerHTML = html;
}

function selectTime(start, end) {
  bookingTime        = start;
  bookingTimeDisplay = `${start} – ${end}`;

  // Highlight selected slot visually
  document.querySelectorAll(".time-slot").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.start === start);
  });

  // Build summary
  const d = new Date(bookingDate + 'T12:00:00');
  const dateLabel = DAY_NAMES[d.getDay()] + ", " + MONTH_NAMES[d.getMonth()] +
                    " " + d.getDate() + ", " + d.getFullYear();

  document.getElementById("bookingSummary").innerHTML = `
    <div class="bs-row"><span>Vehicle</span><strong>${bookingCar}</strong></div>
    <div class="bs-row"><span>Date</span><strong>${dateLabel}</strong></div>
    <div class="bs-row"><span>Time</span><strong class="bs-time">${bookingTimeDisplay}</strong></div>
  `;

  // Small delay so user sees the selection before transitioning
  setTimeout(() => bookingGoTo(3), 160);
}

// ── Form submission ───────────────────────────────────────────────────
async function submitBooking(event) {
  event.preventDefault();

  const name  = document.getElementById("bfName").value.trim();
  const email = document.getElementById("bfEmail").value.trim();
  const phone = document.getElementById("bfPhone").value.trim();

  // Validate
  let valid = true;

  const nameField = document.getElementById("bfFieldName");
  const nameErr   = document.getElementById("bfNameErr");
  if (name.length < 2) {
    nameField.classList.add("has-error");
    nameErr.textContent = "Please enter your full name.";
    valid = false;
  } else {
    nameField.classList.remove("has-error");
    nameErr.textContent = "";
  }

  const emailField = document.getElementById("bfFieldEmail");
  const emailErr   = document.getElementById("bfEmailErr");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailField.classList.add("has-error");
    emailErr.textContent = "Please enter a valid email address.";
    valid = false;
  } else {
    emailField.classList.remove("has-error");
    emailErr.textContent = "";
  }

  const recaptchaToken = grecaptcha.getResponse();
  const recaptchaErr   = document.getElementById("bfRecaptchaErr");
  if (!recaptchaToken) {
    recaptchaErr.textContent = "Please complete the reCAPTCHA.";
    valid = false;
  } else {
    recaptchaErr.textContent = "";
  }

  if (!valid) return;

  const btn = document.getElementById("bfSubmit");
  btn.classList.add("loading");
  btn.disabled = true;

  try {
    const res  = await fetch("/api/book", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, phone, car: bookingCar, date: bookingDate, time: bookingTime, timeDisplay: bookingTimeDisplay, recaptchaToken })
    });
    const data = await res.json();

    if (res.ok) {
      const d = new Date(bookingDate + 'T12:00:00');
      const dateLabel = DAY_NAMES[d.getDay()] + ", " + MONTH_NAMES[d.getMonth()] +
                        " " + d.getDate() + ", " + d.getFullYear();
      document.getElementById("bSuccessMsg").textContent =
        `Your test drive for the ${bookingCar} is set for ${dateLabel}, ${bookingTimeDisplay}.`;
      document.getElementById("bSuccessEmail").textContent = email;
      bookingGoTo(4);
    } else {
      showToast(data.error || "Booking failed. Please try again.");
      btn.classList.remove("loading");
      btn.disabled = false;
      grecaptcha.reset();
    }
  } catch {
    showToast("Connection error. Please try again.");
    btn.classList.remove("loading");
    btn.disabled = false;
    grecaptcha.reset();
  }
}

// Escape key closes booking modal
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && document.getElementById("bookingOverlay").classList.contains("open")) {
    closeBooking();
  }
});
