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
    metricLabel: "Profile completion · Mock data",
    status: "In progress",
    actionLabel: "View profile",
  },
  {
    id: "resume",
    icon: "📄",
    title: "Resume Analyzer",
    description:
      "Review your resume and identify opportunities to improve your professional profile.",
    metric: "82/100",
    metricLabel: "Illustrative score · No real analysis",
    status: "Preview",
    actionLabel: "Explore resume tools",
  },
  {
    id: "interview",
    icon: "🎯",
    title: "Interview Practice",
    description:
      "Prepare for technical interviews through structured practice sessions.",
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
      "Improve your problem-solving skills with data structures and algorithms.",
    metric: "24 solved",
    metricLabel: "Example DSA progress",
    status: "In progress",
    actionLabel: "Explore coding",
  },
  {
    id: "github",
    icon: "🐙",
    title: "GitHub Insights",
    description:
      "Explore repository activity, programming languages, and contributions.",
    metric: "Not connected",
    metricLabel: "GitHub integration not implemented",
    status: "Coming soon",
    actionLabel: "Explore GitHub insights",
  },
];