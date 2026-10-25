import BackendStatus from "../components/BackendStatus";
import DashboardCard from "../components/DashboardCard";
import DashboardShell from "../components/DashboardShell";
import { dashboardFeatures } from "./dashboardData";
import AuthGuard from "../components/AuthGuard";

const overviewStats = [
  {
    label: "Profile completion",
    value: "70%",
  },
  {
    label: "Practice sessions",
    value: "3",
  },
  {
    label: "DSA problems",
    value: "24",
  },
];

export default function DashboardPage() {
  return (
    <AuthGuard>
    <DashboardShell>
      <div className="mx-auto max-w-7xl">
        {/* Welcome section */}
        <section className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Developer workspace
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your developer journey starts here.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Track your progress, prepare for technical interviews, improve
            your resume, and organize your developer profile in one place.
          </p>
        </section>

        {/* Live backend connection status */}
        <BackendStatus />

        {/* Overview statistics */}
        <section
          aria-label="Developer progress overview"
          className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {overviewStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="text-sm text-slate-400">{stat.label}</p>

              <p className="mt-3 text-3xl font-bold text-white">
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Illustrative mock data
              </p>
            </article>
          ))}
        </section>

        {/* Feature cards */}
        <section aria-labelledby="features-heading">
          <div className="mb-5">
            <h2
              id="features-heading"
              className="text-xl font-semibold text-white sm:text-2xl"
            >
              Your workspace
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Everything you need to work toward your developer goals.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {dashboardFeatures.map((feature) => (
              <DashboardCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                metric={feature.metric}
                metricLabel={feature.metricLabel}
                status={feature.status}
                actionLabel={feature.actionLabel}
              />
            ))}
          </div>
        </section>

        {/* Upcoming features */}
        <section className="mt-10 rounded-2xl border border-violet-400/20 bg-violet-500/[0.06] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-300">
            Built for your growth
          </p>

          <h2 className="mt-3 text-xl font-semibold text-white">
            One workspace. Multiple ways to improve.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            This is the first version of your dashboard. In future
            development steps, we&apos;ll connect real profile information,
            resume analysis, interview sessions, coding progress, and
            GitHub activity.
          </p>
        </section>
      </div>
    </DashboardShell>
    </AuthGuard>
  );
}