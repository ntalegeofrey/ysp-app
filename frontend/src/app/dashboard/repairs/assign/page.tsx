'use client';

import { useState, useEffect } from 'react';

export default function AssignRepairPage() {
  const [residents, setResidents] = useState<any[]>([]);
  const [selectedResident, setSelectedResident] = useState('');
  const [currentUser, setCurrentUser] = useState({ firstName: '', lastName: '', fullName: '', role: '' });
  const [programId, setProgramId] = useState<number | null>(null);
  const [userAssignments, setUserAssignments] = useState<any[]>([]);
  const [isProgramDirector, setIsProgramDirector] = useState(false);
  const [isClinical, setIsClinical] = useState(false);
  const [selectedShift, setSelectedShift] = useState('');
  const [otherShift, setOtherShift] = useState('');

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
                const category = userAssignment.category;
                
                setIsProgramDirector(
                  roleType === 'PROGRAM_DIRECTOR' || 
                  roleType === 'ASSISTANT_DIRECTOR' ||
                  roleType === 'REGIONAL_ADMIN'
                );
                
                setIsClinical(category?.toLowerCase() === 'clinical');
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);
  return (
    <div className="space-y-6">
      {/* Page actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-font-detail">Create a new behavioral repair record for a resident.</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 border border-bd rounded-lg text-sm text-font-detail hover:text-primary hover:border-primary">
            <i className="fa-solid fa-print mr-2"></i>
            Print
          </button>
          <button className="px-4 py-2 bg-primary-lightest text-primary rounded-lg text-sm font-medium hover:bg-primary-lighter hover:text-white">
            <i className="fa-solid fa-times mr-2"></i>
            Cancel
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">
            <i className="fa-solid fa-check mr-2"></i>
            Submit Repair
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
              </div>
            </div>
            <div>
              <label htmlFor="infraction-date" className="block text-sm font-medium text-font-detail mb-1">
                Date of Infraction
              </label>
              <input
                type="date"
                id="infraction-date"
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
                className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                defaultValue=""
              >
                <option value="" disabled>Select Behavior...</option>
                <option>Disrespect to Staff</option>
                <option>Fighting</option>
                <option>Contraband</option>
                <option>Refusal to Follow Directives</option>
              </select>
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
            <div className="border border-primary-lighter rounded-lg p-4 bg-primary-lightest">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-primary">Repair 1</h4>
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
            <div className="border border-warning rounded-lg p-4 bg-warning/5">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-yellow-700">Repair 2</h4>
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
            <div className="border border-error rounded-lg p-4 bg-error/5">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-error">Repair 3 / 3+</h4>
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
                className="w-full border border-bd rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Provide a detailed description of the incident and behavior..."
              ></textarea>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="review-date" className="block text-sm font-medium text-font-detail mb-1">
                  Review Date
                </label>
                <input
                  type="date"
                  id="review-date"
                  className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-detail mb-2">
                  Program Director/AD Review
                </label>
                {isProgramDirector ? (
                  <div className="space-y-3">
                    <textarea
                      placeholder="Add review comments (optional)..."
                      rows={3}
                      className="w-full border border-bd rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    ></textarea>
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success/90 transition-colors">
                        <i className="fa-solid fa-check mr-2"></i>
                        Approve
                      </button>
                      <button className="flex-1 px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-error/90 transition-colors">
                        <i className="fa-solid fa-times mr-2"></i>
                        Disapprove
                      </button>
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Pending Review"
                    disabled
                    className="w-full bg-bg-subtle border border-bd rounded-lg px-3 py-2 text-sm text-font-medium cursor-not-allowed"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-font-detail mb-2">
                  Clinical Review
                </label>
                {isClinical ? (
                  <div className="space-y-3">
                    <textarea
                      placeholder="Add review comments (optional)..."
                      rows={3}
                      className="w-full border border-bd rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    ></textarea>
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success/90 transition-colors">
                        <i className="fa-solid fa-check mr-2"></i>
                        Approve
                      </button>
                      <button className="flex-1 px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-error/90 transition-colors">
                        <i className="fa-solid fa-times mr-2"></i>
                        Disapprove
                      </button>
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Pending Review"
                    disabled
                    className="w-full bg-bg-subtle border border-bd rounded-lg px-3 py-2 text-sm text-font-medium cursor-not-allowed"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
