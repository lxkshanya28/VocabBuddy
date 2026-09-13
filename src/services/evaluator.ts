import { UpgradeSuggestion } from '../types/vocabulary';

export type EvaluationResult = {
  correct: boolean;
  feedback: string;
};

export function evaluateSentence(sentence: string, suggestion: UpgradeSuggestion): EvaluationResult {
  const normalized = sentence.trim().toLowerCase();
  const targetWords = [suggestion.selectedWord, ...suggestion.recommendedWords].map((word) => word.toLowerCase());
  const usedTarget = targetWords.some((word) => new RegExp(`\\b${escapeRegExp(word)}\\b`, 'i').test(normalized));
  const enoughContext = normalized.split(/\s+/).filter(Boolean).length >= 5;

  if (usedTarget && enoughContext) {
    return {
      correct: true,
      feedback: `"${suggestion.selectedWord}" fits naturally here. Nice precision without sounding forced.`,
    };
  }

  if (usedTarget) {
    return {
      correct: false,
      feedback: `Good start using "${suggestion.selectedWord}". Try a fuller sentence with a little context.`,
    };
  }

  return {
    correct: false,
    feedback: `Try reusing "${suggestion.selectedWord}" in a sentence connected to your own example.`,
  };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
