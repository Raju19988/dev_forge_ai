import { PDFParse } from "pdf-parse";
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
  const pdfBuffer = await fs.readFile(filePath);

  let parser: PDFParse | undefined;

  try {
    parser = new PDFParse({
      data: pdfBuffer,
    });

    const result = await parser.getText();

    // Remove null characters and unnecessary surrounding whitespace.
    const extractedText = result.text
      .replace(/\u0000/g, "")
      .replace(/\r\n/g, "\n")
      .trim();

    // Reject PDFs without extractable text.
    if (!extractedText) {
      throw new ResumePdfExtractionError(
        "EMPTY_TEXT",
        "The uploaded PDF contains no extractable text."
      );
    }

    return extractedText;
  } catch (error) {
    // Preserve our application-specific errors.
    if (error instanceof ResumePdfExtractionError) {
      throw error;
    }

    // Convert parser failures into a controlled application error.
    throw new ResumePdfExtractionError(
      "INVALID_PDF",
      "The uploaded PDF is corrupted or cannot be processed."
    );
  } finally {
    // Release PDF parser resources.
    if (parser) {
      await parser.destroy();
    }
  }
}