import sys
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)

from services.recommender import get_recommendations, get_swap_options, get_all_foods
from schemas.recommendation import UserInput

test_cases = [
    {
        'desc': 'Case 1: Young Male Athlete, Muscle Gain, Non-Veg, High Calorie Target',
        'input': UserInput(age=22, gender='Male', weight_kg=78.0, height_cm=182.0, activity_level='Very Active', goal='Muscle Gain', dietary_preference='Non-Veg')
    },
    {
        'desc': 'Case 2: Female, Weight Loss, Pure Veg, Dairy & Gluten Allergies',
        'input': UserInput(age=30, gender='Female', weight_kg=62.0, height_cm=160.0, activity_level='Lightly Active', goal='Weight Loss', dietary_preference='Veg', allergies=['Dairy', 'Gluten'])
    },
    {
        'desc': 'Case 3: Senior Citizen, Maintenance, Eggetarian, Nuts Allergy + Custom Protein',
        'input': UserInput(age=68, gender='Female', weight_kg=58.0, height_cm=155.0, activity_level='Sedentary', goal='Maintain Weight', dietary_preference='Eggetarian', allergies=['Nuts'], custom_protein_g=95.0)
    },
    {
        'desc': 'Case 4: Heavyweight Lifter, Fat Loss, Non-Veg, Custom Sugar Limit 15g',
        'input': UserInput(age=28, gender='Male', weight_kg=105.0, height_cm=192.0, activity_level='Very Active', goal='Weight Loss', dietary_preference='Non-Veg', custom_sugar_g=15.0)
    }
]

print("=== STARTING END-TO-END NUTRIMATCH TEST SUITE ===\n")
passed = 0
for tc in test_cases:
    print(f"--> Testing {tc['desc']}")
    macros, plan = get_recommendations(tc['input'])
    
    # Assertions
    assert macros.daily_calories >= 1200, "Calories below safe threshold"
    assert macros.protein_g > 30, "Protein suspiciously low"
    assert len(plan.breakfast.items) > 0, "Breakfast empty"
    assert len(plan.lunch.items) > 0, "Lunch empty"
    assert len(plan.snacks.items) > 0, "Snacks empty"
    assert len(plan.dinner.items) > 0, "Dinner empty"
    
    b_item = plan.breakfast.items[0]
    l_item = plan.lunch.items[0]
    s_item = plan.snacks.items[0]
    d_item = plan.dinner.items[0]
    
    print(f"   Target: {macros.daily_calories} kcal | Protein: {macros.protein_g}g")
    print(f"   Breakfast: {b_item.food_name} ({b_item.calories} kcal, {b_item.protein_g}g P, score: {b_item.match_score}%)")
    print(f"   Lunch:     {l_item.food_name} ({l_item.calories} kcal, {l_item.protein_g}g P, score: {l_item.match_score}%)")
    print(f"   Snacks:    {s_item.food_name} ({s_item.calories} kcal, {s_item.protein_g}g P, score: {s_item.match_score}%)")
    print(f"   Dinner:    {d_item.food_name} ({d_item.calories} kcal, {d_item.protein_g}g P, score: {d_item.match_score}%)\n")
    passed += 1

print("--> Testing Swap Recommendations for Dinner (Target: 600 kcal)")
swaps = get_swap_options('dinner', 600.0, 'Veg', ['Gluten'], top_n=3)
assert len(swaps) > 0, "Swap returned no candidates"
for sw in swaps:
    print(f"   Swap Candidate: {sw.food_name} ({sw.calories} kcal, score: {sw.match_score}%)")
passed += 1

print("\n--> Testing Foods Dataset Search API (Query: 'chicken', Non-Veg)")
total, foods = get_all_foods('chicken', '', 'Non-Veg', 3, 0)
assert total > 0, "Food search failed"
print(f"   Found {total} records matching 'chicken'. Sample: {foods[0]['Food']}")
passed += 1

print(f"\n=== ALL {passed}/{passed} END-TO-END TESTS PASSED WITH 100% SUCCESS! ===")
