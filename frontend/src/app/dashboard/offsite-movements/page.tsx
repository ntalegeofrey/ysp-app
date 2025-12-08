'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/app/hooks/useToast';
import ToastContainer from '@/app/components/Toast';

export default function OffsiteMovementsPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'archive'>('overview');
  const [showOtherMovementType, setShowOtherMovementType] = useState(false);
  const [programId, setProgramId] = useState<number | null>(null);
  const [currentStaff, setCurrentStaff] = useState('');
  const [residents, setResidents] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Archive filters
  const [archiveSearchFilter, setArchiveSearchFilter] = useState('');
  const [archiveDateFilter, setArchiveDateFilter] = useState('');
  const [archiveTypeFilter, setArchiveTypeFilter] = useState('');
  const [archiveStatusFilter, setArchiveStatusFilter] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    residentId: '',
    movementType: '',
    otherMovementType: '',
    movementDate: '',
    movementTime: '',
    destination: '',
    destinationAddress: '',
    destinationContact: '',
    estimatedDuration: '2 Hours',
    priorityLevel: 'ROUTINE',
    requiresRestraints: false,
    wheelchairAccessible: false,
    medicalEquipmentNeeded: false,
    behavioralPrecautions: false,
    movementNotes: '',
    primaryStaffId: '',
    secondaryStaffId: ''
  });

  // Load user and program data
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        // Use multiple fallbacks like medication form
        const staffName = user.fullName || fullName || user.name || user.email || 'Unknown User';
        console.log('[Movements] Loading user:', { firstName, lastName, fullName, staffName });
        setCurrentStaff(staffName);
      }
    } catch (err) {
      console.error('[Movements] Failed to parse user:', err);
    }
    
    const selectedProgram = localStorage.getItem('selectedProgram');
    if (selectedProgram) {
      try {
        const program = JSON.parse(selectedProgram);
        setProgramId(program.id || program.programId);
      } catch (err) {
        console.error('[Movements] Failed to parse program:', err);
      }
    }
  }, []);
  
  // Fetch residents when tab opens
  useEffect(() => {
    if (programId && activeTab === 'schedule') {
      fetchResidents();
      fetchStaff();
    }
  }, [programId, activeTab]);
  
  const fetchResidents = async () => {
    if (!programId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${programId}/residents`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      if (res.ok) {
        const data = await res.json();
        setResidents(data);
      }
    } catch (err) {
      console.error('Failed to fetch residents:', err);
    }
  };
  
  const fetchStaff = async () => {
    if (!programId) return;
    try {
      const token = localStorage.getItem('token');
      // Use assignments endpoint to get staff members
      const res = await fetch(`/api/programs/${programId}/assignments`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      if (res.ok) {
        const data = await res.json();
        // Extract unique staff members from assignments
        const uniqueStaff = data.reduce((acc: any[], assignment: any) => {
          if (assignment.user && !acc.find(s => s.id === assignment.user.id)) {
            acc.push(assignment.user);
          }
          return acc;
        }, []);
        console.log('[Movements] Staff loaded:', uniqueStaff.length);
        setStaff(uniqueStaff);
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err);
      addToast('Failed to load staff members', 'error');
    }
  };
  
  const handleSubmit = async () => {
    if (!programId) {
      addToast('Program not selected', 'error');
      return;
    }
    
    if (!formData.residentId || !formData.movementType || !formData.movementDate || !formData.movementTime || !formData.destination) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    
    if (!formData.primaryStaffId || !formData.secondaryStaffId) {
      addToast('Both primary and secondary staff must be assigned', 'error');
      return;
    }
    
    if (formData.primaryStaffId === formData.secondaryStaffId) {
      addToast('Primary and secondary staff must be different', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        residentId: parseInt(formData.residentId),
        movementType: formData.movementType === 'Other' ? formData.otherMovementType : formData.movementType,
        movementDate: formData.movementDate,
        movementTime: formData.movementTime + ':00',
        destination: formData.destination,
        destinationAddress: formData.destinationAddress,
        destinationContact: formData.destinationContact,
        estimatedDuration: formData.estimatedDuration,
        priorityLevel: formData.priorityLevel,
        requiresRestraints: formData.requiresRestraints,
        wheelchairAccessible: formData.wheelchairAccessible,
        medicalEquipmentNeeded: formData.medicalEquipmentNeeded,
        behavioralPrecautions: formData.behavioralPrecautions,
        movementNotes: formData.movementNotes,
        staffAssignments: [
          { staffId: parseInt(formData.primaryStaffId), assignmentRole: 'PRIMARY' },
          { staffId: parseInt(formData.secondaryStaffId), assignmentRole: 'SECONDARY' }
        ]
      };
      
      const res = await fetch(`/api/programs/${programId}/movements`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        addToast('Movement scheduled successfully', 'success');
        // Reset form
        setFormData({
          residentId: '',
          movementType: '',
          otherMovementType: '',
          movementDate: '',
          movementTime: '',
          destination: '',
          destinationAddress: '',
          destinationContact: '',
          estimatedDuration: '2 Hours',
          priorityLevel: 'ROUTINE',
          requiresRestraints: false,
          wheelchairAccessible: false,
          medicalEquipmentNeeded: false,
          behavioralPrecautions: false,
          movementNotes: '',
          primaryStaffId: '',
          secondaryStaffId: ''
        });
        setShowOtherMovementType(false);
        setActiveTab('overview');
      } else {
        const error = await res.json();
        addToast(error.message || 'Failed to schedule movement', 'error');
      }
    } catch (err) {
      console.error('Failed to schedule movement:', err);
      addToast('Failed to schedule movement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabBtnBase = 'flex items-center px-1 py-3 text-sm font-medium border-b-2 transition-colors';
  const tabBtnInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';
  const tabBtnActive = 'border-primary text-primary';

  const handleAssign = () => addToast('Staff assignment workflow coming soon', 'info');
  const handleContact = () => addToast('Contact team action coming soon', 'info');
  const handleAutoAssign = () => {
    if (staff && staff.length >= 2 && staff[0]?.id && staff[1]?.id) {
      setFormData(prev => ({
        ...prev,
        primaryStaffId: staff[0].id.toString(),
        secondaryStaffId: staff[1].id.toString()
      }));
      addToast('Staff auto-assigned', 'success');
    } else {
      addToast('Not enough staff available', 'error');
    }
  };

  const movementTypes = [
    'Medical Appointment',
    'Hospital Emergency',
    'Psychological Evaluation',
    'Court Appearance',
    'Probation Meeting',
    'DYS Case Conference',
    'Family Visit (Approved)',
    'Education Program Off-Site',
    'Community Service',
    'Religious Activity',
    'Reintegration Program',
    'Youth Placement Move',
    'Inter-Facility Transfer',
    'Other'
  ];

  // Mock archive data
  const archiveData = [
    {
      id: 1,
      date: '2024-12-07',
      time: '8:00 AM',
      resident: 'Resident A01',
      type: 'Medical Appointment',
      destination: 'Taunton Family Health Center',
      staff: 'Officer Johnson, Officer Lee',
      status: 'Completed',
      duration: '2.5 hours',
      notes: 'Routine checkup completed successfully'
    },
    {
      id: 2,
      date: '2024-12-06',
      time: '10:00 AM',
      resident: 'Resident B01',
      type: 'Court Appearance',
      destination: 'Taunton District Court',
      staff: 'Officer Martinez, Officer Chen',
      status: 'Completed',
      duration: '4 hours',
      notes: 'Court hearing concluded, next date scheduled'
    },
    {
      id: 3,
      date: '2024-12-05',
      time: '1:30 PM',
      resident: 'Resident C02',
      type: 'Hospital Emergency',
      destination: 'Springfield General Hospital',
      staff: 'Officer Johnson, Officer Davis',
      status: 'Completed',
      duration: '6 hours',
      notes: 'Emergency treated, youth returned safely'
    },
    {
      id: 4,
      date: '2024-12-04',
      time: '9:00 AM',
      resident: 'Resident A02',
      type: 'Probation Meeting',
      destination: 'Bristol County Probation Office',
      staff: 'Officer Lee, Officer Martinez',
      status: 'Completed',
      duration: '1.5 hours',
      notes: 'Monthly check-in completed'
    },
    {
      id: 5,
      date: '2024-12-03',
      time: '2:00 PM',
      resident: 'Resident B03',
      type: 'Psychological Evaluation',
      destination: 'Youth Services Mental Health Center',
      staff: 'Officer Chen, Officer Davis',
      status: 'Cancelled',
      duration: '-',
      notes: 'Cancelled due to staff availability - rescheduled'
    }
  ];

  // Filter archive data
  const filteredArchiveData = archiveData.filter(record => {
    const matchesSearch = !archiveSearchFilter ||
      record.resident.toLowerCase().includes(archiveSearchFilter.toLowerCase()) ||
      record.destination.toLowerCase().includes(archiveSearchFilter.toLowerCase()) ||
      record.staff.toLowerCase().includes(archiveSearchFilter.toLowerCase());
    
    const matchesDate = !archiveDateFilter || record.date === archiveDateFilter;
    const matchesType = !archiveTypeFilter || record.type === archiveTypeFilter;
    const matchesStatus = !archiveStatusFilter || record.status === archiveStatusFilter;
    
    return matchesSearch && matchesDate && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div>
        <nav className="flex space-x-8 border-b border-bd">
          <button
            className={`${tabBtnBase} ${activeTab === 'overview' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className={`fa-solid fa-calendar-days mr-2 ${activeTab === 'overview' ? 'text-primary' : 'text-font-detail'}`}></i>
            Scheduled Off-Site Movements
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'schedule' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('schedule')}
          >
            <i className={`fa-solid fa-calendar-plus mr-2 ${activeTab === 'schedule' ? 'text-primary' : 'text-font-detail'}`}></i>
            Schedule Off-Site Movement
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'archive' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('archive')}
          >
            <i className={`fa-solid fa-box-archive mr-2 ${activeTab === 'archive' ? 'text-primary' : 'text-font-detail'}`}></i>
            Movement Archive
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-clock text-error mr-3"></i>
                Upcoming & Urgent Off-Site Movements
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Scheduled movements requiring immediate attention and staff assignment
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-lightest mb-4">
                  <i className="fa-solid fa-clipboard-check text-4xl text-success opacity-50"></i>
                </div>
                <h4 className="text-xl font-semibold text-font-base mb-2">No Urgent Movements</h4>
                <p className="text-font-detail mb-4">
                  All urgent and emergency off-site movements have been completed or assigned.
                </p>
                <button 
                  onClick={() => setActiveTab('schedule')}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  <i className="fa-solid fa-calendar-plus mr-2"></i>
                  Schedule New Movement
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-calendar-day text-primary mr-3"></i>
                Scheduled Off-Site Movement Schedules
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                All scheduled off-site movements with staff assignments
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-lightest mb-4">
                  <i className="fa-solid fa-calendar-xmark text-4xl text-primary opacity-50"></i>
                </div>
                <h4 className="text-xl font-semibold text-font-base mb-2">No Scheduled Movements</h4>
                <p className="text-font-detail mb-4">
                  There are currently no off-site movements scheduled. Create a new movement to get started.
                </p>
                <button 
                  onClick={() => setActiveTab('schedule')}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  <i className="fa-solid fa-calendar-plus mr-2"></i>
                  Schedule Off-Site Movement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-calendar-plus text-primary mr-3"></i>
                Schedule New Off-Site Movement
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Create and coordinate secure transportation for youth off-site movements
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-font-base mb-4">Movement Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Scheduled By <span className="text-font-detail">(Auto-filled)</span></label>
                        <input 
                          type="text" 
                          value={currentStaff || 'Loading...'}
                          disabled
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm bg-bg-subtle text-font-detail cursor-not-allowed"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Resident <span className="text-error">*</span></label>
                        <select 
                          value={formData.residentId}
                          onChange={(e) => setFormData(prev => ({ ...prev, residentId: e.target.value }))}
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                          <option value="">Select Resident</option>
                          {residents.map((r) => (
                            <option key={r.id} value={r.id}>{r.firstName} {r.lastName} ({r.residentId})</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Off-Site Movement Type <span className="text-error">*</span></label>
                        <select 
                          value={formData.movementType}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, movementType: e.target.value }));
                            setShowOtherMovementType(e.target.value === 'Other');
                          }}
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="">Select Movement Type</option>
                          {movementTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      
                      {showOtherMovementType && (
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-2">Specify Movement Type <span className="text-error">*</span></label>
                          <input 
                            type="text" 
                            value={formData.otherMovementType}
                            onChange={(e) => setFormData(prev => ({ ...prev, otherMovementType: e.target.value }))}
                            placeholder="Describe the type of movement..." 
                            className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-2">Date <span className="text-error">*</span></label>
                          <input 
                            type="date" 
                            value={formData.movementDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, movementDate: e.target.value }))}
                            className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-2">Time <span className="text-error">*</span></label>
                          <input 
                            type="time" 
                            value={formData.movementTime}
                            onChange={(e) => setFormData(prev => ({ ...prev, movementTime: e.target.value }))}
                            className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Destination <span className="text-error">*</span></label>
                        <input 
                          type="text" 
                          value={formData.destination}
                          onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                          placeholder="e.g., Taunton District Court" 
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Destination Contact</label>
                        <input 
                          type="text" 
                          value={formData.destinationContact}
                          onChange={(e) => setFormData(prev => ({ ...prev, destinationContact: e.target.value }))}
                          placeholder="e.g., Dr. Sarah Wilson, Officer Thomas, Judge Morrison" 
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Destination Address</label>
                        <textarea 
                          value={formData.destinationAddress}
                          onChange={(e) => setFormData(prev => ({ ...prev, destinationAddress: e.target.value }))}
                          placeholder="Full address of destination..." 
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-font-base mb-4">Transport Coordination</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Estimated Duration</label>
                        <select 
                          value={formData.estimatedDuration}
                          onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option>1 Hour</option>
                          <option>1.5 Hours</option>
                          <option>2 Hours</option>
                          <option>3 Hours</option>
                          <option>Half Day (4+ Hours)</option>
                          <option>Full Day</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Priority Level</label>
                        <select 
                          value={formData.priorityLevel}
                          onChange={(e) => setFormData(prev => ({ ...prev, priorityLevel: e.target.value }))}
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="ROUTINE">Routine</option>
                          <option value="URGENT">Urgent</option>
                          <option value="EMERGENCY">Emergency</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Security Requirements</label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={formData.requiresRestraints}
                              onChange={(e) => setFormData(prev => ({ ...prev, requiresRestraints: e.target.checked }))}
                              className="rounded border-bd text-primary focus:ring-primary" 
                            />
                            <span className="ml-2 text-sm">Restraints Required</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={formData.wheelchairAccessible}
                              onChange={(e) => setFormData(prev => ({ ...prev, wheelchairAccessible: e.target.checked }))}
                              className="rounded border-bd text-primary focus:ring-primary" 
                            />
                            <span className="ml-2 text-sm">Wheelchair Accessible</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={formData.medicalEquipmentNeeded}
                              onChange={(e) => setFormData(prev => ({ ...prev, medicalEquipmentNeeded: e.target.checked }))}
                              className="rounded border-bd text-primary focus:ring-primary" 
                            />
                            <span className="ml-2 text-sm">Medical Equipment Needed</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={formData.behavioralPrecautions}
                              onChange={(e) => setFormData(prev => ({ ...prev, behavioralPrecautions: e.target.checked }))}
                              className="rounded border-bd text-primary focus:ring-primary" 
                            />
                            <span className="ml-2 text-sm">Behavioral Precautions</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Additional Notes</label>
                        <textarea 
                          value={formData.movementNotes}
                          onChange={(e) => setFormData(prev => ({ ...prev, movementNotes: e.target.value }))}
                          placeholder="Special instructions, security concerns, behavioral notes..." 
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-24"
                        />
                      </div>
                      <div className="bg-primary-lightest p-4 rounded-lg border border-primary/20">
                        <div className="flex items-center mb-3">
                          <i className="fa-solid fa-shield-halved text-primary mr-2"></i>
                          <span className="font-medium text-primary">Staff Assignment <span className="text-error">*</span></span>
                        </div>
                        <p className="text-xs text-font-detail mb-3">Two staff members required for all off-site movements</p>
                        <div className="space-y-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-font-base mb-1">Primary Staff</label>
                            <select 
                              value={formData.primaryStaffId}
                              onChange={(e) => setFormData(prev => ({ ...prev, primaryStaffId: e.target.value }))}
                              className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                            >
                              <option value="">Select Primary Staff</option>
                              {staff && staff.length > 0 ? staff.map((s) => (
                                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                              )) : null}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-font-base mb-1">Secondary Staff</label>
                            <select 
                              value={formData.secondaryStaffId}
                              onChange={(e) => setFormData(prev => ({ ...prev, secondaryStaffId: e.target.value }))}
                              className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                            >
                              <option value="">Select Secondary Staff</option>
                              {staff && staff.length > 0 ? staff.filter(s => s?.id && s.id.toString() !== formData.primaryStaffId).map((s) => (
                                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                              )) : null}
                            </select>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={handleAutoAssign} 
                          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors"
                        >
                          Auto-Assign Available Staff
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full bg-success text-white py-3 rounded-lg hover:bg-success/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-calendar-check mr-2"></i>
                        Schedule Movement
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-box-archive text-primary mr-3"></i>
                Off-Site Movement Archive
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Historical records of all completed and cancelled off-site movements
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Search by resident, destination, or staff..."
                value={archiveSearchFilter}
                onChange={(e) => setArchiveSearchFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <input
                type="date"
                value={archiveDateFilter}
                onChange={(e) => setArchiveDateFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <select
                value={archiveTypeFilter}
                onChange={(e) => setArchiveTypeFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Movement Types</option>
                {movementTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={archiveStatusFilter}
                onChange={(e) => setArchiveStatusFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-subtle border-b border-bd">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Time</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Resident</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Movement Type</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Destination</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Staff</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Duration</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredArchiveData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-16">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-lightest mb-4">
                          <i className="fa-solid fa-box-archive text-4xl text-primary opacity-50"></i>
                        </div>
                        <h4 className="text-xl font-semibold text-font-base mb-2">No Movement Records Found</h4>
                        <p className="text-font-detail">
                          {archiveSearchFilter || archiveDateFilter || archiveTypeFilter || archiveStatusFilter
                            ? 'No movements match your current filters. Try adjusting your search criteria.'
                            : 'No historical movement records available yet.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredArchiveData.map((record) => (
                    <tr key={record.id} className="border-b border-bd hover:bg-bg-subtle">
                      <td className="px-4 py-3 text-font-base">
                        {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-font-detail">{record.time}</td>
                      <td className="px-4 py-3 text-font-base font-medium">{record.resident}</td>
                      <td className="px-4 py-3 text-font-detail">{record.type}</td>
                      <td className="px-4 py-3 text-font-detail">{record.destination}</td>
                      <td className="px-4 py-3 text-font-detail text-xs">{record.staff}</td>
                      <td className="px-4 py-3 text-font-detail">{record.duration}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          record.status === 'Completed'
                            ? 'bg-success/10 text-success'
                            : record.status === 'Cancelled'
                            ? 'bg-error/10 text-error'
                            : 'bg-info/10 text-info'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-font-detail text-xs max-w-xs truncate" title={record.notes}>
                        {record.notes || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
