"use client";

import { useCallback, useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import DashboardShell from "@/app/components/DashboardShell";
import {
  getCurrentUser,
  getMyProfile,
  updateMyProfile,
  type AuthUser,
  type DeveloperProfileInput,
  type EducationEntry,
} from "@/lib/api";

const defaultProfile: DeveloperProfileInput = {
  githubUsername: null,
  bio: "",
  headline: "",
  location: "",
  skills: [],
  education: [],
  links: {
    github: null,
    linkedin: null,
    portfolio: null,
  },
  projects: [],
};

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500";

const labelClass = "text-sm font-medium text-slate-300";

function ProfileForm() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] =
    useState<DeveloperProfileInput>(defaultProfile);

  const [skillInput, setSkillInput] = useState("");
  const [technologyInputs, setTechnologyInputs] = useState<
    Record<number, string>
  >({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load the authenticated user and their saved developer profile.
  const loadProfile = useCallback(async () => {
    const token = sessionStorage.getItem("devforge_access_token");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const [userResponse, profileResponse] = await Promise.all([
        getCurrentUser(token),
        getMyProfile(token),
      ]);

      setUser(userResponse.data?.user ?? null);

      const savedProfile = profileResponse.data;

      if (savedProfile) {
        setProfile({
          githubUsername: savedProfile.githubUsername,
          bio: savedProfile.bio ?? "",
          headline: savedProfile.headline ?? "",
          location: savedProfile.location ?? "",
          skills: savedProfile.skills ?? [],
          education: savedProfile.education ?? [],
          links: savedProfile.links ?? {
            github: null,
            linkedin: null,
            portfolio: null,
          },
          projects: savedProfile.projects ?? [],
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeProfile() {
      await Promise.resolve();

      if (!cancelled) {
        await loadProfile();
      }
    }

    void initializeProfile();

    return () => {
      cancelled = true;
    };
  }, [loadProfile]);

  // Update personal information.
  function updateField(
    field: "headline" | "bio" | "location" | "githubUsername",
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // Add a technical skill.
  function addSkill() {
    const skill = skillInput.trim();

    if (!skill) return;

    if (
      profile.skills.some(
        (existing) => existing.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setError("That skill has already been added.");
      return;
    }

    setProfile((current) => ({
      ...current,
      skills: [...current.skills, skill],
    }));

    setSkillInput("");
    setError("");
  }

  // Remove a technical skill.
  function removeSkill(skillToRemove: string) {
    setProfile((current) => ({
      ...current,
      skills: current.skills.filter((skill) => skill !== skillToRemove),
    }));
  }

  // =========================
  // EDUCATION FUNCTIONS
  // =========================

  function addEducation() {
    setProfile((current) => ({
      ...current,
      education: [
        ...current.education,
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startYear: null,
          graduationYear: null,
        },
      ],
    }));
  }

  function updateEducation(
    index: number,
    field: keyof EducationEntry,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      education: current.education.map((entry, entryIndex) => {
        if (entryIndex !== index) return entry;

        if (field === "institution") {
          return { ...entry, institution: value };
        }

        if (field === "degree") {
          return { ...entry, degree: value };
        }

        if (field === "fieldOfStudy") {
          return { ...entry, fieldOfStudy: value };
        }

        if (field === "startYear") {
          return {
            ...entry,
            startYear: value ? Number(value) : null,
          };
        }

        return {
          ...entry,
          graduationYear: value ? Number(value) : null,
        };
      }),
    }));
  }

  function removeEducation(index: number) {
    setProfile((current) => ({
      ...current,
      education: current.education.filter(
        (_, entryIndex) => entryIndex !== index
      ),
    }));
  }

  // =========================
  // PROJECT FUNCTIONS
  // =========================

  function addProject() {
    setProfile((current) => ({
      ...current,
      projects: [
        ...current.projects,
        {
          name: "",
          description: "",
          technologies: [],
          projectUrl: null,
          githubUrl: null,
        },
      ],
    }));
  }

  function updateProject(
    index: number,
    field: "name" | "description" | "projectUrl" | "githubUrl",
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      projects: current.projects.map((project, projectIndex) => {
        if (projectIndex !== index) return project;

        if (field === "name") {
          return { ...project, name: value };
        }

        if (field === "description") {
          return { ...project, description: value };
        }

        if (field === "projectUrl") {
          return { ...project, projectUrl: value || null };
        }

        return { ...project, githubUrl: value || null };
      }),
    }));
  }

  function addProjectTechnology(index: number) {
    const technology = (technologyInputs[index] ?? "").trim();

    if (!technology) return;

    const project = profile.projects[index];

    if (!project) return;

    if (
      project.technologies.some(
        (existing) => existing.toLowerCase() === technology.toLowerCase()
      )
    ) {
      setError("That technology has already been added to this project.");
      return;
    }

    setProfile((current) => ({
      ...current,
      projects: current.projects.map((item, projectIndex) =>
        projectIndex === index
          ? {
              ...item,
              technologies: [...item.technologies, technology],
            }
          : item
      ),
    }));

    setTechnologyInputs((current) => ({
      ...current,
      [index]: "",
    }));

    setError("");
  }

  function removeProjectTechnology(
    projectIndex: number,
    technologyToRemove: string
  ) {
    setProfile((current) => ({
      ...current,
      projects: current.projects.map((project, index) =>
        index === projectIndex
          ? {
              ...project,
              technologies: project.technologies.filter(
                (technology) => technology !== technologyToRemove
              ),
            }
          : project
      ),
    }));
  }

  function removeProject(index: number) {
    setProfile((current) => ({
      ...current,
      projects: current.projects.filter(
        (_, projectIndex) => projectIndex !== index
      ),
    }));

    setTechnologyInputs((current) => {
      const updated: Record<number, string> = {};

      for (const [key, value] of Object.entries(current)) {
        const oldIndex = Number(key);

        if (oldIndex < index) {
          updated[oldIndex] = value;
        } else if (oldIndex > index) {
          updated[oldIndex - 1] = value;
        }
      }

      return updated;
    });
  }

  // Update professional links.
  function updateLink(
    field: "github" | "linkedin" | "portfolio",
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      links: {
        ...current.links,
        [field]: value || null,
      },
    }));
  }

  // Save the entire profile through the existing API.
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token = sessionStorage.getItem("devforge_access_token");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateMyProfile(token, profile);

      const savedProfile = response.data;

      if (savedProfile) {
        setProfile({
          githubUsername: savedProfile.githubUsername,
          bio: savedProfile.bio ?? "",
          headline: savedProfile.headline ?? "",
          location: savedProfile.location ?? "",
          skills: savedProfile.skills ?? [],
          education: savedProfile.education ?? [],
          links: savedProfile.links ?? {
            github: null,
            linkedin: null,
            portfolio: null,
          },
          projects: savedProfile.projects ?? [],
        });
      }

      setSuccess("Your developer profile has been saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-violet-400">
          Developer Workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          My Profile
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Build your developer identity, showcase your skills, and keep
          your professional information up to date.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm text-slate-400">
          Loading your developer profile...
        </div>
      ) : (
        <>
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PERSONAL INFORMATION */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-lg font-semibold text-white">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Your basic professional identity.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className={labelClass}>
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    value={user?.name ?? ""}
                    readOnly
                    className={`${inputClass} cursor-not-allowed opacity-70`}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    value={user?.email ?? ""}
                    readOnly
                    className={`${inputClass} cursor-not-allowed opacity-70`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="headline" className={labelClass}>
                    Professional Headline
                  </label>
                  <input
                    id="headline"
                    value={profile.headline ?? ""}
                    onChange={(event) =>
                      updateField("headline", event.target.value)
                    }
                    maxLength={160}
                    placeholder="Full-Stack Developer | AI Engineering Enthusiast"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="location" className={labelClass}>
                    Location
                  </label>
                  <input
                    id="location"
                    value={profile.location ?? ""}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    maxLength={120}
                    placeholder="City, Country"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="githubUsername" className={labelClass}>
                    GitHub Username
                  </label>
                  <input
                    id="githubUsername"
                    value={profile.githubUsername ?? ""}
                    onChange={(event) =>
                      updateField("githubUsername", event.target.value)
                    }
                    maxLength={100}
                    placeholder="your-github-username"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bio" className={labelClass}>
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    value={profile.bio ?? ""}
                    onChange={(event) =>
                      updateField("bio", event.target.value)
                    }
                    maxLength={1000}
                    rows={4}
                    placeholder="Tell us about your experience, interests, and goals..."
                    className={inputClass}
                  />
                  <p className="mt-1 text-right text-xs text-slate-500">
                    {(profile.bio ?? "").length}/1000
                  </p>
                </div>
              </div>
            </section>

            {/* TECHNICAL SKILLS */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-lg font-semibold text-white">
                Technical Skills
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Add technologies and tools you know.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="e.g. TypeScript"
                  aria-label="Add a technical skill"
                  className={inputClass.replace("mt-2 ", "")}
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20"
                >
                  Add Skill
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {profile.skills.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No skills added yet.
                  </p>
                ) : (
                  profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-2 text-sm text-violet-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove ${skill}`}
                        className="text-violet-300 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </section>

            {/* EDUCATION — STEP 3 */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Education
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Add your academic background and qualifications.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addEducation}
                  className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300 hover:bg-violet-500/20"
                >
                  + Add Education
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {profile.education.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No education entries yet. Add your school, college, or
                    university.
                  </p>
                ) : (
                  profile.education.map((education, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/10 bg-slate-950/60 p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-medium text-white">
                          Education #{index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="text-sm text-red-300 hover:text-red-200"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor={`institution-${index}`}
                            className={labelClass}
                          >
                            Institution
                          </label>
                          <input
                            id={`institution-${index}`}
                            value={education.institution}
                            onChange={(event) =>
                              updateEducation(
                                index,
                                "institution",
                                event.target.value
                              )
                            }
                            maxLength={200}
                            placeholder="University or college name"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`degree-${index}`}
                            className={labelClass}
                          >
                            Degree
                          </label>
                          <input
                            id={`degree-${index}`}
                            value={education.degree}
                            onChange={(event) =>
                              updateEducation(
                                index,
                                "degree",
                                event.target.value
                              )
                            }
                            maxLength={150}
                            placeholder="B.Tech, B.Sc, M.Tech..."
                            className={inputClass}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor={`field-${index}`}
                            className={labelClass}
                          >
                            Field of Study
                          </label>
                          <input
                            id={`field-${index}`}
                            value={education.fieldOfStudy}
                            onChange={(event) =>
                              updateEducation(
                                index,
                                "fieldOfStudy",
                                event.target.value
                              )
                            }
                            maxLength={150}
                            placeholder="Computer Science and Engineering"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`start-year-${index}`}
                            className={labelClass}
                          >
                            Start Year
                          </label>
                          <input
                            id={`start-year-${index}`}
                            type="number"
                            min={1950}
                            max={2100}
                            value={education.startYear ?? ""}
                            onChange={(event) =>
                              updateEducation(
                                index,
                                "startYear",
                                event.target.value
                              )
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`graduation-year-${index}`}
                            className={labelClass}
                          >
                            Graduation Year
                          </label>
                          <input
                            id={`graduation-year-${index}`}
                            type="number"
                            min={1950}
                            max={2100}
                            value={education.graduationYear ?? ""}
                            onChange={(event) =>
                              updateEducation(
                                index,
                                "graduationYear",
                                event.target.value
                              )
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* PROJECTS — STEP 4 */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Projects
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Showcase your work, technologies, and repositories.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addProject}
                  className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300 hover:bg-violet-500/20"
                >
                  + Add Project
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {profile.projects.length === 0 ? (
                 <p className="text-sm text-slate-500">
                  No projects added yet. Add a project to showcase your work.
                  </p>
                ) : (
                  profile.projects.map((project, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/10 bg-slate-950/60 p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-medium text-white">
                          Project #{index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="text-sm text-red-300 hover:text-red-200"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4">
                        <div>
                          <label
                            htmlFor={`project-name-${index}`}
                            className={labelClass}
                          >
                            Project Name
                          </label>
                          <input
                            id={`project-name-${index}`}
                            value={project.name}
                            onChange={(event) =>
                              updateProject(
                                index,
                                "name",
                                event.target.value
                              )
                            }
                            maxLength={150}
                            placeholder="DevForge AI"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`project-description-${index}`}
                            className={labelClass}
                          >
                            Description
                          </label>
                          <textarea
                            id={`project-description-${index}`}
                            value={project.description}
                            onChange={(event) =>
                              updateProject(
                                index,
                                "description",
                                event.target.value
                              )
                            }
                            maxLength={2000}
                            rows={3}
                            placeholder="What does this project do? What problem does it solve?"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`project-url-${index}`}
                            className={labelClass}
                          >
                            Live Project URL
                          </label>
                          <input
                            id={`project-url-${index}`}
                            type="url"
                            value={project.projectUrl ?? ""}
                            onChange={(event) =>
                              updateProject(
                                index,
                                "projectUrl",
                                event.target.value
                              )
                            }
                            placeholder="https://your-project.com"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`project-github-${index}`}
                            className={labelClass}
                          >
                            GitHub Repository URL
                          </label>
                          <input
                            id={`project-github-${index}`}
                            type="url"
                            value={project.githubUrl ?? ""}
                            onChange={(event) =>
                              updateProject(
                                index,
                                "githubUrl",
                                event.target.value
                              )
                            }
                            placeholder="https://github.com/username/repository"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`project-technologies-${index}`}
                            className={labelClass}
                          >
                            Technologies
                          </label>

                          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                            <input
                              id={`project-technologies-${index}`}
                              value={technologyInputs[index] ?? ""}
                              onChange={(event) =>
                                setTechnologyInputs((current) => ({
                                  ...current,
                                  [index]: event.target.value,
                                }))
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  addProjectTechnology(index);
                                }
                              }}
                              placeholder="e.g. React, TypeScript, PostgreSQL"
                              className={inputClass.replace("mt-2 ", "")}
                            />

                            <button
                              type="button"
                              onClick={() => addProjectTechnology(index)}
                              className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-300 hover:bg-violet-500/20"
                            >
                              Add Technology
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {project.technologies.map((technology) => (
                              <span
                                key={technology}
                                className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-2 text-sm text-violet-200"
                              >
                                {technology}

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeProjectTechnology(
                                      index,
                                      technology
                                    )
                                  }
                                  aria-label={`Remove ${technology} from project`}
                                  className="text-violet-300 hover:text-white"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* PROFESSIONAL LINKS */}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-lg font-semibold text-white">
                Professional Links
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Help recruiters and collaborators find your work.
              </p>

              <div className="mt-5 grid gap-5">
                <div>
                  <label htmlFor="github" className={labelClass}>
                    GitHub URL
                  </label>
                  <input
                    id="github"
                    type="url"
                    value={profile.links.github ?? ""}
                    onChange={(event) =>
                      updateLink("github", event.target.value)
                    }
                    placeholder="https://github.com/username"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="linkedin" className={labelClass}>
                    LinkedIn URL
                  </label>
                  <input
                    id="linkedin"
                    type="url"
                    value={profile.links.linkedin ?? ""}
                    onChange={(event) =>
                      updateLink("linkedin", event.target.value)
                    }
                    placeholder="https://www.linkedin.com/in/username"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="portfolio" className={labelClass}>
                    Portfolio URL
                  </label>
                  <input
                    id="portfolio"
                    type="url"
                    value={profile.links.portfolio ?? ""}
                    onChange={(event) =>
                      updateLink("portfolio", event.target.value)
                    }
                    placeholder="https://yourportfolio.com"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* SAVE AND RELOAD */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => void loadProfile()}
                disabled={saving || loading}
                className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
              >
                Reload Profile
              </button>

              <button
                type="submit"
                disabled={saving || loading}
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <DashboardShell>
        <ProfileForm />
      </DashboardShell>
    </AuthGuard>
  );
}