import Link from "next/link";
import { notFound } from "next/navigation";
import EntryEditor from "@/components/admin/EntryEditor";
import { requireAdmin } from "@/lib/cms/auth";
import { getEntry } from "@/lib/cms/db";
import { blank, entryTypes, type EntryType } from "@/lib/cms/schema";

export default async function EditEntryPage({ params }: PageProps<"/admin/[type]/[key]">) {
  await requireAdmin();
  const { type, key } = await params;
  if (!Object.hasOwn(entryTypes, type)) notFound();
  const config = entryTypes[type as EntryType];

  const isNew = key === "new";
  if (isNew && config.singleton) notFound();
  const entry = isNew ? undefined : await getEntry(type as EntryType, key);
  if (!isNew && !entry) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin" className="text-sm text-smoke hover:text-paper">
        ← Conteúdos
      </Link>
      <h1 className="font-display text-3xl">
        {config.label} · {isNew ? "novo" : key}
      </h1>
      <EntryEditor
        type={type}
        entryKey={isNew ? null : key}
        shape={config.shape}
        initial={entry?.data ?? blank(config.shape)}
        canDelete={!config.singleton && !isNew}
      />
    </div>
  );
}
