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
    const storedProgramId = typeof window !== 'undefined' ? localStorage.getItem('selectedProgramId') : null;
    setProgramId(storedProgramId);

    if (!storedProgramId || !reportId) {
      router.push('/dashboard/ucr');
      return;
    }

    // Fetch the report
    const fetchReport = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await fetch(`/api/programs/${storedProgramId}/ucr/reports/${reportId}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (!response.ok) {
          addToast('Failed to load report', 'error');
          router.push('/dashboard/ucr');
          return;
        }

        const data = await response.json();
        
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

          {/* Placeholder for full form - Copy all sections from main page */}
          <div className="bg-white rounded-lg border border-bd p-6">
            <div className="text-center py-12 text-font-detail">
              <i className="fa-solid fa-pen-to-square text-4xl mb-4 text-primary"></i>
              <p className="text-lg font-medium">Full form sections will be added here</p>
              <p className="mt-2">Copy all form sections from the main UCR page:</p>
              <ul className="mt-4 text-left max-w-md mx-auto space-y-1">
                <li>• Security Equipment & Procedures</li>
                <li>• Administrative Offices</li>
                <li>• Facility Infrastructure</li>
                <li>• Staff Chores</li>
                <li>• Resident Room Searches</li>
                <li>• Additional Comments</li>
              </ul>
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
