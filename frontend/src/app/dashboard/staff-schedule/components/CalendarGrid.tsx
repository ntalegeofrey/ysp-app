'use client';

import { useState, useMemo } from 'react';
import DayDetailModal from './DayDetailModal';

interface CalendarGridProps {
  isAdmin: boolean;
  onOpenCreateSchedule?: () => void;
}

export default function CalendarGrid({ isAdmin, onOpenCreateSchedule }: CalendarGridProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(2024);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10); // 10 = November (0-indexed)

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonthIndex);
    const days = [];
    const today = new Date();
    const currentDate = new Date(currentYear, currentMonthIndex, 1);

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ isEmpty: true, date: 0 });
    }

    // Add all days of the month with static data
    for (let date = 1; date <= daysInMonth; date++) {
      const dayOfWeek = (firstDay + date - 1) % 7;
      const dayDate = new Date(currentYear, currentMonthIndex, date);
      
      // Mark future months or specific dates as unscheduled
      const isFutureMonth = dayDate > new Date(2024, 10, 30); // After Nov 30, 2024
      const isUnscheduled = isFutureMonth || (currentYear === 2024 && currentMonthIndex === 10 && (date === 1 || date === 2 || date === 25 || date === 26));
      
      if (isUnscheduled) {
        days.push({
          isEmpty: false,
          date,
          day: dayNames[dayOfWeek],
          isUnscheduled: true,
        });
      } else {
        days.push({
          isEmpty: false,
          date,
          day: dayNames[dayOfWeek],
          isUnscheduled: false,
          dayShift: date % 7 === 2 || date % 11 === 0 ? 'Needs Coverage' : date % 13 === 0 ? 'Critical' : 'Fully Staffed',
          daySuper: ['Davis, L.', 'Wilson, M.', 'Rodriguez, A.', 'Martinez, R.'][date % 4],
          dayStaff: date % 5 === 0 ? ['Wilson M.', 'Rodriguez A.', 'Johnson M. (Training)', '+5 more'] : ['Wilson M.', 'Rodriguez A.', '+5 more'],
          eveShift: date % 9 === 0 ? 'Needs Coverage' : date % 17 === 0 ? 'Critical' : 'Fully Staffed',
          eveSuper: ['Thompson, K.', 'Anderson, J.', 'Garcia, L.', 'Martinez, R.'][date % 4],
          eveStaff: date % 7 === 0 ? ['Garcia L.', 'Smith T.', '1 OT Open'] : ['Garcia M.', '+3 more'],
          nightShift: date % 15 === 0 ? 'Critical' : date % 8 === 0 ? 'Needs Coverage' : 'Fully Staffed',
          nightSuper: ['Roberts, T.', 'Brown, P.', 'Davis, P.', 'Thompson, K.'][date % 4],
          nightStaff: date % 15 === 0 ? ['Miller J.', 'Davis P.', '1 Mandatory OT'] : date % 8 === 0 ? ['Miller J.', '1 OT Open'] : ['Evans N.', '+2 more'],
        });
      }
    }

    return days;
  }, [currentYear, currentMonthIndex]);

  const getShiftStatusColor = (status: string) => {
    if (status === 'Fully Staffed') return 'border-success bg-primary-alt-lightest';
    if (status === 'Needs Coverage') return 'border-warning bg-highlight-lightest';
    if (status === 'Critical') return 'border-error bg-error-lightest';
    return 'border-bd bg-white';
  };

  const handleDayClick = (date: number) => {
    setSelectedDate(`${monthNames[currentMonthIndex]} ${date}, ${currentYear}`);
  };

  const goToPreviousMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
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
                <button 
                  onClick={goToPreviousMonth}
                  className="p-2 text-font-detail hover:text-primary rounded-lg"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className="px-4 py-2 bg-primary-lightest rounded-lg text-sm font-medium text-font-base">
                  {monthNames[currentMonthIndex]} {currentYear}
                </div>
                <button 
                  onClick={goToNextMonth}
                  className="p-2 text-font-detail hover:text-primary rounded-lg"
                >
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

            {generateCalendarDays.map((dayData, idx) => {
              if (dayData.isEmpty) {
                return <div key={`empty-${idx}`} className="min-h-[180px]"></div>;
              }

              if (dayData.isUnscheduled) {
                return (
                  <div
                    key={dayData.date}
                    className="border-2 border-dashed border-bd-input rounded-lg p-3 bg-bg-subtle min-h-[180px] flex flex-col"
                  >
                    <div className="text-center mb-3">
                      <div className="text-lg font-bold text-font-heading">{dayData.date}</div>
                      <div className="text-xs text-font-detail">{dayData.day}</div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                      <i className="fa-solid fa-calendar-xmark text-font-detail text-3xl opacity-30"></i>
                      <div className="text-xs text-font-detail text-center">
                        No schedule created
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDayClick(dayData.date)}
                          className="w-full bg-primary text-white px-3 py-2 rounded text-xs hover:bg-primary-light transition-colors"
                        >
                          <i className="fa-solid fa-plus mr-1"></i>
                          Schedule Day
                        </button>
                      )}
                    </div>
                  </div>
                );
              }
              
              return (
              <div
                key={dayData.date}
                className="border border-bd rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow bg-white min-h-[180px]"
                onClick={() => handleDayClick(dayData.date)}
              >
                <div className="text-center mb-2">
                  <div className="text-lg font-bold text-font-heading">{dayData.date}</div>
                  <div className="text-xs text-font-detail">{dayData.day}</div>
                </div>

                <div className={`mb-2 p-1 border-l-2 ${getShiftStatusColor(dayData.dayShift || '')} rounded text-xs`}>
                  <div className="font-semibold text-font-base">DAY</div>
                  <div className="flex items-center text-primary">
                    <span className="w-2 h-2 bg-primary rounded-full mr-1"></span>
                    <span className="truncate">{dayData.daySuper}</span>
                  </div>
                  {dayData.dayStaff?.map((staff: string, idx: number) => (
                    <div key={idx} className="flex items-center text-font-detail">
                      <span className="w-2 h-2 bg-font-base rounded-full mr-1"></span>
                      <span className="truncate">{staff}</span>
                    </div>
                  ))}
                </div>

                <div className={`mb-2 p-1 border-l-2 ${getShiftStatusColor(dayData.eveShift || '')} rounded text-xs`}>
                  <div className="font-semibold text-font-base">EVE</div>
                  <div className="flex items-center text-primary">
                    <span className="w-2 h-2 bg-primary rounded-full mr-1"></span>
                    <span className="truncate">{dayData.eveSuper}</span>
                  </div>
                  {dayData.eveStaff?.map((staff: string, idx: number) => (
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

                <div className={`p-1 border-l-2 ${getShiftStatusColor(dayData.nightShift || '')} rounded text-xs`}>
                  <div className="font-semibold text-font-base">NIGHT</div>
                  <div className="flex items-center text-primary">
                    <span className="w-2 h-2 bg-primary rounded-full mr-1"></span>
                    <span className="truncate">{dayData.nightSuper}</span>
                  </div>
                  {dayData.nightStaff?.map((staff: string, idx: number) => (
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
              );
            })}
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
