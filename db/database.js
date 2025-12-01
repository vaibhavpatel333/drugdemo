import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const { Pool } = pg;

let pool;

export const getDbConnection = () => {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
};