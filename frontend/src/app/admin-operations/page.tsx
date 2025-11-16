"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type UserItem = {
  id: number;
  email: string;
  role: string;
  enabled: boolean;
  mustChangePassword: boolean;
  createdAt: string;
};

export default function AdminOpsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [sendOtlBusy, setSendOtlBusy] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [newSendOtl, setNewSendOtl] = useState(true);

  const base = useMemo(() => process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080", []);

  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("token") : null), []);

  const authHeader = useMemo(() => ({ Authorization: token ? `Bearer ${token}` : "" }), [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${base}/admin/users`, { headers: { ...authHeader } });
      if (res.status === 401 || res.status === 403) {
        router.push("/");
        return;
      }
      if (!res.ok) throw new Error("Failed to load users");
      const data = (await res.json()) as UserItem[];
      setUsers(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setError(null);
      const res = await fetch(`${base}/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ email: newEmail, role: newRole, sendOneTimeLogin: newSendOtl })
      });
      if (!res.ok) throw new Error("Failed to create user");
      setNewEmail("");
      setNewRole("user");
      setNewSendOtl(true);
      await fetchUsers();
    } catch (e: any) {
      setError(e?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const toggleEnabled = async (u: UserItem) => {
    try {
      setSavingId(u.id);
      const res = await fetch(`${base}/admin/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ enabled: !u.enabled })
      });
      if (!res.ok) throw new Error("Failed to update user");
      await fetchUsers();
    } catch (e: any) {
      setError(e?.message || "Failed to update user");
    } finally {
      setSavingId(null);
    }
  };

  const changeRole = async (u: UserItem, role: string) => {
    try {
      setSavingId(u.id);
      const res = await fetch(`${base}/admin/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ role })
      });
      if (!res.ok) throw new Error("Failed to change role");
      await fetchUsers();
    } catch (e: any) {
      setError(e?.message || "Failed to change role");
    } finally {
      setSavingId(null);
    }
  };

  const sendOtl = async (u: UserItem) => {
    try {
      setSendOtlBusy(u.id);
      const res = await fetch(`${base}/admin/users/${u.id}/otl`, {
        method: "POST",
        headers: { ...authHeader }
      });
      if (!res.ok) throw new Error("Failed to send one-time login");
    } catch (e: any) {
      setError(e?.message || "Failed to send one-time login");
    } finally {
      setSendOtlBusy(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Operations</h1>
      <section className="mb-8 bg-white p-4 rounded shadow border">
        <h2 className="text-lg font-semibold mb-3">Create User</h2>
        <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Email</label>
            <input value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} type="email" required className="w-full border rounded px-3 py-2" placeholder="user@example.com"/>
          </div>
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select value={newRole} onChange={(e)=>setNewRole(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input id="sendOtl" type="checkbox" checked={newSendOtl} onChange={(e)=>setNewSendOtl(e.target.checked)} />
            <label htmlFor="sendOtl" className="text-sm">Send one-time login email</label>
          </div>
          <div>
            <button type="submit" disabled={creating} className="bg-mf-primary text-white rounded px-4 py-2">
              {creating ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white p-4 rounded shadow border">
        <h2 className="text-lg font-semibold mb-3">Users</h2>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Role</th>
                  <th className="py-2 pr-3">Enabled</th>
                  <th className="py-2 pr-3">Must Update</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-2 pr-3">{u.email}</td>
                    <td className="py-2 pr-3">
                      <select value={u.role} onChange={(e)=>changeRole(u, e.target.value)} disabled={savingId===u.id} className="border rounded px-2 py-1">
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="py-2 pr-3">
                      <button onClick={()=>toggleEnabled(u)} disabled={savingId===u.id} className="px-3 py-1 rounded border">
                        {u.enabled ? "Disable" : "Enable"}
                      </button>
                    </td>
                    <td className="py-2 pr-3">{u.mustChangePassword ? "Yes" : "No"}</td>
                    <td className="py-2 pr-3 flex gap-2">
                      <button onClick={()=>sendOtl(u)} disabled={sendOtlBusy===u.id} className="px-3 py-1 rounded bg-mf-primary text-white">
                        {sendOtlBusy===u.id ? "Sending…" : "Send OTL"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
