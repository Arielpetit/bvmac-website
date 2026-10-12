import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], axes: ["SOFT", "opsz"], variable: "--font-fraunces", display: "swap" });
const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = { title: "Espace de publication · BVMAC", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="light" suppressHydrationWarning className={`${fraunces.variable} ${geist.variable} ${geistMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
