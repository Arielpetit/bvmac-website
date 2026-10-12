"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, Eye, EyeOff, FileUp, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/browser";
import type { Field, Resource, Values } from "./resources";
import { usePrefs } from "./prefs";
import { Notice, PageTitle, btnGhost, btnGold, btnPrimary, cardCls, fmtDate, inputCls } from "./ui";
import { cn } from "@/lib/cn";

type Row = Record<string, unknown> & { id: string; published: boolean };
const isImage = (v: unknown) => typeof v === "string" && /\.(png|jpe?g|webp|svg)(\?|$)/i.test(v);
const fileOf = (r: Row) => [r.url, r.src, r.image, r.logo, r.photo, r.poster].find((v) => typeof v === "string" && v) as string | undefined;

export function ResourceManager({ resource, role }: { resource: Resource; role: string }) {
  const db = getBrowserClient();
  const { tr, lang } = usePrefs();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = useState<{ id: string | null; values: Values } | null>(null);

  const fetchRows = useCallback(
    () => db.from(resource.table).select("*").order(resource.orderBy, { ascending: resource.ascending ?? false }).limit(1000),
    [db, resource.table, resource.orderBy, resource.ascending],
  );
  const load = useCallback(async () => {
    const { data, error: e } = await fetchRows();
    if (e) setError(e.message);
    else setRows(data as Row[]);
  }, [fetchRows]);

  useEffect(() => {
    let live = true;
    fetchRows().then(({ data, error: e }) => {
      if (!live) return;
      if (e) setError(e.message);
      else setRows(data as Row[]);
    });
    return () => {
      live = false;
    };
  }, [fetchRows]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter((r) => (filter === "all" || (filter === "published") === r.published) && (!q || Object.values(r).some((v) => typeof v === "string" && v.toLowerCase().includes(q))));
  }, [rows, query, filter]);
  const drafts = (rows ?? []).filter((r) => !r.published).length;

  async function togglePublished(r: Row) {
    const { error: e } = await db.from(resource.table).update({ published: !r.published }).eq("id", r.id);
    if (e) setError(e.message);
    else load();
  }

  async function remove(r: Row) {
    if (!confirm(`${tr(["Supprimer définitivement cet élément ?", "Delete this item permanently?"])}\n\n${String(r[resource.columns[1]?.name ?? "id"] ?? r.id)}`)) return;
    const { error: e } = await db.from(resource.table).delete().eq("id", r.id);
    if (e) setError(e.message);
    else load();
  }

  const cell = (r: Row, name: string) => {
    const v = r[name];
    if (typeof v === "number") return v.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB");
    return fmtDate(v, lang);
  };

  return (
    <div>
      <PageTitle
        title={tr(resource.label)}
        hint={tr(resource.hint)}
        info={resource.info}
        action={
          <button type="button" onClick={() => setEditing({ id: null, values: { ...resource.defaults } })} className={btnPrimary}>
            <Plus className="size-4" aria-hidden="true" /> {tr(["Ajouter", "Add"])}
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={tr(["Rechercher…", "Search…"])} aria-label={tr(["Rechercher", "Search"])} className={cn(inputCls, "pl-10")} />
        </div>
        <div role="group" className="inline-flex rounded-full border border-line bg-surface p-1 text-sm">
          {([["all", ["Tous", "All"]], ["published", ["Publiés", "Published"]], ["draft", ["Brouillons", "Drafts"]]] as const).map(([k, l]) => (
            <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)} className={cn("h-9 rounded-full px-4 transition-colors", filter === k ? "bg-action text-action-text" : "text-muted hover:text-heading")}>
              {tr(l)}{k === "draft" && drafts > 0 ? ` (${drafts})` : ""}
            </button>
          ))}
        </div>
        {resource.publicPath && (
          <a href={`/${lang}${resource.publicPath === "/" ? "" : resource.publicPath}`} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1.5 text-sm text-link hover:underline">
            {tr(["Voir sur le site", "View on the site"])} <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        )}
      </div>

      {error && <div className="mt-4"><Notice tone="error">{error}</Notice></div>}

      <div className={cn(cardCls, "mt-5 overflow-hidden")}>
        <div className="hidden border-b border-line bg-surface-alt/60 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-muted md:flex md:items-center md:gap-4">
          <span className="w-20">{tr(["État", "Status"])}</span>
          <span className="w-28">{tr(resource.columns[0].label)}</span>
          <span className="flex-1">{tr(resource.columns[1].label)}</span>
          {resource.columns[2] && <span className="w-40">{tr(resource.columns[2].label)}</span>}
          <span className="w-36 text-right">{tr(["Actions", "Actions"])}</span>
        </div>
        {rows === null ? (
          <p className="flex items-center gap-2 p-6 text-sm text-muted"><Loader2 className="size-4 animate-spin" aria-hidden="true" /> {tr(["Chargement…", "Loading…"])}</p>
        ) : shown.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">{tr(["Aucun élément.", "Nothing here yet."])}</p>
        ) : (
          <ul className="divide-y divide-line">
            {shown.map((r) => {
              const file = fileOf(r);
              return (
                <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors hover:bg-surface-alt/50">
                  <span className="w-20"><span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", r.published ? "bg-rise-bg text-rise" : "bg-accent-soft text-accent-text")}>{r.published ? tr(["Publié", "Live"]) : tr(["Brouillon", "Draft"])}</span></span>
                  <span className="figure w-28 shrink-0 truncate text-sm text-muted">{cell(r, resource.columns[0].name)}</span>
                  <span className="flex min-w-0 flex-1 items-center gap-3">
                    {isImage(file) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={file} alt="" className="size-9 shrink-0 rounded-lg border border-line bg-white object-cover" />
                    )}
                    <span className="truncate text-sm font-medium text-heading">{cell(r, resource.columns[1].name)}</span>
                  </span>
                  {resource.columns[2] && <span className="hidden w-40 truncate text-xs text-muted md:block">{cell(r, resource.columns[2].name)}</span>}
                  <span className="flex w-36 items-center justify-end gap-0.5">
                    {file && (
                      <a href={file} target="_blank" rel="noopener noreferrer" title={tr(["Ouvrir le fichier", "Open file"])} className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-alt hover:text-heading"><ExternalLink className="size-4" aria-hidden="true" /><span className="sr-only">{tr(["Ouvrir le fichier", "Open file"])}</span></a>
                    )}
                    <button type="button" onClick={() => togglePublished(r)} title={r.published ? tr(["Masquer", "Hide"]) : tr(["Publier", "Publish"])} className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-alt hover:text-heading">
                      {r.published ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                      <span className="sr-only">{r.published ? tr(["Masquer", "Hide"]) : tr(["Publier", "Publish"])}</span>
                    </button>
                    <button type="button" onClick={() => setEditing({ id: r.id, values: Object.fromEntries(resource.fields.map((f) => [f.name, (r[f.name] as string | number | boolean | null) ?? (f.type === "checkbox" ? false : "")])) })} title={tr(["Modifier", "Edit"])} className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-alt hover:text-heading"><Pencil className="size-4" aria-hidden="true" /><span className="sr-only">{tr(["Modifier", "Edit"])}</span></button>
                    {role === "admin" && (
                      <button type="button" onClick={() => remove(r)} title={tr(["Supprimer", "Delete"])} className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-fall-bg hover:text-fall"><Trash2 className="size-4" aria-hidden="true" /><span className="sr-only">{tr(["Supprimer", "Delete"])}</span></button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <p className="mt-3 text-xs text-muted">{shown.length} / {rows?.length ?? 0} {tr(["élément(s)", "item(s)"])}</p>

      {editing && <EditDrawer resource={resource} state={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function EditDrawer({ resource, state, onClose, onSaved }: { resource: Resource; state: { id: string | null; values: Values }; onClose: () => void; onSaved: () => void }) {
  const db = getBrowserClient();
  const { tr } = usePrefs();
  const isNew = state.id === null;
  const [values, setValues] = useState<Values>(state.values);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function set(name: string, v: string | number | boolean) {
    setValues((prev) => {
      const next = { ...prev, [name]: v };
      return resource.derive ? resource.derive(next, isNew) : next;
    });
  }

  async function upload(field: Field, file: File) {
    setError("");
    if (file.size > 25 * 1024 * 1024) return setError(tr(["Fichier trop lourd (25 Mo maximum).", "File too large (25 MB maximum)."]));
    setUploading(field.name);
    const safe = file.name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-");
    const path = `${field.folder ?? "divers"}/${new Date().getFullYear()}/${Date.now()}-${safe}`;
    const { error: e } = await db.storage.from("documents").upload(path, file, { contentType: file.type, upsert: false });
    setUploading(null);
    if (e) return setError(`${tr(["Envoi impossible", "Upload failed"])} : ${e.message}`);
    set(field.name, db.storage.from("documents").getPublicUrl(path).data.publicUrl);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const missing = resource.fields.filter((f) => f.required && f.type !== "checkbox" && !String(values[f.name] ?? "").trim());
    if (missing.length) return setError(`${tr(["Champs obligatoires", "Required fields"])} : ${missing.map((f) => tr(f.label)).join(", ")}.`);
    const payload: Record<string, unknown> = {};
    for (const f of resource.fields) {
      const v = values[f.name];
      if (f.type === "checkbox") payload[f.name] = Boolean(v);
      else if (f.type === "number") payload[f.name] = v === "" || v === null ? (f.required ? 0 : null) : Number(v);
      else payload[f.name] = typeof v === "string" && v.trim() === "" ? null : v;
    }
    for (const f of resource.fields) if (f.type === "number" && payload[f.name] === null && typeof resource.defaults[f.name] === "number") payload[f.name] = 0;
    setBusy(true);
    const { error: err } = isNew ? await db.from(resource.table).insert(payload) : await db.from(resource.table).update(payload).eq("id", state.id!);
    setBusy(false);
    if (err) {
      setError(err.code === "23505" ? tr(["Un élément avec la même référence existe déjà.", "An item with the same reference already exists."]) : err.code === "42501" ? tr(["Vous n’avez pas le droit d’enregistrer.", "You are not allowed to save."]) : err.message);
      return;
    }
    onSaved();
  }

  const title = `${isNew ? tr(["Ajouter", "Add"]) : tr(["Modifier", "Edit"])} : ${tr(resource.singular)}`;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-espresso/55 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form onSubmit={save} className="flex h-full w-full max-w-2xl flex-col bg-surface shadow-2xl" aria-label={title}>
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-serif-display text-2xl text-heading">{title}</h2>
          <button type="button" onClick={onClose} aria-label={tr(["Fermer", "Close"])} className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-alt"><X className="size-5" aria-hidden="true" /></button>
        </header>
        <div className="grid flex-1 content-start gap-x-4 gap-y-5 overflow-y-auto px-6 py-5 sm:grid-cols-2">
          {resource.fields.map((f) => {
            const id = `f-${f.name}`;
            const v = values[f.name];
            return (
              <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
                {f.type === "checkbox" ? (
                  <label className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm font-medium text-heading">
                    <input type="checkbox" checked={Boolean(v)} onChange={(e) => set(f.name, e.target.checked)} className="size-5 accent-[#c9a23a]" />
                    {tr(f.label)}
                  </label>
                ) : (
                  <>
                    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-heading">{tr(f.label)}{f.required && <span className="text-fall"> *</span>}</label>
                    {f.type === "textarea" ? (
                      <textarea id={id} rows={4} value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)} className={cn(inputCls, "h-auto py-2.5")} />
                    ) : f.type === "select" ? (
                      <select id={id} value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)} className={inputCls}>
                        {f.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : f.type === "date" ? (
                      <input id={id} type="date" value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)} className={inputCls} />
                    ) : f.type === "number" ? (
                      <input id={id} type="number" step="any" value={v === null ? "" : String(v)} onChange={(e) => set(f.name, e.target.value)} className={cn(inputCls, "figure")} />
                    ) : f.type === "file-url" ? (
                      <div>
                        <div className="flex gap-2">
                          <input id={id} value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)} placeholder={tr(["Lien https://… ou déposez un fichier", "https://… link or upload a file"])} className={inputCls} />
                          <label className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-line px-3.5 text-sm font-medium hover:border-brand-gold">
                            {uploading === f.name ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <FileUp className="size-4" aria-hidden="true" />}
                            {tr(["Fichier", "File"])}
                            <input type="file" accept={f.accept} className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(f, file); e.target.value = ""; }} />
                          </label>
                        </div>
                        {isImage(v) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={String(v)} alt="" className="mt-2 h-24 rounded-xl border border-line bg-white object-contain p-1" />
                        )}
                      </div>
                    ) : (
                      <input id={id} value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)} className={inputCls} />
                    )}
                  </>
                )}
                {f.help && <p className="mt-1 text-xs text-muted">{tr(f.help)}</p>}
              </div>
            );
          })}
        </div>
        <footer className="border-t border-line px-6 py-4">
          {error && <div className="mb-3"><Notice tone="error">{error}</Notice></div>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className={btnGhost}>{tr(["Annuler", "Cancel"])}</button>
            <button type="submit" disabled={busy || uploading !== null} className={btnGold}>
              {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {tr(["Enregistrer", "Save"])}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
