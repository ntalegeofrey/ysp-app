'use client';

import { useState } from 'react';

interface StaffMember {
  id: string;
  name: string;
  position: string;
  category: string;
  available: boolean;
}

interface StaffSelectionModalProps {
  shift: 'day' | 'evening' | 'night';
  date: string;
  onClose: () => void;
  onAddStaff: (selectedStaff: StaffMember[]) => void;
}

export default function StaffSelectionModal({ shift, date, onClose, onAddStaff }: StaffSelectionModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const allStaff: StaffMember[] = [
    { id: '1', name: 'Davis, Linda', position: 'JJYDS III', category: 'supervisor', available: true },
    { id: '2', name: 'Wilson, Marcus', position: 'JJYDS II', category: 'staff', available: true },
    { id: '3', name: 'Rodriguez, Ana', position: 'JJYDS I', category: 'staff', available: true },
    { id: '4', name: 'Thompson, Kevin', position: 'JJYDS III', category: 'supervisor', available: true },
    { id: '5', name: 'Garcia, Luis', position: 'JJYDS II', category: 'staff', available: true },
    { id: '6', name: 'Martinez, Carlos', position: 'JJYDS II', category: 'staff', available: true },
    { id: '7', name: 'Roberts, Tom', position: 'JJYDS III', category: 'supervisor', available: true },
    { id: '8', name: 'Brown, Patricia', position: 'JJYDS II', category: 'staff', available: true },
    { id: '9', name: 'Anderson, James', position: 'JJYDS I', category: 'staff', available: true },
    { id: '10', name: 'Johnson, Maria', position: 'JJYDS I', category: 'staff', available: false },
    { id: '11', name: 'Smith, Taylor', position: 'JJYDS II', category: 'staff', available: true },
    { id: '12', name: 'Miller, Jessica', position: 'JJYDS I', category: 'staff', available: true },
    { id: '13', name: 'Evans, Nicole', position: 'JJYDS II', category: 'staff', available: true },
    { id: '14', name: 'Taylor, Michael', position: 'JJYDS I', category: 'staff', available: false },
  ];

  const filteredStaff = allStaff.filter((staff) => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const supervisors = filteredStaff.filter((s) => s.category === 'supervisor');
  const regularStaff = filteredStaff.filter((s) => s.category === 'staff');

  const handleToggle = (id: string, available: boolean) => {
    if (!available) return;
    
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSelectAll = (staffList: StaffMember[]) => {
    const newSet = new Set(selectedIds);
    const availableIds = staffList.filter(s => s.available).map(s => s.id);
    const allSelected = availableIds.every(id => newSet.has(id));
    
    if (allSelected) {
      availableIds.forEach(id => newSet.delete(id));
    } else {
      availableIds.forEach(id => newSet.add(id));
    }
    setSelectedIds(newSet);
  };

  const handleSubmit = () => {
    const selected = allStaff.filter((s) => selectedIds.has(s.id));
    onAddStaff(selected);
    onClose();
  };

  const getShiftLabel = () => {
    if (shift === 'day') return 'Day Shift (7AM-3PM)';
    if (shift === 'evening') return 'Evening Shift (3PM-11PM)';
    return 'Overnight Shift (11PM-7AM)';
  };

  const canSubmit = selectedIds.size > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Add Staff to Shift</h2>
            <p className="text-sm text-blue-100 mt-1">
              {date} - {getShiftLabel()}
            </p>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-100 p-2">
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="bg-primary-lightest border border-primary rounded-lg p-4">
            <div className="flex items-start">
              <i className="fa-solid fa-info-circle text-primary mr-3 mt-0.5 text-lg"></i>
              <div className="text-sm text-font-base">
                <div className="font-semibold text-font-heading mb-1">Batch Staff Assignment</div>
                Select multiple staff members to assign to this shift. Gray checkboxes indicate staff unavailable due to conflicts or time-off.
              </div>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or position..."
              className="w-full border border-bd-input rounded-lg px-4 py-2 text-sm"
            />
          </div>

          <div className="bg-bg-subtle p-3 rounded-lg flex items-center justify-between text-sm">
            <span className="text-font-base">
              <span className="font-semibold text-primary">{selectedIds.size}</span> staff selected
            </span>
            <span className="text-font-detail">
              {filteredStaff.filter(s => s.available).length} available
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-font-heading">
                Supervisors ({supervisors.length})
              </h3>
              <button
                onClick={() => handleSelectAll(supervisors)}
                className="text-xs text-primary hover:text-primary-light"
              >
                {supervisors.filter(s => s.available).every(s => selectedIds.has(s.id)) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="space-y-2">
              {supervisors.map((staff) => (
                <label
                  key={staff.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    !staff.available
                      ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                      : selectedIds.has(staff.id)
                      ? 'bg-primary-lightest border-primary'
                      : 'bg-white border-bd hover:border-primary'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(staff.id)}
                    onChange={() => handleToggle(staff.id, staff.available)}
                    disabled={!staff.available}
                    className="w-4 h-4 text-primary rounded border-bd-input focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${staff.available ? 'text-font-base' : 'text-font-detail'}`}>
                        {staff.name}
                      </span>
                      {!staff.available && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-font-detail mt-0.5">{staff.position}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-font-heading">
                Staff ({regularStaff.length})
              </h3>
              <button
                onClick={() => handleSelectAll(regularStaff)}
                className="text-xs text-primary hover:text-primary-light"
              >
                {regularStaff.filter(s => s.available).every(s => selectedIds.has(s.id)) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="space-y-2">
              {regularStaff.map((staff) => (
                <label
                  key={staff.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    !staff.available
                      ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                      : selectedIds.has(staff.id)
                      ? 'bg-primary-lightest border-primary'
                      : 'bg-white border-bd hover:border-primary'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(staff.id)}
                    onChange={() => handleToggle(staff.id, staff.available)}
                    disabled={!staff.available}
                    className="w-4 h-4 text-primary rounded border-bd-input focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${staff.available ? 'text-font-base' : 'text-font-detail'}`}>
                        {staff.name}
                      </span>
                      {!staff.available && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-font-detail mt-0.5">{staff.position}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-bg-subtle border-t border-bd p-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-bd rounded-lg text-font-base hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-4 py-2 rounded-lg ${
              canSubmit
                ? 'bg-primary text-white hover:bg-primary-light'
                : 'bg-font-detail text-white cursor-not-allowed'
            }`}
          >
            <i className="fa-solid fa-user-plus mr-2"></i>
            Add {selectedIds.size} Staff
          </button>
        </div>
      </div>
    </div>
  );
}
