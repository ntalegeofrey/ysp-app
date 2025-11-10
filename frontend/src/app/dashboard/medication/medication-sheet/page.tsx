'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function MedicationSheetInner() {
  const searchParams = useSearchParams();
  const residentId = searchParams.get('resident') || 'A01';

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
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light font-medium text-sm">
              <i className="fa-solid fa-edit mr-2"></i>
              Edit Profile
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
                <div className="text-font-base">Michael Johnson</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Unit Assignment</label>
                <div className="text-font-base">Unit A - Room 12</div>
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
            <button className="bg-success text-white px-4 py-2 rounded-lg hover:bg-primary-alt-dark font-medium text-sm">
              <i className="fa-solid fa-plus mr-2"></i>
              Add New Medication
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Medication card: Risperidone */}
          <div className="border border-bd rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h4 className="text-lg font-semibold text-font-base">Risperidone 2mg</h4>
                <span className="ml-3 bg-primary text-white px-2 py-1 rounded text-xs">Twice Daily</span>
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
                <div className="text-2xl font-bold text-success">28</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Prescribed by</label>
                <div className="text-font-base">Dr. Sarah Wilson</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Special Instructions</label>
                <div className="text-font-base text-sm">Take with food</div>
              </div>
            </div>

            <div className="border-t border-bd pt-4">
              <h5 className="font-semibold text-font-base mb-3">Today's Administration Schedule</h5>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-success-lightest p-4 rounded border-l-4 border-success">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-font-base">Morning Dose - 8:00 AM</span>
                    <span className="bg-success text-white px-2 py-1 rounded text-xs">✓ Given</span>
                  </div>
                  <div className="text-sm text-font-detail">Administered by: J. Smith at 8:15 AM<br />Count after: 27 pills</div>
                </div>
                <div className="bg-highlight-lightest p-4 rounded border-l-4 border-warning">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-font-base">Evening Dose - 8:00 PM</span>
                    <span className="bg-warning text-white px-2 py-1 rounded text-xs">Scheduled</span>
                  </div>
                  <div className="text-sm text-font-detail">Due in 4 hours 45 minutes</div>
                  <button className="mt-2 bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-light">Mark as Given</button>
                </div>
              </div>
            </div>
          </div>

          {/* Medication card: Sertraline */}
          <div className="border border-bd rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h4 className="text-lg font-semibold text-font-base">Sertraline 50mg</h4>
                <span className="ml-3 bg-primary text-white px-2 py-1 rounded text-xs">Once Daily</span>
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
                <div className="text-2xl font-bold text-success">15</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Prescribed by</label>
                <div className="text-font-base">Dr. Sarah Wilson</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Special Instructions</label>
                <div className="text-font-base text-sm">Morning with breakfast</div>
              </div>
            </div>

            <div className="border-t border-bd pt-4">
              <h5 className="font-semibold text-font-base mb-3">Today's Administration Schedule</h5>
              <div className="bg-success-lightest p-4 rounded border-l-4 border-success">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-font-base">Morning Dose - 8:00 AM</span>
                  <span className="bg-success text-white px-2 py-1 rounded text-xs">✓ Given</span>
                </div>
                <div className="text-sm text-font-detail">Administered by: J. Smith at 8:20 AM<br />Count after: 14 pills</div>
              </div>
            </div>
          </div>

          {/* Medication card: Melatonin */}
          <div className="border border-bd rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h4 className="text-lg font-semibold text-font-base">Melatonin 3mg</h4>
                <span className="ml-3 bg-primary text-white px-2 py-1 rounded text-xs">Bedtime</span>
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
                <div className="text-2xl font-bold text-warning">8</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Prescribed by</label>
                <div className="text-font-base">Dr. Sarah Wilson</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-1">Special Instructions</label>
                <div className="text-font-base text-sm">30 min before bed</div>
              </div>
            </div>

            <div className="border-t border-bd pt-4">
              <h5 className="font-semibold text-font-base mb-3">Today's Administration Schedule</h5>
              <div className="bg-highlight-lightest p-4 rounded border-l-4 border-warning">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-font-base">Bedtime Dose - 9:30 PM</span>
                  <span className="bg-warning text-white px-2 py-1 rounded text-xs">Scheduled</span>
                </div>
                <div className="text-sm text-font-detail">Due in 6 hours 15 minutes</div>
                <button className="mt-2 bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-light">Mark as Given</button>
              </div>
            </div>
          </div>
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
            <div className="flex space-x-3">
              <select className="border border-bd rounded-lg px-3 py-2 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light font-medium text-sm">
                <i className="fa-solid fa-download mr-2"></i>
                Export Log
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-section">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">Medication</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">Dosage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-bd">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Oct 28, 2024 8:15 AM</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Risperidone</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">2mg</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="bg-success text-white px-2 py-1 rounded text-xs">Given</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">J. Smith</td>
                <td className="px-6 py-4 text-sm text-font-detail">Taken with breakfast, no issues</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Oct 28, 2024 8:20 AM</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Sertraline</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">50mg</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="bg-success text-white px-2 py-1 rounded text-xs">Given</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">J. Smith</td>
                <td className="px-6 py-4 text-sm text-font-detail">Morning dose administered</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Oct 27, 2024 9:30 PM</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Melatonin</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">3mg</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="bg-success text-white px-2 py-1 rounded text-xs">Given</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">M. Davis</td>
                <td className="px-6 py-4 text-sm text-font-detail">Bedtime dose, resident cooperative</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Oct 27, 2024 8:00 PM</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Risperidone</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">2mg</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="bg-error text-white px-2 py-1 rounded text-xs">Refused</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">M. Davis</td>
                <td className="px-6 py-4 text-sm text-font-detail">Resident refused medication, clinician notified</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Oct 27, 2024 8:15 AM</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Risperidone</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">2mg</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="bg-success text-white px-2 py-1 rounded text-xs">Given</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">T. Wilson</td>
                <td className="px-6 py-4 text-sm text-font-detail">Morning dose administered with food</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Oct 27, 2024 8:20 AM</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Sertraline</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">50mg</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="bg-warning text-white px-2 py-1 rounded text-xs">Late</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">T. Wilson</td>
                <td className="px-6 py-4 text-sm text-font-detail">Given 20 minutes late due to breakfast delay</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Oct 26, 2024 9:30 PM</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Melatonin</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">3mg</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="bg-success text-white px-2 py-1 rounded text-xs">Given</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">K. Johnson</td>
                <td className="px-6 py-4 text-sm text-font-detail">Bedtime dose, resident settled well</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Oct 26, 2024 8:00 PM</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">Risperidone</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">2mg</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="bg-success text-white px-2 py-1 rounded text-xs">Given</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">K. Johnson</td>
                <td className="px-6 py-4 text-sm text-font-detail">Evening dose with dinner</td>
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
