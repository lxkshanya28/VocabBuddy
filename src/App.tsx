import { useEffect, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Session } from './components/Session';
import { SpeechDiagnostic } from './components/SpeechDiagnostic';
import { SpeechUpgrade } from './components/SpeechUpgrade';
import { LearnerProfile } from './types/vocabulary';
import { createInitialProfile, loadProfile, resetProfile, saveProfile } from './services/storage';

type View = 'diagnostic' | 'dashboard' | 'session' | 'upgrade';

export default function App() {
  const [profile, setProfile] = useState<LearnerProfile>(() => loadProfile());
  const [view, setView] = useState<View>(() => (loadProfile().onboarded ? 'dashboard' : 'diagnostic'));

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const accuracy = useMemo(() => {
    if (profile.attempts === 0) return 0;
    return Math.round((profile.correctAttempts / profile.attempts) * 100);
  }, [profile]);

  function updateProfile(next: LearnerProfile) {
    setProfile(next);
    saveProfile(next);
  }

  function handleReset() {
    resetProfile();
    const fresh = createInitialProfile();
    setProfile(fresh);
    setView('diagnostic');
  }

  return (
    <main className="app">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setView(profile.onboarded ? 'dashboard' : 'diagnostic')}>
          <span className="brand-mark">VB</span>
          <span>
            <strong>VocabBuddy</strong>
            <small>Voice vocabulary coach</small>
          </span>
        </button>
        <button className="ghost-button" type="button" onClick={handleReset}>
          <RotateCcw size={17} />
          Reset demo
        </button>
      </header>

      {view === 'diagnostic' && (
        <SpeechDiagnostic
          profile={profile}
          onComplete={(nextProfile) => {
            updateProfile(nextProfile);
            setView('dashboard');
          }}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard
          profile={profile}
          accuracy={accuracy}
          onStart={() => setView('session')}
          onUpgrade={() => setView('upgrade')}
        />
      )}

      {view === 'session' && profile.analysis && (
        <Session
          profile={profile}
          onProfileChange={updateProfile}
          onComplete={(nextProfile) => {
            updateProfile(nextProfile);
            setView('upgrade');
          }}
        />
      )}

      {view === 'upgrade' && (
        <SpeechUpgrade
          profile={profile}
          onPracticeMore={() => setView('session')}
          onDashboard={() => setView('dashboard')}
        />
      )}
    </main>
  );
}
