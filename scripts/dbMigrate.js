import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool } from '../src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const pool = getPool();
  const client = await pool.connect();
  try {
    const sqlDir = path.resolve(__dirname, '../sql');
    const files = readdirSync(sqlDir)
      .filter((f) => f.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b));

    console.log('Running migrations:', files);

    await client.query('BEGIN');
    for (const f of files) {
      const sql = readFileSync(path.join(sqlDir, f), 'utf-8');
      console.log(`Applying ${f}...`);
      await client.query(sql);
    }
    await client.query('COMMIT');
    console.log('Migrations complete.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
