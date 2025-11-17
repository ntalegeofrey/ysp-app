'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { logoUrl } from '../../utils/logo';
import { useEffect, useState } from 'react';

type Staff = {
  name: string;
  position: string;
  email: string;
  responsibilities: string;
};

export default function CreateProgramPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams?.get('id') || '';
  const [staff, setStaff] = useState<Staff[]>([
    { name: '', position: '', email: '', responsibilities: '' },
  ]);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Program model for prefill in edit mode (uncontrolled inputs use defaultValue)
  const [program, setProgram] = useState<any>(null);
  const [programTypeSelected, setProgramTypeSelected] = useState<string>('');
  const [operatingHoursSelected, setOperatingHoursSelected] = useState<string>('');
  // Assignments
  const [regionalAdmins, setRegionalAdmins] = useState<Array<{ email: string; name?: string }>>([]);
  const [directorEmail, setDirectorEmail] = useState<string>('');
  const [assistantEmail, setAssistantEmail] = useState<string>('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUserRole(JSON.parse(raw).role || '');
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadForEdit = async () => {
      try {
        if (!editingId) { setLoading(false); return; }
        const token = localStorage.getItem('token') || '';
        const p = await fetch(`/api/programs/${editingId}`, { credentials: 'include', headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` } });
        if (p.ok) {
          const data = await p.json();
          if (!cancelled) {
            setProgram(data);
            setProgramTypeSelected(data.programType || '');
            setOperatingHoursSelected(data.operatingHours || '');
          }
        }
        const a = await fetch(`/api/programs/${editingId}/assignments`, { credentials: 'include', headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` } });
        if (a.ok) {
          const arr = await a.json();
          const ras = (arr || []).filter((x: any) => x.roleType === 'REGIONAL_ADMIN').map((x: any) => ({ email: x.userEmail, name: '' }));
          const dir = (arr || []).find((x: any) => x.roleType === 'PROGRAM_DIRECTOR');
          const asst = (arr || []).find((x: any) => x.roleType === 'ASSISTANT_DIRECTOR');
          if (!cancelled) {
            setRegionalAdmins(ras);
            setDirectorEmail(dir?.userEmail || '');
            setAssistantEmail(asst?.userEmail || '');
          }
        }
      } catch {}
      finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadForEdit();
    return () => { cancelled = true; };
  }, [editingId]);

  const addStaff = () => setStaff((s) => [...s, { name: '', position: '', email: '', responsibilities: '' }]);
  const removeStaff = (idx: number) => setStaff((s) => (s.length > 1 ? s.filter((_, i) => i !== idx) : s));
  const updateStaff = (idx: number, key: keyof Staff, value: string) =>
    setStaff((s) => s.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));

  const saveDraft = () => {
    alert('Draft saved successfully!');
  };

  const cancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) router.back();
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body: any = {
      name: String(fd.get('programName') || ''),
      programType: String(fd.get('programType') || ''),
      programTypeOther: String(fd.get('programTypeOther') || ''),
      capacity: fd.get('capacity') ? Number(fd.get('capacity')) : null,
      status: String(fd.get('status') || ''),
      description: String(fd.get('description') || ''),
      street: String(fd.get('street') || ''),
      city: String(fd.get('city') || ''),
      state: String(fd.get('state') || 'MA'),
      zip: String(fd.get('zip') || ''),
      county: String(fd.get('county') || ''),
      operatingHours: String(fd.get('operatingHours') || ''),
      customSchedule: String(fd.get('customSchedule') || ''),
      securityLevel: String(fd.get('securityLevel') || ''),
      targetPopulation: String(fd.get('targetPopulation') || ''),
      expectedOpeningDate: String(fd.get('expectedOpeningDate') || ''),
      gender: String(fd.get('gender') || ''),
      active: String(fd.get('status') || '').toLowerCase() !== 'inactive',
    };
    try {
      const token = localStorage.getItem('token') || '';
      let programId = editingId;
      if (editingId) {
        const resp = await fetch(`/api/programs/${editingId}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ ...(program || {}), ...body }) });
        if (!resp.ok) { alert('Failed to save changes'); return; }
      } else {
        const resp = await fetch('/api/programs', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
        if (!resp.ok) { alert('Failed to create program'); return; }
        const created = await resp.json();
        programId = created.id ? String(created.id) : '';
      }
      if (programId) {
        const assignments: Array<{ userEmail: string; roleType: string }> = [];
        regionalAdmins.filter(r => r.email).forEach(r => assignments.push({ userEmail: r.email, roleType: 'REGIONAL_ADMIN' }));
        if (directorEmail) assignments.push({ userEmail: directorEmail, roleType: 'PROGRAM_DIRECTOR' });
        if (assistantEmail) assignments.push({ userEmail: assistantEmail, roleType: 'ASSISTANT_DIRECTOR' });
        await fetch(`/api/programs/${programId}/assignments`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
          body: JSON.stringify({ assignments })
        });
      }
      alert(editingId ? 'Program updated successfully! Redirecting...' : 'Program created successfully! Redirecting...');
      setTimeout(() => router.push('/program-selection'), 800);
    } catch {
      alert('An error occurred while saving');
    }
  };

  const isAdmin = (userRole || '').toString().trim().toLowerCase() === 'admin' || (userRole || '').toString().trim().toLowerCase() === 'administrator';
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white border border-bd rounded-xl p-8 text-center shadow">
          <i className="fa-solid fa-circle-exclamation text-error text-3xl mb-3"></i>
          <h1 className="text-xl font-bold text-font-base mb-2">Access Restricted</h1>
          <p className="text-font-detail mb-4">Only administrators can create new programs.</p>
          <button className="px-4 py-2 bg-primary text-white rounded-lg" onClick={() => router.push('/program-selection')}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div id="create-program-container" className="min-h-screen bg-bg-subtle">
      <header id="header" className="bg-white shadow-sm border-b border-bd">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => router.back()} className="mr-4 p-2 rounded-lg hover:bg-primary-lightest text-primary hover:text-primary-light transition-colors">
                <i className="fa-solid fa-arrow-left text-xl"></i>
              </button>
              <div className="flex items-center">
                <img src={logoUrl} alt="DYS Logo" className="w-12 h-12 mr-4 rounded-full object-contain" />
                <div>
                  <h1 className="text-xl font-bold text-primary">{editingId ? 'Edit Program' : 'Create New Program'}</h1>
                  <p className="text-sm text-font-detail">Department of Youth Services</p>
                </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Gender *</label>
                <select name="gender" required className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" defaultValue={program?.gender || ''}>
                  <option value="">Select gender</option>
                  <option value="mixed">Mixed</option>
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                </select>
              </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-font-base">Program Management</p>
                <p className="text-xs text-font-detail">Admin Tools</p>
              </div>
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-primary-lighter" />
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-6xl mx-auto px-6 py-8">
        <form id="create-program-form" className="space-y-8" onSubmit={submit}>
          {/* Program Information */}
          <div id="program-details" className="form-section bg-white rounded-xl border border-bd p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-4">
                <i className="fa-solid fa-building text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-font-heading">Program Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Program Name *</label>
                <input name="programName" required type="text" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter program name" defaultValue={program?.name || ''} />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Program Type *</label>
                <select name="programType" required className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={programTypeSelected} onChange={(e)=>setProgramTypeSelected(e.target.value)}>
                  <option value="">Select program type</option>
                  <option value="secure">Secure Treatment Facility</option>
                  <option value="group-home">Group Home</option>
                  <option value="education">Educational Services</option>
                  <option value="detention">Secure Detention</option>
                  <option value="wilderness">Wilderness Program</option>
                  <option value="transitional">Transitional Living</option>
                  <option value="community">Community-Based Program</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {programTypeSelected === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Specify Program Type *</label>
                  <input name="programTypeOther" required type="text" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter program type" defaultValue={program?.programTypeOther || ''} />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Capacity *</label>
                <input name="capacity" required type="number" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Maximum residents/participants" defaultValue={program?.capacity ?? ''} />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Status *</label>
                <select name="status" required className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" defaultValue={program?.status || ''}>
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="planning">In Planning</option>
                  <option value="construction">Under Construction</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-font-base mb-2">Program Description</label>
                <textarea name="description" rows={4} className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Describe the program's mission and services" defaultValue={program?.description || ''}></textarea>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div id="location-details" className="form-section bg-white rounded-xl border border-bd p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary-alt rounded-lg flex items-center justify-center mr-4">
                <i className="fa-solid fa-map-marker-alt text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-font-heading">Location Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-font-base mb-2">Street Address *</label>
                <input name="street" required type="text" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter street address" defaultValue={program?.street || ''} />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">City *</label>
                <input name="city" required type="text" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter city" defaultValue={program?.city || ''} />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">State</label>
                <select name="state" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus-border-primary" defaultValue={program?.state || 'MA'}>
                  <option value="MA">Massachusetts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">ZIP Code *</label>
                <input name="zip" required type="text" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter ZIP code" defaultValue={program?.zip || ''} />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">County</label>
                <input name="county" type="text" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter county" defaultValue={program?.county || ''} />
              </div>
            </div>
          </div>

          {/* Regional Administrator */}
          <div id="regional-admin" className="form-section bg-white rounded-xl border border-bd p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-highlight rounded-lg flex items-center justify-center mr-4">
                <i className="fa-solid fa-user-tie text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-font-heading">Regional Administrator</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-font-base mb-2">Administrator Email *</label>
                  <input type="email" id="ra-email" placeholder="admin@example.gov" className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div className="flex items-end">
                  <button type="button" className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg" onClick={() => {
                    const inp = (document.getElementById('ra-email') as HTMLInputElement | null);
                    const email = inp?.value?.trim() || '';
                    if (!email) return;
                    setRegionalAdmins((prev) => prev.find(r => r.email.toLowerCase() === email.toLowerCase()) ? prev : [...prev, { email }]);
                    if (inp) inp.value = '';
                  }}>Add</button>
                </div>
              </div>
              {regionalAdmins.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-font-detail">
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Role</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regionalAdmins.map((ra, idx) => (
                        <tr key={idx} className="border-t border-bd">
                          <td className="py-2 pr-4">{ra.email}</td>
                          <td className="py-2 pr-4">Regional Administrator</td>
                          <td className="py-2"><button type="button" className="text-error" onClick={() => setRegionalAdmins(prev => prev.filter((_, i) => i !== idx))}>Remove</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Program Staff */}
          <div id="program-staff" className="form-section bg-white rounded-xl border border-bd p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center mr-4">
                  <i className="fa-solid fa-users text-white"></i>
                </div>
                <h2 className="text-2xl font-bold text-font-heading">Program Staff</h2>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Program Director Email *</label>
                  <input type="email" className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="director@example.gov" value={directorEmail} onChange={(e)=>setDirectorEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Assistant Director Email</label>
                  <input type="email" className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="assistant@example.gov" value={assistantEmail} onChange={(e)=>setAssistantEmail(e.target.value)} />
                </div>
              </div>
              {(directorEmail || assistantEmail) && (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-font-detail">
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Role</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {directorEmail && (
                        <tr className="border-t border-bd">
                          <td className="py-2 pr-4">{directorEmail}</td>
                          <td className="py-2 pr-4">Program Director</td>
                          <td className="py-2"><button type="button" className="text-error" onClick={() => setDirectorEmail('')}>Remove</button></td>
                        </tr>
                      )}
                      {assistantEmail && (
                        <tr className="border-t border-bd">
                          <td className="py-2 pr-4">{assistantEmail}</td>
                          <td className="py-2 pr-4">Assistant Director</td>
                          <td className="py-2"><button type="button" className="text-error" onClick={() => setAssistantEmail('')}>Remove</button></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Operational Details */}
          <div id="operational-details" className="form-section bg-white rounded-xl border border-bd p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary-alt-dark rounded-lg flex items-center justify-center mr-4">
                <i className="fa-solid fa-clock text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-font-heading">Operational Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Operating Hours *</label>
                <select name="operatingHours" required className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={operatingHoursSelected} onChange={(e)=>setOperatingHoursSelected(e.target.value)}>
                  <option value="">Select operating schedule</option>
                  <option value="24-7">24/7 Operations</option>
                  <option value="day">Day Program (8 AM - 4 PM)</option>
                  <option value="school">School Hours (7 AM - 3 PM)</option>
                  <option value="evening">Evening Program (4 PM - 10 PM)</option>
                  <option value="custom">Custom Schedule</option>
                </select>
              </div>

              {operatingHoursSelected === 'custom' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-font-base mb-2">Describe Custom Schedule *</label>
                  <textarea name="customSchedule" rows={3} className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="e.g., Mon-Fri 10am-6pm; Sat 12pm-4pm" defaultValue={program?.customSchedule || ''}></textarea>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Security Level</label>
                <select name="securityLevel" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" defaultValue={program?.securityLevel || ''}>
                  <option value="">Select security level</option>
                  <option value="maximum">Maximum Security</option>
                  <option value="medium">Medium Security</option>
                  <option value="minimum">Minimum Security</option>
                  <option value="community">Community-Based</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Target Population</label>
                <input name="targetPopulation" type="text" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="e.g., Male adolescents 14-18" defaultValue={program?.targetPopulation || ''} />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Expected Opening Date</label>
                <input name="expectedOpeningDate" type="date" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" defaultValue={program?.expectedOpeningDate || ''} />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-8">
            <button type="button" id="cancel-btn" className="px-8 py-3 border border-bd text-font-base rounded-lg hover:bg-bg-subtle transition-colors font-medium" onClick={cancel}>
              Cancel
            </button>
            <button type="button" id="save-draft-btn" className="px-8 py-3 bg-primary-lighter text-white rounded-lg hover:bg-primary-light transition-colors font-medium" onClick={saveDraft}>
              Save Draft
            </button>
            <button type="submit" className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium">
              {editingId ? 'Save Changes' : 'Create Program'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
