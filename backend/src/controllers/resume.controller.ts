import type { Response } from "express";
import fs from "node:fs/promises";

import type { AuthenticatedRequest } from "../middleware/auth.middleware";

import {
  saveUploadedResume,
  getUserResumes,
} from "../services/resume.service";

import {
  ResumePdfExtractionError,
} from "../services/pdfExtraction.service";

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
    // Verify the actual PDF signature instead of trusting MIME metadata.
    const handle = await fs.open(file.path, "r");

    let signature: Buffer;

    try {
      signature = Buffer.alloc(5);
      await handle.read(signature, 0, 5, 0);
    } finally {
      await handle.close();
    }

    if (signature.toString("ascii") !== "%PDF-") {
      await fs.unlink(file.path).catch(() => undefined);

      res.status(400).json({
        success: false,
        message: "The uploaded file does not have a valid PDF signature.",
        code: "INVALID_PDF",
      });
      return;
    }

    // Extract PDF text and save resume metadata.
    const resume = await saveUploadedResume(
      userId,
      file.path,
      file.originalname,
      file.size
    );

    // Never expose the private server-side storage path or extracted text.
    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully.",
      data: {
        resume: {
          id: resume.id,
          userId: resume.userId,
          originalFilename: resume.originalFilename,
          fileSize: resume.fileSize,
          analysisScore: resume.analysisScore,
          createdAt: resume.createdAt,
        },
      },
    });
  } catch (error) {
    // The service may already have deleted the file.
    await fs.unlink(file.path).catch((cleanupError: NodeJS.ErrnoException) => {
      if (cleanupError.code !== "ENOENT") {
        console.error(
          "Failed to clean up uploaded resume:",
          cleanupError.message
        );
      }
    });

    // Invalid or text-empty PDFs are client errors, not server errors.
    if (error instanceof ResumePdfExtractionError) {
      res.status(400).json({
        success: false,
        message: error.message,
        code: error.code,
      });
      return;
    }

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

    // Return metadata only, never private storage paths or extracted text.
    res.status(200).json({
      success: true,
      data: {
        resumes: resumes.map((resume) => ({
          id: resume.id,
          userId: resume.userId,
          originalFilename: resume.originalFilename,
          fileSize: resume.fileSize,
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