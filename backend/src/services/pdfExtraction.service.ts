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
      data: new Uint8Array(pdfBuffer),
    });

    const result = await parser.getText();

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
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}