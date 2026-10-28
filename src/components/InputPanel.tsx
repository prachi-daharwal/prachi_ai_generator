import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  Trash2, 
  BookOpen, 
  GraduationCap, 
  Sliders, 
  Target, 
  CheckCircle2,
  ArrowRight,
  Dna,
  Atom,
  Cpu,
  TrendingUp,
  Zap,
  Flame,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SAMPLE_MATERIALS } from '../data/samples';
import { SampleMaterial } from '../types';

// Topic banner images
import heroBannerImg from '../assets/images/study_hero_banner_1793172038453.jpg';
import dnaImg from '../assets/images/science_dna_molecule_1793172053499.jpg';
import quantumImg from '../assets/images/quantum_ai_neural_1793172066208.jpg';

interface InputPanelProps {
  content: string;
  setContent: (val: string) => void;
  level: string;
  setLevel: (val: string) => void;
  detail: string;
  setDetail: (val: string) => void;
  focus: string;
  setFocus: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  loadingStep: string;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  content,
  setContent,
  level,
  setLevel,
  detail,
  setDetail,
  focus,
  setFocus,
  onGenerate,
  isLoading,
  loadingStep,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState<string>('crispr-genetics');

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setContent(text);
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setContent(text);
      };
      reader.readAsText(file);
    }
  };

  const loadSample = (sample: SampleMaterial) => {
    setActiveSampleId(sample.id);
    setContent(sample.content);
    setLevel(sample.level);
  };

  const sampleIcons: Record<string, any> = {
    'crispr-genetics': Dna,
    'quantum-computing': Atom,
    'deep-learning-backprop': Cpu,
    'monetary-policy': TrendingUp,
  };

  const sampleGradients: Record<string, string> = {
    'crispr-genetics': 'from-emerald-500/10 via-teal-500/15 to-cyan-500/10 border-emerald-400 text-emerald-950',
    'quantum-computing': 'from-indigo-500/10 via-purple-500/15 to-pink-500/10 border-purple-400 text-purple-950',
    'deep-learning-backprop': 'from-cyan-500/10 via-blue-500/15 to-indigo-500/10 border-cyan-400 text-cyan-950',
    'monetary-policy': 'from-amber-500/10 via-orange-500/15 to-yellow-500/10 border-amber-400 text-amber-950',
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6 relative z-10">
      {/* Decorative colorful ambient orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-24 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Colorful Hero Card with Embedded Photo */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 mb-8 relative bg-slate-900 group"
      >
        <div className="relative h-56 sm:h-72 w-full overflow-hidden">
          <img 
            src={heroBannerImg} 
            alt="Futuristic academic study space" 
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 opacity-80"
          />
          {/* Vibrant overlay gradients */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-indigo-950/70 via-transparent to-purple-950/60" />

          {/* Hero text overlay */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>AI Study Notes Synthesiser</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-400/30">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant High-Yield Cramming</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Turn Complex Study Material into <br className="hidden sm:inline" />
              <span className="bg-linear-to-r from-cyan-300 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
                Vibrant, Structured Academic Notes
              </span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-200/90 max-w-2xl leading-relaxed">
              Enforcing the strict 6-part framework: Title, Summary, Key Takeaways, Detailed Breakdown, Bold Critical Concepts & Quick Study Mnemonics.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Colorful Interactive Sample Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Curated Academic Study Material:
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">1-click to auto-fill</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_MATERIALS.map((sample) => {
            const IconComponent = sampleIcons[sample.id] || BookOpen;
            const isSelected = activeSampleId === sample.id;
            const gradientStyle = sampleGradients[sample.id] || '';

            return (
              <motion.button
                key={sample.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadSample(sample)}
                className={`text-left p-3.5 rounded-2xl border-2 transition-all relative overflow-hidden bg-white shadow-xs ${
                  isSelected
                    ? `ring-2 ring-indigo-500 shadow-md ${gradientStyle}`
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    sample.id === 'crispr-genetics' ? 'bg-emerald-500 text-white shadow-sm' :
                    sample.id === 'quantum-computing' ? 'bg-purple-600 text-white shadow-sm' :
                    sample.id === 'deep-learning-backprop' ? 'bg-cyan-600 text-white shadow-sm' :
                    'bg-amber-500 text-white shadow-sm'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900 truncate">
                      {sample.title.split(':')[0]}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {sample.subject}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Input Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden"
      >
        {/* Card Header Bar */}
        <div className="bg-linear-to-r from-slate-50 via-indigo-50/40 to-slate-50 px-6 py-3.5 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
            <span>Study Input Workspace</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <span>Words: <strong className="text-indigo-700">{wordCount}</strong></span>
            <span>Chars: <strong className="text-indigo-700">{charCount}</strong></span>
          </div>
        </div>

        {/* Text Area */}
        <div 
          className={`p-6 relative transition-all ${
            dragActive ? 'bg-indigo-50/50 border-2 border-dashed border-indigo-500' : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your textbook chapters, lecture notes, syllabus concepts, research articles or homework material here... (You can also drag & drop .txt or .md files)"
            rows={11}
            className="w-full text-slate-800 placeholder-slate-400 text-sm leading-relaxed resize-y focus:outline-hidden border-none bg-transparent"
          />

          {/* Action bar inside textarea */}
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-100 text-xs gap-3">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-medium"
              >
                <UploadCloud className="w-4 h-4 text-indigo-600" />
                <span>Upload Document (.txt, .md)</span>
              </button>

              {content && (
                <button
                  type="button"
                  onClick={() => setContent('')}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Clear text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {wordCount > 30 && (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Optimal Material Size</span>
              </span>
            )}
          </div>
        </div>

        {/* Synthesis Configuration Deck */}
        <div className="bg-slate-50/80 p-6 border-t border-slate-200/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Level */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Academic Level</span>
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="high-school">High School (Simple & Clear)</option>
                <option value="undergraduate">Undergraduate (Rigorous Academic)</option>
                <option value="graduate">Graduate / Advanced (Technical Deep-Dive)</option>
                <option value="professional">Professional / Research</option>
              </select>
            </div>

            {/* Depth */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>Synthesis Depth</span>
              </label>
              <select
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                <option value="concise">Concise (Cram Sheet - High Yield)</option>
                <option value="balanced">Balanced (Standard Academic Notes)</option>
                <option value="comprehensive">Comprehensive (Deep Modular Breakdown)</option>
              </select>
            </div>

            {/* Objective */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                <Target className="w-4 h-4 text-rose-600" />
                <span>Study Goal</span>
              </label>
              <select
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              >
                <option value="exam">Exam Prep & Memory Anchors</option>
                <option value="conceptual">Core Conceptual Mastery</option>
                <option value="formulas">Formulas, Definitions & Problem Solving</option>
              </select>
            </div>
          </div>

          {/* 6-Part Visual Schema Preview */}
          <div className="mt-5 pt-4 border-t border-slate-200/70">
            <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2.5">
              Strict 6-Part High-Yield Architecture Enforced:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
              <div className="bg-indigo-50 border border-indigo-200/80 rounded-xl p-2 text-indigo-950 font-bold flex items-center gap-1.5">
                <span>🏷️</span> <span className="truncate">1. Title (#)</span>
              </div>
              <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-2 text-sky-950 font-bold flex items-center gap-1.5">
                <span>📌</span> <span className="truncate">2. Core Summary</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2 text-emerald-950 font-bold flex items-center gap-1.5">
                <span>🔑</span> <span className="truncate">3. Takeaways</span>
              </div>
              <div className="bg-purple-50 border border-purple-200/80 rounded-xl p-2 text-purple-950 font-bold flex items-center gap-1.5">
                <span>📘</span> <span className="truncate">4. Breakdown</span>
              </div>
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2 text-amber-950 font-bold flex items-center gap-1.5">
                <span>⚠️</span> <span className="truncate">5. Concepts</span>
              </div>
              <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-2 text-rose-950 font-bold flex items-center gap-1.5">
                <span>💡</span> <span className="truncate">6. Study Tip</span>
              </div>
            </div>
          </div>

          {/* Generate Action Button */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Shortcut: <kbd className="px-2 py-0.5 bg-slate-200 rounded text-slate-800 font-mono text-[10px]">Ctrl+Enter</kbd> to synthesise instantly.
            </span>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onGenerate}
              disabled={isLoading || wordCount < 5}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isLoading || wordCount < 5
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span className="animate-pulse">{loadingStep || 'Synthesising Notes...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Generate Colourful Structured Notes</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
