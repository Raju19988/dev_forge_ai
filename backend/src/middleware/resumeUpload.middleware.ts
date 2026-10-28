import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";

const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5 MB

// Store uploaded resumes in the private backend storage directory.
const RESUME_STORAGE_DIRECTORY = path.resolve(
  __dirname,
  "../../storage/resumes"
);

// Create the directory if it does not exist.
fs.mkdirSync(RESUME_STORAGE_DIRECTORY, { recursive: true });

// Configure disk storage.
const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, RESUME_STORAGE_DIRECTORY);
  },

  filename: (_req, _file, callback) => {
    // Generate a unique filename; never trust the user's filename.
    const safeFilename = `${crypto.randomUUID()}.pdf`;
    callback(null, safeFilename);
  },
});

// Check the extension and declared MIME type.
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

// Accept one uploaded file from the multipart field named "resume".
export const uploadResume = multer({
  storage,
  limits: {
    fileSize: MAX_RESUME_SIZE,
    files: 1,
    fields: 0,
  },
  fileFilter: validateResumeFile,
}).single("resume");
