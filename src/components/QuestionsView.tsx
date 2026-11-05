import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  BookmarkCheck,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Loader2,
  BookOpen,
  Filter,
  PenTool,
  Zap,
} from 'lucide-react';
import { ExamQuestion } from '../types';

interface QuestionsViewProps {
  questions: ExamQuestion[];
  isLoading: boolean;
  onGenerateQuestions: () => void;
  onNavigateToNotes: () => void;
  hasNotes: boolean;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  questions,
  isLoading,
  onGenerateQuestions,
  onNavigateToNotes,
  hasNotes,
}) => {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [testModeIds, setTestModeIds] = useState<Record<number, string>>({});
  const [userStatuses, setUserStatuses] = useState<Record<number, 'mastered' | 'review' | undefined>>({});

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExpandAll = () => {
    if (expandedIds.length === questions.length) {
      setExpandedIds([]);
    } else {
      setExpandedIds(questions.map((q) => q.id));
    }
  };

  const toggleStatus = (id: number, status: 'mastered' | 'review') => {
    setUserStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === status ? undefined : status,
    }));
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterDifficulty === 'all') return true;
    return q.difficulty.toLowerCase().includes(filterDifficulty.toLowerCase());
  });

  const masteredCount = Object.values(userStatuses).filter((s) => s === 'mastered').length;

  if (questions.length === 0 && !isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center bg-[#121A2D] rounded-3xl border border-slate-800 shadow-md p-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white">
          No Exam Questions Generated Yet
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
          {hasNotes
            ? 'Generate 10 university-standard exam questions with concise short answers directly from your notes.'
            : 'Paste your engineering lecture notes first to generate 10 high-yield questions.'}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {hasNotes ? (
            <button
              onClick={onGenerateQuestions}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all"
            >
              <Zap className="w-4 h-4" />
              Generate 10 Questions Now
            </button>
          ) : (
            <button
              onClick={onNavigateToNotes}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1020] hover:bg-slate-800 text-white text-xs font-semibold border border-slate-700 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Go to Notes Workspace
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center bg-[#121A2D] rounded-3xl border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
        <div className="inline-flex p-4 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 mb-4 animate-bounce">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">
          Formulating 10 Exam Questions...
        </h3>
        <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
          Crafting realistic university-level engineering questions with concise model answers and scoring keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Header & Actions */}
      <div className="bg-[#121A2D] rounded-3xl p-6 md:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-mono">
              High-Yield Practice
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {questions.length} questions formulated
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            10 Essential Engineering Questions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Master these core questions and verify your answers before exam day.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mastery Counter */}
          <div className="px-3.5 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Mastered: {masteredCount} / {questions.length}</span>
          </div>

          <button
            onClick={handleExpandAll}
            className="p-2.5 bg-[#0B1020] border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {expandedIds.length === questions.length ? (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Collapse All
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Reveal All
              </>
            )}
          </button>

          <button
            onClick={onGenerateQuestions}
            title="Generate fresh questions"
            className="p-2.5 bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Regenerate</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1 font-mono">
          <Filter className="w-3 h-3 text-violet-400" /> Filter:
        </span>
        {['all', 'fundamental', 'intermediate', 'advanced'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilterDifficulty(lvl)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors font-mono ${
              filterDifficulty === lvl
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : 'bg-[#121A2D] border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedIds.includes(q.id);
          const status = userStatuses[q.id];
          const isFundamental = q.difficulty.toLowerCase().includes('fund');
          const isAdvanced = q.difficulty.toLowerCase().includes('adv');

          return (
            <div
              key={q.id || idx}
              className={`bg-[#121A2D] rounded-2xl border transition-all duration-200 overflow-hidden shadow-md ${
                status === 'mastered'
                  ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : status === 'review'
                  ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Question Header Bar */}
              <div
                onClick={() => toggleExpand(q.id)}
                className="p-6 cursor-pointer flex items-start justify-between gap-4 select-none hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20 font-mono">
                    Q{idx + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                          isAdvanced
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : isFundamental
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      {q.topic && (
                        <span className="text-[10px] font-medium text-slate-400 bg-[#0B1020] px-2 py-0.5 rounded border border-slate-800">
                          {q.topic}
                        </span>
                      )}
                      {status === 'mastered' && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20 font-mono">
                          <CheckCircle2 className="w-3 h-3" /> Mastered
                        </span>
                      )}
                      {status === 'review' && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-500/20 font-mono">
                          <BookmarkCheck className="w-3 h-3" /> Needs Review
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-white text-base leading-snug">
                      {q.question}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-blue-400 hidden sm:inline">
                    {isExpanded ? 'Hide Answer' : 'Show Answer'}
                  </span>
                  <div className="p-1 rounded-md text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Model Answer & Active Study Area */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 bg-[#0B1020]/50 space-y-4">
                  {/* Test Yourself Scratchpad */}
                  <div className="bg-[#121A2D] p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                      <span className="flex items-center gap-1.5 text-violet-400">
                        <PenTool className="w-3.5 h-3.5" />
                        Active Recall Attempt First
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Self-practice before reveal
                      </span>
                    </div>
                    <textarea
                      value={testModeIds[q.id] || ''}
                      onChange={(e) =>
                        setTestModeIds((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }))
                      }
                      placeholder="Type your concise thoughts or key equations here, then compare with the model answer below..."
                      rows={2}
                      className="w-full text-xs text-white placeholder-slate-500 bg-[#0B1020] p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-violet-500 font-sans"
                    />
                  </div>

                  {/* Model Short Answer */}
                  <div className="bg-gradient-to-r from-blue-950/30 to-indigo-950/20 p-5 rounded-2xl border border-blue-500/30">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 mb-2 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Concise Model Answer
                    </span>
                    <p className="text-sm text-slate-200 leading-relaxed font-normal">
                      {q.answer}
                    </p>

                    {q.keyPoints && q.keyPoints.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-blue-500/20">
                        <span className="text-[11px] font-bold text-slate-400 block mb-2 font-mono">
                          Key points to mention for full marks:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {q.keyPoints.map((point, pIdx) => (
                            <span
                              key={pIdx}
                              className="text-xs bg-[#0B1020] border border-blue-500/30 text-blue-200 px-2.5 py-1 rounded-lg font-medium"
                            >
                              ✓ {point}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Self Assessment Buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">
                      How comfortable are you with this question?
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(q.id, 'review')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                          status === 'review'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-[#121A2D] border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        Needs Review
                      </button>
                      <button
                        onClick={() => toggleStatus(q.id, 'mastered')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                          status === 'mastered'
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : 'bg-[#121A2D] border-slate-700 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        ✓ Mark as Mastered
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
