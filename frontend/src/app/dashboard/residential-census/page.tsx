'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks/useToast';
import ToastContainer from '@/app/components/Toast';

type Resident = {
  id: number;
  firstName: string;
  lastName: string;
  residentId?: string;
};

type CensusEntry = {
  residentId: number;
  residentName: string;
  status: 'DYS' | 'NON_DYS';
  comments: string;
};

type Census = {
  id?: number;
  date: string;
  shift: 'MORNING' | 'AFTERNOON' | 'EVENING';
  conductedBy: string;
  entries: CensusEntry[];
  totalResidents: number;
  dysCount: number;
  nonDysCount: number;
  saved: boolean;
  createdAt?: string;
};

export default function ResidentialCensusPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'current' | 'historical'>('current');
  const { toasts, addToast, removeToast } = useToast();
  
  // Current Census State
  const todayISO = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(todayISO);
  const [shift, setShift] = useState<'MORNING' | 'AFTERNOON' | 'EVENING'>('MORNING');
  const [conductedBy, setConductedBy] = useState<string>('');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [entries, setEntries] = useState<CensusEntry[]>([]);
  const [programId, setProgramId] = useState<number | null>(null);
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Historical Census State
  const [historicalCensuses, setHistoricalCensuses] = useState<Census[]>([]);
  const [selectedCensus, setSelectedCensus] = useState<Census | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadHistoricalCensuses = async (pid: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${pid}/census`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) return;
      const arr = await res.json();
      const mapped: Census[] = (Array.isArray(arr) ? arr : []).map((c: any) => ({
        id: c.id,
        date: c.censusDate,
        shift: c.shift,
        conductedBy: c.conductedBy,
        entries: (c.entries || []) as any,
        totalResidents: c.totalResidents || 0,
        dysCount: c.dysCount || 0,
        nonDysCount: c.nonDysCount || 0,
        saved: true,
        createdAt: c.createdAt,
      }));
      setHistoricalCensuses(mapped);
    } catch {}
  };

  // Load current user
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        setConductedBy(fullName || user.email || 'Unknown User');
      }
      
      const programStr = localStorage.getItem('selectedProgram');
      if (programStr) {
        const program = JSON.parse(programStr);
        setProgramId(program.id);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }, []);

  // Prefer authoritative staff profile
  useEffect(() => {
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) return;
        const me = await res.json();
        const name = me?.fullName || me?.email || '';
        if (name) setConductedBy(name);
      } catch {}
    })();
  }, []);

  // Fetch residents for the program
  useEffect(() => {
    if (!programId) return;
    (async () => {
      setLoadingResidents(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/programs/${programId}/residents`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          addToast('Failed to load residents', 'error');
          return;
        }
        const arr = await res.json();
        const mapped: Resident[] = (Array.isArray(arr) ? arr : []).map((r: any) => ({
          id: Number(r.id),
          firstName: r.firstName || '',
          lastName: r.lastName || '',
          residentId: r.residentId || '',
        }));
        setResidents(mapped);

        // Initialize entries (preserve existing comments/status where possible)
        setEntries((prev) => {
          const prevByResident = new Map(prev.map((e) => [e.residentId, e]));
          return mapped.map((r) => {
            const existing = prevByResident.get(r.id);
            return {
              residentId: r.id,
              residentName: `${r.firstName} ${r.lastName}`.trim(),
              status: existing?.status || 'DYS',
              comments: existing?.comments || '',
            };
          });
        });
      } catch {
        addToast('Failed to load residents', 'error');
      } finally {
        setLoadingResidents(false);
      }
    })();
  }, [programId]);
  
  // Fetch historical censuses
  useEffect(() => {
    if (!programId || activeTab !== 'historical') return;
    loadHistoricalCensuses(programId);
  }, [programId, activeTab]);

  // SSE: refresh archive when census is submitted
  useEffect(() => {
    if (!programId) return;
    let es: EventSource | null = null;
    try {
      const token = localStorage.getItem('token');
      const eventUrl = `/api/events${token ? `?token=${encodeURIComponent(token)}` : ''}`;
      es = new EventSource(eventUrl);
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data || '{}') as { type?: string; programId?: number | string };
          if (data?.type === 'census.submitted' && String(data.programId) === String(programId)) {
            loadHistoricalCensuses(programId);
          }
        } catch {}
      };
    } catch {}
    return () => {
      try { es?.close(); } catch {}
    };
  }, [programId, activeTab]);

  const handleStatusChange = (residentId: number, status: 'DYS' | 'NON_DYS') => {
    setEntries(prev => prev.map(entry => 
      entry.residentId === residentId ? { ...entry, status } : entry
    ));
  };
  
  const handleCommentsChange = (residentId: number, comments: string) => {
    setEntries(prev => prev.map(entry => 
      entry.residentId === residentId ? { ...entry, comments } : entry
    ));
  };

  const handleSubmit = async () => {
    if (!programId) {
      addToast('No program selected', 'error');
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        censusDate: date,
        shift,
        sendEmail: true,
        entries: entries.map((e) => ({
          residentId: e.residentId,
          residentName: e.residentName,
          status: e.status,
          comments: e.comments,
        })),
      };

      const res = await fetch(`/api/programs/${programId}/census`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        addToast('Census already exists for this date and shift', 'warning');
        return;
      }
      if (!res.ok) {
        addToast('Failed to submit census', 'error');
        return;
      }

      addToast('Submitted and email sent', 'success');

      // Switch to archive and refresh
      setActiveTab('historical');
      await loadHistoricalCensuses(programId);
    } catch {
      addToast('Failed to submit census', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewCensus = async (census: Census) => {
    if (!programId || !census.id) {
      setSelectedCensus(census);
      setShowModal(true);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${programId}/census/${census.id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const c = await res.json();
        const detailed: Census = {
          id: c.id,
          date: c.censusDate,
          shift: c.shift,
          conductedBy: c.conductedBy,
          entries: (c.entries || []).map((e: any) => ({
            residentId: e.residentId,
            residentName: e.residentName,
            status: e.status,
            comments: e.comments || '',
          })),
          totalResidents: c.totalResidents || 0,
          dysCount: c.dysCount || 0,
          nonDysCount: c.nonDysCount || 0,
          saved: true,
          createdAt: c.createdAt,
        };
        setSelectedCensus(detailed);
        setShowModal(true);
        return;
      }
    } catch {}
    setSelectedCensus(census);
    setShowModal(true);
  };
  
  const dysCount = entries.filter(e => e.status === 'DYS').length;
  const nonDysCount = entries.filter(e => e.status === 'NON_DYS').length;
  
  const getShiftBadge = (shift: string) => {
    const colors = {
      MORNING: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      AFTERNOON: 'bg-blue-100 text-blue-800 border border-blue-300',
      EVENING: 'bg-purple-100 text-purple-800 border border-purple-300'
    };
    return colors[shift as keyof typeof colors] || 'bg-gray-100 text-gray-800 border border-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-bd p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-lightest rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-users text-primary text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-font-heading">Residential Census</h1>
            <p className="text-sm text-font-detail">Track resident status for each shift</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-bd">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'current'
                ? 'border-primary text-primary'
                : 'border-transparent text-font-detail hover:text-font-base'
            }`}
          >
            <i className="fa-solid fa-clipboard-check mr-2"></i>
            Current Census
          </button>
          <button
            onClick={() => setActiveTab('historical')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'historical'
                ? 'border-primary text-primary'
                : 'border-transparent text-font-detail hover:text-font-base'
            }`}
          >
            <i className="fa-solid fa-history mr-2"></i>
            Historical Census
          </button>
        </div>
      </div>

      {/* Current Census Tab */}
      {activeTab === 'current' && (
        <>
          {/* Census Form Header */}
          <div className="bg-white rounded-lg border border-bd p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  <i className="fa-solid fa-calendar mr-2 text-primary"></i>
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  <i className="fa-solid fa-clock mr-2 text-primary"></i>
                  Shift
                </label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value as any)}
                  className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 ring-primary focus:border-transparent"
                >
                  <option value="MORNING">Morning</option>
                  <option value="AFTERNOON">Afternoon</option>
                  <option value="EVENING">Evening</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  <i className="fa-solid fa-user mr-2 text-primary"></i>
                  Conducted By
                </label>
                <input
                  type="text"
                  value={conductedBy}
                  disabled
                  className="w-full px-3 py-2 border border-bd rounded-lg bg-bg-subtle text-font-base"
                />
              </div>
              
              <div className="flex items-end gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`h-10 px-5 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-opacity-90 transition-all inline-flex items-center justify-center gap-2 shadow-sm whitespace-nowrap ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <i className={`fa-solid ${submitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                  <span>Submit</span>
                </button>
              </div>
            </div>
          </div>

          {/* Census Table */}
          <div className="bg-white rounded-lg border border-bd p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-font-heading">Resident Status</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-success rounded-full"></span>
                  <span className="text-font-base">DYS: <strong>{dysCount}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-warning rounded-full"></span>
                  <span className="text-font-base">Non-DYS: <strong>{nonDysCount}</strong></span>
                </div>
                <div className="text-font-base">Total: <strong>{entries.length}</strong></div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-subtle border-b border-bd">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-font-base">Resident</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-font-base">Resident ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-font-base">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-font-base">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bd">
                  {loadingResidents && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-sm text-font-detail">Loading residents...</td>
                    </tr>
                  )}
                  {residents.map((resident, index) => {
                    const entry = entries.find(e => e.residentId === resident.id);
                    return (
                      <tr key={resident.id} className="hover:bg-bg-subtle">
                        <td className="px-4 py-3 text-sm font-medium text-font-heading">
                          {resident.firstName} {resident.lastName}
                        </td>
                        <td className="px-4 py-3 text-sm text-font-detail">
                          {resident.residentId || 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={entry?.status || 'DYS'}
                            onChange={(e) => handleStatusChange(resident.id, e.target.value as 'DYS' | 'NON_DYS')}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                              entry?.status === 'DYS'
                                ? 'bg-success-light border-success text-success'
                                : 'bg-warning-light border-warning text-warning'
                            }`}
                          >
                            <option value="DYS">DYS</option>
                            <option value="NON_DYS">Non-DYS</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={entry?.comments || ''}
                            onChange={(e) => handleCommentsChange(resident.id, e.target.value)}
                            placeholder="Add comments..."
                            className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 ring-primary focus:border-transparent text-sm"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {/* Historical Census Tab */}
      {activeTab === 'historical' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-heading">Past Censuses</h3>
            <p className="text-sm text-font-detail mt-1">View previously submitted census records</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-subtle border-b border-bd">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-font-base">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-font-base">Shift</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-font-base">Conducted By</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-font-base">DYS / Non-DYS</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-font-base">Submitted</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-font-base">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bd">
                {historicalCensuses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <i className="fa-solid fa-inbox text-font-detail text-5xl mb-4 block"></i>
                      <p className="text-font-detail">No historical census records found</p>
                    </td>
                  </tr>
                ) : (
                  historicalCensuses.map((census) => (
                    <tr key={census.id} className="hover:bg-bg-subtle">
                      <td className="px-6 py-4 text-sm font-medium text-font-heading">
                        {new Date(census.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getShiftBadge(census.shift)}`}>
                          {census.shift.charAt(0) + census.shift.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-font-base">{census.conductedBy}</td>
                      <td className="px-6 py-4 text-sm text-font-base">
                        <span className="text-success font-medium">{census.dysCount}</span> / 
                        <span className="text-warning font-medium ml-1">{census.nonDysCount}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-font-detail">
                        {census.createdAt ? new Date(census.createdAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewCensus(census)}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 text-sm font-medium"
                        >
                          <i className="fa-solid fa-eye mr-2"></i>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Census Details Modal */}
      {showModal && selectedCensus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-bd flex items-center justify-between bg-gradient-to-r from-primary to-primary-light">
              <div>
                <h2 className="text-2xl font-bold text-white">Census Details</h2>
                <p className="text-sm text-white opacity-90 mt-1">
                  {new Date(selectedCensus.date).toLocaleDateString()} - {selectedCensus.shift.charAt(0) + selectedCensus.shift.slice(1).toLowerCase()}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-user-tie text-blue-600 text-lg"></i>
                    <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide">Conducted By</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedCensus.conductedBy}</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-check-circle text-green-600 text-lg"></i>
                    <p className="text-xs text-green-700 font-semibold uppercase tracking-wide">DYS Residents</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{selectedCensus.dysCount}</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-info-circle text-orange-600 text-lg"></i>
                    <p className="text-xs text-orange-700 font-semibold uppercase tracking-wide">Non-DYS Residents</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{selectedCensus.nonDysCount}</p>
                </div>
              </div>
              
              {/* Entries */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-font-heading flex items-center gap-2">
                  <i className="fa-solid fa-list text-primary"></i>
                  Resident Details
                </h3>
                <p className="text-sm text-font-detail mt-1">Total: {selectedCensus.entries.length} residents</p>
              </div>
              <div className="space-y-2">
                {selectedCensus.entries.map((entry, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <i className="fa-solid fa-user text-gray-600 text-sm"></i>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{entry.residentName}</p>
                            {entry.comments && (
                              <p className="text-sm text-gray-600 mt-1">
                                <i className="fa-solid fa-comment text-gray-400 mr-1"></i>
                                {entry.comments}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 ${
                        entry.status === 'DYS'
                          ? 'bg-green-50 text-green-700 border-green-300'
                          : 'bg-orange-50 text-orange-700 border-orange-300'
                      }`}>
                        {entry.status === 'DYS' ? 'DYS' : 'Non-DYS'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all shadow-sm"
              >
                <i className="fa-solid fa-times mr-2"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
