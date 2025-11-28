import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const { Pool } = pg;

let pool;

const getDbConnection = () => {
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

export const getMedicineRecordsService = async ({
  id,
  code,
  company,
  limit,
  page,
}) => {
  const db = getDbConnection();

  let query = `SELECT * FROM public.medicines`;
  let params = [];

  try {
    if (id) {
      query += ` WHERE id = $1`;
      params.push(id);
    } else if (code) {
      query += ` WHERE code = $1`;
      params.push(code);
    } else if (company) {
      query += ` WHERE LOWER(company) LIKE LOWER($1)`;
      params.push(`%${company}%`);
    } else {
      limit = Number(limit);
      page = Number(page);
      const offset = (page - 1) * limit;

      query += ` ORDER BY launch_date DESC LIMIT $1 OFFSET $2`;
      params.push(limit, offset);
    }

    console.log("--> Executing query:", query, params);

    const result = await db.query(query, params);
    return result.rows;
  } catch (err) {
    console.error("❌ DB Query ERROR:", err);

    // Wrap DB errors and throw with friendly message
    const customError = new Error("Database query failed");
    customError.statusCode = 500;
    customError.details = err.message;
    throw customError;
  }
};
