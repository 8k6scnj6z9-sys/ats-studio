import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ATS Studio",
    short_name: "ATS Studio",
    description:
      "Web design, development, branding and digital direction from Guarda, Portugal.",
    start_url: "/pt",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#ff5a1f",
    icons: [
      {
        src: "/favicon2.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
