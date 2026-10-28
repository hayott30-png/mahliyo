import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  isRateLimited,
  recordFailedAttempt,
  resetFailedAttempts,
  verifySecretCode,
  createMahliyoSession,
  validateMahliyoSession,
  clearMahliyoSession,
} from './lib/auth/mahliyo-session.ts';
import { generateMahliyoResponse } from './lib/ai/mahliyo-tutor.ts';
import { assessSpeakingSubmission } from './lib/ai/speaking-service.ts';
import { assessWritingSubmission } from './lib/ai/writing-service.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '5mb' }));
  app.use(cookieParser());

  // -------------------------------------------------------------
  // API Routes
  // -------------------------------------------------------------

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'turkai-mahliyo-backend',
      timestamp: new Date().toISOString(),
    });
  });

  // 1. Mahliyo Secret-Code Verification
  app.post('/api/mahliyo/access', (req: Request, res: Response) => {
    try {
      const { code } = req.body;
      if (!code || typeof code !== 'string') {
        recordFailedAttempt(req);
        return res.status(400).json({
          success: false,
          error: "Iltimos, maxfiy kirish kodini kiriting.",
        });
      }

      const isValid = verifySecretCode(code);
      if (isValid) {
        // Successful verification clears any previous failed attempts
        resetFailedAttempts(req);
        const token = createMahliyoSession(res);

        return res.json({
          success: true,
          token,
          message: "Xush kelibsiz! Mahliyo AI suhbatga tayyor.",
        });
      }

      if (isRateLimited(req)) {
        return res.status(429).json({
          success: false,
          error: "Juda ko'p noto'g'ri urinish. Iltimos 15 daqiqadan so'ng qayta urinib ko'ring.",
        });
      }

      recordFailedAttempt(req);
      return res.status(401).json({
        success: false,
        error: "Maxfiy kod noto'g'ri. Iltimos tekshirib qayta kiriting.",
      });
    } catch (err) {
      console.error('Mahliyo access error:', err);
      return res.status(500).json({
        success: false,
        error: "Tizimda xatolik yuz berdi. Qayta urinib ko'ring.",
      });
    }
  });

  // 2. Mahliyo Session Check
  app.get('/api/mahliyo/session', (req: Request, res: Response) => {
    const isValid = validateMahliyoSession(req);
    return res.json({ authenticated: isValid });
  });

  // 3. Mahliyo Logout
  app.post('/api/mahliyo/logout', (req: Request, res: Response) => {
    clearMahliyoSession(req, res);
    return res.json({ success: true, message: "Sessiya muvaffaqiyatli yakunlandi." });
  });

  // 4. Mahliyo Chat (Protected Route)
  app.post('/api/mahliyo/chat', async (req: Request, res: Response) => {
    try {
      const isAuthenticated = validateMahliyoSession(req);
      if (!isAuthenticated) {
        return res.status(401).json({
          error: "Mahliyo AI bilan muloqot qilish uchun maxfiy kod orqali ruxsat olish talab etiladi.",
          requiresAuth: true,
        });
      }

      const { message, cefrLevel, scenario, history, recentMistakes } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Xabar matni kiritilmagan." });
      }

      const response = await generateMahliyoResponse({
        message,
        cefrLevel: cefrLevel || 'A1',
        scenario: scenario || 'general',
        history: Array.isArray(history) ? history : [],
        recentMistakes: Array.isArray(recentMistakes) ? recentMistakes : [],
      });

      return res.json(response);
    } catch (err) {
      console.error('Mahliyo chat endpoint error:', err);
      return res.status(500).json({
        error: "Mahliyo javob berishda uzilish yuz berdi. Qayta urinib ko'ring.",
      });
    }
  });

  // 5. Speaking Laboratory Assessment
  app.post('/api/speaking/assess', async (req: Request, res: Response) => {
    try {
      const { promptTr, transcriptText, cefrLevel, topicTitle } = req.body;

      if (!promptTr || !transcriptText) {
        return res.status(400).json({
          error: "Maqsadli matn va o'quvchi transkripsiyasi talab qilinadi.",
        });
      }

      const result = await assessSpeakingSubmission({
        promptTr,
        transcriptText,
        cefrLevel: cefrLevel || 'A1',
        topicTitle: topicTitle || 'Nutq Mashqi',
      });

      return res.json(result);
    } catch (err) {
      console.error('Speaking assess endpoint error:', err);
      return res.status(500).json({
        error: "Nutqni baholashda xatolik yuz berdi.",
      });
    }
  });

  // 6. Writing Assessment
  app.post('/api/writing/assess', async (req: Request, res: Response) => {
    try {
      const { topicTitle, submittedText, cefrLevel } = req.body;

      if (!submittedText || typeof submittedText !== 'string' || submittedText.trim().length === 0) {
        return res.status(400).json({
          error: "Insho matnini kiriting.",
        });
      }

      const result = await assessWritingSubmission({
        topicTitle: topicTitle || 'Erkin Mavzu',
        submittedText,
        cefrLevel: cefrLevel || 'A1',
      });

      return res.json(result);
    } catch (err) {
      console.error('Writing assess endpoint error:', err);
      return res.status(500).json({
        error: "Yozma ishni baholashda xatolik yuz berdi.",
      });
    }
  });

  // -------------------------------------------------------------
  // Vite Integration (Dev) vs Static Files (Prod)
  // -------------------------------------------------------------
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: 'Ichki server xatoligi' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TÜRKAI Server] Listening on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start TÜRKAI server:', err);
  process.exit(1);
});
