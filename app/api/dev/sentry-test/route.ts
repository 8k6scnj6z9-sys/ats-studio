import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  Sentry.captureException(new Error("ATS Studio Sentry test"));
  await Sentry.flush(2000);

  return NextResponse.json({ ok: true });
}
