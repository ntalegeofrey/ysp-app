'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ToastMessage {
  id: number;
  title: string;
  tone: 'success' | 'error' | 'info' | 'warning';
}

export default function IncidentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'incident-report' | 'shakedown-report' | 'incident-archive'>('incident-report');
  
  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (title: string, tone: 'success' | 'error' | 'info' | 'warning') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, tone }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };
  
  // Get logged-in user information and program ID
  const [currentUser, setCurrentUser] = useState({ fullName: '', email: '' });
  const [programId, setProgramId] = useState<number | null>(null);
  
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
  
  // Incident Report Form State
  const [incidentReport, setIncidentReport] = useState({
    incidentDate: new Date().toISOString().split('T')[0],
    incidentTime: '',
    shift: 'Day (7:00 AM - 3:00 PM)',
    areaOfIncident: '',
    natureOfIncident: '',
    residentsInvolved: '',
    staffInvolved: '',
    residentWitnesses: '',
    primaryStaffRestraint: '',
    mechanicalsStartTime: '',
    mechanicalsFinishTime: '',
    roomConfinementStartTime: '',
    roomConfinementFinishTime: '',
    staffPopulation: '',
    youthPopulation: '',
    detailedDescription: '',
    certificationComplete: false,
    signatureDatetime: ''
  });
  
  // Shakedown Report Form State
  const [shakedownReport, setShakedownReport] = useState({
    shakedownDate: new Date().toISOString().split('T')[0],
    shift: 'Day (7:00 AM - 3:00 PM)',
    announcementTime: '',
    announcementStaff: '',
    announcementAreas: '',
    additionalComments: '',
    certificationComplete: false,
    signatureDatetime: '',
    equipmentCondition: {
      cuffs: 'Good',
      waistbands: 'Good',
      radios: 'Good',
      shackles: 'Good',
      keys: 'Good',
      flashlights: 'Good'
    }
  });
  
  // Archive data from backend
  const [archiveReports, setArchiveReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // Archive pagination state (top-level to respect hooks rules)
  const [archivePage, setArchivePage] = useState(1);
  const archivePageSize = 10;
  
  // Archive filters
  const [archiveFilters, setArchiveFilters] = useState({
    search: '',
    type: 'All Types',
    dateRange: 'Last 30 Days',
    priority: 'All Priorities'
  });
  // Shakedown add-other area state
  const commonAreas = ['Dining Hall','Recreation Room','Common Area','Laundry Room'];
  const [commonAddArea, setCommonAddArea] = useState<string>(commonAreas[0]);
  const [commonAddCustom, setCommonAddCustom] = useState<string>('');
  type ShakedownRow = { area: string; staff: string; found: 'No' | 'Yes'; comments: string };
  const [commonAddedRows, setCommonAddedRows] = useState<ShakedownRow[]>([]);
  const [commonAddStaff, setCommonAddStaff] = useState<string>('');
  const [commonAddFound, setCommonAddFound] = useState<'No'|'Yes'>('No');
  const [commonAddComments, setCommonAddComments] = useState<string>('');
  const schoolAreas = ['Classroom 1','Classroom 2','Gymnasium','STEM Room','Library'];
  const [schoolAddArea, setSchoolAddArea] = useState<string>(schoolAreas[0]);
  const [schoolAddCustom, setSchoolAddCustom] = useState<string>('');
  const [schoolAddedRows, setSchoolAddedRows] = useState<ShakedownRow[]>([]);
  const [schoolAddStaff, setSchoolAddStaff] = useState<string>('');
  const [schoolAddFound, setSchoolAddFound] = useState<'No'|'Yes'>('No');
  const [schoolAddComments, setSchoolAddComments] = useState<string>('');
  // Resident Room Search dynamic rows
  type RoomRow = { unit: string; room: string; staff: string; result: 'No contraband' | 'Contraband found'; comments: string };
  const [addedRoomRows, setAddedRoomRows] = useState<RoomRow[]>([]);
  const [roomAddUnit, setRoomAddUnit] = useState<string>('Unit A');
  const [roomAddUnitCustom, setRoomAddUnitCustom] = useState<string>('');
  const [roomAddRoom, setRoomAddRoom] = useState<string>('');
  const [roomAddStaff, setRoomAddStaff] = useState<string>('');
  const [roomAddResult, setRoomAddResult] = useState<'No contraband' | 'Contraband found'>('No contraband');
  const [roomAddComments, setRoomAddComments] = useState<string>('');
  const addRoomRow = () => {
    const unitName = roomAddUnit === 'Other' ? roomAddUnitCustom.trim() : roomAddUnit;
    if (!unitName || !roomAddRoom.trim()) return;
    setAddedRoomRows((prev) => [
      ...prev,
      { unit: unitName, room: roomAddRoom.trim(), staff: roomAddStaff.trim(), result: roomAddResult, comments: roomAddComments.trim() },
    ]);
    setRoomAddRoom('');
    setRoomAddStaff('');
    setRoomAddComments('');
  };
  
  // Load archive data from backend
  const loadArchiveData = async () => {
    if (!programId) return;
    
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const [incidentsRes, shakedownsRes] = await Promise.all([
        fetch(`/api/programs/${programId}/incidents/incident-reports`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }),
        fetch(`/api/programs/${programId}/incidents/shakedown-reports`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        })
      ]);
      
      if (incidentsRes.ok && shakedownsRes.ok) {
        const incidents = await incidentsRes.json();
        const shakedowns = await shakedownsRes.json();
        
        // Combine and format for archive display
        const combined = [
          ...incidents.map((r: any) => ({
            id: r.id,
            type: 'Incident',
            reportData: r,
            dt: new Date(r.incidentDate).toLocaleDateString(),
            time: r.incidentTime,
            nature: `${r.natureOfIncident} - ${r.areaOfIncident || 'Location not specified'}`,
            priority: r.priority,
            staff: r.reportCompletedBy,
            badge: 'bg-error-lightest text-error',
            pcls: r.priority === 'Critical' ? 'bg-error text-white' : r.priority === 'High' ? 'bg-warning text-white' : r.priority === 'Medium' ? 'bg-warning text-white' : 'bg-success text-white'
          })),
          ...shakedowns.map((r: any) => ({
            id: r.id,
            type: 'Shakedown',
            reportData: r,
            dt: new Date(r.shakedownDate).toLocaleDateString(),
            time: '',
            nature: `Shakedown Report - ${r.contrabandFound ? 'Contraband found' : 'No contraband found'}`,
            priority: r.contrabandFound ? 'High' : 'Low',
            staff: r.reportCompletedBy,
            badge: 'bg-primary-lightest text-primary',
            pcls: r.contrabandFound ? 'bg-warning text-white' : 'bg-success text-white'
          }))
        ];
        
        // Sort by date descending
        combined.sort((a, b) => new Date(b.reportData.createdAt).getTime() - new Date(a.reportData.createdAt).getTime());
        setArchiveReports(combined);
      }
    } catch (error) {
      console.error('Error loading archive data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load archive when tab changes to archive
  useEffect(() => {
    if (activeTab === 'incident-archive' && programId) {
      loadArchiveData();
    }
  }, [activeTab, programId]);
  
  // Submit Incident Report
  const handleSubmitIncidentReport = async () => {
    if (!programId) {
      addToast('Program not selected', 'error');
      return;
    }
    
    if (!incidentReport.incidentDate || !incidentReport.incidentTime) {
      addToast('Please enter incident date and time', 'error');
      return;
    }
    
    if (!incidentReport.natureOfIncident) {
      addToast('Please select nature of incident', 'error');
      return;
    }
    
    if (!incidentReport.detailedDescription) {
      addToast('Please provide a detailed description', 'error');
      return;
    }
    
    if (!incidentReport.certificationComplete) {
      addToast('Please certify the report before submitting', 'error');
      return;
    }
    
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const payload = {
        ...incidentReport,
        reportCompletedBy: currentUser.fullName,
        reportCompletedByEmail: currentUser.email,
        signatureDatetime: incidentReport.signatureDatetime || new Date().toISOString(),
        staffPopulation: incidentReport.staffPopulation ? parseInt(incidentReport.staffPopulation) : null,
        youthPopulation: incidentReport.youthPopulation ? parseInt(incidentReport.youthPopulation) : null,
        mechanicalsStartTime: incidentReport.mechanicalsStartTime || null,
        mechanicalsFinishTime: incidentReport.mechanicalsFinishTime || null,
        roomConfinementStartTime: incidentReport.roomConfinementStartTime || null,
        roomConfinementFinishTime: incidentReport.roomConfinementFinishTime || null
      };
      
      const response = await fetch(`/api/programs/${programId}/incidents/incident-reports`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        addToast('Incident report submitted successfully', 'success');
        // Reset form
        setIncidentReport({
          incidentDate: new Date().toISOString().split('T')[0],
          incidentTime: '',
          shift: 'Day (7:00 AM - 3:00 PM)',
          areaOfIncident: '',
          natureOfIncident: '',
          residentsInvolved: '',
          staffInvolved: '',
          residentWitnesses: '',
          primaryStaffRestraint: '',
          mechanicalsStartTime: '',
          mechanicalsFinishTime: '',
          roomConfinementStartTime: '',
          roomConfinementFinishTime: '',
          staffPopulation: '',
          youthPopulation: '',
          detailedDescription: '',
          certificationComplete: false,
          signatureDatetime: ''
        });
        // Reload archive data
        loadArchiveData();
      } else {
        const errorText = await response.text();
        addToast(errorText || 'Failed to submit incident report', 'error');
      }
    } catch (error) {
      console.error('Error submitting incident report:', error);
      addToast('Failed to submit incident report', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Submit Shakedown Report
  const handleSubmitShakedownReport = async () => {
    if (!programId) {
      addToast('Program not selected', 'error');
      return;
    }
    
    if (!shakedownReport.shakedownDate) {
      addToast('Please enter shakedown date', 'error');
      return;
    }
    
    if (!shakedownReport.certificationComplete) {
      addToast('Please certify the report before submitting', 'error');
      return;
    }
    
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      // Build search arrays
      const commonSearches: any[] = [];
      ['Dining Hall', 'Recreation Room', 'Common Area', 'Laundry Room'].forEach((area) => {
        commonSearches.push({ area, staff: '', contrabandFound: 'No', comments: '' });
      });
      commonAddedRows.forEach((row) => {
        commonSearches.push(row);
      });
      
      const schoolSearches: any[] = [];
      ['Classroom 1', 'Classroom 2', 'Gymnasium', 'STEM Room', 'Library'].forEach((area) => {
        schoolSearches.push({ area, staff: '', contrabandFound: 'No', comments: '' });
      });
      schoolAddedRows.forEach((row) => {
        schoolSearches.push(row);
      });
      
      const payload = {
        ...shakedownReport,
        reportCompletedBy: currentUser.fullName,
        reportCompletedByEmail: currentUser.email,
        signatureDatetime: shakedownReport.signatureDatetime || new Date().toISOString(),
        commonAreaSearches: JSON.stringify(commonSearches),
        schoolAreaSearches: JSON.stringify(schoolSearches),
        residentRoomSearches: JSON.stringify(addedRoomRows),
        equipmentCondition: JSON.stringify(shakedownReport.equipmentCondition),
        announcementTime: shakedownReport.announcementTime || null,
        contrabandFound: addedRoomRows.some(r => r.result === 'Contraband found') || commonAddedRows.some(r => r.found === 'Yes') || schoolAddedRows.some(r => r.found === 'Yes')
      };
      
      const response = await fetch(`/api/programs/${programId}/incidents/shakedown-reports`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        addToast('Shakedown report submitted successfully', 'success');
        // Reset form
        setShakedownReport({
          shakedownDate: new Date().toISOString().split('T')[0],
          shift: 'Day (7:00 AM - 3:00 PM)',
          announcementTime: '',
          announcementStaff: '',
          announcementAreas: '',
          additionalComments: '',
          certificationComplete: false,
          signatureDatetime: '',
          equipmentCondition: {
            cuffs: 'Good',
            waistbands: 'Good',
            radios: 'Good',
            shackles: 'Good',
            keys: 'Good',
            flashlights: 'Good'
          }
        });
        setCommonAddedRows([]);
        setSchoolAddedRows([]);
        setAddedRoomRows([]);
        // Reload archive data
        loadArchiveData();
      } else {
        const errorText = await response.text();
        addToast(errorText || 'Failed to submit shakedown report', 'error');
      }
    } catch (error) {
      console.error('Error submitting shakedown report:', error);
      addToast('Failed to submit shakedown report', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Print Report Function
  const printReport = (report: any) => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        addToast('Please allow popups to print report', 'error');
        return;
      }
      
      const isIncident = report.type === 'Incident';
      const data = report.reportData;
      
      let html = '';
      
      if (isIncident) {
        html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Incident Report - ${data.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #333; padding-bottom: 20px; }
    .header h1 { font-size: 24px; margin-bottom: 5px; }
    .header p { color: #666; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 16px; font-weight: bold; background: #f5f5f5; padding: 10px; margin-bottom: 15px; border-left: 4px solid #333; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
    .info-item { padding: 10px; border: 1px solid #ddd; }
    .info-label { font-weight: bold; font-size: 12px; color: #666; margin-bottom: 5px; }
    .info-value { font-size: 14px; color: #333; }
    .full-width { grid-column: 1 / -1; }
    .priority-critical { background: #fee; color: #c00; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .priority-high { background: #fff3cd; color: #856404; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .priority-medium { background: #d1ecf1; color: #0c5460; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .priority-low { background: #d4edda; color: #155724; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .signature-box { border: 2px solid #333; padding: 20px; margin-top: 30px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>INCIDENT REPORT</h1>
    <p>Report ID: ${data.id} | ${data.programName}</p>
    <p>Generated: ${new Date().toLocaleString()}</p>
  </div>
  
  <div class="section">
    <div class="section-title">Incident Details</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Date of Incident</div>
        <div class="info-value">${new Date(data.incidentDate).toLocaleDateString()}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Time of Incident</div>
        <div class="info-value">${data.incidentTime}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Shift</div>
        <div class="info-value">${data.shift || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Priority Level</div>
        <div class="info-value"><span class="priority-${data.priority.toLowerCase()}">${data.priority}</span></div>
      </div>
      <div class="info-item full-width">
        <div class="info-label">Area of Incident</div>
        <div class="info-value">${data.areaOfIncident || 'Not specified'}</div>
      </div>
      <div class="info-item full-width">
        <div class="info-label">Nature of Incident</div>
        <div class="info-value" style="font-weight: bold;">${data.natureOfIncident}</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">People Involved</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Residents Involved</div>
        <div class="info-value">${data.residentsInvolved || 'None listed'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Staff Involved</div>
        <div class="info-value">${data.staffInvolved || 'None listed'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Resident Witnesses</div>
        <div class="info-value">${data.residentWitnesses || 'None listed'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Primary Staff (Restraint)</div>
        <div class="info-value">${data.primaryStaffRestraint || 'N/A'}</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Population & Timing</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Staff Population on Shift</div>
        <div class="info-value">${data.staffPopulation || 'Not recorded'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Youth Population on Shift</div>
        <div class="info-value">${data.youthPopulation || 'Not recorded'}</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Detailed Description</div>
    <div class="info-item full-width">
      <div class="info-value" style="white-space: pre-wrap;">${data.detailedDescription}</div>
    </div>
  </div>
  
  <div class="signature-box">
    <div class="section-title">Certification & Signature</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Report Completed By</div>
        <div class="info-value">${data.reportCompletedBy}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${data.reportCompletedByEmail || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Signature Date & Time</div>
        <div class="info-value">${new Date(data.signatureDatetime).toLocaleString()}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Status</div>
        <div class="info-value">${data.status}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
      } else {
        // Shakedown report
        html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Shakedown Report - ${data.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #333; padding-bottom: 20px; }
    .header h1 { font-size: 24px; margin-bottom: 5px; }
    .header p { color: #666; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 16px; font-weight: bold; background: #f5f5f5; padding: 10px; margin-bottom: 15px; border-left: 4px solid #333; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
    .info-item { padding: 10px; border: 1px solid #ddd; }
    .info-label { font-weight: bold; font-size: 12px; color: #666; margin-bottom: 5px; }
    .info-value { font-size: 14px; color: #333; }
    .full-width { grid-column: 1 / -1; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    table th, table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    table th { background: #f5f5f5; font-weight: bold; }
    .signature-box { border: 2px solid #333; padding: 20px; margin-top: 30px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>SHAKEDOWN REPORT</h1>
    <p>Report ID: ${data.id} | ${data.programName}</p>
    <p>Generated: ${new Date().toLocaleString()}</p>
  </div>
  
  <div class="section">
    <div class="section-title">Report Details</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Shakedown Date</div>
        <div class="info-value">${new Date(data.shakedownDate).toLocaleDateString()}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Shift</div>
        <div class="info-value">${data.shift || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Contraband Found</div>
        <div class="info-value" style="font-weight: bold; color: ${data.contrabandFound ? '#c00' : '#060'};">${data.contrabandFound ? 'YES' : 'NO'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Status</div>
        <div class="info-value">${data.status}</div>
      </div>
    </div>
  </div>
  
  ${data.commonAreaSearches ? `
  <div class="section">
    <div class="section-title">Common Area Searches</div>
    <table>
      <thead>
        <tr>
          <th>Area</th>
          <th>Staff Searching</th>
          <th>Contraband Found</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        ${JSON.parse(data.commonAreaSearches).map((s: any) => `
          <tr>
            <td>${s.area}</td>
            <td>${s.staff || 'N/A'}</td>
            <td>${s.contrabandFound}</td>
            <td>${s.comments || ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}
  
  ${data.schoolAreaSearches ? `
  <div class="section">
    <div class="section-title">School Area Searches</div>
    <table>
      <thead>
        <tr>
          <th>Area</th>
          <th>Staff Searching</th>
          <th>Contraband Found</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        ${JSON.parse(data.schoolAreaSearches).map((s: any) => `
          <tr>
            <td>${s.area}</td>
            <td>${s.staff || 'N/A'}</td>
            <td>${s.contrabandFound}</td>
            <td>${s.comments || ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}
  
  ${data.residentRoomSearches ? `
  <div class="section">
    <div class="section-title">Resident Room Searches</div>
    <table>
      <thead>
        <tr>
          <th>Unit</th>
          <th>Room</th>
          <th>Staff</th>
          <th>Result</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        ${JSON.parse(data.residentRoomSearches).map((s: any) => `
          <tr>
            <td>${s.unit}</td>
            <td>${s.room}</td>
            <td>${s.staff || 'N/A'}</td>
            <td>${s.result}</td>
            <td>${s.comments || ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}
  
  ${data.additionalComments ? `
  <div class="section">
    <div class="section-title">Additional Comments</div>
    <div class="info-item full-width">
      <div class="info-value" style="white-space: pre-wrap;">${data.additionalComments}</div>
    </div>
  </div>
  ` : ''}
  
  <div class="signature-box">
    <div class="section-title">Certification & Signature</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Report Completed By</div>
        <div class="info-value">${data.reportCompletedBy}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${data.reportCompletedByEmail || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Signature Date & Time</div>
        <div class="info-value">${new Date(data.signatureDatetime).toLocaleString()}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Status</div>
        <div class="info-value">${data.status}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
      }
      
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
  
  // Demo archive rows (replace with data source later)
  const allRowsArchive = archiveReports.length > 0 ? archiveReports : [
    { dt: 'Oct 28, 2024', time: '2:30 PM', type: 'Incident', badge: 'bg-error-lightest text-error', nature: 'Youth on Youth Assault - Recreation Room', priority: 'Critical', pcls: 'bg-error text-white', staff: 'J. Smith' },
    { dt: 'Oct 28, 2024', time: '1:15 PM', type: 'Shakedown', badge: 'bg-primary-lightest text-primary', nature: 'Routine Unit Search - No contraband found', priority: 'Low', pcls: 'bg-success text-white', staff: 'M. Johnson' },
    { dt: 'Oct 27, 2024', time: '11:45 AM', type: 'Incident', badge: 'bg-error-lightest text-error', nature: 'Contraband Found - Room A2', priority: 'High', pcls: 'bg-warning text-white', staff: 'K. Williams' },
    { dt: 'Oct 26, 2024', time: '9:30 AM', type: 'Shakedown', badge: 'bg-primary-lightest text-primary', nature: 'Routine Unit Search - No contraband found', priority: 'Low', pcls: 'bg-success text-white', staff: 'L. Davis' },
    { dt: 'Oct 25, 2024', time: '10:15 AM', type: 'Incident', badge: 'bg-error-lightest text-error', nature: 'Youth on Staff Assault - Unit A', priority: 'Critical', pcls: 'bg-error text-white', staff: 'R. Brown' },
    { dt: 'Oct 24, 2024', time: '4:05 PM', type: 'Incident', badge: 'bg-error-lightest text-error', nature: 'Damage to Property - Unit B', priority: 'High', pcls: 'bg-warning text-white', staff: 'D. Clark' },
    { dt: 'Oct 23, 2024', time: '7:50 PM', type: 'Shakedown', badge: 'bg-primary-lightest text-primary', nature: 'Random Search - Minor contraband', priority: 'Medium', pcls: 'bg-warning text-white', staff: 'S. Green' },
    { dt: 'Oct 22, 2024', time: '3:35 PM', type: 'Incident', badge: 'bg-error-lightest text-error', nature: 'Room Confinement - Unit C', priority: 'Low', pcls: 'bg-success text-white', staff: 'K. Lee' },
    { dt: 'Oct 21, 2024', time: '9:10 AM', type: 'Incident', badge: 'bg-error-lightest text-error', nature: 'Medication Error - Medical Unit', priority: 'Critical', pcls: 'bg-error text-white', staff: 'A. Parker' },
    { dt: 'Oct 20, 2024', time: '11:55 AM', type: 'Shakedown', badge: 'bg-primary-lightest text-primary', nature: 'School Area Search - No issues', priority: 'Low', pcls: 'bg-success text-white', staff: 'B. Foster' },
    { dt: 'Oct 19, 2024', time: '6:40 PM', type: 'Incident', badge: 'bg-error-lightest text-error', nature: 'Fire Alarm - False alarm', priority: 'Medium', pcls: 'bg-warning text-white', staff: 'M. Turner' },
  ];
  
  // Apply filters to archive
  const filteredArchive = allRowsArchive.filter(row => {
    // Search filter
    if (archiveFilters.search && !row.nature.toLowerCase().includes(archiveFilters.search.toLowerCase()) && 
        !row.staff.toLowerCase().includes(archiveFilters.search.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (archiveFilters.type !== 'All Types') {
      const typeMatch = archiveFilters.type === 'Incident Report' ? 'Incident' : 'Shakedown';
      if (row.type !== typeMatch) return false;
    }
    
    // Priority filter
    if (archiveFilters.priority !== 'All Priorities' && row.priority !== archiveFilters.priority) {
      return false;
    }
    
    // Date range filter
    if (archiveFilters.dateRange !== 'Last 30 Days' && row.reportData) {
      const reportDate = new Date(row.reportData.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (archiveFilters.dateRange === 'Last 7 Days' && daysDiff > 7) return false;
      if (archiveFilters.dateRange === 'Last 90 Days' && daysDiff > 90) return false;
    }
    
    return true;
  });
  
  const archiveTotalPages = Math.ceil(filteredArchive.length / archivePageSize);
  const archiveStart = (archivePage - 1) * archivePageSize;
  const archivePagedRows = filteredArchive.slice(archiveStart, archiveStart + archivePageSize);

  const TabButton = ({ id, icon, label }: { id: 'incident-report' | 'shakedown-report' | 'incident-archive'; icon: string; label: string }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`tab-button px-4 py-4 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap -mb-[1px] ${
          isActive ? 'text-primary border-primary' : 'text-font-detail border-transparent hover:text-primary'
        }`}
      >
        <i className={`fa-solid ${icon} mr-2`}></i>
        {label}
      </button>
    );
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Section Navigator */}
      <div id="section-navigator" className="bg-transparent border-b border-bd px-0 sm:px-2 py-0">
        <div className="flex items-center space-x-4 sm:space-x-8 overflow-x-auto">
          <TabButton id="incident-report" icon="fa-file-alt" label="Incident Report" />
          <TabButton id="shakedown-report" icon="fa-search" label="Shakedown Report" />
          <TabButton id="incident-archive" icon="fa-archive" label="Incident Archive" />
        </div>
      </div>
      {/* Removed extra divider to ensure active tab border aligns with the grey line */}

      <main id="incident-main" className="flex-1 pt-6 overflow-auto">
        {/* Incident Report Section */}
        {activeTab === 'incident-report' && (
          <div id="incident-report-content" className="tab-content">
            <div id="incident-report" className="bg-white rounded-lg border border-bd mb-8">
              <div className="p-6 border-b border-bd">
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-file-alt text-primary mr-3"></i>
                  Incident Report Form
                </h3>
              </div>
              <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Date of Incident</label>
                    <input type="date" value={incidentReport.incidentDate} onChange={(e) => setIncidentReport({...incidentReport, incidentDate: e.target.value})} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Time of Incident</label>
                    <input type="time" value={incidentReport.incidentTime} onChange={(e) => setIncidentReport({...incidentReport, incidentTime: e.target.value})} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Shift</label>
                    <select value={incidentReport.shift} onChange={(e) => setIncidentReport({...incidentReport, shift: e.target.value})} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>Day (7:00 AM - 3:00 PM)</option>
                      <option>Evening (3:00 PM - 11:00 PM)</option>
                      <option>Night (11:00 PM - 7:00 AM)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Area of Incident</label>
                    <select value={incidentReport.areaOfIncident} onChange={(e) => setIncidentReport({...incidentReport, areaOfIncident: e.target.value})} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>Common Area</option>
                      <option>Dining Hall</option>
                      <option>Recreation Room</option>
                      <option>Gymnasium</option>
                      <option>Classroom 1</option>
                      <option>Classroom 2</option>
                      <option>STEM Room</option>
                      <option>Library</option>
                      <option>Medical Unit</option>
                      <option>Unit A</option>
                      <option>Unit B</option>
                      <option>Unit C</option>
                      <option>Unit D</option>
                      <option>Outdoor Area</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Nature of Incident</label>
                    <select value={incidentReport.natureOfIncident} onChange={(e) => setIncidentReport({...incidentReport, natureOfIncident: e.target.value})} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>Restraint</option>
                      <option>Youth on Youth Assault</option>
                      <option>Youth on Staff Assault</option>
                      <option>Staff on Youth Assault</option>
                      <option>Escape Attempted</option>
                      <option>Escape</option>
                      <option>Damage to Property</option>
                      <option>Weapon found/contraband</option>
                      <option>Drugs found (contraband)</option>
                      <option>Other Contraband found</option>
                      <option>Missing Keys</option>
                      <option>Missing Tools</option>
                      <option>Fire Alarm/other alarm</option>
                      <option>Room Confinement</option>
                      <option>Suicidal ideation</option>
                      <option>Suicidal Behavior</option>
                      <option>Suicide Attempt</option>
                      <option>Suicide</option>
                      <option>Self-Injurious Activity</option>
                      <option>Medication Error</option>
                      <option>Maintenance/Mechanical issue</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Residents Involved</label>
                    <textarea value={incidentReport.residentsInvolved} onChange={(e) => setIncidentReport({...incidentReport, residentsInvolved: e.target.value})} placeholder="List resident names or IDs involved in the incident" className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-20 focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Staff Involved</label>
                    <textarea value={incidentReport.staffInvolved} onChange={(e) => setIncidentReport({...incidentReport, staffInvolved: e.target.value})} placeholder="List staff members involved in the incident" className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-20 focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Resident Witnesses</label>
                    <textarea value={incidentReport.residentWitnesses} onChange={(e) => setIncidentReport({...incidentReport, residentWitnesses: e.target.value})} placeholder="List residents who witnessed the incident" className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-20 focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Primary Staff Applying Restraint</label>
                    <input type="text" value={incidentReport.primaryStaffRestraint} onChange={(e) => setIncidentReport({...incidentReport, primaryStaffRestraint: e.target.value})} placeholder="Name of primary staff member" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-font-base mb-4">Duration of Mechanicals Applied</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Start Time</label>
                        <input type="time" value={incidentReport.mechanicalsStartTime} onChange={(e) => setIncidentReport({...incidentReport, mechanicalsStartTime: e.target.value})} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Finish Time</label>
                        <input type="time" value={incidentReport.mechanicalsFinishTime} onChange={(e) => setIncidentReport({...incidentReport, mechanicalsFinishTime: e.target.value})} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-font-base mb-4">Room Confinement</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Start Time</label>
                        <input type="time" value={incidentReport.roomConfinementStartTime} onChange={(e) => setIncidentReport({...incidentReport, roomConfinementStartTime: e.target.value})} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Finish Time</label>
                        <input type="time" value={incidentReport.roomConfinementFinishTime} onChange={(e) => setIncidentReport({...incidentReport, roomConfinementFinishTime: e.target.value})} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Population of Staff on Shift</label>
                    <input type="number" value={incidentReport.staffPopulation} onChange={(e) => setIncidentReport({...incidentReport, staffPopulation: e.target.value})} placeholder="Number of staff on duty" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Population of Youth on Shift</label>
                    <input type="number" value={incidentReport.youthPopulation} onChange={(e) => setIncidentReport({...incidentReport, youthPopulation: e.target.value})} placeholder="Number of youth on unit" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Detailed Description of Incident</label>
                  <textarea value={incidentReport.detailedDescription} onChange={(e) => setIncidentReport({...incidentReport, detailedDescription: e.target.value})} placeholder="Provide a comprehensive description of the incident, including events leading up to it, actions taken, and outcome" className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-32 focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                </div>

                {/* Certification & Signature Section */}
                <div>
                  <h4 className="text-lg font-semibold text-font-base mb-4">Certification & Signature</h4>
                  <div className="border border-bd rounded-lg p-6 bg-bg-subtle">
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 text-sm">
                        <input type="checkbox" checked={incidentReport.certificationComplete} onChange={(e) => setIncidentReport({...incidentReport, certificationComplete: e.target.checked})} className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" />
                        <span>I certify that the information provided in this incident report is accurate and complete to the best of my knowledge.</span>
                      </label>
                      <label className="flex items-start gap-3 text-sm">
                        <input type="checkbox" className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" disabled />
                        <span>I confirm that all required notifications have been made and proper protocols were followed.</span>
                      </label>
                      <label className="flex items-start gap-3 text-sm">
                        <input type="checkbox" className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" disabled />
                        <span>I understand that this report will be reviewed by facility administration and may be subject to regulatory oversight.</span>
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
                            <label className="block text-sm font-medium text-font-base mb-2">Date & Time</label>
                            <input type="datetime-local" value={incidentReport.signatureDatetime} onChange={(e) => setIncidentReport({...incidentReport, signatureDatetime: e.target.value})} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleSubmitIncidentReport} 
                    disabled={loading}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Submitting...' : 'Submit Incident Report'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shakedown Report Section */}
        {activeTab === 'shakedown-report' && (
          <div id="shakedown-report-content" className="tab-content">
            <div id="shakedown-report" className="bg-white rounded-lg border border-bd mb-8">
              <div className="p-6 border-b border-bd">
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-search text-primary mr-3"></i>
                  Shakedown Report
                </h3>
              </div>
              <div className="p-6 space-y-8">
                {/* Date and Shift */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Date of Shakedown</label>
                    <input type="date" value={shakedownReport.shakedownDate} onChange={(e) => setShakedownReport({...shakedownReport, shakedownDate: e.target.value})} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Shift</label>
                    <select value={shakedownReport.shift} onChange={(e) => setShakedownReport({...shakedownReport, shift: e.target.value})} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>Day (7:00 AM - 3:00 PM)</option>
                      <option>Evening (3:00 PM - 11:00 PM)</option>
                      <option>Night (11:00 PM - 7:00 AM)</option>
                    </select>
                  </div>
                </div>

                {/* Common Area Search */}
                <div>
                  <h4 className="font-medium text-font-base mb-4">Common Area Search</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-bd rounded-lg">
                      <thead className="bg-bg-subtle">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Area</th>
                          <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Staff Searching</th>
                          <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Contraband Found</th>
                          <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['Dining Hall','Recreation Room','Common Area','Laundry Room'].map((area) => (
                          <tr key={area} className="border-b border-bd">
                            <td className="py-3 px-4 text-sm text-font-base">{area}</td>
                            <td className="py-3 px-4"><input type="text" className="w-full border border-bd rounded px-2 py-1 text-sm" /></td>
                            <td className="py-3 px-4">
                              <select className="w-full border border-bd rounded px-2 py-1 text-sm">
                                <option>No</option>
                                <option>Yes</option>
                              </select>
                            </td>
                            <td className="py-3 px-4"><input type="text" className="w-full border border-bd rounded px-2 py-1 text-sm" /></td>
                          </tr>
                        ))}
                        {commonAddedRows.map((r, idx) => (
                          <tr key={`c-add-${idx}`} className="border-b border-bd">
                            <td className="py-3 px-4 text-sm text-font-base">{r.area}</td>
                            <td className="py-3 px-4 text-sm text-font-base">{r.staff || <span className='text-font-detail'>—</span>}</td>
                            <td className="py-3 px-4 text-sm text-font-base">{r.found}</td>
                            <td className="py-3 px-4 text-sm text-font-base">{r.comments || <span className='text-font-detail'>—</span>}</td>
                          </tr>
                        ))}
                        {/* Add other area row */}
                        <tr className="border-t border-bd bg-bg-subtle">
                          <td className="py-3 px-4 text-sm text-font-base">
                            <div className="flex items-center gap-2">
                              <select
                                value={commonAddArea}
                                onChange={(e) => setCommonAddArea(e.target.value)}
                                className="border border-bd rounded px-2 py-1 text-sm flex-1"
                              >
                                {commonAreas.map((a) => (
                                  <option key={a} value={a}>{a}</option>
                                ))}
                                <option value="Other">Other...</option>
                              </select>
                              {commonAddArea === 'Other' && (
                                <input
                                  value={commonAddCustom}
                                  onChange={(e) => setCommonAddCustom(e.target.value)}
                                  placeholder="Specify area"
                                  className="border border-bd rounded px-2 py-1 text-sm flex-1"
                                />
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <input value={commonAddStaff} onChange={(e)=>setCommonAddStaff(e.target.value)} placeholder="Staff searching" className="w-full border border-bd rounded px-2 py-1 text-sm" />
                          </td>
                          <td className="py-3 px-4">
                            <select value={commonAddFound} onChange={(e)=>setCommonAddFound(e.target.value as 'No'|'Yes')} className="w-full border border-bd rounded px-2 py-1 text-sm">
                              <option>No</option>
                              <option>Yes</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <input value={commonAddComments} onChange={(e)=>setCommonAddComments(e.target.value)} placeholder="Comments" className="w-full border border-bd rounded px-2 py-1 text-sm" />
                              <button
                                type="button"
                                onClick={()=>{
                                  const areaName = commonAddArea === 'Other' ? commonAddCustom.trim() : commonAddArea;
                                  if (!areaName) return;
                                  setCommonAddedRows(prev=>[...prev,{area: areaName, staff: commonAddStaff.trim(), found: commonAddFound, comments: commonAddComments.trim()}]);
                                  setCommonAddCustom('');
                                  setCommonAddStaff('');
                                  setCommonAddFound('No');
                                  setCommonAddComments('');
                                }}
                                className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-light whitespace-nowrap"
                              >
                                <i className="fa-solid fa-plus mr-1"></i>
                                Add Row
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* School Area Search */}
                <div>
                  <h4 className="font-medium text-font-base mb-4">School Area Search</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-bd rounded-lg">
                      <thead className="bg-bg-subtle">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Area</th>
                          <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Staff Searching</th>
                          <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Contraband Found</th>
                          <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['Classroom 1','Classroom 2','Gymnasium','STEM Room','Library'].map((area) => (
                          <tr key={area} className="border-b border-bd">
                            <td className="py-3 px-4 text-sm text-font-base">{area}</td>
                            <td className="py-3 px-4"><input type="text" className="w-full border border-bd rounded px-2 py-1 text-sm" /></td>
                            <td className="py-3 px-4">
                              <select className="w-full border border-bd rounded px-2 py-1 text-sm">
                                <option>No</option>
                                <option>Yes</option>
                              </select>
                            </td>
                            <td className="py-3 px-4"><input type="text" className="w-full border border-bd rounded px-2 py-1 text-sm" /></td>
                          </tr>
                        ))}
                        {schoolAddedRows.map((r, idx) => (
                          <tr key={`s-add-${idx}`} className="border-b border-bd">
                            <td className="py-3 px-4 text-sm text-font-base">{r.area}</td>
                            <td className="py-3 px-4 text-sm text-font-base">{r.staff || <span className='text-font-detail'>—</span>}</td>
                            <td className="py-3 px-4 text-sm text-font-base">{r.found}</td>
                            <td className="py-3 px-4 text-sm text-font-base">{r.comments || <span className='text-font-detail'>—</span>}</td>
                          </tr>
                        ))}
                        {/* Add other area row */}
                        <tr className="border-t border-bd bg-bg-subtle">
                          <td className="py-3 px-4 text-sm text-font-base">
                            <div className="flex items-center gap-2">
                              <select
                                value={schoolAddArea}
                                onChange={(e) => setSchoolAddArea(e.target.value)}
                                className="border border-bd rounded px-2 py-1 text-sm flex-1"
                              >
                                {schoolAreas.map((a) => (
                                  <option key={a} value={a}>{a}</option>
                                ))}
                                <option value="Other">Other...</option>
                              </select>
                              {schoolAddArea === 'Other' && (
                                <input
                                  value={schoolAddCustom}
                                  onChange={(e) => setSchoolAddCustom(e.target.value)}
                                  placeholder="Specify area"
                                  className="border border-bd rounded px-2 py-1 text-sm flex-1"
                                />
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <input value={schoolAddStaff} onChange={(e)=>setSchoolAddStaff(e.target.value)} placeholder="Staff searching" className="w-full border border-bd rounded px-2 py-1 text-sm" />
                          </td>
                          <td className="py-3 px-4">
                            <select value={schoolAddFound} onChange={(e)=>setSchoolAddFound(e.target.value as 'No'|'Yes')} className="w-full border border-bd rounded px-2 py-1 text-sm">
                              <option>No</option>
                              <option>Yes</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <input value={schoolAddComments} onChange={(e)=>setSchoolAddComments(e.target.value)} placeholder="Comments" className="w-full border border-bd rounded px-2 py-1 text-sm" />
                              <button
                                type="button"
                                onClick={()=>{
                                  const areaName = schoolAddArea === 'Other' ? schoolAddCustom.trim() : schoolAddArea;
                                  if (!areaName) return;
                                  setSchoolAddedRows(prev=>[...prev,{area: areaName, staff: schoolAddStaff.trim(), found: schoolAddFound, comments: schoolAddComments.trim()}]);
                                  setSchoolAddCustom('');
                                  setSchoolAddStaff('');
                                  setSchoolAddFound('No');
                                  setSchoolAddComments('');
                                }}
                                className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-light whitespace-nowrap"
                              >
                                <i className="fa-solid fa-plus mr-1"></i>
                                Add Row
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tools and Equipment */}
                <div>
                  <h4 className="font-medium text-font-base mb-4">Tools and Equipment Condition</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {['Cuffs','Waistbands','Radios'].map((item) => (
                        <div key={item} className="flex items-center justify-between py-2 border-b border-bd">
                          <span className="text-sm text-font-base">{item}</span>
                          <select className="border border-bd rounded px-2 py-1 text-sm">
                            <option>Good</option>
                            <option>Fair</option>
                            <option>Poor</option>
                            <option>Missing</option>
                          </select>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {['Shackles','Keys','Flashlights'].map((item) => (
                        <div key={item} className="flex items-center justify-between py-2 border-b border-bd">
                          <span className="text-sm text-font-base">{item}</span>
                          <select className="border border-bd rounded px-2 py-1 text-sm">
                            <option>Good</option>
                            <option>Fair</option>
                            <option>Poor</option>
                            <option>Missing</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Comments */}
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Additional Comments</label>
                  <textarea placeholder="Any additional observations or comments about the shakedown" className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-24 focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                </div>

                {/* Resident Room Search */}
                <div>
                  <h4 className="font-medium text-font-base mb-4">Resident Room Search</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-bd rounded-lg">
                      <tbody>
                        {addedRoomRows.map((r, idx) => (
                          <tr key={`${r.unit}-${r.room}-${idx}`} className="border-b border-bd">
                            <td className="py-3 px-4 text-sm text-font-base">{r.unit}</td>
                            <td className="py-3 px-4 text-sm text-font-base">{r.room}</td>
                            <td className="py-3 px-4 text-sm text-font-base">{r.staff || <span className='text-font-detail'>—</span>}</td>
                            <td className="py-3 px-4 text-sm text-font-base">{r.result}</td>
                            <td className="py-3 px-4 text-sm text-font-base">{r.comments || <span className='text-font-detail'>—</span>}</td>
                          </tr>
                        ))}
                        {/* Add row */}
                        <tr className="bg-bg-subtle">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 min-w-[220px]">
                              <select
                                value={roomAddUnit}
                                onChange={(e) => setRoomAddUnit(e.target.value)}
                                className="border border-bd rounded px-2 py-1 text-sm flex-1"
                              >
                                {['Unit A','Unit B','Unit C','Unit D'].map((u) => (
                                  <option key={u} value={u}>{u}</option>
                                ))}
                                <option value="Other">Other...</option>
                              </select>
                              {roomAddUnit === 'Other' && (
                                <input
                                  value={roomAddUnitCustom}
                                  onChange={(e) => setRoomAddUnitCustom(e.target.value)}
                                  placeholder="Specify unit"
                                  className="border border-bd rounded px-2 py-1 text-sm flex-1"
                                />
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              value={roomAddRoom}
                              onChange={(e) => setRoomAddRoom(e.target.value)}
                              placeholder="Room (e.g., A12, East-201)"
                              className="w-full border border-bd rounded px-2 py-1 text-sm"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              value={roomAddStaff}
                              onChange={(e) => setRoomAddStaff(e.target.value)}
                              placeholder="Staff searching"
                              className="w-full border border-bd rounded px-2 py-1 text-sm"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={roomAddResult}
                              onChange={(e) => setRoomAddResult(e.target.value as RoomRow['result'])}
                              className="w-full border border-bd rounded px-2 py-1 text-sm"
                            >
                              <option>No contraband</option>
                              <option>Contraband found</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <input
                                value={roomAddComments}
                                onChange={(e) => setRoomAddComments(e.target.value)}
                                placeholder="Comments"
                                className="w-full border border-bd rounded px-2 py-1 text-sm"
                              />
                              <button
                                type="button"
                                onClick={addRoomRow}
                                className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-light whitespace-nowrap"
                              >
                                <i className="fa-solid fa-plus mr-1"></i>
                                Add Row
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Opposite Gender Announcements */}
                <div>
                  <h4 className="font-medium text-font-base mb-4">Opposite Gender Announcements/Notifications</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Time of Announcement</label>
                      <input type="time" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Staff Member Making Announcement</label>
                      <input type="text" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-font-base mb-2">Areas Announced</label>
                    <textarea placeholder="List areas where opposite gender announcement was made" className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-20 focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                  </div>
                </div>

                {/* Certification & Signature Section */}
                <div>
                  <h4 className="text-lg font-semibold text-font-base mb-4">Certification & Signature</h4>
                  <div className="border border-bd rounded-lg p-6 bg-bg-subtle">
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 text-sm">
                        <input type="checkbox" className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" />
                        <span>I certify that the information provided in this shakedown report is accurate and complete to the best of my knowledge.</span>
                      </label>
                      <label className="flex items-start gap-3 text-sm">
                        <input type="checkbox" className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" />
                        <span>I confirm that all searches were conducted in accordance with facility policies and legal requirements.</span>
                      </label>
                      <label className="flex items-start gap-3 text-sm">
                        <input type="checkbox" className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" />
                        <span>I understand that any contraband found has been properly documented and secured according to protocol.</span>
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
                            <label className="block text-sm font-medium text-font-base mb-2">Date & Time</label>
                            <input type="datetime-local" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleSubmitShakedownReport}
                    disabled={loading}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Submitting...' : 'Submit Shakedown Report'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Archive Section */}
        {activeTab === 'incident-archive' && (
          <div id="incident-archive-content" className="tab-content">
            <div id="incident-archive" className="bg-white rounded-lg border border-bd mb-8">
              <div className="p-6 border-b border-bd">
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-archive text-primary mr-3"></i>
                  Incident &amp; Shakedown Archive
                </h3>
              </div>
              <div className="p-6">
                {/* Filter Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Search</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={archiveFilters.search} 
                        onChange={(e) => { setArchiveFilters({...archiveFilters, search: e.target.value}); setArchivePage(1); }} 
                        placeholder="Search incidents..." 
                        className="w-full border border-bd rounded-lg px-3 py-2 pl-10 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                      />
                      <i className="fa-solid fa-search absolute left-3 top-3 text-font-medium text-sm"></i>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Type</label>
                    <select 
                      value={archiveFilters.type} 
                      onChange={(e) => { setArchiveFilters({...archiveFilters, type: e.target.value}); setArchivePage(1); }} 
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>All Types</option>
                      <option>Incident Report</option>
                      <option>Shakedown Report</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Date Range</label>
                    <select 
                      value={archiveFilters.dateRange} 
                      onChange={(e) => { setArchiveFilters({...archiveFilters, dateRange: e.target.value}); setArchivePage(1); }} 
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>Last 30 Days</option>
                      <option>Last 7 Days</option>
                      <option>Last 90 Days</option>
                      <option>Custom Range</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Priority</label>
                    <select 
                      value={archiveFilters.priority} 
                      onChange={(e) => { setArchiveFilters({...archiveFilters, priority: e.target.value}); setArchivePage(1); }} 
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>All Priorities</option>
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                {/* Archive Table */}
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-4"></i>
                      <p className="text-font-detail">Loading reports...</p>
                    </div>
                  </div>
                ) : archivePagedRows.length === 0 ? (
                  <div className="flex justify-center items-center py-12 border border-bd rounded-lg">
                    <div className="text-center">
                      <i className="fa-solid fa-inbox text-4xl text-font-detail mb-4"></i>
                      <p className="text-font-base font-medium mb-2">No reports found</p>
                      <p className="text-font-detail text-sm">Try adjusting your filters or submit a new report</p>
                    </div>
                  </div>
                ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border border-bd rounded-lg">
                    <thead className="bg-bg-subtle">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Date/Time</th>
                        <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Nature/Description</th>
                        <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Priority</th>
                        <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Staff</th>
                        <th className="text-left py-3 px-4 font-medium text-font-base border-b border-bd">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {archivePagedRows.map((row, idx) => (
                        <tr key={`${row.dt}-${row.time}-${idx}`} className="border-b border-bd hover:bg-primary-lightest">
                          <td className="py-3 px-4 text-sm text-font-base">{row.dt}<br /><span className="text-font-detail">{row.time}</span></td>
                          <td className="py-3 px-4"><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${row.badge}`}>{row.type}</span></td>
                          <td className="py-3 px-4 text-sm text-font-base">{row.nature}</td>
                          <td className="py-3 px-4"><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${row.pcls}`}>{row.priority}</span></td>
                          <td className="py-3 px-4 text-sm text-font-base">{row.staff}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => printReport(row)} 
                                className="text-primary hover:text-primary-light text-sm" 
                                title="Print Report">
                                <i className="fa-solid fa-print"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
                {!loading && archivePagedRows.length > 0 && archiveTotalPages > 1 && (
                  <div className="px-4 sm:px-6 py-4 border-t border-bd bg-bg-subtle">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-font-detail">Showing {archiveStart + 1}-{Math.min(archiveStart + archivePageSize, filteredArchive.length)} of {filteredArchive.length} entries</div>
                      <div className="flex space-x-2">
                        <button onClick={() => setArchivePage((p) => Math.max(1, p - 1))} disabled={archivePage === 1} className={`px-3 py-2 border border-bd rounded text-sm ${archivePage === 1 ? 'text-font-detail opacity-50 cursor-not-allowed' : 'text-font-detail hover:bg-primary-lightest'}`}>Previous</button>
                        {Array.from({ length: Math.min(archiveTotalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (archiveTotalPages <= 5) {
                            pageNum = i + 1;
                          } else if (archivePage <= 3) {
                            pageNum = i + 1;
                          } else if (archivePage >= archiveTotalPages - 2) {
                            pageNum = archiveTotalPages - 4 + i;
                          } else {
                            pageNum = archivePage - 2 + i;
                          }
                          return pageNum;
                        }).map((n) => (
                          <button key={n} onClick={() => setArchivePage(n)} className={`px-3 py-2 rounded text-sm ${n === archivePage ? 'bg-primary text-white hover:bg-primary-light' : 'border border-bd text-font-detail hover:bg-primary-lightest'}`}>{n}</button>
                        ))}
                        <button onClick={() => setArchivePage((p) => Math.min(archiveTotalPages, p + 1))} disabled={archivePage === archiveTotalPages} className={`px-3 py-2 border border-bd rounded text-sm ${archivePage === archiveTotalPages ? 'text-font-detail opacity-50 cursor-not-allowed' : 'text-font-detail hover:bg-primary-lightest'}`}>Next</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white animate-slide-in-right ${
              toast.tone === 'success' ? 'bg-green-500' :
              toast.tone === 'error' ? 'bg-red-500' :
              toast.tone === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}
          >
            {toast.title}
          </div>
        ))}
      </div>
    </div>
  );
}
