import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

import {
  getProfile,
  saveProfile,
} from "../services/profile.service";

import type {
  DeveloperProfileInput,
  DeveloperLinks,
  EducationEntry,
  DeveloperProject,
} from "../models/developerProfile.model";

function isObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isOptionalString(
  value: unknown,
  maxLength: number
): value is string | null {
  return (
    value === null ||
    (
      typeof value === "string" &&
      value.length <= maxLength
    )
  );
}

function isValidUrl(value: unknown): boolean {
  if (value === null) {
    return true;
  }

  if (typeof value !== "string" || value.length > 2048) {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" ||
      url.protocol === "http:"
    );
  } catch {
    return false;
  }
}

function isValidEducation(
  value: unknown
): value is EducationEntry[] {
  if (!Array.isArray(value) || value.length > 20) {
    return false;
  }

  return value.every((entry: unknown) => {
    if (!isObject(entry)) {
      return false;
    }

    const validYear = (year: unknown): boolean =>
      year === null ||
      (
        typeof year === "number" &&
        Number.isInteger(year) &&
        year >= 1900 &&
        year <= 2200
      );

    return (
      typeof entry.institution === "string" &&
      entry.institution.trim().length > 0 &&
      entry.institution.length <= 200 &&
      typeof entry.degree === "string" &&
      entry.degree.trim().length > 0 &&
      entry.degree.length <= 150 &&
      typeof entry.fieldOfStudy === "string" &&
      entry.fieldOfStudy.length <= 150 &&
      validYear(entry.startYear) &&
      validYear(entry.graduationYear)
    );
  });
}

function isValidLinks(
  value: unknown
): value is DeveloperLinks {
  if (!isObject(value)) {
    return false;
  }

  return (
    isValidUrl(value.github) &&
    isValidUrl(value.linkedin) &&
    isValidUrl(value.portfolio)
  );
}

function isValidProjects(
  value: unknown
): value is DeveloperProject[] {
  if (!Array.isArray(value) || value.length > 50) {
    return false;
  }

  return value.every((project: unknown) => {
    if (!isObject(project)) {
      return false;
    }

    return (
      typeof project.name === "string" &&
      project.name.trim().length > 0 &&
      project.name.length <= 150 &&
      typeof project.description === "string" &&
      project.description.length <= 2000 &&
      Array.isArray(project.technologies) &&
      project.technologies.length <= 30 &&
      project.technologies.every(
        (technology: unknown) =>
          typeof technology === "string" &&
          technology.trim().length > 0 &&
          technology.length <= 50
      ) &&
      isValidUrl(project.projectUrl) &&
      isValidUrl(project.githubUrl)
    );
  });
}

function validateProfileInput(
  body: unknown
): DeveloperProfileInput | null {
  if (!isObject(body)) {
    return null;
  }

  const {
    githubUsername,
    bio,
    headline,
    location,
    skills,
    education,
    links,
    projects,
  } = body;

  if (
    !isOptionalString(githubUsername, 100) ||
    !isOptionalString(bio, 5000) ||
    !isOptionalString(headline, 160) ||
    !isOptionalString(location, 120)
  ) {
    return null;
  }

  if (
    !Array.isArray(skills) ||
    skills.length > 100 ||
    !skills.every(
      (skill: unknown) =>
        typeof skill === "string" &&
        skill.trim().length > 0 &&
        skill.length <= 80
    )
  ) {
    return null;
  }

  if (
    !isValidEducation(education) ||
    !isValidLinks(links) ||
    !isValidProjects(projects)
  ) {
    return null;
  }

  return {
    githubUsername,
    bio,
    headline,
    location,
    skills,
    education,
    links,
    projects,
  };
}

export async function getMyProfile(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const profile = await getProfile(userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Failed to retrieve developer profile");

    res.status(500).json({
      success: false,
      message: "Unable to retrieve developer profile",
    });
  }
}

export async function updateMyProfile(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const input = validateProfileInput(req.body);

    if (!input) {
      res.status(400).json({
        success: false,
        message: "Invalid profile data",
      });
      return;
    }

    const profile = await saveProfile(userId, input);

    res.status(200).json({
      success: true,
      message: "Developer profile saved successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Failed to save developer profile");

    res.status(500).json({
      success: false,
      message: "Unable to save developer profile",
    });
  }
}