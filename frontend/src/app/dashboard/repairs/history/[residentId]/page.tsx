'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/app/hooks/useToast';
import ToastContainer from '@/app/components/Toast';
import { generateRepairHistoryReportHTML } from '@/app/dashboard/pdfReports';

export default function ResidentRepairHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const { toasts, addToast, removeToast } = useToast();
  const residentId = params.residentId as string;
  
  // State
  const [resident, setResident] = useState<any>(null);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [programId, setProgramId] = useState<number | null>(null);
  const [programName, setProgramName] = useState('');
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          addToast('Not authenticated', 'error');
          router.push('/login');
          return;
        }

        // Get program
        const programData = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
        if (!programData) {
          addToast('No program selected', 'error');
          return;
        }
        const program = JSON.parse(programData);
        setProgramId(program.id);
        setProgramName(program.programName || program.name);

        // Fetch resident
        const residentResponse = await fetch(`/api/programs/${program.id}/residents/${residentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (residentResponse.ok) {
          const residentData = await residentResponse.json();
          setResident(residentData);
        } else {
          addToast('Failed to load resident', 'error');
          return;
        }

        // Fetch repairs
        const repairsResponse = await fetch(`/api/programs/${program.id}/repairs/interventions/resident/${residentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (repairsResponse.ok) {
          const repairsData = await repairsResponse.json();
          setRepairs(repairsData);
        } else {
          addToast('Failed to load repairs', 'error');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        addToast('Error loading data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [residentId]);

  // Print full repair history report
  const handlePrintFullReport = () => {
    if (!resident || repairs.length === 0) {
      addToast('No repairs to print', 'warning');
      return;
    }

    const reportData = {
      resident: {
        name: `${resident.firstName} ${resident.lastName}`,
        id: resident.residentId || resident.id
      },
      programName,
      repairs: filteredRepairs,
      reportPeriod: filterStartDate && filterEndDate 
        ? `${new Date(filterStartDate).toLocaleDateString()} - ${new Date(filterEndDate).toLocaleDateString()}`
        : 'All Time'
    };

    const htmlContent = generateRepairHistoryReportHTML(reportData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  // Filter repairs
  const filteredRepairs = repairs.filter(repair => {
    const matchesStatus = filterStatus === 'all' || repair.status?.toLowerCase() === filterStatus;
    const matchesType = filterType === 'all' || repair.repairLevel?.toLowerCase() === filterType.toLowerCase();
    const matchesSearch = !searchQuery || 
      repair.infractionBehavior?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.assignedByName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.comments?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const repairDate = new Date(repair.repairStartDate);
    const matchesStartDate = !filterStartDate || repairDate >= new Date(filterStartDate);
    const matchesEndDate = !filterEndDate || repairDate <= new Date(filterEndDate);
    
    return matchesStatus && matchesType && matchesSearch && matchesStartDate && matchesEndDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRepairs.length / itemsPerPage);
  const paginatedRepairs = filteredRepairs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterType, filterStartDate, filterEndDate, searchQuery]);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-success';
      case 'active': return 'bg-error';
      case 'approved': return 'bg-error';
      case 'pending': return 'bg-warning';
      default: return 'bg-primary-alt';
    }
  };

  // Get type badge color
  const getTypeColor = (type: string) => {
    const level = type?.toLowerCase();
    if (level?.includes('3')) return 'bg-error';
    if (level?.includes('2')) return 'bg-highlight';
    if (level?.includes('1')) return 'bg-primary';
    return 'bg-primary-alt';
  };

  // Calculate duration
  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days === 1 ? '1 day' : `${days} days`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-3"></i>
          <p className="text-font-detail">Loading repair history...</p>
        </div>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <i className="fa-solid fa-exclamation-triangle text-4xl text-error mb-3"></i>
          <p className="text-font-base">Resident not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* App Bar with Back Button and Breadcrumb */}
      <div className="bg-white border-b border-bd mb-6">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/repairs')}
                className="text-primary hover:text-primary-light transition-colors"
              >
                <i className="fa-solid fa-arrow-left text-xl"></i>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-font-base">Repair History</h1>
                <div className="flex items-center gap-2 text-sm text-font-detail mt-1">
                  <span className="hover:text-primary cursor-pointer" onClick={() => router.push('/dashboard/repairs')}>Repairs</span>
                  <i className="fa-solid fa-chevron-right text-xs"></i>
                  <span>History</span>
                  <i className="fa-solid fa-chevron-right text-xs"></i>
                  <span className="text-font-base font-medium">{resident.firstName} {resident.lastName}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handlePrintFullReport}
              disabled={filteredRepairs.length === 0}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-print"></i>
              Print Full Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 space-y-6">

        {/* Resident Info Header */}
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {resident.photoUrl && (
                <img 
                  src={resident.photoUrl} 
                  alt={`${resident.firstName} ${resident.lastName}`} 
                  className="w-16 h-16 rounded-full border-2 border-primary object-cover" 
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-font-base">{resident.firstName} {resident.lastName}</h2>
                <p className="text-font-detail">Resident ID: {resident.residentId}</p>
                <p className="text-sm text-primary mt-1">
                  <i className="fa-solid fa-history mr-2"></i>
                  Total Repairs: {repairs.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-bg-subtle p-3 rounded-lg">
                  <p className="text-xs text-font-detail">Active Repairs</p>
                  <p className="text-2xl font-bold text-error">{repairs.filter(r => r.status?.toLowerCase() === 'active' || r.status?.toLowerCase() === 'approved').length}</p>
                </div>
                <div className="bg-bg-subtle p-3 rounded-lg">
                  <p className="text-xs text-font-detail">Completed</p>
                  <p className="text-2xl font-bold text-success">{repairs.filter(r => r.status?.toLowerCase() === 'completed').length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-bd p-6">
          <h3 className="text-lg font-semibold text-font-base mb-4">
            <i className="fa-solid fa-filter mr-2 text-primary"></i>
            Filter Repair History
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Status</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Repair Type</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="all">All Types</option>
                <option value="Repair 1">Repair 1</option>
                <option value="Repair 2">Repair 2</option>
                <option value="Repair 3">Repair 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Start Date</label>
              <input 
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">End Date</label>
              <input 
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-font-base mb-2">Search</label>
            <div className="relative">
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-font-detail"></i>
              <input 
                type="text"
                placeholder="Search violations, staff names, comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-bd rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>
          
          {/* Clear Filters */}
          {(filterStatus !== 'all' || filterType !== 'all' || filterStartDate || filterEndDate || searchQuery) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterType('all');
                  setFilterStartDate('');
                  setFilterEndDate('');
                  setSearchQuery('');
                }}
                className="text-sm text-primary hover:text-primary-light flex items-center gap-2 font-medium"
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-font-base">
                <i className="fa-solid fa-list mr-2 text-primary"></i>
                Repair History ({filteredRepairs.length})
              </h3>
              {totalPages > 1 && (
                <p className="text-sm text-font-detail">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredRepairs.length)} of {filteredRepairs.length}
                </p>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-subtle">
                <tr>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Date</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Type</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Behavior/Violation</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Assigned By</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Duration</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRepairs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <i className="fa-solid fa-inbox text-4xl text-font-detail mb-3"></i>
                      <p className="text-font-detail">No repairs found</p>
                      <p className="text-sm text-font-detail mt-1">
                        {repairs.length === 0 ? 'This resident has no repair history' : 'Try adjusting your filters'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedRepairs.map((repair) => (
                    <tr key={repair.id} className="border-b border-bd hover:bg-bg-subtle transition-colors">
                      <td className="p-3 text-sm text-font-base whitespace-nowrap">
                        {new Date(repair.repairStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-3">
                        <span className={`${getTypeColor(repair.repairLevel)} text-white px-2 py-1 rounded text-xs font-medium`}>
                          {repair.repairLevel}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-font-detail max-w-xs truncate" title={repair.infractionBehavior}>
                        {repair.infractionBehavior}
                      </td>
                      <td className="p-3 text-sm text-font-detail">{repair.assignedByName || 'N/A'}</td>
                      <td className="p-3 text-sm text-font-detail">{calculateDuration(repair.repairStartDate, repair.repairEndDate)}</td>
                      <td className="p-3">
                        <span className={`${getStatusColor(repair.status)} text-white px-2 py-1 rounded text-xs font-medium`}>
                          {repair.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-bd flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-bd rounded-lg hover:bg-bg-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-chevron-left"></i>
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-primary text-white'
                        : 'border border-bd hover:bg-bg-subtle text-font-base'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-bd rounded-lg hover:bg-bg-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Next
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
