'use client';

interface DayDetailModalProps {
  date: string;
  isAdmin: boolean;
  onClose: () => void;
}

export default function DayDetailModal({ date, isAdmin, onClose }: DayDetailModalProps) {
  const dayShiftData = {
    supervisor: 'Wilson, Marcus (JJYDS III)',
    staff: [
      'Rodriguez, Ana (JJYDS I)',
      'Thompson, Kevin (JJYDS II)',
      'Brown, Patricia (JJYDS II)',
      'Martinez, Roberto (JJYDS I)',
      'Johnson, David (JJYDS II)',
      'Anderson, Sarah (JJYDS I)',
      'Clark, Jennifer (JJYDS II)',
      'Lee, Henry (JJYDS I)',
    ],
    shadowing: ['Johnson, Michael (JJYDS I - Week 1 Training)'],
    status: 'Fully Staffed',
    required: 8,
  };

  const eveningShiftData = {
    supervisor: 'Anderson, James (JJYDS II)',
    staff: [
      'Garcia, Luis (JJYDS I)',
      'Smith, Thomas (JJYDS II)',
      'Williams, Christina (JJYDS I)',
      'Taylor, Michelle (JJYDS II)',
      'Jones, Robert (JJYDS I)',
    ],
    openSlots: 1,
    status: 'Needs Coverage',
    required: 6,
    otRequests: 3,
  };

  const nightShiftData = {
    supervisor: 'Brown, Patricia (JJYDS III) - Mandatory OT',
    staff: [
      'Miller, John (JJYDS II)',
      'Davis, Patrick (JJYDS I)',
      'Wilson, Amanda (JJYDS I)',
    ],
    openSlots: 1,
    status: 'Critical',
    required: 4,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-bd p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-font-heading">{date}</h2>
            <p className="text-sm text-font-detail mt-1">View and manage daily shift assignments</p>
          </div>
          <button
            onClick={onClose}
            className="text-font-detail hover:text-font-base p-2"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="border border-success bg-primary-alt-lightest rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-font-heading flex items-center">
                <i className="fa-solid fa-sun text-warning mr-2"></i>
                Day Shift (7AM-3PM)
              </h3>
              <span className="bg-success text-white px-3 py-1 rounded text-sm">
                {dayShiftData.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-font-detail mb-2">SUPERVISOR</div>
                <div className="flex items-center justify-between bg-white border border-bd rounded p-2">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    <span className="text-sm text-font-base">{dayShiftData.supervisor}</span>
                  </div>
                  {isAdmin && (
                    <button className="text-primary text-xs hover:underline">Reassign</button>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-font-detail mb-2">
                  REGULAR STAFF ({dayShiftData.staff.length}/{dayShiftData.required})
                </div>
                <div className="space-y-2">
                  {dayShiftData.staff.map((staff, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-bd rounded p-2">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-font-base rounded-full mr-2"></span>
                        <span className="text-sm text-font-base">{staff}</span>
                      </div>
                      {isAdmin && (
                        <button className="text-error text-xs hover:underline">Remove</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {dayShiftData.shadowing.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-font-detail mb-2">SHADOWING</div>
                  {dayShiftData.shadowing.map((staff, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-bd rounded p-2">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-highlight rounded-full mr-2"></span>
                        <span className="text-sm text-font-base">{staff}</span>
                      </div>
                      {isAdmin && (
                        <button className="text-error text-xs hover:underline">Remove</button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isAdmin && (
                <button className="w-full border-2 border-dashed border-bd-input rounded p-2 text-sm text-font-detail hover:bg-bg-subtle">
                  <i className="fa-solid fa-plus mr-2"></i>
                  Add Staff
                </button>
              )}
            </div>
          </div>

          <div className="border border-warning bg-highlight-lightest rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-font-heading flex items-center">
                <i className="fa-solid fa-cloud-sun text-primary-light mr-2"></i>
                Evening Shift (3PM-11PM)
              </h3>
              <span className="bg-warning text-white px-3 py-1 rounded text-sm">
                {eveningShiftData.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-font-detail mb-2">SUPERVISOR</div>
                <div className="flex items-center justify-between bg-white border border-bd rounded p-2">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    <span className="text-sm text-font-base">{eveningShiftData.supervisor}</span>
                  </div>
                  {isAdmin && (
                    <button className="text-primary text-xs hover:underline">Reassign</button>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-font-detail mb-2">
                  REGULAR STAFF ({eveningShiftData.staff.length}/{eveningShiftData.required})
                </div>
                <div className="space-y-2">
                  {eveningShiftData.staff.map((staff, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-bd rounded p-2">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-font-base rounded-full mr-2"></span>
                        <span className="text-sm text-font-base">{staff}</span>
                      </div>
                      {isAdmin && (
                        <button className="text-error text-xs hover:underline">Remove</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-font-detail mb-2">OPEN SLOTS ({eveningShiftData.openSlots})</div>
                <div className="bg-white border border-success rounded p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-font-base">Open Overtime Slot</div>
                      <div className="text-xs text-font-detail mt-1">
                        {eveningShiftData.otRequests} staff have requested this slot
                      </div>
                    </div>
                    {isAdmin && (
                      <button className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light">
                        View Requests
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {isAdmin && (
                <button className="w-full border-2 border-dashed border-bd-input rounded p-2 text-sm text-font-detail hover:bg-bg-subtle">
                  <i className="fa-solid fa-plus mr-2"></i>
                  Add Staff
                </button>
              )}
            </div>
          </div>

          <div className="border border-error bg-error-lightest rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-font-heading flex items-center">
                <i className="fa-solid fa-moon text-primary mr-2"></i>
                Overnight Shift (11PM-7AM)
              </h3>
              <span className="bg-error text-white px-3 py-1 rounded text-sm">
                {nightShiftData.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-font-detail mb-2">SUPERVISOR</div>
                <div className="flex items-center justify-between bg-white border border-bd rounded p-2">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    <span className="text-sm text-font-base">{nightShiftData.supervisor}</span>
                  </div>
                  {isAdmin && (
                    <button className="text-primary text-xs hover:underline">Reassign</button>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-font-detail mb-2">
                  REGULAR STAFF ({nightShiftData.staff.length}/{nightShiftData.required})
                </div>
                <div className="space-y-2">
                  {nightShiftData.staff.map((staff, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-bd rounded p-2">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-font-base rounded-full mr-2"></span>
                        <span className="text-sm text-font-base">{staff}</span>
                      </div>
                      {isAdmin && (
                        <button className="text-error text-xs hover:underline">Remove</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-font-detail mb-2">CRITICAL OPENINGS ({nightShiftData.openSlots})</div>
                <div className="bg-white border border-error rounded p-3">
                  <div className="text-sm font-medium text-error mb-2">Mandatory OT Needed</div>
                  <div className="text-xs text-font-detail mb-3">
                    No volunteers - assignment required
                  </div>
                  {isAdmin && (
                    <button className="bg-error text-white px-3 py-1 rounded text-xs hover:bg-red-600">
                      Assign Mandatory OT
                    </button>
                  )}
                </div>
              </div>

              {isAdmin && (
                <button className="w-full border-2 border-dashed border-bd-input rounded p-2 text-sm text-font-detail hover:bg-bg-subtle">
                  <i className="fa-solid fa-plus mr-2"></i>
                  Add Staff
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-bg-subtle border-t border-bd p-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-bd rounded-lg text-font-base hover:bg-white"
          >
            Close
          </button>
          {isAdmin && (
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
