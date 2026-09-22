import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Gemini Multi-turn Chat Proxy API
  app.post('/api/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is missing in environment variables.'
        });
      }

      const { messages, systemInstruction, model } = req.body;

      const ai = new GoogleGenAI({ apiKey });

      // Use gemini-3.8-flash by default for fast multi-turn customer assist
      const selectedModel = model || 'gemini-3.8-flash';

      const formattedContents = (messages || []).map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: formattedContents,
        config: systemInstruction ? { systemInstruction } : undefined
      });

      res.json({ text: response.text || "I'm here to help you find and book local services on AppointmentHub!" });
    } catch (error: any) {
      console.error('Gemini Chat API Error:', error);
      res.status(500).json({
        error: error.message || 'Failed to process AI chat request.'
      });
    }
  });

  // Vite middleware for development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
