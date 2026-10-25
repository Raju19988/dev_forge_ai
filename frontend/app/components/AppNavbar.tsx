"use client";

import { useRouter } from "next/navigation";

export default function AppNavbar() {
  const router = useRouter();

  function handleLogout() {
    sessionStorage.removeItem("devforge_access_token");
    router.replace("/login");
  }

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-slate-950 px-6 py-4 text-white">
      <div>
        <h1 className="text-lg font-bold">DevForge AI</h1>
        <p className="text-sm text-slate-400">
          Developer Workspace
        </p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
      >
        Logout
      </button>
    </header>
  );
}