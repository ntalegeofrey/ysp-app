'use client';

import { useState } from 'react';

interface CallOutModalProps {
  onClose: () => void;
}

export default function CallOutModal({ onClose }: CallOutModalProps) {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [shift, setShift] = useState('');
  const [reason, setReason] = useState('');
  const [callTime, setCallTime] = useState('');
  const [notes, setNotes] = useState('');

  const scheduledStaff = [
    { id: '1', name: 'Davis, Linda', position: 'JJYDS III', shift: 'Day 7AM-3PM' },
    { id: '2', name: 'Wilson, Marcus', position: 'JJYDS II', shift: 'Day 7AM-3PM' },
    { id: '3', name: 'Rodriguez, Ana', position: 'JJYDS I', shift: 'Day 7AM-3PM' },
    { id: '4', name: 'Thompson, Kevin', position: 'JJYDS III', shift: 'Evening 3PM-11PM' },
    { id: '5', name: 'Garcia, Luis', position: 'JJYDS II', shift: 'Evening 3PM-11PM' },
    { id: '6', name: 'Martinez, Carlos', position: 'JJYDS II', shift: 'Evening 3PM-11PM' },
    { id: '7', name: 'Roberts, Tom', position: 'JJYDS III', shift: 'Overnight 11PM-7AM' },
    { id: '8', name: 'Brown, Patricia', position: 'JJYDS II', shift: 'Overnight 11PM-7AM' },
  ];

  const callOutReasons = [
    'Sick/Illness',
    'Family Emergency',
    'Personal Emergency',
    'No Call/No Show',
    'Transportation Issue',
    'Weather Related',
    'Other',
  ];

  const handleSubmit = () => {
    alert('Call-out logged! (Backend integration pending)');
    onClose();
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const canSubmit = selectedStaff && shift && reason && callTime;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-error text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Log Staff Call Out</h2>
            <p className="text-sm text-red-100 mt-1">Record staff absence notification</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-red-100 p-2">
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-error-lightest border border-error rounded-lg p-4">
            <div className="flex items-start">
              <i className="fa-solid fa-info-circle text-error mr-3 mt-0.5 text-lg"></i>
              <div className="text-sm text-font-base">
                <div className="font-semibold text-font-heading mb-1">Important</div>
                This form immediately notifies supervisors and triggers coverage protocols. 
                Ensure all information is accurate before submitting.
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              Staff Member Calling Out
              <span className="text-error ml-1">*</span>
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select staff member...</option>
              {scheduledStaff.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} - {staff.position} ({staff.shift})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                Scheduled Shift
                <span className="text-error ml-1">*</span>
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select shift...</option>
                <option value="day">Day Shift (7AM-3PM)</option>
                <option value="evening">Evening Shift (3PM-11PM)</option>
                <option value="overnight">Overnight Shift (11PM-7AM)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                Call Received Time
                <span className="text-error ml-1">*</span>
              </label>
              <input
                type="datetime-local"
                value={callTime}
                onChange={(e) => setCallTime(e.target.value)}
                max={getCurrentDateTime()}
                className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              Reason for Call Out
              <span className="text-error ml-1">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {callOutReasons.map((reasonOption) => (
                <button
                  key={reasonOption}
                  onClick={() => setReason(reasonOption)}
                  className={`p-3 border rounded-lg text-sm text-left transition-all ${
                    reason === reasonOption
                      ? 'border-error bg-error-lightest text-font-base font-medium'
                      : 'border-bd hover:border-error text-font-detail'
                  }`}
                >
                  {reasonOption}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm"
              rows={3}
              placeholder="Add any additional details about the call-out (doctor's note required, expected return date, etc.)..."
            ></textarea>
          </div>

          {selectedStaff && shift && (
            <div className="bg-warning-lightest border border-warning rounded-lg p-4">
              <div className="text-sm font-semibold text-font-heading mb-2">
                <i className="fa-solid fa-exclamation-triangle text-warning mr-2"></i>
                Coverage Impact
              </div>
              <div className="text-sm text-font-base space-y-1">
                <div className="flex items-center justify-between">
                  <span>Required Staff:</span>
                  <span className="font-medium">6 staff members</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Currently Scheduled:</span>
                  <span className="font-medium">6 staff members</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>After Call Out:</span>
                  <span className="font-semibold text-error">5 staff members (1 SHORT)</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-warning">
                <div className="text-sm font-semibold text-warning">
                  Action Required: Emergency coverage needed
                </div>
                <div className="text-xs text-font-detail mt-1">
                  Supervisor will be notified immediately to arrange replacement
                </div>
              </div>
            </div>
          )}

          <div className="bg-primary-lightest border border-primary rounded-lg p-4">
            <div className="text-sm font-semibold text-font-heading mb-2">
              What Happens Next
            </div>
            <div className="text-sm text-font-detail space-y-1">
              <div className="flex items-start">
                <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                <span>Supervisor receives immediate notification</span>
              </div>
              <div className="flex items-start">
                <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                <span>Coverage gap marked on schedule (visible to all staff)</span>
              </div>
              <div className="flex items-start">
                <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                <span>Available staff notified for overtime opportunity</span>
              </div>
              <div className="flex items-start">
                <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                <span>Call-out logged in staff member's attendance record</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-bg-subtle border-t border-bd p-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-bd rounded-lg text-font-base hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-4 py-2 rounded-lg ${
              canSubmit
                ? 'bg-error text-white hover:bg-red-600'
                : 'bg-font-detail text-white cursor-not-allowed'
            }`}
          >
            <i className="fa-solid fa-exclamation-triangle mr-2"></i>
            Log Call Out
          </button>
        </div>
      </div>
    </div>
  );
}
