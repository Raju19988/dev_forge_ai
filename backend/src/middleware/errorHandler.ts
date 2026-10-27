import type {
  Request,
  Response,
  NextFunction,
} from "express";

interface RequestError extends Error {
  status?: number;
  statusCode?: number;
  type?: string;
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (res.headersSent) {
    return;
  }

  const requestError = error as RequestError;

  if (
    requestError.type === "entity.too.large" ||
    requestError.status === 413 ||
    requestError.statusCode === 413
  ) {
    res.status(413).json({
      success: false,
      message: "Request body is too large. Maximum allowed size is 10 KB.",
    });
    return;
  }

  if (requestError.type === "entity.parse.failed") {
    res.status(400).json({
      success: false,
      message: "Invalid JSON request body",
    });
    return;
  }

  console.error("Unhandled request error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}