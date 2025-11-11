'use client';

export default function SystemAdminPage() {
  return (
    <div className="space-y-8">
      {/* Overview cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-users text-primary text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-primary">24</p>
              <p className="text-sm text-font-detail">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-user-shield text-success text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-success">8</p>
              <p className="text-sm text-font-detail">Active Roles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-lock text-warning text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-warning">156</p>
              <p className="text-sm text-font-detail">Permissions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-clock text-error text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-error">3</p>
              <p className="text-sm text-font-detail">Pending Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Management */}
      <div className="bg-white rounded-lg border border-bd mb-2">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-user-shield text-primary mr-3"></i>
                Role Management
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Define user roles and their access permissions across all modules
              </div>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
              <i className="fa-solid fa-plus mr-2"></i>
              Create New Role
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-primary-lightest border border-primary rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-primary">Administrator</h4>
                <div className="flex space-x-2">
                  <button className="text-primary hover:text-primary-light text-sm">
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
              <p className="text-sm text-font-detail mb-3">Full system access and configuration rights</p>
              <div className="text-xs text-font-detail">
                <strong>Users:</strong> 2 | <strong>Modules:</strong> All | <strong>Permissions:</strong> Full
              </div>
            </div>

            <div className="bg-success-lightest border border-success rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-success">Shift Supervisor</h4>
                <div className="flex space-x-2">
                  <button className="text-primary hover:text-primary-light text-sm">
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
              <p className="text-sm text-font-detail mb-3">Operational oversight and unit management</p>
              <div className="text-xs text-font-detail">
                <strong>Users:</strong> 6 | <strong>Modules:</strong> 10 | <strong>Permissions:</strong> Supervisor
              </div>
            </div>

            <div className="bg-warning-lightest border border-warning rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-warning">JJYDS III</h4>
                <div className="flex space-x-2">
                  <button className="text-primary hover:text-primary-light text-sm">
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
              <p className="text-sm text-font-detail mb-3">Senior youth development specialist</p>
              <div className="text-xs text-font-detail">
                <strong>Users:</strong> 4 | <strong>Modules:</strong> 8 | <strong>Permissions:</strong> Standard+
              </div>
            </div>

            <div className="bg-highlight-lightest border border-highlight rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-highlight">Clinical Staff</h4>
                <div className="flex space-x-2">
                  <button className="text-primary hover:text-primary-light text-sm">
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
              <p className="text-sm text-font-detail mb-3">Medical and behavioral health specialists</p>
              <div className="text-xs text-font-detail">
                <strong>Users:</strong> 3 | <strong>Modules:</strong> 6 | <strong>Permissions:</strong> Clinical
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-bd">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Role Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Users Count</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Last Modified</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bd">
                <tr className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-font-base">JJYDS II</td>
                  <td className="px-4 py-3 text-sm">Youth development specialist</td>
                  <td className="px-4 py-3 text-sm">5</td>
                  <td className="px-4 py-3 text-sm">Nov 15, 2024</td>
                  <td className="px-4 py-3">
                    <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary-light text-sm mr-2">
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <button className="text-error hover:text-red-700 text-sm">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-font-base">JJYDS I</td>
                  <td className="px-4 py-3 text-sm">Entry-level youth specialist</td>
                  <td className="px-4 py-3 text-sm">4</td>
                  <td className="px-4 py-3 text-sm">Nov 12, 2024</td>
                  <td className="px-4 py-3">
                    <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary-light text-sm mr-2">
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <button className="text-error hover:text-red-700 text-sm">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Super User Management */}
      <div className="bg-white rounded-lg border border-bd mb-2">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-user-crown text-primary mr-3"></i>
                Super User Management
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Manage super users who can onboard and manage other staff members
              </div>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
              <i className="fa-solid fa-plus mr-2"></i>
              Add Super User
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-primary-lightest border border-primary rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <i className="fa-solid fa-crown text-primary mr-2"></i>
                  <h4 className="font-semibold text-primary">Sarah Wilson</h4>
                </div>
                <div className="flex space-x-2">
                  <button className="text-primary hover:text-primary-light text-sm">
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
              <div className="text-sm text-font-detail space-y-1">
                <p><strong>Email:</strong> sarah.wilson@mass.gov</p>
                <p><strong>Employee ID:</strong> EMP-2024-001</p>
                <p><strong>Title:</strong> System Administrator</p>
                <p><strong>Last Login:</strong> Nov 18, 2024 - 8:30 AM</p>
              </div>
            </div>

            <div className="bg-primary-lightest border border-primary rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <i className="fa-solid fa-crown text-primary mr-2"></i>
                  <h4 className="font-semibold text-primary">Michael Chen</h4>
                </div>
                <div className="flex space-x-2">
                  <button className="text-primary hover:text-primary-light text-sm">
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
              <div className="text-sm text-font-detail space-y-1">
                <p><strong>Email:</strong> michael.chen@mass.gov</p>
                <p><strong>Employee ID:</strong> EMP-2024-002</p>
                <p><strong>Title:</strong> IT Director</p>
                <p><strong>Last Login:</strong> Nov 17, 2024 - 4:15 PM</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-bd rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-font-base mb-3 flex items-center">
              <i className="fa-solid fa-user-plus text-primary mr-2"></i>
              Add New Super User
            </h4>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Full Name</label>
                <input type="text" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Government Email</label>
                <input type="email" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="username@mass.gov" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Employee Number</label>
                <input type="text" className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="EMP-2024-XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Job Title</label>
                <select className="w-full px-3 py-2 border border-bd rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>Select job title</option>
                  <option>System Administrator</option>
                  <option>IT Director</option>
                  <option>Facility Manager</option>
                  <option>Operations Director</option>
                  <option>Security Administrator</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-font-base mb-2">Access Level</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="access_level" value="full" className="mr-2 text-primary" />
                    <span className="text-sm">Full System Access</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="access_level" value="staff_management" className="mr-2 text-primary" />
                    <span className="text-sm">Staff Management Only</span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end space-x-3">
                <button type="button" className="px-4 py-2 border border-bd rounded-lg text-font-detail hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                  <i className="fa-solid fa-plus mr-2"></i>
                  Add Super User
                </button>
              </div>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-bd">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Employee ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Job Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Access Level</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Last Login</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bd">
                <tr className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-font-base">David Rodriguez</td>
                  <td className="px-4 py-3 text-sm">david.rodriguez@mass.gov</td>
                  <td className="px-4 py-3 text-sm">EMP-2024-003</td>
                  <td className="px-4 py-3 text-sm">Facility Manager</td>
                  <td className="px-4 py-3 text-sm">Full System</td>
                  <td className="px-4 py-3 text-sm">Nov 18, 2024</td>
                  <td className="px-4 py-3">
                    <span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary-light text-sm mr-2">
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <button className="text-error hover:text-red-700 text-sm">
                      <i className="fa-solid fa-user-slash"></i>
                    </button>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-font-base">Jennifer Park</td>
                  <td className="px-4 py-3 text-sm">jennifer.park@mass.gov</td>
                  <td className="px-4 py-3 text-sm">EMP-2024-004</td>
                  <td className="px-4 py-3 text-sm">Operations Director</td>
                  <td className="px-4 py-3 text-sm">Staff Management</td>
                  <td className="px-4 py-3 text-sm">Nov 16, 2024</td>
                  <td className="px-4 py-3">
                    <span className="bg-warning text-white px-2 py-1 rounded text-xs">Pending</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary-light text-sm mr-2">
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <button className="text-success hover:text-green-700 text-sm mr-2">
                      <i className="fa-solid fa-check"></i>
                    </button>
                    <button className="text-error hover:text-red-700 text-sm">
                      <i className="fa-solid fa-times"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base flex items-center">
            <i className="fa-solid fa-lock text-primary mr-3"></i>
            Module Permissions Matrix
          </h3>
          <div className="mt-2 text-sm text-font-detail">
            Configure access permissions for each role across all system modules
          </div>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full border border-bd text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-2 text-left">Module</th>
                <th className="px-3 py-2 text-center">Admin</th>
                <th className="px-3 py-2 text-center">Supervisor</th>
                <th className="px-3 py-2 text-center">JJYDS III</th>
                <th className="px-3 py-2 text-center">JJYDS II</th>
                <th className="px-3 py-2 text-center">JJYDS I</th>
                <th className="px-3 py-2 text-center">Clinical</th>
                <th className="px-3 py-2 text-center">Caseworker</th>
                <th className="px-3 py-2 text-center">Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bd">
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Inventory Management</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-error text-white px-2 py-1 rounded text-xs">None</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-error text-white px-2 py-1 rounded text-xs">None</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Resident Behavior</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Unit Condition (UCR)</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Sleep Log & Watch</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-error text-white px-2 py-1 rounded text-xs">None</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Log Book & Events</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Incident Management</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-error text-white px-2 py-1 rounded text-xs">None</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Fire Plan Management</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Medication (eMAR)</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Medical Runs</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Visitation & Phone</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Staff Management</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">Analytics & Reports</td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Edit</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-success text-white px-2 py-1 rounded text-xs">Full</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
                <td className="px-3 py-2 text-center"><span className="bg-primary text-white px-2 py-1 rounded text-xs">View</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
