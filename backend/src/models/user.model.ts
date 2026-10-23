import { pool } from "../config/database";
import type { DeveloperProfile } from "./developerProfile.model";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithProfile {
  user: User;
  developerProfile: DeveloperProfile | null;
}

interface UserWithProfileRow {
  userId: string;
  name: string;
  email: string;
  userCreatedAt: Date;
  userUpdatedAt: Date;
  profileId: string | null;
  profileUserId: string | null;
  githubUsername: string | null;
  bio: string | null;
  profileCreatedAt: Date | null;
  profileUpdatedAt: Date | null;
}

export async function getUserWithProfileById(
  id: string
): Promise<UserWithProfile | null> {
  const result = await pool.query<UserWithProfileRow>(
    `
      SELECT
        u.id::text AS "userId",
        u.name,
        u.email,
        u.created_at AS "userCreatedAt",
        u.updated_at AS "userUpdatedAt",
        dp.id::text AS "profileId",
        dp.user_id::text AS "profileUserId",
        dp.github_username AS "githubUsername",
        dp.bio,
        dp.created_at AS "profileCreatedAt",
        dp.updated_at AS "profileUpdatedAt"
      FROM users AS u
      LEFT JOIN developer_profiles AS dp
        ON dp.user_id = u.id
      WHERE u.id = $1
    `,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  const user: User = {
    id: row.userId,
    name: row.name,
    email: row.email,
    createdAt: row.userCreatedAt,
    updatedAt: row.userUpdatedAt,
  };

  const developerProfile: DeveloperProfile | null =
    row.profileId === null
      ? null
      : {
          id: row.profileId,
          userId: row.profileUserId!,
          githubUsername: row.githubUsername,
          bio: row.bio,
          createdAt: row.profileCreatedAt!,
          updatedAt: row.profileUpdatedAt!,
        };

  return {
    user,
    developerProfile,
  };
}

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
}

export async function createUser(
  input: CreateUserInput
): Promise<User> {
  const result = await pool.query<{
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }>(
    `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING
        id::text AS id,
        name,
        email,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [input.name, input.email, input.passwordHash]
  );

  const row = result.rows[0];

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
export interface UserWithPasswordHash extends User {
  passwordHash: string;
}

export async function getUserByEmail(
  email: string
): Promise<UserWithPasswordHash | null> {
  const result = await pool.query<{
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }>(
    `
      SELECT
        id::text AS id,
        name,
        email,
        password_hash AS "passwordHash",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.passwordHash,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}