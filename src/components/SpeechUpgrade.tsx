import { ArrowLeft, Play } from 'lucide-react';
import { canSafelyReplace } from '../services/transcriptAnalyzer';
import { LearnerProfile } from '../types/vocabulary';

type Props = {
  profile: LearnerProfile;
  onPracticeMore: () => void;
  onDashboard: () => void;
};

export function SpeechUpgrade({ profile, onPracticeMore, onDashboard }: Props) {
  const analysis = profile.analysis;
  const mastered = profile.masteredWords;
  const review = profile.reviewWords;
  const hasEvaluatedWords = profile.history.length > 0;
  const upgradedCount = analysis?.suggestions.filter((item) => mastered.includes(item.selectedWord)).length ?? 0;
  const after = buildAfterText(profile);

  if (!hasEvaluatedWords) {
    return (
      <section className="screen upgrade-layout">
        <div className="hero-panel compact-hero">
          <div className="eyebrow">Speech Upgrade</div>
          <h1>Practice one word to unlock your before-and-after upgrade.</h1>
          <p className="lede">
            VocabBuddy will compare your original transcript with mastered vocabulary after at least one evaluated sentence.
          </p>
        </div>
        <div className="action-row">
          <button className="secondary-button" type="button" onClick={onDashboard}>
            <ArrowLeft size={17} />
            Dashboard
          </button>
          <button className="primary-button" type="button" onClick={onPracticeMore}>
            <Play size={18} />
            Practice words
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="screen upgrade-layout">
      <div className="hero-panel compact-hero">
        <div className="eyebrow">Speech Upgrade</div>
        <h1>See how your original wording can become more precise.</h1>
        <p className="lede">This comparison uses the transcript you gave in onboarding and the words you practiced.</p>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card">
          <span>Before</span>
          <p>{analysis?.originalTranscript || 'Complete the diagnostic to create a before sample.'}</p>
        </article>
        <article className="comparison-card after">
          <span>After</span>
          <p>{after}</p>
        </article>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span>Expressions upgraded</span>
          <strong>{upgradedCount}</strong>
        </div>
        <div className="metric-card">
          <span>Words mastered</span>
          <strong>{mastered.length ? mastered.join(', ') : 'None yet'}</strong>
        </div>
        <div className="metric-card">
          <span>Needs review</span>
          <strong>{review.length ? review.join(', ') : 'Clear'}</strong>
        </div>
      </div>

      <div className="action-row">
        <button className="secondary-button" type="button" onClick={onDashboard}>
          <ArrowLeft size={17} />
          Dashboard
        </button>
        <button className="primary-button" type="button" onClick={onPracticeMore}>
          <Play size={18} />
          Practice words
        </button>
      </div>
    </section>
  );
}

function buildAfterText(profile: LearnerProfile) {
  if (!profile.analysis) return 'Complete the diagnostic to generate an upgraded version.';

  return profile.analysis.suggestions.reduce((draft, suggestion) => {
    if (!profile.masteredWords.includes(suggestion.selectedWord)) return draft;
    const detectedPhrase = suggestion.detectedPhrase || suggestion.originalPhrase;
    if (!canSafelyReplace(detectedPhrase, suggestion.selectedWord)) return draft;
    const phrase = detectedPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return draft.replace(new RegExp(`\\b${phrase}\\b`, 'i'), suggestion.selectedWord);
  }, profile.analysis.originalTranscript);
}
