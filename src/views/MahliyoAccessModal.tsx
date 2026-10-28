import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight, X } from 'lucide-react';

interface MahliyoAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MahliyoAccessModal: React.FC<MahliyoAccessModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrorMessage("Iltimos, maxfiy kirish kodini kiriting.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/mahliyo/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token) {
          localStorage.setItem('turkai_mahliyo_token', data.token);
        }
        setCode('');
        onSuccess();
      } else {
        setErrorMessage(data.error || "Maxfiy kod noto'g'ri. Iltimos qaytadan urinib ko'ring.");
      }
    } catch (err) {
      console.error('Access check failed:', err);
      setErrorMessage("Server bilan bog'lanishda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-pink-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-0.5 shadow-lg shadow-pink-500/20 mb-4">
            <div className="w-full h-full bg-[#0F172A] rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-pink-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Mahliyo AI <span className="text-pink-400">Repetitor</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs">
            Turk tilini do'stona, mehribon va o'zbek tilidagi tushuntirishlar bilan o'rgatuvchi shaxsiy AI repetitoringiz.
          </p>
        </div>

        {/* Demo Code Helper Notice */}
        <div className="mb-5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Kirish kodi:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCode('maxliyo')}
                className="font-mono text-pink-400 font-semibold hover:underline bg-pink-500/10 px-2.5 py-1 rounded-lg border border-pink-500/20 active:scale-95 transition-transform"
              >
                maxliyo
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Maxfiy Kirish Kodi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Maxfiy kodni kiriting..."
                disabled={isLoading}
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-xl text-sm text-white placeholder-slate-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-xs text-red-200 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Suhbatni Boshlash</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-500 mt-5">
          Hech qanday qo'shimcha ro'yxatdan o'tish talab etilmaydi. Kirish xavfsiz va server orqali tekshiriladi.
        </p>
      </div>
    </div>
  );
};
