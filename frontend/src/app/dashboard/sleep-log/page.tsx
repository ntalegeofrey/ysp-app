'use client';

export default function SleepLogPage() {
  const sleepLogs = [
    { id: 1, resident: 'John Doe', date: '2024-03-15', bedtime: '22:00', wakeup: '06:30', quality: 'good', notes: 'Slept through the night' },
    { id: 2, resident: 'Jane Smith', date: '2024-03-15', bedtime: '21:30', wakeup: '06:00', quality: 'fair', notes: 'Woke up once at 2 AM' },
    { id: 3, resident: 'Mike Johnson', date: '2024-03-15', bedtime: '23:00', wakeup: '07:00', quality: 'good', notes: 'No issues reported' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-font-detail">Monitor resident sleep patterns and night watch</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition flex items-center gap-2">
          <i className="fa-solid fa-plus"></i>
          Add Sleep Log
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-subtle">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Resident</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Bedtime</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Wake Up</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Quality</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bd">
            {sleepLogs.map((log) => (
              <tr key={log.id} className="hover:bg-bg-subtle">
                <td className="px-6 py-4 font-medium text-font-base">{log.resident}</td>
                <td className="px-6 py-4 text-font-detail">{log.date}</td>
                <td className="px-6 py-4 text-font-detail">{log.bedtime}</td>
                <td className="px-6 py-4 text-font-detail">{log.wakeup}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    log.quality === 'good' ? 'bg-success-lightest text-success' :
                    log.quality === 'fair' ? 'bg-warning-lightest text-warning' :
                    'bg-error-lightest text-error'
                  }`}>
                    {log.quality}
                  </span>
                </td>
                <td className="px-6 py-4 text-font-detail">{log.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
