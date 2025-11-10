'use client';

import { useState } from 'react';

export default function EditSchedulePage() {
  return (
    <div id="schedule-builder-main" className="flex-1 p-6 overflow-auto">
      <div id="schedule-controls" className="bg-white rounded-lg border border-bd mb-6">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-calendar-plus text-primary mr-3"></i>
                Schedule Configuration
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Set up schedule parameters and date range for staff assignments
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-primary-alt text-white px-4 py-2 rounded-lg hover:bg-primary-alt-dark text-sm">
                <i className="fa-solid fa-copy mr-2"></i>
                Copy Previous Schedule
              </button>
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
                <i className="fa-solid fa-save mr-2"></i>
                Save Schedule
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Schedule Type</label>
              <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm">
                <option>Create New Schedule</option>
                <option>Edit Existing Schedule</option>
                <option>Template Schedule</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Start Date</label>
              <input
                type="date"
                value="2024-11-18"
                className="w-full border border-bd rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">End Date</label>
              <input
                type="date"
                value="2024-12-01"
                className="w-full border border-bd rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Unit</label>
              <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm">
                <option>Unit A - Secure</option>
                <option>Unit B - Residential</option>
                <option>Unit C - Intake</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div id="staff-pool" className="bg-white rounded-lg border border-bd mb-6">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base flex items-center">
            <i className="fa-solid fa-users text-primary mr-3"></i>
            Available Staff Pool
          </h3>
          <div className="mt-2 text-sm text-font-detail">
            Manage staff availability, remove those on leave, and add new staff
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-font-base mb-4 flex items-center">
                <i className="fa-solid fa-user-check text-success mr-2"></i>
                Available Staff (24)
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="flex items-center justify-between p-3 border border-bd rounded-lg bg-success-lightest">
                  <div className="flex items-center">
                    <input type="checkbox" checked className="mr-3" />
                    <div>
                      <div className="font-medium text-font-base">Davis, Linda (JJYDS III)</div>
                      <div className="text-xs text-font-detail">
                        Supervisor • Available all shifts
                      </div>
                    </div>
                  </div>
                  <button className="text-error hover:text-red-600 text-sm">
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 border border-bd rounded-lg bg-success-lightest">
                  <div className="flex items-center">
                    <input type="checkbox" checked className="mr-3" />
                    <div>
                      <div className="font-medium text-font-base">Wilson, Marcus (JJYDS II)</div>
                      <div className="text-xs text-font-detail">Regular • Prefers day shift</div>
                    </div>
                  </div>
                  <button className="text-error hover:text-red-600 text-sm">
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 border border-bd rounded-lg bg-success-lightest">
                  <div className="flex items-center">
                    <input type="checkbox" checked className="mr-3" />
                    <div>
                      <div className="font-medium text-font-base">Thompson, Kevin (JJYDS III)</div>
                      <div className="text-xs text-font-detail">Supervisor • Evening preferred</div>
                    </div>
                  </div>
                  <button className="text-error hover:text-red-600 text-sm">
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              </div>
              <button className="w-full mt-3 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-light text-sm">
                <i className="fa-solid fa-plus mr-2"></i>
                Add New Staff
              </button>
            </div>

            <div>
              <h4 className="font-semibold text-font-base mb-4 flex items-center">
                <i className="fa-solid fa-user-xmark text-error mr-2"></i>
                On Leave (7)
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="flex items-center justify-between p-3 border border-bd rounded-lg bg-error-lightest">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    <div>
                      <div className="font-medium text-font-base">Henderson, Sarah (JJYDS II)</div>
                      <div className="text-xs text-font-detail">Vacation • Nov 18-25</div>
                    </div>
                  </div>
                  <button className="text-success hover:text-green-600 text-sm">
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 border border-bd rounded-lg bg-error-lightest">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    <div>
                      <div className="font-medium text-font-base">Foster, David (JJYDS I)</div>
                      <div className="text-xs text-font-detail">Sick Leave • Since Nov 17</div>
                    </div>
                  </div>
                  <button className="text-success hover:text-green-600 text-sm">
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
              <button className="w-full mt-3 bg-error text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm">
                <i className="fa-solid fa-plus mr-2"></i>
                Add Staff on Leave
              </button>
            </div>

            <div>
              <h4 className="font-semibold text-font-base mb-4 flex items-center">
                <i className="fa-solid fa-graduation-cap text-highlight mr-2"></i>
                Shadowing Staff (3)
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="flex items-center justify-between p-3 border border-bd rounded-lg bg-highlight-lightest">
                  <div className="flex items-center">
                    <input type="checkbox" checked className="mr-3" />
                    <div>
                      <div className="font-medium text-font-base">Rodriguez, Ana (JJYDS I)</div>
                      <div className="text-xs text-font-detail">
                        Week 2 of training • Must pair with JJYDS III
                      </div>
                    </div>
                  </div>
                  <button className="text-error hover:text-red-600 text-sm">
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 border border-bd rounded-lg bg-highlight-lightest">
                  <div className="flex items-center">
                    <input type="checkbox" checked className="mr-3" />
                    <div>
                      <div className="font-medium text-font-base">Johnson, Michael (JJYDS I)</div>
                      <div className="text-xs text-font-detail">
                        Week 1 of training • Day shift only
                      </div>
                    </div>
                  </div>
                  <button className="text-error hover:text-red-600 text-sm">
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              </div>
              <button className="w-full mt-3 bg-highlight text-white px-3 py-2 rounded-lg hover:bg-yellow-600 text-sm">
                <i className="fa-solid fa-plus mr-2"></i>
                Add Shadowing Staff
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="schedule-builder" className="bg-white rounded-lg border border-bd mb-6">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base flex items-center">
            <i className="fa-solid fa-calendar-week text-primary mr-3"></i>
            Two-Week Schedule Builder
          </h3>
          <div className="mt-2 text-sm text-font-detail">
            Drag and drop staff to assign shifts. Click on cells to manage assignments.
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select className="border border-bd rounded-lg px-3 py-2 text-sm">
                <option>Current Period: Nov 18 - Dec 1, 2024</option>
                <option>Previous: Nov 4 - Nov 17, 2024</option>
                <option>Oct 21 - Nov 3, 2024</option>
                <option>Oct 7 - Oct 20, 2024</option>
              </select>
              <button className="bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-light text-sm">
                Week 1: Nov 18-24
              </button>
              <button className="bg-gray-200 text-font-base px-3 py-2 rounded-lg hover:bg-gray-300 text-sm">
                Week 2: Nov 25-Dec 1
              </button>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-success rounded mr-2"></span>Fully Staffed
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-warning rounded mr-2"></span>Needs Staff
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-error rounded mr-2"></span>Critical
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-highlight rounded mr-2"></span>Shadowing
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-bd">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Day Shift (7AM-3PM)
                    <br />
                    <span className="text-xs font-normal">Req: 8 staff + 1 supervisor</span>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Evening (3PM-11PM)
                    <br />
                    <span className="text-xs font-normal">Req: 6 staff + 1 supervisor</span>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Overnight (11PM-7AM)
                    <br />
                    <span className="text-xs font-normal">Req: 4 staff + 1 supervisor</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-bd">
                  <td className="px-4 py-6 font-medium text-font-base bg-gray-50">
                    <div>Mon, Nov 18</div>
                    <div className="text-xs text-font-detail mt-1">Week 1</div>
                  </td>
                  <td className="px-4 py-6 border-l border-bd bg-success-lightest">
                    <div className="space-y-1">
                      <div className="bg-primary text-white px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Davis, L. (SUP)</span>
                        <button className="text-white hover:text-gray-300">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Wilson, M.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-highlight text-white px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Rodriguez, A. (S)</span>
                        <button className="text-white hover:text-gray-300">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <button className="w-full border border-dashed border-gray-400 px-2 py-1 rounded text-xs text-font-detail hover:bg-gray-100">
                        <i className="fa-solid fa-plus mr-1"></i>Add Staff
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-6 border-l border-bd bg-success-lightest">
                    <div className="space-y-1">
                      <div className="bg-primary text-white px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Thompson, K. (SUP)</span>
                        <button className="text-white hover:text-gray-300">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Garcia, M.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <button className="w-full border border-dashed border-gray-400 px-2 py-1 rounded text-xs text-font-detail hover:bg-gray-100">
                        <i className="fa-solid fa-plus mr-1"></i>Add Staff
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-6 border-l border-bd bg-warning-lightest">
                    <div className="space-y-1">
                      <div className="bg-primary text-white px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Roberts, T. (SUP)</span>
                        <button className="text-white hover:text-gray-300">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Evans, N.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <button className="w-full border border-dashed border-warning px-2 py-1 rounded text-xs text-warning hover:bg-warning-lightest">
                        <i className="fa-solid fa-plus mr-1"></i>Need 1 More
                      </button>
                      <button className="w-full border border-dashed border-gray-400 px-2 py-1 rounded text-xs text-font-detail hover:bg-gray-100">
                        <i className="fa-solid fa-plus mr-1"></i>Add Staff
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-bd">
                  <td className="px-4 py-6 font-medium text-font-base bg-gray-50">
                    <div>Tue, Nov 19</div>
                  </td>
                  <td className="px-4 py-6 border-l border-bd bg-success-lightest">
                    <div className="space-y-1">
                      <div className="bg-primary text-white px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Davis, L. (SUP)</span>
                        <button className="text-white hover:text-gray-300">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Wilson, M.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Brown, P.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-highlight text-white px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Johnson, M. (S)</span>
                        <button className="text-white hover:text-gray-300">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Miller, K.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Taylor, S.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Anderson, J.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>White, D.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <button className="w-full border border-dashed border-gray-400 px-2 py-1 rounded text-xs text-font-detail hover:bg-gray-100">
                        <i className="fa-solid fa-plus mr-1"></i>Add Staff
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-6 border-l border-bd bg-success-lightest">
                    <div className="space-y-1">
                      <div className="bg-primary text-white px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Thompson, K. (SUP)</span>
                        <button className="text-white hover:text-gray-300">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Garcia, M.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Lee, A.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Clark, B.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Martinez, C.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Adams, P.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Turner, L.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <button className="w-full border border-dashed border-gray-400 px-2 py-1 rounded text-xs text-font-detail hover:bg-gray-100">
                        <i className="fa-solid fa-plus mr-1"></i>Add Staff
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-6 border-l border-bd bg-warning-lightest">
                    <div className="space-y-1">
                      <div className="bg-primary text-white px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Roberts, T. (SUP)</span>
                        <button className="text-white hover:text-gray-300">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Evans, N.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>Hall, J.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="bg-gray-200 text-font-base px-2 py-1 rounded text-xs flex items-center justify-between">
                        <span>King, S.</span>
                        <button className="text-font-detail hover:text-font-base">
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <button className="w-full border border-dashed border-warning px-2 py-1 rounded text-xs text-warning hover:bg-warning-lightest">
                        <i className="fa-solid fa-plus mr-1"></i>Need 1 More
                      </button>
                      <button className="w-full border border-dashed border-gray-400 px-2 py-1 rounded text-xs text-font-detail hover:bg-gray-100">
                        <i className="fa-solid fa-plus mr-1"></i>Add Staff
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
