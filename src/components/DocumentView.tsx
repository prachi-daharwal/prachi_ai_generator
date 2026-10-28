import React, { useState } from 'react';
import { Copy, Check, Printer, Download, Eye, Code } from 'lucide-react';
import { NoteItem } from '../types';

interface DocumentViewProps {
  note: NoteItem;
  onPrint: () => void;
  onDownload: () => void;
}

export const DocumentView: React.FC<DocumentViewProps> = ({
  note,
  onPrint,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewSource, setViewSource] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(note.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert raw markdown to clean printable HTML lines
  const lines = note.markdown.split('\n');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Control bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xs no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewSource(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              !viewSource ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Formatted Document</span>
          </button>
          <button
            onClick={() => setViewSource(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewSource ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Raw Markdown</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy All'}</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Document Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 shadow-sm printable-card">
        {viewSource ? (
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {note.markdown}
          </pre>
        ) : (
          <div className="space-y-4 text-slate-800 leading-relaxed font-serif sm:text-base text-sm">
            {lines.map((line, idx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={idx} className="h-2" />;

              // Heading 1
              if (trimmed.startsWith('# ')) {
                return (
                  <h1 key={idx} className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-950 pt-2 pb-3 border-b-2 border-indigo-600">
                    {trimmed.replace(/^#\s*/, '')}
                  </h1>
                );
              }

              // Heading 2
              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={idx} className="font-sans text-xl font-bold text-slate-900 pt-6 pb-2 border-b border-slate-200">
                    {trimmed.replace(/^##\s*/, '')}
                  </h2>
                );
              }

              // Heading 3
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-sans text-base font-bold text-slate-800 pt-4 pb-1">
                    {trimmed.replace(/^###\s*/, '')}
                  </h3>
                );
              }

              // Blockquote (Core Summary or Study Tip)
              if (trimmed.startsWith('>')) {
                const clean = trimmed.replace(/^>\s*/, '');
                const isTip = clean.toLowerCase().includes('study tip') || clean.includes('💡');
                return (
                  <blockquote
                    key={idx}
                    className={`my-3 p-4 rounded-xl border-l-4 font-sans text-sm leading-relaxed ${
                      isTip
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-medium'
                        : 'bg-indigo-50/70 border-indigo-600 text-slate-800 italic'
                    }`}
                  >
                    {clean}
                  </blockquote>
                );
              }

              // Bullet points
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={idx} className="flex items-start gap-2.5 pl-3 font-sans text-sm text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                    <span>{trimmed.replace(/^[-*]\s*/, '')}</span>
                  </div>
                );
              }

              // Standard Paragraph
              return (
                <p key={idx} className="font-sans text-sm sm:text-base text-slate-800 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
