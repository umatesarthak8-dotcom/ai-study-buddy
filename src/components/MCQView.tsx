import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  Sparkles,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  Zap,
} from 'lucide-react';
import { MCQQuestion } from '../types';

interface MCQViewProps {
  mcqs: MCQQuestion[];
  isLoading: boolean;
  onGenerateMCQs: () => void;
  onNavigateToNotes: () => void;
  hasNotes: boolean;
}

export const MCQView: React.FC<MCQViewProps> = ({
  mcqs,
  isLoading,
  onGenerateMCQs,
  onNavigateToNotes,
  hasNotes,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    mcqs.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    const pct = (score / mcqs.length) * 100;
    if (pct >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === mcqs.length;
  const score = isSubmitted ? calculateScore() : 0;
  const scorePercentage = mcqs.length > 0 ? Math.round((score / mcqs.length) * 100) : 0;

  if (mcqs.length === 0 && !isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center bg-[#121A2D] rounded-3xl border border-slate-800 shadow-md p-8">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckSquare className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white">
          No MCQ Quiz Generated Yet
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
          {hasNotes
            ? 'Generate 5 multiple-choice questions with 4 options each, instant score calculation, and explanations.'
            : 'Paste your engineering lecture notes first to generate a customized 5-question MCQ quiz.'}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {hasNotes ? (
            <button
              onClick={onGenerateMCQs}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all"
            >
              <Zap className="w-4 h-4" />
              Generate 5 MCQs Now
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
      <div className="max-w-3xl mx-auto py-20 text-center bg-[#121A2D] rounded-3xl border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
        <div className="inline-flex p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-4 animate-bounce">
          <CheckSquare className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">
          Crafting 5 Multiple-Choice Questions...
        </h3>
        <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
          Formulating realistic engineering distractors and detailed technical rationales based on your notes.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner & Stats */}
      <div className="bg-[#121A2D] rounded-3xl p-6 md:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
              Assessment Mode
            </span>
            <span className="text-xs text-slate-400 font-mono">
              5 Questions · 4 Options Each
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Engineering MCQ Quiz
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Test your understanding under exam-like conditions. Select the best answer for each question.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-1 hidden sm:block font-mono">
            <div className="text-xs font-bold text-white">
              {answeredCount} / {mcqs.length} Answered
            </div>
            <div className="text-[11px] text-slate-400">
              {isSubmitted ? 'Evaluation Complete' : 'In Progress'}
            </div>
          </div>

          <button
            onClick={() => {
              handleRetake();
              onGenerateMCQs();
            }}
            title="Generate a brand new set of 5 MCQs"
            className="p-2.5 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fresh MCQs</span>
          </button>
        </div>
      </div>

      {/* Score Result Card (when submitted) */}
      {isSubmitted && (
        <div className="bg-[#121A2D] rounded-3xl p-6 md:p-8 border border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.15)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-2xl font-mono shadow-md ${
                scorePercentage >= 80
                  ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : scorePercentage >= 60
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                  : 'bg-amber-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]'
              }`}
            >
              {scorePercentage}%
            </div>

            <div>
              <h3 className="font-extrabold text-white text-lg">
                {scorePercentage >= 80
                  ? 'Outstanding Mastery! 🎉'
                  : scorePercentage >= 60
                  ? 'Solid Effort! Good Understanding 💡'
                  : 'Needs Revision 📚'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                You scored <strong className="text-white font-mono">{score}</strong> out of{' '}
                <strong className="text-white font-mono">{mcqs.length}</strong> questions correctly. Review the technical rationales below.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleRetake}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-[#0B1020] border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Quiz
            </button>
            <button
              onClick={() => {
                handleRetake();
                onGenerateMCQs();
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New 5 Questions
            </button>
          </div>
        </div>
      )}

      {/* MCQs List */}
      <div className="space-y-5">
        {mcqs.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          const isCorrect = isSubmitted && selectedOption === q.correctIndex;
          const isIncorrect = isSubmitted && selectedOption !== undefined && selectedOption !== q.correctIndex;
          const optionLetters = ['A', 'B', 'C', 'D'];

          return (
            <div
              key={q.id || qIndex}
              className={`bg-[#121A2D] rounded-3xl border p-6 md:p-8 transition-all duration-200 shadow-md ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-start gap-3.5">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20 font-mono">
                    {qIndex + 1}
                  </span>
                  <div>
                    {q.topic && (
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 font-mono">
                        {q.topic}
                      </span>
                    )}
                    <h3 className="font-bold text-white text-base leading-snug">
                      {q.question}
                    </h3>
                  </div>
                </div>

                {isSubmitted && (
                  <div className="shrink-0 font-mono">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options (A, B, C, D) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((optionText, optIndex) => {
                  const isSelected = selectedOption === optIndex;
                  const isThisCorrect = optIndex === q.correctIndex;

                  let optStyles = 'bg-[#0B1020]/90 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700';

                  if (isSubmitted) {
                    if (isThisCorrect) {
                      optStyles = 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 font-semibold ring-1 ring-emerald-500/40';
                    } else if (isSelected && !isThisCorrect) {
                      optStyles = 'bg-rose-950/40 border-rose-500/60 text-rose-300 line-through';
                    } else {
                      optStyles = 'bg-[#0B1020]/40 border-slate-850 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optStyles = 'bg-violet-600/20 border-violet-500 text-white font-semibold ring-2 ring-violet-500/30';
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, optIndex)}
                      className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 select-none ${optStyles}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 font-mono ${
                          isSubmitted && isThisCorrect
                            ? 'bg-emerald-500 text-slate-950'
                            : isSubmitted && isSelected && !isThisCorrect
                            ? 'bg-rose-500 text-white'
                            : isSelected
                            ? 'bg-violet-500 text-white shadow-[0_0_10px_#8B5CF6]'
                            : 'bg-[#121A2D] text-slate-400 border border-slate-700'
                        }`}
                      >
                        {optionLetters[optIndex]}
                      </span>
                      <span className="text-xs leading-relaxed flex-1 mt-0.5">
                        {optionText}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Technical Explanation (revealed upon submission) */}
              {isSubmitted && (
                <div className="mt-5 pt-4 border-t border-slate-800 bg-[#0B1020]/80 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-5 rounded-b-3xl">
                  <div className="flex items-start gap-2.5 text-xs">
                    <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-violet-300 font-mono">
                        Technical Rationale:{' '}
                      </span>
                      <span className="text-slate-300 leading-relaxed">
                        {q.explanation}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Toolbar */}
      {!isSubmitted && (
        <div className="bg-[#121A2D] rounded-3xl p-5 border border-slate-800/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <AlertCircle className="w-4 h-4 text-violet-400 shrink-0" />
            <span>
              {isAllAnswered
                ? 'All 5 questions answered! Ready to submit quiz.'
                : `Answer all questions (${answeredCount}/${mcqs.length} complete).`}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={answeredCount === 0}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] ${
              answeredCount === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 shadow-none'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Submit Answers & View Score
          </button>
        </div>
      )}
    </div>
  );
};
