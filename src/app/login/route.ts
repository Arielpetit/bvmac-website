// Sign-in page of the access gate. Self-contained HTML (inline styles, no site scripts or
// stylesheets), because everything else on the site stays locked until the visitor signs in.
import { safeNext } from "@/lib/gate";

const copy = {
  fr: { title: "Accès réservé", intro: "Ce site est en test interne. Connectez-vous pour continuer.", email: "Adresse e-mail", password: "Mot de passe", submit: "Se connecter", error: "E-mail ou mot de passe incorrect.", show: "Afficher le mot de passe", hide: "Masquer le mot de passe" },
  en: { title: "Restricted access", intro: "This site is in internal testing. Sign in to continue.", email: "Email address", password: "Password", submit: "Sign in", error: "Incorrect email or password.", show: "Show password", hide: "Hide password" },
  es: { title: "Acceso restringido", intro: "Este sitio está en pruebas internas. Inicie sesión para continuar.", email: "Correo electrónico", password: "Contraseña", submit: "Iniciar sesión", error: "Correo o contraseña incorrectos.", show: "Mostrar la contraseña", hide: "Ocultar la contraseña" },
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
img{display:block;width:96px;height:96px}
h1{margin:28px 0 8px;font:500 2rem/1.15 Georgia,"Times New Roman",serif;color:#fbf6ea}
p{margin:0 0 28px;color:#efe6d4cc}
label{display:block;margin:0 0 6px;font-size:.875rem;color:#efe6d4}
input{width:100%;height:48px;margin:0 0 18px;padding:0 14px;border:1px solid #3d3020;border-radius:12px;background:#1c130b;color:#fbf6ea;font:inherit}
input:focus-visible,button:focus-visible{outline:2px solid #ead18a;outline-offset:2px}
.field{position:relative}
.field input{padding-right:52px}
.toggle{position:absolute;top:0;right:0;width:48px;height:48px;display:grid;place-items:center;border:0;border-radius:12px;background:none;color:#efe6d4cc;cursor:pointer}
.toggle:hover{color:#ead18a}
.toggle svg{width:22px;height:22px}
.toggle[aria-pressed="true"] .eye,.toggle[aria-pressed="false"] .eye-off{display:none}
.submit{width:100%;height:48px;margin-top:6px;border:0;border-radius:999px;background:#c9a23a;color:#120c06;font:inherit;font-weight:600;cursor:pointer}
.submit:hover{background:#ead18a}
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
<div class="field">
<input id="password" name="password" type="password" autocomplete="current-password" required>
<button type="button" class="toggle" id="toggle" aria-pressed="false" aria-label="${t.show}" title="${t.show}" hidden>
<svg class="eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
<svg class="eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.3 6.3A17.3 17.3 0 0 0 2 12s3.6 7 10 7a10.5 10.5 0 0 0 5.7-1.7M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18"/></svg>
</button>
</div>
<button type="submit" class="submit">${t.submit}</button>
</form>
</main>
<script>
(function () {
  var toggle = document.getElementById("toggle"), input = document.getElementById("password");
  toggle.hidden = false;
  toggle.addEventListener("click", function () {
    var show = input.type === "password";
    input.type = show ? "text" : "password";
    toggle.setAttribute("aria-pressed", String(show));
    toggle.title = show ? "${t.hide}" : "${t.show}";
    toggle.setAttribute("aria-label", toggle.title);
  });
})();
</script>
</body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
}
