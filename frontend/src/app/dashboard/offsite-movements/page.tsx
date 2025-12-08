'use client';

import { useState } from 'react';

export default function OffsiteMovementsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'archive'>('overview');
  const [showOtherMovementType, setShowOtherMovementType] = useState(false);
  
  // Archive filters
  const [archiveSearchFilter, setArchiveSearchFilter] = useState('');
  const [archiveDateFilter, setArchiveDateFilter] = useState('');
  const [archiveTypeFilter, setArchiveTypeFilter] = useState('');
  const [archiveStatusFilter, setArchiveStatusFilter] = useState('');

  const tabBtnBase = 'flex items-center px-1 py-3 text-sm font-medium border-b-2 transition-colors';
  const tabBtnInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';
  const tabBtnActive = 'border-primary text-primary';

  const handleAssign = () => alert('Staff assignment workflow coming soon.');
  const handleContact = () => alert('Contact team action coming soon.');
  const handleAutoAssign = () => alert('Auto-assigning available staff...');
  const handleSchedule = () => alert('Movement scheduled.');

  const movementTypes = [
    'Medical Appointment',
    'Hospital Emergency',
    'Psychological Evaluation',
    'Court Appearance',
    'Probation Meeting',
    'DYS Case Conference',
    'Family Visit (Approved)',
    'Education Program Off-Site',
    'Community Service',
    'Religious Activity',
    'Reintegration Program',
    'Youth Placement Move',
    'Inter-Facility Transfer',
    'Other'
  ];

  // Mock archive data
  const archiveData = [
    {
      id: 1,
      date: '2024-12-07',
      time: '8:00 AM',
      resident: 'Resident A01',
      type: 'Medical Appointment',
      destination: 'Taunton Family Health Center',
      staff: 'Officer Johnson, Officer Lee',
      status: 'Completed',
      duration: '2.5 hours',
      notes: 'Routine checkup completed successfully'
    },
    {
      id: 2,
      date: '2024-12-06',
      time: '10:00 AM',
      resident: 'Resident B01',
      type: 'Court Appearance',
      destination: 'Taunton District Court',
      staff: 'Officer Martinez, Officer Chen',
      status: 'Completed',
      duration: '4 hours',
      notes: 'Court hearing concluded, next date scheduled'
    },
    {
      id: 3,
      date: '2024-12-05',
      time: '1:30 PM',
      resident: 'Resident C02',
      type: 'Hospital Emergency',
      destination: 'Springfield General Hospital',
      staff: 'Officer Johnson, Officer Davis',
      status: 'Completed',
      duration: '6 hours',
      notes: 'Emergency treated, youth returned safely'
    },
    {
      id: 4,
      date: '2024-12-04',
      time: '9:00 AM',
      resident: 'Resident A02',
      type: 'Probation Meeting',
      destination: 'Bristol County Probation Office',
      staff: 'Officer Lee, Officer Martinez',
      status: 'Completed',
      duration: '1.5 hours',
      notes: 'Monthly check-in completed'
    },
    {
      id: 5,
      date: '2024-12-03',
      time: '2:00 PM',
      resident: 'Resident B03',
      type: 'Psychological Evaluation',
      destination: 'Youth Services Mental Health Center',
      staff: 'Officer Chen, Officer Davis',
      status: 'Cancelled',
      duration: '-',
      notes: 'Cancelled due to staff availability - rescheduled'
    }
  ];

  // Filter archive data
  const filteredArchiveData = archiveData.filter(record => {
    const matchesSearch = !archiveSearchFilter ||
      record.resident.toLowerCase().includes(archiveSearchFilter.toLowerCase()) ||
      record.destination.toLowerCase().includes(archiveSearchFilter.toLowerCase()) ||
      record.staff.toLowerCase().includes(archiveSearchFilter.toLowerCase());
    
    const matchesDate = !archiveDateFilter || record.date === archiveDateFilter;
    const matchesType = !archiveTypeFilter || record.type === archiveTypeFilter;
    const matchesStatus = !archiveStatusFilter || record.status === archiveStatusFilter;
    
    return matchesSearch && matchesDate && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <nav className="flex space-x-8 border-b border-bd">
          <button
            className={`${tabBtnBase} ${activeTab === 'overview' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className={`fa-solid fa-calendar-days mr-2 ${activeTab === 'overview' ? 'text-primary' : 'text-font-detail'}`}></i>
            Scheduled Off-Site Movements
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'schedule' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('schedule')}
          >
            <i className={`fa-solid fa-calendar-plus mr-2 ${activeTab === 'schedule' ? 'text-primary' : 'text-font-detail'}`}></i>
            Schedule Off-Site Movement
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'archive' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('archive')}
          >
            <i className={`fa-solid fa-box-archive mr-2 ${activeTab === 'archive' ? 'text-primary' : 'text-font-detail'}`}></i>
            Movement Archive
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-clock text-error mr-3"></i>
                Upcoming & Urgent Off-Site Movements
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Scheduled movements requiring immediate attention and staff assignment
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-error-lightest border-l-4 border-error p-4 rounded-r-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-semibold text-error">URGENT</span>
                      <span className="mx-2 text-font-detail">|</span>
                      <span className="text-sm font-medium text-font-base">Hospital Emergency</span>
                    </div>
                    <p className="text-sm text-font-base font-medium">Resident C02 - Springfield General Hospital</p>
                    <p className="text-xs text-font-detail mt-1">Tomorrow, 9:00 AM - Emergency Department</p>
                  </div>
                  <span className="bg-error text-white px-3 py-1 rounded-full text-xs font-medium">Unassigned</span>
                </div>
                <button onClick={handleAssign} className="text-xs text-error font-medium hover:underline">
                  Assign Staff Now
                </button>
              </div>

              <div className="bg-warning-lightest border-l-4 border-warning p-4 rounded-r-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-semibold text-warning">PRIORITY</span>
                      <span className="mx-2 text-font-detail">|</span>
                      <span className="text-sm font-medium text-font-base">Court Appearance</span>
                    </div>
                    <p className="text-sm text-font-base font-medium">Resident B01 - Taunton District Court</p>
                    <p className="text-xs text-font-detail mt-1">Dec 6, 10:00 AM - Courtroom 3A</p>
                  </div>
                  <span className="bg-warning text-white px-3 py-1 rounded-full text-xs font-medium">Partial</span>
                </div>
                <div className="text-xs text-font-detail">
                  <span className="font-medium">Assigned:</span> Officer Martinez (1 of 2 required)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-calendar-day text-primary mr-3"></i>
                Today's Off-Site Movement Schedule
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                All scheduled off-site movements for today with staff assignments
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-bg-subtle border border-bd rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium mr-2">8:00 AM</span>
                        <span className="text-sm font-medium text-font-base">Medical Appointment</span>
                      </div>
                      <p className="text-sm text-font-base font-medium mb-1">Resident A01 - Taunton Family Health Center</p>
                      <p className="text-xs text-font-detail">Dr. Sarah Wilson - Routine Checkup</p>
                    </div>
                    <span className="bg-success text-white px-3 py-1 rounded-full text-xs font-medium">Assigned</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-bd">
                    <div className="text-xs text-font-detail">
                      <span className="font-medium">Staff:</span> Officer Johnson, Officer Lee
                    </div>
                    <button onClick={handleContact} className="text-xs text-primary font-medium hover:underline">
                      Contact Team
                    </button>
                  </div>
                </div>

                <div className="bg-bg-subtle border border-bd rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium mr-2">1:00 PM</span>
                        <span className="text-sm font-medium text-font-base">Probation Meeting</span>
                      </div>
                      <p className="text-sm text-font-base font-medium mb-1">Resident B03 - Bristol County Probation Office</p>
                      <p className="text-xs text-font-detail">Officer Thomas - Monthly Check-in</p>
                    </div>
                    <span className="bg-success text-white px-3 py-1 rounded-full text-xs font-medium">Assigned</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-bd">
                    <div className="text-xs text-font-detail">
                      <span className="font-medium">Staff:</span> Officer Martinez, Officer Chen
                    </div>
                    <button onClick={handleContact} className="text-xs text-primary font-medium hover:underline">
                      Contact Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-calendar-plus text-primary mr-3"></i>
                Schedule New Off-Site Movement
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Create and coordinate secure transportation for youth off-site movements
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-font-base mb-4">Movement Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Resident</label>
                        <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                          <option>Select Resident</option>
                          <option>Resident A01</option>
                          <option>Resident A02</option>
                          <option>Resident B01</option>
                          <option>Resident B03</option>
                          <option>Resident C02</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Off-Site Movement Type</label>
                        <select 
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                          onChange={(e) => setShowOtherMovementType(e.target.value === 'Other')}
                        >
                          <option value="">Select Movement Type</option>
                          {movementTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      
                      {showOtherMovementType && (
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-2">Specify Movement Type</label>
                          <input 
                            type="text" 
                            placeholder="Describe the type of movement..." 
                            className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-2">Date</label>
                          <input type="date" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-2">Time</label>
                          <input type="time" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Destination Contact</label>
                        <input type="text" placeholder="e.g., Dr. Sarah Wilson, Officer Thomas, Judge Morrison" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Destination Address</label>
                        <textarea placeholder="Full address of destination..." className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-20"></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-font-base mb-4">Transport Coordination</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Estimated Duration</label>
                        <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                          <option>1 Hour</option>
                          <option>1.5 Hours</option>
                          <option>2 Hours</option>
                          <option>3 Hours</option>
                          <option>Half Day (4+ Hours)</option>
                          <option>Full Day</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Priority Level</label>
                        <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                          <option>Routine</option>
                          <option>Urgent</option>
                          <option>Emergency</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Security Requirements</label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-bd text-primary focus:ring-primary" />
                            <span className="ml-2 text-sm">Restraints Required</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-bd text-primary focus:ring-primary" />
                            <span className="ml-2 text-sm">Wheelchair Accessible</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-bd text-primary focus:ring-primary" />
                            <span className="ml-2 text-sm">Medical Equipment Needed</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-bd text-primary focus:ring-primary" />
                            <span className="ml-2 text-sm">Behavioral Precautions</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Additional Notes</label>
                        <textarea placeholder="Special instructions, security concerns, behavioral notes..." className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-24"></textarea>
                      </div>
                      <div className="bg-primary-lightest p-4 rounded-lg border border-primary/20">
                        <div className="flex items-center mb-2">
                          <i className="fa-solid fa-shield-halved text-primary mr-2"></i>
                          <span className="font-medium text-primary">Staff Assignment</span>
                        </div>
                        <p className="text-xs text-font-detail mb-3">Two staff members required for all off-site movements</p>
                        <button onClick={handleAutoAssign} className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors">
                          Auto-Assign Available Staff
                        </button>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSchedule} className="w-full bg-success text-white py-3 rounded-lg hover:bg-success/90 font-medium transition-colors">
                    <i className="fa-solid fa-calendar-check mr-2"></i>
                    Schedule Movement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-box-archive text-primary mr-3"></i>
                Off-Site Movement Archive
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Historical records of all completed and cancelled off-site movements
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Search by resident, destination, or staff..."
                value={archiveSearchFilter}
                onChange={(e) => setArchiveSearchFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <input
                type="date"
                value={archiveDateFilter}
                onChange={(e) => setArchiveDateFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <select
                value={archiveTypeFilter}
                onChange={(e) => setArchiveTypeFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Movement Types</option>
                {movementTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={archiveStatusFilter}
                onChange={(e) => setArchiveStatusFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-subtle border-b border-bd">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Time</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Resident</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Movement Type</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Destination</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Staff</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Duration</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredArchiveData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-16">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-lightest mb-4">
                          <i className="fa-solid fa-box-archive text-4xl text-primary opacity-50"></i>
                        </div>
                        <h4 className="text-xl font-semibold text-font-base mb-2">No Movement Records Found</h4>
                        <p className="text-font-detail">
                          {archiveSearchFilter || archiveDateFilter || archiveTypeFilter || archiveStatusFilter
                            ? 'No movements match your current filters. Try adjusting your search criteria.'
                            : 'No historical movement records available yet.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredArchiveData.map((record) => (
                    <tr key={record.id} className="border-b border-bd hover:bg-bg-subtle">
                      <td className="px-4 py-3 text-font-base">
                        {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-font-detail">{record.time}</td>
                      <td className="px-4 py-3 text-font-base font-medium">{record.resident}</td>
                      <td className="px-4 py-3 text-font-detail">{record.type}</td>
                      <td className="px-4 py-3 text-font-detail">{record.destination}</td>
                      <td className="px-4 py-3 text-font-detail text-xs">{record.staff}</td>
                      <td className="px-4 py-3 text-font-detail">{record.duration}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          record.status === 'Completed'
                            ? 'bg-success/10 text-success'
                            : record.status === 'Cancelled'
                            ? 'bg-error/10 text-error'
                            : 'bg-info/10 text-info'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-font-detail text-xs max-w-xs truncate" title={record.notes}>
                        {record.notes || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
