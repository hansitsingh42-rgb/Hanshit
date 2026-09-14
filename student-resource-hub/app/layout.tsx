import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Resource Hub",
  description: "A focused resource library for students.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
