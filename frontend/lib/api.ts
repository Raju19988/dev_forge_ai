const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

// Represents a user returned by the backend.
// Passwords and password hashes must never be included here.
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}
// Education details stored in a developer profile.
export interface EducationEntry {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number | null;
  graduationYear: number | null;
}

// External links associated with a developer.
export interface DeveloperLinks {
  github: string | null;
  linkedin: string | null;
  portfolio: string | null;
}

// A project listed on a developer's profile.
export interface DeveloperProject {
  name: string;
  description: string;
  technologies: string[];
  projectUrl: string | null;
  githubUrl: string | null;
}

// Profile fields stored in PostgreSQL.
export interface DeveloperProfile {
  id: string;
  userId: string;
  githubUsername: string | null;
  bio: string | null;
  headline: string | null;
  location: string | null;
  skills: string[];
  education: EducationEntry[];
  links: DeveloperLinks;
  projects: DeveloperProject[];
  createdAt: string;
  updatedAt: string;
}

// Fields the frontend sends when creating or updating a profile.
export interface DeveloperProfileInput {
  githubUsername: string | null;
  bio: string | null;
  headline: string | null;
  location: string | null;
  skills: string[];
  education: EducationEntry[];
  links: DeveloperLinks;
  projects: DeveloperProject[];
}

// Standard response structure returned by the backend.
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Registration form data.
interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

// Login form data.
interface LoginInput {
  email: string;
  password: string;
}

// Data returned after successful login.
interface AuthResult {
  user: AuthUser;
  accessToken: string;
}

// Read and validate a JSON API response.
async function readResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  let result: ApiResponse<T>;

  try {
    result = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || `Request failed: ${response.status}`
    );
  }

  return result;
}

// Check whether the backend API is running.
export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/api/v1/health`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

// Register a new user.
export async function registerUser(
  input: RegisterInput
): Promise<ApiResponse<{ user: AuthUser }>> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  return readResponse<{ user: AuthUser }>(response);
}

// Log in an existing user.
export async function loginUser(
  input: LoginInput
): Promise<ApiResponse<AuthResult>> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  return readResponse<AuthResult>(response);
}

// Fetch the current authenticated user using a JWT access token.
export async function getCurrentUser(
  accessToken: string
): Promise<ApiResponse<{ user: AuthUser }>> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  return readResponse<{ user: AuthUser }>(response);
}
// Retrieve the current user's developer profile.
export async function getMyProfile(
  accessToken: string
): Promise<ApiResponse<DeveloperProfile | null>> {
  const response = await fetch(`${API_BASE_URL}/api/v1/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  return readResponse<DeveloperProfile | null>(response);
}

// Create or update the current user's developer profile.
export async function updateMyProfile(
  accessToken: string,
  input: DeveloperProfileInput
): Promise<ApiResponse<DeveloperProfile>> {
  const response = await fetch(`${API_BASE_URL}/api/v1/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(input),
  });

  return readResponse<DeveloperProfile>(response);
}