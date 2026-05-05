import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";

type WebhookBody = {
  _type?: string;
  slug?: { current?: string } | string;
};

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, message: "Missing SANITY_REVALIDATE_SECRET" },
      { status: 500 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookBody>(
      req,
      secret,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { ok: false, message: "Invalid signature" },
        { status: 401 },
      );
    }

    const type = body?._type;
    if (!type) {
      return NextResponse.json(
        { ok: false, message: "Missing _type in payload" },
        { status: 400 },
      );
    }

    revalidateTag(type, "max");

    if (type === "project" && body.slug) {
      const slug =
        typeof body.slug === "string" ? body.slug : body.slug.current;
      if (slug) revalidateTag(`project:${slug}`, "max");
    }

    return NextResponse.json({ ok: true, revalidated: type, now: Date.now() });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
