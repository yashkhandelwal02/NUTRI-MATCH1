import React, { useState, useMemo } from 'react';
import {
  User,
  Activity,
  Apple,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Flame,
  ShieldAlert,
  Info,
  Check,
  Scale,
  Ruler,
  RefreshCw,
  HeartPulse,
  Zap,
} from 'lucide-react';

const ALLERGEN_OPTIONS = [
  'Dairy',
  'Gluten',
  'Peanuts',
  'Tree Nuts',
  'Soy',
  'Egg',
  'Fish',
  'Shellfish',
  'Mustard',
  'Sesame',
];

export default function PersonalizationWizard({
  formData,
  setFormData,
  onSubmit,
  loading,
  error,
  onCancel,
}) {
  const [step, setStep] = useState(1);
  const [validationError, setValidationError] = useState('');

  // Live Mifflin-St Jeor Calculation
  const { bmr, tdee, targetCalories, suggestedProtein, suggestedCarbs, suggestedFats } =
    useMemo(() => {
      const age = Number(formData.age) || 25;
      const weight = Number(formData.weight_kg) || 70;
      const height = Number(formData.height_cm) || 175;
      const isMale = formData.gender.toLowerCase() === 'male';

      // Mifflin-St Jeor Formula
      const calcBmr = isMale
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

      const activityMultipliers = {
        Sedentary: 1.2,
        'Lightly Active': 1.375,
        'Moderately Active': 1.55,
        'Very Active': 1.725,
      };

      const mult = activityMultipliers[formData.activity_level] || 1.375;
      const calcTdee = calcBmr * mult;

      let target = calcTdee;
      if (formData.goal === 'Weight Loss') target = calcTdee - 500;
      else if (formData.goal === 'Muscle Gain') target = calcTdee + 300;

      target = Math.max(1200, Math.round(target));

      // Macro breakdown
      const proteinMultiplier = formData.goal === 'Muscle Gain' ? 2.0 : 1.7;
      const proteinG = Math.round(weight * proteinMultiplier);
      const fatsG = Math.round((target * 0.25) / 9);
      const carbsG = Math.max(0, Math.round((target - proteinG * 4 - fatsG * 9) / 4));

      return {
        bmr: Math.round(calcBmr),
        tdee: Math.round(calcTdee),
        targetCalories: target,
        suggestedProtein: proteinG,
        suggestedCarbs: carbsG,
        suggestedFats: fatsG,
      };
    }, [formData]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError('');
  };

  const toggleAllergy = (allergy) => {
    setFormData((prev) => {
      const current = prev.allergies || [];
      const updated = current.includes(allergy)
        ? current.filter((a) => a !== allergy)
        : [...current, allergy];
      return { ...prev, allergies: updated };
    });
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.age || formData.age < 12 || formData.age > 100) {
        return 'Please enter a valid age between 12 and 100.';
      }
      if (!formData.weight_kg || formData.weight_kg < 30 || formData.weight_kg > 250) {
        return 'Please enter a valid weight between 30 kg and 250 kg.';
      }
      if (!formData.height_cm || formData.height_cm < 100 || formData.height_cm > 250) {
        return 'Please enter a valid height between 100 cm and 250 cm.';
      }
    }
    return '';
  };

  const nextStep = () => {
    const err = validateStep(step);
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError('');
    setStep((s) => Math.min(4, s + 1));
  };

  const prevStep = () => {
    setValidationError('');
    setStep((s) => Math.max(1, s - 1));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Step Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-4 py-1 text-xs font-mono font-bold uppercase tracking-wider text-lime">
          <Zap className="h-3.5 w-3.5" /> Step {step} of 4: Personalization Engine
        </div>
        <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl text-silk">
          {step === 1 && 'Your Biometric Foundation'}
          {step === 2 && 'Daily Activity & Fitness Goal'}
          {step === 3 && 'Dietary Lifestyle & Allergies'}
          {step === 4 && 'Target Overrides & Confirmation'}
        </h1>
        <p className="mt-2 text-sm text-white/60">
          {step === 1 && 'Clinical parameters required for Mifflin-St Jeor basal metabolic calculation.'}
          {step === 2 && 'Determine your Total Daily Energy Expenditure (TDEE) and caloric threshold.'}
          {step === 3 && 'Filter from 1,729 items according to dietary choices and allergen exclusions.'}
          {step === 4 && 'Accept system-recommended clinical macros or input custom precision targets.'}
        </p>

        {/* Step Progress Bar */}
        <div className="mx-auto mt-6 flex max-w-md items-center justify-between">
          {[
            { s: 1, label: 'Biometrics' },
            { s: 2, label: 'Goals' },
            { s: 3, label: 'Diet' },
            { s: 4, label: 'Review' },
          ].map(({ s, label }) => (
            <div key={s} className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs font-bold transition-all ${
                  step === s
                    ? 'border-2 border-lime bg-lime/20 text-lime shadow-glow-lime'
                    : step > s
                    ? 'border-2 border-lime bg-lime text-obsidian'
                    : 'border border-white/20 bg-dark-800 text-white/40'
                }`}
              >
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              <span className="mt-1 text-[11px] font-medium text-white/50">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="glass-panel relative mt-8 overflow-hidden border border-white/10 bg-dark-800/80 p-6 sm:p-10 shadow-2xl">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime via-cyber-purple to-tangerine" />

        {/* Validation Alert */}
        {validationError && (
          <div className="mb-6 rounded-xl border border-coral/40 bg-coral/10 p-3.5 text-xs text-coral">
            <ShieldAlert className="inline h-4 w-4 mr-2" />
            {validationError}
          </div>
        )}

        {/* ================= STEP 1: BIOMETRICS ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">
                Biological Gender (Affects BMR constant)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Male', 'Female'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleFieldChange('gender', g)}
                    className={`rounded-xl border py-3 text-sm font-bold transition-all ${
                      formData.gender === g
                        ? 'border-lime bg-lime/15 text-lime shadow-glow-lime'
                        : 'border-white/10 bg-dark-900/60 text-white/70 hover:border-white/20'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">
                  Age <span className="text-white/30">(Years)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleFieldChange('age', e.target.value)}
                    placeholder="25"
                    className="cyber-field"
                  />
                  <User className="absolute right-3.5 top-3.5 h-4 w-4 text-white/30" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">
                  Weight <span className="text-white/30">(kg)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.weight_kg}
                    onChange={(e) => handleFieldChange('weight_kg', e.target.value)}
                    placeholder="70"
                    className="cyber-field"
                  />
                  <Scale className="absolute right-3.5 top-3.5 h-4 w-4 text-white/30" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">
                  Height <span className="text-white/30">(cm)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.height_cm}
                    onChange={(e) => handleFieldChange('height_cm', e.target.value)}
                    placeholder="175"
                    className="cyber-field"
                  />
                  <Ruler className="absolute right-3.5 top-3.5 h-4 w-4 text-white/30" />
                </div>
              </div>
            </div>

            {/* Live BMR preview card */}
            <div className="rounded-2xl border border-lime/20 bg-lime/5 p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-mono font-bold text-lime">
                  <Flame className="h-4 w-4" /> Live Basal Metabolic Rate (BMR)
                </span>
                <span className="font-mono text-xl font-black text-lime">
                  {bmr} <span className="text-xs font-normal text-white/50">kcal/day</span>
                </span>
              </div>
              <p className="mt-1 text-[11px] text-white/50">
                Calculated via Mifflin-St Jeor formula: Energy expenditure at complete rest.
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 2: ACTIVITY & GOALS ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">
                Physical Activity Level
              </label>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {[
                  { key: 'Sedentary', mult: '1.2x', desc: 'Desk job, minimal daily movement' },
                  { key: 'Lightly Active', mult: '1.375x', desc: '1–3 light workouts per week' },
                  { key: 'Moderately Active', mult: '1.55x', desc: '3–5 moderate training sessions' },
                  { key: 'Very Active', mult: '1.725x', desc: '6–7 intense workouts or athletic job' },
                ].map((act) => (
                  <button
                    key={act.key}
                    type="button"
                    onClick={() => handleFieldChange('activity_level', act.key)}
                    className={`rounded-xl border p-3.5 text-left transition-all ${
                      formData.activity_level === act.key
                        ? 'border-lime bg-lime/15 text-lime shadow-glow-lime'
                        : 'border-white/10 bg-dark-900/60 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-silk">{act.key}</span>
                      <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/60">
                        {act.mult}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-white/50">{act.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">
                Primary Fitness Objective
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'Weight Loss', delta: '-500 kcal', color: 'text-coral' },
                  { key: 'Maintain Weight', delta: '±0 kcal', color: 'text-lime' },
                  { key: 'Muscle Gain', delta: '+300 kcal', color: 'text-tangerine' },
                ].map((g) => (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => handleFieldChange('goal', g.key)}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      formData.goal === g.key
                        ? 'border-lime bg-lime/15 text-lime shadow-glow-lime'
                        : 'border-white/10 bg-dark-900/60 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold sm:text-sm text-silk">{g.key}</div>
                    <div className={`mt-1 font-mono text-[11px] font-bold ${g.color}`}>{g.delta}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live TDEE & Target Preview */}
            <div className="rounded-2xl border border-white/10 bg-dark-900/80 p-4">
              <div className="grid grid-cols-2 gap-4 divide-x divide-white/10">
                <div>
                  <div className="text-[11px] font-mono uppercase text-white/50">Maintenance (TDEE)</div>
                  <div className="font-mono text-2xl font-black text-white/80">{tdee} kcal</div>
                </div>
                <div className="pl-4">
                  <div className="text-[11px] font-mono uppercase text-lime">Target Daily Calories</div>
                  <div className="font-mono text-2xl font-black text-lime">{targetCalories} kcal</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: DIET & ALLERGIES ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">
                Dietary Framework
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'Veg', label: 'Vegetarian', desc: 'Plant & dairy foods' },
                  { key: 'Non-Veg', label: 'Non-Vegetarian', desc: 'All poultry, fish & meats' },
                  { key: 'Eggetarian', label: 'Eggetarian', desc: 'Vegetarian + Eggs' },
                ].map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => handleFieldChange('dietary_preference', d.key)}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      formData.dietary_preference === d.key
                        ? 'border-lime bg-lime/15 text-lime shadow-glow-lime'
                        : 'border-white/10 bg-dark-900/60 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-sm text-silk">{d.label}</div>
                    <div className="mt-1 text-[11px] text-white/50">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-white/60">
                Allergen & Intolerance Exclusions (Strict Filter)
              </label>
              <p className="mb-3 text-xs text-white/50">
                Select any ingredients to completely remove matching dishes from your recommendations.
              </p>
              <div className="flex flex-wrap gap-2">
                {ALLERGEN_OPTIONS.map((allergy) => {
                  const active = (formData.allergies || []).includes(allergy);
                  return (
                    <button
                      key={allergy}
                      type="button"
                      onClick={() => toggleAllergy(allergy)}
                      className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                        active
                          ? 'border-coral bg-coral/15 text-coral shadow-glow-orange'
                          : 'border-white/10 bg-dark-900/60 text-white/60 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {active ? <Check className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                      {allergy}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: OVERRIDES & REVIEW ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-dark-900/70 p-5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime">
                AI Scientific Projection
              </span>
              <div className="mt-4 grid grid-cols-4 gap-3 text-center">
                <div className="rounded-xl border border-lime/30 bg-lime/10 p-3">
                  <div className="text-[10px] font-mono uppercase text-lime">Calories</div>
                  <div className="font-mono text-xl font-bold text-lime">{targetCalories}</div>
                  <div className="text-[9px] text-white/40">kcal/day</div>
                </div>
                <div className="rounded-xl border border-coral/30 bg-coral/10 p-3">
                  <div className="text-[10px] font-mono uppercase text-coral">Protein</div>
                  <div className="font-mono text-xl font-bold text-coral">{suggestedProtein}g</div>
                  <div className="text-[9px] text-white/40">{(suggestedProtein * 4 * 100 / targetCalories).toFixed(0)}% kcal</div>
                </div>
                <div className="rounded-xl border border-turmeric/30 bg-turmeric/10 p-3">
                  <div className="text-[10px] font-mono uppercase text-turmeric">Carbs</div>
                  <div className="font-mono text-xl font-bold text-turmeric">{suggestedCarbs}g</div>
                  <div className="text-[9px] text-white/40">{(suggestedCarbs * 4 * 100 / targetCalories).toFixed(0)}% kcal</div>
                </div>
                <div className="rounded-xl border border-tangerine/30 bg-tangerine/10 p-3">
                  <div className="text-[10px] font-mono uppercase text-tangerine">Fats</div>
                  <div className="font-mono text-xl font-bold text-tangerine">{suggestedFats}g</div>
                  <div className="text-[9px] text-white/40">{(suggestedFats * 9 * 100 / targetCalories).toFixed(0)}% kcal</div>
                </div>
              </div>
            </div>

            {/* Optional Custom Overrides */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-white/60">
                  Optional Target Fine-Tuning
                </label>
                <span className="text-[11px] text-white/40">Leave blank to use clinical defaults</span>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] text-white/50">Custom Protein Target (g)</label>
                  <input
                    type="number"
                    value={formData.custom_protein_g || ''}
                    onChange={(e) => handleFieldChange('custom_protein_g', e.target.value)}
                    placeholder={`Default: ${suggestedProtein} g`}
                    className="cyber-field text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-white/50">Custom Sugar Limit (g)</label>
                  <input
                    type="number"
                    value={formData.custom_sugar_g || ''}
                    onChange={(e) => handleFieldChange('custom_sugar_g', e.target.value)}
                    placeholder="Default: 25 g max"
                    className="cyber-field text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-white/40">
              <Info className="inline h-3.5 w-3.5 mr-1 text-white/50" />
              Calculations are deterministic estimates based on Mifflin-St Jeor and WHO reference values. 
              Always consult a certified healthcare professional before starting an extreme caloric deficit.
            </div>
          </div>
        )}

        {/* Global Error message from API */}
        {error && (
          <div className="mt-6 rounded-xl border border-coral/40 bg-coral/10 p-3.5 text-xs text-coral">
            <ShieldAlert className="inline h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-1.5 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/50 transition hover:text-white"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 rounded-xl bg-lime px-6 py-2.5 font-mono text-xs font-extrabold uppercase tracking-wider text-obsidian shadow-glow-lime transition hover:scale-105 active:scale-95"
            >
              Next Step <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSubmit({ ...formData, calculated_target: targetCalories, calculated_protein: suggestedProtein })}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-lime px-8 py-3 font-mono text-xs font-extrabold uppercase tracking-wider text-obsidian shadow-glow-lime transition hover:scale-105 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Running ML Vector Engine...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate My NutriMatch Plan
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
