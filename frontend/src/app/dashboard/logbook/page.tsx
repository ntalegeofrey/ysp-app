'use client';

import { useState, useEffect, useMemo } from 'react';
import ToastContainer from '@/app/components/Toast';
import { useToast } from '@/app/hooks/useToast';
import { abbreviateTitle } from '@/app/utils/titleAbbrev';
import { generateShiftLogReportHTML } from '../pdfReports';

// Position list from titleAbbrev.ts mapping
const POSITION_LIST = [
  { full: 'Juvenile Justice Youth Development Specialist I', abbrev: 'JJYDS-I' },
  { full: 'Juvenile Justice Youth Development Specialist II', abbrev: 'JJYDS-II' },
  { full: 'Juvenile Justice Youth Development Specialist III', abbrev: 'JJYDS-III' },
  { full: 'Master Juvenile Justice Youth Development Specialist', abbrev: 'M-JJYDS' },
  { full: 'Youth Services Group Worker', abbrev: 'YSGW' },
  { full: 'Program Director', abbrev: 'PD' },
  { full: 'Assistant Program Director', abbrev: 'APD' },
  { full: 'Caseworker I', abbrev: 'CW-I' },
  { full: 'Caseworker II', abbrev: 'CW-II' },
  { full: 'Clinical Social Worker I', abbrev: 'CSW-I' },
  { full: 'Clinical Social Worker II', abbrev: 'CSW-II' },
  { full: 'Psychologist', abbrev: 'PSY' },
  { full: 'Registered Nurse', abbrev: 'RN' },
  { full: 'Nurse Practitioner', abbrev: 'NP' },
  { full: 'Teacher', abbrev: 'TCH' },
  { full: 'Special Education Teacher', abbrev: 'SPED-T' },
  { full: 'Administrative Assistant', abbrev: 'AA' },
  { full: 'Medical Director', abbrev: 'MD' },
];

type StaffDirectory = {
  id: string;
  fullName: string;
  email: string;
  jobTitle?: string;
};

type ProgramAssignment = {
  roleType?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  userEmail?: string;
};

type Resident = {
  id: number;
  firstName: string;
  lastName: string;
};

type StaffMember = {
  name: string;
  position: string;
  duties: string;
  status: string;
};

export default function LogbookPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'archive'>('current');
  const { toasts, addToast, removeToast } = useToast();
  
  // Get logged-in user and program
  const [currentUser, setCurrentUser] = useState({ fullName: '', email: '' });
  const [programId, setProgramId] = useState<number | null>(null);
  
  // Data from APIs
  const [staffDirectory, setStaffDirectory] = useState<StaffDirectory[]>([]);
  const [programStaff, setProgramStaff] = useState<ProgramAssignment[]>([]);
  const [residentsList, setResidentsList] = useState<Resident[]>([]);
  
  // Form state
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState('Day (7:00 AM - 3:00 PM)');
  const [unitSupervisor, setUnitSupervisor] = useState('');
  const [selectedStaffName, setSelectedStaffName] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [duties, setDuties] = useState('');
  const [status, setStatus] = useState('Regular');
  const [addedStaff, setAddedStaff] = useState<StaffMember[]>([]);
  
  // Equipment counts state
  const [equipmentCounts, setEquipmentCounts] = useState({
    bigsRoomKeys: 12,
    dutyBelts: 8,
    staffKeys: 8,
    flashlights: 6,
    jHooks: 8,
    pencils: 15
  });
  
  // Shift documentation state
  const [residentComments, setResidentComments] = useState('');
  const [incidentsEvents, setIncidentsEvents] = useState('');
  const [overallStatus, setOverallStatus] = useState('Routine');
  const [followUpRequired, setFollowUpRequired] = useState('No');
  const [shiftSummary, setShiftSummary] = useState('');
  
  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Archive data
  const [archiveLogs, setArchiveLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  
  // Archive filter state
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterShiftType, setFilterShiftType] = useState('All Shifts');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Certification state
  const [certificationComplete, setCertificationComplete] = useState(false);
  const [certEquipmentVerified, setCertEquipmentVerified] = useState(false);
  const [certShiftEventsAccurate, setCertShiftEventsAccurate] = useState(false);
  const [certificationDatetime, setCertificationDatetime] = useState('');
  
  // Create lookup by email
  const staffByEmail = useMemo(
    () => Object.fromEntries(staffDirectory.map((s) => [s.email.toLowerCase(), s])),
    [staffDirectory]
  );
  
  // Get unique program staff
  const uniqueProgramStaff = useMemo(() => {
    const map: Record<string, ProgramAssignment> = {};
    for (const staff of programStaff) {
      const key = (staff.userEmail || '').toLowerCase();
      if (!key) continue;
      if (!map[key]) map[key] = staff;
    }
    return Object.values(map);
  }, [programStaff]);

  // Load user and program data
  useEffect(() => {
    try {
      const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser({
          fullName: user.fullName || user.name || user.email || 'Unknown User',
          email: user.email || ''
        });
      }
      
      const programData = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
      if (programData) {
        const program = JSON.parse(programData);
        setProgramId(program.id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);
  
  // Load staff directory
  useEffect(() => {
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch('/api/users/search?q=', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (!res.ok) return;
        const data: Array<any> = await res.json();
        setStaffDirectory(data.map((u) => ({
          id: typeof u.id === 'string' ? u.id : String(u.id),
          fullName: u.fullName,
          email: u.email,
          jobTitle: u.jobTitle
        })));
      } catch (error) {
        console.error('Error loading staff directory:', error);
      }
    })();
  }, []);
  
  // Load program staff and residents
  useEffect(() => {
    if (!programId) return;
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers = {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        };
        
        const [staffRes, residentsRes] = await Promise.all([
          fetch(`/api/programs/${programId}/assignments`, {
            credentials: 'include',
            headers
          }),
          fetch(`/api/programs/${programId}/residents`, {
            credentials: 'include',
            headers
          })
        ]);
        
        if (staffRes.ok) {
          const data: Array<any> = await staffRes.json();
          setProgramStaff((data || []).map((a) => ({
            roleType: a.roleType,
            title: a.title,
            firstName: a.firstName,
            lastName: a.lastName,
            userEmail: a.userEmail
          })));
        }
        
        if (residentsRes.ok) {
          const data = await residentsRes.json();
          console.log('Loaded residents data:', data);
          // Handle both array and object with content property
          const residents = Array.isArray(data) ? data : (data.content || []);
          setResidentsList(residents);
          console.log('Residents list set to:', residents);
        } else {
          console.error('Failed to load residents:', residentsRes.status, residentsRes.statusText);
        }
      } catch (error) {
        console.error('Error loading program data:', error);
      }
    })();
  }, [programId]);
  
  // Auto-generate resident initials with duplicate handling
  const generateResidentInitials = useMemo(() => {
    console.log('Generating initials for residents:', residentsList);
    if (!residentsList || residentsList.length === 0) {
      console.log('No residents found');
      return '';
    }
    
    const initialsMap: Record<string, number> = {};
    const initials = residentsList.map(resident => {
      const lastName = String(resident.lastName || '');
      const firstName = String(resident.firstName || '');
      const lastInitial = (lastName[0] || '').toUpperCase();
      const firstInitial = (firstName[0] || '').toUpperCase();
      const baseInitials = lastInitial + firstInitial;
      
      // Handle duplicates by adding additional letters
      if (initialsMap[baseInitials]) {
        initialsMap[baseInitials]++;
        const additionalLetter = String(lastName[initialsMap[baseInitials]] || firstName[1] || initialsMap[baseInitials]).toUpperCase();
        return `${baseInitials}${additionalLetter}`;
      } else {
        initialsMap[baseInitials] = 0;
        return baseInitials;
      }
    }).join(', ');
    
    console.log('Generated initials:', initials);
    return initials;
  }, [residentsList]);
  
  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  // Remove file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Add staff member
  const handleAddStaff = () => {
    if (!selectedStaffName || !selectedPosition) {
      addToast('Please select staff name and position', 'warning');
      return;
    }
    
    const newStaff: StaffMember = {
      name: selectedStaffName,
      position: selectedPosition,
      duties: duties || 'N/A',
      status
    };
    
    setAddedStaff(prev => [...prev, newStaff]);
    setSelectedStaffName('');
    setSelectedPosition('');
    setDuties('');
    setStatus('Regular');
    addToast('Staff member added', 'success');
  };
  
  // Remove staff member
  const removeStaffMember = (index: number) => {
    setAddedStaff(prev => prev.filter((_, i) => i !== index));
  };
  
  // Load archive data
  const loadArchiveData = async () => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/programs/${programId}/logbook/shift-logs?page=0&size=50`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setArchiveLogs(data.content || []);
      }
    } catch (error) {
      console.error('Error loading archive logs:', error);
    }
  };
  
  // Load archive on program change
  useEffect(() => {
    if (programId && activeTab === 'archive') {
      loadArchiveData();
    }
  }, [programId, activeTab]);
  
  // Apply filters when archive logs or filter values change
  useEffect(() => {
    let filtered = [...archiveLogs];
    
    // Filter by date range
    if (filterStartDate) {
      filtered = filtered.filter(log => log.shiftDate >= filterStartDate);
    }
    if (filterEndDate) {
      filtered = filtered.filter(log => log.shiftDate <= filterEndDate);
    }
    
    // Filter by shift type
    if (filterShiftType && filterShiftType !== 'All Shifts') {
      filtered = filtered.filter(log => log.shiftType?.includes(filterShiftType));
    }
    
    // Filter by status
    if (filterStatus && filterStatus !== 'All Status') {
      filtered = filtered.filter(log => log.overallStatus === filterStatus);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.unitSupervisor?.toLowerCase().includes(query) ||
        log.shiftSummary?.toLowerCase().includes(query) ||
        log.incidentsEvents?.toLowerCase().includes(query)
      );
    }
    
    setFilteredLogs(filtered);
  }, [archiveLogs, filterStartDate, filterEndDate, filterShiftType, filterStatus, searchQuery]);
  
  // Generate and print PDF
  const handlePrintShiftLog = (log: any) => {
    console.log('Printing shift log with data:', log);
    console.log('Equipment counts:', log.equipmentCounts);
    console.log('Certifications:', {
      certificationComplete: log.certificationComplete,
      certEquipmentVerified: log.certEquipmentVerified,
      certShiftEventsAccurate: log.certShiftEventsAccurate
    });
    const htmlContent = generateShiftLogReportHTML(log);
    const printWindow = window.open('', '', 'height=800,width=800');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };
  
  // View shift log details (opens in new tab for viewing)
  const handleViewShiftLog = (log: any) => {
    console.log('Viewing shift log with data:', log);
    console.log('Equipment counts:', log.equipmentCounts);
    console.log('Certifications:', {
      certificationComplete: log.certificationComplete,
      certEquipmentVerified: log.certEquipmentVerified,
      certShiftEventsAccurate: log.certShiftEventsAccurate
    });
    const htmlContent = generateShiftLogReportHTML(log);
    const viewWindow = window.open('', '_blank');
    if (viewWindow) {
      viewWindow.document.write(htmlContent);
      viewWindow.document.close();
    }
  };
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  // Remove file from selection
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle form submission
  const handleSubmitShiftLog = async () => {
    // Validation
    if (!unitSupervisor) {
      addToast('Please select a unit supervisor', 'warning');
      return;
    }
    
    if (!certificationComplete) {
      addToast('Please certify the report before submitting', 'error');
      return;
    }
    
    if (!certificationDatetime) {
      addToast('Please enter certification date and time', 'warning');
      return;
    }
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      // Prepare payload
      const payload = {
        shiftDate,
        shiftType: shift,
        unitSupervisor,
        residentInitials: generateResidentInitials,
        residentCount: residentsList.length,
        residentComments,
        incidentsEvents,
        overallStatus,
        followUpRequired,
        shiftSummary,
        staffAssignmentsJson: JSON.stringify(addedStaff),
        equipmentCountsJson: JSON.stringify(equipmentCounts),
        certificationComplete,
        certEquipmentVerified,
        certShiftEventsAccurate,
        certificationDatetime,
        reportCompletedBy: currentUser.fullName,
        reportCompletedByEmail: currentUser.email
      };
      
      const res = await fetch(`/api/programs/${programId}/logbook/shift-logs`, {
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
        const createdLog = await res.json();
        
        // Upload files if any were selected
        if (selectedFiles.length > 0) {
          addToast('Uploading attachments...', 'info');
          for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append('file', file);
            
            try {
              const uploadRes = await fetch(`/api/programs/${programId}/logbook/shift-logs/${createdLog.id}/attachments`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: formData
              });
              
              if (!uploadRes.ok) {
                console.error('Failed to upload file:', file.name);
              }
            } catch (uploadError) {
              console.error('Error uploading file:', uploadError);
            }
          }
        }
        
        addToast('Shift log submitted successfully', 'success');
        // Reset form
        setShiftDate(new Date().toISOString().split('T')[0]);
        setShift('Day (7:00 AM - 3:00 PM)');
        setUnitSupervisor('');
        setAddedStaff([]);
        setEquipmentCounts({
          bigsRoomKeys: 12,
          dutyBelts: 8,
          staffKeys: 8,
          flashlights: 6,
          jHooks: 8,
          pencils: 15
        });
        setResidentComments('');
        setIncidentsEvents('');
        setOverallStatus('Routine');
        setFollowUpRequired('No');
        setShiftSummary('');
        setSelectedFiles([]);
        setCertificationComplete(false);
        setCertEquipmentVerified(false);
        setCertShiftEventsAccurate(false);
        setCertificationDatetime('');
        // Reload archive
        loadArchiveData();
      } else {
        const error = await res.json();
        addToast(error.message || 'Failed to submit shift log', 'error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      addToast('Error submitting shift log', 'error');
    }
  };

  const tabBtnBase = 'py-2 px-1 border-b-2 text-sm font-medium';
  const tabActive = 'border-primary text-primary';
  const tabInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div>
        <div className="border-b border-bd">
          <nav className="-mb-px flex space-x-8">
            <button className={`${tabBtnBase} ${activeTab === 'current' ? tabActive : tabInactive}`} onClick={() => setActiveTab('current')}>
              Current Shift Log
            </button>
            <button className={`${tabBtnBase} ${activeTab === 'archive' ? tabActive : tabInactive}`} onClick={() => setActiveTab('archive')}>
              Historical Logs Archive
            </button>
          </nav>
        </div>
      </div>

      {/* Current Shift Log */}
      {activeTab === 'current' && (
        <div className="space-y-8">
          {/* On-Duty Staff Assignment */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-users text-primary mr-3"></i>
                On-Duty Staff Assignment
              </h3>
            </div>
            <div className="p-6" space-y-4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-font-base mb-4">Shift Details</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Date</label>
                        <input 
                          type="date" 
                          value={shiftDate}
                          onChange={(e) => setShiftDate(e.target.value)}
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Shift</label>
                        <select 
                          value={shift}
                          onChange={(e) => setShift(e.target.value)}
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option>Day (7:00 AM - 3:00 PM)</option>
                          <option>Evening (3:00 PM - 11:00 PM)</option>
                          <option>Night (11:00 PM - 7:00 AM)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Unit Supervisor</label>
                      <select 
                        value={unitSupervisor}
                        onChange={(e) => setUnitSupervisor(e.target.value)}
                        className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select Supervisor...</option>
                        {uniqueProgramStaff.map((s, idx) => {
                          const emailKey = (s.userEmail || '').toLowerCase();
                          const fromDirectory = emailKey ? staffByEmail[emailKey] : undefined;
                          const baseName = fromDirectory?.fullName?.trim() || '';
                          const emailFallback = (s.userEmail || '').trim();
                          const name = baseName || emailFallback || 'Staff';
                          const directoryTitle = fromDirectory?.jobTitle?.trim();
                          const rawTitle = directoryTitle || (s.title || '').trim();
                          let label = name;
                          if (rawTitle) {
                            const abbr = abbreviateTitle(rawTitle);
                            const titleDisplay = abbr || rawTitle;
                            label = `${name} (${titleDisplay})`;
                          }
                          return (
                            <option key={s.userEmail || idx} value={label}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                      <p className="text-xs text-font-detail mt-1">Select from program staff</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-font-base mb-4">Add Staff Member</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Staff Member</label>
                      <select 
                        value={selectedStaffName}
                        onChange={(e) => setSelectedStaffName(e.target.value)}
                        className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select Staff...</option>
                        {uniqueProgramStaff.map((s, idx) => {
                          const emailKey = (s.userEmail || '').toLowerCase();
                          const fromDirectory = emailKey ? staffByEmail[emailKey] : undefined;
                          const baseName = fromDirectory?.fullName?.trim() || '';
                          const emailFallback = (s.userEmail || '').trim();
                          const name = baseName || emailFallback || 'Staff';
                          const directoryTitle = fromDirectory?.jobTitle?.trim();
                          const rawTitle = directoryTitle || (s.title || '').trim();
                          let label = name;
                          if (rawTitle) {
                            const abbr = abbreviateTitle(rawTitle);
                            const titleDisplay = abbr || rawTitle;
                            label = `${name} (${titleDisplay})`;
                          }
                          return (
                            <option key={s.userEmail || idx} value={label}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                      <p className="text-xs text-font-detail mt-1">Select from program staff</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Position</label>
                      <select 
                        value={selectedPosition}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                        className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select Position...</option>
                        {POSITION_LIST.map(pos => (
                          <option key={pos.abbrev} value={pos.abbrev}>
                            {pos.full}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-font-detail mt-1">Select position from list</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Duties</label>
                      <input 
                        type="text" 
                        value={duties}
                        onChange={(e) => setDuties(e.target.value)}
                        placeholder="e.g., Unit Supervision, Security Rounds" 
                        className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Status</label>
                        <select 
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option>Regular</option>
                          <option>Overtime</option>
                          <option>Force</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button 
                          type="button"
                          onClick={handleAddStaff}
                          className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light flex items-center justify-center"
                        >
                          <i className="fa-solid fa-plus mr-2"></i>
                          Add Staff
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Gap between form and staff cards */}
              <div className="mt-6 space-y-4">
                {addedStaff.length === 0 ? (
                  <div className="bg-bg-subtle rounded-lg p-6 text-center border border-bd">
                    <i className="fa-solid fa-users text-3xl text-font-detail mb-2"></i>
                    <p className="text-sm text-font-detail">No staff members added yet</p>
                  </div>
                ) : (
                  addedStaff.map((s, index) => {
                    const tagClass = 
                      s.status === 'Overtime' ? 'bg-warning' :
                      s.status === 'Force' ? 'bg-error' :
                      'bg-primary-alt';
                    
                    return (
                      <div key={index} className="bg-bg-subtle rounded-lg p-4 border border-bd">
                        <div className="grid grid-cols-5 gap-4">
                          <div><span className="text-sm font-medium text-font-base">{s.name}</span></div>
                          <div><span className="text-sm text-font-detail">{s.position}</span></div>
                          <div><span className="text-sm text-font-detail">{s.duties}</span></div>
                          <div><span className={`${tagClass} text-white px-2 py-1 rounded text-xs`}>{s.status}</span></div>
                          <div className="text-right">
                            <button 
                              type="button"
                              onClick={() => removeStaffMember(index)}
                              className="text-error hover:text-error-lighter"
                            >
                              <i className="fa-solid fa-trash text-sm"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Shift Information & Equipment Count */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-info-circle text-primary mr-3"></i>
                Shift Information & Equipment Count
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-font-base mb-4">Equipment Count</h4>
                  <p className="text-sm text-font-detail mb-4">Verify and document all equipment counts for this shift</p>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">BIGs (Room Keys)</label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="number" 
                          value={equipmentCounts.bigsRoomKeys}
                          onChange={(e) => setEquipmentCounts({...equipmentCounts, bigsRoomKeys: parseInt(e.target.value) || 0})}
                          className="flex-1 border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                        />
                        <span className="bg-success text-white px-2 py-1 rounded text-xs">✓</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Duty Belts</label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="number" 
                          value={equipmentCounts.dutyBelts}
                          onChange={(e) => setEquipmentCounts({...equipmentCounts, dutyBelts: parseInt(e.target.value) || 0})}
                          className="flex-1 border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                        />
                        <span className="bg-success text-white px-2 py-1 rounded text-xs">✓</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Staff Keys</label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="number" 
                          value={equipmentCounts.staffKeys}
                          onChange={(e) => setEquipmentCounts({...equipmentCounts, staffKeys: parseInt(e.target.value) || 0})}
                          className="flex-1 border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                        />
                        <span className="bg-success text-white px-2 py-1 rounded text-xs">✓</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Flashlights</label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="number" 
                          value={equipmentCounts.flashlights}
                          onChange={(e) => setEquipmentCounts({...equipmentCounts, flashlights: parseInt(e.target.value) || 0})}
                          className="flex-1 border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                        />
                        <span className="bg-warning text-white px-2 py-1 rounded text-xs">!</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">J-Hooks</label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="number" 
                          value={equipmentCounts.jHooks}
                          onChange={(e) => setEquipmentCounts({...equipmentCounts, jHooks: parseInt(e.target.value) || 0})}
                          className="flex-1 border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                        />
                        <span className="bg-success text-white px-2 py-1 rounded text-xs">✓</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Pencils</label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="number" 
                          value={equipmentCounts.pencils}
                          onChange={(e) => setEquipmentCounts({...equipmentCounts, pencils: parseInt(e.target.value) || 0})}
                          className="flex-1 border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                        />
                        <span className="bg-success text-white px-2 py-1 rounded text-xs">✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Events & Shift Documentation */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-key text-primary mr-3"></i>
                Key Events & Shift Documentation
              </h3>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="font-medium text-font-base mb-4">Residents on Unit Summary</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Resident Initials</label>
                    <input 
                      type="text" 
                      value={generateResidentInitials}
                      placeholder={residentsList.length === 0 ? 'No residents in program' : 'Auto-generated'}
                      readOnly
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm bg-gray-100 text-font-detail cursor-not-allowed" 
                      title="Auto-generated from residents on unit"
                    />
                    <p className="text-xs text-font-detail mt-1">
                      {residentsList.length === 0 
                        ? 'Add residents to the program to see initials' 
                        : `Auto-generated from ${residentsList.length} program residents`}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Total Count</label>
                    <input 
                      type="number" 
                      value={residentsList.length}
                      readOnly
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm bg-gray-100 text-font-detail cursor-not-allowed" 
                      title="Auto-counted from residents list"
                    />
                  </div>
                </div>
                <textarea 
                  value={residentComments}
                  onChange={(e) => setResidentComments(e.target.value)}
                  className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-24 focus:ring-2 focus:ring-primary focus:border-primary" 
                  placeholder="General comments about residents' behavior, mood, or notable observations during this shift..."
                ></textarea>
              </div>
              <div>
                <h4 className="font-medium text-font-base mb-4">Incidents & Events</h4>
                <textarea 
                  value={incidentsEvents}
                  onChange={(e) => setIncidentsEvents(e.target.value)}
                  className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-32 focus:ring-2 focus:ring-primary focus:border-primary" 
                  placeholder="Document any incidents, behavioral issues, medical concerns, maintenance problems, or significant events that occurred during this shift..."
                ></textarea>
              </div>
              <div>
                <h4 className="font-medium text-font-base mb-4">Scanned Log Book Pages</h4>
                <div className="border-2 border-dashed border-bd rounded-lg p-8 text-center">
                  <i className="fa-solid fa-cloud-upload-alt text-4xl text-primary-lighter mb-4"></i>
                  <p className="text-font-detail mb-2">Drop scanned log book pages here or click to upload</p>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*,.pdf" 
                    className="hidden" 
                    id="scan-upload"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="scan-upload" className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-light transition-colors">
                    Choose Files
                  </label>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-font-base">Selected Files:</p>
                    {selectedFiles.map((file, index) => {
                      const fileSize = (file.size / 1024).toFixed(2);
                      const isImage = file.type.startsWith('image/');
                      const isPDF = file.type === 'application/pdf';
                      
                      return (
                        <div key={index} className="flex items-center justify-between bg-bg-subtle p-3 rounded-lg border border-bd">
                          <div className="flex items-center gap-3">
                            <i className={`fa-solid ${isImage ? 'fa-image text-primary' : isPDF ? 'fa-file-pdf text-error' : 'fa-file text-font-detail'} text-xl`}></i>
                            <div>
                              <p className="text-sm font-medium text-font-base">{file.name}</p>
                              <p className="text-xs text-font-detail">{fileSize} KB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-error hover:text-error-lighter"
                            title="Remove file"
                          >
                            <i className="fa-solid fa-times-circle text-lg"></i>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-font-base mb-4">Shift Summary</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Overall Status</label>
                      <select 
                        value={overallStatus}
                        onChange={(e) => setOverallStatus(e.target.value)}
                        className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option>Routine</option>
                        <option>Warning</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Follow-up Required</label>
                      <select 
                        value={followUpRequired}
                        onChange={(e) => setFollowUpRequired(e.target.value)}
                        className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option>No</option>
                        <option>Yes - Next Shift</option>
                        <option>Yes - Supervisor</option>
                        <option>Yes - Medical</option>
                        <option>Yes - Administration</option>
                      </select>
                    </div>
                  </div>
                  <textarea 
                    value={shiftSummary}
                    onChange={(e) => setShiftSummary(e.target.value)}
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-32 focus:ring-2 focus:ring-primary focus:border-primary" 
                    placeholder="Provide a concise summary of the shift, including key accomplishments, challenges, and any immediate follow-up actions needed..."
                  ></textarea>
                </div>
              </div>
              
              {/* Certification & Signature Section */}
              <div>
                <h4 className="text-lg font-semibold text-font-base mb-4">Certification & Signature</h4>
                <div className="border border-bd rounded-lg p-6 bg-bg-subtle">
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={certificationComplete} 
                        onChange={(e) => setCertificationComplete(e.target.checked)} 
                        className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" 
                      />
                      <span>I certify that all information in this shift log is accurate and complete to the best of my knowledge.</span>
                    </label>
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={certEquipmentVerified} 
                        onChange={(e) => setCertEquipmentVerified(e.target.checked)} 
                        className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" 
                      />
                      <span>I confirm all equipment counts have been verified and documented correctly.</span>
                    </label>
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={certShiftEventsAccurate} 
                        onChange={(e) => setCertShiftEventsAccurate(e.target.checked)} 
                        className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" 
                      />
                      <span>I attest that this log reflects all actual shift events and resident interactions.</span>
                    </label>
                    <div className="pt-4 border-t border-bd">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-2">Report Completed By</label>
                          <input 
                            type="text" 
                            value={currentUser.fullName} 
                            readOnly 
                            className="w-full border border-bd rounded-lg px-3 py-2 text-sm bg-gray-100 text-font-detail cursor-not-allowed" 
                            title="Auto-filled from logged-in user"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-2">Certification Date & Time</label>
                          <input 
                            type="datetime-local" 
                            value={certificationDatetime} 
                            onChange={(e) => setCertificationDatetime(e.target.value)} 
                            className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={handleSubmitShiftLog}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light font-medium"
                >
                  Submit Shift Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Historical Logs Archive */}
      {activeTab === 'archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-archive text-primary mr-3"></i>
              Historical Shift Logs Archive
              <span className="ml-3 text-sm font-normal text-font-detail">
                ({filteredLogs.length} {filteredLogs.length === 1 ? 'log' : 'logs'})
              </span>
            </h3>
          </div>
          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-font-detail"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by supervisor, summary, or incidents..."
                  className="w-full border border-bd rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">From Date</label>
                <input 
                  type="date" 
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">To Date</label>
                <input 
                  type="date" 
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Shift Type</label>
                <select 
                  value={filterShiftType}
                  onChange={(e) => setFilterShiftType(e.target.value)}
                  className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option>All Shifts</option>
                  <option>Day</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Status</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option>All Status</option>
                  <option>Routine</option>
                  <option>Warning</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
            
            {/* Clear Filters Button */}
            {(filterStartDate || filterEndDate || filterShiftType !== 'All Shifts' || filterStatus !== 'All Status' || searchQuery) && (
              <div className="mb-4 flex justify-end">
                <button
                  onClick={() => {
                    setFilterStartDate('');
                    setFilterEndDate('');
                    setFilterShiftType('All Shifts');
                    setFilterStatus('All Status');
                    setSearchQuery('');
                  }}
                  className="text-sm text-primary hover:text-primary-light flex items-center gap-2"
                >
                  <i className="fa-solid fa-times-circle"></i>
                  Clear All Filters
                </button>
              </div>
            )}
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-bd bg-bg-subtle">
                    <th className="text-left py-3 px-4 font-medium text-font-base">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-font-base">Shift</th>
                    <th className="text-left py-3 px-4 font-medium text-font-base">Supervisor</th>
                    <th className="text-left py-3 px-4 font-medium text-font-base">Summary</th>
                    <th className="text-left py-3 px-4 font-medium text-font-base">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-font-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <i className="fa-solid fa-inbox text-4xl text-font-detail mb-3"></i>
                        <p className="text-font-detail">No shift logs found</p>
                        <p className="text-sm text-font-detail mt-1">
                          {archiveLogs.length === 0 ? 'Submit a shift log to see it here' : 'Try adjusting your filters'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const statusColors = {
                        'Routine': 'bg-success',
                        'Warning': 'bg-warning',
                        'High': 'bg-warning',
                        'Critical': 'bg-error'
                      };
                      const statusColor = statusColors[log.overallStatus as keyof typeof statusColors] || 'bg-primary-alt';
                      
                      return (
                        <tr key={log.id} className="border-b border-bd hover:bg-bg-subtle transition-colors">
                          <td className="py-3 px-4 text-sm text-font-base">
                            {new Date(log.shiftDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="py-3 px-4 text-sm text-font-detail">
                            {log.shiftType?.split('(')[0]?.trim() || 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-sm text-font-detail max-w-xs truncate" title={log.unitSupervisor}>
                            {log.unitSupervisor || 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-sm text-font-detail max-w-md truncate" title={log.shiftSummary}>
                            {log.shiftSummary || 'No summary'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`${statusColor} text-white px-2 py-1 rounded text-xs font-medium`}>
                              {log.overallStatus || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button 
                              onClick={() => handlePrintShiftLog(log)}
                              className="text-primary hover:text-primary-light transition-colors"
                              title="Print/Download PDF"
                            >
                              <i className="fa-solid fa-print"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Refresh Button */}
            {archiveLogs.length > 0 && (
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={loadArchiveData}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light font-medium flex items-center gap-2"
                >
                  <i className="fa-solid fa-sync-alt"></i>
                  Refresh Logs
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
