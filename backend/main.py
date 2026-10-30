import os
import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List

from schemas.recommendation import (
    UserInput,
    RecommendationResponse,
    SwapRequest,
    FoodRecommendation,
)

from services.recommender import (
    get_recommendations,
    get_swap_options,
    get_all_foods,
    load_resources,
)


# --------------------------------------------------
# PATHS AND NEW CALORIE MODEL
# --------------------------------------------------

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

CALORIE_MODEL_PATH = os.path.join(
    BACKEND_DIR,
    "models",
    "food_energy_predictor.pkl",
)

CALORIE_FEATURES = [
    "Protein (g)",
    "Carbohydrates (g)",
    "Sugar (g)",
    "Fats (g)",
    "Fibres (g)",
    "Sodium (mg)",
    "Calcium (mg)",
    "Iron (mg)",
    "Vitamin C (mg)",
]

calorie_model = None


# --------------------------------------------------
# CALORIE PREDICTION REQUEST SCHEMA
# --------------------------------------------------

class CaloriePredictionRequest(BaseModel):
    protein_g: float = Field(ge=0, le=10000)
    carbohydrates_g: float = Field(ge=0, le=10000)
    sugar_g: float = Field(ge=0, le=10000)
    fats_g: float = Field(ge=0, le=10000)
    fibres_g: float = Field(ge=0, le=10000)
    sodium_mg: float = Field(ge=0, le=1000000)
    calcium_mg: float = Field(ge=0, le=1000000)
    iron_mg: float = Field(ge=0, le=1000000)
    vitamin_c_mg: float = Field(ge=0, le=1000000)


# --------------------------------------------------
# FASTAPI APPLICATION
# --------------------------------------------------

app = FastAPI(
    title="NutriMatch AI Precision Engine",
    description=(
        "Nutrition recommendation API with a separate "
        "Random Forest calorie prediction endpoint."
    ),
    version="2.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# STARTUP
# --------------------------------------------------

@app.on_event("startup")
def startup_event():
    global calorie_model

    # Preserve the existing recommendation engine.
    load_resources()
    print("NutriMatch: Existing recommendation resources loaded.")

    # Load the new model independently.
    if os.path.exists(CALORIE_MODEL_PATH):
        try:
            calorie_model = joblib.load(CALORIE_MODEL_PATH)
            print("NutriMatch: Calorie prediction model loaded.")
        except Exception as exc:
            calorie_model = None
            print(f"Calorie model could not be loaded: {exc}")
    else:
        calorie_model = None
        print(
            "Calorie prediction model not found. "
            f"Expected: {CALORIE_MODEL_PATH}"
        )


# --------------------------------------------------
# ROOT STATUS
# --------------------------------------------------

@app.get("/")
def read_root():
    try:
        total, _ = get_all_foods(
            search="",
            category="All",
            diet_type="All",
            limit=1,
            offset=0,
        )

        return {
            "service": "NutriMatch AI Platform",
            "status": "online",
            "engine": "StandardScaler + Cosine Similarity",
            "calorie_prediction_available": calorie_model is not None,
            "dataset_records": total,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Dataset Count Error: {str(exc)}",
        ) from exc


# --------------------------------------------------
# NEW ENDPOINT: CALORIE PREDICTION
# --------------------------------------------------

@app.post("/api/predict-calories")
def predict_calories(request: CaloriePredictionRequest):
    if calorie_model is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Calorie prediction model is unavailable. "
                "Check backend/models/food_energy_predictor.pkl."
            ),
        )

    try:
        input_data = pd.DataFrame(
            [[
                request.protein_g,
                request.carbohydrates_g,
                request.sugar_g,
                request.fats_g,
                request.fibres_g,
                request.sodium_mg,
                request.calcium_mg,
                request.iron_mg,
                request.vitamin_c_mg,
            ]],
            columns=CALORIE_FEATURES,
        )

        prediction = float(calorie_model.predict(input_data)[0])

        if not pd.notna(prediction) or prediction < 0:
            raise ValueError("The model returned an invalid calorie value.")

        return {
            "model": "RandomForestRegressor",
            "predicted_energy_kcal": round(prediction, 2),
            "unit": "kcal",
            "note": (
                "Estimated using the supplied nutrition values. "
                "This prediction is not a clinical nutrition assessment."
            ),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Calorie prediction failed: {str(exc)}",
        ) from exc


# --------------------------------------------------
# EXISTING ENDPOINT: RECOMMENDATIONS
# --------------------------------------------------

@app.post("/api/recommend", response_model=RecommendationResponse)
def generate_recommendations(user: UserInput):
    try:
        target_macros, full_day_plan = get_recommendations(user)

        return RecommendationResponse(
            target_macros=target_macros,
            full_day_plan=full_day_plan,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"ML Recommendation Error: {str(exc)}",
        ) from exc


# --------------------------------------------------
# EXISTING ENDPOINT: MEAL SWAPS
# --------------------------------------------------

@app.post(
    "/api/recommend/swap",
    response_model=List[FoodRecommendation],
)
def swap_meal(request: SwapRequest):
    try:
        return get_swap_options(
            slot=request.meal_slot,
            target_calories=request.target_calories,
            dietary_preference=request.dietary_preference or "Veg",
            allergies=request.allergies,
            top_n=10,
            exclude_foods=request.exclude_foods,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Swap Engine Error: {str(exc)}",
        ) from exc


# --------------------------------------------------
# EXISTING ENDPOINT: FOOD SEARCH
# --------------------------------------------------

@app.get("/api/foods")
def query_foods(
    search: str = Query(""),
    category: str = Query("All"),
    diet_type: str = Query("All"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    try:
        total, foods = get_all_foods(
            search=search,
            category=category,
            diet_type=diet_type,
            limit=limit,
            offset=offset,
        )

        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "foods": foods,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Dataset Query Error: {str(exc)}",
        ) from exc


# --------------------------------------------------
# EXISTING ENDPOINT: CATEGORIES
# --------------------------------------------------

@app.get("/api/categories")
def get_categories():
    return {
        "categories": [
            "All",
            "Breakfast",
            "Lunch, Dinner",
            "Curry",
            "Snack",
            "Appetizer",
            "Dessert",
            "Salad",
            "Soup",
            "Dal",
            "Rice",
            "Bread",
            "Beverages",
        ],
        "diet_types": ["All", "Veg", "Non-Veg", "Eggetarian"],
        "allergens": [
            "Dairy",
            "Gluten",
            "Nuts",
            "Soy",
            "Egg",
            "Fish",
            "Shellfish",
        ],
    }
