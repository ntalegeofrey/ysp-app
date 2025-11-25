'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

export default function ResidentRepairHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const residentId = params.residentId as string;
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock resident data
  const residentData = {
    '2847': { name: 'Marcus Johnson', id: '2847', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg' },
    '2851': { name: 'David Chen', id: '2851', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg' },
    '2849': { name: 'Alex Rodriguez', id: '2849', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg' },
    '2852': { name: 'James Wilson', id: '2852', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg' }
  };

  const resident = residentData[residentId as keyof typeof residentData] || { name: 'Unknown Resident', id: residentId, avatar: '' };

  // Mock repair history data
  const repairs = [
    {
      id: 1,
      date: '2025-11-20',
      type: 'R3',
      violation: 'Major Violation - Fighting',
      assignedBy: 'John Smith',
      duration: '7 days',
      status: 'Completed',
      pointsSuspended: 245,
      notes: 'Physical altercation in common area. Completed anger management sessions.'
    },
    {
      id: 2,
      date: '2025-11-10',
      type: 'R2',
      violation: 'Moderate Violation - Disrespect to Staff',
      assignedBy: 'Sarah Williams',
      duration: '3 days',
      status: 'Completed',
      pointsSuspended: 120,
      notes: 'Verbal altercation during inspection. Behavior improved.'
    },
    {
      id: 3,
      date: '2025-10-25',
      type: 'R1',
      violation: 'Minor Violation - Late to Count',
      assignedBy: 'Mike Johnson',
      duration: '1 day',
      status: 'Completed',
      pointsSuspended: 50,
      notes: 'Missed morning count. Issue resolved quickly.'
    },
    {
      id: 4,
      date: '2025-10-15',
      type: 'R2',
      violation: 'Moderate Violation - Contraband',
      assignedBy: 'Emily Davis',
      duration: '5 days',
      status: 'Completed',
      pointsSuspended: 180,
      notes: 'Found unauthorized items during room search. Completed education program.'
    }
  ];

  // Print repair report
  const handlePrintRepair = (repair: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Repair Report - ${resident.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
              .header h1 { color: #2563eb; margin: 0; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
              .info-item { padding: 10px; background: #f8fafc; border-left: 3px solid #2563eb; }
              .info-item strong { display: block; color: #64748b; font-size: 12px; margin-bottom: 5px; }
              .notes { margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px; }
              .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Behavioral Repair Report</h1>
              <p>Resident: <strong>${resident.name}</strong> (ID: ${resident.id})</p>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <strong>Repair Type</strong>
                ${repair.type} - ${repair.violation}
              </div>
              <div class="info-item">
                <strong>Date Assigned</strong>
                ${new Date(repair.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div class="info-item">
                <strong>Assigned By</strong>
                ${repair.assignedBy}
              </div>
              <div class="info-item">
                <strong>Duration</strong>
                ${repair.duration}
              </div>
              <div class="info-item">
                <strong>Status</strong>
                ${repair.status}
              </div>
              <div class="info-item">
                <strong>Points Suspended</strong>
                ${repair.pointsSuspended} points
              </div>
            </div>
            <div class="notes">
              <strong style="display: block; margin-bottom: 10px;">Notes:</strong>
              ${repair.notes}
            </div>
            <div class="footer">
              <p>Generated on ${new Date().toLocaleString()}</p>
              <p>Youth Support Program - Behavioral Repair Management System</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  // Filter repairs
  const filteredRepairs = repairs.filter(repair => {
    const matchesStatus = filterStatus === 'All Status' || repair.status === filterStatus;
    const matchesType = filterType === 'All Types' || repair.type === filterType;
    const matchesSearch = !searchQuery || 
      repair.violation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.assignedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const repairDate = new Date(repair.date);
    const matchesStartDate = !filterStartDate || repairDate >= new Date(filterStartDate);
    const matchesEndDate = !filterEndDate || repairDate <= new Date(filterEndDate);
    
    return matchesStatus && matchesType && matchesSearch && matchesStartDate && matchesEndDate;
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success';
      case 'Active': return 'bg-error';
      case 'Pending': return 'bg-warning';
      default: return 'bg-primary-alt';
    }
  };

  // Get type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'R3': return 'bg-error';
      case 'R2': return 'bg-highlight';
      case 'R1': return 'bg-primary';
      default: return 'bg-primary-alt';
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={() => router.push('/dashboard/repairs')}
            className="text-primary hover:text-primary-light font-medium flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Back to Repairs
          </button>
          <span className="text-font-detail">/</span>
          <span className="text-font-detail">Repair History</span>
          <span className="text-font-detail">/</span>
          <span className="text-font-base font-medium">{resident.name}</span>
        </div>
      </div>

      {/* Resident Info Header */}
      <div className="bg-white rounded-lg border border-bd p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {resident.avatar && (
              <img 
                src={resident.avatar} 
                alt={resident.name} 
                className="w-16 h-16 rounded-full border-2 border-primary" 
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-font-base">{resident.name}</h2>
              <p className="text-font-detail">Resident ID: {resident.id}</p>
              <p className="text-sm text-primary mt-1">
                <i className="fa-solid fa-history mr-2"></i>
                Total Repairs: {repairs.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-font-detail">Viewing repair history for:</p>
            <p className="text-lg font-semibold text-primary">{resident.name}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-bd p-6">
        <h3 className="text-lg font-semibold text-font-base mb-4">Filter Repair History</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-font-base mb-2">Status</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-font-base mb-2">Repair Type</label>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option>All Types</option>
              <option>R1</option>
              <option>R2</option>
              <option>R3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-font-base mb-2">Start Date</label>
            <input 
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-font-base mb-2">End Date</label>
            <input 
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-font-base mb-2">Search</label>
          <input 
            type="text"
            placeholder="Search violations, staff names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        {/* Clear Filters */}
        {(filterStatus !== 'All Status' || filterType !== 'All Types' || filterStartDate || filterEndDate || searchQuery) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setFilterStatus('All Status');
                setFilterType('All Types');
                setFilterStartDate('');
                setFilterEndDate('');
                setSearchQuery('');
              }}
              className="text-sm text-primary hover:text-primary-light flex items-center gap-2"
            >
              <i className="fa-solid fa-times-circle"></i>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Repair History Table */}
      <div className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base">Repair History ({filteredRepairs.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-subtle">
              <tr>
                <th className="text-left p-3 font-medium text-font-base text-sm">Date</th>
                <th className="text-left p-3 font-medium text-font-base text-sm">Type</th>
                <th className="text-left p-3 font-medium text-font-base text-sm">Violation</th>
                <th className="text-left p-3 font-medium text-font-base text-sm">Assigned By</th>
                <th className="text-left p-3 font-medium text-font-base text-sm">Duration</th>
                <th className="text-left p-3 font-medium text-font-base text-sm">Status</th>
                <th className="text-left p-3 font-medium text-font-base text-sm">Points</th>
                <th className="text-left p-3 font-medium text-font-base text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepairs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <i className="fa-solid fa-inbox text-4xl text-font-detail mb-3"></i>
                    <p className="text-font-detail">No repairs found</p>
                    <p className="text-sm text-font-detail mt-1">
                      {repairs.length === 0 ? 'This resident has no repair history' : 'Try adjusting your filters'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRepairs.map((repair) => (
                  <tr key={repair.id} className="border-b border-bd hover:bg-bg-subtle transition-colors">
                    <td className="p-3 text-sm text-font-base">
                      {new Date(repair.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-3">
                      <span className={`${getTypeColor(repair.type)} text-white px-2 py-1 rounded text-xs font-medium`}>
                        {repair.type}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-font-detail max-w-xs truncate" title={repair.violation}>
                      {repair.violation}
                    </td>
                    <td className="p-3 text-sm text-font-detail">{repair.assignedBy}</td>
                    <td className="p-3 text-sm text-font-detail">{repair.duration}</td>
                    <td className="p-3">
                      <span className={`${getStatusColor(repair.status)} text-white px-2 py-1 rounded text-xs font-medium`}>
                        {repair.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-bold text-error">-{repair.pointsSuspended}</td>
                    <td className="p-3">
                      <button 
                        onClick={() => handlePrintRepair(repair)}
                        className="bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-light transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <i className="fa-solid fa-print"></i>
                        Print Report
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
