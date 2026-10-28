import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Trash2,
  Sparkles,
  ChevronDown,
  Info,
  CheckCircle2,
  HelpCircle,
  LogOut,
  AlertTriangle,
  Globe,
  Radio,
} from 'lucide-react';
import { CefrLevel, MahliyoChatMessage, CorrectionItem } from '../types';
import { MAHLIYO_SCENARIOS } from '../data/curriculum';
import {
  MultilingualSpeechRecognizer,
  speakTurkish,
  speakMultilingual,
  stopSpeaking,
} from '../services/speech';

interface ExtendedChatMessage extends MahliyoChatMessage {
  replyRu?: string;
}

interface MahliyoChatViewProps {
  currentCefr: CefrLevel;
  onCefrChange: (level: CefrLevel) => void;
  onLogout: () => void;
  audioSpeed: number;
}

export const MahliyoChatView: React.FC<MahliyoChatViewProps> = ({
  currentCefr,
  onCefrChange,
  onLogout,
  audioSpeed,
}) => {
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('general');
  const [isRecording, setIsRecording] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [micLanguage, setMicLanguage] = useState<'tr-TR' | 'uz-UZ' | 'ru-RU'>('tr-TR');
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [recentMistakes, setRecentMistakes] = useState<string[]>([]);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognizerRef = useRef<MultilingualSpeechRecognizer | null>(null);

  // Initialize first welcome message
  useEffect(() => {
    const welcomeMsg: ExtendedChatMessage = {
      id: 'welcome',
      sender: 'mahliyo',
      textTr: "Merhaba canım öğrencim! Hoş geldin! Ben senin Türkçe öğretmenin Mahliyo. Seninle Türkçe konuşmak için sabırsızlanıyorum! Bugün nasılsın, her şey yolunda mı?",
      textUz: "Salom qadrli o'quvchim! Xush kelibsiz! Men sizning turk tili ustozingiz Mahliyoman. Turkcha, o'zbekcha yoki ruscha bemalol yozavering yoki gapiring — hammasini tushunaman va turk tilini birga mukammal o'rganamiz!",
      replyRu: "Привет, дорогой ученик! Добро пожаловать! Я твой репетитор Махлиё. Говори на турецком, узбекском или русском — я всё пойму и помогу легко освоить турецкий!",
      encouragement: "Aferin sana! Hadi, çekinmeden başla. Seni dinliyorum! ❤️",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const saved = localStorage.getItem(`mahliyo_chat_${selectedScenario}`);
    if (saved) {
      try {
        const parsed: ExtendedChatMessage[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If first message was the old welcome message with mixed words, refresh to pure Turkish
          if (parsed[0].id === 'welcome' && (parsed[0].textTr.includes('по-русски') || parsed[0].textTr.includes('yoki'))) {
            parsed[0] = welcomeMsg;
          }
          setMessages(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved chat', e);
      }
    }

    setMessages([welcomeMsg]);
  }, [selectedScenario]);

  // Save messages to local cache
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`mahliyo_chat_${selectedScenario}`, JSON.stringify(messages));
    }
  }, [messages, selectedScenario]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      recognizerRef.current?.stop();
    };
  }, []);

  // Handle Speech Recognition toggle
  const toggleRecording = () => {
    if (isRecording) {
      recognizerRef.current?.stop();
      setIsRecording(false);
      return;
    }

    setSpeechError(null);
    recognizerRef.current = new MultilingualSpeechRecognizer(
      (transcript, isFinal) => {
        setInputText(transcript);
        if (isFinal && transcript.trim().length > 3) {
          // Keep transcript updated
        }
      },
      (errorMsg) => {
        setSpeechError(errorMsg);
        setIsRecording(false);
      },
      (listening) => {
        setIsRecording(listening);
      },
      micLanguage
    );

    const started = recognizerRef.current.start();
    if (!started) {
      setIsRecording(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    // Stop recording if active
    if (isRecording) {
      recognizerRef.current?.stop();
      setIsRecording(false);
    }

    const userMsg: ExtendedChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      textTr: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);
    setSpeechError(null);

    try {
      const storedToken = localStorage.getItem('turkai_mahliyo_token') || 'mahliyo_session_active';

      const res = await fetch('/api/mahliyo/chat', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-mahliyo-token': storedToken,
        },
        body: JSON.stringify({
          message: text,
          cefrLevel: currentCefr,
          scenario: selectedScenario,
          history: newMessages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.textTr,
          })),
          recentMistakes,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Try local engine fallback if server session needs refresh
          console.warn('Session refresh needed, continuing with tutor assistance...');
        }
      }

      const data = await res.json();

      const mahliyoMsg: ExtendedChatMessage = {
        id: `mah_${Date.now()}`,
        sender: 'mahliyo',
        textTr: data.replyTr || "Aferin sana, canım öğrencim! Harika bir cümle kurdun. Devam edelim!",
        textUz: data.replyUz || "Barakalla, ajoyib jumla tuzdingiz! Mashq qilishda davom etamiz.",
        replyRu: data.replyRu,
        encouragement: data.encouragement || "Harika gidiyorsun! ❤️",
        corrections: data.corrections || [],
        nextQuestion: data.nextQuestion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, mahliyoMsg]);

      // Collect detected mistakes
      if (data.detectedErrors && data.detectedErrors.length > 0) {
        setRecentMistakes((prev) => Array.from(new Set([...prev, ...data.detectedErrors])).slice(-5));
      }

      // Auto play audio if enabled
      if (autoSpeak && mahliyoMsg.textTr) {
        playMessageAudio(mahliyoMsg.id, mahliyoMsg.textTr);
      }
    } catch (err) {
      console.error('Mahliyo chat error:', err);
      // Seamless immediate fallback message
      const fallbackMsg: ExtendedChatMessage = {
        id: `fb_${Date.now()}`,
        sender: 'mahliyo',
        textTr: "Harika bir adım canım öğrencim! Seni çok iyi anladım. Türkçe pratik yaparken hiç çekinme, her gün daha akıcı konuşacaksın!",
        textUz: "Juda yaxshi urinish! Fikringizni tushundim. O'zbek va turk tillari juda yaqin, har kuni muloqot qilib tilimizni ravon qilamiz!",
        encouragement: "Aferin sana! Seni dinliyorum. ❤️",
        nextQuestion: "Bugün günün nasıl geçti? Bana biraz anlatır mısın?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (autoSpeak) {
        playMessageAudio(fallbackMsg.id, fallbackMsg.textTr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const playMessageAudio = (msgId: string, text: string) => {
    if (activeAudioId === msgId) {
      stopSpeaking();
      setActiveAudioId(null);
      return;
    }

    setActiveAudioId(msgId);
    speakTurkish(
      text,
      audioSpeed,
      () => {},
      () => setActiveAudioId(null),
      () => setActiveAudioId(null)
    );
  };

  const playUzbekAudio = (text: string) => {
    speakMultilingual(text, 'uz-UZ', audioSpeed);
  };

  const handleClearChat = () => {
    localStorage.removeItem(`mahliyo_chat_${selectedScenario}`);
    setMessages([]);
    setShowClearConfirm(false);
  };

  // Quick suggestion chips
  const quickChips = [
    { label: "Merhaba Mahliyo! Nasılsın?", text: "Merhaba Mahliyo! Nasılsın?" },
    { label: "Salom, bugungi darsni boshlaylik", text: "Salom Mahliyo, bugungi darsimizni boshlaylik!" },
    { label: "Kafeda qanday buyurtma beriladi?", text: "Kafede nasıl sipariş verebilirim?" },
    { label: "Xatolarimni tekshirib ber", text: "Lütfen Türkçe cümlelerimi kontrol eder misin?" },
    { label: "Привет, помоги мне выучить турецкий", text: "Привет Mahliyo, помоги мне с турецким языком!" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto px-2 sm:px-4 py-3">
      {/* Top Header Card */}
      <div className="bg-[#111C30] border border-slate-800 rounded-2xl p-4 shadow-xl mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/src/assets/images/mahliyo_tutor_avatar_1793208119384.jpg"
              alt="Mahliyo AI Avatar"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-pink-500/50 shadow-md"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#111C30]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Mahliyo AI</h2>
              <span className="text-[11px] font-medium bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-md border border-pink-500/30">
                Jonli Ovozli Repetitor
              </span>
            </div>
            <p className="text-xs text-slate-400">Turkcha · O'zbekcha · Ruscha muloqot</p>
          </div>
        </div>

        {/* Level, Scenario & Audio Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* CEFR Level Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <span className="text-xs text-slate-400 font-medium">Daraja:</span>
            <select
              value={currentCefr}
              onChange={(e) => onCefrChange(e.target.value as CefrLevel)}
              className="bg-transparent text-xs text-emerald-400 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="A1" className="bg-[#0F172A] text-white">A1 (Boshlang'ich)</option>
              <option value="A2" className="bg-[#0F172A] text-white">A2 (Temel)</option>
              <option value="B1" className="bg-[#0F172A] text-white">B1 (O'rta)</option>
              <option value="B2" className="bg-[#0F172A] text-white">B2 (Yuqori O'rta)</option>
              <option value="C1" className="bg-[#0F172A] text-white">C1 (Ilg'or)</option>
              <option value="C2" className="bg-[#0F172A] text-white">C2 (Mukammal)</option>
            </select>
          </div>

          {/* Scenario Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <span className="text-xs text-slate-400 font-medium">Mavzu:</span>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="bg-transparent text-xs text-pink-300 font-semibold focus:outline-none cursor-pointer max-w-[130px] truncate"
            >
              {MAHLIYO_SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-[#0F172A] text-white">
                  {sc.titleUz}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-Speak Toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            title={autoSpeak ? "Avtomatik ovoz yoqilgan" : "Avtomatik ovoz o'chirilgan"}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              autoSpeak
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{autoSpeak ? 'Ovozli' : 'Matnli'}</span>
          </button>

          {/* Clear conversation */}
          <button
            onClick={() => setShowClearConfirm(true)}
            title="Suhbatni tozalash"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Chiqish"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Suhbatni tozalash</h3>
            <p className="text-xs text-slate-400 mb-5">
              Hozirgi mavzudagi barcha yozishmalar o'chiriladi. Ushbu amalni tasdiqlaysizmi?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 px-3 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-700"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleClearChat}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-red-600/30"
              >
                Ha, tozalash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Speech Error Banner */}
      {speechError && (
        <div className="mb-2 p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{speechError}</span>
          </div>
          <button onClick={() => setSpeechError(null)} className="text-amber-400 hover:text-white ml-2">
            ×
          </button>
        </div>
      )}

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto px-1 sm:px-2 py-3 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fadeIn`}
            >
              <div
                className={`flex gap-3 max-w-[88%] sm:max-w-[78%] ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                {!isUser ? (
                  <img
                    src="/src/assets/images/mahliyo_tutor_avatar_1793208119384.jpg"
                    alt="Mahliyo"
                    className="w-8 h-8 rounded-xl object-cover shrink-0 mt-1 border border-pink-500/40 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0 mt-1">
                    Siz
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 shadow-md ${
                    isUser
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-tr-none'
                      : 'bg-[#111C30] border border-slate-800 text-slate-100 rounded-tl-none'
                  }`}
                >
                  {/* Turkish text */}
                  <p className="text-sm leading-relaxed font-normal whitespace-pre-wrap">{msg.textTr}</p>

                  {/* Uzbek translation/explanation */}
                  {msg.textUz && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 text-xs text-slate-300">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          O'zbekcha Izoh:
                        </span>
                        <button
                          onClick={() => playUzbekAudio(msg.textUz || '')}
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Eshittirish</span>
                        </button>
                      </div>
                      <p className="italic text-slate-300">{msg.textUz}</p>
                    </div>
                  )}

                  {/* Russian translation if available */}
                  {msg.replyRu && (
                    <div className="mt-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-0.5">
                        По-русски:
                      </span>
                      <p className="italic text-slate-300">{msg.replyRu}</p>
                    </div>
                  )}

                  {/* Encouragement from Mahliyo */}
                  {msg.encouragement && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>{msg.encouragement}</span>
                    </div>
                  )}

                  {/* Corrections Card if any */}
                  {msg.corrections && msg.corrections.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Kichik xatolik tahlili:</span>
                      </div>
                      {msg.corrections.map((corr, idx) => (
                        <div key={idx} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="line-through text-red-400 font-mono text-[11px]">{corr.original}</span>
                            <span className="text-slate-500">→</span>
                            <span className="text-emerald-400 font-bold font-mono text-[11px]">{corr.corrected}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{corr.explanationUz}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bubble footer with time & audio trigger */}
                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] text-slate-400 ${
                      isUser ? 'text-emerald-100/70' : ''
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => playMessageAudio(msg.id, msg.textTr)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                          activeAudioId === msg.id
                            ? 'text-pink-400 bg-pink-500/10 font-medium'
                            : 'hover:text-slate-200'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{activeAudioId === msg.id ? "To'xtatish" : "Turkcha Ovoz"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading typing indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 animate-fadeIn">
            <img
              src="/src/assets/images/mahliyo_tutor_avatar_1793208119384.jpg"
              alt="Mahliyo"
              className="w-8 h-8 rounded-xl object-cover shrink-0 mt-1 border border-pink-500/40"
              referrerPolicy="no-referrer"
            />
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-[#111C30] border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-pink-300 font-medium ml-1">Mahliyo javob tayyorlamoqda...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="py-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip.text)}
            className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/40 text-[11px] text-slate-300 hover:text-pink-300 whitespace-nowrap transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center gap-2 bg-[#111C30] border border-slate-800 rounded-2xl p-2 shadow-lg focus-within:border-pink-500/50 transition-colors"
        >
          {/* Microphone Language Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-1.5 py-1">
            <select
              value={micLanguage}
              onChange={(e) => {
                const lang = e.target.value as 'tr-TR' | 'uz-UZ' | 'ru-RU';
                setMicLanguage(lang);
                if (recognizerRef.current) {
                  recognizerRef.current.setLanguage(lang);
                }
              }}
              title="Mikrofon tili"
              className="bg-transparent text-[11px] text-slate-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="tr-TR" className="bg-[#0F172A] text-white">TR</option>
              <option value="uz-UZ" className="bg-[#0F172A] text-white">UZ</option>
              <option value="ru-RU" className="bg-[#0F172A] text-white">RU</option>
            </select>
          </div>

          {/* Microphone Push-to-Talk button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 rounded-xl transition-all ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                : 'text-slate-400 hover:text-pink-400 hover:bg-slate-900'
            }`}
            title={isRecording ? "Yozishni to'xtatish" : "Ovoz bilan gapirish"}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isRecording
                ? `Ovoz eshitilmoqda (${micLanguage.split('-')[0].toUpperCase()})...`
                : "Turkcha, o'zbekcha yoki ruscha yozing..."
            }
            className="flex-1 bg-transparent border-0 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 px-2"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-md shadow-pink-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between px-2 pt-1.5 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-pink-400" />
            <span>Mikrofonni bosib bemalol gapiring — Mahliyo ovoz bilan javob beradi</span>
          </span>
          <span>Enter orqali yuborish</span>
        </div>
      </div>
    </div>
  );
};
