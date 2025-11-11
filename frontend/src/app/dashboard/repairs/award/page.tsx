'use client';

export default function AwardPointsPage() {
  return (
    <div className="space-y-6">
      {/* Resident header card */}
      <div className="bg-white p-6 rounded-lg border border-bd">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
              alt="Resident"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h3 className="text-xl font-bold text-font-base">Marcus Johnson</h3>
              <p className="text-font-detail">ID: 2847</p>
              <span className="mt-1 inline-block bg-error text-white px-3 py-1 rounded-full text-xs font-semibold">
                Active R3 Repair
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-8 text-center">
            <div>
              <p className="text-font-detail text-sm">Week Starting Points</p>
              <p className="text-2xl font-bold text-primary">213</p>
            </div>
            <div>
              <p className="text-font-detail text-sm">Current Week Balance</p>
              <p className="text-2xl font-bold text-success">245</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="week-ending" className="text-sm font-medium text-font-detail">
              Week Ending:
            </label>
            <input
              type="date"
              id="week-ending"
              defaultValue="2025-10-31"
              className="border border-bd rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Diary Card Table */}
      <div className="bg-white rounded-lg border border-bd overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bg-subtle">
                <th className="p-3 font-medium text-font-base text-sm text-left border border-bd w-2/5">
                  Behavior / Activity
                </th>
                {['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT'].map((d) => (
                  <th key={d} className="p-3 font-medium text-font-base text-sm text-center border border-bd bg-primary text-white">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="bg-primary text-white font-semibold p-2 border border-bd">
                  First Shift (7AM - 3PM)
                </td>
              </tr>
              {[
                'Follow Program Rules (2pts)',
                'Follow Staff Directives (2pts)',
                'Participates in Program Activities (2pts)',
                'Maintain Hygiene (2pts)',
                'Maintain Appropriate Boundaries (2pts)',
                'Respectful to Others (2pts)',
                'Utilizing Coping Skills (2pts)',
                'Positive Interactions w/ Peers & Staff (2pts)',
                'Above and Beyond Expectations (2pts)'
              ].map((label, idx) => (
                <tr key={`s1-${idx}`} className="hover:bg-primary-lightest/30">
                  <td className="p-2 border border-bd text-sm">{label}</td>
                  {[0, 1, 2].map((i) => (
                    <td key={`s1a-${idx}-${i}`} className="p-0 border border-bd bg-error-lightest">
                      <input type="text" defaultValue="R3" disabled className="w-full h-full text-center border-none bg-transparent px-1.5 py-2 text-sm" />
                    </td>
                  ))}
                  {[0, 1, 2, 3].map((i) => (
                    <td key={`s1b-${idx}-${i}`} className="p-0 border border-bd">
                      <input type="number" defaultValue={idx === 2 && i === 0 ? 1 : idx === 4 && i === 1 ? 1 : idx === 8 && i === 0 ? 0 : 2} min={0} max={10} className="w-full h-full text-center border-none bg-transparent px-1.5 py-2 text-sm" />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-primary-lightest">
                <td className="p-2 border border-bd text-sm font-semibold">Points Earned (Shift 1)</td>
                {[0, 1, 2].map((i) => (
                  <td key={`s1-tot-a-${i}`} className="p-2 border border-bd text-center font-bold text-error">
                    0
                  </td>
                ))}
                {['13', '15', '16', '19'].map((v, i) => (
                  <td key={`s1-tot-b-${i}`} className="p-2 border border-bd text-center font-bold text-primary">
                    {v}
                  </td>
                ))}
              </tr>

              <tr>
                <td colSpan={8} className="bg-primary text-white font-semibold p-2 border border-bd">
                  Second Shift (3PM - 11PM)
                </td>
              </tr>
              {[
                'Follow Program Rules (2pts)',
                'Follow Staff Directives (2pts)',
                'Participates in Program Activities (2pts)'
              ].map((label, idx) => (
                <tr key={`s2-${idx}`} className="hover:bg-primary-lightest/30">
                  <td className="p-2 border border-bd text-sm">{label}</td>
                  {[0, 1, 2].map((i) => (
                    <td key={`s2a-${idx}-${i}`} className="p-0 border border-bd bg-error-lightest">
                      <input type="text" defaultValue="R3" disabled className="w-full h-full text-center border-none bg-transparent px-1.5 py-2 text-sm" />
                    </td>
                  ))}
                  <td className="p-0 border border-bd"><input type="number" defaultValue={2} min={0} max={10} className="w-full h-full text-center border-none bg-transparent px-1.5 py-2 text-sm" /></td>
                  <td className="p-0 border border-bd"><input type="number" defaultValue={2} min={0} max={10} className="w-full h-full text-center border-none bg-transparent px-1.5 py-2 text-sm" /></td>
                  <td className="p-0 border border-bd"><input type="number" defaultValue={idx === 2 ? 0 : 1} min={0} max={10} className="w-full h-full text-center border-none bg-transparent px-1.5 py-2 text-sm" /></td>
                  <td className="p-0 border border-bd"><input type="number" defaultValue={2} min={0} max={10} className="w-full h-full text-center border-none bg-transparent px-1.5 py-2 text-sm" /></td>
                </tr>
              ))}
              <tr className="bg-primary-lightest">
                <td className="p-2 border border-bd text-sm font-semibold">Points Earned (Shift 2)</td>
                {[0, 1, 2].map((i) => (
                  <td key={`s2-tot-a-${i}`} className="p-2 border border-bd text-center font-bold text-error">
                    0
                  </td>
                ))}
                {['6', '6', '3', '7'].map((v, i) => (
                  <td key={`s2-tot-b-${i}`} className="p-2 border border-bd text-center font-bold text-primary">
                    {v}
                  </td>
                ))}
              </tr>

              <tr>
                <td colSpan={8} className="bg-primary text-white font-semibold p-2 border border-bd">
                  Third Shift (11PM - 7AM)
                </td>
              </tr>
              {[
                'Appropriate Sleep Behavior (2pts)',
                'Follows Sleep Schedule (2pts)',
                'Maintains Quiet Environment (2pts)',
                'No Disruptive Behaviors (2pts)'
              ].map((label, idx) => (
                <tr key={`s3-${idx}`} className="hover:bg-primary-lightest/30">
                  <td className="p-2 border border-bd text-sm">{label}</td>
                  {[0, 1, 2].map((i) => (
                    <td key={`s3a-${idx}-${i}`} className="p-0 border border-bd bg-error-lightest">
                      <input type="text" defaultValue="R3" disabled className="w-full h-full text-center border-none bg-transparent px-1.5 py-2 text-sm" />
                    </td>
                  ))}
                  {[0, 1, 2, 3].map((i) => (
                    <td key={`s3b-${idx}-${i}`} className="p-0 border border-bd">
                      <input type="number" defaultValue={2} min={0} max={10} className="w-full h-full text-center border-none bg-transparent px-1.5 py-2 text-sm" />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-primary-lightest">
                <td className="p-2 border border-bd text-sm font-semibold">Points Earned (Shift 3)</td>
                {[0, 1, 2].map((i) => (
                  <td key={`s3-tot-a-${i}`} className="p-2 border border-bd text-center font-bold text-error">
                    0
                  </td>
                ))}
                {['8', '8', '8', '8'].map((v, i) => (
                  <td key={`s3-tot-b-${i}`} className="p-2 border border-bd text-center font-bold text-primary">
                    {v}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
