'use client';

export default function AllMedicationRecordsPage() {
  return (
    <main id="med-records-main" className="flex-1 p-6 overflow-auto">
      {/* Page actions (Export, Notifications) */}
      {/* <div className="flex items-center justify-end mb-4 gap-4">
        <button className="bg-success text-white px-4 py-2 rounded-lg hover:bg-primary-alt-dark font-medium text-sm">
          <i className="fa-solid fa-download mr-2"></i>
          Export Records
        </button>
        <button className="relative p-2 text-font-detail hover:text-primary">
          <i className="fa-solid fa-bell text-lg"></i>
          <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
        </button>
      </div> */}
      <div id="filters-section" className="bg-white rounded-lg border border-bd mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Search Resident</label>
              <div className="relative">
                <input type="text" placeholder="Search by ID or name..." className="w-full border border-bd rounded-lg px-3 py-2 pl-10 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                <i className="fa-solid fa-search absolute left-3 top-3 text-font-detail text-sm"></i>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Unit Filter</label>
              <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                <option>All Units</option>
                <option>Unit A</option>
                <option>Unit B</option>
                <option>Unit C</option>
                <option>Unit D</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Medication Status</label>
              <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                <option>All Statuses</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Refused</option>
                <option>Discontinued</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">Date Range</label>
              <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                <option>Today</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Custom Range</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-font-detail">
              Showing <span className="font-medium">24</span> medication records
            </div>
            <button className="text-primary hover:text-primary-light text-sm font-medium">
              <i className="fa-solid fa-filter mr-1"></i>
              Advanced Filters
            </button>
          </div>
        </div>
      </div>

      <div id="records-table" className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd flex items-center justify-between">
          <h3 className="text-lg font-semibold text-font-base flex items-center">
            <i className="fa-solid fa-table text-primary mr-3"></i>
            Medication Records Database
          </h3>
          <div className="flex items-center gap-3">
            <button className="bg-success text-white px-4 py-2 rounded-lg hover:bg-primary-alt-dark font-medium text-sm">
              <i className="fa-solid fa-download mr-2"></i>
              Export Records
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-subtle">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-font-base border-b border-bd">
                  Resident ID
                  <i className="fa-solid fa-sort ml-1 text-font-detail cursor-pointer"></i>
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-font-base border-b border-bd">
                  Name
                  <i className="fa-solid fa-sort ml-1 text-font-detail cursor-pointer"></i>
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-font-base border-b border-bd">
                  Unit
                  <i className="fa-solid fa-sort ml-1 text-font-detail cursor-pointer"></i>
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-font-base border-b border-bd">
                  Medications
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-font-base border-b border-bd">
                  Last Administration
                  <i className="fa-solid fa-sort ml-1 text-font-detail cursor-pointer"></i>
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-font-base border-b border-bd">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-font-base border-b border-bd">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Sample rows copied from the provided HTML */}
              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">A01</td>
                <td className="px-6 py-4 text-sm text-font-base">Michael Johnson</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit A</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Risperidone 2mg</div>
                    <div className="text-sm text-font-base">Sertraline 50mg</div>
                    <div className="text-sm text-font-base">Melatonin 3mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">2:30 PM by J. Smith</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-error-lightest border-b border-bd bg-error-lightest">
                <td className="px-6 py-4 text-sm font-medium text-font-base">A02</td>
                <td className="px-6 py-4 text-sm text-font-base">Sarah Williams</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit A</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Risperidone 2mg</div>
                    <div className="text-sm text-font-base">Clonazepam 0.5mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">10:30 AM by M. Johnson</td>
                <td className="px-6 py-4"><span className="bg-error text-white text-xs px-2 py-1 rounded">Alert</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">B01</td>
                <td className="px-6 py-4 text-sm text-font-base">David Martinez</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit B</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lithium 300mg</div>
                    <div className="text-sm text-font-base">Abilify 10mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:15 PM by K. Williams</td>
                <td className="px-6 py-4"><span className="bg-warning text-white text-xs px-2 py-1 rounded">Pending</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">B03</td>
                <td className="px-6 py-4 text-sm text-font-base">Jessica Brown</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit B</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Melatonin 3mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">8:15 AM by Dr. S. Wilson</td>
                <td className="px-6 py-4"><span className="bg-highlight text-white text-xs px-2 py-1 rounded">New</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">C02</td>
                <td className="px-6 py-4 text-sm text-font-base">Robert Davis</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit C</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Prozac 20mg</div>
                    <div className="text-sm text-font-base">Adderall 15mg</div>
                    <div className="text-sm text-font-base">Trazodone 50mg</div>
                    <div className="text-sm text-font-base">Gabapentin 100mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">2:45 PM by L. Davis</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">D01</td>
                <td className="px-6 py-4 text-sm text-font-base">Emily Wilson</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit D</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Ibuprofen 400mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">11:00 AM by R. Martinez</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">A03</td>
                <td className="px-6 py-4 text-sm text-font-base">Linda Taylor</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit A</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lisinopril 10mg</div>
                    <div className="text-sm text-font-base">Atorvastatin 20mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:45 PM by J. Smith</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">B04</td>
                <td className="px-6 py-4 text-sm text-font-base">James Wilson</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit B</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Metformin 500mg</div>
                    <div className="text-sm text-font-base">Vitamin D 1000IU</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">9:30 AM by Dr. S. Wilson</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">C01</td>
                <td className="px-6 py-4 text-sm text-font-base">Sophia Martinez</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit C</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Cetirizine 10mg</div>
                    <div className="text-sm text-font-base">Zolpidem 5mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">12:00 PM by L. Davis</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">D02</td>
                <td className="px-6 py-4 text-sm text-font-base">Daniel Brown</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit D</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Amoxicillin 500mg</div>
                    <div className="text-sm text-font-base">Paracetamol 500mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">10:15 AM by R. Martinez</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">A04</td>
                <td className="px-6 py-4 text-sm text-font-base">Robert Johnson</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit A</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lisinopril 10mg</div>
                    <div className="text-sm text-font-base">Atorvastatin 20mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:30 PM by J. Smith</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">B02</td>
                <td className="px-6 py-4 text-sm text-font-base">Emily Martinez</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit B</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lisinopril 10mg</div>
                    <div className="text-sm text-font-base">Atorvastatin 20mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:00 PM by K. Williams</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">C03</td>
                <td className="px-6 py-4 text-sm text-font-base">Michael Wilson</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit C</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lisinopril 10mg</div>
                    <div className="text-sm text-font-base">Atorvastatin 20mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:15 PM by L. Davis</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">D03</td>
                <td className="px-6 py-4 text-sm text-font-base">Linda Brown</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit D</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lisinopril 10mg</div>
                    <div className="text-sm text-font-base">Atorvastatin 20mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:30 PM by R. Martinez</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">A05</td>
                <td className="px-6 py-4 text-sm text-font-base">James Taylor</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit A</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lisinopril 10mg</div>
                    <div className="text-sm text-font-base">Atorvastatin 20mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:45 PM by J. Smith</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">B05</td>
                <td className="px-6 py-4 text-sm text-font-base">Emily Wilson</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit B</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lisinopril 10mg</div>
                    <div className="text-sm text-font-base">Atorvastatin 20mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:00 PM by Dr. S. Wilson</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">C04</td>
                <td className="px-6 py-4 text-sm text-font-base">Sophia Martinez</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit C</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lisinopril 10mg</div>
                    <div className="text-sm text-font-base">Atorvastatin 20mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:15 PM by L. Davis</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">D04</td>
                <td className="px-6 py-4 text-sm text-font-base">Daniel Brown</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit D</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lisinopril 10mg</div>
                    <div className="text-sm text-font-base">Atorvastatin 20mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:30 PM by R. Martinez</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">A06</td>
                <td className="px-6 py-4 text-sm text-font-base">Robert Johnson</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit A</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lisinopril 10mg</div>
                    <div className="text-sm text-font-base">Atorvastatin 20mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:45 PM by J. Smith</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">B06</td>
                <td className="px-6 py-4 text-sm text-font-base">Emily Martinez</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit B</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lisinopril 10mg</div>
                    <div className="text-sm text-font-base">Atorvastatin 20mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:00 PM by K. Williams</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">C05</td>
                <td className="px-6 py-4 text-sm text-font-base">Michael Wilson</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit C</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lisinopril 10mg</div>
                    <div className="text-sm text-font-base">Atorvastatin 20mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:15 PM by L. Davis</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-primary-lightest border-b border-bd">
                <td className="px-6 py-4 text-sm font-medium text-font-base">D05</td>
                <td className="px-6 py-4 text-sm text-font-base">Linda Brown</td>
                <td className="px-6 py-4 text-sm text-font-detail">Unit D</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-font-base">Lisinopril 10mg</div>
                    <div className="text-sm text-font-base">Atorvastatin 20mg</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-font-detail">1:30 PM by R. Martinez</td>
                <td className="px-6 py-4"><span className="bg-success text-white text-xs px-2 py-1 rounded">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                      <i className="fa-solid fa-eye mr-1"></i>
                      View
                    </button>
                    <button className="bg-font-detail text-white px-3 py-1 rounded text-xs hover:bg-font-base">
                      <i className="fa-solid fa-edit mr-1"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-bd bg-bg-subtle">
          <div className="flex items-center justify-between">
            <div className="text-sm text-font-detail">Showing 12 of 24 entries</div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-bd rounded text-sm text-font-detail hover:bg-primary-lightest">Previous</button>
              <button className="px-3 py-2 bg-primary text-white rounded text-sm hover:bg-primary-light">1</button>
              <button className="px-3 py-2 border border-bd rounded text-sm text-font-detail hover:bg-primary-lightest">2</button>
              <button className="px-3 py-2 border border-bd rounded text-sm text-font-detail hover:bg-primary-lightest">3</button>
              <button className="px-3 py-2 border border-bd rounded text-sm text-font-detail hover:bg-primary-lightest">Next</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
