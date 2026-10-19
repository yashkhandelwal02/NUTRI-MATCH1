
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
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

app = FastAPI(
    title="NutriMatch AI Precision Engine",
    description=(
        "Deterministic biometric TDEE and scikit-learn "
        "StandardScaler vector similarity recommendation API"
    ),
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    load_resources()
    print("NutriMatch ML Engine: Scaler and food dataset loaded.")


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
            "dataset_records": total,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Dataset Count Error: {str(e)}",
        ) from e


@app.post("/api/recommend", response_model=RecommendationResponse)
def generate_recommendations(user: UserInput):
    try:
        target_macros, full_day_plan = get_recommendations(user)
        return RecommendationResponse(
            target_macros=target_macros,
            full_day_plan=full_day_plan,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"ML Recommendation Error: {str(e)}",
        ) from e


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
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Swap Engine Error: {str(e)}",
        ) from e


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
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Dataset Query Error: {str(e)}",
        ) from e


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
