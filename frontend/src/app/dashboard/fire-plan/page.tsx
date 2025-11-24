'use client';

import { useEffect, useMemo, useState } from 'react';
import { logoUrl } from '../../utils/logo';
import { abbreviateTitle } from '../../utils/titleAbbrev';

export default function FirePlanPage() {
  const [activeTab, setActiveTab] = useState<string>('current');

  // Derived current date/time and shift label for header
  const now = new Date();
  const hours = now.getHours();
  const shiftLabel =
    hours >= 7 && hours < 15
      ? 'Day (7:00 AM - 3:00 PM)'
      : hours >= 15 && hours < 23
      ? 'Evening (3:00 PM - 11:00 PM)'
      : 'Night (11:00 PM - 7:00 AM)';

  // Program-scoped data for summary counts
  const [programId, setProgramId] = useState<string>('');
  const [programName, setProgramName] = useState<string>('');

  type AssignmentLite = {
    roleType?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    userEmail?: string;
  };
  const [assignments, setAssignments] = useState<AssignmentLite[]>([]);

  type ResidentLite = {
    id: number | string;
    firstName?: string;
    lastName?: string;
  };
  const [residents, setResidents] = useState<ResidentLite[]>([]);

  // Global staff directory (same source as Unit Registry) so we can show full names and titles
  type StaffLite = {
    id: string;
    fullName: string;
    email: string;
    jobTitle?: string;
    employeeNumber?: string;
  };
  const [staffList, setStaffList] = useState<StaffLite[]>([]);
  const staffByEmail = useMemo(
    () => Object.fromEntries(staffList.map((s) => [s.email.toLowerCase(), s])),
    [staffList]
  );

  type PlannedAssignment = {
    staffNames: string[];
    assignmentType: string;
    residentName: string;
    // Optional list of resident IDs this assignment covers (newer data will include this)
    residentIds?: string[];
  };
  const [plannedAssignments, setPlannedAssignments] = useState<PlannedAssignment[]>([]);

  type EvacuationRoute = {
    routeName: string;
    flow: string;
    status: string;
  };
  const [evacuationRoutes, setEvacuationRoutes] = useState<EvacuationRoute[]>([]);

  type AssemblyPoint = {
    pointName: string;
    routeType: string;
    notes: string;
  };
  const [assemblyPoints, setAssemblyPoints] = useState<AssemblyPoint[]>([]);

  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [selectedAssignmentType, setSelectedAssignmentType] = useState<string>('Primary Route');
  const [selectedResidentIds, setSelectedResidentIds] = useState<string[]>([]);

  const [selectedRouteName, setSelectedRouteName] = useState<string>('Primary Route A');
  const [selectedRouteFlow, setSelectedRouteFlow] = useState<string>('');
  const [selectedRouteStatus, setSelectedRouteStatus] = useState<string>('Available');

  const [selectedAssemblyPoint, setSelectedAssemblyPoint] = useState<string>('Assembly Point 1');
  const [selectedAssemblyRouteType, setSelectedAssemblyRouteType] = useState<string>('Primary');
  const [selectedAssemblyNotes, setSelectedAssemblyNotes] = useState<string>('');

  const [currentPlanId, setCurrentPlanId] = useState<number | null>(null);

  // Save state tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'unsaved' | 'saving' | 'saved'>('unsaved');

  // Drill Report Form State
  const [drillReport, setDrillReport] = useState({
    drillDate: '',
    drillTime: '',
    drillType: 'Scheduled Drill',
    shift: 'Day Shift (7:00 AM - 3:00 PM)',
    shiftSupervisor: '',
    reportCompletedBy: '',
    totalEvacuationTime: '',
    weatherConditions: 'Clear',
    totalStaffPresent: 0,
    totalResidentsPresent: 0,
    overallPerformance: '',
    issuesIdentified: '',
    recommendations: '',
    routePerformance: [] as Array<{routeName: string; time: string; issues: string}>,
    certificationComplete: false,
    signatureDatetime: ''
  });

  // Drill Archive State
  type DrillReportItem = {
    id: number;
    drillDate: string;
    drillTime: string;
    drillType: string;
    totalEvacuationTime: string;
    status: string;
    shift: string;
    shiftSupervisor: string;
  };
  const [drillReports, setDrillReports] = useState<DrillReportItem[]>([]);
  const [drillSearchQuery, setDrillSearchQuery] = useState('');
  const [drillTypeFilter, setDrillTypeFilter] = useState('All Types');

  // Toast notifications
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; tone: 'info' | 'success' | 'error' }>>([]);
  const removeToast = (id: string) => setToasts(t => t.filter(x => x.id !== id));
  const addToast = (title: string, tone: 'info' | 'success' | 'error' = 'info') => {
    const id = String(Date.now() + Math.random());
    setToasts(t => [...t, { id, title, tone }]);
    setTimeout(() => removeToast(id), 3500);
  };

  // Resolve selected program from localStorage (same pattern as Unit Registry)
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
      if (!raw) return;
      const parsed = JSON.parse(raw) as { id?: number | string; name?: string } | null;
      if (parsed?.id != null) {
        setProgramId(String(parsed.id));
        setProgramName(parsed.name || '');
      }
    } catch {
      // Ignore JSON/LS errors, fall back to empty programId
    }
  }, []);

  // Load staff directory once (same pattern as Unit Registry)
  useEffect(() => {
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch('/api/users/search?q=', {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) return;
        const arr: Array<{
          id: string | number;
          fullName: string;
          email: string;
          jobTitle?: string;
          employeeNumber?: string;
        }> = await res.json();
        const mapped: StaffLite[] = arr.map((u) => ({
          id: typeof u.id === 'string' ? u.id : String(u.id),
          fullName: u.fullName,
          email: u.email,
          jobTitle: u.jobTitle,
          employeeNumber: u.employeeNumber,
        }));
        setStaffList(mapped);
      } catch {
        // Silent failure keeps UI stable
      }
    })();
  }, []);

  // Load staff assignments, residents, and current fire plan for the current program
  useEffect(() => {
    if (!programId) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const commonHeaders: HeadersInit = {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const loadAssignments = async () => {
      try {
        const res = await fetch(`/api/programs/${programId}/assignments`, {
          credentials: 'include',
          headers: commonHeaders,
        });
        if (!res.ok) return;
        const data: Array<any> = await res.json();
        setAssignments(
          (data || []).map((a) => ({
            roleType: a.roleType,
            title: a.title,
            firstName: a.firstName,
            lastName: a.lastName,
            userEmail: a.userEmail,
          }))
        );
      } catch {
        // Silent failure keeps UI stable
      }
    };

    const loadResidents = async () => {
      try {
        const res = await fetch(`/api/programs/${programId}/residents`, {
          credentials: 'include',
          headers: commonHeaders,
        });
        if (!res.ok) return;
        const data: Array<any> = await res.json();
        setResidents(
          (data || []).map((r) => ({
            id: r.id,
            firstName: r.firstName,
            lastName: r.lastName,
          })) as ResidentLite[]
        );
      } catch {
        // Silent failure keeps UI stable
      }
    };

    const loadPlan = async () => {
      try {
        const res = await fetch(`/api/programs/${programId}/fire-plan/current`, {
          credentials: 'include',
          headers: commonHeaders,
        });
        if (!res.ok) return;
        const data: any = await res.json();
        if (!data || data.id == null) return;

        setCurrentPlanId(Number(data.id));

        if (data.staffAssignmentsJson) {
          try {
            const parsed = JSON.parse(String(data.staffAssignmentsJson));
            if (Array.isArray(parsed)) {
              setPlannedAssignments(parsed as PlannedAssignment[]);
            }
          } catch {
            // Ignore malformed JSON, keep defaults
          }
        }

        if (data.routeConfigJson) {
          try {
            const parsed = JSON.parse(String(data.routeConfigJson));
            if (parsed.routes && Array.isArray(parsed.routes)) {
              setEvacuationRoutes(parsed.routes as EvacuationRoute[]);
            }
            if (parsed.assemblyPoints && Array.isArray(parsed.assemblyPoints)) {
              setAssemblyPoints(parsed.assemblyPoints as AssemblyPoint[]);
            }
          } catch {
            // Ignore malformed JSON, keep defaults
          }
        }
        
        // Reset unsaved changes flag after loading from database
        setHasUnsavedChanges(false);
        setSaveStatus('unsaved');
      } catch {
        // Silent failure keeps UI stable
      }
    };

    const loadDrillReports = async () => {
      if (!programId) return;
      try {
        const res = await fetch(`/api/programs/${programId}/fire-plan/drills?page=0&size=100`, {
          credentials: 'include',
          headers: commonHeaders,
        });
        if (!res.ok) return;
        const data: any = await res.json();
        if (data.content && Array.isArray(data.content)) {
          setDrillReports(data.content.map((item: any) => ({
            id: item.id,
            drillDate: item.drillDate,
            drillTime: item.drillTime,
            drillType: item.drillType,
            totalEvacuationTime: item.totalEvacuationTime || 'N/A',
            status: item.status || 'Successful',
            shift: item.shift,
            shiftSupervisor: item.shiftSupervisor
          })));
        }
      } catch {
        // Silent failure keeps UI stable
      }
    };

    loadAssignments();
    loadResidents();
    loadPlan();
    loadDrillReports();
  }, [programId]);

  // Normalize assignments to unique staff per email so counts and lists don't duplicate people
  const uniqueAssignments: AssignmentLite[] = useMemo(() => {
    const map: Record<string, AssignmentLite> = {};
    for (const a of assignments) {
      const key = (a.userEmail || '').toLowerCase();
      if (!key) continue;
      if (!map[key]) map[key] = a;
    }
    return Object.values(map);
  }, [assignments]);

  // Derived counts for summary cards
  const totalStaff = uniqueAssignments.length;

  const selectableStaff = uniqueAssignments;

  const getAssignmentBadgeClass = (assignmentType: string) => {
    const t = assignmentType.toLowerCase();
    if (t.includes('1:1') || t.includes('separation')) return 'bg-error text-white text-xs px-2 py-1 rounded';
    if (t.includes('secondary')) return 'bg-primary-light text-white text-xs px-2 py-1 rounded';
    return 'bg-primary text-white text-xs px-2 py-1 rounded';
  };

  const totalResidents = residents.length;

  // Calculate evacuation route statistics
  const totalRoutes = evacuationRoutes.length;
  const availableRoutes = evacuationRoutes.filter(r => r.status?.toLowerCase() === 'available').length;
  const blockedRoutes = evacuationRoutes.filter(r => r.status?.toLowerCase() === 'blocked').length;
  
  // Calculate staff assignment coverage
  const assignedStaffCount = plannedAssignments.reduce((count, assignment) => {
    return count + (assignment.staffNames?.length || 0);
  }, 0);

  const tabBtnBase = 'flex items-center px-1 py-3 text-sm font-medium border-b-2 transition-colors';
  const tabBtnInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';
  const tabBtnActive = 'border-primary text-primary';

  const handlePrint = () => {
    // Print drill report if on report tab, otherwise print fire plan
    if (activeTab === 'report') {
      printDrillReport();
      return;
    }

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        addToast('Please allow popups to print fire plan', 'error');
        return;
      }

      // Format date
      const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

      // Build staff assignments HTML
      let assignmentsHTML = '';
      if (plannedAssignments.length > 0) {
        const rows = plannedAssignments.map(a => `
          <tr>
            <td style="font-weight: bold;">${a.assignmentType}</td>
            <td>${a.staffNames.join(', ')}</td>
            <td>${a.residentName}</td>
          </tr>
        `).join('');
        assignmentsHTML = `
          <div class="section">
            <h2 class="section-title">Staff Assignments</h2>
            <table>
              <tr>
                <th style="width: 25%;">Assignment Type</th>
                <th style="width: 40%;">Assigned Staff</th>
                <th style="width: 35%;">Residents</th>
              </tr>
              ${rows}
            </table>
          </div>
        `;
      }

      // Build evacuation routes HTML
      let routesHTML = '';
      if (evacuationRoutes.length > 0) {
        const rows = evacuationRoutes.map(r => {
          const statusBadge = r.status === 'Available' 
            ? '<span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px;">AVAILABLE</span>'
            : '<span style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px;">RESTRICTED</span>';
          return `
            <tr>
              <td style="font-weight: bold;">${r.routeName}</td>
              <td>${r.flow}</td>
              <td>${statusBadge}</td>
            </tr>
          `;
        }).join('');
        routesHTML = `
          <div class="section">
            <h2 class="section-title">Evacuation Routes</h2>
            <table>
              <tr>
                <th style="width: 25%;">Route Name</th>
                <th style="width: 55%;">Route Flow</th>
                <th style="width: 20%;">Status</th>
              </tr>
              ${rows}
            </table>
          </div>
        `;
      }

      // Build assembly points HTML
      let assemblyHTML = '';
      if (assemblyPoints.length > 0) {
        const rows = assemblyPoints.map(p => `
          <tr>
            <td style="font-weight: bold;">${p.pointName}</td>
            <td>${p.routeType}</td>
            <td>${p.notes}</td>
          </tr>
        `).join('');
        assemblyHTML = `
          <div class="section">
            <h2 class="section-title">Assembly Points & Safety Zones</h2>
            <table>
              <tr>
                <th style="width: 25%;">Point Name</th>
                <th style="width: 20%;">Route Type</th>
                <th style="width: 55%;">Notes</th>
              </tr>
              ${rows}
            </table>
          </div>
        `;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Fire Plan - ${dateStr}</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
              .page-break { page-break-before: always; }
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              padding: 30px;
              background: white;
              color: #333;
              font-size: 12px;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 3px solid #dc2626;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .logo-section {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .logo {
              width: 70px;
              height: 70px;
              object-fit: contain;
            }
            .title-section h1 {
              font-size: 22px;
              color: #dc2626;
              margin-bottom: 3px;
            }
            .title-section p {
              font-size: 13px;
              color: #666;
            }
            .report-info {
              background: #fef2f2;
              padding: 15px;
              border-radius: 6px;
              margin-bottom: 20px;
              border-left: 4px solid #dc2626;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
            }
            .info-item {
              display: flex;
              gap: 8px;
            }
            .info-label {
              font-weight: bold;
              color: #374151;
              min-width: 100px;
            }
            .info-value {
              color: #6b7280;
            }
            .section {
              margin-bottom: 25px;
              break-inside: avoid;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #dc2626;
              margin-bottom: 12px;
              padding-bottom: 6px;
              border-bottom: 2px solid #e5e7eb;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            th {
              background: #f3f4f6;
              padding: 8px;
              text-align: left;
              font-size: 11px;
              border: 1px solid #e5e7eb;
            }
            td {
              padding: 8px;
              border: 1px solid #e5e7eb;
              font-size: 11px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            .stat-card {
              background: #f9fafb;
              padding: 12px;
              border-radius: 6px;
              border: 1px solid #e5e7eb;
            }
            .stat-label {
              font-size: 10px;
              color: #6b7280;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .stat-value {
              font-size: 20px;
              font-weight: bold;
              color: #1f2937;
            }
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #9ca3af;
              font-size: 10px;
            }
            @page { margin: 15mm; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-section">
              <img src="${logoUrl}" alt="DYS Logo" class="logo" onerror="this.style.display='none'"/>
              <div class="title-section">
                <h1>Fire Safety Plan</h1>
                <p>Department of Youth Services</p>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 18px; font-weight: bold; color: #dc2626;">${programName || 'Program'}</div>
              <div style="font-size: 12px; color: #666; margin-top: 3px;">Generated: ${dateStr}</div>
            </div>
          </div>

          <div class="report-info">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Plan Date:</span>
                <span class="info-value">${dateStr}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Time:</span>
                <span class="info-value">${timeStr}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Shift:</span>
                <span class="info-value">${shiftLabel}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Total Staff:</span>
                <span class="info-value">${selectableStaff.length}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Total Residents:</span>
                <span class="info-value">${residents.length}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="info-value" style="color: #10b981; font-weight: bold;">Active Plan</span>
              </div>
            </div>
          </div>

          ${assignmentsHTML}
          ${routesHTML}
          ${assemblyHTML}

          <div class="footer">
            <p><strong>EMERGENCY CONTACT:</strong> Dial 911 for immediate assistance</p>
            <p style="margin-top: 5px;">This fire safety plan should be reviewed regularly and updated as needed.</p>
            <p style="margin-top: 5px;">Document generated on ${dateStr} at ${timeStr}</p>
          </div>
        </body>
        </html>
      `);

      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);

      addToast('Fire plan opened in new tab', 'success');
    } catch (error) {
      console.error('Print error:', error);
      addToast('Failed to open print view', 'error');
    }
  };

  const printDrillReport = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        addToast('Please allow popups to print drill report', 'error');
        return;
      }

      const dateStr = drillReport.drillDate ? new Date(drillReport.drillDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
      const timeStr = drillReport.drillTime || 'N/A';

      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Fire Drill Report - ${programName || 'Program'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; background: white; color: #1a1a1a; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #dc2626; padding-bottom: 20px; }
    .logo { width: 120px; height: auto; margin-bottom: 15px; }
    h1 { font-size: 28px; color: #dc2626; margin-bottom: 10px; }
    .subtitle { font-size: 16px; color: #666; margin-bottom: 5px; }
    .section { margin-bottom: 25px; page-break-inside: avoid; }
    .section-title { font-size: 18px; font-weight: bold; color: #dc2626; margin-bottom: 12px; border-bottom: 2px solid #fee; padding-bottom: 5px; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px; }
    .info-item { padding: 10px; background: #fef2f2; border-radius: 4px; }
    .info-label { font-size: 12px; color: #666; margin-bottom: 4px; font-weight: 600; }
    .info-value { font-size: 14px; color: #1a1a1a; }
    .text-block { padding: 15px; background: #f9fafb; border-left: 4px solid #dc2626; margin-bottom: 15px; }
    .text-label { font-size: 12px; color: #666; margin-bottom: 8px; font-weight: 600; }
    .text-content { font-size: 14px; line-height: 1.6; color: #1a1a1a; white-space: pre-wrap; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; font-size: 12px; color: #999; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logoUrl}" alt="Logo" class="logo" />
    <h1>Fire Drill Report</h1>
    <div class="subtitle">${programName || 'Program Name'}</div>
    <div class="subtitle">Generated: ${new Date().toLocaleString()}</div>
  </div>

  <div class="section">
    <div class="section-title">Basic Drill Information</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Drill Date</div>
        <div class="info-value">${dateStr}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Drill Time</div>
        <div class="info-value">${timeStr}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Drill Type</div>
        <div class="info-value">${drillReport.drillType}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Shift & Staff Information</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Shift</div>
        <div class="info-value">${drillReport.shift}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Shift Supervisor</div>
        <div class="info-value">${drillReport.shiftSupervisor || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Report Completed By</div>
        <div class="info-value">${drillReport.reportCompletedBy || 'N/A'}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Performance Metrics</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Total Evacuation Time</div>
        <div class="info-value">${drillReport.totalEvacuationTime || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Weather Conditions</div>
        <div class="info-value">${drillReport.weatherConditions}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Staff Present</div>
        <div class="info-value">${drillReport.totalStaffPresent}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Residents Present</div>
        <div class="info-value">${drillReport.totalResidentsPresent}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Drill Assessment</div>
    <div class="text-block">
      <div class="text-label">Overall Drill Performance</div>
      <div class="text-content">${drillReport.overallPerformance || 'No performance notes provided.'}</div>
    </div>
    <div class="text-block">
      <div class="text-label">Issues/Bottlenecks Identified</div>
      <div class="text-content">${drillReport.issuesIdentified || 'No issues identified.'}</div>
    </div>
    <div class="text-block">
      <div class="text-label">Recommendations for Improvement</div>
      <div class="text-content">${drillReport.recommendations || 'No recommendations provided.'}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Certification</div>
    <div class="info-item">
      <div class="info-label">Certification Status</div>
      <div class="info-value">${drillReport.certificationComplete ? 'Certified ✓' : 'Not Certified'}</div>
    </div>
    <div class="info-item" style="margin-top: 10px;">
      <div class="info-label">Signature Date & Time</div>
      <div class="info-value">${drillReport.signatureDatetime ? new Date(drillReport.signatureDatetime).toLocaleString() : 'N/A'}</div>
    </div>
  </div>

  <div class="footer">
    <p>This is an official fire drill report generated by the YSP Fire Safety Management System</p>
    <p>Report generated on ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
      `;

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
      }, 250);

      addToast('Drill report opened in new tab', 'success');
    } catch (error) {
      console.error('Print error:', error);
      addToast('Failed to open print view', 'error');
    }
  };

  const handleExport = () => addToast('Exporting archive...', 'info');
  
  const handleSaveReport = async () => {
    if (!programId) {
      addToast('No program selected', 'error');
      return;
    }

    // Validation
    if (!drillReport.drillDate) {
      addToast('Please enter drill date', 'error');
      return;
    }
    if (!drillReport.drillTime) {
      addToast('Please enter drill time', 'error');
      return;
    }
    if (!drillReport.certificationComplete) {
      addToast('Please certify the report before saving', 'error');
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`/api/programs/${programId}/fire-plan/drills`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          drillDate: drillReport.drillDate,
          drillTime: drillReport.drillTime,
          drillType: drillReport.drillType,
          shift: drillReport.shift,
          shiftSupervisor: drillReport.shiftSupervisor,
          reportCompletedBy: drillReport.reportCompletedBy,
          totalEvacuationTime: drillReport.totalEvacuationTime,
          weatherConditions: drillReport.weatherConditions,
          totalStaffPresent: drillReport.totalStaffPresent,
          totalResidentsPresent: drillReport.totalResidentsPresent,
          overallPerformance: drillReport.overallPerformance,
          issuesIdentified: drillReport.issuesIdentified,
          recommendations: drillReport.recommendations,
          routePerformance: drillReport.routePerformance,
          certificationComplete: drillReport.certificationComplete,
          signatureDatetime: drillReport.signatureDatetime || new Date().toISOString(),
          status: 'Successful'
        }),
      });

      if (response.ok) {
        addToast('Fire drill report saved successfully', 'success');
        // Reset form
        setDrillReport({
          drillDate: '',
          drillTime: '',
          drillType: 'Scheduled Drill',
          shift: 'Day Shift (7:00 AM - 3:00 PM)',
          shiftSupervisor: '',
          reportCompletedBy: '',
          totalEvacuationTime: '',
          weatherConditions: 'Clear',
          totalStaffPresent: 0,
          totalResidentsPresent: 0,
          overallPerformance: '',
          issuesIdentified: '',
          recommendations: '',
          routePerformance: [],
          certificationComplete: false,
          signatureDatetime: ''
        });
        // Load updated drill reports and switch to archive tab
        await loadDrillReports();
        setActiveTab('archive');
      } else {
        addToast('Failed to save drill report', 'error');
      }
    } catch (error) {
      console.error('Error saving drill report:', error);
      addToast('Failed to save drill report', 'error');
    }
  };

  const handleCancelReport = () => {
    setDrillReport({
      drillDate: '',
      drillTime: '',
      drillType: 'Scheduled Drill',
      shift: 'Day Shift (7:00 AM - 3:00 PM)',
      shiftSupervisor: '',
      reportCompletedBy: '',
      totalEvacuationTime: '',
      weatherConditions: 'Clear',
      totalStaffPresent: 0,
      totalResidentsPresent: 0,
      overallPerformance: '',
      issuesIdentified: '',
      recommendations: '',
      routePerformance: [],
      certificationComplete: false,
      signatureDatetime: ''
    });
    addToast('Drill report cancelled', 'info');
  };
  const handleUpdateFloorPlan = () => addToast('Upload floor plan coming soon.', 'info');

  const handleSaveFirePlan = async () => {
    if (!programId) {
      addToast('No program selected', 'error');
      return;
    }

    setSaveStatus('saving');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`/api/programs/${programId}/fire-plan/current`, {
        method: 'PATCH',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          staffAssignments: plannedAssignments,
          routeConfig: { routes: evacuationRoutes, assemblyPoints },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.id && !currentPlanId) {
          setCurrentPlanId(Number(data.id));
        }
        setSaveStatus('saved');
        setHasUnsavedChanges(false);
        addToast('Fire plan saved and marked as active', 'success');
        
        // Reset to unsaved after 2 seconds
        setTimeout(() => {
          setSaveStatus('unsaved');
        }, 2000);
      } else {
        setSaveStatus('unsaved');
        addToast('Failed to save fire plan', 'error');
      }
    } catch {
      setSaveStatus('unsaved');
      addToast('Failed to save fire plan', 'error');
    }
  };

  const handleNewFirePlan = () => {
    // Clear all data to reset to fresh state
    setPlannedAssignments([]);
    setEvacuationRoutes([]);
    setAssemblyPoints([]);
    setSelectedStaffIds([]);
    setSelectedResidentIds([]);
    setHasUnsavedChanges(false);
    setSaveStatus('unsaved');
    addToast('Fire plan reset. Add assignments to create new plan', 'info');
  };

  const handleToggleStaff = (id: string) => {
    setSelectedStaffIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddAssignment = async () => {
    if (!selectedStaffIds.length || !selectedResidentIds.length) {
      addToast('Select at least one staff member and at least one resident.', 'error');
      return;
    }

    const chosenStaff = selectableStaff.filter((s, idx) => {
      const id = String(s.userEmail || `staff-${idx}`);
      return selectedStaffIds.includes(id);
    });
    const staffNames = chosenStaff.map((s) => {
      const emailKey = (s.userEmail || '').toLowerCase();
      const fromDirectory = emailKey ? staffByEmail[emailKey] : undefined;
      const baseName = fromDirectory?.fullName?.trim() || '';
      const emailFallback = (s.userEmail || '').trim();
      const name = baseName || emailFallback || 'Staff';

      const directoryTitle = fromDirectory?.jobTitle?.trim();
      const rawTitle = directoryTitle || (s.title || '').trim();
      if (!rawTitle) return name;

      const abbr = abbreviateTitle(rawTitle);
      const titleDisplay = abbr || rawTitle;
      return `${name} (${titleDisplay})`;
    });

    const chosenResidents = residents.filter((r) =>
      selectedResidentIds.includes(String(r.id))
    );
    const residentNamesArr = chosenResidents.map((r) => {
      const first = (r.firstName || '').trim();
      const last = (r.lastName || '').trim();
      const full = [first, last].filter(Boolean).join(' ');
      return full || `Resident #${r.id}`;
    });
    const residentName = residentNamesArr.join(', ');
    const newAssignment: PlannedAssignment = {
      staffNames,
      assignmentType: selectedAssignmentType,
      residentName,
      residentIds: selectedResidentIds,
    };

    // Rule: Only ONE assignment per type (Primary Route, Secondary Route, 1:1 Separation)
    // IMPORTANT: Each staff member and resident can only be in ONE route across the entire plan
    // Check if any selected staff are already in other assignments
    const staffNamesSet = new Set(staffNames.map(n => n.toLowerCase()));
    const conflictingStaff = plannedAssignments
      .filter(a => a.assignmentType !== selectedAssignmentType)
      .filter(a => a.staffNames.some(name => staffNamesSet.has(name.toLowerCase())));
    
    // Check if any selected residents are already in other assignments
    const residentIdsSet = new Set(selectedResidentIds);
    const conflictingResidents = plannedAssignments
      .filter(a => a.assignmentType !== selectedAssignmentType)
      .filter(a => (a.residentIds || []).some(id => residentIdsSet.has(id)));
    
    if (conflictingStaff.length > 0 || conflictingResidents.length > 0) {
      const conflicts: string[] = [];
      if (conflictingStaff.length > 0) {
        conflicts.push(`Staff already assigned to ${conflictingStaff.map(a => a.assignmentType).join(', ')}`);
      }
      if (conflictingResidents.length > 0) {
        conflicts.push(`Residents already assigned to ${conflictingResidents.map(a => a.assignmentType).join(', ')}`);
      }
      addToast(`Cannot assign: ${conflicts.join('. ')}. Each person can only be in one route.`, 'error');
      return;
    }

    const existingAssignment = plannedAssignments.find((a) => a.assignmentType === selectedAssignmentType);
    const isUpdating = !!existingAssignment;
    
    const updated = [
      ...plannedAssignments.filter((a) => a.assignmentType !== selectedAssignmentType),
      newAssignment,
    ];

    setPlannedAssignments(updated);
    setHasUnsavedChanges(true);

    // Persist to backend (works even if no plan exists yet - backend will auto-create)
    if (programId) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const response = await fetch(`/api/programs/${programId}/fire-plan/current`, {
          method: 'PATCH',
          credentials: 'include',
          headers,
          body: JSON.stringify({
            staffAssignments: updated,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.id && !currentPlanId) {
            setCurrentPlanId(Number(data.id));
          }
          addToast(
            isUpdating 
              ? `${selectedAssignmentType} updated successfully` 
              : `${selectedAssignmentType} added successfully`, 
            'success'
          );
        }
      } catch {
        addToast('Failed to save assignment', 'error');
      }
    }

    // Keep selections for convenience; do not clear completely so user can add similar routes quickly.
  };

  const handleRemoveAssignment = async (index: number) => {
    const next = plannedAssignments.filter((_, i) => i !== index);
    setPlannedAssignments(next);
    setHasUnsavedChanges(true);

    if (programId) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const response = await fetch(`/api/programs/${programId}/fire-plan/current`, {
          method: 'PATCH',
          credentials: 'include',
          headers,
          body: JSON.stringify({
            staffAssignments: next,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.id && !currentPlanId) {
            setCurrentPlanId(Number(data.id));
          }
          addToast('Assignment removed successfully', 'success');
        } else {
          addToast('Failed to remove assignment', 'error');
        }
      } catch {
        addToast('Failed to remove assignment', 'error');
      }
    }
  };

  const handleAddRoute = async () => {
    if (!selectedRouteFlow.trim()) {
      addToast('Please describe the route flow.', 'error');
      return;
    }

    const newRoute: EvacuationRoute = {
      routeName: selectedRouteName,
      flow: selectedRouteFlow,
      status: selectedRouteStatus,
    };

    const existingRoute = evacuationRoutes.find((r) => r.routeName === selectedRouteName);
    const isUpdating = !!existingRoute;
    
    const updated = [
      // Ensure a single route per routeName – new configuration overwrites the old one
      ...evacuationRoutes.filter((r) => r.routeName !== selectedRouteName),
      newRoute,
    ];
    setEvacuationRoutes(updated);
    setHasUnsavedChanges(true);

    if (programId) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const response = await fetch(`/api/programs/${programId}/fire-plan/current`, {
          method: 'PATCH',
          credentials: 'include',
          headers,
          body: JSON.stringify({
            routeConfig: { routes: updated, assemblyPoints },
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.id && !currentPlanId) {
            setCurrentPlanId(Number(data.id));
          }
          addToast(
            isUpdating 
              ? `${selectedRouteName} updated successfully` 
              : `${selectedRouteName} added successfully`, 
            'success'
          );
        }
      } catch {
        addToast('Failed to save route', 'error');
      }
    }

    setSelectedRouteFlow('');
  };

  const handleRemoveRoute = async (index: number) => {
    const next = evacuationRoutes.filter((_, i) => i !== index);
    setEvacuationRoutes(next);
    setHasUnsavedChanges(true);

    if (programId) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const response = await fetch(`/api/programs/${programId}/fire-plan/current`, {
          method: 'PATCH',
          credentials: 'include',
          headers,
          body: JSON.stringify({
            routeConfig: { routes: next, assemblyPoints },
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.id && !currentPlanId) {
            setCurrentPlanId(Number(data.id));
          }
          addToast('Route removed successfully', 'success');
        }
      } catch {
        addToast('Failed to remove route', 'error');
      }
    }
  };

  const handleAddAssembly = async () => {
    if (!selectedAssemblyNotes.trim()) {
      addToast('Please add flow/notes for the assembly point.', 'error');
      return;
    }

    const newAssembly: AssemblyPoint = {
      pointName: selectedAssemblyPoint,
      routeType: selectedAssemblyRouteType,
      notes: selectedAssemblyNotes,
    };

    const existingAssembly = assemblyPoints.find(
      (p) => p.pointName === selectedAssemblyPoint && p.routeType === selectedAssemblyRouteType
    );
    const isUpdating = !!existingAssembly;
    
    const updated = [
      // Ensure a single configuration per Assembly Point + Route Type
      ...assemblyPoints.filter(
        (p) => !(p.pointName === selectedAssemblyPoint && p.routeType === selectedAssemblyRouteType)
      ),
      newAssembly,
    ];
    setAssemblyPoints(updated);
    setHasUnsavedChanges(true);

    if (programId) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const response = await fetch(`/api/programs/${programId}/fire-plan/current`, {
          method: 'PATCH',
          credentials: 'include',
          headers,
          body: JSON.stringify({
            routeConfig: { routes: evacuationRoutes, assemblyPoints: updated },
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.id && !currentPlanId) {
            setCurrentPlanId(Number(data.id));
          }
          addToast(
            isUpdating 
              ? `${selectedAssemblyPoint} (${selectedAssemblyRouteType}) updated successfully` 
              : `${selectedAssemblyPoint} (${selectedAssemblyRouteType}) added successfully`, 
            'success'
          );
        }
      } catch {
        addToast('Failed to save assembly point', 'error');
      }
    }

    setSelectedAssemblyNotes('');
  };

  const handleRemoveAssembly = async (index: number) => {
    const next = assemblyPoints.filter((_, i) => i !== index);
    setAssemblyPoints(next);
    setHasUnsavedChanges(true);

    if (programId) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const response = await fetch(`/api/programs/${programId}/fire-plan/current`, {
          method: 'PATCH',
          credentials: 'include',
          headers,
          body: JSON.stringify({
            routeConfig: { routes: evacuationRoutes, assemblyPoints: next },
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.id && !currentPlanId) {
            setCurrentPlanId(Number(data.id));
          }
          addToast('Assembly point removed successfully', 'success');
        }
      } catch {
        addToast('Failed to remove assembly point', 'error');
      }
    }
  };

  const getRouteBadgeClass = (status: string) => {
    if (status.toLowerCase().includes('restricted')) {
      return 'bg-warning text-white text-xs px-2 py-1 rounded';
    }
    return 'bg-success text-white text-xs px-2 py-1 rounded';
  };

  const getAssemblyBadgeClass = (routeType: string) => {
    const t = routeType.toLowerCase();
    if (t.includes('separation')) return 'bg-error';
    if (t.includes('secondary')) return 'bg-success';
    return 'bg-success';
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div>
        <nav className="flex space-x-8 border-b border-bd">
          <button className={`${tabBtnBase} ${activeTab === 'current' ? tabBtnActive : tabBtnInactive}`} onClick={() => setActiveTab('current')}>
            <i className={`fa-solid fa-fire-flame-simple mr-2 ${activeTab === 'current' ? 'text-primary' : 'text-font-detail'}`}></i>
            Current Plan
          </button>
          <button className={`${tabBtnBase} ${activeTab === 'report' ? tabBtnActive : tabBtnInactive}`} onClick={() => setActiveTab('report')}>
            <i className={`fa-solid fa-clipboard-check mr-2 ${activeTab === 'report' ? 'text-primary' : 'text-font-detail'}`}></i>
            Drill Report
          </button>
          <button className={`${tabBtnBase} ${activeTab === 'archive' ? tabBtnActive : tabBtnInactive}`} onClick={() => setActiveTab('archive')}>
            <i className={`fa-solid fa-archive mr-2 ${activeTab === 'archive' ? 'text-primary' : 'text-font-detail'}`}></i>
            Drill Archive
          </button>
          <button className={`${tabBtnBase} ${activeTab === 'floor' ? tabBtnActive : tabBtnInactive}`} onClick={() => setActiveTab('floor')}>
            <i className={`fa-solid fa-map mr-2 ${activeTab === 'floor' ? 'text-primary' : 'text-font-detail'}`}></i>
            Floor Plan
          </button>
        </nav>
      </div>

      {/* Current Plan */}
      {activeTab === 'current' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-fire-flame-simple text-error mr-3"></i>
                  Current Shift Fire Plan
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success text-white">Active Plan</span>
                  <button onClick={handlePrint} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light font-medium text-sm">
                    <i className="fa-solid fa-print mr-2"></i>
                    Print Plan
                  </button>
                  <button 
                    onClick={handleSaveFirePlan}
                    disabled={saveStatus === 'saving'}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      saveStatus === 'saved' 
                        ? 'bg-success text-white hover:bg-success' 
                        : saveStatus === 'saving'
                        ? 'bg-bd text-font-detail cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary-light'
                    }`}
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Saving...
                      </>
                    ) : saveStatus === 'saved' ? (
                      <>
                        <i className="fa-solid fa-check mr-2"></i>
                        Saved
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk mr-2"></i>
                        Save Fire Plan
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleNewFirePlan}
                    className="bg-white text-primary border-2 border-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white font-medium text-sm transition-colors"
                  >
                    <i className="fa-solid fa-plus mr-2"></i>
                    New Fire Plan
                  </button>
                </div>
              </div>
              <div className="mt-3 text-sm text-font-detail">
                Generated: {now.toLocaleDateString()} at{' '}
                {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} | Shift: {shiftLabel}
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-primary-lightest p-4 rounded-lg">
                  <h4 className="font-semibold text-font-base mb-2">Total Staff</h4>
                  <div className="text-2xl font-bold text-primary">{totalStaff}</div>
                  <div className="text-sm text-font-detail">{assignedStaffCount} Assigned to Routes</div>
                </div>
                <div className="bg-highlight-lightest p-4 rounded-lg">
                  <h4 className="font-semibold text-font-base mb-2">Total Residents</h4>
                  <div className="text-2xl font-bold text-warning">{totalResidents}</div>
                  <div className="text-sm text-font-detail">{plannedAssignments.reduce((count, a) => count + (a.residentIds?.length || 0), 0)} Assigned to Routes</div>
                </div>
                <div className="bg-success-lightest p-4 rounded-lg">
                  <h4 className="font-semibold text-font-base mb-2">Evacuation Routes</h4>
                  <div className="text-2xl font-bold text-success">{totalRoutes}</div>
                  <div className="text-sm text-font-detail">
                    {availableRoutes > 0 && `${availableRoutes} Available`}
                    {availableRoutes > 0 && blockedRoutes > 0 && ' • '}
                    {blockedRoutes > 0 && `${blockedRoutes} Blocked`}
                    {totalRoutes === 0 && 'No routes configured'}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Staff Assignments Section */}
                <div className="border border-bd rounded-lg p-6 bg-white">
                  <h4 className="text-lg font-semibold text-font-base mb-6 flex items-center">
                    <i className="fa-solid fa-user-group text-primary mr-2"></i>
                    Staff Assignments
                  </h4>
                  
                  {/* Configuration Form */}
                  <div className="mb-6 p-4 bg-bg-subtle rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Staff Members</label>
                        <div className="w-full h-32 border border-bd rounded-lg px-3 py-2 text-sm overflow-y-auto space-y-2 bg-white">
                          {selectableStaff.map((s, idx) => {
                            const id = String(s.userEmail || `staff-${idx}`);
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
                            
                            // Check if this staff is already assigned to a different route
                            const alreadyAssigned = plannedAssignments
                              .filter(a => a.assignmentType !== selectedAssignmentType)
                              .find(a => a.staffNames.some(n => n.toLowerCase() === label.toLowerCase()));
                            
                            return (
                              <label
                                key={id}
                                className={`flex items-center gap-2 ${alreadyAssigned ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary"
                                  checked={selectedStaffIds.includes(id)}
                                  onChange={() => handleToggleStaff(id)}
                                  disabled={!!alreadyAssigned}
                                />
                                <span className="truncate text-sm">
                                  {label}
                                  {alreadyAssigned && (
                                    <span className="text-xs text-error ml-1">(in {alreadyAssigned.assignmentType})</span>
                                  )}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        <span className="mt-2 block text-xs text-font-detail">Select one or more staff members</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Residents</label>
                        <div className="w-full h-32 border border-bd rounded-lg px-3 py-2 text-sm overflow-y-auto space-y-2 bg-white">
                          {residents.map((r) => {
                            const first = (r.firstName || '').trim();
                            const last = (r.lastName || '').trim();
                            const name = [first, last].filter(Boolean).join(' ') || `Resident #${r.id}`;
                            const rid = String(r.id);
                            const checked = selectedResidentIds.includes(rid);
                            
                            // Check if this resident is already assigned to a different route
                            const alreadyAssigned = plannedAssignments
                              .filter(a => a.assignmentType !== selectedAssignmentType)
                              .find(a => (a.residentIds || []).includes(rid));
                            
                            return (
                              <label
                                key={r.id}
                                className={`flex items-center gap-2 ${alreadyAssigned ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary"
                                  checked={checked}
                                  onChange={() =>
                                    setSelectedResidentIds((prev) =>
                                      prev.includes(rid)
                                        ? prev.filter((x) => x !== rid)
                                        : [...prev, rid]
                                    )
                                  }
                                  disabled={!!alreadyAssigned}
                                />
                                <span className="truncate text-sm">
                                  {name}
                                  {alreadyAssigned && (
                                    <span className="text-xs text-error ml-1">(in {alreadyAssigned.assignmentType})</span>
                                  )}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        <span className="mt-2 block text-xs text-font-detail">Select one or more residents</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Assignment Type</label>
                        <select
                          className="w-full border border-bd rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary bg-white mb-3"
                          value={selectedAssignmentType}
                          onChange={(e) => setSelectedAssignmentType(e.target.value)}
                        >
                          <option value="Primary Route">Primary Route</option>
                          <option value="Secondary Route">Secondary Route</option>
                          <option value="1:1 Separation">1:1 Separation</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleAddAssignment}
                          className="w-full bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors shadow-sm"
                        >
                          <i className="fa-solid fa-plus mr-2"></i>
                          Add Assignment
                        </button>
                        <span className="mt-2 block text-xs text-font-detail">Choose type and click to add</span>
                      </div>
                    </div>
                  
                  {/* Assignments List */}
                  <div className="space-y-3">
                    {plannedAssignments.length === 0 && (
                      <div className="border border-dashed border-bd rounded-lg p-6 text-center">
                        <i className="fa-solid fa-clipboard-list text-font-detail text-3xl mb-2"></i>
                        <p className="text-sm text-font-detail">No staff assignments added yet</p>
                      </div>
                    )}
                    {plannedAssignments.map((a, idx) => (
                      <div key={idx} className="border border-bd rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start gap-3 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={getAssignmentBadgeClass(a.assignmentType)}>{a.assignmentType}</span>
                                <span className="text-xs text-font-detail">• {a.residentName}</span>
                              </div>
                              <ul className="space-y-1">
                                {a.staffNames.map((name, nameIdx) => (
                                  <li key={nameIdx} className="text-sm text-font-base flex items-start">
                                    <span className="text-font-detail mr-2">•</span>
                                    <span>{name}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAssignment(idx)}
                              className="text-error hover:text-error-dark flex-shrink-0"
                              title="Remove assignment"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Evacuation Routes Section */}
                <div className="border border-bd rounded-lg p-6 bg-white">
                  <h4 className="text-lg font-semibold text-font-base mb-6 flex items-center">
                    <i className="fa-solid fa-route text-primary mr-2"></i>
                    Evacuation Routes
                  </h4>
                  
                  {/* Configuration Form */}
                  <div className="mb-6 p-4 bg-bg-subtle rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Route Name</label>
                        <select
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                          value={selectedRouteName}
                          onChange={(e) => setSelectedRouteName(e.target.value)}
                        >
                          <option>Primary Route A</option>
                          <option>Secondary Route B</option>
                          <option>Separation Route C</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Route Flow Description</label>
                        <input
                          type="text"
                          placeholder="e.g., Units A & B → Main Stairwell → Exit A"
                          className="w-full border border-bd rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary bg-white"
                          value={selectedRouteFlow}
                          onChange={(e) => setSelectedRouteFlow(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Status</label>
                        <div className="flex gap-2">
                          <select
                            className="flex-1 border border-bd rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary bg-white"
                            value={selectedRouteStatus}
                            onChange={(e) => setSelectedRouteStatus(e.target.value)}
                          >
                            <option>Available</option>
                            <option>Restricted</option>
                          </select>
                          <button
                            type="button"
                            onClick={handleAddRoute}
                            className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors shadow-sm whitespace-nowrap"
                          >
                            <i className="fa-solid fa-plus mr-2"></i>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Routes List */}
                  <div className="space-y-3">
                    {evacuationRoutes.length === 0 && (
                      <div className="border border-dashed border-bd rounded-lg p-6 text-center">
                        <i className="fa-solid fa-route text-font-detail text-3xl mb-2"></i>
                        <p className="text-sm text-font-detail">No evacuation routes configured</p>
                      </div>
                    )}
                    {evacuationRoutes.map((route, idx) => (
                      <div key={idx} className="border border-bd rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-font-base">{route.routeName}</span>
                            <div className="flex items-center gap-2">
                              <span className={getRouteBadgeClass(route.status)}>{route.status}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveRoute(idx)}
                                className="text-error hover:text-error-dark"
                                title="Remove route"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-font-detail">{route.flow}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                {/* Assembly Points & Safety Zones Section */}
                <div className="border border-bd rounded-lg p-6 bg-white">
                  <h4 className="text-lg font-semibold text-font-base mb-6 flex items-center">
                    <i className="fa-solid fa-location-dot text-primary mr-2"></i>
                    Assembly Points & Safety Zones
                  </h4>
                  
                  {/* Configuration Form */}
                  <div className="mb-6 p-4 bg-bg-subtle rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Assembly Point</label>
                        <select
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                          value={selectedAssemblyPoint}
                          onChange={(e) => setSelectedAssemblyPoint(e.target.value)}
                        >
                          <option>Assembly Point 1</option>
                          <option>Assembly Point 2</option>
                          <option>Assembly Point 3</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Route Type</label>
                        <select
                          className="w-full border border-bd rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary bg-white"
                          value={selectedAssemblyRouteType}
                          onChange={(e) => setSelectedAssemblyRouteType(e.target.value)}
                        >
                          <option>Primary</option>
                          <option>Secondary</option>
                          <option>Separation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Flow / Notes</label>
                        <input
                          type="text"
                          placeholder="e.g. Front Parking Lot, Units A & B"
                          className="w-full border border-bd rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary bg-white"
                          value={selectedAssemblyNotes}
                          onChange={(e) => setSelectedAssemblyNotes(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={handleAddAssembly}
                          className="w-full bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors shadow-sm"
                        >
                          <i className="fa-solid fa-plus mr-2"></i>
                          Add Point
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Assembly Points Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {assemblyPoints.length === 0 && (
                      <div className="col-span-3 border border-dashed border-bd rounded-lg p-6 text-center">
                        <i className="fa-solid fa-location-dot text-font-detail text-3xl mb-2"></i>
                        <p className="text-sm text-font-detail">No assembly points configured</p>
                      </div>
                    )}
                    {assemblyPoints.map((point, idx) => (
                      <div key={idx} className="border border-bd rounded-lg p-5 text-center relative hover:shadow-md transition-shadow bg-white">
                          <button
                            type="button"
                            onClick={() => handleRemoveAssembly(idx)}
                            className="absolute top-2 right-2 text-error hover:text-error-dark"
                            title="Remove assembly point"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                          <div className={`w-12 h-12 ${getAssemblyBadgeClass(point.routeType)} rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <i className={`fa-solid fa-${idx + 1} text-white`}></i>
                          </div>
                          <h5 className="font-medium text-font-base mb-2">{point.pointName}</h5>
                          <div className="text-sm text-font-detail">{point.routeType}<br/>{point.notes}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drill Report */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-clipboard-check text-primary mr-3"></i>
                Fire Drill Report Form
              </h3>
              <button onClick={handlePrint} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light font-medium text-sm">
                <i className="fa-solid fa-print mr-2"></i>
                Print Report
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <h4 className="text-lg font-semibold text-font-base mb-4">Basic Drill Information</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Drill Date</label>
                  <input type="date" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.drillDate} onChange={(e) => setDrillReport({...drillReport, drillDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Drill Time</label>
                  <input type="time" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.drillTime} onChange={(e) => setDrillReport({...drillReport, drillTime: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Drill Type</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.drillType} onChange={(e) => setDrillReport({...drillReport, drillType: e.target.value})}>
                    <option>Scheduled Drill</option>
                    <option>Unannounced Drill</option>
                    <option>Actual Emergency</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-font-base mb-4">Shift & Staff Information</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Shift</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.shift} onChange={(e) => setDrillReport({...drillReport, shift: e.target.value})}>
                    <option>Day Shift (7:00 AM - 3:00 PM)</option>
                    <option>Evening Shift (3:00 PM - 11:00 PM)</option>
                    <option>Night Shift (11:00 PM - 7:00 AM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Shift Supervisor</label>
                  <input type="text" placeholder="Select or enter name" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.shiftSupervisor} onChange={(e) => setDrillReport({...drillReport, shiftSupervisor: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Report Completed By</label>
                  <input type="text" placeholder="Select or enter name" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.reportCompletedBy} onChange={(e) => setDrillReport({...drillReport, reportCompletedBy: e.target.value})} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-font-base mb-4">Performance Metrics</h4>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Total Evacuation Time</label>
                  <input type="text" placeholder="e.g., 4 minutes 30 seconds" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.totalEvacuationTime} onChange={(e) => setDrillReport({...drillReport, totalEvacuationTime: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Weather Conditions</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.weatherConditions} onChange={(e) => setDrillReport({...drillReport, weatherConditions: e.target.value})}>
                    <option>Clear</option>
                    <option>Rainy</option>
                    <option>Snowy</option>
                    <option>Windy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Total Staff Present</label>
                  <input type="number" placeholder="12" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.totalStaffPresent} onChange={(e) => setDrillReport({...drillReport, totalStaffPresent: parseInt(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Total Residents Present</label>
                  <input type="number" placeholder="24" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.totalResidentsPresent} onChange={(e) => setDrillReport({...drillReport, totalResidentsPresent: parseInt(e.target.value) || 0})} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-font-base mb-4">Drill Assessment</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Overall Drill Performance</label>
                  <textarea rows={4} placeholder="Describe overall performance, staff response, resident compliance, coordination effectiveness..." className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.overallPerformance} onChange={(e) => setDrillReport({...drillReport, overallPerformance: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Issues/Bottlenecks Identified</label>
                  <textarea rows={4} placeholder="Detail any delays, blocked routes, equipment issues, communication problems..." className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.issuesIdentified} onChange={(e) => setDrillReport({...drillReport, issuesIdentified: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Recommendations for Improvement</label>
                  <textarea rows={4} placeholder="Suggested improvements, training needs, equipment updates, procedure changes..." className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.recommendations} onChange={(e) => setDrillReport({...drillReport, recommendations: e.target.value})} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-font-base mb-4">Route Performance Analysis</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['Primary Route A', 'Secondary Route B', 'Separation Route C'].map((title) => (
                  <div key={title} className="border border-bd rounded-lg p-4">
                    <h5 className="font-medium text-font-base mb-3">{title}</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-font-detail mb-1">Evacuation Time</label>
                        <input type="text" placeholder={title === 'Primary Route A' ? '3:45' : title === 'Secondary Route B' ? '4:15' : '5:00'} className="w-full border border-bd rounded px-2 py-1 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-font-detail mb-1">Issues Encountered</label>
                        <textarea rows={2} placeholder="Any delays or problems..." className="w-full border border-bd rounded px-2 py-1 text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-font-base mb-4">Digital Signature & Verification</h4>
              <div className="border border-bd rounded-lg p-6 bg-bg-subtle">
                <div className="space-y-4">
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" checked={drillReport.certificationComplete} onChange={(e) => setDrillReport({...drillReport, certificationComplete: e.target.checked})} />
                    <span>I certify that the information provided in this fire drill report is accurate and complete to the best of my knowledge.</span>
                  </label>
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" />
                    <span>I confirm that this drill was conducted in accordance with facility safety protocols and state regulations.</span>
                  </label>
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" />
                    <span>I authorize the submission of this report and understand it will be reviewed by facility administration.</span>
                  </label>
                  <div className="pt-4 border-t border-bd">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Digital Signature</label>
                        <div className="border border-bd rounded-lg p-3 bg-bg-subtle">
                          <div className="text-sm text-font-detail">Digital signature will be generated here</div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Date & Time</label>
                        <input type="datetime-local" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" value={drillReport.signatureDatetime} onChange={(e) => setDrillReport({...drillReport, signatureDatetime: e.target.value})} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button onClick={handleCancelReport} className="px-4 py-2 border border-bd text-font-detail rounded-lg hover:bg-bg-subtle">Cancel</button>
              <button onClick={handleSaveReport} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">Save Drill Report</button>
            </div>
          </div>
        </div>
      )}

      {/* Drill Archive */}
      {activeTab === 'archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-archive text-primary mr-3"></i>
              Fire Drill Archive
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <input 
                  type="text" 
                  placeholder="Search drills..." 
                  className="border border-bd rounded-lg px-3 py-2 text-sm w-64"
                  value={drillSearchQuery}
                  onChange={(e) => setDrillSearchQuery(e.target.value)}
                />
                <select 
                  className="border border-bd rounded-lg px-3 py-2 text-sm"
                  value={drillTypeFilter}
                  onChange={(e) => setDrillTypeFilter(e.target.value)}
                >
                  <option>All Types</option>
                  <option>Scheduled Drill</option>
                  <option>Unannounced Drill</option>
                  <option>Actual Emergency</option>
                </select>
              </div>
              <button onClick={handleExport} className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-light">
                <i className="fa-solid fa-download mr-2"></i>
                Export Archive
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-bg-subtle">
                    <th className="border border-bd p-3 text-left text-sm font-medium text-font-base">Date</th>
                    <th className="border border-bd p-3 text-left text-sm font-medium text-font-base">Time</th>
                    <th className="border border-bd p-3 text-left text-sm font-medium text-font-base">Type</th>
                    <th className="border border-bd p-3 text-left text-sm font-medium text-font-base">Shift</th>
                    <th className="border border-bd p-3 text-left text-sm font-medium text-font-base">Duration</th>
                    <th className="border border-bd p-3 text-left text-sm font-medium text-font-base">Status</th>
                    <th className="border border-bd p-3 text-left text-sm font-medium text-font-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drillReports
                    .filter(drill => {
                      // Filter by type
                      if (drillTypeFilter !== 'All Types' && drill.drillType !== drillTypeFilter) {
                        return false;
                      }
                      // Filter by search query
                      if (drillSearchQuery) {
                        const query = drillSearchQuery.toLowerCase();
                        return (
                          drill.drillDate?.toLowerCase().includes(query) ||
                          drill.drillType?.toLowerCase().includes(query) ||
                          drill.shiftSupervisor?.toLowerCase().includes(query) ||
                          drill.status?.toLowerCase().includes(query)
                        );
                      }
                      return true;
                    })
                    .map((drill) => {
                      const dateFormatted = drill.drillDate ? new Date(drill.drillDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
                      const timeFormatted = drill.drillTime || 'N/A';
                      const statusColor = drill.status === 'Successful' ? 'bg-success' : drill.status === 'Issues Found' ? 'bg-warning' : 'bg-error';
                      
                      return (
                        <tr key={drill.id}>
                          <td className="border border-bd p-3 text-sm">{dateFormatted}</td>
                          <td className="border border-bd p-3 text-sm">{timeFormatted}</td>
                          <td className="border border-bd p-3 text-sm">{drill.drillType}</td>
                          <td className="border border-bd p-3 text-sm">{drill.shift || 'N/A'}</td>
                          <td className="border border-bd p-3 text-sm">{drill.totalEvacuationTime}</td>
                          <td className="border border-bd p-3 text-sm">
                            <span className={`${statusColor} text-white px-2 py-1 rounded text-xs`}>{drill.status}</span>
                          </td>
                          <td className="border border-bd p-3 text-sm">
                            <button className="text-primary hover:underline mr-2" onClick={() => addToast('View drill details coming soon', 'info')}>View</button>
                            <button className="text-primary hover:underline" onClick={() => addToast('Print individual drill coming soon', 'info')}>Print</button>
                          </td>
                        </tr>
                      );
                    })}
                  {drillReports.length === 0 && (
                    <tr>
                      <td colSpan={7} className="border border-bd p-8 text-center text-sm text-font-detail">
                        <i className="fa-solid fa-inbox text-3xl text-font-detail mb-3 block"></i>
                        No drill reports found. Create your first drill report in the &quot;Drill Report&quot; tab.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Floor Plan */}
      {activeTab === 'floor' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-map text-primary mr-3"></i>
                Facility Floor Plan & Exit Routes
              </h3>
              <div className="flex items-center gap-3">
                <button onClick={handleUpdateFloorPlan} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light font-medium text-sm">
                  <i className="fa-solid fa-upload mr-2"></i>
                  Update Floor Plan
                </button>
                <button onClick={handlePrint} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light font-medium text-sm">
                  <i className="fa-solid fa-print mr-2"></i>
                  Print Plan
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <img className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/5ea061d02c-eff4b0701f06055f1bc2.png" alt="facility floor plan with fire exit routes, emergency exits marked in red, assembly points marked with green circles, stairwells and corridors clearly labeled, professional architectural style" />
            </div>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-font-base mb-3">Exit Route Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-error rounded mr-3"></div>
                    <span className="text-sm text-font-base">Primary Exit Routes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-warning rounded mr-3"></div>
                    <span className="text-sm text-font-base">Secondary Exit Routes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-success rounded mr-3"></div>
                    <span className="text-sm text-font-base">Assembly Points</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-font-base mb-3">Plan Details</h4>
                <div className="text-sm text-font-detail space-y-1">
                  <p><strong>Last Updated:</strong> October 1, 2024</p>
                  <p><strong>Scale:</strong> 1:100</p>
                  <p><strong>Total Exits:</strong> 6 exits available</p>
                  <p><strong>Assembly Points:</strong> 3 designated areas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`min-w-[260px] max-w-sm shadow-lg rounded-lg border p-3 flex items-start gap-3 bg-white ${t.tone === 'success' ? 'border-success' : t.tone === 'error' ? 'border-error' : 'border-bd'}`}>
            <i className={`fa-solid ${t.tone === 'success' ? 'fa-circle-check text-success' : t.tone === 'error' ? 'fa-circle-exclamation text-error' : 'fa-circle-info text-primary'} mt-1`}></i>
            <div className="flex-1 text-sm text-font-base">{t.title}</div>
            <button onClick={() => removeToast(t.id)} className="text-font-detail hover:text-font-base">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
