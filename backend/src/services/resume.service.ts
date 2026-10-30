import fs from "node:fs/promises";
import path from "node:path";

import {
  createResume,
  getResumesByUserId,
} from "../models/resume.model";

import type { Resume } from "../models/resume.model";

import { extractResumeText } from "./pdfExtraction.service";

// Resolve storage relative to the backend project.
const RESUME_STORAGE_DIRECTORY = path.resolve(
  __dirname,
  "../../storage/resumes"
);

export async function saveUploadedResume(
  userId: string,
  filePath: string,
  originalFilename: string,
  fileSize: number
): Promise<Resume> {
  const storedPath = path.relative(
    RESUME_STORAGE_DIRECTORY,
    filePath
  );

  // Validate that the file belongs to private resume storage.
  if (
    !storedPath ||
    storedPath.startsWith("..") ||
    path.isAbsolute(storedPath)
  ) {
    throw new Error("Invalid resume storage path.");
  }

  try {
    // Extract readable text from the uploaded PDF.
    const extractedText = await extractResumeText(filePath);

    // Store resume metadata and extracted text in PostgreSQL.
    return await createResume(
      userId,
      path.join("storage", "resumes", storedPath),
      originalFilename,
      fileSize,
      extractedText
    );
  } catch (error) {
    // Remove the uploaded PDF if extraction or database storage fails.
    await fs.unlink(filePath).catch(
      (cleanupError: NodeJS.ErrnoException) => {
        if (cleanupError.code !== "ENOENT") {
          console.error(
            "Failed to clean up uploaded resume:",
            cleanupError.message
          );
        }
      }
    );

    throw error;
  }
}

export async function getUserResumes(
  userId: string
): Promise<Resume[]> {
  return getResumesByUserId(userId);
}