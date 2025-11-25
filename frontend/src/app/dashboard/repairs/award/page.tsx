'use client';

import { useState } from 'react';

export default function AwardPointsPage() {
  const [redeemPoints, setRedeemPoints] = useState('');
  const [redeemItem, setRedeemItem] = useState('');
  const [customItem, setCustomItem] = useState('');
  const [customPoints, setCustomPoints] = useState('');
  
  // Mock weekly data - will be replaced with API
  const weekData = {
    startingPoints: 213,
    currentBalance: 245,
    weekEnding: '2025-11-30',
    dailyPoints: [0, 0, 0, 13, 15, 16, 19], // SUN-SAT
    repairDays: [true, true, true, false, false, false, false] // Days with repairs
  };

  const handleRedeem = () => {
    if (redeemItem === 'Other') {
      if (customItem && customPoints) {
        alert(`Redeeming ${customPoints} points for: ${customItem}`);
        setRedeemItem('');
        setCustomItem('');
        setCustomPoints('');
      }
    } else if (redeemPoints && redeemItem) {
      alert(`Redeeming ${redeemPoints} points for: ${redeemItem}`);
      setRedeemPoints('');
      setRedeemItem('');
    }
  };

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

      {/* Redeeming Points Section */}
      <div className="bg-gradient-to-br from-primary/5 via-white to-primary-lightest rounded-xl border border-primary/20 shadow-sm overflow-hidden">
        <div className="bg-primary p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <i className="fa-solid fa-gift text-2xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold">Redeem Points</h3>
                <p className="text-sm text-primary-lightest">Exchange points for rewards</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-lightest">Available Points</p>
              <p className="text-3xl font-bold">{weekData.currentBalance}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {/* Reward Item Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-font-base mb-2">
              Reward Item
            </label>
            <select
              value={redeemItem}
              onChange={(e) => setRedeemItem(e.target.value)}
              className="w-full border border-bd rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="">Select reward...</option>
              <option value="Extra Phone Call (50pts)">Extra Phone Call (50pts)</option>
              <option value="Movie Night (100pts)">Movie Night (100pts)</option>
              <option value="Video Game Time (75pts)">Video Game Time (75pts)</option>
              <option value="Snack from Store (30pts)">Snack from Store (30pts)</option>
              <option value="Later Bedtime (125pts)">Later Bedtime (125pts)</option>
              <option value="Special Activity (150pts)">Special Activity (150pts)</option>
              <option value="Other">Other (Specify Item & Points)</option>
            </select>
          </div>

          {/* Conditional Fields Based on Selection */}
          {redeemItem === 'Other' ? (
            // Custom Item and Points Fields
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  Custom Item Name
                </label>
                <input
                  type="text"
                  value={customItem}
                  onChange={(e) => setCustomItem(e.target.value)}
                  placeholder="Enter item name..."
                  className="w-full border border-bd rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                <p className="mt-1 text-xs text-font-detail">
                  Specify the custom reward item
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">
                  Points for This Item
                </label>
                <input
                  type="number"
                  value={customPoints}
                  onChange={(e) => setCustomPoints(e.target.value)}
                  placeholder="Enter points..."
                  min="0"
                  max={weekData.currentBalance}
                  className="w-full border border-bd rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                <p className="mt-1 text-xs text-font-detail">
                  Maximum: {weekData.currentBalance} points
                </p>
              </div>
            </div>
          ) : redeemItem ? (
            // Standard Points Field (for pre-defined items)
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                Points to Redeem
              </label>
              <input
                type="number"
                value={redeemPoints}
                onChange={(e) => setRedeemPoints(e.target.value)}
                placeholder="Enter points amount..."
                min="0"
                max={weekData.currentBalance}
                className="w-full border border-bd rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              <p className="mt-1 text-xs text-font-detail">
                Maximum: {weekData.currentBalance} points
              </p>
            </div>
          ) : null}
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-font-detail">
              <i className="fa-solid fa-info-circle text-primary"></i>
              <span>Points are cumulative and reset weekly</span>
            </div>
            <button
              onClick={handleRedeem}
              disabled={
                redeemItem === 'Other' 
                  ? (!customItem || !customPoints)
                  : (!redeemPoints || !redeemItem)
              }
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-check-circle"></i>
              Redeem Points
            </button>
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
