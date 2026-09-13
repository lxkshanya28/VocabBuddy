# VocabBuddy

VocabBuddy is an AI-powered voice vocabulary coach prototype built for a Product Operations Associate application. It helps learners improve vocabulary through short, natural spoken practice instead of behaving like a generic chatbot or dictionary.

The app runs entirely in the browser for the first version. It uses local mock data, deterministic transcript analysis, and browser-native speech features, so no paid APIs or API keys are required.

## Product Overview

VocabBuddy helps users turn everyday speech into more precise, expressive language. A learner starts with a short natural speech sample, receives personalized vocabulary recommendations, practices using those words in new sentences, and sees a before/after comparison of how their wording improved.

The prototype prioritizes a polished end-to-end demo experience:

- Speech-first onboarding
- Text fallback for unsupported browsers
- Personalized vocabulary recommendations
- Concise sentence evaluation
- Progress, streak, accuracy, and learned-word history
- Local profile persistence with a visible **Reset demo** control

## Standout Feature: Vocabulary DNA

Vocabulary DNA is the main differentiator. Instead of only assigning predetermined word cards, VocabBuddy builds a learner profile from the user's own natural speech.

During onboarding, the user responds to a practical prompt:

> Tell me about your week, a recent project, or something you are proud of.

The local transcript analyzer then detects:

- Repeated basic words and phrases such as `good`, `bad`, `nice`, `very`, `really`, `thing`, `stuff`, `happy`, and `sad`
- Vocabulary strengths and opportunities across:
  - Professional
  - Academic
  - Everyday
  - Expressive
- Contextual upgrade suggestions based on the learner's actual wording

Example:

```text
Original: My presentation was really good and my manager was very happy.
Upgrade: really good -> compelling
Upgrade: very happy -> delighted / impressed
```

Future lesson recommendations are generated from these detected speech patterns, and the Vocabulary DNA dashboard updates as the learner practices.

## Core User Journey

1. The user completes a short speech diagnostic.
2. VocabBuddy analyzes the transcript locally.
3. The app generates Vocabulary DNA and 2-3 contextual word upgrades.
4. The learner starts a practice session.
5. VocabBuddy shows a word card with:
   - Meaning
   - Pronunciation
   - Natural example
6. The learner speaks or types a new sentence using the recommended word.
7. Deterministic evaluation checks whether the word was used in a complete sentence.
8. The user receives concise feedback.
9. Vocabulary DNA, accuracy, words learned, and history update.
10. The final Speech Upgrade screen compares the original transcript with an improved version using mastered words.

## Technology Stack

- React
- TypeScript
- Vite
- Plain CSS with responsive layouts
- Lucide React icons
- Browser Web Speech API for speech recognition
- Browser SpeechSynthesis API for spoken coaching
- `localStorage` for prototype profile persistence

No backend, authentication, database, paid API, or external LLM service is required.

## Local Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173/
```

Run a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Browser Speech Compatibility

Speech recognition uses the browser-native Web Speech API. It is best supported in Chromium-based browsers such as Chrome and Edge. Some browsers, including Firefox and Safari, may not support speech recognition or may support it differently.

If microphone access is unavailable, denied, or unsupported, VocabBuddy still provides the complete learning experience through the textarea fallback.

Speech playback uses the browser SpeechSynthesis API where available. If speech synthesis is unavailable, the app continues to work normally without spoken coaching.

## Vercel Deployment

This project is ready for Vercel as a standard Vite React app.

Recommended Vercel settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

No environment variables are required for the current prototype.
