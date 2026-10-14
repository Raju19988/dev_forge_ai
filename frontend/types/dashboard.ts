export type DashboardFeatureStatus =
  | "In progress"
  | "Preview"
  | "Coming soon";

export interface DashboardFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  status: DashboardFeatureStatus;
  actionLabel: string;
}
