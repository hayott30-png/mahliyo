import React from 'react';
import {
  Sparkles,
  BookOpen,
  Mic,
  PenTool,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  Award,
} from 'lucide-react';
import { CefrLevel } from '../types';
import { CEFR_LEVELS_INFO } from '../data/curriculum';

interface LandingViewProps {
  onStartLearning: () => void;
  onOpenMahliyo: () => void;
  onSelectLevel: (lvl: CefrLevel) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartLearning,
  onOpenMahliyo,
  onSelectLevel,
}) => {
  return (
    <div className="space-y-16 py-6 animate-fadeIn">
      {/* Hero Section with Istanbul Dusk Visual */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#0F172A]">
        {/* Background Image Scrim */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/src/assets/images/turkai_hero_istanbul_1793208121359.jpg"
            alt="Istanbul Bosphorus Twilight"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080F1E] via-[#080F1E]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>O'zbeklar Uchun Bepul Turk Tili Ta'lim Platformasi</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-3xl mx-auto">
            O'zbek Tilidan <span className="text-emerald-400">Turk Tiliga</span> Erkin va Ravon Qadam
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Qardosh tillar uyg'unligi, A1–C2 to'liq CEFR dasturi, jonli Nutq Laboratoriyasi hamda maxsus <strong className="text-pink-400">Mahliyo AI</strong> repetitori bilan turk tilini mukammal o'zlashtiring.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStartLearning}
              className="py-3.5 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-95"
            >
              <span>A1 Darslarni Boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenMahliyo}
              className="py-3.5 px-6 rounded-2xl bg-slate-900/90 hover:bg-pink-500/10 border border-pink-500/40 text-pink-300 font-bold text-sm shadow-xl backdrop-blur-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Mahliyo AI Bilan Gaplashish</span>
            </button>
          </div>

          {/* Trust stats unboxed */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-slate-400">
            <div>
              <span className="font-extrabold text-white text-base font-mono block">6 Bosqich</span>
              <span>A1 dan C2 gacha</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-800" />
            <div>
              <span className="font-extrabold text-emerald-400 text-base font-mono block">100% Bepul</span>
              <span>O'zbekcha tushuntirish</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-800" />
            <div>
              <span className="font-extrabold text-pink-400 text-base font-mono block">Mahliyo AI</span>
              <span>Shaxsiy suhbatdosh</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Platformaning Asosiy Imkoniyatlari</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Turk va o'zbek tillari ildizdosh bo'lgani bois o'rganish tezligi 3 barobar osonlashadi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Mahliyo AI */}
          <div className="bg-[#111C30] border border-pink-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Mahliyo AI Repetitor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maxfiy kod bilan kiriluvchi ayol repetitor. Xatolarni mehr va engil hazil bilan tuzatadi, o'zbek tilida tushuntiradi va o'quvchi darajasiga moslashadi.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={onOpenMahliyo}
                className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1.5"
              >
                <span>Muloqotga kirish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Speaking Lab */}
          <div className="bg-[#111C30] border border-emerald-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Nutq Laboratoriyasi</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mikrofonga gapiring, turkcha transkripsiyangizni oling va Gemini AI orqali leksik aniqlik, grammatika va ravonlik bo'yicha mustahkam baholash oling.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={onStartLearning}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
              >
                <span>Laboratoriyani ko'rish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: CEFR A1-C2 */}
          <div className="bg-[#111C30] border border-indigo-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">CEFR Standart Dasturi</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A1 dan C2 gacha izchil o'quv yo'li. Unlilar uyg'unligi, hozirgi, o'tgan va kelasi zamonlar, dialoglar, lug'at va avtomatik tekshiriluvchi testlar.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={onStartLearning}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
              >
                <span>Darslarni ko'rish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CEFR Level Breakdown Section */}
      <section className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">CEFR Xalqaro Bosqichlar</h2>
            <p className="text-xs text-slate-400 mt-1">Har bir darajadagi leksik maqsad va grammatik fokus</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CEFR_LEVELS_INFO.map((item) => (
            <div
              key={item.level}
              onClick={() => onSelectLevel(item.level)}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                  {item.level}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {item.targetVocab}+ so'z
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-200">{item.titleUz}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.descriptionUz}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
