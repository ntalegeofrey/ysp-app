'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ResidentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const residentId = params.id as string;
  const [activeTab, setActiveTab] = useState('overview');
  const [resident, setResident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [stats, setStats] = useState({
    totalCredits: 0,
    activeRepairs: 0,
    sleepLogDays: 0,
    incidents30d: 0,
    activeMedications: 0
  });
  const [editForm, setEditForm] = useState({
    dateOfBirth: '',
    admissionDate: '',
    room: '',
    status: '',
    advocate: '',
    clinician: ''
  });

  // Local toasts
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; tone: 'info' | 'success' | 'error' }>>([]);
  const removeToast = (id: string) => setToasts(t => t.filter(x => x.id !== id));
  const addToast = (title: string, tone: 'info' | 'success' | 'error' = 'info') => {
    const id = String(Date.now() + Math.random());
    setToasts(t => [...t, { id, title, tone }]);
    setTimeout(() => removeToast(id), 3500);
  };

  useEffect(() => {
    loadResidentProfile();
    loadResidentStats();
  }, [residentId]);

  const loadResidentProfile = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const spRaw = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
      const sp = spRaw ? JSON.parse(spRaw) as { id?: number|string } : null;
      const programId = sp?.id ? String(sp.id) : '';
      
      if (!programId) return;

      const res = await fetch(`/api/programs/${programId}/residents/${residentId}`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      
      if (res.ok) {
        const data = await res.json();
        setResident(data);
        // Populate edit form
        setEditForm({
          dateOfBirth: data.dateOfBirth || '',
          admissionDate: data.admissionDate || '',
          room: data.room || '',
          status: data.status || 'General Population',
          advocate: data.advocate || '',
          clinician: data.clinician || ''
        });
      }
    } catch (error) {
      console.error('Failed to load resident:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResidentStats = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const spRaw = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
      const sp = spRaw ? JSON.parse(spRaw) as { id?: number|string } : null;
      const programId = sp?.id ? String(sp.id) : '';
      
      if (!programId) return;

      const res = await fetch(`/api/programs/${programId}/residents/${residentId}/stats`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalCredits: data.totalCredits || 0,
          activeRepairs: data.activeRepairs || 0,
          sleepLogDays: data.sleepLogDays || 0,
          incidents30d: data.incidents30d || 0,
          activeMedications: data.activeMedications || 0
        });
      }
    } catch (error) {
      console.error('Failed to load resident stats:', error);
    }
  };

  const handleUpdateResident = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const spRaw = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
      const sp = spRaw ? JSON.parse(spRaw) as { id?: number|string } : null;
      const programId = sp?.id ? String(sp.id) : '';
      
      if (!programId) return;

      const payload: any = {
        room: editForm.room || undefined,
        status: editForm.status || undefined,
        advocate: editForm.advocate || undefined,
        clinician: editForm.clinician || undefined,
        admissionDate: editForm.admissionDate || undefined,
      };

      // Add dateOfBirth if changed
      if (editForm.dateOfBirth) {
        payload.dateOfBirth = editForm.dateOfBirth;
      }

      const res = await fetch(`/api/programs/${programId}/residents/${residentId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json', 
          ...(token ? { Authorization: `Bearer ${token}` } : {}) 
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        addToast('Resident information updated successfully', 'success');
        setShowEditModal(false);
        await loadResidentProfile();
      } else {
        addToast('Failed to update resident information', 'error');
      }
    } catch (error) {
      console.error('Failed to update resident:', error);
      addToast('Failed to update resident information', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-font-detail">Loading resident profile...</div>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-font-detail">Resident not found</div>
      </div>
    );
  }

  const residentName = `${resident.firstName || ''} ${resident.lastName || ''}`.trim();
  const dateOfBirth = resident.dateOfBirth ? new Date(resident.dateOfBirth).toLocaleDateString() : 'N/A';
  const admissionDate = resident.admissionDate ? new Date(resident.admissionDate).toLocaleDateString() : 'N/A';

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-bd p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <img 
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg" 
                alt="Resident Photo" 
                className="w-24 h-24 rounded-full border-4 border-primary"
              />
              <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary-light">
                <i className="fa-solid fa-camera text-xs"></i>
              </button>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-font-base">{residentName}</h3>
              <p className="text-lg text-font-detail mb-2">Resident ID: {resident.residentId || 'N/A'}</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div><span className="font-medium text-font-base">DoB:</span> <span className="text-font-detail">{dateOfBirth}</span></div>
                <div><span className="font-medium text-font-base">DoE:</span> <span className="text-font-detail">{admissionDate}</span></div>
                <div><span className="font-medium text-font-base">Room:</span> <span className="text-font-detail">{resident.room || 'N/A'}</span></div>
                <div>
                  <span className="font-medium text-font-base">Track:</span> 
                  <span className={`ml-2 px-2 py-1 text-white text-xs rounded-full ${
                    resident.status === 'Restricted' ? 'bg-error' : 
                    resident.status === 'ALOYO' ? 'bg-warning' : 
                    resident.status === 'Team Leader' ? 'bg-primary' : 'bg-success'
                  }`}>
                    {resident.status || 'General Population'}
                  </span>
                </div>
                <div><span className="font-medium text-font-base">Advocate:</span> <span className="text-font-detail">{resident.advocate || 'N/A'}</span></div>
                <div><span className="font-medium text-font-base">Clinician:</span> <span className="text-font-detail">{resident.clinician || 'N/A'}</span></div>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm"
              onClick={() => setShowEditModal(true)}
            >
              <i className="fa-solid fa-edit mr-2"></i>Update Resident Info
            </button>
            <button className="bg-warning text-white px-4 py-2 rounded-lg hover:bg-yellow-500 text-sm">
              <i className="fa-solid fa-file-pdf mr-2"></i>Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-bd p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">{stats.totalCredits}</p>
              <p className="text-sm text-font-detail">Total Credits</p>
            </div>
            <i className="fa-solid fa-coins text-success text-xl"></i>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-error">{stats.activeRepairs}</p>
              <p className="text-sm text-font-detail">Active Repairs</p>
            </div>
            <i className="fa-solid fa-wrench text-error text-xl"></i>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">{stats.sleepLogDays}</p>
              <p className="text-sm text-font-detail">Sleep Log Days</p>
            </div>
            <i className="fa-solid fa-bed text-primary text-xl"></i>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-warning">{stats.incidents30d}</p>
              <p className="text-sm text-font-detail">Incidents (30d)</p>
            </div>
            <i className="fa-solid fa-triangle-exclamation text-warning text-xl"></i>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary-alt">{stats.activeMedications}</p>
              <p className="text-sm text-font-detail">Medications</p>
            </div>
            <i className="fa-solid fa-pills text-primary-alt text-xl"></i>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-bd">
        <div className="border-b border-bd">
          <nav className="flex space-x-8 px-6">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`flex items-center py-4 text-sm font-medium border-b-2 ${
                activeTab === 'overview' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-font-detail hover:text-font-base'
              }`}
            >
              <i className={`fa-solid fa-chart-pie mr-2 ${activeTab === 'overview' ? 'text-primary' : 'text-font-detail'}`}></i>
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('medications')} 
              className={`flex items-center py-4 text-sm font-medium border-b-2 ${
                activeTab === 'medications' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-font-detail hover:text-font-base'
              }`}
            >
              <i className={`fa-solid fa-pills mr-2 ${activeTab === 'medications' ? 'text-primary' : 'text-font-detail'}`}></i>
              Medications
            </button>
            <button 
              onClick={() => setActiveTab('incidents')} 
              className={`flex items-center py-4 text-sm font-medium border-b-2 ${
                activeTab === 'incidents' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-font-detail hover:text-font-base'
              }`}
            >
              <i className={`fa-solid fa-triangle-exclamation mr-2 ${activeTab === 'incidents' ? 'text-primary' : 'text-font-detail'}`}></i>
              Incidents & Repairs
            </button>
            <button 
              onClick={() => setActiveTab('behavior')} 
              className={`flex items-center py-4 text-sm font-medium border-b-2 ${
                activeTab === 'behavior' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-font-detail hover:text-font-base'
              }`}
            >
              <i className={`fa-solid fa-chart-line mr-2 ${activeTab === 'behavior' ? 'text-primary' : 'text-font-detail'}`}></i>
              Behavior History
            </button>
            <button 
              onClick={() => setActiveTab('files')} 
              className={`flex items-center py-4 text-sm font-medium border-b-2 ${
                activeTab === 'files' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-font-detail hover:text-font-base'
              }`}
            >
              <i className={`fa-solid fa-folder mr-2 ${activeTab === 'files' ? 'text-primary' : 'text-font-detail'}`}></i>
              Files & Documents
            </button>
          </nav>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-font-base mb-4">Recent Activities</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <i className="fa-solid fa-coins text-success mt-1"></i>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-font-base">Earned 15 credits for room cleanliness</p>
                        <p className="text-xs text-font-detail">Today, 2:30 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <i className="fa-solid fa-wrench text-error mt-1"></i>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-font-base">Assigned repair for disrespectful behavior</p>
                        <p className="text-xs text-font-detail">Yesterday, 4:15 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <i className="fa-solid fa-phone text-primary mt-1"></i>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-font-base">Phone call with mother (15 minutes)</p>
                        <p className="text-xs text-font-detail">Nov 16, 7:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Status */}
                <div>
                  <h4 className="text-lg font-semibold text-font-base mb-4">Current Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-font-base">Watch Status</span>
                      <span className="px-2 py-1 bg-success text-white text-xs rounded-full">Normal</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-font-base">Program Track</span>
                      <span className={`px-2 py-1 text-white text-xs rounded-full ${
                        resident.status === 'Restricted' ? 'bg-error' : 
                        resident.status === 'ALOYO' ? 'bg-warning' : 
                        resident.status === 'Team Leader' ? 'bg-primary' : 'bg-success'
                      }`}>
                        {resident.status || 'General Population'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-font-base">Separation Status</span>
                      <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">General Population</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts and Progress */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-font-base mb-4">Credit Trend (Last 30 Days)</h4>
                  <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-font-detail">Credit trend chart would be displayed here</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-font-base mb-4">Program Progress</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-font-base">Behavior Goals</span>
                        <span className="text-sm text-font-detail">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-font-base">Educational Goals</span>
                        <span className="text-sm text-font-detail">60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-warning h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-font-base">Treatment Compliance</span>
                        <span className="text-sm text-font-detail">90%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '90%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medications Tab Content */}
        {activeTab === 'medications' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-font-base">Current Medications</h4>
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
                <i className="fa-solid fa-external-link mr-2"></i>View Full Med Sheet
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-font-base mb-2">Sertraline 50mg</h5>
                <p className="text-sm text-font-detail mb-2">Once daily, morning</p>
                <p className="text-xs text-font-detail">Prescribed by: Dr. Smith</p>
                <p className="text-xs text-font-detail">Last administered: Today, 8:00 AM</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-font-base mb-2">Risperidone 1mg</h5>
                <p className="text-sm text-font-detail mb-2">Twice daily, morning & evening</p>
                <p className="text-xs text-font-detail">Prescribed by: Dr. Johnson</p>
                <p className="text-xs text-font-detail">Last administered: Today, 8:00 AM</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-font-base mb-2">Multivitamin</h5>
                <p className="text-sm text-font-detail mb-2">Once daily, morning</p>
                <p className="text-xs text-font-detail">Prescribed by: Dr. Smith</p>
                <p className="text-xs text-font-detail">Last administered: Today, 8:00 AM</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-font-base mb-2">Melatonin 3mg</h5>
                <p className="text-sm text-font-detail mb-2">As needed for sleep</p>
                <p className="text-xs text-font-detail">Prescribed by: Dr. Johnson</p>
                <p className="text-xs text-font-detail">Last administered: Nov 16, 9:00 PM</p>
              </div>
            </div>
          </div>
        )}

        {/* Incidents & Repairs Tab Content */}
        {activeTab === 'incidents' && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-font-base mb-4">Active Repairs</h4>
                <div className="space-y-3">
                  <div className="bg-error-lightest border border-error-lighter rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-font-base">Disrespectful Behavior</h5>
                        <p className="text-sm text-font-detail mt-1">Assigned: Nov 17, 2024</p>
                        <p className="text-sm text-font-detail">Due: Nov 24, 2024</p>
                      </div>
                      <span className="px-2 py-1 bg-error text-white text-xs rounded-full">Active</span>
                    </div>
                  </div>
                  <div className="bg-warning-lightest border border-warning-lighter rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-font-base">Room Maintenance</h5>
                        <p className="text-sm text-font-detail mt-1">Assigned: Nov 15, 2024</p>
                        <p className="text-sm text-font-detail">Due: Nov 22, 2024</p>
                      </div>
                      <span className="px-2 py-1 bg-warning text-white text-xs rounded-full">In Progress</span>
                    </div>
                  </div>
                  <div className="bg-warning-lightest border border-warning-lighter rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-font-base">Incomplete Homework</h5>
                        <p className="text-sm text-font-detail mt-1">Assigned: Nov 16, 2024</p>
                        <p className="text-sm text-font-detail">Due: Nov 23, 2024</p>
                      </div>
                      <span className="px-2 py-1 bg-warning text-white text-xs rounded-full">Pending</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-font-base mb-4">Recent Incidents</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-bd">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-font-detail uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-font-detail uppercase">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-font-detail uppercase">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-font-detail uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-bd">
                      <tr>
                        <td className="px-4 py-3 text-sm text-font-base">Nov 17, 2024</td>
                        <td className="px-4 py-3 text-sm text-font-base">Behavioral</td>
                        <td className="px-4 py-3 text-sm text-font-detail">Verbal altercation with peer</td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-warning text-white text-xs rounded-full">Resolved</span></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-font-base">Nov 14, 2024</td>
                        <td className="px-4 py-3 text-sm text-font-base">Rule Violation</td>
                        <td className="px-4 py-3 text-sm text-font-detail">Out of bounds area</td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-success text-white text-xs rounded-full">Closed</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Behavior History Tab Content */}
        {activeTab === 'behavior' && (
          <div className="p-6">
            <h4 className="text-lg font-semibold text-font-base mb-4">Behavior Trend Analysis</h4>
            <div className="h-64 bg-gray-50 rounded-lg mb-6 flex items-center justify-center">
              <p className="text-font-detail">Behavior trend chart would be displayed here</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-primary-alt-lightest rounded-lg p-4">
                <p className="text-2xl font-bold text-success">42</p>
                <p className="text-sm text-font-detail">Positive Behaviors</p>
              </div>
              <div className="bg-warning-lightest rounded-lg p-4">
                <p className="text-2xl font-bold text-warning">8</p>
                <p className="text-sm text-font-detail">Minor Incidents</p>
              </div>
              <div className="bg-error-lightest rounded-lg p-4">
                <p className="text-2xl font-bold text-error">2</p>
                <p className="text-sm text-font-detail">Major Incidents</p>
              </div>
            </div>
          </div>
        )}

        {/* Files & Documents Tab Content */}
        {activeTab === 'files' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-font-base">Document Archive</h4>
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
                <i className="fa-solid fa-upload mr-2"></i>Upload Document
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center space-x-3">
                  <i className="fa-solid fa-file-pdf text-error text-xl"></i>
                  <div>
                    <p className="text-sm font-medium text-font-base">Court Documents - Nov 2024</p>
                    <p className="text-xs text-font-detail">Uploaded: Nov 10, 2024 • Type: Legal</p>
                  </div>
                </div>
                <button className="text-primary hover:text-primary-light">
                  <i className="fa-solid fa-download"></i>
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center space-x-3">
                  <i className="fa-solid fa-file-medical text-primary-alt text-xl"></i>
                  <div>
                    <p className="text-sm font-medium text-font-base">Medical Records - Initial Assessment</p>
                    <p className="text-xs text-font-detail">Uploaded: Nov 10, 2024 • Type: Medical</p>
                  </div>
                </div>
                <button className="text-primary hover:text-primary-light">
                  <i className="fa-solid fa-download"></i>
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center space-x-3">
                  <i className="fa-solid fa-file-alt text-primary text-xl"></i>
                  <div>
                    <p className="text-sm font-medium text-font-base">Treatment Plan - Q4 2024</p>
                    <p className="text-xs text-font-detail">Uploaded: Nov 11, 2024 • Type: Clinical</p>
                  </div>
                </div>
                <button className="text-primary hover:text-primary-light">
                  <i className="fa-solid fa-download"></i>
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center space-x-3">
                  <i className="fa-solid fa-file-image text-warning text-xl"></i>
                  <div>
                    <p className="text-sm font-medium text-font-base">Identification Photos</p>
                    <p className="text-xs text-font-detail">Uploaded: Nov 10, 2024 • Type: Administrative</p>
                  </div>
                </div>
                <button className="text-primary hover:text-primary-light">
                  <i className="fa-solid fa-download"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Resident Info Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-bd w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-font-base">Update Resident Information</h3>
              <button className="text-font-detail hover:text-primary" onClick={() => setShowEditModal(false)}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Date of Entry (Admission)</label>
                  <input
                    type="date"
                    value={editForm.admissionDate}
                    onChange={(e) => setEditForm({ ...editForm, admissionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Room</label>
                  <input
                    type="text"
                    value={editForm.room}
                    onChange={(e) => setEditForm({ ...editForm, room: e.target.value })}
                    placeholder="e.g. 101"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Track / Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="General Population">General Population</option>
                    <option value="ALOYO">ALOYO</option>
                    <option value="Restricted">Restricted</option>
                    <option value="Team Leader">Team Leader</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Advocate</label>
                  <input
                    type="text"
                    value={editForm.advocate}
                    onChange={(e) => setEditForm({ ...editForm, advocate: e.target.value })}
                    placeholder="e.g. Davis, Linda"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Clinician</label>
                  <input
                    type="text"
                    value={editForm.clinician}
                    onChange={(e) => setEditForm({ ...editForm, clinician: e.target.value })}
                    placeholder="e.g. Johnson, Sarah"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-lg border border-bd text-sm hover:bg-gray-50"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-success text-white text-sm hover:bg-green-600"
                onClick={handleUpdateResident}
              >
                <i className="fa-solid fa-check mr-2"></i>Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[60] space-y-2">
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
    </div>
  );
}
