import fs from "node:fs/promises";
import path from "node:path";

import {
  createResume,
  getResumesByUserId,
} from "../models/resume.model";

import type { Resume } from "../models/resume.model";

// Resolve storage relative to the backend project, not the terminal directory.
const RESUME_STORAGE_DIRECTORY = path.resolve(
  __dirname,
  "../../storage/resumes"
);

export async function saveUploadedResume(
  userId: string,
  filePath: string
): Promise<Resume> {
  const storedPath = path.relative(
    RESUME_STORAGE_DIRECTORY,
    filePath
  );

  // Only files directly inside the private resume directory are accepted.
  if (
    !storedPath ||
    storedPath.startsWith("..") ||
    path.isAbsolute(storedPath)
  ) {
    throw new Error("Invalid resume storage path.");
  }

  try {
    return await createResume(
      userId,
      path.join("storage", "resumes", storedPath)
    );
  } catch (error) {
    // Remove the stored file if the database insert fails.
    await fs.unlink(filePath).catch((cleanupError: NodeJS.ErrnoException) => {
      if (cleanupError.code !== "ENOENT") {
        console.error(
          "Failed to clean up uploaded resume:",
          cleanupError.message
        );
      }
    });

    throw error;
  }
}

export async function getUserResumes(
  userId: string
): Promise<Resume[]> {
  return getResumesByUserId(userId);
}
