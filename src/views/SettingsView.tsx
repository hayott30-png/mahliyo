import React, { useState } from 'react';
import {
  Settings,
  Volume2,
  Shield,
  RotateCcw,
  LogOut,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface SettingsViewProps {
  audioSpeed: number;
  onAudioSpeedChange: (speed: number) => void;
  isMahliyoAuthenticated: boolean;
  onLogoutMahliyo: () => void;
  onResetProgress: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  audioSpeed,
  onAudioSpeedChange,
  isMahliyoAuthenticated,
  onLogoutMahliyo,
  onResetProgress,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const speedOptions = [
    { label: '0.75x (Sekin)', value: 0.75 },
    { label: '0.9x (Qulay)', value: 0.9 },
    { label: '1.0x (Standart)', value: 1.0 },
    { label: '1.25x (Tez)', value: 1.25 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Foydalanuvchi Sozlamalari</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Ilova Sozlamalari va Ovoz Parametrlari
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-xl">
          Nutq tezligi, Mahliyo AI kirish sessiyasi hamda o'quv ma'lumotlarini boshqarish.
        </p>
      </div>

      {/* Audio Speed Setting */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Audio va Talaffuz Tezligi</h2>
            <p className="text-xs text-slate-400">Darsliklar va Mahliyo AI nutqining eshittirish tezligi</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {speedOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onAudioSpeedChange(opt.value)}
              className={`p-3 rounded-2xl border text-xs font-semibold transition-all ${
                audioSpeed === opt.value
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mahliyo AI Session */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Mahliyo AI Sessiyasi</h2>
              <p className="text-xs text-slate-400">Server orqali himoyalangan maxfiy kirish holati</p>
            </div>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-xl border ${
              isMahliyoAuthenticated
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {isMahliyoAuthenticated ? 'Ulangan' : 'Ulanmagan'}
          </span>
        </div>

        {isMahliyoAuthenticated && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={onLogoutMahliyo}
              className="py-2.5 px-4 bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-300 hover:text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Mahliyo AI Sessiyasidan Chiqish</span>
            </button>
          </div>
        )}
      </div>

      {/* Reset Progress */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Taraqqiyotni Qayta O'rnatish</h2>
            <p className="text-xs text-slate-400">
              Barcha o'tilgan darslar, ballar va mahalliy ma'lumotlarni tozalash
            </p>
          </div>
        </div>

        <div className="pt-2">
          {showResetConfirm ? (
            <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs text-red-300 font-semibold">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Rostdan ham barcha natijalaringizni tozalashni xohlaysizmi?</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="py-2 px-3 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={() => {
                    onResetProgress();
                    setShowResetConfirm(false);
                  }}
                  className="py-2 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30"
                >
                  Ha, barchasini tozalash
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Ma'lumotlarni Qayta Boshlash...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
