import app from './app';
import http from 'http';
import { env } from './config';

const PORT = env.PORT;
const server = http.createServer(app);

async function bootstrap() {
  try {
    server.listen(PORT, () => {
      console.log(`🚀 MediFlow Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();