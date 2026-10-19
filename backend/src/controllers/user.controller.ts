import type { Request, Response } from "express";
import { getUserById } from "../services/user.service";

export async function getUser(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id;

  // Validate the user ID
  if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
    res.status(400).json({
      success: false,
      message: "User ID must be a positive integer",
    });
    return;
  }

  try {
    const user = await getUserById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Failed to retrieve user:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
