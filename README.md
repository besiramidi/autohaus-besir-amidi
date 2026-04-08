# 🚗 AutoHaus — Premium Car Dealership Website

A modern, professional car dealership website showcasing real pre-owned and certified vehicles. Browse quality cars by brand, view full specifications, and book test drives directly online.

## ✨ Features

- **Real Car Listings** — 5 authentic vehicles with complete specs and detailed photo galleries
- **Brand Filters** — Mercedes Benz, Audi, BMW, Volkswagen with cascading model selection
- **Photo Gallery** — 10–17 high-quality images per car with fullscreen lightbox viewer
- **Vehicle Details** — Complete specifications: mileage, power, engine, fuel type, transmission, features
- **Contact Integration** — Inquiry form with vehicle-specific messaging
- **Mobile Responsive** — Optimized for desktop, tablet, and mobile devices
- **Professional Design** — Premium aesthetic with dark luxury theme

## 🚙 Current Inventory

| Brand | Model | Year | Mileage | Power | Fuel |
|-------|-------|------|---------|-------|------|
| Mercedes Benz | E 220 d (W213) | 2017 | 156,000 km | 194 PS | Diesel |
| Audi | A4 | — | — | — | — |
| Audi | A6 sport 50 TFSI e quattro | 2022 | 54,408 km | 299 PS | PHEV |
| BMW | M5 (F10) | 2013 | 96,875 km | 449 PS | Petrol |
| Volkswagen | Golf 6 Variant | 2013 | 317,348 km | 105 PS | Petrol |

All vehicles are **accident-free (Unfallfrei)** with complete service records.

## 🎨 Design

- **Color Scheme**: Dark luxury theme with charcoal/navy primary and subtle red accents
- **Typography**: Professional sans-serif (Inter font family)
- **Layout**: Clean grid system, premium spacing, minimal clutter
- **Interactions**: Smooth transitions, intuitive navigation, fullscreen image lightbox

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Modern styling with CSS Grid, Flexbox, backdrop filters
- **JavaScript** — Dynamic car listings, filters, modals, lightbox gallery
- **Images** — Real car photos in AVIF format (~70 images across all vehicles)

## 📁 Project Structure

```
autohaus-besir-amidi/
├── index.html              # Main website (fully responsive)
├── style.css               # All styling (no external frameworks)
├── script.js               # Car data & interactivity
├── images/
│   ├── hero-bg.png         # Hero background image
│   ├── mercedes/e-klasse/  # 16 car photos
│   ├── audi/a4/            # 13 car photos
│   ├── audi/a6/            # 14 car photos
│   ├── bmw/5er/            # 17 car photos
│   └── vw/golf6/           # 10 car photos
├── CHANGELOG.md            # Feature update history
└── README.md               # This file
```

## 🚀 Getting Started

### View Locally
Simply open `index.html` in any modern web browser:
```bash
# Option 1: Double-click index.html
# Option 2: Use a local server
npx http-server
# or
python -m http.server 8000
```

Then visit: `http://localhost:8000`

## 📸 Key Features Explained

### Make & Model Filters
- Click any brand (Mercedes Benz, Audi, BMW, Volkswagen)
- Model buttons update automatically
- All cars of that brand display

### Car Detail Modal
- Click any car card to view full details
- See complete specifications, features list, and pricing note
- Browse all photos with thumbnails at the bottom

### Fullscreen Lightbox
- Click the main photo in the detail modal
- View images fullscreen with dark overlay
- Navigate with left/right arrows or keyboard arrows
- Close with X button or Escape key

### Contact Form
- Select the specific car you're interested in
- Submit inquiry with your details
- Built-in dropdown populated with all available models

## 📝 Specs Example: Mercedes E 220 d

- **Year**: 2017
- **Mileage**: 156,000 km
- **Engine**: 1.950 cm³ · 4-cylinder
- **Power**: 143 kW (194 PS)
- **Transmission**: Automatic
- **Fuel**: Diesel
- **Color**: Obsidian Black Metallic
- **Interior**: Full leather, Brown
- **Condition**: Unfallfrei (accident-free)
- **Features**: 20+ including Head-Up Display, Navigation, Schiebedach, Sitzheizung, etc.

## 🔗 Links

- **GitHub Repo**: [besiramidi/autohaus-besir-amidi](https://github.com/besiramidi/autohaus-besir-amidi)
- **Main Branch**: `main`
- **Live Site**: Available via GitHub Pages (Settings → Pages → Deploy from main)

## 📜 Updates

See [CHANGELOG.md](CHANGELOG.md) for full feature history and recent updates.

---

**Status**: ✅ Live | **Last Major Update**: Fullscreen lightbox gallery | **Design**: Premium dark luxury theme

© 2026 AutoHaus — Besir Amidi. All rights reserved.
