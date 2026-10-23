import type {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

import type { AccessTokenPayload } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authentication token is required",
    });
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication token is required",
    });
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    res.status(500).json({
      success: false,
      message: "Authentication is not configured correctly",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      typeof decoded.email !== "string"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    const payload = decoded as JwtPayload & AccessTokenPayload;

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch (error) {
  if (error instanceof jwt.TokenExpiredError) {
    console.error("JWT verification failed: token expired");
  } else if (error instanceof jwt.JsonWebTokenError) {
    console.error("JWT verification failed:", error.name);
  } else {
    console.error("JWT verification failed: unexpected error");
  }

  res.status(401).json({
    success: false,
    message: "Invalid or expired authentication token",
  });
  }
}