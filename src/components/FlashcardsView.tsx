import React, { useState, useEffect } from 'react';
import {
  Layers,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  BookOpen,
  LayoutGrid,
  Maximize2,
  Lightbulb,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
  isLoading: boolean;
  onGenerateFlashcards: () => void;
  onNavigateToNotes: () => void;
  hasNotes: boolean;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  flashcards,
  isLoading,
  onGenerateFlashcards,
  onNavigateToNotes,
  hasNotes,
}) => {
  const [deck, setDeck] = useState<Flashcard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<'focus' | 'grid'>('focus');
  const [masteryMap, setMasteryMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setDeck(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteryMap({});
  }, [flashcards]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'focus' || deck.length === 0) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentIndex, deck.length]);

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setDeck(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteryMap({});
  };

  const markMastery = (cardId: number, mastered: boolean) => {
    setMasteryMap((prev) => ({
      ...prev,
      [cardId]: mastered,
    }));
    if (currentIndex < deck.length - 1) {
      setTimeout(() => {
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
      }, 250);
    }
  };

  const currentCard = deck[currentIndex];
  const masteredCount = Object.values(masteryMap).filter(Boolean).length;
  const progressPct = deck.length > 0 ? Math.round((masteredCount / deck.length) * 100) : 0;

  if (deck.length === 0 && !isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center bg-[#121A2D] rounded-3xl border border-slate-800 shadow-md p-8">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4">
          <Layers className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white">
          No Flashcards Created Yet
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
          {hasNotes
            ? 'Generate 8 to 12 active recall flip cards from your notes with definitions, formulas, and memory tips.'
            : 'Paste your engineering lecture notes first to generate flip flashcards.'}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {hasNotes ? (
            <button
              onClick={onGenerateFlashcards}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all"
            >
              <Zap className="w-4 h-4" />
              Generate Flashcards Now
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
      <div className="max-w-3xl mx-auto py-20 text-center bg-[#121A2D] rounded-3xl border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
        <div className="inline-flex p-4 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 mb-4 animate-bounce">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">
          Generating Active Recall Flashcards...
        </h3>
        <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
          Formulating concept prompts, crisp explanations, and memory hooks from your lecture notes.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Controls Header */}
      <div className="bg-[#121A2D] rounded-3xl p-6 md:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 font-mono">
              Spaced Repetition
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {deck.length} Flashcards in Deck
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Engineering Flashcard Deck
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Click cards or press <kbd className="px-1.5 py-0.5 bg-[#0B1020] border border-slate-700 rounded text-[10px] font-mono text-violet-300">Space</kbd> to flip.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View mode toggle */}
          <div className="flex items-center bg-[#0B1020] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('focus')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'focus'
                  ? 'bg-violet-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Focus</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-violet-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          <button
            onClick={handleShuffle}
            title="Shuffle deck order"
            className="p-2.5 bg-[#0B1020] border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset cards"
            className="p-2.5 bg-[#0B1020] border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onGenerateFlashcards}
            title="Generate fresh flashcards"
            className="p-2.5 bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fresh Cards</span>
          </button>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="bg-[#121A2D] rounded-2xl p-5 border border-slate-800/80 shadow-md">
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="font-semibold text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Deck Mastery: {masteredCount} of {deck.length} cards mastered
          </span>
          <span className="font-mono font-bold text-violet-400">{progressPct}%</span>
        </div>
        <div className="w-full bg-[#0B1020] h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_#8B5CF6]"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* FOCUS MODE: SINGLE LARGE 3D FLIP CARD */}
      {viewMode === 'focus' && currentCard && (
        <div className="space-y-4">
          <div className="perspective-1000 w-full min-h-[360px] cursor-pointer">
            <div
              onClick={() => setIsFlipped((prev) => !prev)}
              className={`relative w-full h-[370px] rounded-3xl transition-transform duration-500 transform-style-3d shadow-2xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 w-full h-full bg-[#121A2D] border-2 border-violet-500/30 hover:border-violet-500/60 rounded-3xl p-8 flex flex-col justify-between backface-hidden shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono">
                    {currentCard.category || 'Engineering Concept'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Card {currentIndex + 1} / {deck.length}
                  </span>
                </div>

                <div className="my-auto py-6 text-center">
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-widest block mb-3 font-mono">
                    Concept / Problem Prompt
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug px-4">
                    {currentCard.front}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800">
                  <span className="flex items-center gap-1.5 text-violet-400 font-medium">
                    <RotateCw className="w-3.5 h-3.5" /> Click or press Space to flip
                  </span>
                  {masteryMap[currentCard.id] && (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                    </span>
                  )}
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0B1020] via-[#121A2D] to-indigo-950 border-2 border-violet-500/40 text-white rounded-3xl p-8 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                    Answer & Explanation
                  </span>
                  <span className="text-xs text-violet-300 font-mono">
                    Card {currentIndex + 1} / {deck.length}
                  </span>
                </div>

                <div className="my-auto py-4 overflow-y-auto">
                  <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-normal">
                    {currentCard.back}
                  </p>

                  {currentCard.hint && (
                    <div className="mt-4 p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-200 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-300 font-mono">Memory Hook: </span>
                        <span>{currentCard.hint}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                  <span className="flex items-center gap-1.5 text-violet-300">
                    <RotateCw className="w-3.5 h-3.5" /> Click to flip back
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Score with buttons below
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-[#121A2D] rounded-2xl p-4 border border-slate-800/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Prev / Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-2.5 rounded-xl border border-slate-700 bg-[#0B1020] hover:bg-slate-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous card (Left Arrow)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-xs font-bold text-white font-mono px-3">
                {currentIndex + 1} / {deck.length}
              </span>

              <button
                onClick={handleNext}
                disabled={currentIndex === deck.length - 1}
                className="p-2.5 rounded-xl border border-slate-700 bg-[#0B1020] hover:bg-slate-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next card (Right Arrow)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Self-Rating buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => markMastery(currentCard.id, false)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Still Learning
              </button>
              <button
                onClick={() => markMastery(currentCard.id, true)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mastered
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {deck.map((card, idx) => (
            <GridCardItem
              key={card.id || idx}
              card={card}
              index={idx}
              isMastered={Boolean(masteryMap[card.id])}
              onToggleMastery={(mastered) => markMastery(card.id, mastered)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface GridCardItemProps {
  card: Flashcard;
  index: number;
  isMastered: boolean;
  onToggleMastery: (mastered: boolean) => void;
}

const GridCardItem: React.FC<GridCardItemProps> = ({
  card,
  index,
  isMastered,
  onToggleMastery,
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="perspective-1000 h-64">
      <div
        onClick={() => setFlipped((prev) => !prev)}
        className={`relative w-full h-full rounded-2xl cursor-pointer transition-transform duration-500 transform-style-3d shadow-md ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-[#121A2D] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between backface-hidden hover:border-violet-500/40 transition-colors">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-mono border border-purple-500/20">
              {card.category}
            </span>
            <span className="text-slate-500 font-mono text-[11px]">#{index + 1}</span>
          </div>

          <p className="font-bold text-white text-sm leading-snug my-auto line-clamp-4">
            {card.front}
          </p>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            <span className="text-violet-400 font-medium">Click to flip</span>
            {isMastered && <span className="text-emerald-400 font-bold font-mono">✓ Mastered</span>}
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 bg-[#0B1020] text-white border border-violet-500/30 rounded-2xl p-5 flex flex-col justify-between backface-hidden rotate-y-180 shadow-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider font-mono">
              Answer
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMastery(!isMastered);
              }}
              className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
                isMastered ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isMastered ? 'Mastered' : 'Mark Done'}
            </button>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed my-auto overflow-y-auto max-h-36">
            {card.back}
          </p>

          <span className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            Click to return to prompt
          </span>
        </div>
      </div>
    </div>
  );
};
