'use client';

import { useRouter } from 'next/navigation';

export default function RefillRequestPage() {
  const router = useRouter();

  const handleBack = () => router.back();
  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this request? Any unsaved changes will be lost.')) {
      router.back();
    }
  };
  const handleSaveDraft = () => {
    alert('Request saved as draft successfully!');
  };
  const handleSend = () => {
    if (confirm('Are you sure you want to send this refill request? The responsible person will be notified immediately.')) {
      alert('Refill request sent successfully! Sarah Wilson (Procurement Manager) has been notified.');
      setTimeout(() => router.back(), 800);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Request Summary */}
      <section id="request-summary" className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-font-heading">Refill Request Summary</h3>
            <div className="flex items-center space-x-2">
              <div className="bg-error-lightest text-error px-3 py-1 rounded-full text-sm font-medium">
                <i className="fa-solid fa-exclamation-triangle mr-2"></i>Critical Priority
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
            <div className="bg-bg-subtle p-4 rounded-lg">
              <h4 className="text-sm font-medium text-font-detail mb-2">Request ID</h4>
              <p className="text-lg font-bold text-font-base">#RR-2024-0127</p>
            </div>
            <div className="bg-bg-subtle p-4 rounded-lg">
              <h4 className="text-sm font-medium text-font-detail mb-2">Created By</h4>
              <p className="text-lg font-bold text-font-base">John Smith</p>
              <p className="text-sm text-font-detail">Shift Supervisor</p>
            </div>
            <div className="bg-bg-subtle p-4 rounded-lg">
              <h4 className="text-sm font-medium text-font-detail mb-2">Date Created</h4>
              <p className="text-lg font-bold text-font-base">Jan 27, 2024</p>
              <p className="text-sm text-font-detail">2:34 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Items to Reorder */}
      <section id="items-section" className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-heading">Items to Reorder</h3>
          <p className="text-sm text-font-detail mt-1">Review and modify quantities as needed</p>
        </div>
        <div className="p-6 space-y-4">
          {/* Critical Item */}
          <div className="bg-error-lightest border border-error rounded-lg p-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <i className="fa-solid fa-exclamation-circle text-error mr-2"></i>
                <h4 className="font-semibold text-font-base">Toothpaste - Colgate</h4>
                <span className="bg-error text-white px-2 py-1 rounded text-xs ml-3">Critical</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-font-detail">Current Stock:</span>
                  <span className="font-medium text-error ml-2">2 units</span>
                </div>
                <div>
                  <span className="text-font-detail">Min. Threshold:</span>
                  <span className="font-medium text-font-base ml-2">15 units</span>
                </div>
                <div>
                  <span className="text-font-detail">Location:</span>
                  <span className="font-medium text-font-base ml-2">Shelf A-2</span>
                </div>
                <div>
                  <span className="text-font-detail">Category:</span>
                  <span className="font-medium text-font-base ml-2">Toiletries</span>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-font-base mb-2">Suggested Quantity to Order:</label>
                <div className="flex items-center space-x-3">
                  <input type="number" defaultValue={50} className="border border-bd-input rounded-lg px-3 py-2 w-24 text-center" />
                  <span className="text-sm text-font-detail">units (Recommended: 50 for 30-day supply)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Item */}
          <div className="bg-highlight-lightest border border-highlight rounded-lg p-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <i className="fa-solid fa-exclamation-triangle text-warning mr-2"></i>
                <h4 className="font-semibold text-font-base">Breakfast Cereal</h4>
                <span className="bg-highlight text-white px-2 py-1 rounded text-xs ml-3">Low Stock</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-font-detail">Current Stock:</span>
                  <span className="font-medium text-warning ml-2">8 units</span>
                </div>
                <div>
                  <span className="text-font-detail">Min. Threshold:</span>
                  <span className="font-medium text-font-base ml-2">20 units</span>
                </div>
                <div>
                  <span className="text-font-detail">Location:</span>
                  <span className="font-medium text-font-base ml-2">Pantry B-1</span>
                </div>
                <div>
                  <span className="text-font-detail">Category:</span>
                  <span className="font-medium text-font-base ml-2">Food</span>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-font-base mb-2">Suggested Quantity to Order:</label>
                <div className="flex items-center space-x-3">
                  <input type="number" defaultValue={30} className="border border-bd-input rounded-lg px-3 py-2 w-24 text-center" />
                  <span className="text-sm text-font-detail">units (Recommended: 30 for 30-day supply)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Item */}
          <div className="bg-primary-lightest border border-primary-lighter rounded-lg p-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <i className="fa-solid fa-info-circle text-primary mr-2"></i>
                <h4 className="font-semibold text-font-base">Hand Soap</h4>
                <span className="bg-primary text-white px-2 py-1 rounded text-xs ml-3">Preventive Order</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-font-detail">Current Stock:</span>
                  <span className="font-medium text-font-base ml-2">18 units</span>
                </div>
                <div>
                  <span className="text-font-detail">Min. Threshold:</span>
                  <span className="font-medium text-font-base ml-2">15 units</span>
                </div>
                <div>
                  <span className="text-font-detail">Location:</span>
                  <span className="font-medium text-font-base ml-2">Shelf A-3</span>
                </div>
                <div>
                  <span className="text-font-detail">Category:</span>
                  <span className="font-medium text-font-base ml-2">Toiletries</span>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-font-base mb-2">Suggested Quantity to Order:</label>
                <div className="flex items-center space-x-3">
                  <input type="number" defaultValue={25} className="border border-bd-input rounded-lg px-3 py-2 w-24 text-center" />
                  <span className="text-sm text-font-detail">units (Recommended: 25 for 30-day supply)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Request Details */}
      <section id="request-details" className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-heading">Request Details</h3>
        </div>
        <div className="p-6">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Priority Level</label>
                <select className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-focus focus:border-transparent">
                  <option value="critical">Critical - Immediate Action Required</option>
                  <option value="high">High - Within 24 Hours</option>
                  <option value="medium">Medium - Within 3 Days</option>
                  <option value="low">Low - Within 1 Week</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Notify</label>
                <select className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-focus focus:border-transparent">
                  <option>Procurement Manager - Sarah Wilson</option>
                  <option>Facility Administrator - Michael Davis</option>
                  <option>Supply Chain Coordinator - Lisa Chen</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Additional Notes</label>
              <textarea rows={4} className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-focus focus:border-transparent" defaultValue="Critical shortage of toothpaste affecting daily operations. Residents are currently sharing limited supplies. Request expedited delivery if possible."></textarea>
            </div>
            <div className="bg-bg-subtle p-4 rounded-lg">
              <h4 className="font-medium text-font-base mb-3">Delivery Preferences</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Preferred Delivery Date</label>
                  <input type="date" defaultValue="2024-01-29" className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-focus focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Delivery Time Window</label>
                  <select className="w-full border border-bd-input rounded-lg px-3 py-2 focus:ring-2 ring-focus focus:border-transparent">
                    <option>Morning (8:00 AM - 12:00 PM)</option>
                    <option>Afternoon (12:00 PM - 5:00 PM)</option>
                    <option>Any Time</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Action Buttons */}
      <div id="action-buttons" className="flex justify-between items-center py-2">
        <button onClick={handleSaveDraft} className="bg-bg-subtle text-font-base px-6 py-3 rounded-lg font-medium border border-bd hover:bg-primary-lightest">
          <i className="fa-solid fa-save mr-2"></i>Save as Draft
        </button>
        <div className="flex space-x-4">
          <button onClick={handleCancel} className="bg-white text-font-detail px-6 py-3 rounded-lg font-medium border border-bd hover:bg-bg-subtle">
            Cancel
          </button>
          <button onClick={handleSend} className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-light shadow-lg">
            <i className="fa-solid fa-paper-plane mr-2"></i>Send Request
          </button>
        </div>
      </div>
    </div>
  );
}

