'use client';

export default function VisitationPage() {
  const logs = [
    { id: 1, resident: 'John Doe', visitor: 'Mary Doe (Mother)', type: 'In-Person Visit', date: '2024-03-15', time: '14:00 - 15:30', status: 'completed' },
    { id: 2, resident: 'Jane Smith', visitor: 'Phone Call', type: 'Phone', date: '2024-03-15', time: '10:00 - 10:15', status: 'completed' },
    { id: 3, resident: 'Mike Johnson', visitor: 'Bob Johnson (Father)', type: 'In-Person Visit', date: '2024-03-16', time: '13:00 - 14:00', status: 'scheduled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-font-detail">Track visitation and phone communications</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition flex items-center gap-2">
          <i className="fa-solid fa-plus"></i>
          Log Visit/Call
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-subtle">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Resident</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Visitor/Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bd">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-bg-subtle">
                <td className="px-6 py-4 font-medium text-font-base">{log.resident}</td>
                <td className="px-6 py-4 text-font-detail">{log.visitor}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-primary-lightest text-primary rounded-full text-xs font-medium">
                    {log.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-font-detail">{log.date}</td>
                <td className="px-6 py-4 text-font-detail">{log.time}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    log.status === 'completed' ? 'bg-success-lightest text-success' : 'bg-warning-lightest text-warning'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
