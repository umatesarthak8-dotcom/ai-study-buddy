# AI Study Buddy 🎓⚡
*Study smarter. Understand deeper.*

A premium, futuristic AI-powered academic workspace designed for engineering students. Transform dense coursework notes, textbook excerpts, and complex equations into high-yield conceptual summaries, 10 university-grade exam questions, interactive 5-question multiple-choice quizzes, and 3D flip flashcards.

---

## 🎨 Visual Identity & Palette

Designed with a modern AI SaaS aesthetic inspired by platforms like Linear, Notion, and contemporary productivity tools:
- **Deep Midnight Navy**: `#0B1020` (Root Background)
- **Dark Surface**: `#121A2D` (Card & Panel Surface)
- **Electric Violet**: `#8B5CF6` (Glows & Primary Action Accents)
- **Bright Blue**: `#3B82F6` (Secondary Action & Link Highlights)
- **Soft Lavender**: `#C4B5FD` (Subtitles & Badges)
- **White**: `#F8FAFC` (High-Contrast Clean Typography)

---

## 🚀 Key Modules & Capabilities

### 1. ⚡ Futuristic Command Dashboard
- **AI Hero Banner**: Ambient mesh gradients, glowing orb accents, and a prominent **"Start Studying"** call-to-action.
- **Student Productivity Metrics**:
  - Live **Study Streak** tracker (🔥 5-day streak).
  - **Total Notes & Words Processed** counters.
  - **Quizzes Completed** & average **Concept Mastery %** tracker.
- **Quick Engineering Presets**: 1-click presets for *Computer Science (Deadlocks & Concurrency)*, *Electrical (Signals & Fourier Transforms)*, and *Mechanical (Thermodynamics & Heat Engines)*.

### 2. 📝 Study Workspace & File Ingestion
- Large dark-mode notes editor with line numbers, monospace font, word count, character count, and read time estimation.
- **Drag-and-Drop File Upload**: Drop `.txt` or `.md` files directly onto the editor.
- **Clipboard Paste & Clear** controls.
- **One-Click Study Pack Generation**: Parallel multi-module synthesis via Gemini API.

### 3. 💡 AI Summary & Key Concepts
- Executive conceptual synthesis crafted by Gemini (`gemini-3.8-flash` with resilient `gemini-3.1-flash-lite` fallback).
- **Core Concepts Ranked by Exam Importance**: Critical (neon rose), High (neon amber), and Medium (cyan) badges with key takeaways.
- **Governing Formulas & Laws**: Monospace code blocks with application rules.
- **Exam Traps & Pitfalls**: Critical watch-outs and common examiner tricks.
- **Web Speech Audio Reader** & One-Click Markdown Copy.

### 4. ❓ 10 Important Exam Questions
- Strictly 10 university-level engineering questions with concise model short answers.
- Key scoring points examiners look for to award full marks.
- **Active Recall Scratchpad**: Test typing answers before revealing the solution.
- Filter by difficulty (*Fundamental*, *Intermediate*, *Advanced*) and track mastery status (*"Mastered"* vs *"Needs Review"*).

### 5. 🎯 Interactive MCQ Generator & Assessment
- 5 multiple-choice questions with 4 distinct options (A, B, C, D) and realistic technical distractors.
- Real-time score calculation and percentage grade.
- **Confetti Celebration**: Fires upon achieving high scores (≥ 80%).
- In-depth technical rationale explaining why the correct choice is valid and clarifying misconceptions.
- Retake Quiz and Fresh MCQs generation options.

### 6. 🗂️ 3D Flip Flashcards
- Realistic 3D card flip animation using CSS perspective transforms.
- Keyboard navigation: <kbd>Space</kbd> to flip, <kbd>→</kbd> next card, <kbd>←</kbd> previous.
- **Focus Mode** (large center card) and **Grid Mode** (entire deck at a glance).
- Active spaced repetition self-rating (*"Still Learning"* vs *"Mastered"*) with animated mastery progress bar.

### 7. 📚 Study History & Multi-Session Archive
- Automatically preserves previous study sets in `localStorage`.
- Switch between different lecture notes and subjects with 1 click without re-generating.
- Export or delete individual archived kits.

### 8. ⚙️ Scholar Settings & AI Status
- Customize student name, primary engineering discipline, and academic standing.
- Monitor active Gemini model status (`gemini-3.8-flash` with zero-downtime fallback to `gemini-3.1-flash-lite`).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti.
- **Backend**: Express on Node.js, Vite Dev Middleware (Full-Stack).
- **AI SDK**: `@google/genai` TypeScript SDK with resilient multi-model fallback.
