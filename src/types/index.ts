export type ViewMode =
  | 'dashboard'
  | 'notes'
  | 'summary'
  | 'questions'
  | 'mcq'
  | 'flashcards'
  | 'history'
  | 'settings'
  | 'tutor';

export interface KeyConcept {
  title: string;
  explanation: string;
  importance: 'Critical' | 'High' | 'Medium' | string;
  takeaway?: string;
}

export interface FormulaOrRule {
  name: string;
  formula: string;
  application: string;
}

export interface StudySummary {
  title: string;
  overview: string;
  keyConcepts: KeyConcept[];
  formulasAndRules: FormulaOrRule[];
  examPitfalls: string[];
}

export interface ExamQuestion {
  id: number;
  question: string;
  answer: string;
  keyPoints: string[];
  difficulty: 'Fundamental' | 'Intermediate' | 'Advanced' | string;
  topic: string;
  userStatus?: 'unmarked' | 'mastered' | 'review';
  userNotes?: string;
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic?: string;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
  hint?: string;
  mastered?: boolean;
}

export interface StudyKit {
  id: string;
  title: string;
  notes: string;
  createdAt: string;
  summary: StudySummary | null;
  questions: ExamQuestion[];
  mcqs: MCQQuestion[];
  flashcards: Flashcard[];
}

export interface UserStats {
  streakDays: number;
  totalNotesProcessed: number;
  totalWordsProcessed: number;
  quizzesCompleted: number;
  averageScorePct: number;
  cardsMastered: number;
}

export interface UserProfile {
  name: string;
  tagline: string;
  discipline: string;
  academicYear: string;
}
