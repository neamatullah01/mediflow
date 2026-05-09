import app from './app';
import * as Sentry from '@sentry/node';
import http from 'http';
import { Server } from 'socket.io';
import { env } from './config';
import { scheduleInventoryJobs } from './jobs/inventoryAlerts.job';
import logger from './utils/logger';

if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV });
}

const PORT = env.PORT;
const server = http.createServer(app);

// Initialize Socket.io server
export const io = new Server(server, {
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
});

// Socket.io connection listener
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join-pharmacy', (pharmacyId: string) => {
    if (pharmacyId) {
      socket.join(pharmacyId);
      logger.info(`Socket ${socket.id} joined pharmacy room: ${pharmacyId}`);
    }
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

async function bootstrap() {
  try {
    // Schedule inventory alert jobs (non-fatal if Redis is unavailable)
    await scheduleInventoryJobs().catch((err) =>
      logger.warn('Inventory job scheduling skipped:', err.message)
    );

    server.listen(PORT, () => {
      logger.info(`🚀 MediFlow Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();