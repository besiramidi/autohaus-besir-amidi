// ===== CAR DATA =====
const cars = [
  {
    id: 1,
    name: "BMW X5 xDrive40i",
    make: "BMW",
    type: "SUV",
    year: 2022,
    price: 62500,
    oldPrice: 68000,
    mileage: "18,400 mi",
    fuel: "Gasoline",
    transmission: "Automatic",
    engine: "3.0L Turbo I6",
    color: "Alpine White",
    seats: 5,
    status: "certified",
    emoji: "🚙",
    bg: "#e8f4fd",
    description: "Immaculate BMW X5 in Alpine White. Loaded with premium features including panoramic roof, Harman Kardon sound, heated/cooled seats, and the latest BMW Live Cockpit Professional. Full service history available."
  },
  {
    id: 2,
    name: "Tesla Model 3 Long Range",
    make: "Tesla",
    type: "Electric",
    year: 2023,
    price: 44900,
    oldPrice: null,
    mileage: "9,200 mi",
    fuel: "Electric",
    transmission: "Single-speed",
    engine: "Dual Motor AWD",
    color: "Midnight Silver",
    seats: 5,
    status: "new",
    emoji: "⚡",
    bg: "#e8f5e9",
    description: "Nearly new Tesla Model 3 Long Range AWD. 358-mile EPA range, autopilot included, premium interior, glass roof. Full self-driving capability hardware. 8-year battery warranty remaining."
  },
  {
    id: 3,
    name: "Audi A4 quattro",
    make: "Audi",
    type: "Sedan",
    year: 2021,
    price: 36800,
    oldPrice: 41000,
    mileage: "27,100 mi",
    fuel: "Gasoline",
    transmission: "S tronic 7-spd",
    engine: "2.0L TFSI",
    color: "Navarra Blue",
    seats: 5,
    status: "certified",
    emoji: "🏎️",
    bg: "#e8eaf6",
    description: "Stunning Audi A4 quattro in rare Navarra Blue. Features Virtual Cockpit, Bang & Olufsen sound system, adaptive cruise control, and quattro AWD. One owner, no accidents, fully serviced."
  },
  {
    id: 4,
    name: "Mercedes GLC 300",
    make: "Mercedes",
    type: "SUV",
    year: 2022,
    price: 58000,
    oldPrice: 63500,
    mileage: "14,700 mi",
    fuel: "Gasoline",
    transmission: "9G-Tronic",
    engine: "2.0L Turbo",
    color: "Obsidian Black",
    seats: 5,
    status: "certified",
    emoji: "🖤",
    bg: "#f3e5f5",
    description: "Pristine Mercedes GLC 300 4MATIC in Obsidian Black. AMG Line exterior, MBUX infotainment, 360° camera, Burmester sound, and heated front seats. Still under factory warranty."
  },
  {
    id: 5,
    name: "Toyota Tundra TRD Pro",
    make: "Toyota",
    type: "Truck",
    year: 2022,
    price: 57200,
    oldPrice: null,
    mileage: "22,900 mi",
    fuel: "Hybrid",
    transmission: "Automatic 10-spd",
    engine: "3.5L Twin Turbo V6",
    color: "Army Green",
    seats: 5,
    status: "used",
    emoji: "🛻",
    bg: "#e8f5e9",
    description: "Powerful Toyota Tundra TRD Pro with i-FORCE MAX hybrid powertrain producing 437 HP. Features TRD FOX shocks, skid plates, Multi-terrain monitor, and towing capacity of 11,450 lbs."
  },
  {
    id: 6,
    name: "BMW M4 Competition",
    make: "BMW",
    type: "Coupe",
    year: 2021,
    price: 79900,
    oldPrice: 88000,
    mileage: "8,600 mi",
    fuel: "Gasoline",
    transmission: "M Steptronic 8-spd",
    engine: "3.0L M TwinPower",
    color: "Isle of Man Green",
    seats: 4,
    status: "certified",
    emoji: "🟢",
    bg: "#f1f8e9",
    description: "Rare BMW M4 Competition in stunning Isle of Man Green. xDrive, carbon fibre roof, M carbon bucket seats, M Drive Professional, and track mode. Numbers matching, never tracked."
  },
  {
    id: 7,
    name: "Mercedes E350 AMG",
    make: "Mercedes",
    type: "Sedan",
    year: 2020,
    price: 39500,
    oldPrice: 44000,
    mileage: "35,200 mi",
    fuel: "Gasoline",
    transmission: "9G-Tronic",
    engine: "2.0L EQ Boost",
    color: "Selenite Grey",
    seats: 5,
    status: "used",
    emoji: "🌫️",
    bg: "#eceff1",
    description: "Elegant Mercedes E350 AMG Line in Selenite Grey metallic. Features widescreen cockpit, night package, panoramic roof, and 48V EQ Boost mild hybrid system. Impeccably maintained."
  },
  {
    id: 8,
    name: "Ford Mustang GT500",
    make: "Ford",
    type: "Coupe",
    year: 2022,
    price: 81000,
    oldPrice: null,
    mileage: "4,300 mi",
    fuel: "Gasoline",
    transmission: "Tremec 7-spd",
    engine: "5.2L Supercharged V8",
    color: "Grabber Blue",
    seats: 4,
    status: "new",
    emoji: "💙",
    bg: "#e3f2fd",
    description: "Iconic Ford Mustang Shelby GT500 in Grabber Blue. 760 HP supercharged V8, Carbon Fiber Track Pack, Brembo brakes, active exhaust, and MagneRide suspension. The most powerful street-legal Mustang ever."
  },
  {
    id: 9,
    name: "Toyota RAV4 Hybrid",
    make: "Toyota",
    type: "SUV",
    year: 2023,
    price: 37400,
    oldPrice: null,
    mileage: "5,100 mi",
    fuel: "Hybrid",
    transmission: "e-CVT",
    engine: "2.5L Hybrid AWD",
    color: "Magnetic Gray",
    seats: 5,
    status: "new",
    emoji: "🔋",
    bg: "#f9fbe7",
    description: "Practical and efficient Toyota RAV4 Hybrid XSE. 219 combined HP, AWD, 8\" multimedia display, Toyota Safety Sense 2.0, wireless charging, and 37 MPG city. Perfect family SUV."
  }
];

// ===== STATE =====
let activeFilter = "all";
let favorites = new Set();
let filteredCars = [...cars];

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  renderCars(cars);
  setupFilterButtons();
  setupNavbar();
  setupHamburger();
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
      <div class="car-img" style="background:${car.bg}">
        <span>${car.emoji}</span>
        <span class="car-badge ${car.status}">${car.status === "new" ? "New" : car.status === "certified" ? "Certified" : "Used"}</span>
        <button class="car-fav ${favorites.has(car.id) ? "active" : ""}"
          onclick="toggleFav(event, ${car.id})"
          aria-label="Save to favourites">
          ${favorites.has(car.id) ? "❤️" : "🤍"}
        </button>
      </div>
      <div class="car-info">
        <h3>${car.year} ${car.name}</h3>
        <div class="car-meta">
          <span>📅 ${car.year}</span>
          <span>🛣️ ${car.mileage}</span>
          <span>⛽ ${car.fuel}</span>
          <span>⚙️ ${car.transmission.split(" ")[0]}</span>
        </div>
        <div class="car-price-row">
          <div>
            <span class="car-price">$${car.price.toLocaleString()}</span>
            ${car.oldPrice ? `<span class="car-old-price">$${car.oldPrice.toLocaleString()}</span>` : ""}
          </div>
          <button class="btn-details" onclick="event.stopPropagation(); openModal(${car.id})">Details →</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ===== FILTER BUTTONS =====
function setupFilterButtons() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      applyCurrentFilter();
    });
  });
}

function applyCurrentFilter() {
  const list = activeFilter === "all"
    ? cars
    : cars.filter(c => c.type === activeFilter);
  filteredCars = list;
  renderCars(list);
}

// ===== HERO SEARCH =====
function applyFilters() {
  const make = document.getElementById("filterMake").value;
  const type = document.getElementById("filterType").value;
  const price = document.getElementById("filterPrice").value;

  let result = cars.filter(car => {
    if (make && car.make !== make) return false;
    if (type && car.type !== type) return false;
    if (price && car.price > parseInt(price)) return false;
    return true;
  });

  // Scroll to inventory
  document.getElementById("inventory").scrollIntoView({ behavior: "smooth" });

  // Reset filter bar
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  document.querySelector(".filter-btn[data-filter='all']").classList.add("active");
  activeFilter = "all";

  setTimeout(() => renderCars(result), 500);
}

function resetFilters() {
  document.getElementById("filterMake").value = "";
  document.getElementById("filterType").value = "";
  document.getElementById("filterPrice").value = "";
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  document.querySelector(".filter-btn[data-filter='all']").classList.add("active");
  activeFilter = "all";
  renderCars(cars);
}

// ===== MODAL =====
function openModal(id) {
  const car = cars.find(c => c.id === id);
  if (!car) return;

  const savings = car.oldPrice ? car.oldPrice - car.price : null;

  document.getElementById("modalContent").innerHTML = `
    <div class="modal-img" style="background:${car.bg}">
      <span>${car.emoji}</span>
    </div>
    <div class="modal-body">
      <h2>${car.year} ${car.name}</h2>
      <div class="modal-price">
        $${car.price.toLocaleString()}
        ${car.oldPrice ? `<span style="font-size:1rem;color:#aaa;text-decoration:line-through;margin-left:10px;">$${car.oldPrice.toLocaleString()}</span>` : ""}
        ${savings ? `<span style="font-size:0.9rem;background:#e8f5e9;color:#2d6a4f;padding:4px 10px;border-radius:20px;margin-left:10px;font-weight:700;">Save $${savings.toLocaleString()}</span>` : ""}
      </div>
      <div class="modal-specs">
        <div class="spec-item"><div class="spec-label">Year</div><div class="spec-value">${car.year}</div></div>
        <div class="spec-item"><div class="spec-label">Mileage</div><div class="spec-value">${car.mileage}</div></div>
        <div class="spec-item"><div class="spec-label">Engine</div><div class="spec-value">${car.engine}</div></div>
        <div class="spec-item"><div class="spec-label">Transmission</div><div class="spec-value">${car.transmission}</div></div>
        <div class="spec-item"><div class="spec-label">Fuel Type</div><div class="spec-value">${car.fuel}</div></div>
        <div class="spec-item"><div class="spec-label">Color</div><div class="spec-value">${car.color}</div></div>
        <div class="spec-item"><div class="spec-label">Seats</div><div class="spec-value">${car.seats} seats</div></div>
        <div class="spec-item"><div class="spec-label">Status</div><div class="spec-value" style="text-transform:capitalize">${car.status}</div></div>
      </div>
      <p class="modal-desc">${car.description}</p>
      <div class="modal-actions">
        <button class="btn-primary" onclick="showToast('📞 We will call you shortly to arrange a test drive!')">Book Test Drive</button>
        <button class="btn-outline" onclick="showToast('💰 A financing quote has been sent to your email!')">Get Financing</button>
      </div>
    </div>
  `;

  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

// Close modal on Escape key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

// ===== FAVOURITES =====
function toggleFav(event, id) {
  event.stopPropagation();
  if (favorites.has(id)) {
    favorites.delete(id);
    showToast("💔 Removed from saved cars");
  } else {
    favorites.add(id);
    showToast("❤️ Saved to your favourites!");
  }
  // Re-render the current filtered list
  applyCurrentFilter();
}

// ===== CONTACT FORM =====
function handleFormSubmit(event) {
  event.preventDefault();
  showToast("✅ Message sent! We'll get back to you within 1 hour.");
  event.target.reset();
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

// ===== NAVBAR SCROLL =====
function setupNavbar() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  });
}

// ===== HAMBURGER =====
function setupHamburger() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
  // Close on nav link click
  navLinks.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}
