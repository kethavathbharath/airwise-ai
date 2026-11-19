# AirWise AI – Your Personal Urban Air Quality Assistant

> **PromptWars Virtual – Challenge 06: Urban Air Quality Assistant**  
> *GenAI-Powered Copilot for Winter Smog, Low-Emission Commuting, and Indoor Air Safety.*

---

## 🌟 Executive Summary

Rapid winter urbanization, temperature inversions, vehicular exhaust, and agricultural burning result in hazardous smog clusters across Indian metropolitan cities (e.g. Hyderabad, Delhi NCR, Mumbai, Bengaluru, Kolkata). Standard air apps simply display a passive number on a gauge without answering the crucial daily questions:
- *"I commute to college by bike at 8 AM in Hyderabad. What routes, masks, or transit alternatives will protect my lungs?"*
- *"When should I open my apartment windows to aerate without letting toxic PM2.5 in?"*
- *"How much CO₂ and tailpipe soot did I save today by switching to the metro?"*

**AirWise AI** is an end-to-end, full-stack, production-quality solution designed to bridge this gap. It pairs **live atmospheric data from Open-Meteo & Indian CPCB standards** with **Google Gemini GenAI** to deliver personalized, low-emission daily routines and actionable health protection.

---

## 🚀 Key Features

### 1. 📍 Smart Location & AQI Dashboard
- **Official CPCB India National AQI Scale**: Exact breakpoint formulas for:
  - 🟢 **Good (0–50)**
  - 🟢 **Satisfactory (51–100)**
  - 🟡 **Moderate (101–200)**
  - 🟠 **Poor (201–300)**
  - 🔴 **Very Poor (301–400)**
  - 🟤 **Severe (401–500+)**
- **Six Key Pollutants**: Real-time concentrations (µg/m³) for PM2.5, PM10, NO₂, O₃, SO₂, and CO with official safety limit bars.
- **Microclimate & Weather**: Ambient temperature, humidity, wind velocity, and wind direction.
- **24-Hour Trend**: Interactive Recharts area visualization highlighting diurnal temperature inversion peaks.
- **3-Day Predictive Forecast**: Multi-day outlook with actionable outdoor activity guidance.
- **Location Detection**: One-click HTML5 geolocation detection plus instant search across Indian & global cities.

### 2. 🤖 GenAI Personal Daily Assistant
- Powered by **Google Gemini 2.0 / 1.5 Flash** (with fallback to an intelligent domain model if offline or without an API key).
- Context-aware: Factors in user location, real-time AQI, transit method (two-wheeler, metro, bus), and lifestyle.
- Delivers structured 5-point responses:
  1. *Recommended travel precautions* (certified N95/FFP2 masking, visor use, buffer distance from diesel plumes).
  2. *Better travel alternatives* (metro corridors, electric AC buses, carpooling).
  3. *Optimal activity timings* (midday 12–3 PM when solar heating lifts the smog inversion cap).
  4. *Indoor protection recommendations* (morning door seals, wet mopping).
  5. *Low-emission habits* (signal idle-off, trip chaining).
- Quick prompt chips, session history persistence, and response copying.

### 3. 🏡 Indoor Air Quality Sanctuary Advisor
- **Correlated Ventilation Schedule**: Dynamically advises window opening hours based on outdoor AQI.
- **Home Size & CADR Sizing**: Recommends Clean Air Delivery Rate (m³/h) and True HEPA (H13) filter sizing for 1 BHK, 2 BHK, 3 BHK, or villas.
- **Cooking & Kitchen Safety**: Mitigates high-PM2.5 tadka, deep-frying oil aerosols, and gas stove tuning.
- **Dust Suppression**: Wet mopping techniques over dry broom sweeping.
- **Science Reality Check on Houseplants**: Debunks marketing myths by contextualizing NASA chamber studies vs actual residential air changes.

### 4. 🧭 Low-Emission Routine Planner
- Structured **Morning, Afternoon, and Evening** action plan.
- Each action details: *What to do*, *Why it matters*, *Environmental benefit*, and *Practical difficulty*.
- **Interactive Checklists**: Checking off an action automatically logs it to the Environmental Impact Tracker.
- **Modal Shift Calculator**: Interactive slider calculating annual CO₂ avoided by switching solo bike or car trips to metro rail or electric buses.

### 5. 🏆 Environmental Impact Tracker
- Tracks estimated **CO₂ emissions avoided (in kg)**, actions completed, and solo vehicle trips substituted.
- Recharts 7-day progress bar chart and category donut breakdown.
- Gamified achievement badges (*"First Green Step"*, *"Metro Pioneer"*, *"Zero-Idler"*, *"Indoor Guardian"*, *"CO₂ Reducer"*) with confetti animations.
- **Scientific Methodology Notice**: Explicitly distinguishes estimated personal reductions from city-wide ambient concentrations.

### 6. 📚 Science & Pollutant Encyclopedia
- Deep dives into PM2.5, PM10, NO₂, and O₃ biological and cardiovascular pathways.
- Explains the meteorological physics of **winter temperature inversions**.
- Certified Mask Hierarchy (N95 vs surgical vs cloth).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Lucide React, Framer Motion, Recharts, Canvas Confetti |
| **Backend** | Python 3.13, FastAPI, Uvicorn, Pydantic V2, HTTPX |
| **AI Integration** | Google Gemini 2.0 / 1.5 Flash API (secure backend proxy + zero-latency offline fallback engine) |
| **Air Quality Data** | Open-Meteo Air Quality & Weather API, CPCB India NAQI Breakpoint Engine, Open-Meteo Geocoding |
| **Architecture** | REST API, Single-Page Application (SPA) served via FastAPI or Vite Dev Server |

---

## 📦 Project Structure

```
air_quality/
├── backend/
│   ├── aqi_calculator.py    # Official CPCB India NAQI & US EPA AQI formulas
│   ├── config.py            # Application settings & secure Gemini API configuration
│   ├── main.py              # FastAPI server, REST routes & static SPA serving
│   ├── models.py            # Pydantic schemas for requests, responses & air reports
│   ├── services.py          # AirQualityService (Open-Meteo) & AIService (Gemini)
│   ├── test_full_app.py     # Pytest test suite covering all 9 endpoint cases
│   └── test_routes.py       # Mock routes
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, AqiIndicator, PollutantCard, OnboardingModal
│   │   ├── context/         # AppContext (state, profile, impact stats, city AQI)
│   │   ├── pages/           # Landing, Dashboard, Assistant, Indoor, Lifestyle, Impact, Education, Settings
│   │   ├── services/        # Frontend API client
│   │   ├── App.jsx          # Root component with dynamic smog alert banner
│   │   └── main.jsx         # React DOM root
│   ├── dist/                # Production optimized build bundle
│   ├── package.json
│   └── vite.config.js       # Vite configuration with Tailwind CSS & API proxy
├── requirements.txt         # Python dependencies
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ & pnpm (or npm)

### 2. Backend Setup
```bash
# Install Python packages
pip install -r requirements.txt

# Run the FastAPI server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API documentation is available at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
pnpm install

# Start Vite development server
pnpm dev
```
Open `http://localhost:5173` in your browser.

### 4. Running the Unified Production Server
Because the frontend has been built into `frontend/dist/`, running the FastAPI backend directly will serve both the REST API and the complete UI on port 8000:
```bash
python -m uvicorn backend.main:app --port 8000
```
Visit `http://localhost:8000` to interact with the full-stack application!

---

## 🧪 Automated Testing

Run the automated test suite covering all endpoints, data calculations, and AI services:
```bash
python -m pytest backend/test_full_app.py
```
Expected output:
```
backend/test_full_app.py ......... [100%]
9 passed in 2.09s
```

---

## 🛡️ Security & Privacy
- **Zero API Key Exposure**: Secret keys (e.g. `GEMINI_API_KEY`) are kept on the server and never injected into client JS bundles.
- **Configurable Runtime**: Users can test their Gemini API keys directly in the **Settings** view or run in the **Intelligent Demo Model** with zero external dependencies.
- **Privacy-First**: Commute habits and personal routines remain stored in browser `localStorage`.

---

## 🏆 PromptWars Evaluation Checklist
- [x] Complete working web application with responsive UI/UX
- [x] Official Indian CPCB NAQI 6-tier classification (Good, Satisfactory, Moderate, Poor, Very Poor, Severe)
- [x] Verified Open-Meteo Air Quality integration with zero fake live AQI data
- [x] Contextual Google Gemini GenAI conversational assistant
- [x] Tailored Indoor Air Quality Sanctuary Advisor
- [x] Synchronized Low-Emission Daily Routine Planner
- [x] Environmental Impact Tracker with transparent CO₂ calculations
- [x] User onboarding and profile personalization
- [x] 100% passing automated test suite
