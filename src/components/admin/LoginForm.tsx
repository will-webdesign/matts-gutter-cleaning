"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKey, CircleNotch } from "@phosphor-icons/react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password. Please try again.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm rounded-[var(--radius-card)] border border-hairline bg-elevated p-8 shadow-[var(--shadow-lift)]"
    >
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-navy-600 text-white">
        <LockKey size={24} weight="fill" />
      </div>
      <h1 className="mt-5 text-center text-xl font-extrabold text-ink">Admin dashboard</h1>
      <p className="mt-1 text-center text-sm text-muted">Matt&apos;s Gutter Cleaning</p>

      <label htmlFor="password" className="mt-6 block text-sm font-semibold text-ink">
        Password
      </label>
      <input
        id="password"
        type="password"
        autoFocus
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-ink focus-visible:outline-2 focus-visible:outline-[var(--color-sky-brand)]"
        placeholder="Enter your password"
      />
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !password}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-amber-brand)] font-semibold text-navy-950 transition-colors hover:bg-[var(--color-amber-deep)] disabled:opacity-50"
      >
        {loading ? <CircleNotch size={18} weight="bold" className="animate-spin" /> : "Log in"}
      </button>
    </form>
  );
}
