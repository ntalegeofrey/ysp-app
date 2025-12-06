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
  fullName?: string;
  jobTitle?: string;
  employeeNumber?: string;
};

type RoleItem = { id: number; name: string; description?: string; active?: boolean };

export default function SystemAdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [sendOtlBusy, setSendOtlBusy] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobTitleOther, setNewJobTitleOther] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [newSendOtl, setNewSendOtl] = useState(true);
  const [newEmployeeNumber, setNewEmployeeNumber] = useState("");

  const [roles, setRoles] = useState<RoleItem[]>([]);

  const base = useMemo(() => process.env.NEXT_PUBLIC_API_BASE || "/api", []);
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
    // load roles for dropdown
    (async () => {
      try {
        const res = await fetch(`${base}/admin/roles`, { headers: { ...authHeader } });
        if (res.ok) {
          const data = (await res.json()) as RoleItem[];
          setRoles(data.filter(r => r.active !== false));
        }
      } catch {}
    })();
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
        body: JSON.stringify({
          email: newEmail,
          role: newRole,
          fullName: newFullName || undefined,
          jobTitle: (newJobTitle === "Other" ? newJobTitleOther : newJobTitle) || undefined,
          employeeNumber: newEmployeeNumber || undefined,
          sendOneTimeLogin: newSendOtl,
        }),
      });
      if (!res.ok) throw new Error("Failed to create user");
      setNewFullName("");
      setNewEmail("");
      setNewJobTitle("");
      setNewJobTitleOther("");
      setNewRole("user");
      setNewSendOtl(true);
      setNewEmployeeNumber("");
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
        body: JSON.stringify({ enabled: !u.enabled }),
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
        body: JSON.stringify({ role }),
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
        headers: { ...authHeader },
      });
      if (!res.ok) throw new Error("Failed to send one-time login");
    } catch (e: any) {
      setError(e?.message || "Failed to send one-time login");
    } finally {
      setSendOtlBusy(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-users text-primary text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-primary">24</p>
              <p className="text-sm text-font-detail">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-user-shield text-success text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-success">8</p>
              <p className="text-sm text-font-detail">Active Roles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-lock text-warning text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-warning">156</p>
              <p className="text-sm text-font-detail">Permissions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-clock text-error text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-error">3</p>
              <p className="text-sm text-font-detail">Pending Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Management */}
      <div className="bg-white rounded-lg border border-bd mb-2">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-user-shield text-primary mr-3"></i>
                Role Management
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Define user roles and their access permissions across all modules
              </div>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
              <i className="fa-solid fa-plus mr-2"></i>
              Create New Role
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-primary-lightest border border-primary rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-primary">Administrator</h4>
                <div className="flex space-x-2">
                  <button className="text-primary hover:text-primary-light text-sm">
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
              <p className="text-sm text-font-detail mb-3">Full system access and configuration rights</p>
              <div className="text-xs text-font-detail">
                <strong>Users:</strong> 2 | <strong>Modules:</strong> All | <strong>Permissions:</strong> Full
              </div>
            </div>

            <div className="bg-success-lightest border border-success rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-success">Shift Supervisor</h4>
                <div className="flex space-x-2">
                  <button className="text-primary hover:text-primary-light text-sm">
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
              <p className="text-sm text-font-detail mb-3">Operational oversight and unit management</p>
              <div className="text-xs text-font-detail">
                <strong>Users:</strong> 6 | <strong>Modules:</strong> 10 | <strong>Permissions:</strong> Supervisor
              </div>
            </div>

            <div className="bg-warning-lightest border border-warning rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-warning">JJYDS III</h4>
                <div className="flex space-x-2">
                  <button className="text-primary hover:text-primary-light text-sm">
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
              <p className="text-sm text-font-detail mb-3">Senior youth development specialist</p>
              <div className="text-xs text-font-detail">
                <strong>Users:</strong> 4 | <strong>Modules:</strong> 8 | <strong>Permissions:</strong> Standard+
              </div>
            </div>

            <div className="bg-highlight-lightest border border-highlight rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-highlight">Clinical Staff</h4>
                <div className="flex space-x-2">
                  <button className="text-primary hover:text-primary-light text-sm">
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
              <p className="text-sm text-font-detail mb-3">Medical and behavioral health specialists</p>
              <div className="text-xs text-font-detail">
                <strong>Users:</strong> 3 | <strong>Modules:</strong> 6 | <strong>Permissions:</strong> Clinical
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-bd">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Role Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Users Count</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Last Modified</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bd">
                <tr className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-font-base">JJYDS II</td>
                  <td className="px-4 py-3 text-sm">Youth development specialist</td>
                  <td className="px-4 py-3 text-sm">5</td>
                  <td className="px-4 py-3 text-sm">Nov 15, 2024</td>
                  <td className="px-4 py-3">
                    <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary-light text-sm mr-2">
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <button className="text-error hover:text-red-700 text-sm">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-font-base">JJYDS I</td>
                  <td className="px-4 py-3 text-sm">Entry-level youth specialist</td>
                  <td className="px-4 py-3 text-sm">4</td>
                  <td className="px-4 py-3 text-sm">Nov 12, 2024</td>
                  <td className="px-4 py-3">
                    <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary-light text-sm mr-2">
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <button className="text-error hover:text-red-700 text-sm">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Management (functional, preserving design) */}
      <div className="bg-white rounded-lg border border-bd mb-2">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-user-crown text-primary mr-3"></i>
                User Management
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Manage users who can onboard and manage other staff members
              </div>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm" onClick={(e)=>{}}>
              <i className="fa-solid fa-plus mr-2"></i>
              Add New User
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
          <div className="bg-gray-50 border border-bd rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-font-base mb-3 flex items-center">
              <i className="fa-solid fa-user-plus text-primary mr-2"></i>
              Add New User
            </h4>
            <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Full Name</label>
                <input value={newFullName} onChange={(e)=>setNewFullName(e.target.value)} type="text" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Email</label>
                <input value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} type="email" required className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="user@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Employee Number</label>
                <input value={newEmployeeNumber} onChange={(e)=>setNewEmployeeNumber(e.target.value)} type="text" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="EMP-2024-XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Job Title</label>
                <select value={newJobTitle} onChange={(e)=>setNewJobTitle(e.target.value)} className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">Select job title</option>
                  <option>System Administrator</option>
                  <option>IT Director</option>
                  <option>Facility Manager</option>
                  <option>Operations Director</option>
                  <option>Security Administrator</option>
                  <option>Clinical Staff</option>
                  <option>Caseworker</option>
                  <option>Support Staff</option>
                  <option>Supervisor</option>
                  <option>Other</option>
                </select>
              </div>
              {newJobTitle === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Specify Title</label>
                  <input value={newJobTitleOther} onChange={(e)=>setNewJobTitleOther(e.target.value)} type="text" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter job title" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Role</label>
                <select value={newRole} onChange={(e)=>setNewRole(e.target.value)} className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  {[{id:0,name:'user'}, ...roles].map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input id="sendOtl" type="checkbox" checked={newSendOtl} onChange={(e)=>setNewSendOtl(e.target.checked)} className="mr-2" />
                  Send one-time login email
                </label>
                <div>
                  <button type="submit" disabled={creating} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                    {creating ? "Creating…" : "Create User"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div>Loading…</div>
            ) : (
              <table className="w-full border border-bd">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Full Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Job Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Enabled</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Must Update</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bd">
                  {users.map((u) => (
                    <tr key={u.id} className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-font-base">{u.fullName || '-'}</td>
                      <td className="px-4 py-3 text-sm">{u.jobTitle || '-'}</td>
                      <td className="px-4 py-3 text-sm">{u.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <select value={u.role} onChange={(e)=>changeRole(u, e.target.value)} disabled={savingId===u.id} className="border rounded px-2 py-1 bg-white">
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button onClick={()=>toggleEnabled(u)} disabled={savingId===u.id} className="px-3 py-1 rounded border">
                          {u.enabled ? "Disable" : "Enable"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">{u.mustChangePassword ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3 text-sm">
                        <button onClick={()=>sendOtl(u)} disabled={sendOtlBusy===u.id} className="px-3 py-1 rounded bg-primary text-white">
                          {sendOtlBusy===u.id ? 'Sending…' : 'Send OTL'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base flex items-center">
            <i className="fa-solid fa-lock text-primary mr-3"></i>
            Module Permissions Matrix
          </h3>
          <div className="mt-2 text-sm text-font-detail">
            Configure access permissions for each role across all system modules
          </div>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full border border-bd text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-2 text-left">Module</th>
                <th className="px-3 py-2 text-center">Admin</th>
                <th className="px-3 py-2 text-center">Supervisor</th>
                <th className="px-3 py-2 text-center">JJYDS III</th>
                <th className="px-3 py-2 text-center">JJYDS II</th>
                <th className="px-3 py-2 text-center">JJYDS I</th>
                <th className="px-3 py-2 text-center">Clinical</th>
                <th className="px-3 py-2 text-center">Caseworker</th>
                <th className="px-3 py-2 text-center">Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bd">
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Inventory Management</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-error text-white px-2 py-1 rounded text-xs">None</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-error text-white px-2 py-1 rounded text-xs">None</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Resident Behavior</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Unit Condition (UCR)</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Sleep Log & Watch</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-error text-white px-2 py-1 rounded text-xs">None</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Log Book & Events</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Incident Management</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-error text-white px-2 py-1 rounded text-xs">None</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Fire Plan Management</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Medication Management</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Off-Site Movements</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Visitation & Phone</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Staff Management</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Analytics & Reports</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
