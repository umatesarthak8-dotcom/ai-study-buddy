import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  HelpCircle,
  CheckSquare,
  Layers,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Flame,
  Bot,
} from 'lucide-react';
import { ViewMode, StudyKit, UserStats } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  activeKit: StudyKit;
  notesWordCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userStats: UserStats;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  activeKit,
  notesWordCount,
  isCollapsed,
  onToggleCollapse,
  userStats,
}) => {
  const hasSummary = Boolean(activeKit.summary);
  const questionsCount = activeKit.questions.length;
  const mcqsCount = activeKit.mcqs.length;
  const flashcardsCount = activeKit.flashcards.length;

  const navItems = [
    {
      id: 'dashboard' as ViewMode,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Main',
    },
    {
      id: 'notes' as ViewMode,
      label: 'My Notes',
      icon: FileText,
      badge: notesWordCount > 0 ? `${notesWordCount}w` : undefined,
    },
    {
      id: 'summary' as ViewMode,
      label: 'AI Summary',
      icon: Sparkles,
      badge: hasSummary ? 'Ready' : undefined,
      badgeColor: 'text-violet-400 border border-violet-500/30 bg-violet-500/10',
    },
    {
      id: 'questions' as ViewMode,
      label: 'Important Questions',
      icon: HelpCircle,
      badge: questionsCount > 0 ? `${questionsCount} Qs` : undefined,
      badgeColor: 'text-blue-400 border border-blue-500/30 bg-blue-500/10',
    },
    {
      id: 'mcq' as ViewMode,
      label: 'MCQ Generator',
      icon: CheckSquare,
      badge: mcqsCount > 0 ? `${mcqsCount} MCQs` : undefined,
      badgeColor: 'text-emerald-400 border border-emerald-500/30 bg-emerald-500/10',
    },
    {
      id: 'flashcards' as ViewMode,
      label: 'Flashcards',
      icon: Layers,
      badge: flashcardsCount > 0 ? `${flashcardsCount} Cards` : undefined,
      badgeColor: 'text-purple-400 border border-purple-500/30 bg-purple-500/10',
    },
    {
      id: 'history' as ViewMode,
      label: 'Study History',
      icon: History,
    },
    {
      id: 'settings' as ViewMode,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`bg-[#0B1020] border-r border-slate-800/80 flex flex-col h-screen shrink-0 transition-all duration-300 relative select-none z-30 ${
        isCollapsed ? 'w-20' : 'w-68'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 px-5 flex items-center justify-between border-b border-slate-800/60">
        <div
          onClick={() => onSelectView('dashboard')}
          className="flex items-center gap-3.5 cursor-pointer group min-w-0"
        >
          {/* Futuristic Glowing Emblem */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-500 p-0.5 shadow-[0_0_20px_rgba(139,92,246,0.35)] shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0B1020] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-400 fill-violet-400/20" />
            </div>
          </div>

          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight font-sans">
                  AI Study Buddy
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400 truncate tracking-wide uppercase font-medium">
                Study smarter. Understand deeper.
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition-colors shrink-0"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Workspace
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative ${
                isActive
                  ? 'bg-violet-600/15 text-white font-semibold shadow-[0_0_20px_rgba(139,92,246,0.15)] border border-violet-500/30'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-violet-500 to-blue-500 rounded-r-full shadow-[0_0_10px_#8B5CF6]" />
              )}

              <div
                className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  isActive
                    ? 'text-violet-400 bg-violet-500/20'
                    : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <span className="text-xs truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        item.badgeColor || 'text-slate-400 bg-slate-800/80'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Student Productivity Mini Widget */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800/60 bg-[#0B1020]">
          <div className="bg-[#121A2D] rounded-xl p-3 border border-slate-800/80 shadow-inner">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5 text-[11px]">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                {userStats.streakDays}-Day Study Streak
              </span>
              <span className="text-[10px] font-mono text-violet-400 font-bold">
                {userStats.averageScorePct}% Avg
              </span>
            </div>

            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#8B5CF6]"
                style={{
                  width: `${Math.min(100, Math.max(15, (userStats.streakDays / 7) * 100))}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{userStats.totalNotesProcessed} topics</span>
              <span>{userStats.quizzesCompleted} quizzes done</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
