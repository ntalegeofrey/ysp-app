'use client';

import { useState } from 'react';
import StaffSelectionModal from './StaffSelectionModal';

interface StaffMember {
  id: string;
  name: string;
  position: string;
  category: string;
  available: boolean;
}

interface DayDetailModalProps {
  date: string;
  isAdmin: boolean;
  onClose: () => void;
  isUnscheduled?: boolean;
}

export default function DayDetailModal({ date, isAdmin, onClose, isUnscheduled = false }: DayDetailModalProps) {
  const [dayStaff, setDayStaff] = useState<StaffMember[]>([]);
  const [eveningStaff, setEveningStaff] = useState<StaffMember[]>([]);
  const [nightStaff, setNightStaff] = useState<StaffMember[]>([]);
  const [showStaffSelector, setShowStaffSelector] = useState(false);
  const [currentShift, setCurrentShift] = useState<'day' | 'evening' | 'night' | null>(null);

  const handleAddStaffClick = (shift: 'day' | 'evening' | 'night') => {
    setCurrentShift(shift);
    setShowStaffSelector(true);
  };

  const handleStaffAdded = (selectedStaff: StaffMember[]) => {
    if (currentShift === 'day') {
      setDayStaff([...dayStaff, ...selectedStaff]);
    } else if (currentShift === 'evening') {
      setEveningStaff([...eveningStaff, ...selectedStaff]);
    } else if (currentShift === 'night') {
      setNightStaff([...nightStaff, ...selectedStaff]);
    }
    setShowStaffSelector(false);
    setCurrentShift(null);
  };

  const removeStaff = (shift: 'day' | 'evening' | 'night', staffId: string) => {
    if (shift === 'day') {
      setDayStaff(dayStaff.filter(s => s.id !== staffId));
    } else if (shift === 'evening') {
      setEveningStaff(eveningStaff.filter(s => s.id !== staffId));
    } else if (shift === 'night') {
      setNightStaff(nightStaff.filter(s => s.id !== staffId));
    }
  };

  const isScheduleEmpty = dayStaff.length === 0 && eveningStaff.length === 0 && nightStaff.length === 0;

  const renderShift = (shift: 'day' | 'evening' | 'night') => {
    const shiftLabels = {
      day: { name: 'Day Shift (7AM-3PM)', icon: 'fa-sun', color: 'warning' },
      evening: { name: 'Evening Shift (3PM-11PM)', icon: 'fa-cloud-sun', color: 'primary-light' },
      night: { name: 'Overnight Shift (11PM-7AM)', icon: 'fa-moon', color: 'primary' },
    };
    
    const currentShiftData = shift === 'day' ? dayStaff : shift === 'evening' ? eveningStaff : nightStaff;
    const label = shiftLabels[shift];
    const supervisors = currentShiftData.filter(s => s.category === 'supervisor');
    const staff = currentShiftData.filter(s => s.category === 'staff');

    return (
      <div className="border border-bd rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-font-heading flex items-center">
            <i className={`fa-solid ${label.icon} text-${label.color} mr-2`}></i>
            {label.name}
          </h3>
          {currentShiftData.length > 0 && (
            <span className="bg-success text-white px-3 py-1 rounded text-sm">
              {currentShiftData.length} assigned
            </span>
          )}
        </div>

        {currentShiftData.length === 0 ? (
          <div className="text-center py-8">
            <i className="fa-solid fa-users-slash text-font-detail text-4xl opacity-20 mb-3"></i>
            <p className="text-sm text-font-detail mb-4">No staff assigned to this shift</p>
            {isAdmin && (
              <button
                onClick={() => handleAddStaffClick(shift)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm"
              >
                <i className="fa-solid fa-plus mr-2"></i>
                Add Staff
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {supervisors.length > 0 && (
              <div>
                <div className="text-xs font-medium text-font-detail mb-2">SUPERVISOR</div>
                {supervisors.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between bg-bg-subtle border border-bd rounded p-2 mb-2">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                      <span className="text-sm text-font-base font-medium">{staff.name}</span>
                      <span className="text-xs text-font-detail ml-2">({staff.position})</span>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => removeStaff(shift, staff.id)}
                        className="text-error text-xs hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {staff.length > 0 && (
              <div>
                <div className="text-xs font-medium text-font-detail mb-2">STAFF ({staff.length})</div>
                <div className="space-y-2">
                  {staff.map((staffMember) => (
                    <div key={staffMember.id} className="flex items-center justify-between bg-bg-subtle border border-bd rounded p-2">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-font-base rounded-full mr-2"></span>
                        <span className="text-sm text-font-base">{staffMember.name}</span>
                        <span className="text-xs text-font-detail ml-2">({staffMember.position})</span>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => removeStaff(shift, staffMember.id)}
                          className="text-error text-xs hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isAdmin && (
              <button
                onClick={() => handleAddStaffClick(shift)}
                className="w-full border-2 border-dashed border-bd-input rounded p-2 text-sm text-font-detail hover:bg-bg-subtle"
              >
                <i className="fa-solid fa-plus mr-2"></i>
                Add More Staff
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-bd p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-font-heading">{date}</h2>
              <p className="text-sm text-font-detail mt-1">
                {isUnscheduled || isScheduleEmpty ? 'Create schedule for this day' : 'View and manage daily shift assignments'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-font-detail hover:text-font-base p-2"
            >
              <i className="fa-solid fa-times text-xl"></i>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {(isUnscheduled || isScheduleEmpty) && (
              <div className="bg-primary-lightest border border-primary rounded-lg p-4">
                <div className="flex items-start">
                  <i className="fa-solid fa-info-circle text-primary mr-3 mt-0.5 text-lg"></i>
                  <div className="text-sm text-font-base">
                    <div className="font-semibold text-font-heading mb-1">Empty Schedule</div>
                    This day has no staff assigned yet. Click &quot;Add Staff&quot; for each shift to begin scheduling.
                  </div>
                </div>
              </div>
            )}

            {renderShift('day')}
            {renderShift('evening')}
            {renderShift('night')}
          </div>
        </div>
      </div>

      {showStaffSelector && currentShift && (
        <StaffSelectionModal
          shift={currentShift}
          date={date}
          onClose={() => {
            setShowStaffSelector(false);
            setCurrentShift(null);
          }}
          onAddStaff={handleStaffAdded}
        />
      )}
    </>
  );
}
