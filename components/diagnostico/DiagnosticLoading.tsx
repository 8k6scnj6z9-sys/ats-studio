"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  copy: Dictionary["diagnosticPage"]["loading"];
};

export default function DiagnosticLoading({ copy }: Props) {
  const [index, setIndex] = useState(0);
  const messages = copy.messages;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => Math.min(current + 1, messages.length - 1));
    }, 1800);

    return () => window.clearInterval(interval);
  }, [messages.length]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-line bg-ash p-5 md:p-7"
    >
      <div className="flex items-center gap-4">
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-line">
          <span className="absolute h-2 w-2 rounded-full bg-flame" />
          <span className="absolute h-8 w-8 animate-ping rounded-full border border-flame/70" />
        </span>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-flame">
            {copy.title}
          </p>
          <p className="mt-2 text-sm text-paper/72">{messages[index]}</p>
        </div>
      </div>
    </div>
  );
}
