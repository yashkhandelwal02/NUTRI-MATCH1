
import axios from "axios";

// Deployed NutriMatch FastAPI backend.
// VITE_API_URL can override this URL in Vercel.
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://nutri-match-1-861v.vercel.app"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});
/**
 * Request personalized meal recommendations from FastAPI.
 * No hardcoded meal-plan fallback is used.
 */
export const getMealRecommendations = async (userData) => {
  try {
    const response = await api.post("/recommend", userData);
    return response.data;
  } catch (error) {
    console.error(
      "NutriMatch recommendation request failed:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.detail ||
        "Could not generate your meal plan. Please check the backend connection and try again."
    );
  }
};

/**
 * Request an alternative meal for a particular meal slot.
 */
export const swapMealRecommendation = async (
  slot,
  target_calories,
  dietary_preference,
  allergies = []
) => {
  try {
    const response = await api.post("/recommend/swap", {
      meal_slot: slot,
      target_calories,
      dietary_preference,
      allergies,
    });

    return response.data;
  } catch (error) {
    console.error(
      "NutriMatch meal swap failed:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.detail ||
        "Could not swap this meal. Please try again."
    );
  }
};

/**
 * Predict estimated calories from nutrition values.
 *
 * All nine nutrition fields are required by the backend.
 * Values must use the units expected by the trained model.
 */
export const predictCalories = async ({
  protein_g,
  carbohydrates_g,
  sugar_g,
  fats_g,
  fibres_g,
  sodium_mg,
  calcium_mg,
  iron_mg,
  vitamin_c_mg,
}) => {
  try {
    const response = await api.post("/predict-calories", {
      protein_g,
      carbohydrates_g,
      sugar_g,
      fats_g,
      fibres_g,
      sodium_mg,
      calcium_mg,
      iron_mg,
      vitamin_c_mg,
    });

    return response.data;
  } catch (error) {
    console.error(
      "NutriMatch calorie prediction failed:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.detail ||
        "Could not predict calories. Please try again."
    );
  }
};

export default api;
