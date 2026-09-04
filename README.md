# 🚌 BusTrack AI — Smart Transit Solution & Future Integration Architecture

> **“BusTrack AI — A functional AI-powered transport solution prototype designed for future integration with real transport APIs, secure backend/database infrastructure, and trained AI/ML models.”**

**BusTrack AI** is a complete, responsive, cross-platform **Progressive Web App (PWA)** and AI-powered Smart Public Transportation web platform. It seamlessly connects Passengers, Drivers, Fleet Administrators, and the Transport Minister in one unified, presentation-ready ecosystem.

---

## 🗺️ FUTURE IMPLEMENTATION ROADMAP

The platform follows a phased enterprise integration lifecycle, separating client presentation from future backend APIs, telemetry feeds, transactional databases, and machine learning inference pipelines.

```
Frontend UI (HTML5/CSS3/Vanilla JS)
         ↓
Service Layer (js/services/ - Transport, Booking, Tracking, AI)
         ↓
Backend REST API & WebSocket Telemetry Gateway
         ↓
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│   PostgreSQL Database   │  Authorized Transit API │   Trained AI Models     │
│   (Relational Data)     │  (GPS / GTFS-RT Feeds)  │   (ETA / NLP Inference) │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

| Phase | Milestone | Status | Details |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Frontend Prototype & Interactive UI** | **COMPLETED** | Complete responsive web app, 13+ views, role-based dashboards, glassmorphism design system, 6-language internationalization, canvas transit simulation, and PWA capabilities. |
| **Phase 2** | **Backend & Database Infrastructure** | **PLANNED** | Integration of secure REST/GraphQL backend (Node.js/FastAPI) and PostgreSQL/Supabase database storing `passengers`, `drivers`, `buses`, `routes`, `bookings`, `trips`, and `feedback`. |
| **Phase 3** | **Authorized Transport API Integration** | **PLANNED** | Connection to authorized state and private transport corporation APIs for official timetables, live route schedules, vehicle registration records, and service advisories. |
| **Phase 4** | **Real-Time GPS Tracking & Telematics** | **PLANNED** | Low-latency WebSocket / Server-Sent Events (SSE) streaming from onboard IoT GPS transponders for sub-second bus location and corridor telematics. |
| **Phase 5** | **Trained AI/ML Models** | **PLANNED** | Deployment of dedicated machine learning models (Gradient-Boosted / Time-Series ETA forecasting, Occupancy estimation, and fine-tuned multilingual NLP transformer sentiment analyzers). |
| **Phase 6** | **Secure Online Payment Gateway** | **PLANNED** | Integration with authorized PCI-DSS compliant payment gateways (UPI, Credit/Debit Cards, Net Banking) with webhook verification. |
| **Phase 7** | **Production Cloud Deployment** | **PLANNED** | High-availability cloud clustering, containerized microservices, HTTPS/WSS encryption, rate limiting, and observability. |

---

## 🏗️ Service Layer Architecture (`/js/services/`)

The application isolates all data retrieval and intelligence processing into a modular service layer:

- **`apiConfig.js`**: Central API endpoints map, environment mode toggles, and safe fallback simulation handler.
- **`dbSchema.js`**: Relational entity definitions and schema contracts for `passengers`, `drivers`, `buses`, `routes`, `bookings`, `trips`, and `feedback`.
- **`transportService.js`**: Abstraction for querying buses, routes, schedules, stops, service alerts, and operator registries.
- **`bookingService.js`**: Reservation lifecycle manager handling seat queries, transactional bookings, cancellations, and QR e-ticket verification.
- **`trackingService.js`**: Telematics service interpolating live GPS coordinates, waypoint milestones, and speedometer telemetry.
- **`aiService.js`**: AI abstraction interface providing:
  - `predictETA()` — Time-series / regression-based arrival forecasting (labeled `"AI ETA — Prototype Simulation"`)
  - `predictCrowd()` — Real-time occupancy forecasting
  - `analyzeFeedback()` — Multilingual sentiment and operational issue classification (labeled `"AI Feedback Analysis — Prototype"`)
  - `classifyFeedbackIssue()` — Root-cause detection (Delays, Crowding, Driver behavior, Cleanliness, Fare, AC)
  - `generateTransportInsights()` — Corridor optimization and dispatch recommendations

---

## 🗄️ Database Entity Models (Future Relational Schema)

1. **`passengers`**: `passenger_id`, `name`, `email`, `mobile`, `password_hash` *(server-only)*, `preferred_language`, `created_at`
2. **`drivers`**: `driver_id`, `name`, `license_number`, `assigned_bus`, `route`, `status`, `phone`, `created_at`
3. **`buses`**: `bus_id`, `bus_number`, `operator_type` *(Government/Private)*, `bus_type`, `route`, `capacity`, `amenities`, `fare`, `status`
4. **`routes`**: `route_id`, `source`, `destination`, `distance_km`, `stops` *(JSON)*, `schedule` *(JSON)*
5. **`bookings`**: `booking_id`, `passenger_id`, `bus_id`, `travel_date`, `seats` *(Array)*, `fare`, `booking_status`, `payment_status`
6. **`trips`**: `trip_id`, `bus_id`, `route_id`, `start_time`, `end_time`, `gps_latitude`, `gps_longitude`, `current_speed_kmh`, `trip_status`
7. **`feedback`**: `feedback_id`, `passenger_id`, `trip_id`, `rating`, `feedback_text`, `sentiment`, `detected_issue`, `suggested_action`

---

## 🔒 Security & Safe Client-Side Architecture

- **No Exposed Credentials**: No production API keys, service roles, or database passwords exist in frontend JavaScript.
- **Future Server-Side Auth**: All future authentication tokens (JWT / OAuth2 sessions) will be managed via secure HTTP-only cookies and Authorization headers.
- **Academic & Prototype Disclosure**: All simulated telematics, AI predictions, and demo transactions are clearly designated with `Prototype Simulation`, `Demo Data`, `AI ETA — Prototype Simulation`, or `AI Feedback Analysis — Prototype`.

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
- **Service Worker (`service-worker.js`)**: Pre-caches core styles, scripts, services, schedules, and HTML views for rapid load times and offline timetable inspection.
- **Standalone App Experience**: Launches fullscreen without browser address bars when added to Home Screen.
- **Install Flow**: Automatic `beforeinstallprompt` banner on Android/Desktop and step-by-step guidance modal on iOS Safari.

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

---

## 📁 Project Structure

```
BusTrack-AI/
├── index.html              # Landing Page with Hero, Future Vision & Future Tech Integration
├── login.html              # Role-Based Login (Passenger, Driver, Admin, Minister)
├── register.html           # Passenger Registration with Validation
├── passenger.html          # Passenger Discovery, Route Search & AI ETA Prediction Hub
├── booking.html            # Intercity Booking, Seat Grid, Demo Payment & QR E-Ticket
├── bookings.html           # My Bookings Manager with Live Tracking & Cancellation
├── tracking.html           # Live GPS Map Simulation with HUD Telematics & Waypoint Timers
├── feedback.html           # Passenger Feedback & Multilingual NLP AI Sentiment Engine
├── driver.html             # Driver Operations Console (Trip controls & Incident reporting)
├── admin.html              # Fleet Management CRUD & Native Canvas Analytics Charts
├── minister.html           # Ministerial Command Center with Interactive Regional Map
├── help.html               # Searchable FAQ Accordion, Future Tech Cards & Support Desk
├── profile.html            # User Account Profile & Travel Statistics
├── settings.html           # Language, Reduced Motion, Future Tech Integration & Preferences
├── manifest.json           # PWA Web App Manifest Configuration
├── service-worker.js       # PWA Service Worker for Offline Caching
├── README.md               # Complete Documentation, Architecture Guide & Roadmap
│
├── js/
│   ├── services/           # Architecture-Ready Service Layer
│   │   ├── apiConfig.js        # API endpoints, environment toggles & fallback gateway
│   │   ├── dbSchema.js         # Future database schemas (Passengers, Buses, Bookings, etc.)
│   │   ├── transportService.js # Fleet & route querying abstraction
│   │   ├── bookingService.js   # Reservations, cancellations & ticket verification
│   │   ├── trackingService.js  # Live telematics & GPS waypoint stream abstraction
│   │   └── aiService.js        # ETA forecasting, crowd estimation & NLP feedback AI
│   ├── app.js              # Central Data Seed, Canvas Background & PWA Manager
│   ├── auth.js             # Session guards & role authentication
│   ├── language.js         # 6-Language i18n Dictionary Engine
│   ├── charts.js           # Native Retina Canvas Chart Engine
│   ├── passenger.js        # Passenger search & AI ETA controller
│   ├── booking.js          # Booking & seat selector controller
│   ├── bookings.js         # Booking manager controller
│   ├── tracking.js         # Live GPS map controller
│   ├── feedback.js         # NLP feedback controller
│   ├── driver.js           # Driver console controller
│   ├── admin.js            # Fleet admin controller
│   ├── minister.js         # Ministerial analytics controller
│   └── help.js             # FAQ search & accordion controller
│
├── css/                    # 11 Modular CSS stylesheets with Glassmorphic design tokens
│   ├── global.css, landing.css, login.css, passenger.css, booking.css, tracking.css,
│   └── feedback.css, driver.css, admin.css, minister.css, help.css
│
└── assets/
    └── icons/
        ├── icon.svg        # Scalable Vector Graphics Master Icon
        ├── icon-512.png    # High-Res 512x512 PWA Icon
        ├── icon-192.png    # Standard 192x192 PWA Icon
        ├── apple-touch-icon.png # 180x180 iOS Safari Touch Icon
        └── favicon.png     # Browser Favicon
```

---

## 📄 License & Academic Attribution
Developed as an educational prototype for Smart Public Mobility & Public Transit Optimization. © 2026 BusTrack AI.
