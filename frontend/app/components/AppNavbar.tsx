export default function AppNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="/dashboard"
          className="text-xl font-bold tracking-tight text-white"
        >
          DevForge<span className="text-violet-400">AI</span>
        </a>

        <div className="flex items-center gap-3 sm:gap-5">
          <span className="hidden text-sm text-slate-400 sm:inline">
            Developer Workspace
          </span>

          <button
            type="button"
            aria-label="User profile"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10 font-semibold text-violet-300"
          >
            D
          </button>
        </div>
      </div>
    </header>
  );
}