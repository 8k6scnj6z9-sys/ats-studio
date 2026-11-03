import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin · ATS Studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="min-h-full bg-ink text-paper antialiased">
        <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">{children}</main>
      </body>
    </html>
  );
}
