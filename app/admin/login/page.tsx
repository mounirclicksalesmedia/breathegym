"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { authenticate } from "../actions";

export default function AdminLoginPage() {
  const [error, formAction, pending] = useActionState(authenticate, undefined);

  return (
    <div dir="ltr" className="flex min-h-dvh items-center justify-center bg-background px-5 font-sans">
      {/* soft brand backdrop */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-100 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-80 w-80 rounded-full bg-brand-50 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-[2rem] border border-border bg-surface p-8 shadow-[0_40px_90px_-40px_rgba(168,90,91,0.35)] md:p-10">
          <div className="flex flex-col items-center text-center">
            <Image src="/logo.png" alt="Breathe Ladies Fitness" width={72} height={72} className="h-18 w-18 object-contain" />
            <h1 className="mt-4 text-2xl font-extrabold text-foreground">Admin Sign In</h1>
            <p className="mt-1 text-sm text-muted">Breathe Ladies Fitness — dashboard</p>
          </div>

          <form action={formAction} className="mt-8 flex flex-col gap-4">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-foreground/80">
                <Mail className="h-3.5 w-3.5" /> Email
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="admin@breathe-ladies.sa"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-[15px] outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-foreground/80">
                <Lock className="h-3.5 w-3.5" /> Password
              </span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-[15px] outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
            </label>

            {error && (
              <p className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-2.5 text-[13px] font-semibold text-brand-700" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_18px_40px_-16px_rgba(206,132,133,0.95)] transition hover:bg-brand-600 disabled:opacity-70"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Breathe Ladies Fitness
        </p>
      </div>
    </div>
  );
}
