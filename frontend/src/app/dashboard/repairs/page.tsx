'use client';

export default function RepairsPage() {
  const repairs = [
    { id: 'REP-001', title: 'Fix Broken Window', location: 'Building A - Room 101', priority: 'high', status: 'in-progress', assignee: 'John Doe', date: '2024-03-15' },
    { id: 'REP-002', title: 'Plumbing Issue', location: 'Building B - Bathroom', priority: 'medium', status: 'pending', assignee: 'Jane Smith', date: '2024-03-14' },
    { id: 'REP-003', title: 'Door Lock Replacement', location: 'Building A - Main Entrance', priority: 'high', status: 'completed', assignee: 'Mike Johnson', date: '2024-03-13' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-font-detail">Track and manage facility repairs</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition flex items-center gap-2">
          <i className="fa-solid fa-plus"></i>
          Submit Repair Request
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-subtle">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Assignee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bd">
            {repairs.map((repair) => (
              <tr key={repair.id} className="hover:bg-bg-subtle">
                <td className="px-6 py-4 font-medium text-font-base">{repair.id}</td>
                <td className="px-6 py-4 text-font-base">{repair.title}</td>
                <td className="px-6 py-4 text-font-detail">{repair.location}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    repair.priority === 'high' ? 'bg-error-lightest text-error' :
                    repair.priority === 'medium' ? 'bg-warning-lightest text-warning' :
                    'bg-success-lightest text-success'
                  }`}>
                    {repair.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-font-detail">{repair.assignee}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    repair.status === 'completed' ? 'bg-success-lightest text-success' :
                    repair.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                    'bg-warning-lightest text-warning'
                  }`}>
                    {repair.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-font-detail">{repair.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
