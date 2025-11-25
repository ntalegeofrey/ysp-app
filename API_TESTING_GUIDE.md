# Repair Management API Testing Guide

## Base URL
```
http://147.93.191.183/api
```

## Authentication
All endpoints require authentication. Include JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Repair Interventions API

### Get All Repairs for Program
```bash
GET /programs/{programId}/repairs/interventions
```

**Example:**
```bash
curl -X GET "http://147.93.191.183/api/programs/1/repairs/interventions" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Get Single Repair
```bash
GET /programs/{programId}/repairs/interventions/{id}
```

**Example:**
```bash
curl -X GET "http://147.93.191.183/api/programs/1/repairs/interventions/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Create Repair Intervention
```bash
POST /programs/{programId}/repairs/interventions
```

**Request Body:**
```json
{
  "residentId": 1,
  "infractionDate": "2025-11-25",
  "infractionShift": "1st Shift",
  "infractionBehavior": "Disrespectful behavior towards staff",
  "repairLevel": "Repair 2",
  "interventionsJson": "[\"Reflection\", \"Community Service\"]",
  "comments": "Resident showed remorse",
  "reviewDate": "2025-11-26",
  "repairDurationDays": 3,
  "repairStartDate": "2025-11-26",
  "repairEndDate": "2025-11-28",
  "pointsSuspended": true
}
```

**Example:**
```bash
curl -X POST "http://147.93.191.183/api/programs/1/repairs/interventions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "residentId": 1,
    "infractionDate": "2025-11-25",
    "infractionShift": "1st Shift",
    "infractionBehavior": "Disrespectful behavior",
    "repairLevel": "Repair 2",
    "interventionsJson": "[]",
    "comments": "Test repair",
    "pointsSuspended": true
  }'
```

---

### PD Approval
```bash
POST /programs/{programId}/repairs/interventions/{id}/approve-pd
```

**Request Body:**
```json
{
  "reviewStatus": "approved",
  "reviewComments": "Approved by Program Director"
}
```

**Example:**
```bash
curl -X POST "http://147.93.191.183/api/programs/1/repairs/interventions/1/approve-pd" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewStatus": "approved",
    "reviewComments": "Good behavior progress"
  }'
```

---

### Clinical Approval
```bash
POST /programs/{programId}/repairs/interventions/{id}/approve-clinical
```

**Request Body:**
```json
{
  "reviewStatus": "approved",
  "reviewComments": "Clinical review complete"
}
```

**Example:**
```bash
curl -X POST "http://147.93.191.183/api/programs/1/repairs/interventions/1/approve-clinical" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewStatus": "approved",
    "reviewComments": "Therapeutically appropriate"
  }'
```

---

## 2. Points Management API

### Get Resident's Diary Cards
```bash
GET /programs/{programId}/points/resident/{residentId}
```

**Example:**
```bash
curl -X GET "http://147.93.191.183/api/programs/1/points/resident/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Get Current Week Diary Card
```bash
GET /programs/{programId}/points/resident/{residentId}/current
```

**Example:**
```bash
curl -X GET "http://147.93.191.183/api/programs/1/points/resident/1/current" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Create/Update Diary Card
```bash
POST /programs/{programId}/points/resident/{residentId}
```

**Request Body:**
```json
{
  "weekStartDate": "2025-11-25",
  "weekEndDate": "2025-12-01",
  "startingPoints": 100,
  "dailyPointsJson": "{\"2025-11-25\":{\"shift1\":18,\"shift2\":6,\"shift3\":8,\"total\":32,\"repair\":\"R3\"}}"
}
```

**Example:**
```bash
curl -X POST "http://147.93.191.183/api/programs/1/points/resident/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "weekStartDate": "2025-11-25",
    "weekEndDate": "2025-12-01",
    "startingPoints": 100,
    "dailyPointsJson": "{}"
  }'
```

---

### Update Daily Points
```bash
PUT /programs/{programId}/points/cards/{cardId}
```

**Request Body:**
```json
{
  "dailyPointsJson": "{\"2025-11-25\":{\"shift1\":18,\"shift2\":6,\"shift3\":8,\"total\":32},\"2025-11-26\":{\"shift1\":16,\"shift2\":8,\"shift3\":7,\"total\":31}}"
}
```

**Example:**
```bash
curl -X PUT "http://147.93.191.183/api/programs/1/points/cards/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dailyPointsJson": "{\"2025-11-25\":{\"total\":32}}"
  }'
```

---

## 3. Points Redemptions API

### Get All Redemptions for Program
```bash
GET /programs/{programId}/redemptions
```

**Example:**
```bash
curl -X GET "http://147.93.191.183/api/programs/1/redemptions" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Get Pending Redemptions
```bash
GET /programs/{programId}/redemptions/pending
```

**Example:**
```bash
curl -X GET "http://147.93.191.183/api/programs/1/redemptions/pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Get Resident's Redemptions
```bash
GET /programs/{programId}/redemptions/resident/{residentId}
```

**Example:**
```bash
curl -X GET "http://147.93.191.183/api/programs/1/redemptions/resident/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Submit Redemption
```bash
POST /programs/{programId}/redemptions
```

**Request Body:**
```json
{
  "residentId": 1,
  "redemptionDate": "2025-11-25",
  "pointsRedeemed": 50,
  "rewardItem": "Extra Recreation Time",
  "customItem": false
}
```

**Example:**
```bash
curl -X POST "http://147.93.191.183/api/programs/1/redemptions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "residentId": 1,
    "redemptionDate": "2025-11-25",
    "pointsRedeemed": 50,
    "rewardItem": "Extra Recreation Time",
    "customItem": false
  }'
```

---

### Approve Redemption
```bash
POST /programs/{programId}/redemptions/{redemptionId}/approve
```

**Request Body:**
```json
{
  "comments": "Approved by staff"
}
```

**Example:**
```bash
curl -X POST "http://147.93.191.183/api/programs/1/redemptions/1/approve" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "Approved"
  }'
```

---

### Reject Redemption
```bash
POST /programs/{programId}/redemptions/{redemptionId}/reject
```

**Request Body:**
```json
{
  "comments": "Insufficient balance"
}
```

**Example:**
```bash
curl -X POST "http://147.93.191.183/api/programs/1/redemptions/1/reject" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "Rejected due to behavior"
  }'
```

---

## Testing Workflow

### 1. **Create a Repair**
```bash
POST /programs/1/repairs/interventions
```

### 2. **Get the Repair to verify**
```bash
GET /programs/1/repairs/interventions/{id}
```

### 3. **PD Approves**
```bash
POST /programs/1/repairs/interventions/{id}/approve-pd
```

### 4. **Clinical Approves**
```bash
POST /programs/1/repairs/interventions/{id}/approve-clinical
```

### 5. **Create Diary Card**
```bash
POST /programs/1/points/resident/1
```

### 6. **Update Daily Points**
```bash
PUT /programs/1/points/cards/{cardId}
```

### 7. **Submit Redemption**
```bash
POST /programs/1/redemptions
```

### 8. **Approve Redemption**
```bash
POST /programs/1/redemptions/{id}/approve
```

---

## Expected Responses

### Success Response (200/201):
```json
{
  "id": 1,
  "programId": 1,
  "residentId": 1,
  "residentName": "John Doe",
  "status": "pending_review",
  "createdAt": "2025-11-25T12:00:00Z",
  ...
}
```

### Error Response (400):
```json
"Program not found"
```

or

```json
"Insufficient points. Available: 50, Requested: 100"
```

---

## Quick Test Commands

Get your auth token first, then test each endpoint!
