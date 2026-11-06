import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL?.trim();

if (!connectionString) {
throw new Error(
"DATABASE_URL environment variable is not configured."
);
}

const isSupabase = connectionString.includes("supabase.com");

export const pool = new Pool({
connectionString,
max: 10,
idleTimeoutMillis: 30000,
connectionTimeoutMillis: 5000,
ssl: isSupabase
? { rejectUnauthorized: false }
: false,
});

pool.on("error", (error: Error) => {
console.error(
"Unexpected PostgreSQL connection pool error:",
error.message
);
});

export async function checkDatabaseConnection(): Promise<string> {
const result = await pool.query<{
database: string;
}>("SELECT current_database() AS database");

return result.rows[0].database;
}