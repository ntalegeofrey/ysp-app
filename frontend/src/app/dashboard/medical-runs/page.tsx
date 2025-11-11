'use client';

import { useState } from 'react';

export default function MedicalRunsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule'>('overview');

  const tabBtnBase = 'flex items-center px-1 py-3 text-sm font-medium border-b-2 transition-colors';
  const tabBtnInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';
  const tabBtnActive = 'border-primary text-primary';

  const handleAssign = () => alert('Staff assignment workflow coming soon.');
  const handleContact = () => alert('Contact team action coming soon.');
  const handleAutoAssign = () => alert('Auto-assigning available staff...');
  const handleSchedule = () => alert('Appointment scheduled.');

  return (
    <div className="space-y-6">
      <div>
        <nav className="flex space-x-8 border-b border-bd">
          <button
            className={`${tabBtnBase} ${activeTab === 'overview' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className={`fa-solid fa-calendar-day mr-2 ${activeTab === 'overview' ? 'text-primary' : 'text-font-detail'}`}></i>
            Overview & Schedule
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'schedule' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('schedule')}
          >
            <i className={`fa-solid fa-calendar-plus mr-2 ${activeTab === 'schedule' ? 'text-primary' : 'text-font-detail'}`}></i>
            Schedule Appointment
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-clock text-error mr-3"></i>
                Upcoming & Urgent Medical Runs
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Medical appointments requiring immediate attention and staff assignment
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="border-l-4 border-error bg-error-lightest p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-error">Urgent - No Staff Assigned</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-font-detail">Today 2:30 PM</span>
                    <button onClick={handleAssign} className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light transition-colors">
                      <i className="fa-solid fa-user-plus mr-1"></i>
                      Assign Staff
                    </button>
                  </div>
                </div>
                <div className="text-sm text-font-base">
                  <strong>Resident A02</strong> - Emergency Dental Appointment
                </div>
                <div className="text-xs text-font-detail mt-1">
                  Location: Springfield Dental Clinic • Departure: 1:45 PM • Duration: ~2 hours
                </div>
              </div>

              <div className="border-l-4 border-warning bg-highlight-lightest p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-warning">Departure in 2 Hours</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-font-detail">Today 1:00 PM</span>
                    <span className="bg-success text-white px-2 py-1 rounded text-xs">Staff Assigned</span>
                  </div>
                </div>
                <div className="text-sm text-font-base">
                  <strong>Resident B01</strong> - Orthopedic Follow-up
                </div>
                <div className="text-xs text-font-detail mt-1">
                  Staff: J. Martinez, K. Thompson • Location: UMass Medical Center
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-calendar-day text-primary mr-3"></i>
                Today's Medical Run Schedule
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                All scheduled medical appointments for today with staff assignments
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="border border-bd rounded-lg p-4 bg-primary-alt-lightest border-l-4 border-l-success">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="font-semibold text-success mr-3">9:00 AM</span>
                    <span className="bg-success text-white px-2 py-1 rounded text-xs">Completed</span>
                  </div>
                  <span className="text-xs text-font-detail">Returned: 11:30 AM</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-font-base">Resident C01</h4>
                    <p className="text-sm text-font-detail">Routine Physical</p>
                    <p className="text-xs text-font-detail">UMass Family Medicine</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-font-base">Staff</h5>
                    <p className="text-sm text-font-detail">L. Davis, R. Martinez</p>
                  </div>
                  <div className="text-right">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-file-alt mr-1"></i>
                      View Report
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-bd rounded-lg p-4 bg-highlight-lightest border-l-4 border-l-warning">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="font-semibold text-warning mr-3">1:00 PM</span>
                    <span className="bg-warning text-white px-2 py-1 rounded text-xs">In Progress</span>
                  </div>
                  <span className="text-xs text-font-detail">Departed: 12:15 PM</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-font-base">Resident B01</h4>
                    <p className="text-sm text-font-detail">Orthopedic Follow-up</p>
                    <p className="text-xs text-font-detail">UMass Medical Center</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-font-base">Staff</h5>
                    <p className="text-sm text-font-detail">J. Martinez, K. Thompson</p>
                  </div>
                  <div className="text-right">
                    <button onClick={handleContact} className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-phone mr-1"></i>
                      Contact Team
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-bd rounded-lg p-4 bg-error-lightest border-l-4 border-l-error">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="font-semibold text-error mr-3">2:30 PM</span>
                    <span className="bg-error text-white px-2 py-1 rounded text-xs">Needs Staff</span>
                  </div>
                  <span className="text-xs text-font-detail">Departure: 1:45 PM</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-font-base">Resident A02</h4>
                    <p className="text-sm text-font-detail">Emergency Dental</p>
                    <p className="text-xs text-font-detail">Springfield Dental Clinic</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-font-base">Staff</h5>
                    <p className="text-sm text-error">Not Assigned</p>
                  </div>
                  <div className="text-right">
                    <button onClick={handleAssign} className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-user-plus mr-1"></i>
                      Assign Staff
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-calendar-plus text-primary mr-3"></i>
                Schedule New Medical Appointment
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Create new medical appointment and coordinate transport logistics
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-font-base mb-4">Appointment Details</h4>
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
                        <label className="block text-sm font-medium text-font-base mb-2">Medical Provider</label>
                        <input type="text" placeholder="e.g., Dr. Sarah Wilson, Springfield Dental" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Appointment Type</label>
                        <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                          <option>Select Type</option>
                          <option>Routine Checkup</option>
                          <option>Emergency</option>
                          <option>Specialist Consultation</option>
                          <option>Follow-up</option>
                          <option>Dental</option>
                          <option>Mental Health</option>
                          <option>Physical Therapy</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Location Address</label>
                        <textarea placeholder="Full address of medical facility..." className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-20"></textarea>
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
                        <label className="block text-sm font-medium text-font-base mb-2">Special Requirements</label>
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
                        <textarea placeholder="Special instructions, medical history, behavioral notes..." className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-24"></textarea>
                      </div>
                      <div className="bg-primary-lightest p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <i className="fa-solid fa-users text-primary mr-2"></i>
                          <span className="font-medium text-primary">Staff Assignment</span>
                        </div>
                        <p className="text-xs text-font-detail mb-3">Two staff members required for all medical runs</p>
                        <button onClick={handleAutoAssign} className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-light text-sm">
                          Auto-Assign Available Staff
                        </button>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSchedule} className="w-full bg-success text-white py-3 rounded-lg hover:bg-primary-alt-dark font-medium">
                    <i className="fa-solid fa-calendar-check mr-2"></i>
                    Schedule Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
