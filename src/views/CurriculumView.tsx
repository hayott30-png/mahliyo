import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Volume2,
  HelpCircle,
  Award,
  ArrowRight,
  Sparkles,
  Lock,
  ChevronRight,
  X,
  RotateCcw,
} from 'lucide-react';
import { CefrLevel, LessonUnit, ExerciseItem } from '../types';
import { CEFR_LEVELS_INFO, A1_LESSON_UNITS } from '../data/curriculum';
import { speakTurkish, stopSpeaking } from '../services/speech';

interface CurriculumViewProps {
  currentCefr: CefrLevel;
  onCefrChange: (level: CefrLevel) => void;
  completedLessons: string[];
  lessonScores: Record<string, number>;
  onCompleteLesson: (lessonId: string, score: number) => void;
  audioSpeed: number;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  currentCefr,
  onCefrChange,
  completedLessons,
  lessonScores,
  onCompleteLesson,
  audioSpeed,
}) => {
  const [activeLesson, setActiveLesson] = useState<LessonUnit | null>(null);
  const [activeLessonTab, setActiveLessonTab] = useState<'grammar' | 'vocab' | 'dialogue' | 'quiz'>('grammar');

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const levelInfo = CEFR_LEVELS_INFO.find((l) => l.level === currentCefr) || CEFR_LEVELS_INFO[0];

  const handleOpenLesson = (lesson: LessonUnit) => {
    setActiveLesson(lesson);
    setActiveLessonTab('grammar');
    setCurrentQuizIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleCloseLesson = () => {
    stopSpeaking();
    setActiveLesson(null);
  };

  const handlePlayVocab = (text: string) => {
    speakTurkish(text, audioSpeed);
  };

  // Submit Quiz
  const handleAnswerSelect = (exerciseId: string, answer: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [exerciseId]: answer }));
  };

  const handleFinishQuiz = () => {
    if (!activeLesson) return;
    let earnedPoints = 0;
    let totalPoints = 0;

    activeLesson.exercises.forEach((ex) => {
      totalPoints += ex.points;
      if (selectedAnswers[ex.id]?.trim().toLowerCase() === ex.correctAnswer.trim().toLowerCase()) {
        earnedPoints += ex.points;
      }
    });

    const percentage = Math.round((earnedPoints / (totalPoints || 1)) * 100);
    setQuizScore(percentage);
    setQuizSubmitted(true);

    if (percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      onCompleteLesson(activeLesson.id, percentage);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Header with CEFR Level Tabs */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CEFR Ta'lim Dasturi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {levelInfo.titleUz} — {levelInfo.titleTr}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">{levelInfo.descriptionUz}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 shrink-0">
            <span className="font-semibold text-emerald-400">{completedLessons.length}</span>
            <span>/</span>
            <span>{A1_LESSON_UNITS.length} ta dars yakunlangan</span>
          </div>
        </div>

        {/* Level Switcher Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CEFR_LEVELS_INFO.map((item) => {
            const isSelected = item.level === currentCefr;
            return (
              <button
                key={item.level}
                onClick={() => onCefrChange(item.level)}
                className={`py-2.5 px-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-0.5 ${
                  isSelected
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20 font-bold'
                    : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="text-base font-extrabold">{item.level}</span>
                <span className="text-[10px] opacity-80 whitespace-nowrap">
                  {item.isAvailable ? 'Mavjud' : 'Reja'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content for Current Level */}
      {currentCefr === 'A1' ? (
        /* A1 Interactive Units */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              A1 Boshlang'ich Darslar (6 ta bo'lim)
            </span>
            <span>Barcha darslar o'zbekcha grammatika va audio bilan ta'minlangan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {A1_LESSON_UNITS.map((unit) => {
              const isDone = completedLessons.includes(unit.id);
              const score = lessonScores[unit.id];

              return (
                <div
                  key={unit.id}
                  className={`rounded-3xl border p-5 flex flex-col justify-between transition-all bg-[#111C30] ${
                    isDone
                      ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                      : 'border-slate-800 hover:border-slate-700 hover:shadow-xl'
                  }`}
                >
                  <div>
                    {/* Badge line */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                        Bo'lim 0{unit.unitOrder}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{unit.estimatedMinutes} daqiqa</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{unit.titleUz}</h3>
                    <p className="text-xs text-emerald-400 font-medium mb-2">{unit.titleTr}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {unit.descriptionUz}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    {isDone ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{score ? `${score}% yakunlandi` : "Yakunlangan"}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Boshlanmagan</span>
                    )}

                    <button
                      onClick={() => handleOpenLesson(unit)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isDone
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                      }`}
                    >
                      <span>{isDone ? "Qayta ko'rish" : "Darsni Boshlash"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Roadmap View for A2 - C2 */
        <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-8 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-white mb-2">{levelInfo.titleUz} O'quv Rejasi</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ushbu daraja uchun o'quv dasturi va leksik mezonlar to'liq ishlab chiqilgan. Hozirda siz Mahliyo AI repetitori bilan ushbu darajadagi jonli suhbatlarni boshlashingiz yoki A1 asoslarini to'liq o'zlashtirishingiz mumkin.
            </p>
          </div>

          <div className="max-w-md mx-auto text-left bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              {currentCefr} Darajasida O'rganiladigan Asosiy Mavzular:
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {levelInfo.grammarFocusUz.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Interactive Lesson Modal / Drawer */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl h-[92vh] bg-[#0F172A] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-[#111C30] border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
                  <span>A1 Bo'lim 0{activeLesson.unitOrder}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{activeLesson.titleTr}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">{activeLesson.titleUz}</h2>
              </div>
              <button
                onClick={handleCloseLesson}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-navigation tabs */}
            <div className="px-6 border-b border-slate-800 bg-[#0F172A] flex items-center gap-6 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveLessonTab('grammar')}
                className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeLessonTab === 'grammar'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Grammatika va Qoidalar
              </button>
              <button
                onClick={() => setActiveLessonTab('vocab')}
                className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeLessonTab === 'vocab'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Yangi So'zlar ({activeLesson.vocabulary.length})
              </button>
              <button
                onClick={() => setActiveLessonTab('dialogue')}
                className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeLessonTab === 'dialogue'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                3. Jonli Muloqot
              </button>
              <button
                onClick={() => setActiveLessonTab('quiz')}
                className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeLessonTab === 'quiz'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                4. Test va Mashq ({activeLesson.exercises.length})
              </button>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: GRAMMAR */}
              {activeLessonTab === 'grammar' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="bg-[#111C30] p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-base font-bold text-emerald-400 mb-3">{activeLesson.grammarTitleUz}</h3>
                    <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                      {activeLesson.grammarNotesUz}
                    </div>
                  </div>

                  <div className="bg-emerald-950/20 border border-emerald-500/30 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      O'zbek Tili Bilan Taqqoslash:
                    </span>
                    <p className="text-xs text-emerald-200/90 leading-relaxed">
                      {activeLesson.comparisonWithUzbek}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: VOCABULARY */}
              {activeLessonTab === 'vocab' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeLesson.vocabulary.map((vocab) => (
                    <div
                      key={vocab.id}
                      className="bg-[#111C30] border border-slate-800 p-4 rounded-2xl flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base font-bold text-white">{vocab.tr}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                            {vocab.category}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-400 font-medium mb-2">{vocab.uz}</p>
                        <p className="text-[11px] text-slate-400 italic">"{vocab.exampleTr}"</p>
                        <p className="text-[11px] text-slate-500">({vocab.exampleUz})</p>
                      </div>

                      <button
                        onClick={() => handlePlayVocab(vocab.tr)}
                        className="p-2.5 rounded-xl bg-slate-900 hover:bg-emerald-500/10 text-emerald-400 border border-slate-800 shrink-0 transition-colors"
                        title="Talaffuzni eshiting"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: DIALOGUE */}
              {activeLessonTab === 'dialogue' && (
                <div className="max-w-2xl mx-auto space-y-3">
                  {activeLesson.dialogues.map((dlg, idx) => (
                    <div
                      key={idx}
                      className="bg-[#111C30] border border-slate-800 p-4 rounded-2xl flex items-start gap-4"
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-pink-400 shrink-0">
                        {dlg.speaker.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-slate-400 block mb-0.5">{dlg.speaker}:</span>
                        <p className="text-sm font-semibold text-white">{dlg.tr}</p>
                        <p className="text-xs text-slate-400 italic mt-1">{dlg.uz}</p>
                      </div>
                      <button
                        onClick={() => handlePlayVocab(dlg.tr)}
                        className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors"
                        title="Ovozni eshitish"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: QUIZ & TEST */}
              {activeLessonTab === 'quiz' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  {quizSubmitted ? (
                    /* Quiz Results Card */
                    <div className="bg-[#111C30] border border-emerald-500/40 rounded-3xl p-6 text-center shadow-xl space-y-4 animate-fadeIn">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 text-2xl font-black">
                        {quizScore}%
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {quizScore >= 80 ? "Ajoyib natija! Dars muvaffaqiyatli yakunlandi! 🎉" : "Yaxshi urinish! Qayta topshirib ko'rishingiz mumkin."}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {quizScore >= 80 ? "XP hisobingizga qo'shildi va ushbu bo'lim yakunlangan deb belgilandi." : "Kamida 70% to'plashingiz tavsiya etiladi."}
                      </p>

                      <div className="pt-4 flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setQuizSubmitted(false);
                            setSelectedAnswers({});
                            setQuizScore(0);
                          }}
                          className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Qaytadan topshirish</span>
                        </button>
                        <button
                          onClick={handleCloseLesson}
                          className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30"
                        >
                          Darsni Yakunlash
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Questions */
                    <div className="space-y-6">
                      {activeLesson.exercises.map((ex, index) => (
                        <div
                          key={ex.id}
                          className="bg-[#111C30] border border-slate-800 p-5 rounded-2xl space-y-3"
                        >
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-semibold text-emerald-400">Savol 0{index + 1}</span>
                            <span>{ex.points} ball</span>
                          </div>

                          <p className="text-sm font-bold text-white">{ex.promptUz}</p>
                          {ex.contextTr && (
                            <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                              {ex.contextTr}
                            </p>
                          )}

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                            {ex.options?.map((opt) => {
                              const isSelected = selectedAnswers[ex.id] === opt;
                              return (
                                <button
                                  key={opt}
                                  onClick={() => handleAnswerSelect(ex.id, opt)}
                                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                                    isSelected
                                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleFinishQuiz}
                          disabled={Object.keys(selectedAnswers).length < activeLesson.exercises.length}
                          className="py-3 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-40"
                        >
                          Natijani Tekshirish ({Object.keys(selectedAnswers).length}/{activeLesson.exercises.length})
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#111C30] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>TÜRKAI A1 kursi</span>
              <div className="flex items-center gap-2">
                {activeLessonTab !== 'quiz' && (
                  <button
                    onClick={() => {
                      if (activeLessonTab === 'grammar') setActiveLessonTab('vocab');
                      else if (activeLessonTab === 'vocab') setActiveLessonTab('dialogue');
                      else if (activeLessonTab === 'dialogue') setActiveLessonTab('quiz');
                    }}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <span>Keyingi Bo'lim</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
