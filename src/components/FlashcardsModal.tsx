import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Trophy,
  Tag,
  Sparkles,
  PartyPopper
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Flashcard } from '../types';

interface FlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteMarkdown: string;
  noteTitle: string;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({
  isOpen,
  onClose,
  noteMarkdown,
  noteTitle,
}) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [knownMap, setKnownMap] = useState<Record<number | string, boolean>>({});

  useEffect(() => {
    if (isOpen && cards.length === 0 && noteMarkdown) {
      fetchFlashcards();
    }
  }, [isOpen, noteMarkdown]);

  const fetchFlashcards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: noteMarkdown }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate flashcards.');
      }

      const data = await res.json();
      if (data.cards && Array.isArray(data.cards)) {
        setCards(data.cards);
        setCurrentIndex(0);
        setIsFlipped(false);
        setKnownMap({});
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load flashcards');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentCard = cards[currentIndex];
  const knownCount = Object.values(knownMap).filter(Boolean).length;
  const progressPercent = cards.length > 0 ? Math.round(((currentIndex + 1) / cards.length) * 100) : 0;

  const triggerSmallConfetti = () => {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#6366f1', '#f59e0b', '#06b6d4'],
    });
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
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

  const markCard = (isKnown: boolean) => {
    if (!currentCard) return;
    setKnownMap((prev) => ({ ...prev, [currentCard.id]: isKnown }));
    if (isKnown) {
      triggerSmallConfetti();
    }
    if (currentIndex < cards.length - 1) {
      handleNext();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-linear-to-r from-indigo-50 via-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Active Recall Flashcards</h3>
              <p className="text-xs text-slate-500 truncate max-w-sm">{noteTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchFlashcards}
              disabled={isLoading}
              title="Regenerate cards"
              className="p-2 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-white/80 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-white/80 transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center items-center">
          {isLoading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto shadow-md" />
              <p className="text-sm font-black text-slate-800">Synthesising high-yield flashcards...</p>
              <p className="text-xs text-slate-500">Extracting definitions, formulas & mechanisms</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-rose-600 font-semibold">{error}</p>
              <button
                onClick={fetchFlashcards}
                className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          ) : cards.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No flashcards available.
            </div>
          ) : (
            <div className="w-full max-w-lg space-y-6">
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span>
                  Card <strong className="text-indigo-600">{currentIndex + 1}</strong> of {cards.length}
                </span>
                <div className="flex items-center gap-1.5 text-emerald-700 font-black bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{knownCount} Mastered</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                <div
                  className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* 3D Flip Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer min-h-[240px] w-full select-none"
              >
                <motion.div
                  key={isFlipped ? 'back' : 'front'}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full min-h-[240px] p-8 rounded-3xl border-2 transition-all flex flex-col justify-between shadow-xl relative ${
                    isFlipped
                      ? 'bg-linear-to-br from-indigo-950 via-slate-900 to-purple-950 text-white border-indigo-700 shadow-indigo-900/30'
                      : 'bg-white border-slate-200 text-slate-900 hover:border-indigo-400 shadow-slate-200/50'
                  }`}
                >
                  {/* Card top tag */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full ${
                        isFlipped ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {isFlipped ? 'Answer & High-Yield Key' : 'Concept / Question'}
                    </span>

                    {currentCard.tag && (
                      <span
                        className={`text-xs font-bold flex items-center gap-1.5 ${
                          isFlipped ? 'text-indigo-300' : 'text-slate-500'
                        }`}
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>{currentCard.tag}</span>
                      </span>
                    )}
                  </div>

                  {/* Card content */}
                  <div className="my-auto py-4 text-center">
                    <p className={`text-base sm:text-lg font-black leading-relaxed ${isFlipped ? 'text-cyan-200' : 'text-slate-900'}`}>
                      {isFlipped ? currentCard.back : currentCard.front}
                    </p>
                  </div>

                  {/* Card bottom hint */}
                  <div className="text-center">
                    <span
                      className={`text-xs font-semibold flex items-center justify-center gap-1.5 ${
                        isFlipped ? 'text-indigo-300' : 'text-slate-400'
                      }`}
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Click to flip card</span>
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Card Controls & Knowledge buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="p-2.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => markCard(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-black text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-300 transition-colors shadow-2xs"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Review Again</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => markCard(true)}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-black text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl border border-emerald-300 transition-colors shadow-2xs"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Got It! 🎉</span>
                  </motion.button>
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === cards.length - 1}
                  className="p-2.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
