import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const packages = [
  {
    slug: "monthly",
    nameAr: "باقة الشهر",
    nameEn: "Monthly",
    durationAr: "شهر واحد",
    durationEn: "One month",
    priceSar: 700,
    featured: false,
    sortOrder: 1,
    features: [
      { ar: "اشتراك شهر كامل", en: "Full month membership" },
      { ar: "أسبوعان إضافيان مجاناً", en: "2 extra weeks free" },
      { ar: "تجميد لمدة أسبوع", en: "1-week freeze" },
    ],
  },
  {
    slug: "quarter",
    nameAr: "باقة 3 أشهر",
    nameEn: "3 Months",
    durationAr: "ثلاثة أشهر",
    durationEn: "Three months",
    priceSar: 1755,
    featured: false,
    sortOrder: 2,
    features: [
      { ar: "اشتراك 3 أشهر", en: "3 months membership" },
      { ar: "3 أسابيع إضافية مجاناً", en: "3 extra weeks free" },
      { ar: "تجميد لمدة أسبوعين", en: "2-week freeze" },
    ],
  },
  {
    slug: "half",
    nameAr: "باقة 6 أشهر",
    nameEn: "6 Months",
    durationAr: "ستة أشهر",
    durationEn: "Six months",
    priceSar: 2990,
    featured: false,
    sortOrder: 3,
    features: [
      { ar: "اشتراك 6 أشهر", en: "6 months membership" },
      { ar: "شهر كامل إضافي مجاناً", en: "1 full month free" },
      { ar: "تجميد لمدة شهر", en: "1-month freeze" },
    ],
  },
  {
    slug: "annual",
    nameAr: "الباقة السنوية",
    nameEn: "Annual",
    durationAr: "12 شهراً",
    durationEn: "12 months",
    priceSar: 4370,
    featured: true,
    sortOrder: 4,
    features: [
      { ar: "اشتراك 12 شهراً", en: "12 months membership" },
      { ar: "شهران إضافيان مجاناً", en: "2 extra months free" },
      { ar: "تجميد لمدة شهرين", en: "2-month freeze" },
    ],
  },
];

async function main() {
  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {},
      create: pkg,
    });
  }
  console.log(`Seeded ${packages.length} packages`);

  const email = process.env.ADMIN_EMAIL ?? "admin@breathe-ladies.sa";
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is not set in .env");

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: process.env.ADMIN_NAME ?? "Breathe Admin",
      passwordHash: await bcrypt.hash(password, 12),
    },
  });
  console.log(`Seeded admin user ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
