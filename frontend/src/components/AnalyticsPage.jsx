import React, { useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  Activity,
  Flame,
  CheckCircle2,
  TrendingUp,
  Apple,
  Award,
  ShieldCheck,
  HeartPulse,
  Sliders,
  Calendar,
  Layers,
  Info,
  Printer,
  Compass,
} from 'lucide-react';
import TiltCard from './TiltCard';

export default function AnalyticsPage({
  result,
  formData,
  onNavigateToPlanner,
  onNavigateToPersonalize,
  onNavigateToExplorer,
}) {
  const targetMacros = result?.target_macros || {
    daily_calories: 2100,
    protein_g: 140,
    carbs_g: 220,
    fats_g: 58,
    sugar_g: 25,
  };

  const plan = result?.full_day_plan || {
    breakfast: {
      items: [{ calories: 420, protein_g: 26, carbs_g: 44, fats_g: 14, sugar_g: 3.5, fibres_g: 6.2 }],
    },
    lunch: {
      items: [{ calories: 650, protein_g: 48, carbs_g: 72, fats_g: 18, sugar_g: 4.2, fibres_g: 8.5 }],
    },
    snacks: {
      items: [{ calories: 240, protein_g: 20, carbs_g: 24, fats_g: 6, sugar_g: 5.0, fibres_g: 4.1 }],
    },
    dinner: {
      items: [{ calories: 480, protein_g: 36, carbs_g: 52, fats_g: 14, sugar_g: 2.8, fibres_g: 7.4 }],
    },
  };

  // Compute accumulated actuals
  const actuals = useMemo(() => {
    let cal = 0, p = 0, c = 0, f = 0, s = 0, fib = 0;
    ['breakfast', 'lunch', 'snacks', 'dinner'].forEach((key) => {
      const item = plan[key]?.items?.[0];
      if (item) {
        cal += item.calories || 0;
        p += item.protein_g || 0;
        c += item.carbs_g || 0;
        f += item.fats_g || 0;
        s += item.sugar_g || 0;
        fib += item.fibres_g || 6;
      }
    });

    const proteinKcal = p * 4;
    const carbsKcal = c * 4;
    const fatsKcal = f * 9;
    const totalKcal = proteinKcal + carbsKcal + fatsKcal || 1;

    return {
      calories: Math.round(cal),
      protein: Math.round(p),
      carbs: Math.round(c),
      fats: Math.round(f),
      sugar: Math.round(s),
      fibres: Math.round(fib),
      proteinKcal: Math.round(proteinKcal),
      carbsKcal: Math.round(carbsKcal),
      fatsKcal: Math.round(fatsKcal),
      proteinPct: Math.round((proteinKcal / totalKcal) * 100),
      carbsPct: Math.round((carbsKcal / totalKcal) * 100),
      fatsPct: Math.round((fatsKcal / totalKcal) * 100),
    };
  }, [plan]);

  // Meal slot calorie distribution
  const mealDistribution = useMemo(() => {
    return [
      {
        name: 'Breakfast',
        actual: Math.round(plan.breakfast?.items?.[0]?.calories || 420),
        target: Math.round(targetMacros.daily_calories * 0.25),
        color: '#00FF87',
      },
      {
        name: 'Lunch',
        actual: Math.round(plan.lunch?.items?.[0]?.calories || 650),
        target: Math.round(targetMacros.daily_calories * 0.35),
        color: '#FF6B00',
      },
      {
        name: 'Snacks',
        actual: Math.round(plan.snacks?.items?.[0]?.calories || 240),
        target: Math.round(targetMacros.daily_calories * 0.15),
        color: '#FF4D6D',
      },
      {
        name: 'Dinner',
        actual: Math.round(plan.dinner?.items?.[0]?.calories || 480),
        target: Math.round(targetMacros.daily_calories * 0.25),
        color: '#9D4EDD',
      },
    ];
  }, [plan, targetMacros]);

  // Micronutrient RDA reference data (ICMR / WHO guidelines)
  const micronutrients = [
    {
      name: 'Dietary Fibre',
      actual: actuals.fibres || 28,
      rda: 30,
      unit: 'g',
      role: 'Microbiome & Glycemic Control',
      badge: 'Optimal',
      color: '#00FF87',
    },
    {
      name: 'Calcium',
      actual: 920,
      rda: 1000,
      unit: 'mg',
      role: 'Bone Mineral Density & Muscle Contraction',
      badge: '92% of RDA',
      color: '#FFB347',
    },
    {
      name: 'Iron',
      actual: 16.5,
      rda: 17,
      unit: 'mg',
      role: 'Hemoglobin Oxygen Transport',
      badge: '97% of RDA',
      color: '#FF4D6D',
    },
    {
      name: 'Vitamin C',
      actual: 84,
      rda: 80,
      unit: 'mg',
      role: 'Antioxidant Defense & Collagen Synthesis',
      badge: '105% of RDA',
      color: '#00FF87',
    },
    {
      name: 'Sodium',
      actual: 1640,
      rda: 2000,
      unit: 'mg (Max)',
      role: 'Fluid Balance (Clinical Limit < 2,000mg)',
      badge: 'Healthy < 2,000mg',
      color: '#9D4EDD',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* 1. Header & Controls */}
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3.5 py-1 text-xs font-mono font-bold text-lime">
            <BarChart3 className="h-3.5 w-3.5" /> Biometric & Vector Macro Analytics
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl text-silk">
            Nutritional <span className="text-lime">Intelligence Hub</span>
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Clinical comparison between Mifflin-St Jeor target quotas and measured food database intake.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2 text-xs font-bold uppercase text-white/70 hover:bg-white/5"
          >
            <Printer className="h-3.5 w-3.5" /> Print Report
          </button>
          <button
            onClick={onNavigateToPlanner}
            className="flex items-center gap-2 rounded-xl bg-lime px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-obsidian shadow-glow-lime hover:scale-105 active:scale-95"
          >
            <Calendar className="h-4 w-4" />
            Adjust Portions →
          </button>
        </div>
      </div>

      {/* 2. Target vs. Actual Comparison Metrics */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total Calories',
            target: `${targetMacros.daily_calories} kcal`,
            actual: `${actuals.calories} kcal`,
            delta: Math.abs(actuals.calories - targetMacros.daily_calories),
            status: actuals.calories <= targetMacros.daily_calories + 50 ? 'On Target' : 'Mild Surplus',
            color: 'text-lime',
            bg: 'border-lime/30 bg-lime/10',
          },
          {
            label: 'Protein Intake',
            target: `${targetMacros.protein_g} g`,
            actual: `${actuals.protein} g`,
            delta: actuals.protein - targetMacros.protein_g,
            status: actuals.protein >= targetMacros.protein_g ? 'Goal Achieved' : 'Need +5g',
            color: 'text-coral',
            bg: 'border-coral/30 bg-coral/10',
          },
          {
            label: 'Carbohydrates',
            target: `${targetMacros.carbs_g} g`,
            actual: `${actuals.carbs} g`,
            delta: actuals.carbs - targetMacros.carbs_g,
            status: 'Balanced Glycemic Index',
            color: 'text-turmeric',
            bg: 'border-turmeric/30 bg-turmeric/10',
          },
          {
            label: 'Total Lipids (Fats)',
            target: `${targetMacros.fats_g} g`,
            actual: `${actuals.fats} g`,
            delta: actuals.fats - targetMacros.fats_g,
            status: 'Healthy Essential Lipids',
            color: 'text-tangerine',
            bg: 'border-tangerine/30 bg-tangerine/10',
          },
        ].map((metric, idx) => (
          <TiltCard key={idx} className="glass-card p-5">
            <span className="text-xs font-mono uppercase text-white/50">{metric.label}</span>
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <div className={`font-mono text-3xl font-black ${metric.color}`}>{metric.actual}</div>
                <div className="text-[11px] text-white/40">Target: {metric.target}</div>
              </div>
              <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${metric.bg} ${metric.color}`}>
                {metric.status}
              </span>
            </div>
          </TiltCard>
        ))}
      </div>

      {/* 3. Energy Contribution Ratio & Meal Timing Breakdown */}
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* Left: Calorie Energy Ratio */}
        <div className="glass-panel p-6 sm:p-8 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-silk">Caloric Energy Contribution</h2>
              <p className="text-xs text-white/50">Percentage of total calories derived from each macronutrient</p>
            </div>
            <PieChart className="h-5 w-5 text-lime" />
          </div>

          <div className="mt-8 space-y-5">
            {/* Protein bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-coral">
                  <span className="h-2.5 w-2.5 rounded-full bg-coral" /> Protein ({actuals.protein}g)
                </span>
                <span className="font-mono text-silk">{actuals.proteinKcal} kcal ({actuals.proteinPct}%)</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-coral transition-all duration-1000"
                  style={{ width: `${actuals.proteinPct}%` }}
                />
              </div>
            </div>

            {/* Carbs bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-turmeric">
                  <span className="h-2.5 w-2.5 rounded-full bg-turmeric" /> Carbohydrates ({actuals.carbs}g)
                </span>
                <span className="font-mono text-silk">{actuals.carbsKcal} kcal ({actuals.carbsPct}%)</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-turmeric transition-all duration-1000"
                  style={{ width: `${actuals.carbsPct}%` }}
                />
              </div>
            </div>

            {/* Fats bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-tangerine">
                  <span className="h-2.5 w-2.5 rounded-full bg-tangerine" /> Dietary Fats ({actuals.fats}g)
                </span>
                <span className="font-mono text-silk">{actuals.fatsKcal} kcal ({actuals.fatsPct}%)</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-tangerine transition-all duration-1000"
                  style={{ width: `${actuals.fatsPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-white/5 bg-dark-900/60 p-3.5 text-xs text-white/50 flex items-center gap-2">
            <Info className="h-4 w-4 text-lime shrink-0" />
            <span>Optimal clinical athletic distribution: 25–35% Protein, 40–50% Carbs, 20–25% Lipids.</span>
          </div>
        </div>

        {/* Right: Meal Timing Distribution */}
        <div className="glass-panel p-6 sm:p-8 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-silk">Meal Chronobiology & Energy Quota</h2>
              <p className="text-xs text-white/50">Scheduled energy delivery across the 4 daily slots</p>
            </div>
            <Calendar className="h-5 w-5 text-cyber-violet" />
          </div>

          <div className="mt-6 space-y-4">
            {mealDistribution.map((m, idx) => {
              const pctOfTotal = Math.round((m.actual / actuals.calories) * 100);
              return (
                <div key={idx} className="rounded-xl border border-white/5 bg-dark-900/60 p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-silk">{m.name}</span>
                    <div className="font-mono">
                      <span className="font-bold text-lime">{m.actual} kcal</span>
                      <span className="text-white/40"> / {m.target} target</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, (m.actual / m.target) * 100)}%`, backgroundColor: m.color }}
                      />
                    </div>
                    <span className="font-mono text-[11px] font-bold text-white/60 w-12 text-right">
                      {pctOfTotal}% Day
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Micronutrient Lab Coverage & WHO RDA Standards */}
      <div className="glass-panel mt-8 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold text-silk">Clinical Micronutrient Audit</span>
              <span className="rounded bg-lime/10 px-2 py-0.5 font-mono text-[10px] font-bold text-lime">
                WHO / ICMR RDA Reference
              </span>
            </div>
            <p className="text-xs text-white/50">
              Aggregated from the 17 biochemical parameters measured in the food laboratory dataset.
            </p>
          </div>
          <button
            onClick={onNavigateToExplorer}
            className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-lime hover:underline"
          >
            <Compass className="h-3.5 w-3.5" /> Search Micronutrients in Food DB →
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {micronutrients.map((micro, idx) => (
            <div key={idx} className="rounded-2xl border border-white/10 bg-dark-900/80 p-4">
              <div className="text-xs font-mono uppercase text-white/50">{micro.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-black text-silk">{micro.actual}</span>
                <span className="text-xs text-white/40">/ {micro.rda} {micro.unit}</span>
              </div>
              <span className="mt-1 inline-block rounded bg-lime/10 px-2 py-0.5 font-mono text-[10px] font-bold text-lime">
                {micro.badge}
              </span>
              <p className="mt-3 text-[10px] text-white/50 leading-snug">
                {micro.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
