export type VocabularyCategory = 'Professional' | 'Academic' | 'Everyday' | 'Expressive';

export type UpgradeSuggestion = {
  id: string;
  originalPhrase: string;
  recommendedWords: string[];
  selectedWord: string;
  category: VocabularyCategory;
  meaning: string;
  pronunciation: string;
  example: string;
};

export type TranscriptAnalysis = {
  originalTranscript: string;
  categoryScores: Record<VocabularyCategory, number>;
  repeatedBasics: string[];
  suggestions: UpgradeSuggestion[];
  improvedTranscript: string;
};

export type LessonAttempt = {
  suggestionId: string;
  word: string;
  sentence: string;
  correct: boolean;
  feedback: string;
  timestamp: number;
};

export type LearnerProfile = {
  onboarded: boolean;
  streak: number;
  wordsLearned: number;
  attempts: number;
  correctAttempts: number;
  dna: Record<VocabularyCategory, number>;
  analysis?: TranscriptAnalysis;
  history: LessonAttempt[];
  masteredWords: string[];
  reviewWords: string[];
  lastActiveDate?: string;
};
