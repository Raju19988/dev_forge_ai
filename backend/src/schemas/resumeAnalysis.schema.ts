import { z } from "zod";

const SkillCategorySchema = z.enum([
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Cloud",
  "AI/ML",
  "Programming Language",
  "Tools",
  "Other",
]);

const ProficiencySchema = z.enum([
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Not specified",
]);

const SkillSchema = z.object({
  name: z.string().min(1),
  category: SkillCategorySchema,
  proficiency: ProficiencySchema,
  evidence: z.string().min(1),
});

export const ResumeAnalysisSchema = z.object({
  score: z.number().int().min(0).max(100),
  skills: z.array(SkillSchema),
  strengths: z.array(z.string().min(1)),
  gaps: z.array(z.string().min(1)),
  summary: z.string().min(1),
});

export type ResumeAnalysis = z.infer<
  typeof ResumeAnalysisSchema
>;