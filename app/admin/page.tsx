import Link from "next/link";
import { requireAdmin } from "@/lib/cms/auth";
import { listEntries } from "@/lib/cms/db";
import { entryTypes, type EntryType } from "@/lib/cms/schema";
import { logoutAction, moveEntryAction } from "./actions";

type AnyData = Record<string, unknown> & {
  name?: string;
  title?: { pt?: string };
  content?: { pt?: { title?: string } };
  pt?: { title?: string };
};

function entryTitle(data: AnyData, key: string) {
  return data.name ?? data.title?.pt ?? data.content?.pt?.title ?? data.pt?.title ?? key;
}

const publicPath: Partial<Record<EntryType, (key: string) => string>> = {
  project: (key) => `/pt/work/${key}`,
  processStep: (key) => `/pt/process/${key}`,
  resource: (key) => `/pt/recursos/${key}`,
  legalPage: (key) => `/pt/${key}`,
  siteSettings: () => "/pt",
};

export default async function AdminHome() {
  await requireAdmin();
  const types = Object.keys(entryTypes) as EntryType[];
  const lists = await Promise.all(types.map((type) => listEntries<AnyData>(type)));

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-flame">ATS Studio</p>
          <h1 className="font-display text-4xl">Conteúdos</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/pt" className="rounded-full border border-line px-4 py-2 text-sm hover:border-flame">
            Ver site
          </Link>
          <form action={logoutAction}>
            <button className="rounded-full border border-line px-4 py-2 text-sm hover:border-flame">Sair</button>
          </form>
        </div>
      </header>

      {types.map((type, i) => {
        const { label, singleton } = entryTypes[type];
        return (
          <section key={type} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">{label}</h2>
              {!singleton && (
                <Link
                  href={`/admin/${type}/new`}
                  className="rounded-full bg-flame px-4 py-1.5 text-sm font-medium text-ink hover:bg-paper"
                >
                  Novo
                </Link>
              )}
            </div>
            <ul className="divide-y divide-line rounded-lg border border-line">
              {lists[i].map((entry, index) => (
                <li key={entry.key} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <Link href={`/admin/${type}/${entry.key}`} className="font-medium hover:text-flame">
                      {entryTitle(entry.data, entry.key)}
                    </Link>
                    <p className="font-mono text-[11px] text-smoke">
                      {entry.key} · atualizado {entry.updatedAt} UTC
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {type !== "resource" && !singleton && (
                      <>
                        <form action={moveEntryAction.bind(null, type, entry.key, -1)}>
                          <button disabled={index === 0} aria-label="Subir" className="rounded px-2 py-1 hover:bg-ash disabled:opacity-30">↑</button>
                        </form>
                        <form action={moveEntryAction.bind(null, type, entry.key, 1)}>
                          <button disabled={index === lists[i].length - 1} aria-label="Descer" className="rounded px-2 py-1 hover:bg-ash disabled:opacity-30">↓</button>
                        </form>
                      </>
                    )}
                    {publicPath[type] && (
                      <a href={publicPath[type](entry.key)} target="_blank" rel="noreferrer" className="rounded px-2 py-1 text-smoke hover:text-paper">
                        Ver
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
