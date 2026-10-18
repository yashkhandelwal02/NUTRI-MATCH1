import React, { useState } from 'react';
import { Sparkles, Utensils, PieChart, Compass, Calendar, Sliders, Menu, X, Zap } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, hasPlan }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { key: 'landing', label: 'Home', icon: Sparkles },
    { key: 'personalize', label: 'Personalize', icon: Sliders },
    { key: 'dashboard', label: 'Dashboard', icon: PieChart, requirePlan: true },
    { key: 'planner', label: 'Meal Planner', icon: Calendar, requirePlan: true },
    { key: 'explorer', label: 'Food Explorer', icon: Compass },
    { key: 'analytics', label: 'Analytics', icon: Utensils, requirePlan: true },
  ];

  const handleNav = (key) => {
    setCurrentView(key);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/[0.08] bg-dark-900/80 px-5 py-3.5 backdrop-blur-xl shadow-glass">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('landing')}
          className="group flex items-center gap-3 text-left outline-none"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime to-cyber-purple p-[1px] shadow-glow-lime">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-dark-900">
              <Zap className="h-5 w-5 text-lime transition-transform group-hover:scale-110" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-lime ring-2 ring-dark-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-extrabold tracking-tight text-silk">
                Nutri<span className="text-lime">Match</span>
              </span>
              <span className="hidden rounded-full border border-lime/30 bg-lime/10 px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider text-lime uppercase sm:inline-block">
                AI 2.0
              </span>
            </div>
            <p className="text-[11px] font-medium text-white/40">Personalized Nutrition Engine</p>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Main Navigation">
          {navItems.map(({ key, label, icon: Icon, requirePlan }) => {
            const active = currentView === key;
            const disabled = requirePlan && !hasPlan;

            return (
              <button
                key={key}
                onClick={() => !disabled && handleNav(key)}
                disabled={disabled}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  active
                    ? 'border border-lime/40 bg-lime/15 text-lime shadow-glow-lime'
                    : disabled
                    ? 'cursor-not-allowed text-white/20'
                    : 'text-white/70 hover:border hover:border-white/10 hover:bg-white/[0.04] hover:text-silk'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? 'text-lime' : disabled ? 'text-white/20' : 'text-white/50'}`} />
                {label}
                {disabled && (
                  <span className="rounded bg-white/5 px-1 py-0.2 text-[9px] text-white/30 font-mono">
                    Locked
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Status */}
        <div className="hidden items-center gap-4 lg:flex">
          <div className="flex items-center gap-2 border-r border-white/10 pr-4">
            <span className="h-2 w-2 rounded-full bg-lime animate-ping" />
            <span className="font-mono text-xs text-white/50">ML Model: Online</span>
          </div>

          <button
            onClick={() => handleNav('personalize')}
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-lime px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-obsidian transition-all duration-300 hover:shadow-glow-lime hover:brightness-105 active:scale-95"
          >
            <span>{hasPlan ? 'Edit Plan' : 'Build Plan'}</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-silk md:hidden"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/10 bg-dark-900/95 p-4 backdrop-blur-2xl shadow-glass md:hidden">
          <div className="space-y-1.5">
            {navItems.map(({ key, label, icon: Icon, requirePlan }) => {
              const active = currentView === key;
              const disabled = requirePlan && !hasPlan;

              return (
                <button
                  key={key}
                  onClick={() => !disabled && handleNav(key)}
                  disabled={disabled}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    active
                      ? 'border border-lime/40 bg-lime/10 text-lime'
                      : disabled
                      ? 'text-white/20'
                      : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </div>
                  {disabled && <span className="text-xs text-white/30">Generate Plan First</span>}
                </button>
              );
            })}
            
            <div className="pt-3">
              <button
                onClick={() => handleNav('personalize')}
                className="w-full rounded-xl bg-lime py-3 text-center text-xs font-extrabold uppercase tracking-wider text-obsidian"
              >
                {hasPlan ? 'Customize Plan' : 'Build My Meal Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
