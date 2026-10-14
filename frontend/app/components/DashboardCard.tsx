import type { DashboardFeatureStatus } from "../../types/dashboard";

interface DashboardCardProps {
  icon: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  status: DashboardFeatureStatus;
  actionLabel: string;
}

export default function DashboardCard({
  icon,
  title,
  description,
  metric,
  metricLabel,
  status,
  actionLabel,
}: DashboardCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-2xl">
          <span aria-hidden="true">{icon}</span>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
          {status}
        </span>
      </div>

      <h2 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h2>

      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-2xl font-bold tracking-tight text-white">
          {metric}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {metricLabel}
        </p>
      </div>

      <button
        type="button"
        className="mt-5 w-full rounded-lg border border-violet-400/30 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20"
      >
        {actionLabel}
      </button>
    </article>
  );
}