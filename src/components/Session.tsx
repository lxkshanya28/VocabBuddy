import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { evaluateSentence } from '../services/evaluator';
import { speak } from '../services/speechRecognition';
import { LearnerProfile, LessonAttempt, VocabularyCategory } from '../types/vocabulary';
import { FeedbackPanel } from './FeedbackPanel';
import { ProgressBar } from './ProgressBar';
import { VoiceInput } from './VoiceInput';
import { WordCard } from './WordCard';

type Props = {
  profile: LearnerProfile;
  onProfileChange: (profile: LearnerProfile) => void;
  onComplete: (profile: LearnerProfile) => void;
};

export function Session({ profile, onProfileChange, onComplete }: Props) {
  const suggestions = profile.analysis?.suggestions ?? [];
  const [index, setIndex] = useState(0);
  const [sentence, setSentence] = useState('');
  const [feedback, setFeedback] = useState<LessonAttempt | null>(null);
  const [latestProfile, setLatestProfile] = useState<LearnerProfile>(profile);
  const current = suggestions[index];
  const progress = useMemo(() => Math.round((index / Math.max(suggestions.length, 1)) * 100), [index, suggestions.length]);

  if (!current) {
    return (
      <section className="screen centered">
        <div className="hero-panel compact-hero">
          <h1>No recommendations yet</h1>
          <p className="lede">Reset the demo and complete the speech diagnostic to generate personalized lesson words.</p>
        </div>
      </section>
    );
  }

  function submitSentence() {
    const result = evaluateSentence(sentence, current);
    const attempt: LessonAttempt = {
      suggestionId: current.id,
      word: current.selectedWord,
      sentence,
      correct: result.correct,
      feedback: result.feedback,
      timestamp: Date.now(),
    };

    const dna = { ...profile.dna };
    dna[current.category] = adjustDna(dna[current.category], result.correct);

    const masteredWords = result.correct
      ? Array.from(new Set([...profile.masteredWords, current.selectedWord]))
      : profile.masteredWords;
    const reviewWords = result.correct
      ? profile.reviewWords.filter((word) => word !== current.selectedWord)
      : Array.from(new Set([...profile.reviewWords, current.selectedWord]));

    const nextProfile: LearnerProfile = {
      ...profile,
      dna,
      attempts: profile.attempts + 1,
      correctAttempts: profile.correctAttempts + (result.correct ? 1 : 0),
      wordsLearned: masteredWords.length,
      streak: updateStreak(profile.streak),
      history: [...profile.history, attempt],
      masteredWords,
      reviewWords,
      lastActiveDate: new Date().toISOString().slice(0, 10),
    };

    setFeedback(attempt);
    setLatestProfile(nextProfile);
    onProfileChange(nextProfile);
    speak(result.feedback);
  }

  function nextStep() {
    setSentence('');
    setFeedback(null);
    if (index + 1 >= suggestions.length) {
      onComplete(latestProfile);
      return;
    }
    setIndex(index + 1);
  }

  return (
    <section className="screen session-layout">
      <div className="session-main">
        <div className="session-header">
          <span>Lesson {index + 1} of {suggestions.length}</span>
          <ProgressBar value={feedback ? Math.round(((index + 1) / suggestions.length) * 100) : progress} />
        </div>
        <WordCard suggestion={current} />
        <VoiceInput
          label={`Use "${current.selectedWord}" in a new sentence`}
          placeholder={current.placeholderExample || `Example: Use ${current.selectedWord} in a clear sentence.`}
          value={sentence}
          onChange={setSentence}
          coachingText={`${current.selectedWord}. ${current.meaning}. ${current.example}`}
        />
        <div className="action-row">
          <button className="primary-button" type="button" disabled={sentence.trim().length < 5} onClick={submitSentence}>
            <CheckCircle2 size={18} />
            Check sentence
          </button>
          {feedback && (
            <button className="secondary-button" type="button" onClick={nextStep}>
              {index + 1 >= suggestions.length ? 'Finish session' : 'Next word'}
              <ChevronRight size={17} />
            </button>
          )}
        </div>
      </div>

      <aside className="session-side">
        <FeedbackPanel feedback={feedback} />
        <div className="section-block">
          <h2>Why this word?</h2>
          <p className="muted">
            You used "{current.originalPhrase}" in your diagnostic. This lesson practices "{current.selectedWord}" as a
            sharper alternative.
          </p>
          <p className="muted">{current.practicePrompt}</p>
        </div>
      </aside>
    </section>
  );
}

function adjustDna(value: number, correct: boolean) {
  return Math.max(20, Math.min(100, value + (correct ? 8 : -4)));
}

function updateStreak(current: number) {
  return Math.max(1, current || 1);
}
