import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Download,
  Trash2,
  CheckCircle2,
  Flame,
  User,
  ExternalLink,
  X,
  FileText,
  Loader2,
  Settings as SettingsIcon,
} from 'lucide-react';
import { ViewMode, StudyKit, UserProfile, UserStats } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  notesTitle?: string;
  isGeneratingAll: boolean;
  onGenerateAll: () => void;
  onClearNotes: () => void;
  onOpenExport: () => void;
  hasNotes: boolean;
  onSelectView: (view: ViewMode) => void;
  userProfile: UserProfile;
  userStats: UserStats;
  activeKit: StudyKit;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  notesTitle,
  isGeneratingAll,
  onGenerateAll,
  onClearNotes,
  onOpenExport,
  hasNotes,
  onSelectView,
  userProfile,
  userStats,
  activeKit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search matches across notes, summary concepts, questions, and flashcards
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: Array<{ type: string; title: string; targetView: ViewMode }> = [];

    // Check notes
    if (activeKit.notes && activeKit.notes.toLowerCase().includes(q)) {
      results.push({
        type: 'Notes Excerpt',
        title: `Mentions "${searchQuery}" in coursework notes`,
        targetView: 'notes',
      });
    }

    // Check summary concepts
    activeKit.summary?.keyConcepts?.forEach((c) => {
      if (c.title.toLowerCase().includes(q) || c.explanation.toLowerCase().includes(q)) {
        results.push({
          type: 'Core Concept',
          title: c.title,
          targetView: 'summary',
        });
      }
    });

    // Check questions
    activeKit.questions?.forEach((item) => {
      if (item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)) {
        results.push({
          type: 'Exam Question',
          title: item.question,
          targetView: 'questions',
        });
      }
    });

    // Check flashcards
    activeKit.flashcards?.forEach((fc) => {
      if (fc.front.toLowerCase().includes(q) || fc.back.toLowerCase().includes(q)) {
        results.push({
          type: 'Flashcard',
          title: fc.front,
          targetView: 'flashcards',
        });
      }
    });

    return results.slice(0, 5);
  }, [searchQuery, activeKit]);

  const notifications = [
    {
      id: 1,
      title: '5-Day Study Streak Active! 🔥',
      desc: 'Keep studying daily to maintain your active recall momentum.',
      time: 'Today',
      unread: true,
    },
    {
      id: 2,
      title: activeKit.summary ? 'AI Study Kit is Ready' : 'Ready for New Coursework',
      desc: activeKit.summary
        ? `${activeKit.questions.length} questions and ${activeKit.flashcards.length} flashcards generated.`
        : 'Paste your engineering lecture notes to generate fresh materials.',
      time: '1h ago',
      unread: false,
    },
  ];

  return (
    <header className="h-20 bg-[#0B1020]/90 backdrop-blur-md border-b border-slate-800/80 px-6 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Left: Personalized Greeting & Active Note Context */}
      <div className="flex items-center gap-4 min-w-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight font-sans">
              Hey, welcome back!
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
              {userStats.streakDays}d Streak
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate">
            {notesTitle ? (
              <span className="text-violet-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Active Kit: {notesTitle}
              </span>
            ) : (
              'Ready to synthesize your engineering coursework'
            )}
          </p>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div ref={searchRef} className="relative hidden md:block max-w-sm w-full mx-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search notes, formulas, questions..."
            className="w-full pl-10 pr-4 py-2 bg-[#121A2D] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-[#121A2D] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Matches in Active Study Set
                </div>
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectView(r.targetView);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 text-xs transition-colors flex items-center justify-between"
                  >
                    <span className="text-white truncate font-medium">{r.title}</span>
                    <span className="text-[10px] text-violet-400 font-mono shrink-0 ml-2">
                      {r.type} →
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">
                No matching terms found in current notes or generated cards.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Quick Actions, Notifications & Profile Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenExport}
          title="Export Study Pack as Markdown"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121A2D] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-violet-400" />
          <span>Export</span>
        </button>

        {hasNotes && (
          <button
            onClick={onClearNotes}
            title="Clear notes and reset workspace"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}

        <button
          onClick={onGenerateAll}
          disabled={!hasNotes || isGeneratingAll}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all duration-200 shadow-[0_0_20px_rgba(139,92,246,0.3)] ${
            !hasNotes || isGeneratingAll
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 shadow-none'
              : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 active:scale-95 border border-violet-400/30'
          }`}
        >
          {isGeneratingAll ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-violet-200" />
              <span className="hidden sm:inline">Generate Study Pack</span>
              <span className="sm:hidden">Generate</span>
            </>
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="w-9 h-9 rounded-xl bg-[#121A2D] hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-violet-500 absolute top-2 right-2 ring-2 ring-[#0B1020]" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#121A2D] border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] text-violet-400 font-mono">2 updates</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <p className="font-semibold text-white">{n.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{n.desc}</p>
                    <span className="text-[10px] text-slate-500 block mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Student Profile Avatar & Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-[#121A2D] hover:bg-slate-800 border border-slate-700/80 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(139,92,246,0.4)]">
              {userProfile.name.charAt(0) || 'S'}
            </div>
            <span className="text-xs font-semibold text-white hidden md:inline max-w-[90px] truncate">
              {userProfile.name}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#121A2D] border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center text-white font-bold">
                  {userProfile.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{userProfile.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{userProfile.discipline}</p>
                  <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-1.5 py-0.2 rounded border border-violet-500/20">
                    {userProfile.academicYear}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    onSelectView('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Account & Focus Area</span>
                </button>
                <button
                  onClick={() => {
                    onSelectView('history');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>My Saved Study Kits</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
