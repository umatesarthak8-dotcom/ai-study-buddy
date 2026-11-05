import React, { useRef, useState } from 'react';
import {
  Sparkles,
  Trash2,
  Upload,
  ArrowRight,
  HelpCircle,
  CheckSquare,
  Layers,
  FileText,
  Loader2,
  CheckCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { SAMPLE_NOTES, SampleNotePreset } from '../data/sampleNotes';
import { StudyKit } from '../types';

interface NotesInputViewProps {
  notes: string;
  onChangeNotes: (val: string) => void;
  onClearNotes: () => void;
  onLoadPreset: (preset: SampleNotePreset) => void;
  onGenerateAll: () => void;
  onGenerateSummary: () => void;
  onGenerateQuestions: () => void;
  onGenerateMCQs: () => void;
  onGenerateFlashcards: () => void;
  isGeneratingAll: boolean;
  loadingSummary: boolean;
  loadingQuestions: boolean;
  loadingMCQs: boolean;
  loadingFlashcards: boolean;
  activeKit: StudyKit;
}

export const NotesInputView: React.FC<NotesInputViewProps> = ({
  notes,
  onChangeNotes,
  onClearNotes,
  onLoadPreset,
  onGenerateAll,
  onGenerateSummary,
  onGenerateQuestions,
  onGenerateMCQs,
  onGenerateFlashcards,
  isGeneratingAll,
  loadingSummary,
  loadingQuestions,
  loadingMCQs,
  loadingFlashcards,
  activeKit,
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

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Quick Preset Selector */}
      <div className="bg-[#121A2D] rounded-2xl p-6 border border-slate-800/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              Engineering Syllabus Presets
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any engineering domain to load realistic course notes and test AI study tools instantly.
            </p>
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#0B1020] hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-violet-400" />
              Upload .txt / .md
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_NOTES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onLoadPreset(sample)}
              className="group text-left p-4 rounded-xl bg-[#0B1020]/90 border border-slate-800 hover:border-violet-500/50 hover:bg-violet-950/20 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20 font-mono">
                  {sample.discipline}
                </span>
                <h4 className="text-xs font-semibold text-white mt-2 group-hover:text-violet-300 transition-colors line-clamp-1">
                  {sample.title}
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 group-hover:text-violet-400 font-medium mt-3 flex items-center gap-1">
                Load Notes <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Notes Editor Card */}
      <div className="bg-[#121A2D] rounded-3xl border border-slate-800/80 shadow-xl overflow-hidden flex flex-col">
        {/* Editor Toolbar */}
        <div className="px-6 py-4 bg-[#0B1020]/80 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-400" />
              Raw Coursework & Notes Input
            </span>
            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="bg-[#121A2D] px-2 py-0.5 rounded border border-slate-800">
                {wordCount} words
              </span>
              <span className="bg-[#121A2D] px-2 py-0.5 rounded border border-slate-800">
                {charCount} chars
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-violet-400" /> ~{estimatedReadMinutes}m read
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notes.length > 0 && (
              <button
                onClick={onClearNotes}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Textarea with Drag & Drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`p-6 relative transition-all ${
            isDragging ? 'bg-violet-950/20 border-2 border-dashed border-violet-500' : ''
          }`}
        >
          {isDragging && (
            <div className="absolute inset-0 bg-[#0B1020]/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center pointer-events-none">
              <Upload className="w-12 h-12 text-violet-400 animate-bounce mb-2" />
              <p className="text-white font-bold text-sm">Drop file to paste notes</p>
            </div>
          )}

          <textarea
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            placeholder="Paste your engineering notes, lecture transcripts, formulas, or textbook excerpts here...

Example topics:
• Computer Science: Concurrency, Deadlocks, Scheduling, Memory Virtualization
• Electrical: Signals & Systems, Fourier Transform, Continuous Convolution, Bode Plots
• Mechanical: Laws of Thermodynamics, Carnot Heat Engines, Fluid Dynamics, Stress & Strain
• Civil: Truss Analysis, Beam Deflection, Soil Mechanics"
            rows={14}
            className="w-full text-sm text-slate-200 placeholder-slate-500 bg-transparent resize-y focus:outline-none font-mono leading-relaxed"
          />
        </div>

        {/* Master Action Banner */}
        <div className="p-6 bg-[#0B1020]/70 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">
              Ready to generate full study kit?
            </h4>
            <p className="text-xs text-slate-400">
              Gemini will extract summaries, 10 high-yield exam questions, 5 MCQs, and 3D flashcards.
            </p>
          </div>

          <button
            onClick={onGenerateAll}
            disabled={!notes.trim() || isGeneratingAll}
            className={`w-full md:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.35)] ${
              !notes.trim() || isGeneratingAll
                ? 'bg-slate-800 text-slate-500 border border-slate-700 shadow-none cursor-not-allowed'
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
                <Sparkles className="w-4 h-4 text-violet-200" />
                <span>Generate Study Pack (All 4 Modules)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Feature Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Summary */}
        <div className="bg-[#121A2D] p-5 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between hover:border-violet-500/40 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">AI Summary</h4>
            <p className="text-xs text-slate-400 mt-1">
              Conceptual overview, highlighted core laws, and formula notation.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            {activeKit.summary ? (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Generated
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Not generated</span>
            )}
            <button
              onClick={onGenerateSummary}
              disabled={!notes.trim() || loadingSummary}
              className="text-xs font-bold text-violet-400 hover:text-violet-300 disabled:text-slate-600 flex items-center gap-1"
            >
              {loadingSummary ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Generate'}
            </button>
          </div>
        </div>

        {/* Card 2: 10 Questions */}
        <div className="bg-[#121A2D] p-5 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between hover:border-blue-500/40 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">10 Questions</h4>
            <p className="text-xs text-slate-400 mt-1">
              Ten university-grade questions with concise model short answers.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            {activeKit.questions.length > 0 ? (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {activeKit.questions.length} Ready
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Not generated</span>
            )}
            <button
              onClick={onGenerateQuestions}
              disabled={!notes.trim() || loadingQuestions}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 disabled:text-slate-600 flex items-center gap-1"
            >
              {loadingQuestions ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Generate'}
            </button>
          </div>
        </div>

        {/* Card 3: MCQ Quiz */}
        <div className="bg-[#121A2D] p-5 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">5 MCQ Quiz</h4>
            <p className="text-xs text-slate-400 mt-1">
              5 multiple choice questions with scoring and technical explanations.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            {activeKit.mcqs.length > 0 ? (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {activeKit.mcqs.length} MCQs
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Not generated</span>
            )}
            <button
              onClick={onGenerateMCQs}
              disabled={!notes.trim() || loadingMCQs}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 disabled:text-slate-600 flex items-center gap-1"
            >
              {loadingMCQs ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Generate'}
            </button>
          </div>
        </div>

        {/* Card 4: Flashcards */}
        <div className="bg-[#121A2D] p-5 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between hover:border-purple-500/40 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Flip Flashcards</h4>
            <p className="text-xs text-slate-400 mt-1">
              Interactive 3D cards to test recall on terms, formulas, and concepts.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            {activeKit.flashcards.length > 0 ? (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {activeKit.flashcards.length} Cards
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Not generated</span>
            )}
            <button
              onClick={onGenerateFlashcards}
              disabled={!notes.trim() || loadingFlashcards}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 disabled:text-slate-600 flex items-center gap-1"
            >
              {loadingFlashcards ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Generate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
