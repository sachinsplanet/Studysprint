import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API endpoint for multi-turn Gemini chat
  app.post('/api/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please check the Settings > Secrets panel.'
        });
      }

      const { message, history = [], model = 'gemini-3.5-flash', role = 'study_buddy' } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'A message string is required.' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      // Role-specific system instructions
      let systemInstruction = `You are "Pip" 🐾, the ultra-cute, supportive, and clever AI study buddy & stationery companion at StudySprint store.
Your goal is to help students conquer exams, keep their study motivation high, and curate the best stationery tools.
You speak in a warm, encouraging, kawaii yet intelligent voice with friendly emojis (✨, 📝, 🐾, 🌸, ⚡, ☕).
You know top study techniques: Pomodoro timer method, Active Recall, Feynman Technique, Spaced Repetition, and Mind Mapping.
When relevant, recommend items from StudySprint:
- 'The Ultimate Exam Crunch Kit' (complete survival package)
- 'Aesthetic Pastel Desk Set' (mildliner highlighters + quick-dry gel pens)
- 'Doodle Flashcard Bundle' (spaced repetition revision cards)
- 'Midnight Crammer Bento' (energy snacks + waterproof fineliners)
- 'Custom Kit Builder' (lets students pick pens, notebooks, sticky tabs, and clips)
Format replies cleanly using bolding and bullet points when listing ideas. Keep replies engaging, encouraging, and readable.`;

      if (role === 'exam_coach') {
        systemInstruction = `You are "Professor Pip" 🎓, a cute yet intensely organized academic strategy coach.
You specialize in breaking down difficult syllabus topics, structuring revision timetables, prioritizing high-yield exam chapters, and teaching memory retention hacks (mnemonics, spaced repetition schedules).
Keep your tone encouraging, structured, step-by-step, and cheerful!`;
      } else if (role === 'stationery_stylist') {
        systemInstruction = `You are "Pip the Stylist" 🌸, a stationery aesthetician and desk organization expert.
You love pastel palettes, color-coded study notes, bullet journal layouts, washi tape borders, aesthetic highlighter swatches, and clutter-free study spaces.
Suggest harmonious color themes, pen grip recommendations, and journal layouts.`;
      }

      // Model selection matching requested guidelines:
      // gemini-3.1-pro-preview for complex tasks
      // gemini-3.5-flash for general tasks
      // gemini-3.1-flash-lite for tasks that should happen fast
      let selectedModel = 'gemini-3.5-flash';
      if (model === 'gemini-3.1-pro-preview' || model === 'gemini-3.1-flash-lite' || model === 'gemini-3.5-flash') {
        selectedModel = model;
      }

      // Build structured contents for multi-turn conversation
      // SDK expects contents: Array<{ role: 'user' | 'model', parts: [{ text: string }] }>
      const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history) {
          if (item && item.text && (item.role === 'user' || item.role === 'model')) {
            formattedContents.push({
              role: item.role,
              parts: [{ text: String(item.text) }]
            });
          }
        }
      }

      // Add current user message
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "Pip is checking his notes! 🐾 Could you say that once more?";

      return res.json({
        reply: replyText,
        model: selectedModel,
        role
      });
    } catch (err: any) {
      console.error('Chat API Error:', err);
      const errorMessage = err?.message || 'Failed to generate response';
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'StudySprint Chat API', time: new Date().toISOString() });
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
