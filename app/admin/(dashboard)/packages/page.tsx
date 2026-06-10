import { prisma } from "@/app/lib/db";
import { PackagesManager, type PackageRow } from "../../components/PackagesManager";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { leads: true } } },
  });

  const rows: PackageRow[] = packages.map((p) => ({
    id: p.id,
    slug: p.slug,
    nameAr: p.nameAr,
    nameEn: p.nameEn,
    durationAr: p.durationAr,
    durationEn: p.durationEn,
    priceSar: p.priceSar,
    featured: p.featured,
    active: p.active,
    sortOrder: p.sortOrder,
    features: (p.features as { ar: string; en: string }[]) ?? [],
    leadCount: p._count.leads,
  }));

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">Packages</h1>
      <p className="mt-1 text-sm text-muted">
        Changes here go live on the landing page immediately.
      </p>
      <PackagesManager rows={rows} />
    </div>
  );
}
