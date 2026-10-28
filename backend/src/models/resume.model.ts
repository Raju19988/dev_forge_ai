import { pool } from "../config/database";

export interface Resume {
  id: string;
  userId: string;
  fileUrl: string;
  analysisScore: number | null;
  createdAt: Date;
}

interface ResumeRow {
  id: string;
  userId: string;
  fileUrl: string;
  analysisScore: string | null;
  createdAt: Date;
}

const RESUME_COLUMNS = `
  id::text AS id,
  user_id::text AS "userId",
  file_url AS "fileUrl",
  analysis_score AS "analysisScore",
  created_at AS "createdAt"
`;

export async function createResume(
  userId: string,
  fileUrl: string
): Promise<Resume> {
  const result = await pool.query<ResumeRow>(
    `
      INSERT INTO resumes (user_id, file_url)
      VALUES ($1, $2)
      RETURNING ${RESUME_COLUMNS}
    `,
    [userId, fileUrl]
  );

  const row = result.rows[0];

  return {
    ...row,
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
    analysisScore:
      row.analysisScore === null
        ? null
        : Number(row.analysisScore),
  }));
}
