import { Router, Request, Response } from 'express';
import { getAwardsInterval } from '../services/awardsService';

const router = Router();

router.get('/awards-interval', async (_req: Request, res: Response) => {
  try {
    const result = await getAwardsInterval();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno ao calcular intervalos de prêmios.' });
  }
});

export default router;
