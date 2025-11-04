'use client';

import { useState } from 'react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'technical',
    priority: 'medium',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Support ticket submitted successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-lightest rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-headset text-primary text-3xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-font-heading">Contact Support</h2>
            <p className="text-font-detail">Get help with technical issues or questions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Subject *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus outline-none"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Category *</label>
              <select
                className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="technical">Technical Issue</option>
                <option value="account">Account</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Priority *</label>
              <select
                className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus outline-none"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-2">Description *</label>
            <textarea
              required
              rows={6}
              className="w-full px-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus outline-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Please describe your issue in detail..."
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition font-medium"
          >
            <i className="fa-solid fa-paper-plane mr-2"></i>
            Submit Ticket
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-font-heading mb-4">Quick Help</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-bd rounded-lg">
            <i className="fa-solid fa-book text-primary text-2xl mb-2"></i>
            <p className="font-medium text-font-base">Documentation</p>
            <p className="text-sm text-font-detail">Browse user guides</p>
          </div>
          <div className="p-4 border border-bd rounded-lg">
            <i className="fa-solid fa-video text-primary text-2xl mb-2"></i>
            <p className="font-medium text-font-base">Video Tutorials</p>
            <p className="text-sm text-font-detail">Watch how-to videos</p>
          </div>
          <div className="p-4 border border-bd rounded-lg">
            <i className="fa-solid fa-question-circle text-primary text-2xl mb-2"></i>
            <p className="font-medium text-font-base">FAQ</p>
            <p className="text-sm text-font-detail">Common questions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
