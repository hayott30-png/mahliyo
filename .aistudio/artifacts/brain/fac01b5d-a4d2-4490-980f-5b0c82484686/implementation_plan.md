# TÜRKAI + MAHLİYO AI — Turkish Language Learning Platform for Uzbek Speakers

A modern, full-stack Turkish language learning web application tailored for Uzbek speakers, spanning CEFR levels A1 through C2. The platform combines structured curriculum modules (lessons, grammar, vocabulary, reading, listening) with an interactive **Speaking Laboratory** and a dedicated, secret-code gated AI conversation tutor named **Mahliyo AI**.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been confirmed through Phase 1 clarifications:
> - **Voice & Speech Technology**: Web Speech API for real-time browser speech recognition and synthesis, paired with server-side Gemini AI for grammatical, lexical, and fluency assessment.
> - **Curriculum Structure**: Rich, interactive A1 starter curriculum (6 complete units with grammar in Uzbek, Turkish vocabulary, examples, and automated quizzes) plus comprehensive CEFR roadmap structures for A1–C2.
> - **Session & Storage Architecture**: Express full-stack server with HttpOnly session cookies, server-side code verification (`MAHLIYO_ACCESS_CODE`), client-side local sync, and complete Supabase PostgreSQL schema migrations.

---

## 1. Overview & Core Concept

- **What It Does**: TÜRKAI provides Uzbek learners with a structured pathway to learn Turkish, capitalizing on the close linguistic affinity between Uzbek and Turkish. The interface, grammar guides, and feedback explanations are in Uzbek, while lesson exercises, conversational practice, and audio materials are in Turkish.
- **Mahliyo AI Tutor**: A warm, encouraging, and playful female Turkish conversational partner accessed exclusively via a secret-code portal (`/mahliyo`). She speaks Turkish, adjusts complexity to CEFR levels (A1 to C2), offers warm encouragement ("Aferin sana!", "Canım öğrencim!"), playfully corrects mistakes, clarifies tough points in Uzbek, and remembers recent errors for targeted practice.
- **Speaking Laboratory (`/speaking`)**: A dedicated acoustic practice environment where learners record themselves speaking Turkish, receive real-time transcripts, hear native model audio, and get server-side Gemini AI evaluation on grammar accuracy, vocabulary richness, and fluency.
- **Target Audience**: Uzbek native speakers seeking fluency in Turkish for study, work, relocation, or personal enrichment.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Public Explorer & Dashboard**:
   - Visitors land on a sleek hero page introducing TÜRKAI and Mahliyo AI.
   - Learner dashboard displays CEFR level progress (A1–C2 roadmap), streak counters, daily goals, quick-resume lesson cards, and module shortcuts.
2. **Interactive A1 Curriculum & Exercises**:
   - Learners select from 6 core A1 units: *1. Salomlashish va Tanishuv*, *2. Turk Alifbosi va Talaffuz*, *3. Kishilik Olmoshlari*, *4. Sodda Gap Qurilishi*, *5. Sonlar va Vaqt*, *6. Kundalik Savol-Javoblar*.
   - Each lesson offers Uzbek grammar breakdowns, dual-language vocabulary with audio pronunciation, example dialogues, and an interactive scored quiz.
3. **Dedicated Mahliyo AI Entry (`/mahliyo`)**:
   - Secret-code modal / entry screen with password masking and rate-limit guard.
   - Default demo code `mahliyo` unlocks server-authenticated session.
   - Full tutor chat interface with avatar, scenario picker (e.g. *Restoranda*, *Bozorda*, *Universitetda*, *Sayohatda*), voice recording, auto-speak toggle, and structured feedback drawer.
4. **Speaking Laboratory (`/speaking`)**:
   - Practice cards with target sentences and prompts tailored by CEFR level.
   - Record via mic with live waveform visualizer, stop/re-listen, and submit for instant AI assessment.
5. **Writing Assessment (`/writing`)**:
   - Composition prompts by CEFR level with instant rubric-based evaluation on structure, vocabulary, and grammar.
6. **Progress Analytics & Settings**:
   - Detailed breakdown of mastered vocabulary, speaking attempts, error tendencies, and audio speed preferences.

### Visual Identity & Theme
- **Dominant Neutral Canvas (60%)**: Deep Cosmic Navy (`#080F1E` / `#0F172A`).
- **Structural Surfaces (30%)**: Polished glass & dark slate cards (`#111C30` / `#1E293B`) with subtle hairline dividers (`border-slate-800`).
- **Semantic Accents (10%)**:
  - Emerald Green (`#10B981`): Success, progress, accuracy.
  - Mahliyo Rose/Pink (`#F472B6`): Mahliyo AI persona accents and encouragement.
  - Turkish Violet/Indigo (`#8B5CF6`): CEFR milestones and high-level mastery.
  - Text: Clean high-contrast crisp slate (`#F8FAFC`) with muted metadata (`#94A3B8`).
- **Typography**: Neo-Grotesque display headings (`Plus Jakarta Sans`) paired with clean body prose (`DM Sans`), tabular numerals (`tabular-nums`) for timers and scoreboards.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale & Alternatives Considered |
| :--- | :--- | :--- |
| **Full-Stack Architecture** | Express + Vite in single full-stack runtime (`server.ts`) | Enables real server-side session cookies, rate-limiting, and server-only Gemini API access (`@google/genai`) without exposing keys or secrets to the client. |
| **Speech Engine** | Browser Web Speech API + Gemini AI Assessment | Zero external third-party speech API billing required for the user; instant speech-to-text and voice synthesis with Gemini providing deep linguistic evaluation. |
| **Mahliyo Secret Access** | Server-side verified code with HttpOnly cookie | Fulfills requirement for no registration form while preventing client-side code scraping and providing secure session expiration. |
| **Database Strategy** | Hybrid local persistence + Supabase SQL migration files | Immediate zero-friction execution in preview with persistent state, plus enterprise-ready SQL schema (`001_initial_schema.sql`) for one-click Supabase deployment. |

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TÜRKAI CLIENT (React 19)                       │
├───────────────┬─────────────────┬─────────────────┬────────────────────┤
│   Dashboard   │  A1-C2 Lessons  │  Speaking Lab   │  Mahliyo AI Chat   │
│   & Analytics │   & Exercises   │   (/speaking)   │    (/mahliyo)      │
└───────┬───────┴────────┬────────┴────────┬────────┴─────────┬──────────┘
        │                │                 │                  │
        │ HTTP & Fetch   │                 │                  │
        ▼                ▼                 ▼                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      EXPRESS BACKEND (server.ts)                       │
├────────────────────────────────────────────────────────────────────────┤
│  • Session & Secret Auth Middleware (/api/mahliyo/access, /logout)     │
│  • Rate Limiting & Input Validation                                    │
│  • Mahliyo Tutor Service (/api/mahliyo/chat)                           │
│  • Speaking Assessment Service (/api/speaking/assess)                  │
│  • Writing Assessment Service (/api/writing/assess)                    │
│  • Supabase Migration & Seed Management                                │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                              │
├────────────────────────────────┬───────────────────────────────────────┤
│    Google GenAI SDK (3.8)      │         Supabase / PostgreSQL         │
│  - Structured JSON Output      │  - Migration 001_initial_schema.sql   │
│  - Strict Error Categorization │  - RLS Policies & Learner Profiles    │
└────────────────────────────────┴───────────────────────────────────────┘
```

### Server API Endpoints
- `POST /api/mahliyo/access`: Verifies secret code against `MAHLIYO_ACCESS_CODE` (default `mahliyo`), applies rate-limiting, and issues HttpOnly session cookie.
- `GET /api/mahliyo/session`: Validates current session status.
- `POST /api/mahliyo/logout`: Clears session cookie.
- `POST /api/mahliyo/chat`: Validates session, parses conversation history and CEFR level, prompts Gemini 3.8 Flash, and returns structured JSON:
  ```json
  {
    "replyTr": "Harika bir başlangıç! Seni dinliyorum...",
    "replyUz": "Ajoyib boshlanish! Sizni eshityapman...",
    "corrections": [],
    "encouragement": "Aferin sana, canım öğrencim! 🥰",
    "nextQuestion": "Sen nerelisin?",
    "learnerLevel": "A1",
    "detectedErrors": []
  }
  ```
- `POST /api/speaking/assess`: Evaluates user's spoken Turkish transcript against target prompt, rating accuracy, vocabulary, fluency, and suggesting corrected phrases.
- `POST /api/writing/assess`: Evaluates written Turkish essays against CEFR rubrics.

### Supabase Database Migration Plan (`supabase/migrations/001_initial_schema.sql`)
1. `profiles`: User progress, CEFR level, streak count, preferences.
2. `lessons`: CEFR level, unit number, title (Uzbek/Turkish), grammar explanation, vocabulary list.
3. `exercises`: Lesson reference, question type (fill-in-the-blank, multiple choice, matching, translation), options, correct answer.
4. `lesson_progress`: Profile ID, lesson ID, score, completed flag, updated timestamp.
5. `speaking_attempts`: Profile ID, prompt text, user transcript, score, feedback breakdown.
6. `writing_attempts`: Profile ID, prompt, submitted text, rubric score, grammar notes.
7. `tutor_conversations`: Profile ID, scenario, CEFR level, created timestamp.
8. `tutor_messages`: Conversation ID, sender (`user` / `mahliyo`), Turkish text, Uzbek translation, corrections JSON.
9. `learner_error_patterns`: Aggregated recurring grammatical mistakes for targeted review.

---

## 5. Implementation Phases

- **Phase 1: Project Setup & Design System**: Configure Express server proxy in Vite, establish color tokens, global styles, and responsive navigation shell.
- **Phase 2: Mahliyo Secret Access & Session Security**: Implement `/mahliyo` route, server access endpoints, HttpOnly cookie handling, rate limiting, and session verification.
- **Phase 3: Mahliyo AI Conversation Tutor**: Build the chat UI, avatar animations, CEFR scenario selectors, Web Speech integration, and Gemini 3.8 structured response engine.
- **Phase 4: Speaking Laboratory (`/speaking`)**: Build microphone recording, audio playback, speech-to-text, and Gemini speaking assessment.
- **Phase 5: A1 Curriculum & Practice Modules**: Author 6 comprehensive A1 lesson units with Uzbek grammar explanations, vocabulary lists, and interactive quizzes.
- **Phase 6: Writing Assessment, Analytics, Supabase Migrations & Verification**: Add writing assessment, analytics dashboards, Supabase SQL migrations, `.env.example`, and run end-to-end compilation checks.
