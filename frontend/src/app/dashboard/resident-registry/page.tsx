'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResidentRegistryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [canAddResident, setCanAddResident] = useState<boolean>(false);
  const [canEditResident, setCanEditResident] = useState<boolean>(false);
  const [canDischargeResident, setCanDischargeResident] = useState<boolean>(false);
  const [programId, setProgramId] = useState<string>('');

  type ResidentInfo = { pk: number|string; name: string; residentId: string; room: string; status: string; advocate: string; admissionDate: string };
  const [residentEdit, setResidentEdit] = useState<ResidentInfo | null>(null);
  const [residentAction, setResidentAction] = useState<null | { pk: number|string; action: 'discharge'; name: string }>(null);
  const [dischargedResident, setDischargedResident] = useState<null | { id: number|string; firstName: string; lastName: string; dateOfBirth: string; admissionDate: string }>(null);

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
        const [residentP, editRes, dischargeRes] = await Promise.all([
          ch('op.ADD_RESIDENT'),
          ch('op.EDIT_RESIDENT'),
          ch('op.DISCHARGE_RESIDENT'),
        ]);
        setCanAddResident(residentP);
        setCanEditResident(editRes);
        setCanDischargeResident(dischargeRes);
      } catch {}
    })();
  }, []);

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
  const temporaryLocationCount = residents.filter(r => (r.temporaryLocation||'').trim() !== '').length;

  // Real-time residents refresh via SSE
  useEffect(() => {
    let es: EventSource | null = null;
    try {
      const token = localStorage.getItem('token');
      const eventUrl = `/api/events${token ? `?token=${encodeURIComponent(token)}` : ''}`;
      es = new EventSource(eventUrl);
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data || '{}') as { type?: string; programId?: number|string };
          if (!data?.type) return;
          const pid = data?.programId ? String(data.programId) : '';
          if (!programId || (pid && pid !== programId)) return;
          if (data.type === 'programs.residents.added' || data.type === 'programs.residents.updated' || data.type === 'programs.residents.removed') {
            loadResidents();
          }
        } catch {}
      };
      es.onerror = () => {
        // Silently handle SSE errors (403, connection issues)
        try { es && es.close(); } catch {}
      };
    } catch {}
    return () => { try { es && es.close(); } catch {} };
  }, [programId]);

  return (
    <>
    <div id="resident-registry-main" className="flex-1 p-6 overflow-auto">
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
              Add resident to program
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
                        <td className="px-4 py-3 text-sm text-font-detail" colSpan={canAddResident ? 7 : 6}>No residents yet</td>
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
                            ) : (
                              <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">N/A</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">{r.advocate || ''}</td>
                          <td className="px-4 py-3 text-sm">{r.admissionDate ? new Date(r.admissionDate).toLocaleDateString() : ''}</td>
                          {canAddResident && (
                            <td className="px-4 py-3 text-sm space-x-3">
                              <button className="text-primary hover:text-primary-light" title="View Profile" onClick={() => router.push(`/dashboard/resident-registry/${r.id}`)}>
                                <i className="fa-solid fa-user"></i>
                              </button>
                              {canDischargeResident && (
                              <button className="text-warning hover:text-yellow-500" title="Actions" onClick={() => setResidentAction({ pk: r.id, action: 'discharge', name: [r.firstName || '', r.lastName || ''].filter(Boolean).join(' ').trim() })}>
                                <i className="fa-solid fa-ellipsis-v"></i>
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
                
                // Check for discharged resident with same name and DOB
                if (resFirstName.trim() && resLastName.trim() && resDob) {
                  const checkResp = await fetch(`/api/programs/${programId}/residents`, { 
                    credentials:'include', 
                    headers: { ...(token? { Authorization: `Bearer ${token}` }: {}) } 
                  });
                  if (checkResp.ok) {
                    const allResidents = await checkResp.json();
                    const discharged = allResidents.find((r: any) => 
                      r.status === 'DISCHARGED' && 
                      r.firstName?.toLowerCase() === resFirstName.trim().toLowerCase() &&
                      r.lastName?.toLowerCase() === resLastName.trim().toLowerCase() &&
                      r.dateOfBirth === resDob
                    );
                    if (discharged) {
                      setDischargedResident({
                        id: discharged.id,
                        firstName: discharged.firstName,
                        lastName: discharged.lastName,
                        dateOfBirth: discharged.dateOfBirth,
                        admissionDate: discharged.admissionDate || ''
                      });
                      return; // Stop and show reactivation modal
                    }
                  }
                }
                
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

      {/* Discharge Resident Confirmation Modal */}
      {residentAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-error w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <i className="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-font-base">Discharge Resident</h3>
              </div>
              <button className="text-font-detail hover:text-primary" onClick={() => setResidentAction(null)}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-info-circle text-yellow-600 mt-0.5"></i>
                <div className="text-sm text-font-base">
                  <p className="font-semibold mb-2">You are about to discharge:</p>
                  <p className="text-lg font-bold text-primary">{residentAction.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-shield-exclamation text-red-600 mt-0.5"></i>
                <div className="text-sm text-font-detail space-y-2">
                  <p className="font-semibold text-font-base">Warning:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>This resident will be removed from the active registry</li>
                    <li>All historical data will be preserved</li>
                    <li>The resident can be re-added later if they return</li>
                    <li>This action cannot be easily undone</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 rounded-lg border border-bd text-sm font-medium hover:bg-gray-50" 
                onClick={() => setResidentAction(null)}
              >
                <i className="fa-solid fa-times mr-2"></i>Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700" 
                onClick={async () => {
                  if (!residentAction || !programId) return;
                  try {
                    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                    const resp = await fetch(`/api/programs/${programId}/residents/${residentAction.pk}`, { 
                      method:'PUT', 
                      credentials:'include', 
                      headers: { 
                        'Content-Type':'application/json', 
                        ...(token? { Authorization: `Bearer ${token}` }: {}) 
                      }, 
                      body: JSON.stringify({ status: 'DISCHARGED' }) 
                    });
                    if (!resp.ok) { 
                      addToast('Failed to discharge resident', 'error'); 
                      return; 
                    }
                    addToast('Resident successfully discharged', 'success');
                    try { 
                      localStorage.setItem('global-toast', JSON.stringify({ 
                        title: 'Resident successfully discharged', 
                        tone: 'success' 
                      })); 
                    } catch {}
                    setResidentAction(null);
                    await loadResidents();
                  } catch { 
                    addToast('Discharge action failed', 'error'); 
                  }
                }}
              >
                <i className="fa-solid fa-right-from-bracket mr-2"></i>Confirm Discharge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reactivate Discharged Resident Modal */}
      {dischargedResident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-primary w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="fa-solid fa-user-check text-blue-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-font-base">Resident Found</h3>
              </div>
              <button className="text-font-detail hover:text-primary" onClick={() => setDischargedResident(null)}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-info-circle text-blue-600 mt-0.5"></i>
                <div className="text-sm text-font-base">
                  <p className="font-semibold mb-2">A previously discharged resident was found:</p>
                  <div className="space-y-1 text-font-detail">
                    <p><strong>Name:</strong> {dischargedResident.firstName} {dischargedResident.lastName}</p>
                    <p><strong>Date of Birth:</strong> {dischargedResident.dateOfBirth ? new Date(dischargedResident.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                    {dischargedResident.admissionDate && (
                      <p><strong>Previous Admission:</strong> {new Date(dischargedResident.admissionDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-lightbulb text-yellow-600 mt-0.5"></i>
                <div className="text-sm text-font-detail">
                  <p className="font-semibold text-font-base mb-2">What would you like to do?</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>Reactivate:</strong> Restore this resident with all their historical data</li>
                    <li><strong>Create New:</strong> Add as a new resident (not recommended if same person)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 rounded-lg border border-bd text-sm font-medium hover:bg-gray-50" 
                onClick={() => setDischargedResident(null)}
              >
                <i className="fa-solid fa-times mr-2"></i>Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-blue-50" 
                onClick={async () => {
                  // Continue with creating new resident despite match
                  setDischargedResident(null);
                  // The form will submit normally on next attempt
                  addToast('Please submit the form again to create a new record', 'info');
                }}
              >
                <i className="fa-solid fa-user-plus mr-2"></i>Create New Anyway
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light" 
                onClick={async () => {
                  if (!programId) return;
                  try {
                    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                    const resp = await fetch(`/api/programs/${programId}/residents/${dischargedResident.id}`, { 
                      method:'PUT', 
                      credentials:'include', 
                      headers: { 
                        'Content-Type':'application/json', 
                        ...(token? { Authorization: `Bearer ${token}` }: {}) 
                      }, 
                      body: JSON.stringify({ 
                        status: 'General Population',
                        room: resRoom || undefined,
                        admissionDate: resAdmissionDate || undefined,
                        advocate: resAdvocate || undefined
                      }) 
                    });
                    if (!resp.ok) { 
                      addToast('Failed to reactivate resident', 'error'); 
                      return; 
                    }
                    addToast('Resident successfully reactivated!', 'success');
                    try { 
                      localStorage.setItem('global-toast', JSON.stringify({ 
                        title: 'Resident successfully reactivated', 
                        tone: 'success' 
                      })); 
                    } catch {}
                    // Clear form
                    setResFirstName(''); setResLastName(''); setResDob(''); setResAdmissionDate(''); 
                    setResResidentId(''); setResRoom(''); setResStatus('General Population'); setResAdvocate('');
                    setDischargedResident(null);
                    await loadResidents();
                  } catch { 
                    addToast('Reactivation failed', 'error'); 
                  }
                }}
              >
                <i className="fa-solid fa-rotate-right mr-2"></i>Reactivate Resident
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
