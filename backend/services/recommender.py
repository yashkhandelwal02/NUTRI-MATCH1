
import os

import joblib
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

from schemas.recommendation import (
    UserInput,
    MacroBreakdown,
    FoodRecommendation,
    MealCategoryPlan,
    FullDayPlan,
)


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "nutrimatch_scaler.pkl")
DATA_PATH = os.path.join(BASE_DIR, "data", "foods_modified_reviewed.xlsx")
_scaler = None
_df = None

FEATURE_COLS = [
    "Energy (kcal)",
    "Protein (g)",
    "Carbohydrates (g)",
    "Fats (g)",
    "Sugar (g)",
]

CONDIMENT_FILTER = (
    r"chutney|pickle|sauce|dressing|dip|tadka|baghar|"
    r"syrup|oil|butter|ghee|raw sugar|seasoning"
)


def load_resources():
    global _scaler, _df

    if _scaler is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Scaler PKL missing at {MODEL_PATH}"
            )
        _scaler = joblib.load(MODEL_PATH)

    if _df is None:
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(
                f"Dataset Excel missing at {DATA_PATH}"
            )

        _df = pd.read_excel(DATA_PATH)

        required_cols = [
            "Food",
            "Category",
            "Type",
            "Allergy",
            "Serving",
            "Ingredients",
            *FEATURE_COLS,
        ]

        missing_cols = [
            col for col in required_cols if col not in _df.columns
        ]

        if missing_cols:
            raise ValueError(
                f"Missing required columns in foods.xlsx: {missing_cols}"
            )

        numeric_cols = [
            *FEATURE_COLS,
            "Fibres (g)",
            "Sodium (mg)",
            "Calcium (mg)",
            "Iron (mg)",
            "Vitamin C (mg)",
            "Total Weight (g)",
        ]

        for col in numeric_cols:
            if col not in _df.columns:
                _df[col] = 0.0
            else:
                _df[col] = pd.to_numeric(
                    _df[col], errors="coerce"
                ).fillna(0)

        _df["Food"] = _df["Food"].fillna("").astype(str)
        _df["Category"] = (
            _df["Category"].fillna("General").astype(str)
        )
        _df["Type"] = _df["Type"].fillna("Veg").astype(str)
        _df["Allergy"] = _df["Allergy"].fillna("None").astype(str)
        _df["Serving"] = (
            _df["Serving"].fillna("1 Serving").astype(str)
        )
        _df["Ingredients"] = (
            _df["Ingredients"]
            .fillna("Fresh culinary ingredients")
            .astype(str)
        )

        _df = _df[_df["Food"].str.strip() != ""].copy()


def calculate_daily_macros(user: UserInput) -> MacroBreakdown:
    # Mifflin-St Jeor Equation
    if user.gender.lower() in ["male", "m"]:
        bmr = (
            10 * user.weight_kg
            + 6.25 * user.height_cm
            - 5 * user.age
            + 5
        )
    else:
        bmr = (
            10 * user.weight_kg
            + 6.25 * user.height_cm
            - 5 * user.age
            - 161
        )

    activity_multipliers = {
        "sedentary": 1.2,
        "lightly active": 1.375,
        "moderately active": 1.55,
        "very active": 1.725,
    }

    tdee = bmr * activity_multipliers.get(
        user.activity_level.lower(), 1.375
    )

    if user.custom_calories is not None and user.custom_calories > 500:
        daily_calories = float(user.custom_calories)
    elif user.goal.lower() in ["weight loss", "fat loss"]:
        daily_calories = tdee - 500
    elif user.goal.lower() in ["muscle gain", "weight gain"]:
        daily_calories = tdee + 300
    else:
        daily_calories = tdee

    daily_calories = max(1200.0, round(daily_calories, 1))

    if user.custom_protein_g is not None and user.custom_protein_g > 0:
        protein_g = float(user.custom_protein_g)
    elif "gain" in user.goal.lower():
        protein_g = round(user.weight_kg * 2.0, 1)
    else:
        protein_g = round(user.weight_kg * 1.7, 1)

    fats_g = round((daily_calories * 0.25) / 9, 1)

    carbs_g = max(
        0.0,
        round(
            (
                daily_calories
                - (protein_g * 4)
                - (fats_g * 9)
            ) / 4,
            1,
        ),
    )

    sugar_g = (
        float(user.custom_sugar_g)
        if user.custom_sugar_g is not None
        else 25.0
    )

    return MacroBreakdown(
        daily_calories=daily_calories,
        protein_g=protein_g,
        carbs_g=carbs_g,
        fats_g=fats_g,
        sugar_g=sugar_g,
    )


def _filter_meal_quality(
    df: pd.DataFrame,
    meal_slot: str,
) -> pd.DataFrame:
    slot = meal_slot.lower()

    clean_df = df[
        ~df["Food"].str.lower().str.contains(
            CONDIMENT_FILTER, na=False, regex=True
        )
    ].copy()

    cat = clean_df["Category"].str.lower()

    if slot == "breakfast":
        sub = clean_df[
            cat.str.contains(
                "breakfast|bread|salad|beverages|appetizer",
                na=False,
            )
        ]
    elif slot == "snacks":
        sub = clean_df[
            cat.str.contains(
                "snack|appetizer|beverages|salad",
                na=False,
            )
        ]
    elif slot in ["lunch", "dinner"]:
        sub = clean_df[
            cat.str.contains(
                "lunch|dinner|curry|dal|rice|bread|dry curry|soup",
                na=False,
            )
        ]
    else:
        sub = clean_df

    return sub if len(sub) >= 3 else clean_df


def _get_top_matches_for_target(
    filtered_df: pd.DataFrame,
    target_vector_df: pd.DataFrame,
    top_n: int = 3,
    exclude_foods=None,
):
    if filtered_df.empty or top_n <= 0:
        return []

    pool = filtered_df.copy()

    if exclude_foods:
        excluded = {
            str(food).strip().casefold()
            for food in exclude_foods
            if food is not None
        }

        pool = pool[
            ~pool["Food"].astype(str).str.strip().str.casefold().isin(
                excluded
            )
        ]

    if pool.empty:
        return []

    scaled_target = _scaler.transform(
        target_vector_df[FEATURE_COLS]
    )
    scaled_dataset = _scaler.transform(
        pool[FEATURE_COLS]
    )

    similarities = cosine_similarity(
        scaled_target, scaled_dataset
    )[0]

    pool["similarity"] = similarities
    pool["match_score"] = (
        pool["similarity"] * 100
    ).clip(0, 100).round(1)

    # Stable tie-breaking makes the order reproducible.
    pool = pool.sort_values(
        by=["similarity", "Food"],
        ascending=[False, True],
        kind="mergesort",
    )

    recommendations = []

    for _, row in pool.head(top_n).iterrows():
        recommendations.append(
            FoodRecommendation(
                food_name=str(row["Food"]),
                diet_type=str(row["Type"]),
                category=str(row["Category"]),
                serving=str(row["Serving"]),
                calories=float(row["Energy (kcal)"]),
                protein_g=float(row["Protein (g)"]),
                carbs_g=float(row["Carbohydrates (g)"]),
                fats_g=float(row["Fats (g)"]),
                sugar_g=float(row["Sugar (g)"]),
                fibres_g=float(row.get("Fibres (g)", 0.0)),
                calcium_mg=float(row.get("Calcium (mg)", 0.0)),
                iron_mg=float(row.get("Iron (mg)", 0.0)),
                vitamin_c_mg=float(row.get("Vitamin C (mg)", 0.0)),
                sodium_mg=float(row.get("Sodium (mg)", 0.0)),
                match_score=float(row["match_score"]),
                ingredients=str(
                    row.get("Ingredients", "N/A")
                ),
            )
        )

    return recommendations


def _filter_diet_and_allergies(
    df: pd.DataFrame,
    dietary_preference: str = "Veg",
    allergies=None,
) -> pd.DataFrame:
    preference = (dietary_preference or "Veg").lower()
    filtered_df = df.copy()

    if preference == "veg":
        filtered_df = filtered_df[
            filtered_df["Type"].str.lower() == "veg"
        ]
    elif preference == "eggetarian":
        filtered_df = filtered_df[
            filtered_df["Type"].str.lower().isin(
                ["veg", "eggetarian"]
            )
        ]

    if allergies:
        for allergy in allergies:
            if allergy and str(allergy).strip():
                filtered_df = filtered_df[
                    ~filtered_df["Allergy"].str.contains(
                        str(allergy),
                        case=False,
                        na=False,
                        regex=False,
                    )
                ]

    return filtered_df


def get_recommendations(user: UserInput):
    load_resources()

    target_macros = calculate_daily_macros(user)

    filtered_df = _filter_diet_and_allergies(
        _df,
        user.dietary_preference,
        user.allergies,
    )

    if filtered_df.empty:
        raise ValueError(
            "No foods match your dietary preference and allergy filters."
        )

    ratios = {
        "breakfast": 0.25,
        "lunch": 0.35,
        "snacks": 0.15,
        "dinner": 0.25,
    }

    meal_plans = {}
    total_calories = 0.0
    total_protein = 0.0
    used_foods = set()

    for meal, ratio in ratios.items():
        slot_df = _filter_meal_quality(filtered_df, meal)

        target_df = pd.DataFrame([{
            "Energy (kcal)": target_macros.daily_calories * ratio,
            "Protein (g)": target_macros.protein_g * ratio,
            "Carbohydrates (g)": target_macros.carbs_g * ratio,
            "Fats (g)": target_macros.fats_g * ratio,
            "Sugar (g)": target_macros.sugar_g * ratio,
        }])

        items = _get_top_matches_for_target(
            slot_df,
            target_df,
            top_n=2,
            exclude_foods=used_foods,
        )

        for item in items:
            used_foods.add(item.food_name)
            total_calories += item.calories
            total_protein += item.protein_g

        meal_plans[meal] = MealCategoryPlan(
            meal_type=meal.capitalize(),
            target_calories=round(
                target_macros.daily_calories * ratio, 1
            ),
            items=items,
        )

    full_day_plan = FullDayPlan(
        breakfast=meal_plans["breakfast"],
        lunch=meal_plans["lunch"],
        snacks=meal_plans["snacks"],
        dinner=meal_plans["dinner"],
        total_plan_calories=round(total_calories, 1),
        total_plan_protein_g=round(total_protein, 1),
    )

    return target_macros, full_day_plan


def get_swap_options(
    slot: str,
    target_calories: float,
    dietary_preference: str = "Veg",
    allergies: list = None,
    top_n: int = 10,
    exclude_foods: list = None,
):
    load_resources()

    filtered_df = _filter_diet_and_allergies(
        _df,
        dietary_preference,
        allergies,
    )

    slot_df = _filter_meal_quality(filtered_df, slot)

    target_df = pd.DataFrame([{
        "Energy (kcal)": target_calories,
        "Protein (g)": (target_calories * 0.25) / 4,
        "Carbohydrates (g)": (target_calories * 0.50) / 4,
        "Fats (g)": (target_calories * 0.25) / 9,
        "Sugar (g)": 5.0,
    }])

    return _get_top_matches_for_target(
        slot_df,
        target_df,
        top_n=top_n,
        exclude_foods=exclude_foods,
    )


def get_all_foods(
    search: str = "",
    category: str = "",
    diet_type: str = "",
    limit: int = 50,
    offset: int = 0,
):
    load_resources()

    df = _df.copy()

    if search:
        query = search.lower()

        df = df[
            df["Food"].str.lower().str.contains(
                query, na=False, regex=False
            )
            | df["Ingredients"].str.lower().str.contains(
                query, na=False, regex=False
            )
        ]

    if category and category.lower() != "all":
        df = df[
            df["Category"].str.lower().str.contains(
                category.lower(), na=False, regex=False
            )
        ]

    if diet_type and diet_type.lower() != "all":
        df = df[
            df["Type"].str.lower() == diet_type.lower()
        ]

    total = len(df)
    page_df = df.iloc[offset:offset + limit]

    return total, page_df.to_dict(orient="records")
