# Staff API Implementation Summary

## ✅ What Was Created (Non-Breaking Changes)

### 1. New DTO
**File:** `backend/src/main/java/app/ysp/dto/StaffMemberResponse.java`

**Purpose:** Merged response combining User + ProgramAssignment data

**Fields:**
- `userId` (Long) - User entity ID (1, 2, 3...)
- `employeeNumber` (String) - 6-digit state employee identifier ("100045")
- `email` (String)
- `fullName`, `firstName`, `lastName`
- `jobTitle`, `jobTitleAbbrev`
- `displayName` - Formatted as "John Doe (JJYDS-I)"
- `systemRole` - ADMIN, STAFF, etc.
- `programRole` - REGIONAL_ADMIN, PROGRAM_DIRECTOR, STAFF, etc.
- `category` - Direct Care, Clinical, etc.
- `status` - active/not_active
- `isEnabled` - Boolean

### 2. New Service
**File:** `backend/src/main/java/app/ysp/service/StaffService.java`

**Methods:**
- `getProgramStaff(Long programId)` - Gets all staff for a program
- `getStaffByUserId(Long userId)` - Lookup by user ID
- `getStaffByEmployeeNumber(String empNum)` - Lookup by 6-digit employee number
- `getStaffByEmail(String email)` - Lookup by email

**Features:**
- Joins User + ProgramAssignment data
- Deduplicates by userId
- Formats display names with job title abbreviations
- Sorts by full name
- User data is authoritative (no duplicates)

### 3. New Controller
**File:** `backend/src/main/java/app/ysp/controller/StaffController.java`

**Endpoints:**

#### GET /api/programs/{programId}/staff
**Authorization:** `@PreAuthorize("isAuthenticated()")`
**Returns:** List of merged staff data for the program
**Example:** `/api/programs/1/staff`

#### GET /api/regions/{regionName}/staff
**Authorization:** `@PreAuthorize("isAuthenticated()")`
**Returns:** List of all staff assigned to programs in this region
**Region names:** Central, Metro, Northeast, Southeast, Western
**Example:** `/api/regions/Central/staff`

#### GET /api/staff
**Authorization:** `@PreAuthorize("isAuthenticated()")`
**Returns:** List of all staff in the system
**Query params:**
  - `activeOnly=true` - Filter to only enabled users
**Examples:** 
  - `/api/staff` (all staff)
  - `/api/staff?activeOnly=true` (active only)

#### GET /api/staff/{userId}
**Authorization:** `@PreAuthorize("isAuthenticated()")`
**Returns:** Single staff member by user ID
**Example:** `/api/staff/123`

#### GET /api/staff/employee/{employeeNumber}
**Authorization:** `@PreAuthorize("isAuthenticated()")`
**Returns:** Single staff member by 6-digit employee number
**Example:** `/api/staff/employee/100045`

#### GET /api/staff/email/{email}
**Authorization:** `@PreAuthorize("isAuthenticated()")`
**Returns:** Single staff member by email address
**Example:** `/api/staff/email/john@example.com`

### 4. Enhanced Repository
**File:** `backend/src/main/java/app/ysp/repo/UserRepository.java`

**Added Method:**
- `Optional<User> findByEmployeeNumber(String employeeNumber)`

---

## 📊 Data Structure Clarification

### Entity ID vs Employee Number
- **User.id** = Auto-increment primary key (1, 2, 3...)
- **User.employeeNumber** = 6-digit state employee identifier ("100045", "100046"...)
- **ProgramAssignment.id** = Auto-increment primary key (1, 2, 3...)
- **ProgramAssignment.employeeId** = Duplicate of User.employeeNumber (for legacy reasons)

**Note:** The service uses User data as authoritative to avoid duplication issues.

---

## 🔒 Security

All new endpoints require authentication: `@PreAuthorize("isAuthenticated()")`

Anyone logged in can view staff data, which is appropriate since:
- Staff dropdowns are needed across all modules
- No sensitive data is exposed
- Existing `/api/programs/{id}/assignments` also has no special restrictions

---

## 🚫 What Was NOT Changed (No Breaking Changes)

✅ Existing `User` entity - unchanged
✅ Existing `ProgramAssignment` entity - unchanged
✅ Existing database schema - no migrations
✅ Existing `/api/programs/{id}/assignments` endpoint - still works
✅ Existing `/api/users/search` endpoint - still works
✅ All other controllers and services - unaffected

---

## 🎯 Frontend Usage

### Simple Approach (Recommended)
```typescript
// Replace complex logic with single API call
const [programStaff, setProgramStaff] = useState([]);

useEffect(() => {
  fetch(`/api/programs/${programId}/staff`, {
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => setProgramStaff(data));
}, [programId]);

// Dropdown becomes trivial
<select>
  {programStaff.map(s => (
    <option key={s.userId} value={s.userId}>
      {s.displayName}
    </option>
  ))}
</select>
```

### Response Example
```json
[
  {
    "userId": 123,
    "employeeNumber": "100045",
    "email": "john@example.com",
    "fullName": "John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "jobTitle": "Juvenile Justice Youth Development Specialist I",
    "jobTitleAbbrev": "JJYDS-I",
    "displayName": "John Doe (JJYDS-I)",
    "systemRole": "STAFF",
    "programRole": "DIRECT_CARE",
    "category": "Direct Care",
    "status": "active",
    "isEnabled": true
  }
]
```

---

## 📋 Migration Plan

### Phase 1: Test New Endpoints (Current)
1. Build and deploy backend
2. Test endpoints with Postman/curl
3. Verify data merges correctly

### Phase 2: Update Frontend Modules (Gradual)
Update one module at a time:
1. Visitation module
2. Phone Logs
3. Logbook
4. Incidents
5. Repairs
6. Watch module

Each update:
- Remove complex staff fetching logic
- Replace with single `/api/programs/{id}/staff` call
- Update dropdowns to use merged data
- Test thoroughly

### Phase 3: Cleanup (Future)
After all modules migrated:
- Consider deprecating old staff fetching patterns
- Document new standard approach
- Update developer guidelines

---

## 🔍 Testing Commands

```bash
# ============================================
# PROGRAM-SCOPED: Get all staff for a program
# ============================================
curl -X GET http://localhost:8080/api/programs/1/staff \
  -H "Authorization: Bearer YOUR_TOKEN"

# ============================================
# REGION-SCOPED: Get all staff in a region
# ============================================
curl -X GET http://localhost:8080/api/regions/Central/staff \
  -H "Authorization: Bearer YOUR_TOKEN"

# Valid regions: Central, Metro, Northeast, Southeast, Western

# ============================================
# SYSTEM-WIDE: Get all staff in the system
# ============================================
# All staff
curl -X GET http://localhost:8080/api/staff \
  -H "Authorization: Bearer YOUR_TOKEN"

# Active staff only
curl -X GET "http://localhost:8080/api/staff?activeOnly=true" \
  -H "Authorization: Bearer YOUR_TOKEN"

# ============================================
# INDIVIDUAL LOOKUPS: Get single staff member
# ============================================
# By user ID
curl -X GET http://localhost:8080/api/staff/123 \
  -H "Authorization: Bearer YOUR_TOKEN"

# By employee number (6-digit)
curl -X GET http://localhost:8080/api/staff/employee/100045 \
  -H "Authorization: Bearer YOUR_TOKEN"

# By email
curl -X GET http://localhost:8080/api/staff/email/john@example.com \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✅ Verification Checklist

- [x] DTO created with all necessary fields
- [x] Service implements data merging logic
- [x] Controller endpoints with proper authorization
- [x] UserRepository enhanced with findByEmployeeNumber
- [x] Job title abbreviations implemented
- [x] No existing code broken
- [x] No database migrations required
- [x] Documentation created

**Status:** Ready for testing and deployment! 🚀
