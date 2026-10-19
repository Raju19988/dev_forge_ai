import "dotenv/config";

import app from "./app";
import { checkDatabaseConnection, pool } from "./config/database";

const PORT = Number(process.env.PORT) || 5001;

async function startServer(): Promise<void> {
  try {
    const databaseName = await checkDatabaseConnection();

    console.log(`PostgreSQL connected to database: ${databaseName}`);

    const server = app.listen(PORT, () => {
      console.log(`DevForge AI API running on http://localhost:${PORT}`);
    });

    const shutdown = (signal: string): void => {
      console.log(`${signal} received. Shutting down gracefully...`);

      server.close(() => {
        void pool.end().then(() => {
          console.log("PostgreSQL connection pool closed.");
          process.exit(0);
        });
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start DevForge AI API:", error);
    await pool.end();
    process.exit(1);
  }
}

void startServer();