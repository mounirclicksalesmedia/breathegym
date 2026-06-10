"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Crown,
  Eye,
  EyeOff,
  X,
  Loader2,
  Check,
} from "lucide-react";
import { savePackage, deletePackage, type PackageInput } from "../actions";

export type PackageRow = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  durationAr: string;
  durationEn: string;
  priceSar: number;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  features: { ar: string; en: string }[];
  leadCount: number;
};

type Draft = PackageInput & { id: string | null };

const emptyDraft = (nextOrder: number): Draft => ({
  id: null,
  nameAr: "",
  nameEn: "",
  durationAr: "",
  durationEn: "",
  priceSar: 0,
  featured: false,
  active: true,
  sortOrder: nextOrder,
  features: [{ ar: "", en: "" }],
});

export function PackagesManager({ rows }: { rows: PackageRow[] }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const openNew = () =>
    setDraft(emptyDraft(rows.length ? Math.max(...rows.map((r) => r.sortOrder)) + 1 : 1));

  const openEdit = (r: PackageRow) =>
    setDraft({
      id: r.id,
      nameAr: r.nameAr,
      nameEn: r.nameEn,
      durationAr: r.durationAr,
      durationEn: r.durationEn,
      priceSar: r.priceSar,
      featured: r.featured,
      active: r.active,
      sortOrder: r.sortOrder,
      features: r.features.length ? r.features.map((f) => ({ ...f })) : [{ ar: "", en: "" }],
    });

  const close = () => {
    setDraft(null);
    setError(null);
  };

  const submit = () => {
    if (!draft) return;
    setError(null);
    startTransition(async () => {
      const res = await savePackage(draft);
      if (!res.ok) {
        setError(res.error ?? "Could not save");
        return;
      }
      close();
    });
  };

  const toggle = (r: PackageRow, patch: Partial<Pick<PackageRow, "active" | "featured">>) => {
    setBusyId(r.id);
    startTransition(async () => {
      await savePackage({ ...r, ...patch });
      setBusyId(null);
    });
  };

  const remove = (r: PackageRow) => {
    if (!window.confirm(`Delete package "${r.nameEn}"? Its leads keep their snapshot label.`)) return;
    setBusyId(r.id);
    startTransition(async () => {
      await deletePackage(r.id);
      setBusyId(null);
    });
  };

  const field =
    "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10";

  return (
    <div className="mt-8">
      <div className="flex justify-end">
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(206,132,133,0.9)] transition hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" /> New package
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <div
            key={r.id}
            className={`relative rounded-2xl border bg-surface p-5 shadow-[0_20px_50px_-30px_rgba(168,90,91,0.3)] transition ${
              r.active ? "border-border" : "border-dashed border-border opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-foreground">{r.nameEn}</h3>
                  {r.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f7efe3] px-2.5 py-0.5 text-[11px] font-bold text-[#8a6b3f]">
                      <Crown className="h-3 w-3" /> Featured
                    </span>
                  )}
                  {!r.active && (
                    <span className="rounded-full bg-background px-2.5 py-0.5 text-[11px] font-bold text-muted">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted" dir="rtl">
                  {r.nameAr} · {r.durationAr}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold tabular-nums text-brand-700">
                  {r.priceSar.toLocaleString()}
                </div>
                <div className="text-[11px] font-semibold text-muted">SAR</div>
              </div>
            </div>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              {r.features.map((f, i) => (
                <li
                  key={i}
                  className="rounded-full bg-brand-50 px-3 py-1 text-[12px] font-medium text-brand-700"
                >
                  {f.en || f.ar}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-[12px] font-semibold text-muted">
                {r.leadCount} lead{r.leadCount === 1 ? "" : "s"} · order {r.sortOrder}
              </span>
              <div className="flex items-center gap-1.5">
                {busyId === r.id && pending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />
                )}
                <button
                  onClick={() => toggle(r, { active: !r.active })}
                  title={r.active ? "Hide from landing page" : "Show on landing page"}
                  className="rounded-xl border border-border p-2 text-foreground/60 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {r.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => toggle(r, { featured: !r.featured })}
                  title={r.featured ? "Remove featured badge" : "Mark as featured"}
                  className={`rounded-xl border p-2 transition hover:bg-[#f7efe3] hover:text-[#8a6b3f] ${
                    r.featured ? "border-[#e7d6b8] bg-[#f7efe3] text-[#8a6b3f]" : "border-border text-foreground/60"
                  }`}
                >
                  <Crown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openEdit(r)}
                  title="Edit package"
                  className="rounded-xl border border-border p-2 text-foreground/60 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(r)}
                  title="Delete package"
                  className="rounded-xl border border-border p-2 text-foreground/60 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* editor modal */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={close} />
          <div className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] border border-border bg-surface p-6 shadow-2xl md:rounded-[2rem] md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-foreground">
                {draft.id ? "Edit package" : "New package"}
              </h2>
              <button onClick={close} className="rounded-xl border border-border p-2 text-muted hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-foreground/80">Name (EN)</span>
                <input className={field} value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-foreground/80">Name (AR)</span>
                <input dir="rtl" className={field} value={draft.nameAr} onChange={(e) => setDraft({ ...draft, nameAr: e.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-foreground/80">Duration (EN)</span>
                <input className={field} value={draft.durationEn} onChange={(e) => setDraft({ ...draft, durationEn: e.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-foreground/80">Duration (AR)</span>
                <input dir="rtl" className={field} value={draft.durationAr} onChange={(e) => setDraft({ ...draft, durationAr: e.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-foreground/80">Price (SAR)</span>
                <input
                  type="number"
                  min={0}
                  className={field}
                  value={Number.isFinite(draft.priceSar) ? draft.priceSar : ""}
                  onChange={(e) => setDraft({ ...draft, priceSar: Number(e.target.value) })}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-foreground/80">Sort order</span>
                <input
                  type="number"
                  className={field}
                  value={draft.sortOrder}
                  onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })}
                />
              </label>
            </div>

            <div className="mt-5 flex gap-5">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground/80">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                  className="h-4 w-4 accent-brand"
                />
                Featured (Best Value badge)
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground/80">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                  className="h-4 w-4 accent-brand"
                />
                Visible on landing page
              </label>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-foreground/80">Features</span>
                <button
                  onClick={() => setDraft({ ...draft, features: [...draft.features, { ar: "", en: "" }] })}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-[12px] font-bold text-foreground/70 hover:bg-brand-50 hover:text-brand-700"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                {draft.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      placeholder="Feature (EN)"
                      className={field}
                      value={f.en}
                      onChange={(e) => {
                        const features = draft.features.map((x, j) => (j === i ? { ...x, en: e.target.value } : x));
                        setDraft({ ...draft, features });
                      }}
                    />
                    <input
                      dir="rtl"
                      placeholder="الميزة (AR)"
                      className={field}
                      value={f.ar}
                      onChange={(e) => {
                        const features = draft.features.map((x, j) => (j === i ? { ...x, ar: e.target.value } : x));
                        setDraft({ ...draft, features });
                      }}
                    />
                    <button
                      onClick={() => setDraft({ ...draft, features: draft.features.filter((_, j) => j !== i) })}
                      className="shrink-0 rounded-xl border border-border p-2 text-foreground/50 hover:bg-brand-50 hover:text-brand-700"
                      title="Remove feature"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-brand-50 px-4 py-2.5 text-[13px] font-semibold text-brand-700" role="alert">
                {error}
              </p>
            )}

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={close}
                className="rounded-full border border-border px-6 py-3 text-sm font-bold text-foreground/70 transition hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(206,132,133,0.9)] transition hover:bg-brand-600 disabled:opacity-70"
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {draft.id ? "Save changes" : "Create package"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
