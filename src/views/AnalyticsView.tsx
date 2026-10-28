import React from 'react';
import {
  BarChart3,
  Trophy,
  Flame,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { CefrLevel } from '../types';
import { A1_LESSON_UNITS } from '../data/curriculum';

interface AnalyticsViewProps {
  currentCefr: CefrLevel;
  totalXp: number;
  streakDays: number;
  completedLessons: string[];
  lessonScores: Record<string, number>;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  currentCefr,
  totalXp,
  streakDays,
  completedLessons,
  lessonScores,
}) => {
  const avgScore =
    completedLessons.length > 0
      ? Math.round(
          completedLessons.reduce((acc, id) => acc + (lessonScores[id] || 0), 0) /
            completedLessons.length
        )
      : 0;

  const competencies = [
    { name: "Grammatika va Singarmonizm", score: completedLessons.length > 0 ? 88 : 30, color: 'emerald' },
    { name: "Kundalik Leksika (Lug'at)", score: completedLessons.length > 0 ? 92 : 25, color: 'teal' },
    { name: "Nutq va Talaffuz (Speaking Lab)", score: 80, color: 'indigo' },
    { name: "Tinglab Tushunish (Audio)", score: 85, color: 'pink' },
    { name: "Yozma Fikr Bildirish (Writing)", score: 75, color: 'amber' },
  ];

  const commonMistakesGuide = [
    {
      title: "Unlilar uyg'unligi (Büyük Ünlü Uyumu)",
      wrong: "Kitap-ler, Araba-de",
      correct: "Kitap-lar, Araba-da",
      note: "Turk tilida so'nggi unli qalin (a, ı, o, u) bo'lsa, qo'shimcha ham qalin bo'lishi shart.",
    },
    {
      title: "Yumshoq Ğ harfi talaffuzi",
      wrong: "Dag (qattiq g bilan)",
      correct: "Dağ (o'zidan oldingi 'a' unlisini cho'zib aytiladi: Da-a)",
      note: "'Ğ' harfi hech qachon alohida tovush bo'lib o'qilmaydi, unlini uzaytiradi.",
    },
    {
      title: "Hozirgi zamon -iyor qo'shimchasida torayish",
      wrong: "Başla-yor",
      correct: "Başl-ı-yor (boshlayapti)",
      note: "'a' yoki 'e' harfi bilan tugagan fe'llarda unli torayib 'ı, i, u, ü' ga aylanadi.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>O'quvchi Rivojlanishi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Statistika va Malaka Tahlili
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Darslar, test natijalari va nutq mashqlari asosida to'plangan umumiy taraqqiyot ko'rsatkichlaringiz.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Jami XP Ballar</span>
            <span className="text-2xl font-black text-white font-mono tabular-nums">{totalXp} XP</span>
            <span className="text-[11px] text-emerald-400 block mt-0.5">Top 5% o'quvchilar safiga yaqin</span>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Ketma-ket Kunlar</span>
            <span className="text-2xl font-black text-white font-mono tabular-nums">{streakDays} kun</span>
            <span className="text-[11px] text-amber-400 block mt-0.5">Har kuni muntazam dars</span>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">O'rtacha Test Natijasi</span>
            <span className="text-2xl font-black text-white font-mono tabular-nums">{avgScore}%</span>
            <span className="text-[11px] text-teal-400 block mt-0.5">
              {completedLessons.length} ta dars testdan o'tgan
            </span>
          </div>
        </div>
      </div>

      {/* Competencies Progress Bars */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">CEFR Ko'nikmalar Holati</h2>
          <p className="text-xs text-slate-400">Turk tili bo'yicha 5 ta asosiy yo'nalish bahosi</p>
        </div>

        <div className="space-y-4">
          {competencies.map((comp) => (
            <div key={comp.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{comp.name}</span>
                <span className="font-mono tabular-nums font-bold text-white">{comp.score}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${comp.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequent Error Patterns Guide */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">
            O'zbek O'quvchilari Uchun Ko'p Uchraydigan Xatolar va Yechimlar
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {commonMistakesGuide.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <h3 className="font-bold text-white text-xs">{item.title}</h3>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-red-400 line-through">
                  <span>❌ {item.wrong}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span>✅ {item.correct}</span>
                </div>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed pt-1 border-t border-slate-800">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
