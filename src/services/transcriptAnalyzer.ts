import { TranscriptAnalysis, UpgradeSuggestion, VocabularyCategory } from '../types/vocabulary';

const categories: VocabularyCategory[] = ['Professional', 'Academic', 'Everyday', 'Expressive'];

const basicUpgradeMap: Array<{
  pattern: RegExp;
  original: string;
  upgrades: string[];
  category: VocabularyCategory;
  meaning: string;
  pronunciation: string;
  example: string;
  validUsagePatterns: string[];
  expectedSubjectTypes: string[];
  commonIncorrectPatterns: string[];
  practicePrompt: string;
  placeholderExample: string;
}> = [
  {
    pattern: /\breally good\b|\bvery good\b|\bgood\b/i,
    original: 'really good',
    upgrades: ['compelling', 'effective'],
    category: 'Professional',
    meaning: 'Strong, interesting, and persuasive.',
    pronunciation: 'kuhm-PEL-ing',
    example: 'The update was compelling because it connected the metrics to a clear customer story.',
    validUsagePatterns: ['An idea, update, case, story, or presentation can be compelling.', 'Use it when something earns attention or persuades people.'],
    expectedSubjectTypes: ['idea', 'argument', 'story', 'presentation', 'update', 'case'],
    commonIncorrectPatterns: ['I felt compelling because...', 'The person was compellingly happy.'],
    practicePrompt: 'Describe an update, idea, or presentation that earned attention.',
    placeholderExample: 'Example: The proposal was compelling because it connected the data to a customer need.',
  },
  {
    pattern: /\bvery happy\b|\breally happy\b|\bhappy\b/i,
    original: 'very happy',
    upgrades: ['delighted', 'impressed'],
    category: 'Expressive',
    meaning: 'Very pleased, often because something exceeded expectations.',
    pronunciation: 'duh-LAI-tid',
    example: 'My manager was delighted with how clearly I explained the tradeoffs.',
    validUsagePatterns: ['A person or group can be delighted.', 'Use it for happiness or satisfaction experienced by someone.'],
    expectedSubjectTypes: ['person', 'team', 'manager', 'client', 'customer', 'group'],
    commonIncorrectPatterns: ['The project was delighted.', 'The presentation felt delighted.', 'The update was delighted.'],
    practicePrompt: 'Describe a person or team feeling pleased by a result.',
    placeholderExample: 'Example: The team was delighted when the customer approved the launch plan.',
  },
  {
    pattern: /\bbad\b|\breally bad\b|\bnot good\b/i,
    original: 'bad',
    upgrades: ['challenging', 'ineffective'],
    category: 'Everyday',
    meaning: 'Difficult, demanding, or not producing the result you wanted.',
    pronunciation: 'CHAL-uhn-jing',
    example: 'The timeline was challenging, so we reduced scope before launch.',
    validUsagePatterns: ['A task, timeline, situation, or goal can be challenging.', 'Use it when something requires effort or creates difficulty.'],
    expectedSubjectTypes: ['task', 'timeline', 'project', 'situation', 'goal', 'process'],
    commonIncorrectPatterns: ['I was challenging because I was sad.', 'The team felt challenging.'],
    practicePrompt: 'Describe a task, timeline, or situation that required effort.',
    placeholderExample: 'Example: The timeline was challenging because two approvals arrived late.',
  },
  {
    pattern: /\bnice\b/i,
    original: 'nice',
    upgrades: ['thoughtful', 'polished'],
    category: 'Expressive',
    meaning: 'Carefully considered and pleasant in a specific way.',
    pronunciation: 'THAWT-fuhl',
    example: 'Her feedback was thoughtful and helped me improve the draft.',
    validUsagePatterns: ['A person, response, gesture, note, or feedback can be thoughtful.', 'Use it when something shows care or consideration.'],
    expectedSubjectTypes: ['person', 'feedback', 'response', 'gesture', 'note', 'comment'],
    commonIncorrectPatterns: ['The deadline was thoughtful.', 'The spreadsheet felt thoughtful.'],
    practicePrompt: 'Describe feedback, a response, or an action that showed care.',
    placeholderExample: 'Example: Her feedback was thoughtful because it gave me a clear next step.',
  },
  {
    pattern: /\bthing\b|\bstuff\b|\bthings\b/i,
    original: 'thing',
    upgrades: ['detail', 'priority', 'context'],
    category: 'Academic',
    meaning: 'A more precise word for an idea, task, or piece of information.',
    pronunciation: 'PRAI-or-uh-tee',
    example: 'The biggest priority was making the handoff clear for the support team.',
    validUsagePatterns: ['Use detail for one specific piece of information.', 'Use priority for the most important task or goal.', 'Use context for background that helps something make sense.'],
    expectedSubjectTypes: ['information', 'task', 'goal', 'background'],
    commonIncorrectPatterns: ['I was detail because...', 'The team felt priority.'],
    practicePrompt: 'Name one specific detail, priority, or context from your original example.',
    placeholderExample: 'Example: The most important detail was the customer deadline.',
  },
  {
    pattern: /\bvery important\b|\breally important\b|\bimportant\b/i,
    original: 'very important',
    upgrades: ['essential', 'critical'],
    category: 'Professional',
    meaning: 'Necessary for success or too significant to ignore.',
    pronunciation: 'uh-SEN-shuhl',
    example: 'It was essential to align the team before changing the process.',
    validUsagePatterns: ['A step, task, requirement, or action can be essential.', 'Use it when something is necessary, not just nice to have.'],
    expectedSubjectTypes: ['step', 'task', 'requirement', 'action', 'decision', 'alignment'],
    commonIncorrectPatterns: ['I felt essential because...', 'The team was essential happy.'],
    practicePrompt: 'Describe a step or decision that was necessary for success.',
    placeholderExample: 'Example: It was essential to confirm ownership before the rollout.',
  },
  {
    pattern: /\bsad\b|\breally sad\b|\bvery sad\b/i,
    original: 'sad',
    upgrades: ['disappointed', 'discouraged'],
    category: 'Expressive',
    meaning: 'Unhappy because an outcome did not meet hopes or expectations.',
    pronunciation: 'dis-uh-POYN-tid',
    example: 'I felt disappointed when the launch was delayed.',
    validUsagePatterns: ['A person or group can feel disappointed.', 'Use it when expectations were not met.'],
    expectedSubjectTypes: ['person', 'team', 'client', 'customer', 'group'],
    commonIncorrectPatterns: ['The project was disappointed.', 'The report felt disappointed.'],
    practicePrompt: 'Describe a person or group reacting to an unmet expectation.',
    placeholderExample: 'Example: I felt disappointed when the launch moved to next week.',
  },
];

const categorySignals: Record<VocabularyCategory, string[]> = {
  Professional: ['project', 'manager', 'team', 'client', 'presentation', 'meeting', 'deadline', 'process', 'launch', 'customer'],
  Academic: ['learned', 'research', 'study', 'analysis', 'evidence', 'concept', 'explain', 'topic', 'class'],
  Everyday: ['week', 'home', 'friend', 'family', 'went', 'made', 'day', 'time', 'work'],
  Expressive: ['proud', 'happy', 'sad', 'excited', 'worried', 'felt', 'feel', 'love', 'hope'],
};

const basicWords = ['good', 'bad', 'nice', 'very', 'really', 'thing', 'things', 'stuff', 'happy', 'sad'];

export function analyzeTranscript(transcript: string): TranscriptAnalysis {
  const normalized = transcript.trim();
  const lower = normalized.toLowerCase();
  const repeatedBasics = basicWords.filter((word) => countOccurrences(lower, word) > 0);

  const suggestions = buildSuggestions(lower);
  const categoryScores = categories.reduce<Record<VocabularyCategory, number>>((scores, category) => {
    const matches = categorySignals[category].filter((signal) => lower.includes(signal)).length;
    const suggestionBoost = suggestions.filter((item) => item.category === category).length * 2;
    scores[category] = Math.min(100, 35 + matches * 10 + suggestionBoost * 8);
    return scores;
  }, {} as Record<VocabularyCategory, number>);

  const improvedTranscript = applySuggestions(normalized, suggestions);

  return {
    originalTranscript: normalized,
    categoryScores,
    repeatedBasics,
    suggestions,
    improvedTranscript,
  };
}

function buildSuggestions(lowerTranscript: string): UpgradeSuggestion[] {
  const matched = basicUpgradeMap
    .map((entry) => ({ entry, detectedPhrase: lowerTranscript.match(entry.pattern)?.[0] ?? '' }))
    .filter((item) => item.detectedPhrase)
    .slice(0, 3);

  if (matched.length === 0 && lowerTranscript.length > 0) {
    matched.push({ entry: basicUpgradeMap[4], detectedPhrase: basicUpgradeMap[4].original });
    matched.push({ entry: basicUpgradeMap[0], detectedPhrase: basicUpgradeMap[0].original });
  }

  return matched.map(({ entry, detectedPhrase }, index) => ({
    id: `upgrade-${index}-${entry.upgrades[0]}`,
    originalPhrase: entry.original,
    detectedPhrase,
    recommendedWords: entry.upgrades,
    selectedWord: entry.upgrades[0],
    category: entry.category,
    meaning: entry.meaning,
    pronunciation: entry.pronunciation,
    example: entry.example,
    validUsagePatterns: entry.validUsagePatterns,
    expectedSubjectTypes: entry.expectedSubjectTypes,
    commonIncorrectPatterns: entry.commonIncorrectPatterns,
    practicePrompt: entry.practicePrompt,
    placeholderExample: entry.placeholderExample,
  }));
}

function applySuggestions(transcript: string, suggestions: UpgradeSuggestion[]) {
  return suggestions.reduce((draft, suggestion) => {
    if (!canSafelyReplace(suggestion.detectedPhrase, suggestion.selectedWord)) return draft;
    const phrase = suggestion.detectedPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return draft.replace(new RegExp(`\\b${phrase}\\b`, 'i'), suggestion.selectedWord);
  }, transcript);
}

export function canSafelyReplace(phrase: string, selectedWord: string) {
  if (!phrase || !selectedWord) return false;
  const normalizedPhrase = phrase.toLowerCase().trim();
  const normalizedWord = selectedWord.toLowerCase().trim();

  const safeMap: Record<string, string[]> = {
    compelling: ['really good', 'very good', 'good'],
    delighted: ['very happy', 'really happy', 'happy'],
    challenging: ['bad', 'really bad', 'not good'],
    thoughtful: ['nice'],
    detail: ['thing', 'things'],
    priority: ['thing', 'things'],
    context: ['thing', 'things', 'stuff'],
    essential: ['very important', 'really important', 'important'],
    disappointed: ['sad', 'really sad', 'very sad'],
  };

  return safeMap[normalizedWord]?.includes(normalizedPhrase) ?? false;
}

function countOccurrences(text: string, word: string) {
  return (text.match(new RegExp(`\\b${word}\\b`, 'g')) ?? []).length;
}
