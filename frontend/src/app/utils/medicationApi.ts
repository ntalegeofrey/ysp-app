/**
 * Medication API Service
 * Handles all API calls for the medication management module
 */

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

// ============ RESIDENT MEDICATIONS ============

export const addResidentMedication = async (programId: number, data: {
  residentId: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  initialCount: number;
  prescribingPhysician?: string;
  specialInstructions?: string;
  prescriptionDate?: string;
}) => {
  const res = await fetch(`${API_BASE}/programs/${programId}/medications`, {
    method: 'POST',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to add medication' }));
    throw new Error(error.error || 'Failed to add medication');
  }
  
  return res.json();
};

export const getProgramMedications = async (programId: number) => {
  const res = await fetch(`${API_BASE}/programs/${programId}/medications`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) throw new Error('Failed to fetch medications');
  return res.json();
};

export const getResidentMedications = async (programId: number, residentId: number) => {
  const res = await fetch(`${API_BASE}/programs/${programId}/medications/resident/${residentId}`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) throw new Error('Failed to fetch resident medications');
  return res.json();
};

export const updateMedicationCount = async (programId: number, medicationId: number, count: number) => {
  const res = await fetch(`${API_BASE}/programs/${programId}/medications/${medicationId}/count`, {
    method: 'PATCH',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify({ count }),
  });
  
  if (!res.ok) throw new Error('Failed to update medication count');
  return res.json();
};

export const discontinueMedication = async (programId: number, medicationId: number) => {
  const res = await fetch(`${API_BASE}/programs/${programId}/medications/${medicationId}/discontinue`, {
    method: 'PATCH',
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) throw new Error('Failed to discontinue medication');
  return res.json();
};

// ============ MEDICATION ADMINISTRATION ============

export const logAdministration = async (programId: number, data: {
  residentId: number;
  residentMedicationId: number;
  administrationDate: string;
  administrationTime: string;
  shift: string;
  action: string;
  notes?: string;
  wasLate?: boolean;
  minutesLate?: number;
}) => {
  const res = await fetch(`${API_BASE}/programs/${programId}/medications/administrations`, {
    method: 'POST',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to log administration' }));
    throw new Error(error.error || 'Failed to log administration');
  }
  
  return res.json();
};

export const getAdministrations = async (
  programId: number,
  startDate?: string,
  endDate?: string,
  page = 0,
  size = 20
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const res = await fetch(`${API_BASE}/programs/${programId}/medications/administrations?${params}`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) throw new Error('Failed to fetch administrations');
  return res.json();
};

// ============ MEDICATION AUDITS ============

export const submitAudit = async (programId: number, data: {
  auditDate: string;
  auditTime: string;
  shift: string;
  auditNotes?: string;
  counts: Array<{
    residentId: number;
    residentMedicationId: number;
    previousCount: number;
    currentCount: number;
    notes?: string;
  }>;
}) => {
  const res = await fetch(`${API_BASE}/programs/${programId}/medications/audits`, {
    method: 'POST',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to submit audit' }));
    throw new Error(error.error || 'Failed to submit audit');
  }
  
  return res.json();
};

export const getPendingAudits = async (programId: number) => {
  const res = await fetch(`${API_BASE}/programs/${programId}/medications/audits/pending`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) throw new Error('Failed to fetch pending audits');
  return res.json();
};

export const approveAudit = async (programId: number, auditId: number, data: {
  status: 'APPROVED' | 'DENIED';
  approvalNotes: string;
}) => {
  const res = await fetch(`${API_BASE}/programs/${programId}/medications/audits/${auditId}/approval`, {
    method: 'PATCH',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to process approval' }));
    throw new Error(error.error || 'Failed to process approval');
  }
  
  return res.json();
};

export const getAudits = async (
  programId: number,
  filters?: {
    status?: string;
    shift?: string;
    startDate?: string;
    endDate?: string;
    hasDiscrepancies?: boolean;
    page?: number;
    size?: number;
  }
) => {
  const params = new URLSearchParams({
    page: (filters?.page || 0).toString(),
    size: (filters?.size || 20).toString(),
  });
  
  if (filters?.status) params.append('status', filters.status);
  if (filters?.shift) params.append('shift', filters.shift);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.hasDiscrepancies !== undefined) params.append('hasDiscrepancies', filters.hasDiscrepancies.toString());
  
  const res = await fetch(`${API_BASE}/programs/${programId}/medications/audits?${params}`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) throw new Error('Failed to fetch audits');
  return res.json();
};

// ============ MEDICATION ALERTS ============

export const getActiveAlerts = async (programId: number) => {
  const res = await fetch(`${API_BASE}/programs/${programId}/medications/alerts`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
};

export const resolveAlert = async (programId: number, alertId: number) => {
  const res = await fetch(`${API_BASE}/programs/${programId}/medications/alerts/${alertId}/resolve`, {
    method: 'PATCH',
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) throw new Error('Failed to resolve alert');
  return res.json();
};

export const createAlert = async (programId: number, data: {
  residentId?: number;
  medicationId?: number;
  alertType: string;
  title: string;
  description: string;
}) => {
  const res = await fetch(`${API_BASE}/programs/${programId}/medications/alerts`, {
    method: 'POST',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!res.ok) throw new Error('Failed to create alert');
  return res.json();
};
