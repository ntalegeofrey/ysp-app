'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'add' | 'audit'>('overview');
  const router = useRouter();

  const tabBtnBase = 'flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors';
  const tabBtnInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';
  const tabBtnActive = 'border-primary text-primary';

  return (
    <div className="space-y-6">
        <div className="px-6 pt-2">
          <nav className="flex space-x-8 border-b border-bd">
            <button
              className={`${tabBtnBase} ${activeTab === 'overview' ? tabBtnActive : tabBtnInactive}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className={`fa-solid fa-chart-line mr-2 ${activeTab === 'overview' ? 'text-primary' : 'text-font-detail'}`}></i>
              Overview
            </button>
            <button
              className={`${tabBtnBase} ${activeTab === 'add' ? tabBtnActive : tabBtnInactive}`}
              onClick={() => setActiveTab('add')}
            >
              <i className={`fa-solid fa-plus mr-2 ${activeTab === 'add' ? 'text-primary' : 'text-font-detail'}`}></i>
              Add Items
            </button>
            <button
              className={`${tabBtnBase} ${activeTab === 'audit' ? tabBtnActive : tabBtnInactive}`}
              onClick={() => setActiveTab('audit')}
            >
              <i className={`fa-solid fa-clipboard-check mr-2 ${activeTab === 'audit' ? 'text-primary' : 'text-font-detail'}`}></i>
              Audit & Validation
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-bd shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-font-detail text-sm font-medium">Total Items</p>
                      <p className="text-3xl font-bold text-success mt-1">2,847</p>
                      <p className="text-xs text-success mt-1">↑ 2.5% from last month</p>
                    </div>
                    <div className="bg-success bg-opacity-10 p-3 rounded-xl">
                      <i className="fa-solid fa-boxes-stacked text-success text-xl"></i>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-bd shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-font-detail text-sm font-medium">Low Stock Alerts</p>
                      <p className="text-3xl font-bold text-warning mt-1">23</p>
                      <p className="text-xs text-warning mt-1">Requires attention</p>
                    </div>
                    <div className="bg-warning bg-opacity-10 p-3 rounded-xl">
                      <i className="fa-solid fa-exclamation-triangle text-warning text-xl"></i>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-bd shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-font-detail text-sm font-medium">Critical Items</p>
                      <p className="text-3xl font-bold text-error mt-1">5</p>
                      <p className="text-xs text-error mt-1">Immediate action needed</p>
                    </div>
                    <div className="bg-error bg-opacity-10 p-3 rounded-xl">
                      <i className="fa-solid fa-times-circle text-error text-xl"></i>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-bd shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-font-detail text-sm font-medium">Storage Utilization</p>
                      <p className="text-3xl font-bold text-primary mt-1">78%</p>
                      <div className="w-full bg-primary-lightest rounded-full h-2 mt-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div className="bg-primary bg-opacity-10 p-3 rounded-xl">
                      <i className="fa-solid fa-warehouse text-primary text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Priority Alerts */}
              <div className="bg-white rounded-xl border border-bd shadow-sm">
                <div className="p-6 border-b border-bd">
                  <h3 className="text-xl font-semibold text-font-base flex items-center">
                    <i className="fa-solid fa-bell text-error mr-3"></i>Priority Alerts
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-error-lightest border-l-4 border-error rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-error">Critical Stock Level</h4>
                        <p className="text-sm text-font-detail mt-1">Toiletries - Toothpaste (Colgate)</p>
                        <p className="text-sm text-font-detail">Current: 2 units | Required: 15+ units</p>
                      </div>
                      <button onClick={() => router.push('/dashboard/inventory/refill-request')} className="bg-error text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90">Request Refill</button>
                    </div>
                  </div>
                  <div className="bg-highlight-lightest border-l-4 border-highlight rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-warning">Low Stock Warning</h4>
                        <p className="text-sm text-font-detail mt-1">Food - Breakfast Cereal</p>
                        <p className="text-sm text-font-detail">Current: 8 units | Minimum: 20 units</p>
                      </div>
                      <button onClick={() => router.push('/dashboard/inventory/refill-request')} className="bg-highlight text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90">Request Refill</button>
                    </div>
                  </div>
                  <div className="bg-warning bg-opacity-10 border border-warning rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-warning">Storage Capacity</h4>
                        <p className="text-sm text-font-detail mt-1">Clothing Storage - Zone C</p>
                        <p className="text-sm text-font-detail">Current: 95% full | Recommended: 85%</p>
                      </div>
                      <button onClick={() => router.push('/dashboard/inventory/reorganize')} className="bg-warning text-white px-3 py-1 rounded text-sm hover:bg-opacity-90">Reorganize</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory by Category + Items Table */}
              <div className="bg-white rounded-lg border border-bd">
                <div className="p-6 border-b border-bd">
                  <h3 className="text-lg font-semibold text-font-base">Inventory by Category</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-primary-lightest p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-font-base">Food</h4>
                        <i className="fa-solid fa-utensils text-primary"></i>
                      </div>
                      <p className="text-2xl font-bold text-primary">342</p>
                      <p className="text-sm text-success">Stock: Good</p>
                    </div>
                    <div className="bg-primary-lightest p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-font-base">Clothing</h4>
                        <i className="fa-solid fa-shirt text-primary"></i>
                      </div>
                      <p className="text-2xl font-bold text-primary">156</p>
                      <p className="text-sm text-success">Stock: Good</p>
                    </div>
                    <div className="bg-warning bg-opacity-10 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-font-base">Toiletries</h4>
                        <i className="fa-solid fa-soap text-warning"></i>
                      </div>
                      <p className="text-2xl font-bold text-warning">89</p>
                      <p className="text-sm text-warning">Stock: Low</p>
                    </div>
                    <div className="bg-primary-lightest p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-font-base">Medical</h4>
                        <i className="fa-solid fa-first-aid text-primary"></i>
                      </div>
                      <p className="text-2xl font-bold text-primary">67</p>
                      <p className="text-sm text-success">Stock: Good</p>
                    </div>
                    <div className="bg-primary-lightest p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-font-base">Stationery</h4>
                        <i className="fa-solid fa-pen text-primary"></i>
                      </div>
                      <p className="text-2xl font-bold text-primary">234</p>
                      <p className="text-sm text-success">Stock: Good</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-font-base">Item Details</h4>
                      <div className="flex items-center space-x-4">
                        <select className="border border-bd rounded-lg px-3 py-2 text-sm">
                          <option>All Categories</option>
                          <option>Food</option>
                          <option>Clothing</option>
                          <option>Toiletries</option>
                          <option>Medical</option>
                          <option>Stationery</option>
                        </select>
                        <select className="border border-bd rounded-lg px-3 py-2 text-sm">
                          <option>Sort by Name</option>
                          <option>Sort by Quantity (High to Low)</option>
                          <option>Sort by Quantity (Low to High)</option>
                          <option>Sort by Status</option>
                          <option>Sort by Location</option>
                        </select>
                        <input type="text" placeholder="Search items..." className="border border-bd rounded-lg px-3 py-2 text-sm w-48" />
                        <button className="bg-success text-white px-3 py-2 rounded-lg text-sm hover:bg-opacity-90">
                          <i className="fa-solid fa-download mr-2"></i>Export Excel
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-bd rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-bg-subtle">
                            <tr>
                              <th className="text-left p-3 font-medium text-font-base text-sm">Item Name</th>
                              <th className="text-left p-3 font-medium text-font-base text-sm">Category</th>
                              <th className="text-left p-3 font-medium text-font-base text-sm">Quantity</th>
                              <th className="text-left p-3 font-medium text-font-base text-sm">Min. Level</th>
                              <th className="text-left p-3 font-medium text-font-base text-sm">Location</th>
                              <th className="text-left p-3 font-medium text-font-base text-sm">Status</th>
                              <th className="text-left p-3 font-medium text-font-base text-sm">Last Updated</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-bd hover:bg-primary-lightest hover:bg-opacity-30">
                              <td className="p-3 text-sm">Toothpaste - Colgate</td>
                              <td className="p-3 text-sm">Toiletries</td>
                              <td className="p-3 text-sm text-error font-medium">2</td>
                              <td className="p-3 text-sm">15</td>
                              <td className="p-3 text-sm">Shelf A-2</td>
                              <td className="p-3"><span className="bg-error text-white px-2 py-1 rounded text-xs">Critical</span></td>
                              <td className="p-3 text-sm text-font-detail">2 hours ago</td>
                            </tr>
                            <tr className="border-b border-bd hover:bg-primary-lightest hover:bg-opacity-30">
                              <td className="p-3 text-sm">Breakfast Cereal</td>
                              <td className="p-3 text-sm">Food</td>
                              <td className="p-3 text-sm text-warning font-medium">8</td>
                              <td className="p-3 text-sm">20</td>
                              <td className="p-3 text-sm">Pantry B-1</td>
                              <td className="p-3"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Low</span></td>
                              <td className="p-3 text-sm text-font-detail">4 hours ago</td>
                            </tr>
                            <tr className="border-b border-bd hover:bg-primary-lightest hover:bg-opacity-30">
                              <td className="p-3 text-sm">T-Shirt - Medium</td>
                              <td className="p-3 text-sm">Clothing</td>
                              <td className="p-3 text-sm text-success font-medium">45</td>
                              <td className="p-3 text-sm">30</td>
                              <td className="p-3 text-sm">Storage C-3</td>
                              <td className="p-3"><span className="bg-success text-white px-2 py-1 rounded text-xs">Good</span></td>
                              <td className="p-3 text-sm text-font-detail">1 day ago</td>
                            </tr>
                            <tr className="border-b border-bd hover:bg-primary-lightest hover:bg-opacity-30">
                              <td className="p-3 text-sm">First Aid Kit</td>
                              <td className="p-3 text-sm">Medical</td>
                              <td className="p-3 text-sm text-success font-medium">12</td>
                              <td className="p-3 text-sm">5</td>
                              <td className="p-3 text-sm">Med Cabinet</td>
                              <td className="p-3"><span className="bg-success text-white px-2 py-1 rounded text-xs">Good</span></td>
                              <td className="p-3 text-sm text-font-detail">3 days ago</td>
                            </tr>
                            <tr className="border-b border-bd hover:bg-primary-lightest hover:bg-opacity-30">
                              <td className="p-3 text-sm">Pencils - #2</td>
                              <td className="p-3 text-sm">Stationery</td>
                              <td className="p-3 text-sm text-success font-medium">120</td>
                              <td className="p-3 text-sm">50</td>
                              <td className="p-3 text-sm">Office D-1</td>
                              <td className="p-3"><span className="bg-success text-white px-2 py-1 rounded text-xs">Good</span></td>
                              <td className="p-3 text-sm text-font-detail">1 week ago</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="p-4 border-t border-bd bg-bg-subtle flex justify-between items-center">
                        <p className="text-sm text-font-detail">Showing 5 of 2,847 items</p>
                        <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-light">
                          See More Items
                          <i className="fa-solid fa-arrow-right ml-2"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Item Form */}
              <div className="lg:col-span-2 bg-white rounded-lg border border-bd p-6">
                <h3 className="text-lg font-semibold text-font-base mb-6">Add New Items</h3>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Item Name</label>
                      <input type="text" placeholder="Enter item name" className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Category</label>
                      <select className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                        <option>Select Category</option>
                        <option>Food</option>
                        <option>Clothing</option>
                        <option>Toiletries</option>
                        <option>Medical</option>
                        <option>Stationery</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Quantity</label>
                      <input type="number" placeholder="0" className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Min. Level</label>
                      <input type="number" placeholder="0" className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Location</label>
                      <input type="text" placeholder="Shelf A-1" className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Notes (Optional)</label>
                    <textarea placeholder="Additional notes about this item" rows={3} className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"></textarea>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-light flex-1">
                      <i className="fa-solid fa-plus mr-2"></i>
                      Add Item
                    </button>
                    <button type="button" className="bg-primary-lightest text-primary px-6 py-2 rounded-lg font-medium hover:bg-primary-lighter">
                      <i className="fa-solid fa-eraser mr-2"></i>
                      Clear
                    </button>
                  </div>
                </form>
              </div>

              {/* Recently Added */}
              <div className="bg-white rounded-lg border border-bd p-6">
                <h3 className="text-lg font-semibold text-font-base mb-4">Recently Added</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between py-2 border-b border-bd">
                    <div>
                      <p className="text-sm font-medium text-font-base">Hand Sanitizer - 8oz</p>
                      <p className="text-xs text-font-detail">Added 2 hours ago</p>
                    </div>
                    <span className="bg-success text-white text-xs px-2 py-1 rounded">Added</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-bd">
                    <div>
                      <p className="text-sm font-medium text-font-base">Socks - White Large</p>
                      <p className="text-xs text-font-detail">Added 4 hours ago</p>
                    </div>
                    <span className="bg-success text-white text-xs px-2 py-1 rounded">Added</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-bd">
                    <div>
                      <p className="text-sm font-medium text-font-base">Notebook - Spiral</p>
                      <p className="text-xs text-font-detail">Added 6 hours ago</p>
                    </div>
                    <span className="bg-success text-white text-xs px-2 py-1 rounded">Added</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-bd">
                    <div>
                      <p className="text-sm font-medium text-font-base">Shampoo - 12oz</p>
                      <p className="text-xs text-font-detail">Added 1 day ago</p>
                    </div>
                    <span className="bg-success text-white text-xs px-2 py-1 rounded">Added</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-bd">
                    <div>
                      <p className="text-sm font-medium text-font-base">Bandages - Adhesive</p>
                      <p className="text-xs text-font-detail">Added 1 day ago</p>
                    </div>
                    <span className="bg-success text-white text-xs px-2 py-1 rounded">Added</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-white rounded-lg border border-bd">
              <div className="p-6 border-b border-bd">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-font-base">Inventory Audit & Validation</h3>
                  <div className="flex items-center space-x-4">
                    <select className="border border-bd rounded-lg px-3 py-2 text-sm">
                      <option>All Categories</option>
                      <option>Food</option>
                      <option>Clothing</option>
                      <option>Toiletries</option>
                      <option>Medical</option>
                      <option>Stationery</option>
                    </select>
                    <button className="bg-success text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90">
                      <i className="fa-solid fa-save mr-2"></i>Save Audit
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 h-full overflow-auto">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-bg-subtle">
                      <tr>
                        <th className="text-left p-3 font-medium text-font-base text-sm"><input type="checkbox" className="mr-2" />Item Name</th>
                        <th className="text-left p-3 font-medium text-font-base text-sm">Category</th>
                        <th className="text-left p-3 font-medium text-font-base text-sm">System Count</th>
                        <th className="text-left p-3 font-medium text-font-base text-sm">Physical Count</th>
                        <th className="text-left p-3 font-medium text-font-base text-sm">Location</th>
                        <th className="text-left p-3 font-medium text-font-base text-sm">Notes</th>
                        <th className="text-left p-3 font-medium text-font-base text-sm">Verified By</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-bd hover:bg-primary-lightest hover:bg-opacity-30">
                        <td className="p-3"><div className="flex items-center"><input type="checkbox" className="mr-3" /><span className="text-sm">Toothpaste - Colgate</span></div></td>
                        <td className="p-3 text-sm">Toiletries</td>
                        <td className="p-3 text-sm font-medium">2</td>
                        <td className="p-3"><input type="number" defaultValue={2} className="w-16 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" /></td>
                        <td className="p-3 text-sm">Shelf A-2</td>
                        <td className="p-3"><input type="text" placeholder="Add notes..." className="w-32 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" /></td>
                        <td className="p-3 text-sm text-font-detail">Pending</td>
                      </tr>
                      <tr className="border-b border-bd hover:bg-primary-lightest hover:bg-opacity-30">
                        <td className="p-3"><div className="flex items-center"><input type="checkbox" className="mr-3" /><span className="text-sm">Breakfast Cereal</span></div></td>
                        <td className="p-3 text-sm">Food</td>
                        <td className="p-3 text-sm font-medium">8</td>
                        <td className="p-3"><input type="number" defaultValue={8} className="w-16 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" /></td>
                        <td className="p-3 text-sm">Pantry B-1</td>
                        <td className="p-3"><input type="text" placeholder="Add notes..." className="w-32 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" /></td>
                        <td className="p-3 text-sm text-font-detail">Pending</td>
                      </tr>
                      <tr className="border-b border-bd hover:bg-primary-lightest hover:bg-opacity-30">
                        <td className="p-3"><div className="flex items-center"><input type="checkbox" defaultChecked className="mr-3" /><span className="text-sm">T-Shirt - Medium</span></div></td>
                        <td className="p-3 text-sm">Clothing</td>
                        <td className="p-3 text-sm font-medium">45</td>
                        <td className="p-3"><input type="number" defaultValue={43} className="w-16 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" /></td>
                        <td className="p-3 text-sm">Storage C-3</td>
                        <td className="p-3"><input type="text" defaultValue="2 damaged items removed" className="w-32 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" /></td>
                        <td className="p-3 text-sm text-success">J. Smith</td>
                      </tr>
                      <tr className="border-b border-bd hover:bg-primary-lightest hover:bg-opacity-30">
                        <td className="p-3"><div className="flex items-center"><input type="checkbox" className="mr-3" /><span className="text-sm">First Aid Kit</span></div></td>
                        <td className="p-3 text-sm">Medical</td>
                        <td className="p-3 text-sm font-medium">12</td>
                        <td className="p-3"><input type="number" defaultValue={12} className="w-16 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" /></td>
                        <td className="p-3 text-sm">Med Cabinet</td>
                        <td className="p-3"><input type="text" placeholder="Add notes..." className="w-32 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" /></td>
                        <td className="p-3 text-sm text-font-detail">Pending</td>
                      </tr>
                      <tr className="border-b border-bd hover:bg-primary-lightest hover:bg-opacity-30">
                        <td className="p-3"><div className="flex items-center"><input type="checkbox" className="mr-3" /><span className="text-sm">Pencils - #2</span></div></td>
                        <td className="p-3 text-sm">Stationery</td>
                        <td className="p-3 text-sm font-medium">120</td>
                        <td className="p-3"><input type="number" defaultValue={120} className="w-16 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" /></td>
                        <td className="p-3 text-sm">Office D-1</td>
                        <td className="p-3"><input type="text" placeholder="Add notes..." className="w-32 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" /></td>
                        <td className="p-3 text-sm text-font-detail">Pending</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-primary-lightest rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-font-base">Audit Summary</h4>
                      <p className="text-sm text-font-detail">Total items: 2,847 | Verified: 2,847</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-success">All items verified</p>
                      <p className="text-xs text-font-detail">No discrepancies found</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
