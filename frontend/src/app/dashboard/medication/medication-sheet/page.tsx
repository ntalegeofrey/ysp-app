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
      
      const selectedProgramId = localStorage.getItem('selectedProgramId');
      if (selectedProgramId) {
        setProgramId(parseInt(selectedProgramId));
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
        }
      }
    } catch (err) {
      console.error('Failed to fetch resident info:', err);
    }
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
                <div className="text-lg font-semibold text-primary">{residentId}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Full Name</label>
                <div className="text-font-base">
                  {resident ? `${resident.firstName} ${resident.lastName}` : 'Loading...'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Unit Assignment</label>
                <div className="text-font-base">
                  {resident?.unitAssignment || resident?.roomNumber || 'Not assigned'}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Age</label>
                <div className="text-font-base">17 years</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Primary Physician</label>
                <div className="text-font-base">Dr. Sarah Wilson</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Medical Status</label>
                <span className="bg-success text-white px-2 py-1 rounded text-sm">Active Treatment</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Known Allergies</label>
                <div className="text-font-base bg-error-lightest p-2 rounded border-l-4 border-error">Penicillin, Shellfish</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Last Medical Review</label>
                <div className="text-font-base">October 15, 2024</div>
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
              <div className="mt-2 text-sm text-font-detail">Complete history of medication administration for Resident {residentId}</div>
            </div>
            <select className="border border-bd rounded-lg px-3 py-2 text-sm">
              <option value="">All Time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

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
              <tr className="border-b border-bd hover:bg-bg-subtle">
                <td className="px-4 py-3 text-font-base">2024-12-05</td>
                <td className="px-4 py-3 text-font-detail">8:15 AM</td>
                <td className="px-4 py-3 text-font-detail">Risperidone 2mg</td>
                <td className="px-4 py-3"><span className="inline-block px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">Administered</span></td>
                <td className="px-4 py-3 text-font-detail">J. Smith</td>
                <td className="px-4 py-3 text-font-detail">Taken with breakfast, no issues</td>
              </tr>
              <tr className="border-b border-bd hover:bg-bg-subtle">
                <td className="px-4 py-3 text-font-base">2024-12-05</td>
                <td className="px-4 py-3 text-font-detail">8:20 AM</td>
                <td className="px-4 py-3 text-font-detail">Sertraline 50mg</td>
                <td className="px-4 py-3"><span className="inline-block px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">Administered</span></td>
                <td className="px-4 py-3 text-font-detail">J. Smith</td>
                <td className="px-4 py-3 text-font-detail">Morning dose administered</td>
              </tr>
              <tr className="border-b border-bd hover:bg-bg-subtle">
                <td className="px-4 py-3 text-font-base">2024-12-04</td>
                <td className="px-4 py-3 text-font-detail">9:30 PM</td>
                <td className="px-4 py-3 text-font-detail">Melatonin 3mg</td>
                <td className="px-4 py-3"><span className="inline-block px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">Administered</span></td>
                <td className="px-4 py-3 text-font-detail">M. Davis</td>
                <td className="px-4 py-3 text-font-detail">Bedtime dose, resident cooperative</td>
              </tr>
              <tr className="border-b border-bd hover:bg-bg-subtle">
                <td className="px-4 py-3 text-font-base">2024-12-04</td>
                <td className="px-4 py-3 text-font-detail">8:00 PM</td>
                <td className="px-4 py-3 text-font-detail">Risperidone 2mg</td>
                <td className="px-4 py-3"><span className="inline-block px-2 py-1 rounded text-xs font-medium bg-error/10 text-error">Refused</span></td>
                <td className="px-4 py-3 text-font-detail">M. Davis</td>
                <td className="px-4 py-3 text-font-detail">Resident refused medication, clinician notified</td>
              </tr>
              <tr className="border-b border-bd hover:bg-bg-subtle">
                <td className="px-4 py-3 text-font-base">2024-12-04</td>
                <td className="px-4 py-3 text-font-detail">8:15 AM</td>
                <td className="px-4 py-3 text-font-detail">Risperidone 2mg</td>
                <td className="px-4 py-3"><span className="inline-block px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">Administered</span></td>
                <td className="px-4 py-3 text-font-detail">T. Wilson</td>
                <td className="px-4 py-3 text-font-detail">Morning dose administered with food</td>
              </tr>
              <tr className="border-b border-bd hover:bg-bg-subtle">
                <td className="px-4 py-3 text-font-base">2024-12-04</td>
                <td className="px-4 py-3 text-font-detail">8:20 AM</td>
                <td className="px-4 py-3 text-font-detail">Sertraline 50mg</td>
                <td className="px-4 py-3"><span className="inline-block px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">Administered</span></td>
                <td className="px-4 py-3 text-font-detail">T. Wilson</td>
                <td className="px-4 py-3 text-font-detail">-</td>
              </tr>
              <tr className="border-b border-bd hover:bg-bg-subtle">
                <td className="px-4 py-3 text-font-base">2024-12-03</td>
                <td className="px-4 py-3 text-font-detail">9:30 PM</td>
                <td className="px-4 py-3 text-font-detail">Melatonin 3mg</td>
                <td className="px-4 py-3"><span className="inline-block px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">Administered</span></td>
                <td className="px-4 py-3 text-font-detail">K. Johnson</td>
                <td className="px-4 py-3 text-font-detail">Bedtime dose, resident settled well</td>
              </tr>
              <tr className="border-b border-bd hover:bg-bg-subtle">
                <td className="px-4 py-3 text-font-base">2024-12-03</td>
                <td className="px-4 py-3 text-font-detail">8:00 PM</td>
                <td className="px-4 py-3 text-font-detail">Risperidone 2mg</td>
                <td className="px-4 py-3"><span className="inline-block px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">Administered</span></td>
                <td className="px-4 py-3 text-font-detail">K. Johnson</td>
                <td className="px-4 py-3 text-font-detail">Evening dose with dinner</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-bd bg-bg-subtle">
          <div className="flex items-center justify-between">
            <div className="text-sm text-font-detail">Showing 8 of 45 entries</div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-bd rounded text-sm text-font-detail hover:bg-primary-lightest">Previous</button>
              <button className="px-3 py-2 bg-primary text-white rounded text-sm hover:bg-primary-light">1</button>
              <button className="px-3 py-2 border border-bd rounded text-sm text-font-detail hover:bg-primary-lightest">2</button>
              <button className="px-3 py-2 border border-bd rounded text-sm text-font-detail hover:bg-primary-lightest">3</button>
              <button className="px-3 py-2 border border-bd rounded text-sm text-font-detail hover:bg-primary-lightest">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Medication Modal */}
      {showAddMedicationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-bd sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-plus-circle text-primary mr-3"></i>
                  Add New Medication for Resident {residentId}
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
                  <span className="font-semibold text-font-base">Resident {residentId}</span>
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
