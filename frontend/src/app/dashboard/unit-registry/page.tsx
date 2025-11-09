'use client';

import { useState } from 'react';

export default function OnboardingPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div id="management-main" className="flex-1 p-6 overflow-auto">
      <div id="overview-stats" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-users text-primary text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-primary">15</p>
              <p className="text-sm text-font-detail">Active Residents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-user-tie text-success text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-success">24</p>
              <p className="text-sm text-font-detail">Active Staff</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-bd p-6">
          <div className="flex items-center">
            <i className="fa-solid fa-user-slash text-warning text-2xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold text-warning">3</p>
              <p className="text-sm text-font-detail">Temporary Location</p>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Tab Navigation --> */}
      <div className="bg-white rounded-lg border border-bd mb-8">
        <div className="border-b border-bd">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              id="tab-overview"
              className={`flex items-center py-4 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-font-detail hover:text-font-base'
              }`}
            >
              <i
                className={`fa-solid fa-chart-pie mr-2 ${
                  activeTab === 'overview' ? 'text-primary' : 'text-font-detail'
                }`}
              ></i>
              Overview
            </button>
            <button
              onClick={() => setActiveTab('residents')}
              id="tab-residents"
              className={`flex items-center py-4 text-sm font-medium border-b-2 ${
                activeTab === 'residents'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-font-detail hover:text-font-base'
              }`}
            >
              <i
                className={`fa-solid fa-chart-pie mr-2 ${
                  activeTab === 'residents' ? 'text-primary' : 'text-font-detail'
                }`}
              ></i>
              Resident Management
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              id="tab-staff"
              className={`flex items-center py-4 text-sm font-medium border-b-2 ${
                activeTab === 'staff'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-font-detail hover:text-font-base'
              }`}
            >
              <i
                className={`fa-solid fa-chart-pie mr-2 ${
                  activeTab === 'staff' ? 'text-primary' : 'text-font-detail'
                }`}
              ></i>
              Staff Management
            </button>
          </nav>
        </div>

        {/* <!-- Overview Tab Content --> */}
        {activeTab === 'overview' && (
          <div id="overview-content" className="p-6">
            <div id="active-residents-table" className="mb-8">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-font-base flex items-center">
                      <i className="fa-solid fa-users text-primary mr-3"></i>
                      Active Residents
                    </h3>
                    <p className="text-sm text-font-detail mt-1">
                      Currently active residents in the facility
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="bg-warning text-white px-4 py-2 rounded-lg hover:bg-yellow-500 text-sm">
                      <i className="fa-solid fa-archive mr-2"></i>
                      View Inactive
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border border-bd">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Room</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Advocate</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Admission Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bd">
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-font-base">
                        Johnson, Marcus
                      </td>
                      <td className="px-4 py-3 text-sm">RES-001</td>
                      <td className="px-4 py-3 text-sm">101</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-success text-white text-xs rounded-full">
                          General Population
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">Davis, L.</td>
                      <td className="px-4 py-3 text-sm">Nov 10, 2024</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-primary hover:text-primary-light mr-2">
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button className="text-warning hover:text-yellow-500">
                          <i className="fa-solid fa-archive"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-font-base">
                        Williams, Tyler
                      </td>
                      <td className="px-4 py-3 text-sm">RES-002</td>
                      <td className="px-4 py-3 text-sm">102</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                          Team Leader
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">Wilson, M.</td>
                      <td className="px-4 py-3 text-sm">Nov 08, 2024</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-primary hover:text-primary-light mr-2">
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button className="text-warning hover:text-yellow-500">
                          <i className="fa-solid fa-archive"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-font-base">
                        Brown, Jaylen
                      </td>
                      <td className="px-4 py-3 text-sm">RES-003</td>
                      <td className="px-4 py-3 text-sm">103</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-warning text-white text-xs rounded-full">
                          ALOYO
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">Brown, P.</td>
                      <td className="px-4 py-3 text-sm">Nov 05, 2024</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-primary hover:text-primary-light mr-2">
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button className="text-warning hover:text-yellow-500">
                          <i className="fa-solid fa-archive"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-font-base">
                        Davis, Cameron
                      </td>
                      <td className="px-4 py-3 text-sm">RES-004</td>
                      <td className="px-4 py-3 text-sm">104</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-success text-white text-xs rounded-full">
                          General Population
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">Martinez, R.</td>
                      <td className="px-4 py-3 text-sm">Nov 03, 2024</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-primary hover:text-primary-light mr-2">
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button className="text-warning hover:text-yellow-500">
                          <i className="fa-solid fa-archive"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-font-base">
                        Rodriguez, Alex
                      </td>
                      <td className="px-4 py-3 text-sm">RES-005</td>
                      <td className="px-4 py-3 text-sm">105</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-error text-white text-xs rounded-full">
                          Restricted
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">Davis, L.</td>
                      <td className="px-4 py-3 text-sm">Oct 28, 2024</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-primary hover:text-primary-light mr-2">
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button className="text-warning hover:text-yellow-500">
                          <i className="fa-solid fa-archive"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-font-base">
                        Thompson, Jordan
                      </td>
                      <td className="px-4 py-3 text-sm">RES-006</td>
                      <td className="px-4 py-3 text-sm">106</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-success text-white text-xs rounded-full">
                          General Population
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">Wilson, M.</td>
                      <td className="px-4 py-3 text-sm">Oct 25, 2024</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-primary hover:text-primary-light mr-2">
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button className="text-warning hover:text-yellow-500">
                          <i className="fa-solid fa-archive"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div id="active-staff-table">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-font-base flex items-center">
                      <i className="fa-solid fa-user-tie text-primary mr-3"></i>
                      Active Staff
                    </h3>
                    <p className="text-sm text-font-detail mt-1">
                      Currently active staff members in the program
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="bg-warning text-white px-4 py-2 rounded-lg hover:bg-yellow-500 text-sm">
                      <i className="fa-solid fa-archive mr-2"></i>
                      View Inactive
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border border-bd">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Employee ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Position</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Start Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bd">
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-font-base">Davis, Linda</td>
                      <td className="px-4 py-3 text-sm">EMP-101</td>
                      <td className="px-4 py-3 text-sm">JJYDS III</td>
                      <td className="px-4 py-3 text-sm">Direct Care</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-success text-white text-xs rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">Jan 15, 2022</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-primary hover:text-primary-light mr-2">
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button className="text-warning hover:text-yellow-500">
                          <i className="fa-solid fa-user-slash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-font-base">
                        Wilson, Michael
                      </td>
                      <td className="px-4 py-3 text-sm">EMP-102</td>
                      <td className="px-4 py-3 text-sm">JJYDS II</td>
                      <td className="px-4 py-3 text-sm">Direct Care</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-success text-white text-xs rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">Mar 08, 2022</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-primary hover:text-primary-light mr-2">
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button className="text-warning hover:text-yellow-500">
                          <i className="fa-solid fa-user-slash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-font-base">
                        Brown, Patricia
                      </td>
                      <td className="px-4 py-3 text-sm">EMP-103</td>
                      <td className="px-4 py-3 text-sm">Caseworker</td>
                      <td className="px-4 py-3 text-sm">Clinical</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-success text-white text-xs rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">Jun 12, 2021</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-primary hover:text-primary-light mr-2">
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button className="text-warning hover:text-yellow-500">
                          <i className="fa-solid fa-user-slash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-font-base">
                        Martinez, Roberto
                      </td>
                      <td className="px-4 py-3 text-sm">EMP-104</td>
                      <td className="px-4 py-3 text-sm">JJYDS I</td>
                      <td className="px-4 py-3 text-sm">Direct Care</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-highlight text-white text-xs rounded-full">
                          Training
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">Nov 01, 2024</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-primary hover:text-primary-light mr-2">
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button className="text-warning hover:text-yellow-500">
                          <i className="fa-solid fa-user-slash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-font-base">
                        Johnson, Sarah
                      </td>
                      <td className="px-4 py-3 text-sm">EMP-105</td>
                      <td className="px-4 py-3 text-sm">Clinician</td>
                      <td className="px-4 py-3 text-sm">Clinical</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-success text-white text-xs rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">Sep 20, 2020</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-primary hover:text-primary-light mr-2">
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button className="text-warning hover:text-yellow-500">
                          <i className="fa-solid fa-user-slash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-font-base">
                        Garcia, Carlos
                      </td>
                      <td className="px-4 py-3 text-sm">EMP-106</td>
                      <td className="px-4 py-3 text-sm">Support Staff</td>
                      <td className="px-4 py-3 text-sm">Administration</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-success text-white text-xs rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">May 10, 2023</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-primary hover:text-primary-light mr-2">
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button className="text-warning hover:text-yellow-500">
                          <i className="fa-solid fa-user-slash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* <!-- Resident Management Tab Content --> */}
        {activeTab === 'residents' && (
          <div id="residents-content" className="p-6 ">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-user-plus text-primary mr-3"></i>
                  Add New Resident
                </h3>
                <p className="text-sm text-font-detail mt-1">Add new residents to the facility</p>
              </div>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Resident ID
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Room Assignment
                  </label>
                  <select className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Select Room</option>
                    <option>Room 101</option>
                    <option>Room 102</option>
                    <option>Room 103</option>
                    <option>Room 104</option>
                    <option>Room 105</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Advocate Staff
                  </label>
                  <select className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Select Staff</option>
                    <option>Davis, L.</option>
                    <option>Wilson, M.</option>
                    <option>Brown, P.</option>
                    <option>Martinez, R.</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">
                  Initial Status
                </label>
                <select className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                  <option>General Population</option>
                  <option>ALOYO</option>
                  <option>Restricted</option>
                  <option>Team Leader</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">
                  Admission Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter any relevant admission notes..."
                  className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                ></textarea>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-success text-white px-6 py-2 rounded-lg hover:bg-green-600 text-sm"
                >
                  <i className="fa-solid fa-check mr-2"></i>Add Resident
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 text-sm"
                >
                  <i className="fa-solid fa-times mr-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* <!-- Staff Management Tab Content --> */}
        {activeTab === 'staff' && (
          <div id="staff-content" className="p-6 ">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-user-tie text-primary mr-3"></i>
                  Add New Staff Member
                </h3>
                <p className="text-sm text-font-detail mt-1">
                  Add new staff members to the program
                </p>
              </div>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="firstname.lastname@mass.gov"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Position</label>
                  <select className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Select Position</option>
                    <option>JJYDS I</option>
                    <option>JJYDS II</option>
                    <option>JJYDS III</option>
                    <option>Caseworker</option>
                    <option>Support Staff</option>
                    <option>Clinician</option>
                    <option>Supervisor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Department
                  </label>
                  <select className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Select Department</option>
                    <option>Direct Care</option>
                    <option>Clinical</option>
                    <option>Administration</option>
                    <option>Medical</option>
                    <option>Education</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Active</option>
                    <option>Training</option>
                    <option>Shadowing</option>
                    <option>Probationary</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter any relevant notes..."
                  className="w-full px-3 py-2 border border-bd-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                ></textarea>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-success text-white px-6 py-2 rounded-lg hover:bg-green-600 text-sm"
                >
                  <i className="fa-solid fa-check mr-2"></i>Add Staff
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 text-sm"
                >
                  <i className="fa-solid fa-times mr-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
