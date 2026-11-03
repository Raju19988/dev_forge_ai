"use client";

import { useCallback, useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import DashboardShell from "@/app/components/DashboardShell";
import {
  analyzeMyResume,
  getMyResumes,
  uploadResume,
  type Resume,
  type ResumeAnalysis,
  type ResumeAnalysisMetrics,
} from "@/lib/api";

function ResumePageContent() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [analysisMetrics, setAnalysisMetrics] =
  useState<ResumeAnalysisMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadResumes = useCallback(async () => {
    const token = sessionStorage.getItem("devforge_access_token");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await getMyResumes(token);
      setResumes(response.data?.resumes ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load resumes."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadResumes();
  }, [loadResumes]);

  function handleFileChange(file: File | null) {
    setError("");
    setSuccess("");
    setSelectedFile(null);

    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must not exceed 5 MB.");
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError("Please select a PDF resume first.");
      return;
    }

    const token = sessionStorage.getItem("devforge_access_token");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");
    setAnalysis(null);
    setAnalysisMetrics(null);

    try {
      await uploadResume(token, selectedFile);
      setSelectedFile(null);
      setSuccess("Resume uploaded successfully.");
      await loadResumes();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Resume upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleAnalyze(resumeId: string) {
    const token = sessionStorage.getItem("devforge_access_token");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    setAnalyzingId(resumeId);
    setError("");
    setSuccess("");
    setAnalysis(null);
    setAnalysisMetrics(null);


    try {
      const response = await analyzeMyResume(token, resumeId);
      setAnalysis(response.data?.analysis ?? null);
setAnalysisMetrics(response.data?.metrics ?? null);
      setSuccess("AI analysis completed successfully.");
      await loadResumes();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Resume analysis failed."
      );
    } finally {
      setAnalyzingId(null);
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-8">
        <section>
          <p className="text-sm font-medium text-violet-400">
            DEVFORGE AI / RESUME INTELLIGENCE
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Resume AI
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Analyze your resume with AI, discover your technical strengths,
            identify skill gaps, and get actionable career insights.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
          >
            {success}
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">Upload your resume</h2>
              <p className="mt-1 text-sm text-slate-400">
                Upload a PDF to get started with AI-powered analysis.
              </p>
            </div>

            <span className="w-fit rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
              PDF · Max 5 MB
            </span>
          </div>

          <label className="mt-6 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/60 px-4 py-8 text-center transition hover:border-violet-500/60 hover:bg-violet-500/5">
            <span className="text-3xl text-violet-400">↑</span>

            <span className="mt-3 text-sm font-medium text-slate-200">
              {selectedFile ? selectedFile.name : "Choose a PDF resume"}
            </span>

            <span className="mt-1 text-xs text-slate-500">
              Click to browse files from your computer
            </span>

            <input
              type="file"
              accept=".pdf,application/pdf"
              className="sr-only"
              onChange={(event) =>
                handleFileChange(event.target.files?.[0] ?? null)
              }
            />
          </label>

          {selectedFile && (
            <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-400">
                File size: {(selectedFile.size / 1024).toFixed(1)} KB
              </p>

              <button
                onClick={() => void handleUpload()}
                disabled={uploading}
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your resumes</h2>
              <p className="mt-1 text-sm text-slate-400">
                Manage and analyze your uploaded resumes.
              </p>
            </div>

            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
              {resumes.length} uploaded
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center text-sm text-slate-400">
              Loading your resumes...
            </div>
          ) : resumes.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-10 text-center">
              <p className="text-lg font-medium text-slate-200">
                No resumes uploaded yet
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Upload your first PDF resume to begin.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-100">
                      {resume.originalFilename}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {(resume.fileSize / 1024).toFixed(1)} KB
                      {" · "}
                      Uploaded{" "}
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>

                    {resume.analysisLatencyMs !== null && (
  <div className="mt-3 flex flex-wrap gap-2 text-xs">
    <span className="rounded-lg bg-violet-500/10 px-3 py-2 text-violet-300">
      {(resume.analysisLatencyMs / 1000).toFixed(2)}s
    </span>

    <span className="rounded-lg bg-slate-800 px-3 py-2 text-slate-300">
      {resume.totalTokens?.toLocaleString() ?? "N/A"} tokens
    </span>

    {resume.analysisModel && (
      <span className="rounded-lg bg-slate-800 px-3 py-2 text-slate-400">
        {resume.analysisModel}
      </span>
    )}
  </div>
)}
                  </div>

                  <button
                    onClick={() => void handleAnalyze(resume.id)}
                    disabled={analyzingId !== null}
                    className="shrink-0 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {analyzingId === resume.id
                      ? "Analyzing..."
                      : "Analyze with AI"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {analysis && (
          <section className="space-y-5">
            <div>
              <p className="text-sm font-medium text-violet-400">
                GEMINI AI RESULTS
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                Resume analysis
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-6">
                <p className="text-sm text-violet-200">Resume score</p>
                <p className="mt-2 text-5xl font-bold text-white">
                  {analysis.score}
                  <span className="text-xl text-violet-300">/100</span>
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-violet-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, analysis.score))}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <p className="text-sm text-slate-400">AI summary</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  {analysis.summary}
                </p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <h3 className="text-lg font-semibold text-emerald-300">
                  Strengths
                </h3>

                <ul className="mt-4 space-y-3">
                  {analysis.strengths.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm leading-6 text-slate-300"
                    >
                      <span className="text-emerald-400">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <h3 className="text-lg font-semibold text-amber-300">
                  Areas to improve
                </h3>

                <ul className="mt-4 space-y-3">
                  {analysis.gaps.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm leading-6 text-slate-300"
                    >
                      <span className="text-amber-400">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold">Detected technical skills</h3>

              {analysis.skills.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">
                  No skills were detected.
                </p>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {analysis.skills.map((skill, index) => (
                    <div
                      key={`${skill.name}-${index}`}
                      className="rounded-xl border border-white/10 bg-slate-950/60 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium text-slate-100">
                          {skill.name}
                        </p>

                        <span className="rounded-full bg-violet-500/10 px-2 py-1 text-xs text-violet-300">
                          {skill.proficiency}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        {skill.category}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {skill.evidence}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </DashboardShell>
  );
}

export default function ResumePage() {
  return (
    <AuthGuard>
      <ResumePageContent />
    </AuthGuard>
  );
}
