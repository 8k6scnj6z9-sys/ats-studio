"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteEntryAction, saveEntryAction } from "@/app/admin/actions";
import { blank, enums, fieldLabels, imageFields } from "@/lib/cms/schema";

type Shape = string | number | Shape[] | { [key: string]: Shape };
type Value = unknown;

const longFields = new Set([
  "description", "longDescription", "intro", "conclusion", "text", "before", "after", "tagline",
  "seoDescription",
]);

const inputClass =
  "w-full rounded-md border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-flame focus:outline-none";

function label(key: string) {
  return fieldLabels[key] ?? key;
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [status, setStatus] = useState("");

  async function upload(file: File) {
    setStatus("A enviar…");
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (res.ok && json.url) {
      onChange(json.url);
      setStatus("");
    } else {
      setStatus(json.error ?? "Falha no envio");
    }
  }

  return (
    <div className="space-y-2">
      <input aria-label={`${label}: caminho`} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} placeholder="/media/…" />
      <input
        aria-label={`${label}: enviar ficheiro`}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        title="PNG, JPEG, WebP ou AVIF até 8 MB; é convertida para WebP com no máximo 2400 px"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        className="text-xs text-smoke file:mr-3 file:rounded-full file:border-0 file:bg-ash file:px-3 file:py-1 file:text-paper"
      />
      {status && <p className="text-xs text-flame">{status}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="max-h-40 rounded border border-line" />
      )}
    </div>
  );
}

function Field({ name, shape, value, onChange }: { name: string; shape: Shape; value: Value; onChange: (v: Value) => void }) {
  if (Array.isArray(shape)) {
    const items = Array.isArray(value) ? value : [];
    const item = shape[0];
    if (typeof item === "string") {
      return (
        <label className="block space-y-1">
          <span className="text-xs text-paper/70">{label(name)} · um por linha</span>
          <textarea
            className={inputClass}
            rows={Math.max(3, items.length + 1)}
            value={(items as string[]).join("\n")}
            onChange={(e) => onChange(e.target.value.split("\n"))}
          />
        </label>
      );
    }
    const move = (from: number, to: number) => {
      const next = [...items];
      [next[from], next[to]] = [next[to], next[from]];
      onChange(next);
    };
    return (
      <fieldset className="space-y-3 rounded-lg border border-line p-3">
        <legend className="px-1 text-xs uppercase tracking-wider text-flame">{label(name)}</legend>
        {items.map((entry, i) => (
          <div key={i} className="space-y-3 rounded-md border border-line/60 bg-ash/40 p-3">
            <div className="flex justify-end gap-1 text-xs">
              <button type="button" disabled={i === 0} onClick={() => move(i, i - 1)} className="rounded px-2 py-1 hover:bg-ash disabled:opacity-30" aria-label="Subir">↑</button>
              <button type="button" disabled={i === items.length - 1} onClick={() => move(i, i + 1)} className="rounded px-2 py-1 hover:bg-ash disabled:opacity-30" aria-label="Descer">↓</button>
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="rounded px-2 py-1 text-smoke hover:text-flame">Remover</button>
            </div>
            <Field name={`${i + 1}`} shape={item} value={entry} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, blank(item)])} className="rounded-full border border-line px-3 py-1 text-xs hover:border-flame">
          + Adicionar
        </button>
      </fieldset>
    );
  }

  if (typeof shape === "object") {
    const obj = (value && typeof value === "object" ? value : {}) as Record<string, Value>;
    const fields = Object.entries(shape).map(([key, sub]) => (
      <Field key={key} name={key} shape={sub} value={obj[key] ?? blank(sub)} onChange={(v) => onChange({ ...obj, [key]: v })} />
    ));
    // Show PT and EN side by side on wide screens.
    const bilingual = "pt" in shape && "en" in shape;
    return (
      <fieldset className="space-y-3 rounded-lg border border-line p-3">
        {!/^\d+$/.test(name) && name && <legend className="px-1 text-xs uppercase tracking-wider text-flame">{label(name)}</legend>}
        <div className={bilingual ? "grid gap-3 lg:grid-cols-2" : "space-y-3"}>{fields}</div>
      </fieldset>
    );
  }

  if (typeof shape === "number") {
    return (
      <label className="block space-y-1">
        <span className="text-xs text-paper/70">{label(name)}</span>
        <input type="number" className={inputClass} value={Number(value ?? 0)} onChange={(e) => onChange(Number(e.target.value))} />
      </label>
    );
  }

  const text = typeof value === "string" ? value : "";
  if (imageFields.has(name)) {
    return (
      <div role="group" aria-label={label(name)} className="space-y-1">
        <span className="text-xs text-paper/70">{label(name)}</span>
        <ImageField label={label(name)} value={text} onChange={onChange} />
      </div>
    );
  }
  return (
    <label className="block space-y-1">
      <span className="text-xs text-paper/70">{label(name)}</span>
      {enums[name] ? (
        <select className={inputClass} value={text} onChange={(e) => onChange(e.target.value)}>
          {enums[name].map((option) => (
            <option key={option} value={option}>{option || "—"}</option>
          ))}
        </select>
      ) : longFields.has(name) || text.length > 90 ? (
        <textarea className={inputClass} rows={Math.min(12, Math.max(3, Math.ceil(text.length / 80)))} value={text} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={inputClass} value={text} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export default function EntryEditor({
  type,
  entryKey,
  shape,
  initial,
  canDelete,
}: {
  type: string;
  entryKey: string | null;
  shape: Shape;
  initial: Value;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState<Value>(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await saveEntryAction(type, entryKey, JSON.stringify(data));
      setErrors(result.errors);
      setSaved(result.errors.length === 0);
      if (result.key && result.key !== entryKey) router.replace(`/admin/${type}/${result.key}`);
      else router.refresh();
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      onChange={() => setSaved(false)}
      className="space-y-4"
    >
      <Field name="" shape={shape} value={data} onChange={setData} />

      {errors.length > 0 && (
        <ul role="alert" className="space-y-1 rounded-lg border border-flame/50 bg-flame/10 p-3 text-sm text-flame">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-ink/95 px-4 py-3 backdrop-blur">
        <button disabled={pending} className="rounded-full bg-flame px-5 py-2 text-sm font-medium text-ink hover:bg-paper disabled:opacity-60">
          {pending ? "A publicar…" : "Publicar"}
        </button>
        {saved && <span role="status" className="text-sm text-paper/80">Publicado. Já está visível no site.</span>}
        {canDelete && entryKey && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Apagar este conteúdo? Esta ação não se pode desfazer.")) {
                startTransition(() => deleteEntryAction(type, entryKey));
              }
            }}
            className="ml-auto rounded-full border border-line px-4 py-2 text-sm text-smoke hover:border-flame hover:text-flame"
          >
            Apagar
          </button>
        )}
      </div>

    </form>
  );
}
