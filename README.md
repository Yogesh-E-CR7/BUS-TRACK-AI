# 🚌 BusTrack AI — Cross-Platform & PWA Smart Transportation Platform

> **“Know Your Bus. Know Your Time. Travel Smarter.”**

**BusTrack AI** is a complete, responsive, cross-platform **Progressive Web App (PWA)** and AI-powered Smart Public Transportation web application. It connects Passengers, Drivers, Fleet Administrators, and the Transport Minister in one unified, presentation-ready ecosystem.

---

## 📱 Cross-Platform & Device Support

The platform is designed with a single responsive codebase using CSS media queries and environment variables for:
- 🍎 **iPhone & iOS Safari**: Optimized for notch, Dynamic Island, and home indicator (`viewport-fit=cover`, `env(safe-area-inset-*)`), touch-friendly 44px tap targets, momentum scrolling, and custom iOS "Add to Home Screen" install flow.
- 📱 **Android Phones (Chrome / Edge)**: Full PWA support with standalone window launching, responsive touch controls, and bottom navigation bar.
- 💻 **MacBook & Desktop (Safari / Chrome / Firefox / Edge)**: High-resolution retina canvas charts, responsive sidebar, full map telematics, and keyboard accessibility.
- 📟 **iPad & Tablets**: Adaptive dual-column dashboards and touch seat layouts.

---

## 📲 Progressive Web App (PWA) Features

- **Installable**: Includes `manifest.json`, Web App shortcuts, and high-resolution icons (192px, 512px maskable, 180px Apple Touch Icon).
- **Service Worker (`service-worker.js`)**: Pre-caches core styles, scripts, schedules, and HTML views for rapid load times and offline timetable inspection.
- **Standalone App Experience**: Launches fullscreen without browser address bars when added to Home Screen.
- **Install Flow**: Automatic `beforeinstallprompt` banner on Android/Desktop and step-by-step guidance modal on iOS Safari.

---

## ⚠️ Critical Academic Honesty Disclosure

This project is an **academic prototype simulation**. 
- Never fabricates real government authorizations, live GPS hardware feeds, or real monetary payments.
- All simulated schedules, telematics, and NLP models are clearly labeled with `Prototype Simulation`, `Demo Data`, or `AI Prototype`.
- The actual field observation numbers required for the **C29 field assignment** can be directly entered by the student into the dedicated observation slots in the Transport Minister Command Center.

---

## 🛠️ Technology Stack

- **Core Structure**: HTML5 (Semantic landmarks, ARIA labels, accessible forms)
- **Styling**: Pure Vanilla CSS3 (Custom design system, glassmorphism, animated transit gradients, dark navy `#07111F` aesthetic, responsive layouts, safe-area insets, reduced-motion compliance)
- **Logic & Interactions**: Pure Vanilla JavaScript (ES6+)
- **Data Persistence**: `localStorage` (Demo schedules, bookings, NLP feedback, driver incident logs, profile state)
- **Graphics & Maps**: HTML5 Canvas & SVG (Custom zero-dependency chart engine, interactive GPS telematics map, regional network visualizer, QR e-ticket generator)
- **PWA**: Web App Manifest (`manifest.json`) & Service Worker (`service-worker.js`)
- **Zero External Framework Dependencies**: No React, Angular, Vue, Tailwind, Bootstrap, Node.js, or backend servers required.

---

## 🚀 How to Run

Simply open `index.html` in any modern web browser (Chrome, Safari, Edge, Firefox).

```bash
# Optional local HTTP server (or open index.html directly)
python3 -m http.server 8000
# Visit http://localhost:8000/ in your browser
```

---

## 🔐 Prototype Demo Login Credentials

| Role | Username | Password | Authorized Dashboards |
| :--- | :--- | :--- | :--- |
| **👤 Passenger** | `passenger001` | `passenger123` | `passenger.html`, `booking.html`, `bookings.html`, `tracking.html`, `feedback.html` |
| **🚌 Driver** | `driver001` | `driver123` | `driver.html`, `tracking.html`, `help.html` |
| **🏢 Admin** | `admin001` | `admin123` | `admin.html`, `tracking.html`, `feedback.html`, `help.html` |
| **🏛️ Transport Minister** | `minister001` | `minister123` | `minister.html`, `admin.html`, `tracking.html`, `help.html` |

*Note: The Transport Minister role is strictly pre-authorized and protected by client-side route guards.*

---

## 📁 Project Structure

```
BusTrack-AI/
├── index.html              # Landing Page with Hero, 6-Language selector & Future Vision
├── login.html              # Role-Based Login (Passenger, Driver, Admin, Minister)
├── passenger.html          # Passenger Discovery, Route Search & AI ETA Prediction Hub
├── booking.html            # Intercity Booking, Seat Grid, Demo Payment & QR E-Ticket
├── bookings.html           # My Bookings Manager with Live Tracking & Cancellation
├── tracking.html           # Live GPS Map Simulation with HUD Telematics & Waypoint Timers
├── feedback.html           # Passenger Feedback & Multilingual NLP AI Sentiment Engine
├── driver.html             # Driver Operations Console (Trip controls & Incident reporting)
├── admin.html              # Fleet Management CRUD & Native Canvas Analytics Charts
├── minister.html           # Ministerial Command Center with Interactive Regional Map
├── help.html               # Searchable FAQ Accordion & Support Ticket Desk
├── profile.html            # User Account Profile & Travel Statistics
├── settings.html           # Language, Reduced Motion, PWA Prompt & Platform Preferences
├── manifest.json           # PWA Web App Manifest Configuration
├── service-worker.js       # PWA Service Worker for Offline Caching
├── README.md               # Complete Documentation & Demo Credentials Guide
│
├── assets/
│   └── icons/
│       ├── icon.svg        # Scalable Vector Graphics Master Icon
│       ├── icon-512.png    # High-Res 512x512 PWA Icon
│       ├── icon-192.png    # Standard 192x192 PWA Icon
│       ├── apple-touch-icon.png # 180x180 iOS Safari Touch Icon
│       └── favicon.png     # Browser Favicon
│
├── css/                    # 11 Modular CSS stylesheets with Glassmorphic design tokens
│   ├── global.css, landing.css, login.css, passenger.css, booking.css, tracking.css,
│   └── feedback.css, driver.css, admin.css, minister.css, help.css
│
└── js/                     # 13 Pure Vanilla ES6+ modules
    ├── app.js, auth.js, language.js, charts.js, passenger.js, booking.js,
    └── bookings.js, tracking.js, feedback.js, driver.js, admin.js, minister.js, help.js
```

---

## 📄 License & Academic Attribution
Developed as an educational prototype for Smart Public Mobility & Public Transit Optimization. © 2026 BusTrack AI.
