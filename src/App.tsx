import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InputPanel } from './components/InputPanel';
import { NoteDossier } from './components/NoteDossier';
import { DocumentView } from './components/DocumentView';
import { FlashcardsModal } from './components/FlashcardsModal';
import { AskNotesDrawer } from './components/AskNotesDrawer';
import { NotesHistoryModal } from './components/NotesHistoryModal';
import { parseStudyNotes } from './utils/parser';
import { NoteItem, ParsedNote } from './types';
import { SAMPLE_MATERIALS } from './data/samples';
import { AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'synapse_ai_notes_v1';

export default function App() {
  const [content, setContent] = useState<string>(SAMPLE_MATERIALS[0].content);
  const [level, setLevel] = useState<string>('undergraduate');
  const [detail, setDetail] = useState<string>('balanced');
  const [focus, setFocus] = useState<string>('exam');

  const [savedNotes, setSavedNotes] = useState<NoteItem[]>([]);
  const [currentNote, setCurrentNote] = useState<NoteItem | null>(null);
  const [parsedNote, setParsedNote] = useState<ParsedNote | null>(null);
  const [currentTab, setCurrentTab] = useState<'dossier' | 'raw' | 'flashcards'>('dossier');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Modals
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isAskDrawerOpen, setIsAskDrawerOpen] = useState(false);
  const [askQuery, setAskQuery] = useState<string | undefined>(undefined);

  // Load saved notes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedList: NoteItem[] = JSON.parse(stored);
        setSavedNotes(parsedList);
      }
    } catch (e) {
      console.warn('Could not load notes from local storage:', e);
    }
  }, []);

  // Sync saved notes to localStorage
  const persistNotes = (notes: NoteItem[]) => {
    setSavedNotes(notes);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.warn('Could not persist notes to local storage:', e);
    }
  };

  // Keyboard shortcut Ctrl+Enter to generate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!isLoading && content.trim().length > 10 && !currentNote) {
          handleGenerate();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, isLoading, currentNote]);

  const handleGenerate = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);
    setLoadingStep('Analyzing text syntax and semantic structure...');

    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Extracting core takeaways & bolding critical concepts...');
    }, 1800);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Synthesising study tips and memory hooks...');
    }, 3800);

    try {
      const response = await fetch('/api/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          level,
          detail,
          focus,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate study notes');
      }

      const data = await response.json();
      const markdown: string = data.markdown;

      const parsed = parseStudyNotes(markdown);
      const originalWordCount = content.trim().split(/\s+/).length;
      const wordCount = markdown.trim().split(/\s+/).length;

      const newNote: NoteItem = {
        id: Date.now().toString(),
        title: parsed.title,
        markdown,
        createdAt: Date.now(),
        wordCount,
        originalWordCount,
        level,
        detail,
        focus,
        tags: [level, focus],
      };

      const updatedList = [newNote, ...savedNotes];
      persistNotes(updatedList);
      setCurrentNote(newNote);
      setParsedNote(parsed);
      setCurrentTab('dossier');

      // Trigger celebratory confetti
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'An unexpected error occurred while generating notes.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleCopyNote = () => {
    if (!currentNote) return;
    navigator.clipboard.writeText(currentNote.markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    if (!currentNote) return;
    const blob = new Blob([currentNote.markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = `${currentNote.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_notes.md`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSelectNote = (note: NoteItem) => {
    setCurrentNote(note);
    setParsedNote(parseStudyNotes(note.markdown));
    setCurrentTab('dossier');
  };

  const handleDeleteNote = (id: string) => {
    const updated = savedNotes.filter((n) => n.id !== id);
    persistNotes(updated);
    if (currentNote?.id === id) {
      setCurrentNote(null);
      setParsedNote(null);
    }
  };

  const handleToggleFavorite = (id: string) => {
    const updated = savedNotes.map((n) =>
      n.id === id ? { ...n, isFavorite: !n.isFavorite } : n
    );
    persistNotes(updated);
    if (currentNote?.id === id) {
      setCurrentNote({ ...currentNote, isFavorite: !currentNote.isFavorite });
    }
  };

  const handleNewNote = () => {
    setCurrentNote(null);
    setParsedNote(null);
    setCurrentTab('dossier');
  };

  const handleOpenAskDrawer = (query?: string) => {
    setAskQuery(query);
    setIsAskDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'flashcards') {
            setIsFlashcardsOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        hasNote={!!currentNote}
        libraryCount={savedNotes.length}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onNewNote={handleNewNote}
        onCopyNote={handleCopyNote}
        isCopied={isCopied}
        onPrint={handlePrint}
        onDownloadMarkdown={handleDownloadMarkdown}
        onOpenAskDrawer={() => handleOpenAskDrawer()}
      />

      {/* Error alert toast */}
      {error && (
        <div className="max-w-4xl mx-auto mt-4 px-4 sm:px-6 w-full no-print">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-900"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <main className="flex-1">
        {!currentNote ? (
          <InputPanel
            content={content}
            setContent={setContent}
            level={level}
            setLevel={setLevel}
            detail={detail}
            setDetail={setDetail}
            focus={focus}
            setFocus={setFocus}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        ) : currentTab === 'raw' ? (
          <DocumentView
            note={currentNote}
            onPrint={handlePrint}
            onDownload={handleDownloadMarkdown}
          />
        ) : (
          parsedNote && (
            <NoteDossier
              note={currentNote}
              parsed={parsedNote}
              onOpenFlashcards={() => setIsFlashcardsOpen(true)}
              onOpenAskDrawer={handleOpenAskDrawer}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/80 bg-white/60 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Synapse AI Notes Generator — UI-Optimised Academic Synthesiser</span>
          <span className="text-slate-400">Enforcing the 6-Tier Academic Study Architecture</span>
        </div>
      </footer>

      {/* Flashcards Modal */}
      {currentNote && (
        <FlashcardsModal
          isOpen={isFlashcardsOpen}
          onClose={() => setIsFlashcardsOpen(false)}
          noteMarkdown={currentNote.markdown}
          noteTitle={currentNote.title}
        />
      )}

      {/* Ask AI Notes Drawer */}
      {currentNote && (
        <AskNotesDrawer
          isOpen={isAskDrawerOpen}
          onClose={() => {
            setIsAskDrawerOpen(false);
            setAskQuery(undefined);
          }}
          noteMarkdown={currentNote.markdown}
          noteTitle={currentNote.title}
          initialQuery={askQuery}
        />
      )}

      {/* Library Modal */}
      <NotesHistoryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        notes={savedNotes}
        onSelectNote={handleSelectNote}
        onDeleteNote={handleDeleteNote}
        onToggleFavorite={handleToggleFavorite}
        activeNoteId={currentNote?.id}
      />
    </div>
  );
}
