import { CircleDashed, Lightbulb, ThumbsUp } from 'lucide-react';
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
        <div className={getFeedbackClass(feedback)}>
          {feedback.correct ? <ThumbsUp size={22} /> : <Lightbulb size={22} />}
          <strong>{getFeedbackLabel(feedback)}</strong>
          <p>{feedback.feedback}</p>
        </div>
      )}
    </div>
  );
}

function getFeedbackClass(feedback: LessonAttempt) {
  if (feedback.correct) return 'feedback success';
  if (feedback.outcome === 'almost') return 'feedback almost';
  return 'feedback review';
}

function getFeedbackLabel(feedback: LessonAttempt) {
  if (feedback.correct) return 'Mastered';
  if (feedback.outcome === 'almost') return 'Almost there';
  return 'Needs review';
}
