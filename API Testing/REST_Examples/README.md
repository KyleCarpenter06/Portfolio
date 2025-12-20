### Salesforce Marketing Cloud REST API Examples

This folder contains organized REST API examples for Salesforce Marketing Cloud Engagement (SFMCE). Each file demonstrates a common use case with proper formatting for GitHub preview.

## Files Overview

- **data-extensions.http** - Data Extension CRUD operations (GET, POST, PATCH, DELETE)
- **automation.http** - Automation Studio operations (trigger, pause, resume)
- **journey-builder.http** - Journey Builder event firing (single and batch)
- **rest-api-examples.md** - Comprehensive guide with detailed explanations

## File Format Explanation

### .http Format (Recommended for GitHub)

The `.http` format is native to:
- Visual Studio Code with REST Client extension
- JetBrains IDEs (IntelliJ, WebStorm, etc.)
- GitHub preview (clean, readable display)
- Postman import capability

**Benefits:**
- ✅ GitHub displays formatted request/response
- ✅ Works with VS Code REST Client extension
- ✅ Easy to copy-paste into Postman
- ✅ Human-readable syntax
- ✅ Supports variables and headers

### .json Format

Use for:
- Request body examples
- Response payload examples
- Postman collection import

### .md Format

Use for:
- Detailed explanations
- Authentication setup
- Variable definitions
- Best practices

## How to Use

### In VS Code with REST Client

1. Install extension: "REST Client" by Huachao Guo
2. Open `.http` file
3. Click "Send Request" link above each request
4. Response displays in sidebar

### In Postman

1. Open `.http` file in text editor
2. Copy request format
3. Create new Postman request
4. Paste method, URL, headers, body
5. Adjust variables ({{base_url}}, {{access_token}})

### On GitHub

1. Files display with syntax highlighting
2. Easy to read and reference
3. Copy/paste ready for tools

## Variables Used

Replace these with actual values:

```
{{base_url}}        - Salesforce domain (https://xxxxx.rest.marketingcloudapis.com)
{{access_token}}    - OAuth 2.0 Bearer token (from Auth setup)
{{dataExtensionKey}} - Key of your Data Extension
{{automationId}}    - UUID of your Automation
{{eventKey}}        - Key of your Journey Builder Event
{{email}}           - Subscriber email address
```

See [../README.md](../README.md) for OAuth setup and token management.

## Last Updated
December 2025
