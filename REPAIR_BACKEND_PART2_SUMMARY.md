# Repair Management Backend - Part 2 Implementation Summary

## Overview
This document contains all the remaining code needed for the Repair Management backend implementation. Review this before we commit and deploy.

## ✅ Completed So Far

### DTOs Updated:
1. ✅ `RepairInterventionRequest.java` - Added 4 new fields
2. ✅ `RepairInterventionResponse.java` - Added 8 new fields
3. ✅ `PointsDiaryCardRequest.java` - Created

### Still To Create:

#### Additional DTOs Needed:
1. **PointsDiaryCardResponse.java**
2. **PointsRedemptionRequest.java**
3. **PointsRedemptionResponse.java**
4. **RepairReviewRequest.java** (for PD/Clinical reviews)
5. **RepairSummaryResponse.java** (for dashboard stats)

#### Services Needed:
1. **RepairInterventionService.java** - Full CRUD + reviews
2. **PointsManagementService.java** - Diary cards + points calculations
3. **PointsRedemptionService.java** - Redemption workflow

#### Controller Needed:
1. **RepairManagementController.java** - All REST endpoints

---

## Proposed Implementation Approach

### Option 1: Complete Everything Now (45-60 min)
- Create all remaining DTOs
- Create all 3 services with full business logic
- Create controller with all endpoints
- Commit, deploy, test everything at once

### Option 2: Incremental Approach (Recommended)
**Phase A (Now - 20 min):**
- Create remaining DTOs
- Create RepairInterventionService (core CRUD only)
- Create basic controller with GET/POST endpoints
- Commit & deploy for testing

**Phase B (Next session):**
- Add PointsManagementService
- Add PointsRedemptionService  
- Add review approval endpoints
- Full integration testing

---

## Key Business Logic Requirements

### RepairInterventionService Must Handle:
1. **Create Repair**
   - Validate resident exists
   - Set assigning staff from auth context
   - Calculate repair end date based on duration
   - Default status to "pending_review"
   - Default points_suspended to true

2. **Update Repair**
   - Only draft repairs can be fully edited
   - Approved repairs can only update status/end date

3. **PD Review Approval**
   - Check user has PD role
   - Update pd_review_status, comments, reviewer info
   - If both PD and Clinical approved → status = "approved"
   - Calculate and set repair dates

4. **Clinical Review Approval**
   - Check user has Clinical role
   - Update clinical_review_status, comments, reviewer info
   - If both approved → status = "approved"

5. **Get Repairs**
   - Filter by program, resident, status, repair level
   - Search by text
   - Include resident details in response

### PointsManagementService Must Handle:
1. **Get/Create Diary Card**
   - Auto-create for current week if not exists
   - Initialize with previous week's balance
   - Handle week rollover logic

2. **Update Daily Points**
   - Validate date is within card's week
   - Update dailyPointsJson
   - Recalculate totals
   - Check for active repairs (R1/R2/R3)
   - If repair active that day → points = 0 or suspended

3. **Calculate Balance**
   - starting_points + total_earned - total_redeemed

### PointsRedemptionService Must Handle:
1. **Submit Redemption**
   - Validate resident has enough points
   - Create pending redemption record
   - Don't deduct points until approved

2. **Approve/Reject**
   - Check user has approval permission
   - If approved → deduct from diary card balance
   - If rejected → no point deduction

---

## Database Relationships Recap

```
repair_interventions
├─→ programs (program_id)
└─→ program_residents (resident_id)

points_diary_cards
├─→ programs (program_id)
└─→ program_residents (resident_id)

points_redemptions
├─→ programs (program_id)
├─→ program_residents (resident_id)
└─→ points_diary_cards (diary_card_id, optional)
```

---

## API Endpoint Structure

### Repair Interventions
```
GET    /api/programs/{programId}/repairs
POST   /api/programs/{programId}/repairs
GET    /api/programs/{programId}/repairs/{id}
PUT    /api/programs/{programId}/repairs/{id}
DELETE /api/programs/{programId}/repairs/{id}
POST   /api/programs/{programId}/repairs/{id}/review/pd
POST   /api/programs/{programId}/repairs/{id}/review/clinical
GET    /api/programs/{programId}/repairs/resident/{residentId}
GET    /api/programs/{programId}/repairs/stats
```

### Points Management
```
GET    /api/programs/{programId}/points/resident/{residentId}
GET    /api/programs/{programId}/points/resident/{residentId}/current
POST   /api/programs/{programId}/points/resident/{residentId}
PUT    /api/programs/{programId}/points/cards/{cardId}
```

### Redemptions
```
POST   /api/programs/{programId}/redemptions
GET    /api/programs/{programId}/redemptions
GET    /api/programs/{programId}/redemptions/resident/{residentId}
POST   /api/programs/{programId}/redemptions/{id}/approve
POST   /api/programs/{programId}/redemptions/{id}/reject
```

---

## Next Decision Point

**Question for you:** Should I:

**A)** Create everything now (all DTOs, services, controller) and we review/deploy together? 

**B)** Do Phase A (basic CRUD) now, test it, then add advanced features next?

**C)** You'd prefer to review what's built so far and decide the next steps?

Let me know your preference and I'll proceed accordingly!

---

**Current Status:** 
- ✅ Database schema migrated
- ✅ Entities created
- ✅ Repositories created  
- ✅ 3/8 DTOs done
- ⏳ Services pending
- ⏳ Controller pending
