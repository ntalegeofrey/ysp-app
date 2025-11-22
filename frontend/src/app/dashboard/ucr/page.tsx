
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UCRPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'new'>('overview');
  const [programId, setProgramId] = useState<string>('');
  const [programName, setProgramName] = useState<string>('');
  // toasts
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; tone: 'info'|'success'|'error' }>>([]);
  const addToast = (title: string, tone: 'info'|'success'|'error' = 'info') => {
    const id = String(Date.now() + Math.random());
    setToasts(t => [...t, { id, title, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    try { localStorage.setItem('global-toast', JSON.stringify({ title, tone })); } catch {}
  };

  // Duplicate UCR modal
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateReportId, setDuplicateReportId] = useState<number|null>(null);

  const tabBtnBase = 'flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors';
  const tabBtnInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';
  const tabBtnActive = 'border-primary text-primary';

  type Ucr = { id: number|string; reportDate: string; shift?: string; reporterName?: string; status?: string; issuesSummary?: string };
  const [ucrReports, setUcrReports] = useState<Ucr[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [pageIdx, setPageIdx] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [q, setQ] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All Status');
  const loadReports = async (reset?: boolean) => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const params = new URLSearchParams();
      params.set('page', reset ? '0' : String(pageIdx));
      params.set('size', '5');
      if (q && q.trim() !== '') params.set('q', q);
      if (filterDate && filterDate.trim() !== '') params.set('date', filterDate);
      if (filterStatus && filterStatus !== 'All Status' && filterStatus.trim() !== '') params.set('status', filterStatus);
      const r = await fetch(`/api/programs/${programId}/ucr/reports/page?${params}`, { credentials:'include', headers:{ ...(token?{Authorization:`Bearer ${token}`}:{}) } });
      if (!r.ok) return;
      const data = await r.json();
      setUcrReports(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalElements? Math.ceil(data.totalElements / 5) : 0);
      if (reset) setPageIdx(0);
      
      // Load staff names for reporters
      const staffIdsSet = new Set((data.content || []).map((r: any) => r.staffId).filter(Boolean));
      const staffIds = Array.from(staffIdsSet);
      if (staffIds.length > 0) {
        try {
          const staffRes = await fetch(`/api/users/by-ids?ids=${staffIds.join(',')}`, { 
            credentials:'include', 
            headers: { ...(token?{Authorization:`Bearer ${token}`}:{}) } 
          });
          if (staffRes.ok) {
            const staffData = await staffRes.json();
            const nameMap: Record<number, string> = {};
            staffData.forEach((user: any) => {
              nameMap[user.id] = user.fullName || user.email || `User ${user.id}`;
            });
            setStaffNames(prev => ({...prev, ...nameMap}));
          }
        } catch {}
      }
    } catch (e) {
      console.error('loadReports error:', e);
    }
  };

  const statusBadge = (s: string) =>
    s === 'Critical'
      ? 'bg-error text-white'
      : s === 'High'
      ? 'bg-warning text-font-base'
      : s === 'Resolved'
      ? 'bg-success text-white'
      : 'bg-green-100 text-success';

  // Chart data
  const [chartData, setChartData] = useState<{ critical: number[]; high: number[]; medium: number[]; resolved: number[] }>({ critical: new Array(12).fill(0), high: new Array(12).fill(0), medium: new Array(12).fill(0), resolved: new Array(12).fill(0) });
  const loadChartData = async () => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const r = await fetch(`/api/programs/${programId}/ucr/monthly-chart`, { credentials:'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
      if (!r.ok) {
        console.error('Failed to load chart data:', r.status, r.statusText);
        return;
      }
      const d = await r.json();
      console.log('Chart data loaded:', d);
      setChartData({ 
        critical: d.critical || new Array(12).fill(0), 
        high: d.high || new Array(12).fill(0), 
        medium: d.medium || new Array(12).fill(0),
        resolved: d.resolved || new Array(12).fill(0)
      });
    } catch (e) {
      console.error('loadChartData error:', e);
    }
  };

  // Load Highcharts and render the chart; feed series from backend stats if desired later
  useEffect(() => {
    if (activeTab !== 'overview') return;

    function loadScript(src: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const found = Array.from(document.getElementsByTagName('script')).some((s) => s.src === src);
        if (found && (window as any).Highcharts) return resolve();
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load'));
        document.body.appendChild(s);
      });
    }

    async function init() {
      try {
        if (!(window as any).Highcharts) {
          await loadScript('https://code.highcharts.com/highcharts.js');
          await loadScript('https://code.highcharts.com/modules/accessibility.js');
        }
        const Highcharts = (window as any).Highcharts;
        const el = document.getElementById('monthly-status-chart');
        if (!el) return;
        Highcharts.chart('monthly-status-chart', {
          chart: { type: 'column' },
          title: { text: null },
          credits: { enabled: false },
          xAxis: {
            categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            labels: { style: { fontSize: '12px' } },
          },
          yAxis: {
            title: { text: 'Issue Count' },
            labels: { style: { fontSize: '12px' } },
          },
          series: [
            { name: 'Critical Issues', data: chartData.critical, color: '#CD0D0D' },
            { name: 'High Priority', data: chartData.high, color: '#f6c51b' },
            { name: 'Medium Priority', data: chartData.medium, color: '#8AAAC7' },
            { name: 'Resolved', data: chartData.resolved, color: '#10b981' },
          ],
          plotOptions: { column: { pointPadding: 0.2, borderWidth: 0 } },
          tooltip: {
            headerFormat: '<span style="font-size:11px; font-weight:bold">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color}; padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true,
          },
        });
      } catch {}
    }

    init();
  }, [activeTab, chartData]);

  // Resolve selected program and initial load
  useEffect(() => {
    try {
      const spRaw = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
      const sp = spRaw ? JSON.parse(spRaw) as { id?: number|string, name?: string } : null;
      setProgramId(sp?.id ? String(sp.id) : '');
      setProgramName(sp?.name || '');
    } catch {}
  }, []);

  // Stats
  const [stats, setStats] = useState<{ total: number; critical: number; pending: number; monthCount: number }>({ total: 0, critical: 0, pending: 0, monthCount: 0 });
  const loadStats = async () => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const r = await fetch(`/api/programs/${programId}/ucr/stats`, { credentials:'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
      if (!r.ok) {
        console.error('Failed to load stats:', r.status, r.statusText);
        return;
      }
      if (r.ok) {
        const d = await r.json();
        setStats({ total: d.total ?? 0, critical: d.critical ?? 0, pending: d.pending ?? 0, monthCount: d.monthCount ?? 0 });
      }
    } catch {}
  };

  // Load monthly chart data
  // Removed duplicate loadMonthlyChart - using loadChartData instead

  // Open issues summary (Critical/High/Medium)
  type OpenIssue = Ucr;
  const [openIssues, setOpenIssues] = useState<any[]>([]);
  const [persistingIssuesPage, setPersistingIssuesPage] = useState<number>(0);
  const [persistingIssuesPerPage] = useState<number>(6);
  const [staffNames, setStaffNames] = useState<Record<number, string>>({});
  const loadOpenIssues = async () => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const r = await fetch(`/api/programs/${programId}/ucr/open-issues?page=${persistingIssuesPage}&size=${persistingIssuesPerPage}`, { credentials:'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
      console.log('loadOpenIssues response:', r);
      if (!r.ok) {
        console.error('Failed to load open issues:', r.status, r.statusText);
        return;
      }
      if (r.ok) {
        const d = await r.json();
        console.log('loadOpenIssues data:', d);
        setOpenIssues(d.content || []);
      }
    } catch (e) {
      console.error('loadOpenIssues error:', e);
    }
  };

  const resolveIssue = async (reportId: number, fieldName: string) => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const r = await fetch(`/api/programs/${programId}/ucr/reports/${reportId}/resolve`, { 
        method:'POST', 
        credentials:'include', 
        headers: { 'Accept':'application/json', 'Content-Type':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) },
        body: JSON.stringify({ issueField: fieldName })
      });
      if (!r.ok) {
        if (r.status === 403) {
          addToast('You do not have permission to resolve this issue.', 'error');
        } else if (r.status === 423) {
          addToast('This UCR can no longer be edited (past day of submission).', 'error');
        } else {
          addToast(`Failed to resolve issue: ${r.status}`, 'error');
        }
        return;
      }
      addToast('Issue marked as resolved.', 'success');
      await Promise.all([loadOpenIssues(), loadStats(), loadChartData(), loadReports(true)]);
    } catch {
      addToast('Failed to resolve issue.', 'error');
    }
  };

  const printReport = (report: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      addToast('Please allow popups to print reports', 'error');
      return;
    }

    const dateStr = report.reportDate ? new Date(report.reportDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
    
    // Helper functions
    const getStatusDisplay = (status: string | null) => {
      if (!status) return '<span style="color: #9ca3af;">Not Checked</span>';
      return status === 'ok' ? '<span style="color: #10b981; font-weight: bold;">✓ OK</span>' : '<span style="color: #dc2626; font-weight: bold;">⚠ Issue</span>';
    };
    
    const getPriorityBadge = (priority: string) => {
      if (priority === 'Critical') return '<span style="background: #dc2626; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">CRITICAL</span>';
      if (priority === 'High') return '<span style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">HIGH</span>';
      if (priority === 'Medium') return '<span style="background: #eab308; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">MEDIUM</span>';
      return '<span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">NORMAL</span>';
    };

    // Pre-compute all values
    const secRadiosStat = getStatusDisplay(report.securityRadiosStatus);
    const secRadiosPri = getPriorityBadge(report.securityRadiosCondition || 'Normal');
    const secFlashlightsStat = getStatusDisplay(report.securityFlashlightsStatus);
    const secFlashlightsPri = getPriorityBadge(report.securityFlashlightsCondition || 'Normal');
    const secMetalStat = getStatusDisplay(report.securityMetalDetectorStatus);
    const secMetalPri = getPriorityBadge(report.securityMetalDetectorCondition || 'Normal');
    const secKeysStat = getStatusDisplay(report.securityBigSetKeysStatus);
    const secKeysPri = getPriorityBadge(report.securityBigSetKeysCondition || 'Normal');
    const secAidStat = getStatusDisplay(report.securityFirstAidKitsStatus);
    const secAidPri = getPriorityBadge(report.securityFirstAidKitsCondition || 'Normal');
    const secCompStat = getStatusDisplay(report.securityDeskComputerStatus);
    const secCompPri = getPriorityBadge(report.securityDeskComputerCondition || 'Normal');
    const adminMeetStat = getStatusDisplay(report.adminMeetingRoomsLockedStatus);
    const adminMeetPri = getPriorityBadge(report.adminMeetingRoomsLockedCondition || 'Normal');
    const adminDoorsStat = getStatusDisplay(report.adminDoorsSecureStatus);
    const adminDoorsPri = getPriorityBadge(report.adminDoorsSecureCondition || 'Normal');
    const infraBackStat = getStatusDisplay(report.infraBackDoorStatus);
    const infraBackPri = getPriorityBadge(report.infraBackDoorCondition || 'Normal');
    const infraEntranceStat = getStatusDisplay(report.infraEntranceExitDoorsStatus);
    const infraEntrancePri = getPriorityBadge(report.infraEntranceExitDoorsCondition || 'Normal');
    const infraSmokeStat = getStatusDisplay(report.infraSmokeDetectorsStatus);
    const infraSmokePri = getPriorityBadge(report.infraSmokeDetectorsCondition || 'Normal');
    const infraWindowsStat = getStatusDisplay(report.infraWindowsSecureStatus);
    const infraWindowsPri = getPriorityBadge(report.infraWindowsSecureCondition || 'Normal');
    const infraLaundryStat = getStatusDisplay(report.infraLaundryAreaStatus);
    const infraLaundryPri = getPriorityBadge(report.infraLaundryAreaCondition || 'Normal');
    const infraFireExtStat = getStatusDisplay(report.infraFireExtinguishersStatus);
    const infraFireExtPri = getPriorityBadge(report.infraFireExtinguishersCondition || 'Normal');
    const infraAlarmStat = getStatusDisplay(report.infraFireAlarmStatus);
    const infraAlarmPri = getPriorityBadge(report.infraFireAlarmCondition || 'Normal');
    
    const getSatisfactoryDisplay = (status: string | null) => {
      if (!status) return '<span style="color: #9ca3af;">Not Checked</span>';
      return status === 'satisfactory' ? '<span style="color: #10b981; font-weight: bold;">✓ Satisfactory</span>' : '<span style="color: #dc2626; font-weight: bold;">✗ Unsatisfactory</span>';
    };
    
    const choreWorkStat = getSatisfactoryDisplay(report.choreWorkspaceCleanStatus);
    const choreBathStat = getSatisfactoryDisplay(report.choreStaffBathroomStatus);
    const choreDayStat = getSatisfactoryDisplay(report.choreDayroomCleanStatus);
    const choreLaundryStat = getSatisfactoryDisplay(report.choreLaundryRoomCleanStatus);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>UCR Report - ${dateStr}</title>
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
            border-bottom: 3px solid #1e40af;
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
            color: #1e40af;
            margin-bottom: 3px;
          }
          .title-section p {
            font-size: 13px;
            color: #666;
          }
          .report-info {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
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
            min-width: 80px;
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
            color: #1e40af;
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
            <img src="/logo.png" alt="DYS Logo" class="logo" onerror="this.style.display='none'"/>
            <div class="title-section">
              <h1>Unit Condition Report</h1>
              <p>Department of Youth Services</p>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 18px; font-weight: bold; color: #1e40af;">${programName || 'Program'}</div>
            <div style="font-size: 12px; color: #666; margin-top: 3px;">Generated: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="report-info">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Report Date:</span>
              <span class="info-value">${dateStr}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Shift:</span>
              <span class="info-value">${report.shiftTime || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Reporter:</span>
              <span class="info-value">${report.staffName || staffNames[report.staffId] || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Security Equipment & Procedures</h2>
          <table>
            <tr>
              <th style="width: 40%;">Item</th>
              <th style="width: 15%;">Status</th>
              <th style="width: 15%;">Priority</th>
              <th style="width: 30%;">Comments</th>
            </tr>
            <tr>
              <td>11 Radios functional and charging</td>
              <td>${secRadiosStat}</td>
              <td>${secRadiosPri}</td>
              <td>${report.securityRadiosComments || '-'}</td>
            </tr>
            <tr>
              <td>2 Flashlights functional</td>
              <td>${secFlashlightsStat}</td>
              <td>${secFlashlightsPri}</td>
              <td>${report.securityFlashlightsComments || '-'}</td>
            </tr>
            <tr>
              <td>Garrett metal detector functional</td>
              <td>${secMetalStat}</td>
              <td>${secMetalPri}</td>
              <td>${report.securityMetalDetectorComments || '-'}</td>
            </tr>
            <tr>
              <td>Big Set keys & keys present and secure</td>
              <td>${secKeysStat}</td>
              <td>${secKeysPri}</td>
              <td>${report.securityBigSetKeysComments || '-'}</td>
            </tr>
            <tr>
              <td>First Aid kits available and stocked</td>
              <td>${secAidStat}</td>
              <td>${secAidPri}</td>
              <td>${report.securityFirstAidKitsComments || '-'}</td>
            </tr>
            <tr>
              <td>Desk Computer/Monitor functional</td>
              <td>${secCompStat}</td>
              <td>${secCompPri}</td>
              <td>${report.securityDeskComputerComments || '-'}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h2 class="section-title">Administrative Offices</h2>
          <table>
            <tr>
              <th style="width: 40%;">Item</th>
              <th style="width: 15%;">Status</th>
              <th style="width: 15%;">Priority</th>
              <th style="width: 30%;">Comments</th>
            </tr>
            <tr>
              <td>Meeting Rooms locked</td>
              <td>${adminMeetStat}</td>
              <td>${adminMeetPri}</td>
              <td>${report.adminMeetingRoomsLockedComments || '-'}</td>
            </tr>
            <tr>
              <td>Administration doors locked and secure</td>
              <td>${adminDoorsStat}</td>
              <td>${adminDoorsPri}</td>
              <td>${report.adminDoorsSecureComments || '-'}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h2 class="section-title">Facility Infrastructure</h2>
          <table>
            <tr>
              <th style="width: 40%;">Item</th>
              <th style="width: 15%;">Status</th>
              <th style="width: 15%;">Priority</th>
              <th style="width: 30%;">Comments</th>
            </tr>
            <tr>
              <td>Back door locked and secure</td>
              <td>${infraBackStat}</td>
              <td>${infraBackPri}</td>
              <td>${report.infraBackDoorComments || '-'}</td>
            </tr>
            <tr>
              <td>Entrance and exit doors locked and secured</td>
              <td>${infraEntranceStat}</td>
              <td>${infraEntrancePri}</td>
              <td>${report.infraEntranceExitDoorsComments || '-'}</td>
            </tr>
            <tr>
              <td>Smoke detectors functional</td>
              <td>${infraSmokeStat}</td>
              <td>${infraSmokePri}</td>
              <td>${report.infraSmokeDetectorsComments || '-'}</td>
            </tr>
            <tr>
              <td>All windows secure</td>
              <td>${infraWindowsStat}</td>
              <td>${infraWindowsPri}</td>
              <td>${report.infraWindowsSecureComments || '-'}</td>
            </tr>
            <tr>
              <td>Laundry area clean and orderly</td>
              <td>${infraLaundryStat}</td>
              <td>${infraLaundryPri}</td>
              <td>${report.infraLaundryAreaComments || '-'}</td>
            </tr>
            <tr>
              <td>Fire extinguishers in place/charged</td>
              <td>${infraFireExtStat}</td>
              <td>${infraFireExtPri}</td>
              <td>${report.infraFireExtinguishersComments || '-'}</td>
            </tr>
            <tr>
              <td>Fire alarm functional</td>
              <td>${infraAlarmStat}</td>
              <td>${infraAlarmPri}</td>
              <td>${report.infraFireAlarmComments || '-'}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h2 class="section-title">Staff Chores</h2>
          <table>
            <tr>
              <th style="width: 50%;">Item</th>
              <th style="width: 20%;">Status</th>
              <th style="width: 30%;">Comments</th>
            </tr>
            <tr>
              <td>Workspace clean (common area, desk)</td>
              <td>${choreWorkStat}</td>
              <td>${report.choreWorkspaceCleanComments || '-'}</td>
            </tr>
            <tr>
              <td>Staff bathroom cleaned and mopped</td>
              <td>${choreBathStat}</td>
              <td>${report.choreStaffBathroomComments || '-'}</td>
            </tr>
            <tr>
              <td>Dayroom cleaned and mopped</td>
              <td>${choreDayStat}</td>
              <td>${report.choreDayroomCleanComments || '-'}</td>
            </tr>
            <tr>
              <td>Laundry room cleaned and mopped</td>
              <td>${choreLaundryStat}</td>
              <td>${report.choreLaundryRoomCleanComments || '-'}</td>
            </tr>
          </table>
        </div>

        ${report.roomSearches && report.roomSearches.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Resident Room Searches</h2>
            <table>
              <tr>
                <th style="width: 30%;">Room Number</th>
                <th style="width: 70%;">Search Comments</th>
              </tr>
              ${report.roomSearches.map((search: any) => 
                '<tr><td>' + (search.room_number || search.roomNumber || '-') + '</td><td>' + (search.search_comments || search.searchComments || '-') + '</td></tr>'
              ).join('')}
            </table>
          </div>
        ` : ''}

        ${report.additionalComments ? `
          <div class="section">
            <h2 class="section-title">Additional Comments / Notes</h2>
            <div style="background: #f9fafb; padding: 12px; border-radius: 6px; line-height: 1.6; border: 1px solid #e5e7eb;">
              ${report.additionalComments}
            </div>
          </div>
        ` : ''}

        <div class="footer">
          <p>This report was generated by the Youth Supervision Platform</p>
          <p>Department of Youth Services - Confidential Document</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  useEffect(() => { if (programId) { loadReports(true); loadStats(); loadOpenIssues(); loadChartData(); } }, [programId]);
  useEffect(() => { if (programId) { loadReports(); } }, [pageIdx]);

  // SSE live refresh
  useEffect(() => {
    if (!programId) return;
    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/events');
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data || '{}') as { type?: string; programId?: string|number };
          if (!data?.type) return;
          const pid = data?.programId ? String(data.programId) : '';
          if (pid && pid !== programId) return;
          if (data.type === 'programs.ucr.created' || data.type === 'programs.ucr.updated') { loadReports(); loadStats(); loadOpenIssues(); loadChartData(); }
        } catch {}
      };
    } catch {}
    return () => { try { es && es.close(); } catch {} };
  }, [programId]);

  // New report minimal state (without changing design)
  const [reportDate, setReportDate] = useState<string>('');
  const [shiftVal, setShiftVal] = useState<string>('7:00-3:00');
  const [comments, setComments] = useState<string>('');
  const [staffName, setStaffName] = useState<string>('');
  const [staffId, setStaffId] = useState<number | null>(null);

  // Form data state for all toggles and inputs
  const [formData, setFormData] = useState<any>({
    securityEquipment: [
      { status: 'ok', comments: '', priority: 'Normal' }, // 11 Radios
      { status: 'ok', comments: '', priority: 'Normal' }, // 2 Flashlights  
      { status: null, comments: '', priority: 'Normal' }, // Garrett metal detector
      { status: null, comments: '', priority: 'Normal' }, // Big Set keys
      { status: 'ok', comments: '', priority: 'Normal' }, // First Aid kits
      { status: null, comments: '', priority: 'Normal' }, // Desk Computer
    ],
    hardwareSecure: { value: null, comments: '' },
    searchesCompleted: { value: null, startTime: '', endTime: '' },
    fireDrillsCompleted: { value: null, comments: '' },
    emergencyLighting: { value: null, comments: '' },
    notifications: [{ value: null, priority: 'Normal', comments: '' }],
    adminOffices: [
      { status: null, priority: 'Normal', comments: '' }, // Meeting Rooms
      { status: null, priority: 'Normal', comments: '' }, // Admin doors
    ],
    facilityInfrastructure: [
      { status: null, priority: 'Normal', comments: '' }, // Back door
      { status: null, priority: 'Normal', comments: '' }, // Entrance/Exit doors
      { status: null, priority: 'Normal', comments: '' }, // Smoke detectors
      { status: null, priority: 'Normal', comments: '' }, // Windows secure
      { status: null, priority: 'Normal', comments: '' }, // Laundry area
      { status: null, priority: 'Normal', comments: '' }, // Fire extinguishers
      { status: null, priority: 'Normal', comments: '' }, // Fire alarm system
    ],
    staffChores: [
      { status: 'satisfactory', comments: '' }, // Workspace clean
      { status: 'satisfactory', comments: '' }, // Staff bathroom
      { status: 'satisfactory', comments: '' }, // Dayroom
      { status: 'satisfactory', comments: '' }, // Laundry room
    ],
    // Generic resident room searches: array of { room, comments }
    roomSearches: [] as Array<{ room: string; comments: string }>,
  });

  // Local inputs for adding room search rows
  const [roomSearchRoom, setRoomSearchRoom] = useState<string>('');
  const [roomSearchComments, setRoomSearchComments] = useState<string>('');

  const addRoomSearchRow = () => {
    const room = (roomSearchRoom || '').trim();
    if (!room) return;
    const commentsVal = (roomSearchComments || '').trim();
    setFormData((prev: any) => ({
      ...prev,
      roomSearches: [
        ...(Array.isArray(prev.roomSearches) ? prev.roomSearches : []),
        { room, comments: commentsVal },
      ],
    }));
    setRoomSearchRoom('');
    setRoomSearchComments('');
  };
  useEffect(() => {
    // auto-fill staff from /auth/me
    const run = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const r = await fetch('/api/auth/me', { credentials:'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
        if (r.ok) {
          const me = await r.json();
          setStaffName(me.fullName || me.email || '');
          setStaffId(me.id || null);
        }
      } catch {}
    };
    run();
  }, []);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const submitNew = async () => {
    if (!programId) { addToast('No program selected', 'error'); return; }
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // Determine status based on form data priorities
      let reportStatus = 'Pending Review';
      const hasIssues = formData.securityEquipment?.some((item: any) => item.status === 'issue') ||
                       formData.hardwareSecure?.value === false ||
                       formData.searchesCompleted?.value === false ||
                       formData.fireDrillsCompleted?.value === false ||
                       formData.emergencyLighting?.value === false ||
                       formData.notifications?.some((item: any) => item.value === false) ||
                       formData.adminOffices?.some((item: any) => item.status === 'issue') ||
                       formData.facilityInfrastructure?.some((item: any) => item.status === 'issue');
      
      if (hasIssues) {
        // Check for Critical priority items across all sections
        const hasCritical = formData.securityEquipment?.some((item: any) => item.status === 'issue' && item.priority === 'Critical') ||
                           formData.notifications?.some((item: any) => item.value === false && item.priority === 'Critical') ||
                           formData.adminOffices?.some((item: any) => item.status === 'issue' && item.priority === 'Critical') ||
                           formData.facilityInfrastructure?.some((item: any) => item.status === 'issue' && item.priority === 'Critical');
        
        if (hasCritical) {
          reportStatus = 'Critical';
        } else {
          // Check for High priority items
          const hasHigh = formData.securityEquipment?.some((item: any) => item.status === 'issue' && item.priority === 'High') ||
                         formData.notifications?.some((item: any) => item.value === false && item.priority === 'High Priority') ||
                         formData.adminOffices?.some((item: any) => item.status === 'issue' && item.priority === 'High Priority') ||
                         formData.facilityInfrastructure?.some((item: any) => item.status === 'issue' && item.priority === 'High Priority');
          reportStatus = hasHigh ? 'High' : 'Medium';
        }
      }

      // Map formData to backend field names
      const payload: any = {
        reportDate: reportDate || new Date().toISOString().slice(0,10),
        shiftTime: shiftVal,
        staffId: staffId, // reporter ID for backend
        staffName: staffName, // reporter name for display
        
        // Security Equipment (6 items)
        securityRadiosStatus: formData.securityEquipment?.[0]?.status || null,
        securityRadiosCondition: formData.securityEquipment?.[0]?.priority || 'Normal',
        securityRadiosComments: formData.securityEquipment?.[0]?.comments || null,
        
        securityFlashlightsStatus: formData.securityEquipment?.[1]?.status || null,
        securityFlashlightsCondition: formData.securityEquipment?.[1]?.priority || 'Normal',
        securityFlashlightsComments: formData.securityEquipment?.[1]?.comments || null,
        
        securityMetalDetectorStatus: formData.securityEquipment?.[2]?.status || null,
        securityMetalDetectorCondition: formData.securityEquipment?.[2]?.priority || 'Normal',
        securityMetalDetectorComments: formData.securityEquipment?.[2]?.comments || null,
        
        securityBigSetKeysStatus: formData.securityEquipment?.[3]?.status || null,
        securityBigSetKeysCondition: formData.securityEquipment?.[3]?.priority || 'Normal',
        securityBigSetKeysComments: formData.securityEquipment?.[3]?.comments || null,
        
        securityFirstAidKitsStatus: formData.securityEquipment?.[4]?.status || null,
        securityFirstAidKitsCondition: formData.securityEquipment?.[4]?.priority || 'Normal',
        securityFirstAidKitsComments: formData.securityEquipment?.[4]?.comments || null,
        
        securityDeskComputerStatus: formData.securityEquipment?.[5]?.status || null,
        securityDeskComputerCondition: formData.securityEquipment?.[5]?.priority || 'Normal',
        securityDeskComputerComments: formData.securityEquipment?.[5]?.comments || null,
        
        // Hardware/Searches
        hardwareSecureYesNo: formData.hardwareSecure?.value === true ? 'Yes' : formData.hardwareSecure?.value === false ? 'No' : null,
        hardwareSecureComments: formData.hardwareSecure?.comments || null,
        
        searchesCompletedYesNo: formData.searchesCompleted?.value === true ? 'Yes' : formData.searchesCompleted?.value === false ? 'No' : null,
        
        fireDrillsCompletedYesNo: formData.fireDrillsCompleted?.value === true ? 'Yes' : formData.fireDrillsCompleted?.value === false ? 'No' : null,
        fireDrillsCompletedComments: formData.fireDrillsCompleted?.comments || null,
        
        emergencyLightingYesNo: formData.emergencyLighting?.value === true ? 'Yes' : formData.emergencyLighting?.value === false ? 'No' : null,
        emergencyLightingComments: formData.emergencyLighting?.comments || null,
        
        // Notifications
        notificationsOppositeGenderYesNo: formData.notifications?.[0]?.value === true ? 'Yes' : formData.notifications?.[0]?.value === false ? 'No' : null,
        notificationsOppositeGenderCondition: formData.notifications?.[0]?.priority || 'Normal',
        notificationsOppositeGenderComments: formData.notifications?.[0]?.comments || null,
        
        // Admin Offices (2 items)
        adminMeetingRoomsLockedStatus: formData.adminOffices?.[0]?.status || null,
        adminMeetingRoomsLockedCondition: formData.adminOffices?.[0]?.priority || 'Normal',
        adminMeetingRoomsLockedComments: formData.adminOffices?.[0]?.comments || null,
        
        adminDoorsSecureStatus: formData.adminOffices?.[1]?.status || null,
        adminDoorsSecureCondition: formData.adminOffices?.[1]?.priority || 'Normal',
        adminDoorsSecureComments: formData.adminOffices?.[1]?.comments || null,
        
        // Facility Infrastructure (7 items)
        infraBackDoorStatus: formData.facilityInfrastructure?.[0]?.status || null,
        infraBackDoorCondition: formData.facilityInfrastructure?.[0]?.priority || 'Normal',
        infraBackDoorComments: formData.facilityInfrastructure?.[0]?.comments || null,
        
        infraEntranceExitDoorsStatus: formData.facilityInfrastructure?.[1]?.status || null,
        infraEntranceExitDoorsCondition: formData.facilityInfrastructure?.[1]?.priority || 'Normal',
        infraEntranceExitDoorsComments: formData.facilityInfrastructure?.[1]?.comments || null,
        
        infraSmokeDetectorsStatus: formData.facilityInfrastructure?.[2]?.status || null,
        infraSmokeDetectorsCondition: formData.facilityInfrastructure?.[2]?.priority || 'Normal',
        infraSmokeDetectorsComments: formData.facilityInfrastructure?.[2]?.comments || null,
        
        infraWindowsSecureStatus: formData.facilityInfrastructure?.[3]?.status || null,
        infraWindowsSecureCondition: formData.facilityInfrastructure?.[3]?.priority || 'Normal',
        infraWindowsSecureComments: formData.facilityInfrastructure?.[3]?.comments || null,
        
        infraLaundryAreaStatus: formData.facilityInfrastructure?.[4]?.status || null,
        infraLaundryAreaCondition: formData.facilityInfrastructure?.[4]?.priority || 'Normal',
        infraLaundryAreaComments: formData.facilityInfrastructure?.[4]?.comments || null,
        
        infraFireExtinguishersStatus: formData.facilityInfrastructure?.[5]?.status || null,
        infraFireExtinguishersCondition: formData.facilityInfrastructure?.[5]?.priority || 'Normal',
        infraFireExtinguishersComments: formData.facilityInfrastructure?.[5]?.comments || null,
        
        infraFireAlarmStatus: formData.facilityInfrastructure?.[6]?.status || null,
        infraFireAlarmCondition: formData.facilityInfrastructure?.[6]?.priority || 'Normal',
        infraFireAlarmComments: formData.facilityInfrastructure?.[6]?.comments || null,
        
        // Staff Chores (4 items)
        choreWorkspaceCleanStatus: formData.staffChores?.[0]?.status || null,
        choreWorkspaceCleanComments: formData.staffChores?.[0]?.comments || null,
        
        choreStaffBathroomStatus: formData.staffChores?.[1]?.status || null,
        choreStaffBathroomComments: formData.staffChores?.[1]?.comments || null,
        
        choreDayroomCleanStatus: formData.staffChores?.[2]?.status || null,
        choreDayroomCleanComments: formData.staffChores?.[2]?.comments || null,
        
        choreLaundryRoomCleanStatus: formData.staffChores?.[3]?.status || null,
        choreLaundryRoomCleanComments: formData.staffChores?.[3]?.comments || null,
        
        // Room searches as array
        roomSearches: formData.roomSearches?.map((rs: any) => ({
          room_number: rs.room,
          search_comments: rs.comments
        })) || [],
        
        // Additional comments
        additionalComments: comments || null,
        reportStatus: reportStatus,
      };
      
      const url = editingId ? `/api/programs/${programId}/ucr/reports/${editingId}` : `/api/programs/${programId}/ucr/reports`;
      const method = editingId ? 'PATCH' : 'POST';
      const r = await fetch(url, { method, credentials:'include', headers: { 'Content-Type':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify(payload) });
      if (!r.ok) {
        if (r.status === 403) {
          addToast('Permission denied. Try logging out and back in, or contact admin to assign you to this program.', 'error');
        } else if (r.status === 409) {
          try {
            const errData = await r.json();
            setDuplicateReportId(errData.existingId || null);
            setShowDuplicateModal(true);
          } catch {
            addToast('UCR report already exists for this date and shift.', 'error');
          }
        } else if (r.status === 423) {
          addToast('This UCR can no longer be edited (past day of submission).', 'error');
        } else {
          addToast(`Failed to submit UCR: ${r.status}`, 'error');
        }
        return;
      }
      addToast(editingId ? 'UCR updated' : 'UCR submitted for review', 'success');
      setEditingId(null);
      setComments(''); setReportDate(''); setShiftVal('7:00-3:00');
      // Refresh archive and stats
      loadReports(true);
      loadStats();
      loadOpenIssues();
      loadChartData();
      // Reset form data to initial state
      setFormData({
        securityEquipment: [
          { status: 'ok', comments: '', priority: 'Normal' },
          { status: 'ok', comments: '', priority: 'Normal' },
          { status: null, comments: '', priority: 'Normal' },
          { status: null, comments: '', priority: 'Normal' },
          { status: 'ok', comments: '', priority: 'Normal' },
          { status: null, comments: '', priority: 'Normal' },
        ],
        hardwareSecure: { value: null, comments: '' },
        searchesCompleted: { value: null, startTime: '', endTime: '' },
        fireDrillsCompleted: { value: null, comments: '' },
        emergencyLighting: { value: null, comments: '' },
        notifications: [{ value: null, priority: 'Normal', comments: '' }],
        adminOffices: [
          { status: null, priority: 'Normal', comments: '' },
          { status: null, priority: 'Normal', comments: '' },
        ],
        facilityInfrastructure: [
          { status: null, priority: 'Normal', comments: '' },
          { status: null, priority: 'Normal', comments: '' },
          { status: null, priority: 'Normal', comments: '' },
          { status: null, priority: 'Normal', comments: '' },
          { status: null, priority: 'Normal', comments: '' },
          { status: null, priority: 'Normal', comments: '' },
          { status: null, priority: 'Normal', comments: '' },
        ],
        staffChores: [
          { status: 'satisfactory', comments: '' },
          { status: 'satisfactory', comments: '' },
          { status: 'satisfactory', comments: '' },
          { status: 'satisfactory', comments: '' },
        ],
        roomSearches: [],
      });
      await Promise.all([loadReports(true), loadStats()]);
    } catch { addToast('Failed to submit UCR', 'error'); }
  };

  // View modal
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  // Helper to extract ALL individual issues from a report
  const getAllIssues = (report: any): Array<{label: string, fieldName: string, condition: string, comment: string, reportId: number, reportDate: string, shiftTime: string}> => {
    const fields = [
      { fieldName: 'securityRadios', condition: report.securityRadiosCondition, comment: report.securityRadiosComments, label: 'Security Radios' },
      { fieldName: 'securityFlashlights', condition: report.securityFlashlightsCondition, comment: report.securityFlashlightsComments, label: 'Security Flashlights' },
      { fieldName: 'securityMetalDetector', condition: report.securityMetalDetectorCondition, comment: report.securityMetalDetectorComments, label: 'Metal Detector' },
      { fieldName: 'securityBigSetKeys', condition: report.securityBigSetKeysCondition, comment: report.securityBigSetKeysComments, label: 'Security Keys' },
      { fieldName: 'securityFirstAidKits', condition: report.securityFirstAidKitsCondition, comment: report.securityFirstAidKitsComments, label: 'First Aid Kits' },
      { fieldName: 'securityDeskComputer', condition: report.securityDeskComputerCondition, comment: report.securityDeskComputerComments, label: 'Desk Computer' },
      { fieldName: 'adminMeetingRoomsLocked', condition: report.adminMeetingRoomsLockedCondition, comment: report.adminMeetingRoomsLockedComments, label: 'Meeting Rooms Locked' },
      { fieldName: 'adminDoorsSecure', condition: report.adminDoorsSecureCondition, comment: report.adminDoorsSecureComments, label: 'Admin Doors Secure' },
      { fieldName: 'infraBackDoor', condition: report.infraBackDoorCondition, comment: report.infraBackDoorComments, label: 'Back Door' },
      { fieldName: 'infraEntranceExitDoors', condition: report.infraEntranceExitDoorsCondition, comment: report.infraEntranceExitDoorsComments, label: 'Entrance/Exit Doors' },
      { fieldName: 'infraSmokeDetectors', condition: report.infraSmokeDetectorsCondition, comment: report.infraSmokeDetectorsComments, label: 'Smoke Detectors' },
      { fieldName: 'infraWindowsSecure', condition: report.infraWindowsSecureCondition, comment: report.infraWindowsSecureComments, label: 'Windows Secure' },
      { fieldName: 'infraLaundryArea', condition: report.infraLaundryAreaCondition, comment: report.infraLaundryAreaComments, label: 'Laundry Area' },
      { fieldName: 'infraFireExtinguishers', condition: report.infraFireExtinguishersCondition, comment: report.infraFireExtinguishersComments, label: 'Fire Extinguishers' },
      { fieldName: 'infraFireAlarm', condition: report.infraFireAlarmCondition, comment: report.infraFireAlarmComments, label: 'Fire Alarm' },
    ];
    
    const resolvedIssues = report.resolvedIssues ? report.resolvedIssues.split(',') : [];
    const issues: Array<{label: string, fieldName: string, condition: string, comment: string, reportId: number, reportDate: string, shiftTime: string}> = [];
    fields.forEach(f => {
      if (f.condition && (f.condition.includes('Critical') || f.condition.includes('High') || f.condition.includes('Medium'))) {
        // Only include if not resolved
        if (!resolvedIssues.includes(f.fieldName)) {
          issues.push({
            label: f.label,
            fieldName: f.fieldName,
            condition: f.condition,
            comment: f.comment || 'No comment provided',
            reportId: report.id,
            reportDate: report.reportDate,
            shiftTime: report.shiftTime
          });
        }
      }
    });
    return issues;
  };
  
  // Helper to get first issue label for table display
  const getIssueLabel = (report: any): string => {
    const issues = getAllIssues(report);
    return issues.length > 0 ? (issues[0].comment || `${issues[0].label} - ${issues[0].condition}`) : 'No issues reported';
  };

  const onView = async (id: string|number, asEdit?: boolean) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const r = await fetch(`/api/programs/${programId}/ucr/reports/${id}`, { credentials:'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
      if (!r.ok) return;
      const d = await r.json();
      setViewData(d);
      if (asEdit) {
        // Prefill form for editing
        setReportDate(d.reportDate ? String(d.reportDate).slice(0,10) : '');
        setShiftVal(d.shiftTime || '7:00-3:00');
        setComments(d.additionalComments || '');
        setStaffName(d.staffId ? String(d.staffId) : '');
        
        // Map all explicit fields back to form structure
        const roomSearches = d.roomSearches ? (typeof d.roomSearches === 'string' ? JSON.parse(d.roomSearches) : d.roomSearches) : [];
        
        setFormData({
          securityEquipment: [
            { status: d.securityRadiosStatus, priority: d.securityRadiosCondition, comments: d.securityRadiosComments },
            { status: d.securityFlashlightsStatus, priority: d.securityFlashlightsCondition, comments: d.securityFlashlightsComments },
            { status: d.securityMetalDetectorStatus, priority: d.securityMetalDetectorCondition, comments: d.securityMetalDetectorComments },
            { status: d.securityBigSetKeysStatus, priority: d.securityBigSetKeysCondition, comments: d.securityBigSetKeysComments },
            { status: d.securityFirstAidKitsStatus, priority: d.securityFirstAidKitsCondition, comments: d.securityFirstAidKitsComments },
            { status: d.securityDeskComputerStatus, priority: d.securityDeskComputerCondition, comments: d.securityDeskComputerComments },
          ],
          hardwareSecure: { value: d.hardwareSecureYesNo === 'Yes' ? true : d.hardwareSecureYesNo === 'No' ? false : null, comments: d.hardwareSecureComments },
          searchesCompleted: { value: d.searchesCompletedYesNo === 'Yes' ? true : d.searchesCompletedYesNo === 'No' ? false : null },
          fireDrillsCompleted: { value: d.fireDrillsCompletedYesNo === 'Yes' ? true : d.fireDrillsCompletedYesNo === 'No' ? false : null, comments: d.fireDrillsCompletedComments },
          emergencyLighting: { value: d.emergencyLightingYesNo === 'Yes' ? true : d.emergencyLightingYesNo === 'No' ? false : null, comments: d.emergencyLightingComments },
          notifications: [
            { value: d.notificationsOppositeGenderYesNo === 'Yes' ? true : d.notificationsOppositeGenderYesNo === 'No' ? false : null, priority: d.notificationsOppositeGenderCondition, comments: d.notificationsOppositeGenderComments },
          ],
          adminOffices: [
            { status: d.adminMeetingRoomsLockedStatus, priority: d.adminMeetingRoomsLockedCondition, comments: d.adminMeetingRoomsLockedComments },
            { status: d.adminDoorsSecureStatus, priority: d.adminDoorsSecureCondition, comments: d.adminDoorsSecureComments },
          ],
          facilityInfrastructure: [
            { status: d.infraBackDoorStatus, priority: d.infraBackDoorCondition, comments: d.infraBackDoorComments },
            { status: d.infraEntranceExitDoorsStatus, priority: d.infraEntranceExitDoorsCondition, comments: d.infraEntranceExitDoorsComments },
            { status: d.infraSmokeDetectorsStatus, priority: d.infraSmokeDetectorsCondition, comments: d.infraSmokeDetectorsComments },
            { status: d.infraWindowsSecureStatus, priority: d.infraWindowsSecureCondition, comments: d.infraWindowsSecureComments },
            { status: d.infraLaundryAreaStatus, priority: d.infraLaundryAreaCondition, comments: d.infraLaundryAreaComments },
            { status: d.infraFireExtinguishersStatus, priority: d.infraFireExtinguishersCondition, comments: d.infraFireExtinguishersComments },
            { status: d.infraFireAlarmStatus, priority: d.infraFireAlarmCondition, comments: d.infraFireAlarmComments },
          ],
          staffChores: [
            { status: d.choreWorkspaceCleanStatus, comments: d.choreWorkspaceCleanComments },
            { status: d.choreStaffBathroomStatus, comments: d.choreStaffBathroomComments },
            { status: d.choreDayroomCleanStatus, comments: d.choreDayroomCleanComments },
            { status: d.choreLaundryRoomCleanStatus, comments: d.choreLaundryRoomCleanComments },
          ],
          roomSearches: Array.isArray(roomSearches) ? roomSearches.map((rs: any) => ({ room: rs.room_number || rs.room, comments: rs.search_comments || rs.comments })) : [],
        });
        setEditingId(id);
        setActiveTab('new');
      } else {
        setViewOpen(true);
      }
    } catch (err) {
      console.error('Error loading report:', err);
      addToast('Failed to load report', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="px-6 pt-2">
        <nav className="flex space-x-8 border-b border-bd">
          <button className={`${tabBtnBase} ${activeTab === 'overview' ? tabBtnActive : tabBtnInactive}`} onClick={() => setActiveTab('overview')}>
            <i className={`fa-solid fa-chart-line mr-2 ${activeTab === 'overview' ? 'text-primary' : 'text-font-detail'}`}></i>
            Overview
          </button>
          <button className={`${tabBtnBase} ${activeTab === 'new' ? tabBtnActive : tabBtnInactive}`} onClick={() => setActiveTab('new')}>
            <i className={`fa-solid fa-plus mr-2 ${activeTab === 'new' ? 'text-primary' : 'text-font-detail'}`}></i>
            New UCR Report
          </button>
        </nav>
      </div>

    {/* Toasts */}
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`min-w-[260px] max-w-sm shadow-lg rounded-lg border p-3 flex items-start gap-3 bg-white ${t.tone === 'success' ? 'border-success' : t.tone === 'error' ? 'border-error' : 'border-bd'}`}> 
          <i className={`fa-solid ${t.tone === 'success' ? 'fa-circle-check text-success' : t.tone === 'error' ? 'fa-circle-exclamation text-error' : 'fa-circle-info text-primary'} mt-1`}></i>
          <div className="flex-1 text-sm text-font-base">{t.title}</div>
          <button className="text-font-detail hover:text-primary" onClick={() => setToasts(s => s.filter(x => x.id !== t.id))}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
      ))}
    </div>

      {/* Overview Content */}
      {activeTab === 'overview' && (
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg border border-bd flex items-center justify-between">
              <div>
                <p className="text-sm text-font-detail">Total Reports</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </div>
              <div className="bg-primary-lightest p-3 rounded-full">
                <i className="fa-solid fa-clipboard-list text-primary text-xl"></i>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg border border-bd flex items-center justify-between">
              <div>
                <p className="text-sm text-font-detail">Unresolved Issues</p>
                <p className="text-3xl font-bold text-error">{stats.critical}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <i className="fa-solid fa-triangle-exclamation text-error text-xl"></i>
              </div>
            </div>
            {/* <div className="bg-white p-5 rounded-lg border border-bd flex items-center justify-between">
              <div>
                <p className="text-sm text-font-detail">Pending Review</p>
                <p className="text-3xl font-bold text-warning">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <i className="fa-solid fa-hourglass-half text-warning text-xl"></i>
              </div>
            </div> */}
            <div className="bg-white p-5 rounded-lg border border-bd flex items-center justify-between">
              <div>
                <p className="text-sm text-font-detail">This Month</p>
                <p className="text-3xl font-bold text-success">{stats.monthCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <i className="fa-solid fa-calendar-check text-success text-xl"></i>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-12 gap-6">
            {/* Persisting Issues */}
            <div className="col-span-12 lg:col-span-12">
              <div className="bg-white rounded-lg border border-bd">
                <div className="p-4 border-b border-bd">
                  <h3 className="text-lg font-semibold text-font-base">Persisting Issues Summary</h3>
                  <p className="text-sm text-font-detail mt-1">Open Medium, High, and Critical UCR items requiring attention</p>
                </div>
                <div className="p-4 space-y-4">
                  {openIssues.length === 0 && (
                    <div className="text-sm text-font-detail italic">No persisting issues at this time.</div>
                  )}
                  {(() => {
                    // Extract ALL individual issues from all reports
                    const allIndividualIssues: Array<any> = [];
                    openIssues.forEach((report: any) => {
                      const reportIssues = getAllIssues(report);
                      reportIssues.forEach(issue => {
                        allIndividualIssues.push(issue);
                      });
                    });
                    
                    // Paginate issues
                    const startIdx = persistingIssuesPage * persistingIssuesPerPage;
                    const endIdx = startIdx + persistingIssuesPerPage;
                    const paginatedIssues = allIndividualIssues.slice(startIdx, endIdx);
                    const totalPages = Math.ceil(allIndividualIssues.length / persistingIssuesPerPage);
                    
                    return (
                      <>
                        {paginatedIssues.map((issue, idx) => {
                      const severity = issue.condition.toLowerCase();
                      const borderClass =
                        severity.includes('critical')
                          ? 'border-error bg-error-lightest'
                          : severity.includes('high')
                          ? 'border-warning bg-highlight-lightest'
                          : 'border-yellow-400 bg-yellow-50';
                      const badgeClass =
                        severity.includes('critical')
                          ? 'bg-error text-white'
                          : severity.includes('high')
                          ? 'bg-warning text-font-base'
                          : 'bg-yellow-400 text-font-base';
                      const dateStr = issue.reportDate ? new Date(issue.reportDate).toLocaleDateString() : '';
                      return (
                        <div key={`${issue.reportId}-${idx}`} className={`border-l-4 ${borderClass} p-4 rounded-r-lg`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span className={`${badgeClass} text-xs font-bold px-2 py-1 rounded-full mr-3`}>{issue.condition.toUpperCase()}</span>
                                <h4 className="font-semibold text-font-base">{issue.label}</h4>
                              </div>
                              <p className="text-xs text-font-medium mb-1">{issue.comment}</p>
                              <p className="text-xs text-font-detail">
                                Reported: {dateStr} ({issue.shiftTime || 'N/A'})
                              </p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => {
                                  const params = new URLSearchParams();
                                  params.set('reportId', String(issue.reportId));
                                  if (issue.reportDate) params.set('date', issue.reportDate);
                                  if (issue.shiftTime) params.set('shift', issue.shiftTime);
                                  params.set('status', issue.condition);
                                  params.set('summary', `${issue.label}: ${issue.comment}`);
                                  router.push(`/dashboard/ucr/notify?${params.toString()}`);
                                }}
                                className="bg-primary text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-primary-light"
                              >
                                <i className="fa-solid fa-bell mr-1"></i>Notify
                              </button>
                              <button
                                onClick={() => resolveIssue(issue.reportId, issue.fieldName)}
                                className="bg-success text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-green-600"
                              >
                                <i className="fa-solid fa-check mr-1"></i>Resolved
                              </button>
                            </div>
                          </div>
                        </div>
                        );
                        })}
                        {allIndividualIssues.length > persistingIssuesPerPage && (
                          <div className="flex justify-between items-center pt-4 border-t border-bd mt-4">
                            <p className="text-sm text-font-detail">
                              Showing {startIdx + 1}-{Math.min(endIdx, allIndividualIssues.length)} of {allIndividualIssues.length} issues
                            </p>
                            <div className="flex gap-2">
                              <button
                                disabled={persistingIssuesPage === 0}
                                onClick={() => setPersistingIssuesPage(p => Math.max(0, p - 1))}
                                className={`px-3 py-1 text-sm rounded ${persistingIssuesPage === 0 ? 'bg-gray-200 text-gray-500' : 'bg-white border border-bd hover:bg-primary-lightest'}`}
                              >
                                <i className="fa-solid fa-chevron-left"></i>
                              </button>
                              <span className="px-3 py-1 text-sm">Page {persistingIssuesPage + 1} of {totalPages}</span>
                              <button
                                disabled={persistingIssuesPage >= totalPages - 1}
                                onClick={() => setPersistingIssuesPage(p => Math.min(totalPages - 1, p + 1))}
                                className={`px-3 py-1 text-sm rounded ${persistingIssuesPage >= totalPages - 1 ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white hover:bg-primary-light'}`}
                              >
                                <i className="fa-solid fa-chevron-right"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Archive Table */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white rounded-lg border border-bd">
                <div className="p-4 border-b border-bd">
                  <h3 className="text-lg font-semibold text-font-base">UCR Reports Archive</h3>
                  <div className="flex items-center gap-4 mt-3">
                    <input value={q} onChange={(e)=> { const val = e.target.value; setQ(val); setPageIdx(0); if (val === '') { loadReports(true); } }} onBlur={()=> loadReports(true)} type="text" placeholder="Search reports by date or key issues..." className="flex-1 px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input value={filterDate} onChange={(e)=> { setFilterDate(e.target.value); setPageIdx(0); loadReports(true); }} type="date" className="px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                    <select value={filterStatus} onChange={(e)=> { setFilterStatus(e.target.value); setPageIdx(0); loadReports(true); }} className="px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>All Status</option>
                      <option>Normal</option>
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-bg-subtle">
                      <tr>
                        <th className="p-3 text-left font-medium text-font-base">Date</th>
                        <th className="p-3 text-left font-medium text-font-base">Shift</th>
                        <th className="p-3 text-left font-medium text-font-base">Summary</th>
                        <th className="p-3 text-left font-medium text-font-base">Reporter</th>
                        <th className="p-3 text-left font-medium text-font-base">Issues</th>
                        <th className="p-3 text-left font-medium text-font-base">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ucrReports.map((r: any) => {
                        // Compare dates without time component
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const reportDate = r.reportDate ? new Date(r.reportDate + 'T00:00:00') : null;
                        if (reportDate) reportDate.setHours(0, 0, 0, 0);
                        const isToday = reportDate ? reportDate.getTime() === today.getTime() : false;
                        const issues = getAllIssues(r);
                        const hasCritical = issues.some(i => i.condition.includes('Critical'));
                        const hasHigh = issues.some(i => i.condition.includes('High'));
                        const hasMedium = issues.some(i => i.condition.includes('Medium'));
                        const summary = issues.length > 0 ? `${issues.length} issue${issues.length > 1 ? 's' : ''} reported` : 'All items normal';
                        return (
                          <tr key={String(r.id)} className="border-b border-bd hover:bg-primary-lightest/30">
                            <td className="p-3 text-font-detail">{r.reportDate ? new Date(r.reportDate).toLocaleDateString() : ''}</td>
                            <td className="p-3 text-font-detail">{r.shiftTime || ''}</td>
                            <td className="p-3 text-sm text-font-base">{summary}</td>
                            <td className="p-3 text-font-detail">{r.staffName || staffNames[r.staffId] || '-'}</td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1">
                                {issues.length === 0 ? (
                                  <span className="text-xs px-2 py-1 rounded-full bg-success-lightest text-success font-medium">Normal</span>
                                ) : (
                                  <>
                                    {hasCritical && <span className="text-xs px-2 py-1 rounded-full bg-error text-white font-medium">Critical</span>}
                                    {hasHigh && <span className="text-xs px-2 py-1 rounded-full bg-warning text-white font-medium">High</span>}
                                    {hasMedium && <span className="text-xs px-2 py-1 rounded-full bg-yellow-500 text-white font-medium">Medium</span>}
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => onView(r.id)} 
                                  className="text-primary hover:bg-primary-lightest p-2 rounded transition-colors" 
                                  title="View Report"
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </button>
                                {isToday && (
                                  <button 
                                    onClick={() => onView(r.id, true)} 
                                    className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors" 
                                    title="Edit Today's Report"
                                  >
                                    <i className="fa-solid fa-pen"></i>
                                  </button>
                                )}
                                <button 
                                  onClick={() => printReport(r)} 
                                  className="text-gray-600 hover:bg-gray-100 p-2 rounded transition-colors" 
                                  title="Print/Download Report"
                                >
                                  <i className="fa-solid fa-print"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-bd flex justify-between items-center">
                  <p className="text-sm text-font-detail">Showing {ucrReports.length} of {totalElements} reports</p>
                  <div className="flex items-center gap-2">
                    <button disabled={pageIdx<=0} onClick={()=> setPageIdx(p=> Math.max(0, p-1))} className={`px-3 py-2 text-sm rounded ${pageIdx<=0? 'bg-gray-200 text-gray-500' : 'bg-white border border-bd hover:bg-primary-lightest'}`}>Prev</button>
                    <button disabled={(pageIdx+1)*pageSize >= totalElements} onClick={()=> setPageIdx(p=> p+1)} className={`px-3 py-2 text-sm rounded ${(pageIdx+1)*pageSize >= totalElements? 'bg-gray-200 text-gray-500' : 'bg-primary text-white hover:bg-primary-light'}`}>See More</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics side */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white rounded-lg border border-bd">
                <div className="p-4 border-b border-bd">
                  <h3 className="text-lg font-semibold text-font-base">Monthly Issue Status</h3>
                  <p className="text-sm text-font-detail">12-Month Overview</p>
                </div>
                <div className="p-4">
                  <div id="monthly-status-chart" className="h-64 w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New UCR Report */}
      {activeTab === 'new' && (
        <div className="p-6 space-y-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Actions */}
            <div className="flex justify-end">
              <div className="flex items-center gap-3">
                <button onClick={() => window.print()} className="bg-primary-lightest text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary-lighter/50 transition-colors duration-200 flex items-center">
                  <i className="fa-solid fa-print mr-2"></i>
                  Print
                </button>
                <button onClick={submitNew} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-light transition-colors duration-200 flex items-center">
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  Submit
                </button>
              </div>
            </div>

            {/* Report Info */}
            <section className="bg-white p-6 rounded-lg border border-bd">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-font-detail mb-1">Date</label>
                  <input type="date" value={reportDate} onChange={(e)=> setReportDate(e.target.value)} className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-detail mb-1">Shift / Time</label>
                  <select value={shiftVal} onChange={(e)=> setShiftVal(e.target.value)} className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>7:00-3:00</option>
                    <option>3:00-11:00</option>
                    <option>11:00-7:00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-detail mb-1">Staff Completing UCR</label>
                  <input type="text" className="w-full px-3 py-2 border border-bd rounded-md bg-gray-100" value={staffName} readOnly />
                </div>
              </div>
            </section>

            {/* Security Equipment & Procedures */}
            <div className="bg-white rounded-lg border border-bd">
              <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-primary">Security Equipment & Procedures</h3>
              </div>
              <div className="p-4 space-y-4">
                {[
                  { label: '11 Radios functional and charging', extra: 'Problems in use, work order #' },
                  { label: '2 Flashlights functional', extra: 'Problems in use, work order #' },
                  { label: 'Garrett metal detector functional', extra: 'Problems in use, work order #' },
                  { label: 'Big Set keys & keys present and secure', extra: 'Problems in use, work order #' },
                  { label: 'First Aid kits available and stocked', extra: 'Note if used, work order #' },
                  { label: 'Desk Computer/Monitor functional', extra: 'Problems in use, work order #' },
                ].map((row, idx) => (
                  <div key={row.label} className={`grid grid-cols-12 items-center gap-4 py-2 ${idx === 0 ? 'border-b' : 'border-y'} border-bd`}>
                    <div className="col-span-3"><p className="text-sm font-medium text-font-base">{row.label}</p></div>
                    <div className="col-span-2">
                      <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                        <button 
                          onClick={() => setFormData((prev: any) => ({ ...prev, securityEquipment: prev.securityEquipment.map((item: any, i: number) => i === idx ? { ...item, status: 'ok' } : item) }))}
                          className={`flex-1 py-1.5 ${formData.securityEquipment[idx]?.status === 'ok' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                        >
                          OK
                        </button>
                        <button 
                          onClick={() => setFormData((prev: any) => ({ ...prev, securityEquipment: prev.securityEquipment.map((item: any, i: number) => i === idx ? { ...item, status: 'issue' } : item) }))}
                          className={`flex-1 py-1.5 ${formData.securityEquipment[idx]?.status === 'issue' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                        >
                          Issue
                        </button>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <select 
                        value={formData.securityEquipment[idx]?.priority || 'Normal'}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, securityEquipment: prev.securityEquipment.map((item: any, i: number) => i === idx ? { ...item, priority: e.target.value } : item) }))}
                        className="w-full px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    <div className={`col-span-5`}>
                      <input 
                        type="text" 
                        placeholder={row.extra} 
                        value={formData.securityEquipment[idx]?.comments || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, securityEquipment: prev.securityEquipment.map((item: any, i: number) => i === idx ? { ...item, comments: e.target.value } : item) }))}
                        className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                      />
                    </div>
                  </div>
                ))}
                {/* Hardware Secure */}
                <div className="grid grid-cols-12 items-center gap-4 py-2 border-y border-bd">
                  <div className="col-span-4"><p className="text-sm font-medium text-font-base">Hardware Secure (hooks secure)</p></div>
                  <div className="col-span-3">
                    <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                      <button 
                        onClick={() => setFormData((prev: any) => ({ ...prev, hardwareSecure: { ...prev.hardwareSecure, value: true } }))}
                        className={`flex-1 py-1.5 ${formData.hardwareSecure?.value === true ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        Yes
                      </button>
                      <button 
                        onClick={() => setFormData((prev: any) => ({ ...prev, hardwareSecure: { ...prev.hardwareSecure, value: false } }))}
                        className={`flex-1 py-1.5 ${formData.hardwareSecure?.value === false ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  <div className="col-span-5">
                    <input 
                      type="text" 
                      placeholder="Problems in use, work order #" 
                      value={formData.hardwareSecure?.comments || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, hardwareSecure: { ...prev.hardwareSecure, comments: e.target.value } }))}
                      className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                </div>
                {/* Searches completed */}
                <div className="grid grid-cols-12 items-center gap-4 py-2 border-y border-bd">
                  <div className="col-span-4"><p className="text-sm font-medium text-font-base">Searches completed</p></div>
                  <div className="col-span-3">
                    <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                      <button 
                        onClick={() => setFormData((prev: any) => ({ ...prev, searchesCompleted: { ...prev.searchesCompleted, value: true } }))}
                        className={`flex-1 py-1.5 ${formData.searchesCompleted?.value === true ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        Yes
                      </button>
                      <button 
                        onClick={() => setFormData((prev: any) => ({ ...prev, searchesCompleted: { ...prev.searchesCompleted, value: false } }))}
                        className={`flex-1 py-1.5 ${formData.searchesCompleted?.value === false ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  <div className="col-span-5 flex gap-2">
                    <input 
                      type="time" 
                      value={formData.searchesCompleted?.startTime || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, searchesCompleted: { ...prev.searchesCompleted, startTime: e.target.value } }))}
                      className="px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                    />
                    <input 
                      type="time" 
                      value={formData.searchesCompleted?.endTime || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, searchesCompleted: { ...prev.searchesCompleted, endTime: e.target.value } }))}
                      className="px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                </div>
                {/* Fire drills completed */}
                <div className="grid grid-cols-12 items-center gap-4 py-2 border-y border-bd">
                  <div className="col-span-4"><p className="text-sm font-medium text-font-base">Fire drills completed</p></div>
                  <div className="col-span-3">
                    <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                      <button 
                        onClick={() => setFormData((prev: any) => ({ ...prev, fireDrillsCompleted: { ...prev.fireDrillsCompleted, value: true } }))}
                        className={`flex-1 py-1.5 ${formData.fireDrillsCompleted?.value === true ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        Yes
                      </button>
                      <button 
                        onClick={() => setFormData((prev: any) => ({ ...prev, fireDrillsCompleted: { ...prev.fireDrillsCompleted, value: false } }))}
                        className={`flex-1 py-1.5 ${formData.fireDrillsCompleted?.value === false ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  <div className="col-span-5">
                    <input 
                      type="text" 
                      placeholder="Problems in use, work order #" 
                      value={formData.fireDrillsCompleted?.comments || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, fireDrillsCompleted: { ...prev.fireDrillsCompleted, comments: e.target.value } }))}
                      className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                </div>
                {/* Emergency lighting operational */}
                <div className="grid grid-cols-12 items-center gap-4 py-2">
                  <div className="col-span-4"><p className="text-sm font-medium text-font-base">Emergency lighting operational</p></div>
                  <div className="col-span-3">
                    <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                      <button 
                        onClick={() => setFormData((prev: any) => ({ ...prev, emergencyLighting: { ...prev.emergencyLighting, value: true } }))}
                        className={`flex-1 py-1.5 ${formData.emergencyLighting?.value === true ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        Yes
                      </button>
                      <button 
                        onClick={() => setFormData((prev: any) => ({ ...prev, emergencyLighting: { ...prev.emergencyLighting, value: false } }))}
                        className={`flex-1 py-1.5 ${formData.emergencyLighting?.value === false ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  <div className="col-span-5">
                    <input 
                      type="text" 
                      placeholder="Problems in use, work order #" 
                      value={formData.emergencyLighting?.comments || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, emergencyLighting: { ...prev.emergencyLighting, comments: e.target.value } }))}
                      className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg border border-bd">
              <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-primary">Notifications</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-12 items-center gap-4 py-2">
                  <div className="col-span-4"><p className="text-sm font-medium text-font-base">Opposite Gender Announce their Presence</p></div>
                  <div className="col-span-3">
                    <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                      <button 
                        onClick={() => setFormData((prev: any) => ({ ...prev, notifications: [{ ...prev.notifications[0], value: true }] }))}
                        className={`flex-1 py-1.5 ${formData.notifications[0]?.value === true ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        Yes
                      </button>
                      <button 
                        onClick={() => setFormData((prev: any) => ({ ...prev, notifications: [{ ...prev.notifications[0], value: false }] }))}
                        className={`flex-1 py-1.5 ${formData.notifications[0]?.value === false ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <select 
                      value={formData.notifications[0]?.priority || 'Normal'}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, notifications: [{ ...prev.notifications[0], priority: e.target.value }] }))}
                      className="w-full px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option>Normal</option>
                      <option>Critical</option>
                      <option>High Priority</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="text" 
                      placeholder="Comments" 
                      value={formData.notifications[0]?.comments || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, notifications: [{ ...prev.notifications[0], comments: e.target.value }] }))}
                      className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Administrative Offices */}
            <div className="bg-white rounded-lg border border-bd">
              <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-primary">Administrative Offices</h3>
              </div>
              <div className="p-4 space-y-4">
                {[
                  'Meeting Rooms locked (if not comment which one and mark as issue)',
                  'Administration doors locked and secure',
                ].map((label, idx) => (
                  <div key={label} className="grid grid-cols-12 items-center gap-4 py-2 border-b border-bd last:border-b-0">
                    <div className="col-span-4"><p className="text-sm font-medium text-font-base">{label}</p></div>
                    <div className="col-span-3">
                      <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                        <button 
                          onClick={() => setFormData((prev: any) => ({ ...prev, adminOffices: prev.adminOffices.map((item: any, i: number) => i === idx ? { ...item, status: 'ok' } : item) }))}
                          className={`flex-1 py-1.5 ${formData.adminOffices[idx]?.status === 'ok' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                        >
                          OK
                        </button>
                        <button 
                          onClick={() => setFormData((prev: any) => ({ ...prev, adminOffices: prev.adminOffices.map((item: any, i: number) => i === idx ? { ...item, status: 'issue' } : item) }))}
                          className={`flex-1 py-1.5 ${formData.adminOffices[idx]?.status === 'issue' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                        >
                          Issue
                        </button>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <select 
                        value={formData.adminOffices[idx]?.priority || 'Normal'}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, adminOffices: prev.adminOffices.map((item: any, i: number) => i === idx ? { ...item, priority: e.target.value } : item) }))}
                        className="w-full px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option>Normal</option>
                        <option>Critical</option>
                        <option>High Priority</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        placeholder="Comments" 
                        value={formData.adminOffices[idx]?.comments || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, adminOffices: prev.adminOffices.map((item: any, i: number) => i === idx ? { ...item, comments: e.target.value } : item) }))}
                        className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Facility Infrastructure */}
            <div className="bg-white rounded-lg border border-bd">
              <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-primary">Facility Infrastructure</h3>
              </div>
              <div className="p-4 space-y-4">
                {[
                  'Back door operational',
                  'Entrance/Exit doors free of obstruction',
                  'Smoke detectors functioning',
                  'Windows secure',
                  'Laundry area clean and secure',
                  'Fire extinguishers functional',
                  'Fire alarm system operational',
                ].map((label, idx) => (
                  <div key={label} className="grid grid-cols-12 items-center gap-4 py-2 border-b border-bd last:border-b-0">
                    <div className="col-span-4"><p className="text-sm font-medium text-font-base">{label}</p></div>
                    <div className="col-span-3">
                      <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                        <button 
                          onClick={() => setFormData((prev: any) => ({ ...prev, facilityInfrastructure: prev.facilityInfrastructure.map((item: any, i: number) => i === idx ? { ...item, status: 'ok' } : item) }))}
                          className={`flex-1 py-1.5 ${formData.facilityInfrastructure[idx]?.status === 'ok' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                        >
                          OK
                        </button>
                        <button 
                          onClick={() => setFormData((prev: any) => ({ ...prev, facilityInfrastructure: prev.facilityInfrastructure.map((item: any, i: number) => i === idx ? { ...item, status: 'issue' } : item) }))}
                          className={`flex-1 py-1.5 ${formData.facilityInfrastructure[idx]?.status === 'issue' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                        >
                          Issue
                        </button>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <select 
                        value={formData.facilityInfrastructure[idx]?.priority || 'Normal'}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, facilityInfrastructure: prev.facilityInfrastructure.map((item: any, i: number) => i === idx ? { ...item, priority: e.target.value } : item) }))}
                        className="w-full px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option>Normal</option>
                        <option>Critical</option>
                        <option>High Priority</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        placeholder="Comments" 
                        value={formData.facilityInfrastructure[idx]?.comments || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, facilityInfrastructure: prev.facilityInfrastructure.map((item: any, i: number) => i === idx ? { ...item, comments: e.target.value } : item) }))}
                        className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Chores */}
            <div className="bg-white rounded-lg border border-bd">
              <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-primary">Staff Chores</h3>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-bd">
                      <th className="py-2 text-left font-medium text-font-detail w-2/5">Item</th>
                      <th className="py-2 text-left font-medium text-font-detail">Status</th>
                      <th className="py-2 text-left font-medium text-font-detail">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      'Workspace clean (common area, desk)',
                      'Staff bathroom cleaned and mopped',
                      'Dayroom cleaned and mopped',
                      'Laundry room cleaned and mopped',
                    ].map((item, i) => (
                      <tr key={item} className="border-b border-bd last:border-b-0">
                        <td className="py-3 font-medium text-font-base">{item}</td>
                        <td>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2"><input type="radio" name={`chore-${i}`} defaultChecked /><span>Satisfactory</span></label>
                            <label className="flex items-center gap-2"><input type="radio" name={`chore-${i}`} /><span>Unsatisfactory</span></label>
                          </div>
                        </td>
                        <td><input type="text" className="w-full px-2 py-1 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resident Room Searches */}
            <div className="bg-white rounded-lg border border-bd">
              <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-primary">Resident Room Searches</h3>
              </div>
              <div className="p-4 space-y-4">
                {/* Input row: [Room #] [Comments] [+] */}
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-font-detail mb-1">Room Number</label>
                    <input
                      type="text"
                      value={roomSearchRoom}
                      onChange={(e) => setRoomSearchRoom(e.target.value.replace(/[^0-9A-Za-z-]/g, ''))}
                      placeholder="Enter room (e.g., 7, 210, A12)"
                      className="w-full px-3 py-2 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex-[2]">
                    <label className="block text-sm font-medium text-font-detail mb-1">Search Comments</label>
                    <input
                      type="text"
                      value={roomSearchComments}
                      onChange={(e) => setRoomSearchComments(e.target.value)}
                      placeholder="Notes from room search (e.g., no issues, minor contraband, etc.)"
                      className="w-full px-3 py-2 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="md:w-auto">
                    <button
                      type="button"
                      onClick={addRoomSearchRow}
                      className="mt-1 md:mt-0 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light"
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      Add
                    </button>
                  </div>
                </div>

                {/* Added room searches list */}
                {Array.isArray(formData.roomSearches) && formData.roomSearches.length > 0 && (
                  <div className="mt-2 border border-bd rounded-lg divide-y divide-bd bg-bg-subtle/40">
                    {formData.roomSearches.map((row: any, idx: number) => (
                      <div key={`${row.room}-${idx}`} className="flex items-start justify-between px-3 py-2 text-sm">
                        <div className="flex-1">
                          <div className="font-medium text-font-base">Room {row.room}</div>
                          <div className="text-xs text-font-detail mt-0.5">{row.comments || 'No additional comments recorded.'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Comments */}
            <div className="bg-white rounded-lg border border-bd">
              <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-primary">Additional Comments / Notes</h3>
              </div>
              <div className="p-4">
                <textarea rows={6} value={comments} onChange={(e)=> setComments(e.target.value)} placeholder="Please provide any additional observations, concerns, or notes about this shift's unit condition inspection..." className="w-full px-4 py-3 border border-bd rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                <p className="text-xs text-font-detail mt-2">Use this space to document any issues not covered in the checklist above or provide additional context for reported concerns.</p>
                <div className="mt-4 flex justify-end">
                  <button onClick={submitNew} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-light transition-colors duration-200 flex items-center">
                    <i className="fa-solid fa-paper-plane mr-2"></i>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
    {/* View Report Modal - Simple Issues List */}
    {viewOpen && viewData && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
          <div className="p-4 border-b border-bd flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-font-base">UCR Report Issues</h3>
              <div className="flex items-center gap-4 mt-2 text-xs text-font-detail">
                <div className="flex items-center gap-1">
                  <i className="fa-solid fa-calendar"></i>
                  <span>{viewData.reportDate ? new Date(viewData.reportDate).toLocaleDateString() : ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="fa-solid fa-clock"></i>
                  <span>{viewData.shiftTime || ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="fa-solid fa-user"></i>
                  <span>Reporter: {viewData.staffId || 'Unknown'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => window.print()} className="bg-primary-lightest text-primary px-3 py-1.5 rounded-md text-sm"><i className="fa-solid fa-print mr-1"></i>Print</button>
              <button onClick={() => setViewOpen(false)} className="text-font-detail hover:text-font-base"><i className="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-2">
              {(() => {
                const issues: Array<{label: string, condition: string, comment: string}> = [];
                const fields = [
                  { condition: viewData.securityRadiosCondition, comment: viewData.securityRadiosComments, label: 'Security Radios' },
                  { condition: viewData.securityFlashlightsCondition, comment: viewData.securityFlashlightsComments, label: 'Security Flashlights' },
                  { condition: viewData.securityMetalDetectorCondition, comment: viewData.securityMetalDetectorComments, label: 'Metal Detector' },
                  { condition: viewData.securityBigSetKeysCondition, comment: viewData.securityBigSetKeysComments, label: 'Security Keys' },
                  { condition: viewData.securityFirstAidKitsCondition, comment: viewData.securityFirstAidKitsComments, label: 'First Aid Kits' },
                  { condition: viewData.securityDeskComputerCondition, comment: viewData.securityDeskComputerComments, label: 'Desk Computer' },
                  { condition: viewData.adminMeetingRoomsLockedCondition, comment: viewData.adminMeetingRoomsLockedComments, label: 'Meeting Rooms Locked' },
                  { condition: viewData.adminDoorsSecureCondition, comment: viewData.adminDoorsSecureComments, label: 'Admin Doors Secure' },
                  { condition: viewData.infraBackDoorCondition, comment: viewData.infraBackDoorComments, label: 'Back Door' },
                  { condition: viewData.infraEntranceExitDoorsCondition, comment: viewData.infraEntranceExitDoorsComments, label: 'Entrance/Exit Doors' },
                  { condition: viewData.infraSmokeDetectorsCondition, comment: viewData.infraSmokeDetectorsComments, label: 'Smoke Detectors' },
                  { condition: viewData.infraWindowsSecureCondition, comment: viewData.infraWindowsSecureComments, label: 'Windows Secure' },
                  { condition: viewData.infraLaundryAreaCondition, comment: viewData.infraLaundryAreaComments, label: 'Laundry Area' },
                  { condition: viewData.infraFireExtinguishersCondition, comment: viewData.infraFireExtinguishersComments, label: 'Fire Extinguishers' },
                  { condition: viewData.infraFireAlarmCondition, comment: viewData.infraFireAlarmComments, label: 'Fire Alarm' },
                ];
                fields.forEach(f => {
                  if (f.condition && (f.condition.includes('Critical') || f.condition.includes('High') || f.condition.includes('Medium'))) {
                    issues.push({ label: f.label, condition: f.condition, comment: f.comment || 'No comment provided' });
                  }
                });
                return issues.length > 0 ? issues.map((issue, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-l-4 ${issue.condition.includes('Critical') ? 'border-error bg-error-lightest' : issue.condition.includes('High') ? 'border-warning bg-warning-lightest' : 'border-yellow-500 bg-yellow-50'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${issue.condition.includes('Critical') ? 'bg-error text-white' : issue.condition.includes('High') ? 'bg-warning text-white' : 'bg-yellow-500 text-white'}`}>{issue.condition.toUpperCase()}</span>
                          <span className="font-semibold text-sm">{issue.label}</span>
                        </div>
                        <p className="text-sm text-font-detail">{issue.comment}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-font-detail">
                    <i className="fa-solid fa-circle-check text-success text-3xl mb-2"></i>
                    <p>No issues reported - All items normal</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
