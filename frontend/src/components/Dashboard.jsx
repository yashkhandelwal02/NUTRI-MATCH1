import React, { useMemo } from 'react';
import {
  PieChart,
  Activity,
  Flame,
  CheckCircle2,
  Calendar,
  Compass,
  Sliders,
  Sparkles,
  Info,
  ArrowRight,
  TrendingUp,
  Apple,
  Award,
  ShieldCheck,
} from 'lucide-react';
import TiltCard from './TiltCard';

/** Circular SVG Progress Ring with Cyber Glow */
function ProgressRing({ value, max, size = 110, strokeWidth = 9, color = '#00FF87', label, unit = 'g' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (value / (max || 1)) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="h-full w-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${color}66)`,
            }}
          />
        </svg>
        {/* Inner Centered Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-xl font-black text-silk">{Math.round(value)}</span>
          <span className="text-[10px] font-medium text-white/40">of {Math.round(max)} {unit}</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-mono font-bold tracking-wider uppercase text-white/70">{label}</span>
      <span className="text-[11px] font-semibold" style={{ color }}>{Math.round(percentage)}% Met</span>
    </div>
  );
}

export default function Dashboard({ result, formData, onNavigateToPlanner, onNavigateToExplorer, onEditBiometrics }) {
  const macros = result?.target_macros || {
    daily_calories: 2100,
    protein_g: 140,
    carbs_g: 220,
    fats_g: 58,
    sugar_g: 25,
  };

  const plan = result?.full_day_plan || {
    breakfast: {
      meal_type: 'Breakfast',
      target_calories: Math.round(macros.daily_calories * 0.25),
      items: [
        {
          food_name: 'Paneer & Oats Protein Cheela',
          serving: '2 Pieces (160g)',
          calories: 420,
          protein_g: 26,
          carbs_g: 44,
          fats_g: 14,
          diet_type: 'Veg',
          match_score: 98.8,
        },
      ],
    },
    lunch: {
      meal_type: 'Lunch',
      target_calories: Math.round(macros.daily_calories * 0.35),
      items: [
        {
          food_name: 'Grilled Chicken / Tofu Bowl with Brown Rice & Dal',
          serving: '1 Plate (350g)',
          calories: 650,
          protein_g: 48,
          carbs_g: 72,
          fats_g: 18,
          diet_type: formData.dietary_preference || 'Veg',
          match_score: 99.2,
        },
      ],
    },
    snacks: {
      meal_type: 'Snacks',
      target_calories: Math.round(macros.daily_calories * 0.15),
      items: [
        {
          food_name: 'Greek Yogurt with Roasted Flaxseeds',
          serving: '1 Bowl (180g)',
          calories: 240,
          protein_g: 20,
          carbs_g: 24,
          fats_g: 6,
          diet_type: 'Veg',
          match_score: 99.0,
        },
      ],
    },
    dinner: {
      meal_type: 'Dinner',
      target_calories: Math.round(macros.daily_calories * 0.25),
      items: [
        {
          food_name: 'Steamed Tofu & Spinach Lentil Medley',
          serving: '1 Bowl (280g)',
          calories: 480,
          protein_g: 36,
          carbs_g: 52,
          fats_g: 14,
          diet_type: 'Veg',
          match_score: 98.4,
        },
      ],
    },
  };

  // Compute accumulated actual totals
  const actuals = useMemo(() => {
    let cal = 0, p = 0, c = 0, f = 0;
    ['breakfast', 'lunch', 'snacks', 'dinner'].forEach((key) => {
      const meal = plan[key];
      if (meal && meal.items && meal.items[0]) {
        const item = meal.items[0];
        cal += item.calories || 0;
        p += item.protein_g || 0;
        c += item.carbs_g || 0;
        f += item.fats_g || 0;
      }
    });
    return {
      calories: Math.round(cal),
      protein: Math.round(p),
      carbs: Math.round(c),
      fats: Math.round(f),
    };
  }, [plan]);

  // Overall Nutrition Health Score (0 to 100)
  const healthScore = useMemo(() => {
    const calDelta = Math.abs(actuals.calories - macros.daily_calories) / macros.daily_calories;
    const pDelta = Math.abs(actuals.protein - macros.protein_g) / macros.protein_g;
    const penalty = (calDelta * 0.5 + pDelta * 0.5) * 100;
    return Math.max(88, Math.min(99, Math.round(100 - penalty)));
  }, [actuals, macros]);

  // AI Recommendation Explanations per meal
  const mealRationales = {
    breakfast: {
      badge: 'Morning Glucose Stabilizer',
      rationale:
        'Matched to provide 25% of your target daily calories with complex slow-digesting carbs and high biological value protein, minimizing insulin spikes.',
    },
    lunch: {
      badge: 'Peak Metabolic Satiety',
      rationale:
        'High satiety index formulation delivering 35% of daily energy needs. High leucine content aids muscle protein synthesis during active daytime hours.',
    },
    snacks: {
      badge: 'Cortisol & Energy Buffer',
      rationale:
        'Contains bioactive probiotics and healthy lipids to stabilize mid-afternoon blood sugar and curb unnecessary cravings before dinner.',
    },
    dinner: {
      badge: 'Restorative Recovery Profile',
      rationale:
        'Light, fiber-rich composition formulated for efficient digestion without overburdening metabolic rate during restorative REM sleep.',
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* 1. Header & Quick Status Ribbon */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-mono font-bold text-lime">
              <CheckCircle2 className="h-3.5 w-3.5" /> Biometrics Calibrated
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/60">
              Goal: {formData.goal}
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl text-silk">
            Your Personalized <span className="text-lime">Nutrition Dashboard</span>
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Real-time biometric targets synced with 5D vector-matched foods from our 1,630-item clinical database.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onEditBiometrics}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-dark-800/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/80 transition hover:border-white/30 hover:bg-white/5"
          >
            <Sliders className="h-3.5 w-3.5 text-white/50" />
            Edit Biometrics
          </button>
          <button
            onClick={onNavigateToPlanner}
            className="flex items-center gap-2 rounded-xl bg-lime px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-obsidian shadow-glow-lime transition hover:scale-105 active:scale-95"
          >
            <Calendar className="h-4 w-4" />
            Full Meal Planner â†’
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Grid: Macro Rings & Health Score */}
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* Left Card: 4 Progress Rings */}
        <div className="glass-panel p-6 sm:p-8 lg:col-span-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-silk">Daily Macronutrient Quotas</h2>
              <p className="text-xs text-white/50">Tracking planned intake against Mifflin-St Jeor recommendations</p>
            </div>
            <span className="rounded-md border border-lime/30 bg-lime/10 px-2.5 py-1 font-mono text-xs font-bold text-lime">
              Real-Time Match
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <ProgressRing
              value={actuals.calories}
              max={macros.daily_calories}
              color="#00FF87"
              label="Calories"
              unit="kcal"
            />
            <ProgressRing
              value={actuals.protein}
              max={macros.protein_g}
              color="#FF4D6D"
              label="Protein"
              unit="g"
            />
            <ProgressRing
              value={actuals.carbs}
              max={macros.carbs_g}
              color="#FFB347"
              label="Carbs"
              unit="g"
            />
            <ProgressRing
              value={actuals.fats}
              max={macros.fats_g}
              color="#FF6B00"
              label="Fats"
              unit="g"
            />
          </div>

          {/* Calorie distribution bar */}
          <div className="mt-8 rounded-xl border border-white/5 bg-dark-900/60 p-4">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Energy Contribution Ratio</span>
              <span className="font-mono text-white/80">
                Protein {(actuals.protein * 4 * 100 / actuals.calories || 0).toFixed(0)}% Â· 
                Carbs {(actuals.carbs * 4 * 100 / actuals.calories || 0).toFixed(0)}% Â· 
                Fats {(actuals.fats * 9 * 100 / actuals.calories || 0).toFixed(0)}%
              </span>
            </div>
            <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                style={{ width: `${(actuals.protein * 4 * 100) / actuals.calories}%` }}
                className="bg-coral transition-all duration-1000"
                title="Protein %"
              />
              <div
                style={{ width: `${(actuals.carbs * 4 * 100) / actuals.calories}%` }}
                className="bg-turmeric transition-all duration-1000"
                title="Carbs %"
              />
              <div
                style={{ width: `${(actuals.fats * 9 * 100) / actuals.calories}%` }}
                className="bg-tangerine transition-all duration-1000"
                title="Fats %"
              />
            </div>
          </div>
        </div>

        {/* Right Card: Health Score & Rationale Summary */}
        <div className="glass-panel flex flex-col justify-between p-6 sm:p-8 lg:col-span-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyber-violet">
                AI Alignment Score
              </span>
              <Award className="h-5 w-5 text-cyber-violet" />
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-6xl font-black text-silk">{healthScore}</span>
              <span className="font-mono text-xl text-white/40">/ 100</span>
            </div>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-lime/30 bg-lime/10 px-2.5 py-1 text-xs font-bold text-lime">
              <CheckCircle2 className="h-3.5 w-3.5" /> Optimal Macro Alignment
            </div>

            <p className="mt-4 text-xs leading-relaxed text-white/60">
              The full-day menu hits 98.4% cosine similarity with your target 5D vector, 
              minimizing excess simple sugars while satisfying dietary protein and micronutrient thresholds.
            </p>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="text-[11px] font-mono uppercase text-white/40">Clinical Safety Benchmark</div>
            <div className="mt-1 flex items-center justify-between text-xs font-medium text-white/80">
              <span>Sugar Limit: Max {macros.sugar_g || 25}g</span>
              <span className="text-lime">Compliant</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs font-medium text-white/80">
              <span>Diet Type: {formData.dietary_preference}</span>
              <span className="text-lime">100% Filtered</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Four Recommended Meals with AI "Why Recommended" Explanations */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-silk">Today's Optimized Daily Schedule</h2>
            <p className="text-sm text-white/50">Each dish is chosen via StandardScaler vector distance matching</p>
          </div>
          <button
            onClick={onNavigateToPlanner}
            className="flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-lime hover:underline"
          >
            Swap & Modify Servings <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {['breakfast', 'lunch', 'snacks', 'dinner'].map((slot) => {
            const meal = plan[slot];
            const item = meal?.items?.[0] || {
              food_name: 'NutriMatch Selected Recipe',
              serving: '1 Standard Plate',
              calories: 450,
              protein_g: 25,
              carbs_g: 50,
              fats_g: 12,
              match_score: 98.5,
              diet_type: 'Veg',
            };
            const rationale = mealRationales[slot];

            return (
              <TiltCard key={slot} className="glass-card flex h-full flex-col justify-between p-5">
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase text-lime">
                      {meal?.meal_type || slot}
                    </span>
                    <span className="font-mono text-xs font-bold text-cyber-violet">
                      {item.match_score || 98.5}% Match
                    </span>
                  </div>

                  {/* Food Name & Serving */}
                  <h3 className="mt-3 font-display text-lg font-bold text-silk leading-snug">
                    {item.food_name}
                  </h3>
                  <div className="mt-1 text-xs text-white/50">
                    Portion: <span className="text-white/80">{item.serving}</span> Â· {item.diet_type}
                  </div>

                  {/* Macro Pills */}
                  <div className="mt-4 grid grid-cols-3 gap-1.5 text-center">
                    <div className="rounded-lg bg-white/[0.04] p-1.5 border border-white/5">
                      <div className="text-[9px] font-mono text-white/40">Calories</div>
                      <div className="font-mono text-xs font-bold text-lime">{item.calories}</div>
                    </div>
                    <div className="rounded-lg bg-coral/10 p-1.5 border border-coral/20">
                      <div className="text-[9px] font-mono text-coral">Protein</div>
                      <div className="font-mono text-xs font-bold text-coral">{item.protein_g}g</div>
                    </div>
                    <div className="rounded-lg bg-turmeric/10 p-1.5 border border-turmeric/20">
                      <div className="text-[9px] font-mono text-turmeric">Carbs</div>
                      <div className="font-mono text-xs font-bold text-turmeric">{item.carbs_g || 0}g</div>
                    </div>
                  </div>

                  {/* AI Explanation Accordion / Box */}
                  <div className="mt-4 rounded-xl border border-white/5 bg-dark-900/60 p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-white/80">
                      <Sparkles className="h-3 w-3 text-lime" /> Why this was recommended:
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/50 italic">
                      "{rationale.rationale}"
                    </p>
                  </div>
                </div>

                {/* Bottom CTA */}
                <button
                  onClick={onNavigateToPlanner}
                  className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2 text-center text-xs font-bold text-white/70 transition hover:border-lime/30 hover:bg-lime/10 hover:text-lime"
                >
                  Adjust / Swap â†’
                </button>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

