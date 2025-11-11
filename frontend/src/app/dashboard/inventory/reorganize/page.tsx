'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ReorganizeInventoryPage() {
  const router = useRouter();
  const [selectedZone, setSelectedZone] = useState<string>('C');
  const [planName, setPlanName] = useState('Zone C Capacity Relief');
  const initialZones = [
    { id: 'A', name: 'Zone A', capacity: 68 },
    { id: 'B', name: 'Zone B', capacity: 74 },
    { id: 'C', name: 'Zone C', capacity: 95 },
    { id: 'D', name: 'Zone D', capacity: 57 },
  ];
  const [zones, setZones] = useState<{ id: string; name: string; capacity: number }[]>(initialZones);

  const initialDetails: Record<string, { items: number; shelves: number; alerts: number; note: string }> = {
    A: { items: 124, shelves: 12, alerts: 1, note: 'Plenty of headroom for light/bulky items.' },
    B: { items: 158, shelves: 14, alerts: 2, note: 'Keep for perishable goods near dispatch.' },
    C: { items: 212, shelves: 10, alerts: 3, note: 'Over capacity. Move toiletries and clothing overflow.' },
    D: { items: 96, shelves: 9, alerts: 0, note: 'Ideal for non-critical, seasonal items.' },
  };
  const [detailsMap, setDetailsMap] = useState(initialDetails);

  // New Zone form state
  const [newZoneId, setNewZoneId] = useState('E');
  const [newZoneName, setNewZoneName] = useState('Zone E');
  const [newZoneCapacity, setNewZoneCapacity] = useState<number>(50);

  const suggestions = [
    {
      id: 's1',
      from: 'Zone C',
      to: 'Zone A',
      item: 'Clothing - Winter Jackets (Mixed Sizes)',
      qty: '12 boxes',
      impact: 'Free up 8% in Zone C',
      severity: 'high',
    },
    {
      id: 's2',
      from: 'Zone C',
      to: 'Zone D',
      item: 'Toiletries - Bulk Tissue Packs',
      qty: '6 cases',
      impact: 'Free up 4% in Zone C',
      severity: 'medium',
    },
    {
      id: 's3',
      from: 'Zone C',
      to: 'Zone B',
      item: 'Food - Breakfast Cereal (Non-urgent)',
      qty: '10 cartons',
      impact: 'Free up 3% in Zone C',
      severity: 'low',
    },
  ];

  const handleApply = () => {
    alert('Reorganization plan applied. Tasks have been sent to the floor team.');
    router.back();
  };

  const handleSaveDraft = () => {
    alert('Reorganization plan saved as draft.');
  };

  const handleCancel = () => {
    if (confirm('Cancel this reorganization plan? Unsaved changes will be lost.')) {
      router.back();
    }
  };

  const capacityBadge = (v: number) => {
    if (v >= 90) return 'bg-error-lightest text-error';
    if (v >= 75) return 'bg-warning-lightest text-warning';
    return 'bg-success-lightest text-success';
  };

  const barColor = (v: number) => {
    if (v >= 90) return 'bg-error';
    if (v >= 75) return 'bg-warning';
    return 'bg-success';
  };

  const selected = zones.find((z) => z.id === selectedZone) || zones[0];
  const details = detailsMap[selectedZone] || { items: 0, shelves: 0, alerts: 0, note: 'Newly created zone.' };

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    const id = newZoneId.trim().toUpperCase();
    const name = newZoneName.trim();
    const cap = Math.max(0, Math.min(100, Number(newZoneCapacity)));
    if (!id || !name) {
      alert('Please provide a Zone ID and Zone Name.');
      return;
    }
    if (zones.some((z) => z.id === id)) {
      alert('A zone with this ID already exists.');
      return;
    }
    const updatedZones = [...zones, { id, name, capacity: cap }];
    setZones(updatedZones);
    setDetailsMap({
      ...detailsMap,
      [id]: { items: 0, shelves: 0, alerts: 0, note: 'Newly created zone.' },
    });
    setSelectedZone(id);
    setNewZoneId('');
    setNewZoneName('');
    setNewZoneCapacity(50);
  };

  return (
    <div className="p-6 space-y-6">
      <section className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-font-heading">Storage Reorganization</h3>
              <p className="text-sm text-font-detail">Balance capacity, reduce congestion, and optimize retrieval paths</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${capacityBadge(selected.capacity)}`}>
                <i className="fa-solid fa-warehouse mr-2"></i>
                {selected.name}: {selected.capacity}% full
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bg-subtle rounded-lg p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-diagram-project text-primary"></i>
                  <input
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="px-3 py-2 border border-bd rounded-lg bg-white text-sm w-72"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveDraft} className="px-3 py-2 border border-bd rounded-lg text-sm">
                    Save Draft
                  </button>
                  <button onClick={handleCancel} className="px-3 py-2 text-sm rounded-lg bg-bg-subtle border border-bd">
                    Cancel
                  </button>
                  <button onClick={handleApply} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90">
                    Apply Plan
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white">
              <h4 className="text-sm font-semibold text-font-detail mb-3">Capacity by Zone</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {zones.map((z) => (
                  <div key={z.id} className={`p-4 rounded-lg border ${selectedZone === z.id ? 'border-primary' : 'border-bd'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="zone"
                          checked={selectedZone === z.id}
                          onChange={() => setSelectedZone(z.id)}
                          className="accent-primary"
                        />
                        <span className="font-medium text-font-base">{z.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${capacityBadge(z.capacity)}`}>{z.capacity}%</span>
                    </div>
                    <div className="w-full bg-primary-lightest rounded-full h-2">
                      <div className={`${barColor(z.capacity)} h-2 rounded-full`} style={{ width: `${z.capacity}%` }}></div>
                    </div>
                    <p className="text-xs text-font-detail mt-2">{z.id === 'C' ? 'High congestion due to recent intake' : 'Balanced'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white">
              <h4 className="text-sm font-semibold text-font-detail mb-3">Suggested Moves</h4>
              <div className="space-y-3">
                {suggestions.map((s) => (
                  <div key={s.id} className="p-4 rounded-lg border border-bd flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-font-detail">{s.from} → {s.to}</p>
                      <p className="font-medium text-font-base">{s.item}</p>
                      <p className="text-sm text-font-detail">{s.qty} • {s.impact}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${s.severity === 'high' ? 'bg-error-lightest text-error' : s.severity === 'medium' ? 'bg-warning-lightest text-warning' : 'bg-highlight-lightest text-highlight'}`}>
                        {s.severity === 'high' ? 'High' : s.severity === 'medium' ? 'Medium' : 'Low'} Impact
                      </span>
                      <button className="px-3 py-2 text-sm border border-bd rounded-lg hover:bg-bg-subtle">Add to Plan</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-bd p-5">
              <h4 className="font-semibold text-font-base mb-3">{selected.name} Overview</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-bg-subtle p-3 rounded-lg">
                  <p className="text-font-detail">Items</p>
                  <p className="text-xl font-bold">{details.items}</p>
                </div>
                <div className="bg-bg-subtle p-3 rounded-lg">
                  <p className="text-font-detail">Shelves</p>
                  <p className="text-xl font-bold">{details.shelves}</p>
                </div>
                <div className="bg-bg-subtle p-3 rounded-lg">
                  <p className="text-font-detail">Alerts</p>
                  <p className="text-xl font-bold">{details.alerts}</p>
                </div>
                <div className="bg-bg-subtle p-3 rounded-lg">
                  <p className="text-font-detail">Priority</p>
                  <p className="text-xl font-bold">{selected.capacity >= 90 ? 'Critical' : selected.capacity >= 75 ? 'High' : 'Normal'}</p>
                </div>
              </div>
              <p className="text-sm text-font-detail mt-3">{details.note}</p>
            </div>

            <div className="bg-white rounded-lg border border-bd p-5">
              <h4 className="font-semibold text-font-base mb-3">Create New Zone</h4>
              <form onSubmit={handleCreateZone} className="space-y-3 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-font-detail mb-1">Zone ID</label>
                    <input
                      value={newZoneId}
                      onChange={(e) => setNewZoneId(e.target.value)}
                      placeholder="E"
                      className="w-full border border-bd rounded-lg p-2"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <label className="block text-font-detail mb-1">Zone Name</label>
                    <input
                      value={newZoneName}
                      onChange={(e) => setNewZoneName(e.target.value)}
                      placeholder="Zone E"
                      className="w-full border border-bd rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-font-detail mb-1">Capacity (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newZoneCapacity}
                      onChange={(e) => setNewZoneCapacity(Number(e.target.value))}
                      className="w-full border border-bd rounded-lg p-2"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="submit" className="px-3 py-2 bg-primary text-white rounded-lg">Add Zone</button>
                  <button type="button" onClick={() => { setNewZoneId(''); setNewZoneName(''); setNewZoneCapacity(50); }} className="px-3 py-2 border border-bd rounded-lg">Clear</button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg border border-bd p-5">
              <h4 className="font-semibold text-font-base mb-3">Plan Checklist</h4>
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary" />
                  Notify floor supervisor
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary" />
                  Print move labels for items
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary" />
                  Reserve carts and equipment
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary" />
                  Update zone map after move
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-bd p-5">
              <h4 className="font-semibold text-font-base mb-3">Notes</h4>
              <textarea className="w-full border border-bd rounded-lg p-3 text-sm" rows={4} placeholder="Add any special instructions..." />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
