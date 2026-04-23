import { createApp } from './app';
import { seedDatabase, getDefaultCsvPath } from './utils/csvLoader';

const PORT = process.env['PORT'] ?? 3000;

async function bootstrap() {
  await seedDatabase(getDefaultCsvPath());

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

bootstrap();
