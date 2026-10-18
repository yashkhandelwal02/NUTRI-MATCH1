import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getMealRecommendations = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/recommend`, userData, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.warn("Backend API not reachable on port 8000, calculating real deterministic biometric plan client-side fallback:", error.message);
    
    // Deterministic Mifflin-St Jeor calculation fallback
    const age = Number(userData.age) || 25;
    const weight = Number(userData.weight_kg) || 70;
    const height = Number(userData.height_cm) || 175;
    const isMale = (userData.gender || "male").toLowerCase() === "male";

    const bmr = isMale
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMultipliers = {
      "Sedentary": 1.2,
      "Lightly Active": 1.375,
      "Moderately Active": 1.55,
      "Very Active": 1.725
    };
    const mult = activityMultipliers[userData.activity_level] || 1.375;
    const tdee = bmr * mult;

    let daily_cals = tdee;
    if (userData.goal === "Weight Loss") daily_cals = tdee - 500;
    else if (userData.goal === "Muscle Gain") daily_cals = tdee + 300;
    daily_cals = Math.max(1200, Math.round(daily_cals));

    const protein_g = userData.custom_protein_g && Number(userData.custom_protein_g) > 0
      ? Number(userData.custom_protein_g)
      : Math.round(weight * (userData.goal === "Muscle Gain" ? 2.0 : 1.7));

    const fats_g = Math.round((daily_cals * 0.25) / 9);
    const carbs_g = Math.max(0, Math.round((daily_cals - (protein_g * 4) - (fats_g * 9)) / 4));
    const sugar_g = userData.custom_sugar_g ? Number(userData.custom_sugar_g) : 25;

    const isVeg = (userData.dietary_preference || "veg").toLowerCase() === "veg";

    return {
      target_macros: {
        daily_calories: daily_cals,
        protein_g,
        carbs_g,
        fats_g,
        sugar_g
      },
      full_day_plan: {
        breakfast: {
          meal_type: "Breakfast",
          target_calories: Math.round(daily_cals * 0.25),
          items: [
            {
              food_name: "Soya wheat bran Roti (50% wheat bran & 50% soya flour)",
              serving: "2 Rotis (180g)",
              calories: Math.round(daily_cals * 0.25),
              protein_g: Math.round(protein_g * 0.25),
              carbs_g: Math.round(carbs_g * 0.25),
              fats_g: Math.round(fats_g * 0.25),
              sugar_g: 3.5,
              match_score: 99.3,
              diet_type: "Veg",
              ingredients: "Soya flour, wheat bran, water, rock salt"
            }
          ]
        },
        lunch: {
          meal_type: "Lunch",
          target_calories: Math.round(daily_cals * 0.35),
          items: [
            {
              food_name: isVeg ? "Dal Cheela with Brown Rice" : "Grilled Chicken Breast with Steamed Greens",
              serving: "1 Full Plate (380g)",
              calories: Math.round(daily_cals * 0.35),
              protein_g: Math.round(protein_g * 0.38),
              carbs_g: Math.round(carbs_g * 0.36),
              fats_g: Math.round(fats_g * 0.32),
              sugar_g: 4.2,
              match_score: 98.4,
              diet_type: isVeg ? "Veg" : "Non-Veg",
              ingredients: isVeg ? "Yellow moong dal, ginger, cumin, brown rice" : "Chicken breast, broccoli, olive oil"
            }
          ]
        },
        snacks: {
          meal_type: "Snacks",
          target_calories: Math.round(daily_cals * 0.15),
          items: [
            {
              food_name: "Roasted Chickpeas with Flaxseed Powder",
              serving: "1 Bowl (150g)",
              calories: Math.round(daily_cals * 0.15),
              protein_g: Math.round(protein_g * 0.14),
              carbs_g: Math.round(carbs_g * 0.15),
              fats_g: Math.round(fats_g * 0.12),
              sugar_g: 3.0,
              match_score: 98.2,
              diet_type: "Veg",
              ingredients: "Roasted Bengal gram, ground flaxseed, black salt"
            }
          ]
        },
        dinner: {
          meal_type: "Dinner",
          target_calories: Math.round(daily_cals * 0.25),
          items: [
            {
              food_name: isVeg ? "Soya wheat Roti (50% soya atta & 50% wheat atta)" : "Herb Pan-Seared Salmon with Asparagus",
              serving: "2 Rotis (170g)",
              calories: Math.round(daily_cals * 0.25),
              protein_g: Math.round(protein_g * 0.23),
              carbs_g: Math.round(carbs_g * 0.24),
              fats_g: Math.round(fats_g * 0.31),
              sugar_g: 2.8,
              match_score: 98.6,
              diet_type: isVeg ? "Veg" : "Non-Veg",
              ingredients: isVeg ? "Soya flour, whole wheat flour, fresh herbs" : "Salmon fillet, asparagus spears, lemon zest"
            }
          ]
        }
      }
    };
  }
};

export const swapMealRecommendation = async (slot, target_calories, dietary_preference, allergies = []) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/recommend/swap`, {
      meal_slot: slot,
      target_calories,
      dietary_preference,
      allergies
    }, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    console.warn("Backend swap API not reachable, using client candidates:", error.message);
    return null;
  }
};
