import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

// Use temporary storage on Vercel and local storage during development.
const RESUME_STORAGE_DIRECTORY =
  process.env.VERCEL === "1"
    ? path.join(os.tmpdir(), "devforge-resumes")
    : path.resolve(__dirname, "../../storage/resumes");

fs.mkdirSync(RESUME_STORAGE_DIRECTORY, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, RESUME_STORAGE_DIRECTORY);
  },

  filename: (_req, _file, callback) => {
    const safeFilename = `${crypto.randomUUID()}.pdf`;
    callback(null, safeFilename);
  },
});

function validateResumeFile(
  _req: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
): void {
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    extension !== ".pdf" ||
    file.mimetype !== "application/pdf"
  ) {
    callback(new Error("Only PDF files are allowed."));
    return;
  }

  callback(null, true);
}

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: MAX_RESUME_SIZE,
    files: 1,
    fields: 0,
  },
  fileFilter: validateResumeFile,
}).single("resume");