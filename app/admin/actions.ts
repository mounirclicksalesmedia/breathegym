"use server";

import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { prisma } from "@/app/lib/db";
import { signIn, signOut, requireAdmin } from "@/app/lib/auth";
import type { LeadStatus } from "@/app/generated/prisma/client";

export type ActionResult = { ok: boolean; error?: string };

/* ---------------------------------- auth ---------------------------------- */

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      return "Invalid email or password.";
    }
    throw error; // NEXT_REDIRECT on success must propagate
  }
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}

/* ---------------------------------- leads --------------------------------- */

const LEAD_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "CONVERTED", "LOST"];

export async function updateLeadStatus(id: string, status: string): Promise<ActionResult> {
  await requireAdmin();
  if (!LEAD_STATUSES.includes(status as LeadStatus)) {
    return { ok: false, error: "Invalid status" };
  }
  await prisma.lead.update({ where: { id }, data: { status: status as LeadStatus } });
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function updateLeadNotes(id: string, notes: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.lead.update({ where: { id }, data: { notes: notes.slice(0, 2000) } });
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteLead(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin", "layout");
  return { ok: true };
}

/* -------------------------------- packages -------------------------------- */

export type PackageInput = {
  id?: string | null;
  nameAr: string;
  nameEn: string;
  durationAr: string;
  durationEn: string;
  priceSar: number;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  features: { ar: string; en: string }[];
};

function validatePackage(input: PackageInput): string | null {
  if (!input.nameAr.trim() || !input.nameEn.trim()) return "Name (AR & EN) is required";
  if (!Number.isFinite(input.priceSar) || input.priceSar < 0) return "Price must be a positive number";
  return null;
}

async function uniqueSlug(base: string, excludeId?: string | null): Promise<string> {
  const root =
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "package";
  let slug = root;
  for (let i = 2; ; i++) {
    const existing = await prisma.package.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${root}-${i}`;
  }
}

export async function savePackage(input: PackageInput): Promise<ActionResult> {
  await requireAdmin();
  const invalid = validatePackage(input);
  if (invalid) return { ok: false, error: invalid };

  const data = {
    nameAr: input.nameAr.trim(),
    nameEn: input.nameEn.trim(),
    durationAr: input.durationAr.trim(),
    durationEn: input.durationEn.trim(),
    priceSar: Math.round(input.priceSar),
    featured: input.featured,
    active: input.active,
    sortOrder: Math.round(input.sortOrder) || 0,
    features: input.features
      .map((f) => ({ ar: f.ar.trim(), en: f.en.trim() }))
      .filter((f) => f.ar || f.en),
  };

  if (input.id) {
    await prisma.package.update({ where: { id: input.id }, data });
  } else {
    await prisma.package.create({
      data: { ...data, slug: await uniqueSlug(data.nameEn) },
    });
  }

  revalidatePath("/admin", "layout");
  revalidatePath("/");
  return { ok: true };
}

export async function deletePackage(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.package.delete({ where: { id } });
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  return { ok: true };
}
