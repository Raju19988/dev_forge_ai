import jwt, { type SignOptions } from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be configured with a sufficiently long secret"
    );
  }

  return secret;
}

const ACCESS_TOKEN_EXPIRY = "15m";

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export function signAccessToken(
  payload: AccessTokenPayload
): string {
  const secret = getJwtSecret();

  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: ACCESS_TOKEN_EXPIRY,
  };

  return jwt.sign(payload, secret, options);
}