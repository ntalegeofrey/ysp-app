'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ToastType {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function EditUCRPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [programId, setProgramId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  
  // Report data
  const [reportDate, setReportDate] = useState('');
  const [shiftTime, setShiftTime] = useState('7:00-3:00');
  const [staffName, setStaffName] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  
  // Room search states
  const [roomSearchRoom, setRoomSearchRoom] = useState('');
  const [roomSearchComments, setRoomSearchComments] = useState('');
  
  const addRoomSearchRow = () => {
    if (!roomSearchRoom.trim()) {
      addToast('Please enter a room number', 'error');
      return;
    }
    setFormData((prev: any) => ({
      ...prev,
      roomSearches: [...(prev.roomSearches || []), { room: roomSearchRoom, comments: roomSearchComments }]
    }));
    setRoomSearchRoom('');
    setRoomSearchComments('');
  };
  
  // Form data - same structure as main page
  const [formData, setFormData] = useState<any>({
    securityEquipment: [
      { status: 'ok', comments: '', priority: 'Normal' },
      { status: 'ok', comments: '', priority: 'Normal' },
      { status: 'ok', comments: '', priority: 'Normal' },
      { status: 'ok', comments: '', priority: 'Normal' },
      { status: 'ok', comments: '', priority: 'Normal' },
      { status: 'ok', comments: '', priority: 'Normal' },
    ],
    hardwareSecure: { value: true, comments: '' },
    searchesCompleted: { value: true, comments: '' },
    fireDrillsCompleted: { value: true, comments: '' },
    emergencyLighting: { value: true, comments: '' },
    notifications: [
      { value: true, comments: '', priority: 'Normal' },
      { value: true, comments: '', priority: 'Normal' },
      { value: true, comments: '', priority: 'Normal' },
    ],
    adminOffices: [
      { status: 'ok', comments: '', priority: 'Normal' },
      { status: 'ok', comments: '', priority: 'Normal' },
    ],
    facilityInfrastructure: [
      { status: 'ok', comments: '', priority: 'Normal' },
      { status: 'ok', comments: '', priority: 'Normal' },
      { status: 'ok', comments: '', priority: 'Normal' },
      { status: 'ok', comments: '', priority: 'Normal' },
      { status: 'ok', comments: '', priority: 'Normal' },
      { status: 'ok', comments: '', priority: 'Normal' },
      { status: 'ok', comments: '', priority: 'Normal' },
    ],
    staffChores: [
      { status: 'ok', comments: '' },
      { status: 'ok', comments: '' },
      { status: 'ok', comments: '' },
      { status: 'ok', comments: '' },
    ],
    roomSearches: [],
  });

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  useEffect(() => {
    let storedProgramId: string | null = null;
    try {
      if (typeof window !== 'undefined') {
        const spRaw = localStorage.getItem('selectedProgram');
        if (spRaw) {
          const sp = JSON.parse(spRaw) as { id?: number | string };
          storedProgramId = sp?.id ? String(sp.id) : null;
        }
      }
    } catch {
      storedProgramId = null;
    }

    console.log('Edit page - programId:', storedProgramId, 'reportId:', reportId);
    setProgramId(storedProgramId);

    if (!storedProgramId || !reportId) {
      console.log('Missing programId or reportId, redirecting...');
      router.push('/dashboard/ucr');
      return;
    }

    // Fetch the report
    const fetchReport = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        console.log('Fetching report from:', `/api/programs/${storedProgramId}/ucr/reports/${reportId}`);
        const response = await fetch(`/api/programs/${storedProgramId}/ucr/reports/${reportId}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        console.log('Response status:', response.status);
        if (!response.ok) {
          console.log('Response not OK, redirecting');
          addToast('Failed to load report', 'error');
          router.push('/dashboard/ucr');
          return;
        }

        const data = await response.json();
        console.log('Report data loaded:', data);
        
        // Pre-populate form fields
        setReportDate(data.reportDate || '');
        setShiftTime(data.shiftTime || '7:00-3:00');
        setStaffName(data.staffName || '');
        setAdditionalComments(data.additionalComments || '');
        
        // Parse room searches if present
        let roomSearches: any[] = [];
        if (data.roomSearches) {
          if (typeof data.roomSearches === 'string') {
            try {
              roomSearches = JSON.parse(data.roomSearches);
            } catch (e) {
              roomSearches = [];
            }
          } else if (Array.isArray(data.roomSearches)) {
            roomSearches = data.roomSearches;
          }
        }
        
        // Map backend data to form structure
        setFormData({
          securityEquipment: [
            { status: data.securityRadiosStatus || 'ok', comments: data.securityRadiosComments || '', priority: data.securityRadiosCondition || 'Normal' },
            { status: data.securityFlashlightsStatus || 'ok', comments: data.securityFlashlightsComments || '', priority: data.securityFlashlightsCondition || 'Normal' },
            { status: data.securityMetalDetectorStatus || 'ok', comments: data.securityMetalDetectorComments || '', priority: data.securityMetalDetectorCondition || 'Normal' },
            { status: data.securityBigSetKeysStatus || 'ok', comments: data.securityBigSetKeysComments || '', priority: data.securityBigSetKeysCondition || 'Normal' },
            { status: data.securityFirstAidKitsStatus || 'ok', comments: data.securityFirstAidKitsComments || '', priority: data.securityFirstAidKitsCondition || 'Normal' },
            { status: data.securityDeskComputerStatus || 'ok', comments: data.securityDeskComputerComments || '', priority: data.securityDeskComputerCondition || 'Normal' },
          ],
          hardwareSecure: { value: data.hardwareSecureStatus !== 'issue', comments: data.hardwareSecureComments || '' },
          searchesCompleted: { value: data.searchesCompletedStatus !== 'issue', comments: data.searchesCompletedComments || '' },
          fireDrillsCompleted: { value: data.fireDrillsCompletedStatus !== 'issue', comments: data.fireDrillsCompletedComments || '' },
          emergencyLighting: { value: data.emergencyLightingStatus !== 'issue', comments: data.emergencyLightingComments || '' },
          notifications: [
            { value: data.notifyProgramDirectorStatus !== 'issue', comments: data.notifyProgramDirectorComments || '', priority: data.notifyProgramDirectorCondition || 'Normal' },
            { value: data.notifyMaintenanceStatus !== 'issue', comments: data.notifyMaintenanceComments || '', priority: data.notifyMaintenanceCondition || 'Normal' },
            { value: data.notifyOtherStatus !== 'issue', comments: data.notifyOtherComments || '', priority: data.notifyOtherCondition || 'Normal' },
          ],
          adminOffices: [
            { status: data.adminMeetingRoomsLockedStatus || 'ok', comments: data.adminMeetingRoomsLockedComments || '', priority: data.adminMeetingRoomsLockedCondition || 'Normal' },
            { status: data.adminDoorsSecureStatus || 'ok', comments: data.adminDoorsSecureComments || '', priority: data.adminDoorsSecureCondition || 'Normal' },
          ],
          facilityInfrastructure: [
            { status: data.infraBackDoorStatus || 'ok', comments: data.infraBackDoorComments || '', priority: data.infraBackDoorCondition || 'Normal' },
            { status: data.infraEntranceExitDoorsStatus || 'ok', comments: data.infraEntranceExitDoorsComments || '', priority: data.infraEntranceExitDoorsCondition || 'Normal' },
            { status: data.infraSmokeDetectorsStatus || 'ok', comments: data.infraSmokeDetectorsComments || '', priority: data.infraSmokeDetectorsCondition || 'Normal' },
            { status: data.infraWindowsSecureStatus || 'ok', comments: data.infraWindowsSecureComments || '', priority: data.infraWindowsSecureCondition || 'Normal' },
            { status: data.infraLaundryAreaStatus || 'ok', comments: data.infraLaundryAreaComments || '', priority: data.infraLaundryAreaCondition || 'Normal' },
            { status: data.infraFireExtinguishersStatus || 'ok', comments: data.infraFireExtinguishersComments || '', priority: data.infraFireExtinguishersCondition || 'Normal' },
            { status: data.infraFireAlarmStatus || 'ok', comments: data.infraFireAlarmComments || '', priority: data.infraFireAlarmCondition || 'Normal' },
          ],
          staffChores: [
            { status: data.choreKitchenCleanStatus || 'ok', comments: data.choreKitchenCleanComments || '' },
            { status: data.choreBathroomsCleanStatus || 'ok', comments: data.choreBathroomsCleanComments || '' },
            { status: data.choreDayroomCleanStatus || 'ok', comments: data.choreDayroomCleanComments || '' },
            { status: data.choreLaundryRoomCleanStatus || 'ok', comments: data.choreLaundryRoomCleanComments || '' },
          ],
          roomSearches: Array.isArray(roomSearches) ? roomSearches.map((rs: any) => ({ 
            room: rs.room_number || rs.roomNumber || rs.room, 
            comments: rs.search_comments || rs.searchComments || rs.comments 
          })) : [],
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report:', error);
        addToast('Error loading report', 'error');
        router.push('/dashboard/ucr');
      }
    };

    fetchReport();
  }, [reportId, router]);

  const handleSave = async () => {
    if (!programId || saving) return;
    
    setSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      // Build payload same as main page
      const payload: any = {
        reportDate: reportDate || new Date().toISOString().slice(0,10),
        shiftTime: shiftTime,
        staffName: staffName,
        
        // Security Equipment
        securityRadiosStatus: formData.securityEquipment?.[0]?.status || null,
        securityRadiosCondition: formData.securityEquipment?.[0]?.priority || 'Normal',
        securityRadiosComments: formData.securityEquipment?.[0]?.comments || null,
        
        securityFlashlightsStatus: formData.securityEquipment?.[1]?.status || null,
        securityFlashlightsCondition: formData.securityEquipment?.[1]?.priority || 'Normal',
        securityFlashlightsComments: formData.securityEquipment?.[1]?.comments || null,
        
        securityMetalDetectorStatus: formData.securityEquipment?.[2]?.status || null,
        securityMetalDetectorCondition: formData.securityEquipment?.[2]?.priority || 'Normal',
        securityMetalDetectorComments: formData.securityEquipment?.[2]?.comments || null,
        
        securityBigSetKeysStatus: formData.securityEquipment?.[3]?.status || null,
        securityBigSetKeysCondition: formData.securityEquipment?.[3]?.priority || 'Normal',
        securityBigSetKeysComments: formData.securityEquipment?.[3]?.comments || null,
        
        securityFirstAidKitsStatus: formData.securityEquipment?.[4]?.status || null,
        securityFirstAidKitsCondition: formData.securityEquipment?.[4]?.priority || 'Normal',
        securityFirstAidKitsComments: formData.securityEquipment?.[4]?.comments || null,
        
        securityDeskComputerStatus: formData.securityEquipment?.[5]?.status || null,
        securityDeskComputerCondition: formData.securityEquipment?.[5]?.priority || 'Normal',
        securityDeskComputerComments: formData.securityEquipment?.[5]?.comments || null,
        
        // Hardware/Procedures
        hardwareSecureStatus: formData.hardwareSecure?.value === false ? 'issue' : 'ok',
        hardwareSecureComments: formData.hardwareSecure?.comments || null,
        
        searchesCompletedStatus: formData.searchesCompleted?.value === false ? 'issue' : 'ok',
        searchesCompletedComments: formData.searchesCompleted?.comments || null,
        
        fireDrillsCompletedStatus: formData.fireDrillsCompleted?.value === false ? 'issue' : 'ok',
        fireDrillsCompletedComments: formData.fireDrillsCompleted?.comments || null,
        
        emergencyLightingStatus: formData.emergencyLighting?.value === false ? 'issue' : 'ok',
        emergencyLightingComments: formData.emergencyLighting?.comments || null,
        
        // Notifications
        notifyProgramDirectorStatus: formData.notifications?.[0]?.value === false ? 'issue' : 'ok',
        notifyProgramDirectorCondition: formData.notifications?.[0]?.priority || 'Normal',
        notifyProgramDirectorComments: formData.notifications?.[0]?.comments || null,
        
        notifyMaintenanceStatus: formData.notifications?.[1]?.value === false ? 'issue' : 'ok',
        notifyMaintenanceCondition: formData.notifications?.[1]?.priority || 'Normal',
        notifyMaintenanceComments: formData.notifications?.[1]?.comments || null,
        
        notifyOtherStatus: formData.notifications?.[2]?.value === false ? 'issue' : 'ok',
        notifyOtherCondition: formData.notifications?.[2]?.priority || 'Normal',
        notifyOtherComments: formData.notifications?.[2]?.comments || null,
        
        // Admin Offices
        adminMeetingRoomsLockedStatus: formData.adminOffices?.[0]?.status || null,
        adminMeetingRoomsLockedCondition: formData.adminOffices?.[0]?.priority || 'Normal',
        adminMeetingRoomsLockedComments: formData.adminOffices?.[0]?.comments || null,
        
        adminDoorsSecureStatus: formData.adminOffices?.[1]?.status || null,
        adminDoorsSecureCondition: formData.adminOffices?.[1]?.priority || 'Normal',
        adminDoorsSecureComments: formData.adminOffices?.[1]?.comments || null,
        
        // Infrastructure
        infraBackDoorStatus: formData.facilityInfrastructure?.[0]?.status || null,
        infraBackDoorCondition: formData.facilityInfrastructure?.[0]?.priority || 'Normal',
        infraBackDoorComments: formData.facilityInfrastructure?.[0]?.comments || null,
        
        infraEntranceExitDoorsStatus: formData.facilityInfrastructure?.[1]?.status || null,
        infraEntranceExitDoorsCondition: formData.facilityInfrastructure?.[1]?.priority || 'Normal',
        infraEntranceExitDoorsComments: formData.facilityInfrastructure?.[1]?.comments || null,
        
        infraSmokeDetectorsStatus: formData.facilityInfrastructure?.[2]?.status || null,
        infraSmokeDetectorsCondition: formData.facilityInfrastructure?.[2]?.priority || 'Normal',
        infraSmokeDetectorsComments: formData.facilityInfrastructure?.[2]?.comments || null,
        
        infraWindowsSecureStatus: formData.facilityInfrastructure?.[3]?.status || null,
        infraWindowsSecureCondition: formData.facilityInfrastructure?.[3]?.priority || 'Normal',
        infraWindowsSecureComments: formData.facilityInfrastructure?.[3]?.comments || null,
        
        infraLaundryAreaStatus: formData.facilityInfrastructure?.[4]?.status || null,
        infraLaundryAreaCondition: formData.facilityInfrastructure?.[4]?.priority || 'Normal',
        infraLaundryAreaComments: formData.facilityInfrastructure?.[4]?.comments || null,
        
        infraFireExtinguishersStatus: formData.facilityInfrastructure?.[5]?.status || null,
        infraFireExtinguishersCondition: formData.facilityInfrastructure?.[5]?.priority || 'Normal',
        infraFireExtinguishersComments: formData.facilityInfrastructure?.[5]?.comments || null,
        
        infraFireAlarmStatus: formData.facilityInfrastructure?.[6]?.status || null,
        infraFireAlarmCondition: formData.facilityInfrastructure?.[6]?.priority || 'Normal',
        infraFireAlarmComments: formData.facilityInfrastructure?.[6]?.comments || null,
        
        // Staff Chores
        choreKitchenCleanStatus: formData.staffChores?.[0]?.status || null,
        choreKitchenCleanComments: formData.staffChores?.[0]?.comments || null,
        
        choreBathroomsCleanStatus: formData.staffChores?.[1]?.status || null,
        choreBathroomsCleanComments: formData.staffChores?.[1]?.comments || null,
        
        choreDayroomCleanStatus: formData.staffChores?.[2]?.status || null,
        choreDayroomCleanComments: formData.staffChores?.[2]?.comments || null,
        
        choreLaundryRoomCleanStatus: formData.staffChores?.[3]?.status || null,
        choreLaundryRoomCleanComments: formData.staffChores?.[3]?.comments || null,
        
        // Room searches
        roomSearches: formData.roomSearches?.map((rs: any) => ({
          room_number: rs.room,
          search_comments: rs.comments
        })) || [],
        
        // Additional comments
        additionalComments: additionalComments || null,
      };
      
      const response = await fetch(`/api/programs/${programId}/ucr/reports/${reportId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        if (response.status === 423) {
          addToast('This UCR can no longer be edited (past date).', 'error');
        } else {
          addToast(`Failed to update UCR: ${response.status}`, 'error');
        }
        setSaving(false);
        return;
      }
      
      addToast('UCR updated successfully', 'success');
      setTimeout(() => router.push('/dashboard/ucr'), 1000);
    } catch (error) {
      console.error('Error saving:', error);
      addToast('Error saving report', 'error');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-base">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-font-detail">Loading report...</p>
        </div>
      </div>
    );
  }

  const reportDateFormatted = reportDate ? new Date(reportDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : '';

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`min-w-[260px] max-w-sm shadow-lg rounded-lg border p-3 flex items-start gap-3 bg-white ${t.type === 'success' ? 'border-success' : t.type === 'error' ? 'border-error' : 'border-bd'}`}>
            <i className={`fa-solid ${t.type === 'success' ? 'fa-circle-check text-success' : t.type === 'error' ? 'fa-circle-exclamation text-error' : 'fa-circle-info text-primary'} mt-1`}></i>
            <div className="flex-1 text-sm text-font-base">{t.message}</div>
          </div>
        ))}
      </div>

      {/* App Bar with Breadcrumbs */}
      <div className="bg-white border-b border-bd sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/ucr')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Back to UCR"
              >
                <i className="fa-solid fa-arrow-left text-xl"></i>
              </button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-font-detail hover:text-primary cursor-pointer" onClick={() => router.push('/dashboard/ucr')}>
                  UCR Reports
                </span>
                <i className="fa-solid fa-chevron-right text-xs text-font-detail"></i>
                <span className="text-font-base font-medium">Edit UCR</span>
                {reportDateFormatted && (
                  <>
                    <i className="fa-solid fa-chevron-right text-xs text-font-detail"></i>
                    <span className="text-font-detail">{reportDateFormatted}</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-sm text-font-detail">
              Report ID: #{reportId}
            </div>
          </div>
        </div>
      </div>

      {/* Form Content - This is a placeholder, you'll need to copy the full form from the main page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-light transition-colors duration-200 flex items-center disabled:opacity-50"
            >
              <i className="fa-solid fa-save mr-2"></i>
              {saving ? 'Saving...' : 'Update'}
            </button>
          </div>

          {/* Report Info */}
          <section className="bg-white p-6 rounded-lg border border-bd">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-font-detail mb-1">Date</label>
                <input 
                  type="date" 
                  value={reportDate} 
                  onChange={(e) => setReportDate(e.target.value)} 
                  className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-detail mb-1">Shift / Time</label>
                <select 
                  value={shiftTime} 
                  onChange={(e) => setShiftTime(e.target.value)} 
                  className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>7:00-3:00</option>
                  <option>3:00-11:00</option>
                  <option>11:00-7:00</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-detail mb-1">Staff Completing UCR</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-bd rounded-md bg-gray-100" 
                  value={staffName} 
                  readOnly 
                />
              </div>
            </div>
          </section>

          {/* Security Equipment & Procedures */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-primary">Security Equipment & Procedures</h3>
            </div>
            <div className="p-4 space-y-4">
              {[
                { label: '11 Radios functional and charging', extra: 'Problems in use, work order #' },
                { label: '2 Flashlights functional', extra: 'Problems in use, work order #' },
                { label: 'Garrett metal detector functional', extra: 'Problems in use, work order #' },
                { label: 'Big Set keys & keys present and secure', extra: 'Problems in use, work order #' },
                { label: 'First Aid kits available and stocked', extra: 'Note if used, work order #' },
                { label: 'Desk Computer/Monitor functional', extra: 'Problems in use, work order #' },
              ].map((row, idx) => (
                <div key={row.label} className={`grid grid-cols-12 items-center gap-4 py-2 ${idx === 0 ? 'border-b' : 'border-y'} border-bd`}>
                  <div className="col-span-3">
                    <p className="text-sm font-medium text-font-base">{row.label}</p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                      <button
                        onClick={() => setFormData((prev: any) => ({
                          ...prev,
                          securityEquipment: prev.securityEquipment.map((item: any, i: number) =>
                            i === idx ? { ...item, status: 'ok' } : item
                          ),
                        }))}
                        className={`flex-1 py-1.5 ${formData.securityEquipment[idx]?.status === 'ok' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        OK
                      </button>
                      <button
                        onClick={() => setFormData((prev: any) => ({
                          ...prev,
                          securityEquipment: prev.securityEquipment.map((item: any, i: number) =>
                            i === idx ? { ...item, status: 'issue' } : item
                          ),
                        }))}
                        className={`flex-1 py-1.5 ${formData.securityEquipment[idx]?.status === 'issue' ? 'bg-error text-white' : 'hover:bg-gray-50'}`}
                      >
                        Issue
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <select
                      value={formData.securityEquipment[idx]?.priority || 'Normal'}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          securityEquipment: prev.securityEquipment.map((item: any, i: number) =>
                            i === idx ? { ...item, priority: e.target.value } : item
                          ),
                        }))
                      }
                      className="w-full px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder={row.extra}
                      value={formData.securityEquipment[idx]?.comments || ''}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          securityEquipment: prev.securityEquipment.map((item: any, i: number) =>
                            i === idx ? { ...item, comments: e.target.value } : item
                          ),
                        }))
                      }
                      className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}

              {/* Hardware Secure */}
              <div className="grid grid-cols-12 items-center gap-4 py-2 border-y border-bd">
                <div className="col-span-4">
                  <p className="text-sm font-medium text-font-base">Hardware Secure (hooks secure)</p>
                </div>
                <div className="col-span-3">
                  <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                    <button
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          hardwareSecure: { ...prev.hardwareSecure, value: true },
                        }))
                      }
                      className={`flex-1 py-1.5 ${formData.hardwareSecure?.value === true ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          hardwareSecure: { ...prev.hardwareSecure, value: false },
                        }))
                      }
                      className={`flex-1 py-1.5 ${formData.hardwareSecure?.value === false ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                      No
                    </button>
                  </div>
                </div>
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Problems in use, work order #"
                    value={formData.hardwareSecure?.comments || ''}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        hardwareSecure: { ...prev.hardwareSecure, comments: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Searches completed */}
              <div className="grid grid-cols-12 items-center gap-4 py-2 border-y border-bd">
                <div className="col-span-4">
                  <p className="text-sm font-medium text-font-base">Searches completed</p>
                </div>
                <div className="col-span-3">
                  <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                    <button
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          searchesCompleted: { ...prev.searchesCompleted, value: true },
                        }))
                      }
                      className={`flex-1 py-1.5 ${formData.searchesCompleted?.value === true ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          searchesCompleted: { ...prev.searchesCompleted, value: false },
                        }))
                      }
                      className={`flex-1 py-1.5 ${formData.searchesCompleted?.value === false ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                      No
                    </button>
                  </div>
                </div>
                <div className="col-span-5 flex gap-2">
                  <input
                    type="time"
                    value={formData.searchesCompleted?.startTime || ''}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        searchesCompleted: { ...prev.searchesCompleted, startTime: e.target.value },
                      }))
                    }
                    className="px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="time"
                    value={formData.searchesCompleted?.endTime || ''}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        searchesCompleted: { ...prev.searchesCompleted, endTime: e.target.value },
                      }))
                    }
                    className="px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Fire drills completed */}
              <div className="grid grid-cols-12 items-center gap-4 py-2 border-y border-bd">
                <div className="col-span-4">
                  <p className="text-sm font-medium text-font-base">Fire drills completed</p>
                </div>
                <div className="col-span-3">
                  <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                    <button
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          fireDrillsCompleted: { ...prev.fireDrillsCompleted, value: true },
                        }))
                      }
                      className={`flex-1 py-1.5 ${formData.fireDrillsCompleted?.value === true ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          fireDrillsCompleted: { ...prev.fireDrillsCompleted, value: false },
                        }))
                      }
                      className={`flex-1 py-1.5 ${formData.fireDrillsCompleted?.value === false ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                      No
                    </button>
                  </div>
                </div>
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Problems in use, work order #"
                    value={formData.fireDrillsCompleted?.comments || ''}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        fireDrillsCompleted: { ...prev.fireDrillsCompleted, comments: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Emergency lighting operational */}
              <div className="grid grid-cols-12 items-center gap-4 py-2">
                <div className="col-span-4">
                  <p className="text-sm font-medium text-font-base">Emergency lighting operational</p>
                </div>
                <div className="col-span-3">
                  <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                    <button
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          emergencyLighting: { ...prev.emergencyLighting, value: true },
                        }))
                      }
                      className={`flex-1 py-1.5 ${formData.emergencyLighting?.value === true ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          emergencyLighting: { ...prev.emergencyLighting, value: false },
                        }))
                      }
                      className={`flex-1 py-1.5 ${formData.emergencyLighting?.value === false ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                      No
                    </button>
                  </div>
                </div>
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Problems in use, work order #"
                    value={formData.emergencyLighting?.comments || ''}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        emergencyLighting: { ...prev.emergencyLighting, comments: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-primary">Notifications</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-12 items-center gap-4 py-2">
                <div className="col-span-4">
                  <p className="text-sm font-medium text-font-base">Opposite Gender Announce their Presence</p>
                </div>
                <div className="col-span-3">
                  <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                    <button
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          notifications: [{ ...prev.notifications[0], value: true }],
                        }))
                      }
                      className={`flex-1 py-1.5 ${formData.notifications[0]?.value === true ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          notifications: [{ ...prev.notifications[0], value: false }],
                        }))
                      }
                      className={`flex-1 py-1.5 ${formData.notifications[0]?.value === false ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                      No
                    </button>
                  </div>
                </div>
                <div className="col-span-3">
                  <select
                    value={formData.notifications[0]?.priority || 'Normal'}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        notifications: [{ ...prev.notifications[0], priority: e.target.value }],
                      }))
                    }
                    className="w-full px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Notes, concerns"
                    value={formData.notifications[0]?.comments || ''}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        notifications: [{ ...prev.notifications[0], comments: e.target.value }],
                      }))
                    }
                    className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Administrative Offices */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-primary">Administrative Offices</h3>
            </div>
            <div className="p-4 space-y-4">
              {[ 
                'Meeting Rooms locked',
                'Administration doors locked and secure',
              ].map((label, idx) => (
                <div key={label} className="grid grid-cols-12 items-center gap-4 py-2 border-y border-bd">
                  <div className="col-span-4">
                    <p className="text-sm font-medium text-font-base">{label}</p>
                  </div>
                  <div className="col-span-3">
                    <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                      <button
                        onClick={() =>
                          setFormData((prev: any) => ({
                            ...prev,
                            adminOffices: prev.adminOffices.map((item: any, i: number) =>
                              i === idx ? { ...item, status: 'ok' } : item
                            ),
                          }))
                        }
                        className={`flex-1 py-1.5 ${formData.adminOffices[idx]?.status === 'ok' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        OK
                      </button>
                      <button
                        onClick={() =>
                          setFormData((prev: any) => ({
                            ...prev,
                            adminOffices: prev.adminOffices.map((item: any, i: number) =>
                              i === idx ? { ...item, status: 'issue' } : item
                            ),
                          }))
                        }
                        className={`flex-1 py-1.5 ${formData.adminOffices[idx]?.status === 'issue' ? 'bg-error text-white' : 'hover:bg-gray-50'}`}
                      >
                        Issue
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <select
                      value={formData.adminOffices[idx]?.priority || 'Normal'}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          adminOffices: prev.adminOffices.map((item: any, i: number) =>
                            i === idx ? { ...item, priority: e.target.value } : item
                          ),
                        }))
                      }
                      className="w-full px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Problems in use, work order #"
                      value={formData.adminOffices[idx]?.comments || ''}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          adminOffices: prev.adminOffices.map((item: any, i: number) =>
                            i === idx ? { ...item, comments: e.target.value } : item
                          ),
                        }))
                      }
                      className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Facility Infrastructure */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-primary">Facility Infrastructure</h3>
            </div>
            <div className="p-4 space-y-4">
              {[
                'Back door locked and secure',
                'Entrance and exit doors locked and secured',
                'Smoke detectors functional',
                'All windows secure',
                'Laundry area clean and orderly',
                'Fire extinguishers in place/charged',
                'Fire alarm functional',
              ].map((label, idx) => (
                <div key={label} className="grid grid-cols-12 items-center gap-4 py-2 border-y border-bd">
                  <div className="col-span-4">
                    <p className="text-sm font-medium text-font-base">{label}</p>
                  </div>
                  <div className="col-span-3">
                    <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                      <button
                        onClick={() =>
                          setFormData((prev: any) => ({
                            ...prev,
                            facilityInfrastructure: prev.facilityInfrastructure.map((item: any, i: number) =>
                              i === idx ? { ...item, status: 'ok' } : item
                            ),
                          }))
                        }
                        className={`flex-1 py-1.5 ${formData.facilityInfrastructure[idx]?.status === 'ok' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        OK
                      </button>
                      <button
                        onClick={() =>
                          setFormData((prev: any) => ({
                            ...prev,
                            facilityInfrastructure: prev.facilityInfrastructure.map((item: any, i: number) =>
                              i === idx ? { ...item, status: 'issue' } : item
                            ),
                          }))
                        }
                        className={`flex-1 py-1.5 ${formData.facilityInfrastructure[idx]?.status === 'issue' ? 'bg-error text-white' : 'hover:bg-gray-50'}`}
                      >
                        Issue
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <select
                      value={formData.facilityInfrastructure[idx]?.priority || 'Normal'}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          facilityInfrastructure: prev.facilityInfrastructure.map((item: any, i: number) =>
                            i === idx ? { ...item, priority: e.target.value } : item
                          ),
                        }))
                      }
                      className="w-full px-2 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Problems in use, work order #"
                      value={formData.facilityInfrastructure[idx]?.comments || ''}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          facilityInfrastructure: prev.facilityInfrastructure.map((item: any, i: number) =>
                            i === idx ? { ...item, comments: e.target.value } : item
                          ),
                        }))
                      }
                      className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Chores */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-primary">Staff Chores</h3>
            </div>
            <div className="p-4 space-y-4">
              {[
                'Workspace clean (common area, desk)',
                'Staff bathroom cleaned and mopped',
                'Dayroom cleaned and mopped',
                'Laundry room cleaned and mopped',
              ].map((label, idx) => (
                <div key={label} className="grid grid-cols-12 items-center gap-4 py-2 border-y border-bd">
                  <div className="col-span-5">
                    <p className="text-sm font-medium text-font-base">{label}</p>
                  </div>
                  <div className="col-span-3">
                    <div className="flex border border-bd rounded-md overflow-hidden text-sm">
                      <button
                        onClick={() =>
                          setFormData((prev: any) => ({
                            ...prev,
                            staffChores: prev.staffChores.map((item: any, i: number) =>
                              i === idx ? { ...item, status: 'satisfactory' } : item
                            ),
                          }))
                        }
                        className={`flex-1 py-1.5 ${formData.staffChores[idx]?.status === 'satisfactory' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                      >
                        Satisfactory
                      </button>
                      <button
                        onClick={() =>
                          setFormData((prev: any) => ({
                            ...prev,
                            staffChores: prev.staffChores.map((item: any, i: number) =>
                              i === idx ? { ...item, status: 'unsatisfactory' } : item
                            ),
                          }))
                        }
                        className={`flex-1 py-1.5 ${formData.staffChores[idx]?.status === 'unsatisfactory' ? 'bg-error text-white' : 'hover:bg-gray-50'}`}
                      >
                        Unsatisfactory
                      </button>
                    </div>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="Notes"
                      value={formData.staffChores[idx]?.comments || ''}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          staffChores: prev.staffChores.map((item: any, i: number) =>
                            i === idx ? { ...item, comments: e.target.value } : item
                          ),
                        }))
                      }
                      className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resident Room Searches */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-4 border-b border-bd bg-primary-lightest/50 rounded-t-lg flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Resident Room Searches</h3>
              {/* <button
                onClick={addRoomSearchRow}
                className="inline-flex items-center px-3 py-1.5 border border-primary text-primary text-sm rounded-md hover:bg-primary-lightest"
              >
                <i className="fa-solid fa-plus mr-1"></i>
                Add Room
              </button> */}
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-font-detail mb-1">Room Number</label>
                  <input
                    type="text"
                    value={roomSearchRoom}
                    onChange={(e) => setRoomSearchRoom(e.target.value)}
                    className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g., 101"
                  />
                </div>
                <div className="col-span-7">
                  <label className="block text-sm font-medium text-font-detail mb-1">Search Comments</label>
                  <input
                    type="text"
                    value={roomSearchComments}
                    onChange={(e) => setRoomSearchComments(e.target.value)}
                    className="w-full px-3 py-1.5 border border-bd rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Notes about the search"
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={addRoomSearchRow}
                    className="mt-5 inline-flex items-center px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary-light"
                  >
                    Add
                  </button>
                </div>
              </div>

              {Array.isArray(formData.roomSearches) && formData.roomSearches.length > 0 && (
                <div className="mt-4 border border-bd rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-bg-subtle">
                      <tr>
                        <th className="p-2 text-left font-medium text-font-detail">Room</th>
                        <th className="p-2 text-left font-medium text-font-detail">Comments</th>
                        <th className="p-2 text-right font-medium text-font-detail">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.roomSearches.map((rs: any, idx: number) => (
                        <tr key={`${rs.room}-${idx}`} className="border-t border-bd">
                          <td className="p-2 text-font-base">{rs.room}</td>
                          <td className="p-2 text-font-base">{rs.comments}</td>
                          <td className="p-2 text-right">
                            <button
                              onClick={() =>
                                setFormData((prev: any) => ({
                                  ...prev,
                                  roomSearches: prev.roomSearches.filter((_: any, i: number) => i !== idx),
                                }))
                              }
                              className="text-error hover:text-error-dark text-xs"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Additional Comments */}
          <section className="bg-white p-6 rounded-lg border border-bd">
            <h3 className="text-lg font-semibold text-primary mb-4">Additional Comments / Notes</h3>
            <textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              placeholder="Any additional comments or notes..."
            />
          </section>
        </div>
      </div>
    </div>
  );
}
