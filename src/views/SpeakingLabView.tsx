import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Clock,
  Award,
  ChevronRight,
  AlertCircle,
  BarChart2,
} from 'lucide-react';
import { CefrLevel, SpeakingPrompt, SpeakingAttemptRecord } from '../types';
import { SPEAKING_PROMPTS } from '../data/curriculum';
import { TurkishSpeechRecognizer, speakTurkish, stopSpeaking } from '../services/speech';

interface SpeakingLabViewProps {
  currentCefr: CefrLevel;
  onCefrChange: (level: CefrLevel) => void;
  audioSpeed: number;
}

export const SpeakingLabView: React.FC<SpeakingLabViewProps> = ({
  currentCefr,
  onCefrChange,
  audioSpeed,
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt>(SPEAKING_PROMPTS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<SpeakingAttemptRecord | null>(null);
  const [attemptHistory, setAttemptHistory] = useState<SpeakingAttemptRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const recognizerRef = useRef<TurkishSpeechRecognizer | null>(null);
  const timerRef = useRef<number | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('turkai_speaking_history');
    if (saved) {
      try {
        setAttemptHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load speaking history', e);
      }
    }
  }, []);

  // Update selected prompt when CEFR changes if applicable
  useEffect(() => {
    const matching = SPEAKING_PROMPTS.filter((p) => p.cefrLevel === currentCefr);
    if (matching.length > 0 && selectedPrompt.cefrLevel !== currentCefr) {
      setSelectedPrompt(matching[0]);
      resetSession();
    }
  }, [currentCefr]);

  // Clean up audio and timers
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const resetSession = () => {
    stopSpeaking();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setTranscript('');
    setRecordingSeconds(0);
    setAssessmentResult(null);
    setErrorMessage(null);
  };

  const handlePlayNativeAudio = (text: string) => {
    if (isAudioPlaying) {
      stopSpeaking();
      setIsAudioPlaying(false);
      return;
    }

    setIsAudioPlaying(true);
    speakTurkish(
      text,
      selectedPrompt.audioSpeedHint || audioSpeed,
      () => {},
      () => setIsAudioPlaying(false),
      () => setIsAudioPlaying(false)
    );
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      recognizerRef.current?.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    resetSession();
    setErrorMessage(null);

    recognizerRef.current = new TurkishSpeechRecognizer(
      (newTranscript) => {
        setTranscript(newTranscript);
      },
      (error) => {
        setErrorMessage(error);
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      },
      (listening) => {
        setIsRecording(listening);
      }
    );

    const started = recognizerRef.current.start();
    if (started) {
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleAnalyzeSubmission = async () => {
    if (!transcript.trim()) {
      setErrorMessage("Iltimos, avval jumlani talaffuz qiling yoki mikrofondan foydalaning.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/speaking/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptTr: selectedPrompt.targetSentenceTr,
          transcriptText: transcript.trim(),
          cefrLevel: selectedPrompt.cefrLevel,
          topicTitle: selectedPrompt.titleUz,
        }),
      });

      if (!res.ok) {
        throw new Error('Assessment failed');
      }

      const data = await res.json();

      const newRecord: SpeakingAttemptRecord = {
        id: `att_${Date.now()}`,
        promptId: selectedPrompt.id,
        targetTr: selectedPrompt.targetSentenceTr,
        transcript: transcript.trim(),
        overallScore: data.overallScore,
        accuracyScore: data.accuracyScore,
        grammarScore: data.grammarScore,
        vocabularyScore: data.vocabularyScore,
        fluencyScore: data.fluencyScore,
        suggestedCorrection: data.suggestedCorrection,
        feedbackUz: data.feedbackUz,
        phoneticNotesUz: data.phoneticNotesUz,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setAssessmentResult(newRecord);
      const updated = [newRecord, ...attemptHistory].slice(0, 10);
      setAttemptHistory(updated);
      localStorage.setItem('turkai_speaking_history', JSON.stringify(updated));
    } catch (err) {
      console.error('Speaking assessment error:', err);
      setErrorMessage("Nutqni tahlil qilishda xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Top Banner / Studio card */}
      <div className="relative rounded-3xl overflow-hidden bg-[#111C30] border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
          <img
            src="/src/assets/images/turkai_speaking_lab_1793208119571.jpg"
            alt="Speaking Lab Acoustic Studio"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent z-0" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <Mic className="w-3.5 h-3.5" />
              <span>Akustik Nutq Laboratoriyasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Turkcha Talaffuz va Jonli Nutq Mashqi
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Native spiker talaffuzini eshiting, mikrofonga gapiring va Gemini AI orqali leksik moslik, grammatika va ravonlik bo'yicha professional baholash oling.
            </p>
          </div>

          {/* Level Switcher */}
          <div className="flex flex-col gap-2 shrink-0 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
            <span className="text-xs font-medium text-slate-400">CEFR Darajasini Tanlang:</span>
            <div className="flex items-center gap-1.5">
              {(['A1', 'A2', 'B1'] as CefrLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onCefrChange(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currentCefr === lvl
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Prompt selection & Recording Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Prompt Selector */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>Mashq Jumlalari</span>
            <span className="text-xs font-normal text-slate-500">
              ({SPEAKING_PROMPTS.filter((p) => p.cefrLevel === currentCefr).length} ta)
            </span>
          </h2>

          <div className="space-y-2.5">
            {SPEAKING_PROMPTS.filter((p) => p.cefrLevel === currentCefr).map((prompt) => {
              const isSelected = selectedPrompt.id === prompt.id;
              return (
                <button
                  key={prompt.id}
                  onClick={() => {
                    setSelectedPrompt(prompt);
                    resetSession();
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-[#111C30] border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                      : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-white">{prompt.titleUz}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                      {prompt.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{prompt.targetSentenceTr}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Recording Stage & AI Assessment */}
        <div className="lg:col-span-2 space-y-5">
          {/* Target Sentence Card */}
          <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                  Vazifa: {selectedPrompt.titleUz}
                </span>
                <p className="text-xs text-slate-400">{selectedPrompt.contextUz}</p>
              </div>

              {/* Native Speaker Play Button */}
              <button
                onClick={() => handlePlayNativeAudio(selectedPrompt.targetSentenceTr)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isAudioPlaying
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : 'bg-slate-900 border border-slate-700 text-emerald-400 hover:bg-slate-800'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isAudioPlaying ? "Tinglanmoqda..." : "Eshiting (Model)"}</span>
              </button>
            </div>

            {/* Target Turkish sentence */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-3">
              <p className="text-lg font-bold text-white tracking-wide">{selectedPrompt.targetSentenceTr}</p>
              <p className="text-xs text-slate-400 mt-2 italic">{selectedPrompt.translationUz}</p>
            </div>

            {/* Recording Controls */}
            <div className="mt-6 flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
              {/* Record Button */}
              <div className="relative mb-4">
                {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping pointer-events-none" />
                )}
                <button
                  onClick={toggleRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                    isRecording
                      ? 'bg-red-500 text-white shadow-red-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-white">
                  {isRecording ? "Ovozingiz yozilmoqda..." : "Mikrofonni bosing va turkcha gapiring"}
                </p>
                {isRecording && (
                  <div className="flex items-center justify-center gap-2 text-xs text-red-400 font-mono mt-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
                  </div>
                )}
              </div>

              {/* Transcript Display / Editable Area */}
              {(transcript || isRecording) && (
                <div className="w-full mt-5">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 text-left">
                    Siz aytgan matn (Transkripsiya):
                  </label>
                  <textarea
                    rows={2}
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Mikrofondan eshitilgan matn shu yerda paydo bo'ladi..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none font-mono"
                  />
                </div>
              )}

              {/* Action buttons */}
              {transcript && (
                <div className="mt-4 flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={resetSession}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Qaytadan</span>
                  </button>
                  <button
                    onClick={handleAnalyzeSubmission}
                    disabled={isAnalyzing}
                    className="py-2.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>AI Tahlilini Olish</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {errorMessage && (
                <div className="mt-4 p-3 bg-red-950/40 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Assessment Result Card */}
          {assessmentResult && (
            <div className="bg-[#111C30] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl animate-fadeIn space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-extrabold text-xl text-emerald-400 tabular-nums">
                    {assessmentResult.overallScore}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Nutq Tahlili Natijasi</h3>
                    <p className="text-xs text-slate-400">
                      {assessmentResult.overallScore >= 85
                        ? "A'lo darajada! Talaffuz va so'z mosligi yuqori."
                        : assessmentResult.overallScore >= 70
                        ? "Yaxshi natija! Kichik tuzatishlar bilan yana yaxshilanadi."
                        : "Mashq qilishda davom eting! Har bir urinish mahoratni oshiradi."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{assessmentResult.createdAt}</span>
                </div>
              </div>

              {/* 4 Score Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Leksik Moslik</span>
                  <span className="text-lg font-bold text-emerald-400 tabular-nums">
                    {assessmentResult.accuracyScore}%
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Grammatika</span>
                  <span className="text-lg font-bold text-teal-400 tabular-nums">
                    {assessmentResult.grammarScore}%
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">So'z Boyligi</span>
                  <span className="text-lg font-bold text-indigo-400 tabular-nums">
                    {assessmentResult.vocabularyScore}%
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Nutq Ravonligi</span>
                  <span className="text-lg font-bold text-pink-400 tabular-nums">
                    {assessmentResult.fluencyScore}%
                  </span>
                </div>
              </div>

              {/* Suggested Correct Sentence */}
              {assessmentResult.suggestedCorrection && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Tavsiya Etilgan To'g'ri Jumla:
                  </span>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-emerald-400 font-mono">
                      {assessmentResult.suggestedCorrection}
                    </p>
                    <button
                      onClick={() => handlePlayNativeAudio(assessmentResult.suggestedCorrection)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 shrink-0"
                      title="To'g'ri talaffuzni eshiting"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Feedback and Uzbek notes */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    O'qituvchi Sharhi (O'zbek tilida):
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{assessmentResult.feedbackUz}</p>
                </div>

                {assessmentResult.phoneticNotesUz && (
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Talaffuz va Fonetika Maslahati:
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{assessmentResult.phoneticNotesUz}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Practice History List */}
          {attemptHistory.length > 0 && (
            <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Oxirgi Urinishlar Tarixi</span>
              </h3>
              <div className="divide-y divide-slate-800">
                {attemptHistory.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{item.transcript}</p>
                      <p className="text-slate-400 text-[11px] truncate">Maqsad: {item.targetTr}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-emerald-400 font-mono text-sm">
                        {item.overallScore} ball
                      </span>
                      <span className="text-slate-500 text-[11px]">{item.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
