'use client';

import { useState } from 'react';

export default function StaffManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const staffMembers = [
    { id: 1, name: 'John Doe', role: 'Supervisor', email: 'john.doe@mass.gov', phone: '(617) 555-0101', status: 'active', shift: 'Day' },
    { id: 2, name: 'Jane Smith', role: 'Counselor', email: 'jane.smith@mass.gov', phone: '(617) 555-0102', status: 'active', shift: 'Evening' },
    { id: 3, name: 'Mike Johnson', role: 'Security', email: 'mike.j@mass.gov', phone: '(617) 555-0103', status: 'active', shift: 'Night' },
    { id: 4, name: 'Sarah Williams', role: 'Nurse', email: 'sarah.w@mass.gov', phone: '(617) 555-0104', status: 'active', shift: 'Day' },
    { id: 5, name: 'Tom Brown', role: 'Administrator', email: 'tom.b@mass.gov', phone: '(617) 555-0105', status: 'on-leave', shift: 'Day' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-font-detail">Manage staff members and their roles</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition flex items-center gap-2">
          <i className="fa-solid fa-plus"></i>
          Add Staff Member
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-font-detail"></i>
            <input
              type="text"
              placeholder="Search staff members..."
              className="w-full pl-10 pr-4 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 border border-bd-input rounded-lg hover:bg-bg-subtle flex items-center gap-2">
            <i className="fa-solid fa-filter"></i>
            Filter
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-subtle">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">Shift</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-bd">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-bg-subtle">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium mr-3">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="font-medium text-font-base">{staff.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-font-detail">{staff.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-font-detail">{staff.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-font-detail">{staff.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-font-detail">{staff.shift}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      staff.status === 'active' ? 'bg-success-lightest text-success' : 'bg-warning-lightest text-warning'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-primary hover:text-primary-light mr-3">
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <button className="text-error hover:text-red-700">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
