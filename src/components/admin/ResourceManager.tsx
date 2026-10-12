"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, Eye, EyeOff, FileUp, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/browser";
import type { Field, Resource, Values } from "./resources";
import { cn } from "@/lib/cn";

type Row = Record<string, unknown> & { id: string; published: boolean };

const input = "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30";

function fmtDate(v: unknown) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v) ? new Date(v + "T00:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : String(v ?? "");
}

export function ResourceManager({ resource, role }: { resource: Resource; role: string }) {
  const db = getBrowserClient();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<{ id: string | null; values: Values } | null>(null);

  const load = useCallback(async () => {
    const { data, error: e } = await db.from(resource.table).select("*").order(resource.orderBy, { ascending: false }).limit(1000);
    if (e) setError(e.message);
    else setRows(data as Row[]);
  }, [db, resource.table, resource.orderBy]);

  useEffect(() => {
    let live = true;
    db.from(resource.table).select("*").order(resource.orderBy, { ascending: false }).limit(1000).then(({ data, error: e }) => {
      if (!live) return;
      if (e) setError(e.message);
      else setRows(data as Row[]);
    });
    return () => {
      live = false;
    };
  }, [db, resource.table, resource.orderBy]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter((r) => !q || resource.columns.some((c) => String(r[c.name] ?? "").toLowerCase().includes(q)));
  }, [rows, query, resource.columns]);

  async function togglePublished(r: Row) {
    const { error: e } = await db.from(resource.table).update({ published: !r.published }).eq("id", r.id);
    if (e) setError(e.message);
    else load();
  }

  async function remove(r: Row) {
    if (!confirm(`Supprimer définitivement cet élément ?\n\n${String(r[resource.columns[1]?.name ?? "id"] ?? r.id)}`)) return;
    const { error: e } = await db.from(resource.table).delete().eq("id", r.id);
    if (e) setError(e.message);
    else load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-serif-display text-3xl text-heading">{resource.label}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">{resource.hint}</p>
        </div>
        <button type="button" onClick={() => setEditing({ id: null, values: { ...resource.defaults } })} className="inline-flex h-11 items-center gap-2 rounded-full bg-action px-5 text-sm font-medium text-action-text hover:bg-action-hover">
          <Plus className="size-4" aria-hidden="true" /> Nouveau {resource.singular}
        </button>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher…" aria-label="Rechercher" className={cn(input, "pl-10")} />
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-fall-bg px-4 py-3 text-sm text-fall">{error}</p>}

      <div className="mt-5 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
        {rows === null ? (
          <p className="flex items-center gap-2 p-6 text-sm text-muted"><Loader2 className="size-4 animate-spin" aria-hidden="true" /> Chargement…</p>
        ) : shown.length === 0 ? (
          <p className="p-6 text-sm text-muted">Aucun élément.</p>
        ) : (
          <ul className="divide-y divide-line">
            {shown.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 hover:bg-surface-alt/60">
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", r.published ? "bg-rise-bg text-rise" : "bg-surface-alt text-muted")}>{r.published ? "Publié" : "Brouillon"}</span>
                <span className="figure w-28 shrink-0 text-sm text-muted">{fmtDate(r[resource.columns[0].name])}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-heading">{String(r[resource.columns[1].name] ?? "")}</span>
                {resource.columns[2] && <span className="hidden text-xs text-muted md:block">{String(r[resource.columns[2].name] ?? "")}</span>}
                <span className="flex items-center gap-1">
                  {typeof r.url === "string" && r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" title="Ouvrir le fichier" className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-alt hover:text-heading"><ExternalLink className="size-4" aria-hidden="true" /><span className="sr-only">Ouvrir le fichier</span></a>
                  )}
                  <button type="button" onClick={() => togglePublished(r)} title={r.published ? "Dépublier" : "Publier"} className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-alt hover:text-heading">
                    {r.published ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                    <span className="sr-only">{r.published ? "Dépublier" : "Publier"}</span>
                  </button>
                  <button type="button" onClick={() => setEditing({ id: r.id, values: Object.fromEntries(resource.fields.map((f) => [f.name, (r[f.name] as string | boolean | null) ?? (f.type === "checkbox" ? false : "")])) })} title="Modifier" className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-alt hover:text-heading"><Pencil className="size-4" aria-hidden="true" /><span className="sr-only">Modifier</span></button>
                  {role === "admin" && (
                    <button type="button" onClick={() => remove(r)} title="Supprimer" className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-fall-bg hover:text-fall"><Trash2 className="size-4" aria-hidden="true" /><span className="sr-only">Supprimer</span></button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-3 text-xs text-muted">{rows?.length ?? 0} élément(s). Les modifications apparaissent sur le site en quelques minutes.</p>

      {editing && <EditDrawer resource={resource} state={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function EditDrawer({ resource, state, onClose, onSaved }: { resource: Resource; state: { id: string | null; values: Values }; onClose: () => void; onSaved: () => void }) {
  const db = getBrowserClient();
  const isNew = state.id === null;
  const [values, setValues] = useState<Values>(state.values);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");

  function set(name: string, v: string | boolean) {
    setValues((prev) => {
      const next = { ...prev, [name]: v };
      return resource.derive ? resource.derive(next, isNew) : next;
    });
  }

  async function upload(field: Field, file: File) {
    setError("");
    setUploading(field.name);
    const safe = file.name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-");
    const path = `${field.folder ?? "divers"}/${new Date().getFullYear()}/${Date.now()}-${safe}`;
    const { error: e } = await db.storage.from("documents").upload(path, file, { contentType: file.type, upsert: false });
    setUploading(null);
    if (e) return setError(`Envoi impossible : ${e.message}`);
    set(field.name, db.storage.from("documents").getPublicUrl(path).data.publicUrl);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const missing = resource.fields.filter((f) => f.required && f.type !== "checkbox" && !String(values[f.name] ?? "").trim());
    if (missing.length) return setError(`Champs obligatoires : ${missing.map((f) => f.label).join(", ")}.`);
    const payload: Record<string, unknown> = {};
    for (const f of resource.fields) {
      const v = values[f.name];
      payload[f.name] = f.type === "checkbox" ? Boolean(v) : typeof v === "string" && v.trim() === "" ? null : v;
    }
    if (isNew && !payload.slug && resource.fields.some((f) => f.name === "slug")) delete payload.slug;
    setBusy(true);
    const { error: err } = isNew ? await db.from(resource.table).insert(payload) : await db.from(resource.table).update(payload).eq("id", state.id!);
    setBusy(false);
    if (err) {
      setError(err.code === "23505" ? "Un élément avec la même référence existe déjà." : err.code === "42501" || err.code === "PGRST301" ? "Vous n’avez pas le droit d’enregistrer." : err.message);
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-espresso/50 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form onSubmit={save} className="flex h-full w-full max-w-xl flex-col bg-surface shadow-2xl" aria-label={isNew ? `Nouveau ${resource.singular}` : `Modifier ${resource.singular}`}>
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <h3 className="font-serif-display text-2xl text-heading">{isNew ? `Nouveau ${resource.singular}` : `Modifier ${resource.singular}`}</h3>
          <button type="button" onClick={onClose} aria-label="Fermer" className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-alt"><X className="size-5" aria-hidden="true" /></button>
        </header>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {resource.fields.map((f) => {
            const id = `f-${f.name}`;
            const v = values[f.name];
            return (
              <div key={f.name}>
                {f.type === "checkbox" ? (
                  <label className="flex items-center gap-3 text-sm font-medium text-heading">
                    <input type="checkbox" checked={Boolean(v)} onChange={(e) => set(f.name, e.target.checked)} className="size-5 accent-[#c9a23a]" />
                    {f.label}
                  </label>
                ) : (
                  <>
                    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-heading">{f.label}{f.required && <span className="text-fall"> *</span>}</label>
                    {f.type === "textarea" ? (
                      <textarea id={id} rows={4} value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30" />
                    ) : f.type === "select" ? (
                      <select id={id} value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)} className={input}>
                        {f.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : f.type === "date" ? (
                      <input id={id} type="date" value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)} className={input} />
                    ) : f.type === "file-url" ? (
                      <div className="flex gap-2">
                        <input id={id} value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)} placeholder="https://… ou déposez un fichier" className={input} />
                        <label className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-line px-3.5 text-sm font-medium hover:border-brand-gold">
                          {uploading === f.name ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <FileUp className="size-4" aria-hidden="true" />}
                          Fichier
                          <input type="file" accept={f.accept} className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(f, file); e.target.value = ""; }} />
                        </label>
                      </div>
                    ) : (
                      <input id={id} value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)} className={input} />
                    )}
                  </>
                )}
                {f.help && <p className="mt-1 text-xs text-muted">{f.help}</p>}
              </div>
            );
          })}
        </div>
        <footer className="border-t border-line px-6 py-4">
          {error && <p role="alert" className="mb-3 rounded-xl bg-fall-bg px-3.5 py-2.5 text-sm text-fall">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="h-11 rounded-full border border-line px-5 text-sm font-medium hover:border-line-strong">Annuler</button>
            <button type="submit" disabled={busy || uploading !== null} className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-gold px-6 text-sm font-semibold text-espresso hover:bg-brand-gold-light disabled:opacity-50">
              {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              Enregistrer
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
