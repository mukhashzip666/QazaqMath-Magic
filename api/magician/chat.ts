import { GoogleGenAI } from '@google/genai';
import { generateSmartMagicianReply } from '../../src/utils/magicianBrain';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, currentNumber, selectedKeys, mode } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const aiClient = new GoogleGenAI({ apiKey });
        const systemInstruction = `Сен — «Сиқырлы кесте» (Магиялық математикалық фокус) білім беру веб-қосымшасының Виртуалды Сиқыршысысың. Барлық жауаптарыңды МІНДЕТТІ ТҮРДЕ тек қазақ тілінде жаз. Фокустың мәні: 1 мен 31 аралығындағы сандар 5 бағанға бөлінген (кілттері: 16, 8, 4, 2, 1 — екілік санау жүйесі).`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: message,
          config: { systemInstruction },
        });

        const reply = response.text || generateSmartMagicianReply(message, currentNumber, selectedKeys, mode);
        return res.status(200).json({ reply, source: 'gemini' });
      } catch {
        // Fallback to local smart Kazakh brain
      }
    }

    const localReply = generateSmartMagicianReply(message, currentNumber, selectedKeys, mode);
    return res.status(200).json({ reply: localReply, source: 'local' });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
}
