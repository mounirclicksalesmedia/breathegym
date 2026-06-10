import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function normalizeDigits(value: string) {
  return value.replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)));
}

/** Accepts 05XXXXXXXX, 5XXXXXXXX, 9665XXXXXXXX, +9665XXXXXXXX → +9665XXXXXXXX */
function normalizeSaudiPhone(raw: string): string | null {
  const digits = normalizeDigits(raw).replace(/[\s\-().]/g, "");
  const m = digits.match(/^(?:\+?966|0)?(5\d{8})$/);
  return m ? `+966${m[1]}` : null;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: bots fill every field — pretend success, store nothing.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";
  const packageSlug = typeof body.packageSlug === "string" ? body.packageSlug : "";

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }
  const phone = normalizeSaudiPhone(phoneRaw);
  if (!phone) {
    return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
  }

  let packageId: string | null = null;
  let packageLabel = "Free Trial";
  if (packageSlug && packageSlug !== "trial") {
    const pkg = await prisma.package.findUnique({ where: { slug: packageSlug } });
    if (!pkg) {
      return NextResponse.json({ ok: false, error: "invalid_package" }, { status: 400 });
    }
    packageId = pkg.id;
    packageLabel = pkg.nameEn;
  }

  await prisma.lead.create({
    data: { name, phone, packageId, packageLabel, source: "landing" },
  });

  return NextResponse.json({ ok: true });
}
