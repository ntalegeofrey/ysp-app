'use client';

import { useRouter } from 'next/navigation';
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
  const [staff, setStaff] = useState<Staff[]>([
    { name: '', position: '', email: '', responsibilities: '' },
  ]);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUserRole(JSON.parse(raw).role || '');
    } catch {}
  }, []);

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Program created successfully! Redirecting to program selection...');
    setTimeout(() => router.push('/program-selection'), 800);
  };

  if (userRole !== 'admin') {
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
                  <h1 className="text-xl font-bold text-primary">Create New Program</h1>
                  <p className="text-sm text-font-detail">Department of Youth Services</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-font-base">Sarah Wilson</p>
                <p className="text-xs text-font-detail">Super Administrator</p>
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
                <input required type="text" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter program name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Program Type *</label>
                <select required className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">Select program type</option>
                  <option value="secure">Secure Treatment Facility</option>
                  <option value="group-home">Group Home</option>
                  <option value="education">Educational Services</option>
                  <option value="detention">Secure Detention</option>
                  <option value="wilderness">Wilderness Program</option>
                  <option value="transitional">Transitional Living</option>
                  <option value="community">Community-Based Program</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Capacity *</label>
                <input required type="number" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Maximum residents/participants" />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Status *</label>
                <select required className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
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
                <textarea rows={4} className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Describe the program's mission and services"></textarea>
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
                <input required type="text" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter street address" />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">City *</label>
                <input required type="text" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter city" />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">State</label>
                <select className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" defaultValue="MA">
                  <option value="MA">Massachusetts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">ZIP Code *</label>
                <input required type="text" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter ZIP code" />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">County</label>
                <input type="text" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter county" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {staff.map((m, idx) => (
                <div key={idx} className="md:col-span-2 staff-card bg-primary-lightest border border-primary-lighter rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Administrator Name *</label>
                      <input required type="text" className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Staff name" value={m.name} onChange={(e)=>updateStaff(idx,'name',e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Position *</label>
                      <select required className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={m.position} onChange={(e)=>updateStaff(idx,'position',e.target.value)}>
                        <option value="">Select position</option>
                        <option value="director">Program Director</option>
                        <option value="assistant-director">Assistant Director</option>
                        <option value="supervisor">Shift Supervisor</option>
                        <option value="jjyds-iii">JJYDS III</option>
                        <option value="jjyds-ii">JJYDS II</option>
                        <option value="jjyds-i">JJYDS I</option>
                        <option value="caseworker">Caseworker</option>
                        <option value="clinician">Clinician</option>
                        <option value="nurse">Nurse</option>
                        <option value="support">Support Staff</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Email</label>
                      <input type="email" className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Email address" value={m.email} onChange={(e)=>updateStaff(idx,'email',e.target.value)} />
                    </div>
                    <div className="flex items-end">
                      <button type="button" className="remove-staff bg-error hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors" onClick={()=>removeStaff(idx)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-font-base mb-2">Responsibilities</label>
                    <textarea rows={2} className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Describe key responsibilities and duties" value={m.responsibilities} onChange={(e)=>updateStaff(idx,'responsibilities',e.target.value)} />
                  </div>
                </div>
              ))}
              <div className="flex justify-end md:col-span-2">
                <button type="button" id="add-staff-btn" className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors" onClick={addStaff}>
                  <i className="fa-solid fa-plus mr-2"></i>
                  Add Staff Member
                </button>
              </div>
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
              <button type="button" id="add-staff-btn" className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors" onClick={addStaff}>
                <i className="fa-solid fa-plus mr-2"></i>
                Add Staff Member
              </button>
            </div>
            <div id="staff-list" className="space-y-4">
              {staff.map((m, idx) => (
                <div key={idx} className="staff-card bg-primary-lightest border border-primary-lighter rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Name *</label>
                      <input required type="text" className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Staff name" value={m.name} onChange={(e)=>updateStaff(idx,'name',e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Position *</label>
                      <select required className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={m.position} onChange={(e)=>updateStaff(idx,'position',e.target.value)}>
                        <option value="">Select position</option>
                        <option value="director">Program Director</option>
                        <option value="assistant-director">Assistant Director</option>
                        <option value="supervisor">Shift Supervisor</option>
                        <option value="jjyds-iii">JJYDS III</option>
                        <option value="jjyds-ii">JJYDS II</option>
                        <option value="jjyds-i">JJYDS I</option>
                        <option value="caseworker">Caseworker</option>
                        <option value="clinician">Clinician</option>
                        <option value="nurse">Nurse</option>
                        <option value="support">Support Staff</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Email</label>
                      <input type="email" className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Email address" value={m.email} onChange={(e)=>updateStaff(idx,'email',e.target.value)} />
                    </div>
                    <div className="flex items-end">
                      <button type="button" className="remove-staff bg-error hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors" onClick={()=>removeStaff(idx)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-font-base mb-2">Responsibilities</label>
                    <textarea rows={2} className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Describe key responsibilities and duties" value={m.responsibilities} onChange={(e)=>updateStaff(idx,'responsibilities',e.target.value)} />
                  </div>
                </div>
              ))}
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
                <select required className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">Select operating schedule</option>
                  <option value="24-7">24/7 Operations</option>
                  <option value="day">Day Program (8 AM - 4 PM)</option>
                  <option value="school">School Hours (7 AM - 3 PM)</option>
                  <option value="evening">Evening Program (4 PM - 10 PM)</option>
                  <option value="custom">Custom Schedule</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Security Level</label>
                <select className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">Select security level</option>
                  <option value="maximum">Maximum Security</option>
                  <option value="medium">Medium Security</option>
                  <option value="minimum">Minimum Security</option>
                  <option value="community">Community-Based</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Target Population</label>
                <input type="text" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="e.g., Male adolescents 14-18" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Expected Opening Date</label>
                <input type="date" className="w-full px-4 py-3 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
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
              Create Program
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
