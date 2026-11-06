import pdfParse from "pdf-parse";
import fs from "node:fs/promises";

export type ResumePdfExtractionErrorCode =
| "INVALID_PDF"
| "EMPTY_TEXT";

export class ResumePdfExtractionError extends Error {
constructor(
public readonly code: ResumePdfExtractionErrorCode,
message: string
) {
super(message);
this.name = "ResumePdfExtractionError";
}
}

export async function extractResumeText(
filePath: string
): Promise<string> {
try {
const pdfBuffer = await fs.readFile(filePath);

const result = await pdfParse(pdfBuffer);
const extractedText = result.text
  .replace(/\u0000/g, "")
  .replace(/\r\n/g, "\n")
  .trim();
if (!extractedText) {
  throw new ResumePdfExtractionError(
    "EMPTY_TEXT",
    "The uploaded PDF contains no extractable text."
  );
}
return extractedText;

} catch (error) {
if (error instanceof ResumePdfExtractionError) {
throw error;
}

console.error("PDF extraction error:", error);
throw new ResumePdfExtractionError(
  "INVALID_PDF",
  "The uploaded PDF is corrupted or cannot be processed."
);

}
}