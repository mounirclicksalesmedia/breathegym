"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const BRAND = "#ce8485";
const BRAND_DARK = "#a85a5b";
const GOLD = "#c9a47a";
const ROSE_LIGHT = "#ecc6c6";
const INK_MUTED = "#8a7d7c";

const STATUS_COLORS: Record<string, string> = {
  NEW: BRAND,
  CONTACTED: GOLD,
  CONVERTED: "#5fa97f",
  LOST: "#b9aeac",
};

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  CONVERTED: "Converted",
  LOST: "Lost",
};

type Props = {
  trend: { day: string; count: number }[];
  byPackage: { name: string; value: number }[];
  byStatus: { status: string; value: number }[];
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_20px_50px_-30px_rgba(168,90,91,0.3)]">
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      <div className="mt-4 h-64">{children}</div>
    </div>
  );
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #efe3df",
  boxShadow: "0 20px 40px -20px rgba(168,90,91,0.35)",
  fontSize: 13,
};

export function OverviewCharts({ trend, byPackage, byStatus }: Props) {
  const statusData = byStatus.map((s) => ({
    ...s,
    label: STATUS_LABELS[s.status] ?? s.status,
  }));

  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-2">
      <div className="xl:col-span-2">
        <Card title="Leads — last 30 days">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BRAND} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={BRAND} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={ROSE_LIGHT} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: INK_MUTED }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={28}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: INK_MUTED }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="count"
                name="Leads"
                stroke={BRAND_DARK}
                strokeWidth={2.5}
                fill="url(#leadFill)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Leads by package (30 days)">
        {byPackage.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byPackage} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={ROSE_LIGHT} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: INK_MUTED }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: INK_MUTED }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(206,132,133,0.08)" }} />
              <Bar dataKey="value" name="Leads" radius={[8, 8, 0, 0]} maxBarSize={48}>
                {byPackage.map((_, i) => (
                  <Cell key={i} fill={[BRAND, GOLD, BRAND_DARK, ROSE_LIGHT, INK_MUTED][i % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card title="Lead status breakdown">
        {statusData.every((s) => s.value === 0) || statusData.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="label"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={3}
                strokeWidth={0}
              >
                {statusData.map((s) => (
                  <Cell key={s.status} fill={STATUS_COLORS[s.status] ?? INK_MUTED} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}

function Empty() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted">
      No data yet — leads will appear here.
    </div>
  );
}
