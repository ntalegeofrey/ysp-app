'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Alert = {
  id: number;
  type: 'critical' | 'warning' | 'info';
  time: string;
  title: string;
  description: string;
  resolved?: boolean;
};

type NewMed = {
  name: string;
  dosage: string;
  frequency: string;
  initialCount: string;
  physician: string;
  instructions: string;
};

type MedicationCount = {
  medicationName: string;
  dosage: string;
  previousCount: number;
  currentCount: string;
  previousStaff: string;
};

type ResidentMedCount = {
  residentId: string;
  residentName: string;
  medications: MedicationCount[];
};

type TabType = 'alerts' | 'add-medication' | 'med-sheets' | 'audit' | 'admin-archive' | 'audit-archive';

export default function MedicationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('alerts');
  const [currentStaff, setCurrentStaff] = useState('');
  const [selectedShift, setSelectedShift] = useState<'Morning' | 'Evening' | 'Night'>('Morning');
  const [auditNotes, setAuditNotes] = useState('');
  const [adminArchiveFilter, setAdminArchiveFilter] = useState('');
  const [auditArchiveFilter, setAuditArchiveFilter] = useState('');

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        setCurrentStaff(`${firstName} ${lastName}`.trim() || 'Staff Member');
      }
    } catch (err) {
      console.error('Failed to parse user:', err);
    }
  }, []);

  const tabBtnBase = 'flex items-center px-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap';
  const tabBtnInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';
  const tabBtnActive = 'border-primary text-primary';

  // Demo resident medication counts
  const [residentMedCounts, setResidentMedCounts] = useState<ResidentMedCount[]>([
    {
      residentId: 'A01',
      residentName: 'Resident A01',
      medications: [
        { medicationName: 'Risperidone', dosage: '2mg', previousCount: 45, currentCount: '', previousStaff: 'J.S.' },
        { medicationName: 'Sertraline', dosage: '50mg', previousCount: 30, currentCount: '', previousStaff: 'J.S.' },
        { medicationName: 'Melatonin', dosage: '3mg', previousCount: 60, currentCount: '', previousStaff: 'J.S.' },
      ],
    },
    {
      residentId: 'A02',
      residentName: 'Resident A02',
      medications: [
        { medicationName: 'Risperidone', dosage: '2mg', previousCount: 28, currentCount: '', previousStaff: 'M.J.' },
        { medicationName: 'Clonazepam', dosage: '0.5mg', previousCount: 42, currentCount: '', previousStaff: 'M.J.' },
      ],
    },
    {
      residentId: 'B01',
      residentName: 'Resident B01',
      medications: [
        { medicationName: 'Lithium', dosage: '300mg', previousCount: 55, currentCount: '', previousStaff: 'K.W.' },
        { medicationName: 'Abilify', dosage: '10mg', previousCount: 38, currentCount: '', previousStaff: 'K.W.' },
      ],
    },
    {
      residentId: 'C02',
      residentName: 'Resident C02',
      medications: [
        { medicationName: 'Prozac', dosage: '20mg', previousCount: 48, currentCount: '', previousStaff: 'L.D.' },
        { medicationName: 'Adderall', dosage: '15mg', previousCount: 35, currentCount: '', previousStaff: 'L.D.' },
        { medicationName: 'Trazodone', dosage: '50mg', previousCount: 52, currentCount: '', previousStaff: 'L.D.' },
      ],
    },
  ]);

  const updateMedCount = (residentId: string, medIndex: number, count: string) => {
    setResidentMedCounts(prev =>
      prev.map(resident =>
        resident.residentId === residentId
          ? {
              ...resident,
              medications: resident.medications.map((med, idx) =>
                idx === medIndex ? { ...med, currentCount: count } : med
              ),
            }
          : resident
      )
    );
  };

  const handleSubmitAudit = () => {
    // Validate all counts are entered
    const incomplete = residentMedCounts.some(resident =>
      resident.medications.some(med => !med.currentCount)
    );
    
    if (incomplete) {
      alert('Please complete all medication counts before submitting.');
      return;
    }
    
    alert(`Medication Audit submitted for ${selectedShift} Shift by ${currentStaff}`);
    // Reset counts
    setResidentMedCounts(prev =>
      prev.map(resident => ({
        ...resident,
        medications: resident.medications.map(med => ({ ...med, currentCount: '' })),
      }))
    );
    setAuditNotes('');
  };
  // Alerts demo data
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: 'critical',
      time: '10:30 AM',
      title: 'Resident A02 refused to take Risperidone 2mg. Staff: M. Johnson',
      description: 'Attempted administration at 10:30 AM. Resident became agitated and refused medication.',
    },
    {
      id: 2,
      type: 'warning',
      time: '9:45 AM',
      title: 'Medication Inventory Discrepancy: Sertraline 50mg - Expected: 45, Found: 43',
      description: 'Discrepancy flagged during morning inventory. Requires supervisor review.',
    },
    {
      id: 3,
      type: 'info',
      time: '8:15 AM',
      title: 'New Prescription Added: Resident B03 - Melatonin 3mg (Bedtime)',
      description: 'Prescription added by Dr. Sarah Wilson. First dose scheduled for tonight.',
    },
  ]);

  const resolveAlert = (id: number) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  };

  // New Resident & Medications form state
  const [residentId, setResidentId] = useState('');
  const [residentName, setResidentName] = useState('');
  const [unit, setUnit] = useState('');
  const [allergies, setAllergies] = useState('');
  const [meds, setMeds] = useState<NewMed[]>([
    { name: '', dosage: '', frequency: 'Once Daily', initialCount: '', physician: '', instructions: '' },
  ]);

  const addMed = () => setMeds((m) => [...m, { name: '', dosage: '', frequency: 'Once Daily', initialCount: '', physician: '', instructions: '' }]);
  const updateMed = (idx: number, patch: Partial<NewMed>) => {
    setMeds((m) => m.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };
  const removeMed = (idx: number) => setMeds((m) => m.filter((_, i) => i !== idx));

  // Demo residents grid
  const residents = [
    {
      id: 'A01',
      name: 'Resident A01',
      badge: { text: '3 Meds', cls: 'bg-success text-white' },
      meds: [
        { name: 'Risperidone 2mg', status: '✓ Given', cls: 'text-success' },
        { name: 'Sertraline 50mg', status: '✓ Given', cls: 'text-success' },
        { name: 'Melatonin 3mg', status: 'Pending', cls: 'text-warning' },
      ],
      footer: 'Last Updated: 2:30 PM by J. Smith',
      highlightCls: 'border-bd',
    },
    {
      id: 'A02',
      name: 'Resident A02',
      badge: { text: 'Alert', cls: 'bg-error text-white' },
      meds: [
        { name: 'Risperidone 2mg', status: 'Refused', cls: 'text-error' },
        { name: 'Clonazepam 0.5mg', status: '✓ Given', cls: 'text-success' },
      ],
      footer: 'Last Updated: 10:30 AM by M. Johnson',
      highlightCls: 'border-error bg-error-lightest',
    },
    {
      id: 'B01',
      name: 'Resident B01',
      badge: { text: '2 Meds', cls: 'bg-primary text-white' },
      meds: [
        { name: 'Lithium 300mg', status: '✓ Given', cls: 'text-success' },
        { name: 'Abilify 10mg', status: 'Pending', cls: 'text-warning' },
      ],
      footer: 'Last Updated: 1:15 PM by K. Williams',
      highlightCls: 'border-bd',
    },
    {
      id: 'B03',
      name: 'Resident B03',
      badge: { text: 'New', cls: 'bg-highlight text-white' },
      meds: [{ name: 'Melatonin 3mg', status: 'Scheduled', cls: 'text-warning' }],
      footer: 'Added: 8:15 AM by Dr. S. Wilson',
      highlightCls: 'border-bd',
    },
    {
      id: 'C02',
      name: 'Resident C02',
      badge: { text: '4 Meds', cls: 'bg-success text-white' },
      meds: [
        { name: 'Prozac 20mg', status: '✓ Given', cls: 'text-success' },
        { name: 'Adderall 15mg', status: '✓ Given', cls: 'text-success' },
        { name: 'Trazodone 50mg', status: 'Pending', cls: 'text-warning' },
      ],
      footer: 'Last Updated: 2:45 PM by L. Davis',
      highlightCls: 'border-bd',
    },
    {
      id: 'D01',
      name: 'Resident D01',
      badge: { text: '1 Med', cls: 'bg-primary text-white' },
      meds: [{ name: 'Ibuprofen 400mg', status: '✓ Given', cls: 'text-success' }],
      footer: 'Last Updated: 11:00 AM by R. Martinez',
      highlightCls: 'border-bd',
    },
  ];

  // Demo admin archive data
  const adminArchiveData = [
    { id: 1, date: '2024-12-05', time: '10:30 AM', resident: 'A02', medication: 'Risperidone 2mg', action: 'Refused', staff: 'M. Johnson', notes: 'Resident became agitated' },
    { id: 2, date: '2024-12-05', time: '08:15 AM', resident: 'B03', medication: 'Melatonin 3mg', action: 'Administered', staff: 'Dr. S. Wilson', notes: 'First dose' },
    { id: 3, date: '2024-12-04', time: '02:30 PM', resident: 'A01', medication: 'Sertraline 50mg', action: 'Administered', staff: 'J. Smith', notes: '' },
    { id: 4, date: '2024-12-04', time: '01:15 PM', resident: 'B01', medication: 'Lithium 300mg', action: 'Administered', staff: 'K. Williams', notes: '' },
  ];

  // Demo audit archive data
  const auditArchiveData = [
    { id: 1, date: '2024-12-05', shift: 'Evening', staff: 'J. Smith', resident: 'A01', medication: 'Risperidone 2mg', previousCount: 50, auditedCount: 45, discrepancy: -5 },
    { id: 2, date: '2024-12-05', shift: 'Evening', staff: 'J. Smith', resident: 'A01', medication: 'Sertraline 50mg', previousCount: 35, auditedCount: 30, discrepancy: -5 },
    { id: 3, date: '2024-12-05', shift: 'Morning', staff: 'M. Johnson', resident: 'A02', medication: 'Risperidone 2mg', previousCount: 30, auditedCount: 28, discrepancy: -2 },
    { id: 4, date: '2024-12-04', shift: 'Night', staff: 'L. Davis', resident: 'C02', medication: 'Prozac 20mg', previousCount: 50, auditedCount: 48, discrepancy: -2 },
  ];

  const filteredAdminArchive = adminArchiveData.filter(record =>
    !adminArchiveFilter ||
    record.resident.toLowerCase().includes(adminArchiveFilter.toLowerCase()) ||
    record.medication.toLowerCase().includes(adminArchiveFilter.toLowerCase()) ||
    record.staff.toLowerCase().includes(adminArchiveFilter.toLowerCase())
  );

  const filteredAuditArchive = auditArchiveData.filter(record =>
    !auditArchiveFilter ||
    record.resident.toLowerCase().includes(auditArchiveFilter.toLowerCase()) ||
    record.medication.toLowerCase().includes(auditArchiveFilter.toLowerCase()) ||
    record.shift.toLowerCase().includes(auditArchiveFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div>
        <nav className="flex space-x-4 border-b border-bd overflow-x-auto">
          <button
            className={`${tabBtnBase} ${activeTab === 'alerts' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('alerts')}
          >
            <i className={`fa-solid fa-triangle-exclamation mr-2 ${activeTab === 'alerts' ? 'text-primary' : 'text-font-detail'}`}></i>
            Medication Alerts
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'add-medication' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('add-medication')}
          >
            <i className={`fa-solid fa-user-plus mr-2 ${activeTab === 'add-medication' ? 'text-primary' : 'text-font-detail'}`}></i>
            Add Resident Medication
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'med-sheets' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('med-sheets')}
          >
            <i className={`fa-solid fa-file-medical mr-2 ${activeTab === 'med-sheets' ? 'text-primary' : 'text-font-detail'}`}></i>
            Med Sheets
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'audit' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('audit')}
          >
            <i className={`fa-solid fa-clipboard-check mr-2 ${activeTab === 'audit' ? 'text-primary' : 'text-font-detail'}`}></i>
            Medication Audit
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'admin-archive' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('admin-archive')}
          >
            <i className={`fa-solid fa-syringe mr-2 ${activeTab === 'admin-archive' ? 'text-primary' : 'text-font-detail'}`}></i>
            Med Admin Archive
          </button>
          <button
            className={`${tabBtnBase} ${activeTab === 'audit-archive' ? tabBtnActive : tabBtnInactive}`}
            onClick={() => setActiveTab('audit-archive')}
          >
            <i className={`fa-solid fa-archive mr-2 ${activeTab === 'audit-archive' ? 'text-primary' : 'text-font-detail'}`}></i>
            Med Audit Archive
          </button>
        </nav>
      </div>

      {/* Medication Alerts Tab */}
      {activeTab === 'alerts' && (
        <section className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base flex items-center">
            <i className="fa-solid fa-triangle-exclamation text-error mr-3"></i>
            Medication Alerts & Issues
          </h3>
          <div className="mt-2 text-sm text-font-detail">
            Current shift medication alerts and incidents requiring attention
          </div>
        </div>
        <div className="p-6 space-y-4">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={`${
                a.type === 'critical'
                  ? 'border-error bg-error-lightest'
                  : a.type === 'warning'
                  ? 'border-warning bg-highlight-lightest'
                  : 'border-primary bg-primary-lightest'
              } border-l-4 p-4 rounded-r-lg`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold ${
                  a.type === 'critical' ? 'text-error' : a.type === 'warning' ? 'text-warning' : 'text-primary'
                }`}>
                  {a.type === 'critical' ? 'Critical Alert' : a.type === 'warning' ? 'Inventory Warning' : 'Information'}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-font-detail">{a.time}</span>
                  <button
                    onClick={() => resolveAlert(a.id)}
                    disabled={a.resolved}
                    className={`px-3 py-1 rounded text-xs text-white transition-colors ${a.resolved ? 'bg-bg-subtle text-font-detail cursor-not-allowed' : 'bg-success hover:bg-primary-alt-dark'}`}
                  >
                    <i className="fa-solid fa-check mr-1"></i>
                    {a.resolved ? 'Resolved' : 'Resolve'}
                  </button>
                </div>
              </div>
              <div className="text-sm text-font-base"><strong>{a.title.split(':')[0]}{a.title.includes(':') ? ':' : ''}</strong>{a.title.includes(':') ? a.title.substring(a.title.indexOf(':') + 1) : ''}</div>
              <div className="text-xs text-font-detail mt-1">{a.description}</div>
            </div>
          ))}
        </div>
        </section>
      )}

      {/* Add Resident Medication Tab */}
      {activeTab === 'add-medication' && (
        <section className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base flex items-center">
            <i className="fa-solid fa-user-plus text-primary mr-3"></i>
            Add New Resident & Medications
          </h3>
          <div className="mt-2 text-sm text-font-detail">Register new resident and their prescribed medications</div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resident Information */}
            <div>
              <h4 className="font-semibold text-font-base mb-4">Resident Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Resident ID</label>
                  <input value={residentId} onChange={(e) => setResidentId(e.target.value)} type="text" placeholder="e.g., A04" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Full Name</label>
                  <input value={residentName} onChange={(e) => setResidentName(e.target.value)} type="text" placeholder="Enter resident's full name" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Unit Assignment</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Select Unit</option>
                    <option>Unit A</option>
                    <option>Unit B</option>
                    <option>Unit C</option>
                    <option>Unit D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Medical Allergies</label>
                  <textarea value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="List any known allergies..." className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-20"></textarea>
                </div>
              </div>
            </div>

            {/* Prescribed Medications */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-font-base">Prescribed Medications</h4>
              </div>
              <div className="space-y-3">
                {meds.map((m, idx) => (
                  <div key={idx} className="border border-bd rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-1">Medication Name</label>
                        <input value={m.name} onChange={(e) => updateMed(idx, { name: e.target.value })} type="text" placeholder="e.g., Risperidone" className="w-full border border-bd rounded px-2 py-1 text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-1">Dosage</label>
                          <input value={m.dosage} onChange={(e) => updateMed(idx, { dosage: e.target.value })} type="text" placeholder="e.g., 2mg" className="w-full border border-bd rounded px-2 py-1 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-1">Frequency</label>
                          <select value={m.frequency} onChange={(e) => updateMed(idx, { frequency: e.target.value })} className="w-full border border-bd rounded px-2 py-1 text-sm">
                            <option>Once Daily</option>
                            <option>Twice Daily</option>
                            <option>Three Times Daily</option>
                            <option>As Needed (PRN)</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-1">Initial Count</label>
                          <input value={m.initialCount} onChange={(e) => updateMed(idx, { initialCount: e.target.value })} type="number" placeholder="30" className="w-full border border-bd rounded px-2 py-1 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-font-base mb-1">Prescribing Physician</label>
                          <input value={m.physician} onChange={(e) => updateMed(idx, { physician: e.target.value })} type="text" placeholder="Dr. Name" className="w-full border border-bd rounded px-2 py-1 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-1">Special Instructions</label>
                        <textarea value={m.instructions} onChange={(e) => updateMed(idx, { instructions: e.target.value })} placeholder="Take with food, etc..." className="w-full border border-bd rounded px-2 py-1 text-sm h-16"></textarea>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <button onClick={() => removeMed(idx)} className="text-error hover:bg-error-lightest px-2 py-1 rounded text-sm">
                        <i className="fa-solid fa-trash mr-1"></i> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addMed} className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary-light font-medium">
                Add Medications
              </button>
            </div>
          </div>
        </div>
        </section>
      )}

      {/* Med Sheets Tab */}
      {activeTab === 'med-sheets' && (
        <section className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-users text-primary mr-3"></i>
              Current Residents on Medication
            </h3>
            <div className="mt-2 text-sm text-font-detail">Click on a resident to view and manage their medication records</div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {residents.map((r) => (
                <div key={r.id} className={`border rounded-lg p-4 hover:shadow-lg cursor-pointer transition-shadow ${r.highlightCls}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-font-base">{r.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${r.badge.cls}`}>{r.badge.text}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {r.meds.map((m, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-font-detail">{m.name}</span>
                        <span className={m.cls}>{m.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-font-detail">{r.footer}</div>
                  <Link href={`/dashboard/medication/medication-sheet?resident=${encodeURIComponent(r.id)}`} className="w-full mt-3 bg-primary text-white py-2 px-3 rounded-lg hover:bg-primary-light text-sm font-medium transition-colors text-center inline-block">
                    <i className="fa-solid fa-file-medical mr-2"></i>
                    View Med Sheet
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Medication Audit Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-clipboard-check text-primary mr-3"></i>
                Medication Audit - Count & Verify
              </h3>
              <div className="mt-2 text-sm text-font-detail">
                Conduct medication inventory count for shift handover
              </div>
            </div>
            <div className="p-6">
              {/* Shift Selection & Staff Info */}
              <div className="bg-primary-lightest border border-primary/20 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Select Shift</label>
                    <select 
                      value={selectedShift}
                      onChange={(e) => setSelectedShift(e.target.value as 'Morning' | 'Evening' | 'Night')}
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="Morning">Morning Shift</option>
                      <option value="Evening">Evening Shift</option>
                      <option value="Night">Night Shift</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Staff Member</label>
                    <input 
                      type="text" 
                      value={currentStaff}
                      disabled
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm bg-bg-subtle text-font-detail"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Date & Time</label>
                    <input 
                      type="text" 
                      value={new Date().toLocaleString()}
                      disabled
                      className="w-full border border-bd rounded-lg px-3 py-2 text-sm bg-bg-subtle text-font-detail"
                    />
                  </div>
                </div>
              </div>

              {/* Medication Count Table */}
              <div className="space-y-6">
                {residentMedCounts.map((resident) => (
                  <div key={resident.residentId} className="border border-bd rounded-lg overflow-hidden">
                    <div className="bg-bg-subtle px-4 py-3 border-b border-bd">
                      <h4 className="font-semibold text-font-base">{resident.residentName}</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-bg-subtle border-b border-bd">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-font-base">Medication</th>
                            <th className="px-4 py-3 text-left font-medium text-font-base">Dosage</th>
                            <th className="px-4 py-3 text-center font-medium text-font-base">Previous Count</th>
                            <th className="px-4 py-3 text-center font-medium text-font-base">Previous Staff</th>
                            <th className="px-4 py-3 text-center font-medium text-font-base">Current Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resident.medications.map((med, idx) => (
                            <tr key={idx} className="border-b border-bd last:border-0">
                              <td className="px-4 py-3 text-font-base">{med.medicationName}</td>
                              <td className="px-4 py-3 text-font-detail">{med.dosage}</td>
                              <td className="px-4 py-3 text-center">
                                <span className="inline-flex items-center justify-center bg-bg-subtle rounded px-3 py-1 font-medium text-font-base">
                                  {med.previousCount}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center text-font-detail">
                                {med.previousStaff}
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={med.currentCount}
                                  onChange={(e) => updateMedCount(resident.residentId, idx, e.target.value)}
                                  placeholder="Enter count"
                                  className="w-full max-w-[120px] mx-auto border border-bd rounded-lg px-3 py-2 text-sm text-center focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes & Submit */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Audit Notes</label>
                  <textarea
                    value={auditNotes}
                    onChange={(e) => setAuditNotes(e.target.value)}
                    placeholder="Add any discrepancies, concerns, or observations..."
                    className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-24"
                  ></textarea>
                </div>
                <button
                  onClick={handleSubmitAudit}
                  className="w-full bg-success text-white py-3 rounded-lg hover:bg-success/90 font-medium transition-colors"
                >
                  <i className="fa-solid fa-check mr-2"></i>
                  Submit Medication Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Med Admin Archive Tab */}
      {activeTab === 'admin-archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-syringe text-primary mr-3"></i>
                  Medication Administration Archive
                </h3>
                <div className="mt-2 text-sm text-font-detail">
                  Historical records of all medication administrations
                </div>
              </div>
              <input
                type="text"
                placeholder="Filter by resident, medication, or staff..."
                value={adminArchiveFilter}
                onChange={(e) => setAdminArchiveFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary w-80"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-subtle border-b border-bd">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Time</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Resident</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Medication</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Action</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Staff</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdminArchive.map((record) => (
                  <tr key={record.id} className="border-b border-bd hover:bg-bg-subtle">
                    <td className="px-4 py-3 text-font-base">{record.date}</td>
                    <td className="px-4 py-3 text-font-detail">{record.time}</td>
                    <td className="px-4 py-3 text-font-base font-medium">{record.resident}</td>
                    <td className="px-4 py-3 text-font-detail">{record.medication}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        record.action === 'Administered' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-error/10 text-error'
                      }`}>
                        {record.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-font-detail">{record.staff}</td>
                    <td className="px-4 py-3 text-font-detail">{record.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Med Audit Archive Tab */}
      {activeTab === 'audit-archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-archive text-primary mr-3"></i>
                  Medication Audit Archive
                </h3>
                <div className="mt-2 text-sm text-font-detail">
                  Historical records of medication counts and audits
                </div>
              </div>
              <input
                type="text"
                placeholder="Filter by resident, medication, or shift..."
                value={auditArchiveFilter}
                onChange={(e) => setAuditArchiveFilter(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary w-80"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-subtle border-b border-bd">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Shift</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Staff</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Resident</th>
                  <th className="px-4 py-3 text-left font-medium text-font-base">Medication</th>
                  <th className="px-4 py-3 text-center font-medium text-font-base">Previous Count</th>
                  <th className="px-4 py-3 text-center font-medium text-font-base">Audited Count</th>
                  <th className="px-4 py-3 text-center font-medium text-font-base">Discrepancy</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditArchive.map((record) => (
                  <tr key={record.id} className="border-b border-bd hover:bg-bg-subtle">
                    <td className="px-4 py-3 text-font-base">{record.date}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                        {record.shift}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-font-detail">{record.staff}</td>
                    <td className="px-4 py-3 text-font-base font-medium">{record.resident}</td>
                    <td className="px-4 py-3 text-font-detail">{record.medication}</td>
                    <td className="px-4 py-3 text-center text-font-base">{record.previousCount}</td>
                    <td className="px-4 py-3 text-center text-font-base">{record.auditedCount}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        record.discrepancy === 0 
                          ? 'bg-success/10 text-success' 
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {record.discrepancy === 0 ? 'Match' : record.discrepancy}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
