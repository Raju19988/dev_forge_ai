import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Please configure it in your backend .env file."
  );
}

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on("error", (error: Error) => {
  console.error("Unexpected PostgreSQL connection pool error:", error);
});

export async function checkDatabaseConnection(): Promise<string> {
  const result = await pool.query<{
    database: string;
  }>("SELECT current_database() AS database");

  return result.rows[0].database;
}