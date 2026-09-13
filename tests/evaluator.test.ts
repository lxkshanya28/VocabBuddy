import { evaluateSentence } from '../src/services/evaluator';
import { analyzeTranscript } from '../src/services/transcriptAnalyzer';
import { UpgradeSuggestion } from '../src/types/vocabulary';

const analysis = analyzeTranscript('My presentation was really good and my manager was very happy.');
const compelling = findSuggestion('compelling');
const delighted = findSuggestion('delighted');

const cases: Array<{
  name: string;
  sentence: string;
  suggestion: UpgradeSuggestion;
  expected: boolean;
}> = [
  {
    name: 'correct usage accepts compelling for an idea or presentation',
    sentence: 'The presentation was compelling because it connected the metrics to the customer problem.',
    suggestion: compelling,
    expected: true,
  },
  {
    name: 'missing target word is rejected',
    sentence: 'The presentation was clear because it connected the metrics to the customer problem.',
    suggestion: compelling,
    expected: false,
  },
  {
    name: 'one-word response is rejected',
    sentence: 'Compelling',
    suggestion: compelling,
    expected: false,
  },
  {
    name: 'grammatically invalid usage is rejected',
    sentence: 'Compelling because metrics customer.',
    suggestion: compelling,
    expected: false,
  },
  {
    name: 'semantically invalid delighted subject is rejected',
    sentence: 'The project update felt delighted because it was blue.',
    suggestion: delighted,
    expected: false,
  },
  {
    name: 'valid delighted first-person structure is accepted',
    sentence: 'I was delighted when the customer approved the launch plan.',
    suggestion: delighted,
    expected: true,
  },
  {
    name: 'valid delighted group structure is accepted',
    sentence: 'The team felt delighted because the handoff went smoothly.',
    suggestion: delighted,
    expected: true,
  },
];

for (const testCase of cases) {
  const result = evaluateSentence(testCase.sentence, testCase.suggestion);
  assertEqual(result.correct, testCase.expected, `${testCase.name}: ${result.feedback}`);
}

console.log(`Evaluator tests passed: ${cases.length}`);

function findSuggestion(word: string) {
  const suggestion = analysis.suggestions.find((item) => item.selectedWord === word);
  assertOk(suggestion, `Missing fixture suggestion for ${word}`);
  return suggestion;
}

function assertEqual(actual: boolean, expected: boolean, message: string) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${expected}, received ${actual}.`);
  }
}

function assertOk<T>(value: T | undefined | null, message: string): asserts value is T {
  if (!value) {
    throw new Error(message);
  }
}
