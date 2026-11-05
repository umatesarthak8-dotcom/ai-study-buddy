import React from 'react';
import {
  History,
  FileText,
  Trash2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  HelpCircle,
  CheckSquare,
} from 'lucide-react';
import { StudyKit, ViewMode } from '../types';

interface StudyHistoryViewProps {
  history: StudyKit[];
  activeKitId: string;
  onSelectKit: (kit: StudyKit) => void;
  onDeleteKit: (id: string) => void;
  onNavigateToNotes: () => void;
  onNavigate: (view: ViewMode) => void;
}

export const StudyHistoryView: React.FC<StudyHistoryViewProps> = ({
  history,
  activeKitId,
  onSelectKit,
  onDeleteKit,
  onNavigateToNotes,
  onNavigate,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="bg-[#121A2D] rounded-3xl p-6 md:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20 font-mono">
              Academic Archive
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {history.length} Saved Kits
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Study History & Saved Materials
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access past lecture sessions, reload previous kits, or review past summaries without regenerating.
          </p>
        </div>

        <button
          onClick={onNavigateToNotes}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Study Session</span>
        </button>
      </div>

      {history.length === 0 ? (
        <div className="max-w-2xl mx-auto py-16 text-center bg-[#121A2D] rounded-3xl border border-slate-800 p-8 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto mb-4 border border-violet-500/20">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white">No Saved Study Kits Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
            Whenever you generate study materials from coursework notes, they are automatically preserved here.
          </p>
          <button
            onClick={onNavigateToNotes}
            className="mt-6 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all inline-flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Create First Study Pack</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((kit) => {
            const isActive = kit.id === activeKitId;
            const wordCount = kit.notes.trim() ? kit.notes.trim().split(/\s+/).length : 0;
            const formattedDate = new Date(kit.createdAt || Date.now()).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={kit.id}
                className={`bg-[#121A2D] rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between shadow-md ${
                  isActive
                    ? 'border-violet-500/60 shadow-[0_0_20px_rgba(139,92,246,0.2)] ring-1 ring-violet-500/30'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-violet-400" />
                      {formattedDate}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Active Kit
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug line-clamp-1">
                    {kit.title || 'Untitled Engineering Topic'}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-sans">
                    {kit.summary?.overview || kit.notes.slice(0, 150)}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-300">
                    <span className="bg-[#0B1020] px-2 py-1 rounded border border-slate-800 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-blue-400" />
                      {wordCount} words
                    </span>
                    <span className="bg-[#0B1020] px-2 py-1 rounded border border-slate-800 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-indigo-400" />
                      {kit.questions.length} Qs
                    </span>
                    <span className="bg-[#0B1020] px-2 py-1 rounded border border-slate-800 flex items-center gap-1">
                      <CheckSquare className="w-3 h-3 text-emerald-400" />
                      {kit.mcqs.length} MCQs
                    </span>
                    <span className="bg-[#0B1020] px-2 py-1 rounded border border-slate-800 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-purple-400" />
                      {kit.flashcards.length} Cards
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onDeleteKit(kit.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete study kit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectKit(kit);
                      onNavigate('summary');
                    }}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 transition-colors flex items-center gap-1.5"
                  >
                    <span>Load Study Kit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
