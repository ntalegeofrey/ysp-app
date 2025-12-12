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
  const [saved, setSaved] = useState(false);
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
    if (saved) return;
    setEntries(prev => prev.map(entry => 
      entry.residentId === residentId ? { ...entry, status } : entry
    ));
  };
  
  const handleCommentsChange = (residentId: number, comments: string) => {
    if (saved) return;
    setEntries(prev => prev.map(entry => 
      entry.residentId === residentId ? { ...entry, comments } : entry
    ));
  };

  const handleSave = async () => {
    if (saved) return;
    
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
    
    // For now, just mark as saved
    setSaved(true);
    alert('Census saved successfully!');
  };

  const handleSendEmail = async () => {
    if (!saved) {
      alert('Please save the census before sending.');
      return;
    }
    
    // TODO: Send email via backend API
    console.log('Sending census email for', date, shift);
    alert('Census email sent to administrators!');
  };

  const handleViewCensus = (census: Census) => {
    setSelectedCensus(census);
    setShowModal(true);
  };
  
  const dysCount = entries.filter(e => e.status === 'DYS').length;
  const nonDysCount = entries.filter(e => e.status === 'NON_DYS').length;
  
  const getShiftBadge = (shift: string) => {
    const colors = {
      MORNING: 'bg-yellow-100 text-yellow-800',
      AFTERNOON: 'bg-blue-100 text-blue-800',
      EVENING: 'bg-purple-100 text-purple-800'
    };
    return colors[shift as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-bd p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-users text-blue-600 text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Residential Census</h1>
            <p className="text-sm text-gray-600">Track resident status for each shift</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'current'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <i className="fa-solid fa-clipboard-check mr-2"></i>
            Current Census
          </button>
          <button
            onClick={() => setActiveTab('historical')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'historical'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fa-solid fa-calendar mr-2 text-blue-600"></i>
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={saved}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fa-solid fa-clock mr-2 text-blue-600"></i>
                  Shift
                </label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value as any)}
                  disabled={saved}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="MORNING">Morning</option>
                  <option value="AFTERNOON">Afternoon</option>
                  <option value="EVENING">Evening</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fa-solid fa-user mr-2 text-blue-600"></i>
                  Conducted By
                </label>
                <input
                  type="text"
                  value={conductedBy}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>
              
              <div className="flex items-end gap-2">
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    saved
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <i className="fa-solid fa-save mr-2"></i>
                  {saved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={!saved}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  Send
                </button>
              </div>
            </div>
            
            {saved && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  Census locked and saved
                </p>
              </div>
            )}
          </div>

          {/* Census Table */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resident Status</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-gray-700">DYS: <strong>{dysCount}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  <span className="text-gray-700">Non-DYS: <strong>{nonDysCount}</strong></span>
                </div>
                <div className="text-gray-700">Total: <strong>{entries.length}</strong></div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Resident</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Youth ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {residents.map((resident, index) => {
                    const entry = entries.find(e => e.residentId === resident.id);
                    return (
                      <tr key={resident.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {resident.firstName} {resident.lastName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {resident.youthId || 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={entry?.status || 'DYS'}
                            onChange={(e) => handleStatusChange(resident.id, e.target.value as 'DYS' | 'NON_DYS')}
                            disabled={saved}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                              entry?.status === 'DYS'
                                ? 'bg-green-50 border-green-300 text-green-700'
                                : 'bg-orange-50 border-orange-300 text-orange-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                            disabled={saved}
                            placeholder="Add comments..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-sm"
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
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Past Censuses</h3>
            <p className="text-sm text-gray-600 mt-1">View previously submitted census records</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Shift</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Conducted By</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">DYS / Non-DYS</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Submitted</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historicalCensuses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <i className="fa-solid fa-inbox text-gray-400 text-5xl mb-4 block"></i>
                      <p className="text-gray-500">No historical census records found</p>
                    </td>
                  </tr>
                ) : (
                  historicalCensuses.map((census) => (
                    <tr key={census.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {new Date(census.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getShiftBadge(census.shift)}`}>
                          {census.shift}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{census.conductedBy}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="text-green-600 font-medium">{census.dysCount}</span> / 
                        <span className="text-orange-600 font-medium ml-1">{census.nonDysCount}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {census.createdAt ? new Date(census.createdAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewCensus(census)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
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
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Census Details</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(selectedCensus.date).toLocaleDateString()} - {selectedCensus.shift}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-times text-2xl"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Conducted By</p>
                  <p className="text-lg font-bold text-blue-900 mt-1">{selectedCensus.conductedBy}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">DYS Residents</p>
                  <p className="text-lg font-bold text-green-900 mt-1">{selectedCensus.dysCount}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Non-DYS Residents</p>
                  <p className="text-lg font-bold text-orange-900 mt-1">{selectedCensus.nonDysCount}</p>
                </div>
              </div>
              
              {/* Entries */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resident Details</h3>
              <div className="space-y-3">
                {selectedCensus.entries.map((entry, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{entry.residentName}</p>
                        {entry.comments && (
                          <p className="text-sm text-gray-600 mt-1">{entry.comments}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        entry.status === 'DYS'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {entry.status === 'DYS' ? 'DYS' : 'Non-DYS'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
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
