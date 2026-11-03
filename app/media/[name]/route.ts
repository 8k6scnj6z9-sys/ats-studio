import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { mediaDir, mediaTypes } from "@/lib/cms/media";

export async function GET(_: Request, { params }: RouteContext<"/media/[name]">) {
  const { name } = await params;
  const match = /^[a-f0-9]{24}\.(png|jpg|webp|avif)$/.exec(name);
  if (!match) return new Response("Not found", { status: 404 });
  try {
    const body = await readFile(join(/* turbopackIgnore: true */ mediaDir, name));
    return new Response(body, {
      headers: {
        "Content-Type": mediaTypes[match[1]],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
