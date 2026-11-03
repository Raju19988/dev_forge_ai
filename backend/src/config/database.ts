import { Pool } from "pg";

// Clean any incoming environment variable or use the hardcoded string
let rawConnectionString = 
  process.env.DATABASE_URL || 
  "postgresql://postgres:RajuSupabaseBackend99@://supabase.com";

// Forcefully scrub out hidden spaces, newlines, or return characters that break URL parsing
const connectionString = rawConnectionString.replace(/[\r\n\s]+/g, "").trim();

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: connectionString.includes("supabase.com") || connectionString.includes("://supabase.com")
    ? { rejectUnauthorized: false }
    : false,
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
