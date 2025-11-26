'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RepairsPage() {
  const router = useRouter();
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [detailsModal, setDetailsModal] = useState<any>(null);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [programId, setProgramId] = useState<number | null>(null);
  
  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('All Residents');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch repairs and residents from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get selected program
        const programData = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
        if (!programData) return;
        
        const program = JSON.parse(programData);
        setProgramId(program.id);

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        // Fetch repairs
        const repairsResponse = await fetch(`/api/programs/${program.id}/repairs/interventions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (repairsResponse.ok) {
          const repairsData = await repairsResponse.json();
          setRepairs(repairsData);
        }

        // Fetch residents
        const residentsResponse = await fetch(`/api/programs/${program.id}/residents`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (residentsResponse.ok) {
          const residentsData = await residentsResponse.json();
          setResidents(residentsData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and search residents
  const filteredResidents = residents.filter(resident => {
    const matchesSearch = searchQuery === '' ||
      resident.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.residentId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const residentRepairs = repairs.filter(r => r.residentId === resident.id);
    const hasActiveRepair = residentRepairs.some(r => r.status === 'pending_review' || r.status === 'approved');
    
    if (filterStatus === 'Active Repairs') {
      return matchesSearch && hasActiveRepair;
    }
    return matchesSearch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResidents = filteredResidents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-bd">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-font-detail text-sm">Total Residents</p>
              <p className="text-2xl font-bold text-primary">{loading ? '-' : residents.length}</p>
            </div>
            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
              <i className="fa-solid fa-users text-primary text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-bd">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-font-detail text-sm">Active Repairs</p>
              <p className="text-2xl font-bold text-error">{loading ? '-' : repairs.length}</p>
            </div>
            <div className="bg-error bg-opacity-10 p-3 rounded-lg">
              <i className="fa-solid fa-exclamation-triangle text-error text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-bd">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-font-detail text-sm">Residents with Repairs</p>
              <p className="text-2xl font-bold text-success">
                {loading ? '-' : residents.filter(r => repairs.some(rep => rep.residentId === r.id)).length}
              </p>
            </div>
            <div className="bg-success bg-opacity-10 p-3 rounded-lg">
              <i className="fa-solid fa-user-check text-success text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-bd">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-font-detail text-sm">Pending Reviews</p>
              <p className="text-2xl font-bold text-highlight">
                {loading ? '-' : repairs.filter(r => r.status === 'pending_review').length}
              </p>
            </div>
            <div className="bg-highlight bg-opacity-10 p-3 rounded-lg">
              <i className="fa-solid fa-clock text-highlight text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Active Behavioral Repairs */}
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base">Active Behavioral Repairs</h3>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              <div className="text-center text-font-detail py-8">Loading repairs...</div>
            ) : repairs.length === 0 ? (
              <div className="text-center text-font-detail py-8">No active repairs found</div>
            ) : (
              repairs.map((repair: any) => {
                const levelColors = {
                  'Repair 1': { bg: 'bg-primary-lightest', border: 'border-primary', text: 'text-primary', button: 'bg-primary' },
                  'Repair 2': { bg: 'bg-highlight-lightest', border: 'border-highlight', text: 'text-highlight', button: 'bg-highlight' },
                  'Repair 3': { bg: 'bg-error-lightest', border: 'border-error', text: 'text-error', button: 'bg-error' }
                };
                const colors = levelColors[repair.repairLevel as keyof typeof levelColors] || levelColors['Repair 1'];
                
                return (
                  <div key={repair.id} className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-medium ${colors.text}`}>{repair.repairLevel} - {repair.infractionBehavior}</h4>
                        <p className="text-sm text-font-detail mt-1">{repair.residentName} - ID: {repair.residentNumber}</p>
                        <p className="text-sm text-font-detail">
                          Date: {new Date(repair.infractionDate).toLocaleDateString()} | 
                          Status: {repair.status}
                        </p>
                        {repair.pointsSuspended && (
                          <p className={`text-xs ${colors.text} mt-2`}>Point accrual suspended</p>
                        )}
                      </div>
                      <button 
                        onClick={() => setDetailsModal(repair)}
                        className={`${colors.button} text-white px-3 py-1 rounded text-sm hover:opacity-90 transition-colors`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        
      </div>

      {/* Resident Overview Table */}
      <div className="mt-2">
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-font-base">Resident Overview</h3>
              <div className="flex items-center space-x-4">
                <select 
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-bd rounded-lg px-3 py-2 text-sm"
                >
                  <option>All Residents</option>
                  <option>Active Repairs</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Search residents..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-bd rounded-lg px-3 py-2 text-sm w-48" 
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-subtle">
                <tr>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Resident</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">ID</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Room</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Status</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Repair Status</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-font-detail">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Loading residents...
                    </td>
                  </tr>
                ) : currentResidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-font-detail">
                      <i className="fa-solid fa-users text-4xl text-font-medium mb-4"></i>
                      <p className="text-lg font-medium text-font-base mb-2">No residents found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  currentResidents.map((resident: any, index: number) => {
                    const residentRepairs = repairs.filter(r => r.residentId === resident.id);
                    const activeRepair = residentRepairs.find(r => r.status === 'pending_review' || r.status === 'approved');
                    
                    return (
                      <tr key={resident.id} className="border-b border-bd hover:bg-primary-lightest/30">
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 text-sm font-bold">
                              {resident.firstName?.[0]}{resident.lastName?.[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{resident.firstName} {resident.lastName}</p>
                              <p className="text-xs text-font-detail">Admitted: {resident.admissionDate ? new Date(resident.admissionDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm font-medium">{resident.residentId || 'N/A'}</td>
                        <td className="p-3 text-sm">{resident.room || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            resident.status === 'Active' ? 'bg-success text-white' : 'bg-font-detail text-white'
                          }`}>
                            {resident.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-3">
                          {activeRepair ? (
                            <span className={`px-2 py-1 rounded text-xs ${
                              activeRepair.repairLevel === 'Repair 3' ? 'bg-error text-white' :
                              activeRepair.repairLevel === 'Repair 2' ? 'bg-highlight text-white' :
                              'bg-primary text-white'
                            }`}>
                              {activeRepair.repairLevel}
                            </span>
                          ) : (
                            <span className="text-sm text-font-detail">No active repairs</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="relative inline-block text-left">
                            <button
                              className="p-2 rounded hover:bg-bg-subtle"
                              onClick={() => setOpenMenuIndex(openMenuIndex === indexOfFirstItem + index ? null : indexOfFirstItem + index)}
                            >
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            {openMenuIndex === indexOfFirstItem + index && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border border-bd rounded-lg shadow z-10">
                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push(`/dashboard/repairs/history/${resident.id}`)}>
                                  <i className="fa-solid fa-history text-primary"></i>
                                  View Repairs
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/award')}>
                                  <i className="fa-solid fa-star text-success"></i>
                                  Points Management
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/assign')}>
                                  <i className="fa-solid fa-exclamation-circle text-error"></i>
                                  Assign Repair
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && filteredResidents.length > 0 && (
            <div className="p-4 border-t border-bd bg-bg-subtle flex justify-between items-center">
              <p className="text-sm text-font-detail">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredResidents.length)} of {filteredResidents.length} residents
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-bd rounded text-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <span className="px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-bd rounded text-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Repair Details Modal */}
      {detailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-primary p-6 text-white sticky top-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{detailsModal.residentName}</h2>
                  <p className="text-primary-lightest">ID: {detailsModal.residentNumber}</p>
                </div>
                <button 
                  onClick={() => setDetailsModal(null)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Repair Type Badge */}
              <div className="flex justify-center">
                <span className={`
                  ${detailsModal.repairLevel === 'Repair 3' ? 'bg-error' : 
                    detailsModal.repairLevel === 'Repair 2' ? 'bg-highlight' : 'bg-primary'}
                  text-white px-6 py-2 rounded-full text-lg font-bold
                `}>
                  {detailsModal.repairLevel} - {detailsModal.infractionBehavior}
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-subtle p-4 rounded-lg border border-bd">
                  <p className="text-sm text-font-detail mb-1">Date Assigned</p>
                  <p className="font-semibold text-font-base">
                    {new Date(detailsModal.infractionDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="bg-bg-subtle p-4 rounded-lg border border-bd">
                  <p className="text-sm text-font-detail mb-1">Assigned By</p>
                  <p className="font-semibold text-font-base">{detailsModal.assigningStaffName}</p>
                </div>
                <div className="bg-bg-subtle p-4 rounded-lg border border-bd">
                  <p className="text-sm text-font-detail mb-1">Shift</p>
                  <p className="font-semibold text-font-base">{detailsModal.infractionShift || 'N/A'}</p>
                </div>
                <div className="bg-bg-subtle p-4 rounded-lg border border-bd">
                  <p className="text-sm text-font-detail mb-1">Status</p>
                  <p className="font-semibold text-font-base flex items-center gap-2">
                    <span className={`
                      ${detailsModal.status === 'pending_review' ? 'bg-warning' : 
                        detailsModal.status === 'approved' ? 'bg-success' : 'bg-error'}
                      w-2 h-2 rounded-full
                    `}></span>
                    {detailsModal.status}
                  </p>
                </div>
              </div>

              {/* Points Suspension Alert */}
              {detailsModal.pointsSuspended && (
                <div className="bg-error-lightest border border-error rounded-lg p-4 flex items-center gap-3">
                  <i className="fa-solid fa-exclamation-triangle text-error text-xl"></i>
                  <div>
                    <p className="font-semibold text-error">Point Accrual Suspended</p>
                    <p className="text-sm text-font-detail">Resident cannot earn points during this repair period</p>
                  </div>
                </div>
              )}

              {/* Interventions */}
              {detailsModal.interventionsJson && (
                <div>
                  <h3 className="text-lg font-semibold text-font-base mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-clipboard-list text-primary"></i>
                    Assigned Interventions
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {(() => {
                      try {
                        const interventions = JSON.parse(detailsModal.interventionsJson);
                        return Array.isArray(interventions) ? interventions.map((intervention: string, index: number) => (
                          <div key={index} className="bg-primary-lightest border-l-4 border-primary p-3 rounded">
                            <div className="flex items-center gap-2">
                              <i className="fa-solid fa-check-circle text-primary"></i>
                              <span className="text-sm font-medium text-font-base">{intervention}</span>
                            </div>
                          </div>
                        )) : null;
                      } catch {
                        return <p className="text-sm text-font-detail">No interventions specified</p>;
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Comments */}
              {detailsModal.comments && (
                <div>
                  <h3 className="text-lg font-semibold text-font-base mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-comment text-primary"></i>
                    Staff Comments
                  </h3>
                  <div className="bg-bg-subtle p-4 rounded-lg border border-bd">
                    <p className="text-sm text-font-base leading-relaxed">{detailsModal.comments}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-bd bg-bg-subtle flex justify-end gap-3">
              <button 
                onClick={() => setDetailsModal(null)}
                className="px-4 py-2 border border-bd rounded-lg text-font-base hover:bg-white transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setDetailsModal(null);
                  router.push(`/dashboard/repairs/history/${detailsModal.id}`);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-history"></i>
                View Full History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
