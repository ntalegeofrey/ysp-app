'use client';

import { useState } from 'react';

interface RequestTimeOffModalProps {
  onClose: () => void;
}

export default function RequestTimeOffModal({ onClose }: RequestTimeOffModalProps) {
  const [leaveType, setLeaveType] = useState('vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = () => {
    alert('Time Off Request submitted! (Backend integration pending)');
    onClose();
  };

  const scheduledShifts = [
    'Nov 25 (Mon) - Day Shift 7AM-3PM',
    'Nov 27 (Wed) - Evening 3PM-11PM',
    'Nov 28 (Thu) - Day Shift 7AM-3PM',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-bd p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-font-heading">Request Time Off</h2>
              <p className="text-sm text-font-detail mt-1">Your available leave balance: 15 days</p>
            </div>
            <button onClick={onClose} className="text-font-detail hover:text-font-base p-2">
              <i className="fa-solid fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              Leave Type
              <span className="text-error ml-1">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLeaveType('vacation')}
                className={`p-3 border rounded-lg text-sm ${
                  leaveType === 'vacation'
                    ? 'border-primary bg-primary-lightest text-font-base'
                    : 'border-bd text-font-detail hover:border-primary-light'
                }`}
              >
                <i className="fa-solid fa-umbrella-beach mr-2"></i>
                Vacation / Annual Leave
              </button>
              <button
                onClick={() => setLeaveType('sick')}
                className={`p-3 border rounded-lg text-sm ${
                  leaveType === 'sick'
                    ? 'border-primary bg-primary-lightest text-font-base'
                    : 'border-bd text-font-detail hover:border-primary-light'
                }`}
              >
                <i className="fa-solid fa-notes-medical mr-2"></i>
                Sick Leave / Medical
              </button>
              <button
                onClick={() => setLeaveType('personal')}
                className={`p-3 border rounded-lg text-sm ${
                  leaveType === 'personal'
                    ? 'border-primary bg-primary-lightest text-font-base'
                    : 'border-bd text-font-detail hover:border-primary-light'
                }`}
              >
                <i className="fa-solid fa-user mr-2"></i>
                Personal Leave
              </button>
              <button
                onClick={() => setLeaveType('emergency')}
                className={`p-3 border rounded-lg text-sm ${
                  leaveType === 'emergency'
                    ? 'border-primary bg-primary-lightest text-font-base'
                    : 'border-bd text-font-detail hover:border-primary-light'
                }`}
              >
                <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                Emergency / Family
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

          {startDate && endDate && (
            <div className="bg-primary-lightest border border-primary rounded-lg p-3">
              <div className="text-sm font-medium text-font-base">
                Total Days: {calculateDays()} days
              </div>
            </div>
          )}

          {startDate && endDate && scheduledShifts.length > 0 && (
            <div className="bg-warning-lightest border border-warning rounded-lg p-4">
              <div className="text-sm font-semibold text-font-heading mb-2">
                <i className="fa-solid fa-exclamation-triangle text-warning mr-2"></i>
                Schedule Impact Check
              </div>
              <div className="text-sm text-font-base mb-2">
                You are scheduled for these shifts in this period:
              </div>
              <div className="space-y-1 text-sm text-font-detail">
                {scheduledShifts.map((shift, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="w-2 h-2 bg-error rounded-full mr-2"></span>
                    {shift}
                  </div>
                ))}
              </div>
              <div className="text-sm text-warning font-medium mt-2">
                Your absence will require 3 replacement shifts
              </div>
            </div>
          )}

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
              placeholder="Provide detailed reason for your time off request..."
            ></textarea>
          </div>

          {leaveType === 'sick' && (
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                Attach Documentation (if applicable)
              </label>
              <div className="border-2 border-dashed border-bd-input rounded-lg p-6 text-center hover:bg-bg-subtle cursor-pointer">
                <i className="fa-solid fa-upload text-font-detail text-2xl mb-2"></i>
                <div className="text-sm text-font-detail">
                  Click to upload or drag and drop
                </div>
                <div className="text-xs text-font-detail mt-1">
                  Doctor's note, medical certificate, etc.
                </div>
              </div>
            </div>
          )}

          <div className="bg-highlight-lightest border border-warning rounded-lg p-4">
            <div className="text-sm font-semibold text-font-heading mb-2">
              Transparency Information
            </div>
            <div className="text-sm text-font-detail space-y-1">
              <div className="flex items-center">
                <i className="fa-solid fa-eye text-primary mr-2"></i>
                Your request will be visible to other staff (basic info)
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-shield-alt text-success mr-2"></i>
                Medical details remain private
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-clock text-warning mr-2"></i>
                Expected review time: 48 hours
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-calendar-xmark text-font-medium mr-2"></i>
                Once approved, your name shows "On Leave" in schedule
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
            disabled={!startDate || !endDate || !reason.trim()}
            className={`px-4 py-2 rounded-lg ${
              startDate && endDate && reason.trim()
                ? 'bg-primary text-white hover:bg-primary-light'
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
