import "server-only";
import { prisma } from "./db";
import { content } from "./content";
import type { LandingPackage } from "./landing-types";

type Bilingual = { ar: string; en: string };
export type PackageDTO = LandingPackage;

function staticPackages(): PackageDTO[] {
  return content.packages.items.map((item) => ({
    id: null,
    slug: item.id,
    name: { ...item.name },
    duration: { ...item.duration },
    priceSar: Number(item.price.replace(/,/g, "")),
    featured: item.featured,
    features: item.features.map((f) => ({ ...f })),
  }));
}

/** Active packages for the landing page; falls back to the static content
 *  if the database is empty or unreachable so the site never breaks. */
export async function getActivePackages(): Promise<PackageDTO[]> {
  try {
    const rows = await prisma.package.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return staticPackages();
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: { ar: r.nameAr, en: r.nameEn },
      duration: { ar: r.durationAr, en: r.durationEn },
      priceSar: r.priceSar,
      featured: r.featured,
      features: (r.features as Bilingual[]) ?? [],
    }));
  } catch (e) {
    console.error("getActivePackages: falling back to static content", e);
    return staticPackages();
  }
}
