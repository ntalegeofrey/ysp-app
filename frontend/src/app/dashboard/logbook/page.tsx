'use client';

export default function LogbookPage() {
  const entries = [
    { id: 1, date: '2024-03-15 14:30', author: 'John Doe', category: 'General', entry: 'Routine facility inspection completed. All areas in good condition.' },
    { id: 2, date: '2024-03-15 10:15', author: 'Jane Smith', category: 'Maintenance', entry: 'HVAC system serviced in Building A.' },
    { id: 3, date: '2024-03-14 16:45', author: 'Mike Johnson', category: 'Event', entry: 'Recreational activity - Basketball tournament organized.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-font-detail">Daily log book and event documentation</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition flex items-center gap-2">
          <i className="fa-solid fa-plus"></i>
          New Entry
        </button>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                  {entry.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-font-base">{entry.author}</p>
                  <p className="text-sm text-font-detail">{entry.date}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary-lightest text-primary rounded-full text-xs font-medium">
                {entry.category}
              </span>
            </div>
            <p className="text-font-base">{entry.entry}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
