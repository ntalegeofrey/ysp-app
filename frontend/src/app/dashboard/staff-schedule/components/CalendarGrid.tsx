'use client';

import { useState } from 'react';
import DayDetailModal from './DayDetailModal';

interface CalendarGridProps {
  isAdmin: boolean;
  onOpenCreateSchedule?: () => void;
}

export default function CalendarGrid({ isAdmin, onOpenCreateSchedule }: CalendarGridProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState('November 2024');

  const calendarData = [
    { date: 17, day: 'Sun', dayShift: 'Fully Staffed', daySuper: 'Davis, L.', dayStaff: ['Wilson M.', 'Rodriguez A.', '+5 more'], eveShift: 'Fully Staffed', eveSuper: 'Thompson, K.', eveStaff: ['Garcia M.', '+3 more'], nightShift: 'Fully Staffed', nightSuper: 'Roberts, T.', nightStaff: ['Evans N.', '+2 more'] },
    { date: 18, day: 'Mon', dayShift: 'Fully Staffed', daySuper: 'Davis, L.', dayStaff: ['Wilson M.', 'Rodriguez A.', '+5 more'], eveShift: 'Fully Staffed', eveSuper: 'Thompson, K.', eveStaff: ['Garcia M.', '+3 more'], nightShift: 'Fully Staffed', nightSuper: 'Roberts, T.', nightStaff: ['Evans N.', '+2 more'] },
    { date: 19, day: 'Tue', dayShift: 'Fully Staffed', daySuper: 'Wilson, M.', dayStaff: ['Rodriguez A.', 'Johnson M. (Training)', '+5 more'], eveShift: 'Needs Coverage', eveSuper: 'Anderson, J.', eveStaff: ['Garcia L.', 'Smith T.', '1 OT Open'], nightShift: 'Critical', nightSuper: 'Brown, P.', nightStaff: ['Miller J.', 'Davis P.', '1 Mandatory OT'] },
    { date: 20, day: 'Wed', dayShift: 'Fully Staffed', daySuper: 'Davis, L.', dayStaff: ['Wilson M.', 'Rodriguez A.', '+5 more'], eveShift: 'Fully Staffed', eveSuper: 'Martinez, R.', eveStaff: ['Garcia L.', 'Rodriguez M. (OT)', '+3 more'], nightShift: 'Fully Staffed', nightSuper: 'Roberts, T.', nightStaff: ['Evans N.', '+2 more'] },
    { date: 21, day: 'Thu', dayShift: 'Fully Staffed', daySuper: 'Rodriguez, A.', dayStaff: ['Thompson K.', 'Brown P.', '+5 more'], eveShift: 'Fully Staffed', eveSuper: 'Garcia, L.', eveStaff: ['Smith T.', '+4 more'], nightShift: 'Fully Staffed', nightSuper: 'Davis, P.', nightStaff: ['Miller J.', '+2 more'] },
    { date: 22, day: 'Fri', dayShift: 'Needs Coverage', daySuper: 'Davis, L.', dayStaff: ['Wilson M.', 'Rodriguez A.', '1 OT Open'], eveShift: 'Needs Coverage', eveSuper: 'Martinez, R.', eveStaff: ['Garcia L.', 'Smith T.', '1 OT Open'], nightShift: 'Needs Coverage', nightSuper: 'Thompson, K.', nightStaff: ['Miller J.', 'Davis P.', '1 OT Open'] },
    { date: 23, day: 'Sat', dayShift: 'Fully Staffed', daySuper: 'Davis, L.', dayStaff: ['Wilson M.', '+5 more'], eveShift: 'Fully Staffed', eveSuper: 'Martinez, R.', eveStaff: ['Garcia M.', '+3 more'], nightShift: 'Fully Staffed', nightSuper: 'Brown, P.', nightStaff: ['Evans N.', '+2 more'] },
  ];

  const getShiftStatusColor = (status: string) => {
    if (status === 'Fully Staffed') return 'border-success bg-primary-alt-lightest';
    if (status === 'Needs Coverage') return 'border-warning bg-highlight-lightest';
    if (status === 'Critical') return 'border-error bg-error-lightest';
    return 'border-bd bg-white';
  };

  const handleDayClick = (date: number) => {
    setSelectedDate(`November ${date}, 2024`);
  };

  return (
    <div>
      <div className="bg-white rounded-lg border border-bd mb-6">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-font-base">Schedule Calendar</h3>
              <div className="mt-2 text-sm text-font-detail">
                Click any day to view details and manage assignments
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-font-detail hover:text-primary rounded-lg">
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className="px-4 py-2 bg-primary-lightest rounded-lg text-sm font-medium text-font-base">
                  {currentMonth}
                </div>
                <button className="p-2 text-font-detail hover:text-primary rounded-lg">
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
              {isAdmin && (
                <>
                  <button 
                    onClick={onOpenCreateSchedule}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm"
                  >
                    <i className="fa-solid fa-plus mr-2"></i>
                    Create Schedule
                  </button>
                  <button className="bg-success text-white px-4 py-2 rounded-lg hover:bg-primary-alt text-sm">
                    <i className="fa-solid fa-print mr-2"></i>
                    Print
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4 text-xs text-font-detail">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-primary rounded mr-2"></span>
              <span>Supervisor</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-font-base rounded mr-2"></span>
              <span>Regular Staff</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-warning rounded mr-2"></span>
              <span>Overtime</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-highlight rounded mr-2"></span>
              <span>Training</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-font-medium rounded mr-2"></span>
              <span>On Leave</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-font-heading py-2 bg-bg-subtle rounded">
                {day}
              </div>
            ))}

            {calendarData.map((dayData) => (
              <div
                key={dayData.date}
                className="border border-bd rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow bg-white min-h-[180px]"
                onClick={() => handleDayClick(dayData.date)}
              >
                <div className="text-center mb-2">
                  <div className="text-lg font-bold text-font-heading">{dayData.date}</div>
                  <div className="text-xs text-font-detail">{dayData.day}</div>
                </div>

                <div className={`mb-2 p-1 border-l-2 ${getShiftStatusColor(dayData.dayShift)} rounded text-xs`}>
                  <div className="font-semibold text-font-base">DAY</div>
                  <div className="flex items-center text-primary">
                    <span className="w-2 h-2 bg-primary rounded-full mr-1"></span>
                    <span className="truncate">{dayData.daySuper}</span>
                  </div>
                  {dayData.dayStaff.map((staff, idx) => (
                    <div key={idx} className="flex items-center text-font-detail">
                      <span className="w-2 h-2 bg-font-base rounded-full mr-1"></span>
                      <span className="truncate">{staff}</span>
                    </div>
                  ))}
                </div>

                <div className={`mb-2 p-1 border-l-2 ${getShiftStatusColor(dayData.eveShift)} rounded text-xs`}>
                  <div className="font-semibold text-font-base">EVE</div>
                  <div className="flex items-center text-primary">
                    <span className="w-2 h-2 bg-primary rounded-full mr-1"></span>
                    <span className="truncate">{dayData.eveSuper}</span>
                  </div>
                  {dayData.eveStaff.map((staff, idx) => (
                    <div key={idx} className="flex items-center text-font-detail">
                      {staff.includes('OT') ? (
                        <>
                          <span className="w-2 h-2 bg-warning rounded-full mr-1"></span>
                          <span className="truncate text-warning">{staff}</span>
                        </>
                      ) : staff.includes('Open') ? (
                        <>
                          <span className="w-2 h-2 bg-success rounded-full mr-1"></span>
                          <span className="truncate text-success">{staff}</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-font-base rounded-full mr-1"></span>
                          <span className="truncate">{staff}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className={`p-1 border-l-2 ${getShiftStatusColor(dayData.nightShift)} rounded text-xs`}>
                  <div className="font-semibold text-font-base">NIGHT</div>
                  <div className="flex items-center text-primary">
                    <span className="w-2 h-2 bg-primary rounded-full mr-1"></span>
                    <span className="truncate">{dayData.nightSuper}</span>
                  </div>
                  {dayData.nightStaff.map((staff, idx) => (
                    <div key={idx} className="flex items-center text-font-detail">
                      {staff.includes('Mandatory') ? (
                        <>
                          <span className="w-2 h-2 bg-error rounded-full mr-1"></span>
                          <span className="truncate text-error">{staff}</span>
                        </>
                      ) : staff.includes('Open') ? (
                        <>
                          <span className="w-2 h-2 bg-success rounded-full mr-1"></span>
                          <span className="truncate text-success">{staff}</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-font-base rounded-full mr-1"></span>
                          <span className="truncate">{staff}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          isAdmin={isAdmin}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
