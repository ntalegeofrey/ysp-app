"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UpdatePasswordPage() {
  const search = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = search.get("token") || "";
    setToken(t);
  }, [search]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setSubmitting(true);
      const base = process.env.NEXT_PUBLIC_API_BASE || "/api";
      const res = await fetch(`${base}/auth/password/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password })
      });
      if (!res.ok) {
        setError("Unable to update password. The link may be expired.");
        return;
      }
      setSuccess(true);
      // Redirect to login after a brief delay
      setTimeout(() => router.push("/"), 1500);
    } catch (e) {
      setError("Unable to contact server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center p-6">
      <main className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">Set a new password</h1>
        {success ? (
          <div className="text-green-700">Password updated. Redirecting to login…</div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">New password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Confirm password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-mf-primary text-white font-semibold py-2 rounded hover:bg-mf-primary-light disabled:opacity-60"
            >
              {submitting ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
