"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, ArrowUpRight, BookOpen, Building2, Check, Copy, LineChart, RotateCcw, TrendingUp, X } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/cn";
import { BvmacAvatar } from "./BvmacAvatar";

type Source = { title: string; description: string; href: string };
type Msg = { role: "user" | "assistant"; text: string; sources?: Source[]; error?: boolean };

const EASE = [0.16, 1, 0.3, 1] as const;
const SUGGESTION_ICONS = [Building2, LineChart, TrendingUp, BookOpen];
const UI = {
  fr: { online: "En ligne · répond en quelques secondes", reset: "Nouvelle conversation", hint: "Une question sur la bourse ?", copy: "Copier", copied: "Copié", start: "Suggestions", name: "Bémac" },
  en: { online: "Online · replies in seconds", reset: "New conversation", hint: "A question about the market?", copy: "Copy", copied: "Copied", start: "Suggestions", name: "Bémac" },
  es: { online: "En línea · responde en segundos", reset: "Nueva conversación", hint: "¿Una pregunta sobre la bolsa?", copy: "Copiar", copied: "Copiado", start: "Sugerencias", name: "Bémac" },
};

// Minimal markdown renderer: [text](url) links, **bold**, paragraphs.
function renderInline(text: string, keyPrefix: string) {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined && m[2] !== undefined) {
      const href = m[2];
      const external = /^https?:/.test(href);
      const cls = "font-medium text-accent-text underline decoration-accent/40 underline-offset-2 hover:text-accent";
      parts.push(
        external ? (
          <a key={`${keyPrefix}-${i}`} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
            {m[1]}
          </a>
        ) : (
          <Link key={`${keyPrefix}-${i}`} href={href} className={cls}>
            {m[1]}
          </Link>
        ),
      );
    } else if (m[3] !== undefined) {
      parts.push(
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-heading">
          {m[3]}
        </strong>,
      );
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function renderMessage(text: string, keyPrefix: string) {
  return text.split(/\n+/).filter(Boolean).map((para, i) => (
    <p key={`${keyPrefix}-p${i}`} className={cn(i > 0 && "mt-2")}>
      {renderInline(para, `${keyPrefix}-${i}`)}
    </p>
  ));
}

export function ChatWidget() {
  const { locale, dict } = useI18n();
  const t = dict.chat;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [hint, setHint] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const u = UI[locale];
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Invite bubble: shown once per browser session, a few seconds after load.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("bvmac-chat-hint") === "1";
    } catch {}
    if (seen) return;
    const show = setTimeout(() => setHint(true), 4000);
    const hide = setTimeout(() => setHint(false), 14000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  function dismissHint() {
    setHint(false);
    try {
      sessionStorage.setItem("bvmac-chat-hint", "1");
    } catch {}
  }

  async function copy(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      setTimeout(() => setCopied(null), 1600);
    } catch {}
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }, { role: "assistant", text: "" }]);
    setStreaming(true);

    const history = messages.map((m) => ({ role: m.role, content: m.text }));

    try {
      const res = await fetch("/api/bvmac-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, locale, history }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let sources: Source[] | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";
        for (const block of blocks) {
          const event = block.match(/^event: (.+)$/m)?.[1];
          const data = block.match(/^data: (.+)$/m)?.[1];
          if (!data) continue;
          if (event === "sources") {
            try {
              sources = JSON.parse(data);
            } catch {
              sources = null;
            }
          } else if (event === "message") {
            try {
              const { delta } = JSON.parse(data);
              if (typeof delta === "string") {
                setMessages((m) => {
                  const copy = [...m];
                  const last = copy[copy.length - 1];
                  copy[copy.length - 1] = { ...last, text: last.text + delta };
                  return copy;
                });
              }
            } catch {
              // ignore
            }
          } else if (event === "error") {
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { ...copy[copy.length - 1], text: t.error, error: true };
              return copy;
            });
          }
        }
      }

      if (sources) {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { ...copy[copy.length - 1], sources };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { ...copy[copy.length - 1], text: t.error, error: true };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <div className="fixed bottom-5 right-5 z-[70] flex items-end gap-3">
        <AnimatePresence>
          {hint && !open && (
            <motion.div initial={{ opacity: 0, x: 12, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 12, scale: 0.9 }} transition={{ duration: 0.35, ease: EASE }} className="relative mb-2 hidden items-center gap-2 rounded-2xl rounded-br-sm bg-surface py-2.5 pl-4 pr-2 text-sm text-heading shadow-[0_16px_40px_-12px_rgb(var(--shadow-color)/0.45)] ring-1 ring-line sm:flex">
              <button type="button" onClick={() => { dismissHint(); setOpen(true); }} className="font-medium">{u.hint}</button>
              <button type="button" onClick={dismissHint} aria-label={t.close} className="inline-flex size-6 items-center justify-center rounded-full text-muted hover:bg-surface-alt"><X className="size-3.5" aria-hidden="true" /></button>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          type="button"
          onClick={() => { dismissHint(); setOpen((o) => !o); }}
          aria-label={t.title}
          aria-expanded={open}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative inline-flex size-16 items-center justify-center rounded-full shadow-[0_18px_44px_-10px_rgb(0_0_0/0.55)]"
        >
          {!open && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-brand-gold/40 [animation-duration:2.4s]" />}
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="relative flex size-full items-center justify-center rounded-full bg-espresso text-brand-gold-light ring-2 ring-brand-gold">
                <X className="size-6" strokeWidth={1.8} aria-hidden="true" />
              </motion.span>
            ) : (
              <motion.span key="a" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.2 }} className="relative size-full">
                <BvmacAvatar className="size-full" />
                <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full bg-[#2fbf71] ring-2 ring-background" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t.title}
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.94 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-x-3 bottom-24 top-3 z-[70] flex flex-col overflow-hidden rounded-[var(--radius-panel)] bg-surface shadow-[0_50px_140px_-30px_rgb(0_0_0/0.6)] ring-1 ring-line sm:inset-x-auto sm:right-5 sm:top-auto sm:h-[min(640px,calc(100dvh-8rem))] sm:w-[420px]"
          >
            <header className="grain relative isolate overflow-hidden bg-espresso px-5 pb-5 pt-4 text-brand-sand">
              <span aria-hidden="true" className="grid-lines absolute inset-0 -z-10" />
              <span aria-hidden="true" className="absolute -right-16 -top-20 -z-10 size-52 rounded-full bg-brand-gold/25 blur-3xl" />
              <div className="flex items-center gap-3.5">
                <span className="relative">
                  <BvmacAvatar className="size-12" thinking={streaming} />
                  <span className="absolute bottom-0 right-0 size-3 rounded-full bg-[#2fbf71] ring-2 ring-espresso" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-serif-display truncate text-xl leading-tight text-brand-ivory">{u.name} <span className="font-sans text-xs font-normal text-brand-sand/60">· {t.title}</span></p>
                  <p className="mt-0.5 truncate text-xs text-brand-sand/65">{u.online}</p>
                </div>
                {messages.length > 0 && (
                  <button type="button" onClick={() => !streaming && setMessages([])} title={u.reset} aria-label={u.reset} className="inline-flex size-9 items-center justify-center rounded-full text-brand-sand/70 transition-colors hover:bg-white/10 hover:text-brand-ivory">
                    <RotateCcw className="size-4" strokeWidth={1.8} aria-hidden="true" />
                  </button>
                )}
                <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="inline-flex size-9 items-center justify-center rounded-full text-brand-sand/70 transition-colors hover:bg-white/10 hover:text-brand-ivory">
                  <X className="size-4" strokeWidth={1.8} aria-hidden="true" />
                </button>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-background px-4 py-5" data-lenis-prevent>
              {messages.length === 0 && (
                <div className="space-y-5">
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex items-end gap-2">
                    <BvmacAvatar className="size-8" />
                    <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-surface px-4 py-3 text-sm leading-relaxed text-text shadow-soft ring-1 ring-line">{t.greeting}</div>
                  </motion.div>
                  <div>
                    <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{u.start}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {t.suggestions.map((s, k) => {
                        const Icon = SUGGESTION_ICONS[k % SUGGESTION_ICONS.length];
                        return (
                          <motion.button
                            key={s}
                            type="button"
                            onClick={() => send(s)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 + k * 0.07 }}
                            className="group flex flex-col gap-3 rounded-2xl bg-surface p-3.5 text-left text-[13px] leading-snug text-heading ring-1 ring-line transition-all hover:-translate-y-0.5 hover:shadow-soft hover:ring-brand-gold/60"
                          >
                            <span className="flex size-8 items-center justify-center rounded-xl bg-accent-soft text-accent-text transition-colors group-hover:bg-action group-hover:text-action-text"><Icon className="size-4" strokeWidth={1.7} aria-hidden="true" /></span>
                            {s}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((m, i) => {
                const last = i === messages.length - 1;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }} className={cn("flex items-end gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                    {m.role === "assistant" && <BvmacAvatar className="mb-0.5 size-8" thinking={streaming && last} />}
                    <div className={cn("max-w-[84%] space-y-2", m.role === "user" ? "text-right" : "text-left")}>
                      <div
                        className={cn(
                          "inline-block rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed",
                          m.role === "user" ? "rounded-br-sm bg-action text-action-text" : cn("rounded-bl-sm bg-surface text-text shadow-soft ring-1 ring-line", m.error && "text-fall ring-fall/30"),
                        )}
                      >
                        {m.role === "user" ? (
                          m.text
                        ) : m.text ? (
                          renderMessage(m.text, `m${i}`)
                        ) : (
                          <span role="status" aria-label={t.thinking} className="flex items-center gap-1 py-1.5">
                            {[0, 1, 2].map((d) => <span key={d} className="size-1.5 rounded-full bg-accent-text" style={{ animation: `chat-dot 1.1s ${d * 0.15}s infinite` }} />)}
                          </span>
                        )}
                      </div>
                      {m.role === "assistant" && m.text && !m.error && !(streaming && last) && (
                        <button type="button" onClick={() => copy(m.text, i)} className="flex items-center gap-1 px-1 text-[11px] text-muted transition-colors hover:text-heading">
                          {copied === i ? <Check className="size-3 text-rise" aria-hidden="true" /> : <Copy className="size-3" aria-hidden="true" />}
                          {copied === i ? u.copied : u.copy}
                        </button>
                      )}
                      {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="px-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{t.sources}</p>
                          {m.sources.map((s) => (
                            <Link key={s.href + s.title} href={s.href} className="group flex items-center gap-3 rounded-xl bg-surface px-3 py-2 ring-1 ring-line transition-all hover:ring-brand-gold/60">
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[13px] font-medium text-heading group-hover:text-link">{s.title}</span>
                                {s.description && <span className="block truncate text-xs text-muted">{s.description}</span>}
                              </span>
                              <ArrowUpRight className="size-4 shrink-0 text-muted transition-transform group-hover:rotate-45 group-hover:text-link" aria-hidden="true" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <footer className="border-t border-line bg-surface p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2 rounded-full bg-surface-alt p-1.5 pl-4 ring-1 ring-line transition-shadow focus-within:ring-2 focus-within:ring-brand-gold/60"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={500}
                  placeholder={t.placeholder}
                  aria-label={t.placeholder}
                  className="h-10 min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted focus-visible:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  aria-label={t.send}
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-gold text-espresso transition-all hover:bg-brand-gold-light disabled:bg-line disabled:text-muted"
                >
                  <ArrowUp className="size-5" strokeWidth={2.2} aria-hidden="true" />
                </button>
              </form>
              <p className="mt-2 px-2 text-center text-[10px] leading-tight text-muted">{t.disclaimer}</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
