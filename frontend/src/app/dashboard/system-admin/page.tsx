'use client';

export default function SystemAdminPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-font-heading mb-6">System Administration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-bd rounded-lg p-6 hover:shadow-md transition cursor-pointer">
            <div className="w-12 h-12 bg-primary-lightest rounded-lg flex items-center justify-center mb-4">
              <i className="fa-solid fa-users text-primary text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-font-heading mb-2">User Management</h3>
            <p className="text-sm text-font-detail">Manage user accounts and permissions</p>
          </div>

          <div className="border border-bd rounded-lg p-6 hover:shadow-md transition cursor-pointer">
            <div className="w-12 h-12 bg-primary-lightest rounded-lg flex items-center justify-center mb-4">
              <i className="fa-solid fa-shield text-primary text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-font-heading mb-2">Security Settings</h3>
            <p className="text-sm text-font-detail">Configure security and access controls</p>
          </div>

          <div className="border border-bd rounded-lg p-6 hover:shadow-md transition cursor-pointer">
            <div className="w-12 h-12 bg-primary-lightest rounded-lg flex items-center justify-center mb-4">
              <i className="fa-solid fa-database text-primary text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-font-heading mb-2">Database Management</h3>
            <p className="text-sm text-font-detail">Backup and restore data</p>
          </div>

          <div className="border border-bd rounded-lg p-6 hover:shadow-md transition cursor-pointer">
            <div className="w-12 h-12 bg-primary-lightest rounded-lg flex items-center justify-center mb-4">
              <i className="fa-solid fa-bell text-primary text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-font-heading mb-2">Notifications</h3>
            <p className="text-sm text-font-detail">Configure system notifications</p>
          </div>

          <div className="border border-bd rounded-lg p-6 hover:shadow-md transition cursor-pointer">
            <div className="w-12 h-12 bg-primary-lightest rounded-lg flex items-center justify-center mb-4">
              <i className="fa-solid fa-chart-line text-primary text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-font-heading mb-2">System Logs</h3>
            <p className="text-sm text-font-detail">View system activity logs</p>
          </div>

          <div className="border border-bd rounded-lg p-6 hover:shadow-md transition cursor-pointer">
            <div className="w-12 h-12 bg-primary-lightest rounded-lg flex items-center justify-center mb-4">
              <i className="fa-solid fa-cog text-primary text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-font-heading mb-2">General Settings</h3>
            <p className="text-sm text-font-detail">Configure system preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
}
