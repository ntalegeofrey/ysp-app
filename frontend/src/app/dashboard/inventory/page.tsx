'use client';

export default function InventoryPage() {
  const inventory = [
    { id: 1, item: 'Medical Supplies', category: 'Healthcare', quantity: 150, unit: 'units', reorderLevel: 50, status: 'in-stock' },
    { id: 2, item: 'Cleaning Supplies', category: 'Maintenance', quantity: 25, unit: 'units', reorderLevel: 30, status: 'low-stock' },
    { id: 3, item: 'Office Supplies', category: 'Administrative', quantity: 200, unit: 'units', reorderLevel: 75, status: 'in-stock' },
    { id: 4, item: 'Food Items', category: 'Kitchen', quantity: 500, unit: 'units', reorderLevel: 200, status: 'in-stock' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-font-detail">Track and manage facility inventory</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition flex items-center gap-2">
          <i className="fa-solid fa-plus"></i>
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <i className="fa-solid fa-boxes-stacked text-xl"></i>
          </div>
          <p className="text-3xl font-bold text-font-heading mb-1">875</p>
          <p className="text-sm text-font-detail">Total Items</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
            <i className="fa-solid fa-check-circle text-xl"></i>
          </div>
          <p className="text-3xl font-bold text-font-heading mb-1">750</p>
          <p className="text-sm text-font-detail">In Stock</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mb-4">
            <i className="fa-solid fa-exclamation-triangle text-xl"></i>
          </div>
          <p className="text-3xl font-bold text-font-heading mb-1">25</p>
          <p className="text-sm text-font-detail">Low Stock</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4">
            <i className="fa-solid fa-times-circle text-xl"></i>
          </div>
          <p className="text-3xl font-bold text-font-heading mb-1">0</p>
          <p className="text-sm text-font-detail">Out of Stock</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-subtle">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Reorder Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bd">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-bg-subtle">
                <td className="px-6 py-4 font-medium text-font-base">{item.item}</td>
                <td className="px-6 py-4 text-font-detail">{item.category}</td>
                <td className="px-6 py-4 text-font-detail">{item.quantity} {item.unit}</td>
                <td className="px-6 py-4 text-font-detail">{item.reorderLevel} {item.unit}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'in-stock' ? 'bg-success-lightest text-success' : 'bg-warning-lightest text-warning'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
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
  );
}
