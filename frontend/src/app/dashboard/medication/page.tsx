'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/app/hooks/useToast';
import ToastContainer from '@/app/components/Toast';
import * as medicationApi from '@/app/utils/medicationApi';

type Alert = {
  id: number;
  type: 'critical' | 'warning' | 'info';
  time: string;
  title: string;
  description: string;
  resolved?: boolean;
};

type NewMed = {
  name: string;
  dosage: string;
  frequency: string;
  initialCount: string;
  physician: string;
  instructions: string;
};

type MedicationCount = {
  id?: number;
  medicationName: string;
  dosage: string;
  previousCount: number;
  currentCount: string;
  previousStaff: string;
  notes: string;
};

type ResidentMedCount = {
  residentId: string;
  residentName: string;
  medications: MedicationCount[];
};

type TabType = 'alerts' | 'add-medication' | 'med-sheets' | 'audit' | 'pending-approvals' | 'admin-archive' | 'audit-archive';

type PendingAudit = {
  id: number;
  date: string;
  time: string;
  shift: string;
  submittedBy: string;
  residentCount: number;
  medicationCount: number;
  hasDiscrepancies: boolean;
  auditData: {
    residentId: string;
    residentName: string;
    medications: {
      name: string;
      dosage: string;
      previousCount: number;
      currentCount: number;
      variance: number;
      notes: string;
    }[];
  }[];
};

export default function MedicationPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('alerts');
  const [currentStaff, setCurrentStaff] = useState('');
  const [selectedShift, setSelectedShift] = useState<'Morning' | 'Evening' | 'Night'>('Morning');
  const [auditNotes, setAuditNotes] = useState('');
  const [auditDate, setAuditDate] = useState(new Date().toISOString().split('T')[0]);
  const [auditTime, setAuditTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [adminArchiveFilter, setAdminArchiveFilter] = useState('');
  const [auditArchiveFilter, setAuditArchiveFilter] = useState('');
  const [adminArchiveDateFilter, setAdminArchiveDateFilter] = useState('');
  const [adminArchiveShiftFilter, setAdminArchiveShiftFilter] = useState('');
  const [auditArchiveDateFilter, setAuditArchiveDateFilter] = useState('');
  const [auditArchiveShiftFilter, setAuditArchiveShiftFilter] = useState('');
  const [userRole, setUserRole] = useState('');
  const [selectedAuditForApproval, setSelectedAuditForApproval] = useState<number | null>(null);
  const [nurseApprovalNotes, setNurseApprovalNotes] = useState('');
  const [programId, setProgramId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [residentsWithMeds, setResidentsWithMeds] = useState<any[]>([]);
  const [administrationData, setAdministrationData] = useState<Map<number, any>>(new Map());
  const [adminArchiveData, setAdminArchiveData] = useState<any[]>([]);
  const [auditArchiveData, setAuditArchiveData] = useState<any[]>([]);
  const [viewingAuditId, setViewingAuditId] = useState<number | null>(null);
  const [viewingAuditDetails, setViewingAuditDetails] = useState<any | null>(null);

  // Load user info and program ID
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const role = user.role || '';
        const fullName = `${firstName} ${lastName}`.trim();
        // Use multiple fallbacks like incident management
        const staffName = user.fullName || fullName || user.name || user.email || 'Unknown User';
        console.log('[Medication] Loading user:', { firstName, lastName, fullName, staffName, role });
        setCurrentStaff(staffName);
        setUserRole(role.toUpperCase());
      }
    } catch (err) {
      console.error('[Medication] Failed to parse user:', err);
    }
  }, []);

  // Get programId from localStorage
  useEffect(() => {
    const selectedProgram = localStorage.getItem('selectedProgram');
    if (selectedProgram) {
      try {
        const program = JSON.parse(selectedProgram);
        const id = program.id || program.programId;
        console.log('[Medication] Loading program:', { program, id });
        setProgramId(id);
      } catch (err) {
        console.error('[Medication] Failed to parse selectedProgram:', err);
      }
    }
  }, []);

  // Fetch alerts when program changes
  useEffect(() => {
    if (programId && activeTab === 'alerts') {
      fetchAlerts();
    }
  }, [programId, activeTab]);

  // Fetch data when tabs change
  useEffect(() => {
    if (programId && activeTab === 'audit') {
      fetchResidentMedsForAudit();
    }
  }, [programId, activeTab]);

  // Fetch archive data when tabs change
  useEffect(() => {
    if (programId && activeTab === 'admin-archive') {
      fetchAdminArchive();
    }
  }, [programId, activeTab]);

  useEffect(() => {
    if (programId && activeTab === 'audit-archive') {
      fetchAuditArchive();
    }
  }, [programId, activeTab]);

  // Fetch pending audits when tab changes OR on initial load for badge count
  useEffect(() => {
    if (programId && (activeTab === 'pending-approvals' || (userRole.includes('NURSE') || userRole.includes('ADMIN')))) {
      fetchPendingAudits();
    }
  }, [programId, activeTab]);

  // Fetch pending audits count on mount for badge (nurses/admins only)
  useEffect(() => {
    if (programId && (userRole.includes('NURSE') || userRole.includes('ADMIN'))) {
      fetchPendingAudits();
    }
  }, [programId, userRole]);

  // Fetch residents when needed
  useEffect(() => {
    if (programId && (activeTab === 'add-medication' || activeTab === 'med-sheets')) {
      fetchResidents();
    }
  }, [programId, activeTab]);

  // Fetch residents with medications for Med Sheets tab
  useEffect(() => {
    if (programId && activeTab === 'med-sheets') {
      fetchResidentsWithMedications();
    }
  }, [programId, activeTab]);

  const fetchResidents = async () => {
    if (!programId) {
      console.log('[Medication] Cannot fetch residents - no programId');
      return;
    }
    console.log('[Medication] Fetching residents for program:', programId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${programId}/residents`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      
      console.log('[Medication] Residents response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('[Medication] Residents loaded:', data.length, 'residents');
        setResidents(data);
      } else {
        const errorText = await res.text();
        console.error('[Medication] Failed to load residents:', res.status, errorText);
        addToast('Failed to load residents', 'error');
      }
    } catch (err) {
      console.error('[Medication] Failed to fetch residents:', err);
      addToast('Failed to load residents', 'error');
    }
  };

  const fetchResidentsWithMedications = async () => {
    if (!programId) return;
    try {
      // Fetch all program medications
      const allMeds = await medicationApi.getProgramMedications(programId);
      
      // Group medications by resident
      const residentMedsMap = new Map<number, any[]>();
      allMeds.forEach((med: any) => {
        const residentId = med.residentId;
        if (!residentMedsMap.has(residentId)) {
          residentMedsMap.set(residentId, []);
        }
        residentMedsMap.get(residentId)?.push(med);
      });
      
      // Fetch last administration for each resident
      const adminMap = new Map<number, any>();
      const residentIds = Array.from(residentMedsMap.keys());
      
      for (const residentId of residentIds) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`/api/programs/${programId}/medications/administrations/resident/${residentId}`, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (res.ok) {
            const logs = await res.json();
            // Get the most recent administration for each medication
            const medAdminMap: Record<string, any> = {};
            logs.forEach((log: any) => {
              const key = `${log.medicationName} ${log.dosage || ''}`;
              if (!medAdminMap[key] || new Date(log.administrationDate) > new Date(medAdminMap[key].administrationDate)) {
                medAdminMap[key] = log;
              }
            });
            adminMap.set(residentId, medAdminMap);
          }
        } catch (err) {
          console.error(`Failed to fetch administrations for resident ${residentId}:`, err);
        }
      }
      setAdministrationData(adminMap);
      
      // Fetch resident details and combine with medications
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${programId}/residents`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      
      if (res.ok) {
        const allResidents = await res.json();
        const residentsWithMedications = allResidents
          .filter((r: any) => residentMedsMap.has(r.id))
          .map((r: any) => ({
            id: r.id,
            name: `${r.firstName} ${r.lastName}`,
            firstName: r.firstName,
            lastName: r.lastName,
            medications: residentMedsMap.get(r.id) || [],
            activeMedCount: residentMedsMap.get(r.id)?.filter((m: any) => m.status === 'ACTIVE').length || 0,
          }));
        
        console.log('[Medication] Residents with meds:', residentsWithMedications.length);
        setResidentsWithMeds(residentsWithMedications);
      }
    } catch (err) {
      console.error('[Medication] Failed to fetch residents with medications:', err);
    }
  };

  const fetchAlerts = async () => {
    if (!programId) return;
    try {
      const data = await medicationApi.getActiveAlerts(programId);
      setAlerts(data.map((alert: any) => ({
        id: alert.id,
        type: alert.alertType.toLowerCase() as 'critical' | 'warning' | 'info',
        time: new Date(alert.createdAt).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        title: alert.title,
        description: alert.description,
        resolved: false,
      })));
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      addToast('Failed to load alerts', 'error');
    }
  };

  const fetchResidentMedsForAudit = async () => {
    if (!programId) return;
    setLoading(true);
    try {
      // Fetch all program medications
      const allMeds = await medicationApi.getProgramMedications(programId);
      
      // Group by resident
      const residentMap = new Map<number, any[]>();
      allMeds.forEach((med: any) => {
        if (med.status === 'ACTIVE') {
          if (!residentMap.has(med.residentId)) {
            residentMap.set(med.residentId, []);
          }
          residentMap.get(med.residentId)?.push(med);
        }
      });
      
      // Fetch resident details
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${programId}/residents`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      
      if (res.ok) {
        const residents = await res.json();
        const auditData: ResidentMedCount[] = [];
        
        Array.from(residentMap.keys()).forEach(residentId => {
          const resident = residents.find((r: any) => r.id === residentId);
          const meds = residentMap.get(residentId) || [];
          
          if (resident && meds.length > 0) {
            auditData.push({
              residentId: String(residentId),
              residentName: `${resident.firstName} ${resident.lastName}`,
              medications: meds.map((med: any) => ({
                id: med.id, // Store medication ID for submission
                medicationName: med.medicationName,
                dosage: med.dosage,
                previousCount: med.currentCount || 0,
                previousStaff: currentStaff,
                currentCount: '',
                notes: '',
              })),
            });
          }
        });
        
        setResidentMedCounts(auditData);
      }
    } catch (err) {
      console.error('Failed to fetch medications for audit:', err);
      addToast('Failed to load medications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingAudits = async () => {
    if (!programId) return;
    setLoading(true);
    try {
      const data = await medicationApi.getPendingAudits(programId);
      
      // Transform backend data to match UI expectations
      const formattedAudits = data.map((audit: any) => {
        // Group counts by resident
        const residentMap = new Map<number, any[]>();
        
        if (audit.counts && Array.isArray(audit.counts)) {
          audit.counts.forEach((count: any) => {
            const residentId = count.residentId;
            if (!residentMap.has(residentId)) {
              residentMap.set(residentId, []);
            }
            const variance = count.currentCount - count.previousCount;
            residentMap.get(residentId)?.push({
              name: count.medicationName || '',
              dosage: count.dosage || '',
              previousCount: count.previousCount,
              currentCount: count.currentCount,
              variance: variance,
              notes: count.notes || '',
            });
          });
        }
        
        // Convert map to auditData array
        const auditData = Array.from(residentMap.entries()).map(([residentId, medications]) => ({
          residentId: String(residentId),
          residentName: medications[0]?.residentName || audit.counts?.find((c: any) => c.residentId === residentId)?.residentName || `Resident ${residentId}`,
          medications: medications,
        }));
        
        // Check if there are any discrepancies
        const hasDiscrepancies = audit.counts?.some((c: any) => c.currentCount !== c.previousCount) || false;
        
        return {
          id: audit.id,
          date: new Date(audit.auditDate).toLocaleDateString(),
          time: audit.auditTime || new Date(audit.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          shift: audit.shift,
          submittedBy: audit.auditedByStaffName || 'Staff',
          residentCount: residentMap.size,
          medicationCount: audit.counts?.length || 0,
          hasDiscrepancies: hasDiscrepancies,
          auditData: auditData,
        };
      });
      
      setPendingAudits(formattedAudits);
    } catch (err) {
      console.error('Failed to fetch pending audits:', err);
      addToast('Failed to load pending audits', 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabBtnBase = 'flex items-center px-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap';
  const tabBtnInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';
  const tabBtnActive = 'border-primary text-primary';

  // Resident medication counts for audit (will be fetched from backend)
  const [residentMedCounts, setResidentMedCounts] = useState<ResidentMedCount[]>([]);

  const updateMedCount = (residentId: string, medIndex: number, count: string) => {
    setResidentMedCounts(prev =>
      prev.map(resident =>
        resident.residentId === residentId
          ? {
              ...resident,
              medications: resident.medications.map((med, idx) =>
                idx === medIndex ? { ...med, currentCount: count } : med
              ),
            }
          : resident
      )
    );
  };

  const updateMedNotes = (residentId: string, medIndex: number, notes: string) => {
    setResidentMedCounts(prev =>
      prev.map(resident =>
        resident.residentId === residentId
          ? {
              ...resident,
              medications: resident.medications.map((med, idx) =>
                idx === medIndex ? { ...med, notes } : med
              ),
            }
          : resident
      )
    );
  };

  // Demo pending audits
  const [pendingAudits, setPendingAudits] = useState<PendingAudit[]>([
    {
      id: 1,
      date: '2024-12-05',
      time: '07:00 AM',
      shift: 'Morning',
      submittedBy: 'John Smith',
      residentCount: 4,
      medicationCount: 12,
      hasDiscrepancies: true,
      auditData: [
        {
          residentId: 'A01',
          residentName: 'Resident A01',
          medications: [
            { name: 'Risperidone', dosage: '2mg', previousCount: 45, currentCount: 42, variance: -3, notes: 'Administered as scheduled' },
            { name: 'Sertraline', dosage: '50mg', previousCount: 30, currentCount: 30, variance: 0, notes: '' },
            { name: 'Melatonin', dosage: '3mg', previousCount: 60, currentCount: 58, variance: -2, notes: '' },
          ],
        },
        {
          residentId: 'A02',
          residentName: 'Resident A02',
          medications: [
            { name: 'Risperidone', dosage: '2mg', previousCount: 28, currentCount: 27, variance: -1, notes: '' },
            { name: 'Clonazepam', dosage: '0.5mg', previousCount: 42, currentCount: 42, variance: 0, notes: '' },
          ],
        },
        {
          residentId: 'B01',
          residentName: 'Resident B01',
          medications: [
            { name: 'Lithium', dosage: '300mg', previousCount: 55, currentCount: 53, variance: -2, notes: '' },
            { name: 'Abilify', dosage: '10mg', previousCount: 38, currentCount: 38, variance: 0, notes: '' },
          ],
        },
        {
          residentId: 'C02',
          residentName: 'Resident C02',
          medications: [
            { name: 'Prozac', dosage: '20mg', previousCount: 48, currentCount: 47, variance: -1, notes: '' },
            { name: 'Adderall', dosage: '15mg', previousCount: 35, currentCount: 35, variance: 0, notes: '' },
            { name: 'Trazodone', dosage: '50mg', previousCount: 52, currentCount: 52, variance: 0, notes: '' },
          ],
        },
      ],
    },
    {
      id: 2,
      date: '2024-12-04',
      time: '03:00 PM',
      shift: 'Evening',
      submittedBy: 'Maria Johnson',
      residentCount: 3,
      medicationCount: 8,
      hasDiscrepancies: false,
      auditData: [
        {
          residentId: 'A01',
          residentName: 'Resident A01',
          medications: [
            { name: 'Risperidone', dosage: '2mg', previousCount: 50, currentCount: 45, variance: -5, notes: 'Evening dose administered' },
            { name: 'Sertraline', dosage: '50mg', previousCount: 35, currentCount: 30, variance: -5, notes: '' },
          ],
        },
        {
          residentId: 'A02',
          residentName: 'Resident A02',
          medications: [
            { name: 'Risperidone', dosage: '2mg', previousCount: 30, currentCount: 28, variance: -2, notes: '' },
            { name: 'Clonazepam', dosage: '0.5mg', previousCount: 44, currentCount: 42, variance: -2, notes: '' },
          ],
        },
        {
          residentId: 'C02',
          residentName: 'Resident C02',
          medications: [
            { name: 'Prozac', dosage: '20mg', previousCount: 50, currentCount: 48, variance: -2, notes: '' },
            { name: 'Trazodone', dosage: '50mg', previousCount: 54, currentCount: 52, variance: -2, notes: '' },
          ],
        },
      ],
    },
  ]);

  const handleSubmitAudit = async () => {
    if (!programId) return;
    
    // Validate all counts are entered
    const incomplete = residentMedCounts.some(resident =>
      resident.medications.some(med => !med.currentCount)
    );
    
    if (incomplete) {
      addToast('Please complete all medication counts before submitting', 'warning');
      return;
    }

    setLoading(true);
    try {
      const auditData = {
        auditDate,
        auditTime,
        shift: selectedShift,
        auditNotes,
        counts: residentMedCounts.flatMap(resident =>
          resident.medications.map((med: any) => ({
            residentId: parseInt(resident.residentId),
            residentMedicationId: med.id, // Use actual medication ID
            previousCount: med.previousCount,
            currentCount: Number(med.currentCount),
            notes: med.notes,
          }))
        ),
      };

      await medicationApi.submitAudit(programId, auditData);
      addToast(`Medication Audit submitted for ${selectedShift} shift. Pending nurse approval.`, 'success');
      
      // Clear form and reload data
      setAuditNotes('');
      fetchResidentMedsForAudit(); // Refresh to get updated counts
      
      // Refresh pending audits if on that tab
      if (activeTab === 'pending-approvals') {
        fetchPendingAudits();
      }
    } catch (err: any) {
      console.error('Failed to submit audit:', err);
      addToast(err.message || 'Failed to submit audit', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAudit = async (auditId: number) => {
    if (!programId) return;
    
    if (!nurseApprovalNotes && selectedAuditForApproval === auditId) {
      addToast('Please add approval notes before approving the audit', 'warning');
      return;
    }

    setLoading(true);
    try {
      await medicationApi.approveAudit(programId, auditId, {
        status: 'APPROVED',
        approvalNotes: nurseApprovalNotes,
      });
      
      addToast('Audit approved successfully', 'success');
      setSelectedAuditForApproval(null);
      setNurseApprovalNotes('');
      fetchPendingAudits(); // Refresh list
    } catch (err: any) {
      console.error('Failed to approve audit:', err);
      addToast(err.message || 'Failed to approve audit', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDenyAudit = async (auditId: number) => {
    if (!programId) return;
    
    if (!nurseApprovalNotes) {
      addToast('Please add notes explaining why this audit is being denied', 'warning');
      return;
    }

    setLoading(true);
    try {
      await medicationApi.approveAudit(programId, auditId, {
        status: 'DENIED',
        approvalNotes: nurseApprovalNotes,
      });
      
      addToast('Audit denied', 'info');
      setSelectedAuditForApproval(null);
      setNurseApprovalNotes('');
      fetchPendingAudits(); // Refresh list
    } catch (err: any) {
      console.error('Failed to deny audit:', err);
      addToast(err.message || 'Failed to deny audit', 'error');
    } finally {
      setLoading(false);
    }
  };
  // Alerts demo data
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: 'critical',
      time: '10:30 AM',
      title: 'Resident A02 refused to take Risperidone 2mg. Staff: M. Johnson',
      description: 'Attempted administration at 10:30 AM. Resident became agitated and refused medication.',
    },
    {
      id: 2,
      type: 'warning',
      time: '9:45 AM',
      title: 'Medication Inventory Discrepancy: Sertraline 50mg - Expected: 45, Found: 43',
      description: 'Discrepancy flagged during morning inventory. Requires supervisor review.',
    },
    {
      id: 3,
      type: 'info',
      time: '8:15 AM',
      title: 'New Prescription Added: Resident B03 - Melatonin 3mg (Bedtime)',
      description: 'Prescription added by Dr. Sarah Wilson. First dose scheduled for tonight.',
    },
  ]);

  const resolveAlert = async (id: number) => {
    if (!programId) return;
    
    setLoading(true);
    try {
      await medicationApi.resolveAlert(programId, id);
      addToast('Alert resolved', 'success');
      fetchAlerts(); // Refresh alerts
    } catch (err: any) {
      console.error('Failed to resolve alert:', err);
      addToast(err.message || 'Failed to resolve alert', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAuditDetails = async (auditId: number) => {
    if (!programId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${programId}/medications/audits/${auditId}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      
      if (res.ok) {
        const audit = await res.json();
        setViewingAuditDetails(audit);
        setViewingAuditId(auditId);
      } else {
        addToast('Failed to load audit details', 'error');
      }
    } catch (err) {
      console.error('Failed to fetch audit details:', err);
      addToast('Failed to load audit details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminArchive = async () => {
    if (!programId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${programId}/medications/administrations?size=1000`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      
      if (res.ok) {
        const response = await res.json();
        const data = response.content || response; // Handle paginated response
        const formattedData = data.map((record: any) => ({
          id: record.id,
          date: new Date(record.administrationDate).toLocaleDateString(),
          time: record.administrationTime,
          shift: record.shift,
          resident: record.residentName,
          medication: `${record.medicationName} ${record.dosage || ''}`,
          action: record.action === 'ADMINISTERED' ? 'Given' : 
                  record.action === 'REFUSED' ? 'Denied' : 
                  record.action === 'HELD' ? 'Held' : record.action,
          staff: record.administeredByStaffName || '-',
          notes: record.notes || '',
        }));
        setAdminArchiveData(formattedData);
      }
    } catch (err) {
      console.error('Failed to fetch admin archive:', err);
      addToast('Failed to load administration records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditArchive = async () => {
    if (!programId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/programs/${programId}/medications/audits?status=APPROVED&size=1000`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      
      if (res.ok) {
        const response = await res.json();
        const audits = response.content || response; // Handle paginated response
        const formattedData: any[] = [];
        
        audits.forEach((audit: any) => {
          // Each audit can have multiple medication counts
          if (audit.counts && audit.counts.length > 0) {
            audit.counts.forEach((count: any) => {
              const discrepancy = count.currentCount - count.previousCount;
              formattedData.push({
                id: `${audit.id}-${count.residentMedicationId}`,
                auditId: audit.id,
                date: new Date(audit.auditDate).toLocaleDateString(),
                shift: audit.shift,
                staff: audit.submittedByStaffName || '-',
                reviewedBy: audit.approvedByStaffName || '-',
                resident: count.residentName || '-',
                medication: count.medicationName || '-',
                previousCount: count.previousCount,
                auditedCount: count.currentCount,
                discrepancy: discrepancy,
              });
            });
          }
        });
        
        setAuditArchiveData(formattedData);
      }
    } catch (err) {
      console.error('Failed to fetch audit archive:', err);
      addToast('Failed to load audit records', 'error');
    } finally {
      setLoading(false);
    }
  };

  // New Resident & Medications form state
  const [selectedResident, setSelectedResident] = useState('');
  const [allergies, setAllergies] = useState('');
  const [residents, setResidents] = useState<any[]>([]);
  const [meds, setMeds] = useState<NewMed[]>([
    { name: '', dosage: '', frequency: 'Once Daily', initialCount: '', physician: '', instructions: '' },
  ]);

  const addMed = () => setMeds((m) => [...m, { name: '', dosage: '', frequency: 'Once Daily', initialCount: '', physician: '', instructions: '' }]);
  const updateMed = (idx: number, patch: Partial<NewMed>) => {
    setMeds((m) => m.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };
  const removeMed = (idx: number) => setMeds((m) => m.filter((_, i) => i !== idx));

  const handleSaveResidentMedications = async () => {
    if (!programId || !selectedResident) {
      addToast('Please select a resident', 'warning');
      return;
    }

    // Validate all medications have required fields
    const invalidMeds = meds.filter(m => !m.name || !m.dosage || !m.initialCount);
    if (invalidMeds.length > 0) {
      addToast('Please fill in all required medication fields (name, dosage, initial count)', 'warning');
      return;
    }

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Add each medication
      for (const med of meds) {
        try {
          await medicationApi.addResidentMedication(programId, {
            residentId: parseInt(selectedResident),
            medicationName: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            initialCount: parseInt(med.initialCount),
            prescribingPhysician: med.physician || undefined,
            specialInstructions: med.instructions || undefined,
          });
          successCount++;
        } catch (err) {
          console.error(`Failed to add ${med.name}:`, err);
          failCount++;
        }
      }

      // Show results
      if (successCount > 0) {
        const residentName = residents.find(r => r.id.toString() === selectedResident);
        const resName = residentName ? `${residentName.firstName} ${residentName.lastName}` : 'resident';
        addToast(`${successCount} medication(s) added successfully for ${resName}`, 'success');
        
        // Reset form
        setSelectedResident('');
        setAllergies('');
        setMeds([{ name: '', dosage: '', frequency: 'Once Daily', initialCount: '', physician: '', instructions: '' }]);
        
        // Refresh med sheets data
        fetchResidentsWithMedications();
      }

      if (failCount > 0) {
        addToast(`Failed to add ${failCount} medication(s)`, 'error');
      }
    } catch (err: any) {
      console.error('Error saving medications:', err);
      addToast('An error occurred while saving medications', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter archive data

  const filteredAdminArchive = adminArchiveData.filter(record => {
    const matchesSearch = !adminArchiveFilter ||
      record.resident.toLowerCase().includes(adminArchiveFilter.toLowerCase()) ||
      record.medication.toLowerCase().includes(adminArchiveFilter.toLowerCase()) ||
      record.staff.toLowerCase().includes(adminArchiveFilter.toLowerCase());
    const matchesDate = !adminArchiveDateFilter || record.date === adminArchiveDateFilter;
    const matchesShift = !adminArchiveShiftFilter || record.shift === adminArchiveShiftFilter;
    return matchesSearch && matchesDate && matchesShift;
  });

  const filteredAuditArchive = auditArchiveData.filter(record => {
    const matchesSearch = !auditArchiveFilter ||
      record.resident.toLowerCase().includes(auditArchiveFilter.toLowerCase()) ||
      record.medication.toLowerCase().includes(auditArchiveFilter.toLowerCase()) ||
      record.shift.toLowerCase().includes(auditArchiveFilter.toLowerCase());
    const matchesDate = !auditArchiveDateFilter || record.date === auditArchiveDateFilter;
    const matchesShift = !auditArchiveShiftFilter || record.shift === auditArchiveShiftFilter;
    return matchesSearch && matchesDate && matchesShift;
  });

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div>
        <nav className="flex space-x-4 border-b border-bd overflow-x-auto">
          <button
            className={`${tabBtnBase} ${activeTab === 'alerts' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('alerts')}
          >
            <i className={`fa-solid fa-triangle-exclamation mr-2 ${activeTab === 'alerts' ? 'text-primary' : 'text-font-detail'}`}></i>
            Medication Alerts
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'add-medication' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('add-medication')}
          >
            <i className={`fa-solid fa-user-plus mr-2 ${activeTab === 'add-medication' ? 'text-primary' : 'text-font-detail'}`}></i>
            Add Resident Medication
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'med-sheets' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('med-sheets')}
          >
            <i className={`fa-solid fa-file-medical mr-2 ${activeTab === 'med-sheets' ? 'text-primary' : 'text-font-detail'}`}></i>
            Med Sheets
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'audit' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('audit')}
          >
            <i className={`fa-solid fa-clipboard-check mr-2 ${activeTab === 'audit' ? 'text-primary' : 'text-font-detail'}`}></i>
            Medication Audit
          </button>
          {(userRole.includes('NURSE') || userRole.includes('ADMIN')) && (
            <button
              className={`${tabBtnBase} ${activeTab === 'pending-approvals' ? tabBtnActive : tabBtnInactive}`}
              onClick={() => setActiveTab('pending-approvals')}
            >
              <i className={`fa-solid fa-user-nurse mr-2 ${activeTab === 'pending-approvals' ? 'text-primary' : 'text-font-detail'}`}></i>
              Pending Approvals
              {pendingAudits.length > 0 && (
                <span className="ml-2 bg-error text-white px-2 py-0.5 rounded-full text-xs font-medium">
                  {pendingAudits.length}
                </span>
              )}
            </button>
          )}
          <button
            className={`${tabBtnBase} ${activeTab === 'admin-archive' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('admin-archive')}
          >
            <i className={`fa-solid fa-syringe mr-2 ${activeTab === 'admin-archive' ? 'text-primary' : 'text-font-detail'}`}></i>
            Med Admin Archive
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'audit-archive' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('audit-archive')}
          >
            <i className={`fa-solid fa-archive mr-2 ${activeTab === 'audit-archive' ? 'text-primary' : 'text-font-detail'}`}></i>
            Med Audit Archive
          </button>
        </nav>
      </div>

      {/* Medication Alerts Tab */}
      {activeTab === 'alerts' && (
        <section className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base flex items-center">
            <i className="fa-solid fa-triangle-exclamation text-error mr-3"></i>
            Medication Alerts & Issues
          </h3>
          <div className="mt-2 text-sm text-font-detail">
            Current shift medication alerts and incidents requiring attention
          </div>
        </div>
        <div className="p-6 space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-lightest mb-4">
                <i className="fa-solid fa-shield-check text-4xl text-success opacity-50"></i>
              </div>
              <h4 className="text-xl font-semibold text-font-base mb-2">All Clear!</h4>
              <p className="text-font-detail">No active medication alerts or issues at this time.</p>
            </div>
          ) : (
            alerts.map((a) => (
              <div
                key={a.id}
                className={`${
                  a.type === 'critical'
                    ? 'border-error bg-error-lightest'
                    : a.type === 'warning'
                    ? 'border-warning bg-highlight-lightest'
                    : 'border-primary bg-primary-lightest'
                } border-l-4 p-4 rounded-r-lg`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${
                    a.type === 'critical' ? 'text-error' : a.type === 'warning' ? 'text-warning' : 'text-primary'
                  }`}>
                    {a.type === 'critical' ? 'Critical Alert' : a.type === 'warning' ? 'Inventory Warning' : 'Information'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-font-detail">{a.time}</span>
                    <button
                      onClick={() => resolveAlert(a.id)}
                      disabled={a.resolved}
                      className={`px-3 py-1 rounded text-xs text-white transition-colors ${a.resolved ? 'bg-bg-subtle text-font-detail cursor-not-allowed' : 'bg-success hover:bg-primary-alt-dark'}`}
                    >
                      <i className="fa-solid fa-check mr-1"></i>
                      {a.resolved ? 'Resolved' : 'Resolve'}
                  </button>
                </div>
              </div>
                <div className="text-sm text-font-base"><strong>{a.title.split(':')[0]}{a.title.includes(':') ? ':' : ''}</strong>{a.title.includes(':') ? a.title.substring(a.title.indexOf(':') + 1) : ''}</div>
                <div className="text-xs text-font-detail mt-1">{a.description}</div>
              </div>
            ))
          )}
        </div>
        </section>
      )}

      {/* Add Resident Medication Tab */}
      {activeTab === 'add-medication' && (
        <section className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base flex items-center">
            <i className="fa-solid fa-user-plus text-primary mr-3"></i>
            Add New Resident & Medications
          </h3>
          <div className="mt-2 text-sm text-font-detail">Register new resident and their prescribed medications</div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resident Information */}
            <div>
              <h4 className="font-semibold text-font-base mb-4">Resident Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Select Resident</label>
                  <select 
                    value={selectedResident} 
                    onChange={(e) => setSelectedResident(e.target.value)} 
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select a resident</option>
                    {residents.map(resident => (
                      <option key={resident.id} value={resident.id}>
                        {resident.firstName} {resident.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Room Number</label>
                  <input 
                    value={residents.find(r => r.id === parseInt(selectedResident))?.room || residents.find(r => r.id === parseInt(selectedResident))?.roomNumber || residents.find(r => r.id === parseInt(selectedResident))?.unitAssignment || ''}
                    readOnly
                    type="text" 
                    placeholder="Will auto-fill after selecting resident" 
                    className="w-full border-2 border-bd rounded-lg px-4 py-3 text-sm font-medium text-font-detail bg-bg-subtle/70" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Added By</label>
                  <input 
                    value={currentStaff} 
                    disabled
                    type="text" 
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm bg-bg-subtle text-font-detail" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Medical Allergies</label>
                  <textarea value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="List any known allergies..." className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-20"></textarea>
                </div>
              </div>
            </div>

            {/* Prescribed Medications */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-font-base">Prescribed Medications</h4>
              </div>
              <div className="space-y-3">
                {meds.map((m, idx) => (
                  <div key={idx} className="border border-bd rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-1">Medication Name</label>
                        <input value={m.name} onChange={(e) => updateMed(idx, { name: e.target.value })} type="text" placeholder="e.g., Risperidone" className="w-full border border-bd rounded px-2 py-1 text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-1">Dosage</label>
                          <input value={m.dosage} onChange={(e) => updateMed(idx, { dosage: e.target.value })} type="text" placeholder="e.g., 2mg" className="w-full border border-bd rounded px-2 py-1 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-1">Frequency</label>
                          <select value={m.frequency} onChange={(e) => updateMed(idx, { frequency: e.target.value })} className="w-full border border-bd rounded px-2 py-1 text-sm">
                            <option>Once Daily</option>
                            <option>Twice Daily</option>
                            <option>Three Times Daily</option>
                            <option>As Needed (PRN)</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-1">Initial Count</label>
                          <input value={m.initialCount} onChange={(e) => updateMed(idx, { initialCount: e.target.value })} type="number" placeholder="30" className="w-full border border-bd rounded px-2 py-1 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-1">Prescribing Physician</label>
                          <input value={m.physician} onChange={(e) => updateMed(idx, { physician: e.target.value })} type="text" placeholder="Dr. Name" className="w-full border border-bd rounded px-2 py-1 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-1">Special Instructions</label>
                        <textarea value={m.instructions} onChange={(e) => updateMed(idx, { instructions: e.target.value })} placeholder="Take with food, etc..." className="w-full border border-bd rounded px-2 py-1 text-sm h-16"></textarea>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <button onClick={() => removeMed(idx)} className="text-error hover:bg-error-lightest px-2 py-1 rounded text-sm">
                        <i className="fa-solid fa-trash mr-1"></i> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addMed} className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary-light font-medium">
                <i className="fa-solid fa-plus mr-2"></i>
                Add Another Medication
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="mt-6 pt-6 border-t border-bd flex justify-end">
            <button 
              onClick={handleSaveResidentMedications}
              disabled={loading || !selectedResident || meds.some(m => !m.name || !m.dosage || !m.initialCount)}
              className="bg-success text-white px-6 py-2 rounded-lg hover:bg-success/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-check mr-2"></i>
              {loading ? 'Saving...' : 'Save Resident Medications'}
            </button>
          </div>
        </div>
        </section>
      )}

      {/* Med Sheets Tab */}
      {activeTab === 'med-sheets' && (
        <section className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-users text-primary mr-3"></i>
              Current Residents on Medication
            </h3>
            <div className="mt-2 text-sm text-font-detail">Click on a resident to view and manage their medication records</div>
          </div>
          <div className="p-6">
            {residentsWithMeds.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-lightest mb-4">
                  <i className="fa-solid fa-pills text-4xl text-primary opacity-50"></i>
                </div>
                <h4 className="text-xl font-semibold text-font-base mb-2">No Residents on Medication</h4>
                <p className="text-font-detail mb-6">There are currently no residents with active medications in this program.</p>
                <button 
                  onClick={() => setActiveTab('add-medication')}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-medium transition-colors inline-flex items-center"
                >
                  <i className="fa-solid fa-plus mr-2"></i>
                  Add Resident Medication
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {residentsWithMeds.map((r) => (
                  <div key={r.id} className="border rounded-lg p-4 hover:shadow-lg cursor-pointer transition-shadow bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-font-base">{r.name}</h4>
                      <span className="text-xs px-2 py-1 rounded bg-success text-white">
                        {r.activeMedCount} Med{r.activeMedCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm mb-4">
                      {r.medications.slice(0, 3).map((med: any) => {
                        const medKey = `${med.medicationName} ${med.dosage || ''}`;
                        const lastAdmin = administrationData.get(r.id)?.[medKey];
                        return (
                        <div key={med.id} className="flex justify-between items-center gap-2">
                          <span className="text-font-detail truncate mr-2">{med.medicationName} {med.dosage}</span>
                          {lastAdmin ? (
                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                              lastAdmin.action === 'ADMINISTERED' ? 'bg-success/10 text-success' :
                              lastAdmin.action === 'REFUSED' ? 'bg-error/10 text-error' :
                              lastAdmin.action === 'HELD' ? 'bg-warning/10 text-warning' :
                              'bg-gray-100 text-font-detail'
                            }`}>
                              {lastAdmin.action === 'ADMINISTERED' ? 'Given' :
                               lastAdmin.action === 'REFUSED' ? 'Denied' :
                               lastAdmin.action === 'HELD' ? 'Held' : lastAdmin.action}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">No admin</span>
                          )}
                        </div>
                        );
                      })}
                      {r.medications.length > 3 && (
                        <div className="text-xs text-font-detail italic">+ {r.medications.length - 3} more...</div>
                      )}
                    </div>
                    <Link 
                      href={`/dashboard/medication/medication-sheet?resident=${r.id}&firstName=${encodeURIComponent(r.firstName)}&lastName=${encodeURIComponent(r.lastName)}`} 
                      className="w-full mt-3 bg-primary text-white py-2 px-3 rounded-lg hover:bg-primary-light text-sm font-medium transition-colors text-center inline-block"
                    >
                      <i className="fa-solid fa-file-medical mr-2"></i>
                      View Med Sheet
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Medication Audit Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-clipboard-check text-primary mr-3"></i>
                Medication Audit - Count & Verify
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Conduct medication inventory count for shift handover
              </div>
            </div>
            <div className="p-6">
              {residentMedCounts.length > 0 && (
                <>
                  {/* Shift Selection & Staff Info */}
                  <div className="bg-primary-lightest border border-primary/20 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Select Shift</label>
                        <select 
                          value={selectedShift}
                          onChange={(e) => setSelectedShift(e.target.value as 'Morning' | 'Evening' | 'Night')}
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="Morning">Morning Shift</option>
                          <option value="Evening">Evening Shift</option>
                          <option value="Night">Night Shift</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Audit Date</label>
                        <input 
                          type="date" 
                          value={auditDate}
                          onChange={(e) => setAuditDate(e.target.value)}
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Audit Time</label>
                        <input 
                          type="time" 
                          value={auditTime}
                          onChange={(e) => setAuditTime(e.target.value)}
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Staff Member</label>
                        <input 
                          type="text" 
                          value={currentStaff}
                          disabled
                          className="w-full border border-bd rounded-lg px-3 py-2 text-sm bg-bg-subtle text-font-detail"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Medication Count Table */}
              <div className="space-y-6">
                {residentMedCounts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-lightest mb-4">
                      <i className="fa-solid fa-clipboard-list text-4xl text-primary opacity-50"></i>
                    </div>
                    <h4 className="text-xl font-semibold text-font-base mb-2">No Medications to Audit</h4>
                    <p className="text-font-detail mb-4">There are no residents with medications to count for this audit.</p>
                    <button 
                      onClick={() => setActiveTab('add-medication')}
                      className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-medium transition-colors inline-flex items-center"
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      Add Resident Medication
                    </button>
                  </div>
                ) : (
                  residentMedCounts.map((resident) => (
                    <div key={resident.residentId} className="border border-bd rounded-lg overflow-hidden">
                    <div className="bg-bg-subtle px-4 py-3 border-b border-bd">
                      <h4 className="font-semibold text-font-base">{resident.residentName}</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-bg-subtle border-b border-bd">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-font-base">Medication</th>
                            <th className="px-4 py-3 text-left font-medium text-font-base">Dosage</th>
                            <th className="px-4 py-3 text-center font-medium text-font-base">Previous Count</th>
                            <th className="px-4 py-3 text-left font-medium text-font-base">Previous Staff</th>
                            <th className="px-4 py-3 text-center font-medium text-font-base">Current Count</th>
                            <th className="px-4 py-3 text-center font-medium text-font-base">Variance</th>
                            <th className="px-4 py-3 text-left font-medium text-font-base">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resident.medications.map((med, idx) => {
                            const variance = med.currentCount ? Number(med.currentCount) - med.previousCount : null;
                            return (
                            <tr key={idx} className="border-b border-bd last:border-0">
                              <td className="px-4 py-3 text-font-base">{med.medicationName}</td>
                              <td className="px-4 py-3 text-font-detail">{med.dosage}</td>
                              <td className="px-4 py-3 text-center">
                                <span className="inline-flex items-center justify-center bg-bg-subtle rounded px-3 py-1 font-medium text-font-base">
                                  {med.previousCount}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-font-detail">
                                {med.previousStaff}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="number"
                                  value={med.currentCount}
                                  onChange={(e) => updateMedCount(resident.residentId, idx, e.target.value)}
                                  placeholder="Enter"
                                  className="w-full max-w-[100px] border border-bd rounded-lg px-3 py-2 text-sm text-center focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                {variance !== null && (
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                    variance === 0 ? 'bg-success/10 text-success' : 
                                    variance < 0 ? 'bg-error/10 text-error' : 
                                    'bg-warning/10 text-warning'
                                  }`}>
                                    {variance === 0 ? 'Match' : variance > 0 ? `+${variance}` : variance}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={med.notes}
                                  onChange={(e) => updateMedNotes(resident.residentId, idx, e.target.value)}
                                  placeholder="Optional"
                                  className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                              </td>
                            </tr>
                          );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  ))
                )}
              </div>

              {/* Notes & Submit */}
              {residentMedCounts.length > 0 && (
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-font-base mb-2">Audit Notes</label>
                    <textarea
                      value={auditNotes}
                      onChange={(e) => setAuditNotes(e.target.value)}
                      placeholder="Add any discrepancies, concerns, or observations..."
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-24"
                    ></textarea>
                  </div>
                  <div className="lg:col-span-1 flex items-end">
                    <button
                      onClick={handleSubmitAudit}
                      className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium transition-colors flex items-center justify-center"
                    >
                      <i className="fa-solid fa-check mr-2"></i>
                      <span>Submit Audit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pending Approvals Tab - Nurse Only */}
      {activeTab === 'pending-approvals' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-user-nurse text-primary mr-3"></i>
                Pending Audit Approvals
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Review and approve medication audits submitted by staff
              </div>
            </div>
            <div className="p-6">
              {pendingAudits.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-lightest mb-4">
                    <i className="fa-solid fa-clipboard-check text-4xl text-success opacity-50"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-font-base mb-2">All Caught Up!</h4>
                  <p className="text-font-detail">No pending audits requiring approval at this time.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingAudits.map((audit) => (
                    <div key={audit.id} className={`border rounded-lg ${audit.hasDiscrepancies ? 'border-warning bg-warning/5' : 'border-bd'}`}>
                      {/* Header */}
                      <div className="p-4 border-b border-bd bg-bg-subtle">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-semibold text-font-base">
                              {audit.shift} Shift - {audit.date}
                            </h4>
                            {audit.hasDiscrepancies && (
                              <span className="bg-warning/20 text-warning px-3 py-1 rounded-full text-xs font-medium flex items-center">
                                <i className="fa-solid fa-exclamation-triangle mr-1"></i>
                                Has Discrepancies
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-font-detail">
                            Submitted by <span className="font-medium text-font-base">{audit.submittedBy}</span> at {audit.time}
                          </div>
                        </div>
                      </div>

                      {/* Medication Count Table */}
                      <div className="p-4">
                        {!audit.auditData || audit.auditData.length === 0 ? (
                          <div className="text-center py-8 text-font-detail">
                            <i className="fa-solid fa-exclamation-circle text-3xl text-warning mb-2"></i>
                            <p>No medication data available for this audit.</p>
                          </div>
                        ) : (
                        <div className="overflow-x-auto mb-4">
                          <table className="w-full text-sm">
                            <thead className="bg-bg-subtle border-b border-bd">
                              <tr>
                                <th className="px-4 py-2 text-left font-medium text-font-base">Resident</th>
                                <th className="px-4 py-2 text-left font-medium text-font-base">Medication</th>
                                <th className="px-4 py-2 text-center font-medium text-font-base">Previous</th>
                                <th className="px-4 py-2 text-center font-medium text-font-base">Counted</th>
                                <th className="px-4 py-2 text-center font-medium text-font-base">Variance</th>
                                <th className="px-4 py-2 text-left font-medium text-font-base">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(audit.auditData || []).map((resident) =>
                                (resident.medications || []).map((med, idx) => (
                                  <tr key={`${resident.residentId}-${idx}`} className="border-b border-bd last:border-0">
                                    {idx === 0 && (
                                      <td 
                                        rowSpan={resident.medications.length} 
                                        className="px-4 py-3 font-medium text-font-base border-r border-bd bg-bg-subtle"
                                      >
                                        {resident.residentName}
                                      </td>
                                    )}
                                    <td className="px-4 py-3 text-font-detail">{med.name} {med.dosage}</td>
                                    <td className="px-4 py-3 text-center text-font-base">{med.previousCount}</td>
                                    <td className="px-4 py-3 text-center text-font-base font-medium">{med.currentCount}</td>
                                    <td className="px-4 py-3 text-center">
                                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                        med.variance === 0 ? 'bg-success/10 text-success' :
                                        med.variance < 0 ? 'bg-error/10 text-error' :
                                        'bg-warning/10 text-warning'
                                      }`}>
                                        {med.variance === 0 ? 'Match' : med.variance > 0 ? `+${med.variance}` : med.variance}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-font-detail text-xs">{med.notes || '-'}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                        )}

                        {/* Approval Section */}
                        {selectedAuditForApproval === audit.id ? (
                          <div className="pt-4 border-t border-bd">
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-font-base mb-2">
                                Nurse Review & Approval Notes
                                <span className="text-error ml-1">*</span>
                              </label>
                              <textarea
                                value={nurseApprovalNotes}
                                onChange={(e) => setNurseApprovalNotes(e.target.value)}
                                placeholder="Document your review findings, verify discrepancies, and add approval remarks..."
                                className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-24"
                              ></textarea>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleApproveAudit(audit.id)}
                                className="flex-1 bg-success text-white py-2 px-4 rounded-lg hover:bg-success/90 font-medium transition-colors flex items-center justify-center"
                              >
                                <i className="fa-solid fa-check mr-2"></i>
                                Approve Audit
                              </button>
                              <button
                                onClick={() => handleDenyAudit(audit.id)}
                                className="flex-1 bg-error text-white py-2 px-4 rounded-lg hover:bg-error/90 font-medium transition-colors flex items-center justify-center"
                              >
                                <i className="fa-solid fa-times mr-2"></i>
                                Deny Audit
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAuditForApproval(null);
                                  setNurseApprovalNotes('');
                                }}
                                className="px-4 py-2 border border-bd rounded-lg text-font-base hover:bg-bg-subtle transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-4 border-t border-bd flex justify-end">
                            <button
                              onClick={() => setSelectedAuditForApproval(audit.id)}
                              className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90 font-medium transition-colors"
                            >
                              <i className="fa-solid fa-clipboard-check mr-2"></i>
                              Review & Approve
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Med Admin Archive Tab */}
      {activeTab === 'admin-archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-syringe text-primary mr-3"></i>
                Medication Administration Archive
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Historical records of all medication administrations
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Search by resident, medication, or staff..."
                value={adminArchiveFilter}
                onChange={(e) => setAdminArchiveFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <input
                type="date"
                value={adminArchiveDateFilter}
                onChange={(e) => setAdminArchiveDateFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <select
                value={adminArchiveShiftFilter}
                onChange={(e) => setAdminArchiveShiftFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Shifts</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-subtle border-b border-bd">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Time</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Resident</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Medication</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Action</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Staff</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdminArchive.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-lightest mb-4">
                          <i className="fa-solid fa-box-archive text-4xl text-primary opacity-50"></i>
                        </div>
                        <h4 className="text-xl font-semibold text-font-base mb-2">No Records Found</h4>
                        <p className="text-font-detail">No medication administration records match your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAdminArchive.map((record) => (
                    <tr key={record.id} className="border-b border-bd hover:bg-bg-subtle">
                      <td className="px-4 py-3 text-font-base">{record.date}</td>
                      <td className="px-4 py-3 text-font-detail">{record.time}</td>
                      <td className="px-4 py-3 text-font-base font-medium">{record.resident}</td>
                      <td className="px-4 py-3 text-font-detail">{record.medication}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          record.action === 'Administered' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-error/10 text-error'
                        }`}>
                          {record.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-font-detail">{record.staff}</td>
                      <td className="px-4 py-3 text-font-detail">{record.notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Med Audit Archive Tab */}
      {activeTab === 'audit-archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-archive text-primary mr-3"></i>
                Medication Audit Archive
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Historical records of medication counts and audits
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Search by resident, medication, or shift..."
                value={auditArchiveFilter}
                onChange={(e) => setAuditArchiveFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <input
                type="date"
                value={auditArchiveDateFilter}
                onChange={(e) => setAuditArchiveDateFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <select
                value={auditArchiveShiftFilter}
                onChange={(e) => setAuditArchiveShiftFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Shifts</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-subtle border-b border-bd">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Shift</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Audited By</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Reviewed By</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Resident</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Medication</th>
                  <th className="px-4 py-3 text-center font-medium text-font-base">Previous Count</th>
                  <th className="px-4 py-3 text-center font-medium text-font-base">Audited Count</th>
                  <th className="px-4 py-3 text-center font-medium text-font-base">Discrepancy</th>
                  <th className="px-4 py-3 text-center font-medium text-font-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditArchive.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-16">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-lightest mb-4">
                          <i className="fa-solid fa-clipboard-list text-4xl text-primary opacity-50"></i>
                        </div>
                        <h4 className="text-xl font-semibold text-font-base mb-2">No Audit Records Found</h4>
                        <p className="text-font-detail">No medication audit records match your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAuditArchive.map((record) => (
                    <tr key={record.id} className="border-b border-bd hover:bg-bg-subtle">
                      <td className="px-4 py-3 text-font-base">{record.date}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                          {record.shift}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-font-detail">{record.staff}</td>
                      <td className="px-4 py-3 text-font-detail">{record.reviewedBy}</td>
                      <td className="px-4 py-3 text-font-base font-medium">{record.resident}</td>
                      <td className="px-4 py-3 text-font-detail">{record.medication}</td>
                      <td className="px-4 py-3 text-center text-font-base">{record.previousCount}</td>
                      <td className="px-4 py-3 text-center text-font-base">{record.auditedCount}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          record.discrepancy === 0 
                            ? 'bg-success/10 text-success' 
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {record.discrepancy === 0 ? 'Match' : record.discrepancy}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => handleViewAuditDetails(record.auditId)}
                          className="text-primary hover:text-primary/80 transition-colors text-sm font-medium" 
                          title="Review Audit"
                        >
                          <i className="fa-solid fa-eye mr-1"></i>
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Details Modal */}
      {viewingAuditDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-bd sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-font-base">
                  Audit Details - {viewingAuditDetails.shift} Shift
                </h3>
                <button
                  onClick={() => {
                    setViewingAuditDetails(null);
                    setViewingAuditId(null);
                  }}
                  className="text-font-detail hover:text-font-base"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-font-detail">Date:</span>
                  <span className="ml-2 text-font-base font-medium">
                    {new Date(viewingAuditDetails.auditDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-font-detail">Time:</span>
                  <span className="ml-2 text-font-base font-medium">{viewingAuditDetails.auditTime}</span>
                </div>
                <div>
                  <span className="text-font-detail">Audited By:</span>
                  <span className="ml-2 text-font-base font-medium">{viewingAuditDetails.submittedByStaffName}</span>
                </div>
                <div>
                  <span className="text-font-detail">Reviewed By:</span>
                  <span className="ml-2 text-font-base font-medium">{viewingAuditDetails.approvedByStaffName || '-'}</span>
                </div>
                <div>
                  <span className="text-font-detail">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    viewingAuditDetails.status === 'APPROVED' ? 'bg-success/10 text-success' :
                    viewingAuditDetails.status === 'DENIED' ? 'bg-error/10 text-error' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {viewingAuditDetails.status}
                  </span>
                </div>
                <div>
                  <span className="text-font-detail">Discrepancies:</span>
                  <span className="ml-2 text-font-base font-medium">
                    {viewingAuditDetails.discrepancyCount || 0}
                  </span>
                </div>
              </div>
              {viewingAuditDetails.auditNotes && (
                <div className="mt-3">
                  <span className="text-font-detail text-sm">Audit Notes:</span>
                  <p className="mt-1 text-font-base text-sm">{viewingAuditDetails.auditNotes}</p>
                </div>
              )}
              {viewingAuditDetails.approvalNotes && (
                <div className="mt-3">
                  <span className="text-font-detail text-sm">Review Notes:</span>
                  <p className="mt-1 text-font-base text-sm">{viewingAuditDetails.approvalNotes}</p>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h4 className="text-lg font-semibold text-font-base mb-4">Medication Counts</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-bg-subtle border-b border-bd">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-font-base">Resident</th>
                      <th className="px-4 py-2 text-left font-medium text-font-base">Medication</th>
                      <th className="px-4 py-2 text-center font-medium text-font-base">Previous</th>
                      <th className="px-4 py-2 text-center font-medium text-font-base">Counted</th>
                      <th className="px-4 py-2 text-center font-medium text-font-base">Variance</th>
                      <th className="px-4 py-2 text-left font-medium text-font-base">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingAuditDetails.counts?.map((count: any, idx: number) => (
                      <tr key={idx} className="border-b border-bd">
                        <td className="px-4 py-3 font-medium text-font-base">{count.residentName}</td>
                        <td className="px-4 py-3 text-font-detail">{count.medicationName} {count.dosage}</td>
                        <td className="px-4 py-3 text-center text-font-base">{count.previousCount}</td>
                        <td className="px-4 py-3 text-center text-font-base font-medium">{count.currentCount}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            count.variance === 0 ? 'bg-success/10 text-success' :
                            count.variance < 0 ? 'bg-error/10 text-error' :
                            'bg-warning/10 text-warning'
                          }`}>
                            {count.variance === 0 ? 'Match' : count.variance > 0 ? `+${count.variance}` : count.variance}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-font-detail text-xs">{count.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-6 border-t border-bd bg-bg-subtle">
              <button
                onClick={() => {
                  setViewingAuditDetails(null);
                  setViewingAuditId(null);
                }}
                className="bg-font-base text-white px-6 py-2 rounded-lg hover:bg-font-base/90 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
