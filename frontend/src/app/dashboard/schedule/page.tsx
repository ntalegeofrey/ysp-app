'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

function ScheduleInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'schedule' | 'overtime' | 'timeoff' | 'callout' | 'archive' | 'selfreport'>('schedule');

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t === 'schedule' || t === 'overtime' || t === 'timeoff' || t === 'callout' || t === 'archive' || t === 'selfreport') {
      setActiveTab(t);
    }
  }, [searchParams]);

  const tabBtnBase = 'flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors';
  const tabBtnInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';
  const tabBtnActive = 'border-primary text-primary';

  const handleTabChange = (tab: 'schedule' | 'overtime' | 'timeoff' | 'callout' | 'archive' | 'selfreport') => {
    setActiveTab(tab);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('tab', tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const overtimeRecords = useMemo(
    () => [
      { id: 1, staff: 'Johnson, Kevin (JJYDS II)', date: '2024-11-12', shift: 'Evening (3PM-11PM)', type: 'Mandatory', calledOut: false, forceStart: '2024-11-12 23:00', forceEnd: '2024-11-13 03:00', durationHrs: 4, notes: 'Shift coverage' },
      { id: 2, staff: 'Smith, Jennifer (JJYDS I)', date: '2024-11-13', shift: 'Day (7AM-3PM)', type: 'Voluntary', calledOut: false, forceStart: '', forceEnd: '', durationHrs: 2, notes: 'Training overlap' },
      { id: 3, staff: 'Rodriguez, Maria (JJYDS I)', date: '2024-11-14', shift: 'Overnight (11PM-7AM)', type: 'Mandatory', calledOut: true, forceStart: '2024-11-15 07:00', forceEnd: '2024-11-15 09:00', durationHrs: 2, notes: 'Backfill due to call-out' },
      { id: 4, staff: 'Brown, Michael (Support)', date: '2024-11-15', shift: 'Evening (3PM-11PM)', type: 'Voluntary', calledOut: false, forceStart: '', forceEnd: '', durationHrs: 3, notes: 'Event coverage' },
      { id: 5, staff: 'Anderson, James (JJYDS II)', date: '2024-11-16', shift: 'Day (7AM-3PM)', type: 'Mandatory', calledOut: false, forceStart: '2024-11-16 15:00', forceEnd: '2024-11-16 19:00', durationHrs: 4, notes: 'Mandatory force' },
      { id: 6, staff: 'Lee, Samuel (JJYDS I)', date: '2024-11-17', shift: 'Evening (3PM-11PM)', type: 'Voluntary', calledOut: false, forceStart: '', forceEnd: '', durationHrs: 1, notes: 'Short coverage' },
      { id: 7, staff: 'Taylor, Dana (JJYDS II)', date: '2024-11-18', shift: 'Overnight (11PM-7AM)', type: 'Mandatory', calledOut: false, forceStart: '2024-11-18 07:00', forceEnd: '2024-11-18 11:00', durationHrs: 4, notes: 'Coverage after call-out' },
      { id: 8, staff: 'Wilson, Chris (JJYDS I)', date: '2024-11-19', shift: 'Day (7AM-3PM)', type: 'Voluntary', calledOut: false, forceStart: '', forceEnd: '', durationHrs: 2, notes: 'Project assistance' },
      { id: 9, staff: 'Garcia, Paula (JJYDS II)', date: '2024-11-20', shift: 'Evening (3PM-11PM)', type: 'Mandatory', calledOut: true, forceStart: '2024-11-20 23:00', forceEnd: '2024-11-21 01:00', durationHrs: 2, notes: 'Emergency coverage' },
      { id: 10, staff: 'Thompson, Alex (JJYDS III)', date: '2024-11-21', shift: 'Day (7AM-3PM)', type: 'Mandatory', calledOut: false, forceStart: '2024-11-21 15:00', forceEnd: '2024-11-21 17:00', durationHrs: 2, notes: 'Mandatory force' },
      { id: 11, staff: 'Davis, Linda (JJYDS III)', date: '2024-11-22', shift: 'Overnight (11PM-7AM)', type: 'Voluntary', calledOut: false, forceStart: '', forceEnd: '', durationHrs: 3, notes: 'Overtime preference' },
      { id: 12, staff: 'Martinez, Raul (JJYDS II)', date: '2024-11-23', shift: 'Evening (3PM-11PM)', type: 'Mandatory', calledOut: false, forceStart: '2024-11-23 23:00', forceEnd: '2024-11-24 03:00', durationHrs: 4, notes: 'Short staffed' },
    ],
    []
  );
  const [archivePage, setArchivePage] = useState(1);
  const pageSize = 6;
  const archiveTotalPages = Math.ceil(overtimeRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(
    () => overtimeRecords.slice((archivePage - 1) * pageSize, archivePage * pageSize),
    [overtimeRecords, archivePage]
  );

  return (
    <div className="space-y-6">
      {/* Header inside the card */}
      <section className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-font-base">Staff Schedule & Overtime</h3>
              <div className="mt-2 text-sm text-font-detail">
                View your two-week schedule and manage overtime and requests
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-2">
          <nav className="flex space-x-8 border-b border-bd">
            <button
              className={`${tabBtnBase} ${activeTab === 'schedule' ? tabBtnActive : tabBtnInactive}`}
              onClick={() => handleTabChange('schedule')}
            >
              <i className={`fa-solid fa-calendar-days mr-2 ${activeTab === 'schedule' ? 'text-primary' : 'text-font-detail'}`}></i>
              My Schedule
            </button>
            <button
              className={`${tabBtnBase} ${activeTab === 'overtime' ? tabBtnActive : tabBtnInactive}`}
              onClick={() => handleTabChange('overtime')}
            >
              <i className={`fa-solid fa-clock mr-2 ${activeTab === 'overtime' ? 'text-primary' : 'text-font-detail'}`}></i>
              Overtime Opportunities
            </button>
            <button
              className={`${tabBtnBase} ${activeTab === 'timeoff' ? tabBtnActive : tabBtnInactive}`}
              onClick={() => handleTabChange('timeoff')}
            >
              <i className={`fa-solid fa-calendar-xmark mr-2 ${activeTab === 'timeoff' ? 'text-primary' : 'text-font-detail'}`}></i>
              Time Off Requests
            </button>
            <button
              className={`${tabBtnBase} ${activeTab === 'callout' ? tabBtnActive : tabBtnInactive}`}
              onClick={() => handleTabChange('callout')}
            >
              <i className={`fa-solid fa-phone-slash mr-2 ${activeTab === 'callout' ? 'text-primary' : 'text-font-detail'}`}></i>
              Call-Out Logging
            </button>
            <button
              className={`${tabBtnBase} ${activeTab === 'selfreport' ? tabBtnActive : tabBtnInactive}`}
              onClick={() => handleTabChange('selfreport')}
            >
              <i className={`fa-solid fa-file-signature mr-2 ${activeTab === 'selfreport' ? 'text-primary' : 'text-font-detail'}`}></i>
              Self-Report Mandatory Force
            </button>
            <button
              className={`${tabBtnBase} ${activeTab === 'archive' ? tabBtnActive : tabBtnInactive}`}
              onClick={() => handleTabChange('archive')}
            >
              <i className={`fa-solid fa-folder mr-2 ${activeTab === 'archive' ? 'text-primary' : 'text-font-detail'}`}></i>
              Overtime Archive
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'schedule' && (
            <div className="overflow-x-auto">
              <table className="w-full border border-bd text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-3 py-3 text-left font-medium border-r border-primary-light">Date</th>
                    <th className="px-3 py-3 text-center font-medium border-r border-primary-light">Day Shift (7AM-3PM)</th>
                    <th className="px-3 py-3 text-center font-medium border-r border-primary-light">Evening (3PM-11PM)</th>
                    <th className="px-3 py-3 text-center font-medium">Overnight (11PM-7AM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bd">
                  {/* Row 1 */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-4 font-medium text-font-base border-r border-bd">
                      <div>Mon, Nov 18</div>
                      <div className="text-xs text-font-detail">Week 1</div>
                    </td>
                    <td className="px-3 py-4 border-r border-bd">
                      <div className="space-y-2">
                        <div className="bg-primary-alt-lightest border border-primary-alt rounded p-2">
                          <div className="text-xs font-medium text-primary-alt">Davis, L. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Johnson, M. • Rodriguez, M.</div>
                          <div className="text-xs text-font-detail">Smith, J. • Brown, K.</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 border-r border-bd">
                      <div className="space-y-2">
                        <div className="bg-primary-alt-lightest border border-primary-alt rounded p-2">
                          <div className="text-xs font-medium text-primary-alt">Martinez, R. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Thompson, A. • Wilson, C.</div>
                          <div className="text-xs text-font-detail">Garcia, P.</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="space-y-2">
                        <div className="bg-primary-alt-lightest border border-primary-alt rounded p-2">
                          <div className="text-xs font-medium text-primary-alt">Anderson, J. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Lee, S. • Taylor, D.</div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-4 font-medium text-font-base border-r border-bd">
                      <div>Tue, Nov 19</div>
                      <div className="text-xs text-font-detail">Week 1</div>
                    </td>
                    <td className="px-3 py-4 border-r border-bd">
                      <div className="space-y-2">
                        <div className="bg-primary-alt-lightest border border-primary-alt rounded p-2">
                          <div className="text-xs font-medium text-primary-alt">Wilson, M. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Brown, K. • Garcia, P.</div>
                          <div className="text-xs text-font-detail">Lee, S. • Taylor, D.</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 border-r border-bd">
                      <div className="space-y-2">
                        <div className="bg-highlight-lightest border border-warning rounded p-2">
                          <div className="text-xs font-medium text-warning">Martinez, R. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Thompson, A. • Wilson, C.</div>
                          <div className="bg-warning text-white px-2 py-1 rounded text-xs mt-1 w-fit">1 OT SLOT OPEN</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="space-y-2">
                        <div className="bg-primary-alt-lightest border border-primary-alt rounded p-2">
                          <div className="text-xs font-medium text-primary-alt">Thompson, K. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Johnson, M. • Rodriguez, M.</div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-4 font-medium text-font-base border-r border-bd">
                      <div>Wed, Nov 20</div>
                      <div className="text-xs text-font-detail">Week 1</div>
                    </td>
                    <td className="px-3 py-4 border-r border-bd">
                      <div className="space-y-2">
                        <div className="bg-primary-alt-lightest border border-primary-alt rounded p-2">
                          <div className="text-xs font-medium text-primary-alt">Davis, L. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Johnson, M. • Smith, J.</div>
                          <div className="text-xs text-font-detail">Garcia, P. • Taylor, D.</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 border-r border-bd">
                      <div className="space-y-2">
                        <div className="bg-primary-alt-lightest border border-primary-alt rounded p-2">
                          <div className="text-xs font-medium text-primary-alt">Anderson, J. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Rodriguez, M. • Wilson, C.</div>
                          <div className="text-xs text-font-detail">Lee, S.</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="space-y-2">
                        <div className="bg-primary-alt-lightest border border-primary-alt rounded p-2">
                          <div className="text-xs font-medium text-primary-alt">Martinez, R. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Brown, K. • Thompson, A.</div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-4 font-medium text-font-base border-r border-bd">
                      <div>Thu, Nov 21</div>
                      <div className="text-xs text-font-detail">Week 1</div>
                    </td>
                    <td className="px-3 py-4 border-r border-bd">
                      <div className="space-y-2">
                        <div className="bg-error-lightest border border-error rounded p-2">
                          <div className="text-xs font-medium text-error">Wilson, M. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Lee, S. • Taylor, D.</div>
                          <div className="bg-error text-white px-2 py-1 rounded text-xs mt-1 w-fit">2 MANDATORY OT</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 border-r border-bd">
                      <div className="space-y-2">
                        <div className="bg-primary-alt-lightest border border-primary-alt rounded p-2">
                          <div className="text-xs font-medium text-primary-alt">Thompson, K. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Johnson, M. • Garcia, P.</div>
                          <div className="text-xs text-font-detail">Wilson, C.</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="space-y-2">
                        <div className="bg-primary-alt-lightest border border-primary-alt rounded p-2">
                          <div className="text-xs font-medium text-primary-alt">Davis, L. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Rodriguez, M. • Brown, K.</div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-4 font-medium text-font-base border-r border-bd">
                      <div>Fri, Nov 22</div>
                      <div className="text-xs text-font-detail">Week 1</div>
                    </td>
                    <td className="px-3 py-4 border-r border-bd">
                      <div className="space-y-2">
                        <div className="bg-primary-alt-lightest border border-primary-alt rounded p-2">
                          <div className="text-xs font-medium text-primary-alt">Anderson, J. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Smith, J. • Thompson, A.</div>
                          <div className="text-xs text-font-detail">Garcia, P. • Lee, S.</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 border-r border-bd">
                      <div className="space-y-2">
                        <div className="bg-primary-alt-lightest border border-primary-alt rounded p-2">
                          <div className="text-xs font-medium text-primary-alt">Martinez, R. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Johnson, M. • Wilson, C.</div>
                          <div className="text-xs text-font-detail">Taylor, D.</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="space-y-2">
                        <div className="bg-highlight-lightest border border-warning rounded p-2">
                          <div className="text-xs font-medium text-warning">Thompson, K. (Supervisor)</div>
                          <div className="text-xs text-font-detail">Rodriguez, M.</div>
                          <div className="bg-warning text-white px-2 py-1 rounded text-xs mt-1 w-fit">1 OT SLOT OPEN</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'overtime' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-warning rounded-lg p-4 bg-warning-lightest">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-font-base">Evening Shift - Nov 19</div>
                  <span className="bg-warning text-white px-2 py-1 rounded text-xs">AVAILABLE</span>
                </div>
                <div className="space-y-2 text-sm text-font-detail mb-4">
                  <p><strong>Time:</strong> 3:00 PM - 11:00 PM</p>
                  <p><strong>Supervisor:</strong> Martinez, R. (JJYDS II)</p>
                  <p><strong>Rate:</strong> Time and Half</p>
                  <p><strong>Reason:</strong> Staff coverage needed</p>
                </div>
                <button className="w-full bg-primary text-white py-2 rounded hover:bg-primary-light">
                  <i className="fa-solid fa-hand-point-up mr-2"></i>
                  Request This Overtime
                </button>
              </div>

              <div className="border border-warning rounded-lg p-4 bg-warning-lightest">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-font-base">Day Shift - Nov 23</div>
                  <span className="bg-warning text-white px-2 py-1 rounded text-xs">AVAILABLE</span>
                </div>
                <div className="space-y-2 text-sm text-font-detail mb-4">
                  <p><strong>Time:</strong> 7:00 AM - 3:00 PM</p>
                  <p><strong>Supervisor:</strong> Davis, L. (JJYDS III)</p>
                  <p><strong>Rate:</strong> Time and Half</p>
                  <p><strong>Reason:</strong> Vacation coverage</p>
                </div>
                <button className="w-full bg-primary text-white py-2 rounded hover:bg-primary-light">
                  <i className="fa-solid fa-hand-point-up mr-2"></i>
                  Request This Overtime
                </button>
              </div>

              <div className="border border-error rounded-lg p-4 bg-error-lightest">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-font-base">Overnight - Nov 24</div>
                  <span className="bg-error text-white px-2 py-1 rounded text-xs">URGENT</span>
                </div>
                <div className="space-y-2 text-sm text-font-detail mb-4">
                  <p><strong>Time:</strong> 11:00 PM - 7:00 AM</p>
                  <p><strong>Supervisor:</strong> Thompson, K. (JJYDS III)</p>
                  <p><strong>Rate:</strong> Double Time</p>
                  <p><strong>Reason:</strong> Emergency coverage needed</p>
                </div>
                <button className="w-full bg-error text-white py-2 rounded hover:bg-red-600">
                  <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                  Request Urgent Overtime
                </button>
              </div>

              <div className="border border-warning rounded-lg p-4 bg-warning-lightest">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-font-base">Evening Shift - Nov 25</div>
                  <span className="bg-warning text-white px-2 py-1 rounded text-xs">AVAILABLE</span>
                </div>
                <div className="space-y-2 text-sm text-font-detail mb-4">
                  <p><strong>Time:</strong> 3:00 PM - 11:00 PM</p>
                  <p><strong>Supervisor:</strong> Anderson, J. (JJYDS II)</p>
                  <p><strong>Rate:</strong> Time and Half</p>
                  <p><strong>Reason:</strong> Additional coverage</p>
                </div>
                <button className="w-full bg-primary text-white py-2 rounded hover:bg-primary-light">
                  <i className="fa-solid fa-hand-point-up mr-2"></i>
                  Request This Overtime
                </button>
              </div>
            </div>
          )}

          {activeTab === 'timeoff' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Request Form */}
              <div className="space-y-6">
                <h4 className="font-semibold text-font-base border-b border-bd pb-2">New Time Off Request</h4>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Type of Leave</label>
                    <select className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent">
                      <option>Select leave type...</option>
                      <option>Vacation</option>
                      <option>Personal</option>
                      <option>Sick</option>
                      <option>Comp Time</option>
                      <option>Holiday</option>
                      <option>Swap Days with Another Employee</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Start Date</label>
                      <input type="date" className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">End Date</label>
                      <input type="date" className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Hours Requested</label>
                    <input type="number" className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent" placeholder="Enter hours" min={1} max={40} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Reason for Request</label>
                    <textarea className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent" rows={3} placeholder="Provide details for your time off request..." />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button type="button" className="px-4 py-2 text-sm font-medium text-font-base border border-bd rounded-lg hover:bg-gray-50">Clear</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-light">
                      <i className="fa-solid fa-paper-plane mr-2"></i>
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>

              {/* Request Status */}
              <div className="space-y-6">
                <h4 className="font-semibold text-font-base border-b border-bd pb-2">My Time Off Requests</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="border border-primary-alt rounded-lg p-4 bg-primary-alt-lightest">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-font-base">Vacation - Dec 15-16, 2024</div>
                      <span className="bg-primary-alt text-white px-2 py-1 rounded text-xs">APPROVED</span>
                    </div>
                    <div className="text-sm text-font-detail space-y-1">
                      <p><strong>Hours:</strong> 16 hours</p>
                      <p><strong>Approved by:</strong> Davis, L. (JJYDS III)</p>
                      <p><strong>Comments:</strong> Approved for holiday weekend</p>
                      <p className="text-xs text-font-medium">Submitted: Nov 10, 2024</p>
                    </div>
                  </div>

                  <div className="border border-warning rounded-lg p-4 bg-warning-lightest">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-font-base">Personal - Dec 22, 2024</div>
                      <span className="bg-warning text-white px-2 py-1 rounded text-xs">PENDING</span>
                    </div>
                    <div className="text-sm text-font-detail space-y-1">
                      <p><strong>Hours:</strong> 8 hours</p>
                      <p><strong>Reason:</strong> Family appointment</p>
                      <p className="text-xs text-font-medium">Submitted: Nov 18, 2024</p>
                    </div>
                  </div>

                  <div className="border border-error rounded-lg p-4 bg-error-lightest">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-font-base">Comp Time - Nov 28, 2024</div>
                      <span className="bg-error text-white px-2 py-1 rounded text-xs">DENIED</span>
                    </div>
                    <div className="text-sm text-font-detail space-y-1">
                      <p><strong>Hours:</strong> 8 hours</p>
                      <p><strong>Denied by:</strong> Martinez, R. (JJYDS II)</p>
                      <p><strong>Comments:</strong> Insufficient staffing for Thanksgiving week</p>
                      <p className="text-xs text-font-medium">Submitted: Nov 15, 2024</p>
                    </div>
                  </div>

                  <div className="border border-primary-alt rounded-lg p-4 bg-primary-alt-lightest">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-font-base">Swap Days - Nov 25, 2024</div>
                      <span className="bg-primary-alt text-white px-2 py-1 rounded text-xs">APPROVED</span>
                    </div>
                    <div className="text-sm text-font-detail space-y-1">
                      <p><strong>Hours:</strong> 8 hours</p>
                      <p><strong>Swapping with:</strong> Rodriguez, M.</p>
                      <p><strong>Comments:</strong> Both parties confirmed swap</p>
                      <p className="text-xs text-font-medium">Submitted: Nov 12, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'callout' && (
            <form className="grid grid-cols-1 lg:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Staff Member Calling Out</label>
                  <select className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent">
                    <option>Select staff member...</option>
                    <option>Rodriguez, Maria (JJYDS I)</option>
                    <option>Johnson, Kevin (JJYDS II)</option>
                    <option>Smith, Jennifer (JJYDS I)</option>
                    <option>Brown, Michael (Support)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Shift Date & Time</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" className="border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent" defaultValue="2024-11-19" />
                    <select className="border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent">
                      <option>Day (7AM-3PM)</option>
                      <option>Evening (3PM-11PM)</option>
                      <option>Overnight (11PM-7AM)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Reason for Call-Out</label>
                  <select className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent">
                    <option>Select reason...</option>
                    <option>Sick Leave</option>
                    <option>Family Emergency</option>
                    <option>Personal Emergency</option>
                    <option>Transportation Issue</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Additional Notes</label>
                  <textarea className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent" rows={3} placeholder="Enter any additional details..." />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Staff Member Replacing</label>
                  <select className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent">
                    <option>Select staff member...</option>
                    <option>Johnson, Kevin (JJYDS II)</option>
                    <option>Smith, Jennifer (JJYDS I)</option>
                    <option>Brown, Michael (Support)</option>
                    <option>Anderson, James (JJYDS II)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Replacement Shift</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" className="border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent" defaultValue="2024-11-19" />
                    <select className="border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent">
                      <option>Day (7AM-3PM)</option>
                      <option>Evening (3PM-11PM)</option>
                      <option>Overnight (11PM-7AM)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Replacement Rate</label>
                  <select className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent">
                    <option>Regular Rate</option>
                    <option>Time and Half</option>
                    <option>Double Time</option>
                    <option>Special Rate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Replacement Notes</label>
                  <textarea className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent" rows={3} placeholder="Enter any additional details..." />
                </div>
              </div>
              <div className="lg:col-span-2 flex justify-end">
                <button type="button" className="px-4 py-2 text-sm font-medium text-font-base border border-bd rounded-lg hover:bg-gray-50 mr-2">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-light">Submit Call-Out</button>
              </div>
            </form>
          )}

          {activeTab === 'archive' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full border border-bd text-sm">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-3 py-3 text-left font-medium border-r border-primary-light">Staff</th>
                      <th className="px-3 py-3 text-left font-medium border-r border-primary-light">Date</th>
                      <th className="px-3 py-3 text-left font-medium border-r border-primary-light">Shift</th>
                      <th className="px-3 py-3 text-left font-medium border-r border-primary-light">Status</th>
                      <th className="px-3 py-3 text-left font-medium border-r border-primary-light">Start</th>
                      <th className="px-3 py-3 text-left font-medium border-r border-primary-light">End</th>
                      <th className="px-3 py-3 text-left font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bd">
                    {paginatedRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3">{r.staff}</td>
                        <td className="px-3 py-3">{new Date(r.date).toLocaleDateString()}</td>
                        <td className="px-3 py-3">{r.shift}</td>
                        <td className="px-3 py-3">
                          {r.calledOut ? (
                            <span className="bg-error text-white px-2 py-1 rounded text-xs">Called Out</span>
                          ) : r.type === 'Mandatory' ? (
                            <span className="bg-error text-white px-2 py-1 rounded text-xs">Mandatory Force</span>
                          ) : (
                            <span className="bg-primary-alt text-white px-2 py-1 rounded text-xs">Voluntary OT</span>
                          )}
                        </td>
                        <td className="px-3 py-3">{r.calledOut ? (r.forceStart || r.date) : (r.forceStart || '-')}</td>
                        <td className="px-3 py-3">{r.calledOut ? '-' : (r.forceEnd || '-')}</td>
                        <td className="px-3 py-3">{r.durationHrs} hrs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-font-detail">
                  Page {archivePage} of {archiveTotalPages}
                </div>
                <div className="space-x-2">
                  <button
                    className="px-3 py-1 border border-bd rounded text-sm disabled:opacity-50"
                    onClick={() => setArchivePage((p) => Math.max(1, p - 1))}
                    disabled={archivePage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1 border border-bd rounded text-sm disabled:opacity-50"
                    onClick={() => setArchivePage((p) => Math.min(archiveTotalPages, p + 1))}
                    disabled={archivePage === archiveTotalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'selfreport' && (
            <form className="grid grid-cols-1 lg:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Staff Member</label>
                  <select className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent">
                    <option>Select staff member...</option>
                    <option>Johnson, Kevin (JJYDS II)</option>
                    <option>Smith, Jennifer (JJYDS I)</option>
                    <option>Rodriguez, Maria (JJYDS I)</option>
                    <option>Brown, Michael (Support)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Shift</label>
                  <select className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent">
                    <option>Day (7AM-3PM)</option>
                    <option>Evening (3PM-11PM)</option>
                    <option>Overnight (11PM-7AM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Date</label>
                  <input type="date" className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Force Start</label>
                  <input type="datetime-local" className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Force End</label>
                  <input type="datetime-local" className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Reason / Notes</label>
                  <textarea className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent" rows={3} placeholder="Describe circumstances of the mandatory force..." />
                </div>
              </div>
              <div className="lg:col-span-2 flex justify-end">
                <button type="button" className="px-4 py-2 text-sm font-medium text-font-base border border-bd rounded-lg hover:bg-gray-50 mr-2">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-light">Submit Self-Report</button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<div className="space-y-6" />}> 
      <ScheduleInner />
    </Suspense>
  );
}
