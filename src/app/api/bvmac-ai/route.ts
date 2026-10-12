// BVMAC AI — chat API route.
//
// POST /api/bvmac-ai  { message, locale, history? }
// Retrieves the most relevant site content for the question, then streams a
// Groq answer (SSE). The first event carries the retrieved "sources" so the
// UI can render clickable links; the following events stream the answer text.

import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { buildAiIndex } from "@/lib/ai/index";
import { retrieve } from "@/lib/ai/retrieve";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT = (locale: Locale, context: string) => `Tu es l'assistant officiel du site de la BVMAC (Bourse des Valeurs Mobilières de l'Afrique Centrale). Tu aides les visiteurs à trouver des informations et des pages sur le site.

Réponds dans la langue de l'utilisateur (${locale === "fr" ? "français" : locale === "en" ? "anglais" : "espagnol"}).

Règles :
- Base-toi UNIQUEMENT sur le contexte fourni ci-dessous. Si l'information n'y figure pas, dis-le clairement et propose une page pertinente du site.
- Quand tu indiques une page, donne le lien exact fourni dans le contexte, au format markdown : [Titre du lien](/fr/chemin).
- Sois concis (2 à 6 phrases). Ne cite que des liens présents dans le contexte.
- Ne donne pas de conseil en investissement. Rappelle si besoin que les données sont indicatives.

CONTEXTE (extrait du site) :
${context}`;

function sse(event: string, data: string): string {
  return `event: ${event}\ndata: ${data}\n\n`;
}

export async function POST(req: Request) {
  let body: { message?: unknown; locale?: unknown; history?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const locale: Locale = isLocale(body.locale) ? body.locale : "fr";
  const history: ChatMessage[] = Array.isArray(body.history) ? (body.history as ChatMessage[]) : [];

  if (!message) return new Response("Missing message", { status: 400 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response("GROQ_API_KEY is not configured", { status: 500 });
  }

  const dict = getDictionary(locale);
  const index = buildAiIndex(locale, dict);
  const hits = retrieve(message, index, 8);

  const context = hits.length
    ? hits.map((h) => `- [${h.title}](/${locale}${h.href}): ${h.content}`).join("\n")
    : "(aucun contenu pertinent trouvé)";

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT(locale, context) },
    ...history.slice(-6),
    { role: "user", content: message },
  ];

  const sources = hits.map((h) => ({ title: h.title, description: h.description, href: `/${locale}${h.href}` }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode(sse("sources", JSON.stringify(sources))));

      try {
        const groqRes = await fetch(GROQ_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
            messages,
            temperature: 0.3,
            max_tokens: 700,
            stream: true,
          }),
        });

        if (!groqRes.ok || !groqRes.body) {
          const errText = await groqRes.text().catch(() => "");
          controller.enqueue(encoder.encode(sse("error", JSON.stringify({ message: `Groq error ${groqRes.status}: ${errText}` }))));
          controller.close();
          return;
        }

        const reader = groqRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(sse("message", JSON.stringify({ delta }))));
            } catch {
              // ignore malformed keep-alive lines
            }
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode(sse("error", JSON.stringify({ message: err instanceof Error ? err.message : "Unknown error" }))));
      }

      controller.enqueue(encoder.encode(sse("done", JSON.stringify({ done: true }))));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
