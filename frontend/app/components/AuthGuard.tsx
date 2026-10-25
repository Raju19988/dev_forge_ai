"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function verifyAuthentication() {
      const accessToken = sessionStorage.getItem("devforge_access_token");

      if (!accessToken) {
        router.replace("/login");
        return;
      }

      try {
        await getCurrentUser(accessToken);

        if (!cancelled) {
          setIsAuthenticated(true);
        }
      } catch {
        sessionStorage.removeItem("devforge_access_token");

        if (!cancelled) {
          router.replace("/login");
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    }

    void verifyAuthentication();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (isChecking || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"
            aria-hidden="true"
          />

          <p className="text-sm text-slate-400">
            Verifying your session...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}