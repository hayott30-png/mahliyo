import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Mic,
  PenTool,
  Sparkles,
  BookOpen,
  BarChart3,
  Settings,
  Database,
  X,
  Flame,
  Trophy,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  totalXp: number;
  isMahliyoAuthenticated: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpen,
  onClose,
  streakDays,
  totalXp,
  isMahliyoAuthenticated,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Bosh Sahifa', icon: LayoutDashboard },
    { id: 'curriculum', label: 'Darsliklar (A1-C2)', icon: GraduationCap },
    { id: 'speaking', label: 'Nutq Laboratoriyasi', icon: Mic },
    { id: 'writing', label: 'Yozma Baholash', icon: PenTool },
    { id: 'mahliyo', label: 'Mahliyo AI Repetitor', icon: Sparkles, highlight: true },
    { id: 'vocabulary', label: "Lug'at Banki", icon: BookOpen },
    { id: 'analytics', label: 'Natijalar & Statistika', icon: BarChart3 },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
    { id: 'admin', label: 'Admin & Supabase Baza', icon: Database },
  ];

  const handleSelect = (id: string) => {
    setCurrentTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isOpen ? 'block' : 'hidden lg:flex'}`}
      >
        <div className="p-5 flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-white text-base">
                T
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white block">TÜRKAI</span>
                <span className="text-[11px] text-slate-400 block -mt-1">Turk Tili Platformasi</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick stats on mobile */}
          <div className="lg:hidden my-4 p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-around">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{streakDays} kun ketma-ket</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-800" />
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>{totalXp} XP</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold'
                      : item.highlight
                      ? 'text-pink-300 hover:bg-pink-500/10 hover:text-pink-200'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-emerald-400'
                        : item.highlight
                        ? 'text-pink-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                  {item.highlight && isMahliyoAuthenticated && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400" title="Ulangan"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom user card */}
          <div className="pt-4 border-t border-slate-800 mt-auto">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-emerald-400">
                UZ
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">O'quvchi</p>
                <p className="text-[11px] text-slate-400 truncate">O'zbekcha interfeys</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
