'use client';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base">Schedule Reports</h3>
          <div className="mt-2 text-sm text-font-detail">
            Generate reports for staffing metrics and analytics
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-bd rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <i className="fa-solid fa-clock text-warning text-2xl mr-3"></i>
                  <div>
                    <h4 className="font-semibold text-font-base">Overtime Report</h4>
                    <p className="text-xs text-font-detail mt-1">Track overtime hours by staff</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-font-detail">Total OT Hours (Month):</span>
                  <span className="font-semibold text-font-base">156 hrs</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-font-detail">Average per Staff:</span>
                  <span className="font-semibold text-font-base">10.4 hrs</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-font-detail">Mandatory OT:</span>
                  <span className="font-semibold text-error">8 instances</span>
                </div>
              </div>
              <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
                <i className="fa-solid fa-download mr-2"></i>
                Generate Report
              </button>
            </div>

            <div className="border border-bd rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <i className="fa-solid fa-calendar-xmark text-primary text-2xl mr-3"></i>
                  <div>
                    <h4 className="font-semibold text-font-base">Leave Report</h4>
                    <p className="text-xs text-font-detail mt-1">Time off trends and balances</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-font-detail">Approved Requests (Month):</span>
                  <span className="font-semibold text-font-base">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-font-detail">Total Days Off:</span>
                  <span className="font-semibold text-font-base">45 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-font-detail">Currently On Leave:</span>
                  <span className="font-semibold text-warning">5 staff</span>
                </div>
              </div>
              <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
                <i className="fa-solid fa-download mr-2"></i>
                Generate Report
              </button>
            </div>

            <div className="border border-bd rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <i className="fa-solid fa-chart-line text-success text-2xl mr-3"></i>
                  <div>
                    <h4 className="font-semibold text-font-base">Coverage Report</h4>
                    <p className="text-xs text-font-detail mt-1">Shift coverage analysis</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-font-detail">Fully Staffed Days:</span>
                  <span className="font-semibold text-success">23/30</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-font-detail">Coverage Gaps:</span>
                  <span className="font-semibold text-warning">7 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-font-detail">Critical Shortages:</span>
                  <span className="font-semibold text-error">3 shifts</span>
                </div>
              </div>
              <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
                <i className="fa-solid fa-download mr-2"></i>
                Generate Report
              </button>
            </div>

            <div className="border border-bd rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <i className="fa-solid fa-users text-primary-light text-2xl mr-3"></i>
                  <div>
                    <h4 className="font-semibold text-font-base">Staff Utilization</h4>
                    <p className="text-xs text-font-detail mt-1">Workload distribution analysis</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-font-detail">Active Staff:</span>
                  <span className="font-semibold text-font-base">28</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-font-detail">Avg Shifts per Week:</span>
                  <span className="font-semibold text-font-base">4.8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-font-detail">Underutilized:</span>
                  <span className="font-semibold text-primary">3 staff</span>
                </div>
              </div>
              <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
                <i className="fa-solid fa-download mr-2"></i>
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base">Custom Report Builder</h3>
          <div className="mt-2 text-sm text-font-detail">
            Create custom reports with specific date ranges and filters
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Report Type</label>
              <select className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm">
                <option>Overtime Summary</option>
                <option>Leave Analysis</option>
                <option>Coverage Metrics</option>
                <option>Staff Utilization</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Date Range</label>
              <select className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
                <option>Last Month</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Format</label>
              <select className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm">
                <option>PDF</option>
                <option>Excel (XLSX)</option>
                <option>CSV</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light">
              <i className="fa-solid fa-file-export mr-2"></i>
              Generate Custom Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
