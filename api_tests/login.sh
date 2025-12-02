#!/bin/bash

# Reusable Login Script for API Tests
# This script handles MFA authentication and exports the TOKEN variable
# Usage: source ./login.sh

# Load configuration if not already loaded
if [ -z "$API_BASE" ]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    source "$SCRIPT_DIR/config.sh"
fi

log_section "Authentication"

EMAIL="${EMAIL:-$DEFAULT_EMAIL}"

# Step 1: Send MFA code
log_info "Sending MFA code to: $EMAIL"
MFA_RESPONSE=$(curl -s -X POST "$API_BASE/auth/mfa/send" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}")

if echo "$MFA_RESPONSE" | grep -q "error\|Error\|502\|500\|404"; then
    log_error "Failed to send MFA code"
    echo "$MFA_RESPONSE"
    return 1
fi

log_success "MFA code sent to $EMAIL"
echo ""

# Step 2: Prompt for MFA code
read -p "Enter the MFA code from your email: " MFA_CODE
echo ""

# Step 3: Verify MFA and get token
log_info "Verifying MFA code..."
AUTH_RESPONSE=$(curl -s -X POST "$API_BASE/auth/mfa/verify" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"code\": \"$MFA_CODE\"}")

export TOKEN=$(echo "$AUTH_RESPONSE" | jq -r '.accessToken // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    log_error "Failed to get authentication token"
    echo "Response was:"
    echo "$AUTH_RESPONSE" | jq '.'
    return 1
fi

log_success "Authentication successful!"
log_info "Token obtained and exported as \$TOKEN"
echo ""

return 0
