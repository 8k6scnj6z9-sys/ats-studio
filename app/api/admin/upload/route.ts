import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { isAdmin } from "@/lib/cms/auth";
import { mediaDir, sniffImage } from "@/lib/cms/media";

const MAX_BYTES = 8 * 1024 * 1024;
// Largest edge kept: enough for full-width case images on retina screens.
const MAX_EDGE = 2400;

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });

  const file = (await request.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Ficheiro em falta" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Máximo 8 MB" }, { status: 413 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = sniffImage(bytes);
  if (!ext) return NextResponse.json({ error: "Só PNG, JPEG, WebP ou AVIF" }, { status: 415 });

  // Re-encode to WebP: smaller files, EXIF (e.g. GPS) stripped, orientation applied.
  let output: Buffer;
  try {
    output = await sharp(bytes, { limitInputPixels: 50_000_000 })
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return NextResponse.json({ error: "Imagem inválida ou corrompida" }, { status: 415 });
  }

  // Content-addressed names: re-uploading the same image reuses the same file.
  const name = `${createHash("sha256").update(output).digest("hex").slice(0, 24)}.webp`;
  await mkdir(mediaDir, { recursive: true });
  await writeFile(join(/* turbopackIgnore: true */ mediaDir, name), output);
  return NextResponse.json({ url: `/media/${name}` });
}
