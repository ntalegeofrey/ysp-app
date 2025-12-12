'use client';
import Loading from '@/app/components/loading';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function StaffManagementPage() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Week navigation state for Schedule Overview
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sun
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day); // start from Sunday
    return d;
  };
  const [weekStart, setWeekStart] = useState<Date>(() => getStartOfWeek(new Date()));
  const weekEnd = useMemo(() => {
    const e = new Date(weekStart);
    e.setDate(e.getDate() + 6);
    return e;
  }, [weekStart]);
  const formatLabel = (start: Date, end: Date) => {
    const fmt = (d: Date) =>
      d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const year = end.getFullYear();
    return `${fmt(start)} - ${fmt(end)}, ${year}`;
  };
  const goPrevWeek = () => setWeekStart((s) => new Date(s.getFullYear(), s.getMonth(), s.getDate() - 7));
  const goNextWeek = () => setWeekStart((s) => new Date(s.getFullYear(), s.getMonth(), s.getDate() + 7));

  const tabs = [
    { id: 'schedule', label: 'Schedule Overview', icon: 'fa-calendar-days' },
    { id: 'overtime', label: 'Overtime Management', icon: 'fa-clock' },
    { id: 'timeoff', label: 'Time Off Requests', icon: 'fa-calendar-check' },
    { id: 'leave', label: 'Staff on Leave', icon: 'fa-calendar-xmark' },
  ];
  const handleEditSchedule = () => {
    setIsLoading(true);
    router.push('/dashboard/staff-management/edit-schedule');
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {isLoading && <Loading />}
      {/* TAB NAVIGATION */}
      <div className="border-b border-bd mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-font-detail hover:text-font-base'
              }`}
            >
              <i
                className={`fa-solid ${tab.icon} mr-2 ${
                  activeTab === tab.id ? 'text-primary' : 'text-font-detail'
                }`}
              ></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'schedule' && (
        <div>
          {/* Schedule Overview content */}
          <div id="schedule-tab" className="tab-content active">
            <div id="schedule-overview" className="bg-white rounded-lg border border-bd">
              <div className="p-6 border-b border-bd">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-font-base flex items-center">
                      <i className="fa-solid fa-calendar-days text-primary mr-3"></i>
                      Schedule Overview
                    </h3>
                    <div className="mt-2 text-sm text-font-detail">
                      Current week staffing schedule
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 flex-wrap">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-font-detail hover:text-primary rounded-lg"
                        onClick={goPrevWeek}
                        aria-label="Previous week"
                      >
                        <i className="fa-solid fa-chevron-left"></i>
                      </button>
                      <div className="px-4 py-2 bg-primary-lightest rounded-lg text-sm font-medium text-font-base">
                        {formatLabel(weekStart, weekEnd)}
                      </div>
                      <button
                        className="p-2 text-font-detail hover:text-primary rounded-lg"
                        onClick={goNextWeek}
                        aria-label="Next week"
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                    <button
                      onClick={handleEditSchedule}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm"
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      Create New Schedule
                    </button>
                    <button className="bg-success text-white px-4 py-2 rounded-lg hover:bg-primary-alt text-sm">
                      <i className="fa-solid fa-print mr-2"></i>
                      Print Schedule
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-primary-alt-lightest p-4 rounded-lg">
                    <div className="flex items-center">
                      <i className="fa-solid fa-users text-success text-xl mr-3"></i>
                      <div>
                        <p className="text-2xl font-bold text-success">98</p>
                        <p className="text-sm text-font-detail">Total Staff Scheduled</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg" style={{backgroundColor: '#FEF3C7'}}>
                    <div className="flex items-center">
                      <i className="fa-solid fa-clock text-warning text-xl mr-3"></i>
                      <div>
                        <p className="text-2xl font-bold text-warning">12</p>
                        <p className="text-sm text-font-detail">Open Overtime Slots</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-error-lightest p-4 rounded-lg">
                    <div className="flex items-center">
                      <i className="fa-solid fa-exclamation-triangle text-error text-xl mr-3"></i>
                      <div>
                        <p className="text-2xl font-bold text-error">8</p>
                        <p className="text-sm text-font-detail">Mandatory Overtime</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary-lightest p-4 rounded-lg">
                    <div className="flex items-center">
                      <i className="fa-solid fa-graduation-cap text-primary text-xl mr-3"></i>
                      <div>
                        <p className="text-2xl font-bold text-primary">15</p>
                        <p className="text-sm text-font-detail">Training Sessions</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-bd">
                    <thead className="bg-primary text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Day</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Day Shift (7AM-3PM)
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Evening (3PM-11PM)
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Overnight (11PM-7AM)
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-bd">
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-font-base">
                          Sun, Nov 17
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Davis, L. (JJYDS III)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 6/6 assigned</div>
                            <div className="text-xs text-gray-600">
                              Wilson M., Rodriguez A., Thompson K., Brown P., Martinez R., Johnson
                              D.
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Martinez, R. (JJYDS II)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 4/4 assigned</div>
                            <div className="text-xs text-gray-600">
                              Garcia L., Smith T., Williams C., Taylor M.
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Thompson, K. (JJYDS III)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 3/3 assigned</div>
                            <div className="text-xs text-gray-600">
                              Miller J., Davis P., Wilson A.
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-success text-white px-2 py-1 rounded text-xs">
                            Fully Staffed
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-primary hover:text-primary-light text-sm">
                            <i className="fa-solid fa-edit mr-1"></i>
                            Edit
                          </button>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-font-base">
                          Mon, Nov 18
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Davis, L. (JJYDS III)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 8/8 assigned</div>
                            <div className="text-xs text-gray-600">
                              Wilson M., Rodriguez A., Thompson K., Brown P., Martinez R., Johnson
                              D., Anderson S., Clark J.
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Martinez, R. (JJYDS II)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 5/6 assigned</div>
                            <div className="text-xs text-gray-600">
                              Garcia L., Smith T., Williams C., Taylor M., Jones R.
                            </div>
                            <span className="bg-warning text-white px-2 py-1 rounded text-xs">
                              1 OT Open
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Thompson, K. (JJYDS III)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 4/4 assigned</div>
                            <div className="text-xs text-gray-600">
                              Miller J., Davis P., Wilson A., Moore S.
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-warning text-white px-2 py-1 rounded text-xs">
                            Needs Coverage
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-primary hover:text-primary-light text-sm">
                            <i className="fa-solid fa-edit mr-1"></i>
                            Edit
                          </button>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-font-base">
                          Tue, Nov 19
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Wilson, M. (JJYDS III)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 8/8 assigned</div>
                            <div className="text-xs text-gray-600">
                              Rodriguez A., Thompson K., Brown P., Martinez R., Johnson D., Anderson
                              S., Clark J., Lee H.
                            </div>
                            <span className="bg-primary text-white px-2 py-1 rounded text-xs">
                              Training: 2 staff
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Anderson, J. (JJYDS II)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 6/6 assigned</div>
                            <div className="text-xs text-gray-600">
                              Garcia L., Smith T., Williams C., Taylor M., Jones R., White K.
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-error text-white px-2 py-1 rounded text-xs">
                              Supervisor: Brown, P. (MANDATORY)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 3/4 assigned</div>
                            <div className="text-xs text-gray-600">
                              Miller J., Davis P., Wilson A.
                            </div>
                            <span className="bg-error text-white px-2 py-1 rounded text-xs">
                              1 Mandatory OT
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-error text-white px-2 py-1 rounded text-xs">
                            Critical
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-primary hover:text-primary-light text-sm">
                            <i className="fa-solid fa-edit mr-1"></i>
                            Edit
                          </button>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-font-base">
                          Wed, Nov 20
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Davis, L. (JJYDS III)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 8/8 assigned</div>
                            <div className="text-xs text-gray-600">
                              Wilson M., Rodriguez A., Thompson K., Brown P., Martinez R., Johnson
                              D., Anderson S., Clark J.
                            </div>
                            <span className="bg-highlight text-white px-2 py-1 rounded text-xs">
                              Med Run: 2 staff
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Martinez, R. (JJYDS II)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 5/6 assigned</div>
                            <div className="text-xs text-gray-600">
                              Garcia L., Smith T., Williams C., Taylor M., Jones R.
                            </div>
                            <span className="bg-warning text-white px-2 py-1 rounded text-xs">
                              1 OT Open
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Thompson, K. (JJYDS III)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 4/4 assigned</div>
                            <div className="text-xs text-gray-600">
                              Miller J., Davis P., Wilson A., Moore S.
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-warning text-white px-2 py-1 rounded text-xs">
                            Needs Coverage
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-primary hover:text-primary-light text-sm">
                            <i className="fa-solid fa-edit mr-1"></i>
                            Edit
                          </button>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-font-base">
                          Thu, Nov 21
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Rodriguez, A. (JJYDS III)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 8/8 assigned</div>
                            <div className="text-xs text-gray-600">
                              Thompson K., Brown P., Martinez R., Johnson D., Anderson S., Clark J.,
                              Lee H., White K.
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Garcia, L. (JJYDS II)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 6/6 assigned</div>
                            <div className="text-xs text-gray-600">
                              Smith T., Williams C., Taylor M., Jones R., Moore S., Green B.
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Davis, P. (JJYDS III)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 4/4 assigned</div>
                            <div className="text-xs text-gray-600">
                              Miller J., Wilson A., Parker M., Foster D.
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-success text-white px-2 py-1 rounded text-xs">
                            Fully Staffed
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-primary hover:text-primary-light text-sm">
                            <i className="fa-solid fa-edit mr-1"></i>
                            Edit
                          </button>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-font-base">
                          Fri, Nov 22
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Davis, L. (JJYDS III)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 8/8 assigned</div>
                            <div className="text-xs text-gray-600">
                              Wilson M., Rodriguez A., Thompson K., Brown P., Martinez R., Johnson
                              D., Anderson S., Clark J.
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Martinez, R. (JJYDS II)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 5/6 assigned</div>
                            <div className="text-xs text-gray-600">
                              Garcia L., Smith T., Williams C., Taylor M., Jones R.
                            </div>
                            <span className="bg-warning text-white px-2 py-1 rounded text-xs">
                              1 OT Open
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <span className="bg-success text-white px-2 py-1 rounded text-xs">
                              Supervisor: Thompson, K. (JJYDS III)
                            </span>
                            <div className="text-xs text-font-detail">Staff: 4/4 assigned</div>
                            <div className="text-xs text-gray-600">
                              Miller J., Davis P., Wilson A., Moore S.
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-warning text-white px-2 py-1 rounded text-xs">
                            Needs Coverage
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-primary hover:text-primary-light text-sm">
                            <i className="fa-solid fa-edit mr-1"></i>
                            Edit
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-center">
                  <button className="text-primary hover:text-primary-light text-sm font-medium">
                    <i className="fa-solid fa-chevron-down mr-2"></i>
                    Load More Days
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overtime' && (
        <div>
          {/* Overtime Management content */}
          <div id="overtime-tab" className="tab-content ">
            <div id="overtime-requests" className="bg-white rounded-lg border border-bd mb-8">
              <div className="p-6 border-b border-bd">
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-clock text-primary mr-3"></i>
                  Overtime Requests & Open Slots
                </h3>
                <div className="mt-2 text-sm text-font-detail">
                  Staff overtime requests requiring approval and available overtime opportunities
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-font-base mb-4 flex items-center">
                      <i className="fa-solid fa-user-clock text-warning mr-2"></i>
                      Pending Overtime Requests
                    </h4>
                    <div className="space-y-3">
                      <div className="border border-bd rounded-lg p-4 bg-warning-lightest">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-font-base">
                            Rodriguez, Maria (JJYDS I)
                          </div>
                          <span className="bg-warning text-white px-2 py-1 rounded text-xs">
                            Pending
                          </span>
                        </div>
                        <div className="text-sm text-font-detail mb-3">
                          <p>
                            <strong>Shift:</strong> Wed Nov 20, Evening (3PM-11PM)
                          </p>
                          <p>
                            <strong>Reason:</strong> Voluntary pickup - needs extra hours
                          </p>
                          <p>
                            <strong>Requested:</strong> 2 hours ago
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-success text-white px-3 py-1 rounded text-xs hover:bg-primary-alt">
                            <i className="fa-solid fa-check mr-1"></i>
                            Approve
                          </button>
                          <button className="bg-error text-white px-3 py-1 rounded text-xs hover:bg-red-600">
                            <i className="fa-solid fa-times mr-1"></i>
                            Deny
                          </button>
                        </div>
                      </div>

                      <div className="border border-bd rounded-lg p-4 bg-warning-lightest">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-font-base">
                            Johnson, Kevin (JJYDS II)
                          </div>
                          <span className="bg-warning text-white px-2 py-1 rounded text-xs">
                            Pending
                          </span>
                        </div>
                        <div className="text-sm text-font-detail mb-3">
                          <p>
                            <strong>Shift:</strong> Fri Nov 22, Day (7AM-3PM)
                          </p>
                          <p>
                            <strong>Reason:</strong> Covering for staff on leave
                          </p>
                          <p>
                            <strong>Requested:</strong> 5 hours ago
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-success text-white px-3 py-1 rounded text-xs hover:bg-primary-alt">
                            <i className="fa-solid fa-check mr-1"></i>
                            Approve
                          </button>
                          <button className="bg-error text-white px-3 py-1 rounded text-xs hover:bg-red-600">
                            <i className="fa-solid fa-times mr-1"></i>
                            Deny
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-font-base mb-4 flex items-center">
                      <i className="fa-solid fa-clipboard-list text-error mr-2"></i>
                      Critical Open Slots
                    </h4>
                    <div className="space-y-3">
                      <div className="border border-error rounded-lg p-4 bg-error-lightest">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-font-base">Overnight Shift - URGENT</div>
                          <span className="bg-error text-white px-2 py-1 rounded text-xs">
                            Mandatory
                          </span>
                        </div>
                        <div className="text-sm text-font-detail mb-3">
                          <p>
                            <strong>Date:</strong> Tue Nov 19, 11PM-7AM
                          </p>
                          <p>
                            <strong>Position:</strong> JJYDS I/II
                          </p>
                          <p>
                            <strong>Status:</strong> No volunteers - mandatory assignment needed
                          </p>
                        </div>
                        <button className="bg-error text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                          <i className="fa-solid fa-bell"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeoff' && (
        <div>
          {/* Time Off Requests content */}
          <div id="timeoff-tab" className="tab-content ">
            <div id="time-off-requests" className="bg-white rounded-lg border border-bd mb-8">
              <div className="p-6 border-b border-bd">
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-calendar-check text-primary mr-3"></i>
                  Time Off Requests
                </h3>
                <div className="mt-2 text-sm text-font-detail">
                  Staff vacation, sick leave, and other time off requests requiring administrative
                  approval
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="border border-bd rounded-lg p-4 bg-warning-lightest">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-font-base">
                          Martinez, Carlos (JJYDS II)
                        </div>
                        <div className="text-sm text-font-detail">Vacation Request</div>
                      </div>
                      <span className="bg-warning text-white px-3 py-1 rounded text-sm">
                        Pending Review
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs font-medium text-font-detail mb-1">
                          REQUEST DETAILS
                        </div>
                        <div className="text-sm text-font-base">
                          <p>
                            <strong>Dates:</strong> Dec 15 - Dec 22, 2024 (6 days)
                          </p>
                          <p>
                            <strong>Type:</strong> Annual Leave
                          </p>
                          <p>
                            <strong>Submitted:</strong> Nov 15, 2024
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-font-detail mb-1">
                          STAFF REASON
                        </div>
                        <div className="text-sm text-font-base bg-white p-2 rounded border">
                          "Family vacation - visiting relatives for holidays. Have coverage arranged
                          with Johnson, K."
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-xs font-medium text-font-detail mb-2 block">
                        ADMIN COMMENTS
                      </label>
                      <textarea
                        className="w-full border border-bd-input rounded p-2 text-sm"
                        rows={2}
                        placeholder="Add comments for approval/denial..."
                      ></textarea>
                    </div>
                    <div className="flex space-x-3">
                      <button className="bg-success text-white px-4 py-2 rounded text-sm hover:bg-primary-alt flex items-center">
                        <i className="fa-solid fa-check mr-2"></i>
                        Approve Request
                      </button>
                      <button className="bg-error text-white px-4 py-2 rounded text-sm hover:bg-red-600 flex items-center">
                        <i className="fa-solid fa-times mr-2"></i>
                        Deny Request
                      </button>
                    </div>
                  </div>

                  <div className="border border-bd rounded-lg p-4 bg-warning-lightest">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-font-base">
                          Thompson, Angela (JJYDS I)
                        </div>
                        <div className="text-sm text-font-detail">Sick Leave Request</div>
                      </div>
                      <span className="bg-warning text-white px-3 py-1 rounded text-sm">
                        Pending Review
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs font-medium text-font-detail mb-1">
                          REQUEST DETAILS
                        </div>
                        <div className="text-sm text-font-base">
                          <p>
                            <strong>Dates:</strong> Nov 25 - Nov 29, 2024 (5 days)
                          </p>
                          <p>
                            <strong>Type:</strong> Medical Leave
                          </p>
                          <p>
                            <strong>Submitted:</strong> Nov 18, 2024
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-font-detail mb-1">
                          STAFF REASON
                        </div>
                        <div className="text-sm text-font-base bg-white p-2 rounded border">
                          "Minor surgery scheduled - doctor's note attached. Will provide medical
                          clearance before return."
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-xs font-medium text-font-detail mb-2 block">
                        ADMIN COMMENTS
                      </label>
                      <textarea
                        className="w-full border border-bd-input rounded p-2 text-sm"
                        rows={2}
                        placeholder="Add comments for approval/denial..."
                      ></textarea>
                    </div>
                    <div className="flex space-x-3">
                      <button className="bg-success text-white px-4 py-2 rounded text-sm hover:bg-primary-alt flex items-center">
                        <i className="fa-solid fa-check mr-2"></i>
                        Approve Request
                      </button>
                      <button className="bg-error text-white px-4 py-2 rounded text-sm hover:bg-red-600 flex items-center">
                        <i className="fa-solid fa-times mr-2"></i>
                        Deny Request
                      </button>
                    </div>
                  </div>

                  <div className="border border-bd rounded-lg p-4 bg-primary-lightest">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-font-base">
                          Davis, Robert (JJYDS III)
                        </div>
                        <div className="text-sm text-font-detail">Personal Leave Request</div>
                      </div>
                      <span className="bg-success text-white px-3 py-1 rounded text-sm">
                        Approved
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-xs font-medium text-font-detail mb-1">
                          REQUEST DETAILS
                        </div>
                        <div className="text-sm text-font-base">
                          <p>
                            <strong>Dates:</strong> Dec 1 - Dec 3, 2024 (3 days)
                          </p>
                          <p>
                            <strong>Type:</strong> Personal Leave
                          </p>
                          <p>
                            <strong>Approved:</strong> Nov 16, 2024
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-font-detail mb-1">
                          ADMIN COMMENTS
                        </div>
                        <div className="text-sm text-font-base bg-white p-2 rounded border">
                          "Approved - adequate coverage available. Overtime scheduled for
                          replacement staff."
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-bd rounded-lg p-4 bg-error-lightest">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-font-base">
                          Wilson, Patricia (Caseworker)
                        </div>
                        <div className="text-sm text-font-detail">Vacation Request</div>
                      </div>
                      <span className="bg-error text-white px-3 py-1 rounded text-sm">Denied</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-xs font-medium text-font-detail mb-1">
                          REQUEST DETAILS
                        </div>
                        <div className="text-sm text-font-base">
                          <p>
                            <strong>Dates:</strong> Nov 20 - Nov 27, 2024 (6 days)
                          </p>
                          <p>
                            <strong>Type:</strong> Annual Leave
                          </p>
                          <p>
                            <strong>Denied:</strong> Nov 17, 2024
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-font-detail mb-1">
                          ADMIN COMMENTS
                        </div>
                        <div className="text-sm text-font-base bg-white p-2 rounded border">
                          "Unable to approve - insufficient coverage during Thanksgiving week.
                          Please resubmit for alternative dates."
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button className="text-primary hover:text-primary-light text-sm font-medium">
                    <i className="fa-solid fa-chevron-down mr-2"></i>
                    Load More Requests
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leave' && (
        <div>
          {/* Staff on Leave content */}
          <div id="leave-tab" className="tab-content ">
            <div id="staff-leave-section" className="bg-white rounded-lg border border-bd mb-8">
              <div className="p-6 border-b border-bd">
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-calendar-xmark text-primary mr-3"></i>
                  Staff on Leave & Unavailable
                </h3>
                <div className="mt-2 text-sm text-font-detail">
                  Current staff members on vacation, sick leave, or other approved absences
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-font-base mb-4 flex items-center">
                      <i className="fa-solid fa-umbrella-beach text-success mr-2"></i>
                      Vacation Leave
                    </h4>
                    <div className="space-y-3">
                      <div className="border border-bd rounded-lg p-3 bg-primary-lightest">
                        <div className="font-medium text-font-base">
                          Henderson, Sarah (JJYDS II)
                        </div>
                        <div className="text-sm text-font-detail">Nov 18 - Nov 25, 2024</div>
                        <div className="text-xs text-font-medium mt-1">Returns: Monday, Nov 26</div>
                      </div>
                      <div className="border border-bd rounded-lg p-3 bg-primary-lightest">
                        <div className="font-medium text-font-base">Parker, Michael (JJYDS I)</div>
                        <div className="text-sm text-font-detail">Nov 20 - Nov 22, 2024</div>
                        <div className="text-xs text-font-medium mt-1">
                          Returns: Saturday, Nov 23
                        </div>
                      </div>
                      <div className="border border-bd rounded-lg p-3 bg-primary-lightest">
                        <div className="font-medium text-font-base">
                          Collins, Jennifer (Caseworker)
                        </div>
                        <div className="text-sm text-font-detail">Nov 21 - Dec 2, 2024</div>
                        <div className="text-xs text-font-medium mt-1">Returns: Monday, Dec 3</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-font-base mb-4 flex items-center">
                      <i className="fa-solid fa-thermometer text-error mr-2"></i>
                      Sick Leave
                    </h4>
                    <div className="space-y-3">
                      <div className="border border-bd rounded-lg p-3 bg-error-lightest">
                        <div className="font-medium text-font-base">Foster, David (JJYDS I)</div>
                        <div className="text-sm text-font-detail">Started: Nov 17, 2024</div>
                        <div className="text-xs text-font-medium mt-1">Expected Return: Nov 21</div>
                      </div>
                      <div className="border border-bd rounded-lg p-3 bg-error-lightest">
                        <div className="font-medium text-font-base">
                          Wright, Lisa (Support Staff)
                        </div>
                        <div className="text-sm text-font-detail">Started: Nov 19, 2024</div>
                        <div className="text-xs text-font-medium mt-1">Expected Return: TBD</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-font-base mb-4 flex items-center">
                      <i className="fa-solid fa-user-injured text-warning mr-2"></i>
                      Other Leave
                    </h4>
                    <div className="space-y-3">
                      <div className="border border-bd rounded-lg p-3 bg-warning-lightest">
                        <div className="font-medium text-font-base">Torres, Carlos (JJYDS II)</div>
                        <div className="text-sm text-font-detail">Family Medical Leave</div>
                        <div className="text-xs text-font-medium mt-1">Nov 15 - Dec 15, 2024</div>
                      </div>
                      <div className="border border-bd rounded-lg p-3 bg-warning-lightest">
                        <div className="font-medium text-font-base">Adams, Patricia (JJYDS I)</div>
                        <div className="text-sm text-font-detail">Workers Compensation</div>
                        <div className="text-xs text-font-medium mt-1">Nov 10 - Nov 30, 2024</div>
                      </div>
                      <div className="border border-bd rounded-lg p-3 bg-warning-lightest">
                        <div className="font-medium text-font-base">Newman, Robert (JJYDS III)</div>
                        <div className="text-sm text-font-detail">Bereavement Leave</div>
                        <div className="text-xs text-font-medium mt-1">Nov 12 - Nov 18, 2024</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
