# NutriMatch AI — Showcase & Demonstration Cheat Sheet

Welcome to **NutriMatch**, an AI-powered personalized nutrition recommendation platform engineered for hackathon judges, college faculty, and technical recruiters.

---

## 1. Executive Summary & Problem Solved

* **The Problem**: Conventional nutrition apps either rely on rigid generic meal templates (e.g., 1,500 kcal for everyone) or hallucinating LLMs that fabricate impossible nutritional values and incompatible food combinations.
* **The NutriMatch Solution**: Combines deterministic clinical formulas (**Mifflin-St Jeor TDEE**) with **scikit-learn machine learning** (`StandardScaler` + multidimensional vector cosine distance) over **1,729 verified laboratory food records**.
* **Key Guarantee**: **0% nutritional hallucination**, sub-second response times, and real-time portion scaling ($0.5\times$ to $2.0\times$).

---

## 2. Machine Learning & Technical Architecture

### A. The 5-Dimensional Nutritional Vector
To eliminate energy magnitude bias (e.g. 500 kcal dwarfing 25g protein), NutriMatch passes continuous nutritional attributes through a fitted `StandardScaler`:
1. `Energy (kcal)`
2. `Protein (g)`
3. `Carbohydrates (g)`
4. `Fats (g)`
5. `Sugar (g)`

### B. Cosine Similarity & Distance Optimization
When a user specifies their biometric profile and goals:
1. Target daily calories and macros are decomposed into 4 daily slots: **Breakfast (25%)**, **Lunch (35%)**, **Snacks (15%)**, and **Dinner (25%)**.
2. Each meal target is normalized using `nutrimatch_scaler.pkl`.
3. Cosine similarity is computed against candidate food items from `foods.xlsx`.
4. High-scoring dishes ($\ge 90\%$ match) are curated with zero duplicate foods and strict exclusion of condiments/pickles.

### C. Clinical Biometrics (Mifflin-St Jeor)
$$\text{BMR}_{\text{Male}} = 10 \times \text{Weight (kg)} + 6.25 \times \text{Height (cm)} - 5 \times \text{Age} + 5$$
$$\text{BMR}_{\text{Female}} = 10 \times \text{Weight (kg)} + 6.25 \times \text{Height (cm)} - 5 \times \text{Age} - 161$$
$$\text{TDEE} = \text{BMR} \times \text{Activity Multiplier (1.2 to 1.725)}$$

---

## 3. Step-by-Step Live Demo Script (2–3 Minutes)

### Step 1: The Landing Page (3D & Visual Impact)
* Point out the **3D Canvas**: Floating nutrient orbs orbiting a cyber pedestal with Three.js/R3F, responsive mouse parallax, and dynamic colored neon lights.
* Show the **Interactive Live Preview Card**: Switch between Breakfast, Lunch, Snacks, and Dinner to show real food matches and match confidence scores before logging in.
* Click **"Build My Meal Plan"**.

### Step 2: The Personalization Engine
* **Step 1 (Biometrics)**: Enter Age (e.g. `24`), Weight (e.g. `72`), Height (e.g. `178`). Point to the live **BMR counter** updating in real time.
* **Step 2 (Goals)**: Switch between *Weight Loss* ($-500\text{ kcal}$), *Maintain*, and *Muscle Gain* ($+300\text{ kcal}$). Show the live **TDEE** update.
* **Step 3 (Diet & Allergens)**: Select *Vegetarian* or *Non-Vegetarian*. Select allergens (e.g., *Gluten* or *Dairy*).
* **Step 4 (Review)**: Click **"Generate My NutriMatch Plan"**.

### Step 3: The Personalized Dashboard
* Show the **4 Glowing Circular Progress Rings** (Calories, Protein, Carbs, Fats) and the **Energy Contribution Ratio bar**.
* Highlight the **AI Health Alignment Score** ($96/100$) and read one of the **"Why this was recommended"** rationale explanations.
* Click **"Full Meal Planner →"**.

### Step 4: Interactive Full-Day Meal Planner
* Show the 4 meal slots (Breakfast, Lunch, Snacks, Dinner).
* **Demo Portion Scaling**: Change the portion on Lunch from `1.0x` to `1.5x` — watch the live calories, protein, and top accumulator bar update instantly!
* **Demo Swap Meal**: Click **"Swap Meal"** on Dinner. Show the candidate dishes retrieved from the dataset with cosine match percentages, and click **"Select"** to swap it into the plan!

### Step 5: Food Explorer (1,729 Foods)
* Click **"Food Explorer"** in the top navbar.
* Type a search query (e.g., `"paneer"` or `"chicken"`).
* Filter by category (e.g., `Curry` or `Breakfast`).
* Click any food card to open the **Deep-Dive 17-Nutrient Inspection Modal** showcasing laboratory **Dietary Fibres, Calcium, Iron, Vitamin C, and Sodium**!

### Step 6: Analytics Hub
* Click **"Analytics"** to view Target vs. Actual comparisons, caloric energy ratio distributions, meal chronobiology, and WHO/ICMR RDA reference standards.
* Click **"Print Report"** to show presentation export readiness.

---

## 4. Q&A Defense for Faculty & Judges

* **Q: Is this using an LLM or ChatGPT?**
  * *A: No. It uses deterministic clinical equations (Mifflin-St Jeor) and scikit-learn mathematical vector similarity (`StandardScaler` + Cosine Distance) over 1,729 measured laboratory records. This guarantees 0% hallucination and sub-second execution.*
* **Q: How does the model avoid recommending raita or chutney for lunch?**
  * *A: We implemented category-aware filtering and a condiment exclusion regex (`chutney|pickle|dressing|sauce`), combined with unique dish tracking across daily slots.*
* **Q: How does it handle dietary restrictions?**
  * *A: Strict Boolean masking filters the dataset by diet type (`Veg`, `Non-Veg`, `Eggetarian`) and excludes any items with matching allergen substrings before computing vector similarity.*
* **Q: How can users adjust food quantities?**
  * *A: The dynamic portion multiplier ($0.5\times$ to $2.0\times$) rescales all 17 nutritional parameters and immediately feeds into the daily target accumulator.*

---

## 5. Exact Commands to Run

### Automatic (One-Click):
Double-click [`run_nutrimatch.bat`](file:///C:/Users/yashk/Downloads/ml.mainproject/run_nutrimatch.bat).

### Manual (PowerShell):
**Backend**:
```powershell
cd C:\Users\yashk\Downloads\ml.mainproject\backend
python -m uvicorn main:app --reload --port 8000
```

**Frontend**:
```powershell
cd C:\Users\yashk\Downloads\ml.mainproject\frontend
npm run dev
```

**Automated Test Suite**:
```powershell
cd C:\Users\yashk\Downloads\ml.mainproject\backend
python test_e2e.py
```
