import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Resource Hub",
  description: "A focused resource library for students.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "(() => { try { const saved = localStorage.getItem(\"student-resource-hub-theme\"); const theme = saved === \"dark\" || saved === \"light\" ? saved : window.matchMedia(\"(prefers-color-scheme: dark)\").matches ? \"dark\" : \"light\"; document.documentElement.dataset.theme = theme; } catch {} })();" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
