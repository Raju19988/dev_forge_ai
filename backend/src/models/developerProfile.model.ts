export interface DeveloperProfile {
  id: string;
  userId: string;
  githubUsername: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}