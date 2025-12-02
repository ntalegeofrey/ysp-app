'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function VisitationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'schedule' | 'visits' | 'phone' | 'archive'>('visits');
  const [programId, setProgramId] = useState<string | null>(null);
  
  // Data state
  const [residents, setResidents] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [todaysVisitations, setTodaysVisitations] = useState<any[]>([]);
  const [phoneLogs, setPhoneLogs] = useState<any[]>([]);
  const [historicalRecords, setHistoricalRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
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
  
  // Fetch today's visitations
  const fetchTodaysVisitations = async () => {
    if (!programId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${programId}/visitations/today`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTodaysVisitations(data);
      }
    } catch (err) {
      console.error('Failed to fetch visitations:', err);
    }
  };
  
  // Fetch historical records
  const fetchHistoricalRecords = async () => {
    if (!programId) return;
    try {
      const token = localStorage.getItem('token');
      const [visitationsRes, phoneLogsRes] = await Promise.all([
        fetch(`/api/programs/${programId}/visitations?page=0&size=20`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        }),
        fetch(`/api/programs/${programId}/phone-logs?page=0&size=20`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        })
      ]);
      
      const visitations = visitationsRes.ok ? (await visitationsRes.json()).visitations || [] : [];
      const phoneLogs = phoneLogsRes.ok ? (await phoneLogsRes.json()).phoneLogs || [] : [];
      
      // Combine and sort by date
      const combined = [
        ...visitations.map((v: any) => ({ ...v, type: 'visitation' })),
        ...phoneLogs.map((p: any) => ({ ...p, type: 'phone' }))
      ].sort((a, b) => new Date(b.createdAt || b.callDateTime).getTime() - new Date(a.createdAt || a.callDateTime).getTime());
      
      setHistoricalRecords(combined);
    } catch (err) {
      console.error('Failed to fetch historical records:', err);
    }
  };
  
  // Load data when programId changes or tab changes
  useEffect(() => {
    if (programId) {
      fetchResidents();
      fetchStaff();
      if (activeTab === 'todays') fetchTodaysVisitations();
      if (activeTab === 'archive') fetchHistoricalRecords();
    }
  }, [programId, activeTab]);
  
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
        // Switch to today's tab
        setActiveTab('todays');
        fetchTodaysVisitations();
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

      {/* Today's Schedule */}
      {activeTab === 'todays' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-calendar-day text-primary mr-3"></i>
              Today's Scheduled Visitations
            </h3>
            <div className="mt-2 text-sm text-font-detail">All approved visitations scheduled for today's shift</div>
          </div>
          <div className="p-6 space-y-4">
            <div className="border border-bd rounded-lg p-4 bg-success-lightest">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center"><span className="font-semibold text-success">10:00 AM - 11:30 AM</span><span className="bg-success text-white px-2 py-1 rounded text-xs ml-3">Completed</span></div>
                <button className="text-primary hover:text-primary-light"><i className="fa-solid fa-edit mr-1"></i>Log Visit</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-font-base">Resident C01 - Brown, Anthony</h4>
                  <p className="text-sm text-font-detail">Father - Robert Brown</p>
                  <p className="text-xs text-font-detail">Relationship: Parent</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-font-base">Assignment</h5>
                  <p className="text-sm text-font-detail">Staff: L. Davis</p>
                  <p className="text-xs text-font-detail">Room: Visitation A</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-font-base">Status</h5>
                  <p className="text-xs text-font-detail">Visit completed successfully</p>
                </div>
              </div>
            </div>

            <div className="border border-bd rounded-lg p-4 bg-primary-lightest">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center"><span className="font-semibold text-primary">2:00 PM - 3:30 PM</span><span className="bg-primary text-white px-2 py-1 rounded text-xs ml-3">Scheduled</span></div>
                <button className="text-primary hover:text-primary-light"><i className="fa-solid fa-eye mr-1"></i>View Details</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-font-base">Resident A01 - Johnson, Michael</h4>
                  <p className="text-sm text-font-detail">Mother & Sister</p>
                  <p className="text-xs text-font-detail">Sarah Johnson, Emily Johnson</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-font-base">Assignment</h5>
                  <p className="text-sm text-font-detail">Staff: R. Martinez</p>
                  <p className="text-xs text-font-detail">Room: Visitation B</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-font-base">Special Notes</h5>
                  <p className="text-xs text-font-detail">Birthday visit - cake pre-approved</p>
                </div>
              </div>
            </div>

            <div className="border border-bd rounded-lg p-4 bg-warning-lightest">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center"><span className="font-semibold text-warning">4:00 PM - 5:30 PM</span><span className="bg-warning text-white px-2 py-1 rounded text-xs ml-3">Pending Staff</span></div>
                <button className="text-primary hover:text-primary-light"><i className="fa-solid fa-user-plus mr-1"></i>Assign Staff</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-font-base">Resident B01 - Williams, David</h4>
                  <p className="text-sm text-font-detail">Grandmother - Maria Williams</p>
                  <p className="text-xs text-font-detail">Relationship: Grandparent</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-font-base">Assignment</h5>
                  <p className="text-sm text-error">No staff assigned</p>
                  <p className="text-xs text-font-detail">Room: Visitation A</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-font-base">Action Required</h5>
                  <p className="text-xs text-font-detail">Assign supervising staff member</p>
                </div>
              </div>
            </div>
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
            <div className="mt-2 text-sm text-font-detail">Complete historical records of all visitations and phone calls with advanced filtering</div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Date Range</label>
                <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Custom range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Record Type</label>
                <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                  <option>All Records</option>
                  <option>Visitations Only</option>
                  <option>Phone Calls Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Resident</label>
                <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                  <option>All Residents</option>
                  <option>Resident A01 - Johnson</option>
                  <option>Resident A02 - Rodriguez</option>
                  <option>Resident B01 - Williams</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-light font-medium">
                  <i className="fa-solid fa-search mr-2"></i>
                  Filter Records
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg-subtle border-b border-bd">
                  <tr>
                    <th className="text-left p-3 font-medium text-font-base">Date/Time</th>
                    <th className="text-left p-3 font-medium text-font-base">Type</th>
                    <th className="text-left p-3 font-medium text-font-base">Resident</th>
                    <th className="text-left p-3 font-medium text-font-base">Contact</th>
                    <th className="text-left p-3 font-medium text-font-base">Staff</th>
                    <th className="text-left p-3 font-medium text-font-base">Status</th>
                    <th className="text-left p-3 font-medium text-font-base">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bd">
                  <tr className="hover:bg-bg-subtle">
                    <td className="p-3">Nov 15, 2024 10:00 AM</td>
                    <td className="p-3"><span className="bg-primary text-white px-2 py-1 rounded text-xs">Visitation</span></td>
                    <td className="p-3">C01 - Brown, Anthony</td>
                    <td className="p-3">Father - Robert Brown</td>
                    <td className="p-3">L. Davis</td>
                    <td className="p-3"><span className="text-success">Completed</span></td>
                    <td className="p-3"><button className="text-primary hover:text-primary-light mr-2"><i className="fa-solid fa-eye"></i></button><button className="text-primary hover:text-primary-light"><i className="fa-solid fa-download"></i></button></td>
                  </tr>
                  <tr className="hover:bg-bg-subtle">
                    <td className="p-3">Nov 14, 2024 3:15 PM</td>
                    <td className="p-3"><span className="bg-success text-white px-2 py-1 rounded text-xs">Phone Call</span></td>
                    <td className="p-3">A01 - Johnson, Michael</td>
                    <td className="p-3">Mother - Sarah Johnson</td>
                    <td className="p-3">R. Martinez</td>
                    <td className="p-3"><span className="text-success">Completed</span></td>
                    <td className="p-3"><button className="text-primary hover:text-primary-light mr-2"><i className="fa-solid fa-eye"></i></button><button className="text-primary hover:text-primary-light"><i className="fa-solid fa-download"></i></button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-center">
              <button className="bg-bd text-font-base px-6 py-2 rounded-lg hover:bg-primary hover:text-white font-medium">Load More Records</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
