'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks/useToast';
import ToastContainer from '@/app/components/Toast';
import * as inventoryApi from '@/app/utils/inventoryApi';

// Type definitions for requisition form
interface RequisitionItem {
  itemName: string;
  category: string;
  quantityNeeded: string;
  unitOfMeasurement: string;
}

interface RequisitionFormData {
  priority: string;
  estimatedCost: string;
  preferredVendor: string;
  justification: string;
}

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'add' | 'checkout' | 'requisition' | 'requisition-archive' | 'audit'>('overview');
  const router = useRouter();
  const [currentStaff, setCurrentStaff] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('');
  const { toasts, addToast, removeToast} = useToast();
  const [programId, setProgramId] = useState<number | null>(null);
  
  // State for inventory items
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [recentlyAddedItems, setRecentlyAddedItems] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Add Item Form State
  const [addItemForm, setAddItemForm] = useState({
    itemName: '',
    category: '',
    description: '',
    quantity: '',
    minimumQuantity: '',
    unitOfMeasurement: 'Units',
    customUnit: '',
    location: '',
    notes: ''
  });
  
  // Checkout form state (for each item)
  const [checkoutForms, setCheckoutForms] = useState<{ [key: number]: { quantity: number } }>({});
  
  // Filter state for checkout tab
  const [checkoutFilters, setCheckoutFilters] = useState({
    search: '',
    category: '',
    location: ''
  });
  
  // Requisition form state - updated to support multiple items
  const [requisitionItems, setRequisitionItems] = useState<RequisitionItem[]>([
    { itemName: '', category: '', quantityNeeded: '', unitOfMeasurement: 'Units' }
  ]);
  
  const [requisitionForm, setRequisitionForm] = useState<RequisitionFormData>({
    priority: 'Standard',
    estimatedCost: '',
    preferredVendor: '',
    justification: ''
  });
  const [ccEmails, setCcEmails] = useState<string[]>(['']);
  
  // State for requisition archive
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [requisitionFilters, setRequisitionFilters] = useState({
    status: '',
    category: '',
    searchTerm: ''
  });
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null);
  
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
        setCurrentUserRole(user.role || '');
      }
    } catch (err) {
      console.error('Failed to parse user:', err);
    }
  }, []);

  // Get programId from localStorage
  useEffect(() => {
    const selectedProgram = localStorage.getItem('selectedProgram');
    if (selectedProgram) {
      try {
        const program = JSON.parse(selectedProgram);
        const id = program.id || program.programId;
        setProgramId(id);
      } catch (err) {
        console.error('Failed to parse selectedProgram:', err);
      }
    }
  }, []);
  
  // Fetch inventory items
  const fetchInventoryItems = async () => {
    if (!programId) return;
    try {
      const items = await inventoryApi.getInventoryItems(programId);
      setInventoryItems(items);
      
      // Get recently added (sort by createdAt, take top 5)
      const recent = [...items]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentlyAddedItems(recent);
    } catch (error: any) {
      console.error('Error fetching inventory:', error);
      addToast('Failed to fetch inventory items', 'error');
    }
  };
  
  // Fetch transaction history
  const fetchTransactions = async () => {
    if (!programId) return;
    try {
      const response = await inventoryApi.getTransactionHistory(programId, { page: 0, size: 10 });
      setTransactions(response.content || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
    }
  };
  
  // Load data on mount and tab change
  useEffect(() => {
    if (programId && activeTab === 'overview') {
      fetchTransactions();
      fetchInventoryItems(); // Also fetch for recently added section
    } else if (programId && activeTab === 'checkout') {
      fetchInventoryItems();
    }
  }, [programId, activeTab]);
  
  // Handle Add Item form submit
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!programId) {
        addToast('No program selected', 'error');
        return;
      }
      await inventoryApi.addInventoryItem(programId, {
        itemName: addItemForm.itemName,
        category: addItemForm.category,
        description: addItemForm.description,
        quantity: parseInt(addItemForm.quantity) || 0,
        minimumQuantity: parseInt(addItemForm.minimumQuantity) || 0,
        unitOfMeasurement: addItemForm.unitOfMeasurement === 'Other' ? addItemForm.customUnit : addItemForm.unitOfMeasurement,
        location: addItemForm.location,
        notes: addItemForm.notes
      });
      
      addToast(`${addItemForm.itemName} added successfully!`, 'success');
      
      // Reset form
      setAddItemForm({
        itemName: '',
        category: '',
        description: '',
        quantity: '',
        minimumQuantity: '',
        unitOfMeasurement: 'Units',
        customUnit: '',
        location: '',
        notes: ''
      });
      
      // Refresh data if on overview tab
      if (activeTab === 'overview') {
        fetchTransactions();
      }
    } catch (error: any) {
      console.error('Error adding item:', error);
      addToast('Failed to send. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Checkout
  const handleCheckout = async (item: any) => {
    const quantity = checkoutForms[item.id]?.quantity || 1;
    
    if (quantity <= 0) {
      addToast('Quantity must be greater than 0', 'warning');
      return;
    }
    
    if (quantity > item.currentQuantity) {
      addToast(`Only ${item.currentQuantity} units available`, 'error');
      return;
    }
    
    setLoading(true);
    
    if (!programId) {
      addToast('No program selected', 'error');
      return;
    }
    try {
      await inventoryApi.checkoutInventoryItem(programId, {
        inventoryItemId: item.id,
        quantity: quantity,
        purpose: 'Resident Use', // Default purpose
        notes: `Checked out ${quantity} ${item.unitOfMeasurement || 'units'} of ${item.itemName}`
      });
      
      addToast(`${quantity} ${item.itemName} checked out by ${currentStaff}`, 'success');
      
      // Reset quantity input
      setCheckoutForms(prev => ({
        ...prev,
        [item.id]: { quantity: 1 }
      }));
      
      // Refresh items
      fetchInventoryItems();
      
    } catch (error: any) {
      console.error('Error checking out item:', error);
      addToast('Failed to checkout. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle quantity change for checkout
  const handleQuantityChange = (itemId: number, value: string) => {
    const numValue = parseInt(value) || 1;
    setCheckoutForms(prev => ({
      ...prev,
      [itemId]: { quantity: numValue }
    }));
  };
  
  // Handle requisition submission
  const handleRequisitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!programId) {
      addToast('No program selected', 'error');
      return;
    }
    
    // Validate that at least one item is filled
    const validItems = requisitionItems.filter(item => 
      item.itemName.trim() && item.category && item.quantityNeeded
    );
    
    if (validItems.length === 0) {
      addToast('Please add at least one item with name, category, and quantity', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // Filter out empty CC emails
      const validCcEmails = ccEmails.filter(email => email.trim() !== '');
      
      const response = await fetch(`/api/programs/${programId}/inventory/requisitions`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: validItems,
          ...requisitionForm,
          ccEmails: validCcEmails
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit requisition');
      }
      
      addToast('Requisition submitted successfully! Supervisors will be notified.', 'success');
      
      // Clear form
      setRequisitionItems([
        { itemName: '', category: '', quantityNeeded: '', unitOfMeasurement: 'Units' }
      ]);
      setRequisitionForm({
        priority: 'Standard',
        estimatedCost: '',
        preferredVendor: '',
        justification: ''
      });
      setCcEmails(['']);
    } catch (error: any) {
      console.error('Error submitting requisition:', error);
      addToast('Failed to submit requisition', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch requisitions
  const fetchRequisitions = async () => {
    if (!programId) return;
    
    try {
      const params = new URLSearchParams();
      if (requisitionFilters.status) params.append('status', requisitionFilters.status);
      if (requisitionFilters.category) params.append('category', requisitionFilters.category);
      if (requisitionFilters.searchTerm) params.append('searchTerm', requisitionFilters.searchTerm);
      
      const response = await fetch(`/api/programs/${programId}/inventory/requisitions?${params}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequisitions(data.requisitions || []);
      }
    } catch (error) {
      console.error('Error fetching requisitions:', error);
    }
  };
  
  // Load requisitions when archive tab is active
  useEffect(() => {
    if (activeTab === 'requisition-archive' && programId) {
      fetchRequisitions();
    }
  }, [activeTab, programId, requisitionFilters]);
  
  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.action-menu-container')) {
        setOpenActionMenu(null);
      }
    };
    
    if (openActionMenu !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openActionMenu]);
  
  // Update requisition status
  const updateRequisitionStatus = async (requisitionId: number, newStatus: string, remarks?: string) => {
    if (!programId) return;
    
    // Check if user has admin permissions
    const isAdmin = currentUserRole === 'ADMIN' || currentUserRole === 'ADMINISTRATOR';
    if (!isAdmin) {
      addToast('Only administrators can update requisition status', 'error');
      return;
    }
    
    try {
      const response = await fetch(`/api/programs/${programId}/inventory/requisitions/${requisitionId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          remarks: remarks || ''
        })
      });
      
      if (response.ok) {
        addToast(`Requisition ${newStatus.toLowerCase().replace('_', ' ')} successfully`, 'success');
        fetchRequisitions(); // Refresh list
        setOpenActionMenu(null); // Close menu
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating requisition status:', error);
      addToast('Failed to update requisition status', 'error');
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

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
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-12">
                            <div className="text-center">
                              <i className="fa-solid fa-inbox text-5xl text-font-detail mb-4 block"></i>
                              <p className="text-font-detail text-sm">No transactions yet.</p>
                              <p className="text-font-detail text-xs mt-1">Add items or checkout to see activity here.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        transactions.map((transaction: any) => (
                          <tr key={transaction.id} className="border-b border-bd hover:bg-bg-subtle">
                            <td className="p-3 text-sm text-font-detail">{formatDate(transaction.transactionDate)}</td>
                            <td className="p-3">
                              <span className={`${transaction.transactionType === 'ADDITION' ? 'bg-success' : 'bg-error'} text-white px-2 py-1 rounded text-xs`}>
                                {transaction.transactionType === 'ADDITION' ? 'Added' : 'Checkout'}
                              </span>
                            </td>
                            <td className="p-3 text-sm font-medium">{transaction.itemName}</td>
                            <td className="p-3 text-sm text-font-detail">{transaction.category}</td>
                            <td className={`p-3 text-sm font-medium ${transaction.quantity > 0 ? 'text-success' : 'text-error'}`}>
                              {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                            </td>
                            <td className="p-3 text-sm text-font-detail">{transaction.staffName}</td>
                            <td className="p-3 text-sm text-font-detail">{transaction.purpose || transaction.notes || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-bd bg-bg-subtle flex justify-between items-center">
                  <p className="text-sm text-font-detail">Showing {transactions.length} recent transactions</p>
                  <button onClick={fetchTransactions} className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-light">
                    <i className="fa-solid fa-refresh mr-2"></i>
                    Refresh
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
                <form className="space-y-6" onSubmit={handleAddItem}>
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
                      <label className="block text-sm font-medium text-font-base mb-2">Item Name <span className="text-error">*</span></label>
                      <input 
                        type="text" 
                        placeholder="Enter item name"
                        value={addItemForm.itemName}
                        onChange={(e) => setAddItemForm({...addItemForm, itemName: e.target.value})}
                        required
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Category <span className="text-error">*</span></label>
                      <select 
                        value={addItemForm.category}
                        onChange={(e) => setAddItemForm({...addItemForm, category: e.target.value})}
                        required
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Select Category</option>
                        
                        {/* Food & Nutrition */}
                        <optgroup label="Food & Nutrition">
                          <option value="Food - Groceries">Food - Groceries</option>
                          <option value="Food - Snacks">Food - Snacks</option>
                          <option value="Food - Beverages">Food - Beverages</option>
                          <option value="Food - Baby Food">Food - Baby Food</option>
                          <option value="Food - Dietary/Special Needs">Food - Dietary/Special Needs</option>
                        </optgroup>
                        
                        {/* Clothing & Apparel */}
                        <optgroup label="Clothing & Apparel">
                          <option value="Clothing - Tops">Clothing - Tops</option>
                          <option value="Clothing - Bottoms">Clothing - Bottoms</option>
                          <option value="Clothing - Outerwear">Clothing - Outerwear</option>
                          <option value="Clothing - Underwear/Socks">Clothing - Underwear/Socks</option>
                          <option value="Clothing - Footwear">Clothing - Footwear</option>
                          <option value="Clothing - Sleepwear">Clothing - Sleepwear</option>
                          <option value="Clothing - Accessories">Clothing - Accessories</option>
                          <option value="Clothing - Seasonal">Clothing - Seasonal</option>
                        </optgroup>
                        
                        {/* Personal Care */}
                        <optgroup label="Personal Care & Hygiene">
                          <option value="Toiletries - Bath">Toiletries - Bath</option>
                          <option value="Toiletries - Oral Care">Toiletries - Oral Care</option>
                          <option value="Toiletries - Hair Care">Toiletries - Hair Care</option>
                          <option value="Toiletries - Skin Care">Toiletries - Skin Care</option>
                          <option value="Toiletries - Feminine Hygiene">Toiletries - Feminine Hygiene</option>
                          <option value="Toiletries - Diapers">Toiletries - Diapers</option>
                          <option value="Toiletries - First Aid">Toiletries - First Aid</option>
                        </optgroup>
                        
                        {/* Medical & Health */}
                        <optgroup label="Medical & Health">
                          <option value="Medical - Medications">Medical - Medications</option>
                          <option value="Medical - Vitamins/Supplements">Medical - Vitamins/Supplements</option>
                          <option value="Medical - First Aid Supplies">Medical - First Aid Supplies</option>
                          <option value="Medical - PPE">Medical - PPE</option>
                          <option value="Medical - Medical Devices">Medical - Medical Devices</option>
                        </optgroup>
                        
                        {/* Education & Stationery */}
                        <optgroup label="Education & Stationery">
                          <option value="Stationery - Writing Supplies">Stationery - Writing Supplies</option>
                          <option value="Stationery - Paper Products">Stationery - Paper Products</option>
                          <option value="Stationery - Art Supplies">Stationery - Art Supplies</option>
                          <option value="Stationery - School Supplies">Stationery - School Supplies</option>
                          <option value="Books & Reading Materials">Books & Reading Materials</option>
                        </optgroup>
                        
                        {/* Household & Cleaning */}
                        <optgroup label="Household & Cleaning">
                          <option value="Cleaning Supplies">Cleaning Supplies</option>
                          <option value="Laundry Supplies">Laundry Supplies</option>
                          <option value="Kitchen Supplies">Kitchen Supplies</option>
                          <option value="Bedding & Linens">Bedding & Linens</option>
                          <option value="Household Items">Household Items</option>
                        </optgroup>
                        
                        {/* Recreation & Activities */}
                        <optgroup label="Recreation & Activities">
                          <option value="Sports Equipment">Sports Equipment</option>
                          <option value="Toys & Games">Toys & Games</option>
                          <option value="Recreational Supplies">Recreational Supplies</option>
                          <option value="Entertainment">Entertainment</option>
                        </optgroup>
                        
                        {/* Electronics & Technology */}
                        <optgroup label="Electronics & Technology">
                          <option value="Electronics">Electronics</option>
                          <option value="Technology Supplies">Technology Supplies</option>
                          <option value="Batteries">Batteries</option>
                        </optgroup>
                        
                        {/* Facilities & Maintenance */}
                        <optgroup label="Facilities & Maintenance">
                          <option value="Tools & Equipment">Tools & Equipment</option>
                          <option value="Safety Equipment">Safety Equipment</option>
                          <option value="Maintenance Supplies">Maintenance Supplies</option>
                          <option value="Office Supplies">Office Supplies</option>
                        </optgroup>
                        
                        {/* Baby & Infant */}
                        <optgroup label="Baby & Infant Care">
                          <option value="Baby Care Products">Baby Care Products</option>
                          <option value="Baby Clothing">Baby Clothing</option>
                          <option value="Baby Equipment">Baby Equipment</option>
                        </optgroup>
                        
                        <option value="Other">Other (Specify in Notes)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Quantity <span className="text-error">*</span></label>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={addItemForm.quantity}
                        onChange={(e) => setAddItemForm({...addItemForm, quantity: e.target.value})}
                        required
                        min="0"
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Min. Level <span className="text-error">*</span></label>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={addItemForm.minimumQuantity}
                        onChange={(e) => setAddItemForm({...addItemForm, minimumQuantity: e.target.value})}
                        required
                        min="0"
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Unit of Measurement <span className="text-error">*</span></label>
                      <select 
                        value={addItemForm.unitOfMeasurement}
                        onChange={(e) => setAddItemForm({...addItemForm, unitOfMeasurement: e.target.value, customUnit: e.target.value === 'Other' ? addItemForm.customUnit : ''})}
                        required
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        <option value="Units">Units</option>
                        <option value="Pieces">Pieces</option>
                        <option value="Boxes">Boxes</option>
                        <option value="Packs">Packs</option>
                        <option value="Bottles">Bottles</option>
                        <option value="Cans">Cans</option>
                        <option value="Bags">Bags</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Pairs">Pairs</option>
                        <option value="Sets">Sets</option>
                        <option value="Kits">Kits</option>
                        <option value="Liters">Liters (L)</option>
                        <option value="Milliliters">Milliliters (mL)</option>
                        <option value="Gallons">Gallons</option>
                        <option value="Kilograms">Kilograms (kg)</option>
                        <option value="Grams">Grams (g)</option>
                        <option value="Pounds">Pounds (lb)</option>
                        <option value="Ounces">Ounces (oz)</option>
                        <option value="Meters">Meters (m)</option>
                        <option value="Feet">Feet (ft)</option>
                        <option value="Inches">Inches (in)</option>
                        <option value="Other">Other (Specify)</option>
                      </select>
                    </div>
                    {addItemForm.unitOfMeasurement === 'Other' && (
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Custom Unit <span className="text-error">*</span></label>
                        <input 
                          type="text" 
                          placeholder="e.g., Cartons, Pallets"
                          value={addItemForm.customUnit}
                          onChange={(e) => setAddItemForm({...addItemForm, customUnit: e.target.value})}
                          required={addItemForm.unitOfMeasurement === 'Other'}
                          className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                        />
                      </div>
                    )}
                    <div className={addItemForm.unitOfMeasurement !== 'Other' ? '' : 'md:col-span-2'}>
                      <label className="block text-sm font-medium text-font-base mb-2">Location</label>
                      <input 
                        type="text" 
                        placeholder="Shelf A-1"
                        value={addItemForm.location}
                        onChange={(e) => setAddItemForm({...addItemForm, location: e.target.value})}
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Notes (Optional)</label>
                    <textarea 
                      placeholder="Additional notes about this item" 
                      rows={3}
                      value={addItemForm.notes}
                      onChange={(e) => setAddItemForm({...addItemForm, notes: e.target.value})}
                      className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    ></textarea>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-light flex-1 disabled:opacity-50">
                      <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-plus'} mr-2`}></i>
                      {loading ? 'Adding...' : 'Add Item'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setAddItemForm({itemName: '', category: '', description: '', quantity: '', minimumQuantity: '', unitOfMeasurement: 'Units', customUnit: '', location: '', notes: ''})}
                      className="bg-primary-lightest text-primary px-6 py-2 rounded-lg font-medium hover:bg-primary-lighter"
                    >
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
                  {recentlyAddedItems.length === 0 ? (
                    <p className="text-sm text-font-detail text-center py-8">No items added yet</p>
                  ) : (
                    recentlyAddedItems.map((item) => {
                      const timeDiff = Date.now() - new Date(item.createdAt).getTime();
                      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                      const days = Math.floor(hours / 24);
                      const timeAgo = days > 0 ? `${days} day${days > 1 ? 's' : ''} ago` : 
                                      hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ago` : 
                                      'Just now';
                      
                      return (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-bd">
                          <div>
                            <p className="text-sm font-medium text-font-base">{item.itemName}</p>
                            <p className="text-xs text-font-detail">Added {timeAgo} by {item.createdByName || 'Unknown'}</p>
                          </div>
                          <div className="text-right">
                            <span className="bg-success text-white text-xs px-2 py-1 rounded">+{item.currentQuantity}</span>
                            <p className="text-xs text-font-detail mt-1">{item.location || 'No location'}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checkout' && (() => {
            // Extract unique categories and locations from inventory items
            const uniqueCategories = Array.from(new Set(
              inventoryItems.map(item => item.category).filter(Boolean)
            )).sort();
            
            const uniqueLocations = Array.from(new Set(
              inventoryItems.map(item => item.location).filter(Boolean)
            )).sort();
            
            return (
            <div className="space-y-6">
              {/* Search and Filter Bar */}
              <div className="bg-white rounded-lg border border-bd p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Search items by name, category, or location..."
                      value={checkoutFilters.search}
                      onChange={(e) => setCheckoutFilters({...checkoutFilters, search: e.target.value})}
                      className="w-full border border-bd-input rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                  <select 
                    value={checkoutFilters.category}
                    onChange={(e) => setCheckoutFilters({...checkoutFilters, category: e.target.value})}
                    className="border border-bd-input rounded-lg px-3 py-2.5 text-sm focus:border-primary"
                  >
                    <option value="">All Categories</option>
                    {uniqueCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select 
                    value={checkoutFilters.location}
                    onChange={(e) => setCheckoutFilters({...checkoutFilters, location: e.target.value})}
                    className="border border-bd-input rounded-lg px-3 py-2.5 text-sm focus:border-primary"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
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
                  {(() => {
                    // Apply filters
                    const filtered = inventoryItems.filter(item => {
                      const matchesSearch = !checkoutFilters.search || 
                        item.itemName.toLowerCase().includes(checkoutFilters.search.toLowerCase()) ||
                        item.category?.toLowerCase().includes(checkoutFilters.search.toLowerCase()) ||
                        item.location?.toLowerCase().includes(checkoutFilters.search.toLowerCase());
                      
                      const matchesCategory = !checkoutFilters.category || 
                        item.category?.includes(checkoutFilters.category);
                      
                      const matchesLocation = !checkoutFilters.location || 
                        item.location?.includes(checkoutFilters.location);
                      
                      return matchesSearch && matchesCategory && matchesLocation;
                    });
                    
                    if (filtered.length === 0) {
                      return (
                        <div className="col-span-full text-center py-12">
                          <i className="fa-solid fa-inbox text-5xl text-font-detail mb-4 block"></i>
                          <p className="text-font-detail">
                            {inventoryItems.length === 0 
                              ? 'No inventory items yet. Add items to see them here.'
                              : 'No items match your filters.'}
                          </p>
                        </div>
                      );
                    }
                    
                    return filtered.map((item: any) => {
                      const statusColor = item.status === 'CRITICAL' || item.status === 'OUT_OF_STOCK' ? 'error' :
                                        item.status === 'LOW' ? 'warning' : 'success';
                      const statusIcon = item.status === 'CRITICAL' || item.status === 'OUT_OF_STOCK' ? 'triangle-exclamation' :
                                       item.status === 'LOW' ? 'triangle-exclamation' : 'check-circle';
                      const quantityColor = statusColor === 'error' ? 'text-error' :
                                          statusColor === 'warning' ? 'text-warning' : 'text-success';
                      
                      return (
                        <div key={item.id} className="border border-bd rounded-lg p-4 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-font-base mb-1">{item.itemName}</h4>
                              <p className="text-xs text-font-detail">{item.category}</p>
                            </div>
                            <span className={`bg-${statusColor} text-white px-2 py-1 rounded text-xs`}>
                              {item.status === 'OUT_OF_STOCK' ? 'Out' : item.status === 'CRITICAL' ? 'Critical' : 
                               item.status === 'LOW' ? 'Low' : 'Good'}
                            </span>
                          </div>
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center text-xs text-font-detail">
                              <i className="fa-solid fa-box w-4 mr-2"></i>
                              <span className={`font-medium ${quantityColor}`}>
                                {item.currentQuantity} {item.unitOfMeasurement || 'units'} available
                              </span>
                            </div>
                            {item.location && (
                              <div className="flex items-center text-xs text-font-detail">
                                <i className="fa-solid fa-location-dot w-4 mr-2"></i>
                                <span>{item.location}</span>
                              </div>
                            )}
                            <div className="flex items-center text-xs text-font-detail">
                              <i className={`fa-solid fa-${statusIcon} w-4 mr-2`}></i>
                              <span>Min: {item.minimumQuantity} {item.unitOfMeasurement || 'units'}</span>
                            </div>
                          </div>
                          {item.currentQuantity > 0 ? (
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                placeholder="Qty"
                                min="1" 
                                max={item.currentQuantity}
                                value={checkoutForms[item.id]?.quantity || 1}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                className="w-20 border border-bd-input rounded px-2 py-1 text-sm focus:border-primary" 
                              />
                              <button 
                                onClick={() => handleCheckout(item)}
                                disabled={loading}
                                className="flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-light disabled:opacity-50"
                              >
                                <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-cart-plus'} mr-1`}></i>
                                Checkout
                              </button>
                            </div>
                          ) : (
                            <div className="bg-error-lightest text-error text-xs px-3 py-2 rounded text-center">
                              Out of Stock
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
            );
          })()}

          {activeTab === 'requisition' && (
            <div className="bg-white rounded-lg border border-bd p-6">
                <h3 className="text-lg font-semibold text-font-base mb-6 flex items-center">
                  <i className="fa-solid fa-file-invoice text-primary mr-3"></i>
                  Create New Requisition
                </h3>
                <form className="space-y-6" onSubmit={handleRequisitionSubmit}>
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
                  {/* Items Section */}
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-3">
                      Items Requested <span className="text-error">*</span>
                    </label>
                    <div className="space-y-3">
                      {requisitionItems.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 bg-bg-subtle rounded-lg border border-bd">
                          <div className="col-span-12 sm:col-span-4">
                            <label className="block text-xs font-medium text-font-detail mb-1">Item Name</label>
                            <input 
                              type="text" 
                              placeholder="e.g., Hand Soap"
                              value={item.itemName}
                              onChange={(e) => {
                                const newItems = [...requisitionItems];
                                newItems[index].itemName = e.target.value;
                                setRequisitionItems(newItems);
                              }}
                              className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                            />
                          </div>
                          <div className="col-span-12 sm:col-span-3">
                            <label className="block text-xs font-medium text-font-detail mb-1">Category</label>
                            <select 
                              value={item.category}
                              onChange={(e) => {
                                const newItems = [...requisitionItems];
                                newItems[index].category = e.target.value;
                                setRequisitionItems(newItems);
                              }}
                              className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                            >
                        <option value="">Select Category</option>
                        <optgroup label="Food & Nutrition">
                          <option value="Food - Groceries">Food - Groceries</option>
                          <option value="Food - Snacks">Food - Snacks</option>
                          <option value="Food - Beverages">Food - Beverages</option>
                          <option value="Food - Baby Food">Food - Baby Food</option>
                          <option value="Food - Dietary/Special Needs">Food - Dietary/Special Needs</option>
                        </optgroup>
                        <optgroup label="Clothing & Apparel">
                          <option value="Clothing - Tops">Clothing - Tops</option>
                          <option value="Clothing - Bottoms">Clothing - Bottoms</option>
                          <option value="Clothing - Outerwear">Clothing - Outerwear</option>
                          <option value="Clothing - Underwear/Socks">Clothing - Underwear/Socks</option>
                          <option value="Clothing - Footwear">Clothing - Footwear</option>
                          <option value="Clothing - Sleepwear">Clothing - Sleepwear</option>
                          <option value="Clothing - Accessories">Clothing - Accessories</option>
                          <option value="Clothing - Seasonal">Clothing - Seasonal</option>
                        </optgroup>
                        <optgroup label="Personal Care & Hygiene">
                          <option value="Toiletries - Bath">Toiletries - Bath</option>
                          <option value="Toiletries - Oral Care">Toiletries - Oral Care</option>
                          <option value="Toiletries - Hair Care">Toiletries - Hair Care</option>
                          <option value="Toiletries - Skin Care">Toiletries - Skin Care</option>
                          <option value="Toiletries - Feminine Hygiene">Toiletries - Feminine Hygiene</option>
                          <option value="Toiletries - Diapers">Toiletries - Diapers</option>
                          <option value="Toiletries - First Aid">Toiletries - First Aid</option>
                        </optgroup>
                        <optgroup label="Medical & Health">
                          <option value="Medical - Medications">Medical - Medications</option>
                          <option value="Medical - Vitamins/Supplements">Medical - Vitamins/Supplements</option>
                          <option value="Medical - First Aid Supplies">Medical - First Aid Supplies</option>
                          <option value="Medical - PPE">Medical - PPE</option>
                          <option value="Medical - Medical Devices">Medical - Medical Devices</option>
                        </optgroup>
                        <optgroup label="Education & Stationery">
                          <option value="Stationery - Writing Supplies">Stationery - Writing Supplies</option>
                          <option value="Stationery - Paper Products">Stationery - Paper Products</option>
                          <option value="Stationery - Art Supplies">Stationery - Art Supplies</option>
                          <option value="Stationery - School Supplies">Stationery - School Supplies</option>
                          <option value="Books & Reading Materials">Books & Reading Materials</option>
                        </optgroup>
                        <optgroup label="Household & Cleaning">
                          <option value="Cleaning Supplies">Cleaning Supplies</option>
                          <option value="Laundry Supplies">Laundry Supplies</option>
                          <option value="Kitchen Supplies">Kitchen Supplies</option>
                          <option value="Bedding & Linens">Bedding & Linens</option>
                          <option value="Household Items">Household Items</option>
                        </optgroup>
                        <optgroup label="Recreation & Activities">
                          <option value="Sports Equipment">Sports Equipment</option>
                          <option value="Toys & Games">Toys & Games</option>
                          <option value="Recreational Supplies">Recreational Supplies</option>
                          <option value="Entertainment">Entertainment</option>
                        </optgroup>
                        <optgroup label="Electronics & Technology">
                          <option value="Electronics">Electronics</option>
                          <option value="Technology Supplies">Technology Supplies</option>
                          <option value="Batteries">Batteries</option>
                        </optgroup>
                        <optgroup label="Facilities & Maintenance">
                          <option value="Tools & Equipment">Tools & Equipment</option>
                          <option value="Safety Equipment">Safety Equipment</option>
                          <option value="Maintenance Supplies">Maintenance Supplies</option>
                          <option value="Office Supplies">Office Supplies</option>
                        </optgroup>
                        <optgroup label="Baby & Infant Care">
                          <option value="Baby Care Products">Baby Care Products</option>
                          <option value="Baby Clothing">Baby Clothing</option>
                          <option value="Baby Equipment">Baby Equipment</option>
                        </optgroup>
                        <option value="Other">Other (Specify in Justification)</option>
                            </select>
                          </div>
                          <div className="col-span-6 sm:col-span-2">
                            <label className="block text-xs font-medium text-font-detail mb-1">Quantity</label>
                            <input 
                              type="number" 
                              placeholder="0"
                              min="1"
                              value={item.quantityNeeded}
                              onChange={(e) => {
                                const newItems = [...requisitionItems];
                                newItems[index].quantityNeeded = e.target.value;
                                setRequisitionItems(newItems);
                              }}
                              className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-2">
                            <label className="block text-xs font-medium text-font-detail mb-1">Unit</label>
                            <select 
                              value={item.unitOfMeasurement}
                              onChange={(e) => {
                                const newItems = [...requisitionItems];
                                newItems[index].unitOfMeasurement = e.target.value;
                                setRequisitionItems(newItems);
                              }}
                              className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                            >
                              <option value="Units">Units</option>
                              <option value="Pieces">Pieces</option>
                              <option value="Boxes">Boxes</option>
                              <option value="Packs">Packs</option>
                              <option value="Bottles">Bottles</option>
                              <option value="Cans">Cans</option>
                              <option value="Bags">Bags</option>
                              <option value="Rolls">Rolls</option>
                              <option value="Pairs">Pairs</option>
                              <option value="Sets">Sets</option>
                              <option value="Kits">Kits</option>
                              <option value="Liters">Liters (L)</option>
                              <option value="Milliliters">Milliliters (mL)</option>
                              <option value="Gallons">Gallons</option>
                              <option value="Kilograms">Kilograms (kg)</option>
                              <option value="Grams">Grams (g)</option>
                              <option value="Pounds">Pounds (lb)</option>
                              <option value="Ounces">Ounces (oz)</option>
                              <option value="Meters">Meters (m)</option>
                              <option value="Feet">Feet (ft)</option>
                              <option value="Inches">Inches (in)</option>
                              <option value="Other">Other (Specify)</option>
                            </select>
                          </div>
                          <div className="col-span-12 sm:col-span-1 flex items-end">
                            {requisitionItems.length > 1 && (
                              <button 
                                type="button"
                                onClick={() => setRequisitionItems(requisitionItems.filter((_, i) => i !== index))}
                                className="w-full bg-error-lightest text-error px-3 py-2 rounded-lg text-sm hover:bg-error-lighter"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => setRequisitionItems([...requisitionItems, { itemName: '', category: '', quantityNeeded: '', unitOfMeasurement: 'Units' }])}
                        className="w-full bg-primary-lightest text-primary px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-lighter border border-primary/20"
                      >
                        <i className="fa-solid fa-plus mr-2"></i>
                        Add Another Item
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Priority <span className="text-error">*</span></label>
                      <select 
                        value={requisitionForm.priority}
                        onChange={(e) => setRequisitionForm({...requisitionForm, priority: e.target.value})}
                        required
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                      >
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
                          value={requisitionForm.estimatedCost}
                          onChange={(e) => setRequisitionForm({...requisitionForm, estimatedCost: e.target.value})}
                          className="w-full border border-bd-input rounded-lg pl-8 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Preferred Vendor/Supplier (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="e.g., ABC Supplies Co."
                        value={requisitionForm.preferredVendor}
                        onChange={(e) => setRequisitionForm({...requisitionForm, preferredVendor: e.target.value})}
                        className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Justification/Purpose <span className="text-error">*</span></label>
                    <textarea 
                      placeholder="Explain why this item is needed and how it will be used..." 
                      rows={4}
                      value={requisitionForm.justification}
                      onChange={(e) => setRequisitionForm({...requisitionForm, justification: e.target.value})}
                      required
                      className="w-full border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Additional Email Recipients (CC)</label>
                    <p className="text-xs text-font-detail mb-2">Add email addresses of additional people to notify</p>
                    {ccEmails.map((email, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input 
                          type="email" 
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => {
                            const newEmails = [...ccEmails];
                            newEmails[index] = e.target.value;
                            setCcEmails(newEmails);
                          }}
                          className="flex-1 border border-bd-input rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                        />
                        {index === ccEmails.length - 1 ? (
                          <button 
                            type="button"
                            onClick={() => setCcEmails([...ccEmails, ''])}
                            className="bg-primary-lightest text-primary px-3 py-2 rounded-lg text-sm hover:bg-primary-lighter"
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        ) : (
                          <button 
                            type="button"
                            onClick={() => setCcEmails(ccEmails.filter((_, i) => i !== index))}
                            className="bg-error-lightest text-error px-3 py-2 rounded-lg text-sm hover:bg-error-lighter"
                          >
                            <i className="fa-solid fa-times"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-info-lightest border border-info rounded-lg">
                    <i className="fa-solid fa-info-circle text-info text-xl"></i>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-font-base">Review Process</p>
                      <p className="text-xs text-font-detail">All requisitions require supervisor approval before procurement. You'll be notified via email once reviewed.</p>
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-light flex-1 disabled:opacity-50">
                      <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'} mr-2`}></i>
                      {loading ? 'Submitting...' : 'Submit Requisition'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setRequisitionItems([
                          { itemName: '', category: '', quantityNeeded: '', unitOfMeasurement: 'Units' }
                        ]);
                        setRequisitionForm({
                          priority: 'Standard',
                          estimatedCost: '',
                          preferredVendor: '',
                          justification: ''
                        });
                        setCcEmails(['']);
                      }}
                      className="bg-primary-lightest text-primary px-6 py-2 rounded-lg font-medium hover:bg-primary-lighter"
                    >
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
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-font-base flex items-center">
                    <i className="fa-solid fa-folder-open text-primary mr-3"></i>
                    Requisition Archive
                  </h3>
                  <div className="flex items-center space-x-3">
                    <select 
                      value={requisitionFilters.status}
                      onChange={(e) => setRequisitionFilters({...requisitionFilters, status: e.target.value})}
                      className="border border-bd rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="APPROVED">Approved</option>
                      <option value="DECLINED">Declined</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="FULFILLED">Fulfilled</option>
                    </select>
                    <select 
                      value={requisitionFilters.category}
                      onChange={(e) => setRequisitionFilters({...requisitionFilters, category: e.target.value})}
                      className="border border-bd rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">All Categories</option>
                      <option value="Food">Food</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Toiletries">Toiletries</option>
                      <option value="Medical">Medical</option>
                      <option value="Stationery">Stationery</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Search requisitions..." 
                      value={requisitionFilters.searchTerm}
                      onChange={(e) => setRequisitionFilters({...requisitionFilters, searchTerm: e.target.value})}
                      className="border border-bd rounded-lg px-3 py-2 text-sm w-56" 
                    />
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
                      <th className="text-left p-3 font-medium text-font-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requisitions.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-bg-subtle rounded-full flex items-center justify-center mb-4">
                              <i className="fa-solid fa-inbox text-3xl text-font-detail"></i>
                            </div>
                            <p className="text-font-base font-medium mb-1">No Requisitions Found</p>
                            <p className="text-sm text-font-detail">
                              {requisitionFilters.status || requisitionFilters.category || requisitionFilters.searchTerm 
                                ? 'Try adjusting your filters to see more results' 
                                : 'Create a new requisition to get started'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      requisitions.map((req) => {
                        const isAdmin = currentUserRole === 'ADMIN' || currentUserRole === 'ADMINISTRATOR';
                        const statusColors: Record<string, string> = {
                          PENDING: 'bg-warning text-white',
                          UNDER_REVIEW: 'bg-info text-white',
                          APPROVED: 'bg-success text-white',
                          DECLINED: 'bg-error text-white',
                          REJECTED: 'bg-error text-white',
                          FULFILLED: 'bg-success text-white'
                        };
                        const priorityColors: Record<string, string> = {
                          URGENT: 'bg-warning text-white',
                          EMERGENCY: 'bg-error text-white',
                          STANDARD: 'bg-primary text-white'
                        };
                        
                        return (
                          <tr key={req.id} className="border-b border-bd hover:bg-bg-subtle">
                            <td className="p-3 text-font-base font-medium">{req.requisitionNumber}</td>
                            <td className="p-3 text-font-detail">{new Date(req.requestDate).toLocaleDateString()}</td>
                            <td className="p-3 text-font-base">{req.itemName}</td>
                            <td className="p-3 text-font-detail">{req.category}</td>
                            <td className="p-3 text-font-detail">{req.quantityRequested} {req.unitOfMeasurement}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs ${priorityColors[req.priority] || 'bg-primary text-white'}`}>
                                {req.priority}
                              </span>
                            </td>
                            <td className="p-3 text-font-detail">{req.requestedByName}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs ${statusColors[req.status] || 'bg-gray-500 text-white'}`}>
                                {req.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-3 relative">
                              {isAdmin ? (
                                <div className="relative action-menu-container">
                                  <button
                                    onClick={() => setOpenActionMenu(openActionMenu === req.id ? null : req.id)}
                                    className="text-font-base hover:text-primary px-3 py-1 rounded hover:bg-bg-subtle"
                                  >
                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                  </button>
                                  {openActionMenu === req.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-bd rounded-lg shadow-lg z-10 action-menu-container">
                                      <button
                                        onClick={() => updateRequisitionStatus(req.id, 'UNDER_REVIEW')}
                                        className="w-full text-left px-4 py-2 hover:bg-info-lightest text-info text-sm flex items-center"
                                      >
                                        <i className="fa-solid fa-search mr-2"></i>
                                        Mark Under Review
                                      </button>
                                      <button
                                        onClick={() => updateRequisitionStatus(req.id, 'APPROVED')}
                                        className="w-full text-left px-4 py-2 hover:bg-success-lightest text-success text-sm flex items-center"
                                      >
                                        <i className="fa-solid fa-check mr-2"></i>
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => updateRequisitionStatus(req.id, 'DECLINED')}
                                        className="w-full text-left px-4 py-2 hover:bg-error-lightest text-error text-sm flex items-center"
                                      >
                                        <i className="fa-solid fa-times mr-2"></i>
                                        Decline
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-font-detail text-xs">No actions</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-bd bg-bg-subtle flex justify-between items-center">
                <p className="text-sm text-font-detail">
                  {requisitions.length > 0 ? `Showing ${requisitions.length} requisition${requisitions.length !== 1 ? 's' : ''}` : 'No requisitions'}
                </p>
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
        
        <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
