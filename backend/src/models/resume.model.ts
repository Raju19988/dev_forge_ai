import { pool } from "../config/database";

export interface Resume {
  id: string;
  userId: string;
  fileUrl: string;
  originalFilename: string | null;
  fileSize: number | null;
  extractedText: string | null;
  analysisScore: number | null;
  createdAt: Date;
}

interface ResumeRow {
  id: string;
  userId: string;
  fileUrl: string;
  originalFilename: string | null;
  fileSize: string | null;
  extractedText: string | null;
  analysisScore: string | null;
  createdAt: Date;
}

const RESUME_COLUMNS = `
  id::text AS id,
  user_id::text AS "userId",
  file_url AS "fileUrl",
  original_filename AS "originalFilename",
  file_size::text AS "fileSize",
  extracted_text AS "extractedText",
  analysis_score AS "analysisScore",
  created_at AS "createdAt"
`;

export async function createResume(
  userId: string,
  fileUrl: string,
  originalFilename: string,
  fileSize: number,
  extractedText: string
): Promise<Resume> {
  const result = await pool.query<ResumeRow>(
    `
      INSERT INTO resumes (
        user_id,
        file_url,
        original_filename,
        file_size,
        extracted_text
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING ${RESUME_COLUMNS}
    `,
    [
      userId,
      fileUrl,
      originalFilename,
      fileSize,
      extractedText,
    ]
  );

  const row = result.rows[0];

  return {
    ...row,
    fileSize:
      row.fileSize === null ? null : Number(row.fileSize),
    analysisScore:
      row.analysisScore === null
        ? null
        : Number(row.analysisScore),
  };
}

export async function getResumesByUserId(
  userId: string
): Promise<Resume[]> {
  const result = await pool.query<ResumeRow>(
    `
      SELECT ${RESUME_COLUMNS}
      FROM resumes
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows.map((row) => ({
    ...row,
    fileSize:
      row.fileSize === null ? null : Number(row.fileSize),
    analysisScore:
      row.analysisScore === null
        ? null
        : Number(row.analysisScore),
  }));
}