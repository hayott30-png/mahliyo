/**
 * Speech provider abstraction for speech-to-text and text-to-speech
 */

export interface SpeechProviderConfig {
  provider: 'browser_web_speech' | 'gemini_audio';
  defaultLocale: string;
  voiceGender: 'female' | 'male';
}

export const defaultSpeechConfig: SpeechProviderConfig = {
  provider: 'browser_web_speech',
  defaultLocale: 'tr-TR',
  voiceGender: 'female',
};

export interface AudioAssessmentParams {
  transcript: string;
  expectedText?: string;
  targetCefr: string;
  audioDurationSeconds?: number;
}
