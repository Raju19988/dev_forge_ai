"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Checking backend...");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5001/api/health")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        setConnected(true);
      })
      .catch(() => {
        setMessage("Could not connect to backend");
        setConnected(false);
      });
  }, []);

  return (
    <main>
      <h1>DevForge AI</h1>

      <p>
        Backend Status:{" "}
        {connected ? "Connected ✅" : "Checking..."}
      </p>

      <p>{message}</p>
    </main>
  );
}