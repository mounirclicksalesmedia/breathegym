import { Users, UserPlus, TrendingUp, Package2 } from "lucide-react";
import { prisma } from "@/app/lib/db";
import { OverviewCharts } from "../components/OverviewCharts";

export const dynamic = "force-dynamic";

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function AdminOverviewPage() {
  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [totalLeads, newThisWeek, convertedCount, activePackages, recentLeads, byStatus] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.lead.count({ where: { status: "CONVERTED" } }),
      prisma.package.count({ where: { active: true } }),
      prisma.lead.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, packageLabel: true },
      }),
      prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);

  // 30-day trend buckets
  const trendMap = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    trendMap.set(dayKey(d), 0);
  }
  for (const lead of recentLeads) {
    const key = dayKey(lead.createdAt);
    if (trendMap.has(key)) trendMap.set(key, (trendMap.get(key) ?? 0) + 1);
  }
  const trend = [...trendMap.entries()].map(([date, count]) => ({
    day: new Date(date + "T00:00:00").toLocaleDateString("en", { month: "short", day: "numeric" }),
    count,
  }));

  // leads by package (last 30 days)
  const pkgMap = new Map<string, number>();
  for (const lead of recentLeads) {
    const label = lead.packageLabel ?? "Free Trial";
    pkgMap.set(label, (pkgMap.get(label) ?? 0) + 1);
  }
  const byPackage = [...pkgMap.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const statusData = byStatus.map((s) => ({ status: s.status, value: s._count._all }));

  const conversionRate = totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0;

  const stats = [
    { label: "Total leads", value: totalLeads.toLocaleString(), icon: Users },
    { label: "New this week", value: newThisWeek.toLocaleString(), icon: UserPlus },
    { label: "Conversion rate", value: `${conversionRate}%`, icon: TrendingUp },
    { label: "Active packages", value: activePackages.toLocaleString(), icon: Package2 },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Leads &amp; packages at a glance — last 30 days.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-surface p-5 shadow-[0_20px_50px_-30px_rgba(168,90,91,0.3)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Icon className="h-5 w-5" />
            </div>
            <div className="mt-4 text-3xl font-extrabold tabular-nums text-foreground">{value}</div>
            <div className="mt-1 text-[13px] font-medium text-muted">{label}</div>
          </div>
        ))}
      </div>

      <OverviewCharts trend={trend} byPackage={byPackage} byStatus={statusData} />
    </div>
  );
}
