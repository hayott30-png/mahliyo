import React from 'react';
import {
  Flame,
  Trophy,
  GraduationCap,
  Sparkles,
  Mic,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Calendar,
  Compass,
} from 'lucide-react';
import { CefrLevel } from '../types';
import { A1_LESSON_UNITS, CEFR_LEVELS_INFO } from '../data/curriculum';

interface DashboardViewProps {
  currentCefr: CefrLevel;
  totalXp: number;
  streakDays: number;
  completedLessons: string[];
  lessonScores: Record<string, number>;
  onNavigate: (tab: string) => void;
  onOpenMahliyo: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentCefr,
  totalXp,
  streakDays,
  completedLessons,
  lessonScores,
  onNavigate,
  onOpenMahliyo,
}) => {
  // Find next unfinished lesson in A1
  const nextLesson =
    A1_LESSON_UNITS.find((u) => !completedLessons.includes(u.id)) || A1_LESSON_UNITS[0];

  const completionPercentage = Math.round(
    (completedLessons.length / (A1_LESSON_UNITS.length || 1)) * 100
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Xush Kelibsiz, O'quvchi!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Turk Tili Safaringiz Davom Etmoqda
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Bugungi darslarni o'zlashtiring, yangi so'zlarni mashq qiling va Mahliyo AI bilan erkin muloqot qiling.
            </p>
          </div>

          <button
            onClick={onOpenMahliyo}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-pink-500/30 hover:border-pink-500/60 transition-all text-left group shadow-lg shrink-0"
          >
            <div className="relative">
              <img
                src="/src/assets/images/mahliyo_tutor_avatar_1793208119384.jpg"
                alt="Mahliyo AI"
                className="w-12 h-12 rounded-xl object-cover border border-pink-500/40"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Mahliyo AI Bilan Gaplashish</span>
              </div>
              <p className="text-[11px] text-slate-400">Turkcha jonli muloqot & yordam</p>
            </div>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-[#111C30] border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Ketma-ketlik</span>
            <span className="text-xl font-extrabold text-white font-mono tabular-nums">
              {streakDays} kun
            </span>
          </div>
        </div>

        {/* Total XP */}
        <div className="bg-[#111C30] border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Jami Ball (XP)</span>
            <span className="text-xl font-extrabold text-white font-mono tabular-nums">
              {totalXp} XP
            </span>
          </div>
        </div>

        {/* Level */}
        <div className="bg-[#111C30] border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Hozirgi Bosqich</span>
            <span className="text-xl font-extrabold text-white font-mono">
              {currentCefr} (Boshlang'ich)
            </span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-[#111C30] border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Yakunlangan Darslar</span>
            <span className="text-xl font-extrabold text-white font-mono tabular-nums">
              {completedLessons.length} / {A1_LESSON_UNITS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Split: Next Lesson Banner & Quick Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Lesson Card (2 cols) */}
        <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-emerald-400 font-bold uppercase tracking-wider font-mono">
                Navbatdagi Dars · Bo'lim 0{nextLesson.unitOrder}
              </span>
              <span className="text-slate-400">{nextLesson.estimatedMinutes} daqiqa</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{nextLesson.titleUz}</h3>
            <p className="text-xs text-emerald-400 font-semibold mb-3">{nextLesson.titleTr}</p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {nextLesson.descriptionUz}
            </p>

            {/* Progress bar */}
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>A1 Kursi Bo'yicha Taraqqiyot</span>
                <span className="font-mono font-semibold text-white">{completionPercentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Grammatika, {nextLesson.vocabulary.length} ta yangi so'z va test
            </span>
            <button
              onClick={() => onNavigate('curriculum')}
              className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <span>Darsga O'tish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Module Shortcuts */}
        <div className="space-y-4">
          {/* Speaking Lab Box */}
          <div
            onClick={() => onNavigate('speaking')}
            className="p-5 rounded-2xl bg-[#111C30] border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Nutq Laboratoriyasi
                </h4>
                <p className="text-[11px] text-slate-400">Talaffuz va jonli mikrofon mashqi</p>
              </div>
            </div>
          </div>

          {/* Vocabulary Box */}
          <div
            onClick={() => onNavigate('vocabulary')}
            className="p-5 rounded-2xl bg-[#111C30] border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
                  Lug'at Banki
                </h4>
                <p className="text-[11px] text-slate-400">Turkcha so'zlar va audiosi</p>
              </div>
            </div>
          </div>

          {/* Writing Box */}
          <div
            onClick={() => onNavigate('writing')}
            className="p-5 rounded-2xl bg-[#111C30] border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                  Yozma Baholash
                </h4>
                <p className="text-[11px] text-slate-400">Insho va fikr bildirish tahlili</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
