'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks/useToast';
import ToastContainer from '@/app/components/Toast';

export default function AwardPointsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [redeemPoints, setRedeemPoints] = useState('');
  const [redeemItem, setRedeemItem] = useState('');
  const [customItem, setCustomItem] = useState('');
  const [customPoints, setCustomPoints] = useState('');
  const [residents, setResidents] = useState<any[]>([]);
  const [selectedResident, setSelectedResident] = useState('');
  const [preSelectedResident, setPreSelectedResident] = useState<any>(null);
  const [diaryCard, setDiaryCard] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [programId, setProgramId] = useState<number | null>(null);
  const [diaryPoints, setDiaryPoints] = useState<{[key: string]: {[day: number]: number}}>({});
  const [repairDays, setRepairDays] = useState<number[]>([]);

  // Define all behaviors with their keys and labels
  const shift1Behaviors = [
    { key: 's1_rule', label: 'Follow Program Rules (2pts)' },
    { key: 's1_directive', label: 'Follow Staff Directives (2pts)' },
    { key: 's1_participate', label: 'Participates in Program Activities (2pts)' },
    { key: 's1_hygiene', label: 'Maintain Hygiene (2pts)' },
    { key: 's1_boundaries', label: 'Maintain Appropriate Boundaries (2pts)' },
    { key: 's1_respectful', label: 'Respectful to Others (2pts)' },
    { key: 's1_coping', label: 'Utilizing Coping Skills (2pts)' },
    { key: 's1_interactions', label: 'Positive Interactions w/ Peers & Staff (2pts)' },
    { key: 's1_beyond', label: 'Above and Beyond Expectations (2pts)' }
  ];

  const shift2Behaviors = [
    { key: 's2_rule', label: 'Follow Program Rules (2pts)' },
    { key: 's2_directive', label: 'Follow Staff Directives (2pts)' },
    { key: 's2_participate', label: 'Participates in Program Activities (2pts)' }
  ];

  const shift3Behaviors = [
    { key: 's3_sleep', label: 'Appropriate Sleep Behavior (2pts)' },
    { key: 's3_schedule', label: 'Follows Sleep Schedule (2pts)' },
    { key: 's3_quiet', label: 'Maintains Quiet Environment (2pts)' },
    { key: 's3_disruptive', label: 'No Disruptive Behaviors (2pts)' }
  ];

  // Helper function to initialize diary points with default values
  const initializeDiaryPoints = () => {
    const behaviors = [
      's1_rule', 's1_directive', 's1_participate', 's1_hygiene', 's1_boundaries',
      's1_respectful', 's1_coping', 's1_interactions', 's1_beyond',
      's2_rule', 's2_directive', 's2_participate',
      's3_sleep', 's3_schedule', 's3_quiet', 's3_disruptive'
    ];
    
    const initialPoints: {[key: string]: {[day: number]: number}} = {};
    behaviors.forEach(behavior => {
      initialPoints[behavior] = {};
      for (let day = 0; day < 7; day++) {
        initialPoints[behavior][day] = 2; // Default 2 points
      }
    });
    setDiaryPoints(initialPoints);
  };

  // Helper function to calculate which days have active repairs
  const calculateRepairDays = (repairs: any[]) => {
    const today = new Date();
    const rDays: number[] = [];
    
    repairs.forEach(repair => {
      if (repair.status === 'approved' && repair.repairStartDate && repair.repairEndDate) {
        const startDate = new Date(repair.repairStartDate);
        const endDate = new Date(repair.repairEndDate);
        
        // Check each day of the current week
        const weekStart = new Date(diaryCard?.weekStartDate || today);
        for (let i = 0; i < 7; i++) {
          const checkDate = new Date(weekStart);
          checkDate.setDate(weekStart.getDate() + i);
          
          if (checkDate >= startDate && checkDate <= endDate) {
            rDays.push(i);
          }
        }
      }
    });
    
    return Array.from(new Set(rDays)); // Remove duplicates
  };

  // Helper to update points for a behavior on a specific day
  const updatePoints = (behaviorKey: string, day: number, points: number) => {
    setDiaryPoints(prev => ({
      ...prev,
      [behaviorKey]: {
        ...prev[behaviorKey],
        [day]: points
      }
    }));
  };

  // Helper to calculate total points for a shift on a specific day
  const calculateShiftTotal = (shiftBehaviors: string[], day: number) => {
    if (repairDays.includes(day)) return 0; // R3 days have 0 points
    return shiftBehaviors.reduce((sum, behavior) => {
      return sum + (diaryPoints[behavior]?.[day] || 0);
    }, 0);
  };

  // Save diary card
  const handleSaveDiary = async () => {
    if (!programId || !selectedResident) {
      addToast('Please select a resident', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        addToast('Not authenticated', 'error');
        return;
      }

      // Calculate totals
      const shift1Behaviors = ['s1_rule', 's1_directive', 's1_participate', 's1_hygiene', 's1_boundaries', 's1_respectful', 's1_coping', 's1_interactions', 's1_beyond'];
      const shift2Behaviors = ['s2_rule', 's2_directive', 's2_participate'];
      const shift3Behaviors = ['s3_sleep', 's3_schedule', 's3_quiet', 's3_disruptive'];
      
      const dailyTotals = [];
      for (let day = 0; day < 7; day++) {
        const shift1Total = calculateShiftTotal(shift1Behaviors, day);
        const shift2Total = calculateShiftTotal(shift2Behaviors, day);
        const shift3Total = calculateShiftTotal(shift3Behaviors, day);
        dailyTotals.push(shift1Total + shift2Total + shift3Total);
      }

      const response = await fetch(`/api/programs/${programId}/points/resident/${selectedResident}/diary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          diaryData: JSON.stringify(diaryPoints),
          dailyTotals,
          weekStartDate: diaryCard?.weekStartDate,
          weekEndDate: diaryCard?.weekEndDate
        })
      });

      if (response.ok) {
        addToast('Diary card saved successfully!', 'success');
        // Reload diary card
        const newData = await response.json();
        setDiaryCard(newData);
      } else {
        const error = await response.text();
        addToast(`Error: ${error}`, 'error');
      }
    } catch (error) {
      console.error('Error saving diary:', error);
      addToast('Failed to save diary card', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch residents on mount
  useEffect(() => {
    const loadResidents = async () => {
      try {
        const programData = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
        if (!programData) return;
        
        const program = JSON.parse(programData);
        setProgramId(program.id);

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        const response = await fetch(`/api/programs/${program.id}/residents`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setResidents(data);
          
          // Check if residentId is in URL query params
          const residentIdParam = searchParams.get('residentId');
          if (residentIdParam) {
            setSelectedResident(residentIdParam);
            // Find and store the pre-selected resident to lock the field
            const preSelected = data.find((r: any) => r.id.toString() === residentIdParam);
            if (preSelected) {
              setPreSelectedResident(preSelected);
            }
          } else if (data.length > 0) {
            setSelectedResident(data[0].id.toString());
          }
        }
      } catch (error) {
        console.error('Error loading residents:', error);
      }
    };

    loadResidents();
  }, [searchParams]);

  // Fetch diary card when resident changes
  useEffect(() => {
    if (!selectedResident || !programId) return;

    const loadDiaryCard = async () => {
      setLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        const response = await fetch(`/api/programs/${programId}/points/resident/${selectedResident}/current`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setDiaryCard(data);
          
          // Load existing diary points if available
          if (data.diaryData) {
            setDiaryPoints(JSON.parse(data.diaryData));
          } else {
            // Initialize with default 2 points for all behaviors
            initializeDiaryPoints();
          }
        }
        
        // Fetch repairs to mark R3 days
        const repairsResponse = await fetch(`/api/programs/${programId}/repairs/interventions/resident/${selectedResident}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (repairsResponse.ok) {
          const repairs = await repairsResponse.json();
          // Calculate which days have active repairs
          const rDays = calculateRepairDays(repairs);
          setRepairDays(rDays);
        }
      } catch (error) {
        console.error('Error loading diary card:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDiaryCard();
  }, [selectedResident, programId]);

  const handleRedeem = async () => {
    if (!programId || !selectedResident) {
      alert('Please select a resident');
      return;
    }

    const pointsToRedeem = redeemItem === 'Other' ? parseInt(customPoints) : parseInt(redeemPoints);
    const itemName = redeemItem === 'Other' ? customItem : redeemItem;

    if (!pointsToRedeem || !itemName) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      const response = await fetch(`/api/programs/${programId}/redemptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          residentId: parseInt(selectedResident),
          redemptionDate: new Date().toISOString().split('T')[0],
          pointsRedeemed: pointsToRedeem,
          rewardItem: itemName,
          customItem: redeemItem === 'Other'
        })
      });

      if (response.ok) {
        alert(`Redemption submitted successfully! Awaiting approval.`);
        setRedeemItem('');
        setRedeemPoints('');
        setCustomItem('');
        setCustomPoints('');
        // Reload diary card
        const currentResident = selectedResident;
        setSelectedResident('');
        setTimeout(() => setSelectedResident(currentResident), 100);
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error('Error submitting redemption:', error);
      alert('Failed to submit redemption');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Resident header card */}
      <div className="bg-white p-6 rounded-lg border border-bd">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {preSelectedResident ? (
              <input
                type="text"
                value={`${preSelectedResident.firstName} ${preSelectedResident.lastName} (${preSelectedResident.residentId || '000001'})`}
                disabled
                className="border border-bd rounded-lg px-3 py-2 text-sm bg-bg-subtle text-font-base cursor-not-allowed min-w-[250px]"
              />
            ) : (
              <select
                value={selectedResident}
                onChange={(e) => setSelectedResident(e.target.value)}
                className="border border-bd rounded-lg px-3 py-2 text-sm"
              >
                {residents.map(r => (
                  <option key={r.id} value={r.id}>{r.firstName} {r.lastName} ({r.residentId})</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center space-x-8 text-center">
            <div>
              <p className="text-font-detail text-sm">Week Starting Points</p>
              <p className="text-2xl font-bold text-primary">{diaryCard?.startingPoints || 0}</p>
            </div>
            <div>
              <p className="text-font-detail text-sm">Current Week Balance</p>
              <p className="text-2xl font-bold text-success">{diaryCard?.currentBalance || 0}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="week-ending" className="text-sm font-medium text-font-detail">
              Week Ending:
            </label>
            <input
              type="date"
              id="week-ending"
              value={diaryCard?.weekEndDate || ''}
              readOnly
              className="border border-bd rounded-lg px-3 py-2 text-sm bg-bg-subtle"
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
              <p className="text-3xl font-bold">{diaryCard?.currentBalance || 0}</p>
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
                  max={diaryCard?.currentBalance || 0}
                  className="w-full border border-bd rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                <p className="mt-1 text-xs text-font-detail">
                  Maximum: {diaryCard?.currentBalance || 0} points
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
                max={diaryCard?.currentBalance || 0}
                className="w-full border border-bd rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              <p className="mt-1 text-xs text-font-detail">
                Maximum: {diaryCard?.currentBalance || 0} points
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
                submitting || (
                  redeemItem === 'Other' 
                    ? (!customItem || !customPoints)
                    : (!redeemPoints || !redeemItem)
                )
              }
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-check-circle"></i>
              {submitting ? 'Submitting...' : 'Redeem Points'}
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
        
        {/* Save Button */}
        <div className="p-4 bg-bg-subtle border-t border-bd">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-font-detail">
              <i className="fa-solid fa-info-circle text-primary"></i>
              <span>Save changes to update the resident's diary card</span>
            </div>
            <button
              onClick={handleSaveDiary}
              disabled={submitting || !selectedResident}
              className="bg-success text-white px-6 py-3 rounded-lg font-medium hover:bg-success/90 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className={`fa-solid ${submitting ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
              {submitting ? 'Saving...' : 'Save Diary Card'}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
