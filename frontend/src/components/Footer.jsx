import React from 'react';
import { Zap, Heart, ShieldCheck, Cpu, Code2, Database } from 'lucide-react';

export default function Footer({ setCurrentView }) {
  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-dark-900/90 pt-16 pb-12 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-lime to-cyber-purple p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-dark-900">
                  <Zap className="h-4 w-4 text-lime" />
                </div>
              </div>
              <span className="font-display text-2xl font-black tracking-tight text-silk">
                Nutri<span className="text-lime">Match</span>
              </span>
            </div>
            
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              Next-generation AI nutrition platform combining biometric Mifflin-St Jeor calculations, 
              StandardScaler normalization, and multi-dimensional cosine similarity across 
              1,729 verified foods.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-mono text-white/70">
                <Cpu className="h-3 w-3 text-lime" /> FastAPI Backend
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-mono text-white/70">
                <Database className="h-3 w-3 text-cyber-violet" /> 1,729 Food DB
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-mono text-white/70">
                <Code2 className="h-3 w-3 text-tangerine" /> Scikit-Learn Scaler
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-lime">Explore Platform</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li>
                <button
                  onClick={() => setCurrentView('landing')}
                  className="transition hover:text-lime"
                >
                  Overview & Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('personalize')}
                  className="transition hover:text-lime"
                >
                  Personalization Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('explorer')}
                  className="transition hover:text-lime"
                >
                  Search 1,729 Food Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="transition hover:text-lime"
                >
                  AI Macro Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Validation & Transparency */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-cyber-violet">Science & Trust</h4>
            <div className="mt-4 rounded-xl border border-white/10 bg-dark-800/50 p-3.5 text-xs text-white/60">
              <div className="flex items-center gap-2 font-semibold text-white/80">
                <ShieldCheck className="h-4 w-4 text-lime" /> Zero Hallucinations
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/50">
                All nutritional values are calculated from measured laboratory datasets and clinical biometric equations.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© 2026 NutriMatch AI — Academic, Hackathon & Startup Showcase Edition.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="h-3.5 w-3.5 text-coral fill-coral inline" /> for precision human health.
          </p>
        </div>
      </div>
    </footer>
  );
}
