'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'add' | 'checkout' | 'requisition' | 'requisition-archive' | 'audit'>('overview');
  const router = useRouter();
  const [currentStaff, setCurrentStaff] = useState('');
  
  // Load current user
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        const staffName = user.fullName || fullName || user.name || user.email || 'Unknown User';
        setCurrentStaff(staffName);
      }
    } catch (err) {
      console.error('Failed to parse user:', err);
    }
  }, []);

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
              className={`${tabBtnBase} ${activeTab === 'checkout' ? tabBtnActive : tabBtnInactive}`}
              onClick={() => setActiveTab('checkout')}
            >
              <i className={`fa-solid fa-arrow-right-from-bracket mr-2 ${activeTab === 'checkout' ? 'text-primary' : 'text-font-detail'}`}></i>
              Checkout
            </button>
            <button
              className={`${tabBtnBase} ${activeTab === 'requisition' ? tabBtnActive : tabBtnInactive}`}
              onClick={() => setActiveTab('requisition')}
            >
              <i className={`fa-solid fa-file-invoice mr-2 ${activeTab === 'requisition' ? 'text-primary' : 'text-font-detail'}`}></i>
              Requisitions
            </button>
            <button
              className={`${tabBtnBase} ${activeTab === 'requisition-archive' ? tabBtnActive : tabBtnInactive}`}
              onClick={() => setActiveTab('requisition-archive')}
            >
              <i className={`fa-solid fa-folder-open mr-2 ${activeTab === 'requisition-archive' ? 'text-primary' : 'text-font-detail'}`}></i>
              Requisition Archive
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

              {/* Inventory Log */}
              <div className="bg-white rounded-lg border border-bd">
                <div className="p-6 border-b border-bd">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-font-base flex items-center">
                      <i className="fa-solid fa-clipboard-list text-primary mr-2"></i>
                      Inventory Log
                    </h3>
                    <div className="flex items-center space-x-4">
                      <select className="border border-bd rounded-lg px-3 py-2 text-sm">
                        <option>All Actions</option>
                        <option>Items Added</option>
                        <option>Items Checked Out</option>
                      </select>
                      <select className="border border-bd rounded-lg px-3 py-2 text-sm">
                        <option>All Categories</option>
                        <option>Food</option>
                        <option>Clothing</option>
                        <option>Toiletries</option>
                        <option>Medical</option>
                        <option>Stationery</option>
                      </select>
                      <input type="text" placeholder="Search log..." className="border border-bd rounded-lg px-3 py-2 text-sm w-48" />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-bg-subtle">
                      <tr>
                        <th className="text-left p-3 font-medium text-font-base text-sm">Date & Time</th>
                        <th className="text-left p-3 font-medium text-font-base text-sm">Action</th>
                        <th className="text-left p-3 font-medium text-font-base text-sm">Item</th>
                        <th className="text-left p-3 font-medium text-font-base text-sm">Category</th>
                        <th className="text-left p-3 font-medium text-font-base text-sm">Quantity</th>
                        <th className="text-left p-3 font-medium text-font-base text-sm">Staff</th>
                        <th className="text-left p-3 font-medium text-font-base text-sm">Purpose/Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-bd hover:bg-bg-subtle">
                        <td className="p-3 text-sm text-font-detail">Dec 8, 2024 2:45 PM</td>
                        <td className="p-3"><span className="bg-success text-white px-2 py-1 rounded text-xs">Added</span></td>
                        <td className="p-3 text-sm font-medium">Toothpaste - Colgate</td>
                        <td className="p-3 text-sm text-font-detail">Toiletries</td>
                        <td className="p-3 text-sm font-medium text-success">+50</td>
                        <td className="p-3 text-sm text-font-detail">J. Smith</td>
                        <td className="p-3 text-sm text-font-detail">Monthly restock</td>
                      </tr>
                      <tr className="border-b border-bd hover:bg-bg-subtle">
                        <td className="p-3 text-sm text-font-detail">Dec 8, 2024 1:20 PM</td>
                        <td className="p-3"><span className="bg-error text-white px-2 py-1 rounded text-xs">Checkout</span></td>
                        <td className="p-3 text-sm font-medium">First Aid Kit</td>
                        <td className="p-3 text-sm text-font-detail">Medical</td>
                        <td className="p-3 text-sm font-medium text-error">-2</td>
                        <td className="p-3 text-sm text-font-detail">M. Johnson</td>
                        <td className="p-3 text-sm text-font-detail">Emergency use - Unit B</td>
                      </tr>
                      <tr className="border-b border-bd hover:bg-bg-subtle">
                        <td className="p-3 text-sm text-font-detail">Dec 8, 2024 11:05 AM</td>
                        <td className="p-3"><span className="bg-error text-white px-2 py-1 rounded text-xs">Checkout</span></td>
                        <td className="p-3 text-sm font-medium">T-Shirt - Medium</td>
                        <td className="p-3 text-sm text-font-detail">Clothing</td>
                        <td className="p-3 text-sm font-medium text-error">-5</td>
                        <td className="p-3 text-sm text-font-detail">L. Brown</td>
                        <td className="p-3 text-sm text-font-detail">Resident new arrivals</td>
                      </tr>
                      <tr className="border-b border-bd hover:bg-bg-subtle">
                        <td className="p-3 text-sm text-font-detail">Dec 7, 2024 4:30 PM</td>
                        <td className="p-3"><span className="bg-success text-white px-2 py-1 rounded text-xs">Added</span></td>
                        <td className="p-3 text-sm font-medium">Breakfast Cereal</td>
                        <td className="p-3 text-sm text-font-detail">Food</td>
                        <td className="p-3 text-sm font-medium text-success">+30</td>
                        <td className="p-3 text-sm text-font-detail">A. Davis</td>
                        <td className="p-3 text-sm text-font-detail">Weekly grocery delivery</td>
                      </tr>
                      <tr className="border-b border-bd hover:bg-bg-subtle">
                        <td className="p-3 text-sm text-font-detail">Dec 7, 2024 10:15 AM</td>
                        <td className="p-3"><span className="bg-error text-white px-2 py-1 rounded text-xs">Checkout</span></td>
                        <td className="p-3 text-sm font-medium">Pencils - #2</td>
                        <td className="p-3 text-sm text-font-detail">Stationery</td>
                        <td className="p-3 text-sm font-medium text-error">-25</td>
                        <td className="p-3 text-sm text-font-detail">S. Williams</td>
                        <td className="p-3 text-sm text-font-detail">Education program</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-bd bg-bg-subtle flex justify-between items-center">
                  <p className="text-sm text-font-detail">Showing 5 of 1,247 log entries</p>
                  <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-light">
                    View Full Log
                    <i className="fa-solid fa-arrow-right ml-2"></i>
                  </button>
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
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Staff Adding Items <span className="text-font-detail">(Auto-filled)</span></label>
                    <input 
                      type="text" 
                      value={currentStaff || 'Loading...'}
                      disabled
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm bg-bg-subtle text-font-detail cursor-not-allowed" 
                    />
                  </div>
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
                        <option>Other (Specify in Notes)</option>
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

          {activeTab === 'checkout' && (
            <div className="space-y-6">
              {/* Search and Filter Bar */}
              <div className="bg-white rounded-lg border border-bd p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Search items by name, category, or location..."
                      className="w-full border border-bd-input rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                  <select className="border border-bd-input rounded-lg px-3 py-2.5 text-sm focus:border-primary">
                    <option>All Categories</option>
                    <option>Food</option>
                    <option>Clothing</option>
                    <option>Toiletries</option>
                    <option>Medical</option>
                    <option>Stationery</option>
                  </select>
                  <select className="border border-bd-input rounded-lg px-3 py-2.5 text-sm focus:border-primary">
                    <option>All Locations</option>
                    <option>Shelf A</option>
                    <option>Shelf B</option>
                    <option>Pantry</option>
                    <option>Storage</option>
                    <option>Office</option>
                  </select>
                </div>
              </div>

              {/* Available Items Grid */}
              <div className="bg-white rounded-lg border border-bd p-6">
                <h3 className="text-lg font-semibold text-font-base mb-6 flex items-center">
                  <i className="fa-solid fa-shopping-cart text-primary mr-3"></i>
                  Available Items - Browse & Checkout
                </h3>
                
                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Item Card 1 */}
                  <div className="border border-bd rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-font-base mb-1">Toothpaste - Colgate</h4>
                        <p className="text-xs text-font-detail">Toiletries</p>
                      </div>
                      <span className="bg-error text-white px-2 py-1 rounded text-xs">Critical</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-box w-4 mr-2"></i>
                        <span className="font-medium text-error">2 units available</span>
                      </div>
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-location-dot w-4 mr-2"></i>
                        <span>Shelf A-2</span>
                      </div>
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-triangle-exclamation w-4 mr-2"></i>
                        <span>Min: 15 units</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="Qty"
                        min="1" 
                        max="2"
                        defaultValue="1"
                        className="w-20 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" 
                      />
                      <button className="flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-light">
                        <i className="fa-solid fa-cart-plus mr-1"></i>
                        Checkout
                      </button>
                    </div>
                  </div>

                  {/* Item Card 2 */}
                  <div className="border border-bd rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-font-base mb-1">Breakfast Cereal</h4>
                        <p className="text-xs text-font-detail">Food</p>
                      </div>
                      <span className="bg-warning text-white px-2 py-1 rounded text-xs">Low</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-box w-4 mr-2"></i>
                        <span className="font-medium text-warning">8 units available</span>
                      </div>
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-location-dot w-4 mr-2"></i>
                        <span>Pantry B-1</span>
                      </div>
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-triangle-exclamation w-4 mr-2"></i>
                        <span>Min: 20 units</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="Qty"
                        min="1" 
                        max="8"
                        defaultValue="1"
                        className="w-20 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" 
                      />
                      <button className="flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-light">
                        <i className="fa-solid fa-cart-plus mr-1"></i>
                        Checkout
                      </button>
                    </div>
                  </div>

                  {/* Item Card 3 */}
                  <div className="border border-bd rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-font-base mb-1">T-Shirt - Medium</h4>
                        <p className="text-xs text-font-detail">Clothing</p>
                      </div>
                      <span className="bg-success text-white px-2 py-1 rounded text-xs">Good</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-box w-4 mr-2"></i>
                        <span className="font-medium text-success">45 units available</span>
                      </div>
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-location-dot w-4 mr-2"></i>
                        <span>Storage C-3</span>
                      </div>
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-check-circle w-4 mr-2"></i>
                        <span>Min: 30 units</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="Qty"
                        min="1" 
                        max="45"
                        defaultValue="1"
                        className="w-20 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" 
                      />
                      <button className="flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-light">
                        <i className="fa-solid fa-cart-plus mr-1"></i>
                        Checkout
                      </button>
                    </div>
                  </div>

                  {/* Item Card 4 */}
                  <div className="border border-bd rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-font-base mb-1">First Aid Kit</h4>
                        <p className="text-xs text-font-detail">Medical</p>
                      </div>
                      <span className="bg-success text-white px-2 py-1 rounded text-xs">Good</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-box w-4 mr-2"></i>
                        <span className="font-medium text-success">12 units available</span>
                      </div>
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-location-dot w-4 mr-2"></i>
                        <span>Med Cabinet</span>
                      </div>
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-check-circle w-4 mr-2"></i>
                        <span>Min: 5 units</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="Qty"
                        min="1" 
                        max="12"
                        defaultValue="1"
                        className="w-20 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" 
                      />
                      <button className="flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-light">
                        <i className="fa-solid fa-cart-plus mr-1"></i>
                        Checkout
                      </button>
                    </div>
                  </div>

                  {/* Item Card 5 */}
                  <div className="border border-bd rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-font-base mb-1">Pencils - #2</h4>
                        <p className="text-xs text-font-detail">Stationery</p>
                      </div>
                      <span className="bg-success text-white px-2 py-1 rounded text-xs">Good</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-box w-4 mr-2"></i>
                        <span className="font-medium text-success">120 units available</span>
                      </div>
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-location-dot w-4 mr-2"></i>
                        <span>Office D-1</span>
                      </div>
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-check-circle w-4 mr-2"></i>
                        <span>Min: 50 units</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="Qty"
                        min="1" 
                        max="120"
                        defaultValue="1"
                        className="w-20 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" 
                      />
                      <button className="flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-light">
                        <i className="fa-solid fa-cart-plus mr-1"></i>
                        Checkout
                      </button>
                    </div>
                  </div>

                  {/* Item Card 6 */}
                  <div className="border border-bd rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-font-base mb-1">Hand Sanitizer</h4>
                        <p className="text-xs text-font-detail">Toiletries</p>
                      </div>
                      <span className="bg-success text-white px-2 py-1 rounded text-xs">Good</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-box w-4 mr-2"></i>
                        <span className="font-medium text-success">35 units available</span>
                      </div>
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-location-dot w-4 mr-2"></i>
                        <span>Shelf A-5</span>
                      </div>
                      <div className="flex items-center text-xs text-font-detail">
                        <i className="fa-solid fa-check-circle w-4 mr-2"></i>
                        <span>Min: 20 units</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="Qty"
                        min="1" 
                        max="35"
                        defaultValue="1"
                        className="w-20 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" 
                      />
                      <button className="flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-light">
                        <i className="fa-solid fa-cart-plus mr-1"></i>
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requisition' && (
            <div className="bg-white rounded-lg border border-bd p-6">
                <h3 className="text-lg font-semibold text-font-base mb-6 flex items-center">
                  <i className="fa-solid fa-file-invoice text-primary mr-3"></i>
                  Create New Requisition
                </h3>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Requested By <span className="text-font-detail">(Auto-filled)</span></label>
                      <input 
                        type="text" 
                        value={currentStaff || 'Loading...'}
                        disabled
                        className="w-full border border-bd rounded-lg px-3 py-2 text-sm bg-bg-subtle text-font-detail cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Request Date</label>
                      <input 
                        type="date" 
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Item Name <span className="text-error">*</span></label>
                      <input 
                        type="text" 
                        placeholder="Enter item name"
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Category <span className="text-error">*</span></label>
                      <select className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                        <option>Select Category</option>
                        <option>Food</option>
                        <option>Clothing</option>
                        <option>Toiletries</option>
                        <option>Medical</option>
                        <option>Stationery</option>
                        <option>Cleaning Supplies</option>
                        <option>Equipment</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Quantity Needed <span className="text-error">*</span></label>
                      <input 
                        type="number" 
                        placeholder="0" 
                        min="1"
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Unit of Measurement</label>
                      <select className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                        <option>Units</option>
                        <option>Boxes</option>
                        <option>Packs</option>
                        <option>Bottles</option>
                        <option>Pairs</option>
                        <option>Sets</option>
                        <option>Kg</option>
                        <option>Liters</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Priority <span className="text-error">*</span></label>
                      <select className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                        <option>Standard</option>
                        <option>Urgent</option>
                        <option>Emergency</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Estimated Cost (Optional)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-font-detail">$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00" 
                          className="w-full border border-bd-input rounded-lg pl-8 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Preferred Vendor/Supplier</label>
                      <input 
                        type="text" 
                        placeholder="e.g., ABC Supplies Co."
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Justification/Purpose <span className="text-error">*</span></label>
                    <textarea 
                      placeholder="Explain why this item is needed and how it will be used..." 
                      rows={4} 
                      className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Additional Notes</label>
                    <textarea 
                      placeholder="Any specifications, brand preferences, or special requirements..." 
                      rows={3} 
                      className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    ></textarea>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-info-lightest border border-info rounded-lg">
                    <i className="fa-solid fa-info-circle text-info text-xl"></i>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-font-base">Review Process</p>
                      <p className="text-xs text-font-detail">All requisitions require supervisor approval before procurement. You'll be notified via email once reviewed.</p>
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-light flex-1">
                      <i className="fa-solid fa-paper-plane mr-2"></i>
                      Submit Requisition
                    </button>
                    <button type="button" className="bg-primary-lightest text-primary px-6 py-2 rounded-lg font-medium hover:bg-primary-lighter">
                      <i className="fa-solid fa-eraser mr-2"></i>
                      Clear Form
                    </button>
                  </div>
                </form>
              </div>
          )}

          {activeTab === 'requisition-archive' && (
            <div className="bg-white rounded-lg border border-bd">
              <div className="p-6 border-b border-bd">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-font-base">Requisition Archive</h3>
                  <div className="flex items-center space-x-3">
                    <select className="border border-bd rounded-lg px-3 py-2 text-sm">
                      <option>All Statuses</option>
                      <option>Pending</option>
                      <option>Under Review</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                      <option>Fulfilled</option>
                      <option>Cancelled</option>
                    </select>
                    <select className="border border-bd rounded-lg px-3 py-2 text-sm">
                      <option>All Categories</option>
                      <option>Food</option>
                      <option>Clothing</option>
                      <option>Toiletries</option>
                      <option>Medical</option>
                      <option>Stationery</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Search requisitions..." 
                      className="border border-bd rounded-lg px-3 py-2 text-sm w-56" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-warning-lightest p-4 rounded-lg border border-warning">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-font-detail font-medium">Pending</p>
                        <p className="text-2xl font-bold text-warning mt-1">12</p>
                      </div>
                      <i className="fa-solid fa-clock text-warning text-2xl"></i>
                    </div>
                  </div>
                  <div className="bg-info-lightest p-4 rounded-lg border border-info">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-font-detail font-medium">Under Review</p>
                        <p className="text-2xl font-bold text-info mt-1">8</p>
                      </div>
                      <i className="fa-solid fa-search text-info text-2xl"></i>
                    </div>
                  </div>
                  <div className="bg-success-lightest p-4 rounded-lg border border-success">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-font-detail font-medium">Approved</p>
                        <p className="text-2xl font-bold text-success mt-1">45</p>
                      </div>
                      <i className="fa-solid fa-check-circle text-success text-2xl"></i>
                    </div>
                  </div>
                  <div className="bg-error-lightest p-4 rounded-lg border border-error">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-font-detail font-medium">Rejected</p>
                        <p className="text-2xl font-bold text-error mt-1">3</p>
                      </div>
                      <i className="fa-solid fa-times-circle text-error text-2xl"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-bg-subtle border-b border-bd">
                    <tr>
                      <th className="text-left p-3 font-medium text-font-base">Req ID</th>
                      <th className="text-left p-3 font-medium text-font-base">Date</th>
                      <th className="text-left p-3 font-medium text-font-base">Item</th>
                      <th className="text-left p-3 font-medium text-font-base">Category</th>
                      <th className="text-left p-3 font-medium text-font-base">Quantity</th>
                      <th className="text-left p-3 font-medium text-font-base">Priority</th>
                      <th className="text-left p-3 font-medium text-font-base">Requested By</th>
                      <th className="text-left p-3 font-medium text-font-base">Status</th>
                      <th className="text-left p-3 font-medium text-font-base">Reviewed By</th>
                      <th className="text-left p-3 font-medium text-font-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-bd hover:bg-bg-subtle">
                      <td className="p-3 text-font-base font-medium">#REQ-2024-001</td>
                      <td className="p-3 text-font-detail">Dec 5, 2024</td>
                      <td className="p-3 text-font-base">First Aid Kit</td>
                      <td className="p-3 text-font-detail">Medical</td>
                      <td className="p-3 text-font-detail">20 units</td>
                      <td className="p-3"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Urgent</span></td>
                      <td className="p-3 text-font-detail">J. Smith</td>
                      <td className="p-3"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Pending</span></td>
                      <td className="p-3 text-font-detail">-</td>
                      <td className="p-3">
                        <button className="text-primary hover:text-primary-dark" title="View Details">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-bd hover:bg-bg-subtle">
                      <td className="p-3 text-font-base font-medium">#REQ-2024-002</td>
                      <td className="p-3 text-font-detail">Dec 3, 2024</td>
                      <td className="p-3 text-font-base">Office Supplies</td>
                      <td className="p-3 text-font-detail">Stationery</td>
                      <td className="p-3 text-font-detail">50 units</td>
                      <td className="p-3"><span className="bg-primary text-white px-2 py-1 rounded text-xs">Standard</span></td>
                      <td className="p-3 text-font-detail">M. Johnson</td>
                      <td className="p-3"><span className="bg-info text-white px-2 py-1 rounded text-xs">Under Review</span></td>
                      <td className="p-3 text-font-detail">A. Davis</td>
                      <td className="p-3">
                        <button className="text-primary hover:text-primary-dark" title="View Details">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-bd hover:bg-bg-subtle">
                      <td className="p-3 text-font-base font-medium">#REQ-2024-003</td>
                      <td className="p-3 text-font-detail">Dec 1, 2024</td>
                      <td className="p-3 text-font-base">Cleaning Products</td>
                      <td className="p-3 text-font-detail">Cleaning</td>
                      <td className="p-3 text-font-detail">10 units</td>
                      <td className="p-3"><span className="bg-primary text-white px-2 py-1 rounded text-xs">Standard</span></td>
                      <td className="p-3 text-font-detail">J. Smith</td>
                      <td className="p-3"><span className="bg-success text-white px-2 py-1 rounded text-xs">Approved</span></td>
                      <td className="p-3 text-font-detail">S. Williams</td>
                      <td className="p-3">
                        <button className="text-primary hover:text-primary-dark" title="View Details">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-bd hover:bg-bg-subtle">
                      <td className="p-3 text-font-base font-medium">#REQ-2024-004</td>
                      <td className="p-3 text-font-detail">Nov 28, 2024</td>
                      <td className="p-3 text-font-base">T-Shirts - Large</td>
                      <td className="p-3 text-font-detail">Clothing</td>
                      <td className="p-3 text-font-detail">30 units</td>
                      <td className="p-3"><span className="bg-primary text-white px-2 py-1 rounded text-xs">Standard</span></td>
                      <td className="p-3 text-font-detail">L. Brown</td>
                      <td className="p-3"><span className="bg-success text-white px-2 py-1 rounded text-xs">Fulfilled</span></td>
                      <td className="p-3 text-font-detail">S. Williams</td>
                      <td className="p-3">
                        <button className="text-primary hover:text-primary-dark" title="View Details">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-bd hover:bg-bg-subtle">
                      <td className="p-3 text-font-base font-medium">#REQ-2024-005</td>
                      <td className="p-3 text-font-detail">Nov 25, 2024</td>
                      <td className="p-3 text-font-base">Tablets - iPad</td>
                      <td className="p-3 text-font-detail">Equipment</td>
                      <td className="p-3 text-font-detail">5 units</td>
                      <td className="p-3"><span className="bg-error text-white px-2 py-1 rounded text-xs">Emergency</span></td>
                      <td className="p-3 text-font-detail">M. Johnson</td>
                      <td className="p-3"><span className="bg-error text-white px-2 py-1 rounded text-xs">Rejected</span></td>
                      <td className="p-3 text-font-detail">A. Davis</td>
                      <td className="p-3">
                        <button className="text-primary hover:text-primary-dark" title="View Details">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-bd bg-bg-subtle flex justify-between items-center">
                <p className="text-sm text-font-detail">Showing 5 of 68 requisitions</p>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-bd rounded hover:bg-white text-sm">
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button className="px-3 py-1 bg-primary text-white rounded text-sm">1</button>
                  <button className="px-3 py-1 border border-bd rounded hover:bg-white text-sm">2</button>
                  <button className="px-3 py-1 border border-bd rounded hover:bg-white text-sm">3</button>
                  <button className="px-3 py-1 border border-bd rounded hover:bg-white text-sm">
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
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
