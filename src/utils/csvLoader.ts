import fs from 'node:fs';
import path from 'node:path';
import { getDb } from '../db/database';
import { Movie } from '../models/types';

function parseCsv(filePath: string): Movie[] {
  const [, ...rows] = fs.readFileSync(filePath, 'utf-8').split('\n').filter(l => l.trim());

  return rows.map(line => {
    const [year, title, studios, producers, winner] = line.split(';');
    return {
      year: Number(year.trim()),
      title: title.trim(),
      studios: studios.trim(),
      producers: producers.trim(),
      winner: winner?.trim().toLowerCase() === 'yes',
    };
  });
}

export async function seedDatabase(csvPath: string): Promise<void> {
  const db = await getDb();

  for (const movie of parseCsv(csvPath)) {
    db.run(
      'INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)',
      [movie.year, movie.title, movie.studios, movie.producers, movie.winner ? 1 : 0]
    );
  }
}

export const getDefaultCsvPath = () =>
  path.resolve(__dirname, '..', '..', 'data', 'Movielist.csv');
