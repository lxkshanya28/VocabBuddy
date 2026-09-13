import { ArrowRight, Flame, GraduationCap, Play, Target } from 'lucide-react';
import { LearnerProfile } from '../types/vocabulary';
import { MetricCard } from './MetricCard';
import { RecentWords } from './RecentWords';
import { VocabularyDNA } from './VocabularyDNA';

type Props = {
  profile: LearnerProfile;
  accuracy: number;
  onStart: () => void;
  onUpgrade: () => void;
};

export function Dashboard({ profile, accuracy, onStart, onUpgrade }: Props) {
  const nextWords = profile.analysis?.suggestions ?? [];

  return (
    <section className="screen dashboard">
      <div className="dashboard-main">
        <div className="hero-panel compact-hero">
          <div className="eyebrow">
            <Target size={16} />
            Personalized from your speech
          </div>
          <h1>Your next lesson is built from your own wording.</h1>
          <p className="lede">Practice sharper alternatives to expressions VocabBuddy detected in your diagnostic sample.</p>
          <div className="action-row">
            <button className="primary-button" type="button" onClick={onStart}>
              <Play size={18} />
              Start session
            </button>
            <button className="secondary-button" type="button" disabled={profile.history.length === 0} onClick={onUpgrade}>
              {profile.history.length > 0 ? 'Speech Upgrade' : 'Speech Upgrade locked'}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        <div className="metrics-grid">
          <MetricCard icon={<Flame size={20} />} label="Streak" value={`${profile.streak} day${profile.streak === 1 ? '' : 's'}`} />
          <MetricCard icon={<GraduationCap size={20} />} label="Words learned" value={profile.wordsLearned.toString()} />
          <MetricCard icon={<Target size={20} />} label="Accuracy" value={`${accuracy}%`} />
        </div>

        <div className="section-block">
          <h2>Recommended from your transcript</h2>
          <div className="word-grid">
            {nextWords.map((item) => (
              <article className="word-chip" key={item.id}>
                <span>{item.originalPhrase}</span>
                <strong>{item.selectedWord}</strong>
                <small>{item.category}</small>
              </article>
            ))}
          </div>
        </div>
      </div>

      <aside className="dashboard-side">
        <div className="section-block">
          <h2>Vocabulary DNA</h2>
          <p className="muted dna-note">Prototype estimates derived from transcript signals and practice results.</p>
          <VocabularyDNA dna={profile.dna} />
        </div>
        <RecentWords history={profile.history} />
      </aside>
    </section>
  );
}
