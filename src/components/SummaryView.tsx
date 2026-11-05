import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Copy,
  Check,
  Volume2,
  VolumeX,
  AlertTriangle,
  Lightbulb,
  FileCode2,
  RefreshCw,
  Loader2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { StudySummary } from '../types';

interface SummaryViewProps {
  summary: StudySummary | null;
  isLoading: boolean;
  onGenerateSummary: () => void;
  onNavigateToNotes: () => void;
  hasNotes: boolean;
  errorMessage?: string | null;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  summary,
  isLoading,
  onGenerateSummary,
  onNavigateToNotes,
  hasNotes,
  errorMessage,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    if (!summary) return;
    const textToCopy = `# ${summary.title}

## Summary Overview
${summary.overview}

## Core Concepts
${summary.keyConcepts.map((k) => `### ${k.title} (${k.importance})\n${k.explanation}\nKey Takeaway: ${k.takeaway || ''}`).join('\n\n')}

## Key Formulas & Engineering Rules
${summary.formulasAndRules.map((f) => `- **${f.name}**: \`${f.formula}\`\n  Application: ${f.application}`).join('\n\n')}

## High-Yield Exam Pitfalls
${summary.examPitfalls.map((p) => `- ${p}`).join('\n')}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window) || !summary) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `${summary.title}. Summary: ${summary.overview}`
      );
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // 1. Loading State Animation
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-6 text-center bg-[#121A2D] rounded-3xl border border-violet-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shadow-inner">
            <Sparkles className="w-8 h-8 animate-spin-slow text-violet-400" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-violet-500"></span>
          </span>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          Synthesizing Engineering Principles...
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
          Gemini is analyzing your notes, extracting governing equations, and distilling high-yield exam takeaways.
        </p>

        {/* Dynamic Progress Indicator */}
        <div className="mt-8 max-w-sm mx-auto bg-[#0B1020] p-4 rounded-2xl border border-slate-800 text-left space-y-3">
          <div className="flex items-center gap-2.5 text-xs text-violet-300 font-semibold">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
            <span>Parsing engineering concepts & equations</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-slate-700 ml-0.5" />
            <span>Formulating executive conceptual summary</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-slate-700 ml-0.5" />
            <span>Structuring formula cards & common traps</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (errorMessage && !summary) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6 text-center bg-[#121A2D] rounded-3xl border border-rose-500/30 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white">
          Unable to Generate Summary
        </h3>
        <p className="text-xs text-rose-300 max-w-md mx-auto mt-2 bg-rose-950/40 p-3 rounded-xl border border-rose-800/60 font-mono">
          {errorMessage}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={onGenerateSummary}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={onNavigateToNotes}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1020] hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Check Notes Input
          </button>
        </div>
      </div>
    );
  }

  // 3. Empty State (no summary yet)
  if (!summary) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center bg-[#121A2D] rounded-3xl border border-slate-800/80 shadow-md p-8">
        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Sparkles className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white">
          No AI Summary Generated Yet
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
          {hasNotes
            ? 'Your notes are loaded! Click below to synthesize key takeaways, clear explanations, formulas, and exam tips.'
            : 'Paste your engineering lecture notes first to generate an instant conceptual summary.'}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {hasNotes ? (
            <button
              onClick={onGenerateSummary}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all"
            >
              <Zap className="w-4 h-4" />
              Generate AI Summary Now
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

  // 4. Generated Summary Display
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Title & Quick Actions Header */}
      <div className="bg-[#121A2D] rounded-3xl p-6 md:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-bold uppercase tracking-wider mb-2 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Conceptual Synthesis
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {summary.title}
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          {'speechSynthesis' in window && (
            <button
              onClick={handleToggleSpeech}
              title={isSpeaking ? 'Stop Audio' : 'Listen to summary'}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isSpeaking
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-[#0B1020] border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" /> Stop Audio
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" /> Read Aloud
                </>
              )}
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy entire summary as markdown"
            className="p-2.5 bg-[#0B1020] border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-mono">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={onGenerateSummary}
            title="Regenerate summary with AI"
            className="p-2.5 bg-violet-600/20 border border-violet-500/40 text-violet-300 hover:bg-violet-600/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Section 1: Overview Explanation */}
      <div className="bg-[#121A2D] rounded-3xl p-6 md:p-8 border border-slate-800/80 shadow-md">
        <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest flex items-center gap-2 mb-4 font-mono">
          <BookOpen className="w-4 h-4" /> Conceptual Breakdown
        </h3>
        <div className="text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-line font-normal">
          {summary.overview}
        </div>
      </div>

      {/* Section 2: Important Concepts Highlighted */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 font-mono">
            <Lightbulb className="w-4 h-4 text-amber-400" /> Core Concepts Highlighted ({summary.keyConcepts.length})
          </h3>
          <span className="text-xs text-slate-500 font-mono">Ranked by exam importance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.keyConcepts.map((concept, index) => {
            const isCritical = concept.importance?.toLowerCase().includes('crit');
            const isHigh = concept.importance?.toLowerCase().includes('high');

            return (
              <div
                key={index}
                className="bg-[#121A2D] rounded-2xl p-6 border border-slate-800/80 hover:border-violet-500/40 transition-colors flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <h4 className="font-bold text-white text-base">
                      {concept.title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 font-mono ${
                        isCritical
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : isHigh
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {concept.importance}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {concept.explanation}
                  </p>
                </div>

                {concept.takeaway && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-violet-300 bg-[#0B1020]/80 p-3 rounded-xl border border-slate-800 font-sans">
                    <span className="font-bold text-violet-400 shrink-0 font-mono text-[11px]">
                      Takeaway:
                    </span>
                    <span className="leading-snug">{concept.takeaway}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Key Formulas & Laws */}
      {summary.formulasAndRules && summary.formulasAndRules.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1 font-mono">
            <FileCode2 className="w-4 h-4 text-violet-400" />
            Governing Formulas & Laws
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summary.formulasAndRules.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#121A2D] rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between shadow-md hover:border-violet-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                    EQ #{idx + 1}
                  </span>
                </div>

                <div className="bg-[#0B1020] text-violet-300 font-mono text-xs p-3.5 rounded-xl overflow-x-auto my-2 border border-slate-800 shadow-inner">
                  {item.formula}
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  <span className="font-semibold text-slate-300">When to apply: </span>
                  {item.application}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Common Pitfalls & Exam Traps */}
      {summary.examPitfalls && summary.examPitfalls.length > 0 && (
        <div className="bg-[#121A2D] rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-lg">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-4 font-mono uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Common Exam Traps & Misconceptions
          </h3>
          <ul className="space-y-3">
            {summary.examPitfalls.map((pitfall, i) => (
              <li
                key={i}
                className="text-xs sm:text-sm text-slate-300 flex items-start gap-3 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
