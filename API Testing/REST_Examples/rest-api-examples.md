# REST API Examples - Comprehensive Guide

## Overview

This folder contains production-ready REST API examples for Salesforce Marketing Cloud Engagement (SFMCE). Examples are organized by feature area with clear explanations and best practices.

---

## File Organization

### `.http` Files (Primary Format)

**Why `.http` format?**
- ✅ GitHub displays with syntax highlighting
- ✅ Works in VS Code REST Client extension
- ✅ Compatible with Postman, Insomnia, Thunder Client
- ✅ Copy-paste ready for your tools
- ✅ Human-readable and version-control friendly

**Files:**
1. **data-extensions.http** - CRUD operations on Data Extensions
2. **automation.http** - Automation Studio control and execution
3. **journey-builder.http** - Journey Builder event firing

### How to Use `.http` Files

#### Option 1: VS Code REST Client (Recommended)

1. Install extension: "REST Client" by Huachao Guo
2. Open any `.http` file
3. Click "Send Request" link above any request
4. Response appears in sidebar with syntax highlighting
5. Supports request/response history and environment variables

**VS Code Setup:**
```json
// .vscode/settings.json
{
  "rest-client.environment": {
    "dev": {
      "base_url": "https://xxxxx.rest.marketingcloudapis.com",
      "access_token": "[your_token_here]",
      "eventDefinitionKey": "APIEvent-xxx-xxx"
    }
  }
}
```

#### Option 2: Postman Import

1. Open `.http` file in text editor
2. Copy entire request (method, URL, headers, body)
3. In Postman: New Request
4. Paste URL in address bar
5. Set method (GET, POST, etc.)
6. Add headers
7. Paste body as raw JSON
8. Replace variables with actual values

#### Option 3: Insomnia

1. Create new request in Insomnia
2. Copy HTTP request line: `GET {{base_url}}/...`
3. Insomnia recognizes format automatically
4. Add environment variables
5. Send request

---

## API Examples by Category

### 1. Data Extensions (`data-extensions.http`)

Data Extensions are custom databases for storing subscriber data.

**Operations:**
- **GET** - Retrieve rows (all, filtered, single)
- **POST** - Create new rows (single or batch)
- **PATCH** - Update existing rows or upsert
- **DELETE** - Remove rows

**Example Use Cases:**
```
GET Data Extension Data
→ Retrieve all subscribers for reporting

POST Single Row
→ Add new subscriber from form submission

PATCH Update Row
→ Update status when email bounces

DELETE Row
→ Remove unsubscribed contact
```

**Important Notes:**
- Keys identify unique records (typically Email)
- Batch operations are more efficient than individual requests
- Upsert (`?_upsert=true`) updates if exists, creates if not
- Page size limited to 3000 rows per request

---

### 2. Automation Studio (`automation.http`)

Automations are scheduled or triggered workflows for email sends, data processing, etc.

**Operations:**
- **GET** - Retrieve automation details and run history
- **POST** - Fire/trigger automation immediately
- **PATCH** - Pause, resume, or modify automation

**Example Use Cases:**
```
GET All Automations
→ List all automations, filter by name

POST Fire Automation (All Steps)
→ Trigger entire automation workflow immediately

POST Fire Automation (Custom Steps)
→ Run only specific activities in workflow

PATCH Pause Automation
→ Stop automation (can resume later)
```

**Important Notes:**
- Fire automation executes workflow immediately
- "All Steps" triggers entire workflow
- "Custom Steps" runs only selected activities
- Pause/Resume maintains automation schedule
- Async operations return immediately, process in background

---

### 3. Journey Builder (`journey-builder.http`)

Journeys are customer interaction workflows with multiple touchpoints.

**Operations:**
- **POST** - Send event to trigger journey entry
- **GET** - Check event history/status

**Example Use Cases:**
```
POST Single Event
→ Send one subscriber's data to trigger journey

POST Async Batch Events
→ Send bulk subscriber data (efficient, 202 response)

POST With Nested Data
→ Send complex structured data (objects, arrays)
```

**Important Notes:**
- Single events: Synchronous, immediate response (200)
- Batch events: Asynchronous, queued processing (202)
- Batch recommended for 100+ contacts
- ContactKey typically subscriber's email or unique ID
- Data must match Journey's expected fields

---

## Key Concepts

### Environment Variables

Use `{{variable}}` syntax for dynamic values:

```
{{base_url}}              - https://xxxxx.rest.marketingcloudapis.com
{{access_token}}          - OAuth 2.0 Bearer token
{{dataExtensionKey}}      - Key of Data Extension
{{automationId}}          - UUID of Automation
{{eventDefinitionKey}}    - Key of Journey Event
{{email}}                 - Subscriber email
```

### Authorization

All requests require OAuth 2.0 Bearer token:

```
Authorization: Bearer {{access_token}}
```

See main [../README.md](../README.md) for token setup and refresh.

### Content Type

All examples use JSON:

```
Content-Type: application/json
```

Some SFMC APIs support XML, but JSON is preferred.

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Synchronous operation completed |
| 201 | Created | Row created successfully |
| 202 | Accepted | Async batch queued for processing |
| 400 | Bad Request | Invalid data or missing required field |
| 401 | Unauthorized | Token missing or expired |
| 404 | Not Found | Data Extension or Automation doesn't exist |
| 429 | Rate Limited | Too many requests, retry after delay |
| 500 | Server Error | SFMC API error, check documentation |

---

## Common Patterns

### Single vs Batch Operations

**Single Request:**
```http
POST {{base_url}}/hub/v1/dataevents/key:{{dataExtensionKey}}/rowset
[
  {
    "keys": { "Email": "user1@example.com" },
    "values": { "Name": "John" }
  }
]
```

**Batch Request:**
```http
POST {{base_url}}/hub/v1/dataevents/key:{{dataExtensionKey}}/rowset
[
  { "keys": { "Email": "user1@example.com" }, "values": { "Name": "John" } },
  { "keys": { "Email": "user2@example.com" }, "values": { "Name": "Jane" } },
  { "keys": { "Email": "user3@example.com" }, "values": { "Name": "Bob" } }
]
```

**Efficiency:** Batch requests are 5-10x faster.

### Sync vs Async

**Synchronous (Immediate Response):**
```http
POST {{base_url}}/interaction/v1/events
// Returns 200 OK immediately
// Single contact only
```

**Asynchronous (Queued):**
```http
POST {{base_url}}/interaction/v1/async/events
// Returns 202 Accepted immediately
// Batch processes in background
// Better for 100+ records
```

### Create vs Upsert

**Create Only (Error if Exists):**
```http
POST {{base_url}}/hub/v1/dataevents/key:{{dataExtensionKey}}/rowset
```

**Upsert (Create or Update):**
```http
PATCH {{base_url}}/hub/v1/dataevents/key:{{dataExtensionKey}}/rowset?_upsert=true
```

---

## Best Practices

### 1. Use Environment Variables
- Never hardcode sensitive data
- Supports easy switching between environments
- `{{variable}}` syntax works across all SFMC APIs

### 2. Batch Operations
- Use batch when possible (100+ records)
- Significantly faster than individual requests
- Reduces API call quota usage

### 3. Error Handling
```
Check response status code (200, 201, 202, 400, 401, 404)
Read error message for details
Log response for debugging
Implement exponential backoff for retries
```

### 4. Rate Limiting
- SFMCE has rate limits (varies by org)
- Implement delay between batch operations
- Use async endpoints for large batch processing
- Monitor 429 responses and back off

### 5. Data Validation
- Verify keys are unique (typically Email)
- Confirm all required fields are present
- Validate data types match endpoint expectations
- Test with sample data in DEV first

### 6. Monitoring & Logging
```
Log all request/response details
Monitor automation run history
Track batch job status
Alert on failed jobs
```

---

## Testing Workflow

### 1. Development Environment
```
Test with synthetic/scrubbed data
Use DEV authentication credentials
Verify request/response format
Debug error responses
```

### 2. UAT Environment
```
Test with realistic data subset
Use UAT authentication credentials
Validate business logic
Get stakeholder approval
```

### 3. Production Environment
```
Deploy with PROD credentials
Monitor performance under load
Implement error handling
Establish support procedures
```

---

## Troubleshooting

### Common Errors

**401 Unauthorized**
- Token expired or invalid
- Verify {{access_token}} is set
- Refresh token (see ../README.md)

**400 Bad Request**
- Invalid JSON format
- Missing required fields
- Check request body syntax

**404 Not Found**
- Data Extension key incorrect
- Automation ID wrong
- Verify key spelling exactly

**429 Rate Limited**
- Too many requests too fast
- Add delay between requests
- Use batch operations instead

**500 Server Error**
- SFMC API issue
- Check Salesforce status page
- Retry after waiting

---

## File Format Comparison

| Format | Best For | GitHub Preview | VS Code | Postman |
|--------|----------|---|---|---|
| `.http` | Live examples | ✅ Excellent | ✅ Native | ✅ Import |
| `.json` | Payloads | ✅ Good | ✅ Good | ✅ Native |
| `.curl` | Terminal testing | ⚠️ Text | ✅ Good | ✅ Import |
| `.md` | Documentation | ✅ Great | ✅ Read | ❌ No |

---

## Related Documentation

- [OAuth 2.0 Setup](../README.md) - Token generation and management
- [Data Extension API Docs](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/apis_interaction.html)
- [Automation API Docs](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/automation-api.html)
- [Journey Builder API Docs](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/apis_interaction_events.html)

---

## Last Updated
December 2025

## Examples Based On
Salesforce Marketing Cloud Engagement (SFMCE) API v1.0
