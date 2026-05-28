import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Proposal Generator — Landship.ca",
  description:
    "Turn a few details about your service business into a polished, ready-to-send client proposal in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
