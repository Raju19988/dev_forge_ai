import type { Request, Response, NextFunction } from "express";
import { getUserWithProfileById } from "../models/user.model";
import {
  loginUser,
  registerUser,
  AuthServiceError,
} from "../services/auth.service";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body ?? {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
      return;
    }

    const user = await registerUser({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof AuthServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    next(error);
  }
}
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const result = await loginUser({
      email,
      password,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    if (error instanceof AuthServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    next(error);
  }
}

export async function getCurrentUser(
  req: import("express").Request,
  res: import("express").Response
): Promise<void> {
  const authenticatedUser = (
    req as import("../middleware/auth.middleware").AuthenticatedRequest
  ).user;

  if (!authenticatedUser) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  try {
    const result = await getUserWithProfileById(authenticatedUser.id);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Authenticated user retrieved successfully",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    console.error("Failed to retrieve authenticated user:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve authenticated user",
    });
  }
}
