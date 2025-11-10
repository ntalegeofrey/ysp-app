'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function SchedulePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'schedule' | 'overtime' | 'timeoff' | 'callout'>('schedule');

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t === 'schedule' || t === 'overtime' || t === 'timeoff' || t === 'callout') {
      setActiveTab(t);
    }
  }, [searchParams]);

  const tabBtnBase = 'flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors';
  const tabBtnInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';
  const tabBtnActive = 'border-primary text-primary';

  const handleTabChange = (tab: 'schedule' | 'overtime' | 'timeoff' | 'callout') => {
    setActiveTab(tab);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('tab', tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
        </div>
      </section>
    </div>
  );
}
