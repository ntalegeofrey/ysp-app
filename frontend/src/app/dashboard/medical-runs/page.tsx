'use client';

export default function MedicalRunsPage() {
  const medicalRuns = [
    { id: 1, resident: 'John Doe', destination: 'General Hospital', purpose: 'Routine Checkup', date: '2024-03-20', time: '10:00 AM', status: 'scheduled', driver: 'Mike Johnson' },
    { id: 2, resident: 'Jane Smith', destination: 'Dental Clinic', purpose: 'Dental Appointment', date: '2024-03-18', time: '02:00 PM', status: 'completed', driver: 'Sarah Williams' },
    { id: 3, resident: 'Tom Brown', destination: 'Specialist Clinic', purpose: 'Follow-up', date: '2024-03-22', time: '09:30 AM', status: 'scheduled', driver: 'John Doe' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-font-detail">Coordinate medical transportation for residents</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition flex items-center gap-2">
          <i className="fa-solid fa-plus"></i>
          Schedule Medical Run
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-subtle">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Resident</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bd">
            {medicalRuns.map((run) => (
              <tr key={run.id} className="hover:bg-bg-subtle">
                <td className="px-6 py-4 font-medium text-font-base">{run.resident}</td>
                <td className="px-6 py-4 text-font-detail">{run.destination}</td>
                <td className="px-6 py-4 text-font-detail">{run.purpose}</td>
                <td className="px-6 py-4 text-font-detail">{run.date} at {run.time}</td>
                <td className="px-6 py-4 text-font-detail">{run.driver}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    run.status === 'completed' ? 'bg-success-lightest text-success' : 'bg-warning-lightest text-warning'
                  }`}>
                    {run.status}
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
