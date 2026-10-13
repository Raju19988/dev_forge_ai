"use client";

import { useEffect, useState } from "react";
import { getHealth } from "../../lib/api";

type HealthStatus = {
  success: boolean;
  message: string;
};

type ConnectionState = "loading" | "connected" | "disconnected";

export default function BackendStatus() {
  const [status, setStatus] = useState<ConnectionState>("loading");
  const [message, setMessage] = useState("Checking backend connection...");

  useEffect(() => {
    let isMounted = true;

    async function checkBackend() {
      try {
        const data = (await getHealth()) as HealthStatus;

        if (!isMounted) return;

        if (data.success) {
          setStatus("connected");
          setMessage(data.message);
        } else {
          setStatus("disconnected");
          setMessage("Backend returned an unsuccessful response.");
        }
      } catch {
        if (!isMounted) return;

        setStatus("disconnected");
        setMessage("Unable to connect to the backend.");
      }
    }

    checkBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  const statusStyles = {
    loading: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    connected: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    disconnected: "border-red-400/20 bg-red-400/10 text-red-300",
  };

  const statusLabels = {
    loading: "Checking",
    connected: "Connected",
    disconnected: "Disconnected",
  };

  return (
    <section
      aria-live="polite"
      className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-white">Backend API Status</h2>
          <p className="mt-1 text-sm text-slate-400">{message}</p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
        >
          {statusLabels[status]}
        </span>
      </div>
    </section>
  );
}
