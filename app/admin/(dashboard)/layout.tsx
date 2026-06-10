import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { AdminSidebar } from "../components/AdminSidebar";

export const metadata = { title: "Breathe Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div dir="ltr" className="flex min-h-dvh bg-background font-sans">
      <AdminSidebar userName={session.user.name ?? "Admin"} />
      <main className="min-w-0 flex-1 px-5 pb-16 pt-20 md:px-10 md:pt-10 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
