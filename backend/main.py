from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from schemas.recommendation import (
    UserInput, RecommendationResponse, SwapRequest, FoodRecommendation
)
from services.recommender import (
    get_recommendations, get_swap_options, get_all_foods, load_resources
)

app = FastAPI(
    title="NutriMatch AI Precision Engine",
    description="Deterministic biometric TDEE and scikit-learn StandardScaler vector similarity recommendation API",
    version="2.0.0"
)

# Enable CORS for React / Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    load_resources()
    print("NutriMatch ML Engine: StandardScaler and 1,729 foods dataset loaded successfully.")

@app.get("/")
def read_root():
    return {
        "service": "NutriMatch AI Platform",
        "status": "online",
        "engine": "Scikit-Learn StandardScaler (5-feature vector) + Cosine Distance",
        "dataset_records": 1729
    }

@app.post("/api/recommend", response_model=RecommendationResponse)
def generate_recommendations(user: UserInput):
    """
    Executes clinical Mifflin-St Jeor biometric equations and 
    StandardScaler cosine distance matching across 1,729 food records.
    """
    try:
        target_macros, full_day_plan = get_recommendations(user)
        return RecommendationResponse(
            target_macros=target_macros,
            full_day_plan=full_day_plan
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Recommendation Error: {str(e)}")

@app.post("/api/recommend/swap", response_model=List[FoodRecommendation])
def swap_meal(request: SwapRequest):
    """
    Queries alternative candidate dishes from foods.xlsx for a specific meal slot.
    """
    try:
        alternatives = get_swap_options(
            slot=request.meal_slot,
            target_calories=request.target_calories,
            dietary_preference=request.dietary_preference,
            allergies=request.allergies,
            top_n=10
        )
        return alternatives
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Swap Engine Error: {str(e)}")

@app.get("/api/foods")
def query_foods(
    search: str = Query("", description="Keyword search in food name or ingredients"),
    category: str = Query("All", description="Filter by meal category"),
    diet_type: str = Query("All", description="Veg, Non-Veg, or Eggetarian"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0)
):
    """
    Paginated search and filter endpoint for the 1,729-food clinical dataset.
    """
    try:
        total, foods = get_all_foods(
            search=search,
            category=category,
            diet_type=diet_type,
            limit=limit,
            offset=offset
        )
        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "foods": foods
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dataset Query Error: {str(e)}")

@app.get("/api/categories")
def get_categories():
    """
    Returns available categories and diet types in foods.xlsx
    """
    return {
        "categories": [
            "All", "Breakfast", "Lunch, Dinner", "Curry", "Snack",
            "Appetizer", "Dessert", "Salad", "Soup", "Dal", "Rice", "Bread", "Beverages"
        ],
        "diet_types": ["All", "Veg", "Non-Veg", "Eggetarian"],
        "allergens": ["Dairy", "Gluten", "Nuts", "Soy", "Egg", "Fish", "Shellfish"]
    }