import type { Request, Response } from "express";
import { getHealthStatus } from "../services/health.service";

export const getHealth = (_req: Request, res: Response): void => {
  const healthStatus = getHealthStatus();

  res.status(200).json(healthStatus);
};