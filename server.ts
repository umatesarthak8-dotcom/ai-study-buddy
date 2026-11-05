import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function cleanErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred while communicating with Gemini API.';
  const msg = err.message || String(err);
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error && parsed.error.message) {
      return parsed.error.message;
    }
  } catch {
    // not JSON
  }
  return msg;
}

// Resilient generator that tries gemini-3.8-flash first, then falls back to gemini-3.1-flash-lite on 503/high-demand
async function generateWithFallback(contents: any, config?: any) {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      console.warn(`[Gemini API] Model ${model} failed: ${err.message || err}. Trying next available model...`);
      lastError = err;
    }
  }
  throw lastError || new Error('All Gemini models failed to respond.');
}

function checkApiKey(res: Response): boolean {
  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is missing. Please ensure your API key is configured in the environment settings.',
    });
    return false;
  }
  return true;
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// 1. NOTES SUMMARY ENDPOINT
app.post('/api/summarize', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;
  const { notes } = req.body;
  if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
    res.status(400).json({ error: 'Please provide notes to summarize.' });
    return;
  }

  try {
    const prompt = `You are an elite Engineering Study Coach.
Analyze the following engineering lecture notes thoroughly.
Create:
1. A clear, easy-to-understand executive summary (3-4 structured paragraphs) breaking down complex ideas simply without losing technical rigor.
2. 4 to 6 core concepts highlighted with title, simple explanation, importance level (Critical, High, or Medium), and key takeaway.
3. Key formulas, equations, or engineering rules found or implied in the notes (with formula name, the equation/rule notation, and where/how to apply it).
4. 3 to 4 high-yield exam tips or common misconceptions to watch out for.

Notes:
${notes.slice(0, 15000)}`;

    const response = await generateWithFallback(prompt, {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Descriptive title for this topic/study set' },
          overview: { type: Type.STRING, description: 'Easy-to-understand comprehensive summary paragraphs' },
          keyConcepts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                explanation: { type: Type.STRING },
                importance: { type: Type.STRING, description: 'Critical, High, or Medium' },
                takeaway: { type: Type.STRING },
              },
              required: ['title', 'explanation', 'importance'],
            },
          },
          formulasAndRules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                formula: { type: Type.STRING },
                application: { type: Type.STRING },
              },
              required: ['name', 'formula', 'application'],
            },
          },
          examPitfalls: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['title', 'overview', 'keyConcepts', 'formulasAndRules', 'examPitfalls'],
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating summary:', error);
    res.status(500).json({
      error: cleanErrorMessage(error) || 'Failed to generate summary. Please check your notes and try again.',
    });
  }
});

// 2. IMPORTANT QUESTIONS ENDPOINT (Strictly 10 questions with short answers)
app.post('/api/questions', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;
  const { notes } = req.body;
  if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
    res.status(400).json({ error: 'Please provide notes to generate questions.' });
    return;
  }

  try {
    const prompt = `You are a university engineering professor preparing exam questions.
Generate EXACTLY 10 important exam questions from the provided engineering notes.
For each question:
- State a clear, realistic engineering question that tests deep conceptual understanding, derivations, or problem-solving.
- Provide a concise, well-structured short answer (2-4 clear sentences or bullet points that directly score full marks).
- List 2-3 key technical points or keywords examiners look for.
- Assign a difficulty level: "Fundamental", "Intermediate", or "Advanced".
- State the specific sub-topic or domain.

Notes:
${notes.slice(0, 15000)}`;

    const response = await generateWithFallback(prompt, {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topicTitle: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                keyPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                difficulty: { type: Type.STRING, description: 'Fundamental, Intermediate, or Advanced' },
                topic: { type: Type.STRING },
              },
              required: ['id', 'question', 'answer', 'keyPoints', 'difficulty', 'topic'],
            },
          },
        },
        required: ['questions'],
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      error: cleanErrorMessage(error) || 'Failed to generate 10 questions. Please try again.',
    });
  }
});

// 3. MCQ GENERATOR ENDPOINT (Strictly 5 multiple choice questions)
app.post('/api/mcqs', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;
  const { notes } = req.body;
  if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
    res.status(400).json({ error: 'Please provide notes to generate MCQs.' });
    return;
  }

  try {
    const prompt = `You are designing a competitive engineering quiz.
Generate EXACTLY 5 multiple-choice questions (MCQs) directly based on these engineering notes.
Rules:
- Each question must have EXACTLY 4 distinct options (indexed 0, 1, 2, 3).
- Provide plausible engineering distractors (no obvious joke answers).
- Indicate the 'correctIndex' as an integer 0, 1, 2, or 3.
- Provide a clear, educational explanation explaining why the correct option is true and briefly clarifying why other options are incorrect.
- Include the engineering topic/concept tested.

Notes:
${notes.slice(0, 15000)}`;

    const response = await generateWithFallback(prompt, {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          quizTitle: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Array of exactly 4 choices',
                },
                correctIndex: { type: Type.INTEGER, description: 'Zero-based index of the correct option (0-3)' },
                explanation: { type: Type.STRING },
                topic: { type: Type.STRING },
              },
              required: ['id', 'question', 'options', 'correctIndex', 'explanation'],
            },
          },
        },
        required: ['questions'],
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating MCQs:', error);
    res.status(500).json({
      error: cleanErrorMessage(error) || 'Failed to generate MCQs. Please try again.',
    });
  }
});

// 4. FLASHCARDS ENDPOINT (Interactive 3D Flip Flashcards)
app.post('/api/flashcards', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;
  const { notes } = req.body;
  if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
    res.status(400).json({ error: 'Please provide notes to generate flashcards.' });
    return;
  }

  try {
    const prompt = `You are an expert in active recall and spaced repetition for engineering students.
Generate 8 to 12 high-retention study flashcards from the provided lecture notes.
Rules:
- Front: A prompt, definition query, formula question, or engineering problem. Keep it focused and clear.
- Back: The crisp definition, equation, step-by-step logic, or answer.
- Category: e.g. "Definition", "Formula & Law", "Mechanism", "Application", "Comparison".
- Memory Hook / Hint: An intuitive mnemonic, analogy, or tip to remember the concept easily.

Notes:
${notes.slice(0, 15000)}`;

    const response = await generateWithFallback(prompt, {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          deckTitle: { type: Type.STRING },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                front: { type: Type.STRING },
                back: { type: Type.STRING },
                category: { type: Type.STRING },
                hint: { type: Type.STRING },
              },
              required: ['id', 'front', 'back', 'category'],
            },
          },
        },
        required: ['flashcards'],
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({
      error: cleanErrorMessage(error) || 'Failed to generate flashcards. Please try again.',
    });
  }
});

// 5. COMBINED STUDY PACK GENERATOR (Generates Summary + 10 Questions + 5 MCQs + Flashcards)
app.post('/api/generate-all', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;
  const { notes } = req.body;
  if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
    res.status(400).json({ error: 'Please provide notes.' });
    return;
  }

  try {
    // Run generations in parallel with fallback support
    const [summaryRes, questionsRes, mcqsRes, flashcardsRes] = await Promise.allSettled([
      generateWithFallback(`You are an elite Engineering Study Coach.
Analyze these engineering lecture notes.
Provide:
1. Descriptive title.
2. Easy-to-understand comprehensive summary (3-4 structured paragraphs) breaking down complex ideas simply.
3. 4 to 6 core concepts with title, simple explanation, importance (Critical, High, Medium), and key takeaway.
4. Key formulas, equations, or rules with name, formula notation, and application.
5. 3 to 4 high-yield exam pitfalls or tips.

Notes:
${notes.slice(0, 12000)}`, {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            overview: { type: Type.STRING },
            keyConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  takeaway: { type: Type.STRING },
                },
                required: ['title', 'explanation', 'importance'],
              },
            },
            formulasAndRules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  formula: { type: Type.STRING },
                  application: { type: Type.STRING },
                },
                required: ['name', 'formula', 'application'],
              },
            },
            examPitfalls: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['title', 'overview', 'keyConcepts', 'formulasAndRules', 'examPitfalls'],
        },
      }),
      generateWithFallback(`Generate EXACTLY 10 important university engineering exam questions with concise short answers from these notes.
Include keyPoints, difficulty ('Fundamental', 'Intermediate', 'Advanced'), and topic.

Notes:
${notes.slice(0, 12000)}`, {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  keyPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  difficulty: { type: Type.STRING },
                  topic: { type: Type.STRING },
                },
                required: ['id', 'question', 'answer', 'keyPoints', 'difficulty', 'topic'],
              },
            },
          },
          required: ['questions'],
        },
      }),
      generateWithFallback(`Generate EXACTLY 5 multiple-choice questions with 4 options each, correctIndex (0-3), and detailed explanation from these notes.

Notes:
${notes.slice(0, 12000)}`, {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  topic: { type: Type.STRING },
                },
                required: ['id', 'question', 'options', 'correctIndex', 'explanation'],
              },
            },
          },
          required: ['questions'],
        },
      }),
      generateWithFallback(`Generate 8 to 10 high-retention active recall study flashcards from these notes with front, back, category, and hint.

Notes:
${notes.slice(0, 12000)}`, {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  category: { type: Type.STRING },
                  hint: { type: Type.STRING },
                },
                required: ['id', 'front', 'back', 'category'],
              },
            },
          },
          required: ['flashcards'],
        },
      }),
    ]);

    const summaryData = summaryRes.status === 'fulfilled' ? JSON.parse(summaryRes.value.text || '{}') : null;
    const questionsData = questionsRes.status === 'fulfilled' ? JSON.parse(questionsRes.value.text || '{}') : null;
    const mcqsData = mcqsRes.status === 'fulfilled' ? JSON.parse(mcqsRes.value.text || '{}') : null;
    const flashcardsData = flashcardsRes.status === 'fulfilled' ? JSON.parse(flashcardsRes.value.text || '{}') : null;

    res.json({
      summary: summaryData,
      questions: questionsData?.questions || [],
      mcqs: mcqsData?.questions || [],
      flashcards: flashcardsData?.flashcards || [],
    });
  } catch (error: any) {
    console.error('Error in generate-all:', error);
    res.status(500).json({
      error: cleanErrorMessage(error) || 'Failed to generate study kit. Please try again.',
    });
  }
});

// 6. QUICK AI EXPLAIN / ASK TUTOR ENDPOINT (Students can ask clarification on their notes)
app.post('/api/tutor-explain', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;
  const { notes, question } = req.body;
  if (!question) {
    res.status(400).json({ error: 'Please provide a question.' });
    return;
  }

  try {
    const response = await generateWithFallback(`You are an engineering tutor.
Student's study notes:
${(notes || '').slice(0, 8000)}

Student asks: "${question}"

Provide a direct, crystal-clear explanation using intuitive physical analogies, step-by-step logic, and bullet points where helpful. Keep it concise yet thorough.`);

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Error in tutor explain:', error);
    res.status(500).json({ error: cleanErrorMessage(error) || 'Failed to explain concept.' });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const PORT = 3000;

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Study Buddy] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
