'use client';

import { useState } from 'react';

interface MandatoryForceModalProps {
  onClose: () => void;
}

export default function MandatoryForceModal({ onClose }: MandatoryForceModalProps) {
  const [formData, setFormData] = useState({
    shiftDate: '',
    shiftType: '',
    reason: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Mandatory Force Logged:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-bd p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-font-heading flex items-center">
              <i className="fa-solid fa-exclamation-triangle text-error mr-3"></i>
              Log Mandatory Force Assignment
            </h2>
            <p className="text-sm text-font-detail mt-1">
              Record when you are mandatorily forced to work additional hours
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-font-detail hover:text-font-base p-2"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-error-lightest border border-error rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <i className="fa-solid fa-info-circle text-error mr-3 mt-0.5 text-lg"></i>
              <div className="text-sm text-font-base">
                <div className="font-semibold text-font-heading mb-1">Important Notice</div>
                This form is for documenting when you have been mandatorily forced to work beyond your scheduled shift. 
                This will be logged and reviewed by management.
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-font-heading mb-2">
                Shift Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.shiftDate}
                onChange={(e) => setFormData({ ...formData, shiftDate: e.target.value })}
                className="w-full px-4 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-font-heading mb-2">
                Shift Type <span className="text-error">*</span>
              </label>
              <select
                required
                value={formData.shiftType}
                onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
                className="w-full px-4 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select shift type</option>
                <option value="DAY">Day Shift (7AM-3PM)</option>
                <option value="EVENING">Evening Shift (3PM-11PM)</option>
                <option value="NIGHT">Overnight Shift (11PM-7AM)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-font-heading mb-2">
                Reason for Force <span className="text-error">*</span>
              </label>
              <select
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select reason</option>
                <option value="STAFF_SHORTAGE">Critical Staff Shortage</option>
                <option value="CALL_OUT">Staff Call-Out Coverage</option>
                <option value="EMERGENCY">Emergency Situation</option>
                <option value="MANDATED_BY_SUPERVISOR">Mandated by Supervisor</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-font-heading mb-2">
                Additional Notes
              </label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Provide any additional context about this mandatory force assignment..."
                className="w-full px-4 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-font-detail mt-1">
                Include details such as who mandated the force, approximate notification time, etc.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-bd">
            <div className="bg-primary-lightest border border-primary rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <i className="fa-solid fa-shield-halved text-primary mr-3 mt-0.5"></i>
                <div className="text-sm text-font-base">
                  <div className="font-semibold text-font-heading mb-1">Your Rights</div>
                  Documentation of mandatory force assignments helps ensure compliance with labor regulations 
                  and protects your rights regarding maximum work hours and proper compensation.
                </div>
              </div>
            </div>

            <div className="flex space-x-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-bd rounded-lg text-font-base hover:bg-bg-subtle transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-error text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <i className="fa-solid fa-check mr-2"></i>
                Submit Force Log
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
