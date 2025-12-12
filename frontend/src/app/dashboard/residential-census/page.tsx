'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Resident = {
  id: number;
  firstName: string;
  lastName: string;
  youthId?: string;
};

type CensusEntry = {
  residentId: number;
  residentName: string;
  status: 'DYS' | 'NON_DYS';
  comments: string;
};

type Census = {
  id?: number;
  date: string;
  shift: 'MORNING' | 'AFTERNOON' | 'EVENING';
  conductedBy: string;
  entries: CensusEntry[];
  totalResidents: number;
  dysCount: number;
  nonDysCount: number;
  saved: boolean;
  createdAt?: string;
};

export default function ResidentialCensusPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'current' | 'historical'>('current');
  
  // Current Census State
  const todayISO = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(todayISO);
  const [shift, setShift] = useState<'MORNING' | 'AFTERNOON' | 'EVENING'>('MORNING');
  const [conductedBy, setConductedBy] = useState<string>('');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [entries, setEntries] = useState<CensusEntry[]>([]);
  const [programId, setProgramId] = useState<number | null>(null);
  
  // Historical Census State
  const [historicalCensuses, setHistoricalCensuses] = useState<Census[]>([]);
  const [selectedCensus, setSelectedCensus] = useState<Census | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Load current user
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        setConductedBy(fullName || user.email || 'Unknown User');
      }
      
      const programStr = localStorage.getItem('selectedProgram');
      if (programStr) {
        const program = JSON.parse(programStr);
        setProgramId(program.id);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }, []);

  // Fetch residents for the program
  useEffect(() => {
    if (!programId) return;
    
    // TODO: Replace with actual API call
    // For now, using demo data
    const demoResidents: Resident[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', youthId: 'Y001' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', youthId: 'Y002' },
      { id: 3, firstName: 'Mike', lastName: 'Johnson', youthId: 'Y003' },
      { id: 4, firstName: 'Sarah', lastName: 'Williams', youthId: 'Y004' },
    ];
    
    setResidents(demoResidents);
    
    // Initialize entries
    const initialEntries: CensusEntry[] = demoResidents.map(r => ({
      residentId: r.id,
      residentName: `${r.firstName} ${r.lastName}`,
      status: 'DYS',
      comments: ''
    }));
    
    setEntries(initialEntries);
  }, [programId]);
  
  // Fetch historical censuses
  useEffect(() => {
    if (!programId || activeTab !== 'historical') return;
    
    // TODO: Replace with actual API call
    // For now, using demo data
    const demoCensuses: Census[] = [
      {
        id: 1,
        date: '2024-12-10',
        shift: 'MORNING',
        conductedBy: 'Staff Member 1',
        entries: [],
        totalResidents: 4,
        dysCount: 3,
        nonDysCount: 1,
        saved: true,
        createdAt: new Date('2024-12-10T08:00:00').toISOString()
      },
      {
        id: 2,
        date: '2024-12-10',
        shift: 'EVENING',
        conductedBy: 'Staff Member 2',
        entries: [],
        totalResidents: 4,
        dysCount: 4,
        nonDysCount: 0,
        saved: true,
        createdAt: new Date('2024-12-10T20:00:00').toISOString()
      }
    ];
    
    setHistoricalCensuses(demoCensuses);
  }, [programId, activeTab]);

  const handleStatusChange = (residentId: number, status: 'DYS' | 'NON_DYS') => {
    setEntries(prev => prev.map(entry => 
      entry.residentId === residentId ? { ...entry, status } : entry
    ));
  };
  
  const handleCommentsChange = (residentId: number, comments: string) => {
    setEntries(prev => prev.map(entry => 
      entry.residentId === residentId ? { ...entry, comments } : entry
    ));
  };

  const handleSave = async () => {
    // Calculate counts
    const dysCount = entries.filter(e => e.status === 'DYS').length;
    const nonDysCount = entries.filter(e => e.status === 'NON_DYS').length;
    
    const census: Census = {
      date,
      shift,
      conductedBy,
      entries,
      totalResidents: entries.length,
      dysCount,
      nonDysCount,
      saved: true
    };
    
    // TODO: Send to backend API
    console.log('Saving census:', census);
    
    alert('Census saved and sent to archive successfully!');
  };

  const handleSendEmail = async () => {
    // Calculate counts
    const dysCount = entries.filter(e => e.status === 'DYS').length;
    const nonDysCount = entries.filter(e => e.status === 'NON_DYS').length;
    
    const census: Census = {
      date,
      shift,
      conductedBy,
      entries,
      totalResidents: entries.length,
      dysCount,
      nonDysCount,
      saved: true
    };
    
    // TODO: Send to backend API (save + email)
    console.log('Saving and sending census email:', census);
    
    alert('Census saved and email sent to administrators!');
  };

  const handleViewCensus = (census: Census) => {
    setSelectedCensus(census);
    setShowModal(true);
  };
  
  const dysCount = entries.filter(e => e.status === 'DYS').length;
  const nonDysCount = entries.filter(e => e.status === 'NON_DYS').length;
  
  const getShiftBadge = (shift: string) => {
    const colors = {
      MORNING: 'bg-warning-light text-warning',
      AFTERNOON: 'bg-info-light text-info',
      EVENING: 'bg-primary-lightest text-primary'
    };
    return colors[shift as keyof typeof colors] || 'bg-bg-subtle text-font-detail';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-bd p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-lightest rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-users text-primary text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-font-heading">Residential Census</h1>
            <p className="text-sm text-font-detail">Track resident status for each shift</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-bd">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'current'
                ? 'border-primary text-primary'
                : 'border-transparent text-font-detail hover:text-font-base'
            }`}
          >
            <i className="fa-solid fa-clipboard-check mr-2"></i>
            Current Census
          </button>
          <button
            onClick={() => setActiveTab('historical')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'historical'
                ? 'border-primary text-primary'
                : 'border-transparent text-font-detail hover:text-font-base'
            }`}
          >
            <i className="fa-solid fa-history mr-2"></i>
            Historical Census
          </button>
        </div>
      </div>

      {/* Current Census Tab */}
      {activeTab === 'current' && (
        <>
          {/* Census Form Header */}
          <div className="bg-white rounded-lg border border-bd p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  <i className="fa-solid fa-calendar mr-2 text-primary"></i>
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  <i className="fa-solid fa-clock mr-2 text-primary"></i>
                  Shift
                </label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value as any)}
                  className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 ring-primary focus:border-transparent"
                >
                  <option value="MORNING">Morning</option>
                  <option value="AFTERNOON">Afternoon</option>
                  <option value="EVENING">Evening</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  <i className="fa-solid fa-user mr-2 text-primary"></i>
                  Conducted By
                </label>
                <input
                  type="text"
                  value={conductedBy}
                  disabled
                  className="w-full px-3 py-2 border border-bd rounded-lg bg-bg-subtle text-font-base"
                />
              </div>
              
              <div className="flex items-end gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-success text-white hover:bg-opacity-90"
                >
                  <i className="fa-solid fa-save mr-2"></i>
                  Save to Archive
                </button>
                <button
                  onClick={handleSendEmail}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-opacity-90"
                >
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  Save & Send Email
                </button>
              </div>
            </div>
          </div>

          {/* Census Table */}
          <div className="bg-white rounded-lg border border-bd p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-font-heading">Resident Status</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-success rounded-full"></span>
                  <span className="text-font-base">DYS: <strong>{dysCount}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-warning rounded-full"></span>
                  <span className="text-font-base">Non-DYS: <strong>{nonDysCount}</strong></span>
                </div>
                <div className="text-font-base">Total: <strong>{entries.length}</strong></div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-subtle border-b border-bd">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-font-base">Resident</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-font-base">Youth ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-font-base">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-font-base">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bd">
                  {residents.map((resident, index) => {
                    const entry = entries.find(e => e.residentId === resident.id);
                    return (
                      <tr key={resident.id} className="hover:bg-bg-subtle">
                        <td className="px-4 py-3 text-sm font-medium text-font-heading">
                          {resident.firstName} {resident.lastName}
                        </td>
                        <td className="px-4 py-3 text-sm text-font-detail">
                          {resident.youthId || 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={entry?.status || 'DYS'}
                            onChange={(e) => handleStatusChange(resident.id, e.target.value as 'DYS' | 'NON_DYS')}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                              entry?.status === 'DYS'
                                ? 'bg-success-light border-success text-success'
                                : 'bg-warning-light border-warning text-warning'
                            }`}
                          >
                            <option value="DYS">DYS</option>
                            <option value="NON_DYS">Non-DYS</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={entry?.comments || ''}
                            onChange={(e) => handleCommentsChange(resident.id, e.target.value)}
                            placeholder="Add comments..."
                            className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 ring-primary focus:border-transparent text-sm"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {/* Historical Census Tab */}
      {activeTab === 'historical' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-heading">Past Censuses</h3>
            <p className="text-sm text-font-detail mt-1">View previously submitted census records</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-subtle border-b border-bd">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-font-base">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-font-base">Shift</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-font-base">Conducted By</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-font-base">DYS / Non-DYS</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-font-base">Submitted</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-font-base">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bd">
                {historicalCensuses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <i className="fa-solid fa-inbox text-font-detail text-5xl mb-4 block"></i>
                      <p className="text-font-detail">No historical census records found</p>
                    </td>
                  </tr>
                ) : (
                  historicalCensuses.map((census) => (
                    <tr key={census.id} className="hover:bg-bg-subtle">
                      <td className="px-6 py-4 text-sm font-medium text-font-heading">
                        {new Date(census.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getShiftBadge(census.shift)}`}>
                          {census.shift}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-font-base">{census.conductedBy}</td>
                      <td className="px-6 py-4 text-sm text-font-base">
                        <span className="text-success font-medium">{census.dysCount}</span> / 
                        <span className="text-warning font-medium ml-1">{census.nonDysCount}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-font-detail">
                        {census.createdAt ? new Date(census.createdAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewCensus(census)}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 text-sm font-medium"
                        >
                          <i className="fa-solid fa-eye mr-2"></i>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Census Details Modal */}
      {showModal && selectedCensus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-bd flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-font-heading">Census Details</h2>
                <p className="text-sm text-font-detail mt-1">
                  {new Date(selectedCensus.date).toLocaleDateString()} - {selectedCensus.shift}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-font-detail hover:text-font-base"
              >
                <i className="fa-solid fa-times text-2xl"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-primary-lightest rounded-lg">
                  <p className="text-sm text-primary font-medium">Conducted By</p>
                  <p className="text-lg font-bold text-font-heading mt-1">{selectedCensus.conductedBy}</p>
                </div>
                <div className="p-4 bg-success-light rounded-lg">
                  <p className="text-sm text-success font-medium">DYS Residents</p>
                  <p className="text-lg font-bold text-font-heading mt-1">{selectedCensus.dysCount}</p>
                </div>
                <div className="p-4 bg-warning-light rounded-lg">
                  <p className="text-sm text-warning font-medium">Non-DYS Residents</p>
                  <p className="text-lg font-bold text-font-heading mt-1">{selectedCensus.nonDysCount}</p>
                </div>
              </div>
              
              {/* Entries */}
              <h3 className="text-lg font-semibold text-font-heading mb-4">Resident Details</h3>
              <div className="space-y-3">
                {selectedCensus.entries.map((entry, index) => (
                  <div key={index} className="p-4 border border-bd rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-font-heading">{entry.residentName}</p>
                        {entry.comments && (
                          <p className="text-sm text-font-detail mt-1">{entry.comments}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        entry.status === 'DYS'
                          ? 'bg-success-light text-success'
                          : 'bg-warning-light text-warning'
                      }`}>
                        {entry.status === 'DYS' ? 'DYS' : 'Non-DYS'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-bd flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-bg-subtle text-font-base rounded-lg hover:bg-opacity-80 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
