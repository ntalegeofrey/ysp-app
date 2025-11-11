'use client';

import { useRouter } from 'next/navigation';

export default function UCRNotifyPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Notification sent successfully!');
    router.back();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Issue Summary */}
      <section className="bg-white rounded-lg border border-bd">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-error p-3 rounded-full">
              <i className="fa-solid fa-triangle-exclamation text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="bg-error text-white text-xs font-bold px-2 py-1 rounded-full mr-3">CRITICAL</span>
                <h3 className="text-lg font-semibold text-font-base">HVAC System Failure - North Wing</h3>
              </div>
              <p className="text-sm text-font-detail mb-2">Reported 3 times in the last 7 days. Temperature complaints increasing.</p>
              <p className="text-xs text-font-medium">Last reported: Today, 2:30 PM by J. Smith</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Form */}
      <section className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base">Supervisor Notification Form</h3>
          <p className="text-sm text-font-detail mt-1">This notification will be sent via email and push notification</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                <i className="fa-solid fa-user-tie mr-2 text-primary"></i>
                Notify Supervisor
              </label>
              <select className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                <option>Michael Rodriguez - Facility Manager</option>
                <option>Sarah Thompson - Assistant Director</option>
                <option>David Chen - Maintenance Supervisor</option>
                <option>Lisa Johnson - Program Director</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                <i className="fa-solid fa-flag mr-2 text-error"></i>
                Priority Level
              </label>
              <select className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" defaultValue="critical">
                <option value="critical">Critical - Immediate Action Required</option>
                <option value="high">High - Action Required Today</option>
                <option value="medium">Medium - Action Required This Week</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              <i className="fa-solid fa-tags mr-2 text-primary"></i>
              Issue Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['HVAC','Plumbing','Electrical','Security','Safety','Structural','Equipment','Other'].map((c) => (
                <label key={c} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="category" className="text-primary focus:ring-primary" defaultChecked={c==='HVAC'} />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              <i className="fa-solid fa-heading mr-2 text-primary"></i>
              Subject Line
            </label>
            <input
              type="text"
              defaultValue="CRITICAL: HVAC System Failure - North Wing - Immediate Action Required"
              className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              <i className="fa-solid fa-comment mr-2 text-primary"></i>
              Additional Comments & Details
            </label>
            <textarea rows={6} className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none" placeholder="Provide additional context, urgency details, affected areas, safety concerns, or specific actions needed..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-3">
              <i className="fa-solid fa-bell mr-2 text-primary"></i>
              Notification Preferences
            </label>
            <div className="space-y-3 text-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="text-primary focus:ring-primary rounded" />
                <span className="text-font-detail">Send email notification immediately</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="text-primary focus:ring-primary rounded" />
                <span className="text-font-detail">Send push notification to mobile device</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="text-primary focus:ring-primary rounded" />
                <span className="text-font-detail">Also notify Assistant Director</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="text-primary focus:ring-primary rounded" />
                <span className="text-font-detail">Create follow-up reminder in 2 hours if unacknowledged</span>
              </label>
            </div>
          </div>

          <div className="bg-primary-lightest p-4 rounded-lg text-sm">
            <h4 className="font-medium text-font-base mb-2">
              <i className="fa-solid fa-info-circle mr-2 text-primary"></i>
              Your Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-font-detail">Name:</span>
                <span className="font-medium text-font-base ml-2">John Smith</span>
              </div>
              <div>
                <span className="text-font-detail">Position:</span>
                <span className="font-medium text-font-base ml-2">Shift Supervisor</span>
              </div>
              <div>
                <span className="text-font-detail">Phone:</span>
                <span className="font-medium text-font-base ml-2">(617) 555-0123</span>
              </div>
              <div>
                <span className="text-font-detail">Current Shift:</span>
                <span className="font-medium text-font-base ml-2">Day Shift (7:00 AM - 3:00 PM)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-bd">
            <button type="button" onClick={() => router.back()} className="px-6 py-2 text-font-detail border border-bd rounded-lg hover:bg-bg-subtle transition-colors duration-200">
              <i className="fa-solid fa-times mr-2"></i>
              Cancel
            </button>
            <div className="flex gap-3">
              <button type="button" className="px-6 py-2 bg-primary-lighter text-font-base border border-bd rounded-lg hover:bg-primary-lightest transition-colors duration-200">
                <i className="fa-solid fa-eye mr-2"></i>
                Preview
              </button>
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors duration-200 font-medium">
                <i className="fa-solid fa-paper-plane mr-2"></i>
                Send Notification
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
