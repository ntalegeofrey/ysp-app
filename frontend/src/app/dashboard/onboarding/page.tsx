'use client';

import { useState } from 'react';

export default function OnboardingPage() {
  const [activeTab, setActiveTab] = useState<'resident' | 'staff'>('resident');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(`${activeTab === 'resident' ? 'Resident' : 'Staff'} onboarding submitted successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-bd">
          <div className="flex">
            <button
              onClick={() => setActiveTab('resident')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'resident'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-font-detail hover:text-font-base'
              }`}
            >
              <i className="fa-solid fa-user mr-2"></i>
              Resident Onboarding
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'staff'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-font-detail hover:text-font-base'
              }`}
            >
              <i className="fa-solid fa-user-tie mr-2"></i>
              Staff Onboarding
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent outline-none"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent outline-none"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent outline-none"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent outline-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent outline-none"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent outline-none"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition font-medium"
              >
                <i className="fa-solid fa-check mr-2"></i>
                Submit Onboarding
              </button>
              <button
                type="button"
                className="px-6 py-3 bg-bg-subtle text-font-base rounded-lg hover:bg-bd transition font-medium"
              >
                <i className="fa-solid fa-times mr-2"></i>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
