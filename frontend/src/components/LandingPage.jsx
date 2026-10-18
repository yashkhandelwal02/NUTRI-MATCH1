import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Dumbbell,
  Apple,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronRight,
  BarChart3,
  CheckCircle2,
  Zap,
  Activity,
  HeartPulse
} from 'lucide-react';
import TiltCard from './TiltCard';

export default function LandingPage({ onStartPersonalize, onExploreFoods, hasPlan, onGoToDashboard }) {
  const [activePreviewMeal, setActivePreviewMeal] = useState('lunch');

  const previewMeals = {
    breakfast: {
      type: 'Breakfast (25% Target)',
      title: 'Paneer & Oats Protein Cheela',
      serving: '2 Medium Pieces (160g)',
      calories: 420,
      protein: 26,
      carbs: 44,
      fats: 14,
      sugar: 3.2,
      score: 99.1,
      tag: 'High Protein Vegetarian',
      rationale: 'Calibrated for morning glucose stability and sustained cognitive focus.',
    },
    lunch: {
      type: 'Lunch (35% Target)',
      title: 'Grilled Herb Chicken Bowl with Brown Rice & Dal',
      serving: '1 Plate (350g)',
      calories: 640,
      protein: 48,
      carbs: 68,
      fats: 18,
      sugar: 4.1,
      score: 98.7,
      tag: 'Lean Muscle Synthesis',
      rationale: 'Optimized post-meridian amino acid delivery with complex dietary fibre.',
    },
    snacks: {
      type: 'Snack (15% Target)',
      title: 'Greek Yogurt with Roasted Flaxseeds & Blueberries',
      serving: '1 Bowl (180g)',
      calories: 220,
      protein: 18,
      carbs: 22,
      fats: 6,
      sugar: 5.5,
      score: 99.4,
      tag: 'Antioxidant & Gut Health',
      rationale: 'Prebiotic rich snack formulated to curb mid-afternoon cortisol spikes.',
    },
    dinner: {
      type: 'Dinner (25% Target)',
      title: 'Steamed Tofu & Spinach Lentil Medley',
      serving: '1 Bowl (280g)',
      calories: 460,
      protein: 34,
      carbs: 46,
      fats: 12,
      sugar: 2.8,
      score: 98.2,
      tag: 'Low Glycemic Recovery',
      rationale: 'Clean micronutrient density ensuring restorative overnight muscle repair.',
    },
  };

  const currentPreview = previewMeals[activePreviewMeal];

  return (
    <div className="relative min-h-screen text-silk">
      {/* 1. HERO SECTION */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-6 pt-16 pb-20 text-center lg:pt-24 lg:pb-32">
        {/* Futuristic Status Pill */}
        <div className="reveal inline-flex items-center gap-2.5 rounded-full border border-lime/30 bg-lime/10 px-4 py-1.5 backdrop-blur-xl shadow-glow-lime">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
          </span>
          <span className="font-mono text-xs font-bold tracking-wider uppercase text-lime">
            AI-POWERED NUTRITION INTELLIGENCE
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="reveal mt-8 max-w-5xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
          EAT SMART.{' '}
          <span className="text-gradient-lime">FEEL UNSTOPPABLE.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
          Say goodbye to generic meal plans. NutriMatch deploys clinical Mifflin-St Jeor biometric equations 
          and scikit-learn vector normalization to generate tailor-made daily menus from a verified 1,729-food dataset.
        </p>

        {/* Dual CTAs */}
        <div className="reveal mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button
            onClick={onStartPersonalize}
            className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-lime px-8 py-4 font-mono text-base font-extrabold tracking-wide uppercase text-obsidian shadow-glow-lime transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95"
          >
            <span>{hasPlan ? 'Reconfigure My Plan' : 'Build My Meal Plan'}</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onExploreFoods}
            className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-bold tracking-wide text-silk backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]"
          >
            <span>Explore 1,729 Foods</span>
            <ChevronRight className="h-4 w-4 text-white/50" />
          </button>

          {hasPlan && (
            <button
              onClick={onGoToDashboard}
              className="flex items-center gap-2 rounded-2xl border border-cyber-violet/50 bg-cyber-purple/20 px-6 py-4 text-sm font-bold tracking-wide text-white backdrop-blur-xl transition hover:bg-cyber-purple/30 shadow-glow-purple"
            >
              <Activity className="h-4 w-4 text-lime" />
              <span>View Active Plan</span>
            </button>
          )}
        </div>

        {/* Hero Metric Pills */}
        <div className="reveal mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { label: 'Verified Foods', val: '1,729+', icon: Apple, color: 'text-lime' },
            { label: 'Cosine Match Score', val: '98.5%', icon: ShieldCheck, color: 'text-cyber-violet' },
            { label: 'Portion Control', val: '0.5x - 2.0x', icon: Layers, color: 'text-tangerine' },
            { label: 'Hallucination Rate', val: '0.0%', icon: Cpu, color: 'text-coral' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass-panel flex flex-col items-center justify-center p-4 transition-transform hover:scale-105"
            >
              <stat.icon className={`h-5 w-5 ${stat.color} mb-1`} />
              <div className="font-mono text-xl font-extrabold text-silk">{stat.val}</div>
              <div className="text-[11px] font-medium text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. LIVE INTERACTIVE MEAL PREVIEW */}
      <section className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-lime">Interactive AI Demo</div>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Real Food. Real Science. Real Precision.
          </h2>
          <p className="mt-3 text-sm text-white/60">
            Preview how our vector-distance algorithm matches ideal macronutrients to actual food items.
          </p>

          {/* Meal Switcher Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {['breakfast', 'lunch', 'snacks', 'dinner'].map((m) => (
              <button
                key={m}
                onClick={() => setActivePreviewMeal(m)}
                className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  activePreviewMeal === m
                    ? 'border border-lime bg-lime/20 text-lime shadow-glow-lime'
                    : 'border border-white/10 bg-dark-800/80 text-white/60 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* The Live Interactive Preview Card */}
        <div className="mt-8">
          <TiltCard className="glass-panel relative overflow-hidden border border-white/15 bg-dark-800/70 p-6 sm:p-10 shadow-2xl">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime via-cyber-purple to-tangerine" />

            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Details */}
              <div className="space-y-4 lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-lime/30 bg-lime/10 px-3 py-1 font-mono text-xs font-bold text-lime">
                    {currentPreview.type}
                  </span>
                  <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                    {currentPreview.tag}
                  </span>
                  <span className="flex items-center gap-1 rounded-md border border-cyber-purple/40 bg-cyber-purple/10 px-3 py-1 font-mono text-xs font-bold text-cyber-violet">
                    <Sparkles className="h-3 w-3" /> {currentPreview.score}% Match Score
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold sm:text-3xl text-silk">
                  {currentPreview.title}
                </h3>
                <p className="text-sm font-medium text-white/50">
                  Standard Serving: <span className="text-white/80">{currentPreview.serving}</span>
                </p>
                <p className="text-sm italic leading-relaxed text-white/70 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                  "{currentPreview.rationale}"
                </p>
              </div>

              {/* Right Column: Macro Breakdown */}
              <div className="rounded-2xl border border-white/10 bg-dark-900/80 p-5 lg:col-span-5">
                <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/50">Target Calories</span>
                  <span className="font-mono text-3xl font-black text-lime">
                    {currentPreview.calories} <span className="text-sm font-normal text-white/50">kcal</span>
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-xl bg-coral/10 p-2.5 border border-coral/20">
                    <div className="text-[10px] font-mono uppercase text-coral">Protein</div>
                    <div className="font-mono text-lg font-bold text-coral">{currentPreview.protein}g</div>
                  </div>
                  <div className="rounded-xl bg-lime/10 p-2.5 border border-lime/20">
                    <div className="text-[10px] font-mono uppercase text-lime">Carbs</div>
                    <div className="font-mono text-lg font-bold text-lime">{currentPreview.carbs}g</div>
                  </div>
                  <div className="rounded-xl bg-tangerine/10 p-2.5 border border-tangerine/20">
                    <div className="text-[10px] font-mono uppercase text-tangerine">Fats</div>
                    <div className="font-mono text-lg font-bold text-tangerine">{currentPreview.fats}g</div>
                  </div>
                  <div className="rounded-xl bg-cyber-purple/10 p-2.5 border border-cyber-purple/20">
                    <div className="text-[10px] font-mono uppercase text-cyber-violet">Sugar</div>
                    <div className="font-mono text-lg font-bold text-cyber-violet">{currentPreview.sugar}g</div>
                  </div>
                </div>

                <button
                  onClick={onStartPersonalize}
                  className="mt-5 w-full rounded-xl bg-white/[0.06] py-2.5 text-xs font-bold uppercase tracking-wider text-silk transition hover:bg-lime hover:text-obsidian"
                >
                  Generate Plan For My Body →
                </button>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* 3. FOUR CORE INTELLIGENCE PILLARS */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-lime">Engine Capabilities</div>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-5xl">
            Why NutriMatch Outperforms Typical Apps
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
            Most diet apps offer rigid templates or hallucinate impossible macros. NutriMatch pairs real scientific formulas with vector optimization.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Flame,
              title: 'Mifflin-St Jeor TDEE',
              desc: 'Calculates exact Basal Metabolic Rate and Total Daily Energy Expenditure using clinical height, weight, age, and activity metrics.',
              accent: 'lime',
              pill: 'Clinical Precision',
            },
            {
              icon: Cpu,
              title: 'StandardScaler Vector ML',
              desc: 'Pre-normalizes 5 nutritional dimensions (kcal, protein, carbs, fats, sugar) to eliminate energy bias during similarity matching.',
              accent: 'cyber-purple',
              pill: 'Scikit-Learn Scaler',
            },
            {
              icon: Layers,
              title: 'Dynamic Portion Scaling',
              desc: 'Enables portion variations from 0.5x to 2.0x, automatically updating macros and tracking daily calorie targets in real time.',
              accent: 'tangerine',
              pill: '0.5x to 2.0x Slices',
            },
            {
              icon: HeartPulse,
              title: 'Micronutrient Auditing',
              desc: 'Beyond macros: queries Dietary Fibres, Calcium, Iron, Vitamin C, and Sodium across 1,729 verified laboratory records.',
              accent: 'coral',
              pill: '17 Food Dimensions',
            },
          ].map((card, i) => (
            <TiltCard key={i} className="glass-card flex h-full flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] border border-white/10">
                    <card.icon className="h-6 w-6 text-lime" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono text-white/50">
                    {card.pill}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-silk">{card.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/60">{card.desc}</p>
              </div>

              <div className="mt-6 flex items-center gap-1 font-mono text-xs font-bold text-lime">
                <span>Integrated in Core Engine</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* 4. "HOW IT WORKS" TIMELINE */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="glass-panel border border-white/10 p-8 sm:p-14">
          <div className="text-center">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime">Architecture Pipeline</span>
            <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">How Your Recommendation Is Built</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Biometric Ingestion',
                desc: 'You specify age, gender, height, weight, activity multiplier, dietary preferences (Veg/Non-Veg), and allergens.',
                highlight: 'BMR & TDEE Calculated',
              },
              {
                step: '02',
                title: '5D Vector Normalization',
                desc: 'Your meal calorie and macro quotas are mapped into a 5-dimensional vector and scaled through our pre-trained StandardScaler.',
                highlight: 'Cosine Distance Match',
              },
              {
                step: '03',
                title: 'NutriMatch Full-Day Plan',
                desc: 'The top matching items from the 1,729-food dataset are assembled into Breakfast, Lunch, Dinner, and Snack slots with Swap options.',
                highlight: 'Swap & Portion Ready',
              },
            ].map((step, idx) => (
              <div key={idx} className="relative rounded-2xl border border-white/10 bg-dark-900/60 p-6">
                <span className="font-mono text-4xl font-black text-lime/40">{step.step}</span>
                <h3 className="mt-3 font-display text-xl font-bold text-silk">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/60">{step.desc}</p>
                <div className="mt-4 inline-block rounded-md border border-lime/30 bg-lime/10 px-2.5 py-1 font-mono text-[11px] font-bold text-lime">
                  {step.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ACADEMIC & RECRUITER HIGHLIGHT BANNER */}
      <section className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl border border-lime/40 bg-gradient-to-r from-lime/15 via-cyber-purple/15 to-tangerine/15 p-8 text-center backdrop-blur-2xl shadow-glow-lime sm:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-dark-900/60 px-4 py-1 text-xs font-mono font-bold text-white">
            <Zap className="h-3.5 w-3.5 text-lime" /> Hackathon & Faculty Showcase Feature
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl text-silk">
            Designed for Real-World Scalability
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80">
            NutriMatch proves that AI recommendations don't require brittle LLM text prompts. 
            By deploying deterministic biometric equations and mathematical vector similarity over a curated 
            Excel dataset, the system achieves sub-second response times with guaranteed zero nutritional hallucinations.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onStartPersonalize}
              className="flex items-center gap-2 rounded-xl bg-lime px-8 py-3.5 font-mono text-sm font-extrabold uppercase tracking-wider text-obsidian shadow-glow-lime transition hover:scale-105 active:scale-95"
            >
              <span>Launch Onboarding Flow</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
