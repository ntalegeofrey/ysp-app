'use client';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-chart-line text-xl"></i>
            </div>
          </div>
          <p className="text-3xl font-bold text-font-heading mb-1">87%</p>
          <p className="text-sm text-font-detail">Overall Compliance</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-users text-xl"></i>
            </div>
          </div>
          <p className="text-3xl font-bold text-font-heading mb-1">156</p>
          <p className="text-sm text-font-detail">Active Residents</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-triangle-exclamation text-xl"></i>
            </div>
          </div>
          <p className="text-3xl font-bold text-font-heading mb-1">12</p>
          <p className="text-sm text-font-detail">Incidents This Month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-clock text-xl"></i>
            </div>
          </div>
          <p className="text-3xl font-bold text-font-heading mb-1">98%</p>
          <p className="text-sm text-font-detail">On-Time Tasks</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-font-heading mb-4">Incident Trends</h3>
          <div className="h-64 flex items-center justify-center bg-bg-subtle rounded-lg">
            <div className="text-center">
              <i className="fa-solid fa-chart-bar text-4xl text-font-detail mb-2"></i>
              <p className="text-font-detail">Chart visualization would appear here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-font-heading mb-4">Staff Performance</h3>
          <div className="h-64 flex items-center justify-center bg-bg-subtle rounded-lg">
            <div className="text-center">
              <i className="fa-solid fa-chart-pie text-4xl text-font-detail mb-2"></i>
              <p className="text-font-detail">Chart visualization would appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-font-heading mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-bd rounded-lg hover:bg-bg-subtle transition text-left">
            <i className="fa-solid fa-file-pdf text-error text-2xl mb-2"></i>
            <p className="font-medium text-font-base">Monthly Summary</p>
            <p className="text-sm text-font-detail">Download PDF report</p>
          </button>
          <button className="p-4 border border-bd rounded-lg hover:bg-bg-subtle transition text-left">
            <i className="fa-solid fa-file-excel text-success text-2xl mb-2"></i>
            <p className="font-medium text-font-base">Incident Log</p>
            <p className="text-sm text-font-detail">Export to Excel</p>
          </button>
          <button className="p-4 border border-bd rounded-lg hover:bg-bg-subtle transition text-left">
            <i className="fa-solid fa-file-lines text-primary text-2xl mb-2"></i>
            <p className="font-medium text-font-base">Staff Report</p>
            <p className="text-sm text-font-detail">Generate report</p>
          </button>
        </div>
      </div>
    </div>
  );
}
