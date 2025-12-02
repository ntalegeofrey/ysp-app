# API Test Scripts

This folder contains automated test scripts for all YSP API endpoints.

## Prerequisites

- `curl` - for making HTTP requests
- `jq` - for JSON parsing (install with: `brew install jq`)

## File Structure

```
api_tests/
├── README.md              # This file
├── config.sh              # Shared configuration (API URL, colors, helpers)
├── login.sh               # Reusable authentication script
├── test_template.sh       # Template for creating new test scripts
└── test_watch_module.sh   # Watch module tests
```

## Configuration

Edit `config.sh` to set your API base URL and default credentials.

## Available Tests

### Watch Module
- `test_watch_module.sh` - Complete tests for Sleep Log & Watch APIs
  - Creates watch assignments
  - Tests log entries
  - Verifies statistics
  - Tests archiving

## Usage

### Running Tests

```bash
# Run watch module tests
cd api_tests
./test_watch_module.sh

# Run with custom email
EMAIL=your@email.com ./test_watch_module.sh

# Run with custom program
PROGRAM_ID=2 ./test_watch_module.sh
```

### Creating New Test Scripts

1. Copy the template:
```bash
cp test_template.sh test_your_module.sh
chmod +x test_your_module.sh
```

2. Edit the file and replace:
   - Module name
   - Test endpoints
   - Test cases

3. The authentication is handled automatically via `login.sh`

## How It Works

### Authentication Flow

All test scripts use the reusable `login.sh` script:

1. **login.sh** sends MFA code to your email
2. You enter the code when prompted
3. The script verifies and exports `$TOKEN`
4. All subsequent API calls use this token

### Test Script Pattern

```bash
#!/bin/bash
source "$SCRIPT_DIR/config.sh"  # Load config
source "$SCRIPT_DIR/login.sh"    # Authenticate (exports $TOKEN)

# Now make API calls with $TOKEN
curl -H "Authorization: Bearer $TOKEN" ...
```

## Test Results

- ✓ Green checkmarks = test passed
- ✗ Red X marks = test failed
- ℹ Blue info = informational messages
- ⚠ Yellow warnings = warnings

All test results are reproducible and output in JSON format for easy verification.

## Adding New Modules

When adding a new API module:

1. Create `test_your_module.sh` from template
2. Add your test cases
3. Run and verify all tests pass
4. Update this README with the new test module

The reusable login ensures consistency across all test scripts!
