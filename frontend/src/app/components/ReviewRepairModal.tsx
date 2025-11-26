'use client';

import { useState } from 'react';

interface ReviewRepairModalProps {
  repair: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (action: 'revoke' | 'affirm', comments: string) => Promise<void>;
}

export default function ReviewRepairModal({ repair, isOpen, onClose, onSubmit }: ReviewRepairModalProps) {
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !repair) return null;

  const handleAction = async (action: 'revoke' | 'affirm') => {
    setSubmitting(true);
    try {
      await onSubmit(action, comments);
      setComments('');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="bg-primary p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              <i className="fa-solid fa-gavel mr-2"></i>
              Review Repair Intervention
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-primary-lightest transition-colors"
            >
              <i className="fa-solid fa-times text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Repair Details */}
          <div className="bg-bg-subtle p-4 rounded-lg">
            <h3 className="font-semibold text-font-base mb-3">Repair Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-font-detail">Resident:</p>
                <p className="font-medium text-font-base">{repair.residentName}</p>
              </div>
              <div>
                <p className="text-font-detail">Repair Level:</p>
                <p className="font-medium text-font-base">{repair.repairLevel}</p>
              </div>
              <div>
                <p className="text-font-detail">Infraction Date:</p>
                <p className="font-medium text-font-base">
                  {new Date(repair.infractionDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-font-detail">Duration:</p>
                <p className="font-medium text-font-base">
                  {repair.repairDurationDays} {repair.repairDurationDays === 1 ? 'day' : 'days'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-font-detail">Behavior/Violation:</p>
                <p className="font-medium text-font-base">{repair.infractionBehavior}</p>
              </div>
            </div>
          </div>

          {/* Review Comments */}
          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              Review Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any notes about this review decision..."
              rows={4}
              className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-bd">
            <button
              onClick={() => handleAction('revoke')}
              disabled={submitting}
              className="bg-error text-white px-6 py-3 rounded-lg hover:bg-error/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-ban"></i>
              Revoke Repair
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                disabled={submitting}
                className="px-6 py-3 border border-bd rounded-lg hover:bg-bg-subtle transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction('affirm')}
                disabled={submitting}
                className="bg-success text-white px-6 py-3 rounded-lg hover:bg-success/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-check-circle"></i>
                Affirm Repair
              </button>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="bg-primary-lightest/20 px-6 py-4 rounded-b-lg text-sm text-font-detail">
          <div className="flex items-start gap-2">
            <i className="fa-solid fa-info-circle text-primary mt-0.5"></i>
            <div>
              <p><strong>Revoke:</strong> Removes resident from repair immediately. Diary card unlocks.</p>
              <p className="mt-1"><strong>Affirm:</strong> Keeps repair active as assigned.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
