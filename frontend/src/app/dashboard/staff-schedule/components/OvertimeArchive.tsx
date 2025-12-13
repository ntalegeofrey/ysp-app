'use client';

import { useState } from 'react';

export default function OvertimeArchive() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  const overtimeRecords = [
    {
      id: 1,
      staffName: 'Johnson, Kevin',
      position: 'JJYDS II',
      date: '11/11/2024',
      shift: 'Evening (3PM-11PM)',
      otType: 'Mandatory Force',
      startTime: '2024-11-12 23:00',
      endTime: '2024-11-13 03:00',
      duration: '4 hrs',
    },
    {
      id: 2,
      staffName: 'Smith, Jennifer',
      position: 'JJYDS I',
      date: '11/12/2024',
      shift: 'Day (7AM-3PM)',
      otType: 'Voluntary OT',
      startTime: '-',
      endTime: '-',
      duration: '2 hrs',
    },
    {
      id: 3,
      staffName: 'Rodriguez, Maria',
      position: 'JJYDS I',
      date: '11/13/2024',
      shift: 'Overnight (11PM-7AM)',
      otType: 'Called Out',
      startTime: '2024-11-15 07:00',
      endTime: '-',
      duration: '2 hrs',
    },
    {
      id: 4,
      staffName: 'Brown, Michael',
      position: 'Support',
      date: '11/14/2024',
      shift: 'Evening (3PM-11PM)',
      otType: 'Voluntary OT',
      startTime: '-',
      endTime: '-',
      duration: '3 hrs',
    },
    {
      id: 5,
      staffName: 'Anderson, James',
      position: 'JJYDS II',
      date: '11/15/2024',
      shift: 'Day (7AM-3PM)',
      otType: 'Mandatory Force',
      startTime: '2024-11-16 15:00',
      endTime: '2024-11-16 19:00',
      duration: '4 hrs',
    },
    {
      id: 6,
      staffName: 'Lee, Samuel',
      position: 'JJYDS I',
      date: '11/16/2024',
      shift: 'Evening (3PM-11PM)',
      otType: 'Voluntary OT',
      startTime: '-',
      endTime: '-',
      duration: '1 hrs',
    },
  ];

  const getOTTypeColor = (type: string) => {
    if (type === 'Mandatory Force') return 'bg-error text-white';
    if (type === 'Voluntary OT') return 'bg-success text-white';
    if (type === 'Called Out') return 'bg-warning text-white';
    return 'bg-font-detail text-white';
  };

  return (
    <div className="bg-white border border-bd rounded-lg">
      <div className="p-6 border-b border-bd">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-font-heading flex items-center">
              <i className="fa-solid fa-clock-rotate-left text-primary mr-3"></i>
              Overtime Archive
            </h2>
            <p className="text-sm text-font-detail mt-1">
              Complete history of all overtime assignments and call-outs
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="text-primary text-sm hover:underline">
              <i className="fa-solid fa-filter mr-1"></i>
              Filter
            </button>
            <button className="text-primary text-sm hover:underline">
              <i className="fa-solid fa-download mr-1"></i>
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-bg-subtle border-b border-bd">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">
                Staff Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">
                Shift
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">
                OT Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">
                Start
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">
                End
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-font-detail uppercase tracking-wider">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-bd">
            {overtimeRecords.map((record) => (
              <tr key={record.id} className="hover:bg-bg-subtle transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-font-heading">{record.staffName}</div>
                  <div className="text-xs text-font-detail">({record.position})</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">
                  {record.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">
                  {record.shift}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getOTTypeColor(record.otType)}`}>
                    {record.otType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">
                  {record.startTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-font-base">
                  {record.endTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-font-heading">
                  {record.duration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-bd flex items-center justify-between bg-bg-subtle">
        <div className="text-sm text-font-detail">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm rounded border ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-font-base border-bd hover:bg-bg-subtle'
            }`}
          >
            <i className="fa-solid fa-chevron-left mr-1"></i>
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm rounded border ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-font-base border-bd hover:bg-bg-subtle'
            }`}
          >
            Next
            <i className="fa-solid fa-chevron-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
