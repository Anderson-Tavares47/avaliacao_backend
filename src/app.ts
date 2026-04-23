import express from 'express';
import producersRouter from './routes/producers';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/api/producers', producersRouter);

  return app;
}
