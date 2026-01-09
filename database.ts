import { Database } from "bun:sqlite";

const dbPath = "./db";

function initDatabase() {
  const db = new Database(dbPath);

  try {
    db.run(`CREATE TABLE IF NOT EXISTS scores
      (name TEXT UNIQUE PRIMARY KEY NOT NULL,
      score INTEGER NOT NULL)`);
    db.close();
  } catch (error) {
    console.log(error);
  } finally {
    if (db) db.close();
  }
}

initDatabase();

export const openDatabase = () => new Database(dbPath);

export function saveScore(name: string, score: number) {
  using db = openDatabase();

  const sql = `INSERT OR REPLACE INTO scores (name, score) VALUES ($name, $score)`;
  using query = db.query(sql);

  try {
    query.run({
      $name: name,
      $score: score,
    });
  } catch (error) {
    console.log(error);
  } finally {
    db.close();
  }
}

export function getScores(end: number = 50, start: number = 0) {
  using db = openDatabase();

  const count = end - start;

  const sql = `SELECT * FROM scores ORDER BY score DESC LIMIT $count OFFSET $start`;
  using query = db.query(sql);

  try {
    return query.all({
      $start: start,
      $count: count,
    });
  } catch (error) {
    console.log(error);
  } finally {
    db.close();
  }

  return [];
}
