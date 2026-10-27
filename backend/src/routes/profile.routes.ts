import { Router } from "express";

import { authenticateToken } from "../middleware/auth.middleware";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profile.controller";

const router = Router();

// Both endpoints require a valid JWT.
router.get("/", authenticateToken, getMyProfile);
router.put("/", authenticateToken, updateMyProfile);

export default router;