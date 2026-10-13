// Sign-in page of the access gate. Self-contained HTML (inline styles, no site scripts or
// stylesheets), because everything else on the site stays locked until the visitor signs in.
import { safeNext } from "@/lib/gate";

const copy = {
  fr: { title: "Accès réservé", intro: "Ce site est en test interne. Connectez-vous pour continuer.", email: "Adresse e-mail", password: "Mot de passe", submit: "Se connecter", error: "E-mail ou mot de passe incorrect." },
  en: { title: "Restricted access", intro: "This site is in internal testing. Sign in to continue.", email: "Email address", password: "Password", submit: "Sign in", error: "Incorrect email or password." },
  es: { title: "Acceso restringido", intro: "Este sitio está en pruebas internas. Inicie sesión para continuar.", email: "Correo electrónico", password: "Contraseña", submit: "Iniciar sesión", error: "Correo o contraseña incorrectos." },
};
type Lang = keyof typeof copy;

const escape = (value: string) => value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get("next"));
  const fromPath = next.match(/^\/(fr|en|es)(?:\/|$)/)?.[1];
  const fromBrowser = (request.headers.get("accept-language") ?? "").split(",").map((part) => part.trim().slice(0, 2).toLowerCase()).find((code) => code in copy);
  const lang = (fromPath ?? fromBrowser ?? "fr") as Lang;
  const t = copy[lang];

  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${t.title} · BVMAC</title>
<link rel="icon" href="/icon.png">
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100svh;display:grid;place-items:center;padding:24px;background:#120c06;color:#efe6d4;font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{width:100%;max-width:400px}
img{display:block;width:64px;height:64px;border-radius:16px}
h1{margin:28px 0 8px;font:500 2rem/1.15 Georgia,"Times New Roman",serif;color:#fbf6ea}
p{margin:0 0 28px;color:#efe6d4cc}
label{display:block;margin:0 0 6px;font-size:.875rem;color:#efe6d4}
input{width:100%;height:48px;margin:0 0 18px;padding:0 14px;border:1px solid #3d3020;border-radius:12px;background:#1c130b;color:#fbf6ea;font:inherit}
input:focus-visible,button:focus-visible{outline:2px solid #ead18a;outline-offset:2px}
button{width:100%;height:48px;margin-top:6px;border:0;border-radius:999px;background:#c9a23a;color:#120c06;font:600 1rem/1 inherit;cursor:pointer}
button:hover{background:#ead18a}
.error{margin:0 0 20px;padding:12px 14px;border:1px solid #a4442f;border-radius:12px;background:#3a1810;color:#ffd9cf}
</style>
</head>
<body>
<main>
<img src="/icon.png" alt="BVMAC">
<h1>${t.title}</h1>
<p>${t.intro}</p>
${url.searchParams.has("error") ? `<div class="error" role="alert">${t.error}</div>` : ""}
<form method="post" action="/api/gate/login">
<input type="hidden" name="next" value="${escape(next)}">
<label for="email">${t.email}</label>
<input id="email" name="email" type="email" autocomplete="username" required autofocus>
<label for="password">${t.password}</label>
<input id="password" name="password" type="password" autocomplete="current-password" required>
<button type="submit">${t.submit}</button>
</form>
</main>
</body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
}
