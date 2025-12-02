'use client';

import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/app/hooks/useToast';
import ToastContainer from '@/app/components/Toast';

interface WatchStats {
  totalActive: number;
  elevated: number;
  alert: number;
  general: number;
}

interface WatchAssignment {
  id: number;
  residentId: number;
  residentName: string;
  residentNumber: string;
  room: string;
  watchType: string;
  startDateTime: string;
  endDateTime?: string;
  clinicalReason: string;
  status: string;
  totalLogEntries: number;
  duration?: string;
  outcome?: string;
}

interface LogEntry {
  id: number;
  observationTime: string;
  observationStatus: string;
  activity: string;
  notes: string;
  loggedByStaffName: string;
}

interface Resident {
  id: number;
  firstName: string;
  lastName: string;
  residentId: string;
  room: string;
}

export default function SleepLogPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'add' | 'archive'>('active');
  const [stats, setStats] = useState<WatchStats>({ totalActive: 0, elevated: 0, alert: 0, general: 0 });
  const [activeWatches, setActiveWatches] = useState<WatchAssignment[]>([]);
  const [archivedWatches, setArchivedWatches] = useState<WatchAssignment[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWatch, setExpandedWatch] = useState<number | null>(null);
  const [watchLogs, setWatchLogs] = useState<{ [key: number]: LogEntry[] }>({});
  const { toasts, addToast, removeToast } = useToast();
  
  // Form states for Add to Watch
  const [selectedResident, setSelectedResident] = useState('');
  const [watchType, setWatchType] = useState('GENERAL');
  const [startDateTime, setStartDateTime] = useState('');
  const [clinicalReason, setClinicalReason] = useState('');
  const [riskAssessment, setRiskAssessment] = useState({
    selfHarmRisk: false,
    suicidalIdeation: false,
    aggressiveBehavior: false,
    sleepDisturbance: false,
    medicalConcern: false,
    other: false
  });
  const [otherRiskDescription, setOtherRiskDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Archive filters and pagination
  const [archiveSearch, setArchiveSearch] = useState('');
  const [archiveWatchType, setArchiveWatchType] = useState('');
  const [archiveStartDate, setArchiveStartDate] = useState('');
  const [archiveEndDate, setArchiveEndDate] = useState('');
  const [archiveOutcome, setArchiveOutcome] = useState('');
  const [archivePage, setArchivePage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Get program and token
  const [programId, setProgramId] = useState<number | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Load program ID from localStorage (same as incidents page)
  useEffect(() => {
    try {
      const programData = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
      if (programData) {
        const program = JSON.parse(programData);
        setProgramId(program.id);
      }
    } catch (error) {
      console.error('Error loading program data:', error);
    }
  }, []);

  // Fetch data on load
  useEffect(() => {
    if (!programId) return;
    
    console.log('Fetching data for program:', programId);
    
    // Fetch stats
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`/api/programs/${programId}/watches/statistics`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    })();
    
    // Fetch active watches
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`/api/programs/${programId}/watches/active`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        setActiveWatches(data);
      } catch (error) {
        console.error('Failed to fetch active watches:', error);
      } finally {
        setLoading(false);
      }
    })();
    
    // Fetch residents
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`/api/programs/${programId}/residents`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (!res.ok) {
          console.error('Failed to fetch residents - status:', res.status);
          return;
        }
        const data = await res.json();
        console.log('Fetched residents:', data);
        setResidents(data);
      } catch (error) {
        console.error('Failed to fetch residents:', error);
      }
    })();
  }, [programId]);

  // Fetch archived watches when archive tab is active
  useEffect(() => {
    if (activeTab !== 'archive' || !programId) return;
    
    (async () => {
      try {
        setLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`/api/programs/${programId}/watches/archive`, {
          credentials: 'include',
          headers: { 
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const data = await res.json();
          setArchivedWatches(data);
        }
      } catch (error) {
        console.error('Failed to fetch archived watches:', error);
        addToast('Failed to load archive', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [activeTab, programId]);

  // SSE for real-time updates
  useEffect(() => {
    if (typeof window !== 'undefined' && programId) {
      const SSEHub = (window as any).SSEHub;
      if (SSEHub) {
        SSEHub.on('watch:created', () => {
          fetchStats();
          fetchActiveWatches();
        });
        SSEHub.on('watch:updated', () => {
          fetchStats();
          fetchActiveWatches();
        });
        SSEHub.on('watch:log-entry', () => {
          fetchStats();
        });
      }
    }
  }, [programId]);

  const fetchStats = async () => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/programs/${programId}/watches/statistics`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchActiveWatches = async () => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/programs/${programId}/watches/active`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) return;
      const data = await res.json();
      setActiveWatches(data);
    } catch (error) {
      console.error('Failed to fetch active watches:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getWatchTypeColor = (type: string) => {
    switch (type) {
      case 'ELEVATED': return 'error';
      case 'ALERT': return 'warning';
      case 'GENERAL': return 'success';
      default: return 'primary';
    }
  };

  const getWatchTypeBadge = (type: string) => {
    switch (type) {
      case 'ELEVATED': return 'Elevated';
      case 'ALERT': return 'Alert';
      case 'GENERAL': return 'General';
      default: return type;
    }
  };

  const handlePrintWatch = (watchId: number) => {
    // Print functionality will be implemented
    console.log('Print watch:', watchId);
    addToast('Print feature coming soon', 'info');
  };

  // Filter and paginate archived watches using useMemo
  const filteredArchive = useMemo(() => {
    return archivedWatches.filter(watch => {
      if (archiveSearch && !watch.residentName.toLowerCase().includes(archiveSearch.toLowerCase())) return false;
      if (archiveWatchType && watch.watchType !== archiveWatchType) return false;
      if (archiveStartDate && new Date(watch.startDateTime) < new Date(archiveStartDate)) return false;
      if (archiveEndDate && watch.endDateTime && new Date(watch.endDateTime) > new Date(archiveEndDate + 'T23:59:59')) return false;
      if (archiveOutcome && watch.status !== archiveOutcome) return false;
      return true;
    });
  }, [archivedWatches, archiveSearch, archiveWatchType, archiveStartDate, archiveEndDate, archiveOutcome]);

  const paginatedArchive = useMemo(() => {
    return filteredArchive.slice(0, archivePage * ITEMS_PER_PAGE);
  }, [filteredArchive, archivePage]);

  const hasMoreArchive = filteredArchive.length > paginatedArchive.length;

  const handleCreateWatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedResident || !clinicalReason || !startDateTime) {
      addToast('Please fill all required fields', 'warning');
      return;
    }

    if (riskAssessment.other && !otherRiskDescription.trim()) {
      addToast('Please describe the other risk assessment', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      // Append other risk description to clinical reason if provided
      const fullClinicalReason = riskAssessment.other && otherRiskDescription
        ? `${clinicalReason}\n\nOther Risk Assessment: ${otherRiskDescription}`
        : clinicalReason;

      const res = await fetch(`/api/programs/${programId}/watches`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          residentId: parseInt(selectedResident),
          watchType,
          startDateTime,
          clinicalReason: fullClinicalReason,
          ...riskAssessment
        })
      });

      if (res.ok) {
        addToast('Watch created successfully!', 'success');
        // Clear form
        setSelectedResident('');
        setWatchType('GENERAL');
        setStartDateTime('');
        setClinicalReason('');
        setRiskAssessment({
          selfHarmRisk: false,
          suicidalIdeation: false,
          aggressiveBehavior: false,
          sleepDisturbance: false,
          medicalConcern: false,
          other: false
        });
        setOtherRiskDescription('');
        // Refresh data
        fetchStats();
        fetchActiveWatches();
        // Switch to active tab
        setActiveTab('active');
      } else {
        const error = await res.text();
        addToast(error || 'Failed to create watch', 'error');
      }
    } catch (error) {
      console.error('Failed to create watch:', error);
      addToast('Failed to create watch', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const tabBtnBase = 'flex items-center px-0 py-4 text-sm transition-all duration-300 border-b-2';
  const tabActive = 'text-primary font-semibold border-primary';
  const tabInactive = 'text-font-medium font-medium border-transparent hover:text-primary';

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {/* Tabs */}
      <div className="mb-2">
        <div className="border-b border-bd">
          <div className="flex space-x-8 px-6">
            <button className={`${tabBtnBase} ${activeTab === 'active' ? tabActive : tabInactive}`} onClick={() => setActiveTab('active')}>
              <i className={`fa-solid fa-eye w-4 h-4 mr-3 ${activeTab === 'active' ? 'text-primary' : 'text-font-detail'}`}></i>
              <span>Active Watches</span>
            </button>
            <button className={`${tabBtnBase} ${activeTab === 'add' ? tabActive : tabInactive}`} onClick={() => setActiveTab('add')}>
              <i className={`fa-solid fa-user-plus w-4 h-4 mr-3 ${activeTab === 'add' ? 'text-primary' : 'text-font-detail'}`}></i>
              <span>Add to Watch</span>
            </button>
            <button className={`${tabBtnBase} ${activeTab === 'archive' ? tabActive : tabInactive}`} onClick={() => setActiveTab('archive')}>
              <i className={`fa-solid fa-archive w-4 h-4 mr-3 ${activeTab === 'archive' ? 'text-primary' : 'text-font-detail'}`}></i>
              <span>Archive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Watches */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {/* Overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-bd">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-font-detail text-sm">Total on Watch</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalActive}</p>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                  <i className="fa-solid fa-eye text-primary text-xl"></i>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-bd">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-font-detail text-sm">Elevated Watch</p>
                  <p className="text-2xl font-bold text-error">{stats.elevated}</p>
                </div>
                <div className="bg-error bg-opacity-10 p-3 rounded-lg">
                  <i className="fa-solid fa-exclamation-triangle text-error text-xl"></i>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-bd">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-font-detail text-sm">Alert Watch</p>
                  <p className="text-2xl font-bold text-warning">{stats.alert}</p>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-lg">
                  <i className="fa-solid fa-shield-halved text-warning text-xl"></i>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-bd">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-font-detail text-sm">General Watch</p>
                  <p className="text-2xl font-bold text-success">{stats.general}</p>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-lg">
                  <i className="fa-solid fa-bed text-success text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Resident Watch 1 */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-error bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                    <i className="fa-solid fa-user text-error text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-font-base">Michael Rodriguez</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="bg-error text-white px-3 py-1 rounded-full text-xs font-medium">Critical Watch</span>
                      <span className="text-sm text-font-detail">Room 204B</span>
                      <span className="text-sm text-font-detail">Started: 6:00 PM</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-primary hover:underline text-sm">View History</button>
                  <button className="bg-primary text-white px-3 py-1 rounded text-sm">Log Entry</button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-font-base mb-4">Hourly Log Entry</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Time</label>
                        <input type="time" defaultValue="23:45" className="w-full border border-bd rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Status</label>
                        <select defaultValue="Critical" className="w-full border border-bd rounded-lg px-3 py-2 text-sm">
                          <option>Normal</option>
                          <option>Critical</option>
                          <option>High</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Activity</label>
                      <select defaultValue="Walking" className="w-full border border-bd rounded-lg px-3 py-2 text-sm">
                        <option>Sleeping</option>
                        <option>Laying on bed</option>
                        <option>Walking</option>
                        <option>Playing</option>
                        <option>Engaging</option>
                        <option>Bathroom</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Notes</label>
                      <textarea className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-20" placeholder="Enter detailed observations...">Resident appears agitated, pacing in room. Verbal de-escalation attempted.</textarea>
                    </div>
                    <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-light">Submit Entry</button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-font-base mb-4">Recent Entries (Last 6 Hours)</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    <div className="border border-error rounded-lg p-3 bg-error bg-opacity-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">10:45 PM</span>
                        <span className="bg-error text-white px-2 py-1 rounded text-xs">Critical</span>
                      </div>
                      <p className="text-sm text-font-detail mb-1"><strong>Activity:</strong> Walking</p>
                      <p className="text-sm text-font-detail">Resident pacing, showing signs of distress. Clinician notified.</p>
                    </div>
                    <div className="border border-warning rounded-lg p-3 bg-warning bg-opacity-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">9:45 PM</span>
                        <span className="bg-warning text-white px-2 py-1 rounded text-xs">High</span>
                      </div>
                      <p className="text-sm text-font-detail mb-1"><strong>Activity:</strong> Laying on bed</p>
                      <p className="text-sm text-font-detail">Resident restless, difficulty settling for sleep.</p>
                    </div>
                    <div className="border border-bd rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">8:45 PM</span>
                        <span className="bg-success text-white px-2 py-1 rounded text-xs">Normal</span>
                      </div>
                      <p className="text-sm text-font-detail mb-1"><strong>Activity:</strong> Engaging</p>
                      <p className="text-sm text-font-detail">Participated in evening activities, cooperative mood.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resident Watch 2 */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                    <i className="fa-solid fa-user text-warning text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-font-base">Sarah Johnson</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="bg-warning text-white px-3 py-1 rounded-full text-xs font-medium">Elevated Watch</span>
                      <span className="text-sm text-font-detail">Room 103A</span>
                      <span className="text-sm text-font-detail">Started: 8:00 PM</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-primary hover:underline text-sm">View History</button>
                  <button className="bg-primary text-white px-3 py-1 rounded text-sm">Log Entry</button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-font-base mb-4">Hourly Log Entry</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Time</label>
                        <input type="time" defaultValue="23:45" className="w-full border border-bd rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Status</label>
                        <select defaultValue="Normal" className="w-full border border-bd rounded-lg px-3 py-2 text-sm">
                          <option>Normal</option>
                          <option>Critical</option>
                          <option>High</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Activity</label>
                      <select defaultValue="Sleeping" className="w-full border border-bd rounded-lg px-3 py-2 text-sm">
                        <option>Sleeping</option>
                        <option>Laying on bed</option>
                        <option>Walking</option>
                        <option>Playing</option>
                        <option>Engaging</option>
                        <option>Bathroom</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Notes</label>
                      <textarea className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-20" placeholder="Enter detailed observations...">Resident sleeping peacefully, no disturbances noted.</textarea>
                    </div>
                    <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-light">Submit Entry</button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-font-base mb-4">Recent Entries (Last 6 Hours)</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    <div className="border border-bd rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">10:45 PM</span>
                        <span className="bg-success text-white px-2 py-1 rounded text-xs">Normal</span>
                      </div>
                      <p className="text-sm text-font-detail mb-1"><strong>Activity:</strong> Sleeping</p>
                      <p className="text-sm text-font-detail">Resident settled for the night, regular breathing pattern.</p>
                    </div>
                    <div className="border border-bd rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">9:45 PM</span>
                        <span className="bg-success text-white px-2 py-1 rounded text-xs">Normal</span>
                      </div>
                      <p className="text-sm text-font-detail mb-1"><strong>Activity:</strong> Laying on bed</p>
                      <p className="text-sm text-font-detail">Preparing for sleep, reading quietly.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to Watch */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-lg border border-bd shadow-sm">
          <div className="p-6 border-b border-bd bg-gradient-to-r from-primary/5 to-transparent">
            <h3 className="text-xl font-bold text-font-base flex items-center">
              <div className="bg-primary p-2 rounded-lg mr-3">
                <i className="fa-solid fa-user-plus text-white"></i>
              </div>
              Add Resident to Watch
            </h3>
            <p className="text-sm text-font-detail mt-2 ml-11">Complete this form to place a resident under watch supervision</p>
            {/* Debug info - remove after testing */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 ml-11 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                <strong>Debug:</strong> Program ID: {programId || 'NOT SET'} | 
                Residents loaded: {residents.length} | 
                Token: {typeof window !== 'undefined' && localStorage.getItem('token') ? 'Present' : 'Missing'}
              </div>
            )}
          </div>
          <form onSubmit={handleCreateWatch} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Resident & Watch Details */}
              <div className="space-y-6">
                <div className="bg-bg-subtle/50 p-5 rounded-lg border border-bd/50">
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center">
                    <i className="fa-solid fa-user-circle mr-2"></i>
                    Resident Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-font-base mb-2">
                        Resident Name <span className="text-error">*</span>
                      </label>
                      <select 
                        value={selectedResident}
                        onChange={(e) => setSelectedResident(e.target.value)}
                        required
                        className="w-full border-2 border-bd rounded-lg px-4 py-3 text-sm font-medium text-font-base bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-primary/50 cursor-pointer"
                      >
                        <option value="" className="text-font-detail">
                          {residents.length === 0 ? 'Loading residents...' : `Select Resident... (${residents.length} available)`}
                        </option>
                        {residents.map(resident => (
                          <option key={resident.id} value={resident.id} className="py-2">
                            {resident.firstName} {resident.lastName} - {resident.residentId}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-font-base mb-2">
                        Room Number
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={residents.find(r => r.id === parseInt(selectedResident))?.room || ''}
                          readOnly
                          className="w-full border-2 border-bd rounded-lg px-4 py-3 text-sm font-medium text-font-detail bg-bg-subtle/70" 
                          placeholder="Will auto-fill after selecting resident" 
                        />
                        <i className="fa-solid fa-door-open absolute right-4 top-1/2 -translate-y-1/2 text-font-detail"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-subtle/50 p-5 rounded-lg border border-bd/50">
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center">
                    <i className="fa-solid fa-shield-halved mr-2"></i>
                    Watch Configuration
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-font-base mb-2">
                        Watch Type <span className="text-error">*</span>
                      </label>
                      <select 
                        value={watchType}
                        onChange={(e) => setWatchType(e.target.value)}
                        required
                        className="w-full border-2 border-bd rounded-lg px-4 py-3 text-sm font-medium text-font-base bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-primary/50 cursor-pointer"
                      >
                        <option value="GENERAL" className="py-2">🟢 General Watch</option>
                        <option value="ALERT" className="py-2">🟡 Alert Watch</option>
                        <option value="ELEVATED" className="py-2">🔴 Elevated Watch</option>
                      </select>
                      <p className="text-xs text-font-detail mt-2">
                        {watchType === 'GENERAL' && '• Standard monitoring for general concerns'}
                        {watchType === 'ALERT' && '• Increased monitoring for moderate risk situations'}
                        {watchType === 'ELEVATED' && '• Maximum monitoring for critical situations'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-font-base mb-2">
                        Start Date & Time <span className="text-error">*</span>
                      </label>
                      <input 
                        type="datetime-local" 
                        value={startDateTime}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        required
                        className="w-full border-2 border-bd rounded-lg px-4 py-3 text-sm font-medium text-font-base bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-font-base mb-2">
                    Clinical Reason <span className="text-error">*</span>
                  </label>
                  <textarea 
                    value={clinicalReason}
                    onChange={(e) => setClinicalReason(e.target.value)}
                    required
                    className="w-full border-2 border-bd rounded-lg px-4 py-3 text-sm text-font-base bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none" 
                    placeholder="Enter detailed clinical justification for watch placement..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Right Column - Risk Assessment */}
              <div className="space-y-6">
                <div className="bg-bg-subtle/50 p-5 rounded-lg border border-bd/50">
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center">
                    <i className="fa-solid fa-clipboard-check mr-2"></i>
                    Risk Assessment
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-start p-3 rounded-lg hover:bg-white transition-colors cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={riskAssessment.selfHarmRisk}
                        onChange={(e) => setRiskAssessment({...riskAssessment, selfHarmRisk: e.target.checked})}
                        className="mt-1 mr-3 w-4 h-4 text-primary focus:ring-primary rounded cursor-pointer" 
                      />
                      <div>
                        <span className="text-sm font-medium text-font-base group-hover:text-primary transition-colors">Self-harm risk</span>
                        <p className="text-xs text-font-detail mt-1">Resident has expressed or shown intent to harm themselves</p>
                      </div>
                    </label>
                    <label className="flex items-start p-3 rounded-lg hover:bg-white transition-colors cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={riskAssessment.suicidalIdeation}
                        onChange={(e) => setRiskAssessment({...riskAssessment, suicidalIdeation: e.target.checked})}
                        className="mt-1 mr-3 w-4 h-4 text-primary focus:ring-primary rounded cursor-pointer" 
                      />
                      <div>
                        <span className="text-sm font-medium text-font-base group-hover:text-primary transition-colors">Suicidal ideation</span>
                        <p className="text-xs text-font-detail mt-1">Resident has expressed thoughts of suicide</p>
                      </div>
                    </label>
                    <label className="flex items-start p-3 rounded-lg hover:bg-white transition-colors cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={riskAssessment.aggressiveBehavior}
                        onChange={(e) => setRiskAssessment({...riskAssessment, aggressiveBehavior: e.target.checked})}
                        className="mt-1 mr-3 w-4 h-4 text-primary focus:ring-primary rounded cursor-pointer" 
                      />
                      <div>
                        <span className="text-sm font-medium text-font-base group-hover:text-primary transition-colors">Aggressive behavior</span>
                        <p className="text-xs text-font-detail mt-1">Risk of harm to others or property damage</p>
                      </div>
                    </label>
                    <label className="flex items-start p-3 rounded-lg hover:bg-white transition-colors cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={riskAssessment.sleepDisturbance}
                        onChange={(e) => setRiskAssessment({...riskAssessment, sleepDisturbance: e.target.checked})}
                        className="mt-1 mr-3 w-4 h-4 text-primary focus:ring-primary rounded cursor-pointer" 
                      />
                      <div>
                        <span className="text-sm font-medium text-font-base group-hover:text-primary transition-colors">Sleep disturbance</span>
                        <p className="text-xs text-font-detail mt-1">Severe insomnia or irregular sleep patterns</p>
                      </div>
                    </label>
                    <label className="flex items-start p-3 rounded-lg hover:bg-white transition-colors cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={riskAssessment.medicalConcern}
                        onChange={(e) => setRiskAssessment({...riskAssessment, medicalConcern: e.target.checked})}
                        className="mt-1 mr-3 w-4 h-4 text-primary focus:ring-primary rounded cursor-pointer" 
                      />
                      <div>
                        <span className="text-sm font-medium text-font-base group-hover:text-primary transition-colors">Medical concern</span>
                        <p className="text-xs text-font-detail mt-1">Health-related monitoring required</p>
                      </div>
                    </label>
                    <label className="flex items-start p-3 rounded-lg hover:bg-white transition-colors cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={riskAssessment.other}
                        onChange={(e) => {
                          setRiskAssessment({...riskAssessment, other: e.target.checked});
                          if (!e.target.checked) setOtherRiskDescription('');
                        }}
                        className="mt-1 mr-3 w-4 h-4 text-primary focus:ring-primary rounded cursor-pointer" 
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-font-base group-hover:text-primary transition-colors">Other</span>
                        <p className="text-xs text-font-detail mt-1">Specify additional concerns below</p>
                      </div>
                    </label>
                    {riskAssessment.other && (
                      <div className="ml-7 mt-2 animate-in slide-in-from-top-2 duration-200">
                        <textarea
                          value={otherRiskDescription}
                          onChange={(e) => setOtherRiskDescription(e.target.value)}
                          placeholder="Describe the other risk assessment in detail..."
                          required={riskAssessment.other}
                          className="w-full border-2 border-primary/30 rounded-lg px-4 py-3 text-sm text-font-base bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-lg border-2 border-primary/20">
                  <label className="block text-sm font-semibold text-font-base mb-2 flex items-center">
                    <i className="fa-solid fa-user-md mr-2 text-primary"></i>
                    Clinician Authorization
                  </label>
                  <input 
                    type="text" 
                    className="w-full border-2 border-primary/30 rounded-lg px-4 py-3 text-sm font-medium text-font-base bg-white/80 cursor-not-allowed" 
                    placeholder="Your name (auto-filled from login)" 
                    readOnly 
                  />
                  <p className="text-xs text-font-detail mt-2 flex items-center">
                    <i className="fa-solid fa-info-circle mr-1"></i>
                    Your credentials will be recorded with this watch assignment
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-8 pt-6 border-t border-bd">
              <button 
                type="submit" 
                disabled={submitting}
                className="flex-1 bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary-light transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {submitting ? (
                  <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Adding to Watch...</>
                ) : (
                  <><i className="fa-solid fa-check-circle mr-2"></i>Add to Watch</>
                )}
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('active')}
                className="px-8 py-4 border-2 border-bd rounded-lg font-semibold text-font-base hover:bg-bg-subtle hover:border-font-detail transition-all"
              >
                <i className="fa-solid fa-times mr-2"></i>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Archive */}
      {activeTab === 'archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center mb-4">
              <i className="fa-solid fa-archive text-primary mr-3"></i>
              Watch Archive
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input 
                type="text" 
                placeholder="Search resident..." 
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
              />
              <select 
                value={archiveWatchType}
                onChange={(e) => setArchiveWatchType(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Watch Types</option>
                <option value="ELEVATED">Elevated Watch</option>
                <option value="ALERT">Alert Watch</option>
                <option value="GENERAL">General Watch</option>
              </select>
              <input 
                type="date" 
                value={archiveStartDate}
                onChange={(e) => setArchiveStartDate(e.target.value)}
                placeholder="Start Date"
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
              />
              <input 
                type="date" 
                value={archiveEndDate}
                onChange={(e) => setArchiveEndDate(e.target.value)}
                placeholder="End Date"
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
              />
              <select 
                value={archiveOutcome}
                onChange={(e) => setArchiveOutcome(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Outcomes</option>
                <option value="COMPLETED">Completed</option>
                <option value="ESCALATED">Escalated</option>
                <option value="TRANSFERRED">Transferred</option>
                <option value="DISCONTINUED">Discontinued</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-subtle">
                <tr>
                  <th className="text-left p-4 font-medium text-font-base">Resident</th>
                  <th className="text-left p-4 font-medium text-font-base">Watch Type</th>
                  <th className="text-left p-4 font-medium text-font-base">Start Date/Time</th>
                  <th className="text-left p-4 font-medium text-font-base">End Date/Time</th>
                  <th className="text-left p-4 font-medium text-font-base">Duration</th>
                  <th className="text-left p-4 font-medium text-font-base">Outcome</th>
                  <th className="text-left p-4 font-medium text-font-base">Total Entries</th>
                  <th className="text-left p-4 font-medium text-font-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center">
                      <i className="fa-solid fa-spinner fa-spin text-primary text-2xl"></i>
                      <p className="text-font-detail mt-2">Loading archive...</p>
                    </td>
                  </tr>
                ) : paginatedArchive.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center">
                      <i className="fa-solid fa-archive text-font-detail text-4xl mb-3"></i>
                      <p className="text-font-base font-medium">No archived watches found</p>
                      <p className="text-font-detail text-sm mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  paginatedArchive.map((watch) => (
                    <tr key={watch.id} className="border-b border-bd hover:bg-bg-subtle">
                      <td className="p-4 font-medium">{watch.residentName}</td>
                      <td className="p-4">
                        <span className={`bg-${getWatchTypeColor(watch.watchType)} text-white px-2 py-1 rounded text-sm`}>
                          {getWatchTypeBadge(watch.watchType)}
                        </span>
                      </td>
                      <td className="p-4">{formatDateTime(watch.startDateTime)}</td>
                      <td className="p-4">{watch.endDateTime ? formatDateTime(watch.endDateTime) : '-'}</td>
                      <td className="p-4">{watch.duration || '-'}</td>
                      <td className="p-4">
                        <span className={`${watch.status === 'COMPLETED' ? 'bg-success' : watch.status === 'ESCALATED' ? 'bg-warning' : 'bg-primary'} text-white px-2 py-1 rounded text-sm`}>
                          {watch.status}
                        </span>
                      </td>
                      <td className="p-4">{watch.totalLogEntries}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => handlePrintWatch(watch.id)}
                          className="text-primary hover:text-primary-light transition-colors"
                          title="Print Watch Report"
                        >
                          <i className="fa-solid fa-print"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {hasMoreArchive && (
            <div className="p-6 border-t border-bd">
              <div className="flex justify-center">
                <button 
                  onClick={() => setArchivePage(archivePage + 1)}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-light"
                >
                  <i className="fa-solid fa-arrow-down mr-2"></i>
                  Load More ({filteredArchive.length - paginatedArchive.length} remaining)
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
