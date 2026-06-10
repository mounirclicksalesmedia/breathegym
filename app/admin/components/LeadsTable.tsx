"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, Trash2, MessageCircle, Loader2 } from "lucide-react";
import { updateLeadStatus, deleteLead } from "../actions";

export type LeadRow = {
  id: string;
  name: string;
  phone: string;
  status: string;
  packageLabel: string;
  notes: string;
  createdAt: string;
};

const STATUSES = ["NEW", "CONTACTED", "CONVERTED", "LOST"] as const;

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-brand-50 text-brand-700 border-brand-200",
  CONTACTED: "bg-[#f7efe3] text-[#8a6b3f] border-[#e7d6b8]",
  CONVERTED: "bg-[#e9f4ee] text-[#3c7a58] border-[#cae4d5]",
  LOST: "bg-[#f1edec] text-[#7d7170] border-[#e0d8d6]",
};

export function LeadsTable({ rows }: { rows: LeadRow[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.packageLabel.toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: rows.length };
    for (const s of STATUSES) c[s] = rows.filter((r) => r.status === s).length;
    return c;
  }, [rows]);

  const onStatusChange = (id: string, status: string) => {
    setBusyId(id);
    startTransition(async () => {
      await updateLeadStatus(id, status);
      setBusyId(null);
    });
  };

  const onDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete lead "${name}"? This cannot be undone.`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteLead(id);
      setBusyId(null);
    });
  };

  return (
    <div className="mt-8">
      {/* filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["ALL", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                statusFilter === s
                  ? "bg-brand text-white shadow-[0_10px_24px_-10px_rgba(206,132,133,0.9)]"
                  : "border border-border bg-surface text-foreground/70 hover:border-brand-200 hover:text-brand-700"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              <span className="ml-1.5 tabular-nums opacity-70">{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="relative md:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, package…"
            className="w-full rounded-full border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
        </div>
      </div>

      {/* table */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_20px_50px_-30px_rgba(168,90,91,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-background/60 text-[12px] uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5 font-semibold">Name</th>
                <th className="px-5 py-3.5 font-semibold">Phone</th>
                <th className="px-5 py-3.5 font-semibold">Package</th>
                <th className="px-5 py-3.5 font-semibold">Received</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted">
                    No leads match.
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-brand-50/40">
                  <td className="px-5 py-4 font-semibold text-foreground">{r.name}</td>
                  <td className="px-5 py-4">
                    <span dir="ltr" className="tabular-nums text-foreground/80">{r.phone}</span>
                  </td>
                  <td className="px-5 py-4 text-foreground/80">{r.packageLabel}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-muted">
                    {new Date(r.createdAt).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {new Date(r.createdAt).toLocaleTimeString("en", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={r.status}
                        disabled={pending && busyId === r.id}
                        onChange={(e) => onStatusChange(r.id, e.target.value)}
                        className={`cursor-pointer appearance-none rounded-full border px-3.5 py-1.5 text-[12px] font-bold outline-none transition ${
                          STATUS_STYLES[r.status] ?? STATUS_STYLES.LOST
                        }`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0) + s.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                      {pending && busyId === r.id && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`https://wa.me/${r.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Open WhatsApp chat"
                        className="rounded-xl border border-border p-2 text-foreground/60 transition hover:border-[#cae4d5] hover:bg-[#e9f4ee] hover:text-[#3c7a58]"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => onDelete(r.id, r.name)}
                        title="Delete lead"
                        className="rounded-xl border border-border p-2 text-foreground/60 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
