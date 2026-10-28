import { Router } from "express";

import { authenticateToken } from "../middleware/auth.middleware";
import { uploadResume } from "../middleware/resumeUpload.middleware";
import {
  uploadResumeController,
  listMyResumes,
} from "../controllers/resume.controller";

const router = Router();

// Every resume endpoint requires authentication.
router.post(
  "/upload",
  authenticateToken,
  uploadResume,
  uploadResumeController
);

router.get(
  "/",
  authenticateToken,
  listMyResumes
);

export default router;
