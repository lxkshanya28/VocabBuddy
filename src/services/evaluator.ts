import { UpgradeSuggestion } from '../types/vocabulary';

export type EvaluationResult = {
  correct: boolean;
  feedback: string;
};

export function evaluateSentence(sentence: string, suggestion: UpgradeSuggestion): EvaluationResult {
  const trimmed = sentence.trim();
  const normalized = trimmed.toLowerCase();
  const targetWords = [suggestion.selectedWord, ...suggestion.recommendedWords].map((word) => word.toLowerCase());
  const usedTarget = targetWords.some((word) => new RegExp(`\\b${escapeRegExp(word)}\\b`, 'i').test(normalized));
  const wordCount = normalized.split(/\s+/).filter(Boolean).length;

  if (!usedTarget) {
    return {
      correct: false,
      feedback: `Try reusing "${suggestion.selectedWord}" in a sentence connected to your own example.`,
    };
  }

  if (wordCount < 5) {
    return {
      correct: false,
      feedback: `Good start using "${suggestion.selectedWord}". Try a fuller sentence with a little context.`,
    };
  }

  if (!hasBasicSentenceStructure(normalized)) {
    return {
      correct: false,
      feedback: `"${suggestion.selectedWord}" is present, but the sentence needs a clearer subject and verb.`,
    };
  }

  const semanticIssue = validateWordSemantics(normalized, suggestion.selectedWord.toLowerCase());
  if (semanticIssue) {
    return {
      correct: false,
      feedback: semanticIssue,
    };
  }

  return {
    correct: true,
    feedback: `"${suggestion.selectedWord}" fits naturally here. Nice precision without sounding forced.`,
  };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasBasicSentenceStructure(sentence: string) {
  const hasSubject = /\b(i|we|you|he|she|they|the|my|our|her|his|their|a|an)\b/.test(sentence);
  const hasVerb = /\b(am|are|is|was|were|be|been|being|felt|feel|feels|made|makes|became|becomes|seemed|seems|had|has|have|gave|gives|showed|shows|required|requires|connected|helped|helps|needed|needs)\b/.test(sentence);
  return hasSubject && hasVerb;
}

function validateWordSemantics(sentence: string, selectedWord: string) {
  const validators: Record<string, (sentence: string) => string | null> = {
    compelling: validateCompelling,
    effective: validateCompelling,
    delighted: validateDelighted,
    impressed: validateDelighted,
    challenging: validateChallenging,
    ineffective: validateChallenging,
    thoughtful: validateThoughtful,
    polished: validateThoughtful,
    detail: validateDetailPriorityContext,
    priority: validateDetailPriorityContext,
    context: validateDetailPriorityContext,
    essential: validateEssential,
    critical: validateEssential,
    disappointed: validateDisappointed,
    discouraged: validateDisappointed,
  };

  return validators[selectedWord]?.(sentence) ?? null;
}

function validateDelighted(sentence: string) {
  if (hasIncorrectSubject(sentence, ['project', 'presentation', 'update', 'report', 'document', 'spreadsheet', 'timeline', 'plan', 'process', 'thing', 'stuff'], ['delighted', 'impressed'])) {
    return '"delighted" should describe a person or group feeling pleased, not an inanimate object.';
  }

  if (!hasPersonFeelingSubject(sentence, ['delighted', 'impressed'])) {
    return 'Use "delighted" for a person or group, such as "I was delighted" or "the team felt delighted."';
  }

  if (/\b(delighted|impressed)\s+because\s+it\s+was\s+(blue|green|red|large|small|round|square)\b/.test(sentence)) {
    return '"delighted" needs an emotional reason, not an unrelated physical description.';
  }

  return null;
}

function validateDisappointed(sentence: string) {
  if (hasIncorrectSubject(sentence, ['project', 'presentation', 'update', 'report', 'document', 'spreadsheet', 'timeline', 'plan', 'process'], ['disappointed', 'discouraged'])) {
    return '"disappointed" should describe a person or group reacting to an unmet expectation.';
  }

  if (!hasPersonFeelingSubject(sentence, ['disappointed', 'discouraged'])) {
    return 'Use "disappointed" for a person or group, such as "I felt disappointed" or "the client was disappointed."';
  }

  return null;
}

function validateCompelling(sentence: string) {
  if (/\b(i|we|she|he|they)\s+(felt|was|were|am|are)\s+(compelling|effective)\b/.test(sentence)) {
    return '"compelling" usually describes an idea, update, story, or argument, not how a person feels.';
  }

  if (/\b(compelling|effective)\s+because\s+it\s+was\s+(blue|green|red|round|square)\b/.test(sentence)) {
    return '"compelling" needs a reason tied to clarity, evidence, persuasion, or impact.';
  }

  return null;
}

function validateChallenging(sentence: string) {
  if (/\b(i|we|she|he|they|team|manager|client)\s+(felt|was|were|am|are)\s+(challenging|ineffective)\b/.test(sentence)) {
    return '"challenging" should describe a task, timeline, situation, or process rather than a person feeling something.';
  }

  return null;
}

function validateThoughtful(sentence: string) {
  if (hasIncorrectSubject(sentence, ['deadline', 'spreadsheet', 'budget', 'timeline'], ['thoughtful', 'polished'])) {
    return '"thoughtful" should describe a person, response, action, or feedback that shows care.';
  }

  return null;
}

function validateDetailPriorityContext(sentence: string) {
  if (/\b(i|we|she|he|they)\s+(felt|was|were|am|are)\s+(detail|priority|context)\b/.test(sentence)) {
    return 'Use this word as a noun for information, importance, or background, not as a feeling.';
  }

  return null;
}

function validateEssential(sentence: string) {
  if (/\b(i|we|she|he|they)\s+(felt|was|were|am|are)\s+(essential|critical)\s+(happy|sad|delighted|disappointed)\b/.test(sentence)) {
    return '"essential" should describe something necessary, not intensify an emotion.';
  }

  if (/\b(essential|critical)\s+because\s+it\s+was\s+(blue|green|red|round|square)\b/.test(sentence)) {
    return '"essential" needs a reason tied to necessity or importance.';
  }

  return null;
}

function hasPersonFeelingSubject(sentence: string, words: string[]) {
  const wordGroup = words.map(escapeRegExp).join('|');
  const personOrGroup = '(i|we|you|he|she|they|my manager|the manager|our manager|the team|my team|our team|the client|the customer|customers|people|everyone)';
  return new RegExp(`\\b${personOrGroup}\\s+(am|are|is|was|were|felt|feel|feels|seemed|seems|became|becomes)\\s+(${wordGroup})\\b`).test(sentence);
}

function hasIncorrectSubject(sentence: string, subjects: string[], words: string[]) {
  const subjectGroup = subjects.map(escapeRegExp).join('|');
  const wordGroup = words.map(escapeRegExp).join('|');
  return new RegExp(`\\b(the|my|our|a|an)?\\s*(${subjectGroup})(\\s+\\w+){0,2}\\s+(was|is|were|felt|feels|seemed|became)\\s+(${wordGroup})\\b`).test(sentence);
}
