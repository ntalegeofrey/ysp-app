'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks/useToast';
import ToastContainer from '@/app/components/Toast';

export default function AssignRepairPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [residents, setResidents] = useState<any[]>([]);
  const [selectedResident, setSelectedResident] = useState('');
  const [preSelectedResident, setPreSelectedResident] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState({ firstName: '', lastName: '', fullName: '', role: '' });
  const [programId, setProgramId] = useState<number | null>(null);
  const [userAssignments, setUserAssignments] = useState<any[]>([]);
  const [isProgramDirector, setIsProgramDirector] = useState(false);
  const [isClinical, setIsClinical] = useState(false);
  const [selectedShift, setSelectedShift] = useState('');
  const [otherShift, setOtherShift] = useState('');
  
  // Form fields
  const [infractionDate, setInfractionDate] = useState('');
  const [infractionBehavior, setInfractionBehavior] = useState('');
  const [otherBehavior, setOtherBehavior] = useState('');
  const [repairLevel, setRepairLevel] = useState('');
  const [interventions, setInterventions] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch user info, program, and residents on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get logged-in user
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        let userEmail = '';
        if (userData) {
          const user = JSON.parse(userData);
          userEmail = user.email || '';
          setCurrentUser({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            fullName: user.fullName || user.name || '',
            role: user.role || ''
          });
        }

        // Get selected program
        const programData = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
        if (programData) {
          const program = JSON.parse(programData);
          setProgramId(program.id);

          // Fetch residents for this program
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          if (token) {
            const resResponse = await fetch(`/api/programs/${program.id}/residents`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resResponse.ok) {
              const resData = await resResponse.json();
              setResidents(resData);
              
              // Check if residentId is in URL query params and pre-select that resident
              const residentIdParam = searchParams.get('residentId');
              if (residentIdParam) {
                setSelectedResident(residentIdParam);
                // Find and store the pre-selected resident to lock the field
                const preSelected = resData.find((r: any) => r.id.toString() === residentIdParam);
                if (preSelected) {
                  setPreSelectedResident(preSelected);
                }
              }
            }

            // Fetch user's assignments to check role
            const assignResponse = await fetch(`/api/programs/${program.id}/assignments`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (assignResponse.ok) {
              const assignments = await assignResponse.json();
              setUserAssignments(assignments);
              
              // Check if user is Program Director or Clinical
              const userAssignment = assignments.find((a: any) => 
                a.userEmail?.toLowerCase() === userEmail?.toLowerCase()
              );
              
              if (userAssignment) {
                const roleType = userAssignment.roleType?.toUpperCase();
                const category = userAssignment.category?.toLowerCase();
                const roleName = userAssignment.roleName?.toLowerCase();
                
                setIsProgramDirector(
                  roleType === 'PROGRAM_DIRECTOR' || 
                  roleType === 'ASSISTANT_DIRECTOR' ||
                  roleType === 'REGIONAL_ADMIN'
                );
                
                // Check if user is clinical - check multiple fields
                const isClinicalRole = 
                  category === 'clinical' ||
                  roleType === 'CLINICAL' ||
                  roleType === 'THERAPIST' ||
                  roleType === 'COUNSELOR' ||
                  roleName?.includes('clinical') ||
                  roleName?.includes('therapist') ||
                  roleName?.includes('counselor');
                
                setIsClinical(isClinicalRole);
                
                console.log('User assignment:', userAssignment);
                console.log('Is Clinical:', isClinicalRole);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [searchParams]);

  const handleSubmit = async () => {
    // Validate behavior field
    const finalBehavior = infractionBehavior === 'Other' ? otherBehavior : infractionBehavior;
    
    if (!selectedResident || !infractionDate || !finalBehavior || !repairLevel) {
      addToast('Please fill in all required fields', 'warning');
      return;
    }

    if (!programId) {
      addToast('No program selected', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        addToast('Not authenticated', 'error');
        return;
      }

      const response = await fetch(`/api/programs/${programId}/repairs/interventions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          residentId: parseInt(selectedResident),
          infractionDate,
          infractionShift: selectedShift === 'Other' ? otherShift : selectedShift,
          infractionBehavior: finalBehavior,
          repairLevel,
          interventionsJson: JSON.stringify(interventions),
          comments,
          reviewDate,
          pointsSuspended: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        addToast(`Repair #${data.id} created successfully!`, 'success');
        // Reset form
        setSelectedResident('');
        setInfractionDate('');
        setSelectedShift('');
        setOtherShift('');
        setInfractionBehavior('');
        setOtherBehavior('');
        setRepairLevel('');
        setInterventions([]);
        setComments('');
        setReviewDate('');
      } else {
        const error = await response.text();
        addToast(`Error: ${error}`, 'error');
      }
    } catch (error) {
      console.error('Error submitting repair:', error);
      addToast('Failed to create repair', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-font-detail">Create a new behavioral repair record for a resident.</p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-bg-subtle text-font-base rounded-lg text-sm font-medium hover:bg-bd hover:text-font-base transition-colors">
            <i className="fa-solid fa-times mr-2"></i>
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <i className="fa-solid fa-check mr-2"></i>
            {submitting ? 'Submitting...' : 'Submit Repair'}
          </button>
        </div>
      </div>

      {/* Assign Repair Form */}
      <div className="bg-white p-8 rounded-xl border border-bd shadow-sm">
        {/* Infraction Details */}
        <section className="border-b border-bd pb-6">
          <h3 className="text-lg font-semibold text-font-base mb-4">Infraction Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="resident-select" className="block text-sm font-medium text-font-detail mb-1">
                Youth/Resident
              </label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-font-medium z-10"></i>
                {preSelectedResident ? (
                  <input
                    type="text"
                    value={`${preSelectedResident.firstName} ${preSelectedResident.lastName} (ID: ${preSelectedResident.residentId || '000001'})`}
                    disabled
                    className="w-full border border-bd rounded-lg pl-9 pr-4 py-2 text-sm bg-bg-subtle text-font-base cursor-not-allowed"
                  />
                ) : (
                  <select
                    id="resident-select"
                    value={selectedResident}
                    onChange={(e) => setSelectedResident(e.target.value)}
                    className="w-full border border-bd rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="">Select a resident...</option>
                    {residents.map((resident) => (
                      <option key={resident.id} value={resident.id}>
                        {resident.firstName} {resident.lastName} {resident.residentId ? `(ID: ${resident.residentId})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="infraction-date" className="block text-sm font-medium text-font-detail mb-1">
                Date of Infraction
              </label>
              <input
                type="date"
                id="infraction-date"
                value={infractionDate}
                onChange={(e) => setInfractionDate(e.target.value)}
                className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label htmlFor="infraction-shift" className="block text-sm font-medium text-font-detail mb-1">
                Shift of Infraction
              </label>
              <select
                id="infraction-shift"
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="" disabled>Select Shift</option>
                <option value="1st Shift">1st Shift</option>
                <option value="2nd Shift">2nd Shift</option>
                <option value="3rd Shift">3rd Shift</option>
                <option value="Other">Other (Specify)</option>
              </select>
              {selectedShift === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify shift..."
                  value={otherShift}
                  onChange={(e) => setOtherShift(e.target.value)}
                  className="mt-2 w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              )}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="infraction-behavior" className="block text-sm font-medium text-font-detail mb-1">
                Infraction Behavior
              </label>
              <select
                id="infraction-behavior"
                value={infractionBehavior}
                onChange={(e) => setInfractionBehavior(e.target.value)}
                className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="">Select Behavior...</option>
                <option value="Disrespect to Staff">Disrespect to Staff</option>
                <option value="Fighting">Fighting</option>
                <option value="Contraband">Contraband</option>
                <option value="Refusal to Follow Directives">Refusal to Follow Directives</option>
                <option value="Other">Other (Specify)</option>
              </select>
              {infractionBehavior === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify behavior..."
                  value={otherBehavior}
                  onChange={(e) => setOtherBehavior(e.target.value)}
                  className="mt-2 w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              )}
            </div>
            <div>
              <label htmlFor="assigning-staff" className="block text-sm font-medium text-font-detail mb-1">
                Staff Assigning Repair
              </label>
              <input
                type="text"
                id="assigning-staff"
                value={`${currentUser.firstName} ${currentUser.lastName}`.trim() || currentUser.fullName || 'Loading...'}
                disabled
                className="w-full bg-bg-subtle border border-bd rounded-lg px-3 py-2 text-sm text-font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* Repair Level & Interventions */}
        <section className="pt-6">
          <h3 className="text-lg font-semibold text-font-base mb-1">Repair Level & Interventions</h3>
          <p className="text-sm text-font-detail mb-4">
            Select the appropriate repair level. Point accrual will be suspended for the duration of the repair.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Repair 1 */}
            <div 
              onClick={() => setRepairLevel('Repair 1')}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                repairLevel === 'Repair 1' 
                  ? 'border-primary border-2 bg-primary-lightest shadow-md' 
                  : 'border-primary-lighter bg-primary-lightest/50 hover:border-primary'
              }`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-primary">Repair 1 {repairLevel === 'Repair 1' && '✓'}</h4>
                <span className="text-xs font-medium text-primary bg-primary-lighter/30 px-2 py-1 rounded-full">1 Active Shift</span>
              </div>
              <div className="space-y-2 text-sm">
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Written apology</label>
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Make a card</label>
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Update Distress Tolerance</label>
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Coping plan</label>
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Mini-chain analysis</label>
                <input type="text" placeholder="Other..." className="mt-2 w-full border border-bd rounded-md px-2 py-1 text-xs" />
              </div>
            </div>

            {/* Repair 2 */}
            <div 
              onClick={() => setRepairLevel('Repair 2')}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                repairLevel === 'Repair 2' 
                  ? 'border-warning border-2 bg-warning/10 shadow-md' 
                  : 'border-warning/50 bg-warning/5 hover:border-warning'
              }`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-yellow-700">Repair 2 {repairLevel === 'Repair 2' && '✓'}</h4>
                <span className="text-xs font-medium text-yellow-700 bg-warning/20 px-2 py-1 rounded-full">1-3 Active Shifts</span>
              </div>
              <div className="space-y-2 text-sm">
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Clean classrooms</label>
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Empty all trash on program</label>
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Sweep & mop floors</label>
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Clean school bathroom</label>
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Wipe down dining area</label>
                <input type="text" placeholder="Other..." className="mt-2 w-full border border-bd rounded-md px-2 py-1 text-xs" />
              </div>
            </div>

            {/* Repair 3 */}
            <div 
              onClick={() => setRepairLevel('Repair 3')}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                repairLevel === 'Repair 3' 
                  ? 'border-error border-2 bg-error/10 shadow-md' 
                  : 'border-error/50 bg-error/5 hover:border-error'
              }`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-error">Repair 3 / 3+ {repairLevel === 'Repair 3' && '✓'}</h4>
                <span className="text-xs font-medium text-error bg-error/20 px-2 py-1 rounded-full">3-7+ Active Shifts</span>
              </div>
              <div className="space-y-2 text-sm">
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />DBT packet</label>
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Co-facilitate DBT activity</label>
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Clinical Reflection</label>
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Character Essay</label>
                <label className="flex items-center"><input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary mr-2" />Mediation</label>
                <input type="text" placeholder="Other..." className="mt-2 w-full border border-bd rounded-md px-2 py-1 text-xs" />
              </div>
            </div>
          </div>
        </section>

        {/* Comments & Review */}
        <section className="pt-6 mt-6 border-t border-bd">
          <h3 className="text-lg font-semibold text-font-base mb-4">Comments & Review</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-font-detail mb-1">
                Comments about behaviors
              </label>
              <textarea
                id="comments"
                rows={6}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full border border-bd rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Provide a detailed description of the incident and behavior..."
              />
            </div>
            <div>
              <label htmlFor="review-date" className="block text-sm font-medium text-font-detail mb-1">
                Review Date
              </label>
              <input
                type="date"
                id="review-date"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              <p className="text-xs text-font-detail mt-2">
                <i className="fa-solid fa-info-circle mr-1"></i>
                After submission, this repair will be sent for Program Director and Clinical review.
              </p>
            </div>
          </div>
        </section>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
