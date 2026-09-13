import { Volume2 } from 'lucide-react';
import { speak } from '../services/speechRecognition';
import { UpgradeSuggestion } from '../types/vocabulary';

type Props = {
  suggestion: UpgradeSuggestion;
};

export function WordCard({ suggestion }: Props) {
  return (
    <article className="word-card">
      <div className="word-card-top">
        <span>{suggestion.category}</span>
        <button
          className="icon-button"
          type="button"
          title="Hear word and example"
          onClick={() => speak(`${suggestion.selectedWord}. ${suggestion.meaning}. ${suggestion.example}`)}
        >
          <Volume2 size={18} />
        </button>
      </div>
      <h1>{suggestion.selectedWord}</h1>
      <p className="pronunciation">{suggestion.pronunciation}</p>
      <p>{suggestion.meaning}</p>
      <div className="example-box">{suggestion.example}</div>
      <div className="usage-list">
        {(suggestion.validUsagePatterns ?? []).map((pattern) => (
          <span key={pattern}>{pattern}</span>
        ))}
      </div>
      <div className="upgrade-row inline">
        <span>{suggestion.originalPhrase}</span>
        <strong>{suggestion.recommendedWords.join(' / ')}</strong>
      </div>
    </article>
  );
}
