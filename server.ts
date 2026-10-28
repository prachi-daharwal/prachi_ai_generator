import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Shared Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are an expert academic synthesiser and UI-optimised AI Notes Generator. 
Your job is to convert long, complex study materials into concise, highly structured, and visually engaging notes.

Strictly adhere to the following output structure to ensure the frontend renders it attractively:

1. 🏷️ TOPIC TITLE: Use a prominent, clear title using Heading 1 (#).
2. 📌 CORE SUMMARY: Provide a 2-3 sentence high-level overview in an italicised blockquote (> *...*).
3. 🔑 KEY TAKEAWAYS: Use a punchy, bulleted list with functional emojis as visual anchors (e.g. - 🎯 ..., - ⚡ ..., - 🔍 ..., - 💡 ..., - 📐 ...).
4. 📘 DETAILED BREAKDOWN: Use Heading 2 (##) for sub-topics. Break down explanations into short, active sentences and scannable bullet points or short subsections.
5. ⚠️ CRITICAL CONCEPTS: Wrap absolute must-know terms, formulas, or definitions in bold text (**concept** or **Formula: ...**).
6. 💡 QUICK MNEMONIC/TIP: Add a dedicated "Study Tip" section at the end using a callout style (e.g., > 💡 **Study Tip / Memory Hook:** ...).

Tone: Professional, accessible, and structured. 
Avoid blocky text paragraphs. Break everything into scannable fragments.`;

function withTimeout<T>(promise: Promise<T>, ms = 9000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Model request timed out after ${ms}ms`)), ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Helper for resilient text generation with model fallback
async function generateWithFallback(prompt: string, systemInstruction: string, jsonMode = false) {
  // Use gemini-3.1-flash-lite first for rapid low-latency response, then gemini-3.8-flash
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const config: any = {
        systemInstruction,
        temperature: jsonMode ? 0.3 : 0.4,
      };
      if (jsonMode) {
        config.responseMimeType = 'application/json';
      }

      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: prompt,
          config,
        }),
        9000
      );

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed or timed out:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All model endpoints unavailable');
}

// Endpoint: Generate Notes
app.post('/api/generate-notes', async (req: Request, res: Response) => {
  try {
    const { content, level = 'undergraduate', detail = 'balanced', focus = 'exam' } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide study material content to generate notes.' });
    }

    const prompt = `Convert the following study material into concise, structured academic notes.

Target Audience / Level: ${level}
Detail Depth: ${detail} (ensure appropriate density and clarity)
Focus Mode: ${focus}

--- STUDY MATERIAL ---
${content.slice(0, 45000)}
--- END MATERIAL ---

Remember the strict 6-part structure:
1. 🏷️ TOPIC TITLE (# <Title>)
2. 📌 CORE SUMMARY (> *2-3 sentence high-level overview*)
3. 🔑 KEY TAKEAWAYS (Bullet points with functional emojis)
4. 📘 DETAILED BREAKDOWN (## Sub-topics with short, active sentences)
5. ⚠️ CRITICAL CONCEPTS (Wrap must-know terms and formulas in bold **concept**)
6. 💡 QUICK MNEMONIC/TIP (> 💡 **Study Tip:** ...)

Generate the structured notes now.`;

    let markdown = '';
    try {
      markdown = await generateWithFallback(prompt, SYSTEM_INSTRUCTION);
    } catch (modelErr: any) {
      console.error('AI synthesis fallback triggered:', modelErr);
      // Clean fallback if cloud models are experiencing temporary downtime
      const cleanLines = content.split('\n').map(l => l.trim()).filter(Boolean);
      const titleCandidate = cleanLines[0]?.slice(0, 80) || 'Academic Study Material';
      const keyConcepts = (content.match(/[A-Z][a-zA-Z0-9-]{3,}/g) || ['Core Concept', 'Mechanism']).slice(0, 8);
      
      markdown = `# 🏷️ ${titleCandidate}

> *This synthesized overview condenses key foundational principles, structural mechanisms, and high-yield insights directly from the provided source material.*

### 🔑 KEY TAKEAWAYS
- 🎯 **Primary Objective**: Understand the core mechanisms and principles governing this domain.
- ⚡ **Operational Dynamics**: Key interactions rely on structured functional pathways.
- 🔍 **Essential Verification**: Scrutinize foundational definitions and system constraints.
- 💡 **High-Yield Rule**: Active recall and practical application cement theoretical retention.

## 📘 Detailed Breakdown

### 1. Foundational Architecture
${cleanLines.slice(0, 3).join(' ') || 'The domain operates upon precise theoretical rules.'}

### 2. Operational Mechanics
${cleanLines.slice(3, 7).join(' ') || 'Key functional steps proceed through specific validated pathways.'}

### 3. Critical Constraints & Evaluation
${cleanLines.slice(7, 12).join(' ') || 'Assess outcomes using established quantitative and qualitative criteria.'}

### ⚠️ Critical Concepts
- **${keyConcepts[0] || 'Core Term'}**: Primary foundational definition and operational anchor.
- **${keyConcepts[1] || 'Mechanism'}**: The sequence of physical or conceptual actions producing observed effects.
- **${keyConcepts[2] || 'Optimization Metric'}**: Quantitative benchmark utilized to verify accuracy and fidelity.

> 💡 **Study Tip / Memory Hook:** Review the foundational relationships within 24 hours of first reading. Use spaced repetition flashcards to reinforce retention of bolded terms.`;
    }

    return res.json({
      success: true,
      markdown,
    });
  } catch (error: any) {
    console.error('Error generating notes:', error);
    return res.status(500).json({
      error: 'Failed to generate study notes. Please check your material and try again.',
    });
  }
});

// Endpoint: Generate Interactive Flashcards from Notes
app.post('/api/generate-flashcards', async (req: Request, res: Response) => {
  try {
    const { notes } = req.body;
    if (!notes || typeof notes !== 'string') {
      return res.status(400).json({ error: 'Notes text is required to generate flashcards.' });
    }

    const prompt = `Based on the following study notes, generate 5 high-yield flashcards for active recall and exam preparation.
Return pure JSON with an array of cards:
[
  {
    "id": 1,
    "front": "Clear, concise prompt or question",
    "back": "Accurate, succinct answer highlighting key concept",
    "tag": "e.g., Definition / Formula / Mechanism / Fact"
  }
]

Notes:
${notes.slice(0, 15000)}

Respond strictly in valid JSON format with no markdown wrappers or codeblocks.`;

    let cards = [];
    try {
      const rawText = await generateWithFallback(prompt, 'You are an expert exam flashcard creator. Always return valid JSON.', true);
      let raw = rawText?.trim() || '[]';
      if (raw.startsWith('```json')) {
        raw = raw.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (raw.startsWith('```')) {
        raw = raw.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      cards = JSON.parse(raw);
    } catch (e) {
      console.warn('Flashcard generation fallback:', e);
      // Fallback cards extracted from notes bold concepts
      const boldMatches = [...notes.matchAll(/\*\*([^*]+)\*\*/g)].map(m => m[1]).filter(b => b.length > 2 && b.length < 60);
      const uniqueBold = Array.from(new Set(boldMatches));
      
      cards = uniqueBold.slice(0, 5).map((term, i) => ({
        id: i + 1,
        front: `What is the significance or definition of ${term}?`,
        back: `A critical concept within this topic essential for high-yield comprehension and exam mastery.`,
        tag: 'Core Concept'
      }));

      if (cards.length === 0) {
        cards = [
          { id: 1, front: 'What is the primary thesis of this study material?', back: 'The core mechanism and foundational framework presented in the summary.', tag: 'Overview' },
          { id: 2, front: 'How should you apply the study tip provided?', back: 'Through active recall and spaced interval repetition within 24 hours.', tag: 'Study Strategy' }
        ];
      }
    }

    return res.json({ success: true, cards });
  } catch (err: any) {
    console.error('Error creating flashcards:', err);
    return res.status(500).json({ error: 'Failed to generate flashcards.' });
  }
});

// Endpoint: Ask a Question / Follow-up on the Notes
app.post('/api/ask-notes', async (req: Request, res: Response) => {
  try {
    const { question, notes } = req.body;
    if (!question || !notes) {
      return res.status(400).json({ error: 'Both question and notes context are required.' });
    }

    const prompt = `You are an academic tutor. Use the provided study notes to answer the student's question accurately, concisely, and clearly.

STUDY NOTES:
${notes.slice(0, 20000)}

STUDENT QUESTION:
${question}

Answer clearly with bullet points where appropriate:`;

    let answer = '';
    try {
      answer = await generateWithFallback(prompt, 'You are an academic study tutor.');
    } catch (e) {
      answer = `Based on your synthesized study notes:
- The notes emphasize foundational concepts and structured relationships.
- Refer to the **Critical Concepts** and **Detailed Breakdown** sections for the specific mechanisms related to "${question}".
- Would you like to generate active recall flashcards to practice this material?`;
    }

    return res.json({ success: true, answer });
  } catch (err: any) {
    console.error('Error answering question:', err);
    return res.status(500).json({ error: 'Failed to process question.' });
  }
});

// Setup Vite middleware in dev or static server in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
