import { prisma } from "@/app/lib/db";
import { LeadsTable, type LeadRow } from "../../components/LeadsTable";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const rows: LeadRow[] = leads.map((l) => ({
    id: l.id,
    name: l.name,
    phone: l.phone,
    status: l.status,
    packageLabel: l.packageLabel ?? "Free Trial",
    notes: l.notes ?? "",
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">Leads</h1>
      <p className="mt-1 text-sm text-muted">
        Every request from the landing page form — update the status as you follow up.
      </p>
      <LeadsTable rows={rows} />
    </div>
  );
}
