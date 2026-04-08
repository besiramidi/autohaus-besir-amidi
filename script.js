// ===== MAKES & MODELS MAP =====
const makesModels = {
  "Mercedes Benz": ["E Klasse"],
  "Audi":          ["A4", "A6"],
  "BMW":           ["5er"],
  "Volkswagen":    ["Golf 6"]
};

// ===== CAR DATA =====
const cars = [
  {
    id: 1,
    name: "Mercedes-Benz E 220 d",
    make: "Mercedes Benz",
    model: "E Klasse",
    year: 2017,
    km: "156.000 km",
    power: "143 kW (194 PS)",
    fuel: "Diesel",
    transmission: "Automatik",
    engine: "1.950 cm³ · 4 Zyl.",
    series: "W213",
    line: "E 220 d",
    color: "Obsidianschwarz Metallic",
    interior: "Vollleder, Braun",
    seats: 5,
    doors: "4/5",
    eu: "Euro 6",
    consumption: "3,9 l/100km",
    co2: "102 g/km",
    weight: "1.680 kg",
    towing: "2.100 kg",
    hu: "Neu",
    owners: 2,
    condition: "Gebrauchtfahrzeug, Unfallfrei",
    status: "used",
    thumb: "images/mercedes/e-klasse/09550ef5-712b-461e-9afc-c4f33ae21846.avif",
    images: [
      "images/mercedes/e-klasse/09550ef5-712b-461e-9afc-c4f33ae21846.avif",
      "images/mercedes/e-klasse/1216e9a1-5a00-4bc8-b7ac-6e67a76bdda3 (1).avif",
      "images/mercedes/e-klasse/25c1357b-21b1-4d7a-9c48-fc52ae651969.avif",
      "images/mercedes/e-klasse/55244e1a-23cb-41d3-ac3e-c00b9717014d.avif",
      "images/mercedes/e-klasse/70281457-f102-477b-9c0b-d14191f44bd1.avif",
      "images/mercedes/e-klasse/835970b5-4516-4ec3-a414-1ea9ab8a9ad3.avif",
      "images/mercedes/e-klasse/88b6dd42-eecd-4815-bc6a-378cce6e7f71.avif",
      "images/mercedes/e-klasse/a2f45885-e5b9-414c-9c8b-e181276db127.avif",
      "images/mercedes/e-klasse/b3e1a558-d7f7-4135-866a-9512e253499b.avif",
      "images/mercedes/e-klasse/b4d5c7b8-f22d-4916-aa7d-9013a126d5ad (1).avif",
      "images/mercedes/e-klasse/b6897644-91cd-42a2-ab93-dea2b8eba429.avif",
      "images/mercedes/e-klasse/bb45186c-8b38-4f34-82fb-f69b5cf0d974.avif",
      "images/mercedes/e-klasse/cd6c2264-b133-4a25-95d3-0836b299a891.avif",
      "images/mercedes/e-klasse/fcacad04-d622-40b7-9aee-d150d1c19604.avif",
      "images/mercedes/e-klasse/fe639c2c-5ea4-4077-813f-44d92b60f05b.avif",
      "images/mercedes/e-klasse/fe98da4c-3ccd-42d5-a41b-e1bbd7ac2b2e (1).avif"
    ],
    features: [
      "Head-Up Display","Navigationssystem","Apple CarPlay","Schiebedach",
      "Luftfederung","Sitzheizung","Sitzbelüftung","Elektr. Sitzeinstellung",
      "Klimaautomatik","Ambiente-Beleuchtung","Xenonscheinwerfer",
      "Einparkhilfe vorne & hinten","Kamera","Spurhalteassistent",
      "Notbremsassistent","Verkehrszeichenerkennung","Müdigkeitswarner",
      "Bluetooth","Lederlenkrad","Leichtmetallfelgen","Scheckheftgepflegt"
    ]
  },
  {
    id: 2,
    name: "Audi A4",
    make: "Audi",
    model: "A4",
    year: null,
    km: "Auf Anfrage",
    power: "Auf Anfrage",
    fuel: "Benzin",
    transmission: "Automatik",
    engine: "—",
    series: "—",
    line: "A4",
    color: "—",
    interior: "—",
    seats: 5,
    doors: "4/5",
    eu: "—",
    consumption: "—",
    co2: "—",
    weight: "—",
    towing: "—",
    hu: "—",
    owners: null,
    condition: "Gebrauchtfahrzeug",
    status: "used",
    thumb: "images/audi/a4/2f111515-04ec-4104-aa01-64b21e7d53bd.avif",
    images: [
      "images/audi/a4/2f111515-04ec-4104-aa01-64b21e7d53bd.avif",
      "images/audi/a4/2f9f9a71-8d89-43cd-9615-91b19f8c2fde.avif",
      "images/audi/a4/43e75fca-f039-4cf1-925b-1fc41569ba59.avif",
      "images/audi/a4/58cf1e28-7523-41bd-9f8b-898dc6a499dd.avif",
      "images/audi/a4/68757ee8-b399-482b-b4c2-376311b53e5b.avif",
      "images/audi/a4/808aa5df-c038-4d70-a8f8-665522886f29.avif",
      "images/audi/a4/8d348402-5b6a-40d6-91b8-8f28dbb56449.avif",
      "images/audi/a4/90739111-8553-4c8b-ba53-fd62f9813e55.avif",
      "images/audi/a4/ac47deaf-5a5e-4ad8-82ed-d2182c3eb149.avif",
      "images/audi/a4/aed8f8ff-ae0a-49a0-a81f-6325fdbf90d2.avif",
      "images/audi/a4/b6606b20-6876-4152-af29-437aafe2b08e.avif",
      "images/audi/a4/be389bdd-3b02-430b-be14-4b7f66f1da4b.avif",
      "images/audi/a4/ea484003-d466-4412-9f87-bd1ce66d067f.avif"
    ],
    features: ["Weitere Details auf Anfrage"]
  },
  {
    id: 3,
    name: "Audi A6 sport 50 TFSI e quattro",
    make: "Audi",
    model: "A6",
    year: 2022,
    km: "54.408 km",
    power: "220 kW (299 PS)",
    fuel: "Hybrid",
    transmission: "S tronic (Automatik)",
    engine: "1.984 cm³ · 4 Zyl. + Elektro",
    series: "F2X",
    line: "sport 50 TFSI e quattro",
    color: "Mythosschwarz Metallic",
    interior: "Teilleder, Schwarz",
    seats: 5,
    doors: "4/5",
    eu: "Euro 6d",
    consumption: "Plug-in-Hybrid",
    co2: "—",
    battery: "14 kWh · Typ 2",
    weight: "2.085 kg",
    towing: "2.000 kg",
    hu: "Neu",
    owners: 1,
    condition: "Gebrauchtfahrzeug",
    available: "Ab 07.04.2026",
    status: "certified",
    thumb: "images/audi/a6/0c2c868a-e5bd-4cc6-b093-c7adccb2cd3f.avif",
    images: [
      "images/audi/a6/0c2c868a-e5bd-4cc6-b093-c7adccb2cd3f.avif",
      "images/audi/a6/48a6591c-69b9-4515-acbb-cfef3fa9424e.avif",
      "images/audi/a6/5bcc58fb-7344-4285-8631-11f890ff6d13.avif",
      "images/audi/a6/65836954-7d3b-42ec-be70-96298024d6b3.avif",
      "images/audi/a6/6cd6a3b5-bf5d-4310-b6cd-376a31e3625a.avif",
      "images/audi/a6/8448b1ba-77ed-4854-9901-7172342cad37.avif",
      "images/audi/a6/84b150fd-56f3-43d9-8c00-94e80f31fb4e.avif",
      "images/audi/a6/99f37dba-e954-4a8c-bbc5-8b795b0d3440.avif",
      "images/audi/a6/b2f7911f-a7a5-480f-b0f0-a4e2a91ac5a5.avif",
      "images/audi/a6/ce11989c-51f6-4b45-a0c0-b3da835352a9.avif",
      "images/audi/a6/d3165887-cf17-4687-a44c-e74402fa2249.avif",
      "images/audi/a6/d5e326b6-1c22-4443-a65a-5447add602b1.avif",
      "images/audi/a6/dd895b7e-6283-4f12-a2da-b2ef3e725e71.avif",
      "images/audi/a6/fef6449e-57c1-4e49-a147-3c5f63686748.avif"
    ],
    features: [
      "Head-Up Display","Navigationssystem","4-Zonen-Klimaautomatik",
      "Allradantrieb (quattro)","LED-Scheinwerfer","Volldigitales Kombiinstrument",
      "Nachtsicht-Assistent","Totwinkel-Assistent","Fernlichtassistent",
      "Spurhalteassistent","Notbremsassistent","Verkehrszeichenerkennung",
      "Sitzheizung","Soundsystem","Sportpaket","Sportsitze","Schaltwippen",
      "Sportfahrwerk","Elektr. Heckklappe","Bluetooth","Scheckheftgepflegt",
      "Batteriezertifikat","Sommerreifen"
    ]
  },
  {
    id: 4,
    name: "BMW M5 (F10)",
    make: "BMW",
    model: "5er",
    year: 2013,
    km: "96.875 km",
    power: "330 kW (449 PS)",
    fuel: "Benzin",
    transmission: "Automatik",
    engine: "4.395 cm³ · V8",
    series: "F10",
    line: "M5",
    color: "Black Sapphire Metallic",
    interior: "Vollleder, Schwarz",
    seats: 5,
    doors: "4/5",
    eu: "Euro 4 (Grün)",
    consumption: "—",
    co2: "—",
    weight: "—",
    towing: "—",
    hu: "10/2027",
    owners: 2,
    condition: "Gebrauchtfahrzeug",
    status: "used",
    thumb: "images/bmw/5er/16fce453-48ee-49e9-a76f-48bd6fb73e78.avif",
    images: [
      "images/bmw/5er/16fce453-48ee-49e9-a76f-48bd6fb73e78.avif",
      "images/bmw/5er/1d13184a-c1ba-482c-bdfc-b703016c8a9f.avif",
      "images/bmw/5er/1e9105ac-aebd-4090-b458-f616a15f4db1.avif",
      "images/bmw/5er/262e8327-829e-45b4-b824-6892f34f1465.avif",
      "images/bmw/5er/2c325090-3e05-45b5-8d29-226a4849b18c.avif",
      "images/bmw/5er/2f40df03-cd5f-41a8-bb33-2361d681c724.avif",
      "images/bmw/5er/5217f285-26d7-4f22-a39c-9fc43e59b2df.avif",
      "images/bmw/5er/7944ec4e-747d-45b0-877e-e7ce02b050fe.avif",
      "images/bmw/5er/79f44a01-8b23-4f71-acbb-15a1e63c2dbe.avif",
      "images/bmw/5er/b357f7f5-533a-47fa-8296-f34862b748ca.avif",
      "images/bmw/5er/bc1e5853-312f-434d-9c22-7977c067abaa.avif",
      "images/bmw/5er/d88545f8-b816-4543-9ebc-d3e2ce8c03ec.avif",
      "images/bmw/5er/da462cb5-9412-411b-9885-c4e5e3bf3994.avif",
      "images/bmw/5er/e8a2c691-7f25-4083-8c81-db8a9c77e001.avif",
      "images/bmw/5er/ece5df12-189d-4085-ab56-04c4f5eb2675.avif",
      "images/bmw/5er/fce610f6-2a56-4613-8a48-ae4ae8495953.avif",
      "images/bmw/5er/fe4aeebc-1499-4c7f-b167-c8c3e7e63122.avif"
    ],
    features: [
      "Head-Up Display","Navigationssystem","Allradantrieb","LED-Scheinwerfer",
      "Abgedunkelte Scheiben","Schiebedach","Totwinkel-Assistent",
      "Elektr. Sitzeinstellung mit Memory","Sitzheizung","Sitzheizung hinten",
      "Beheizbares Lenkrad","Soundsystem","Sportpaket","Sportsitze","Schaltwippen",
      "Alarmanlage","Abstandswarner","Müdigkeitswarner","Fernlichtassistent",
      "Schlüssellose Zentralverriegelung","Volldigitales Kombiinstrument",
      "Bluetooth","Scheckheftgepflegt","Nichtraucher-Fahrzeug","Sommerreifen"
    ]
  },
  {
    id: 5,
    name: "Volkswagen Golf 6 Variant",
    make: "Volkswagen",
    model: "Golf 6",
    year: 2013,
    km: "317.348 km",
    power: "77 kW (105 PS)",
    fuel: "Benzin",
    transmission: "Schaltgetriebe",
    engine: "—",
    series: "Golf 6",
    line: "Golf 6 Variant",
    color: "Grey",
    interior: "—",
    seats: 5,
    doors: "5",
    eu: "Euro 4 (Grün)",
    consumption: "—",
    co2: "—",
    weight: "—",
    towing: "—",
    hu: "10/2026",
    owners: null,
    condition: "Gebrauchtfahrzeug",
    status: "used",
    thumb: "images/vw/golf6/186ab04e-013a-438f-a4e6-3cec0a424fc7.avif",
    images: [
      "images/vw/golf6/186ab04e-013a-438f-a4e6-3cec0a424fc7.avif",
      "images/vw/golf6/53d47201-4319-435f-81f9-e85730e5351c.avif",
      "images/vw/golf6/8bf913b1-4de4-495d-b6e8-cc3ddc199d9a.avif",
      "images/vw/golf6/9bcaa432-b685-4051-93d5-a7e2102a72bd.avif",
      "images/vw/golf6/a09b75c7-8eea-47e7-aa74-3aee5d50b598.avif",
      "images/vw/golf6/a40476f4-9dd0-4032-aa24-7cdd69896eef.avif",
      "images/vw/golf6/cda97569-15bd-4c38-98ec-d4ae32d3be57.avif",
      "images/vw/golf6/d0fb6970-d1ca-43c6-8cec-4caa0cb83b9e.avif",
      "images/vw/golf6/d678ec2a-e2c3-4790-962a-172c8467531f.avif",
      "images/vw/golf6/fc9a5821-b7cb-4bbb-8132-7a3a220092c0.avif"
    ],
    features: [
      "ABS","Anhängerkupplung fest","Bluetooth",
      "Freisprecheinrichtung","Tempomat","Tuner/Radio"
    ]
  }
];

// ===== STATE =====
let activeMake = "";
let activeModel = "";
let currentGalleryIndex = 0;
let currentGalleryCar = null;

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  renderCars(cars);
  setupMakeFilterButtons();
  setupNavbar();
  setupHamburger();
  updateModelFilter();
  setupContactForm();
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
    const res   = await fetch(`/api/slots?date=${dateStr}`);
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

  if (!valid) return;

  const btn = document.getElementById("bfSubmit");
  btn.classList.add("loading");
  btn.disabled = true;

  try {
    const res  = await fetch("/api/book", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, phone, car: bookingCar, date: bookingDate, time: bookingTime, timeDisplay: bookingTimeDisplay })
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
    }
  } catch {
    showToast("Connection error. Please try again.");
    btn.classList.remove("loading");
    btn.disabled = false;
  }
}

// Escape key closes booking modal
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && document.getElementById("bookingOverlay").classList.contains("open")) {
    closeBooking();
  }
});
