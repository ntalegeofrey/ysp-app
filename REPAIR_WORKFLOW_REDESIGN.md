# Repair Workflow Redesign - Implementation Plan

## Overview
Redesigning the repair review workflow and diary card auto-population system.

## Changes Required

### 1. Remove Separate Review Page
**Files to modify:**
- `/frontend/src/app/dashboard/repairs/review/[id]/page.tsx` - DELETE or archive
- Update any navigation/routing that points to this page

### 2. Remove Approval Sections from Assign Repair Page
**File:** `/frontend/src/app/dashboard/repairs/assign/page.tsx`

**Remove:**
- Program Director approval section
- Clinical approval section  
- Assistant Director approval section
- Any approval-related state and handlers

**Keep:**
- Basic repair assignment form
- Repair level selection
- Duration settings
- Comments

### 3. Add Review Button with Role-Based Permissions
**File:** `/frontend/src/app/dashboard/repairs/page.tsx`

**Add:**
- "Review" button in repairs table/list
- Permission check for allowed roles:
  - Administrator
  - Admin  
  - Clinical
  - Program Administrator
  - Assistant Program Administrator
- Button should appear for each repair row

### 4. Create Review Modal Component
**New File:** `/frontend/src/app/components/ReviewRepairModal.tsx`

**Features:**
- Modal popup following design theme
- Two action buttons:
  - **Revoke Repair**: Removes resident from repair, updates status to "revoked"
  - **Affirm Repair**: Keeps repair active, updates status to "affirmed" or keeps as "approved"
- Review comments/notes field
- Confirmation before action
- Toast notifications for success/error

### 5. Auto-Populate Diary Card with R Codes
**File:** `/frontend/src/app/dashboard/repairs/award/page.tsx`

**Logic for auto-population:**

```typescript
// R1 (Repair 1) - Shift-specific
- Duration: 1 shift only
- Auto-populate: Only the specific shift cell where infraction occurred
- Example: If R1 on Shift 1, only Shift 1 cells get R1

// R2 (Repair 2) - Full day
- Duration: 1 full day (all 3 shifts)
- Auto-populate: All shift cells for that day
- Example: If R2 on Monday, all Monday shifts (1, 2, 3) get R2

// R3 (Repair 3) - Multi-day
- Duration: 3 consecutive days (all shifts)
- Auto-populate: All shifts for 3 days starting from repair start date
- Example: If R3 starts Monday, Mon/Tue/Wed all shifts get R3
```

**Implementation:**
1. Fetch active repairs for selected resident
2. For each day/shift cell, check if there's an active repair covering that period
3. If yes, auto-populate with R1/R2/R3
4. Set these cells as `disabled={true}` (locked, cannot edit)
5. Apply special styling (red/yellow/blue backgrounds)

**Cell locking logic:**
```typescript
const isAutoPopulatedRepair = (day: number, shift: number, repairs: any[]) => {
  const repairForDay = getRepairForDay(day, repairs);
  if (!repairForDay) return false;
  
  const repairLevel = repairForDay.repairLevel;
  const infractionShift = repairForDay.infractionShift;
  
  // R3 locks all shifts for 3 days
  if (repairLevel === 'Repair 3') return true;
  
  // R2 locks all shifts for that day
  if (repairLevel === 'Repair 2') return true;
  
  // R1 locks only the specific shift
  if (repairLevel === 'Repair 1' && shift === infractionShift) return true;
  
  return false;
};
```

**Update renderTableCell:**
- Check `isAutoPopulatedRepair()` before allowing edits
- If true, set `disabled={true}` and add visual indicator
- Show tooltip: "Locked - Resident on repair"

### 6. Backend API Updates

**New Endpoint:** `POST /programs/{programId}/repairs/interventions/{id}/review`

**Request body:**
```json
{
  "action": "revoke" | "affirm",
  "reviewedBy": "user email",
  "reviewComments": "string",
  "reviewDate": "ISO date"
}
```

**Actions:**
- **Revoke**: Set status to "revoked", set repairEndDate to now
- **Affirm**: Set status to "affirmed" or keep as "approved"

**File:** `/backend/src/main/java/app/ysp/controller/RepairInterventionController.java`
```java
@PostMapping("/interventions/{id}/review")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ADMINISTRATOR', 'ROLE_CLINICAL', 'ROLE_PROGRAM_DIRECTOR', 'ROLE_ASSISTANT_PROGRAM_DIRECTOR')")
public ResponseEntity<?> reviewRepair(
        @PathVariable Long programId,
        @PathVariable Long id,
        @RequestBody RepairReviewRequest request,
        Authentication auth) {
    // Implementation
}
```

**Service method:** `RepairInterventionService.reviewRepair()`

### 7. Database Schema
**Table:** `repair_interventions`

**Add columns if not exist:**
- `reviewed_by` (VARCHAR)
- `reviewed_at` (TIMESTAMP)
- `review_comments` (TEXT)
- `review_action` (VARCHAR) - "revoked" or "affirmed"

### 8. Permissions Matrix
| Role | Can Assign | Can Review | Can Revoke | Can Affirm |
|------|-----------|-----------|-----------|-----------|
| Administrator | ✓ | ✓ | ✓ | ✓ |
| Admin | ✓ | ✓ | ✓ | ✓ |
| Clinical | ✓ | ✓ | ✓ | ✓ |
| Program Administrator | ✓ | ✓ | ✓ | ✓ |
| Assistant Program Administrator | ✓ | ✓ | ✓ | ✓ |
| Staff | ✓ | ✗ | ✗ | ✗ |

### 9. Testing Checklist
- [ ] Repair assignment works without approval sections
- [ ] Review button shows only for authorized roles
- [ ] Review modal opens and displays correctly
- [ ] Revoke action removes resident from repair
- [ ] Affirm action keeps repair active
- [ ] Diary card auto-populates R1 correctly (1 shift)
- [ ] Diary card auto-populates R2 correctly (all shifts, 1 day)
- [ ] Diary card auto-populates R3 correctly (all shifts, 3 days)
- [ ] Auto-populated cells are locked and cannot be edited
- [ ] Locked cells have visual indicator (background color, tooltip)
- [ ] Revoked repairs no longer lock diary card cells
- [ ] System updates state correctly across all components

### 10. Migration Path
1. Deploy backend changes first (new endpoint, permissions)
2. Test backend with API calls
3. Deploy frontend changes
4. Test end-to-end workflow
5. Archive/remove old review page
6. Update documentation

## Status
**Current Implementation:** 0% complete
**Next Step:** Start with diary card auto-population and cell locking (most critical feature)
**Priority:** High - affects daily operations
