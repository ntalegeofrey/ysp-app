# Repair Management Backend Implementation Progress

## ✅ COMPLETED - Part 1: Database Schema, Entities & Repositories

### Database Migration (V33)
**File:** `V33__add_repair_points_and_diary_tables.sql`

#### Repair Interventions Table - Enhanced Fields:
- `repair_duration_days` - Number of days the repair lasts
- `repair_start_date` / `repair_end_date` - Date range tracking
- `points_suspended` - Boolean flag for point accrual suspension
- `pd_review_status` / `pd_review_comments` - Program Director review
- `clinical_review_status` / `clinical_review_comments` - Clinical review

#### Points Diary Cards Table:
- Weekly points tracking per resident
- `daily_points_json` - JSON storage of daily points by shift
- `starting_points`, `total_points_earned`, `current_balance`
- Unique constraint on (resident_id, week_start_date)

#### Points Redemptions Table:
- Track point redemptions for rewards
- `points_redeemed`, `reward_item`, `custom_item`
- Approval workflow with staff tracking
- Links to diary card for weekly context

### Entities Created:
1. **RepairIntervention** (Updated) - `/backend/src/main/java/app/ysp/entity/RepairIntervention.java`
   - Added all new fields with getters/setters
   - Full repair lifecycle tracking
   
2. **PointsDiaryCard** - `/backend/src/main/java/app/ysp/entity/PointsDiaryCard.java`
   - Weekly points diary card management
   - JSON storage for flexible daily tracking
   
3. **PointsRedemption** - `/backend/src/main/java/app/ysp/entity/PointsRedemption.java`
   - Points redemption with approval workflow
   - Custom and pre-defined reward support

### Repositories Created:
1. **RepairInterventionRepository**
   - Query methods for program, resident, status, repair level
   - Active repairs tracking
   - Pending reviews
   - Search functionality
   - Count aggregations

2. **PointsDiaryCardRepository**
   - Find by resident and week
   - Active diary cards
   - Date range queries
   - Most recent card lookup

3. **PointsRedemptionRepository**
   - Redemptions by resident, program, diary card
   - Approval status filtering
   - Points calculation aggregations
   - Pending redemptions tracking

---

## 🚧 TODO - Part 2: Services, DTOs & Controller

### Services to Create:
1. **RepairInterventionService**
   - Create/update/delete repairs
   - Review approvals (PD and Clinical)
   - Calculate repair durations
   - Track repair status lifecycle
   - Generate repair history reports

2. **PointsDiaryCardService**
   - Create/update diary cards
   - Calculate daily and weekly points
   - Handle repair days (R1/R2/R3 tracking)
   - Update balances
   - Carry forward points week-to-week

3. **PointsRedemptionService**
   - Submit redemption requests
   - Approve/reject redemptions
   - Update diary card balances
   - Validate point availability
   - Track redemption history

### DTOs to Create:
- RepairInterventionDTO
- RepairInterventionCreateDTO
- RepairReviewDTO
- PointsDiaryCardDTO
- PointsRedemptionDTO
- PointsRedemptionRequestDTO
- RepairHistoryDTO
- RepairSummaryDTO

### Controller to Create:
**RepairManagementController** (`/api/programs/{programId}/repairs`)

#### Repair Intervention Endpoints:
- `POST /repairs` - Create new repair
- `GET /repairs` - List all repairs (with filtering)
- `GET /repairs/{id}` - Get repair details
- `PUT /repairs/{id}` - Update repair
- `DELETE /repairs/{id}` - Delete repair
- `POST /repairs/{id}/review/pd` - PD review approval
- `POST /repairs/{id}/review/clinical` - Clinical review approval
- `GET /repairs/resident/{residentId}` - Get resident repair history

#### Points Management Endpoints:
- `GET /points/resident/{residentId}` - Get resident diary cards
- `GET /points/resident/{residentId}/current` - Get current week card
- `POST /points/resident/{residentId}` - Create/update diary card
- `PUT /points/cards/{cardId}` - Update daily points

#### Redemption Endpoints:
- `POST /redemptions` - Submit redemption request
- `GET /redemptions` - List redemptions (with filtering)
- `GET /redemptions/resident/{residentId}` - Resident redemption history
- `POST /redemptions/{id}/approve` - Approve redemption
- `POST /redemptions/{id}/reject` - Reject redemption

### Testing Requirements:
- Unit tests for services
- Integration tests for repositories
- API endpoint tests with authentication
- Test scenarios:
  - Create repair with reviews
  - Points accrual during repairs
  - Weekly point calculations
  - Redemption approval workflow
  - Repair history filtering

---

## 📊 Database Schema Summary

### Tables:
1. `repair_interventions` - Repair assignments and reviews
2. `points_diary_cards` - Weekly points tracking
3. `points_redemptions` - Points redemption requests

### Relationships:
- RepairIntervention → Program (ManyToOne)
- RepairIntervention → ProgramResident (ManyToOne)
- PointsDiaryCard → Program (ManyToOne)
- PointsDiaryCard → ProgramResident (ManyToOne)
- PointsRedemption → Program (ManyToOne)
- PointsRedemption → ProgramResident (ManyToOne)
- PointsRedemption → PointsDiaryCard (ManyToOne, optional)

### Indexes:
- Program ID indexes for all tables
- Resident ID indexes for filtering
- Date indexes for chronological queries
- Status indexes for workflow filtering

---

## 🎯 Next Steps:
1. Create Service classes with business logic
2. Create DTO classes for API responses
3. Create RepairManagementController with all endpoints
4. Add authentication/authorization checks
5. Write tests for all components
6. Wire frontend to new API endpoints
7. Deploy and test end-to-end

---

**Status:** Part 1 Complete ✅  
**Committed:** Yes  
**Deployed:** Not yet - needs services and controller first
