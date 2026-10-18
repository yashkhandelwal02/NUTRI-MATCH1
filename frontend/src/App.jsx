import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import PersonalizationWizard from './components/PersonalizationWizard';
import Dashboard from './components/Dashboard';
import MealPlanner from './components/MealPlanner';
import FoodExplorer from './components/FoodExplorer';
import AnalyticsPage from './components/AnalyticsPage';
import Scene3D from './components/Scene3D';
import Footer from './components/Footer';
import { getMealRecommendations } from './api';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    age: 24,
    gender: 'Male',
    weight_kg: 70,
    height_cm: 175,
    activity_level: 'Moderately Active',
    goal: 'Weight Loss',
    dietary_preference: 'Veg',
    allergies: [],
    custom_calories: null,
    custom_protein_g: null,
    custom_fat_g: null,
    custom_sugar_g: null,
  });

  const handleGeneratePlan = async (customPayload) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...formData,
        ...customPayload,
        age: Number(formData.age),
        weight_kg: Number(formData.weight_kg),
        height_cm: Number(formData.height_cm),
        custom_protein_g: formData.custom_protein_g ? Number(formData.custom_protein_g) : null,
        custom_sugar_g: formData.custom_sugar_g ? Number(formData.custom_sugar_g) : null,
      };

      const data = await getMealRecommendations(payload);
      setResult(data);
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err?.message || 'Error generating plan. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  const macros = result?.target_macros;

  return (
    <div className="relative min-h-screen bg-obsidian font-sans text-silk selection:bg-lime selection:text-obsidian">
      {/* Dynamic 3D Nutrient Canvas */}
      <Scene3D macros={macros} busy={loading} />

      {/* Main Foreground Container */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between">
        {/* Futuristic Navbar */}
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          hasPlan={Boolean(result)}
        />

        {/* View Routing */}
        <main className="flex-1">
          {currentView === 'landing' && (
            <LandingPage
              onStartPersonalize={() => setCurrentView('personalize')}
              onExploreFoods={() => setCurrentView('explorer')}
              hasPlan={Boolean(result)}
              onGoToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'personalize' && (
            <PersonalizationWizard
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleGeneratePlan}
              loading={loading}
              error={error}
              onCancel={() => setCurrentView(result ? 'dashboard' : 'landing')}
            />
          )}

          {currentView === 'dashboard' && (
            <Dashboard
              result={result}
              formData={formData}
              onNavigateToPlanner={() => setCurrentView('planner')}
              onNavigateToExplorer={() => setCurrentView('explorer')}
              onEditBiometrics={() => setCurrentView('personalize')}
            />
          )}

          {currentView === 'planner' && (
            <MealPlanner
              result={result}
              formData={formData}
              onRegenerate={() => handleGeneratePlan()}
              onNavigateToExplorer={() => setCurrentView('explorer')}
              onNavigateToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'explorer' && (
            <FoodExplorer
              onSelectFoodForMeal={(food, slot) => {
                setCurrentView('planner');
              }}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsPage
              result={result}
              formData={formData}
              onNavigateToPlanner={() => setCurrentView('planner')}
              onNavigateToPersonalize={() => setCurrentView('personalize')}
              onNavigateToExplorer={() => setCurrentView('explorer')}
            />
          )}
        </main>

        {/* Futuristic Startup Footer */}
        <Footer setCurrentView={setCurrentView} />
      </div>
    </div>
  );
}
