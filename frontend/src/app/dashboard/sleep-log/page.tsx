'use client';

import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/app/hooks/useToast';
import ToastContainer from '@/app/components/Toast';
import { generateWatchReportHTML } from '../pdfReports';

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
  endNotes?: string;
  authorizedByClinician?: string;
  endedByStaffName?: string;
  programAddress?: string;
  // Risk assessment fields
  selfHarmRisk?: boolean;
  suicidalIdeation?: boolean;
  aggressiveBehavior?: boolean;
  sleepDisturbance?: boolean;
  medicalConcern?: boolean;
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
  const [currentUser, setCurrentUser] = useState({ fullName: '', firstName: '', lastName: '' });
  const [viewHistoryWatch, setViewHistoryWatch] = useState<WatchAssignment | null>(null);
  const [endWatchModal, setEndWatchModal] = useState<WatchAssignment | null>(null);
  const [endWatchForm, setEndWatchForm] = useState({
    outcome: '',
    endNotes: ''
  });
  
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
  
  // Log entry form states (one per watch)
  const [logEntryForms, setLogEntryForms] = useState<{ [watchId: number]: {
    time: string;
    status: string;
    activity: string;
    otherActivity: string;
    notes: string;
  } }>({});
  
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

  // Load program ID and current user from localStorage
  useEffect(() => {
    try {
      const programData = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
      if (programData) {
        const program = JSON.parse(programData);
        setProgramId(program.id);
      }

      const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser({
          fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || user.email || 'Unknown User',
          firstName: user.firstName || '',
          lastName: user.lastName || ''
        });
      }
    } catch (error) {
      console.error('Error loading program/user data:', error);
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

  // Helper function to fetch all watches
  const fetchAllWatches = async () => {
    if (!programId) return;
    
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      // Fetch both active and archived watches
      const [activeRes, archivedRes] = await Promise.all([
        fetch(`/api/programs/${programId}/watches/active`, {
          credentials: 'include',
          headers: { 
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }),
        fetch(`/api/programs/${programId}/watches/archive`, {
          credentials: 'include',
          headers: { 
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        })
      ]);
      
      const activeData = activeRes.ok ? await activeRes.json() : [];
      const archivedData = archivedRes.ok ? await archivedRes.json() : [];
      
      // Combine and sort by start date (newest first)
      const allWatches = [...activeData, ...archivedData].sort((a, b) => 
        new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
      );
      
      setArchivedWatches(allWatches);
    } catch (error) {
      console.error('Failed to fetch watches:', error);
      addToast('Failed to load watch history', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all watches (active and archived) when archive tab is active
  useEffect(() => {
    if (activeTab !== 'archive' || !programId) return;
    fetchAllWatches();
  }, [activeTab, programId]);

  // SSE for real-time updates
  useEffect(() => {
    if (typeof window !== 'undefined' && programId) {
      const SSEHub = (window as any).SSEHub;
      if (SSEHub) {
        SSEHub.on('watch:created', () => {
          fetchStats();
          fetchActiveWatches();
          // Refresh archive if on that tab
          if (activeTab === 'archive') {
            fetchAllWatches();
          }
        });
        SSEHub.on('watch:updated', () => {
          fetchStats();
          fetchActiveWatches();
          // Refresh archive if on that tab
          if (activeTab === 'archive') {
            fetchAllWatches();
          }
        });
        SSEHub.on('watch_log_entry_created', () => {
          // Refresh active watches to update entry counts
          fetchActiveWatches();
          // Refresh archive to update entry counts
          if (activeTab === 'archive') {
            fetchAllWatches();
          }
        });
      }
    }
  }, [programId, activeTab]);

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
    if (type === 'ELEVATED') {
      return (
        <span className="bg-error text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
          🔴 ELEVATED
        </span>
      );
    } else if (type === 'ALERT') {
      return (
        <span className="bg-warning text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
          🟡 ALERT
        </span>
      );
    } else {
      return (
        <span className="bg-success text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
          🟢 GENERAL
        </span>
      );
    }
  };

  // Print watch report
  const printWatchReport = (watch: WatchAssignment) => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        addToast('Please allow popups to print report', 'error');
        return;
      }
      
      const html = generateWatchReportHTML(watch);
      
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
      }, 250);
      
      addToast('Report opened for printing', 'success');
    } catch (error) {
      console.error('Error printing report:', error);
      addToast('Failed to print report', 'error');
    }
  };

  const handlePrintWatch = (watchId: number) => {
    // Print functionality will be implemented
    console.log('Print watch:', watchId);
    addToast('Print feature coming soon', 'info');
  };

  // Handle ending a watch assignment
  const handleEndWatch = async () => {
    if (!endWatchModal) return;
    
    if (!endWatchForm.outcome || !endWatchForm.endNotes.trim()) {
      addToast('Please provide outcome and notes', 'warning');
      return;
    }
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/programs/${programId}/watches/${endWatchModal.id}/end`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          endDateTime: new Date().toISOString(),
          status: endWatchForm.outcome,
          outcome: endWatchForm.outcome,
          endNotes: endWatchForm.endNotes.trim()
        })
      });
      
      if (res.ok) {
        addToast('Watch assignment ended successfully', 'success');
        setEndWatchModal(null);
        setEndWatchForm({ outcome: '', endNotes: '' });
        fetchStats();
        fetchActiveWatches();
        // Refresh archive if on that tab
        if (activeTab === 'archive') {
          fetchAllWatches();
        }
      } else {
        const error = await res.text();
        addToast(error || 'Failed to end watch', 'error');
      }
    } catch (error) {
      console.error('Failed to end watch:', error);
      addToast('Failed to end watch', 'error');
    }
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

  // Helper to get log entry form data for a watch
  const getLogFormData = (watchId: number) => {
    return logEntryForms[watchId] || {
      time: new Date().toTimeString().slice(0, 5),
      status: 'NORMAL',
      activity: 'SLEEPING',
      otherActivity: '',
      notes: ''
    };
  };

  // Helper to update log entry form field
  const updateLogFormField = (watchId: number, field: string, value: string) => {
    const currentData = getLogFormData(watchId);
    setLogEntryForms(prev => ({
      ...prev,
      [watchId]: { ...currentData, [field]: value }
    }));
  };

  // Fetch recent log entries for a watch
  const fetchWatchLogs = async (watchId: number) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/programs/${programId}/watches/${watchId}/log-entries/recent`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setWatchLogs(prev => ({ ...prev, [watchId]: data }));
      }
    } catch (error) {
      console.error('Failed to fetch watch logs:', error);
    }
  };

  // Handle log entry submission
  const handleSubmitLogEntry = async (watchId: number) => {
    const formData = getLogFormData(watchId);
    
    if (!formData.time || !formData.status || !formData.activity || !formData.notes) {
      addToast('Please fill all required fields', 'warning');
      return;
    }
    
    if (formData.activity === 'OTHER') {
      const words = formData.otherActivity.trim().split(/\s+/);
      if (words.length > 3 || !formData.otherActivity.trim()) {
        addToast('Other activity must be 1-3 words', 'warning');
        return;
      }
    }
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const now = new Date();
      const [hours, minutes] = formData.time.split(':');
      now.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const payload = {
        observationTime: now.toISOString(),
        observationStatus: formData.status,
        activity: formData.activity,
        notes: formData.activity === 'OTHER' && formData.otherActivity.trim()
          ? `[${formData.otherActivity.trim()}] ${formData.notes.trim()}`
          : formData.notes.trim()
      };
      
      const res = await fetch(`/api/programs/${programId}/watches/${watchId}/log-entries`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        addToast('Log entry added successfully!', 'success');
        // Reset the form for this watch
        const resetForm = {
          time: new Date().toTimeString().slice(0, 5),
          status: 'NORMAL',
          activity: 'SLEEPING',
          otherActivity: '',
          notes: ''
        };
        setLogEntryForms(prev => {
          const updated = { ...prev };
          updated[watchId] = resetForm;
          return updated;
        });
        // Refresh log entries for this watch
        fetchWatchLogs(watchId);
        // Refresh active watches to update entry count
        fetchActiveWatches();
        // SSE will also trigger updates for other users
      } else {
        const error = await res.text();
        addToast(error || 'Failed to add log entry', 'error');
      }
    } catch (error) {
      console.error('Failed to submit log entry:', error);
      addToast('Failed to add log entry', 'error');
    }
  };

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

      // Convert datetime-local format to ISO-8601 Instant format
      const startDateTimeISO = new Date(startDateTime).toISOString();

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
          startDateTime: startDateTimeISO,
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
        console.error('Server error response:', error);
        console.error('Request payload was:', {
          residentId: parseInt(selectedResident),
          watchType,
          startDateTime: startDateTimeISO,
          clinicalReason: fullClinicalReason,
          ...riskAssessment
        });
        addToast(error || `Failed to create watch (Status: ${res.status})`, 'error');
      }
    } catch (error) {
      console.error('Failed to create watch:', error);
      addToast('Network error: Failed to create watch', 'error');
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
      
      {/* View History Modal */}
      {viewHistoryWatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-bd bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-font-base flex items-center">
                    <i className="fa-solid fa-history text-primary mr-3"></i>
                    Watch History - {viewHistoryWatch.residentName}
                  </h3>
                  <p className="text-sm text-font-detail mt-1">
                    {getWatchTypeBadge(viewHistoryWatch.watchType)} • Started: {formatDateTime(viewHistoryWatch.startDateTime)}
                  </p>
                </div>
                <button 
                  onClick={() => setViewHistoryWatch(null)}
                  className="text-font-detail hover:text-font-base transition-colors"
                >
                  <i className="fa-solid fa-times text-2xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {(!watchLogs[viewHistoryWatch.id] || watchLogs[viewHistoryWatch.id].length === 0) ? (
                <div className="text-center py-12 text-font-detail">
                  <i className="fa-solid fa-clipboard-list text-5xl mb-4 text-font-detail"></i>
                  <p className="text-lg font-medium">No log entries found</p>
                  <p className="text-sm mt-2">This watch has no recorded observations yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-bg-subtle sticky top-0">
                      <tr>
                        <th className="text-left p-3 font-semibold text-font-base">Date & Time</th>
                        <th className="text-left p-3 font-semibold text-font-base">Status</th>
                        <th className="text-left p-3 font-semibold text-font-base">Activity</th>
                        <th className="text-left p-3 font-semibold text-font-base">Notes</th>
                        <th className="text-left p-3 font-semibold text-font-base">Logged By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {watchLogs[viewHistoryWatch.id].map((entry, index) => {
                        const statusColor = entry.observationStatus === 'CRITICAL' ? 'error' : 
                                           entry.observationStatus === 'HIGH' ? 'warning' : 'success';
                        return (
                          <tr key={entry.id} className={`border-b border-bd ${index % 2 === 0 ? 'bg-white' : 'bg-bg-subtle/30'} hover:bg-primary/5 transition-colors`}>
                            <td className="p-3 text-sm font-medium text-font-base whitespace-nowrap">
                              {formatDateTime(entry.observationTime)}
                            </td>
                            <td className="p-3">
                              <span className={`bg-${statusColor} text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap`}>
                                {entry.observationStatus}
                              </span>
                            </td>
                            <td className="p-3 text-sm text-font-base">
                              {entry.activity === 'OTHER' && entry.notes.match(/^\[(.+?)\]/) 
                                ? entry.notes.match(/^\[(.+?)\]/)?.[1] 
                                : entry.activity.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                            </td>
                            <td className="p-3 text-sm text-font-detail max-w-md">
                              {entry.activity === 'OTHER' && entry.notes.match(/^\[.+?\]\s*(.*)/) 
                                ? entry.notes.match(/^\[.+?\]\s*(.*)/)?.[1] 
                                : entry.notes}
                            </td>
                            <td className="p-3 text-sm text-font-detail whitespace-nowrap">
                              {entry.loggedByStaffName}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* End Watch Confirmation Modal */}
      {endWatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-bd bg-gradient-to-r from-error/5 to-transparent">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-font-base flex items-center">
                  <i className="fa-solid fa-stop-circle text-error mr-3"></i>
                  End Watch Assignment
                </h3>
                <button 
                  onClick={() => {
                    setEndWatchModal(null);
                    setEndWatchForm({ outcome: '', endNotes: '' });
                  }}
                  className="text-font-detail hover:text-font-base transition-colors"
                >
                  <i className="fa-solid fa-times text-2xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <i className="fa-solid fa-exclamation-triangle text-warning text-xl mr-3 mt-1"></i>
                  <div>
                    <p className="font-semibold text-font-base">Discontinue Watch for {endWatchModal.residentName}?</p>
                    <p className="text-sm text-font-detail mt-1">
                      This will end the active watch assignment. The resident will be moved to the archive, 
                      but all data and log entries will be preserved.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-font-base mb-2">
                  Outcome <span className="text-error">*</span>
                </label>
                <select
                  value={endWatchForm.outcome}
                  onChange={(e) => setEndWatchForm(prev => ({ ...prev, outcome: e.target.value }))}
                  className="w-full border-2 border-bd rounded-lg px-4 py-3 text-sm font-medium text-font-base bg-white focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select outcome...</option>
                  <option value="COMPLETED">Completed - Condition resolved</option>
                  <option value="ESCALATED">Escalated - Transferred to higher level of care</option>
                  <option value="TRANSFERRED">Transferred - Moved to different facility</option>
                  <option value="DISCONTINUED">Discontinued - No longer clinically necessary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-font-base mb-2">
                  Clinical Notes <span className="text-error">*</span>
                </label>
                <textarea
                  value={endWatchForm.endNotes}
                  onChange={(e) => setEndWatchForm(prev => ({ ...prev, endNotes: e.target.value }))}
                  className="w-full border-2 border-bd rounded-lg px-4 py-3 text-sm text-font-base bg-white focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  placeholder="Document clinical reasoning for ending this watch assignment..."
                  rows={4}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleEndWatch}
                  className="flex-1 bg-error text-white py-3 rounded-lg font-semibold hover:bg-error/90 transition-colors"
                >
                  <i className="fa-solid fa-check mr-2"></i>
                  Confirm End Watch
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEndWatchModal(null);
                    setEndWatchForm({ outcome: '', endNotes: '' });
                  }}
                  className="px-8 py-3 border-2 border-bd rounded-lg font-semibold text-font-base hover:bg-bg-subtle transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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

          {/* Active Watches - Dynamic List */}
          {loading ? (
            <div className="bg-white rounded-lg border border-bd p-12 text-center">
              <i className="fa-solid fa-spinner fa-spin text-primary text-3xl mb-3"></i>
              <p className="text-font-detail">Loading active watches...</p>
            </div>
          ) : activeWatches.length === 0 ? (
            <div className="bg-white rounded-lg border border-bd p-12 text-center">
              <i className="fa-solid fa-eye-slash text-font-detail text-5xl mb-4"></i>
              <h3 className="text-lg font-semibold text-font-base mb-2">No Active Watches</h3>
              <p className="text-font-detail mb-4">There are currently no residents on watch</p>
              <button 
                onClick={() => setActiveTab('add')}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light transition-colors"
              >
                <i className="fa-solid fa-plus mr-2"></i>
                Add to Watch
              </button>
            </div>
          ) : (
            activeWatches.map((watch) => {
              const watchColor = getWatchTypeColor(watch.watchType);
              const iconBgClass = watchColor === 'error' ? 'bg-error bg-opacity-10' : 
                                  watchColor === 'warning' ? 'bg-warning bg-opacity-10' : 
                                  'bg-success bg-opacity-10';
              const iconTextClass = watchColor === 'error' ? 'text-error' : 
                                    watchColor === 'warning' ? 'text-warning' : 
                                    'text-success';
              const badgeBgClass = watchColor === 'error' ? 'bg-error' : 
                                   watchColor === 'warning' ? 'bg-warning' : 
                                   'bg-success';
              
              return (
              <div key={watch.id} className="bg-white rounded-lg border border-bd">
                <div className="p-6 border-b border-bd">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${iconBgClass} rounded-full flex items-center justify-center mr-4`}>
                        <i className={`fa-solid fa-user ${iconTextClass} text-lg`}></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-font-base">{watch.residentName}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`${badgeBgClass} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                            {getWatchTypeBadge(watch.watchType)}
                          </span>
                          <span className="text-sm text-font-detail">Room {watch.room}</span>
                          <span className="text-sm text-font-detail">Started: {formatDateTime(watch.startDateTime)}</span>
                          <span className="text-xs text-font-detail bg-bg-subtle px-2 py-1 rounded">
                            {watch.totalLogEntries} {watch.totalLogEntries === 1 ? 'entry' : 'entries'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setViewHistoryWatch(watch);
                          fetchWatchLogs(watch.id);
                        }}
                        className="text-primary hover:text-primary-light text-sm font-medium transition-colors"
                      >
                        <i className="fa-solid fa-history mr-1"></i>
                        View History
                      </button>
                      <button 
                        onClick={() => {
                          const newExpanded = expandedWatch === watch.id ? null : watch.id;
                          setExpandedWatch(newExpanded);
                          if (newExpanded === watch.id) {
                            fetchWatchLogs(watch.id);
                          }
                        }}
                        className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-light transition-colors"
                      >
                        <i className={`fa-solid fa-${expandedWatch === watch.id ? 'chevron-up' : 'chevron-down'} mr-1`}></i>
                        {expandedWatch === watch.id ? 'Hide' : 'Log Entry'}
                      </button>
                      <button 
                        onClick={() => setEndWatchModal(watch)}
                        className="bg-error text-white px-3 py-1 rounded text-sm hover:bg-error/90 transition-colors"
                      >
                        <i className="fa-solid fa-stop-circle mr-1"></i>
                        End Watch
                      </button>
                    </div>
                  </div>
                  
                  {/* Clinical Reason - Always visible */}
                  <div className="mt-4 pt-4 border-t border-bd">
                    <h4 className="text-sm font-semibold text-font-base mb-2 flex items-center">
                      <i className="fa-solid fa-clipboard-medical text-primary mr-2"></i>
                      Clinical Reason
                    </h4>
                    <p className="text-sm text-font-detail whitespace-pre-wrap bg-bg-subtle p-3 rounded-lg">
                      {watch.clinicalReason}
                    </p>
                    
                    {/* Risk Indicators */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {watch.selfHarmRisk && (
                        <span className="text-xs bg-error/10 text-error px-2 py-1 rounded border border-error/20">
                          <i className="fa-solid fa-exclamation-triangle mr-1"></i>Self-harm risk
                        </span>
                      )}
                      {watch.suicidalIdeation && (
                        <span className="text-xs bg-error/10 text-error px-2 py-1 rounded border border-error/20">
                          <i className="fa-solid fa-exclamation-triangle mr-1"></i>Suicidal ideation
                        </span>
                      )}
                      {watch.aggressiveBehavior && (
                        <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded border border-warning/20">
                          <i className="fa-solid fa-hand-fist mr-1"></i>Aggressive behavior
                        </span>
                      )}
                      {watch.sleepDisturbance && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                          <i className="fa-solid fa-moon mr-1"></i>Sleep disturbance
                        </span>
                      )}
                      {watch.medicalConcern && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                          <i className="fa-solid fa-heartbeat mr-1"></i>Medical concern
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expandable Log Entry Section */}
                {expandedWatch === watch.id && (
                  <div className="p-6 bg-bg-subtle/30">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-font-base mb-4">Add Log Entry</h4>
                        <div className="space-y-4 bg-white p-4 rounded-lg border border-bd">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-font-base mb-2">Time *</label>
                              <input 
                                type="time" 
                                value={getLogFormData(watch.id).time}
                                onChange={(e) => updateLogFormField(watch.id, 'time', e.target.value)}
                                className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-font-base mb-2">Status *</label>
                              <select 
                                value={getLogFormData(watch.id).status}
                                onChange={(e) => updateLogFormField(watch.id, 'status', e.target.value)}
                                className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                              >
                                <option value="NORMAL">Normal</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-font-base mb-2">Activity *</label>
                            <select 
                              value={getLogFormData(watch.id).activity}
                              onChange={(e) => {
                                const newActivity = e.target.value;
                                updateLogFormField(watch.id, 'activity', newActivity);
                                // Clear otherActivity when switching away from OTHER
                                if (newActivity !== 'OTHER') {
                                  updateLogFormField(watch.id, 'otherActivity', '');
                                }
                              }}
                              className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                              <option value="SLEEPING">😴 Sleeping</option>
                              <option value="LAYING_ON_BED">🛏️ Laying on bed</option>
                              <option value="WALKING">🚶 Walking</option>
                              <option value="PLAYING">🎮 Playing</option>
                              <option value="ENGAGING">👥 Engaging</option>
                              <option value="BATHROOM">🚽 Bathroom</option>
                              <option value="OTHER">📝 Other</option>
                            </select>
                            {getLogFormData(watch.id).activity === 'OTHER' && (
                              <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
                                <input
                                  type="text"
                                  value={getLogFormData(watch.id).otherActivity}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const words = value.trim().split(/\s+/).filter(w => w.length > 0);
                                    // Allow typing if empty or within 3-word limit
                                    if (value === '' || words.length <= 3) {
                                      updateLogFormField(watch.id, 'otherActivity', value);
                                    }
                                  }}
                                  placeholder="Max 3 words..."
                                  className="w-full border-2 border-primary/30 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                  maxLength={50}
                                />
                                <p className="text-xs text-font-detail mt-1">
                                  {(() => {
                                    const words = getLogFormData(watch.id).otherActivity.trim().split(/\s+/).filter(w => w.length > 0);
                                    return words.length > 0 ? `${words.length}/3 words` : '0/3 words';
                                  })()}
                                </p>
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-font-base mb-2">Notes *</label>
                            <textarea 
                              value={getLogFormData(watch.id).notes}
                              onChange={(e) => updateLogFormField(watch.id, 'notes', e.target.value)}
                              className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-20 focus:ring-2 focus:ring-primary focus:border-primary" 
                              placeholder="Enter detailed observations..."
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleSubmitLogEntry(watch.id)}
                            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-light transition-colors"
                          >
                            <i className="fa-solid fa-save mr-2"></i>
                            Submit Entry
                          </button>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-font-base mb-4">Recent Entries (Last 6 Hours)</h4>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {(!watchLogs[watch.id] || watchLogs[watch.id].length === 0) ? (
                            <div className="bg-white border border-bd rounded-lg p-4 text-center text-font-detail">
                              <i className="fa-solid fa-clipboard-list text-2xl mb-2 text-font-detail"></i>
                              <p>No log entries yet</p>
                              <p className="text-xs mt-1">Add your first observation above</p>
                            </div>
                          ) : (
                            watchLogs[watch.id].map((entry) => {
                              const statusColor = entry.observationStatus === 'CRITICAL' ? 'error' : 
                                                 entry.observationStatus === 'HIGH' ? 'warning' : 'success';
                              const borderColor = entry.observationStatus === 'CRITICAL' ? 'border-error' : 
                                                 entry.observationStatus === 'HIGH' ? 'border-warning' : 'border-bd';
                              const bgColor = entry.observationStatus === 'CRITICAL' ? 'bg-error' : 
                                             entry.observationStatus === 'HIGH' ? 'bg-warning' : 'bg-success';
                              
                              return (
                                <div key={entry.id} className={`border ${borderColor} rounded-lg p-3 ${entry.observationStatus !== 'NORMAL' ? `${bgColor} bg-opacity-5` : ''}`}>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">{formatDateTime(entry.observationTime)}</span>
                                    <span className={`bg-${statusColor} text-white px-2 py-1 rounded text-xs`}>
                                      {entry.observationStatus}
                                    </span>
                                  </div>
                                  <p className="text-sm text-font-detail mb-1">
                                    <strong>Activity:</strong> {entry.activity === 'OTHER' && entry.notes.match(/^\[(.+?)\]/) 
                                      ? entry.notes.match(/^\[(.+?)\]/)?.[1] 
                                      : entry.activity.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                  </p>
                                  <p className="text-sm text-font-detail">
                                    {entry.activity === 'OTHER' && entry.notes.match(/^\[.+?\]\s*(.*)/) 
                                      ? entry.notes.match(/^\[.+?\]\s*(.*)/)?.[1] 
                                      : entry.notes}
                                  </p>
                                  <p className="text-xs text-font-detail mt-2">Logged by: {entry.loggedByStaffName}</p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              );
            })
          )}
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
                    value={currentUser.fullName || 'Loading...'}
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
              <i className="fa-solid fa-history text-primary mr-3"></i>
              Complete Watch History
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
                  <th className="text-left p-3 font-semibold text-font-base">Resident</th>
                  <th className="text-left p-3 font-semibold text-font-base">Watch Type</th>
                  <th className="text-left p-3 font-semibold text-font-base">Status</th>
                  <th className="text-left p-3 font-semibold text-font-base">Started</th>
                  <th className="text-left p-3 font-semibold text-font-base">Ended</th>
                  <th className="text-left p-3 font-semibold text-font-base">Duration</th>
                  <th className="text-left p-3 font-semibold text-font-base">Entries</th>
                  <th className="text-left p-3 font-semibold text-font-base">Outcome</th>
                  <th className="text-left p-3 font-semibold text-font-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center">
                      <i className="fa-solid fa-spinner fa-spin text-primary text-2xl"></i>
                      <p className="text-font-detail mt-2">Loading archive...</p>
                    </td>
                  </tr>
                ) : paginatedArchive.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center">
                      <i className="fa-solid fa-archive text-font-detail text-4xl mb-3"></i>
                      <p className="text-font-base font-medium">No archived watches found</p>
                      <p className="text-font-detail text-sm mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  paginatedArchive.map((watch) => {
                    const isActive = !watch.endDateTime;
                    return (
                      <tr key={watch.id} className={`border-b border-bd hover:bg-bg-subtle/50 ${isActive ? 'bg-primary/5' : ''}`}>
                        <td className="p-3 text-sm font-medium text-font-base">
                          {watch.residentName}
                          <div className="text-xs text-font-detail">Room {watch.room}</div>
                        </td>
                        <td className="p-3 text-sm">
                          {getWatchTypeBadge(watch.watchType)}
                        </td>
                        <td className="p-3 text-sm">
                          {isActive ? (
                            <span className="bg-success text-white px-2 py-1 rounded text-xs font-medium">
                              <i className="fa-solid fa-circle-dot mr-1"></i>ACTIVE
                            </span>
                          ) : (
                            <span className="bg-font-detail text-white px-2 py-1 rounded text-xs font-medium">
                              ENDED
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-sm text-font-detail">{formatDateTime(watch.startDateTime)}</td>
                        <td className="p-3 text-sm text-font-detail">{watch.endDateTime ? formatDateTime(watch.endDateTime) : '-'}</td>
                        <td className="p-3 text-sm text-font-detail">{watch.duration || (isActive ? 'Ongoing' : '-')}</td>
                        <td className="p-3 text-sm text-font-detail text-center">{watch.totalLogEntries}</td>
                        <td className="p-3 text-sm">
                          {watch.outcome ? (
                            <span className="bg-primary text-white px-2 py-1 rounded text-xs">{watch.outcome}</span>
                          ) : (
                            <span className="text-font-detail">-</span>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          <button
                            onClick={() => printWatchReport(watch)}
                            className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light transition-colors inline-flex items-center gap-1"
                            title="Print Watch Report"
                          >
                            <i className="fa-solid fa-print"></i>
                            Print
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
