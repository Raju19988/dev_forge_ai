export interface DashboardFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  status: string;
  actionLabel: string;
}

export const dashboardFeatures: DashboardFeature[] = [
  {
    id: "profile",
    icon: "👤",
    title: "Developer Profile",
    description:
      "Organize your skills, education, projects, and developer experience.",
    metric: "70%",
    metricLabel: "Profile completion · Sample",
    status: "In progress",
    actionLabel: "View profile",
  },
  {
    id: "resume",
    icon: "📄",
    title: "Resume Analyzer",
    description:
      "Prepare for resume analysis and identify opportunities to improve your resume.",
    metric: "Not analyzed",
    metricLabel: "No real analysis performed",
    status: "Not started",
    actionLabel: "Explore resume tools",
  },
  {
    id: "interview",
    icon: "🎯",
    title: "Interview Practice",
    description:
      "Prepare for technical interviews with a structured practice workflow.",
    metric: "3 sessions",
    metricLabel: "Example practice activity",
    status: "Preview",
    actionLabel: "Explore interviews",
  },
  {
    id: "coding",
    icon: "💻",
    title: "Coding Practice",
    description:
      "Build your problem-solving skills and review data structures and algorithms.",
    metric: "24 solved",
    metricLabel: "Example DSA progress",
    status: "Preview",
    actionLabel: "Explore coding",
  },
  {
    id: "github",
    icon: "🐙",
    title: "GitHub Insights",
    description:
      "Prepare to review repositories, programming languages, and contribution activity.",
    metric: "Not connected",
    metricLabel: "GitHub integration not implemented",
    status: "Coming soon",
    actionLabel: "Explore GitHub insights",
  },
];