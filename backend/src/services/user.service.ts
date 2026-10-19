import {
  getUserWithProfileById,
  type UserWithProfile,
} from "../models/user.model";

export async function getUserById(
  id: string
): Promise<UserWithProfile | null> {
  return getUserWithProfileById(id);
}