export interface NoteItem {
  id: string;
  title: string;
  markdown: string;
  createdAt: number;
  wordCount: number;
  originalWordCount: number;
  level: string;
  detail: string;
  focus: string;
  tags: string[];
  isFavorite?: boolean;
}

export interface Flashcard {
  id: number | string;
  front: string;
  back: string;
  tag?: string;
  known?: boolean;
}

export interface ParsedNote {
  title: string;
  coreSummary: string;
  keyTakeaways: string[];
  breakdowns: Array<{
    heading: string;
    content: string[];
    subsections?: Array<{ subtitle: string; points: string[] }>;
  }>;
  criticalConcepts: Array<{ term: string; context?: string }>;
  studyTip: string;
  rawMarkdown: string;
}

export interface SampleMaterial {
  id: string;
  title: string;
  category: string;
  subject: string;
  level: string;
  content: string;
}
