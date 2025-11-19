
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UCRPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'new'>('overview');
  const [programId, setProgramId] = useState<string>('');
  // toasts
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; tone: 'info'|'success'|'error' }>>([]);
  const addToast = (title: string, tone: 'info'|'success'|'error' = 'info') => {
    const id = String(Date.now() + Math.random());
    setToasts(t => [...t, { id, title, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    try { localStorage.setItem('global-toast', JSON.stringify({ title, tone })); } catch {}
  };

  const tabBtnBase = 'flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors';
  const tabBtnInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';
  const tabBtnActive = 'border-primary text-primary';

  type Ucr = { id: number|string; reportDate: string; shift?: string; reporterName?: string; status?: string; issuesSummary?: string };
  const [ucrReports, setUcrReports] = useState<Ucr[]>([]);
  const [totalReports, setTotalReports] = useState<number>(0);
  const [pageIdx, setPageIdx] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [q, setQ] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All Status');
  const loadReports = async (resetPage = false) => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const params = new URLSearchParams({
        page: String(resetPage ? 0 : pageIdx),
        size: String(pageSize),
      });
      if (q) params.set('q', q);
      if (filterDate) params.set('date', filterDate);
      if (filterStatus) params.set('status', filterStatus);
      const r = await fetch(`/api/programs/${programId}/ucr/reports/page?${params.toString()}`, { credentials:'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
      if (!r.ok) return;
      const data = await r.json();
      setUcrReports(data.content || []);
      setTotalReports(data.totalElements || 0);
      if (resetPage) setPageIdx(0);
    } catch {}
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
  const [chartData, setChartData] = useState<{ critical: number[]; high: number[]; medium: number[] }>({ critical: new Array(12).fill(0), high: new Array(12).fill(0), medium: new Array(12).fill(0) });
  const loadChartData = async () => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const r = await fetch(`/api/programs/${programId}/ucr/monthly-chart`, { credentials:'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
      if (r.ok) {
        const d = await r.json();
        setChartData({ 
          critical: d.critical || new Array(12).fill(0), 
          high: d.high || new Array(12).fill(0), 
          medium: d.medium || new Array(12).fill(0) 
        });
      }
    } catch {}
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
      const sp = spRaw ? JSON.parse(spRaw) as { id?: number|string } : null;
      setProgramId(sp?.id ? String(sp.id) : '');
    } catch {}
  }, []);

  // Stats
  const [stats, setStats] = useState<{ total: number; critical: number; pending: number; monthCount: number }>({ total: 0, critical: 0, pending: 0, monthCount: 0 });
  const loadStats = async () => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const r = await fetch(`/api/programs/${programId}/ucr/stats`, { credentials:'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
      if (r.ok) {
        const d = await r.json();
        setStats({ total: d.total ?? 0, critical: d.critical ?? 0, pending: d.pending ?? 0, monthCount: d.monthCount ?? 0 });
      }
    } catch {}
  };

  // Open issues summary (Critical/High/Medium)
  type OpenIssue = Ucr;
  const [openIssues, setOpenIssues] = useState<OpenIssue[]>([]);
  const loadOpenIssues = async () => {
    if (!programId) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const r = await fetch(`/api/programs/${programId}/ucr/open-issues?page=0&size=5`, { credentials:'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
      if (!r.ok) return;
      const d = await r.json();
      setOpenIssues(d.content || []);
    } catch {}
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

      const payload = {
        reportDate: reportDate || new Date().toISOString().slice(0,10),
        shift: shiftVal,
        reporterName: staffName || undefined,
        status: reportStatus,
        issuesSummary: comments || undefined,
        payload: formData,
      };
      const url = editingId ? `/api/programs/${programId}/ucr/reports/${editingId}` : `/api/programs/${programId}/ucr/reports`;
      const method = editingId ? 'PATCH' : 'POST';
      const r = await fetch(url, { method, credentials:'include', headers: { 'Content-Type':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify(payload) });
      if (!r.ok) {
        const errorText = await r.text().catch(() => 'Unknown error');
        console.error('UCR Submit Error:', r.status, errorText);
        if (r.status === 403) {
          addToast('Permission denied. Try logging out and back in, or contact admin to assign you to this program.', 'error');
        } else if (r.status === 409) {
          addToast('UCR report already exists for this date and shift. Please edit the existing report in the archive.', 'error');
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
  const onView = async (id: string|number, asEdit?: boolean) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const r = await fetch(`/api/programs/${programId}/ucr/reports/${id}`, { credentials:'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
      if (!r.ok) return;
      const d = await r.json();
      let payload: any = {};
      try { payload = d.payloadJson ? JSON.parse(d.payloadJson) : {}; } catch {}
      setViewData({ ...d, payload });
      if (asEdit) {
        // Prefill form for editing (only allowed same day on backend)
        setReportDate(d.reportDate ? String(d.reportDate).slice(0,10) : '');
        setShiftVal(d.shift || '7:00-3:00');
        setComments(d.issuesSummary || '');
        if (payload && typeof payload === 'object') {
          setFormData((prev: any) => ({
            ...prev,
            ...payload,
            roomSearches: Array.isArray(payload.roomSearches) ? payload.roomSearches : [],
          }));
        }
        setEditingId(id);
        setActiveTab('new');
      } else {
        setViewOpen(true);
      }
    } catch {}
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
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-sm text-font-detail">Critical Issues</p>
                <p className="text-3xl font-bold text-error">{stats.critical}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <i className="fa-solid fa-triangle-exclamation text-error text-xl"></i>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg border border-bd flex items-center justify-between">
              <div>
                <p className="text-sm text-font-detail">Pending Review</p>
                <p className="text-3xl font-bold text-warning">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <i className="fa-solid fa-hourglass-half text-warning text-xl"></i>
              </div>
            </div>
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
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white rounded-lg border border-bd">
                <div className="p-4 border-b border-bd">
                  <h3 className="text-lg font-semibold text-font-base">Persisting Issues Summary</h3>
                  <p className="text-sm text-font-detail mt-1">Critical and recurring facility issues requiring attention</p>
                </div>
                <div className="p-4 space-y-4">
                  <div className="border-l-4 border-error bg-error-lightest p-4 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="bg-error text-white text-xs font-bold px-2 py-1 rounded-full mr-3">CRITICAL</span>
                          <h4 className="font-semibold text-font-base">HVAC System Failure - North Wing</h4>
                        </div>
                        <p className="text-sm text-font-detail mb-2">Reported 3 times in the last 7 days. Temperature complaints increasing.</p>
                        <p className="text-xs text-font-medium">Last reported: Today, 2:30 PM by J. Smith</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button onClick={() => router.push('/dashboard/ucr/notify')} className="bg-primary text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-primary-light">
                          <i className="fa-solid fa-bell mr-1"></i>Notify Management
                        </button>
                        <button className="bg-success text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-green-600">
                          <i className="fa-solid fa-check mr-1"></i>Resolved?
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-warning bg-highlight-lightest p-4 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="bg-warning text-font-base text-xs font-bold px-2 py-1 rounded-full mr-3">HIGH</span>
                          <h4 className="font-semibold text-font-base">Plumbing Issues - Multiple Locations</h4>
                        </div>
                        <p className="text-sm text-font-detail mb-2">Leaking faucets reported in Rooms 2311, 2315, and Staff Bathroom.</p>
                        <p className="text-xs text-font-medium">Last reported: Yesterday, 11:45 AM by A. Garcia</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button onClick={() => router.push('/dashboard/ucr/notify')} className="bg-primary text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-primary-light">
                          <i className="fa-solid fa-bell mr-1"></i>Notify Management
                        </button>
                        <button className="bg-success text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-green-600">
                          <i className="fa-solid fa-check mr-1"></i>Resolved?
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="bg-yellow-400 text-font-base text-xs font-bold px-2 py-1 rounded-full mr-3">MEDIUM</span>
                          <h4 className="font-semibold text-font-base">Electrical - Flickering Lights</h4>
                        </div>
                        <p className="text-sm text-font-detail mb-2">Intermittent lighting issues in common areas and staff facilities.</p>
                        <p className="text-xs text-font-medium">Last reported: 2 days ago by M. Davis</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button onClick={() => router.push('/dashboard/ucr/notify')} className="bg-primary text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-primary-light">
                          <i className="fa-solid fa-bell mr-1"></i>Notify Management
                        </button>
                        <button className="bg-success text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-green-600">
                          <i className="fa-solid fa-check mr-1"></i>Resolved?
                        </button>
                      </div>
                    </div>
                </div>
              </div>
            </div>

              

              {/* Archive Table */}
              <div className="bg-white rounded-lg border border-bd mt-6">
                <div className="p-4 border-b border-bd">
                  <h3 className="text-lg font-semibold text-font-base">UCR Reports Archive</h3>
                  <div className="flex items-center gap-4 mt-3">
                    <input value={q} onChange={(e)=> setQ(e.target.value)} onKeyDown={(e)=> { if (e.key==='Enter') loadReports(true); }} type="text" placeholder="Search reports by date or key issues..." className="flex-1 px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input value={filterDate} onChange={(e)=> { setFilterDate(e.target.value); setPageIdx(0); }} onBlur={()=> loadReports(true)} type="date" className="px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                    <select value={filterStatus} onChange={(e)=> { setFilterStatus(e.target.value); setPageIdx(0); loadReports(true); }} className="px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>All Status</option>
                      <option>No Issues</option>
                      <option>Critical</option>
                      <option>High</option>
                      <option>Resolved</option>
                    </select>
                    <button onClick={() => loadReports(true)} className="px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary-light">Search</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-bg-subtle">
                      <tr>
                        <th className="p-3 text-left font-medium text-font-base">Date</th>
                        <th className="p-3 text-left font-medium text-font-base">Shift</th>
                        <th className="p-3 text-left font-medium text-font-base">Key Issues</th>
                        <th className="p-3 text-left font-medium text-font-base">Reporter</th>
                        <th className="p-3 text-left font-medium text-font-base">Status</th>
                        <th className="p-3 text-left font-medium text-font-base">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ucrReports.map((r) => {
                        const isToday = r.reportDate ? new Date(r.reportDate).toISOString().slice(0,10) === new Date().toISOString().slice(0,10) : false;
                        return (
                          <tr key={String(r.id)} className="border-b border-bd hover:bg-primary-lightest/30">
                            <td className="p-3 text-font-detail">{r.reportDate ? new Date(r.reportDate).toLocaleDateString() : ''}</td>
                            <td className="p-3 text-font-detail">{r.shift || ''}</td>
                            <td className="p-3 font-medium text-font-base">{r.issuesSummary || ''}</td>
                            <td className="p-3 text-font-detail">{r.reporterName || ''}</td>
                            <td className="p-3">
                              <span className={`text-xs px-2 py-1 rounded-full ${statusBadge(r.status || '')}`}>{r.status || ''}</span>
                            </td>
                            <td className="p-3 flex items-center gap-3">
                              <button onClick={() => onView(r.id)} className="text-primary hover:underline text-xs">View</button>
                              {isToday && (
                                <button onClick={() => onView(r.id, true)} className="text-xs text-font-detail hover:text-primary" title="Edit today's report">
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-bd flex justify-between items-center">
                  <p className="text-sm text-font-detail">Showing {ucrReports.length} of {totalReports} reports</p>
                  <div className="flex items-center gap-2">
                    <button disabled={pageIdx<=0} onClick={()=> setPageIdx(p=> Math.max(0, p-1))} className={`px-3 py-2 text-sm rounded ${pageIdx<=0? 'bg-gray-200 text-gray-500' : 'bg-white border border-bd hover:bg-primary-lightest'}`}>Prev</button>
                    <button disabled={(pageIdx+1)*pageSize >= totalReports} onClick={()=> setPageIdx(p=> p+1)} className={`px-3 py-2 text-sm rounded ${(pageIdx+1)*pageSize >= totalReports? 'bg-gray-200 text-gray-500' : 'bg-primary text-white hover:bg-primary-light'}`}>See More</button>
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
                        disabled={formData.securityEquipment[idx]?.status !== 'issue'}
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
                  'Meeting Rooms A & B (212A, 211GB) locked',
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
                        disabled={formData.adminOffices[idx]?.status !== 'issue'}
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
                        disabled={formData.facilityInfrastructure[idx]?.status !== 'issue'}
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
    {/* View Report Modal */}
    {viewOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
          <div className="p-4 border-b border-bd flex items-center justify-between">
            <h3 className="text-lg font-semibold text-font-base">UCR Report</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => window.print()} className="bg-primary-lightest text-primary px-3 py-1.5 rounded-md text-sm"><i className="fa-solid fa-print mr-1"></i>Print</button>
              <button onClick={() => setViewOpen(false)} className="text-font-detail hover:text-font-base"><i className="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><span className="text-font-detail">Date</span><div className="font-medium">{viewData?.reportDate ? new Date(viewData.reportDate).toLocaleDateString() : ''}</div></div>
              <div><span className="text-font-detail">Shift</span><div className="font-medium">{viewData?.shift || ''}</div></div>
              <div><span className="text-font-detail">Reporter</span><div className="font-medium">{viewData?.reporterName || ''}</div></div>
            </div>
            <div>
              <div className="text-font-detail text-sm mb-1">Key Issues</div>
              <div className="text-sm">{viewData?.issuesSummary || '—'}</div>
            </div>
            <div>
              <div className="text-font-detail text-sm mb-1">Form Data</div>
              {viewData?.payload && Object.keys(viewData.payload).length > 0 ? (
                <div className="space-y-3">
                  {viewData.payload.securityEquipment && (
                    <div>
                      <div className="text-xs font-medium text-font-detail mb-1">Security Equipment</div>
                      <div className="text-xs space-y-1">
                        {['11 Radios', '2 Flashlights', 'Garrett metal detector', 'Big Set keys', 'First Aid kits', 'Desk Computer'].map((label, idx) => {
                          const item = viewData.payload.securityEquipment[idx];
                          return item && item.status ? (
                            <div key={idx} className="flex justify-between">
                              <span>{label}:</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${item.status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {item.status.toUpperCase()}
                              </span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  {viewData.payload.hardwareSecure?.value !== null && (
                    <div>
                      <div className="text-xs font-medium text-font-detail mb-1">Hardware Secure</div>
                      <div className="text-xs">
                        <span className={`px-2 py-0.5 rounded ${viewData.payload.hardwareSecure.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {viewData.payload.hardwareSecure.value ? 'YES' : 'NO'}
                        </span>
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-medium text-font-detail mb-1">Raw JSON Data</div>
                    <pre className="text-xs bg-bg-subtle p-3 rounded border border-bd overflow-x-auto">{JSON.stringify(viewData.payload, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-font-detail">No form data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
