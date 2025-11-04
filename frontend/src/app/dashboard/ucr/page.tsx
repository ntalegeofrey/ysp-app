'use client';

export default function UCRPage() {
  const ucrReports = [
    { id: 'UCR-001', resident: 'John Doe', type: 'Behavioral', date: '2024-03-15', reporter: 'Jane Smith', status: 'submitted' },
    { id: 'UCR-002', resident: 'Mike Johnson', type: 'Medical', date: '2024-03-14', reporter: 'Tom Brown', status: 'under-review' },
    { id: 'UCR-003', resident: 'Sarah Williams', type: 'Safety', date: '2024-03-13', reporter: 'John Doe', status: 'approved' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-font-detail">Unusual Client Reports documentation</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition flex items-center gap-2">
          <i className="fa-solid fa-plus"></i>
          Create UCR
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-subtle">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">UCR ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Resident</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Reporter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bd">
            {ucrReports.map((report) => (
              <tr key={report.id} className="hover:bg-bg-subtle">
                <td className="px-6 py-4 font-medium text-font-base">{report.id}</td>
                <td className="px-6 py-4 text-font-detail">{report.resident}</td>
                <td className="px-6 py-4 text-font-detail">{report.type}</td>
                <td className="px-6 py-4 text-font-detail">{report.date}</td>
                <td className="px-6 py-4 text-font-detail">{report.reporter}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.status === 'approved' ? 'bg-success-lightest text-success' :
                    report.status === 'under-review' ? 'bg-warning-lightest text-warning' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-primary hover:text-primary-light">
                    <i className="fa-solid fa-eye"></i>
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
