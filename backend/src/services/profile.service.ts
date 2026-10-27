import {
  getDeveloperProfileByUserId,
  upsertDeveloperProfile,
} from "../models/developerProfile.model";

import type {
  DeveloperProfile,
  DeveloperProfileInput,
} from "../models/developerProfile.model";

export async function getProfile(
  userId: string
): Promise<DeveloperProfile | null> {
  return getDeveloperProfileByUserId(userId);
}

export async function saveProfile(
  userId: string,
  input: DeveloperProfileInput
): Promise<DeveloperProfile> {
  return upsertDeveloperProfile(userId, input);
}