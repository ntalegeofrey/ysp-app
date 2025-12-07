'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/app/hooks/useToast';
import ToastContainer from '@/app/components/Toast';
import * as medicationApi from '@/app/utils/medicationApi';

function MedicationSheetInner() {
  const { toasts, addToast, removeToast } = useToast();
  const searchParams = useSearchParams();
  const residentId = searchParams.get('resident') || 'A01';
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFrequency, setNewMedFrequency] = useState('Once Daily');
  const [newMedInitialCount, setNewMedInitialCount] = useState('');
  const [newMedPhysician, setNewMedPhysician] = useState('');
  const [newMedInstructions, setNewMedInstructions] = useState('');
  const [currentStaff, setCurrentStaff] = useState('Staff Member');
  const [programId, setProgramId] = useState<number | null>(null);
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [resident, setResident] = useState<any>(null);
  const [allergies, setAllergies] = useState('');
  const [lastMedicalReview, setLastMedicalReview] = useState('');
  const [primaryPhysician, setPrimaryPhysician] = useState('');
  const [editingReview, setEditingReview] = useState(false);
  const [editingPhysician, setEditingPhysician] = useState(false);
  const [administrationLogs, setAdministrationLogs] = useState<any[]>([]);

  // Get logged-in staff name and program ID
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        setCurrentStaff(`${firstName} ${lastName}`.trim() || 'Staff Member');
      }
      
      const selectedProgram = localStorage.getItem('selectedProgram');
      if (selectedProgram) {
        const program = JSON.parse(selectedProgram);
        setProgramId(program.id);
      }
    } catch (err) {
      console.error('Failed to parse user:', err);
    }
  }, []);

  // Fetch medications when programId and residentId are available
  useEffect(() => {
    if (programId && residentId) {
      fetchMedications();
      fetchResidentInfo();
      fetchAdministrationLogs();
    }
  }, [programId, residentId]);

  const fetchMedications = async () => {
    if (!programId || !residentId) return;
    try {
      const data = await medicationApi.getResidentMedications(programId, parseInt(residentId));
      setMedications(data);
    } catch (err) {
      console.error('Failed to fetch medications:', err);
      addToast('Failed to load medications', 'error');
    }
  };

  const fetchResidentInfo = async () => {
    if (!programId || !residentId) return;
    try {
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
        const foundResident = residents.find((r: any) => r.id.toString() === residentId);
        if (foundResident) {
          setResident(foundResident);
          // Set allergies from resident data if available
          setAllergies(foundResident.allergies || foundResident.medicalAllergies || 'None reported');
          setPrimaryPhysician(foundResident.primaryPhysician || 'Not assigned');
          setLastMedicalReview(foundResident.lastMedicalReview || 'Not recorded');
        }
      }
    } catch (err) {
      console.error('Failed to fetch resident info:', err);
    }
  };

  const fetchAdministrationLogs = async () => {
    // Placeholder - will implement when backend endpoint is ready
    setAdministrationLogs([]);
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleAddMedication = async () => {
    if (!programId || !residentId) return;
    
    if (!newMedName || !newMedDosage || !newMedInitialCount) {
      addToast('Please fill in all required fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      await medicationApi.addResidentMedication(programId, {
        residentId: parseInt(residentId),
        medicationName: newMedName,
        dosage: newMedDosage,
        frequency: newMedFrequency,
        initialCount: parseInt(newMedInitialCount),
        prescribingPhysician: newMedPhysician || undefined,
        specialInstructions: newMedInstructions || undefined,
      });
      
      addToast(`Medication ${newMedName} added successfully`, 'success');
      
      // Reset form
      setNewMedName('');
      setNewMedDosage('');
      setNewMedFrequency('Once Daily');
      setNewMedInitialCount('');
      setNewMedPhysician('');
      setNewMedInstructions('');
      setShowAddMedicationModal(false);
      
      // Refresh medications list
      fetchMedications();
    } catch (err: any) {
      console.error('Failed to add medication:', err);
      addToast(err.message || 'Failed to add medication', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="medication-main" className="flex-1 p-6 overflow-auto">
      <div id="resident-info-section" className="bg-white rounded-lg border border-bd mb-8">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-user text-primary mr-3"></i>
                Resident Information
              </h3>
              <div className="mt-2 text-sm text-font-detail">Complete medical and medication profile</div>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm">
              <i className="fa-solid fa-print mr-2"></i>
              Print Medsheet
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Resident ID</label>
                <div className="text-lg font-semibold text-primary">#{resident?.id || residentId}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Full Name</label>
                <div className="text-font-base">
                  {resident ? `${resident.firstName} ${resident.lastName}` : 'Loading...'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Room Number</label>
                <div className="text-font-base">
                  {resident?.room || resident?.roomNumber || resident?.unitAssignment || 'Not assigned'}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Date of Birth & Age</label>
                <div className="text-font-base">
                  {resident?.dateOfBirth ? (
                    <>
                      {formatDate(resident.dateOfBirth)} ({calculateAge(resident.dateOfBirth)} years)
                    </>
                  ) : 'Not available'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">
                  Primary Physician
                  <button 
                    onClick={() => setEditingPhysician(!editingPhysician)}
                    className="ml-2 text-primary hover:text-primary/80 text-xs"
                  >
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                </label>
                {editingPhysician ? (
                  <input
                    value={primaryPhysician}
                    onChange={(e) => setPrimaryPhysician(e.target.value)}
                    onBlur={() => setEditingPhysician(false)}
                    className="w-full border border-bd rounded px-2 py-1 text-sm"
                    autoFocus
                  />
                ) : (
                  <div className="text-font-base">{primaryPhysician}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Medical Status</label>
                <span className="bg-success text-white px-2 py-1 rounded text-sm">Active Treatment</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Known Allergies</label>
                <div className={`text-font-base p-2 rounded border-l-4 ${allergies && allergies !== 'None reported' ? 'bg-error-lightest border-error' : 'bg-bg-subtle border-bd'}`}>
                  {allergies}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">
                  Last Medical Review
                  <button 
                    onClick={() => setEditingReview(!editingReview)}
                    className="ml-2 text-primary hover:text-primary/80 text-xs"
                  >
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                </label>
                {editingReview ? (
                  <input
                    type="date"
                    value={lastMedicalReview}
                    onChange={(e) => setLastMedicalReview(e.target.value)}
                    onBlur={() => setEditingReview(false)}
                    className="w-full border border-bd rounded px-2 py-1 text-sm"
                    autoFocus
                  />
                ) : (
                  <div className="text-font-base">{lastMedicalReview === 'Not recorded' ? lastMedicalReview : formatDate(lastMedicalReview)}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="current-medications" className="bg-white rounded-lg border border-bd mb-8">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-pills text-primary mr-3"></i>
                Current Medications & Administration
              </h3>
              <div className="mt-2 text-sm text-font-detail">Active prescriptions and administration schedule</div>
            </div>
            <button 
              onClick={() => setShowAddMedicationModal(true)}
              className="bg-success text-white px-4 py-2 rounded-lg hover:bg-primary-alt-dark font-medium text-sm"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Add New Medication
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {medications.length === 0 ? (
            <div className="text-center py-12 text-font-detail">
              <i className="fa-solid fa-pills text-5xl mb-4 opacity-30"></i>
              <p className="text-lg">No medications currently prescribed</p>
              <p className="text-sm mt-2">Click "Add New Medication" to get started</p>
            </div>
          ) : (
            medications.map((med) => (
              <div key={med.id} className="border border-bd rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h4 className="text-lg font-semibold text-font-base">{med.medicationName} {med.dosage}</h4>
                    <span className="ml-3 bg-primary text-white px-2 py-1 rounded text-xs">{med.frequency}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary hover:bg-primary-lightest p-2 rounded">
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <button className="text-error hover:bg-error-lightest p-2 rounded">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-1">Current Count</label>
                    <div className="text-2xl font-bold text-success">{med.currentCount}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-1">Prescribed by</label>
                    <div className="text-font-base">{med.prescribingPhysician || 'Not specified'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-1">Special Instructions</label>
                    <div className="text-font-base text-sm">{med.specialInstructions || 'None'}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div id="medication-logs" className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-clock-rotate-left text-primary mr-3"></i>
                Medication Administration Log
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Complete history of medication administration for {resident ? `${resident.firstName} ${resident.lastName}` : `Resident ${residentId}`}
              </div>
            </div>
            {administrationLogs.length > 0 && (
              <select className="border border-bd rounded-lg px-3 py-2 text-sm">
                <option value="">All Time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            )}
          </div>
        </div>

        {administrationLogs.length === 0 ? (
          <div className="p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-lightest mb-4">
              <i className="fa-solid fa-clock-rotate-left text-4xl text-primary opacity-50"></i>
            </div>
            <h4 className="text-xl font-semibold text-font-base mb-2">No Administrations Yet</h4>
            <p className="text-font-detail">No medication administrations have been logged for this resident yet.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg-subtle border-b border-bd">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-font-base">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-font-base">Time</th>
                    <th className="px-4 py-3 text-left font-medium text-font-base">Medication</th>
                    <th className="px-4 py-3 text-left font-medium text-font-base">Action</th>
                    <th className="px-4 py-3 text-left font-medium text-font-base">Staff</th>
                    <th className="px-4 py-3 text-left font-medium text-font-base">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {administrationLogs.map((log, idx) => (
                    <tr key={idx} className="border-b border-bd hover:bg-bg-subtle">
                      <td className="px-4 py-3 text-font-base">{log.date}</td>
                      <td className="px-4 py-3 text-font-detail">{log.time}</td>
                      <td className="px-4 py-3 text-font-detail">{log.medication}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          log.action === 'Administered' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-font-detail">{log.staff}</td>
                      <td className="px-4 py-3 text-font-detail">{log.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-bd bg-bg-subtle">
              <div className="flex items-center justify-between">
                <div className="text-sm text-font-detail">Showing {administrationLogs.length} entries</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Medication Modal */}
      {showAddMedicationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-bd sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-plus-circle text-primary mr-3"></i>
                  Add New Medication for {resident ? `${resident.firstName} ${resident.lastName}` : `Resident ${residentId}`}
                </h3>
                <button
                  onClick={() => setShowAddMedicationModal(false)}
                  className="text-font-detail hover:text-error transition-colors"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4 bg-primary-lightest border border-primary/20 rounded-lg p-3">
                <div className="text-sm">
                  <span className="text-font-detail">Adding medication for:</span>{' '}
                  <span className="font-semibold text-font-base">{resident ? `${resident.firstName} ${resident.lastName}` : `Resident ${residentId}`}</span>
                  <span className="mx-2">•</span>
                  <span className="text-font-detail">Added by:</span>{' '}
                  <span className="font-semibold text-font-base">{currentStaff}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">
                    Medication Name <span className="text-error">*</span>
                  </label>
                  <input
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    type="text"
                    placeholder="e.g., Risperidone"
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">
                    Dosage <span className="text-error">*</span>
                  </label>
                  <input
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    type="text"
                    placeholder="e.g., 2mg"
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Frequency</label>
                  <select
                    value={newMedFrequency}
                    onChange={(e) => setNewMedFrequency(e.target.value)}
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option>Once Daily</option>
                    <option>Twice Daily</option>
                    <option>Three Times Daily</option>
                    <option>As Needed (PRN)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">
                    Initial Count <span className="text-error">*</span>
                  </label>
                  <input
                    value={newMedInitialCount}
                    onChange={(e) => setNewMedInitialCount(e.target.value)}
                    type="number"
                    placeholder="30"
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Prescribing Physician</label>
                  <input
                    value={newMedPhysician}
                    onChange={(e) => setNewMedPhysician(e.target.value)}
                    type="text"
                    placeholder="Dr. Name"
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-font-base mb-2">Special Instructions</label>
                  <textarea
                    value={newMedInstructions}
                    onChange={(e) => setNewMedInstructions(e.target.value)}
                    placeholder="Take with food, etc..."
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-24"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-bd bg-bg-subtle flex justify-end gap-3">
              <button
                onClick={() => setShowAddMedicationModal(false)}
                className="px-6 py-2 border border-bd rounded-lg text-font-base hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMedication}
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-check mr-2"></i>
                {loading ? 'Adding...' : 'Add Medication'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </main>
  );
}

export default function MedicationSheetPage() {
  return (
    <Suspense fallback={<main className="flex-1 p-6 overflow-auto" />}> 
      <MedicationSheetInner />
    </Suspense>
  );
}
