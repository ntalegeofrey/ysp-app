'use client';

import { useEffect, useMemo, useState } from 'react';

export default function OnboardingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [canAddStaff, setCanAddStaff] = useState<boolean>(false);
  const [canAddResident, setCanAddResident] = useState<boolean>(false);
  const [canEditResident, setCanEditResident] = useState<boolean>(false);
  const [canDischargeResident, setCanDischargeResident] = useState<boolean>(false);
  const [programId, setProgramId] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [categoryOther, setCategoryOther] = useState<string>('');

  type ResidentInfo = { pk: number|string; name: string; residentId: string; room: string; status: string; advocate: string; admissionDate: string };
  const [residentEdit, setResidentEdit] = useState<ResidentInfo | null>(null);
  const [residentAction, setResidentAction] = useState<null | { pk: number|string; action: 'remove' | 'inactive' | 'temp'; tempLocation?: string }>(null);
  const [staffEdit, setStaffEdit] = useState<null | { email: string; roleType: string }>(null);

  // Staff search and autofill
  type StaffLite = { id: string; fullName: string; email: string; jobTitle?: string; employeeNumber?: string };
  const [staffList, setStaffList] = useState<StaffLite[]>([]);
  const [staffNameQuery, setStaffNameQuery] = useState<string>('');
  const [staffEmailQuery, setStaffEmailQuery] = useState<string>('');
  const [emailVal, setEmailVal] = useState<string>('');
  const [firstNameVal, setFirstNameVal] = useState<string>('');
  const [lastNameVal, setLastNameVal] = useState<string>('');
  const [employeeIdVal, setEmployeeIdVal] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<StaffLite | null>(null);
  // Resident form minimal state
  const [resResidentId, setResResidentId] = useState<string>('');
  const [resRoom, setResRoom] = useState<string>('');
  const [resFirstName, setResFirstName] = useState<string>('');
  const [resLastName, setResLastName] = useState<string>('');
  const [resDob, setResDob] = useState<string>('');
  const [resAdmissionDate, setResAdmissionDate] = useState<string>('');
  const [resStatus, setResStatus] = useState<string>('General Population');
  const [resAdvocate, setResAdvocate] = useState<string>('');

  // Local toasts
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; tone: 'info' | 'success' | 'error' }>>([]);
  const removeToast = (id: string) => setToasts(t => t.filter(x => x.id !== id));
  const addToast = (title: string, tone: 'info' | 'success' | 'error' = 'info') => {
    const id = String(Date.now() + Math.random());
    setToasts(t => [...t, { id, title, tone }]);
    setTimeout(() => removeToast(id), 3500);
  };

  useEffect(() => {
    // Resolve selected program
    try {
      const spRaw = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
      const sp = spRaw ? JSON.parse(spRaw) as { id?: number|string } : null;
      setProgramId(sp?.id ? String(sp.id) : '');
    } catch {}
    // Load permissions for tabs/actions
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const ch = async (key: string) => {
          const res = await fetch(`/api/permissions/check?module=${encodeURIComponent(key)}`, { credentials: 'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
          if (!res.ok) return false; const d = await res.json(); return Boolean(d?.allowed);
        };
        const [staffP, residentP, editRes, dischargeRes] = await Promise.all([
          ch('op.ADD_STAFF'),
          ch('op.ADD_RESIDENT'),
          ch('op.EDIT_RESIDENT'),
          ch('op.DISCHARGE_RESIDENT'),
        ]);
        setCanAddStaff(staffP);
        setCanAddResident(residentP);
        setCanEditResident(editRes);
        setCanDischargeResident(dischargeRes);
      } catch {}
    })();
    // Load staff list via public search (works for non-admins)
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch('/api/users/search?q=', { credentials: 'include', headers: { 'Accept': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        if (!res.ok) return;
        const arr: Array<{ id:string|number; fullName:string; email:string; jobTitle?: string; employeeNumber?: string }>= await res.json();
        const mapped: StaffLite[] = arr.map(u => ({ id: typeof u.id === 'string' ? u.id : String(u.id), fullName: u.fullName, email: u.email, jobTitle: u.jobTitle, employeeNumber: u.employeeNumber }));
        setStaffList(mapped);
      } catch {}
    })();
  }, []);

  // Program assignments (Active Staff)
  type Assignment = { userEmail: string; roleType: string };
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const staffByEmail = useMemo(() => Object.fromEntries(staffList.map(s => [((s.email || '') as string).toLowerCase(), s])), [staffList]);

  // Collapse any duplicate assignment rows by email so each staff appears once
  const uniqueAssignments: Assignment[] = useMemo(() => {
    const map: Record<string, Assignment> = {};
    for (const a of assignments) {
      const key = a.userEmail?.toLowerCase?.() || '';
      if (!key) continue;
      if (!map[key]) map[key] = a;
    }
    return Object.values(map);
  }, [assignments]);
  const loadAssignments = async () => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/programs/${programId}/assignments`, { credentials: 'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
      if (!res.ok) return;
      const arr: Array<Assignment> = await res.json();
      setAssignments(arr);
    } catch {}
  };
  useEffect(() => { if (programId) loadAssignments(); }, [programId]);

  // Load next auto-generated 6-digit resident ID when switching to Residents tab or program changes
  useEffect(() => {
    (async () => {
      try {
        if (activeTab !== 'residents' || !programId) return;
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const r = await fetch(`/api/programs/${programId}/residents/next-id`, { credentials: 'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
        if (!r.ok) return;
        const data = await r.json();
        if (data?.nextId) setResResidentId(String(data.nextId));
      } catch {}
    })();
  }, [activeTab, programId]);

  // Residents state + loader
  type ProgramResident = { id: number|string; firstName: string; lastName: string; residentId?: string; room?: string; status?: string; advocate?: string; admissionDate?: string; temporaryLocation?: string; dateOfBirth?: string };
  const [residents, setResidents] = useState<ProgramResident[]>([]);
  const loadResidents = async () => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/programs/${programId}/residents`, { credentials: 'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
      if (!res.ok) return;
      const arr: ProgramResident[] = await res.json();
      setResidents(arr);
    } catch {}
  };
  useEffect(() => { if (programId) loadResidents(); }, [programId]);

  const activeResidentsCount = residents.length;
  const activeStaffCount = uniqueAssignments.length;
  const temporaryLocationCount = residents.filter(r => (r.temporaryLocation||'').trim() !== '').length;

  // Real-time residents refresh via SSE
  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/events');
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data || '{}') as { type?: string; programId?: number|string };
          if (!data?.type) return;
          const pid = data?.programId ? String(data.programId) : '';
          if (!programId || (pid && pid !== programId)) return;
          if (data.type === 'programs.residents.added' || data.type === 'programs.residents.updated' || data.type === 'programs.residents.removed') {
            loadResidents();
          }
          if (data.type === 'programs.assignments.updated') {
            loadAssignments();
          }
        } catch {}
      };
      es.onerror = () => {};
    } catch {}
    return () => { try { es && es.close(); } catch {} };
  }, [programId]);

  return (
    <>
    <div id="management-main" className="flex-1 p-6 overflow-auto">
      <div id="overview-stats" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-users text-primary text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-primary">{activeResidentsCount}</p>
              <p className="text-sm text-font-detail">Active Residents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-user-tie text-success text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-success">{activeStaffCount}</p>
              <p className="text-sm text-font-detail">Active Staff</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-user-slash text-warning text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-warning">{temporaryLocationCount}</p>
              <p className="text-sm text-font-detail">Temporary Location</p>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Tab Navigation --> */}
      <div className="bg-white rounded-lg border border-bd mb-8">
        <div className="border-b border-bd">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              id="tab-overview"
              className={`flex items-center py-4 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-font-detail hover:text-font-base'
              }`}
            >
              <i
                className={`fa-solid fa-chart-pie mr-2 ${
                  activeTab === 'overview' ? 'text-primary' : 'text-font-detail'
                }`}
              ></i>
              Overview
            </button>
            {canAddResident && (
            <button
              onClick={() => setActiveTab('residents')}
              id="tab-residents"
              className={`flex items-center py-4 text-sm font-medium border-b-2 ${
                activeTab === 'residents'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-font-detail hover:text-font-base'
              }`}
            >
              <i
                className={`fa-solid fa-user-plus mr-2 ${
                  activeTab === 'residents' ? 'text-primary' : 'text-font-detail'
                }`}
              ></i>
              Resident Management
            </button>
            )}

      {/* Staff Edit Modal */}
      {staffEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-bd w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-font-base">Edit Staff Role</h3>
              <button className="text-font-detail hover:text-primary" onClick={() => setStaffEdit(null)}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs mb-1">Email</label>
                <input className="w-full px-3 py-2 border border-bd-input rounded-lg bg-gray-50" value={staffEdit.email} readOnly />
              </div>
              <div>
                <label className="block text-xs mb-1">Program Role</label>
                <select className="w-full px-3 py-2 border border-bd-input rounded-lg" value={staffEdit.roleType} onChange={(e)=> setStaffEdit({ ...staffEdit, roleType: e.target.value })}>
                  <option value="DIRECTOR">Director</option>
                  <option value="ASSISTANT_DIRECTOR">Assistant Director</option>
                  <option value="REGIONAL_ADMIN">Regional Admin</option>
                  <option value="STAFF">Staff</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button className="px-4 py-2 rounded-lg border border-bd text-sm" onClick={() => setStaffEdit(null)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-success text-white text-sm" onClick={async () => {
                if (!staffEdit || !programId) return;
                try {
                  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                  const updated = assignments.map(x => x.userEmail.toLowerCase() === staffEdit.email.toLowerCase() ? { ...x, roleType: staffEdit.roleType } : x);
                  const resp = await fetch(`/api/programs/${programId}/assignments`, { method:'POST', credentials:'include', headers: { 'Content-Type':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify({ assignments: updated }) });
                  if (!resp.ok) { addToast('Failed to update staff role', 'error'); return; }
                  setAssignments(updated);
                  addToast('Staff role updated', 'success');
                  try { localStorage.setItem('global-toast', JSON.stringify({ title: 'Staff role updated', tone: 'success' })); } catch {}
                  setStaffEdit(null);
                } catch { addToast('Failed to update staff role', 'error'); }
              }}>
                <i className="fa-solid fa-check mr-2"></i>Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
            {canAddStaff && (
            <button
              onClick={() => setActiveTab('staff')}
              id="tab-staff"
              className={`flex items-center py-4 text-sm font-medium border-b-2 ${
                activeTab === 'staff'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-font-detail hover:text-font-base'
              }`}
            >
              <i
                className={`fa-solid fa-user-tie mr-2 ${
                  activeTab === 'staff' ? 'text-primary' : 'text-font-detail'
                }`}
              ></i>
              Staff Management
            </button>
            )}
          </nav>
        </div>

        {/* <!-- Overview Tab Content --> */}
        {activeTab === 'overview' && (
          <div id="overview-content" className="p-6">
            <div id="active-residents-table" className="mb-8">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-font-base flex items-center">
                      <i className="fa-solid fa-users text-primary mr-3"></i>
                      Active Residents
                    </h3>
                    <p className="text-sm text-font-detail mt-1">
                      Currently active residents in the facility
                    </p>
                  </div>
                  <div className="flex space-x-3"></div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border border-bd">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Room</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Advocate</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Admission Date</th>
                      {canAddResident && <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bd">
                    {residents.length === 0 ? (
                      <tr>
                        <td className="px-4 py-3 text-sm text-font-detail" colSpan={canAddResident ? 6 : 5}>No residents yet</td>
                      </tr>
                    ) : (
                      residents.map((r) => (
                        <tr key={String(r.id)} className="bg-white hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-font-base">{[r.lastName || '', r.firstName || ''].filter(Boolean).join(' ').trim()}</td>
                          <td className="px-4 py-3 text-sm">{r.residentId || ''}</td>
                          <td className="px-4 py-3 text-sm">{r.room || ''}</td>
                          <td className="px-4 py-3 text-sm">
                            {r.status ? (
                              <span className={`px-2 py-1 text-white text-xs rounded-full ${r.status === 'Restricted' ? 'bg-error' : r.status === 'ALOYO' ? 'bg-warning' : r.status === 'Team Leader' ? 'bg-primary' : 'bg-success'}`}>{r.status}</span>
                            ) : ''}
                          </td>
                          <td className="px-4 py-3 text-sm">{r.advocate || ''}</td>
                          <td className="px-4 py-3 text-sm">{r.admissionDate ? new Date(r.admissionDate).toLocaleDateString() : ''}</td>
                          {(canEditResident || canDischargeResident) && (
                            <td className="px-4 py-3 text-sm">
                              {canEditResident && (
                              <button className="text-primary hover:text-primary-light mr-2" title="Edit" onClick={() => {
                                setResidentEdit({
                                  pk: r.id,
                                  name: [r.firstName || '', r.lastName || ''].filter(Boolean).join(' ').trim(),
                                  residentId: r.residentId || '',
                                  room: r.room || '',
                                  status: r.status || 'General Population',
                                  advocate: r.advocate || '',
                                  admissionDate: r.admissionDate || ''
                                });
                              }}>
                                <i className="fa-solid fa-edit"></i>
                              </button>
                              )}
                              {canDischargeResident && (
                              <button className="text-warning hover:text-yellow-500" title="Actions" onClick={() => setResidentAction({ pk: r.id, action: 'remove' })}>
                                <i className="fa-solid fa-archive"></i>
                              </button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div id="active-staff-table">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-font-base flex items-center">
                      <i className="fa-solid fa-user-tie text-primary mr-3"></i>
                      Active Staff
                    </h3>
                    <p className="text-sm text-font-detail mt-1">
                      Currently active staff members in the program
                    </p>
                  </div>
                  <div className="flex space-x-3">
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border border-bd">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Program Role</th>
                      {canAddStaff && <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bd">
                    {uniqueAssignments.map((a, idx) => {
                      const s = staffByEmail[a.userEmail?.toLowerCase?.() || ''];
                      return (
                        <tr key={`${a.userEmail}-${idx}`} className="bg-white hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-font-base">{s?.fullName || a.userEmail}</td>
                          <td className="px-4 py-3 text-sm">{s?.email || a.userEmail}</td>
                          <td className="px-4 py-3 text-sm">{s?.jobTitle || 'Staff'}</td>
                          {canAddStaff && (
                            <td className="px-4 py-3 text-sm">
                              <button className="text-primary hover:text-primary-light mr-3" title="Edit role" onClick={() => setStaffEdit({ email: a.userEmail, roleType: a.roleType })}>
                                <i className="fa-solid fa-edit"></i>
                              </button>
                              <button className="text-warning hover:text-yellow-600" onClick={async () => {
                                try {
                                  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                                  const remaining = assignments.filter(x => x.userEmail.toLowerCase() !== (a.userEmail||'').toLowerCase());
                                  await fetch(`/api/programs/${programId}/assignments`, {
                                    method: 'POST', credentials: 'include', headers: { 'Content-Type':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify({ assignments: remaining })
                                  });
                                  setAssignments(remaining);
                                  addToast('Staff removed from program', 'success');
                                  try { localStorage.setItem('global-toast', JSON.stringify({ title: 'Staff removed from program', tone: 'success' })); } catch {}
                                } catch {}
                              }} title="Remove from program">
                                <i className="fa-solid fa-user-slash"></i>
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {uniqueAssignments.length === 0 && (
                      <tr><td className="px-4 py-3 text-sm text-font-detail" colSpan={canAddStaff?4:3}>No staff assigned yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* <!-- Resident Management Tab Content --> */}
        {activeTab === 'residents' && (
          <div id="residents-content" className="p-6 ">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-user-plus text-primary mr-3"></i>
                  Add New Resident
                </h3>
                <p className="text-sm text-font-detail mt-1">Add new residents to the facility</p>
              </div>
            </div>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              try {
                if (!programId) { addToast('No program selected', 'error'); return; }
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const payload = {
                  firstName: resFirstName.trim(),
                  lastName: resLastName.trim(),
                  residentId: resResidentId || undefined,
                  room: resRoom || undefined,
                  status: resStatus || undefined,
                  advocate: resAdvocate || undefined,
                  admissionDate: resAdmissionDate || undefined,
                  dateOfBirth: resDob || undefined,
                };
                const resp = await fetch(`/api/programs/${programId}/residents`, { method:'POST', credentials:'include', headers: { 'Content-Type':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify(payload) });
                if (!resp.ok) { addToast('Failed to add resident', 'error'); return; }
                addToast('Resident added to program', 'success');
                try { localStorage.setItem('global-toast', JSON.stringify({ title: 'Resident added to program', tone: 'success' })); } catch {}
                // clear form completely
                setResFirstName(''); setResLastName(''); setResDob(''); setResAdmissionDate(''); setResResidentId(''); setResRoom(''); setResStatus('General Population'); setResAdvocate('');
                await loadResidents();
                // fetch next auto id for next entry
                try {
                  const r = await fetch(`/api/programs/${programId}/residents/next-id`, { credentials:'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
                  if (r.ok) { const d = await r.json(); if (d?.nextId) setResResidentId(String(d.nextId)); }
                } catch {}
              } catch {}
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    First Name
                  </label>
                  <input type="text" value={resFirstName} onChange={(e)=> setResFirstName(e.target.value)} className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Last Name</label>
                  <input type="text" value={resLastName} onChange={(e)=> setResLastName(e.target.value)} className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={resDob}
                    onChange={(e)=> setResDob(e.target.value)}
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Date of Admission
                  </label>
                  <input type="date" value={resAdmissionDate} onChange={(e)=> setResAdmissionDate(e.target.value)} className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Resident ID
                  </label>
                  <input
                    type="text"
                    value={resResidentId}
                    readOnly
                    tabIndex={-1}
                    placeholder="Auto-generated"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Room Assignment
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={resRoom}
                    onChange={(e)=> setResRoom(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 101"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Advocate Staff
                  </label>
                  <select value={resAdvocate} onChange={(e)=> setResAdvocate(e.target.value)} className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Select Staff</option>
                    <option>Davis, L.</option>
                    <option>Wilson, M.</option>
                    <option>Brown, P.</option>
                    <option>Martinez, R.</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">
                  Initial Status
                </label>
                <select value={resStatus} onChange={(e)=> setResStatus(e.target.value)} className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="General Population">General Population</option>
                  <option value="ALOYO">ALOYO</option>
                  <option value="Restricted">Restricted</option>
                  <option value="Team Leader">Team Leader</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">
                  Admission Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter any relevant admission notes..."
                  className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                ></textarea>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-success text-white px-6 py-2 rounded-lg hover:bg-green-600 text-sm"
                >
                  <i className="fa-solid fa-check mr-2"></i>Add Resident
                </button>
                <button
                  type="button"
                  onClick={() => { setResFirstName(''); setResLastName(''); setResAdmissionDate(''); setResResidentId(''); setResRoom(''); setResStatus('General Population'); setResAdvocate(''); }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 text-sm"
                >
                  <i className="fa-solid fa-times mr-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* <!-- Staff Management Tab Content --> */}
        {activeTab === 'staff' && (
          <div id="staff-content" className="p-6 ">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-user-tie text-primary mr-3"></i>
                  Add New Staff Member
                </h3>
                <p className="text-sm text-font-detail mt-1">
                  Add new staff members to the program
                </p>
              </div>
            </div>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              try {
                const sel = selectedStaff || (emailVal ? { id: employeeIdVal || '', fullName: `${firstNameVal} ${lastNameVal}`.trim(), email: emailVal } as StaffLite : null);
                if (!sel || !sel.email) return;
                const spRaw = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
                const sp = spRaw ? JSON.parse(spRaw) as { id?: number|string } : null;
                const programId = sp?.id ? String(sp.id) : '';
                if (!programId) { addToast('No program selected', 'error'); return; }
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                // Get existing assignments, then append staff
                const ga = await fetch(`/api/programs/${programId}/assignments`, { credentials: 'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
                const existing: Array<{ userEmail:string; roleType:string }> = ga.ok ? await ga.json() : [];
                const already = existing.some(x => (x.userEmail||'').toLowerCase() === (sel.email||'').toLowerCase());
                if (already) { addToast('User is already added to this program', 'error'); return; }
                const next = [...existing, { userEmail: sel.email, roleType: 'STAFF' }];
                const post = await fetch(`/api/programs/${programId}/assignments`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: { 'Content-Type':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) },
                  body: JSON.stringify({ assignments: next })
                });
                if (post.ok) {
                  await loadAssignments();
                  addToast('Staff added to program', 'success');
                  // Clear form
                  setSelectedStaff(null);
                  setStaffNameQuery('');
                  setStaffEmailQuery('');
                  setEmailVal('');
                  setFirstNameVal('');
                  setLastNameVal('');
                  setEmployeeIdVal('');
                }
              } catch {}
            }}>
              {/* Staff lookup by Name */}
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Search staff by name</label>
                <div className="relative">
                  <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-font-detail"></i>
                  <input
                    type="text"
                    placeholder="Type a name..."
                    value={staffNameQuery}
                    onChange={(e) => {
                      setStaffNameQuery(e.target.value);
                      if (!e.target.value) { if (!staffEmailQuery) { setSelectedStaff(null); setFirstNameVal(''); setLastNameVal(''); setEmployeeIdVal(''); setEmailVal(''); } }
                    }}
                    className="w-full pl-9 pr-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                {staffNameQuery && !selectedStaff && (
                  <div className="mt-2 bg-white border border-bd rounded-lg max-h-48 overflow-auto">
                    {staffList.filter(s => ((s.fullName || '').toLowerCase()).includes(staffNameQuery.toLowerCase())).slice(0,8).map(s => (
                      <button
                        type="button"
                        key={s.id}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => {
                          setSelectedStaff(s);
                          setEmailVal(s.email);
                          const parts = (s.fullName || '').trim().split(/\s+/);
                          setFirstNameVal(parts[0] || '');
                          setLastNameVal(parts.length > 1 ? parts[parts.length-1] : '');
                          setEmployeeIdVal((s.employeeNumber || '').toString() || s.id);
                          setStaffNameQuery('');
                          setStaffEmailQuery('');
                        }}
                      >
                        <span className="text-sm text-font-base">{s.fullName}</span>
                        <span className="text-xs text-font-detail">{s.email}</span>
                      </button>
                    ))}
                    {staffList.filter(s => ((s.fullName || '').toLowerCase()).includes(staffNameQuery.toLowerCase())).length === 0 && (
                      <div className="px-3 py-2 text-xs text-font-detail">No matches</div>
                    )}
                  </div>
                )}
              </div>
              <div className="text-center text-sm text-font-detail">OR</div>
              {/* Staff lookup by Email */}
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Search by Email Address</label>
                <input
                  type="email"
                  placeholder="firstname.lastname@mass.gov"
                  value={emailVal}
                  onChange={(e) => {
                    const v = e.target.value;
                    setEmailVal(v);
                    setStaffEmailQuery(v);
                    if (!v) { if (!staffNameQuery) { setSelectedStaff(null); setFirstNameVal(''); setLastNameVal(''); setEmployeeIdVal(''); } }
                  }}
                  className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                {staffEmailQuery && !selectedStaff && (
                  <div className="mt-2 bg-white border border-bd rounded-lg max-h-48 overflow-auto">
                    {staffList.filter(s => ((s.email || '').toLowerCase().includes(staffEmailQuery.toLowerCase()) || (s.fullName || '').toLowerCase().includes(staffEmailQuery.toLowerCase()))).slice(0,8).map(s => (
                      <button
                        type="button"
                        key={s.id}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => {
                          setSelectedStaff(s);
                          setEmailVal(s.email);
                          const parts = (s.fullName || '').trim().split(/\s+/);
                          setFirstNameVal(parts[0] || '');
                          setLastNameVal(parts.length > 1 ? parts[parts.length-1] : '');
                          setEmployeeIdVal((s.employeeNumber || '').toString() || s.id);
                          setStaffEmailQuery('');
                          setStaffNameQuery('');
                        }}
                      >
                        <span className="text-sm text-font-base">{s.fullName}</span>
                        <span className="text-xs text-font-detail">{s.email}</span>
                      </button>
                    ))}
                    {staffList.filter(s => ((s.email || '').toLowerCase().includes(staffEmailQuery.toLowerCase()) || (s.fullName || '').toLowerCase().includes(staffEmailQuery.toLowerCase()))).length === 0 && (
                      <div className="px-3 py-2 text-xs text-font-detail">No matches</div>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstNameVal}
                    readOnly
                    tabIndex={-1}
                    onFocus={(e) => e.currentTarget.blur()}
                    className={`w-full px-3 py-2 border border-bd-input rounded-lg bg-gray-50 cursor-not-allowed`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastNameVal}
                    readOnly
                    tabIndex={-1}
                    onFocus={(e) => e.currentTarget.blur()}
                    className={`w-full px-3 py-2 border border-bd-input rounded-lg bg-gray-50 cursor-not-allowed`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={employeeIdVal}
                    readOnly
                    tabIndex={-1}
                    onFocus={(e) => e.currentTarget.blur()}
                    className={`w-full px-3 py-2 border border-bd-input rounded-lg bg-gray-50 cursor-not-allowed`}
                  />
                </div>
                <div className="hidden"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Position</label>
                  <select className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Select Position</option>
                    <option>Juvenile Justice Youth Development Specialist I</option>
                    <option>Juvenile Justice Youth Development Specialist II</option>
                    <option>Juvenile Justice Youth Development Specialist III</option>
                    <option>Master Juvenile Justice Youth Development Specialist</option>
                    <option>Youth Services Group Worker</option>
                    <option>Assistant Program Director</option>
                    <option>Program Director</option>
                    <option>Assistant Facility Administrator</option>
                    <option>Facility Administrator</option>
                    <option>Director of Facility Operations</option>
                    <option>Clinical Social Worker I</option>
                    <option>Clinical Social Worker II</option>
                    <option>Clinical Social Worker Supervisor</option>
                    <option>Psychologist</option>
                    <option>Licensed Mental Health Counselor</option>
                    <option>Director of Clinical Services</option>
                    <option>Regional Clinical Coordinator</option>
                    <option>Behavior Analyst / BCBA</option>
                    <option>Caseworker I</option>
                    <option>Caseworker II</option>
                    <option>Caseworker I / II</option>
                    <option>Casework Supervisor</option>
                    <option>Community Services Coordinator</option>
                    <option>Regional Re-Entry Coordinator</option>
                    <option>Regional Placement Coordinator</option>
                    <option>Detention Coordinator</option>
                    <option>Transport Officer / Driver</option>
                    <option>Teacher / Academic Instructor</option>
                    <option>Special Education Teacher</option>
                    <option>Education Coordinator</option>
                    <option>Director of Education Programs</option>
                    <option>Registered Nurse</option>
                    <option>Nurse Practitioner</option>
                    <option>Nursing Supervisor</option>
                    <option>Medical Director</option>
                    <option>Human Resources Generalist</option>
                    <option>Human Resources Director</option>
                    <option>Labor Relations Specialist</option>
                    <option>Payroll & Time Administrator</option>
                    <option>Budget Analyst</option>
                    <option>Fiscal Manager</option>
                    <option>General Counsel / Attorney</option>
                    <option>Deputy General Counsel</option>
                    <option>Administrative Assistant / Coordinator</option>
                    <option>Training Specialist</option>
                    <option>Director of Staff Development & Training</option>
                    <option>Compliance Officer</option>
                    <option>Licensing Coordinator</option>
                    <option>Quality Assurance Manager</option>
                    <option>Information Technology Specialist</option>
                    <option>Network Administrator</option>
                    <option>Systems Administrator</option>
                    <option>IT Manager</option>
                    <option>Director of Information Technology</option>
                    <option>Chief Information Officer</option>
                    <option>Regional Director</option>
                    <option>Assistant Regional Director</option>
                    <option>Deputy Commissioner</option>
                    <option>Commissioner of DYS</option>
                    <option>Chief of Staff</option>
                    <option>Director of Operations</option>
                    <option>Director of Policy & Program Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Select Category</option>
                    <option>Direct Care</option>
                    <option>Clinical</option>
                    <option>Administration</option>
                    <option>Medical</option>
                    <option>Education</option>
                    <option>Other</option>
                  </select>
                  {category === 'Other' && (
                    <input
                      type="text"
                      value={categoryOther}
                      onChange={(e) => setCategoryOther(e.target.value)}
                      placeholder="Specify Category"
                      className="mt-2 w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Active</option>
                    <option>Training</option>
                    <option>Shadowing</option>
                    <option>Probationary</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter any relevant notes..."
                  className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                ></textarea>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-success text-white px-6 py-2 rounded-lg hover:bg-green-600 text-sm"
                >
                  <i className="fa-solid fa-check mr-2"></i>Add Staff
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 text-sm"
                >
                  <i className="fa-solid fa-times mr-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Resident Edit Modal */}
      {residentEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-bd w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-font-base">Edit Resident</h3>
              <button className="text-font-detail hover:text-primary" onClick={() => setResidentEdit(null)}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <form className="space-y-3" onSubmit={async (e) => {
              e.preventDefault();
              if (!residentEdit || !programId) return;
              try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                // Split name back if user edited name field (Last, First)
                let firstName = undefined as string | undefined;
                let lastName = undefined as string | undefined;
                if (residentEdit.name) {
                  const n = residentEdit.name.trim();
                  const parts = n.split(',');
                  if (parts.length >= 2) { lastName = parts[0].trim(); firstName = parts.slice(1).join(',').trim(); }
                }
                const payload: any = {
                  room: residentEdit.room || undefined,
                  status: residentEdit.status || undefined,
                  advocate: residentEdit.advocate || undefined,
                  admissionDate: residentEdit.admissionDate || undefined,
                };
                // Only send names if provided; backend entity doesn't expose set for names here normally, but safe to include
                if (firstName !== undefined) payload.firstName = firstName;
                if (lastName !== undefined) payload.lastName = lastName;
                const resp = await fetch(`/api/programs/${programId}/residents/${residentEdit.pk}`,
                  { method:'PUT', credentials:'include', headers:{ 'Content-Type':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify(payload) });
                if (!resp.ok) { addToast('Failed to update resident', 'error'); return; }
                addToast('Resident updated', 'success');
                try { localStorage.setItem('global-toast', JSON.stringify({ title: 'Resident updated', tone: 'success' })); } catch {}
                setResidentEdit(null);
                await loadResidents();
              } catch { addToast('Failed to update resident', 'error'); }
            }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1">Name</label>
                  <input className="w-full px-3 py-2 border border-bd-input rounded-lg" value={residentEdit.name} onChange={e => setResidentEdit({ ...residentEdit, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs mb-1">Resident ID</label>
                  <input className="w-full px-3 py-2 border border-bd-input rounded-lg bg-gray-50" value={residentEdit.residentId} readOnly />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1">Room</label>
                  <input className="w-full px-3 py-2 border border-bd-input rounded-lg" value={residentEdit.room} onChange={e => setResidentEdit({ ...residentEdit, room: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs mb-1">Advocate</label>
                  <input className="w-full px-3 py-2 border border-bd-input rounded-lg" value={residentEdit.advocate} onChange={e => setResidentEdit({ ...residentEdit, advocate: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-bd-input rounded-lg" value={residentEdit.status} onChange={e => setResidentEdit({ ...residentEdit, status: e.target.value })}>
                    <option>General Population</option>
                    <option>ALOYO</option>
                    <option>Restricted</option>
                    <option>Team Leader</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1">Admission Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-bd-input rounded-lg" value={residentEdit.admissionDate} onChange={e => setResidentEdit({ ...residentEdit, admissionDate: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 rounded-lg border border-bd text-sm" onClick={() => setResidentEdit(null)}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-success text-white text-sm">
                  <i className="fa-solid fa-check mr-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resident Actions Modal */}
      {residentAction && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-bd w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-font-base">Resident Actions</h3>
              <button className="text-font-detail hover:text-primary" onClick={() => setResidentAction(null)}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="res-act" onChange={() => setResidentAction({ pk: residentAction.pk, action: 'remove' })} checked={residentAction.action === 'remove'} />
                Remove from Program
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="res-act" onChange={() => setResidentAction({ pk: residentAction.pk, action: 'inactive' })} checked={residentAction.action === 'inactive'} />
                Mark as Inactive
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="res-act" onChange={() => setResidentAction({ pk: residentAction.pk, action: 'temp', tempLocation: residentAction.tempLocation })} checked={residentAction.action === 'temp'} />
                Temporary Location
              </label>
              {residentAction.action === 'temp' && (
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-bd-input rounded-lg"
                  placeholder="Specify temporary location"
                  value={residentAction.tempLocation || ''}
                  onChange={(e) => setResidentAction({ ...residentAction, tempLocation: e.target.value })}
                />
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button className="px-4 py-2 rounded-lg border border-bd text-sm" onClick={() => setResidentAction(null)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-warning text-white text-sm" onClick={async () => {
                if (!residentAction || !programId) return;
                try {
                  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                  if (residentAction.action === 'remove') {
                    const resp = await fetch(`/api/programs/${programId}/residents/${residentAction.pk}`, { method:'DELETE', credentials:'include', headers: { ...(token? { Authorization: `Bearer ${token}` }: {}) } });
                    if (!resp.ok) { addToast('Failed to remove resident', 'error'); return; }
                    addToast('Resident removed from program', 'success');
                    try { localStorage.setItem('global-toast', JSON.stringify({ title: 'Resident removed from program', tone: 'success' })); } catch {}
                  } else if (residentAction.action === 'inactive') {
                    const resp = await fetch(`/api/programs/${programId}/residents/${residentAction.pk}`, { method:'PUT', credentials:'include', headers: { 'Content-Type':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify({ status: 'Inactive' }) });
                    if (!resp.ok) { addToast('Failed to mark inactive', 'error'); return; }
                    addToast('Resident marked as inactive', 'success');
                    try { localStorage.setItem('global-toast', JSON.stringify({ title: 'Resident marked as inactive', tone: 'success' })); } catch {}
                  } else if (residentAction.action === 'temp') {
                    const resp = await fetch(`/api/programs/${programId}/residents/${residentAction.pk}`, { method:'PUT', credentials:'include', headers: { 'Content-Type':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify({ temporaryLocation: residentAction.tempLocation || '' }) });
                    if (!resp.ok) { addToast('Failed to set temporary location', 'error'); return; }
                    addToast('Temporary location updated', 'success');
                    try { localStorage.setItem('global-toast', JSON.stringify({ title: 'Temporary location updated', tone: 'success' })); } catch {}
                  }
                  setResidentAction(null);
                  await loadResidents();
                } catch { addToast('Action failed', 'error'); }
              }}>
                <i className="fa-solid fa-check mr-2"></i>Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Toasts */}
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`min-w-[260px] max-w-sm shadow-lg rounded-lg border p-3 flex items-start gap-3 bg-white ${t.tone === 'success' ? 'border-success' : t.tone === 'error' ? 'border-error' : 'border-bd'}`}>
          <i className={`fa-solid ${t.tone === 'success' ? 'fa-circle-check text-success' : t.tone === 'error' ? 'fa-circle-exclamation text-error' : 'fa-circle-info text-primary'} mt-1`}></i>
          <div className="flex-1 text-sm text-font-base">{t.title}</div>
          <button className="text-font-detail hover:text-primary" onClick={() => removeToast(t.id)}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
      ))}
    </div>
    </>
)};
