/**
 * Web Speech API and Natural Voice service for Turkish, Uzbek, and Russian
 */

export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

// Global cached voices
let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

/**
 * Filter out emojis, non-speech symbols, and parenthetical translations for crystal clear pronunciation
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    // Remove parenthetical notes and translations, e.g. (o'ngga buril), (salom), (uzbekcha)
    .replace(/\([^)]*\)/g, ' ')
    // Remove emojis, pictographs, symbols and decorative icons
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
    // Remove markdown formatting characters
    .replace(/[*_#`~[\]]/g, '')
    // Replace quotes with gentle natural pauses
    .replace(/["“”«»]/g, ' ')
    // Replace hyphens and dashes with comma or spaces
    .replace(/[-–—]/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Find the highest fidelity Turkish voice (matching the Vocabulary Bank quality)
 */
export function getTurkishVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined;

  const liveVoices = window.speechSynthesis.getVoices();
  const voices = liveVoices.length > 0 ? liveVoices : loadVoices();
  if (voices.length === 0) return undefined;

  const trVoices = voices.filter((v) => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    return lang.startsWith('tr') || lang === 'tr-tr';
  });

  if (trVoices.length === 0) {
    // Fallback: search by name
    return voices.find((v) => /turkish|türkçe/i.test(v.name));
  }

  // Priority scoring to select the best natural Turkish female/neural voice
  const scored = trVoices.map((v) => {
    const name = v.name.toLowerCase();
    let score = 10;
    // Top tier: Natural/Neural voices (e.g. Edge Natural, Apple Siri/Yelda Enhanced)
    if (name.includes('natural') || name.includes('neural')) score += 50;
    // Google Türkçe is crisp and identical to Android/Chrome Vocabulary Bank playback
    if (name.includes('google')) score += 40;
    // Known high-quality female Turkish voice personas
    if (
      name.includes('emel') ||
      name.includes('yelda') ||
      name.includes('dilara') ||
      name.includes('seda') ||
      name.includes('filiz')
    ) {
      score += 35;
    }
    if (name.includes('female') || name.includes('kadın')) score += 20;
    if (v.default) score += 5;
    return { voice: v, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.voice;
}

/**
 * Native Turkish speech synthesizer — matching the Vocabulary Bank pronunciation
 * Breaks longer text into natural sentence utterances to avoid browser speech fatigue/degradation
 */
export function speakTurkish(
  rawText: string,
  rate = 1.0,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: unknown) => void
): () => void {
  if (!isSpeechSynthesisSupported()) {
    onError?.('Speech synthesis not supported');
    return () => {};
  }

  const cleaned = cleanTextForSpeech(rawText);
  if (!cleaned) {
    onEnd?.();
    return () => {};
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Split into natural sentences for crisp delivery like Vocabulary Bank
  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length === 0) {
    onEnd?.();
    return () => {};
  }

  let isCancelled = false;
  let currentIndex = 0;
  const voice = getTurkishVoice();

  const speakNextSentence = () => {
    if (isCancelled || currentIndex >= sentences.length) {
      if (!isCancelled) onEnd?.();
      return;
    }

    const currentText = sentences[currentIndex];
    const utterance = new SpeechSynthesisUtterance(currentText);
    utterance.lang = 'tr-TR';
    utterance.rate = Math.max(0.7, Math.min(1.3, rate));
    utterance.pitch = 1.0; // Standard crisp pitch (same as Vocabulary Bank)

    if (voice) {
      utterance.voice = voice;
    }

    if (currentIndex === 0 && onStart) {
      utterance.onstart = () => {
        if (!isCancelled) onStart();
      };
    }

    utterance.onend = () => {
      if (isCancelled) return;
      currentIndex++;
      if (currentIndex < sentences.length) {
        // Natural small pause (100ms) between sentences
        setTimeout(() => {
          if (!isCancelled) speakNextSentence();
        }, 100);
      } else {
        onEnd?.();
      }
    };

    utterance.onerror = (event) => {
      if (isCancelled) return;
      if (event.error === 'interrupted' || event.error === 'canceled') {
        return;
      }
      console.warn('Turkish utterance notice:', event);
      currentIndex++;
      if (currentIndex < sentences.length) {
        speakNextSentence();
      } else {
        onError?.(event);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNextSentence();

  return () => {
    isCancelled = true;
    window.speechSynthesis.cancel();
  };
}

/**
 * Multilingual speech synthesis for Uzbek or Russian explanation
 */
export function speakMultilingual(
  rawText: string,
  lang: 'tr-TR' | 'uz-UZ' | 'ru-RU' = 'tr-TR',
  rate = 1.0,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: unknown) => void
): () => void {
  if (!isSpeechSynthesisSupported()) {
    onError?.('Speech synthesis not supported');
    return () => {};
  }

  const text = cleanTextForSpeech(rawText);
  if (!text) {
    onEnd?.();
    return () => {};
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = Math.max(0.6, Math.min(1.4, rate));
  utterance.pitch = 1.0;

  const voices = loadVoices();
  const langPrefix = lang.split('-')[0].toLowerCase();
  const matching = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
  if (matching.length > 0) {
    utterance.voice = matching[0];
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speech Recognition session supporting Turkish, Uzbek, or Russian
 */
export class MultilingualSpeechRecognizer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private isListening = false;
  private currentLang = 'tr-TR';

  constructor(
    private onResult: (transcript: string, isFinal: boolean) => void,
    private onError: (errorMsg: string) => void,
    private onStateChange: (listening: boolean) => void,
    lang = 'tr-TR'
  ) {
    this.currentLang = lang;
    if (isSpeechRecognitionSupported()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = lang;
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const combined = (finalTranscript || interimTranscript).trim();
        this.onResult(combined, Boolean(finalTranscript));
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recognition.onerror = (event: any) => {
        let msg = "Ovozni aniqlashda xatolik yuz berdi.";
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          msg = "Mikrofon ruxsati berilmadi. Iltimos brauzer sozlamalarida mikrofonga ruxsat bering.";
        } else if (event.error === 'no-speech') {
          msg = "Ovoz eshitilmadi. Qaytadan gapiring.";
        }
        this.onError(msg);
        this.stop();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onStateChange(false);
      };
    }
  }

  public setLanguage(lang: string) {
    this.currentLang = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public start(): boolean {
    if (!this.recognition) {
      this.onError("Brauzeringiz ovoz bilan kiritishni qo'llab-quvvatlamaydi. Chrome yoki Edge tavsiya etiladi.");
      return false;
    }

    try {
      this.recognition.lang = this.currentLang;
      this.recognition.start();
      this.isListening = true;
      this.onStateChange(true);
      return true;
    } catch (e) {
      console.error('Speech recognition start error:', e);
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
      this.isListening = false;
      this.onStateChange(false);
    }
  }
}

// Backward compatibility alias
export type TurkishSpeechRecognizer = MultilingualSpeechRecognizer;
export const TurkishSpeechRecognizer = MultilingualSpeechRecognizer;
