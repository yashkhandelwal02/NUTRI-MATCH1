# NutriMatch AI — Precision 3D Nutrition Platform

> **Funky, futuristic, premium 3D web application powered by clinical biometric calculations and scikit-learn machine learning.**

---

## Quick Start (Easiest Way to Run)

### Method 1: One-Click Launcher (Windows)
Double-click `run_nutrimatch.bat`.
It will automatically launch:
1. **FastAPI Backend** on `http://127.0.0.1:8000`
2. **Vite React Frontend** on `http://localhost:5173`

---

### Method 2: Manual Windows PowerShell Launch

#### 1. Start the Backend
Open PowerShell:
```powershell
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
*API documentation will be live at `http://127.0.0.1:8000/docs`.*

#### 2. Start the Frontend
Open a second PowerShell window:
```powershell
cd frontend
npm install
npm run dev
```
*Open your browser to `http://localhost:5173`.*

#### 3. Run Automated Tests
```powershell
cd backend
python test_e2e.py
```

---

## System Architecture

* **Machine Learning & Math**:
  * **Biometrics**: Mifflin-St Jeor clinical equations for Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
  * **Normalization**: 5-feature Scikit-Learn `StandardScaler` (`Energy (kcal)`, `Protein (g)`, `Carbohydrates (g)`, `Fats (g)`, `Sugar (g)`).
  * **Vector Matching**: Multidimensional cosine similarity over 1,729 verified laboratory records.
  * **Zero Hallucination Guarantee**: All recommendations come directly from the dataset.

* **Frontend Technology**:
  * React 18 & Vite
  * Three.js & `@react-three/fiber` / `@react-three/drei` (3D interactive canvas)
  * Tailwind CSS (Cyber-organic obsidian & neon palette)
  * Lucide Icons

* **Backend Technology**:
  * FastAPI & Uvicorn
  * Scikit-Learn & Joblib
  * Pandas & OpenPyXL

---

## Project Structure

```
NutriMatch/
├── run_nutrimatch.bat        # One-click launch script
├── DEMO_GUIDE.md             # Complete showcase, pitch, and viva guide
├── README.md                 # Setup and run instructions
├── backend/
│   ├── main.py               # FastAPI endpoints (/api/recommend, /api/recommend/swap, /api/foods)
│   ├── requirements.txt      # Python dependencies
│   ├── test_e2e.py           # Automated test harness for faculty/judges
│   ├── data/
│   │   └── foods.xlsx        # 1,729 foods dataset with 17 nutritional attributes
│   ├── models/
│   │   └── nutrimatch_scaler.pkl  # Pre-trained StandardScaler
│   ├── schemas/
│   │   └── recommendation.py # Pydantic request/response models
│   └── services/
│       └── recommender.py    # Cosine similarity and category filtering engine
└── frontend/
    ├── index.html            # Web entry point
    ├── package.json          # Node dependencies
    ├── vite.config.js        # Vite build configuration
    ├── tailwind.config.js    # Cyber-organic theme colors
    └── src/
        ├── App.jsx           # Main application state and routing
        ├── api.js            # API client with offline fallback
        ├── index.css         # Glassmorphism, glows, and animations
        ├── data/
        │   └── foods.json    # Complete 1,729-food dataset for instant search
        └── components/
            ├── Navbar.jsx               # Glowing navigation bar
            ├── Scene3D.jsx              # Interactive 3D food and nutrient canvas
            ├── LandingPage.jsx          # Futuristic hero, live preview, 3D tilt cards
            ├── PersonalizationWizard.jsx# 4-step biometric onboarding
            ├── Dashboard.jsx            # Circular SVG macro rings and health scores
            ├── MealPlanner.jsx          # Full-day planner, 0.5x-2.0x portions, meal swap
            ├── FoodExplorer.jsx         # Search and 17-attribute inspection modal
            ├── AnalyticsPage.jsx        # Energy ratios, chronobiology, WHO RDA audits
            ├── TiltCard.jsx             # Touch-friendly 3D tilt physics
            └── Footer.jsx               # Startup specs and academic disclaimers
```
