'use client';

import { useState } from 'react';

interface CreateScheduleDrawerProps {
  onClose: () => void;
}

export default function CreateScheduleDrawer({ onClose }: CreateScheduleDrawerProps) {
  const [step, setStep] = useState(1);
  const [scheduleType, setScheduleType] = useState('weekly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedShifts, setSelectedShifts] = useState({
    day: true,
    evening: true,
    night: true,
  });
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const availableStaff = [
    { id: '1', name: 'Davis, Linda', position: 'JJYDS III', status: 'Available' },
    { id: '2', name: 'Wilson, Marcus', position: 'JJYDS II', status: 'Available' },
    { id: '3', name: 'Thompson, Kevin', position: 'JJYDS III', status: 'Available' },
    { id: '4', name: 'Rodriguez, Ana', position: 'JJYDS I', status: 'Available' },
    { id: '5', name: 'Martinez, Carlos', position: 'JJYDS II', status: 'Available' },
    { id: '6', name: 'Garcia, Luis', position: 'JJYDS I', status: 'Available' },
    { id: '7', name: 'Brown, Patricia', position: 'JJYDS II', status: 'Available' },
    { id: '8', name: 'Henderson, Sarah', position: 'JJYDS II', status: 'On Leave' },
  ];

  const handleStaffToggle = (staffId: string) => {
    setSelectedStaff(prev =>
      prev.includes(staffId) ? prev.filter(id => id !== staffId) : [...prev, staffId]
    );
  };

  const handleSave = () => {
    alert('Schedule created! (Backend integration pending)');
    onClose();
  };

  const canProceedStep1 = scheduleType && startDate && endDate;
  const canProceedStep2 = selectedShifts.day || selectedShifts.evening || selectedShifts.night;
  const canProceedStep3 = selectedStaff.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="relative bg-white h-full w-full lg:w-3/5 shadow-2xl flex flex-col animate-slide-in-right">
        <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Create New Schedule</h2>
            <p className="text-sm text-primary-lightest mt-1">
              Step {step} of 4
            </p>
          </div>
          <button onClick={onClose} className="text-white hover:text-primary-lightest p-2">
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                      step >= s ? 'bg-primary text-white' : 'bg-bg-subtle text-font-detail'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-bg-subtle'}`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-font-detail">
              <span>Schedule Info</span>
              <span>Select Shifts</span>
              <span>Assign Staff</span>
              <span>Review</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-font-heading mb-4">Schedule Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">
                      Schedule Type
                      <span className="text-error ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setScheduleType('weekly')}
                        className={`p-4 border rounded-lg text-center ${
                          scheduleType === 'weekly'
                            ? 'border-primary bg-primary-lightest text-primary'
                            : 'border-bd hover:border-primary-light'
                        }`}
                      >
                        <i className="fa-solid fa-calendar-week text-2xl mb-2"></i>
                        <div className="text-sm font-medium">Weekly</div>
                      </button>
                      <button
                        onClick={() => setScheduleType('biweekly')}
                        className={`p-4 border rounded-lg text-center ${
                          scheduleType === 'biweekly'
                            ? 'border-primary bg-primary-lightest text-primary'
                            : 'border-bd hover:border-primary-light'
                        }`}
                      >
                        <i className="fa-solid fa-calendar-days text-2xl mb-2"></i>
                        <div className="text-sm font-medium">Bi-Weekly</div>
                      </button>
                      <button
                        onClick={() => setScheduleType('monthly')}
                        className={`p-4 border rounded-lg text-center ${
                          scheduleType === 'monthly'
                            ? 'border-primary bg-primary-lightest text-primary'
                            : 'border-bd hover:border-primary-light'
                        }`}
                      >
                        <i className="fa-solid fa-calendar text-2xl mb-2"></i>
                        <div className="text-sm font-medium">Monthly</div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">
                        Start Date
                        <span className="text-error ml-1">*</span>
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">
                        End Date
                        <span className="text-error ml-1">*</span>
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">
                      Schedule Notes (Optional)
                    </label>
                    <textarea
                      className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm"
                      rows={3}
                      placeholder="Add any notes or special instructions for this schedule..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-font-heading mb-4">Select Active Shifts</h3>
                <p className="text-sm text-font-detail mb-6">
                  Choose which shifts will be active for this schedule period
                </p>

                <div className="space-y-4">
                  <div
                    onClick={() => setSelectedShifts({ ...selectedShifts, day: !selectedShifts.day })}
                    className={`p-6 border rounded-lg cursor-pointer transition-all ${
                      selectedShifts.day
                        ? 'border-primary bg-primary-lightest'
                        : 'border-bd hover:border-primary-light'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <i className="fa-solid fa-sun text-warning text-3xl"></i>
                        <div>
                          <div className="font-semibold text-font-base">Day Shift</div>
                          <div className="text-sm text-font-detail">7:00 AM - 3:00 PM</div>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          selectedShifts.day ? 'bg-primary border-primary' : 'border-bd'
                        }`}
                      >
                        {selectedShifts.day && <i className="fa-solid fa-check text-white text-xs"></i>}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedShifts({ ...selectedShifts, evening: !selectedShifts.evening })}
                    className={`p-6 border rounded-lg cursor-pointer transition-all ${
                      selectedShifts.evening
                        ? 'border-primary bg-primary-lightest'
                        : 'border-bd hover:border-primary-light'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <i className="fa-solid fa-cloud-sun text-primary-light text-3xl"></i>
                        <div>
                          <div className="font-semibold text-font-base">Evening Shift</div>
                          <div className="text-sm text-font-detail">3:00 PM - 11:00 PM</div>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          selectedShifts.evening ? 'bg-primary border-primary' : 'border-bd'
                        }`}
                      >
                        {selectedShifts.evening && <i className="fa-solid fa-check text-white text-xs"></i>}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedShifts({ ...selectedShifts, night: !selectedShifts.night })}
                    className={`p-6 border rounded-lg cursor-pointer transition-all ${
                      selectedShifts.night
                        ? 'border-primary bg-primary-lightest'
                        : 'border-bd hover:border-primary-light'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <i className="fa-solid fa-moon text-primary text-3xl"></i>
                        <div>
                          <div className="font-semibold text-font-base">Overnight Shift</div>
                          <div className="text-sm text-font-detail">11:00 PM - 7:00 AM</div>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          selectedShifts.night ? 'bg-primary border-primary' : 'border-bd'
                        }`}
                      >
                        {selectedShifts.night && <i className="fa-solid fa-check text-white text-xs"></i>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-font-heading mb-4">Assign Staff Pool</h3>
                <p className="text-sm text-font-detail mb-6">
                  Select staff members to include in this schedule
                </p>

                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm text-font-detail">
                    Selected: <span className="font-semibold text-font-base">{selectedStaff.length}</span> of {availableStaff.length}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedStaff(availableStaff.filter(s => s.status === 'Available').map(s => s.id))}
                      className="text-xs text-primary hover:underline"
                    >
                      Select All Available
                    </button>
                    <button
                      onClick={() => setSelectedStaff([])}
                      className="text-xs text-error hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {availableStaff.map((staff) => (
                    <div
                      key={staff.id}
                      onClick={() => staff.status === 'Available' && handleStaffToggle(staff.id)}
                      className={`p-4 border rounded-lg transition-all ${
                        selectedStaff.includes(staff.id)
                          ? 'border-primary bg-primary-lightest'
                          : staff.status === 'Available'
                          ? 'border-bd hover:border-primary-light cursor-pointer'
                          : 'border-bd bg-bg-subtle opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                              selectedStaff.includes(staff.id) ? 'bg-primary border-primary' : 'border-bd'
                            }`}
                          >
                            {selectedStaff.includes(staff.id) && <i className="fa-solid fa-check text-white text-xs"></i>}
                          </div>
                          <div>
                            <div className="font-medium text-font-base">{staff.name}</div>
                            <div className="text-xs text-font-detail">{staff.position}</div>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            staff.status === 'Available' ? 'bg-success text-white' : 'bg-font-detail text-white'
                          }`}
                        >
                          {staff.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-font-heading mb-4">Review & Confirm</h3>
                <p className="text-sm text-font-detail mb-6">
                  Please review your schedule details before creating
                </p>

                <div className="space-y-4">
                  <div className="border border-bd rounded-lg p-4">
                    <div className="text-sm font-semibold text-font-base mb-3">Schedule Information</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-font-detail">Type:</span>
                        <span className="font-medium text-font-base capitalize">{scheduleType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-font-detail">Start Date:</span>
                        <span className="font-medium text-font-base">{startDate || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-font-detail">End Date:</span>
                        <span className="font-medium text-font-base">{endDate || 'Not set'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-bd rounded-lg p-4">
                    <div className="text-sm font-semibold text-font-base mb-3">Active Shifts</div>
                    <div className="space-y-2">
                      {selectedShifts.day && (
                        <div className="flex items-center text-sm">
                          <i className="fa-solid fa-sun text-warning mr-2"></i>
                          <span className="text-font-base">Day Shift (7AM-3PM)</span>
                        </div>
                      )}
                      {selectedShifts.evening && (
                        <div className="flex items-center text-sm">
                          <i className="fa-solid fa-cloud-sun text-primary-light mr-2"></i>
                          <span className="text-font-base">Evening Shift (3PM-11PM)</span>
                        </div>
                      )}
                      {selectedShifts.night && (
                        <div className="flex items-center text-sm">
                          <i className="fa-solid fa-moon text-primary mr-2"></i>
                          <span className="text-font-base">Overnight Shift (11PM-7AM)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border border-bd rounded-lg p-4">
                    <div className="text-sm font-semibold text-font-base mb-3">
                      Staff Pool ({selectedStaff.length} members)
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedStaff.map((staffId) => {
                        const staff = availableStaff.find(s => s.id === staffId);
                        return staff ? (
                          <div key={staffId} className="text-font-base">
                            <i className="fa-solid fa-user text-primary mr-2 text-xs"></i>
                            {staff.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="bg-highlight-lightest border border-warning rounded-lg p-4">
                    <div className="flex items-start">
                      <i className="fa-solid fa-info-circle text-warning mr-3 mt-0.5"></i>
                      <div className="text-sm text-font-base">
                        Once created, you can assign specific staff to shifts by clicking on calendar days. 
                        Open slots will be available for overtime requests.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-bd p-6 bg-bg-subtle flex justify-between">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-4 py-2 border border-bd rounded-lg text-font-base hover:bg-white"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            {step === 1 ? 'Cancel' : 'Previous'}
          </button>
          <div className="flex space-x-3">
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !canProceedStep1) ||
                  (step === 2 && !canProceedStep2) ||
                  (step === 3 && !canProceedStep3)
                }
                className={`px-6 py-2 rounded-lg ${
                  (step === 1 && canProceedStep1) ||
                  (step === 2 && canProceedStep2) ||
                  (step === 3 && canProceedStep3)
                    ? 'bg-primary text-white hover:bg-primary-light'
                    : 'bg-font-detail text-white cursor-not-allowed'
                }`}
              >
                Next
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-success text-white rounded-lg hover:bg-primary-alt"
              >
                <i className="fa-solid fa-check mr-2"></i>
                Create Schedule
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
