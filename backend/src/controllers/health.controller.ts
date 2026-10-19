import type { Request, Response } from "express";

import {
  getDatabaseHealthStatus,
  getHealthStatus,
} from "../services/health.service";

export const getHealth = (_req: Request, res: Response): void => {
  const healthStatus = getHealthStatus();

  res.status(200).json(healthStatus);
};

export const getDatabaseHealth = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const databaseStatus = await getDatabaseHealthStatus();

    res.status(200).json(databaseStatus);
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      success: false,
      message: "Database connection is unavailable",
    });
  }
};