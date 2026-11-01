import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateSmartMagicianReply } from './src/utils/magicianBrain';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY || '';

// Initialize GoogleGenAI server-side with telemetry User-Agent
let aiClient: GoogleGenAI | null = null;
if (API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Gemini API client initialization failed, falling back to local assistant:', err);
  }
}

// Magician Chat API
app.post('/api/magician/chat', async (req: Request, res: Response) => {
  try {
    const { message, currentNumber, selectedKeys, mode } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Try Gemini API if key is available
    if (aiClient) {
      try {
        const systemInstruction = `Сен — «Сиқырлы кесте» (Магиялық математикалық фокус) білім беру веб-қосымшасының мейірімді, шабыттандырушы және білімді Виртуалды Сиқыршысысың (Virtual Magician).
Барлық жауаптарыңды МІНДЕТТІ ТҮРДЕ тек қазақ тілінде жаз.
Фокустың мәні: 1 мен 31 аралығындағы сандар 5 бағанға бөлінген, әр баған 2-нің дәрежелеріне сәйкес (16, 8, 4, 2, 1). Бұл екілік санау жүйесі (binary system).
Қазіргі жағдай:
${currentNumber ? `- Пайдаланушы ойлаған сан: ${currentNumber}` : '- Пайдаланушы сұрақ қойып отыр.'}
${selectedKeys && selectedKeys.length > 0 ? `- Таңдалған баған кілттері: ${selectedKeys.join(', ')} (қосындысы: ${currentNumber})` : ''}

Жауаптарың қысқа, көрнекі, түсінікті және достық сиқыршы стилінде (эмодзилер қолдану арқылы) болсын. Екілік жүйені, математиканы балалар мен жасөспірімдерге тартымды етіп түсіндір.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction,
          },
        });

        const reply = response.text || generateSmartMagicianReply(message, currentNumber, selectedKeys, mode);
        res.json({ reply, source: 'gemini' });
        return;
      } catch (geminiError) {
        console.warn('Gemini API call fallback triggered:', geminiError);
      }
    }

    // Fallback smart response
    const localReply = generateSmartMagicianReply(message, currentNumber, selectedKeys, mode);
    res.json({ reply: localReply, source: 'local' });
  } catch (error) {
    console.error('Error handling chat:', error);
    res.status(500).json({ error: 'Серверде қате орын алды' });
  }
});

// Configure Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`✨ «Сиқырлы кесте» сервері дайын: http://localhost:${PORT}`);
  });
}

startServer();
