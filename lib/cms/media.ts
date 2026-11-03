import "server-only";
import { resolve } from "node:path";

export const mediaDir = resolve(/* turbopackIgnore: true */ process.env.MEDIA_DIR ?? "data/media");

export const mediaTypes: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
};

// SVG is excluded on purpose: it can carry scripts.
export function sniffImage(bytes: Uint8Array): string | null {
  const hex = Buffer.from(bytes.subarray(0, 12)).toString("hex");
  if (hex.startsWith("89504e47")) return "png";
  if (hex.startsWith("ffd8ff")) return "jpg";
  if (hex.startsWith("52494646") && hex.slice(16, 24) === "57454250") return "webp";
  if (hex.slice(8, 16) === "66747970" && /^(61766966|61766973)$/.test(hex.slice(16, 24))) return "avif";
  return null;
}
