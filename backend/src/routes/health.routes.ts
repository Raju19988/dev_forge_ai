import { Router } from "express";

import {
  getDatabaseHealth,
  getHealth,
} from "../controllers/health.controller";

const router = Router();

router.get("/health", getHealth);
router.get("/health/database", getDatabaseHealth);

export default router;