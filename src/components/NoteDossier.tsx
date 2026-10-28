import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  BrainCircuit, 
  Sparkles, 
  Lightbulb, 
  Clock, 
  GraduationCap, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  FileCheck, 
  Share2, 
  PartyPopper,
  Zap,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ParsedNote, NoteItem } from '../types';

// Subject illustrations
import dnaImg from '../assets/images/science_dna_molecule_1793172053499.jpg';
import quantumImg from '../assets/images/quantum_ai_neural_1793172066208.jpg';
import heroImg from '../assets/images/study_hero_banner_1793172038453.jpg';

interface NoteDossierProps {
  note: NoteItem;
  parsed: ParsedNote;
  onOpenFlashcards: () => void;
  onOpenAskDrawer: (initialQuery?: string) => void;
}

export const NoteDossier: React.FC<NoteDossierProps> = ({
  note,
  parsed,
  onOpenFlashcards,
  onOpenAskDrawer,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [selectedConceptFilter, setSelectedConceptFilter] = useState<string | null>(null);
  const [tipMastered, setTipMastered] = useState(false);

  // Determine thematic photo based on content
  const contentLower = (parsed.title + ' ' + parsed.rawMarkdown).toLowerCase();
  let themeImage = heroImg;
  let themeTag = 'Academic Study';
  if (contentLower.includes('crispr') || contentLower.includes('dna') || contentLower.includes('cell') || contentLower.includes('gene') || contentLower.includes('bio')) {
    themeImage = dnaImg;
    themeTag = 'Biotechnology & Molecular Biology';
  } else if (contentLower.includes('quantum') || contentLower.includes('neural') || contentLower.includes('qubit') || contentLower.includes('deep learning') || contentLower.includes('physic')) {
    themeImage = quantumImg;
    themeTag = 'Quantum & Computational Physics';
  }

  // Word count & compression
  const noteWordCount = parsed.rawMarkdown.trim().split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(noteWordCount / 200));
  const compressionRatio = note.originalWordCount > 0
    ? Math.max(0, Math.round((1 - noteWordCount / note.originalWordCount) * 100))
    : 65;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
    });
  };

  const copySection = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Text-to-speech
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToRead = `${parsed.title}. Core Summary: ${parsed.coreSummary}. Key Takeaways: ${parsed.keyTakeaways.join('. ')}. Detailed Breakdown: ${parsed.breakdowns.map(b => `${b.heading}. ${b.content.join(' ')}`).join('. ')}. Study Tip: ${parsed.studyTip}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechRate;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setTimeout(() => handleToggleSpeech(), 100);
    }
  };

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: prev[index] === undefined ? false : !prev[index],
    }));
  };

  // Render text with interactive bold concepts
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const clean = part.slice(2, -2);
        const isTargetFilter = selectedConceptFilter && clean.toLowerCase().includes(selectedConceptFilter.toLowerCase());
        return (
          <strong
            key={idx}
            className={`font-black transition-all px-1.5 py-0.5 rounded-md cursor-pointer ${
              isTargetFilter
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-500 shadow-md scale-105'
                : 'text-indigo-950 bg-indigo-100/90 border border-indigo-200/80 hover:bg-amber-200 hover:text-amber-950 hover:border-amber-400'
            }`}
            onClick={() => onOpenAskDrawer(`Explain this concept in more depth: "${clean}"`)}
            title="Click to ask AI Tutor about this concept"
          >
            {clean}
          </strong>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  // Colorful takeaway card gradient styles
  const takeawayColors = [
    'from-blue-500/10 via-sky-500/5 to-transparent border-blue-300 text-blue-950',
    'from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-300 text-emerald-950',
    'from-purple-500/10 via-pink-500/5 to-transparent border-purple-300 text-purple-950',
    'from-amber-500/10 via-yellow-500/5 to-transparent border-amber-300 text-amber-950',
    'from-rose-500/10 via-red-500/5 to-transparent border-rose-300 text-rose-950',
    'from-cyan-500/10 via-teal-500/5 to-transparent border-cyan-300 text-cyan-950',
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-8 relative z-10">
      {/* 1. 🏷️ TOPIC TITLE & HERO PHOTO CARD */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 relative bg-slate-950"
      >
        {/* Dynamic Thematic Banner Image */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden">
          <img 
            src={themeImage} 
            alt={parsed.title} 
            className="w-full h-full object-cover object-center opacity-85"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-indigo-950/80 via-transparent to-purple-950/70" />

          {/* Floating Action Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            {/* Audio Reader */}
            <div className="flex items-center bg-black/50 backdrop-blur-md rounded-xl p-1 border border-white/20 text-xs text-white">
              <button
                onClick={handleToggleSpeech}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  isPlayingAudio ? 'bg-indigo-600 text-white animate-pulse' : 'text-slate-200 hover:text-white'
                }`}
                title={isPlayingAudio ? 'Stop reading' : 'Read notes aloud'}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
              </button>
              {isPlayingAudio && (
                <div className="flex items-center px-1.5 gap-1 text-[11px] font-mono">
                  {[1, 1.25, 1.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRateChange(r)}
                      className={`px-1 rounded ${speechRate === r ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400'}`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Flashcards CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenFlashcards}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 border border-white/20"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Practice Flashcards</span>
            </motion.button>
          </div>

          {/* Header Title & Badges */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col justify-end">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/30 backdrop-blur-md text-indigo-300 border border-indigo-400/40">
                {themeTag}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-slate-200 border border-white/20">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-sky-400" />
                {readTimeMinutes} min read
              </span>
              {compressionRatio > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/30 backdrop-blur-md text-emerald-300 border border-emerald-400/40">
                  <FileCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
                  {compressionRatio}% text reduction
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                <span className="mr-2">🏷️</span>
                {parsed.title}
              </h1>

              <button
                onClick={() => copySection(parsed.title, 'title')}
                className="p-2 text-slate-300 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors shrink-0"
                title="Copy title"
              >
                {copiedSection === 'title' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. 📌 CORE SUMMARY: Vibrant Italic Blockquote Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-linear-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-700/50"
      >
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📌</span>
            <span className="text-xs font-black uppercase tracking-widest text-cyan-300">
              Core Academic Summary
            </span>
            <span className="text-xs text-indigo-200 font-medium hidden sm:inline">
              (High-Level 2–3 Sentence Synthesis)
            </span>
          </div>

          <button
            onClick={() => copySection(parsed.coreSummary, 'summary')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-indigo-100 font-semibold transition-colors"
          >
            {copiedSection === 'summary' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <blockquote className="text-base sm:text-lg leading-relaxed italic text-indigo-50 font-medium pl-4 border-l-4 border-cyan-400">
          "{renderFormattedText(parsed.coreSummary)}"
        </blockquote>
      </motion.div>

      {/* 3. 🔑 KEY TAKEAWAYS: Colourful Visual Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔑</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Key Takeaways
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
              {parsed.keyTakeaways.length} Key Anchors
            </span>
          </div>

          <button
            onClick={() => copySection(parsed.keyTakeaways.join('\n'), 'takeaways')}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 font-bold transition-colors"
          >
            {copiedSection === 'takeaways' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {parsed.keyTakeaways.map((takeaway, idx) => {
            const hasEmoji = /^[\p{Emoji}\u200d]+/u.test(takeaway);
            const defaultEmojis = ['🎯', '⚡', '🔍', '💡', '📐', '🧠', '⭐', '🧬'];
            const emoji = hasEmoji ? '' : defaultEmojis[idx % defaultEmojis.length];
            const colorClass = takeawayColors[idx % takeawayColors.length];

            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01, y: -2 }}
                className={`p-4 rounded-2xl border-2 bg-linear-to-br transition-all flex items-start gap-3.5 shadow-2xs ${colorClass}`}
              >
                <span className="text-xl shrink-0 select-none mt-0.5">
                  {emoji || takeaway.slice(0, 2)}
                </span>
                <div className="leading-relaxed flex-1 text-sm font-medium">
                  {renderFormattedText(hasEmoji ? takeaway.replace(/^[\p{Emoji}\u200d]+\s*/u, '') : takeaway)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 5. ⚠️ CRITICAL CONCEPTS: Glowing Interactive Pill Rack */}
      {parsed.criticalConcepts.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-linear-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 rounded-3xl border-2 border-amber-400/80 p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-950">
                Critical Concepts & Formula Vocabulary
              </h3>
              <span className="text-xs text-amber-900 font-semibold">
                (Click to highlight or query)
              </span>
            </div>
            {selectedConceptFilter && (
              <button
                onClick={() => setSelectedConceptFilter(null)}
                className="text-xs text-amber-900 underline hover:text-amber-950 font-bold"
              >
                Clear highlight filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {parsed.criticalConcepts.map((concept, idx) => {
              const isSelected = selectedConceptFilter === concept.term;
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedConceptFilter(isSelected ? null : concept.term)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400'
                      : 'bg-white text-amber-950 border-2 border-amber-300 hover:border-amber-500 hover:bg-amber-100'
                  }`}
                  title={`Filter or jump to ${concept.term}`}
                >
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>{concept.term}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 4. 📘 DETAILED BREAKDOWN: Subheadings (##) in Colorful Modules */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">📘</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Detailed Breakdown
            </h2>
            <span className="text-xs font-bold text-slate-500">
              ({parsed.breakdowns.length} Sub-modules)
            </span>
          </div>

          <button
            onClick={() => {
              const allExpanded = Object.keys(expandedSections).length === parsed.breakdowns.length;
              if (allExpanded) {
                setExpandedSections({});
              } else {
                const newExp: Record<number, boolean> = {};
                parsed.breakdowns.forEach((_, i) => (newExp[i] = true));
                setExpandedSections(newExp);
              }
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-extrabold"
          >
            {Object.keys(expandedSections).length === parsed.breakdowns.length ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        {parsed.breakdowns.map((section, idx) => {
          const isCollapsed = expandedSections[idx] === false;
          const sectionBadgeColors = [
            'bg-indigo-600 text-white',
            'bg-purple-600 text-white',
            'bg-cyan-600 text-white',
            'bg-emerald-600 text-white',
            'bg-rose-600 text-white',
          ];
          const badgeClass = sectionBadgeColors[idx % sectionBadgeColors.length];

          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
            >
              {/* Header (##) */}
              <div 
                onClick={() => toggleSection(idx)}
                className="p-4 sm:p-5 bg-linear-to-r from-slate-50 via-indigo-50/20 to-slate-50 hover:bg-slate-100/80 border-b border-slate-200/70 cursor-pointer flex items-center justify-between gap-3 transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl ${badgeClass} text-xs font-black flex items-center justify-center shrink-0 shadow-xs`}>
                    {idx + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {section.heading}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copySection(section.content.join('\n'), `section-${idx}`);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    title="Copy this section"
                  >
                    {copiedSection === `section-${idx}` ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <div className="text-slate-400">
                    {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Body */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 sm:p-7 space-y-3.5 text-slate-800 text-sm leading-relaxed"
                  >
                    {section.content.map((line, lIdx) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;

                      // Sub-bullet point
                      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                        return (
                          <div key={lIdx} className="flex items-start gap-3 pl-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0 shadow-xs" />
                            <div className="flex-1 font-medium">
                              {renderFormattedText(trimmed.replace(/^[-*]\s*/, ''))}
                            </div>
                          </div>
                        );
                      }

                      // Sub-heading (###)
                      if (trimmed.startsWith('### ')) {
                        return (
                          <h4 key={lIdx} className="text-sm font-black text-slate-900 pt-3 pb-1 border-b border-slate-100 flex items-center gap-2">
                            <span className="w-1.5 h-3.5 rounded bg-purple-600" />
                            <span>{trimmed.replace(/^###\s*/, '')}</span>
                          </h4>
                        );
                      }

                      return (
                        <p key={lIdx} className="text-slate-700 leading-relaxed font-normal">
                          {renderFormattedText(trimmed)}
                        </p>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      {/* 6. 💡 QUICK MNEMONIC / STUDY TIP: High-Contrast Sunrise Callout */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div className="flex items-start gap-4">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 border border-white/30 shadow-md"
          >
            <Lightbulb className="w-6 h-6 text-yellow-200 fill-yellow-300" />
          </motion.div>

          <div className="space-y-2.5 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-amber-100">
                  Quick Mnemonic & Study Tip
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white text-amber-950">
                  Memory Hook
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTipMastered(true);
                    triggerConfetti();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    tipMastered ? 'bg-emerald-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  <PartyPopper className="w-3.5 h-3.5" />
                  <span>{tipMastered ? 'Mastered!' : 'Mark Mastered 🎉'}</span>
                </button>

                <button
                  onClick={() => copySection(parsed.studyTip, 'tip')}
                  className="flex items-center gap-1 text-xs text-white/90 hover:text-white font-bold bg-white/10 px-2.5 py-1.5 rounded-xl transition-colors"
                >
                  {copiedSection === 'tip' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-sm sm:text-base font-semibold text-amber-50 leading-relaxed pr-2">
              {renderFormattedText(parsed.studyTip)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interactive AI Tutor CTA Card */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 border border-indigo-800/40 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl no-print"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Interactive AI Academic Tutor</h4>
            <p className="text-xs text-slate-300">Ask questions, request analogies, or test your comprehension.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => onOpenAskDrawer('Can you generate 3 exam-style multiple choice questions based on these notes?')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          >
            Practice Quiz
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenAskDrawer()}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
          >
            Ask AI Tutor
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
