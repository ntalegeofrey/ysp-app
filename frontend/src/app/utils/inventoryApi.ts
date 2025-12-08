const API_BASE = '/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Get program ID from localStorage
const getProgramId = () => {
  if (typeof window !== 'undefined') {
    const programStr = localStorage.getItem('selectedProgram');
    if (programStr) {
      try {
        const program = JSON.parse(programStr);
        return program.id;
      } catch (e) {
        console.error('Failed to parse selectedProgram:', e);
      }
    }
  }
  return null;
};

// Add new inventory item
export const addInventoryItem = async (itemData: {
  itemName: string;
  category: string;
  description?: string;
  quantity: number;
  minimumQuantity: number;
  unitOfMeasurement?: string;
  location?: string;
  storageZone?: string;
  notes?: string;
}) => {
  const programId = getProgramId();
  
  const response = await fetch(`${API_BASE}/programs/${programId}/inventory/items`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(itemData),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to add item');
  }
  
  return response.json();
};

// Get all inventory items
export const getInventoryItems = async () => {
  const programId = getProgramId();
  
  const response = await fetch(`${API_BASE}/programs/${programId}/inventory/items`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch inventory items');
  }
  
  return response.json();
};

// Filter inventory items
export const filterInventoryItems = async (filters: {
  category?: string;
  status?: string;
  searchTerm?: string;
  page?: number;
  size?: number;
}) => {
  const programId = getProgramId();
  
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.status) params.append('status', filters.status);
  if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
  if (filters.page !== undefined) params.append('page', filters.page.toString());
  if (filters.size !== undefined) params.append('size', filters.size.toString());
  
  const response = await fetch(
    `${API_BASE}/programs/${programId}/inventory/items/filter?${params}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to filter inventory items');
  }
  
  return response.json();
};

// Checkout items
export const checkoutInventoryItem = async (checkoutData: {
  inventoryItemId: number;
  quantity: number;
  purpose: string;
  recipientDepartment?: string;
  notes: string;
}) => {
  const programId = getProgramId();
  
  const response = await fetch(`${API_BASE}/programs/${programId}/inventory/checkout`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(checkoutData),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to checkout item');
  }
  
  return response.json();
};

// Get transaction history (log)
export const getTransactionHistory = async (filters?: {
  transactionType?: string;
  category?: string;
  searchTerm?: string;
  page?: number;
  size?: number;
}) => {
  const programId = getProgramId();
  
  const params = new URLSearchParams();
  if (filters?.transactionType) params.append('transactionType', filters.transactionType);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
  if (filters?.page !== undefined) params.append('page', filters.page.toString());
  if (filters?.size !== undefined) params.append('size', filters.size.toString());
  
  const response = await fetch(
    `${API_BASE}/programs/${programId}/inventory/transactions?${params}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch transaction history');
  }
  
  return response.json();
};

// Get inventory statistics
export const getInventoryStats = async () => {
  const programId = getProgramId();
  
  const response = await fetch(`${API_BASE}/programs/${programId}/inventory/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch inventory stats');
  }
  
  return response.json();
};

// Create requisition
export const createRequisition = async (requisitionData: {
  itemName: string;
  category: string;
  quantityRequested: number;
  unitOfMeasurement?: string;
  priority: string;
  justification: string;
  additionalNotes?: string;
  estimatedCost?: number;
  preferredVendor?: string;
  requestDate: string;
}) => {
  const programId = getProgramId();
  
  const response = await fetch(`${API_BASE}/programs/${programId}/inventory/requisitions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(requisitionData),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to create requisition');
  }
  
  return response.json();
};

// Get requisitions
export const getRequisitions = async (filters?: {
  status?: string;
  category?: string;
  priority?: string;
  searchTerm?: string;
  page?: number;
  size?: number;
}) => {
  const programId = getProgramId();
  
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.priority) params.append('priority', filters.priority);
  if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
  if (filters?.page !== undefined) params.append('page', filters.page.toString());
  if (filters?.size !== undefined) params.append('size', filters.size.toString());
  
  const response = await fetch(
    `${API_BASE}/programs/${programId}/inventory/requisitions?${params}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch requisitions');
  }
  
  return response.json();
};
