export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface VocabularyItem {
  id: string;
  tr: string;
  uz: string;
  pronunciation?: string;
  exampleTr: string;
  exampleUz: string;
  category: string;
}

export interface DialogueLine {
  speaker: string;
  tr: string;
  uz: string;
}

export type QuestionType = 'multiple_choice' | 'fill_blank' | 'sentence_order' | 'translation';

export interface ExerciseItem {
  id: string;
  type: QuestionType;
  promptUz: string;
  contextTr?: string;
  options?: string[];
  correctAnswer: string;
  explanationUz: string;
  points: number;
}

export interface LessonUnit {
  id: string;
  cefrLevel: CefrLevel;
  unitOrder: number;
  titleUz: string;
  titleTr: string;
  descriptionUz: string;
  grammarTitleUz: string;
  grammarNotesUz: string;
  comparisonWithUzbek: string;
  vocabulary: VocabularyItem[];
  dialogues: DialogueLine[];
  exercises: ExerciseItem[];
  estimatedMinutes: number;
}

export interface CorrectionItem {
  original: string;
  corrected: string;
  explanationUz: string;
}

export interface MahliyoChatMessage {
  id: string;
  sender: 'user' | 'mahliyo';
  textTr: string;
  textUz?: string;
  encouragement?: string;
  corrections?: CorrectionItem[];
  nextQuestion?: string;
  timestamp: string;
  isAudioPlaying?: boolean;
}

export interface SpeakingPrompt {
  id: string;
  cefrLevel: CefrLevel;
  titleUz: string;
  titleTr: string;
  contextUz: string;
  targetSentenceTr: string;
  translationUz: string;
  difficulty: 'Oson' | "O'rta" | 'Qiyin';
  audioSpeedHint?: number;
}

export interface SpeakingAttemptRecord {
  id: string;
  promptId: string;
  targetTr: string;
  transcript: string;
  overallScore: number;
  accuracyScore: number;
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  suggestedCorrection: string;
  feedbackUz: string;
  phoneticNotesUz?: string;
  createdAt: string;
}

export interface WritingTask {
  id: string;
  cefrLevel: CefrLevel;
  titleUz: string;
  promptTr: string;
  instructionsUz: string;
  minWords: number;
}

export interface WritingAttemptRecord {
  id: string;
  taskId: string;
  topicTitle: string;
  submittedText: string;
  wordCount: number;
  overallScore: number;
  taskAchievementScore: number;
  coherenceScore: number;
  vocabularyScore: number;
  grammarScore: number;
  feedbackUz: string;
  corrections: CorrectionItem[];
  suggestedRewriteTr: string;
  createdAt: string;
}

export interface UserProgressState {
  currentLevel: CefrLevel;
  totalXp: number;
  streakDays: number;
  completedLessons: string[]; // lesson ids
  lessonScores: Record<string, number>; // lessonId -> percentage
  savedVocabIds: string[];
  audioSpeed: number;
  autoSpeakTutor: boolean;
  mahliyoSessionActive: boolean;
}
