'use client';

export default function StaffRoster() {
  const staffList = [
    { name: 'Davis, Linda', position: 'JJYDS III', status: 'Available', shifts: 5, otHours: 4 },
    { name: 'Wilson, Marcus', position: 'JJYDS II', status: 'Available', shifts: 5, otHours: 8 },
    { name: 'Thompson, Kevin', position: 'JJYDS III', status: 'Available', shifts: 4, otHours: 0 },
    { name: 'Rodriguez, Ana', position: 'JJYDS I', status: 'Training', shifts: 3, otHours: 12 },
    { name: 'Martinez, Carlos', position: 'JJYDS II', status: 'Available', shifts: 5, otHours: 6 },
    { name: 'Henderson, Sarah', position: 'JJYDS II', status: 'On Leave', shifts: 0, otHours: 0, leaveUntil: 'Nov 26' },
    { name: 'Foster, David', position: 'JJYDS I', status: 'Out Sick', shifts: 0, otHours: 0 },
    { name: 'Garcia, Luis', position: 'JJYDS I', status: 'Available', shifts: 5, otHours: 14 },
    { name: 'Brown, Patricia', position: 'JJYDS II', status: 'Available', shifts: 5, otHours: 10 },
    { name: 'Johnson, Michael', position: 'JJYDS I', status: 'Training', shifts: 2, otHours: 0 },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'Available') return 'bg-success text-white';
    if (status === 'Training') return 'bg-highlight text-white';
    if (status === 'On Leave') return 'bg-primary text-white';
    if (status === 'Out Sick') return 'bg-error text-white';
    return 'bg-font-detail text-white';
  };

  return (
    <div className="bg-white rounded-lg border border-bd">
      <div className="p-6 border-b border-bd">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-font-base">Staff Roster</h3>
            <div className="mt-2 text-sm text-font-detail">
              View staff availability, assignments, and overtime hours
            </div>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
            <i className="fa-solid fa-download mr-2"></i>
            Export List
          </button>
        </div>
      </div>

      <div className="p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-bd">
              <th className="text-left py-3 px-4 text-xs font-semibold text-font-detail">Staff Member</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-font-detail">Position</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-font-detail">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-font-detail">Shifts This Week</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-font-detail">OT Hours (Month)</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-font-detail">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff, idx) => (
              <tr key={idx} className="border-b border-bd hover:bg-bg-subtle">
                <td className="py-3 px-4">
                  <div className="font-medium text-font-base">{staff.name}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-font-base">{staff.position}</div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(staff.status)}`}>
                    {staff.status}
                  </span>
                  {staff.leaveUntil && (
                    <div className="text-xs text-font-detail mt-1">Returns: {staff.leaveUntil}</div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-font-base">{staff.shifts}</div>
                </td>
                <td className="py-3 px-4">
                  <div className={`text-sm ${staff.otHours >= 16 ? 'text-warning font-semibold' : 'text-font-base'}`}>
                    {staff.otHours} hrs
                    {staff.otHours >= 16 && (
                      <i className="fa-solid fa-exclamation-triangle ml-2 text-warning"></i>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <button className="text-primary text-sm hover:underline">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
