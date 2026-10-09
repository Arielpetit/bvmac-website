"use client";

// Last-resort boundary when the root layout itself fails. Self-contained styles.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#120c06", color: "#efe6d4", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ maxWidth: 560, padding: 32 }}>
          <p style={{ color: "#ead18a", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12 }}>BVMAC · Erreur 500</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 40, lineHeight: 1.1, color: "#fbf6ea" }}>Le site est momentanément indisponible.</h1>
          <p style={{ opacity: 0.75 }}>Réessayez dans un instant. Les séances de cotation ne sont pas affectées.</p>
          <button type="button" onClick={reset} style={{ marginTop: 24, height: 48, padding: "0 24px", borderRadius: 999, border: 0, background: "#c9a23a", color: "#120c06", fontWeight: 600, cursor: "pointer" }}>Réessayer</button>
        </main>
      </body>
    </html>
  );
}
