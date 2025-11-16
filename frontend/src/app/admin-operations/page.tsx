"use client";

import { useState } from "react";

export default function AdminOperationsPage() {
  // Roles and modules per original design (frontend-only)
  const baseRoles = [
    "Admin",
    "Supervisor",
    "JJYDS III",
    "JJYDS II",
    "JJYDS I",
    "Clinical",
    "Caseworker",
    "Support",
  ];
  const [roleNames, setRoleNames] = useState<string[]>(baseRoles);
  const modules = [
    "System Admin",
    "Inventory Management",
    "Resident Behavior",
    "Unit Condition (UCR)",
    "Sleep Log & Watch",
    "Log Book & Events",
    "Incident Management",
    "Fire Plan Management",
    "Medication (eMAR)",
    "Medical Runs",
    "Visitation & Phone Log",
    "Repairs",
  ];
  const accessLevels = ["Full", "Edit", "View", "None"] as const;

  // Initialize a simple default matrix (Admin=Full, others=View)
  const defaultMatrix: Record<string, Record<string, typeof accessLevels[number]>> = Object.fromEntries(
    baseRoles.map((r) => [
      r,
      Object.fromEntries(
        modules.map((m) => [m, r === "Admin" ? "Full" : (r === "Supervisor" ? "Edit" : "View")])
      ) as Record<string, typeof accessLevels[number]>,
    ])
  );
  const [matrix, setMatrix] = useState(defaultMatrix);
  const [openCell, setOpenCell] = useState<null | { role: string; module: string }>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // ===== User management (frontend-only) =====
  type UserRow = { id: string; fullName: string; jobTitle: string; email: string; role: string; enabled: boolean; mustUpdate: boolean };
  const [users, setUsers] = useState<UserRow[]>([
    { id: "u1", fullName: "Sarah Wilson", jobTitle: "System Administrator", email: "sarah.wilson@mass.gov", role: "Admin", enabled: true, mustUpdate: false },
  ]);
  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    jobTitle: "",
    employeeNumber: "",
    role: "Admin",
    sendOtl: true,
  });
  const submitNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `u-${Date.now()}`;
    const newUser: UserRow = {
      id,
      fullName: userForm.fullName || "-",
      jobTitle: userForm.jobTitle || "-",
      email: userForm.email || "-",
      role: userForm.role || "Admin",
      enabled: true,
      mustUpdate: false,
    };
    setUsers((prev) => [newUser, ...prev]);
    setUserForm({ fullName: "", email: "", jobTitle: "", employeeNumber: "", role: "Admin", sendOtl: true });
  };

  // ===== Role management (frontend-only) =====
  type RoleTile = {
    id: string;
    name: string;
    status: "Active" | "Inactive";
    description: string;
    users: number | string;
    modules: number | string;
    permissions: string;
    tone: "primary" | "success";
  };

  const [roleTiles, setRoleTiles] = useState<RoleTile[]>([
    {
      id: "admin",
      name: "Administrator",
      status: "Active",
      description: "Full system access and configuration rights",
      users: 2,
      modules: "All",
      permissions: "Full",
      tone: "primary",
    },
    {
      id: "supervisor",
      name: "Shift Supervisor",
      status: "Active",
      description: "Operational oversight and unit management",
      users: 6,
      modules: 10,
      permissions: "Supervisor",
      tone: "success",
    },
    {
      id: "jjyds3",
      name: "JJYDS III",
      status: "Active",
      description: "Senior youth development specialist",
      users: 4,
      modules: 8,
      permissions: "Standard+",
      tone: "primary",
    },
    {
      id: "clinical",
      name: "Clinical Staff",
      status: "Active",
      description: "Medical and behavioral health specialists",
      users: 3,
      modules: 6,
      permissions: "Clinical",
      tone: "success",
    },
  ]);

  type RoleRow = {
    id: string;
    name: string;
    description: string;
    users: number;
    lastModified: string;
    status: "Active" | "Inactive";
  };

  const [roleRows, setRoleRows] = useState<RoleRow[]>([
    { id: "jjyds2", name: "JJYDS II", description: "Youth development specialist", users: 5, lastModified: "Nov 15, 2024", status: "Active" },
  ]);

  const [roleModal, setRoleModal] = useState<null | { mode: "create" | "edit"; id?: string; prevName?: string }>(null);
  type AccessLevel = typeof accessLevels[number];
  const moduleDefaults: Record<string, AccessLevel> = Object.fromEntries(modules.map((m) => [m, "View"])) as Record<string, AccessLevel>;
  const [roleForm, setRoleForm] = useState<{ name: string; description: string; status: boolean; moduleAccess: Record<string, AccessLevel> }>({ name: "", description: "", status: true, moduleAccess: moduleDefaults });
  const [confirmDelete, setConfirmDelete] = useState<null | { id: string; name: string }>(null);

  const openCreateRole = () => {
    setRoleForm({ name: "", description: "", status: true, moduleAccess: moduleDefaults });
    setRoleModal({ mode: "create" });
  };
  const openEditRole = (id: string) => {
    // try tiles first then table
    const tile = roleTiles.find((t) => t.id === id);
    const row = roleRows.find((r) => r.id === id);
    const roleName = tile?.name || row?.name;
    if (roleName) {
      const existing = matrix[roleName] as Record<string, AccessLevel> | undefined;
      setRoleForm({ name: roleName, description: (tile?.description || row?.description) || "", status: (tile?.status || row?.status) === "Active", moduleAccess: existing ? { ...moduleDefaults, ...existing } : moduleDefaults });
    }
    setRoleModal({ mode: "edit", id, prevName: roleName });
  };
  const saveRole = () => {
    if (!roleModal) return;
    const basicId = roleForm.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const id = roleModal.mode === "edit" && roleModal.id ? roleModal.id : basicId || `role-${Date.now()}`;

    // Update or add tile
    setRoleTiles((prev) => {
      const exists = prev.some((t) => t.id === id) || prev.some((t) => t.name.toLowerCase() === roleForm.name.trim().toLowerCase());
      const modulesCount = Object.values(roleForm.moduleAccess).filter((v) => v !== "None").length;
      const updated: RoleTile = {
        id,
        name: roleForm.name || "New Role",
        status: roleForm.status ? "Active" : "Inactive",
        description: roleForm.description || "",
        users: 0,
        modules: modulesCount === modules.length ? "All" : modulesCount,
        permissions: "Custom",
        tone: "primary",
      };
      if (roleModal.mode === "edit") {
        return prev.map((t) => (t.id === (roleModal.id || id) ? { ...t, ...updated } : t));
      }
      return exists ? prev : [updated, ...prev];
    });

    // Ensure table row exists/updates
    setRoleRows((prev) => {
      const exists = prev.some((r) => r.id === id);
      const updated: RoleRow = {
        id,
        name: roleForm.name || "New Role",
        description: roleForm.description || "",
        users: 0,
        lastModified: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        status: roleForm.status ? "Active" : "Inactive",
      };
      return exists ? prev.map((r) => (r.id === id ? updated : r)) : [updated, ...prev];
    });

    // Write selections to the permissions matrix for this role name
    const roleName = roleForm.name.trim() || id;
    setMatrix((prev) => {
      const next = {
        ...prev,
        [roleName]: { ...(prev[roleName] || {}), ...roleForm.moduleAccess },
      } as typeof prev;
      // Handle rename: remove old key if editing and name changed
      if (roleModal.mode === "edit" && roleModal.prevName && roleModal.prevName !== roleName) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [roleModal.prevName]: _, ...rest } = next as any;
        return rest;
      }
      return next;
    });

    // Ensure roleNames includes roleName and handles rename
    setRoleNames((prev) => {
      if (roleModal.mode === "edit" && roleModal.prevName && roleModal.prevName !== roleName) {
        return Array.from(new Set(prev.map((n) => (n === roleModal.prevName ? roleName : n))));
      }
      return prev.includes(roleName) ? prev : [...prev, roleName];
    });

    setRoleModal(null);
  };
  const requestDelete = (id: string, name: string) => setConfirmDelete({ id, name });
  const confirmDeleteNow = () => {
    if (!confirmDelete) return;
    const { id } = confirmDelete;
    setRoleRows((prev) => prev.filter((r) => r.id !== id));
    setRoleTiles((prev) => prev.filter((t) => t.id !== id));
    setConfirmDelete(null);
  };

  const badgeClass = (level: string) =>
    level === "Full"
      ? "bg-success text-white"
      : level === "Edit"
      ? "bg-warning text-white"
      : level === "View"
      ? "bg-primary text-white"
      : "bg-error text-white";

  const setAccess = (role: string, module: string, level: typeof accessLevels[number]) => {
    setMatrix((prev) => ({
      ...prev,
      [role]: { ...prev[role], [module]: level },
    }));
    setOpenCell(null);
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
            <button onClick={openCreateRole} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
              <i className="fa-solid fa-plus mr-2"></i>
              Create New Role
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {roleTiles.map((t) => (
              <div key={t.id} className={`${t.tone === "primary" ? "bg-primary-lightest border-primary" : "bg-success-lightest border-success"} border rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-semibold ${t.tone === "primary" ? "text-primary" : "text-success"}`}>{t.name}</h4>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => openEditRole(t.id)} className="text-primary hover:text-primary-light text-sm" title="Edit Role">
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <span className={`${t.status === "Active" ? "bg-success text-white" : "bg-bg-subtle text-font-base border border-bd"} px-2 py-1 rounded text-xs`}>{t.status}</span>
                  </div>
                </div>
                <p className="text-sm text-font-detail mb-3">{t.description}</p>
                <div className="text-xs text-font-detail">
                  <strong>Users:</strong> {t.users} | <strong>Modules:</strong> {t.modules} | <strong>Permissions:</strong> {t.permissions}
                </div>
              </div>
            ))}
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
                {roleRows.map((r) => (
                  <tr key={r.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-font-base">{r.name}</td>
                    <td className="px-4 py-3 text-sm">{r.description}</td>
                    <td className="px-4 py-3 text-sm">{r.users}</td>
                    <td className="px-4 py-3 text-sm">{r.lastModified}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${r.status === "Active" ? "bg-success text-white" : "bg-bg-subtle text-font-base border border-bd"}`}>{r.status}</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => openEditRole(r.id)} className="text-primary hover:text-primary-light text-sm mr-2" title="Edit Role"><i className="fa-solid fa-edit"></i></button>
                      <button onClick={() => requestDelete(r.id, r.name)} className="text-error hover:text-red-700 text-sm" title="Delete Role"><i className="fa-solid fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Role Create/Edit Modal */}
      {roleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 animate-fade-in" onClick={() => setRoleModal(null)}></div>
          <div className="relative bg-white rounded-lg shadow-xl border border-bd w-full max-w-lg mx-4 animate-scale-in">
            <div className="p-5 border-b border-bd flex items-center justify-between">
              <h4 className="text-base font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-user-shield text-primary mr-2"></i>
                {roleModal.mode === "create" ? "Create New Role" : "Edit Role"}
              </h4>
              <button className="text-font-detail hover:text-font-base" onClick={() => setRoleModal(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role Name</label>
                <input value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Role name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Short description" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={roleForm.status} onChange={(e) => setRoleForm({ ...roleForm, status: e.target.checked })} /> Active
              </label>
              <div className="pt-2">
                <div className="text-sm font-semibold mb-2 flex items-center">
                  <i className="fa-solid fa-lock text-primary mr-2"></i>
                  Module Access
                </div>
                <div className="max-h-72 overflow-auto border border-bd rounded">
                  <table className="w-full text-sm">
                    <thead className="bg-bg-subtle">
                      <tr>
                        <th className="px-3 py-2 text-left">Module</th>
                        <th className="px-3 py-2 text-left">Access</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-bd bg-white">
                      {modules.map((m) => (
                        <tr key={m}>
                          <td className="px-3 py-2">{m}</td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap gap-2">
                              {accessLevels.map((lvl) => {
                                const selected = roleForm.moduleAccess[m] === lvl;
                                return (
                                  <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setRoleForm({ ...roleForm, moduleAccess: { ...roleForm.moduleAccess, [m]: lvl } })}
                                    className={`px-2 py-1 rounded text-xs ${badgeClass(lvl)} ${selected ? "ring-2 ring-offset-1 ring-primary" : "opacity-90 hover:opacity-100"}`}
                                    title={lvl}
                                  >
                                    {lvl}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-bd flex items-center justify-end gap-3 bg-gray-50 rounded-b-lg">
              <button onClick={() => setRoleModal(null)} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button onClick={saveRole} className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-light">{roleModal.mode === "create" ? "Create Role" : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 animate-fade-in" onClick={() => setConfirmDelete(null)}></div>
          <div className="relative bg-white rounded-lg shadow-xl border border-bd w-full max-w-md mx-4 animate-scale-in">
            <div className="p-5 border-b border-bd">
              <h4 className="text-base font-semibold text-font-base">Delete Role</h4>
            </div>
            <div className="p-5 text-sm text-font-base">
              Are you sure you want to delete <span className="font-semibold">{confirmDelete.name}</span>? This action cannot be undone.
            </div>
            <div className="p-4 border-t border-bd flex items-center justify-end gap-3 bg-gray-50 rounded-b-lg">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button onClick={confirmDeleteNow} className="px-4 py-2 rounded-lg bg-error text-white hover:bg-red-700">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* User Management */}
      <div className="bg-white rounded-lg border border-bd mb-2">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-user-crown text-primary mr-3"></i>
                User Management
              </h3>
              <div className="mt-2 text-sm text-font-detail">Manage users who can onboard and manage other staff members</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 border border-bd rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-font-base mb-3 flex items-center">
              <i className="fa-solid fa-user-plus text-primary mr-2"></i>
              Add New User
            </h4>
            <form onSubmit={submitNewUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Full Name</label>
                <input value={userForm.fullName} onChange={(e)=>setUserForm({...userForm, fullName: e.target.value})} type="text" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Email</label>
                <input value={userForm.email} onChange={(e)=>setUserForm({...userForm, email: e.target.value})} type="email" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="user@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Job Title</label>
                <select value={userForm.jobTitle} onChange={(e)=>setUserForm({...userForm, jobTitle: e.target.value})} className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>Select job title</option>
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
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Employee Number</label>
                <input value={userForm.employeeNumber} onChange={(e)=>setUserForm({...userForm, employeeNumber: e.target.value})} type="text" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="EMP-2024-XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Role</label>
                <select value={userForm.role} onChange={(e)=>setUserForm({...userForm, role: e.target.value})} className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus-border-transparent">
                  <option>Admin</option>
                  <option>Supervisor</option>
                  <option>JJYDS III</option>
                  <option>JJYDS II</option>
                  <option>JJYDS I</option>
                  <option>Clinical</option>
                  <option>Caseworker</option>
                  <option>Support</option>
                </select>
              </div>
              <div className="md:col-span-2 flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" checked={userForm.sendOtl} onChange={(e)=>setUserForm({...userForm, sendOtl: e.target.checked})} />
                  Send one-time login email
                </label>
                <div>
                  <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">Add New User</button>
                </div>
              </div>
            </form>
          </div>

          <div className="overflow-x-auto">
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
                {users.map((u)=> (
                  <tr key={u.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-font-base">{u.fullName}</td>
                    <td className="px-4 py-3 text-sm">{u.jobTitle}</td>
                    <td className="px-4 py-3 text-sm">{u.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <select value={u.role} onChange={(e)=>setUsers(prev=>prev.map(p=>p.id===u.id? {...p, role: e.target.value}:p))} className="border rounded px-2 py-1 bg-white">
                        <option>Admin</option>
                        <option>Supervisor</option>
                        <option>JJYDS III</option>
                        <option>JJYDS II</option>
                        <option>JJYDS I</option>
                        <option>Clinical</option>
                        <option>Caseworker</option>
                        <option>Support</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={()=>setUsers(prev=>prev.map(p=>p.id===u.id? {...p, enabled: !p.enabled}:p))} className="px-3 py-1 rounded border">{u.enabled? 'Disable':'Enable'}</button>
                    </td>
                    <td className="px-4 py-3 text-sm">{u.mustUpdate? 'Yes':'No'}</td>
                    <td className="px-4 py-3 text-sm"><button className="px-3 py-1 rounded bg-primary text-white">Send OTL</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="mt-2 text-sm text-font-detail">Configure access permissions for each role across all system modules</div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {modules.map((mod) => (
              <div key={mod} className="border border-bd rounded-lg">
                <button
                  type="button"
                  onClick={() => setCollapsed((c) => ({ ...c, [mod]: !c[mod] }))}
                  className="w-full bg-bg-subtle px-4 py-3 flex items-center justify-between hover:bg-gray-100"
                  aria-expanded={!collapsed[mod]}
                  aria-controls={`module-${mod.replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center">
                    <i className="fa-solid fa-layer-group text-primary mr-2"></i>
                    <h4 className="text-sm font-semibold text-font-base">{mod}</h4>
                  </div>
                  <i className={`fa-solid ${collapsed[mod] ? 'fa-chevron-right' : 'fa-chevron-down'} text-font-detail`}></i>
                </button>
                {!collapsed[mod] && (
                <div id={`module-${mod.replace(/\s+/g, '-')}`} className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-font-detail">
                          <th className="px-3 py-2 text-left">Role</th>
                          <th className="px-3 py-2 text-left">Access</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-bd">
                        {roleNames.map((r) => {
                          const val = matrix[r][mod];
                          return (
                            <tr key={r}>
                              <td className="px-3 py-2 font-medium text-font-base">{r}</td>
                              <td className="px-3 py-2">
                                <div className="relative inline-block">
                                  <button
                                    type="button"
                                    onClick={() => setOpenCell({ role: r, module: mod })}
                                    className={`px-2 py-1 rounded text-xs ${badgeClass(val)}`}
                                  >
                                    {val}
                                  </button>
                                  {openCell && openCell.role === r && openCell.module === mod && (
                                    <div className="absolute left-0 top-full mt-2 z-50 min-w-[220px] bg-white border border-bd rounded shadow-xl p-3">
                                      <div className="text-xs text-font-detail mb-1">Set access</div>
                                      <div className="grid grid-cols-2 gap-2">
                                        {accessLevels.map((lvl) => (
                                          <button
                                            key={lvl}
                                            type="button"
                                            className={`px-2 py-1 rounded text-xs ${badgeClass(lvl)} whitespace-nowrap`}
                                            onClick={() => setAccess(r, mod, lvl)}
                                          >
                                            {lvl}
                                          </button>
                                        ))}
                                      </div>
                                      <div className="text-right mt-2">
                                        <button type="button" onClick={() => setOpenCell(null)} className="text-xs text-font-detail hover:underline">Close</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
