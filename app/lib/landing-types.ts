/** Serializable package shape shared between server pages and client components. */
export type LandingPackage = {
  id: string | null;
  slug: string;
  name: { ar: string; en: string };
  duration: { ar: string; en: string };
  priceSar: number;
  featured: boolean;
  features: { ar: string; en: string }[];
};
