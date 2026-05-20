"use client";

import { useEffect, useState } from "react";

export default function StudioPage() {
  const [Studio, setStudio] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadStudio() {
      const [{ NextStudio }, { default: config }] = await Promise.all([
        import("next-sanity/studio"),
        import("@/sanity.config"),
      ]);

      if (!mounted) return;
      setStudio(() => function MountedStudio() {
        return <NextStudio config={config} />;
      });
    }

    void loadStudio();

    return () => {
      mounted = false;
    };
  }, []);

  if (!Studio) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink px-6 text-paper">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-smoke">
          A carregar Sanity Studio...
        </p>
      </div>
    );
  }

  return <Studio />;
}
