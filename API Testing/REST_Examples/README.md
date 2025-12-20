# REST API Examples - Salesforce Marketing Cloud

This folder contains production-ready REST API examples for Salesforce Marketing Cloud Engagement (SFMCE). Examples are organized by feature area with clear explanations and best practices.

---

## Table of Contents

1. [Overview](#overview)
2. [How to Use These Examples](#how-to-use-these-examples)
3. [Data Extensions](#data-extensions)
4. [Automation Studio](#automation-studio)
5. [Journey Builder](#journey-builder)
6. [Key Concepts](#key-concepts)
7. [Best Practices](#best-practices)
8. [Testing Workflow](#testing-workflow)
9. [Common Errors](#common-errors)
10. [Tools & Resources](#tools--resources)

---

## Overview

REST (Representational State Transfer) API is the modern, high-performance way to interact with SFMCE. Examples are organized by feature area with clear explanations and best practices.

**Format:** These examples use `.http` format which is:
- ✅ GitHub displays with syntax highlighting
- ✅ Works in VS Code REST Client extension
- ✅ Compatible with Postman, Insomnia, Thunder Client
- ✅ Copy-paste ready for your tools
- ✅ Human-readable and version-control friendly

---

## How to Use These Examples

### Option 1: VS Code REST Client (Recommended)

1. Install extension: "REST Client" by Huachao Guo
2. Scroll down to find the example you need
3. Click "Send Request" link above the request
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

### Option 2: Postman Import

1. Scroll down to find the example you need
2. Copy entire request (method, URL, headers, body)
3. In Postman: New Request
4. Paste URL in address bar
5. Set method (GET, POST, etc.)
6. Add headers
7. Paste body as raw JSON
8. Replace variables with actual values

### Option 3: Insomnia

1. Create new request in Insomnia
2. Copy HTTP request line
3. Insomnia recognizes format automatically
4. Add environment variables
5. Send request

---

## Data Extensions

Data Extensions are custom databases for storing subscriber data.

### Operations

- **GET** - Retrieve rows (all, filtered, single)
- **POST** - Create new rows (single or batch)
- **PATCH** - Update existing rows or upsert
- **DELETE** - Remove rows

### Important Notes

- Keys identify unique records (typically Email)
- Batch operations are more efficient than individual requests
- Upsert (`?_upsert=true`) updates if exists, creates if not
- Page size limited to 3000 rows per request

---

### Example 1: GET Data Extension Data (Retrieve all rows)

```http
GET {{base_url}}/data/v1/customobjectdata/key/{{dataExtensionKey}}/rowset?$pageSize=3000&page=1
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Response (Success):**
```json
{
  "rows": [
    {
      "Email": "subscriber1@example.com",
      "FirstName": "John",
      "LastName": "Doe",
      "Status": "Active"
    }
  ],
  "pageNumber": 1,
  "pageSize": 3000,
  "totalCount": 150
}
```

---

### Example 2: GET Data Extension Data (With Filter)

```http
GET {{base_url}}/data/v1/customobjectdata/key/{{dataExtensionKey}}/rowset?$filter=Email%20eq%20'{{email}}'
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Note:** Filter syntax uses OData format (`eq` = equals, `ne` = not equals, `gt` = greater than, `lt` = less than)

---

### Example 3: POST Data Extension - Single Row (Create)

```http
POST {{base_url}}/hub/v1/dataevents/key:{{dataExtensionKey}}/rowset
Authorization: Bearer {{access_token}}
Content-Type: application/json

[
  {
    "keys": {
      "Email": "subscriber@example.com"
    },
    "values": {
      "FirstName": "John",
      "LastName": "Doe",
      "UpdatedDate": "2024-12-20",
      "Status": "Active"
    }
  }
]
```

**Response (Success):**
```json
{
  "requestId": "12345",
  "resultDetail": {
    "successful": 1,
    "failed": 0
  }
}
```

---

### Example 4: POST Data Extension - Multiple Rows (Batch Insert)

```http
POST {{base_url}}/hub/v1/dataevents/key:{{dataExtensionKey}}/rowset
Authorization: Bearer {{access_token}}
Content-Type: application/json

[
  {
    "keys": {
      "Email": "subscriber1@example.com"
    },
    "values": {
      "FirstName": "John",
      "LastName": "Doe",
      "UpdatedDate": "2024-12-20",
      "Status": "Active"
    }
  },
  {
    "keys": {
      "Email": "subscriber2@example.com"
    },
    "values": {
      "FirstName": "Jane",
      "LastName": "Smith",
      "UpdatedDate": "2024-12-20",
      "Status": "Active"
    }
  }
]
```

**Best Practice:** Batch requests are 5-10x faster than individual requests.

---

### Example 5: PATCH Data Extension - Update Single Row

```http
PATCH {{base_url}}/hub/v1/dataevents/key:{{dataExtensionKey}}/rowset
Authorization: Bearer {{access_token}}
Content-Type: application/json

[
  {
    "keys": {
      "Email": "subscriber@example.com"
    },
    "values": {
      "UpdatedDate": "2024-12-20",
      "Status": "Inactive"
    }
  }
]
```

---

### Example 6: PATCH Data Extension - Upsert (Update or Insert)

```http
PATCH {{base_url}}/hub/v1/dataevents/key:{{dataExtensionKey}}/rowset?_upsert=true
Authorization: Bearer {{access_token}}
Content-Type: application/json

[
  {
    "keys": {
      "Email": "subscriber@example.com"
    },
    "values": {
      "FirstName": "Jane",
      "LastName": "Doe",
      "Status": "Active"
    }
  }
]
```

**Note:** Upsert updates if record exists (by key), creates if not. Very efficient for syncing data.

---

### Example 7: DELETE Data Extension Row

```http
DELETE {{base_url}}/hub/v1/dataevents/key:{{dataExtensionKey}}/rowset
Authorization: Bearer {{access_token}}
Content-Type: application/json

[
  {
    "keys": {
      "Email": "subscriber@example.com"
    }
  }
]
```

**Note:** Only the key field is required to identify which row to delete.

---

## Automation Studio

Automations are scheduled or triggered workflows for email sends, data processing, etc.

### Operations

- **GET** - Retrieve automation details and run history
- **POST** - Fire/trigger automation immediately
- **PATCH** - Pause, resume, or modify automation

---

### Example 1: GET All Automations (Filter by Name)

```http
GET {{base_url}}/automation/v1/automations?$filter=name%20like%20'{{automationName}}'
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Response (Success):**
```json
{
  "count": 1,
  "page": 1,
  "pageSize": 50,
  "totalCount": 1,
  "items": [
    {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "Welcome Email Campaign",
      "description": "Sends welcome email to new subscribers",
      "status": "Active",
      "createdDate": "2023-06-15T10:30:00"
    }
  ]
}
```

---

### Example 2: GET Automation by ID

```http
GET {{base_url}}/automation/v1/automations/{{automationId}}
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Use Case:** Get full details of a specific automation before triggering it.

---

### Example 3: POST Fire Automation - All Steps

```http
POST {{base_url}}/automation/v1/automations/{{automationId}}/actions/runallonce
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Note:** Empty POST body triggers all automation steps immediately. Very efficient for one-off execution.

---

### Example 4: POST Fire Automation - Custom Steps Only

```http
POST {{base_url}}/automation/v1/automations/{{automationId}}/actions/runallonce
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "Steps": [
    {
      "StepType": "Activity",
      "Activities": [
        {
          "ActivityObjectId": "a8b7b3b1-fcd5-40da-87c7-bd52e5fe9beb",
          "Id": "a2f1cc0a-b88d-4d34-9fad-b3b0b564bc5c",
          "IsIncludedInRun": true
        }
      ]
    }
  ]
}
```

**Advanced Use Case:** Run only specific activities within an automation, skipping others.

---

### Example 5: PATCH Pause Automation

```http
PATCH {{base_url}}/automation/v1/automations/{{automationId}}
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "status": "Paused"
}
```

**Note:** Paused automations can be resumed later. Better than stopping if you need to restart.

---

### Example 6: PATCH Resume Automation

```http
PATCH {{base_url}}/automation/v1/automations/{{automationId}}
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "status": "Active"
}
```

---

### Example 7: GET Automation Runs (History)

```http
GET {{base_url}}/automation/v1/automations/{{automationId}}/runs?$top=100
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Response (Success):**
```json
{
  "count": 25,
  "items": [
    {
      "id": "run-123",
      "automationId": "{{automationId}}",
      "startTime": "2024-12-20T14:30:00Z",
      "endTime": "2024-12-20T14:35:45Z",
      "status": "Completed",
      "totalContacts": 5432
    }
  ]
}
```

**Use Case:** Monitor automation execution history and performance.

---

## Journey Builder

Journeys are customer interaction workflows with multiple touchpoints and decision points.

### Operations

- **POST** - Send event to trigger journey entry
- **GET** - Check event history/status

---

### Example 1: POST Journey Builder Event - Single Contact

```http
POST {{base_url}}/interaction/v1/events
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "EventDefinitionKey": "{{eventDefinitionKey}}",
  "ContactKey": "{{email}}",
  "Data": {
    "Email": "subscriber@example.com",
    "FirstName": "John",
    "UpdatedDate": "2024-12-20",
    "Status": "Active"
  }
}
```

**Response (Success):**
```json
{
  "eventInstanceId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "eventId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

**Note:** Synchronous operation (returns 200 OK immediately). Single contact only.

---

### Example 2: POST Journey Builder Event - Multiple Contacts (Async Batch)

```http
POST {{base_url}}/interaction/v1/async/events
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "EventDefinitionKey": "{{eventDefinitionKey}}",
  "members": [
    {
      "contactKey": "subscriber1@example.com",
      "data": {
        "Email": "subscriber1@example.com",
        "FirstName": "John",
        "UpdatedDate": "2024-12-20",
        "Status": "Active"
      }
    },
    {
      "contactKey": "subscriber2@example.com",
      "data": {
        "Email": "subscriber2@example.com",
        "FirstName": "Jane",
        "UpdatedDate": "2024-12-20",
        "Status": "Active"
      }
    },
    {
      "contactKey": "subscriber3@example.com",
      "data": {
        "Email": "subscriber3@example.com",
        "FirstName": "Bob",
        "UpdatedDate": "2024-12-20",
        "Status": "Inactive"
      }
    }
  ]
}
```

**Response (Accepted):**
```json
{
  "requestId": "batch-123"
}
```

**Note:** Asynchronous (returns 202 Accepted immediately). Batch processes in background. Best for 100+ contacts.

---

### Example 3: POST Journey Builder Event - With Complex Data Types

```http
POST {{base_url}}/interaction/v1/events
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "EventDefinitionKey": "{{eventDefinitionKey}}",
  "ContactKey": "{{email}}",
  "Data": {
    "Email": "subscriber@example.com",
    "FirstName": "John",
    "MigrationDate": "2024-12-20",
    "IsProspect": false,
    "UpgradeCount": 5,
    "DeviceList": ["Phone", "Tablet", "Computer"],
    "LastUpdated": "2024-12-20T14:30:00Z"
  }
}
```

**Supported Data Types:**
- String: "text"
- Number: 123 or 45.67
- Boolean: true or false
- Date: "2024-12-20" or ISO 8601 timestamp
- Array: ["value1", "value2"]
- Object: see Example 4

---

### Example 4: POST Journey Builder Event - With Custom Objects (Nested Data)

```http
POST {{base_url}}/interaction/v1/events
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "EventDefinitionKey": "{{eventDefinitionKey}}",
  "ContactKey": "{{email}}",
  "Data": {
    "Email": "subscriber@example.com",
    "FirstName": "John",
    "MigrationInfo": {
      "MigrationDate": "2024-12-20",
      "Wave": "Wave 3",
      "Status": "Scheduled",
      "NewDevice": {
        "DeviceType": "Laptop",
        "Model": "MacBook Pro",
        "OS": "macOS"
      }
    }
  }
}
```

**Advanced Use Case:** Pass complex nested structures for sophisticated journey logic.

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

**See:** [../README.md](../README.md) for OAuth 2.0 setup and token refresh.

### Authorization

All requests require OAuth 2.0 Bearer token:

```
Authorization: Bearer {{access_token}}
```

### Content Type

All examples use JSON:

```
Content-Type: application/json
```

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Operation completed successfully |
| 201 | Created | New resource created |
| 202 | Accepted | Async operation queued |
| 400 | Bad Request | Invalid data or missing field |
| 401 | Unauthorized | Token missing/expired |
| 404 | Not Found | Data Extension/Automation doesn't exist |
| 429 | Rate Limited | Too many requests, wait and retry |
| 500 | Server Error | SFMCE API error |

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
- Example: 1000 records in 1 batch request vs 1000 individual requests

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

## Common Errors

### 401 Unauthorized
- Token expired or invalid
- Verify {{access_token}} is set
- Refresh token (see ../README.md)

### 400 Bad Request
- Invalid JSON format
- Missing required fields
- Check request body syntax

### 404 Not Found
- Data Extension key incorrect
- Automation ID wrong
- Verify key spelling exactly

### 429 Rate Limited
- Too many requests too fast
- Add delay between requests
- Use batch operations instead

### 500 Server Error
- SFMCE API issue
- Check Salesforce status page
- Retry after waiting

---

## Tools & Resources

### Recommended Tools

**VS Code REST Client** (Free)
- Native .http file support
- Built-in syntax highlighting
- Environment variable management
- Request/response history
- Download: VS Code Extension Marketplace

**Postman** (Free & Paid)
- Professional API testing
- Collection management
- Built-in SFMC examples
- Team collaboration features
- Download: https://www.postman.com/

**Insomnia** (Free & Paid)
- Clean, intuitive interface
- Request chaining
- Plugin ecosystem
- Download: https://insomnia.rest/

### Official Resources

- [SFMCE REST API Documentation](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/apis_interaction.html)
- [OAuth 2.0 Setup Guide](../README.md)
- [Data Extension API Reference](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/apis_interaction.html)
- [Automation API Reference](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/automation-api.html)
- [Journey Builder API Reference](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/apis_interaction_events.html)

---

## Quick Reference

### Single vs Batch Operations

**Single Request:**
```json
[
  { "keys": { "Email": "user1@example.com" }, "values": { "Name": "John" } }
]
```

**Batch Request:**
```json
[
  { "keys": { "Email": "user1@example.com" }, "values": { "Name": "John" } },
  { "keys": { "Email": "user2@example.com" }, "values": { "Name": "Jane" } },
  { "keys": { "Email": "user3@example.com" }, "values": { "Name": "Bob" } }
]
```

**Efficiency:** Batch requests are 5-10x faster.

### Sync vs Async

**Synchronous (Immediate Response):**
```
POST {{base_url}}/interaction/v1/events
// Returns 200 OK immediately
// Single contact only
```

**Asynchronous (Queued):**
```
POST {{base_url}}/interaction/v1/async/events
// Returns 202 Accepted immediately
// Batch processes in background
// Better for 100+ records
```

### Create vs Upsert

**Create Only (Error if Exists):**
```
POST {{base_url}}/hub/v1/dataevents/key:{{dataExtensionKey}}/rowset
```

**Upsert (Create or Update):**
```
PATCH {{base_url}}/hub/v1/dataevents/key:{{dataExtensionKey}}/rowset?_upsert=true
```

---

## Last Updated
December 2025

## Examples Based On
Salesforce Marketing Cloud Engagement (SFMCE) REST API v1.0
