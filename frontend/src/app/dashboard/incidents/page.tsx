'use client';

import { useState } from 'react';

export default function IncidentsPage() {
  const [showForm, setShowForm] = useState(false);

  const incidents = [
    { id: 1, title: 'Verbal Altercation', severity: 'medium', location: 'Building A - Common Area', reporter: 'John Doe', date: '2024-03-15 14:30', status: 'under-review' },
    { id: 2, title: 'Medical Emergency', severity: 'high', location: 'Building B - Room 205', reporter: 'Jane Smith', date: '2024-03-14 09:15', status: 'resolved' },
    { id: 3, title: 'Property Damage', severity: 'low', location: 'Building A - Recreation Room', reporter: 'Mike Johnson', date: '2024-03-13 16:45', status: 'open' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-font-detail">Report and track facility incidents</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-error text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Report Incident
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-font-heading mb-4">New Incident Report</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Incident Title *</label>
                <input type="text" required className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Severity *</label>
                <select className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus outline-none">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Description *</label>
              <textarea rows={4} className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus outline-none"></textarea>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition">Submit Report</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-bg-subtle text-font-base rounded-lg hover:bg-bd transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-subtle">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Reporter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bd">
            {incidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-bg-subtle cursor-pointer">
                <td className="px-6 py-4 font-medium text-font-base">#{incident.id}</td>
                <td className="px-6 py-4 text-font-base">{incident.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    incident.severity === 'high' ? 'bg-error-lightest text-error' :
                    incident.severity === 'medium' ? 'bg-warning-lightest text-warning' :
                    'bg-success-lightest text-success'
                  }`}>
                    {incident.severity}
                  </span>
                </td>
                <td className="px-6 py-4 text-font-detail">{incident.location}</td>
                <td className="px-6 py-4 text-font-detail">{incident.reporter}</td>
                <td className="px-6 py-4 text-font-detail">{incident.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    incident.status === 'resolved' ? 'bg-success-lightest text-success' :
                    incident.status === 'under-review' ? 'bg-warning-lightest text-warning' :
                    'bg-error-lightest text-error'
                  }`}>
                    {incident.status}
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
