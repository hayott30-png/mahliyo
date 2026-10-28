import React, { useState, useMemo } from 'react';
import { Search, Volume2, Bookmark, BookmarkCheck, BookOpen, Filter, Play, VolumeX } from 'lucide-react';
import { VocabularyItem } from '../types';
import { A1_LESSON_UNITS } from '../data/curriculum';
import { speakTurkish, stopSpeaking } from '../services/speech';

interface VocabularyViewProps {
  audioSpeed: number;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({ audioSpeed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('turkai_saved_vocab');
    return saved ? JSON.parse(saved) : [];
  });

  // Extract all vocabulary across all A1 units
  const allVocab = useMemo(() => {
    const list: VocabularyItem[] = [];
    A1_LESSON_UNITS.forEach((unit) => {
      unit.vocabulary.forEach((v) => {
        if (!list.some((existing) => existing.id === v.id)) {
          list.push(v);
        }
      });
    });
    return list;
  }, []);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allVocab.forEach((v) => set.add(v.category));
    return Array.from(set);
  }, [allVocab]);

  // Filtered list
  const filteredVocab = useMemo(() => {
    return allVocab.filter((v) => {
      const matchesSearch =
        v.tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.pronunciation && v.pronunciation.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [allVocab, searchQuery, selectedCategory]);

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('turkai_saved_vocab', JSON.stringify(updated));
  };

  const handlePlayAudio = (id: string, text: string) => {
    if (playingId === id) {
      stopSpeaking();
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    speakTurkish(
      text,
      audioSpeed,
      () => {},
      () => setPlayingId(null),
      () => setPlayingId(null)
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#111C30] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Turk Tili Audio Lug'ati</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Turkcha-O'zbekcha So'z Boyligi
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Har bir so'zning aniq turkcha audio talaffuzi, talaffuz transkripsiyasi va jonli misollari.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 shrink-0">
            Jami: <strong className="text-emerald-400">{allVocab.length}</strong> ta so'z
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Turkcha yoki o'zbekcha so'z qidirish..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full sm:w-auto flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0F172A] text-white">Barcha Mavzular</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0F172A] text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVocab.map((vocab) => {
          const isFav = favorites.includes(vocab.id);
          const isPlayingWord = playingId === `w_${vocab.id}`;
          const isPlayingEx = playingId === `ex_${vocab.id}`;

          return (
            <div
              key={vocab.id}
              className="bg-[#111C30] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {vocab.category}
                  </span>

                  <button
                    onClick={() => toggleFavorite(vocab.id)}
                    className="text-slate-500 hover:text-amber-400 p-1"
                    title={isFav ? "Tanlanganlardan o'chirish" : "Tanlanganlarga saqlash"}
                  >
                    {isFav ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 my-1">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {vocab.tr}
                    </h3>
                    {vocab.pronunciation && (
                      <span className="text-[11px] font-mono text-slate-400 block -mt-0.5">
                        [{vocab.pronunciation}]
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handlePlayAudio(`w_${vocab.id}`, vocab.tr)}
                    className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                      isPlayingWord
                        ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse'
                        : 'bg-slate-900 text-emerald-400 hover:bg-emerald-500/10 border-slate-800'
                    }`}
                    title="So'z talaffuzini eshiting"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-semibold text-emerald-400 mb-3">{vocab.uz}</p>

                {/* Example sentence */}
                <div className="pt-2.5 border-t border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-slate-300 italic font-mono text-[11px] flex-1">
                      "{vocab.exampleTr}"
                    </p>
                    <button
                      onClick={() => handlePlayAudio(`ex_${vocab.id}`, vocab.exampleTr)}
                      className={`p-1 rounded text-slate-400 hover:text-emerald-400 shrink-0 ${
                        isPlayingEx ? 'text-emerald-400 animate-pulse' : ''
                      }`}
                      title="Jumla audiosini eshitish"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-slate-500 text-[11px]">({vocab.exampleUz})</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVocab.length === 0 && (
        <div className="p-12 text-center bg-[#111C30] border border-slate-800 rounded-3xl">
          <p className="text-sm text-slate-400">Hech qanday so'z topilmadi.</p>
        </div>
      )}
    </div>
  );
};
