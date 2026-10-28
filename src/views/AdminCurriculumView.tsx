import React, { useState } from 'react';
import { Database, Copy, Check, Code, Server, FileText, Layers } from 'lucide-react';
import { A1_LESSON_UNITS, CEFR_LEVELS_INFO } from '../data/curriculum';

export const AdminCurriculumView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const migrationSqlSnippet = `-- TÜRKAI & MAHLİYO AI — Supabase PostgreSQL Schema
-- File: supabase/migrations/001_initial_schema.sql
-- Tables: profiles, lessons, exercises, lesson_progress,
--         speaking_attempts, writing_attempts, tutor_conversations,
--         tutor_messages, learner_error_patterns

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE,
    display_name TEXT NOT NULL DEFAULT 'Turk Tili O''rganuvchisi',
    native_language TEXT NOT NULL DEFAULT 'uz',
    current_cefr_level TEXT NOT NULL DEFAULT 'A1',
    total_xp INTEGER NOT NULL DEFAULT 0,
    streak_days INTEGER NOT NULL DEFAULT 1,
    audio_speed NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cefr_level TEXT NOT NULL,
    unit_order INTEGER NOT NULL,
    title_uz TEXT NOT NULL,
    title_tr TEXT NOT NULL,
    description_uz TEXT NOT NULL,
    grammar_notes_uz TEXT NOT NULL,
    vocabulary_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    example_dialogues_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(cefr_level, unit_order)
);

-- RLS yoqilgan va xavfsiz siyosatlar o'rnatilgan.`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(migrationSqlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>Ma'lumotlar Bazasi va Arxitektura</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admin & Supabase PostgreSQL Boshqaruvi
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Mahliyo AI va TÜRKAI platformasining relyatsion ma'lumotlar modeli, RLS xavfsizlik qoidalari hamda darslar tuzilmasi.
            </p>
          </div>
        </div>
      </div>

      {/* SQL Migration & Supabase Setup Card */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Code className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Supabase Migratsiya Fayli: <code>001_initial_schema.sql</code>
            </h2>
          </div>

          <button
            onClick={handleCopySql}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Nusxa olindi!' : 'SQL dan nusxa olish'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          <pre>{migrationSqlSnippet}</pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-emerald-400 block">1. Row Level Security (RLS)</span>
            <p className="text-slate-400 text-[11px]">
              Har bir foydalanuvchi faqat o'z shaxsiy yozuvlari, suhbatlari va urinishlarini ko'ra oladi.
            </p>
          </div>
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-teal-400 block">2. Mahalliy Demo Rejim</span>
            <p className="text-slate-400 text-[11px]">
              Tashqi Supabase kalitlari mavjud bo'lmaganda tizim local sync va Express sessiyalari bilan to'liq ishlaydi.
            </p>
          </div>
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-pink-400 block">3. Mahliyo Xotirasi</span>
            <p className="text-slate-400 text-[11px]">
              O'quvchining unlilar uyg'unligi yoki zamonlar bo'yicha xato modellari alohida jadvalda saqlanadi.
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum Units Overview */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Faol Darslar Tuzilmasi ({A1_LESSON_UNITS.length} ta birlik)</span>
        </h2>

        <div className="divide-y divide-slate-800">
          {A1_LESSON_UNITS.map((unit) => (
            <div key={unit.id} className="py-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white">{unit.titleUz}</span>
                <span className="text-slate-400 ml-2 font-mono">({unit.titleTr})</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span>{unit.vocabulary.length} ta so'z</span>
                <span>{unit.exercises.length} ta test</span>
                <span className="text-emerald-400 font-semibold">{unit.cefrLevel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
