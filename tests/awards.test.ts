import request from 'supertest';
import path from 'node:path';
import { createApp } from '../src/app';
import { resetDb } from '../src/db/database';
import { seedDatabase } from '../src/utils/csvLoader';
import type { AwardsIntervalResponse, ProducerInterval } from '../src/models/types';

const CSV_PATH = path.resolve(__dirname, '..', 'data', 'Movielist.csv');
const app = createApp();
const get = () => request(app).get('/api/producers/awards-interval');

describe('GET /api/producers/awards-interval', () => {
  beforeAll(async () => {
    await resetDb();
    await seedDatabase(CSV_PATH);
  });

  it('retorna status 200', async () => {
    const res = await get();
    expect(res.status).toBe(200);
  });

  it('retorna objeto com arrays "min" e "max"', async () => {
    const { body }: { body: AwardsIntervalResponse } = await get();
    expect(Array.isArray(body.min)).toBe(true);
    expect(Array.isArray(body.max)).toBe(true);
  });

  it('cada item possui os campos e tipos corretos', async () => {
    const { body }: { body: AwardsIntervalResponse } = await get();

    const validate = (item: ProducerInterval) => {
      expect(typeof item.producer).toBe('string');
      expect(typeof item.interval).toBe('number');
      expect(typeof item.previousWin).toBe('number');
      expect(typeof item.followingWin).toBe('number');
    };

    [...body.min, ...body.max].forEach(validate);
  });

  it('previousWin + interval === followingWin em todos os itens', async () => {
    const { body }: { body: AwardsIntervalResponse } = await get();
    [...body.min, ...body.max].forEach(item => {
      expect(item.previousWin + item.interval).toBe(item.followingWin);
    });
  });

  it('intervalo mínimo é menor ou igual ao máximo', async () => {
    const { body }: { body: AwardsIntervalResponse } = await get();
    if (body.min.length && body.max.length)
      expect(body.min[0].interval).toBeLessThanOrEqual(body.max[0].interval);
  });

  it('Joel Silver aparece no min com intervalo 1 (1990 → 1991)', async () => {
    const { body }: { body: AwardsIntervalResponse } = await get();
    const entry = body.min.find(i => i.producer === 'Joel Silver');
    expect(entry).toBeDefined();
    expect(entry?.interval).toBe(1);
    expect(entry?.previousWin).toBe(1990);
    expect(entry?.followingWin).toBe(1991);
  });

  it('Matthew Vaughn aparece no max com intervalo 13 (2002 → 2015)', async () => {
    const { body }: { body: AwardsIntervalResponse } = await get();
    const entry = body.max.find(i => i.producer === 'Matthew Vaughn');
    expect(entry).toBeDefined();
    expect(entry?.interval).toBe(13);
    expect(entry?.previousWin).toBe(2002);
    expect(entry?.followingWin).toBe(2015);
  });

  it('retorna listas vazias quando não há vencedores', async () => {
    await resetDb();
    const { body }: { body: AwardsIntervalResponse } = await get();
    expect(body.min).toHaveLength(0);
    expect(body.max).toHaveLength(0);
  });
});
