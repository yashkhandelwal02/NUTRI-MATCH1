import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  Flame,
  CheckCircle2,
  Sliders,
  ChevronDown,
  Info,
  Scale,
  RefreshCw,
  Plus,
  X,
  Apple,
} from 'lucide-react';
import TiltCard from './TiltCard';
import ALL_FOODS from '../data/foods.json';
import { swapMealRecommendation } from '../api';

const PORTION_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default function MealPlanner({
  result,
  formData,
  onRegenerate,
  onNavigateToExplorer,
  onNavigateToDashboard,
}) {
  const targetMacros = result?.target_macros || {
    daily_calories: 2100,
    protein_g: 140,
    carbs_g: 220,
    fats_g: 58,
    sugar_g: 25,
  };

  // State for meal selections and portion multipliers
  const [portions, setPortions] = useState({
    breakfast: 1.0,
    lunch: 1.0,
    snacks: 1.0,
    dinner: 1.0,
  });

  const [activePlan, setActivePlan] = useState(() => {
    if (result?.full_day_plan) {
      return {
        breakfast: result.full_day_plan.breakfast?.items?.[0] || null,
        lunch: result.full_day_plan.lunch?.items?.[0] || null,
        snacks: result.full_day_plan.snacks?.items?.[0] || null,
        dinner: result.full_day_plan.dinner?.items?.[0] || null,
      };
    }
    // Default fallback dishes
    return {
      breakfast: {
        food_name: 'Paneer & Oats Protein Cheela',
        serving: '2 Pieces (180g)',
        calories: 420,
        protein_g: 26,
        carbs_g: 44,
        fats_g: 14,
        sugar_g: 3.5,
        fibres_g: 6.2,
        diet_type: 'Veg',
        match_score: 99.1,
        ingredients: 'Oats flour, low-fat paneer, green chilies, coriander',
      },
      lunch: {
        food_name: 'Spiced Soya & Paneer Bowl with Brown Rice',
        serving: '1 Plate (380g)',
        calories: 650,
        protein_g: 48,
        carbs_g: 72,
        fats_g: 18,
        sugar_g: 4.2,
        fibres_g: 8.5,
        diet_type: 'Veg',
        match_score: 99.4,
        ingredients: 'Brown rice, soya chunks, paneer, tomato gravy, turmeric',
      },
      snacks: {
        food_name: 'Greek Yogurt with Roasted Flaxseeds',
        serving: '1 Bowl (190g)',
        calories: 240,
        protein_g: 20,
        carbs_g: 24,
        fats_g: 6,
        sugar_g: 5.0,
        fibres_g: 4.1,
        diet_type: 'Veg',
        match_score: 99.0,
        ingredients: 'Greek yogurt, roasted flaxseeds, blueberries',
      },
      dinner: {
        food_name: 'Tofu & Mixed Greens Lentil Medley',
        serving: '1 Deep Bowl (300g)',
        calories: 480,
        protein_g: 36,
        carbs_g: 52,
        fats_g: 14,
        sugar_g: 2.8,
        fibres_g: 7.4,
        diet_type: 'Veg',
        match_score: 98.6,
        ingredients: 'Firm tofu, brown lentils, spinach, garlic, cumin',
      },
    };
  });

  // Modal state for swapping a meal
  const [swappingSlot, setSwappingSlot] = useState(null);
  const [backendSwaps, setBackendSwaps] = useState([]);

  useEffect(() => {
    if (swappingSlot) {
      const slotTargets = {
        breakfast: targetMacros.daily_calories * 0.25,
        lunch: targetMacros.daily_calories * 0.35,
        snacks: targetMacros.daily_calories * 0.15,
        dinner: targetMacros.daily_calories * 0.25,
      };
      swapMealRecommendation(
        swappingSlot,
        slotTargets[swappingSlot] || 500,
        formData.dietary_preference || 'Veg',
        formData.allergies || []
      ).then((res) => {
        if (res && Array.isArray(res) && res.length > 0) {
          setBackendSwaps(res);
        }
      });
    } else {
      setBackendSwaps([]);
    }
  }, [swappingSlot, targetMacros, formData]);

  const handlePortionChange = (slot, multiplier) => {
    setPortions((prev) => ({ ...prev, [slot]: multiplier }));
  };

  // Calculate live planned totals with portions applied
  const liveTotals = useMemo(() => {
    let cal = 0, p = 0, c = 0, f = 0, s = 0, fib = 0;
    ['breakfast', 'lunch', 'snacks', 'dinner'].forEach((slot) => {
      const item = activePlan[slot];
      const mult = portions[slot] || 1.0;
      if (item) {
        cal += (item.calories || 0) * mult;
        p += (item.protein_g || 0) * mult;
        c += (item.carbs_g || 0) * mult;
        f += (item.fats_g || 0) * mult;
        s += (item.sugar_g || 0) * mult;
        fib += (item.fibres_g || 0) * mult;
      }
    });
    return {
      calories: Math.round(cal),
      protein: Math.round(p),
      carbs: Math.round(c),
      fats: Math.round(f),
      sugar: Math.round(s),
      fibres: Math.round(fib),
    };
  }, [activePlan, portions]);

  // Calories delta
  const calorieDiff = liveTotals.calories - targetMacros.daily_calories;
  const proteinDiff = liveTotals.protein - targetMacros.protein_g;

  // Swap candidates for the active swappingSlot
  const swapCandidates = useMemo(() => {
    if (!swappingSlot) return [];
    const isVeg = (formData.dietary_preference || 'veg').toLowerCase() === 'veg';
    const isNonVeg = (formData.dietary_preference || '').toLowerCase() === 'non-veg';

    const slotTargets = {
      breakfast: targetMacros.daily_calories * 0.25,
      lunch: targetMacros.daily_calories * 0.35,
      snacks: targetMacros.daily_calories * 0.15,
      dinner: targetMacros.daily_calories * 0.25,
    };
    const targetCals = slotTargets[swappingSlot] || 500;

    return ALL_FOODS.filter((item) => {
      // Diet filter
      const type = (item.Type || '').toLowerCase();
      if (isVeg && type !== 'veg') return false;
      if (isNonVeg && type === 'veg') {
        // Can allow veg too, but keep matches relevant
      }

      // Allergen filter
      if (formData.allergies && formData.allergies.length > 0) {
        const itemAllergy = String(item.Allergy || '').toLowerCase();
        for (const a of formData.allergies) {
          if (itemAllergy.includes(a.toLowerCase())) return false;
        }
      }

      // Category matching
      const cat = String(item.Category || '').toLowerCase();
      if (swappingSlot === 'breakfast' && !cat.includes('breakfast') && !cat.includes('bread') && !cat.includes('appetizer')) {
        return false;
      }
      if (swappingSlot === 'snacks' && !cat.includes('snack') && !cat.includes('appetizer') && !cat.includes('beverages') && !cat.includes('salad')) {
        return false;
      }

      // Exclude zero cal items
      return (item['Energy (kcal)'] || 0) > 80;
    })
      .map((item) => {
        const diff = Math.abs((item['Energy (kcal)'] || 0) - targetCals);
        const score = Math.max(85, Math.round(100 - (diff / targetCals) * 40));
        return {
          food_name: item.Food,
          serving: item.Serving || '1 Serving',
          calories: Math.round(item['Energy (kcal)'] || 0),
          protein_g: Math.round(item['Protein (g)'] || 0),
          carbs_g: Math.round(item['Carbohydrates (g)'] || 0),
          fats_g: Math.round(item['Fats (g)'] || 0),
          sugar_g: Math.round(item['Sugar (g)'] || 0),
          fibres_g: Math.round(item['Fibres (g)'] || 0),
          diet_type: item.Type || 'Veg',
          match_score: score,
          ingredients: item.Ingredients || 'Fresh ingredients',
        };
      })
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 12);
  }, [swappingSlot, formData, targetMacros]);

  const selectSwapItem = (item) => {
    if (!swappingSlot) return;
    setActivePlan((prev) => ({ ...prev, [swappingSlot]: item }));
    setPortions((prev) => ({ ...prev, [swappingSlot]: 1.0 }));
    setSwappingSlot(null);
  };

  const slotTitles = {
    breakfast: { name: 'Breakfast', quota: '25% of Target', time: '08:00 AM' },
    lunch: { name: 'Lunch', quota: '35% of Target', time: '01:00 PM' },
    snacks: { name: 'Snacks', quota: '15% of Target', time: '05:00 PM' },
    dinner: { name: 'Dinner', quota: '25% of Target', time: '08:30 PM' },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* 1. Header & Live Target Accumulator */}
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3.5 py-1 text-xs font-mono font-bold text-lime">
            <Calendar className="h-3.5 w-3.5" /> Full-Day AI Meal Plan
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl text-silk">
            Interactive <span className="text-lime">Macro Planner</span>
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Fine-tune serving sizes, swap foods from the 1,630 clinical records, and match your daily target.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setPortions({ breakfast: 1.0, lunch: 1.0, snacks: 1.0, dinner: 1.0 })}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2 text-xs font-bold uppercase text-white/70 hover:bg-white/5"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Portions
          </button>
          <button
            onClick={onNavigateToDashboard}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2 text-xs font-bold uppercase text-white/70 hover:bg-white/5"
          >
            Dashboard
          </button>
          <button
            onClick={onNavigateToExplorer}
            className="flex items-center gap-2 rounded-xl bg-lime px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-obsidian shadow-glow-lime hover:scale-105 active:scale-95"
          >
            Browse 1,630 Foods â†’
          </button>
        </div>
      </div>

      {/* 2. Target vs Actuals Progress Ribbon */}
      <div className="glass-panel mt-8 p-6 sm:p-8">
        <div className="grid gap-6 md:grid-cols-4">
          {/* Calorie Accumulator */}
          <div className="rounded-2xl border border-white/10 bg-dark-900/80 p-4">
            <div className="flex items-center justify-between text-xs font-mono text-white/50 uppercase">
              <span>Daily Energy</span>
              <span className={calorieDiff > 100 ? 'text-coral' : calorieDiff < -100 ? 'text-turmeric' : 'text-lime'}>
                {calorieDiff > 0 ? `+${calorieDiff} kcal` : `${calorieDiff} kcal`}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-black text-lime">{liveTotals.calories}</span>
              <span className="text-sm font-medium text-white/40">/ {targetMacros.daily_calories} kcal</span>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-lime transition-all duration-300"
                style={{
                  width: `${Math.min(100, (liveTotals.calories / targetMacros.daily_calories) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Protein Accumulator */}
          <div className="rounded-2xl border border-white/10 bg-dark-900/80 p-4">
            <div className="flex items-center justify-between text-xs font-mono text-white/50 uppercase">
              <span>Protein</span>
              <span className={proteinDiff >= 0 ? 'text-lime' : 'text-coral'}>
                {proteinDiff >= 0 ? `+${proteinDiff}g` : `${proteinDiff}g`}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-black text-coral">{liveTotals.protein}</span>
              <span className="text-sm font-medium text-white/40">/ {targetMacros.protein_g} g</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-coral transition-all duration-300"
                style={{
                  width: `${Math.min(100, (liveTotals.protein / targetMacros.protein_g) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Carbs & Fats Accumulator */}
          <div className="rounded-2xl border border-white/10 bg-dark-900/80 p-4">
            <div className="text-xs font-mono text-white/50 uppercase">Carbs & Fats</div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="font-mono text-xl font-bold text-turmeric">{liveTotals.carbs}g</span>
                <span className="block text-[10px] text-white/40">of {targetMacros.carbs_g}g carbs</span>
              </div>
              <div>
                <span className="font-mono text-xl font-bold text-tangerine">{liveTotals.fats}g</span>
                <span className="block text-[10px] text-white/40">of {targetMacros.fats_g}g fats</span>
              </div>
            </div>
            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/10 gap-1">
              <div
                className="bg-turmeric h-full rounded-full"
                style={{ width: `${Math.min(50, (liveTotals.carbs / targetMacros.carbs_g) * 50)}%` }}
              />
              <div
                className="bg-tangerine h-full rounded-full"
                style={{ width: `${Math.min(50, (liveTotals.fats / targetMacros.fats_g) * 50)}%` }}
              />
            </div>
          </div>

          {/* Sugar & Fibre Health Metrics */}
          <div className="rounded-2xl border border-white/10 bg-dark-900/80 p-4">
            <div className="text-xs font-mono text-white/50 uppercase">Sugar & Dietary Fibre</div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="font-mono text-xl font-bold text-cyber-violet">{liveTotals.sugar}g</span>
                <span className="block text-[10px] text-white/40">Max {targetMacros.sugar_g || 25}g limit</span>
              </div>
              <div>
                <span className="font-mono text-xl font-bold text-silk">{liveTotals.fibres}g</span>
                <span className="block text-[10px] text-white/40">Prebiotic Fibre</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] font-mono text-lime flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Optimal Nutrient Density
            </div>
          </div>
        </div>
      </div>

      {/* 3. Four Meal Cards with Portion Scaling & Swap */}
      <div className="mt-10 space-y-6">
        {['breakfast', 'lunch', 'snacks', 'dinner'].map((slot) => {
          const item = activePlan[slot];
          const mult = portions[slot] || 1.0;
          const info = slotTitles[slot];

          if (!item) return null;

          const scaledCalories = Math.round((item.calories || 0) * mult);
          const scaledProtein = Math.round((item.protein_g || 0) * mult);
          const scaledCarbs = Math.round((item.carbs_g || 0) * mult);
          const scaledFats = Math.round((item.fats_g || 0) * mult);
          const scaledSugar = Math.round((item.sugar_g || 0) * mult);
          const scaledFibres = Math.round((item.fibres_g || 0) * mult);

          return (
            <TiltCard key={slot} className="glass-panel overflow-hidden border border-white/10 p-6 sm:p-8">
              <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                {/* Slot Info & Title */}
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-lime/30 bg-lime/10 px-2.5 py-0.5 font-mono text-xs font-bold uppercase text-lime">
                      {info.name}
                    </span>
                    <span className="text-xs font-mono text-white/40">{info.time}</span>
                    <span className="text-xs text-white/50">Â· {info.quota}</span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-bold text-silk">{item.food_name}</h3>
                  <p className="mt-1 text-xs text-white/60">
                    Base: {item.serving} Â· <span className="text-lime">{item.diet_type}</span> Â·{' '}
                    <span className="font-mono text-cyber-violet">{item.match_score || 99}% Match</span>
                  </p>

                  <p className="mt-2 text-xs italic text-white/40 line-clamp-2">
                    Ingredients: {item.ingredients || 'Fresh clinical formulation'}
                  </p>
                </div>

                {/* Portion Scaling Selector */}
                <div className="lg:col-span-3">
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/50">
                    Portion Multiplier: <span className="font-bold text-lime">{mult}x</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PORTION_OPTIONS.map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePortionChange(slot, p)}
                        className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition-all ${
                          mult === p
                            ? 'border border-lime bg-lime text-obsidian shadow-glow-lime'
                            : 'border border-white/10 bg-dark-900/60 text-white/70 hover:border-white/20'
                        }`}
                      >
                        {p}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scaled Nutritional Output */}
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="rounded-xl border border-white/5 bg-dark-900/70 p-2">
                      <div className="text-[9px] font-mono uppercase text-white/40">Calories</div>
                      <div className="font-mono text-base font-bold text-lime">{scaledCalories}</div>
                      <div className="text-[8px] text-white/30">kcal</div>
                    </div>
                    <div className="rounded-xl border border-coral/20 bg-coral/10 p-2">
                      <div className="text-[9px] font-mono uppercase text-coral">Protein</div>
                      <div className="font-mono text-base font-bold text-coral">{scaledProtein}g</div>
                      <div className="text-[8px] text-white/30">{(scaledProtein * 4 * 100 / (scaledCalories || 1)).toFixed(0)}%</div>
                    </div>
                    <div className="rounded-xl border border-turmeric/20 bg-turmeric/10 p-2">
                      <div className="text-[9px] font-mono uppercase text-turmeric">Carbs</div>
                      <div className="font-mono text-base font-bold text-turmeric">{scaledCarbs}g</div>
                      <div className="text-[8px] text-white/30">{(scaledCarbs * 4 * 100 / (scaledCalories || 1)).toFixed(0)}%</div>
                    </div>
                    <div className="rounded-xl border border-tangerine/20 bg-tangerine/10 p-2">
                      <div className="text-[9px] font-mono uppercase text-tangerine">Fats</div>
                      <div className="font-mono text-base font-bold text-tangerine">{scaledFats}g</div>
                      <div className="text-[8px] text-white/30">{(scaledFats * 9 * 100 / (scaledCalories || 1)).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>

                {/* Swap Meal Action */}
                <div className="flex justify-end lg:col-span-2">
                  <button
                    onClick={() => setSwappingSlot(slot)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-xs font-bold uppercase tracking-wider text-silk transition hover:border-lime/40 hover:bg-lime/10 hover:text-lime lg:w-auto"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    <span>Swap Meal</span>
                  </button>
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* 4. Swap Alternative Foods Modal */}
      {swappingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-fadeIn">
          <div className="glass-panel relative max-h-[90vh] w-full max-w-4xl overflow-hidden border border-white/15 bg-dark-900/95 p-6 sm:p-8 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime">
                  Alternative Vector Matches
                </span>
                <h3 className="font-display text-2xl font-bold text-silk">
                  Swap {slotTitles[swappingSlot]?.name}
                </h3>
                <p className="text-xs text-white/50">
                  Showing top clinical alternatives from 1,630 verified records matching your diet.
                </p>
              </div>
              <button
                onClick={() => setSwappingSlot(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Candidates Grid */}
            <div className="mt-6 flex-1 overflow-y-auto space-y-3 pr-2">
              {(backendSwaps.length > 0 ? backendSwaps : swapCandidates).map((candidate, idx) => (
                <div
                  key={idx}
                  className="glass-card flex flex-col justify-between gap-4 p-4 transition-all hover:border-lime/40 sm:flex-row sm:items-center"
                >
                  <div className="space-y-1 sm:max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base font-bold text-silk">{candidate.food_name}</span>
                      <span className="rounded bg-lime/10 px-2 py-0.5 font-mono text-[10px] font-bold text-lime">
                        {candidate.match_score}% Match
                      </span>
                    </div>
                    <p className="text-xs text-white/50">
                      Serving: {candidate.serving} Â· <span className="text-white/80">{candidate.diet_type}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="rounded bg-dark-900 px-2 py-1">
                        <div className="text-[9px] text-white/40">Kcal</div>
                        <div className="font-mono font-bold text-lime">{candidate.calories}</div>
                      </div>
                      <div className="rounded bg-dark-900 px-2 py-1">
                        <div className="text-[9px] text-coral">Protein</div>
                        <div className="font-mono font-bold text-coral">{candidate.protein_g}g</div>
                      </div>
                      <div className="rounded bg-dark-900 px-2 py-1">
                        <div className="text-[9px] text-turmeric">Carbs</div>
                        <div className="font-mono font-bold text-turmeric">{candidate.carbs_g}g</div>
                      </div>
                      <div className="rounded bg-dark-900 px-2 py-1">
                        <div className="text-[9px] text-tangerine">Fats</div>
                        <div className="font-mono font-bold text-tangerine">{candidate.fats_g}g</div>
                      </div>
                    </div>

                    <button
                      onClick={() => selectSwapItem(candidate)}
                      className="rounded-xl bg-lime px-4 py-2 font-mono text-xs font-extrabold uppercase tracking-wider text-obsidian shadow-glow-lime hover:scale-105 active:scale-95"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

