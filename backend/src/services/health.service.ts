import { pool } from "../config/database";

export interface HealthResponse {
  success: boolean;
  message: string;
}

export interface DatabaseHealthResponse {
  success: boolean;
  database?: string;
  message: string;
}

export const getHealthStatus = (): HealthResponse => {
  return {
    success: true,
    message: "DevForge AI API is running",
  };
};

export const getDatabaseHealthStatus =
  async (): Promise<DatabaseHealthResponse> => {
    const result = await pool.query<{
      database: string;
    }>("SELECT current_database() AS database");

    return {
      success: true,
      database: result.rows[0].database,
      message: "Database connection is healthy",
    };
  };
