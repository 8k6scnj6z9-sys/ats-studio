import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/cms/auth";
import { mediaDir, sniffImage } from "@/lib/cms/media";

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });

  const file = (await request.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Ficheiro em falta" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Máximo 8 MB" }, { status: 413 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = sniffImage(bytes);
  if (!ext) return NextResponse.json({ error: "Só PNG, JPEG, WebP ou AVIF" }, { status: 415 });

  // Content-addressed names: re-uploading the same image reuses the same file.
  const name = `${createHash("sha256").update(bytes).digest("hex").slice(0, 24)}.${ext}`;
  await mkdir(mediaDir, { recursive: true });
  await writeFile(join(/* turbopackIgnore: true */ mediaDir, name), bytes);
  return NextResponse.json({ url: `/media/${name}` });
}
