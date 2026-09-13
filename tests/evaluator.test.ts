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
  expectedOutcome: 'mastered' | 'almost' | 'review';
}> = [
  {
    name: 'correct usage accepts compelling for an idea or presentation',
    sentence: 'The presentation was compelling because it connected the metrics to the customer problem.',
    suggestion: compelling,
    expected: true,
    expectedOutcome: 'mastered',
  },
  {
    name: 'missing target word is rejected',
    sentence: 'The presentation was clear because it connected the metrics to the customer problem.',
    suggestion: compelling,
    expected: false,
    expectedOutcome: 'review',
  },
  {
    name: 'one-word response is rejected',
    sentence: 'Compelling',
    suggestion: compelling,
    expected: false,
    expectedOutcome: 'review',
  },
  {
    name: 'grammatically invalid usage is rejected',
    sentence: 'Compelling because metrics customer.',
    suggestion: compelling,
    expected: false,
    expectedOutcome: 'review',
  },
  {
    name: 'semantically invalid delighted subject is rejected',
    sentence: 'The project update felt delighted because it was blue.',
    suggestion: delighted,
    expected: false,
    expectedOutcome: 'review',
  },
  {
    name: 'accepts delighted: I was delighted',
    sentence: 'I was delighted when the customer approved the launch plan.',
    suggestion: delighted,
    expected: true,
    expectedOutcome: 'mastered',
  },
  {
    name: 'accepts delighted: The team felt delighted',
    sentence: 'The team felt delighted because the handoff went smoothly.',
    suggestion: delighted,
    expected: true,
    expectedOutcome: 'mastered',
  },
  {
    name: 'accepts delighted: She felt delighted',
    sentence: 'She felt delighted when her project won the competition.',
    suggestion: delighted,
    expected: true,
    expectedOutcome: 'mastered',
  },
  {
    name: 'accepts delighted: The students were delighted',
    sentence: 'The students were delighted when their project won the competition.',
    suggestion: delighted,
    expected: true,
    expectedOutcome: 'mastered',
  },
  {
    name: 'accepts delighted: My parents seemed delighted',
    sentence: 'My parents seemed delighted when I finished the course.',
    suggestion: delighted,
    expected: true,
    expectedOutcome: 'mastered',
  },
  {
    name: 'accepts delighted: Everyone was delighted',
    sentence: 'Everyone was delighted when the event finished successfully.',
    suggestion: delighted,
    expected: true,
    expectedOutcome: 'mastered',
  },
  {
    name: 'accepts delighted: Lakshanya was delighted',
    sentence: 'Lakshanya was delighted when the team recognized her work.',
    suggestion: delighted,
    expected: true,
    expectedOutcome: 'mastered',
  },
  {
    name: 'accepts delighted: The customers were delighted',
    sentence: 'The customers were delighted when the issue was resolved.',
    suggestion: delighted,
    expected: true,
    expectedOutcome: 'mastered',
  },
  {
    name: 'accepts delighted: People were delighted',
    sentence: 'People were delighted when the service became easier to use.',
    suggestion: delighted,
    expected: true,
    expectedOutcome: 'mastered',
  },
  {
    name: 'rejects delighted: The project was delighted',
    sentence: 'The project was delighted when the deadline moved.',
    suggestion: delighted,
    expected: false,
    expectedOutcome: 'review',
  },
  {
    name: 'rejects delighted: The table felt delighted',
    sentence: 'The table felt delighted because it was blue.',
    suggestion: delighted,
    expected: false,
    expectedOutcome: 'review',
  },
  {
    name: 'rejects delighted: The presentation was delighted',
    sentence: 'The presentation was delighted after the meeting ended.',
    suggestion: delighted,
    expected: false,
    expectedOutcome: 'review',
  },
  {
    name: 'rejects delighted: I delighted blue the project',
    sentence: 'I delighted blue the project',
    suggestion: delighted,
    expected: false,
    expectedOutcome: 'review',
  },
  {
    name: 'rejects delighted: Delighted.',
    sentence: 'Delighted.',
    suggestion: delighted,
    expected: false,
    expectedOutcome: 'review',
  },
];

for (const testCase of cases) {
  const result = evaluateSentence(testCase.sentence, testCase.suggestion);
  assertEqual(result.correct, testCase.expected, `${testCase.name}: ${result.feedback}`);
  assertOutcome(result.outcome, testCase.expectedOutcome, `${testCase.name}: ${result.feedback}`);
}

const firstAttempt = evaluateSentence('The project was delighted when the deadline moved.', delighted);
const secondAttempt = evaluateSentence('The students were delighted when their project won the competition.', delighted);
assertEqual(firstAttempt.correct, false, 'resubmission setup should begin with an incorrect attempt');
assertEqual(secondAttempt.correct, true, 'latest valid resubmission should be able to master the word');

console.log(`Evaluator tests passed: ${cases.length + 2}`);

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

function assertOutcome(actual: 'mastered' | 'almost' | 'review', expected: 'mastered' | 'almost' | 'review', message: string) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected outcome ${expected}, received ${actual}.`);
  }
}

function assertOk<T>(value: T | undefined | null, message: string): asserts value is T {
  if (!value) {
    throw new Error(message);
  }
}
