'use client';

import { useState } from 'react';

export default function LogbookPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'archive'>('current');

  const tabBtnBase = 'py-2 px-1 border-b-2 text-sm font-medium';
  const tabActive = 'border-primary text-primary';
  const tabInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div>
        <div className="border-b border-bd">
          <nav className="-mb-px flex space-x-8">
            <button className={`${tabBtnBase} ${activeTab === 'current' ? tabActive : tabInactive}`} onClick={() => setActiveTab('current')}>
              Current Shift Log
            </button>
            <button className={`${tabBtnBase} ${activeTab === 'archive' ? tabActive : tabInactive}`} onClick={() => setActiveTab('archive')}>
              Historical Logs Archive
            </button>
          </nav>
        </div>
      </div>

      {/* Current Shift Log */}
      {activeTab === 'current' && (
        <div className="space-y-8">
          {/* On-Duty Staff Assignment */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-users text-primary mr-3"></i>
                On-Duty Staff Assignment
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-font-base mb-4">Shift Details</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Date</label>
                        <input type="date" defaultValue="2024-10-28" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Shift</label>
                        <select defaultValue="Night (11:00 PM - 7:00 AM)" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                          <option>Day (7:00 AM - 3:00 PM)</option>
                          <option>Evening (3:00 PM - 11:00 PM)</option>
                          <option>Night (11:00 PM - 7:00 AM)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Unit Supervisor</label>
                      <input type="text" defaultValue="John Smith" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Unit Assignment</label>
                      <select defaultValue="Unit B" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                        <option>Unit A</option>
                        <option>Unit B</option>
                        <option>Unit C</option>
                        <option>Unit D</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-font-base mb-4">Add Staff Member</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Staff Name</label>
                      <input type="text" placeholder="Enter staff name" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Position</label>
                      <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                        <option>JJYDS I</option>
                        <option>JJYDS II</option>
                        <option>JJYDS III</option>
                        <option>Caseworker</option>
                        <option>Support Staff</option>
                        <option>Medical Staff</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Duties</label>
                      <input type="text" placeholder="e.g., Unit Supervision, Security Rounds" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Status</label>
                        <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                          <option>Regular</option>
                          <option>Overtime</option>
                          <option>Force</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light flex items-center justify-center">
                          <i className="fa-solid fa-plus mr-2"></i>
                          Add Staff
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                {[{ name: 'Sarah Johnson', role: 'JJYDS II', duties: 'Unit Supervision, Resident Support', tag: 'Regular', tagClass: 'bg-primary-alt' }, { name: 'Mike Rodriguez', role: 'JJYDS I', duties: 'Security Rounds, Equipment Check', tag: 'Overtime', tagClass: 'bg-warning' }, { name: 'Dr. Lisa Chen', role: 'Medical Staff', duties: 'Medical Rounds, Emergency Response', tag: 'Force', tagClass: 'bg-error' }].map((s) => (
                  <div key={s.name} className="bg-bg-subtle rounded-lg p-4 border border-bd">
                    <div className="grid grid-cols-5 gap-4">
                      <div><span className="text-sm font-medium text-font-base">{s.name}</span></div>
                      <div><span className="text-sm text-font-detail">{s.role}</span></div>
                      <div><span className="text-sm text-font-detail">{s.duties}</span></div>
                      <div><span className={`${s.tagClass} text-white px-2 py-1 rounded text-xs`}>{s.tag}</span></div>
                      <div className="text-right"><button className="text-error hover:text-error-lighter"><i className="fa-solid fa-trash text-sm"></i></button></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shift Information & Equipment Count */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-info-circle text-primary mr-3"></i>
                Shift Information & Equipment Count
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-font-base mb-4">Shift Details</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Date</label>
                        <input type="date" defaultValue="2024-10-28" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Shift</label>
                        <select defaultValue="Night (11:00 PM - 7:00 AM)" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                          <option>Day (7:00 AM - 3:00 PM)</option>
                          <option>Evening (3:00 PM - 11:00 PM)</option>
                          <option>Night (11:00 PM - 7:00 AM)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Supervisor</label>
                        <input type="text" defaultValue="John Smith" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Unit</label>
                        <select defaultValue="Unit B" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                          <option>Unit A</option>
                          <option>Unit B</option>
                          <option>Unit C</option>
                          <option>Unit D</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-font-base mb-4">Equipment Count</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'BIGs (Room Keys)', val: 12, ok: true },
                      { label: 'Duty Belts', val: 8, ok: true },
                      { label: 'Staff Keys', val: 8, ok: true },
                      { label: 'Flashlights', val: 6, ok: false },
                      { label: 'J-Hooks', val: 8, ok: true },
                      { label: 'Pencils', val: 15, ok: true },
                    ].map((i) => (
                      <div key={i.label}>
                        <label className="block text-sm font-medium text-font-base mb-2">{i.label}</label>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue={i.val} className="flex-1 border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                          <span className={`${i.ok ? 'bg-success' : 'bg-warning'} text-white px-2 py-1 rounded text-xs`}>{i.ok ? '✓' : '!'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Events & Shift Documentation */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-key text-primary mr-3"></i>
                Key Events & Shift Documentation
              </h3>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="font-medium text-font-base mb-4">Residents on Unit Summary</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Resident Initials</label>
                    <input type="text" placeholder="e.g., J.D., M.S., A.R." className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Total Count</label>
                    <input type="number" defaultValue={8} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                </div>
                <textarea className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-24 focus:ring-2 focus:ring-primary focus:border-primary" placeholder="General comments about residents' behavior, mood, or notable observations during this shift..."></textarea>
              </div>
              <div>
                <h4 className="font-medium text-font-base mb-4">Incidents & Events</h4>
                <textarea className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-32 focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Document any incidents, behavioral issues, medical concerns, maintenance problems, or significant events that occurred during this shift..."></textarea>
              </div>
              <div>
                <h4 className="font-medium text-font-base mb-4">Scanned Log Book Pages</h4>
                <div className="border-2 border-dashed border-bd rounded-lg p-8 text-center">
                  <i className="fa-solid fa-cloud-upload-alt text-4xl text-primary-lighter mb-4"></i>
                  <p className="text-font-detail mb-2">Drop scanned log book pages here or click to upload</p>
                  <input type="file" multiple accept="image/*,.pdf" className="hidden" id="scan-upload" />
                  <label htmlFor="scan-upload" className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-light transition-colors">Choose Files</label>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-font-base mb-4">Shift Summary</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Overall Status</label>
                      <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                        <option>Routine</option>
                        <option>Warning</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Follow-up Required</label>
                      <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                        <option>No</option>
                        <option>Yes - Next Shift</option>
                        <option>Yes - Supervisor</option>
                        <option>Yes - Medical</option>
                        <option>Yes - Administration</option>
                      </select>
                    </div>
                  </div>
                  <textarea className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-32 focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Provide a concise summary of the shift, including key accomplishments, challenges, and any immediate follow-up actions needed..."></textarea>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light font-medium">Submit Shift Report</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Logs Archive */}
      {activeTab === 'archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-archive text-primary mr-3"></i>
              Historical Shift Logs Archive
            </h3>
          </div>
          <div className="p-6">
            <div className="mb-6 grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Date Range</label>
                <input type="date" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">To</label>
                <input type="date" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Shift</label>
                <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                  <option>All Shifts</option>
                  <option>Day</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Status</label>
                <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                  <option>All Status</option>
                  <option>Routine</option>
                  <option>Warning</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-bd">
                    <th className="text-left py-3 px-4 font-medium text-font-base">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-font-base">Shift</th>
                    <th className="text-left py-3 px-4 font-medium text-font-base">Supervisor</th>
                    <th className="text-left py-3 px-4 font-medium text-font-base">Summary</th>
                    <th className="text-left py-3 px-4 font-medium text-font-base">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-font-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-bd hover:bg-bg-subtle">
                    <td className="py-3 px-4 text-sm text-font-base">Oct 27, 2024</td>
                    <td className="py-3 px-4 text-sm text-font-detail">Night</td>
                    <td className="py-3 px-4 text-sm text-font-detail">John Smith</td>
                    <td className="py-3 px-4 text-sm text-font-detail">Routine night shift, medical call at 2:30 AM...</td>
                    <td className="py-3 px-4"><span className="bg-warning text-white px-2 py-1 rounded text-xs">High</span></td>
                    <td className="py-3 px-4"><button className="text-primary hover:text-primary-light mr-2"><i className="fa-solid fa-eye"></i></button><button className="text-primary hover:text-primary-light"><i className="fa-solid fa-download"></i></button></td>
                  </tr>
                  <tr className="border-b border-bd hover:bg-bg-subtle">
                    <td className="py-3 px-4 text-sm text-font-base">Oct 27, 2024</td>
                    <td className="py-3 px-4 text-sm text-font-detail">Evening</td>
                    <td className="py-3 px-4 text-sm text-font-detail">Maria Lopez</td>
                    <td className="py-3 px-4 text-sm text-font-detail">Quiet evening, all residents cooperative...</td>
                    <td className="py-3 px-4"><span className="bg-success text-white px-2 py-1 rounded text-xs">Routine</span></td>
                    <td className="py-3 px-4"><button className="text-primary hover:text-primary-light mr-2"><i className="fa-solid fa-eye"></i></button><button className="text-primary hover:text-primary-light"><i className="fa-solid fa-download"></i></button></td>
                  </tr>
                  <tr className="border-b border-bd hover:bg-bg-subtle">
                    <td className="py-3 px-4 text-sm text-font-base">Oct 26, 2024</td>
                    <td className="py-3 px-4 text-sm text-font-detail">Day</td>
                    <td className="py-3 px-4 text-sm text-font-detail">Robert Kim</td>
                    <td className="py-3 px-4 text-sm text-font-detail">Incident in common area, lockdown initiated...</td>
                    <td className="py-3 px-4"><span className="bg-error text-white px-2 py-1 rounded text-xs">Critical</span></td>
                    <td className="py-3 px-4"><button className="text-primary hover:text-primary-light mr-2"><i className="fa-solid fa-eye"></i></button><button className="text-primary hover:text-primary-light"><i className="fa-solid fa-download"></i></button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center">
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light font-medium">
                <i className="fa-solid fa-chevron-down mr-2"></i>
                Load More Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
