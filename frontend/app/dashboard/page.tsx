import DashboardShell from "../components/DashboardShell";

const stats = [
  {
    label: "Resume Score",
    value: "—",
    description: "Your analysis will appear here",
  },
  {
    label: "Interview Sessions",
    value: "0",
    description: "Practice sessions completed",
  },
  {
    label: "DSA Progress",
    value: "0%",
    description: "Your practice progress",
  },
  {
    label: "GitHub Activity",
    value: "—",
    description: "Connect GitHub in a future step",
  },
];

export default function DashboardPage() {
  return (
    <DashboardShell>
      <section>
        <div className="mb-8">
          <p className="text-sm font-medium text-violet-400">
            DEVELOPER WORKSPACE
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome to DevForge AI
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Your workspace for resume improvement, interview
            preparation, and developer growth.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="text-sm text-slate-400">
                {stat.label}
              </p>

              <p className="mt-4 text-3xl font-bold text-white">
                {stat.value}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {stat.description}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <p className="text-sm font-medium text-violet-400">
            GET STARTED
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Build your developer profile
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Your dashboard layout is ready. In future steps,
            we'll connect real profile data, resume analysis,
            interview sessions, and GitHub activity.
          </p>

          <a
            href="/"
            className="mt-5 inline-flex rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400"
          >
            Return to landing page
          </a>
        </section>
      </section>
    </DashboardShell>
  );
}