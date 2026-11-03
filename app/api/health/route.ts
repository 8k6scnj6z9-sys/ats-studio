import { access, constants, mkdir } from "node:fs/promises";
import { checkDatabase } from "@/lib/cms/db";
import { mediaDir } from "@/lib/cms/media";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, "ok" | "erro"> = { database: "ok", media: "ok" };
  try {
    await checkDatabase();
  } catch {
    checks.database = "erro";
  }
  try {
    await mkdir(mediaDir, { recursive: true });
    await access(mediaDir, constants.R_OK | constants.W_OK);
  } catch {
    checks.media = "erro";
  }
  const ok = Object.values(checks).every((value) => value === "ok");
  return Response.json(
    { status: ok ? "ok" : "erro", checks },
    { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
