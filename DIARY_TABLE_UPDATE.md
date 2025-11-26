# Diary Card Table Update Plan

## Current Status
- Save functionality implemented ✅
- State management in place ✅
- Helper functions created ✅
- Table still has hardcoded mock data ❌

## Table Structure Needed

The table needs to dynamically render:
1. **For each behavior row:**
   - Show behavior label
   - For days 0-6 (SUN-SAT):
     - If repair day: Show "R3" in disabled red input
     - If normal day: Show editable number input with value from state
     - OnChange: Call updatePoints(behaviorKey, day, value)

2. **For total rows:**
   - Calculate sum using calculateShiftTotal()
   - Show in red for R3 days (0 points)
   - Show in blue for normal days

## Implementation Approach

Replace the hardcoded tbody with:

```tsx
<tbody>
  {/* Shift 1 */}
  <tr><td colSpan={8}>First Shift (7AM - 3PM)</td></tr>
  {shift1Behaviors.map(behavior => (
    <tr key={behavior.key}>
      <td>{behavior.label}</td>
      {[0,1,2,3,4,5,6].map(day => (
        <td key={day}>
          {repairDays.includes(day) ? (
            <input value="R3" disabled className="bg-error-lightest" />
          ) : (
            <input
              type="number"
              value={diaryPoints[behavior.key]?.[day] || 0}
              onChange={(e) => updatePoints(behavior.key, day, parseInt(e.target.value))}
            />
          )}
        </td>
      ))}
    </tr>
  ))}
  <tr>
    <td>Points Earned (Shift 1)</td>
    {[0,1,2,3,4,5,6].map(day => (
      <td key={day}>
        {calculateShiftTotal(shift1Behaviors.map(b => b.key), day)}
      </td>
    ))}
  </tr>
  {/* Repeat for Shift 2 and Shift 3 */}
</tbody>
```

## Next Steps
1. Create dynamic tbody replacement
2. Test with real data
3. Verify save/load cycle
4. Deploy

This is complex because we have 100+ input fields to wire up!
