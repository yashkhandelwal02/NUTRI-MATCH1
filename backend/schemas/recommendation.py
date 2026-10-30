
from pydantic import BaseModel, Field
from typing import List, Optional


class UserInput(BaseModel):
    age: int = Field(..., ge=10, le=100)
    gender: str
    weight_kg: float = Field(..., gt=20, lt=300)
    height_cm: float = Field(..., gt=80, lt=250)
    activity_level: str = "Sedentary"
    goal: str = "Maintain Weight"
    dietary_preference: str = "Veg"
    allergies: List[str] = Field(default_factory=list)
    custom_calories: Optional[float] = None
    custom_protein_g: Optional[float] = None
    custom_sugar_g: Optional[float] = None


class MacroBreakdown(BaseModel):
    daily_calories: float
    protein_g: float
    carbs_g: float
    fats_g: float
    sugar_g: float


class FoodRecommendation(BaseModel):
    food_name: str
    diet_type: str
    category: str
    serving: str
    calories: float
    protein_g: float
    carbs_g: float
    fats_g: float
    sugar_g: float
    fibres_g: Optional[float] = 0.0
    calcium_mg: Optional[float] = 0.0
    iron_mg: Optional[float] = 0.0
    vitamin_c_mg: Optional[float] = 0.0
    sodium_mg: Optional[float] = 0.0
    match_score: float
    ingredients: str


class MealCategoryPlan(BaseModel):
    meal_type: str
    target_calories: float
    items: List[FoodRecommendation]


class FullDayPlan(BaseModel):
    breakfast: MealCategoryPlan
    lunch: MealCategoryPlan
    snacks: MealCategoryPlan
    dinner: MealCategoryPlan
    total_plan_calories: float
    total_plan_protein_g: float


class RecommendationResponse(BaseModel):
    target_macros: MacroBreakdown
    full_day_plan: FullDayPlan


class SwapRequest(BaseModel):
    meal_slot: str
    target_calories: float
    dietary_preference: Optional[str] = "Veg"
    allergies: List[str] = Field(default_factory=list)
    exclude_foods: List[str] = Field(default_factory=list)
