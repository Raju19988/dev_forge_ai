import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevForge AI",
  description: "AI-powered Developer Intelligence & Interview Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}