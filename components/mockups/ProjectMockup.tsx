import Image from "next/image";
import EcommerceMockup from "./EcommerceMockup";
import SaasMockup from "./SaasMockup";
import MobileAppMockup from "./MobileAppMockup";
import BrandingMockup from "./BrandingMockup";
import { urlFor } from "@/lib/sanity";
import type { Project } from "@/lib/projects";
import type { Locale } from "@/lib/i18n";

type Props = {
  project: Pick<Project, "slug" | "image" | "imageAlt" | "name">;
  locale?: Locale;
};

export default function ProjectMockup({ project, locale = "pt" }: Props) {
  if (project.image) {
    const url = urlFor(project.image)
      .width(1600)
      .height(1200)
      .fit("crop")
      .auto("format")
      .url();
    const alt =
      (locale === "en"
        ? project.imageAlt?.en
        : project.imageAlt?.pt) || project.name;
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-line">
        <Image
          src={url}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  switch (project.slug) {
    case "norte-coffee":
      return <EcommerceMockup />;
    case "pulse-analytics":
      return <SaasMockup />;
    case "lume":
      return <MobileAppMockup />;
    case "atelier-marques":
      return <BrandingMockup />;
    default:
      return (
        <div className="aspect-[4/3] w-full bg-gradient-to-br from-line to-ink/40 flex items-center justify-center">
          <span className="font-mono text-xs uppercase tracking-widest text-smoke/50">
            {project.name}
          </span>
        </div>
      );
  }
}
