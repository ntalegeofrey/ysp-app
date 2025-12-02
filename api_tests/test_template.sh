#!/bin/bash

# Template for New API Test Scripts
# Copy this file and customize for your module

# Load configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

# Test results tracking
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

log_section "YOUR MODULE NAME API Tests"

# Step 1: Authentication - Use reusable login script
source "$SCRIPT_DIR/login.sh"
if [ $? -ne 0 ]; then
    log_error "Authentication failed. Exiting."
    exit 1
fi

# Now you have $TOKEN available for all API calls
PROGRAM_ID="${PROGRAM_ID:-$DEFAULT_PROGRAM_ID}"

# Example Test 1
log_section "Test 1: Description of Test"
((TESTS_RUN++))

RESPONSE=$(curl -s -X GET "$API_BASE/your-endpoint" \
  -H "Authorization: Bearer $TOKEN")

if echo "$RESPONSE" | jq -e '.someField' > /dev/null 2>&1; then
    log_success "Test passed"
    echo "$RESPONSE" | jq '.'
    ((TESTS_PASSED++))
else
    log_error "Test failed"
    echo "$RESPONSE"
    ((TESTS_FAILED++))
fi

# Example Test 2 - POST request
log_section "Test 2: Create Something"
((TESTS_RUN++))

CREATE_RESPONSE=$(curl -s -X POST "$API_BASE/your-endpoint" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field1": "value1",
    "field2": "value2"
  }')

if echo "$CREATE_RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
    log_success "Successfully created resource"
    echo "$CREATE_RESPONSE" | jq '.'
    ((TESTS_PASSED++))
else
    log_error "Failed to create resource"
    echo "$CREATE_RESPONSE"
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
