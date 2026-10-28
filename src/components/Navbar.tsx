import React from 'react';
import { Sparkles, Flame, Trophy, Volume2, Shield } from 'lucide-react';
import { CefrLevel } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  streakDays: number;
  totalXp: number;
  currentLevel: CefrLevel;
  isMahliyoAuthenticated: boolean;
  onOpenMahliyo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  streakDays,
  totalXp,
  currentLevel,
  isMahliyoAuthenticated,
  onOpenMahliyo,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#080F1E]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-lg">
              T
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                TÜRK<span className="text-emerald-400">AI</span>
              </span>
            </div>
          </button>
          
          <div className="hidden sm:flex items-center text-xs text-slate-400">
            <span className="text-slate-600">·</span>
            <span className="ml-2 font-mono text-emerald-400/90 font-semibold">{currentLevel} Bosqich</span>
          </div>
        </div>

        {/* Zone 2: Single-line Clean Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'dashboard' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Boshqaruv Paneli
          </button>
          <button
            onClick={() => setCurrentTab('curriculum')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'curriculum' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Darsliklar (A1-C2)
          </button>
          <button
            onClick={() => setCurrentTab('speaking')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'speaking' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Nutq Laboratoriyasi
          </button>
          <button
            onClick={() => setCurrentTab('writing')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'writing' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Yozma Baholash
          </button>
          <button
            onClick={() => setCurrentTab('vocabulary')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'vocabulary' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Lug'at Banki
          </button>
          <button
            onClick={() => setCurrentTab('analytics')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'analytics' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Statistika
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Mahliyo AI entry button) + Quiet stats */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Gamification Stats */}
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-300 mr-2">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono tabular-nums font-semibold">{streakDays} kun</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono tabular-nums font-semibold">{totalXp} XP</span>
            </div>
          </div>

          {/* Primary Action Button: Mahliyo AI */}
          <button
            onClick={onOpenMahliyo}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0 ${
              isMahliyoAuthenticated
                ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 text-white shadow-pink-500/20 hover:brightness-110'
                : 'bg-slate-900 border border-pink-500/40 text-pink-300 hover:bg-pink-500/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
            <span>Mahliyo AI</span>
            {isMahliyoAuthenticated ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
            ) : (
              <Shield className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
