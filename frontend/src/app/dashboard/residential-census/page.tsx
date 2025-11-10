'use client';

import { useEffect, useMemo, useState } from 'react';

type Resident = {
  id: string;
  name: string;
  location: string;
};

type CensusEntry = {
  present: boolean;
  note: string;
  location: string;
  locationOther?: string;
};

type CensusData = {
  saved: boolean;
  savedAt?: string;
  entries: Record<string, CensusEntry>; // residentId -> entry
  conductedBy?: string;
};

const demoResidents: Resident[] = [
  { id: 'r1', name: 'Resident AB', location: 'Unit A - Room 101' },
  { id: 'r2', name: 'Resident CD', location: 'Unit A - Room 102' },
  { id: 'r3', name: 'Resident EF', location: 'Unit B - Room 201' },
  { id: 'r4', name: 'Resident GH', location: 'Medical Isolation' },
];

export default function ResidentialCensusPage() {
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [dateISO, setDateISO] = useState<string>(todayISO);
  const [residents] = useState<Resident[]>(demoResidents);
  const [data, setData] = useState<CensusData>({ saved: false, entries: {} });

  const locationOptions = useMemo(() => {
    const roomSet = new Set<string>(residents.map((r) => r.location));
    const rooms = Array.from(roomSet);
    const commons = [
      'Medical Isolation',
      'Infirmary',
      'Classroom 1',
      'Classroom 2',
      'Recreation',
      'Off Unit',
      'Court',
    ];
    const all = Array.from(new Set<string>([...rooms, ...commons]));
    all.push('Other');
    return all;
  }, [residents]);

  // Load census data for the selected date from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(censusKey(dateISO));
    if (raw) {
      try {
        const parsed: CensusData = JSON.parse(raw);
        setData(parsed);
      } catch {
        setData({ saved: false, entries: {} });
      }
    } else {
      // initialize entries for residents for a new date
      const entries: Record<string, CensusEntry> = {};
      for (const r of residents) entries[r.id] = { present: false, note: '', location: r.location, locationOther: '' };
      setData({ saved: false, entries, conductedBy: '' });
    }
  }, [dateISO, residents]);

  const handleToggle = (id: string) => {
    if (data.saved) return;
    setData((prev) => ({
      ...prev,
      entries: { ...prev.entries, [id]: { ...prev.entries[id], present: !prev.entries[id]?.present } },
    }));
  };

  const handleNote = (id: string, note: string) => {
    if (data.saved) return;
    setData((prev) => ({
      ...prev,
      entries: { ...prev.entries, [id]: { ...prev.entries[id], note } },
    }));
  };

  const handleLocation = (id: string, location: string) => {
    if (data.saved) return;
    setData((prev) => ({
      ...prev,
      entries: {
        ...prev.entries,
        [id]: {
          ...prev.entries[id],
          location,
          locationOther: location === 'Other' ? prev.entries[id]?.locationOther || '' : '',
        },
      },
    }));
  };

  const handleLocationOther = (id: string, locationOther: string) => {
    if (data.saved) return;
    setData((prev) => ({
      ...prev,
      entries: { ...prev.entries, [id]: { ...prev.entries[id], locationOther } },
    }));
  };

  const save = () => {
    if (data.saved) return;
    const payload: CensusData = { ...data, saved: true, savedAt: new Date().toISOString() };
    localStorage.setItem(censusKey(dateISO), JSON.stringify(payload));
    setData(payload);
  };

  const sendToAdmins = () => {
    if (!data.saved) {
      alert('Please save the census before sending to admins.');
      return;
    }
    // Simulate email send; integrate backend later
    console.log('Sending census to admins for', dateISO, data);
    alert('Census sent to admins.');
  };

  const prevDay = () => shiftDate(-1);
  const nextDay = () => shiftDate(1);
  const shiftDate = (delta: number) => {
    const d = new Date(dateISO);
    d.setDate(d.getDate() + delta);
    setDateISO(d.toISOString().slice(0, 10));
  };

  const presentCount = Object.values(data.entries).filter((e) => e.present).length;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-lg border border-bd p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-lightest rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-clipboard-check text-primary text-2xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-font-heading">Residential Census</h2>
              <p className="text-sm text-font-detail">Verify presence of all residents for the selected date</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={prevDay} className="px-3 py-2 border border-bd rounded-lg hover:bg-bg-subtle" title="Previous day">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <input
              type="date"
              value={dateISO}
              onChange={(e) => setDateISO(e.target.value)}
              className="px-3 py-2 border border-bd rounded-lg focus:ring-2 ring-primary focus:border-transparent"
            />
            <button onClick={nextDay} className="px-3 py-2 border border-bd rounded-lg hover:bg-bg-subtle" title="Next day">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-user text-primary"></i>
              <input
                type="text"
                value={data.conductedBy || ''}
                onChange={(e) => setData((prev) => ({ ...prev, conductedBy: e.target.value }))}
                disabled={!!data.saved}
                placeholder="Conducted By (Staff Name)"
                className="px-3 py-2 border border-bd rounded-lg focus:ring-2 ring-primary focus:border-transparent text-sm"
              />
            </div>
            {data.saved ? (
              <span className="px-3 py-2 text-xs rounded-full bg-primary-alt-lightest text-primary-alt border border-primary-alt">
                Locked {data.savedAt ? `• ${new Date(data.savedAt).toLocaleString()}` : ''}
              </span>
            ) : null}
            <button
              onClick={save}
              disabled={data.saved}
              className={`px-4 py-2 rounded-lg text-white text-sm ${data.saved ? 'bg-bg-subtle text-font-detail cursor-not-allowed' : 'bg-primary hover:bg-primary-light'}`}
            >
              <i className="fa-solid fa-save mr-2"></i>
              Save Census
            </button>
            <button onClick={sendToAdmins} className="px-4 py-2 rounded-lg bg-primary-alt text-white hover:bg-primary-alt-dark text-sm">
              <i className="fa-solid fa-paper-plane mr-2"></i>
              Send to Admins
            </button>
          </div>
        </div>
      </div>

      {/* Census Table */}
      <div className="bg-white rounded-lg border border-bd p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-font-detail">
            Present: <span className="font-medium text-font-base">{presentCount}</span> / {residents.length}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-bd">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-3 text-left font-medium border-r border-primary-light">Resident</th>
                <th className="px-3 py-3 text-left font-medium border-r border-primary-light">Location</th>
                <th className="px-3 py-3 text-center font-medium border-r border-primary-light">Present</th>
                <th className="px-3 py-3 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bd">
              {residents.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 font-medium text-font-base border-r border-bd">{r.name}</td>
                  <td className="px-3 py-3 text-font-base border-r border-bd">
                    <div className="flex items-center gap-2">
                      <select
                        value={data.entries[r.id]?.location ?? r.location}
                        onChange={(e) => handleLocation(r.id, e.target.value)}
                        disabled={data.saved}
                        className="border border-bd rounded-lg px-2 py-2 focus:ring-2 ring-primary focus:border-transparent text-sm"
                      >
                        {locationOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {data.entries[r.id]?.location === 'Other' && (
                        <input
                          type="text"
                          value={data.entries[r.id]?.locationOther || ''}
                          onChange={(e) => handleLocationOther(r.id, e.target.value)}
                          disabled={data.saved}
                          placeholder="Specify (e.g., Hospital)"
                          className="flex-1 min-w-[200px] border border-bd rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent text-sm"
                        />)
                      }
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center border-r border-bd">
                    <input
                      type="checkbox"
                      checked={!!data.entries[r.id]?.present}
                      onChange={() => handleToggle(r.id)}
                      disabled={data.saved}
                      className="w-5 h-5 accent-primary"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <textarea
                      value={data.entries[r.id]?.note || ''}
                      onChange={(e) => handleNote(r.id, e.target.value)}
                      disabled={data.saved}
                      rows={2}
                      placeholder="Add an optional note (e.g., taken to hospital, with clinician, etc.)"
                      className="w-full border border-bd rounded-lg px-3 py-2 focus:ring-2 ring-primary focus:border-transparent resize-y"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function censusKey(dateISO: string) {
  return `census:${dateISO}`;
}
