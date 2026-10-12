import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = { title: "Espace de publication · BVMAC", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
