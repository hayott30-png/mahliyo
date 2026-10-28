import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { CurriculumView } from './views/CurriculumView';
import { SpeakingLabView } from './views/SpeakingLabView';
import { WritingLabView } from './views/WritingLabView';
import { MahliyoChatView } from './views/MahliyoChatView';
import { VocabularyView } from './views/VocabularyView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';
import { AdminCurriculumView } from './views/AdminCurriculumView';
import { MahliyoAccessModal } from './views/MahliyoAccessModal';
import { CefrLevel } from './types';
import { Menu } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [currentCefr, setCurrentCefr] = useState<CefrLevel>('A1');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMahliyoModalOpen, setIsMahliyoModalOpen] = useState(false);
  const [isMahliyoAuthenticated, setIsMahliyoAuthenticated] = useState(false);

  // User persistent progress
  const [totalXp, setTotalXp] = useState<number>(() => {
    const saved = localStorage.getItem('turkai_xp');
    return saved ? parseInt(saved, 10) : 150;
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('turkai_streak');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('turkai_completed_lessons');
    return saved ? JSON.parse(saved) : ['a1_unit_1'];
  });

  const [lessonScores, setLessonScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('turkai_lesson_scores');
    return saved ? JSON.parse(saved) : { a1_unit_1: 100 };
  });

  const [audioSpeed, setAudioSpeed] = useState<number>(() => {
    const saved = localStorage.getItem('turkai_audio_speed');
    return saved ? parseFloat(saved) : 1.0;
  });

  // Check initial URL path & Mahliyo session
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/mahliyo')) {
      checkMahliyoSession(true);
    } else if (path.includes('/speaking')) {
      setCurrentTab('speaking');
    } else if (completedLessons.length > 0) {
      setCurrentTab('dashboard');
    }

    checkMahliyoSession(false);
  }, []);

  const checkMahliyoSession = async (openChatOnSuccess = false) => {
    try {
      const storedToken = localStorage.getItem('turkai_mahliyo_token');
      const res = await fetch('/api/mahliyo/session', {
        headers: storedToken ? { 'x-mahliyo-token': storedToken } : {},
      });
      const data = await res.json();
      if (data.authenticated || storedToken) {
        setIsMahliyoAuthenticated(true);
        if (openChatOnSuccess) {
          setCurrentTab('mahliyo');
        }
      } else if (openChatOnSuccess) {
        setIsMahliyoModalOpen(true);
      }
    } catch (e) {
      console.error('Session check failed', e);
      if (openChatOnSuccess) setIsMahliyoModalOpen(true);
    }
  };

  const handleOpenMahliyo = () => {
    if (isMahliyoAuthenticated) {
      setCurrentTab('mahliyo');
    } else {
      setIsMahliyoModalOpen(true);
    }
  };

  const handleMahliyoSuccess = () => {
    setIsMahliyoAuthenticated(true);
    setIsMahliyoModalOpen(false);
    setCurrentTab('mahliyo');
  };

  const handleLogoutMahliyo = async () => {
    try {
      await fetch('/api/mahliyo/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout failed', e);
    }
    setIsMahliyoAuthenticated(false);
    if (currentTab === 'mahliyo') {
      setCurrentTab('dashboard');
    }
  };

  const handleCompleteLesson = (lessonId: string, score: number) => {
    const updatedLessons = Array.from(new Set([...completedLessons, lessonId]));
    const updatedScores = { ...lessonScores, [lessonId]: score };
    const newXp = totalXp + 50;

    setCompletedLessons(updatedLessons);
    setLessonScores(updatedScores);
    setTotalXp(newXp);

    localStorage.setItem('turkai_completed_lessons', JSON.stringify(updatedLessons));
    localStorage.setItem('turkai_lesson_scores', JSON.stringify(updatedScores));
    localStorage.setItem('turkai_xp', newXp.toString());
  };

  const handleAudioSpeedChange = (speed: number) => {
    setAudioSpeed(speed);
    localStorage.setItem('turkai_audio_speed', speed.toString());
  };

  const handleResetProgress = () => {
    setCompletedLessons([]);
    setLessonScores({});
    setTotalXp(0);
    setStreakDays(1);
    localStorage.removeItem('turkai_completed_lessons');
    localStorage.removeItem('turkai_lesson_scores');
    localStorage.removeItem('turkai_xp');
    localStorage.removeItem('turkai_streak');
    localStorage.removeItem('turkai_speaking_history');
    localStorage.removeItem('turkai_writing_history');
    localStorage.removeItem('turkai_saved_vocab');
  };

  return (
    <div className="min-h-screen bg-[#080F1E] text-[#F8FAFC] flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        streakDays={streakDays}
        totalXp={totalXp}
        currentLevel={currentCefr}
        isMahliyoAuthenticated={isMahliyoAuthenticated}
        onOpenMahliyo={handleOpenMahliyo}
      />

      {/* Mobile Menu Floating Trigger */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-3.5 rounded-full bg-emerald-500 text-slate-950 font-bold shadow-2xl shadow-emerald-500/40 flex items-center justify-center transition-transform active:scale-95"
          title="Menyu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Drawer */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        streakDays={streakDays}
        totalXp={totalXp}
        isMahliyoAuthenticated={isMahliyoAuthenticated}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {currentTab === 'landing' && (
          <LandingView
            onStartLearning={() => setCurrentTab('curriculum')}
            onOpenMahliyo={handleOpenMahliyo}
            onSelectLevel={(lvl) => {
              setCurrentCefr(lvl);
              setCurrentTab('curriculum');
            }}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            currentCefr={currentCefr}
            totalXp={totalXp}
            streakDays={streakDays}
            completedLessons={completedLessons}
            lessonScores={lessonScores}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenMahliyo={handleOpenMahliyo}
          />
        )}

        {currentTab === 'curriculum' && (
          <CurriculumView
            currentCefr={currentCefr}
            onCefrChange={setCurrentCefr}
            completedLessons={completedLessons}
            lessonScores={lessonScores}
            onCompleteLesson={handleCompleteLesson}
            audioSpeed={audioSpeed}
          />
        )}

        {currentTab === 'speaking' && (
          <SpeakingLabView
            currentCefr={currentCefr}
            onCefrChange={setCurrentCefr}
            audioSpeed={audioSpeed}
          />
        )}

        {currentTab === 'writing' && (
          <WritingLabView
            currentCefr={currentCefr}
            onCefrChange={setCurrentCefr}
          />
        )}

        {currentTab === 'mahliyo' && (
          <MahliyoChatView
            currentCefr={currentCefr}
            onCefrChange={setCurrentCefr}
            onLogout={handleLogoutMahliyo}
            audioSpeed={audioSpeed}
          />
        )}

        {currentTab === 'vocabulary' && (
          <VocabularyView audioSpeed={audioSpeed} />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            currentCefr={currentCefr}
            totalXp={totalXp}
            streakDays={streakDays}
            completedLessons={completedLessons}
            lessonScores={lessonScores}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            audioSpeed={audioSpeed}
            onAudioSpeedChange={handleAudioSpeedChange}
            isMahliyoAuthenticated={isMahliyoAuthenticated}
            onLogoutMahliyo={handleLogoutMahliyo}
            onResetProgress={handleResetProgress}
          />
        )}

        {currentTab === 'admin' && <AdminCurriculumView />}
      </main>

      {/* Mahliyo Access Modal */}
      <MahliyoAccessModal
        isOpen={isMahliyoModalOpen}
        onClose={() => setIsMahliyoModalOpen(false)}
        onSuccess={handleMahliyoSuccess}
      />

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-slate-900/80 bg-[#060B16] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">TÜRKAI</span>
            <span>·</span>
            <span>O'zbek tilida so'zlashuvchilar uchun bepul turk tili ta'lim platformasi</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>CEFR A1–C2</span>
            <span>·</span>
            <span>Mahliyo AI</span>
            <span>·</span>
            <button
              onClick={() => setCurrentTab('admin')}
              className="hover:text-emerald-400 transition-colors"
            >
              Supabase Baza
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
