# API Testing Guide - Postman & OAuth 2.0

This folder contains comprehensive guides for API testing, including OAuth 2.0 authentication setup, environment management, and UAT/Production testing strategies for REST and SOAP APIs.

---

## Table of Contents

1. [Quick Start Overview](#quick-start-overview)
2. [UAT vs Production Testing](#uat-vs-production-testing)
3. [OAuth 2.0 Setup](#oauth-20-setup)
4. [Environment Management](#environment-management)
5. [Token Management](#token-management)
6. [REST vs SOAP Implementation](#rest-vs-soap-implementation)
7. [Troubleshooting](#troubleshooting)
8. [Security Best Practices](#security-best-practices)

---

## Quick Start Overview

This guide covers:
- **OAuth 2.0 Implementation** - Secure API authentication without exposing credentials
- **Environment Configuration** - Managing dev, staging, and production endpoints separately
- **Token Management** - Automatic token refresh and reuse across all API calls
- **Testing Strategy** - UAT validation vs Production verification approach

---

## UAT vs Production Testing

Understanding the difference between User Acceptance Testing (UAT) and Production testing is critical for safe API integration.

### UAT Environment

**Purpose:**
- Validate functionality, business logic, and data flows with realistic scenarios
- Confirm data transformations, field mappings, and edge cases
- Test before external sharing with stakeholders

**Characteristics:**
- Uses safe, scrubbed, or synthetic data
- No PII or sensitive information
- Different endpoints than Production
- Internal validation only
- Exercise real scenarios safely

**Testing Focus:**
- Confirm business requirements are met
- Verify data format is correct for distribution
- Allow internal stakeholders to validate transformations
- Test edge cases and bulk data scenarios
- Safe to fail and retry without impact

### Production Environment

**Purpose:**
- Verify live system integration with real, full-volume data
- Ensure production authentication flows work correctly
- Validate performance and capacity under real load

**Characteristics:**
- Uses real, production data
- Full volume and performance testing
- Strict monitoring and hypercare during testing
- Data integrity and compliance critical
- External stakeholder access

**Testing Focus:**
- Full performance and load testing
- Capacity checks and bottleneck identification
- Real authentication flows and security
- Data integrity verification
- Compliance and audit trail validation
- Production constraints and edge cases

### Key Differences Summary

| Aspect | UAT | Production |
|--------|-----|-----------|
| **Data** | Synthetic/Scrubbed | Real/Live |
| **Volume** | Subset/Test Data | Full Volume |
| **Endpoints** | UAT Domain | PROD Domain |
| **Access** | Internal Teams | Internal + External |
| **Risk Level** | Low (Safe to Fail) | High (Live Impact) |
| **Purpose** | Validation | Verification |
| **Postman Env** | UAT_Environment | PROD_Environment |

---

## OAuth 2.0 Setup

### Why OAuth 2.0?

OAuth 2.0 is an authorization framework that securely authenticates API requests without exposing sensitive credentials like passwords. Instead, you:
1. Exchange credentials (Client ID + Secret) for a temporary access token
2. Use the token for all API requests
3. Automatically refresh tokens when expired
4. Never pass raw credentials in API calls

### Prerequisites

Before setting up OAuth, you need:
- **Client ID** - Application identifier from your API provider (e.g., Salesforce)
- **Client Secret** - Password for the application (keep this secret!)
- **Auth Token URL** - Endpoint where you obtain access tokens
- **API Base URL** - Root endpoint for API calls (differs by UAT/PROD)

Obtain these from:
- Salesforce Connected App settings
- API provider dashboard
- System administrator

---

## Environment Management

### Why Use Environments?

Environments in Postman allow you to:
- **Separate credentials from code** - Sensitive data never exposed
- **Switch between environments** - One click to change Dev → UAT → PROD
- **Prevent accidental credential exposure** - Only "Current Value" is stored locally
- **Centralize configuration** - All variables in one place
- **Reuse across collections** - All requests reference the same token

### Creating Environments

**Step 1: Create Environment in Postman**
1. Click "Environments" in left sidebar
2. Click "+" to create new environment
3. Name: `Salesforce_API_UAT` (or your provider)
4. Click "Save"

**Step 2: Add Required Variables**

Create these variables for each environment:

| Variable Name | Type | Initial Value | Current Value | Secret? |
|---|---|---|---|---|
| base_url | string | https://[uat-domain].salesforce.com | [same] | No |
| client_id | string | [LEAVE BLANK] | [YOUR_CLIENT_ID] | Yes |
| client_secret | string | [LEAVE BLANK] | [YOUR_CLIENT_SECRET] | Yes |
| auth_token_url | string | /services/oauth2/token | [same] | No |
| access_token | string | [LEAVE BLANK] | [AUTO-GENERATED] | Yes |
| token_expiry | number | 3600 | [auto-set] | No |

**Step 3: Mark Sensitive Variables as Secret**
- Hover over variable row
- Click eye icon to toggle "Secret" visibility
- Secret variables won't display in preview or logs
- Apply to: `client_id`, `client_secret`, `access_token`

### Environment Variables Explained

**base_url** - Root domain for all API calls
```
UAT: https://uat.salesforce.com
PROD: https://production.salesforce.com
```

**client_id** - Application identifier from API provider
```
Obtained from Connected App settings
Never commit to version control
```

**client_secret** - Password for the application
```
Obtained from Connected App settings
CRITICAL: Keep this secure!
Only store in "Current Value", never in "Initial Value"
```

**auth_token_url** - Endpoint for token requests
```
Standard: /services/oauth2/token
May vary by provider
```

**access_token** - Temporary authorization token (AUTO-GENERATED)
```
Created by OAuth request
Expires after time_to_live (typically 3600 seconds = 1 hour)
Automatically refreshed when needed
```

**token_expiry** - Unix timestamp when token expires
```
Auto-calculated from current time + expires_in
Used to determine if token needs refresh
```

### Multiple Environments (Dev, UAT, PROD)

Create separate environments for each stage:

**Environment 1: Development**
```
Name: Salesforce_API_Dev
base_url: https://dev.salesforce.com
client_id: [DEV_CLIENT_ID]
client_secret: [DEV_CLIENT_SECRET]
```

**Environment 2: User Acceptance Testing**
```
Name: Salesforce_API_UAT
base_url: https://uat.salesforce.com
client_id: [UAT_CLIENT_ID]
client_secret: [UAT_CLIENT_SECRET]
```

**Environment 3: Production**
```
Name: Salesforce_API_PROD
base_url: https://production.salesforce.com
client_id: [PROD_CLIENT_ID]
client_secret: [PROD_CLIENT_SECRET]
```

**Switching Between Environments:**
- Click environment dropdown (top-right of Postman window)
- Select desired environment
- All `{{variable}}` references automatically update
- New access token requested for that environment

---

## Token Management

### Configuring OAuth 2.0 in Collections

**Method 1: Postman Built-in OAuth Helper (RECOMMENDED)**

1. Open your API Collection
2. Click "Authorization" tab (at collection level)
3. Select "OAuth 2.0" from dropdown
4. Configure these fields:

| Field | Value |
|-------|-------|
| Grant Type | Client Credentials |
| Access Token URL | `{{base_url}}{{auth_token_url}}` |
| Client ID | `{{client_id}}` |
| Client Secret | `{{client_secret}}` |
| Client Authentication | Send credentials in body |
| Add token to | Header |
| Token Prefix | Bearer |

5. Click "Get New Access Token"
6. Token automatically stored as `{{access_token}}`

**Method 2: Pre-request Script (Custom Logic)**

For advanced scenarios, add this to collection Pre-request Script:

```javascript
// Check if token exists and is still valid
if (!pm.environment.get("access_token") || pm.environment.get("token_expiry") < Date.now() / 1000) {
    
    // Request new token
    const tokenRequest = {
        url: pm.environment.get("base_url") + pm.environment.get("auth_token_url"),
        method: 'POST',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
            mode: 'urlencoded',
            urlencoded: [
                { key: 'grant_type', value: 'client_credentials' },
                { key: 'client_id', value: pm.environment.get("client_id") },
                { key: 'client_secret', value: pm.environment.get("client_secret") }
            ]
        }
    };
    
    // Execute token request
    pm.sendRequest(tokenRequest, (err, response) => {
        if (err) {
            console.log("Token Error:", err);
        } else {
            const jsonResponse = response.json();
            pm.environment.set("access_token", jsonResponse.access_token);
            // Set expiry time (current time + expires_in seconds)
            pm.environment.set("token_expiry", Math.floor(Date.now() / 1000) + jsonResponse.expires_in);
            console.log("New token obtained, expires in:", jsonResponse.expires_in, "seconds");
        }
    });
}
```

### Automatic Token Refresh

- **First Request:** Obtains new token automatically
- **Subsequent Requests:** Reuse same token
- **Token Expires:** Automatically detected and refreshed
- **No Manual Action:** Token management fully automated

### Viewing Current Token

To see the actual token value:
1. Hover over `{{access_token}}` variable in environment
2. Click eye icon to reveal in plain text
3. Token displayed temporarily
4. Do not share or commit token to version control

### Clearing Tokens

When switching credentials or troubleshooting:
1. Environment tab → select environment
2. Find `access_token` variable
3. Clear the "Current Value"
4. Close and reopen environment
5. Next request will obtain fresh token

---

## REST vs SOAP Implementation

Both API types use the same OAuth token through environment variables, but in different ways.

### REST API Calls

All REST requests automatically inherit token from collection Authorization:

**Authorization Tab Configuration:**
```
Type: OAuth 2.0
Header Name: Authorization
Token Prefix: Bearer
```

**Example REST Request:**
```
GET {{base_url}}/services/data/v57.0/sobjects/Account
Authorization: Bearer {{access_token}} (automatic)
Content-Type: application/json
```

**Multiple REST Endpoints (All Use Same Token):**
```
GET   {{base_url}}/services/data/v57.0/sobjects/Account
POST  {{base_url}}/services/data/v57.0/sobjects/Contact
PATCH {{base_url}}/services/data/v57.0/sobjects/Account/0011700000IZ3TAAW
DELETE {{base_url}}/services/data/v57.0/sobjects/Lead/00Q1700000IZ3TAAW
```

### SOAP API Calls

SOAP APIs may require token in SOAP envelope header:

**Option 1: SessionID in SOAP Header (Common)**
```xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <soap:Header>
        <SessionHeader xmlns="urn:enterprise.soap.sforce.com">
            <sessionId>{{access_token}}</sessionId>
        </SessionHeader>
    </soap:Header>
    <soap:Body>
        <query xmlns="urn:enterprise.soap.sforce.com">
            <queryString>SELECT Id, Name FROM Account LIMIT 10</queryString>
        </query>
    </soap:Body>
</soap:Envelope>
```

**Option 2: Bearer Token in HTTP Header**
```
POST {{base_url}}/services/Soap/c/57.0
Authorization: Bearer {{access_token}}
Content-Type: text/xml
SOAPAction: query

[SOAP envelope body...]
```

### Using Same Token for Both REST and SOAP

**Single Environment, Both API Types:**
```
1. Set {{access_token}} in environment
2. REST request: Uses token via Authorization header
3. SOAP request: Embeds {{access_token}} in SessionHeader
4. Both requests: Reference same {{access_token}} variable
5. Token expires: Both request types automatically refreshed
```

**Example Collection Structure:**
```
MyAPI_Collection
├── Authorization: OAuth 2.0 ({{access_token}})
├── Pre-request Script: (automatic token refresh)
├── REST Folder
│   ├── GET /sobjects/Account
│   ├── POST /sobjects/Contact
│   └── DELETE /sobjects/Lead
└── SOAP Folder
    ├── Query
    ├── Create
    └── Update
```

---

## Example Workflow

### Complete Setup from Start to Finish

**Step 1: Create Environment**
1. Postman → Environments → + Create New
2. Name: "Salesforce_API_Test"
3. Add variables: base_url, client_id, client_secret, auth_token_url
4. Save

**Step 2: Set OAuth on Collection**
1. Open collection
2. Authorization tab → OAuth 2.0
3. Fill fields (see OAuth 2.0 Setup section)
4. Save

**Step 3: Create REST Request**
1. New Request → GET
2. URL: `{{base_url}}/services/data/v57.0/sobjects/Account`
3. Authorization: Inherit from collection
4. Send → Token automatically obtained

**Step 4: Create SOAP Request**
1. New Request → POST
2. URL: `{{base_url}}/services/Soap/c/57.0`
3. Body: Raw XML with `{{access_token}}` in SessionHeader
4. Send → Same token reused

**Step 5: Switch to Production**
1. Environment dropdown → Select PROD environment
2. All requests immediately use PROD credentials
3. New token obtained for PROD
4. All requests (REST + SOAP) use PROD token

---

## Troubleshooting

### Common OAuth Errors

**Error: "invalid_client"**
- **Cause:** Client ID or Client Secret incorrect
- **Solution:** 
  - Verify credentials in environment
  - Check for trailing spaces in variables
  - Confirm Client ID matches API provider account

**Error: "invalid_grant"**
- **Cause:** Grant type not supported or credentials expired
- **Solution:**
  - Verify grant_type is "client_credentials"
  - Check client credentials are still valid in API provider
  - Regenerate Client Secret if needed

**Error: "unauthorized"**
- **Cause:** Access token missing, expired, or invalid
- **Solution:**
  - Ensure Authorization header is set to "Bearer {{access_token}}"
  - Check token variable contains value (use eye icon)
  - Click "Get New Access Token" to refresh

**Error: "401 Unauthorized"**
- **Cause:** Invalid or expired token in request
- **Solution:**
  - Open Postman Console (bottom of window)
  - Expand Pre-request Script section
  - Check token generation logs
  - Verify environment selected correctly

### Debugging Steps

**Step 1: Check Environment**
- Confirm correct environment selected (top-right dropdown)
- Verify all variables have values (especially client_id, client_secret)

**Step 2: View Token Request**
- Open Postman Console
- Look for token request details
- Check response from `/oauth2/token` endpoint
- Identify specific error message

**Step 3: Test Token Request Directly**
1. Create new POST request
2. URL: `{{base_url}}/services/oauth2/token`
3. Body (form-data):
   - grant_type: client_credentials
   - client_id: {{client_id}}
   - client_secret: {{client_secret}}
4. Send and inspect response
5. If error, fix client credentials in environment

**Step 4: Verify Token in Header**
1. Send any API request
2. Open response headers
3. Check Authorization header shows: `Bearer [token_value]`
4. If missing, confirm OAuth 2.0 is set on collection

---

## Security Best Practices

### Protecting Credentials

**DO:**
- ✅ Use environment variables for all credentials
- ✅ Mark sensitive variables as "Secret"
- ✅ Store Client Secret only in "Current Value"
- ✅ Leave "Initial Value" blank for secrets
- ✅ Use separate environments per stage (DEV/UAT/PROD)
- ✅ Rotate Client Secrets regularly
- ✅ Use IP whitelisting if available

**DON'T:**
- ❌ Hardcode credentials in requests
- ❌ Commit environment files with secrets to Git
- ❌ Share collections with "Current Value" populated
- ❌ Include credentials in URLs
- ❌ Expose tokens in logs or screenshots
- ❌ Use same credentials for DEV and PROD

### Exporting Collections Safely

**Before Exporting Collection:**
1. Verify "Current Value" is empty for all sensitive variables
2. Check "Initial Value" is blank or contains only generic placeholders
3. Ensure all requests use `{{variable}}` syntax
4. Enable Secret toggle for client_secret
5. Never export with actual credentials

**Safe Export:**
1. Right-click collection → Export
2. Choose format (JSON recommended)
3. Verify no credentials in file
4. Share collection (safe)
5. Team members add their own environment "Current Values"

### Managing with Version Control

**Create .gitignore entries:**
```
# Never commit environments with credentials
*-env.json
postman-environment.json
.env

# Only commit collections (without Current Values)
postman-collection.json
```

**Workflow:**
1. Commit collection (safe)
2. Team adds local environment (not committed)
3. Each team member manages their own credentials
4. Prevent accidental credential leaks

### Postman Cloud Sync

**Secure Settings:**
- Sync collections only (not environments with secrets)
- Keep sensitive environments local only
- Review synced items for exposed credentials
- Use Postman Vault for additional security (Teams/Enterprise)

---

## Files in This Folder

- **api_testing_oauth.txt** - Detailed OAuth 2.0 technical reference
- **api_testing_overview.txt** - UAT vs Production testing differences
- **api_testing_rest_examples.txt** - REST API request examples
- **api_testing_soap_examples.txt** - SOAP API request examples
- **README.md** - This comprehensive guide

---

## Quick Reference

### Environment Variables
```
{{base_url}}        - API root domain
{{client_id}}       - OAuth client identifier
{{client_secret}}   - OAuth client password (secret)
{{access_token}}    - Bearer token for API calls
{{auth_token_url}}  - OAuth token endpoint
```

### Postman Shortcuts
```
Cmd/Ctrl+Shift+E  - Open Environment Manager
Cmd/Ctrl+Shift+C  - Open Console
Cmd/Ctrl+K        - Open Quick Search
Cmd/Ctrl+Alt+C    - Open Cookie Manager
```

### Common URLs
```
Salesforce OAuth:      {{base_url}}/services/oauth2/token
Salesforce REST:       {{base_url}}/services/data/v57.0
Salesforce SOAP:       {{base_url}}/services/Soap/c/57.0
```

---

## Last Updated
December 2025