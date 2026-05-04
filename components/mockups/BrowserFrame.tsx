import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  url?: string;
  className?: string;
};

export default function BrowserFrame({
  children,
  url = "atstudio.pt",
  className = "",
}: Props) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-white/10 shadow-2xl bg-ash-2 ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-ash border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <div className="ml-3 flex-1 max-w-xs rounded-md bg-white/5 px-3 py-1 text-[10px] md:text-xs text-smoke font-mono truncate">
          {url}
        </div>
      </div>
      <div className="aspect-[16/10] relative">{children}</div>
    </div>
  );
}
