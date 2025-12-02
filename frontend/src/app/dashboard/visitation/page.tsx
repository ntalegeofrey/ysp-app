'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { generateVisitationReportHTML } from '../pdfReports/visitationReportTemplate';

export default function VisitationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'schedule' | 'visits' | 'phone' | 'archive'>('visits');
  const [programId, setProgramId] = useState<string | null>(null);
  
  // Data state
  const [residents, setResidents] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [scheduledVisitations, setScheduledVisitations] = useState<any[]>([]);
  const [phoneLogs, setPhoneLogs] = useState<any[]>([]);
  const [historicalRecords, setHistoricalRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Historical records filters
  const [recordsFilter, setRecordsFilter] = useState({
    dateRange: '30',
    recordType: 'all',
    residentId: '',
    page: 0,
    size: 10
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [displayedRecords, setDisplayedRecords] = useState<any[]>([]);
  
  // Form state for Schedule Visitation
  const [visitForm, setVisitForm] = useState({
    residentId: '',
    visitType: 'IN_PERSON',
    visitorName: '',
    visitorRelationship: '',
    visitorPhone: '',
    visitorEmail: '',
    scheduledDate: '',
    scheduledStartTime: '',
    scheduledEndTime: '',
    visitationRoom: '',
    specialInstructions: '',
    supervisingStaffId: '',
    approvalStatus: 'PENDING'
  });
  
  // Form state for Phone Log
  const [phoneForm, setPhoneForm] = useState({
    residentId: '',
    callType: 'OUTGOING',
    contactRelationship: '',
    contactName: '',
    phoneNumber: '',
    callTime: '',
    durationMinutes: '',
    authorizingStaffId: '',
    monitoringStaffId: '',
    behaviorDuringCall: 'POSITIVE',
    postCallBehavior: 'IMPROVED',
    additionalComments: ''
  });
  
  // Toast notifications
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    try {
      localStorage.setItem('global-toast', JSON.stringify({ title: message, tone: type }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };
  
  // Get programId from localStorage
  useEffect(() => {
    const selectedProgram = localStorage.getItem('selectedProgram');
    if (selectedProgram) {
      try {
        const program = JSON.parse(selectedProgram);
        setProgramId(program.id || program.programId);
      } catch {}
    }
  }, []);
  
  // Fetch residents
  const fetchResidents = async () => {
    if (!programId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${programId}/residents`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setResidents(data);
      }
    } catch (err) {
      console.error('Failed to fetch residents:', err);
    }
  };
  
  // Fetch staff
  const fetchStaff = async () => {
    if (!programId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${programId}/assignments`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    }
  };
  
  // Fetch scheduled visitations
  const fetchScheduledVisitations = async () => {
    if (!programId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${programId}/visitations/upcoming`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setScheduledVisitations(data);
      }
    } catch (err) {
      console.error('Failed to fetch visitations:', err);
    }
  };
  
  // Fetch historical records
  const fetchHistoricalRecords = async (append = false) => {
    if (!programId) return;
    try {
      const token = localStorage.getItem('token');
      
      // Build query params based on filters
      const params = new URLSearchParams();
      params.append('page', String(recordsFilter.page));
      params.append('size', String(recordsFilter.size));
      
      // Add date filter
      if (recordsFilter.dateRange !== 'all') {
        const days = parseInt(recordsFilter.dateRange);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        params.append('startDate', startDate.toISOString());
      }
      
      // Add resident filter
      if (recordsFilter.residentId) {
        params.append('residentId', recordsFilter.residentId);
      }
      
      let records: any[] = [];
      let total = 0;
      
      if (recordsFilter.recordType === 'all' || recordsFilter.recordType === 'visitations') {
        const visitationsRes = await fetch(`/api/programs/${programId}/visitations?${params}`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        });
        
        if (visitationsRes.ok) {
          const data = await visitationsRes.json();
          const visitations = data.visitations || [];
          records.push(...visitations.map((v: any) => ({ ...v, type: 'visitation' })));
          total += data.totalElements || 0;
        }
      }
      
      if (recordsFilter.recordType === 'all' || recordsFilter.recordType === 'phone') {
        const phoneLogsRes = await fetch(`/api/programs/${programId}/phone-logs?${params}`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        });
        
        if (phoneLogsRes.ok) {
          const data = await phoneLogsRes.json();
          const phoneLogs = data.phoneLogs || [];
          records.push(...phoneLogs.map((p: any) => ({ ...p, type: 'phone' })));
          total += data.totalElements || 0;
        }
      }
      
      // Sort by date
      records.sort((a, b) => {
        const dateA = new Date(a.scheduledDate || a.callDateTime || a.createdAt).getTime();
        const dateB = new Date(b.scheduledDate || b.callDateTime || b.createdAt).getTime();
        return dateB - dateA;
      });
      
      if (append) {
        setDisplayedRecords(prev => [...prev, ...records]);
      } else {
        setDisplayedRecords(records);
      }
      
      setTotalRecords(total);
      setHistoricalRecords(records);
    } catch (err) {
      console.error('Failed to fetch historical records:', err);
    }
  };
  
  // Load data when programId changes or tab changes
  useEffect(() => {
    if (programId) {
      fetchResidents();
      fetchStaff();
      if (activeTab === 'visits') fetchScheduledVisitations();
      if (activeTab === 'archive') fetchHistoricalRecords();
    }
  }, [programId, activeTab]);
  
  // Watch for filter changes
  useEffect(() => {
    if (activeTab === 'archive' && programId) {
      setRecordsFilter(prev => ({ ...prev, page: 0 }));
      fetchHistoricalRecords(false);
    }
  }, [recordsFilter.dateRange, recordsFilter.recordType, recordsFilter.residentId]);
  
  // Handle schedule visitation form submission
  const handleScheduleVisitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programId) {
      addToast('No program selected', 'error');
      return;
    }
    
    // Basic validation
    if (!visitForm.residentId) {
      addToast('Please select a resident', 'error');
      return;
    }
    if (!visitForm.visitorName) {
      addToast('Please enter visitor name', 'error');
      return;
    }
    if (!visitForm.scheduledDate || !visitForm.scheduledStartTime || !visitForm.scheduledEndTime) {
      addToast('Please enter complete schedule information', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Build visitor info
      const visitorInfo = [{
        name: visitForm.visitorName,
        relationship: visitForm.visitorRelationship,
        phone: visitForm.visitorPhone,
        email: visitForm.visitorEmail
      }];
      
      // Combine date and time
      const scheduledDate = visitForm.scheduledDate;
      const startTime = `${scheduledDate}T${visitForm.scheduledStartTime}:00.000Z`;
      const endTime = `${scheduledDate}T${visitForm.scheduledEndTime}:00.000Z`;
      
      const payload = {
        residentId: parseInt(visitForm.residentId),
        visitType: visitForm.visitType,
        approvalStatus: visitForm.approvalStatus,
        visitorInfo,
        scheduledDate,
        scheduledStartTime: startTime,
        scheduledEndTime: endTime,
        visitationRoom: visitForm.visitationRoom,
        specialInstructions: visitForm.specialInstructions,
        ...(visitForm.supervisingStaffId ? { supervisingStaffId: parseInt(visitForm.supervisingStaffId) } : {})
      };
      
      const res = await fetch(`/api/programs/${programId}/visitations`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        addToast('Visitation scheduled successfully', 'success');
        // Reset form
        setVisitForm({
          residentId: '',
          visitType: 'IN_PERSON',
          visitorName: '',
          visitorRelationship: '',
          visitorPhone: '',
          visitorEmail: '',
          scheduledDate: '',
          scheduledStartTime: '',
          scheduledEndTime: '',
          visitationRoom: '',
          specialInstructions: '',
          supervisingStaffId: '',
          approvalStatus: 'PENDING'
        });
        // Switch to visits tab
        setActiveTab('visits');
        fetchScheduledVisitations();
      } else {
        let errorMsg = 'Failed to schedule visitation';
        try {
          const errorText = await res.text();
          // Try to parse as JSON first
          try {
            const errorJson = JSON.parse(errorText);
            errorMsg = errorJson.message || errorJson.error || errorText;
          } catch {
            // If not JSON, use the text directly
            errorMsg = errorText || errorMsg;
          }
        } catch {
          // If reading response fails, use default message
        }
        addToast(errorMsg, 'error');
      }
    } catch (err) {
      console.error('Error scheduling visitation:', err);
      addToast('Failed to schedule visitation', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle phone log form submission
  const handleLogPhoneCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programId) {
      addToast('No program selected', 'error');
      return;
    }
    
    // Basic validation
    if (!phoneForm.residentId) {
      addToast('Please select a resident', 'error');
      return;
    }
    if (!phoneForm.contactRelationship) {
      addToast('Please select contact relationship', 'error');
      return;
    }
    if (!phoneForm.authorizingStaffId || !phoneForm.monitoringStaffId) {
      addToast('Please select both authorizing and monitoring staff', 'error');
      return;
    }
    if (!phoneForm.callTime || !phoneForm.durationMinutes) {
      addToast('Please enter call time and duration', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Build call date time
      const now = new Date();
      const callDateTime = phoneForm.callTime 
        ? `${now.toISOString().split('T')[0]}T${phoneForm.callTime}:00.000Z`
        : now.toISOString();
      
      const payload = {
        residentId: parseInt(phoneForm.residentId),
        callType: phoneForm.callType,
        contactRelationship: phoneForm.contactRelationship,
        contactName: phoneForm.contactName,
        phoneNumber: phoneForm.phoneNumber,
        callDateTime,
        durationMinutes: parseInt(phoneForm.durationMinutes) || 0,
        authorizingStaffId: parseInt(phoneForm.authorizingStaffId),
        monitoringStaffId: parseInt(phoneForm.monitoringStaffId),
        behaviorDuringCall: phoneForm.behaviorDuringCall,
        postCallBehavior: phoneForm.postCallBehavior,
        additionalComments: phoneForm.additionalComments,
        callTerminatedEarly: false
      };
      
      const res = await fetch(`/api/programs/${programId}/phone-logs`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        addToast('Phone call logged successfully', 'success');
        // Reset form
        setPhoneForm({
          residentId: '',
          callType: 'OUTGOING',
          contactRelationship: '',
          contactName: '',
          phoneNumber: '',
          callTime: '',
          durationMinutes: '',
          authorizingStaffId: '',
          monitoringStaffId: '',
          behaviorDuringCall: 'POSITIVE',
          postCallBehavior: 'IMPROVED',
          additionalComments: ''
        });
      } else {
        let errorMsg = 'Failed to log phone call';
        try {
          const errorText = await res.text();
          // Try to parse as JSON first
          try {
            const errorJson = JSON.parse(errorText);
            errorMsg = errorJson.message || errorJson.error || errorText;
          } catch {
            // If not JSON, use the text directly
            errorMsg = errorText || errorMsg;
          }
        } catch {
          // If reading response fails, use default message
        }
        addToast(errorMsg, 'error');
      }
    } catch (err) {
      console.error('Error logging phone call:', err);
      addToast('Failed to log phone call', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle start visit
  const handleStartVisit = async (visitId: number) => {
    if (!programId) {
      addToast('No program selected', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${programId}/visitations/${visitId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: 'IN_PROGRESS' })
      });
      
      if (res.ok) {
        addToast('Visit started successfully', 'success');
        fetchScheduledVisitations();
      } else {
        addToast('Failed to start visit', 'error');
      }
    } catch (err) {
      addToast('Failed to start visit', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate PDF report for resident visits
  const generatePDF = async (residentId: number, residentName: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch all visits for this resident
      const res = await fetch(`/api/programs/${programId}/visitations/resident/${residentId}`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      
      if (!res.ok) {
        addToast('Failed to fetch resident visits', 'error');
        return;
      }
      
      const visits = await res.json();
      const resident = residents.find(r => r.id === residentId) || { 
        firstName: residentName.split(' ')[0], 
        lastName: residentName.split(' ')[1] || '',
        residentId: `R${residentId}`,
        room: 'N/A'
      };
      
      // Generate HTML content
      const htmlContent = generateVisitationReportHTML(resident, visits);
      
      // Open in new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Trigger print dialog after a short delay
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
      
      addToast('Report generated successfully', 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      addToast('Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle complete visit
  const handleCompleteVisit = async (visitId: number) => {
    const visitNotes = prompt('Enter visit notes (optional):');
    const incidentOccurred = confirm('Did any incidents occur during the visit?');
    
    if (!programId) {
      addToast('No program selected', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        visitNotes: visitNotes || '',
        incidentOccurred: incidentOccurred,
        incidentDetails: incidentOccurred ? prompt('Describe the incident:') : ''
      };
      
      const res = await fetch(`/api/programs/${programId}/visitations/${visitId}/complete`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        addToast('Visit completed successfully', 'success');
        fetchScheduledVisitations();
      } else {
        addToast('Failed to complete visit', 'error');
      }
    } catch (err) {
      addToast('Failed to complete visit', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Get staff with valid userId for dropdowns
  const staffWithIds = useMemo(() => {
    return staff.filter(s => s.userId).map(s => {
      // Build name from available fields
      let name = '';
      if (s.firstName || s.lastName) {
        name = `${s.firstName || ''} ${s.lastName || ''}`.trim();
      } else if (s.userEmail) {
        // Use email if no name available
        name = s.userEmail.split('@')[0];
      } else {
        name = `Staff ${s.userId}`;
      }
      
      return {
        id: s.userId,
        name: name,
        role: s.roleType || 'STAFF'
      };
    });
  }, [staff]);
  
  // Format time
  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  };
  
  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const tabBtnBase = 'flex items-center px-0 py-4 text-sm transition-all duration-300 border-b-2';
  const tabActive = 'text-primary font-semibold border-primary';
  const tabInactive = 'text-font-medium font-medium border-transparent hover:text-primary';

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="mb-2">
        <div className="flex space-x-8 border-b border-bd bg-transparent">
          <button className={`${tabBtnBase} ${activeTab === 'visits' ? tabActive : tabInactive}`} onClick={() => setActiveTab('visits')}>
            <i className={`fa-solid fa-calendar-check mr-2 ${activeTab === 'visits' ? 'text-primary' : ''}`}></i>
            Scheduled Visits
          </button>
          <button className={`${tabBtnBase} ${activeTab === 'schedule' ? tabActive : tabInactive}`} onClick={() => setActiveTab('schedule')}>
            <i className={`fa-solid fa-calendar-plus mr-2 ${activeTab === 'schedule' ? 'text-primary' : ''}`}></i>
            Schedule Visitation
          </button>
          <button className={`${tabBtnBase} ${activeTab === 'phone' ? tabActive : tabInactive}`} onClick={() => setActiveTab('phone')}>
            <i className={`fa-solid fa-phone mr-2 ${activeTab === 'phone' ? 'text-primary' : ''}`}></i>
            Phone Log Entry
          </button>
          <button className={`${tabBtnBase} ${activeTab === 'archive' ? tabActive : tabInactive}`} onClick={() => setActiveTab('archive')}>
            <i className={`fa-solid fa-archive mr-2 ${activeTab === 'archive' ? 'text-primary' : ''}`}></i>
            Historical Records
          </button>
        </div>
      </div>

      {/* Schedule Visitation */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-calendar-plus text-primary mr-3"></i>
              Schedule Visitation
            </h3>
            <div className="mt-2 text-sm text-font-detail">
              Administrator scheduling interface for youth visitations
            </div>
          </div>
          <form onSubmit={handleScheduleVisitation} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Resident</label>
                    <select 
                      value={visitForm.residentId} 
                      onChange={(e) => setVisitForm({...visitForm, residentId: e.target.value})}
                      required
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="">Select Resident</option>
                      {residents.length === 0 ? (
                        <option disabled>No residents available</option>
                      ) : (
                        residents.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.residentId} - {r.lastName}, {r.firstName}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Visit Type</label>
                    <select 
                      value={visitForm.visitType}
                      onChange={(e) => setVisitForm({...visitForm, visitType: e.target.value})}
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="IN_PERSON">In-Person Visit</option>
                      <option value="VIDEO">Video Visit</option>
                      <option value="PROFESSIONAL">Professional Visit</option>
                      <option value="LEGAL">Legal Visit</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Visitor Name</label>
                  <input 
                    type="text" 
                    value={visitForm.visitorName}
                    onChange={(e) => setVisitForm({...visitForm, visitorName: e.target.value})}
                    required
                    placeholder="Full name" 
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Relationship</label>
                  <input 
                    type="text" 
                    value={visitForm.visitorRelationship}
                    onChange={(e) => setVisitForm({...visitForm, visitorRelationship: e.target.value})}
                    placeholder="e.g., Mother, Father, Lawyer" 
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Visit Date</label>
                    <input 
                      type="date" 
                      value={visitForm.scheduledDate}
                      onChange={(e) => setVisitForm({...visitForm, scheduledDate: e.target.value})}
                      required
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Start Time</label>
                    <input 
                      type="time" 
                      value={visitForm.scheduledStartTime}
                      onChange={(e) => setVisitForm({...visitForm, scheduledStartTime: e.target.value})}
                      required
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">End Time</label>
                  <input 
                    type="time" 
                    value={visitForm.scheduledEndTime}
                    onChange={(e) => setVisitForm({...visitForm, scheduledEndTime: e.target.value})}
                    required
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Special Instructions</label>
                  <textarea 
                    value={visitForm.specialInstructions}
                    onChange={(e) => setVisitForm({...visitForm, specialInstructions: e.target.value})}
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-20" 
                    placeholder="Any special requirements or restrictions..." />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Visitation Room</label>
                  <input 
                    type="text" 
                    value={visitForm.visitationRoom}
                    onChange={(e) => setVisitForm({...visitForm, visitationRoom: e.target.value})}
                    placeholder="Enter visitation room (e.g., Room A, Video Room, etc.)" 
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Supervising Staff (Optional)</label>
                  <select 
                    value={visitForm.supervisingStaffId}
                    onChange={(e) => setVisitForm({...visitForm, supervisingStaffId: e.target.value})}
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Select Staff Member</option>
                    {staffWithIds.length === 0 ? (
                      <option disabled>No staff members with user accounts</option>
                    ) : (
                      staffWithIds.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} - {s.role}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Contact Information</label>
                  <input 
                    type="tel" 
                    value={visitForm.visitorPhone}
                    onChange={(e) => setVisitForm({...visitForm, visitorPhone: e.target.value})}
                    placeholder="Visitor phone number" 
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary mb-2" />
                  <input 
                    type="email" 
                    value={visitForm.visitorEmail}
                    onChange={(e) => setVisitForm({...visitForm, visitorEmail: e.target.value})}
                    placeholder="Visitor email address" 
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div className="bg-primary-lightest p-4 rounded-lg">
                  <h4 className="font-medium text-font-base mb-2">Approval Status</h4>
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="approval" 
                        value="APPROVED"
                        checked={visitForm.approvalStatus === 'APPROVED'}
                        onChange={(e) => setVisitForm({...visitForm, approvalStatus: e.target.value})}
                        className="text-primary focus:ring-primary" />
                      <span className="ml-2 text-sm text-success">Approved</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="approval" 
                        value="PENDING"
                        checked={visitForm.approvalStatus === 'PENDING'}
                        onChange={(e) => setVisitForm({...visitForm, approvalStatus: e.target.value})}
                        className="text-primary focus:ring-primary" />
                      <span className="ml-2 text-sm text-warning">Pending Review</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="approval" 
                        value="DENIED"
                        checked={visitForm.approvalStatus === 'DENIED'}
                        onChange={(e) => setVisitForm({...visitForm, approvalStatus: e.target.value})}
                        className="text-primary focus:ring-primary" />
                      <span className="ml-2 text-sm text-error">Denied</span>
                    </label>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-light font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  <i className="fa-solid fa-calendar-check mr-2"></i>
                  {loading ? 'Scheduling...' : 'Schedule Visitation'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Scheduled Visits */}
      {activeTab === 'visits' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-calendar-check text-primary mr-3"></i>
                  Scheduled Visits
                </h3>
                <div className="mt-2 text-sm text-font-detail">All upcoming and today's visitations</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-font-detail">
                  Total: {scheduledVisitations.length} visits
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            {scheduledVisitations.length === 0 ? (
              <div className="text-center py-12">
                <i className="fa-solid fa-calendar-xmark text-6xl text-gray-300 mb-4"></i>
                <p className="text-font-detail">No scheduled visits at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledVisitations.map((visit: any) => {
                  const isToday = new Date(visit.scheduledDate).toDateString() === new Date().toDateString();
                  const visitDate = new Date(visit.scheduledDate);
                  const startTime = formatTime(visit.scheduledStartTime);
                  const endTime = formatTime(visit.scheduledEndTime);
                  
                  // Determine status color
                  let statusColor = 'bg-primary-lightest border-primary/20';
                  let statusTextColor = 'text-primary';
                  let statusBadgeColor = 'bg-primary';
                  
                  if (visit.status === 'COMPLETED') {
                    statusColor = 'bg-success-lightest border-success/20';
                    statusTextColor = 'text-success';
                    statusBadgeColor = 'bg-success';
                  } else if (visit.status === 'IN_PROGRESS') {
                    statusColor = 'bg-warning-lightest border-warning/20';
                    statusTextColor = 'text-warning';
                    statusBadgeColor = 'bg-warning';
                  } else if (visit.status === 'CANCELLED') {
                    statusColor = 'bg-error-lightest border-error/20';
                    statusTextColor = 'text-error';
                    statusBadgeColor = 'bg-error';
                  }
                  
                  return (
                    <div key={visit.id} className={`border rounded-lg p-5 transition-all hover:shadow-md ${statusColor}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          {/* Header Row */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <i className={`fa-solid fa-clock text-sm ${statusTextColor}`}></i>
                              <span className={`font-semibold ${statusTextColor}`}>
                                {startTime} - {endTime}
                              </span>
                            </div>
                            <span className={`${statusBadgeColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                              {visit.status}
                            </span>
                            {isToday && (
                              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                TODAY
                              </span>
                            )}
                          </div>
                          
                          {/* Content Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {/* Resident Info */}
                            <div>
                              <p className="text-xs text-font-detail uppercase tracking-wider mb-1">Resident</p>
                              <p className="font-medium text-font-base">
                                {visit.residentName || 'Unknown'}
                              </p>
                              <p className="text-sm text-font-detail">
                                {visit.residentNumber || 'No ID'}
                              </p>
                            </div>
                            
                            {/* Visitor Info */}
                            <div>
                              <p className="text-xs text-font-detail uppercase tracking-wider mb-1">Visitor</p>
                              <p className="font-medium text-font-base">
                                {visit.visitorInfo?.[0]?.name || 'Unknown'}
                              </p>
                              <p className="text-sm text-font-detail">
                                {visit.visitorInfo?.[0]?.relationship || 'No relationship'}
                              </p>
                            </div>
                            
                            {/* Visit Details */}
                            <div>
                              <p className="text-xs text-font-detail uppercase tracking-wider mb-1">Details</p>
                              <p className="text-sm font-medium text-font-base">
                                <i className="fa-solid fa-video text-xs mr-1 text-font-detail"></i>
                                {visit.visitType?.replace('_', ' ') || 'In-Person'}
                              </p>
                              <p className="text-sm text-font-detail">
                                <i className="fa-solid fa-door-open text-xs mr-1"></i>
                                {visit.visitationRoom || 'No room assigned'}
                              </p>
                            </div>
                            
                            {/* Date & Staff */}
                            <div>
                              <p className="text-xs text-font-detail uppercase tracking-wider mb-1">Schedule</p>
                              <p className="text-sm font-medium text-font-base">
                                {formatDate(visit.scheduledDate)}
                              </p>
                              <p className="text-sm text-font-detail">
                                Staff: {visit.supervisingStaffName || visit.scheduledByStaffName || 'TBD'}
                              </p>
                            </div>
                          </div>
                          
                          {/* Special Instructions */}
                          {visit.specialInstructions && (
                            <div className="mt-3 pt-3 border-t border-bd">
                              <p className="text-xs text-font-detail uppercase tracking-wider mb-1">Special Instructions</p>
                              <p className="text-sm text-font-base">{visit.specialInstructions}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Button */}
                        <div className="ml-4">
                          {isToday && visit.status === 'SCHEDULED' && (
                            <button 
                              onClick={() => handleStartVisit(visit.id)}
                              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark text-sm font-medium transition-colors">
                              <i className="fa-solid fa-play mr-2"></i>
                              Start Visit
                            </button>
                          )}
                          {visit.status === 'IN_PROGRESS' && (
                            <button 
                              onClick={() => handleCompleteVisit(visit.id)}
                              className="bg-success text-white px-4 py-2 rounded-lg hover:bg-success-dark text-sm font-medium transition-colors">
                              <i className="fa-solid fa-check mr-2"></i>
                              Complete Visit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phone Log Entry */}
      {activeTab === 'phone' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-phone text-primary mr-3"></i>
              Phone Call Log Entry
            </h3>
            <div className="mt-2 text-sm text-font-detail">Log completed phone calls for resident contact tracking</div>
          </div>
          <form onSubmit={handleLogPhoneCall} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Resident</label>
                    <select 
                      value={phoneForm.residentId}
                      onChange={(e) => setPhoneForm({...phoneForm, residentId: e.target.value})}
                      required
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="">Select Resident</option>
                      {residents.length === 0 ? (
                        <option disabled>No residents available</option>
                      ) : (
                        residents.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.residentId} - {r.lastName}, {r.firstName}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Call Type</label>
                    <select 
                      value={phoneForm.callType}
                      onChange={(e) => setPhoneForm({...phoneForm, callType: e.target.value})}
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="OUTGOING">Outgoing Call</option>
                      <option value="INCOMING">Incoming Call</option>
                      <option value="LEGAL">Legal Call</option>
                      <option value="EMERGENCY">Emergency Call</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Person Called/Calling</label>
                  <select 
                    value={phoneForm.contactRelationship}
                    onChange={(e) => setPhoneForm({...phoneForm, contactRelationship: e.target.value})}
                    required
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Select relationship...</option>
                    <option value="MOTHER_1">Mother 1</option>
                    <option value="MOTHER_2">Mother 2</option>
                    <option value="FATHER_1">Father 1</option>
                    <option value="FATHER_2">Father 2</option>
                    <option value="STEPMOTHER">Step-Mother</option>
                    <option value="STEPFATHER">Step-Father</option>
                    <option value="SISTER">Sister</option>
                    <option value="BROTHER">Brother</option>
                    <option value="STEPSISTER">Step-Sister</option>
                    <option value="STEPBROTHER">Step-Brother</option>
                    <option value="GRANDMOTHER">Grandmother</option>
                    <option value="GRANDFATHER">Grandfather</option>
                    <option value="AUNT">Aunt</option>
                    <option value="UNCLE">Uncle</option>
                    <option value="COUSIN">Cousin</option>
                    <option value="GUARDIAN">Legal Guardian</option>
                    <option value="FOSTER">Foster Parent</option>
                    <option value="CASEWORKER">Caseworker</option>
                    <option value="SOCIAL_SERVICES">Social Services</option>
                    <option value="PROBATION">Probation Officer</option>
                    <option value="ATTORNEY">Attorney/Legal Representative</option>
                    <option value="THERAPIST">Therapist/Counselor</option>
                    <option value="DOCTOR">Doctor/Medical Provider</option>
                    <option value="SUPPORT_SERVICES">Support Services</option>
                    <option value="OTHER">Other (specify in comments)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Contact Name</label>
                  <input 
                    type="text"
                    value={phoneForm.contactName}
                    onChange={(e) => setPhoneForm({...phoneForm, contactName: e.target.value})}
                    placeholder="Full name of the contact"
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Call Time</label>
                    <input 
                      type="time"
                      value={phoneForm.callTime}
                      onChange={(e) => setPhoneForm({...phoneForm, callTime: e.target.value})}
                      required
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Duration (minutes)</label>
                    <input 
                      type="number"
                      value={phoneForm.durationMinutes}
                      onChange={(e) => setPhoneForm({...phoneForm, durationMinutes: e.target.value})}
                      required
                      min="1"
                      placeholder="15"
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Phone Number</label>
                  <input 
                    type="tel"
                    value={phoneForm.phoneNumber}
                    onChange={(e) => setPhoneForm({...phoneForm, phoneNumber: e.target.value})}
                    placeholder="(555) 123-4567"
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Staff Authorizing Call</label>
                  <select 
                    value={phoneForm.authorizingStaffId}
                    onChange={(e) => setPhoneForm({...phoneForm, authorizingStaffId: e.target.value})}
                    required
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Select Staff Member</option>
                    {staffWithIds.length === 0 ? (
                      <option disabled>No staff members with user accounts</option>
                    ) : (
                      staffWithIds.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} - {s.role}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Staff Monitoring Call</label>
                  <select 
                    value={phoneForm.monitoringStaffId}
                    onChange={(e) => setPhoneForm({...phoneForm, monitoringStaffId: e.target.value})}
                    required
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Select Monitoring Staff</option>
                    {staffWithIds.length === 0 ? (
                      <option disabled>No staff members with user accounts</option>
                    ) : (
                      staffWithIds.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} - {s.role}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Resident Behavior During Call</label>
                  <select 
                    value={phoneForm.behaviorDuringCall}
                    onChange={(e) => setPhoneForm({...phoneForm, behaviorDuringCall: e.target.value})}
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="POSITIVE">Positive - Calm and appropriate</option>
                    <option value="NEUTRAL">Neutral - No significant issues</option>
                    <option value="AGITATED">Agitated - Elevated but manageable</option>
                    <option value="DISTRESSED">Distressed - Emotional response</option>
                    <option value="CONCERNING">Concerning - Required intervention</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Post-Call Behavior</label>
                  <select 
                    value={phoneForm.postCallBehavior}
                    onChange={(e) => setPhoneForm({...phoneForm, postCallBehavior: e.target.value})}
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="IMPROVED">Improved - Positive mood change</option>
                    <option value="NO_CHANGE">No change - Maintained baseline</option>
                    <option value="SLIGHTLY_ELEVATED">Slightly elevated - Minor agitation</option>
                    <option value="SIGNIFICANTLY_IMPACTED">Significantly impacted - Requires monitoring</option>
                    <option value="CRISIS_LEVEL">Crisis level - Immediate intervention needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Additional Comments</label>
                  <textarea 
                    value={phoneForm.additionalComments}
                    onChange={(e) => setPhoneForm({...phoneForm, additionalComments: e.target.value})}
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-20"
                    placeholder="Any additional observations about the call or resident's response..." />
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-light font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  <i className="fa-solid fa-save mr-2"></i>
                  {loading ? 'Logging...' : 'Log Phone Call'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Historical Records */}
      {activeTab === 'archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-archive text-primary mr-3"></i>
              Historical Records Archive
            </h3>
            <div className="mt-2 text-sm text-font-detail">Complete historical records of all visitations and phone calls</div>
          </div>
          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Date Range</label>
                <select 
                  value={recordsFilter.dateRange}
                  onChange={(e) => setRecordsFilter({...recordsFilter, dateRange: e.target.value})}
                  className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                  <option value="all">All time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Record Type</label>
                <select 
                  value={recordsFilter.recordType}
                  onChange={(e) => setRecordsFilter({...recordsFilter, recordType: e.target.value})}
                  className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="all">All Records</option>
                  <option value="visitations">Visitations Only</option>
                  <option value="phone">Phone Calls Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Resident</label>
                <select 
                  value={recordsFilter.residentId}
                  onChange={(e) => setRecordsFilter({...recordsFilter, residentId: e.target.value})}
                  className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">All Residents</option>
                  {residents.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.residentId} - {r.lastName}, {r.firstName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Records Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg-subtle border-b border-bd">
                  <tr>
                    <th className="text-left p-3 font-medium text-font-base">Date/Time</th>
                    <th className="text-left p-3 font-medium text-font-base">Type</th>
                    <th className="text-left p-3 font-medium text-font-base">Resident</th>
                    <th className="text-left p-3 font-medium text-font-base">Contact/Visitor</th>
                    <th className="text-left p-3 font-medium text-font-base">Staff</th>
                    <th className="text-left p-3 font-medium text-font-base">Status</th>
                    <th className="text-center p-3 font-medium text-font-base">Print</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bd">
                  {displayedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-font-detail">
                        No records found for the selected filters
                      </td>
                    </tr>
                  ) : (
                    displayedRecords.map((record: any) => {
                      const isVisitation = record.type === 'visitation';
                      const recordDate = isVisitation ? record.scheduledDate : record.callDateTime;
                      const recordTime = isVisitation 
                        ? `${formatTime(record.scheduledStartTime)} - ${formatTime(record.scheduledEndTime)}`
                        : formatTime(record.callDateTime);
                      const contactInfo = isVisitation 
                        ? `${record.visitorInfo?.[0]?.name || 'N/A'} (${record.visitorInfo?.[0]?.relationship || 'N/A'})`
                        : `${record.contactName || 'N/A'} (${record.contactRelationship?.replace(/_/g, ' ') || 'N/A'})`;
                      const staffInfo = isVisitation
                        ? record.supervisingStaffName || record.scheduledByStaffName
                        : record.authorizingStaffName || record.loggedByStaffName;
                      
                      return (
                        <tr key={`${record.type}-${record.id}`} className="hover:bg-bg-subtle">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{formatDate(recordDate)}</div>
                              <div className="text-xs text-font-detail">{recordTime}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`${isVisitation ? 'bg-primary' : 'bg-success'} text-white px-2 py-1 rounded text-xs`}>
                              {isVisitation ? 'Visitation' : 'Phone Call'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{record.residentName}</div>
                              <div className="text-xs text-font-detail">{record.residentNumber || record.residentId}</div>
                            </div>
                          </td>
                          <td className="p-3">{contactInfo}</td>
                          <td className="p-3">{staffInfo || 'N/A'}</td>
                          <td className="p-3">
                            <span className={`${
                              record.status === 'COMPLETED' ? 'text-success' :
                              record.status === 'CANCELLED' ? 'text-error' :
                              record.status === 'IN_PROGRESS' ? 'text-warning' :
                              'text-primary'
                            } font-medium`}>
                              {record.status || 'N/A'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button 
                              onClick={() => generatePDF(record.residentId, record.residentName)}
                              className="text-primary hover:text-primary-dark transition-colors"
                              title="Print resident visit report">
                              <i className="fa-solid fa-print text-lg"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Load More Button */}
            {displayedRecords.length < totalRecords && (
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => {
                    setRecordsFilter(prev => ({ ...prev, page: prev.page + 1 }));
                    fetchHistoricalRecords(true);
                  }}
                  disabled={loading}
                  className="bg-bd text-font-base px-6 py-2 rounded-lg hover:bg-primary hover:text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  <i className="fa-solid fa-arrow-down mr-2"></i>
                  {loading ? 'Loading...' : 'Load More Records'}
                </button>
              </div>
            )}
            
            {/* Records Count */}
            <div className="mt-4 text-center text-sm text-font-detail">
              Showing {displayedRecords.length} of {totalRecords} records
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
