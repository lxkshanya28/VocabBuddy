import { Brain, Mic, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { analyzeTranscript } from '../services/transcriptAnalyzer';
import { LearnerProfile } from '../types/vocabulary';
import { VoiceInput } from './VoiceInput';
import { VocabularyDNA } from './VocabularyDNA';

type Props = {
  profile: LearnerProfile;
  onComplete: (profile: LearnerProfile) => void;
};

export function SpeechDiagnostic({ profile, onComplete }: Props) {
  const [transcript, setTranscript] = useState('');
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const analysis = useMemo(() => analyzeTranscript(transcript), [transcript]);
  const canAnalyze = transcript.trim().split(/\s+/).length >= 8;

  function finishDiagnostic() {
    const nextProfile: LearnerProfile = {
      ...profile,
      onboarded: true,
      analysis,
      dna: analysis.categoryScores,
    };
    onComplete(nextProfile);
  }

  return (
    <section className="screen two-column">
      <div className="hero-panel">
        <div className="eyebrow">
          <Sparkles size={16} />
          First speech diagnostic
        </div>
        <h1>Build your Vocabulary DNA from how you already speak.</h1>
        <p className="lede">
          Speak naturally for 20-30 seconds. VocabBuddy will identify opportunities to make your vocabulary more precise
          and expressive.
        </p>
        <div className="prompt-box">
          <Brain size={20} />
          <span>Tell me about your week, a recent project, or something you are proud of.</span>
        </div>
        <VoiceInput
          label="Your speech sample"
          placeholder="Use the microphone or type your answer here..."
          value={transcript}
          onChange={setTranscript}
          minRows={8}
        />
        <div className="action-row">
          <button className="primary-button" type="button" disabled={!canAnalyze} onClick={() => setAnalysisVisible(true)}>
            <Mic size={18} />
            Analyze my speech
          </button>
          <span className="helper-text">{canAnalyze ? 'Ready to analyze.' : 'Add a few more words to unlock analysis.'}</span>
        </div>
      </div>

      <aside className="insight-panel">
        <h2>Transcript Analysis</h2>
        {!analysisVisible && <p className="muted">Your diagnostic summary will appear here after the first sample.</p>}
        {analysisVisible && (
          <>
            <VocabularyDNA dna={analysis.categoryScores} compact />
            <div className="analysis-list">
              <h3>Detected basic words</h3>
              <p>{analysis.repeatedBasics.length ? analysis.repeatedBasics.join(', ') : 'No common basic words detected yet.'}</p>
            </div>
            <div className="analysis-list">
              <h3>Recommended upgrades</h3>
              {analysis.suggestions.map((suggestion) => (
                <div className="upgrade-row" key={suggestion.id}>
                  <span>{suggestion.originalPhrase}</span>
                  <strong>{suggestion.recommendedWords.join(' / ')}</strong>
                </div>
              ))}
            </div>
            <button className="primary-button full" type="button" onClick={finishDiagnostic}>
              Start my first lesson
            </button>
          </>
        )}
      </aside>
    </section>
  );
}
