import dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export async function connectDb() {
  const client = await getPool().connect();
  try {
    const { rows } = await client.query('select 1 as ok');
    console.log('DB connection ok:', rows[0].ok === 1);
  } finally {
    client.release();
  }
}
