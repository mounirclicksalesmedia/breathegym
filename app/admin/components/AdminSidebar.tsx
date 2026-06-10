"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package2,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../actions";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/packages", label: "Packages", icon: Package2 },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 py-6">
        <Image src="/logo.png" alt="Breathe" width={40} height={40} className="h-10 w-10 object-contain" />
        <div>
          <div className="text-sm font-extrabold text-foreground">Breathe Admin</div>
          <div className="text-xs text-muted">{userName}</div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-brand text-white shadow-[0_12px_30px_-12px_rgba(206,132,133,0.9)]"
                  : "text-foreground/70 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-1 border-t border-border px-3 py-4">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground/70 transition hover:bg-brand-50 hover:text-brand-700"
        >
          <ExternalLink className="h-4.5 w-4.5" />
          View site
        </a>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground/70 transition hover:bg-brand-50 hover:text-brand-700"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <>
      {/* mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Breathe" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="text-sm font-extrabold text-foreground">Breathe Admin</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="rounded-xl border border-border bg-surface p-2 text-foreground"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-border bg-surface pt-14 shadow-2xl">
            {nav}
          </aside>
        </div>
      )}

      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-surface lg:block">
        {nav}
      </aside>
    </>
  );
}
