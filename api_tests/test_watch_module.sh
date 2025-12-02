#!/bin/bash

# Sleep Log & Watch API Test Script
# Tests all endpoints for the Watch module

# Load configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

# Test results tracking
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

log_section "Sleep Log & Watch API Tests"

# Step 1: Authentication - Use reusable login script
source "$SCRIPT_DIR/login.sh"
if [ $? -ne 0 ]; then
    log_error "Authentication failed. Exiting."
    exit 1
fi

PROGRAM_ID="${PROGRAM_ID:-$DEFAULT_PROGRAM_ID}"

# Step 2: Get Watch Statistics
log_section "Test 1: Get Watch Statistics"
((TESTS_RUN++))

STATS_RESPONSE=$(curl -s -X GET "$API_BASE/programs/$PROGRAM_ID/watches/statistics" \
  -H "Authorization: Bearer $TOKEN")

if echo "$STATS_RESPONSE" | jq -e '.totalActive' > /dev/null 2>&1; then
    log_success "Successfully retrieved watch statistics"
    echo "$STATS_RESPONSE" | jq '.'
    ((TESTS_PASSED++))
else
    log_error "Failed to get watch statistics"
    echo "$STATS_RESPONSE"
    ((TESTS_FAILED++))
fi

# Step 3: Get Active Watches
log_section "Test 2: Get All Active Watches"
((TESTS_RUN++))

ACTIVE_WATCHES=$(curl -s -X GET "$API_BASE/programs/$PROGRAM_ID/watches/active" \
  -H "Authorization: Bearer $TOKEN")

if echo "$ACTIVE_WATCHES" | jq -e '. | type == "array"' > /dev/null 2>&1; then
    WATCH_COUNT=$(echo "$ACTIVE_WATCHES" | jq 'length')
    log_success "Successfully retrieved $WATCH_COUNT active watches"
    echo "$ACTIVE_WATCHES" | jq '.'
    ((TESTS_PASSED++))
else
    log_error "Failed to get active watches"
    echo "$ACTIVE_WATCHES"
    ((TESTS_FAILED++))
fi

# Step 4: Get All Residents (to find a valid resident ID)
log_section "Test 3: Get Residents for Watch Assignment"
log_info "Fetching available residents..."

RESIDENTS_RESPONSE=$(curl -s -X GET "$API_BASE/programs/$PROGRAM_ID/residents" \
  -H "Authorization: Bearer $TOKEN")

RESIDENT_COUNT=$(echo "$RESIDENTS_RESPONSE" | jq 'length // 0')

if [ "$RESIDENT_COUNT" -gt 0 ]; then
    log_success "Found $RESIDENT_COUNT residents"
    echo "$RESIDENTS_RESPONSE" | jq '[.[] | {id, firstName, lastName, residentId, room}] | .[0:3]'
    
    # Get first resident without active watch
    AVAILABLE_RESIDENT_ID=$(echo "$RESIDENTS_RESPONSE" | jq -r '.[0].id')
    RESIDENT_NAME=$(echo "$RESIDENTS_RESPONSE" | jq -r '.[0].firstName + " " + .[0].lastName')
    
    log_info "Selected resident: $RESIDENT_NAME (ID: $AVAILABLE_RESIDENT_ID)"
else
    log_warning "No residents found in program. Skipping watch creation tests."
    AVAILABLE_RESIDENT_ID=""
fi

# Step 5: Create a Watch
if [ -n "$AVAILABLE_RESIDENT_ID" ]; then
    log_section "Test 4: Create New Watch Assignment"
    ((TESTS_RUN++))
    
    CREATE_WATCH=$(curl -s -X POST "$API_BASE/programs/$PROGRAM_ID/watches" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"residentId\": $AVAILABLE_RESIDENT_ID,
        \"watchType\": \"ALERT\",
        \"clinicalReason\": \"API Test: Monitoring sleep patterns and general behavior\",
        \"selfHarmRisk\": false,
        \"suicidalIdeation\": false,
        \"aggressiveBehavior\": false,
        \"sleepDisturbance\": true,
        \"medicalConcern\": false
      }")
    
    WATCH_ID=$(echo "$CREATE_WATCH" | jq -r '.id // empty')
    
    if [ -n "$WATCH_ID" ] && [ "$WATCH_ID" != "null" ]; then
        log_success "Successfully created watch with ID: $WATCH_ID"
        echo "$CREATE_WATCH" | jq '.'
        ((TESTS_PASSED++))
        
        # Step 6: Create Log Entry
        log_section "Test 5: Create Log Entry"
        ((TESTS_RUN++))
        
        sleep 1  # Brief pause
        
        CREATE_LOG=$(curl -s -X POST "$API_BASE/programs/$PROGRAM_ID/watches/$WATCH_ID/log-entries" \
          -H "Authorization: Bearer $TOKEN" \
          -H "Content-Type: application/json" \
          -d "{
            \"observationStatus\": \"NORMAL\",
            \"activity\": \"SLEEPING\",
            \"notes\": \"API Test: Resident sleeping peacefully, regular breathing observed. No concerns noted.\"
          }")
        
        LOG_ENTRY_ID=$(echo "$CREATE_LOG" | jq -r '.id // empty')
        
        if [ -n "$LOG_ENTRY_ID" ] && [ "$LOG_ENTRY_ID" != "null" ]; then
            log_success "Successfully created log entry with ID: $LOG_ENTRY_ID"
            echo "$CREATE_LOG" | jq '.'
            ((TESTS_PASSED++))
        else
            log_error "Failed to create log entry"
            echo "$CREATE_LOG"
            ((TESTS_FAILED++))
        fi
        
        # Step 7: Get Log Entries
        log_section "Test 6: Get All Log Entries"
        ((TESTS_RUN++))
        
        LOG_ENTRIES=$(curl -s -X GET "$API_BASE/programs/$PROGRAM_ID/watches/$WATCH_ID/log-entries" \
          -H "Authorization: Bearer $TOKEN")
        
        if echo "$LOG_ENTRIES" | jq -e '. | type == "array"' > /dev/null 2>&1; then
            ENTRY_COUNT=$(echo "$LOG_ENTRIES" | jq 'length')
            log_success "Successfully retrieved $ENTRY_COUNT log entries"
            echo "$LOG_ENTRIES" | jq '.'
            ((TESTS_PASSED++))
        else
            log_error "Failed to get log entries"
            echo "$LOG_ENTRIES"
            ((TESTS_FAILED++))
        fi
        
        # Step 8: Get Recent Log Entries
        log_section "Test 7: Get Recent Log Entries (Last 6 Hours)"
        ((TESTS_RUN++))
        
        RECENT_LOGS=$(curl -s -X GET "$API_BASE/programs/$PROGRAM_ID/watches/$WATCH_ID/log-entries/recent" \
          -H "Authorization: Bearer $TOKEN")
        
        if echo "$RECENT_LOGS" | jq -e '. | type == "array"' > /dev/null 2>&1; then
            log_success "Successfully retrieved recent log entries"
            echo "$RECENT_LOGS" | jq '.'
            ((TESTS_PASSED++))
        else
            log_error "Failed to get recent log entries"
            echo "$RECENT_LOGS"
            ((TESTS_FAILED++))
        fi
        
        # Step 9: Get Specific Watch
        log_section "Test 8: Get Watch Details"
        ((TESTS_RUN++))
        
        WATCH_DETAILS=$(curl -s -X GET "$API_BASE/programs/$PROGRAM_ID/watches/$WATCH_ID" \
          -H "Authorization: Bearer $TOKEN")
        
        if echo "$WATCH_DETAILS" | jq -e '.id' > /dev/null 2>&1; then
            log_success "Successfully retrieved watch details"
            echo "$WATCH_DETAILS" | jq '.'
            ((TESTS_PASSED++))
        else
            log_error "Failed to get watch details"
            echo "$WATCH_DETAILS"
            ((TESTS_FAILED++))
        fi
        
        # Step 10: Get Current Watch for Resident
        log_section "Test 9: Get Current Watch for Resident"
        ((TESTS_RUN++))
        
        CURRENT_WATCH=$(curl -s -X GET "$API_BASE/programs/$PROGRAM_ID/watches/resident/$AVAILABLE_RESIDENT_ID/current" \
          -H "Authorization: Bearer $TOKEN")
        
        if echo "$CURRENT_WATCH" | jq -e '.id' > /dev/null 2>&1; then
            log_success "Successfully retrieved current watch for resident"
            echo "$CURRENT_WATCH" | jq '{id, residentName, watchType, status}'
            ((TESTS_PASSED++))
        else
            log_error "Failed to get current watch for resident"
            echo "$CURRENT_WATCH"
            ((TESTS_FAILED++))
        fi
        
        # Step 11: End the Watch
        log_section "Test 10: End Watch Assignment"
        read -p "Do you want to end this test watch? (y/n): " END_CONFIRM
        
        if [ "$END_CONFIRM" = "y" ] || [ "$END_CONFIRM" = "Y" ]; then
            ((TESTS_RUN++))
            
            END_WATCH=$(curl -s -X POST "$API_BASE/programs/$PROGRAM_ID/watches/$WATCH_ID/end" \
              -H "Authorization: Bearer $TOKEN" \
              -H "Content-Type: application/json" \
              -d "{
                \"status\": \"COMPLETED\",
                \"outcome\": \"API Test completed successfully. All endpoints functioning as expected.\",
                \"endNotes\": \"Watch ended as part of automated testing. No actual clinical concerns.\"
              }")
            
            if echo "$END_WATCH" | jq -e '.status' | grep -q "COMPLETED"; then
                log_success "Successfully ended watch"
                echo "$END_WATCH" | jq '{id, status, outcome, endNotes}'
                ((TESTS_PASSED++))
            else
                log_error "Failed to end watch"
                echo "$END_WATCH"
                ((TESTS_FAILED++))
            fi
        else
            log_warning "Skipped ending watch - watch remains active"
        fi
        
        # Step 12: Get Watch History
        log_section "Test 11: Get Resident Watch History"
        ((TESTS_RUN++))
        
        WATCH_HISTORY=$(curl -s -X GET "$API_BASE/programs/$PROGRAM_ID/watches/resident/$AVAILABLE_RESIDENT_ID/history" \
          -H "Authorization: Bearer $TOKEN")
        
        if echo "$WATCH_HISTORY" | jq -e '. | type == "array"' > /dev/null 2>&1; then
            HISTORY_COUNT=$(echo "$WATCH_HISTORY" | jq 'length')
            log_success "Successfully retrieved watch history ($HISTORY_COUNT records)"
            echo "$WATCH_HISTORY" | jq '[.[] | {id, watchType, status, startDateTime, endDateTime}]'
            ((TESTS_PASSED++))
        else
            log_error "Failed to get watch history"
            echo "$WATCH_HISTORY"
            ((TESTS_FAILED++))
        fi
    else
        log_error "Failed to create watch"
        echo "$CREATE_WATCH"
        ((TESTS_FAILED++))
    fi
fi

# Step 13: Get Archived Watches
log_section "Test 12: Get Archived Watches"
((TESTS_RUN++))

ARCHIVED_WATCHES=$(curl -s -X GET "$API_BASE/programs/$PROGRAM_ID/watches/archive" \
  -H "Authorization: Bearer $TOKEN")

if echo "$ARCHIVED_WATCHES" | jq -e '. | type == "array"' > /dev/null 2>&1; then
    ARCHIVE_COUNT=$(echo "$ARCHIVED_WATCHES" | jq 'length')
    log_success "Successfully retrieved $ARCHIVE_COUNT archived watches"
    echo "$ARCHIVED_WATCHES" | jq '[.[] | {id, residentName, watchType, status, outcome, duration}] | .[0:3]'
    ((TESTS_PASSED++))
else
    log_error "Failed to get archived watches"
    echo "$ARCHIVED_WATCHES"
    ((TESTS_FAILED++))
fi

# Test Summary
log_section "Test Summary"
echo ""
echo "Tests Run:    $TESTS_RUN"
log_success "Tests Passed: $TESTS_PASSED"
if [ $TESTS_FAILED -gt 0 ]; then
    log_error "Tests Failed: $TESTS_FAILED"
else
    echo "Tests Failed: 0"
fi
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    log_success "All tests passed! ✓"
    exit 0
else
    log_error "Some tests failed!"
    exit 1
fi
