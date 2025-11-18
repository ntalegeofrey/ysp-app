"use client";

import { useEffect, useState } from "react";
import { jobTitleOptions, titleWithAbbrev } from "../utils/jobTitles";

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
    // Overview
    "Dashboard",
    "AI Insights",
    // Admin
    "System Admin",
    "Unit Registry",
    // Operations
    "Schedule",
    "Staff Management",
    "Residential Census",
    "Inventory Management",
    "Medical Run Coordination",
    // Resident Care
    "Medication Count",
    "Visitation & Phone Log",
    "Sleep Log & Watch",
    "Repair Management",
    "Log Book & Events",
    // Safety & Compliance
    "Incident Management",
    "Fire Plan Management",
    "Unit Condition (UCR)",
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
  useEffect(() => {
    // On first load, if no state yet, collapse all modules
    if (Object.keys(collapsed).length === 0) {
      const initial: Record<string, boolean> = Object.fromEntries(modules.map(m => [m, true] as const));
      setCollapsed(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const apiBase = "/api";
  const [metrics, setMetrics] = useState({ usersCount: 0, activeRoles: 0, permissionsCount: 0, pendingReviews: 0 });
  const [roleIdByName, setRoleIdByName] = useState<Record<string, number>>({});

  const toDisplay = (name: string) => {
    if (!name) return name;
    const n = name.replace(/_/g, " ");
    if (/^jjyds/i.test(n)) return n.toUpperCase();
    return n.replace(/\b\w/g, (c) => c.toUpperCase());
  };
  const toApi = (display: string) => display.replace(/\s+/g, "_").toLowerCase();

  useEffect(() => {
    const load = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`${apiBase}/admin/roles`, { credentials: 'include', headers: { ...(token? { Authorization: `Bearer ${token}` }: {}) } });
        if (!res.ok) return;
        const rolesList: Array<{id:number; name:string; description?:string; active?:boolean; usersCount?: number}> = await res.json();
        const names = rolesList.map(r => toDisplay(r.name));
        setRoleNames(prev => Array.from(new Set([...prev, ...names])));
        const idMap: Record<string, number> = {};
        for (const r of rolesList) { idMap[toDisplay(r.name)] = r.id; }
        setRoleIdByName(idMap);
        // populate roleRows table with all backend roles
        const rows = rolesList.map(r => ({
          id: String(r.id),
          name: toDisplay(r.name),
          description: r.description || '',
          users: typeof r.usersCount === 'number' ? r.usersCount : 0,
          lastModified: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          status: (r.active ? 'Active' : 'Inactive') as 'Active' | 'Inactive',
        }));
        // initialize table rows (user counts filled below)
        setRoleRows(rows);
        if (users && users.length) {
          updateRoleUserCounts(users);
        }
        // fetch permissions for each role
        const permsEntries: Array<[string, Record<string, typeof accessLevels[number]>]> = [];
        for (const r of rolesList) {
          const pr = await fetch(`${apiBase}/admin/roles/${r.id}/permissions`, { credentials: 'include', headers: { ...(token? { Authorization: `Bearer ${token}` }: {}) } });
          let map: Record<string, typeof accessLevels[number]> = {};
          if (pr.ok) {
            const arr: Array<{module:string; access:string}> = await pr.json();
            for (const p of arr) {
              const access = (p.access || '').toUpperCase();
              const normalized = access === 'FULL' ? 'Full' : access === 'EDIT' ? 'Edit' : access === 'VIEW' ? 'View' : 'None';
              map[p.module] = normalized as typeof accessLevels[number];
            }
          }
          permsEntries.push([toDisplay(r.name), { ...Object.fromEntries(modules.map(m=>[m, 'View'] as const)), ...map }]);
        }
        setMatrix(prev => ({ ...prev, ...Object.fromEntries(permsEntries) }));
        // metrics
        try {
          const m = await fetch(`/api/admin/metrics`, { credentials: 'include', headers: { Accept: 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
          if (m.ok) {
            const data = await m.json();
            setMetrics({
              usersCount: data.usersCount ?? 0,
              activeRoles: data.activeRoles ?? 0,
              permissionsCount: data.permissionsCount ?? 0,
              pendingReviews: data.pendingReviews ?? 0,
            });
  // Comprehensive list of job titles; rendered with abbreviation for clarity
  const jobTitleOptions = [
    "Administrator",
    "System Administrator",
    "IT Director",
    "Regional Administrator",
    "Program Director",
    "Assistant Program Director",
    "Assistant Program Administrator",
    "Assistant Facility Administrator",
    "Facility Administrator",
    "Director of Facility Operations",
    "Juvenile Justice Youth Development Specialist I",
    "Juvenile Justice Youth Development Specialist II",
    "Juvenile Justice Youth Development Specialist III",
    "Master Juvenile Justice Youth Development Specialist",
    "Youth Services Group Worker",
    "Clinical Social Worker I",
    "Clinical Social Worker II",
    "Clinical Social Worker Supervisor",
    "Psychologist",
    "Licensed Mental Health Counselor",
    "Director of Clinical Services",
    "Regional Clinical Coordinator",
    "Behavior Analyst",
    "Caseworker I",
    "Caseworker II",
    "Casework Supervisor",
    "Community Services Coordinator",
    "Regional Re-Entry Coordinator",
    "Regional Placement Coordinator",
    "Detention Coordinator",
    "Transport Officer",
    "Teacher",
    "Academic Instructor",
    "Special Education Teacher",
    "Education Coordinator",
    "Director of Education Programs",
    "Registered Nurse",
    "Nurse Practitioner",
    "Nursing Supervisor",
    "Medical Director",
    "Human Resources Generalist",
    "Human Resources Director",
    "Labor Relations Specialist",
    "Payroll & Time Administrator",
    "Budget Analyst",
    "Fiscal Manager",
    "General Counsel",
    "Attorney",
    "Deputy General Counsel",
    "Administrative Assistant",
    "Administrative Coordinator",
    "Training Specialist",
    "Director of Staff Development & Training",
    "Compliance Officer",
    "Licensing Coordinator",
    "Quality Assurance Manager",
    "Information Technology Specialist",
    "Network Administrator",
    "Systems Administrator",
    "IT Manager",
    "Director of Information Technology",
    "Chief Information Officer",
    "Regional Director",
    "Assistant Regional Director",
    "Deputy Commissioner",
    "Commissioner of DYS",
    "Chief of Staff",
    "Director of Operations",
    "Director of Policy & Program Development",
    "Supervisor",
    "Caseworker",
    "Program Staff",
    "Support Staff",
  ];
          }
        } catch {}
        // users
        try {
          const ur = await fetch(`${apiBase}/admin/users`, { credentials: 'include', headers: { ...(token? { Authorization: `Bearer ${token}` }: {}) } });
          if (ur.ok) {
            const arr: Array<{ id:number|string; fullName:string; jobTitle:string; email:string; role:string; enabled:boolean; mustChangePassword:boolean }>= await ur.json();
            const mapped = arr.map(u => ({
              id: typeof u.id === 'string' ? u.id : String(u.id),
              fullName: u.fullName,
              jobTitle: u.jobTitle,
              email: u.email,
              role: toDisplay(u.role),
              enabled: u.enabled,
              mustUpdate: u.mustChangePassword,
            }));
            setUsers(mapped);
          updateRoleUserCounts(mapped);
          }
        } catch {}
      } catch {}
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live updates: polling + on-focus refresh
  useEffect(() => {
    let stopped = false;
    const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    const fetchMetrics = async () => {
      if (stopped) return;
      try {
        const token = getToken();
        const m = await fetch(`/api/admin/metrics`, { credentials: 'include', headers: { Accept: 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
        if (m.ok) {
          const data = await m.json();
          setMetrics({
            usersCount: data.usersCount ?? 0,
            activeRoles: data.activeRoles ?? 0,
            permissionsCount: data.permissionsCount ?? 0,
            pendingReviews: data.pendingReviews ?? 0,
          });
        }
      } catch {}
    };

    const fetchUsers = async () => {
      if (stopped) return;
      try {
        const token = getToken();
        const ur = await fetch(`${apiBase}/admin/users`, { credentials: 'include', headers: { ...(token? { Authorization: `Bearer ${token}` }: {}) } });
        if (ur.ok) {
          const arr: Array<{ id:number|string; fullName:string; jobTitle:string; email:string; role:string; enabled:boolean; mustChangePassword:boolean }>= await ur.json();
          const mapped = arr.map(u => ({
            id: typeof u.id === 'string' ? u.id : String(u.id),
            fullName: u.fullName,
            jobTitle: u.jobTitle,
            email: u.email,
            role: toDisplay(u.role),
            enabled: u.enabled,
            mustUpdate: u.mustChangePassword,
          }));
          setUsers(mapped);
        }
      } catch {}
    };

    const fetchRolesAndPerms = async () => {
      if (stopped) return;
      try {
        const token = getToken();
        const res = await fetch(`${apiBase}/admin/roles`, { credentials: 'include', headers: { ...(token? { Authorization: `Bearer ${token}` }: {}) } });
        if (!res.ok) return;
        const rolesList: Array<{id:number; name:string; description?:string; active?:boolean; usersCount?: number}> = await res.json();
        const names = rolesList.map(r => toDisplay(r.name));
        setRoleNames(prev => Array.from(new Set([...prev, ...names])));
        const idMap: Record<string, number> = {};
        for (const r of rolesList) { idMap[toDisplay(r.name)] = r.id; }
        setRoleIdByName(prev => ({ ...prev, ...idMap }));
        // refresh roleRows from backend roles
        const rows = rolesList.map(r => ({
          id: String(r.id),
          name: toDisplay(r.name),
          description: r.description || '',
          users: typeof r.usersCount === 'number' ? r.usersCount : 0,
          lastModified: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          status: (r.active ? 'Active' : 'Inactive') as 'Active' | 'Inactive',
        }));
        setRoleRows(rows);
        const permsEntries: Array<[string, Record<string, typeof accessLevels[number]>]> = [];
        for (const r of rolesList) {
          const pr = await fetch(`${apiBase}/admin/roles/${r.id}/permissions`, { credentials: 'include', headers: { ...(token? { Authorization: `Bearer ${token}` }: {}) } });
          let map: Record<string, typeof accessLevels[number]> = {};
          if (pr.ok) {
            const arr: Array<{module:string; access:string}> = await pr.json();
            for (const p of arr) {
              const access = (p.access || '').toUpperCase();
              const normalized = access === 'FULL' ? 'Full' : access === 'EDIT' ? 'Edit' : access === 'VIEW' ? 'View' : 'None';
              map[p.module] = normalized as typeof accessLevels[number];
            }
          }
          permsEntries.push([toDisplay(r.name), { ...Object.fromEntries(modules.map(m=>[m, 'View'] as const)), ...map }]);
        }
        setMatrix(prev => ({ ...prev, ...Object.fromEntries(permsEntries) }));
      } catch {}
    };

    const onFocus = () => {
      if (document.hidden) return;
      fetchMetrics();
      fetchUsers();
      fetchRolesAndPerms();
    };

    document.addEventListener('visibilitychange', onFocus);
    const metricsTimer = setInterval(fetchMetrics, 15000);
    const usersTimer = setInterval(fetchUsers, 30000);
    const rolesTimer = setInterval(fetchRolesAndPerms, 60000);

    // Initial kick to ensure freshness
    fetchMetrics();

    return () => {
      stopped = true;
      document.removeEventListener('visibilitychange', onFocus);
      clearInterval(metricsTimer);
      clearInterval(usersTimer);
      clearInterval(rolesTimer);
    };
  }, [apiBase]);

  // SSE: true real-time updates without reload
  useEffect(() => {
    let es: EventSource | null = null;
    let stopped = false;
    const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    const fetchMetrics = async () => {
      if (stopped) return;
      try {
        const token = getToken();
        const m = await fetch(`/api/admin/metrics`, { credentials: 'include', headers: { Accept: 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
        if (m.ok) {
          const data = await m.json();
          setMetrics({
            usersCount: data.usersCount ?? 0,
            activeRoles: data.activeRoles ?? 0,
            permissionsCount: data.permissionsCount ?? 0,
            pendingReviews: data.pendingReviews ?? 0,
          });
        }
      } catch {}
    };
    const fetchUsers = async () => {
      if (stopped) return;
      try {
        const token = getToken();
        const ur = await fetch(`${apiBase}/admin/users`, { credentials: 'include', headers: { ...(token? { Authorization: `Bearer ${token}` }: {}) } });
        if (ur.ok) {
          const arr: Array<{ id:number|string; fullName:string; jobTitle:string; email:string; role:string; enabled:boolean; mustChangePassword:boolean }>= await ur.json();
          const mapped = arr.map(u => ({
            id: typeof u.id === 'string' ? u.id : String(u.id),
            fullName: u.fullName,
            jobTitle: u.jobTitle,
            email: u.email,
            role: toDisplay(u.role),
            enabled: u.enabled,
            mustUpdate: u.mustChangePassword,
          }));
          setUsers(mapped);
        }
      } catch {}
    };
    const fetchRolesAndPerms = async () => {
      if (stopped) return;
      try {
        const token = getToken();
        const res = await fetch(`${apiBase}/admin/roles`, { credentials: 'include', headers: { ...(token? { Authorization: `Bearer ${token}` }: {}) } });
        if (!res.ok) return;
        const rolesList: Array<{id:number; name:string; description?:string; active?:boolean}> = await res.json();
        const names = rolesList.map(r => toDisplay(r.name));
        setRoleNames(prev => Array.from(new Set([...prev, ...names])));
        const idMap: Record<string, number> = {};
        for (const r of rolesList) { idMap[toDisplay(r.name)] = r.id; }
        setRoleIdByName(prev => ({ ...prev, ...idMap }));
        const permsEntries: Array<[string, Record<string, typeof accessLevels[number]>]> = [];
        for (const r of rolesList) {
          const pr = await fetch(`${apiBase}/admin/roles/${r.id}/permissions`, { credentials: 'include', headers: { ...(token? { Authorization: `Bearer ${token}` }: {}) } });
          let map: Record<string, typeof accessLevels[number]> = {};
          if (pr.ok) {
            const arr: Array<{module:string; access:string}> = await pr.json();
            for (const p of arr) {
              const access = (p.access || '').toUpperCase();
              const normalized = access === 'FULL' ? 'Full' : access === 'EDIT' ? 'Edit' : access === 'VIEW' ? 'View' : 'None';
              map[p.module] = normalized as typeof accessLevels[number];
            }
          }
          permsEntries.push([toDisplay(r.name), { ...Object.fromEntries(modules.map(m=>[m, 'View'] as const)), ...map }]);
        }
        setMatrix(prev => ({ ...prev, ...Object.fromEntries(permsEntries) }));
      } catch {}
    };

    try {
      es = new EventSource('/api/admin/events', { withCredentials: true });
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          const type = data?.type as string | undefined;
          if (!type) return;
          if (type === 'metrics.changed') {
            fetchMetrics();
          } else if (type.startsWith('users.')) {
            fetchUsers();
            fetchMetrics();
          } else if (type.startsWith('roles.') || type.startsWith('permissions.')) {
            fetchRolesAndPerms();
            fetchMetrics();
          }
        } catch {}
      };
      es.onerror = () => {
        // Let the browser auto-reconnect; if it closes, we do nothing here
      };
    } catch {}

    return () => {
      stopped = true;
      if (es) es.close();
    };
  }, [apiBase]);

  // ===== User management (frontend-only) =====
  type UserRow = { id: string; fullName: string; jobTitle: string; email: string; role: string; enabled: boolean; mustUpdate: boolean };
  const [users, setUsers] = useState<UserRow[]>([]);
  const updateRoleUserCounts = (usersArr: UserRow[]) => {
    const counts: Record<string, number> = {};
    for (const u of usersArr) {
      const roleName = u.role;
      counts[roleName] = (counts[roleName] || 0) + 1;
    }
    setRoleRows((prev) => prev.map(r => ({ ...r, users: counts[r.name] || 0 })));
  };
  const [userForm, setUserForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    jobTitleOther: "",
    employeeNumber: "",
    role: "Admin",
    sendOtl: true,
  });
  const submitNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const body = {
        email: userForm.email,
        role: toApi(userForm.role),
        firstName: userForm.firstName,
        middleName: userForm.middleName,
        lastName: userForm.lastName,
        jobTitle: userForm.jobTitle,
        jobTitleOther: userForm.jobTitle === 'Other' ? userForm.jobTitleOther : undefined,
        employeeNumber: userForm.employeeNumber,
        sendOneTimeLogin: userForm.sendOtl,
      } as any;
      const res = await fetch(`${apiBase}/admin/users`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const created: { id:string|number; fullName:string; jobTitle:string; email:string; role:string; enabled:boolean; mustChangePassword:boolean } = await res.json();
        const idStr = typeof created.id === 'string' ? created.id : String(created.id);
        const newUser: UserRow = {
          id: idStr,
          fullName: created.fullName || `${userForm.firstName} ${userForm.middleName} ${userForm.lastName}`.replace(/\s+/g,' ').trim(),
          jobTitle: created.jobTitle || userForm.jobTitleOther || userForm.jobTitle,
          email: created.email,
          role: toDisplay(created.role || toApi(userForm.role)),
          enabled: created.enabled ?? true,
          mustUpdate: created.mustChangePassword ?? false,
        };
        setUsers((prev) => [newUser, ...prev]);
        setUserForm({ firstName: "", middleName: "", lastName: "", email: "", jobTitle: "", jobTitleOther: "", employeeNumber: "", role: "Admin", sendOtl: true });
        if (userForm.sendOtl) { addToast('One-time login (OTL) sent', 'success'); }
        // refresh metrics
        try {
          const token2 = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          const m = await fetch(`/api/admin/metrics`, { credentials: 'include', headers: { Accept: 'application/json', ...(token2? { Authorization: `Bearer ${token2}` }: {}) } });
          if (m.ok) {
            const data = await m.json();
            setMetrics({
              usersCount: data.usersCount ?? 0,
              activeRoles: data.activeRoles ?? 0,
              permissionsCount: data.permissionsCount ?? 0,
              pendingReviews: data.pendingReviews ?? 0,
            });
          }
        } catch {}
      }
    } catch {}
  };

  // ===== Role management (frontend-only) =====
  // Removed role tiles in favor of table-only view

  type RoleRow = {
    id: string;
    name: string;
    description: string;
    users: number;
    lastModified: string;
    status: "Active" | "Inactive";
  };

  const [roleRows, setRoleRows] = useState<RoleRow[]>([]);

  const [roleModal, setRoleModal] = useState<null | { mode: "create" | "edit"; id?: string | number; prevName?: string }>(null);
  type AccessLevel = typeof accessLevels[number];
  const moduleDefaults: Record<string, AccessLevel> = Object.fromEntries(modules.map((m) => [m, "View"])) as Record<string, AccessLevel>;
  const [roleForm, setRoleForm] = useState<{ name: string; description: string; status: boolean; moduleAccess: Record<string, AccessLevel> }>({ name: "", description: "", status: true, moduleAccess: moduleDefaults });
  const [confirmDelete, setConfirmDelete] = useState<null | { id: string; name: string }>(null);

  // Toast notifications
  type Toast = { id: string; title: string; tone?: 'success' | 'error' | 'info' };
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (title: string, tone: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const t = { id, title, tone } as Toast;
    setToasts((prev) => [t, ...prev]);
    setTimeout(() => { setToasts((prev) => prev.filter(x => x.id !== id)); }, 4000);
  };
  const removeToast = (id: string) => setToasts((prev) => prev.filter(t => t.id !== id));

  const openCreateRole = () => {
    setRoleForm({ name: "", description: "", status: true, moduleAccess: moduleDefaults });
    setRoleModal({ mode: "create" });
  };
  const openEditRole = (id: string) => {
    const row = roleRows.find((r) => r.id === id);
    const roleName = row?.name;
    if (roleName) {
      const existing = matrix[roleName] as Record<string, AccessLevel> | undefined;
      setRoleForm({ name: roleName, description: (row?.description) || "", status: (row?.status) === "Active", moduleAccess: existing ? { ...moduleDefaults, ...existing } : moduleDefaults });
    }
    setRoleModal({ mode: "edit", id, prevName: roleName });
  };
  const saveRole = async () => {
    if (!roleModal) return;
    const basicId = roleForm.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const id = roleModal.mode === "edit" && roleModal.id ? roleModal.id : basicId || `role-${Date.now()}`;
    const idStr = typeof id === 'string' ? id : String(id);

    // Ensure table row exists/updates
    setRoleRows((prev) => {
      const exists = prev.some((r) => r.id === idStr);
      const updated: RoleRow = {
        id: idStr,
        name: roleForm.name || "New Role",
        description: roleForm.description || "",
        users: 0,
        lastModified: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        status: roleForm.status ? "Active" : "Inactive",
      };
      return exists ? prev.map((r) => (r.id === idStr ? updated : r)) : [updated, ...prev];
    });

    // Persist to backend
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      let roleId: number | undefined = undefined;
      if (roleModal.mode === 'edit' && roleModal.id !== undefined) {
        const parsed = Number(roleModal.id);
        if (!Number.isNaN(parsed)) roleId = parsed;
      }
      if (roleModal.mode === 'create' || roleId === undefined) {
        const res = await fetch(`${apiBase}/admin/roles`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) },
          body: JSON.stringify({ name: toApi(roleForm.name), description: roleForm.description, active: roleForm.status })
        });
        if (res.ok) {
          const created = await res.json();
          roleId = created.id;
          // map display name -> id for inline matrix persistence
          const displayName = toDisplay(created.name || roleForm.name);
          setRoleIdByName(prev => ({ ...prev, [displayName]: Number(roleId) }));
        }
      } else {
        await fetch(`${apiBase}/admin/roles/${roleId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) },
          body: JSON.stringify({ name: toApi(roleForm.name), description: roleForm.description, active: roleForm.status })
        });
      }
      if (roleId) {
        const putBody = modules.map(m => ({ module: m, access: (roleForm.moduleAccess[m] || 'None').toUpperCase() }));
        await fetch(`${apiBase}/admin/roles/${roleId}/permissions`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) },
          body: JSON.stringify(putBody)
        });
        try { localStorage.setItem('perms-bump', String(Date.now())); } catch {}
        addToast('Role permissions saved', 'success');
        // refresh metrics after permissions update
        try {
          const m = await fetch(`/api/admin/metrics`, { credentials: 'include', headers: { Accept: 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
          if (m.ok) {
            const data = await m.json();
            setMetrics({
              usersCount: data.usersCount ?? 0,
              activeRoles: data.activeRoles ?? 0,
              permissionsCount: data.permissionsCount ?? 0,
              pendingReviews: data.pendingReviews ?? 0,
            });
          }
        } catch {}
      }
    } catch {}

    // Write selections to the permissions matrix for this role name
    const roleName = roleForm.name.trim() || idStr;
    setMatrix((prev) => {
      const base = (prev as any)[roleName] ?? moduleDefaults;
      const next = {
        ...prev,
        [roleName]: { ...base, ...roleForm.moduleAccess },
      } as typeof prev;
      // Handle rename: remove old key if editing and name changed
      if (roleModal.mode === "edit" && roleModal.prevName && roleModal.prevName !== roleName) {
        const { [roleModal.prevName]: _removed, ...rest } = next as any;
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
    // If renamed, update id map key
    if (roleModal.mode === 'edit' && roleModal.prevName && roleModal.prevName !== roleName) {
      const prevName = roleModal.prevName as string;
      setRoleIdByName(prev => {
        const copy: Record<string, number> = { ...prev };
        if (copy[prevName] !== undefined) {
          copy[roleName] = copy[prevName];
          delete copy[prevName];
        }
        return copy;
      });
    }

    setRoleModal(null);
  };
  const requestDelete = (id: string, name: string) => setConfirmDelete({ id, name });
  const confirmDeleteNow = () => {
    if (!confirmDelete) return;
    const { id } = confirmDelete;
    setRoleRows((prev) => prev.filter((r) => r.id !== id));
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

  const setAccess = async (role: string, module: string, level: typeof accessLevels[number]) => {
    const base = matrix[role] ?? moduleDefaults;
    const nextRole = { ...base, [module]: level };
    setMatrix((prev) => ({ ...prev, [role]: nextRole }));
    setOpenCell(null);
    const roleId = roleIdByName[role];
    if (roleId) {
      const putBody = modules.map(m => ({ module: m, access: (nextRole[m] || 'None').toUpperCase() }));
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        await fetch(`${apiBase}/admin/roles/${roleId}/permissions`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) },
          body: JSON.stringify(putBody)
        });
        try { localStorage.setItem('perms-bump', String(Date.now())); } catch {}
        addToast('Permissions updated', 'success');
      } catch {}
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
              <p className="text-2xl font-bold text-primary">{metrics.usersCount}</p>
              <p className="text-sm text-font-detail">Total Users</p>
            </div>

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`min-w-[260px] max-w-sm shadow-lg rounded-lg border p-3 flex items-start gap-3 ${t.tone === 'success' ? 'bg-white border-success' : t.tone === 'error' ? 'bg-white border-error' : 'bg-white border-bd'}`}>
            <i className={`fa-solid ${t.tone === 'success' ? 'fa-circle-check text-success' : t.tone === 'error' ? 'fa-circle-exclamation text-error' : 'fa-circle-info text-primary'} mt-1`}></i>
            <div className="flex-1 text-sm text-font-base">{t.title}</div>
            <button className="text-font-detail hover:text-primary" onClick={() => removeToast(t.id)}>
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        ))}
      </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-user-shield text-success text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-success">{metrics.activeRoles}</p>
              <p className="text-sm text-font-detail">Active Roles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-lock text-warning text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-warning">{metrics.permissionsCount}</p>
              <p className="text-sm text-font-detail">Permissions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-clock text-error text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-error">{metrics.pendingReviews}</p>
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
                <label className="block text-sm font-medium text-font-base mb-2">First Name</label>
                <input value={userForm.firstName} onChange={(e)=>setUserForm({...userForm, firstName: e.target.value})} type="text" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="First name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Middle Name</label>
                <input value={userForm.middleName} onChange={(e)=>setUserForm({...userForm, middleName: e.target.value})} type="text" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Middle name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Last Name</label>
                <input value={userForm.lastName} onChange={(e)=>setUserForm({...userForm, lastName: e.target.value})} type="text" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Last name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Email</label>
                <input value={userForm.email} onChange={(e)=>setUserForm({...userForm, email: e.target.value})} type="email" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="user@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Job Title</label>
                <select value={userForm.jobTitle} onChange={(e)=>setUserForm({...userForm, jobTitle: e.target.value})} className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>Select job title</option>
                  {jobTitleOptions.map((t) => (
                    <option key={t} value={t}>{titleWithAbbrev(t)}</option>
                  ))}
                  <option>Other</option>
                </select>
              </div>
              {userForm.jobTitle === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Specify Job Title</label>
                  <input value={userForm.jobTitleOther} onChange={(e)=>setUserForm({...userForm, jobTitleOther: e.target.value})} type="text" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter job title" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Employee Number</label>
                <input value={userForm.employeeNumber} onChange={(e)=>setUserForm({...userForm, employeeNumber: e.target.value})} type="text" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="EMP-2024-XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Role</label>
                <select value={userForm.role} onChange={(e)=>setUserForm({...userForm, role: e.target.value})} className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus-border-transparent">
                  {roleNames.map(r => (
                    <option key={r}>{r}</option>
                  ))}
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
                      <select value={u.role} onChange={async (e)=>{
                        const newRole = e.target.value;
                        setUsers(prev=>prev.map(p=>p.id===u.id? {...p, role: newRole}:p));
                        try {
                          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                          await fetch(`${apiBase}/admin/users/${u.id}`, {
                            method: 'PATCH',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) },
                            body: JSON.stringify({ role: toApi(newRole) })
                          });
                          // refresh metrics (roles/users might impact counts indirectly)
                          try {
                            const m = await fetch(`/api/admin/metrics`, { credentials: 'include', headers: { Accept: 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
                            if (m.ok) {
                              const data = await m.json();
                              setMetrics({ usersCount: data.usersCount ?? 0, activeRoles: data.activeRoles ?? 0, permissionsCount: data.permissionsCount ?? 0, pendingReviews: data.pendingReviews ?? 0 });
                            }
                          } catch {}
                        } catch {}
                      }} className="border rounded px-2 py-1 bg-white">
                        {roleNames.map(r => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={async ()=>{
                        const next = !u.enabled;
                        setUsers(prev=>prev.map(p=>p.id===u.id? {...p, enabled: next}:p));
                        try {
                          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                          await fetch(`${apiBase}/admin/users/${u.id}`, {
                            method: 'PATCH',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) },
                            body: JSON.stringify({ enabled: next })
                          });
                          // refresh metrics (pending reviews/users may change depending on logic)
                          try {
                            const m = await fetch(`/api/admin/metrics`, { credentials: 'include', headers: { Accept: 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
                            if (m.ok) {
                              const data = await m.json();
                              setMetrics({ usersCount: data.usersCount ?? 0, activeRoles: data.activeRoles ?? 0, permissionsCount: data.permissionsCount ?? 0, pendingReviews: data.pendingReviews ?? 0 });
                            }
                          } catch {}
                        } catch {}
                      }} className="px-3 py-1 rounded border">{u.enabled? 'Disable':'Enable'}</button>
                    </td>
                    <td className="px-4 py-3 text-sm">{u.mustUpdate? 'Yes':'No'}</td>
                    <td className="px-4 py-3 text-sm"><button onClick={async ()=>{
                      try { 
                        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                        await fetch(`${apiBase}/admin/users/${u.id}/otl`, { method: 'POST', credentials: 'include', headers: { ...(token? { Authorization: `Bearer ${token}` }: {}) } }); 
                        // refresh metrics (pending reviews may change)
                        try {
                          const m = await fetch(`/api/admin/metrics`, { credentials: 'include', headers: { Accept: 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
                          if (m.ok) {
                            const data = await m.json();
                            setMetrics({ usersCount: data.usersCount ?? 0, activeRoles: data.activeRoles ?? 0, permissionsCount: data.permissionsCount ?? 0, pendingReviews: data.pendingReviews ?? 0 });
                          }
                        } catch {}
                      } catch {}
                    }} className="px-3 py-1 rounded bg-primary text-white">Send OTL</button></td>
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
                          const row = matrix[r] ?? moduleDefaults;
                          const val = (row as any)[mod] ?? 'View';
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
