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

  analysisLatencyMs: number | null;
inputTokens: number | null;
outputTokens: number | null;
totalTokens: number | null;
estimatedCostUsd: number | null;
analysisModel: string | null;
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

  analysisLatencyMs: string | null;
inputTokens: string | null;
outputTokens: string | null;
totalTokens: string | null;
estimatedCostUsd: string | null;
analysisModel: string | null;
}

const RESUME_COLUMNS = `
  id::text AS id,
  user_id::text AS "userId",
  file_url AS "fileUrl",
  original_filename AS "originalFilename",
  file_size::text AS "fileSize",
  extracted_text AS "extractedText",
  analysis_score AS "analysisScore",
  created_at AS "createdAt",
  analysis_latency_ms::text AS "analysisLatencyMs",
input_tokens::text AS "inputTokens",
output_tokens::text AS "outputTokens",
total_tokens::text AS "totalTokens",
estimated_cost_usd::text AS "estimatedCostUsd",
analysis_model AS "analysisModel"
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

  analysisLatencyMs:
    row.analysisLatencyMs === null
      ? null
      : Number(row.analysisLatencyMs),

  inputTokens:
    row.inputTokens === null
      ? null
      : Number(row.inputTokens),

  outputTokens:
    row.outputTokens === null
      ? null
      : Number(row.outputTokens),

  totalTokens:
    row.totalTokens === null
      ? null
      : Number(row.totalTokens),

  estimatedCostUsd:
    row.estimatedCostUsd === null
      ? null
      : Number(row.estimatedCostUsd),
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

  analysisLatencyMs:
    row.analysisLatencyMs === null
      ? null
      : Number(row.analysisLatencyMs),

  inputTokens:
    row.inputTokens === null
      ? null
      : Number(row.inputTokens),

  outputTokens:
    row.outputTokens === null
      ? null
      : Number(row.outputTokens),

  totalTokens:
    row.totalTokens === null
      ? null
      : Number(row.totalTokens),

  estimatedCostUsd:
    row.estimatedCostUsd === null
      ? null
      : Number(row.estimatedCostUsd),
}));
}

export async function getResumeByIdAndUserId(
  resumeId: string,
  userId: string
): Promise<Resume | null> {
  const result = await pool.query<ResumeRow>(
    `
      SELECT ${RESUME_COLUMNS}
      FROM resumes
      WHERE id = $1
        AND user_id = $2
      LIMIT 1
    `,
    [resumeId, userId]
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
  ...row,
  fileSize:
    row.fileSize === null ? null : Number(row.fileSize),
  analysisScore:
    row.analysisScore === null
      ? null
      : Number(row.analysisScore),

  analysisLatencyMs:
    row.analysisLatencyMs === null
      ? null
      : Number(row.analysisLatencyMs),

  inputTokens:
    row.inputTokens === null
      ? null
      : Number(row.inputTokens),

  outputTokens:
    row.outputTokens === null
      ? null
      : Number(row.outputTokens),

  totalTokens:
    row.totalTokens === null
      ? null
      : Number(row.totalTokens),

  estimatedCostUsd:
    row.estimatedCostUsd === null
      ? null
      : Number(row.estimatedCostUsd),
};
}

export async function updateResumeAnalysisScore(
  resumeId: string,
  userId: string,
  score: number,
  metrics: {
    analysisLatencyMs: number;
    inputTokens: number | null;
    outputTokens: number | null;
    totalTokens: number | null;
    estimatedCostUsd: number | null;
    analysisModel: string;
  }
): Promise<boolean> {
  const result = await pool.query(
    `
      UPDATE resumes
      SET
        analysis_score = $1,
        analysis_latency_ms = $2,
        input_tokens = $3,
        output_tokens = $4,
        total_tokens = $5,
        estimated_cost_usd = $6,
        analysis_model = $7
      WHERE id = $8
        AND user_id = $9
    `,
    [
      score,
      metrics.analysisLatencyMs,
      metrics.inputTokens,
      metrics.outputTokens,
      metrics.totalTokens,
      metrics.estimatedCostUsd,
      metrics.analysisModel,
      resumeId,
      userId,
    ]
  );

  return result.rowCount === 1;
}