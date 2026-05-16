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

  app.post('/api/generate', async (req, res) => {
    try {
      const { prompt, history, apiKey } = req.body;
      
      const activeKey = apiKey || process.env.GEMINI_API_KEY;
      if (!activeKey) {
        return res.status(401).json({ error: 'API key is missing. Please provide one.' });
      }

      const ai = new GoogleGenAI({ apiKey: activeKey });
      
      const systemInstruction = `You are an expert web developer. 
Your task is to respond with a SINGLE valid HTML document containing all necessary CSS (via Tailwind CDN) and JavaScript. 
Do not include any markdown formatting like \`\`\`html or \`\`\`. 
Output strictly the raw HTML.
The user prompt is a request to build or modify a web app.
Ensure the layout is responsive and looks polished. 
Include <script src="https://unpkg.com/@tailwindcss/browser@4"></script> in the head for Tailwind CSS.
Include React and ReactDOM from CDN if asked, or just use vanilla JS for simplicity. Default to Vanilla JS to minimize setup unless specified otherwise.`;

      const contents = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: prompt }] });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      let rawText = response.text || '';
      if (rawText.startsWith('\`\`\`html')) {
        rawText = rawText.replace(/\`\`\`html/g, '').replace(/\`\`\`/g, '');
      } else {
        rawText = rawText.replace(/\`\`\`/g, '');
      }

      res.json({ code: rawText.trim() });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

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
