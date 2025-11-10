'use client';

import { useState } from 'react';
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

export default function MedicationPage() {
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
      title: 'Medication Count Discrepancy: Sertraline 50mg - Expected: 45, Found: 43',
      description: 'Discrepancy flagged during morning count. Requires supervisor review.',
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end">
        <Link href="/dashboard/medication/all-medication-records" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light font-medium text-sm inline-flex items-center gap-2">
          <i className="fa-solid fa-table"></i>
          All Medication Records
        </Link>
      </div>
      {/* Alerts & Issues */}
      <section id="alerts-section" className="bg-white rounded-lg border border-bd">
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

      {/* Add New Resident & Medications */}
      <section id="add-resident-section" className="bg-white rounded-lg border border-bd">
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

      {/* Current Residents on Medication */}
      <section id="current-residents" className="bg-white rounded-lg border border-bd">
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
    </div>
  );
}
