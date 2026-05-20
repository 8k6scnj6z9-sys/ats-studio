type Props = {
  items: string[];
  separator?: string;
  className?: string;
  slow?: boolean;
};

export default function Marquee({
  items,
  separator = "✦",
  className = "",
  slow = false,
}: Props) {
  const stream = (
    <div className="flex shrink-0 items-center gap-12 px-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-12">
          <span className="font-display text-5xl md:text-7xl tracking-tight whitespace-nowrap">
            {item}
          </span>
          <span className="text-flame text-3xl md:text-5xl">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden
      className={`relative w-full overflow-hidden border-y border-line py-6 ${className}`}
    >
      <div
        className={`flex w-max ${slow ? "animate-[marquee_60s_linear_infinite]" : "animate-[marquee_30s_linear_infinite]"}`}
      >
        {stream}
        {stream}
      </div>
    </div>
  );
}
