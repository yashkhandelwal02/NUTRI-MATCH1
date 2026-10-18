
import axios from "axios";

// Deployed NutriMatch FastAPI backend.
// VITE_API_URL can override this URL in Vercel.
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://nutri-match-1-861v.vercel.app"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request personalized meal recommendations from FastAPI.
 * No hardcoded meal-plan fallback is used, because that can
 * make different users receive the same menu.
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

export default api;
