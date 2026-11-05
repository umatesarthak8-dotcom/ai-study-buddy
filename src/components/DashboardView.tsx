import React, { useRef, useState } from 'react';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Upload,
  Trash2,
  FileText,
  HelpCircle,
  CheckSquare,
  Layers,
  Flame,
  CheckCircle2,
  Trophy,
  Loader2,
  BookOpen,
  Cpu,
  Brain,
  Clock,
  Compass,
} from 'lucide-react';
import { SAMPLE_NOTES, SampleNotePreset } from '../data/sampleNotes';
import { StudyKit, UserStats, ViewMode } from '../types';

interface DashboardViewProps {
  notes: string;
  onChangeNotes: (val: string) => void;
  onClearNotes: () => void;
  onLoadPreset: (preset: SampleNotePreset) => void;
  onGenerateAll: () => void;
  onGenerateSummary: () => void;
  onGenerateQuestions: () => void;
  onGenerateMCQs: () => void;
  onGenerateFlashcards: () => void;
  onNavigate: (view: ViewMode) => void;
  isGeneratingAll: boolean;
  loadingSummary: boolean;
  loadingQuestions: boolean;
  loadingMCQs: boolean;
  loadingFlashcards: boolean;
  activeKit: StudyKit;
  userStats: UserStats;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  notes,
  onChangeNotes,
  onClearNotes,
  onLoadPreset,
  onGenerateAll,
  onGenerateSummary,
  onGenerateQuestions,
  onGenerateMCQs,
  onGenerateFlashcards,
  onNavigate,
  isGeneratingAll,
  loadingSummary,
  loadingQuestions,
  loadingMCQs,
  loadingFlashcards,
  activeKit,
  userStats,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;
  const estimatedReadMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = '';
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) onChangeNotes(text);
    };
    reader.readAsText(file);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onChangeNotes(text);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden border border-violet-500/30 bg-[#121A2D] p-8 md:p-12 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
        {/* Background futuristic glow & circuit patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-600/20 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-blue-600/20 via-violet-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-400/30 text-violet-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span>Futuristic Academic Workspace</span>
            <span className="w-1 h-1 rounded-full bg-violet-400" />
            <span className="text-slate-400">Gemini 3.8 Flash Powered</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] font-sans">
            Your personal AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-blue-400">
              learning companion.
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
            Study smarter. Understand deeper. Transform dense engineering coursework, complex formulas, and lecture notes into conceptual explanations, 10 high-yield questions, interactive quizzes, and active recall flashcards in seconds.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onGenerateAll}
              disabled={!notes.trim() || isGeneratingAll}
              className={`px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 flex items-center gap-2 shadow-[0_0_25px_rgba(139,92,246,0.4)] ${
                !notes.trim() || isGeneratingAll
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 shadow-none'
                  : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 active:scale-95 border border-violet-400/40'
              }`}
            >
              {isGeneratingAll ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Full Kit...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-violet-200 fill-violet-200" />
                  <span>Start Studying Now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            <button
              onClick={() => onNavigate('notes')}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-white bg-[#0B1020]/80 hover:bg-[#0B1020] border border-slate-700/80 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-violet-400" />
              <span>Open Notes Editor</span>
            </button>
          </div>

          {/* Quick Presets Pills */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <Compass className="w-3.5 h-3.5 text-violet-400" />
              Quick Presets:
            </span>
            {SAMPLE_NOTES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onLoadPreset(sample)}
                className="px-3 py-1.5 rounded-lg bg-[#0B1020]/90 hover:bg-violet-950/40 border border-slate-700 hover:border-violet-500/50 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5 group"
              >
                <span className="text-[10px] text-violet-400 font-bold font-mono">
                  {sample.discipline.split(' ')[0]}
                </span>
                <span className="truncate max-w-[150px]">{sample.title.split(':')[1] || sample.title}</span>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-violet-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. STUDENT PRODUCTIVITY METRICS BAR */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#121A2D] p-5 rounded-2xl border border-slate-800/80 hover:border-violet-500/30 transition-colors flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-amber-400 fill-amber-400/20" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-mono">
              {userStats.streakDays} Days
            </div>
            <div className="text-xs text-slate-400 font-medium">Study Streak</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#121A2D] p-5 rounded-2xl border border-slate-800/80 hover:border-violet-500/30 transition-colors flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-mono">
              {wordCount > 0 ? wordCount : userStats.totalWordsProcessed}
            </div>
            <div className="text-xs text-slate-400 font-medium">Words Loaded</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#121A2D] p-5 rounded-2xl border border-slate-800/80 hover:border-violet-500/30 transition-colors flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-mono">
              {userStats.quizzesCompleted}
            </div>
            <div className="text-xs text-slate-400 font-medium">Quizzes Completed</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#121A2D] p-5 rounded-2xl border border-slate-800/80 hover:border-violet-500/30 transition-colors flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-mono">
              {userStats.averageScorePct}%
            </div>
            <div className="text-xs text-slate-400 font-medium">Concept Mastery</div>
          </div>
        </div>
      </section>

      {/* 3. STUDY WORKSPACE (NOTES INPUT AREA) */}
      <section className="bg-[#121A2D] rounded-3xl border border-slate-800/80 shadow-xl overflow-hidden">
        {/* Workspace Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-[#0B1020]/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Study Workspace & Notes Input
              </h3>
              <p className="text-xs text-slate-400">
                Paste lecture notes or drag and drop syllabus documents below
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.md,.text"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-[#0B1020] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-violet-400" />
              <span>Upload Document</span>
            </button>
            <button
              onClick={handlePasteClipboard}
              className="px-3 py-1.5 rounded-lg bg-[#0B1020] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <span>Paste from Clipboard</span>
            </button>
            {notes.length > 0 && (
              <button
                onClick={onClearNotes}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Drag and Drop & Input Container */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`p-6 transition-all relative ${
            isDragging ? 'bg-violet-950/20 border-2 border-dashed border-violet-500' : ''
          }`}
        >
          {isDragging && (
            <div className="absolute inset-0 bg-[#0B1020]/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center pointer-events-none">
              <Upload className="w-12 h-12 text-violet-400 animate-bounce mb-2" />
              <p className="text-white font-bold text-sm">Drop your notes or markdown file here</p>
            </div>
          )}

          <textarea
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            placeholder="Paste engineering lecture notes, formulas, textbook excerpts, or problem statements here...

Examples:
• Operating Systems: Coffman conditions, concurrency, Banker's algorithm safe sequence
• Signals & Systems: Fourier transforms, continuous-time LTI convolution, BIBO stability
• Thermodynamics: Carnot cycle, laws of thermodynamics, entropy calculations

Tip: The more technical detail included in your notes, the higher quality the 10 questions and flashcards will be!"
            rows={10}
            className="w-full text-sm text-slate-200 placeholder-slate-500 bg-transparent resize-y focus:outline-none font-mono leading-relaxed"
          />
        </div>

        {/* Workspace Footer Actions */}
        <div className="px-6 py-4 bg-[#0B1020]/60 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{charCount} characters</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-violet-400" /> ~{estimatedReadMinutes} min read
            </span>
          </div>

          <button
            onClick={onGenerateAll}
            disabled={!notes.trim() || isGeneratingAll}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.35)] ${
              !notes.trim() || isGeneratingAll
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 shadow-none'
                : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 active:scale-95 border border-violet-400/30'
            }`}
          >
            {isGeneratingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Full Study Kit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-violet-200" />
                <span>Generate Study Pack (All 4 Modules)</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* 4. AI FEATURE CARDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              AI Study Modules
            </h3>
            <p className="text-xs text-slate-400">
              Generate targeted study materials or jump into active revision
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feature 1: AI Summary */}
          <div className="group bg-[#121A2D] rounded-2xl p-6 border border-slate-800/80 hover:border-violet-500/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.2)] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">AI Summary</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Clear conceptual explanations, highlighted core laws, equation notation, and exam watch-outs.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                {activeKit.summary ? '✓ Ready' : 'Empty'}
              </span>
              <button
                onClick={activeKit.summary ? () => onNavigate('summary') : onGenerateSummary}
                disabled={!notes.trim() || loadingSummary}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 transition-colors flex items-center gap-1.5"
              >
                {loadingSummary ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : activeKit.summary ? (
                  'View Summary'
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>

          {/* Feature 2: 10 Important Questions */}
          <div className="group bg-[#121A2D] rounded-2xl p-6 border border-slate-800/80 hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">10 Questions</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Ten university-grade questions with concise model short answers and scoring keywords.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                {activeKit.questions.length > 0 ? `${activeKit.questions.length} Qs` : 'Empty'}
              </span>
              <button
                onClick={activeKit.questions.length > 0 ? () => onNavigate('questions') : onGenerateQuestions}
                disabled={!notes.trim() || loadingQuestions}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 transition-colors flex items-center gap-1.5"
              >
                {loadingQuestions ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : activeKit.questions.length > 0 ? (
                  'Practice Qs'
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>

          {/* Feature 3: MCQ Generator */}
          <div className="group bg-[#121A2D] rounded-2xl p-6 border border-slate-800/80 hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">MCQ Generator</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                5 interactive questions with 4 options each, real-time score tracking, and in-depth rationales.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                {activeKit.mcqs.length > 0 ? `${activeKit.mcqs.length} MCQs` : 'Empty'}
              </span>
              <button
                onClick={activeKit.mcqs.length > 0 ? () => onNavigate('mcq') : onGenerateMCQs}
                disabled={!notes.trim() || loadingMCQs}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 transition-colors flex items-center gap-1.5"
              >
                {loadingMCQs ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : activeKit.mcqs.length > 0 ? (
                  'Take Quiz'
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>

          {/* Feature 4: Flashcards */}
          <div className="group bg-[#121A2D] rounded-2xl p-6 border border-slate-800/80 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Flip Flashcards</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Interactive 3D cards with active recall rating, keyboard flip controls, and memory hooks.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                {activeKit.flashcards.length > 0 ? `${activeKit.flashcards.length} Cards` : 'Empty'}
              </span>
              <button
                onClick={activeKit.flashcards.length > 0 ? () => onNavigate('flashcards') : onGenerateFlashcards}
                disabled={!notes.trim() || loadingFlashcards}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 transition-colors flex items-center gap-1.5"
              >
                {loadingFlashcards ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : activeKit.flashcards.length > 0 ? (
                  'Review Deck'
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
