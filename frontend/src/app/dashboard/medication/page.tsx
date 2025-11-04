'use client';

import { useState } from 'react';

export default function MedicationPage() {
  const [activeCount, setActiveCount] = useState(false);

  const medications = [
    { id: 1, name: 'Medication A', dosage: '10mg', quantity: 50, resident: 'John Doe', time: '08:00 AM', status: 'pending' },
    { id: 2, name: 'Medication B', dosage: '20mg', quantity: 30, resident: 'Jane Smith', time: '12:00 PM', status: 'completed' },
    { id: 3, name: 'Medication C', dosage: '5mg', quantity: 45, resident: 'Mike Johnson', time: '08:00 PM', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-font-detail">Track and manage medication distribution</p>
        </div>
        <button 
          onClick={() => setActiveCount(!activeCount)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          {activeCount ? 'End Count' : 'Start Med Count'}
        </button>
      </div>

      {activeCount && (
        <div className="bg-highlight-lightest border-l-4 border-highlight p-4 rounded-lg">
          <p className="font-medium text-font-base">
            <i className="fa-solid fa-clock mr-2"></i>
            Medication count in progress...
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-subtle">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Medication</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Dosage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Resident</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bd">
            {medications.map((med) => (
              <tr key={med.id} className="hover:bg-bg-subtle">
                <td className="px-6 py-4 font-medium text-font-base">{med.name}</td>
                <td className="px-6 py-4 text-font-detail">{med.dosage}</td>
                <td className="px-6 py-4 text-font-detail">{med.quantity}</td>
                <td className="px-6 py-4 text-font-detail">{med.resident}</td>
                <td className="px-6 py-4 text-font-detail">{med.time}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    med.status === 'completed' ? 'bg-success-lightest text-success' : 'bg-warning-lightest text-warning'
                  }`}>
                    {med.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-primary hover:text-primary-light">
                    <i className="fa-solid fa-check-circle"></i>
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
