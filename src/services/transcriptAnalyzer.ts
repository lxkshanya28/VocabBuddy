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
}> = [
  {
    pattern: /\breally good\b|\bvery good\b|\bgood\b/i,
    original: 'really good',
    upgrades: ['compelling', 'effective'],
    category: 'Professional',
    meaning: 'Strong, interesting, and persuasive.',
    pronunciation: 'kuhm-PEL-ing',
    example: 'The update was compelling because it connected the metrics to a clear customer story.',
  },
  {
    pattern: /\bvery happy\b|\breally happy\b|\bhappy\b/i,
    original: 'very happy',
    upgrades: ['delighted', 'impressed'],
    category: 'Expressive',
    meaning: 'Very pleased, often because something exceeded expectations.',
    pronunciation: 'duh-LAI-tid',
    example: 'My manager was delighted with how clearly I explained the tradeoffs.',
  },
  {
    pattern: /\bbad\b|\breally bad\b|\bnot good\b/i,
    original: 'bad',
    upgrades: ['challenging', 'ineffective'],
    category: 'Everyday',
    meaning: 'Difficult, demanding, or not producing the result you wanted.',
    pronunciation: 'CHAL-uhn-jing',
    example: 'The timeline was challenging, so we reduced scope before launch.',
  },
  {
    pattern: /\bnice\b/i,
    original: 'nice',
    upgrades: ['thoughtful', 'polished'],
    category: 'Expressive',
    meaning: 'Carefully considered and pleasant in a specific way.',
    pronunciation: 'THAWT-fuhl',
    example: 'Her feedback was thoughtful and helped me improve the draft.',
  },
  {
    pattern: /\bthing\b|\bstuff\b|\bthings\b/i,
    original: 'thing',
    upgrades: ['detail', 'priority', 'context'],
    category: 'Academic',
    meaning: 'A more precise word for an idea, task, or piece of information.',
    pronunciation: 'PRAI-or-uh-tee',
    example: 'The biggest priority was making the handoff clear for the support team.',
  },
  {
    pattern: /\bvery important\b|\breally important\b|\bimportant\b/i,
    original: 'very important',
    upgrades: ['essential', 'critical'],
    category: 'Professional',
    meaning: 'Necessary for success or too significant to ignore.',
    pronunciation: 'uh-SEN-shuhl',
    example: 'It was essential to align the team before changing the process.',
  },
  {
    pattern: /\bsad\b|\breally sad\b|\bvery sad\b/i,
    original: 'sad',
    upgrades: ['disappointed', 'discouraged'],
    category: 'Expressive',
    meaning: 'Unhappy because an outcome did not meet hopes or expectations.',
    pronunciation: 'dis-uh-POYN-tid',
    example: 'I felt disappointed when the launch was delayed.',
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
  const matched = basicUpgradeMap.filter((entry) => entry.pattern.test(lowerTranscript)).slice(0, 3);

  if (matched.length === 0 && lowerTranscript.length > 0) {
    matched.push(basicUpgradeMap[4], basicUpgradeMap[0]);
  }

  return matched.map((entry, index) => ({
    id: `upgrade-${index}-${entry.upgrades[0]}`,
    originalPhrase: entry.original,
    recommendedWords: entry.upgrades,
    selectedWord: entry.upgrades[0],
    category: entry.category,
    meaning: entry.meaning,
    pronunciation: entry.pronunciation,
    example: entry.example,
  }));
}

function applySuggestions(transcript: string, suggestions: UpgradeSuggestion[]) {
  return suggestions.reduce((draft, suggestion) => {
    const phrase = suggestion.originalPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return draft.replace(new RegExp(`\\b${phrase}\\b`, 'i'), suggestion.selectedWord);
  }, transcript);
}

function countOccurrences(text: string, word: string) {
  return (text.match(new RegExp(`\\b${word}\\b`, 'g')) ?? []).length;
}
