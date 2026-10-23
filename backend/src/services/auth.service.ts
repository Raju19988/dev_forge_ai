import bcrypt from "bcrypt";
import {
  createUser,
  getUserByEmail,
  type User,
} from "../models/user.model";
import { signAccessToken } from "../utils/jwt";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

const BCRYPT_ROUNDS = 12;

export async function registerUser(
  input: RegisterUserInput
): Promise<User> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!name || name.length > 100) {
    throw new AuthServiceError(
      "Name must contain between 1 and 100 characters",
      400
    );
  }

  if (
    email.length > 255 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw new AuthServiceError(
      "A valid email address is required",
      400
    );
  }

  if (
  password.length < 12 ||
  Buffer.byteLength(password, "utf8") > 72
) {
  throw new AuthServiceError(
    "Password must be at least 12 characters and no more than 72 bytes",
    400
  );
}

  const passwordHash = await bcrypt.hash(
    password,
    BCRYPT_ROUNDS
  );

  try {
    return await createUser({
      name,
      email,
      passwordHash,
    });
  } catch (error) {
    const databaseError = error as {
      code?: string;
      constraint?: string;
    };

    if (
      databaseError.code === "23505" &&
      databaseError.constraint === "users_email_key"
    ) {
      throw new AuthServiceError(
        "An account with this email already exists",
        409
      );
    }

    throw error;
  }
}
export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginResult {
  user: User;
  accessToken: string;
}

export async function loginUser(
  input: LoginUserInput
): Promise<LoginResult> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (
    !email ||
    email.length > 255 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !password ||
    password.length > 1024
  ) {
    throw new AuthServiceError(
      "Invalid email or password",
      401
    );
  }

  const storedUser = await getUserByEmail(email);

  if (!storedUser) {
    throw new AuthServiceError(
      "Invalid email or password",
      401
    );
  }

  const passwordMatches = await bcrypt.compare(
    password,
    storedUser.passwordHash
  );

  if (!passwordMatches) {
    throw new AuthServiceError(
      "Invalid email or password",
      401
    );
  }

  const user: User = {
    id: storedUser.id,
    name: storedUser.name,
    email: storedUser.email,
    createdAt: storedUser.createdAt,
    updatedAt: storedUser.updatedAt,
  };

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
  });

  return {
    user,
    accessToken,
  };
}