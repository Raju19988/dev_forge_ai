import type { Response } from "express";
import fs from "node:fs/promises";

import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  saveUploadedResume,
  getUserResumes,
} from "../services/resume.service";

export async function uploadResumeController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const file = req.file;
  const userId = req.user?.id;

  if (!userId) {
    if (file) {
      await fs.unlink(file.path).catch(() => undefined);
    }

    res.status(401).json({
      success: false,
      message: "Authentication is required.",
    });
    return;
  }

  if (!file) {
    res.status(400).json({
      success: false,
      message: "Please select a PDF file to upload.",
    });
    return;
  }

  try {
    // Inspect the file signature instead of trusting client-supplied metadata.
    const handle = await fs.open(file.path, "r");

    let signature: Buffer;

    try {
      signature = Buffer.alloc(5);
      await handle.read(signature, 0, 5, 0);
    } finally {
      await handle.close();
    }

    if (signature.toString("ascii") !== "%PDF-") {
  // Delete invalid files so they do not remain in private storage.
  await fs.unlink(file.path).catch(() => undefined);

  res.status(400).json({
    success: false,
    message: "The uploaded file does not have a valid PDF signature.",
  });
  return;
}

    const resume = await saveUploadedResume(userId, file.path);

    // Do not expose the private server-side storage path.
    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully.",
      data: {
        resume: {
          id: resume.id,
          userId: resume.userId,
          analysisScore: resume.analysisScore,
          createdAt: resume.createdAt,
        },
      },
    });
  } catch (error) {
    // Safe even if the service has already removed the file.
    await fs.unlink(file.path).catch((cleanupError: NodeJS.ErrnoException) => {
      if (cleanupError.code !== "ENOENT") {
        console.error(
          "Failed to clean up uploaded resume:",
          cleanupError.message
        );
      }
    });

    console.error("Resume upload failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to upload the resume. Please try again.",
    });
  }
}

export async function listMyResumes(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Authentication is required.",
    });
    return;
  }

  try {
    const resumes = await getUserResumes(userId);

    // Return only metadata; stored files remain private.
    res.status(200).json({
      success: true,
      data: {
        resumes: resumes.map((resume) => ({
          id: resume.id,
          userId: resume.userId,
          analysisScore: resume.analysisScore,
          createdAt: resume.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to retrieve resumes:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve resumes.",
    });
  }
}
