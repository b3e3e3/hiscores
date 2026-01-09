import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbPath = "../db";

async function initDatabase() {
  const db = await openDatabase();

  try {
    await db.exec(`CREATE TABLE IF NOT EXISTS scores
      (name TEXT UNIQUE PRIMARY KEY NOT NULL,
      score INTEGER NOT NULL)`);
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
  }
}

await initDatabase();

export async function openDatabase() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

export async function deleteAll() {
  const db = await openDatabase();
  await db.run(`DELETE FROM scores`);
  await db.close();
}

export async function saveScore(name: string, score: number) {
  const db = await openDatabase();
  const sql = `INSERT OR REPLACE INTO scores (name, score) VALUES ($name, $score)`;

  try {
    await db.run(sql, name, score);
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
  }
}

export async function getScores(end: number = 50, start: number = 0) {
  const db = await openDatabase();
  const sql = `SELECT * FROM scores ORDER BY score DESC LIMIT $count OFFSET $start`;

  const count = end - start;

  try {
    return db.all(sql, count, start);
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
  }

  return [];
}

export function bodyIsValid(body: any): boolean {
  return body.name && body.score;
}
