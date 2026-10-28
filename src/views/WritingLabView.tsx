import React, { useState, useEffect } from 'react';
import {
  PenTool,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  BookOpen,
  Award,
  AlertCircle,
  Clock,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { CefrLevel, WritingTask, WritingAttemptRecord } from '../types';
import { WRITING_TASKS } from '../data/curriculum';

interface WritingLabViewProps {
  currentCefr: CefrLevel;
  onCefrChange: (level: CefrLevel) => void;
}

export const WritingLabView: React.FC<WritingLabViewProps> = ({
  currentCefr,
  onCefrChange,
}) => {
  const [selectedTask, setSelectedTask] = useState<WritingTask>(WRITING_TASKS[0]);
  const [essayText, setEssayText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<WritingAttemptRecord | null>(null);
  const [writingHistory, setWritingHistory] = useState<WritingAttemptRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;
  const isLengthAdequate = wordCount >= selectedTask.minWords;

  useEffect(() => {
    const saved = localStorage.getItem('turkai_writing_history');
    if (saved) {
      try {
        setWritingHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load writing history', e);
      }
    }
  }, []);

  const handleTaskSelect = (task: WritingTask) => {
    setSelectedTask(task);
    setEssayText('');
    setAssessmentResult(null);
    setErrorMessage(null);
  };

  const handleSubmitWriting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!essayText.trim()) {
      setErrorMessage("Iltimos, insho matnini kiriting.");
      return;
    }

    if (wordCount < 10) {
      setErrorMessage("Matn juda qisqa. Kamida 10-15 ta so'z yozish tavsiya etiladi.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/writing/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: selectedTask.titleUz,
          submittedText: essayText.trim(),
          cefrLevel: selectedTask.cefrLevel,
        }),
      });

      if (!res.ok) {
        throw new Error('Assessment failed');
      }

      const data = await res.json();

      const newRecord: WritingAttemptRecord = {
        id: `w_att_${Date.now()}`,
        taskId: selectedTask.id,
        topicTitle: selectedTask.titleUz,
        submittedText: essayText.trim(),
        wordCount: data.wordCount || wordCount,
        overallScore: data.overallScore,
        taskAchievementScore: data.taskAchievementScore,
        coherenceScore: data.coherenceScore,
        vocabularyScore: data.vocabularyScore,
        grammarScore: data.grammarScore,
        feedbackUz: data.feedbackUz,
        corrections: data.corrections || [],
        suggestedRewriteTr: data.suggestedRewriteTr,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setAssessmentResult(newRecord);
      const updated = [newRecord, ...writingHistory].slice(0, 10);
      setWritingHistory(updated);
      localStorage.setItem('turkai_writing_history', JSON.stringify(updated));
    } catch (err) {
      console.error('Writing assessment error:', err);
      setErrorMessage("Yozma ishni baholashda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <PenTool className="w-3.5 h-3.5" />
              <span>Yozma Ishlar va Insholar Bahosi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              CEFR Mezonlari Asosida Yozma Nutqni Baholash
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Mavzuni tanlang, turk tilida erkin fikringizni yozing va Gemini AI orqali vazifaga moslik, bog'lanish, lug'at boyligi hamda grammatik tahlil oling.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Task Selector + Essay Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tasks */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Insho Mavzulari
          </h2>

          <div className="space-y-2.5">
            {WRITING_TASKS.map((task) => {
              const isSelected = selectedTask.id === task.id;
              return (
                <button
                  key={task.id}
                  onClick={() => handleTaskSelect(task)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-[#111C30] border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                      : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white">{task.titleUz}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {task.cefrLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{task.promptTr}</p>
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    Kamida {task.minWords} so'z
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Writing Editor & Result */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Task Form Card */}
          <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                Tanlangan Mavzu: {selectedTask.titleUz} ({selectedTask.cefrLevel})
              </span>
              <p className="text-sm font-bold text-white font-mono">{selectedTask.promptTr}</p>
              <p className="text-xs text-slate-400 mt-1">{selectedTask.instructionsUz}</p>
            </div>

            <form onSubmit={handleSubmitWriting} className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <label htmlFor="essay_textarea" className="font-medium text-slate-300">
                    Turkcha Matningiz:
                  </label>
                  <span
                    className={`font-mono tabular-nums font-semibold ${
                      isLengthAdequate ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {wordCount} / {selectedTask.minWords} so'z
                  </span>
                </div>

                <textarea
                  id="essay_textarea"
                  rows={7}
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  placeholder="Turk tilida fikringizni yozing (masalan: Merhaba, ben ve ailem Taşkent'te yaşıyoruz...)"
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEssayText('');
                    setAssessmentResult(null);
                  }}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tozalash</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || wordCount < 5}
                  className="py-2.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Inshoni Baholash</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Assessment Result Card */}
          {assessmentResult && (
            <div className="bg-[#111C30] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-extrabold text-xl text-emerald-400 tabular-nums">
                    {assessmentResult.overallScore}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">CEFR Yozma Ish Bahosi</h3>
                    <p className="text-xs text-slate-400">
                      Jami {assessmentResult.wordCount} ta so'z tahlil qilindi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{assessmentResult.createdAt}</span>
                </div>
              </div>

              {/* Rubric Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Vazifaga Moslik</span>
                  <span className="text-lg font-bold text-emerald-400 tabular-nums">
                    {assessmentResult.taskAchievementScore}%
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Mantiq & Bog'liqlik</span>
                  <span className="text-lg font-bold text-teal-400 tabular-nums">
                    {assessmentResult.coherenceScore}%
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">So'z Boyligi</span>
                  <span className="text-lg font-bold text-indigo-400 tabular-nums">
                    {assessmentResult.vocabularyScore}%
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Grammatika</span>
                  <span className="text-lg font-bold text-pink-400 tabular-nums">
                    {assessmentResult.grammarScore}%
                  </span>
                </div>
              </div>

              {/* Uzbek Feedback */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Ustoz Xulosasi (O'zbek tilida):
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{assessmentResult.feedbackUz}</p>
              </div>

              {/* Corrections if any */}
              {assessmentResult.corrections.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Grammatik Tuzatishlar:</span>
                  </h4>
                  <div className="space-y-2">
                    {assessmentResult.corrections.map((corr, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="line-through text-red-400 font-mono text-[11px]">{corr.original}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-emerald-400 font-bold font-mono text-[11px]">{corr.corrected}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{corr.explanationUz}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Polished Rewrite */}
              {assessmentResult.suggestedRewriteTr && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1.5">
                    Mukammal Qayta Yozilgan Namuna (Turkcha):
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {assessmentResult.suggestedRewriteTr}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
