"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: "⌂" },
  { label: "My Profile", href: "/profile", icon: "◉" },
  { label: "Resume AI", href: "/resume", icon: "▤" },
  { label: "Interviews", href: "/interviews", icon: "◇" },
  { label: "DSA Coach", href: "/dsa", icon: "⌘" },
  { label: "GitHub Insights", href: "/github", icon: "⌥" },
  { label: "Settings", href: "/settings", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-white/10 bg-slate-950 p-4 md:min-h-[calc(100vh-4rem)] md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="mb-4 hidden px-3 pt-4 md:block">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Workspace
        </p>
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="flex gap-2 overflow-x-auto md:flex-col"
      >
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-violet-500/15 text-violet-300"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="w-5 text-center text-lg" aria-hidden="true">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 md:block">
        <p className="text-sm font-semibold text-white">Keep growing</p>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          Your developer journey starts with consistent practice.
        </p>
      </div>
    </aside>
  );
}