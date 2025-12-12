'use client';

interface ReviewRequestModalProps {
  request: any;
  onClose: () => void;
}

export default function ReviewRequestModal({ request, onClose }: ReviewRequestModalProps) {
  if (request.type === 'overtime') {
    const competingRequests = [
      { name: 'Rodriguez, Maria', position: 'JJYDS I', requestedAt: '2 hours ago', otHours: 12, reason: 'Voluntary pickup - need extra hours' },
      { name: 'Johnson, Kevin', position: 'JJYDS II', requestedAt: '5 hours ago', otHours: 8, reason: 'Can cover for staff on leave' },
      { name: 'Taylor, Marcus', position: 'JJYDS II', requestedAt: '1 day ago', otHours: 16, reason: 'Available for extra shift' },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-bd p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-font-heading">Overtime Request Review</h2>
                <p className="text-sm text-font-detail mt-1">{request.details}</p>
              </div>
              <button onClick={onClose} className="text-font-detail hover:text-font-base p-2">
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-primary-lightest border border-primary rounded-lg p-4">
              <div className="text-sm font-semibold text-font-heading mb-3">
                Transparent View - All Requests for This Slot
              </div>

              {competingRequests.map((req, idx) => (
                <div key={idx} className="bg-white border border-bd rounded-lg p-4 mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-font-base">
                        {idx + 1}. {req.name} ({req.position})
                      </div>
                      <div className="text-xs text-font-detail mt-1">
                        Requested: {req.requestedAt} | OT Hours this month: {req.otHours} hrs
                      </div>
                    </div>
                    {idx === 0 && (
                      <span className="bg-warning text-white px-2 py-1 rounded text-xs">First Request</span>
                    )}
                  </div>
                  <div className="text-sm text-font-detail mb-3">
                    Reason: "{req.reason}"
                  </div>
                  {req.otHours >= 16 && (
                    <div className="text-xs text-warning mb-2">
                      <i className="fa-solid fa-exclamation-triangle mr-1"></i>
                      Near OT hour limit this month
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <button className="bg-success text-white px-3 py-1 rounded text-xs hover:bg-primary-alt">
                      <i className="fa-solid fa-check mr-1"></i>
                      Approve & Assign
                    </button>
                    <button className="bg-error text-white px-3 py-1 rounded text-xs hover:bg-red-600">
                      <i className="fa-solid fa-times mr-1"></i>
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                Admin Decision Notes (Visible to approved staff)
              </label>
              <textarea
                className="w-full border border-bd-input rounded-lg p-3 text-sm"
                rows={3}
                placeholder="Add notes explaining your decision..."
              ></textarea>
            </div>

            <div className="bg-highlight-lightest border border-warning rounded-lg p-3">
              <div className="text-sm text-font-base">
                <i className="fa-solid fa-info-circle text-warning mr-2"></i>
                When you approve ONE request, others will be automatically denied with notification. 
                All staff can see who was approved for transparency.
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
            <button className="px-4 py-2 bg-error text-white rounded-lg hover:bg-red-600">
              Deny All
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
              Approve Selected
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-bd p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-font-heading">Time Off Request Review</h2>
              <p className="text-sm text-font-detail mt-1">{request.staff.name} - {request.details}</p>
            </div>
            <button onClick={onClose} className="text-font-detail hover:text-font-base p-2">
              <i className="fa-solid fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-semibold text-font-detail mb-2">REQUEST DETAILS</div>
              <div className="text-sm text-font-base space-y-1">
                <div><span className="font-medium">Type:</span> {request.subtype}</div>
                <div><span className="font-medium">Dates:</span> {request.details}</div>
                <div><span className="font-medium">Submitted:</span> {request.requestedAt}</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-font-detail mb-2">STAFF REASON</div>
              <div className="bg-bg-subtle border border-bd rounded p-3 text-sm text-font-base">
                "{request.reason}"
              </div>
            </div>
          </div>

          <div className="bg-primary-lightest border border-primary rounded-lg p-4">
            <div className="text-sm font-semibold text-font-heading mb-2">Schedule Impact</div>
            <div className="text-sm text-font-base space-y-1">
              <div>Assigned shifts during this period: 3 shifts</div>
              <div>Impact: {request.impact}</div>
              <div className="text-warning">
                <i className="fa-solid fa-exclamation-triangle mr-1"></i>
                Replacement staff will need to be assigned
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              Admin Comments
            </label>
            <textarea
              className="w-full border border-bd-input rounded-lg p-3 text-sm"
              rows={3}
              placeholder="Add comments for approval or denial..."
            ></textarea>
          </div>

          <div className="bg-highlight-lightest border border-warning rounded-lg p-3">
            <div className="text-sm text-font-base">
              <i className="fa-solid fa-info-circle text-warning mr-2"></i>
              Once approved, this request will be visible to all staff. Medical details remain private.
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
          <button className="px-4 py-2 bg-error text-white rounded-lg hover:bg-red-600">
            <i className="fa-solid fa-times mr-2"></i>
            Deny Request
          </button>
          <button className="px-4 py-2 bg-success text-white rounded-lg hover:bg-primary-alt">
            <i className="fa-solid fa-check mr-2"></i>
            Approve Request
          </button>
        </div>
      </div>
    </div>
  );
}
