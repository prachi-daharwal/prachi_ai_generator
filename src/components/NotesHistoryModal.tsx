import React, { useState } from 'react';
import { 
  Library, 
  Search, 
  Trash2, 
  BookOpen, 
  Star, 
  Clock, 
  FileText, 
  Check, 
  ArrowRight,
  Download
} from 'lucide-react';
import { NoteItem } from '../types';

interface NotesHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: NoteItem[];
  onSelectNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  activeNoteId?: string;
}

export const NotesHistoryModal: React.FC<NotesHistoryModalProps> = ({
  isOpen,
  onClose,
  notes,
  onSelectNote,
  onDeleteNote,
  onToggleFavorite,
  activeNoteId,
}) => {
  const [search, setSearch] = useState('');
  const [filterFavs, setFilterFavs] = useState(false);

  if (!isOpen) return null;

  const filtered = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.markdown.toLowerCase().includes(search.toLowerCase());
    const matchesFav = filterFavs ? n.isFavorite : true;
    return matchesSearch && matchesFav;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Library className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Notes Library</h3>
              <p className="text-xs text-slate-500">{notes.length} saved study dossiers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic or keywords..."
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => setFilterFavs(!filterFavs)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              filterFavs
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterFavs ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Starred</span>
          </button>
        </div>

        {/* List of notes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs sm:text-sm">
              {notes.length === 0
                ? 'No study notes saved yet. Generate your first notes to build your library!'
                : 'No notes match your search criteria.'}
            </div>
          ) : (
            filtered.map((note) => {
              const isCurrent = note.id === activeNoteId;
              const dateStr = new Date(note.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isCurrent
                      ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-400'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div
                    onClick={() => {
                      onSelectNote(note);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                        {note.title}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-indigo-600 text-white">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{dateStr}</span>
                      </span>
                      <span className="capitalize px-1.5 py-0.5 rounded bg-slate-100 font-medium">
                        {note.level || 'undergraduate'}
                      </span>
                      <span>{note.wordCount} words</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorite(note.id)}
                      className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 transition-colors"
                      title={note.isFavorite ? 'Remove star' : 'Star note'}
                    >
                      <Star
                        className={`w-4 h-4 ${note.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`}
                      />
                    </button>

                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        onSelectNote(note);
                        onClose();
                      }}
                      className="p-1.5 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-100/60 transition-colors ml-1"
                      title="Open note"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
