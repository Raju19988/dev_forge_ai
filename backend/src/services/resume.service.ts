import path from "node:path";

import {
  createResume,
  getResumesByUserId,
  getResumeByIdAndUserId,
  updateResumeAnalysisScore,
} from "../models/resume.model";

import type { Resume } from "../models/resume.model";

import { extractResumeText } from "./pdfExtraction.service";
import { analyzeResume } from "./resumeAnalysis.service";

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

  if (
    !storedPath ||
    storedPath.startsWith("..") ||
    path.isAbsolute(storedPath)
  ) {
    throw new Error("Invalid resume storage path.");
  }

  const extractedText = await extractResumeText(filePath);

  return createResume(
    userId,
    path.join("storage", "resumes", storedPath),
    originalFilename,
    fileSize,
    extractedText
  );
}

export async function getUserResumes(
  userId: string
): Promise<Resume[]> {
  return getResumesByUserId(userId);
}

export class ResumeServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "ResumeServiceError";
  }
}

export async function analyzeUserResume(
  resumeId: string,
  userId: string
) {
  const resume = await getResumeByIdAndUserId(
    resumeId,
    userId
  );

  if (!resume) {
    throw new ResumeServiceError(
      "Resume not found.",
      "RESUME_NOT_FOUND"
    );
  }

  if (!resume.extractedText?.trim()) {
    throw new ResumeServiceError(
      "Resume text is unavailable for analysis.",
      "RESUME_TEXT_UNAVAILABLE"
    );
  }

  const result = await analyzeResume(resume.extractedText);

const updated = await updateResumeAnalysisScore(
  resumeId,
  userId,
  result.analysis.score,
  result.metrics
);

  if (!updated) {
    throw new ResumeServiceError(
      "Unable to save resume analysis.",
      "ANALYSIS_SAVE_FAILED"
    );
  }

  return {
  resumeId: resume.id,
  analysis: result.analysis,
  metrics: result.metrics,
};
}
