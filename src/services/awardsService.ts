import { getDb } from '../db/database';
import { AwardsIntervalResponse, ProducerInterval } from '../models/types';

export async function getAwardsInterval(): Promise<AwardsIntervalResponse> {
  const db = await getDb();

  const result = db.exec(
    `SELECT producers, year FROM movies WHERE winner = 1 ORDER BY year ASC`
  );

  if (!result.length || !result[0].values.length) {
    return { min: [], max: [] };
  }

  const rows = result[0].values as Array<[string, number]>;

  const winsByProducer = new Map<string, number[]>();
  for (const [producers, year] of rows) {
    for (const name of splitProducers(producers)) {
      if (!winsByProducer.has(name)) winsByProducer.set(name, []);
      winsByProducer.get(name)!.push(year);
    }
  }

  let minInterval = Infinity;
  let maxInterval = -Infinity;
  let minItems: ProducerInterval[] = [];
  let maxItems: ProducerInterval[] = [];

  winsByProducer.forEach((years, producer) => {
    if (years.length < 2) return;
    for (let i = 1; i < years.length; i++) {
      const interval = years[i] - years[i - 1];
      const entry: ProducerInterval = {
        producer,
        interval,
        previousWin: years[i - 1],
        followingWin: years[i],
      };

      if (interval < minInterval) { minInterval = interval; minItems = [entry]; }
      else if (interval === minInterval) { minItems.push(entry); }

      if (interval > maxInterval) { maxInterval = interval; maxItems = [entry]; }
      else if (interval === maxInterval) { maxItems.push(entry); }
    }
  });

  return { min: minItems, max: maxItems };
}

function splitProducers(raw: string): string[] {
  return raw
    .split(/,\s*and\s+|\s+and\s+|,\s*/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}
