import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Read from public/ on disk (never via request.url, which is 0.0.0.0 behind the proxy).
const asset = (path: string) => readFile(join(/* turbopackIgnore: true */ process.cwd(), "public", path));

type OgInput = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer: string;
  palette?: string[];
};

export async function renderOg({ eyebrow, title, subtitle, footer, palette }: OgInput) {
  const [fraunces, frauncesItalic, inter, interMedium, mark] = await Promise.all([
    asset("fonts/fraunces-latin-400-normal.woff"),
    asset("fonts/fraunces-latin-400-italic.woff"),
    asset("fonts/inter-latin-400-normal.woff"),
    asset("fonts/inter-latin-500-normal.woff"),
    asset("logos/logo-mark-white.png"),
  ]);
  const titleSize = title.length > 60 ? 64 : title.length > 36 ? 76 : 92;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`data:image/png;base64,${mark.toString("base64")}`} width={56} height={56} alt="" />
            <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 40 }}>
              ATS<span style={{ color: "#ff5a1f" }}>.</span>Studio
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 4, textTransform: "uppercase", color: "#ff5a1f", fontWeight: 500 }}>
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", width: 96, height: 4, background: "#ff5a1f" }} />
          <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: titleSize, lineHeight: 1.02, maxWidth: 1050 }}>
            {title}
          </div>
          {subtitle ? (
            <div style={{ display: "flex", fontSize: 30, lineHeight: 1.35, color: "rgba(255,255,255,0.68)", maxWidth: 980 }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.55)" }}>{footer}</div>
          {palette?.length ? (
            <div style={{ display: "flex", gap: 10 }}>
              {palette.slice(0, 5).map((color) => (
                <div
                  key={color}
                  style={{ display: "flex", width: 44, height: 44, borderRadius: 10, background: color, border: "1px solid rgba(255,255,255,0.18)" }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 400, style: "normal" },
        { name: "Fraunces", data: frauncesItalic, weight: 400, style: "italic" },
        { name: "Inter", data: inter, weight: 400, style: "normal" },
        { name: "Inter", data: interMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
