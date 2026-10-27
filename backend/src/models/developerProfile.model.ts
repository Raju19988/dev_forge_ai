import { pool } from "../config/database";

export interface EducationEntry {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number | null;
  graduationYear: number | null;
}

export interface DeveloperLinks {
  github: string | null;
  linkedin: string | null;
  portfolio: string | null;
}

export interface DeveloperProject {
  name: string;
  description: string;
  technologies: string[];
  projectUrl: string | null;
  githubUrl: string | null;
}

export interface DeveloperProfile {
  id: string;
  userId: string;
  githubUsername: string | null;
  bio: string | null;
  headline: string | null;
  location: string | null;
  skills: string[];
  education: EducationEntry[];
  links: DeveloperLinks;
  projects: DeveloperProject[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DeveloperProfileInput {
  githubUsername: string | null;
  bio: string | null;
  headline: string | null;
  location: string | null;
  skills: string[];
  education: EducationEntry[];
  links: DeveloperLinks;
  projects: DeveloperProject[];
}

interface DeveloperProfileRow {
  id: string;
  userId: string;
  githubUsername: string | null;
  bio: string | null;
  headline: string | null;
  location: string | null;
  skills: string[];
  education: EducationEntry[];
  links: DeveloperLinks;
  projects: DeveloperProject[];
  createdAt: Date;
  updatedAt: Date;
}

const PROFILE_COLUMNS = `
  id::text AS id,
  user_id::text AS "userId",
  github_username AS "githubUsername",
  bio,
  headline,
  location,
  skills,
  education,
  links,
  projects,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

export async function getDeveloperProfileByUserId(
  userId: string
): Promise<DeveloperProfile | null> {
  const result = await pool.query<DeveloperProfileRow>(
    `
      SELECT ${PROFILE_COLUMNS}
      FROM developer_profiles
      WHERE user_id = $1
      LIMIT 1
    `,
    [userId]
  );

  return result.rows[0] ?? null;
}

export async function upsertDeveloperProfile(
  userId: string,
  input: DeveloperProfileInput
): Promise<DeveloperProfile> {
  const result = await pool.query<DeveloperProfileRow>(
    `
      INSERT INTO developer_profiles (
        user_id,
        github_username,
        bio,
        headline,
        location,
        skills,
        education,
        links,
        projects
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )
      ON CONFLICT (user_id)
      DO UPDATE SET
        github_username = EXCLUDED.github_username,
        bio = EXCLUDED.bio,
        headline = EXCLUDED.headline,
        location = EXCLUDED.location,
        skills = EXCLUDED.skills,
        education = EXCLUDED.education,
        links = EXCLUDED.links,
        projects = EXCLUDED.projects,
        updated_at = NOW()
      RETURNING ${PROFILE_COLUMNS}
    `,
    [
      userId,
      input.githubUsername,
      input.bio,
      input.headline,
      input.location,
      JSON.stringify(input.skills),
      JSON.stringify(input.education),
      JSON.stringify(input.links),
      JSON.stringify(input.projects),
    ]
  );

  return result.rows[0];
}