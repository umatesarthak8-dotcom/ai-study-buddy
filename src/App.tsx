/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { NotesInputView } from './components/NotesInputView';
import { SummaryView } from './components/SummaryView';
import { QuestionsView } from './components/QuestionsView';
import { MCQView } from './components/MCQView';
import { FlashcardsView } from './components/FlashcardsView';
import { StudyHistoryView } from './components/StudyHistoryView';
import { SettingsView } from './components/SettingsView';
import { AITutorView } from './components/AITutorView';
import { ExportModal } from './components/ExportModal';
import { ViewMode, StudyKit, UserProfile, UserStats } from './types';
import { SAMPLE_NOTES, SampleNotePreset } from './data/sampleNotes';
import { AlertCircle, X, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_NOTES = 'ai_study_buddy_notes_v2';
const STORAGE_KEY_KIT = 'ai_study_buddy_active_kit_v2';
const STORAGE_KEY_HISTORY = 'ai_study_buddy_history_v2';
const STORAGE_KEY_PROFILE = 'ai_study_buddy_profile_v2';
const STORAGE_KEY_STATS = 'ai_study_buddy_stats_v2';
const STORAGE_KEY_COLLAPSED = 'ai_study_buddy_sidebar_collapsed';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_COLLAPSED) === 'true';
  });

  const [notes, setNotes] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_NOTES) || SAMPLE_NOTES[0].notes;
  });

  const [activeKit, setActiveKit] = useState<StudyKit>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_KIT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback below
      }
    }
    return {
      id: 'default-kit',
      title: SAMPLE_NOTES[0].title,
      notes: SAMPLE_NOTES[0].notes,
      createdAt: new Date().toISOString(),
      summary: null,
      questions: [],
      mcqs: [],
      flashcards: [],
    };
  });

  const [studyHistory, setStudyHistory] = useState<StudyKit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      name: 'Sarthak Umate',
      tagline: 'Engineering Scholar',
      discipline: 'Computer Science & Engineering',
      academicYear: 'Final Year Undergraduate',
    };
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STATS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      streakDays: 5,
      totalNotesProcessed: 3,
      totalWordsProcessed: 12450,
      quizzesCompleted: 4,
      averageScorePct: 88,
      cardsMastered: 18,
    };
  });

  // Loading states
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingMCQs, setLoadingMCQs] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);

  // Notification banners
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTES, notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_KIT, JSON.stringify(activeKit));
  }, [activeKit]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(studyHistory));
  }, [studyHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COLLAPSED, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const showError = (err: string) => {
    setErrorMessage(err);
    setTimeout(() => setErrorMessage(null), 7000);
  };

  const handleClearNotes = () => {
    setNotes('');
    setActiveKit((prev) => ({
      ...prev,
      title: '',
      notes: '',
      summary: null,
      questions: [],
      mcqs: [],
      flashcards: [],
    }));
    showToast('Workspace reset. Ready for new notes!');
  };

  const handleLoadPreset = (preset: SampleNotePreset) => {
    setNotes(preset.notes);
    setActiveKit((prev) => ({
      ...prev,
      title: preset.title,
      notes: preset.notes,
    }));
    showToast(`Loaded ${preset.title}`);
  };

  // Upsert kit into history
  const saveKitToHistory = (updatedKit: StudyKit) => {
    setStudyHistory((prev) => {
      const filtered = prev.filter((k) => k.id !== updatedKit.id);
      return [updatedKit, ...filtered].slice(0, 15);
    });
  };

  // 1. GENERATE FULL STUDY KIT (Summary + 10 Questions + 5 MCQs + Flashcards)
  const handleGenerateAll = async () => {
    if (!notes.trim()) {
      showError('Please paste engineering notes first.');
      return;
    }

    setIsGeneratingAll(true);
    setErrorMessage(null);
    setCurrentView('summary');

    try {
      const res = await fetch('/api/generate-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate study kit.');
      }

      const updatedKit: StudyKit = {
        id: String(Date.now()),
        title: data.summary?.title || activeKit.title || 'Engineering Study Kit',
        notes,
        createdAt: new Date().toISOString(),
        summary: data.summary || null,
        questions: data.questions || [],
        mcqs: data.mcqs || [],
        flashcards: data.flashcards || [],
      };

      setActiveKit(updatedKit);
      saveKitToHistory(updatedKit);

      setUserStats((prev) => ({
        ...prev,
        totalNotesProcessed: prev.totalNotesProcessed + 1,
        totalWordsProcessed: prev.totalWordsProcessed + notes.trim().split(/\s+/).length,
      }));

      showToast('🎉 Complete Study Kit synthesized successfully!');
    } catch (err: any) {
      console.error(err);
      showError(err.message || 'Error communicating with AI server.');
    } finally {
      setIsGeneratingAll(false);
    }
  };

  // 2. GENERATE AI SUMMARY
  const handleGenerateSummary = async () => {
    if (!notes.trim()) {
      showError('Please paste engineering notes first.');
      return;
    }

    setLoadingSummary(true);
    setErrorMessage(null);
    setCurrentView('summary');

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate summary.');
      }

      const updatedKit: StudyKit = {
        ...activeKit,
        title: data.title || activeKit.title || 'Engineering Notes Summary',
        notes,
        summary: data,
      };

      setActiveKit(updatedKit);
      saveKitToHistory(updatedKit);

      showToast('AI Summary & Key Concepts ready!');
    } catch (err: any) {
      console.error('Error generating summary:', err);
      showError(err.message || 'Failed to generate summary.');
    } finally {
      setLoadingSummary(false);
    }
  };

  // 3. GENERATE 10 IMPORTANT QUESTIONS
  const handleGenerateQuestions = async () => {
    if (!notes.trim()) {
      showError('Please paste engineering notes first.');
      return;
    }

    setLoadingQuestions(true);
    setErrorMessage(null);
    setCurrentView('questions');

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate questions.');
      }

      const updatedKit: StudyKit = {
        ...activeKit,
        notes,
        questions: data.questions || [],
      };

      setActiveKit(updatedKit);
      saveKitToHistory(updatedKit);

      showToast('10 High-Yield Exam Questions generated!');
    } catch (err: any) {
      console.error(err);
      showError(err.message || 'Failed to generate questions.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // 4. GENERATE 5 MCQS
  const handleGenerateMCQs = async () => {
    if (!notes.trim()) {
      showError('Please paste engineering notes first.');
      return;
    }

    setLoadingMCQs(true);
    setErrorMessage(null);
    setCurrentView('mcq');

    try {
      const res = await fetch('/api/mcqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate MCQs.');
      }

      const updatedKit: StudyKit = {
        ...activeKit,
        notes,
        mcqs: data.questions || [],
      };

      setActiveKit(updatedKit);
      saveKitToHistory(updatedKit);

      setUserStats((prev) => ({
        ...prev,
        quizzesCompleted: prev.quizzesCompleted + 1,
      }));

      showToast('5 Multiple-Choice Questions generated!');
    } catch (err: any) {
      console.error(err);
      showError(err.message || 'Failed to generate MCQs.');
    } finally {
      setLoadingMCQs(false);
    }
  };

  // 5. GENERATE FLASHCARDS
  const handleGenerateFlashcards = async () => {
    if (!notes.trim()) {
      showError('Please paste engineering notes first.');
      return;
    }

    setLoadingFlashcards(true);
    setErrorMessage(null);
    setCurrentView('flashcards');

    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate flashcards.');
      }

      const updatedKit: StudyKit = {
        ...activeKit,
        notes,
        flashcards: data.flashcards || [],
      };

      setActiveKit(updatedKit);
      saveKitToHistory(updatedKit);

      showToast('Flip Flashcards generated!');
    } catch (err: any) {
      console.error(err);
      showError(err.message || 'Failed to generate flashcards.');
    } finally {
      setLoadingFlashcards(false);
    }
  };

  const handleSelectKitFromHistory = (kit: StudyKit) => {
    setActiveKit(kit);
    setNotes(kit.notes);
    showToast(`Loaded "${kit.title || 'Study Kit'}"`);
  };

  const handleDeleteKitFromHistory = (id: string) => {
    setStudyHistory((prev) => prev.filter((k) => k.id !== id));
    showToast('Kit removed from history');
  };

  const notesWordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  return (
    <div className="flex h-screen bg-[#0B1020] font-sans text-[#F8FAFC] overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        activeKit={activeKit}
        notesWordCount={notesWordCount}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        userStats={userStats}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-radial-gradient">
        {/* Header */}
        <Header
          currentView={currentView}
          notesTitle={activeKit.title}
          isGeneratingAll={isGeneratingAll}
          onGenerateAll={handleGenerateAll}
          onClearNotes={handleClearNotes}
          onOpenExport={() => setIsExportOpen(true)}
          hasNotes={Boolean(notes.trim())}
          onSelectView={setCurrentView}
          userProfile={userProfile}
          userStats={userStats}
          activeKit={activeKit}
        />

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="bg-rose-950/60 border-b border-rose-500/30 px-6 py-3 flex items-center justify-between text-xs text-rose-300 animate-fadeIn backdrop-blur-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Global Toast Banner */}
        {toastMessage && (
          <div className="bg-emerald-950/60 border-b border-emerald-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-300 animate-fadeIn backdrop-blur-md">
            <div className="flex items-center gap-2 font-medium font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {currentView === 'dashboard' && (
            <DashboardView
              notes={notes}
              onChangeNotes={setNotes}
              onClearNotes={handleClearNotes}
              onLoadPreset={handleLoadPreset}
              onGenerateAll={handleGenerateAll}
              onGenerateSummary={handleGenerateSummary}
              onGenerateQuestions={handleGenerateQuestions}
              onGenerateMCQs={handleGenerateMCQs}
              onGenerateFlashcards={handleGenerateFlashcards}
              onNavigate={setCurrentView}
              isGeneratingAll={isGeneratingAll}
              loadingSummary={loadingSummary}
              loadingQuestions={loadingQuestions}
              loadingMCQs={loadingMCQs}
              loadingFlashcards={loadingFlashcards}
              activeKit={activeKit}
              userStats={userStats}
            />
          )}

          {currentView === 'notes' && (
            <NotesInputView
              notes={notes}
              onChangeNotes={setNotes}
              onClearNotes={handleClearNotes}
              onLoadPreset={handleLoadPreset}
              onGenerateAll={handleGenerateAll}
              onGenerateSummary={handleGenerateSummary}
              onGenerateQuestions={handleGenerateQuestions}
              onGenerateMCQs={handleGenerateMCQs}
              onGenerateFlashcards={handleGenerateFlashcards}
              isGeneratingAll={isGeneratingAll}
              loadingSummary={loadingSummary}
              loadingQuestions={loadingQuestions}
              loadingMCQs={loadingMCQs}
              loadingFlashcards={loadingFlashcards}
              activeKit={activeKit}
            />
          )}

          {currentView === 'summary' && (
            <SummaryView
              summary={activeKit.summary}
              isLoading={loadingSummary || isGeneratingAll}
              onGenerateSummary={handleGenerateSummary}
              onNavigateToNotes={() => setCurrentView('notes')}
              hasNotes={Boolean(notes.trim())}
              errorMessage={errorMessage}
            />
          )}

          {currentView === 'questions' && (
            <QuestionsView
              questions={activeKit.questions}
              isLoading={loadingQuestions || isGeneratingAll}
              onGenerateQuestions={handleGenerateQuestions}
              onNavigateToNotes={() => setCurrentView('notes')}
              hasNotes={Boolean(notes.trim())}
            />
          )}

          {currentView === 'mcq' && (
            <MCQView
              mcqs={activeKit.mcqs}
              isLoading={loadingMCQs || isGeneratingAll}
              onGenerateMCQs={handleGenerateMCQs}
              onNavigateToNotes={() => setCurrentView('notes')}
              hasNotes={Boolean(notes.trim())}
            />
          )}

          {currentView === 'flashcards' && (
            <FlashcardsView
              flashcards={activeKit.flashcards}
              isLoading={loadingFlashcards || isGeneratingAll}
              onGenerateFlashcards={handleGenerateFlashcards}
              onNavigateToNotes={() => setCurrentView('notes')}
              hasNotes={Boolean(notes.trim())}
            />
          )}

          {currentView === 'history' && (
            <StudyHistoryView
              history={studyHistory}
              activeKitId={activeKit.id}
              onSelectKit={handleSelectKitFromHistory}
              onDeleteKit={handleDeleteKitFromHistory}
              onNavigateToNotes={() => setCurrentView('notes')}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              userProfile={userProfile}
              onUpdateProfile={setUserProfile}
              userStats={userStats}
              onResetStats={() =>
                setUserStats({
                  streakDays: 1,
                  totalNotesProcessed: 0,
                  totalWordsProcessed: 0,
                  quizzesCompleted: 0,
                  averageScorePct: 0,
                  cardsMastered: 0,
                })
              }
            />
          )}

          {currentView === 'tutor' && (
            <AITutorView
              notes={notes}
              hasNotes={Boolean(notes.trim())}
              onNavigateToNotes={() => setCurrentView('notes')}
            />
          )}
        </main>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        kit={activeKit}
      />
    </div>
  );
}
