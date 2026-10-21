import React, { useState, useMemo } from 'react';
import {
  Compass,
  Search,
  Filter,
  ArrowUpDown,
  Apple,
  Flame,
  Dumbbell,
  Wheat,
  X,
  ShieldAlert,
  Info,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  HeartPulse,
} from 'lucide-react';
import TiltCard from './TiltCard';
import ALL_FOODS from '../data/foods.json';

const CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch, Dinner',
  'Curry',
  'Snack',
  'Appetizer',
  'Dessert',
  'Salad',
  'Soup',
  'Dal',
  'Rice',
  'Bread',
  'Beverages',
];

const DIET_TYPES = ['All', 'Veg', 'Non-Veg', 'Eggetarian'];

const ALLERGEN_LIST = ['Dairy', 'Gluten', 'Nuts', 'Soy', 'Egg'];

export default function FoodExplorer({ onSelectFoodForMeal }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDiet, setSelectedDiet] = useState('All');
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;

  // Selected food for full-screen inspection modal
  const [inspectFood, setInspectFood] = useState(null);

  const toggleAllergen = (allergy) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
    setPage(1);
  };

  // Filter and sort across all 1,630 items
  const filteredFoods = useMemo(() => {
    let result = ALL_FOODS;

    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.Food.toLowerCase().includes(q) ||
          String(f.Ingredients || '').toLowerCase().includes(q) ||
          String(f.Category || '').toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((f) =>
        String(f.Category || '').toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Diet filter
    if (selectedDiet !== 'All') {
      result = result.filter(
        (f) => String(f.Type || '').toLowerCase() === selectedDiet.toLowerCase()
      );
    }

    // Allergen exclusion
    if (selectedAllergens.length > 0) {
      result = result.filter((f) => {
        const foodAllergy = String(f.Allergy || '').toLowerCase();
        for (const a of selectedAllergens) {
          if (foodAllergy.includes(a.toLowerCase())) return false;
        }
        return true;
      });
    }

    // Sort order
    if (sortBy === 'protein_desc') {
      result = [...result].sort((a, b) => (b['Protein (g)'] || 0) - (a['Protein (g)'] || 0));
    } else if (sortBy === 'calories_asc') {
      result = [...result].sort((a, b) => (a['Energy (kcal)'] || 0) - (b['Energy (kcal)'] || 0));
    } else if (sortBy === 'calories_desc') {
      result = [...result].sort((a, b) => (b['Energy (kcal)'] || 0) - (a['Energy (kcal)'] || 0));
    } else if (sortBy === 'carbs_asc') {
      result = [...result].sort((a, b) => (a['Carbohydrates (g)'] || 0) - (b['Carbohydrates (g)'] || 0));
    } else if (sortBy === 'fibre_desc') {
      result = [...result].sort((a, b) => (b['Fibres (g)'] || 0) - (a['Fibres (g)'] || 0));
    }

    return result;
  }, [search, selectedCategory, selectedDiet, selectedAllergens, sortBy]);

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage) || 1;
  const paginatedFoods = filteredFoods.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3.5 py-1 text-xs font-mono font-bold text-lime">
          <Compass className="h-3.5 w-3.5" /> 1,630 Verified Laboratory Records
        </div>
        <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl text-silk">
          NutriMatch <span className="text-lime">Food Explorer</span>
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Query verified macronutrients and clinical micronutrients across 1,630 Indian and global foods.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel mt-8 p-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-12">
          {/* Search Input */}
          <div className="relative md:col-span-8">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search dishes (e.g. 'Paneer', 'Oats', 'Chicken', 'Dal')..."
              className="cyber-field pl-11"
            />
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-white/40" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-3.5 text-xs text-white/40 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cyber-field text-sm cursor-pointer"
            >
              <option value="default">Sort: Default Order</option>
              <option value="protein_desc">Highest Protein (g)</option>
              <option value="calories_asc">Lowest Calories (kcal)</option>
              <option value="calories_desc">Highest Calories (kcal)</option>
              <option value="carbs_asc">Lowest Carbs (g)</option>
              <option value="fibre_desc">Highest Dietary Fibre (g)</option>
            </select>
          </div>
        </div>

        {/* Diet Badges & Allergen Checkboxes */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase text-white/40">Diet:</span>
            {DIET_TYPES.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setSelectedDiet(d);
                  setPage(1);
                }}
                className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                  selectedDiet === d
                    ? 'border border-lime bg-lime/15 text-lime shadow-glow-lime'
                    : 'border border-white/10 bg-dark-900/60 text-white/60 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase text-coral">Exclude Allergens:</span>
            {ALLERGEN_LIST.map((a) => {
              const active = selectedAllergens.includes(a);
              return (
                <button
                  key={a}
                  onClick={() => toggleAllergen(a)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
                    active
                      ? 'border-coral bg-coral/20 text-coral'
                      : 'border-white/10 bg-dark-900/60 text-white/50 hover:text-white'
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'border border-white/30 bg-white/15 text-silk'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Current Active Filter Summary */}
      <div className="mt-6 flex items-center justify-between text-xs text-white/50">
        <span>
          Showing <span className="font-mono font-bold text-lime">{filteredFoods.length}</span> matching dishes
        </span>
        <span>
          Page {page} of {totalPages}
        </span>
      </div>

      {/* Grid of Food Cards */}
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedFoods.map((food, idx) => (
          <TiltCard
            key={idx}
            className="glass-card flex h-full flex-col justify-between p-5 cursor-pointer hover:border-lime/40"
            onClick={() => setInspectFood(food)}
          >
            <div>
              {/* Card Badges */}
              <div className="flex items-center justify-between">
                <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/50">
                  {food.Category || 'General'}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    food.Type === 'Non-Veg'
                      ? 'bg-coral/15 text-coral'
                      : food.Type === 'Eggetarian'
                      ? 'bg-turmeric/15 text-turmeric'
                      : 'bg-lime/15 text-lime'
                  }`}
                >
                  {food.Type}
                </span>
              </div>

              {/* Title & Serving */}
              <h3 className="mt-3 font-display text-base font-bold text-silk line-clamp-1">
                {food.Food}
              </h3>
              <p className="mt-1 text-xs text-white/40">
                Serving: <span className="text-white/70">{food.Serving || '1 Serving'}</span> ({food['Total Weight (g)'] || 100}g)
              </p>

              {/* Macro Pills */}
              <div className="mt-4 grid grid-cols-4 gap-1.5 text-center text-xs">
                <div className="rounded bg-white/[0.03] p-1.5 border border-white/5">
                  <div className="text-[8px] font-mono text-white/40">Kcal</div>
                  <div className="font-mono text-xs font-bold text-lime">{Math.round(food['Energy (kcal)'] || 0)}</div>
                </div>
                <div className="rounded bg-coral/10 p-1.5 border border-coral/20">
                  <div className="text-[8px] font-mono text-coral">Prot</div>
                  <div className="font-mono text-xs font-bold text-coral">{Math.round(food['Protein (g)'] || 0)}g</div>
                </div>
                <div className="rounded bg-turmeric/10 p-1.5 border border-turmeric/20">
                  <div className="text-[8px] font-mono text-turmeric">Carb</div>
                  <div className="font-mono text-xs font-bold text-turmeric">{Math.round(food['Carbohydrates (g)'] || 0)}g</div>
                </div>
                <div className="rounded bg-tangerine/10 p-1.5 border border-tangerine/20">
                  <div className="text-[8px] font-mono text-tangerine">Fat</div>
                  <div className="font-mono text-xs font-bold text-tangerine">{Math.round(food['Fats (g)'] || 0)}g</div>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setInspectFood(food);
              }}
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.02] py-2 text-center text-xs font-semibold text-white/70 transition hover:border-lime/30 hover:bg-lime/10 hover:text-lime"
            >
              Inspect All 17 Nutrients â†’
            </button>
          </TiltCard>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-dark-900 text-white/70 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs text-white/60 px-4">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-dark-900 text-white/70 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Deep-Dive Inspection Modal */}
      {inspectFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-fadeIn">
          <div className="glass-panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-white/20 bg-dark-900/95 p-6 sm:p-8 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-lime/10 px-2.5 py-0.5 font-mono text-xs font-bold text-lime">
                    {inspectFood.Type}
                  </span>
                  <span className="text-xs text-white/50">{inspectFood.Category}</span>
                </div>
                <h3 className="mt-2 font-display text-2xl font-black text-silk">{inspectFood.Food}</h3>
                <p className="text-xs text-white/40">
                  Standard Serving: <span className="text-white/80">{inspectFood.Serving}</span> Â· Weight:{' '}
                  <span className="text-white/80">{inspectFood['Total Weight (g)']}g</span>
                </p>
              </div>

              <button
                onClick={() => setInspectFood(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Core Macronutrient Metrics */}
            <div className="mt-6">
              <span className="text-xs font-mono uppercase text-white/50 tracking-wider">
                Macronutrient Density Profile
              </span>
              <div className="mt-3 grid grid-cols-5 gap-2 text-center">
                <div className="rounded-xl border border-lime/30 bg-lime/10 p-2.5">
                  <div className="text-[10px] font-mono uppercase text-lime">Energy</div>
                  <div className="font-mono text-lg font-bold text-lime">{inspectFood['Energy (kcal)']}</div>
                  <div className="text-[8px] text-white/40">kcal</div>
                </div>
                <div className="rounded-xl border border-coral/30 bg-coral/10 p-2.5">
                  <div className="text-[10px] font-mono uppercase text-coral">Protein</div>
                  <div className="font-mono text-lg font-bold text-coral">{inspectFood['Protein (g)']}g</div>
                  <div className="text-[8px] text-white/40">Amino acids</div>
                </div>
                <div className="rounded-xl border border-turmeric/30 bg-turmeric/10 p-2.5">
                  <div className="text-[10px] font-mono uppercase text-turmeric">Carbs</div>
                  <div className="font-mono text-lg font-bold text-turmeric">{inspectFood['Carbohydrates (g)']}g</div>
                  <div className="text-[8px] text-white/40">Energy glucose</div>
                </div>
                <div className="rounded-xl border border-tangerine/30 bg-tangerine/10 p-2.5">
                  <div className="text-[10px] font-mono uppercase text-tangerine">Fats</div>
                  <div className="font-mono text-lg font-bold text-tangerine">{inspectFood['Fats (g)']}g</div>
                  <div className="text-[8px] text-white/40">Lipid storage</div>
                </div>
                <div className="rounded-xl border border-cyber-purple/30 bg-cyber-purple/10 p-2.5">
                  <div className="text-[10px] font-mono uppercase text-cyber-violet">Sugar</div>
                  <div className="font-mono text-lg font-bold text-cyber-violet">{inspectFood['Sugar (g)']}g</div>
                  <div className="text-[8px] text-white/40">Simple carb</div>
                </div>
              </div>
            </div>

            {/* Micronutrients & Minerals Grid */}
            <div className="mt-6">
              <span className="text-xs font-mono uppercase text-lime tracking-wider flex items-center gap-1.5">
                <HeartPulse className="h-3.5 w-3.5" /> Clinical Micronutrients & Minerals
              </span>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5 text-center">
                <div className="rounded-xl bg-dark-800/80 p-3 border border-white/5">
                  <div className="text-[10px] text-white/50">Dietary Fibre</div>
                  <div className="font-mono text-base font-bold text-silk">{inspectFood['Fibres (g)']}g</div>
                </div>
                <div className="rounded-xl bg-dark-800/80 p-3 border border-white/5">
                  <div className="text-[10px] text-white/50">Calcium</div>
                  <div className="font-mono text-base font-bold text-silk">{inspectFood['Calcium (mg)']}mg</div>
                </div>
                <div className="rounded-xl bg-dark-800/80 p-3 border border-white/5">
                  <div className="text-[10px] text-white/50">Iron</div>
                  <div className="font-mono text-base font-bold text-silk">{inspectFood['Iron (mg)']}mg</div>
                </div>
                <div className="rounded-xl bg-dark-800/80 p-3 border border-white/5">
                  <div className="text-[10px] text-white/50">Vitamin C</div>
                  <div className="font-mono text-base font-bold text-silk">{inspectFood['Vitamin C (mg)']}mg</div>
                </div>
                <div className="rounded-xl bg-dark-800/80 p-3 border border-white/5">
                  <div className="text-[10px] text-white/50">Sodium</div>
                  <div className="font-mono text-base font-bold text-silk">{inspectFood['Sodium (mg)']}mg</div>
                </div>
              </div>
            </div>

            {/* Ingredients & Allergens */}
            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-white/5 bg-dark-800/50 p-3.5">
                <div className="text-xs font-mono uppercase text-white/50">Culinary Ingredients</div>
                <p className="mt-1 text-xs leading-relaxed text-white/70">
                  {inspectFood.Ingredients || 'Fresh culinary ingredients'}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-dark-800/50 px-4 py-3 text-xs">
                <span className="text-white/50">Allergen Flags:</span>
                <span className="font-mono font-semibold text-white/80">
                  {inspectFood.Allergy && inspectFood.Allergy !== 'None' ? inspectFood.Allergy : 'No registered allergens'}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInspectFood(null)}
                className="rounded-xl bg-white/10 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-silk hover:bg-white/20"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

