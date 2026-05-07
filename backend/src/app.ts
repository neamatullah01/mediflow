import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import { env } from './config';
import router from './routes';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
import { globalRateLimiter } from './middlewares/rateLimiter';

const app: Application = express();

// Middlewares
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());

// Mount Better Auth handler BEFORE express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

// JSON body parser for custom API routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(globalRateLimiter);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'MediFlow API is running!' });
});

// API routes
app.use('/api/v1', router);

// Not found handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

export default app;