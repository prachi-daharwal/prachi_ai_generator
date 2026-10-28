import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Library, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  BrainCircuit, 
  FileText, 
  Layers,
  HelpCircle,
  Plus
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'dossier' | 'raw' | 'flashcards';
  setCurrentTab: (tab: 'dossier' | 'raw' | 'flashcards') => void;
  hasNote: boolean;
  libraryCount: number;
  onOpenLibrary: () => void;
  onNewNote: () => void;
  onCopyNote: () => void;
  isCopied: boolean;
  onPrint: () => void;
  onDownloadMarkdown: () => void;
  onOpenAskDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  hasNote,
  libraryCount,
  onOpenLibrary,
  onNewNote,
  onCopyNote,
  isCopied,
  onPrint,
  onDownloadMarkdown,
  onOpenAskDrawer,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl text-slate-900 tracking-tight bg-linear-to-r from-slate-900 via-indigo-950 to-purple-900 bg-clip-text text-transparent">
                Synapse
              </span>
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-2xs">
                AI Notes
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">UI-Optimised Academic Study Architecture</p>
          </div>
        </div>

        {/* View Mode Switcher (when a note is loaded) */}
        {hasNote && (
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setCurrentTab('dossier')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'dossier'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dossier View</span>
            </button>

            <button
              onClick={() => setCurrentTab('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'raw'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Document</span>
            </button>

            <button
              onClick={() => setCurrentTab('flashcards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'flashcards'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Flashcards</span>
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasNote && (
            <>
              <button
                onClick={onOpenAskDrawer}
                title="Ask AI questions about this note"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ask Note</span>
              </button>

              <button
                onClick={onCopyNote}
                title="Copy note markdown"
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={onPrint}
                title="Print or Save as PDF"
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={onDownloadMarkdown}
                title="Download as Markdown file"
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Library Button */}
          <button
            onClick={onOpenLibrary}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200/80 transition-colors"
          >
            <Library className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Library</span>
            {libraryCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                {libraryCount}
              </span>
            )}
          </button>

          {/* New Notes Button */}
          <button
            onClick={onNewNote}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-lg shadow-xs shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>
      </div>
    </header>
  );
};
