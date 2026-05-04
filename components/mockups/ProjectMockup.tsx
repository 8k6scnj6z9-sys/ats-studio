import EcommerceMockup from "./EcommerceMockup";
import SaasMockup from "./SaasMockup";
import MobileAppMockup from "./MobileAppMockup";
import BrandingMockup from "./BrandingMockup";
import type { ProjectSlug } from "@/lib/projects";

type Props = { slug: ProjectSlug };

export default function ProjectMockup({ slug }: Props) {
  switch (slug) {
    case "norte-coffee":
      return <EcommerceMockup />;
    case "pulse-analytics":
      return <SaasMockup />;
    case "lume":
      return <MobileAppMockup />;
    case "atelier-marques":
      return <BrandingMockup />;
  }
}
