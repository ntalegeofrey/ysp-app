'use client';

import { useState } from 'react';

interface RequestOvertimeModalProps {
  onClose: () => void;
}

export default function RequestOvertimeModal({ onClose }: RequestOvertimeModalProps) {
  const [selectedShift, setSelectedShift] = useState('');
  const [reason, setReason] = useState('');

  const availableShifts = [
    { id: '1', date: 'Nov 22 (Friday)', shift: 'Day 7AM-3PM', position: 'JJYDS II', requests: 1 },
    { id: '2', date: 'Nov 25 (Monday)', shift: 'Overnight 11PM-7AM', position: 'JJYDS I/II', requests: 0 },
    { id: '3', date: 'Nov 27 (Wednesday)', shift: 'Evening 3PM-11PM', position: 'JJYDS I', requests: 2 },
  ];

  const handleSubmit = () => {
    alert('OT Request submitted! (Backend integration pending)');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-bd p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-font-heading">Request Overtime Shift</h2>
              <p className="text-sm text-font-detail mt-1">Select an available overtime opportunity</p>
            </div>
            <button onClick={onClose} className="text-font-detail hover:text-font-base p-2">
              <i className="fa-solid fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-font-base mb-3">
              Select Available Shift
            </label>
            <div className="space-y-2">
              {availableShifts.map((shift) => (
                <div
                  key={shift.id}
                  onClick={() => setSelectedShift(shift.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedShift === shift.id
                      ? 'border-primary bg-primary-lightest'
                      : 'border-bd hover:border-primary-light'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-font-base">
                        {shift.date} - {shift.shift}
                      </div>
                      <div className="text-xs text-font-detail mt-1">
                        Position: {shift.position}
                      </div>
                    </div>
                    <div className="text-xs text-font-detail">
                      Current requests: {shift.requests}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedShift && (
            <>
              <div className="bg-primary-lightest border border-primary rounded-lg p-4">
                <div className="text-sm font-semibold text-font-heading mb-2">
                  Transparency Information
                </div>
                <div className="text-sm text-font-detail space-y-1">
                  <div className="flex items-center">
                    <i className="fa-solid fa-check-circle text-success mr-2"></i>
                    You are qualified for this position
                  </div>
                  <div className="flex items-center">
                    <i className="fa-solid fa-check-circle text-success mr-2"></i>
                    Your OT hours: 12 hrs (within limit)
                  </div>
                  <div className="flex items-center">
                    <i className="fa-solid fa-info-circle text-primary mr-2"></i>
                    Your request will be visible to all staff
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  Reason for Request
                  <span className="text-error ml-1">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-bd-input rounded-lg p-3 text-sm"
                  rows={4}
                  placeholder="Provide reason for requesting this overtime shift (visible to admins)..."
                ></textarea>
                <div className="text-xs text-font-detail mt-2">
                  Examples: "Need extra hours", "Can cover shortage", "Available and willing"
                </div>
              </div>

              <div className="bg-highlight-lightest border border-warning rounded-lg p-4">
                <div className="text-sm font-semibold text-font-heading mb-2">
                  What Happens Next
                </div>
                <div className="text-sm text-font-detail space-y-1">
                  <div>1. Your request goes to admin queue</div>
                  <div>2. All staff can see you requested (transparent)</div>
                  <div>3. Admin reviews within 24 hours</div>
                  <div>4. You get notification of approval/denial</div>
                  <div>5. If approved, shift appears on your schedule</div>
                </div>
              </div>

              <div className="bg-bg-subtle border border-bd rounded-lg p-4">
                <div className="text-xs text-font-detail">
                  <div className="font-medium text-font-base mb-2">Note:</div>
                  Admin may approve another staff based on:
                  <ul className="list-disc list-inside mt-1 space-y-1 ml-2">
                    <li>Who requested first</li>
                    <li>Current OT hours</li>
                    <li>Qualification level</li>
                    <li>Scheduling needs</li>
                  </ul>
                </div>
              </div>
            </>
          )}
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
            disabled={!selectedShift || !reason.trim()}
            className={`px-4 py-2 rounded-lg ${
              selectedShift && reason.trim()
                ? 'bg-success text-white hover:bg-primary-alt'
                : 'bg-font-detail text-white cursor-not-allowed'
            }`}
          >
            <i className="fa-solid fa-paper-plane mr-2"></i>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
