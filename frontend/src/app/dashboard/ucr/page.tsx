'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UCRPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'new'>('overview');

  const tabBtnBase = 'flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors';
  const tabBtnInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';
  const tabBtnActive = 'border-primary text-primary';

  const ucrReports = [
    { date: 'Dec 28, 2024', shift: 'Day Shift', issues: 'HVAC failure North Wing, Temperature control issues', reporter: 'J. Smith', status: 'Critical' },
    { date: 'Dec 27, 2024', shift: 'Evening Shift', issues: 'Plumbing leaks in Rooms 2311, 2315', reporter: 'A. Garcia', status: 'High' },
    { date: 'Dec 26, 2024', shift: 'Night Shift', issues: 'Electrical flickering in common areas', reporter: 'M. Davis', status: 'Resolved' },
    { date: 'Dec 25, 2024', shift: 'Day Shift', issues: 'All systems operational', reporter: 'R. Johnson', status: 'No Issues' },
    { date: 'Dec 24, 2024', shift: 'Evening Shift', issues: 'Security door malfunction, minor maintenance', reporter: 'T. Wilson', status: 'High' },
  ];

  const statusBadge = (s: string) =>
    s === 'Critical'
      ? 'bg-error text-white'
      : s === 'High'
      ? 'bg-warning text-font-base'
      : s === 'Resolved'
      ? 'bg-success text-white'
      : 'bg-green-100 text-success';

  // Load Highcharts from CDN and render the exact chart from the original design
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
            { name: 'Critical Issues', data: [12,15,18,20,22,25,28,30,32,35,38,40], color: '#CD0D0D' },
            { name: 'High Priority', data: [25,28,30,32,35,38,40,42,45,48,50,52], color: '#f6c51b' },
            { name: 'Medium Priority', data: [40,45,50,55,60,65,70,75,80,85,90,95], color: '#8AAAC7' },
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
  }, [activeTab]);

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

      {/* Overview Content */}
      {activeTab === 'overview' && (
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-lg border border-bd flex items-center justify-between">
              <div>
                <p className="text-sm text-font-detail">Total Reports</p>
                <p className="text-3xl font-bold text-primary">284</p>
              </div>
              <div className="bg-primary-lightest p-3 rounded-full">
                <i className="fa-solid fa-clipboard-list text-primary text-xl"></i>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg border border-bd flex items-center justify-between">
              <div>
                <p className="text-sm text-font-detail">Critical Issues</p>
                <p className="text-3xl font-bold text-error">3</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <i className="fa-solid fa-triangle-exclamation text-error text-xl"></i>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg border border-bd flex items-center justify-between">
              <div>
                <p className="text-sm text-font-detail">Pending Review</p>
                <p className="text-3xl font-bold text-warning">8</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <i className="fa-solid fa-hourglass-half text-warning text-xl"></i>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg border border-bd flex items-center justify-between">
              <div>
                <p className="text-sm text-font-detail">This Month</p>
                <p className="text-3xl font-bold text-success">42</p>
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
                    <input type="text" placeholder="Search reports by date or key issues..." className="flex-1 px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input type="date" className="px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                    <select className="px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>All Status</option>
                      <option>No Issues</option>
                      <option>Critical</option>
                      <option>High</option>
                      <option>Resolved</option>
                    </select>
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
                      {ucrReports.map((r, idx) => (
                        <tr key={idx} className="border-b border-bd hover:bg-primary-lightest/30">
                          <td className="p-3 text-font-detail">{r.date}</td>
                          <td className="p-3 text-font-detail">{r.shift}</td>
                          <td className="p-3 font-medium text-font-base">{r.issues}</td>
                          <td className="p-3 text-font-detail">{r.reporter}</td>
                          <td className="p-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${statusBadge(r.status)}`}>{r.status}</span>
                          </td>
                          <td className="p-3">
                            <button className="text-primary hover:underline text-xs">View Report</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-bd flex justify-between items-center">
                  <p className="text-sm text-font-detail">Showing 5 of 284 reports</p>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-light">See More</button>
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
                <button className="bg-primary-lightest text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary-lighter/50 transition-colors duration-200 flex items-center">
                  <i className="fa-solid fa-print mr-2"></i>
                  Print
                </button>
                <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-light transition-colors duration-200 flex items-center">
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  Submit for Review
                </button>
              </div>
            </div>

            {/* Report Info */}
            <section className="bg-white p-6 rounded-lg border border-bd">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-font-detail mb-1">Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-detail mb-1">Shift / Time</label>
                  <select className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>7:00-3:00</option>
                    <option>3:00-11:00</option>
                    <option>11:00-7:00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-detail mb-1">Staff Completing UCR</label>
                  <input type="text" className="w-full px-3 py-2 border border-bd rounded-md bg-gray-100" defaultValue="John Smith" readOnly />
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
                  { label: '2 Flashlights functional', extra: 'Problems in use, work order #', withCamera: true },
                  { label: 'Garrett metal detector functional', extra: 'Problems in use, work order #' },
                  { label: 'Big Set keys & keys present and secure', extra: 'Problems in use, work order #' },
                  { label: 'First Aid kits available and stocked', extra: 'Note if used, work order #' },
                  { label: 'Desk Computer/Monitor functional', extra: 'Problems in use, work order #' },
                ].map((row, idx) => (
                  <div key={row.label} className={`grid grid-cols-12 items-center gap-4 py-2 ${idx === 0 ? 'border-b' : 'border-y'} border-bd`}>
                    <div className="col-span-4"><p className="text-sm font-medium text-font-base">{row.label}</p></div>
                    <div className="col-span-3">
                      <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                        <button className={`flex-1 py-1.5 ${idx === 0 || idx === 1 || idx === 4 ? 'bg-primary text-white' : ''}`}>OK</button>
                        <button className="flex-1 py-1.5">Issue</button>
                      </div>
                    </div>
                    <div className={`col-span-5 ${row.withCamera ? 'flex items-center gap-2' : ''}`}>
                      <input type="text" placeholder={row.extra} className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      {row.withCamera && (
                        <button className="text-primary hover:text-primary-light"><i className="fa-solid fa-camera text-lg"></i></button>
                      )}
                    </div>
                  </div>
                ))}
                {/* Hardware Secure */}
                <div className="grid grid-cols-12 items-center gap-4 py-2 border-y border-bd">
                  <div className="col-span-4"><p className="text-sm font-medium text-font-base">Hardware Secure (hooks secure)</p></div>
                  <div className="col-span-3">
                    <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                      <button className="flex-1 py-1.5">Yes</button>
                      <button className="flex-1 py-1.5">No</button>
                    </div>
                  </div>
                  <div className="col-span-5">
                    <input type="text" placeholder="Problems in use, work order #" className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
                {/* Searches completed */}
                <div className="grid grid-cols-12 items-center gap-4 py-2 border-y border-bd">
                  <div className="col-span-4"><p className="text-sm font-medium text-font-base">Searches completed</p></div>
                  <div className="col-span-3">
                    <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                      <button className="flex-1 py-1.5">Yes</button>
                      <button className="flex-1 py-1.5">No</button>
                    </div>
                  </div>
                  <div className="col-span-5 flex gap-2">
                    <input type="time" className="px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                    <input type="time" className="px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
                {/* Fire drills completed */}
                <div className="grid grid-cols-12 items-center gap-4 py-2 border-y border-bd">
                  <div className="col-span-4"><p className="text-sm font-medium text-font-base">Fire drills completed</p></div>
                  <div className="col-span-3">
                    <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                      <button className="flex-1 py-1.5">Yes</button>
                      <button className="flex-1 py-1.5">No</button>
                    </div>
                  </div>
                  <div className="col-span-5">
                    <input type="text" placeholder="Problems in use, work order #" className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
                {/* Emergency lighting operational */}
                <div className="grid grid-cols-12 items-center gap-4 py-2">
                  <div className="col-span-4"><p className="text-sm font-medium text-font-base">Emergency lighting operational</p></div>
                  <div className="col-span-3">
                    <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                      <button className="flex-1 py-1.5">Yes</button>
                      <button className="flex-1 py-1.5">No</button>
                    </div>
                  </div>
                  <div className="col-span-5">
                    <input type="text" placeholder="Problems in use, work order #" className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
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
                      <button className="flex-1 py-1.5">Yes</button>
                      <button className="flex-1 py-1.5">No</button>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <select className="w-full px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                      <option>Normal</option>
                      <option>Critical</option>
                      <option>High Priority</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input type="text" placeholder="Comments" className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
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
                ].map((label) => (
                  <div key={label} className="grid grid-cols-12 items-center gap-4 py-2 border-b border-bd last:border-b-0">
                    <div className="col-span-4"><p className="text-sm font-medium text-font-base">{label}</p></div>
                    <div className="col-span-3">
                      <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                        <button className="flex-1 py-1.5">OK</button>
                        <button className="flex-1 py-1.5">Issue</button>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <select className="w-full px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                        <option>Normal</option>
                        <option>Critical</option>
                        <option>High Priority</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input type="text" placeholder="Comments" className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
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
                ].map((label) => (
                  <div key={label} className="grid grid-cols-12 items-center gap-4 py-2 border-b border-bd last:border-b-0">
                    <div className="col-span-4"><p className="text-sm font-medium text-font-base">{label}</p></div>
                    <div className="col-span-3">
                      <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                        <button className="flex-1 py-1.5">OK</button>
                        <button className="flex-1 py-1.5">Issue</button>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <select className="w-full px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                        <option>Normal</option>
                        <option>Critical</option>
                        <option>High Priority</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input type="text" placeholder="Comments" className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
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
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  {[ '2306','2307','2308','2309','2310','2311','2312','2313','2314','2315','2316','2317','2318','2319','2320' ].map((room) => (
                    <div key={room} className="flex items-center gap-3">
                      <label className="text-sm font-medium text-font-base w-16">Room {room}:</label>
                      <input type="text" placeholder="Any concerns..." className="flex-1 px-3 py-2 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Comments */}
            <div className="bg-white rounded-lg border border-bd">
              <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-primary">Additional Comments / Notes</h3>
              </div>
              <div className="p-4">
                <textarea rows={6} placeholder="Please provide any additional observations, concerns, or notes about this shift's unit condition inspection..." className="w-full px-4 py-3 border border-bd rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                <p className="text-xs text-font-detail mt-2">Use this space to document any issues not covered in the checklist above or provide additional context for reported concerns.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
