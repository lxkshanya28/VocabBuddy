import { LessonAttempt } from '../types/vocabulary';

type Props = {
  history: LessonAttempt[];
};

export function RecentWords({ history }: Props) {
  const recent = history.slice(-5).reverse();

  return (
    <div className="section-block">
      <h2>Recent learned words</h2>
      {recent.length === 0 && <p className="muted">Complete a session to see your word history.</p>}
      <div className="history-list">
        {recent.map((item) => (
          <div className="history-item" key={`${item.timestamp}-${item.word}`}>
            <strong>{item.word}</strong>
            <span>{item.correct ? 'Mastered' : 'Needs review'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
