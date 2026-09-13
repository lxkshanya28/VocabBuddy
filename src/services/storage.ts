import { LearnerProfile } from '../types/vocabulary';

const key = 'vocabbuddy.profile.v1';

export const emptyDna = {
  Professional: 40,
  Academic: 40,
  Everyday: 45,
  Expressive: 35,
};

export function createInitialProfile(): LearnerProfile {
  return {
    onboarded: false,
    streak: 0,
    wordsLearned: 0,
    attempts: 0,
    correctAttempts: 0,
    dna: { ...emptyDna },
    history: [],
    masteredWords: [],
    reviewWords: [],
  };
}

export function loadProfile(): LearnerProfile {
  const raw = localStorage.getItem(key);
  if (!raw) return createInitialProfile();

  try {
    return { ...createInitialProfile(), ...JSON.parse(raw) };
  } catch {
    return createInitialProfile();
  }
}

export function saveProfile(profile: LearnerProfile) {
  localStorage.setItem(key, JSON.stringify(profile));
}

export function resetProfile() {
  localStorage.removeItem(key);
}
