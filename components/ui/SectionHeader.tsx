import ScrollReveal from "./ScrollReveal";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: Props) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <ScrollReveal>
        <p className="h-eyebrow flex items-center gap-3 justify-start">
          <span className="inline-block w-8 h-px bg-flame" />
          {eyebrow}
        </p>
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <h2 className="h-display mt-6 text-5xl md:text-7xl lg:text-8xl text-balance">
          {title}
        </h2>
      </ScrollReveal>
      {subtitle && (
        <ScrollReveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg text-smoke text-pretty">
            {subtitle}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}
