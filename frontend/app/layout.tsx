import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevForge AI | Forge Your Future",
  description:
    "An AI-powered developer platform for resume analysis, skill development, and interview preparation.",
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