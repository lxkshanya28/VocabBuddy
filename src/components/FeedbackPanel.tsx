import { CircleDashed, ThumbsUp } from 'lucide-react';
import { LessonAttempt } from '../types/vocabulary';

type Props = {
  feedback: LessonAttempt | null;
};

export function FeedbackPanel({ feedback }: Props) {
  return (
    <div className="section-block feedback-panel">
      <h2>Feedback</h2>
      {!feedback && (
        <div className="empty-feedback">
          <CircleDashed size={22} />
          <p>Submit a sentence to get concise coaching.</p>
        </div>
      )}
      {feedback && (
        <div className={feedback.correct ? 'feedback success' : 'feedback review'}>
          <ThumbsUp size={22} />
          <strong>{feedback.correct ? 'Mastered' : 'Needs review'}</strong>
          <p>{feedback.feedback}</p>
        </div>
      )}
    </div>
  );
}
