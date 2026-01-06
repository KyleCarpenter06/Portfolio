# SOAP API Examples - Comprehensive Guide

## Overview

This folder contains production-ready SOAP API examples for Salesforce Marketing Cloud Engagement (SFMCE). SOAP (Simple Object Access Protocol) is a legacy protocol still widely used for data retrieval and manipulation in SFMCE. Examples are organized by feature area with clear explanations and best practices.

---

## Table of Contents

- [File Organization](#file-organization)
- [API Examples by Category](#api-examples-by-category)
- [SOAP Endpoints](#soap-endpoints)
- [Key Concepts](#key-concepts)
- [Common Patterns](#common-patterns)
- [Response Format](#response-format)
- [Best Practices](#best-practices)
- [Testing Workflow](#testing-workflow)
- [Comparison: SOAP vs REST](#comparison-soap-vs-rest)
- [Common SOAP Errors](#common-soap-errors)
- [Tools & Resources](#tools--resources)
- [Migration Path: SOAP to REST](#migration-path-soap-to-rest)
- [RETRIEVE DATA EXAMPLES](#retrieve-data-examples)
- [PERFORM ACTIONS EXAMPLES](#perform-actions-examples)
- [EXECUTE QUERIES EXAMPLES](#execute-queries-examples)

---

## File Organization

### `.soap` Files (Primary Format)

**Why `.soap` format?**
- ✅ Clear SOAP envelope structure
- ✅ GitHub displays XML with syntax highlighting
- ✅ Copy-paste ready for your API tools
- ✅ Self-documenting with comments
- ✅ Compatible with Postman, Insomnia, SoapUI

**Files:**
1. **retrieve-data.soap** - Query and retrieve data from SFMCE objects
2. **perform-actions.soap** - Execute operations (fire automation, update objects)
3. **execute-queries.soap** - Execute complex data queries and filters

### How to Use `.soap` Files

#### Option 1: Postman (Recommended for SOAP)

1. Create new request in Postman
2. Set method to **POST**
3. Enter endpoint URL (from examples)
4. Add header: `Content-Type: text/xml`
5. Add header: `SOAPAction: [action-name]`
6. Set body to **raw** → **XML**
7. Copy entire SOAP envelope from `.soap` file
8. Replace `{{TOKEN}}` with actual Bearer token
9. Send request

**Postman SOAP Tips:**
- Postman displays XML response with color coding
- Can save environment variables for endpoint/token
- History tracks all requests and responses
- Can validate XML structure before sending

#### Option 2: VS Code with XML Extension

1. Install "XML" extension (RedHat)
2. Open `.soap` file in VS Code
3. Copy request
4. Use terminal to send with `curl`:
```bash
curl -X POST \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: Retrieve" \
  -d @request.xml \
  https://webservice.s7.exacttarget.com/Service.asmx
```

#### Option 3: SoapUI (Specialized SOAP Tool)

1. Download SoapUI (open-source or Pro)
2. Create new SOAP project
3. Import WSDL: `https://webservice.s7.exacttarget.com/Service.asmx?wsdl`
4. Create new test case
5. Paste request from `.soap` file
6. Configure endpoint and authentication
7. Run test case

---

## API Examples by Category

### 1. Retrieve Data (`retrieve-data.soap`)

The Retrieve operation queries SFMCE objects with filters and returns matching results.

**Use Cases:**
```
Get Automation ID by Name
→ Find automation's ID for reference in other calls

Get Data Extension Records
→ Query rows filtered by email, date, status, etc.

Get Subscriber Attributes
→ Retrieve specific subscriber information

Get Email Campaign History
→ Query sent email records with filters
```

**Key Concepts:**

**ObjectType:** What you're querying
- `Automation` - Scheduled/triggered workflows
- `DataExtension` - Custom database tables
- `Subscriber` - Email subscriber records
- `Email` - Email campaign definitions
- `List` - Subscriber lists

**Properties:** Fields to return
```xml
<Properties>ProgramID</Properties>
<Properties>Name</Properties>
<Properties>CreatedDate</Properties>
```

**Filters:** Where conditions
```xml
<Filter xsi:type="SimpleFilterPart">
    <Property>Name</Property>
    <SimpleOperator>equals</SimpleOperator>
    <Value>{{Value}}</Value>
</Filter>
```

**Operators:**
- `equals` - Exact match
- `notEquals` - Not matching
- `greaterThan` - > comparison
- `lessThan` - < comparison
- `like` - Pattern match (%)
- `in` - Multiple values

**Paging:**
```xml
<Options>
    <RequestType>Paginated</RequestType>
</Options>
<PageSize>50</PageSize>
```

---

### 2. Perform Actions (`perform-actions.soap`)

The Perform operation executes actions on objects (fire automation, start workflow, etc.).

**Use Cases:**
```
Fire Automation
→ Trigger automation to run immediately

Pause/Resume Automation
→ Stop or restart scheduled automation

Update Automation
→ Modify automation properties

Start Journey
→ Launch customer journey execution
```

**Key Action Types:**
- `start` - Fire/trigger automation
- `stop` - Stop automation execution
- `pause` - Pause automation temporarily
- `resume` - Resume paused automation

**Definition Structure:**
```xml
<Definition xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="Automation">
    <ObjectID>{{Automation ID}}</ObjectID>
</Definition>
```

---

### 3. Execute Queries (`execute-queries.soap`)

ExecuteRequest runs SOAP queries with complex filters, sorting, and advanced options.

**Use Cases:**
```
Complex Multi-Condition Query
→ Filter by multiple fields with AND/OR logic

Sorted Results
→ Return records ordered by date, name, etc.

Paginated Results
→ Process large result sets in chunks

Count Results
→ Get total count without fetching all records
```

**Advanced Filtering:**
```xml
<Filter xsi:type="ComplexFilterPart">
    <LeftOperand xsi:type="SimpleFilterPart">
        <Property>Email</Property>
        <SimpleOperator>like</SimpleOperator>
        <Value>%@example.com</Value>
    </LeftOperand>
    <LogicalOperator>AND</LogicalOperator>
    <RightOperand xsi:type="SimpleFilterPart">
        <Property>Status</Property>
        <SimpleOperator>equals</SimpleOperator>
        <Value>Active</Value>
    </RightOperand>
</Filter>
```

---

## SOAP Endpoints

### Primary SOAP Endpoint

**Legacy Endpoint:**
```
https://webservice.s7.exacttarget.com/Service.asmx
```

**Regional Endpoint (Recommended):**
```
https://mc{{MC_SUBDOMAIN}}.soap.marketingcloudapis.com/Service.asmx
```

Replace `{{MC_SUBDOMAIN}}` with your Marketing Cloud instance subdomain (found in account settings).

---

## Key Concepts

### SOAP Envelope Structure

Every SOAP request has this structure:

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    
    <!-- Authentication & Headers -->
    <soapenv:Header>
        <fueloauth xmlms="http://exacttarget.com">{{TOKEN}}</fueloauth>
    </soapenv:Header>
    
    <!-- Request Body -->
    <soapenv:Body>
        <!-- Request message here -->
    </soapenv:Body>

</soapenv:Envelope>
```

### Authentication

SOAP uses `fueloauth` header instead of Bearer token:

```xml
<fueloauth xmlns="http://exacttarget.com">{{TOKEN}}</fueloauth>
```

Token format is same as REST (from OAuth 2.0 token endpoint).

### HTTP Headers

Required headers for SOAP requests:

```
Content-Type: text/xml; charset=UTF-8
SOAPAction: [Operation Name]
```

**SOAPAction values:**
- `Retrieve` - For RetrieveRequest messages
- `Execute` - For ExecuteRequest messages
- `Perform` - For PerformRequest messages

### WSDL (Web Services Description Language)

WSDL defines available operations. Download from:

```
https://webservice.s7.exacttarget.com/Service.asmx?wsdl
https://{{MC_SUBDOMAIN}}.soap.marketingcloudapis.com/Service.asmx?wsdl
```

Most SOAP tools (SoapUI, Postman) can auto-generate requests from WSDL.

---

## Common Patterns

### Retrieve with Simple Filter

```xml
<Filter xsi:type="SimpleFilterPart">
    <Property>Name</Property>
    <SimpleOperator>equals</SimpleOperator>
    <Value>{{Value}}</Value>
</Filter>
```

### Retrieve with Multiple Properties

```xml
<Properties>Property1</Properties>
<Properties>Property2</Properties>
<Properties>Property3</Properties>
<Properties>CreatedDate</Properties>
```

### Retrieve with Pagination

```xml
<Options>
    <RequestType>Paginated</RequestType>
</Options>
<PageSize>100</PageSize>
```

### Perform with Single Object

```xml
<Definitions>
    <Definition xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="Automation">
        <ObjectID>{{ID}}</ObjectID>
    </Definition>
</Definitions>
```

---

## Response Format

### Successful Response

```xml
<RetrieveResponseMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
    <OverallStatus>OK</OverallStatus>
    <RequestID>{{REQUEST-ID}}</RequestID>
    <Results>
        <Result>
            <ObjectID>{{ID}}</ObjectID>
            <Properties>
                <Property>
                    <Name>ProgramID</Name>
                    <Value>12345</Value>
                </Property>
                <Property>
                    <Name>Name</Name>
                    <Value>My Automation</Value>
                </Property>
            </Properties>
        </Result>
    </Results>
</RetrieveResponseMsg>
```

### Error Response

```xml
<Fault>
    <faultcode>Client</faultcode>
    <faultstring>Invalid request</faultstring>
    <detail>
        <ExactTargetFault>
            <ErrorCode>0</ErrorCode>
            <Description>{{ERROR_MESSAGE}}</Description>
        </ExactTargetFault>
    </detail>
</Fault>
```

### Status Codes

| Status | Meaning |
|--------|---------|
| OK | Request successful |
| HasPartialFailure | Some objects processed, others failed |
| Error | Request failed entirely |

---

## Best Practices

### 1. Use Regional Endpoints
- Legacy endpoint slower and less reliable
- Regional endpoint near your instance
- Update endpoint in all requests/tools

### 2. Limit Result Sets
- Use filters to reduce returned records
- Implement pagination for large queries
- Use `<PageSize>` for optimal performance

### 3. Request Specific Properties
```xml
<!-- ✅ GOOD - Only needed fields -->
<Properties>Name</Properties>
<Properties>Email</Properties>

<!-- ❌ BAD - All properties = slower response -->
<!-- No properties specified = returns everything -->
```

### 4. Use Specific Filters
```xml
<!-- ✅ GOOD - Filtered query -->
<Filter>
    <Property>Status</Property>
    <SimpleOperator>equals</SimpleOperator>
    <Value>Active</Value>
</Filter>

<!-- ❌ BAD - Unfiltered query -->
<!-- No filter = retrieves all records -->
```

### 5. Token Management
- Use same OAuth 2.0 token as REST API
- Tokens expire after 1 hour
- Implement token refresh logic
- Never hardcode tokens

### 6. Error Handling
```
Check OverallStatus (OK, HasPartialFailure, Error)
Parse error messages from Fault elements
Log RequestID for troubleshooting
Implement retry logic with exponential backoff
```

### 7. Performance Optimization
```
Use pagination for large result sets
Filter data on server side (not client)
Request only needed properties
Use batch operations when available
Monitor response times and optimize filters
```

---

## Testing Workflow

### 1. Development Environment

```
Use DEV Marketing Cloud instance
Test with sample/synthetic data
Validate request XML structure
Debug error responses
Verify token refresh logic
```

### 2. UAT Environment

```
Use UAT Marketing Cloud instance
Test with realistic data subset
Validate business logic end-to-end
Get stakeholder approval
Test error scenarios
```

### 3. Production Environment

```
Deploy with PROD credentials
Monitor performance under load
Implement comprehensive error handling
Establish monitoring and alerting
Create runbook for common issues
```

---

## Comparison: SOAP vs REST

| Aspect | SOAP | REST |
|--------|------|------|
| **Format** | XML Envelope | JSON / Form-data |
| **Learning Curve** | Steep | Gentle |
| **Payload Size** | Larger (XML wrapper) | Smaller |
| **Performance** | Slower | Faster |
| **Use Case** | Complex queries, legacy | Modern APIs |
| **Tool Support** | SoapUI, legacy tools | Postman, REST Client |
| **Error Details** | Detailed Fault structure | HTTP status codes |
| **Caching** | Not recommended | HTTP caching friendly |

**When to Use SOAP:**
- Legacy SFMCE systems
- Complex nested queries
- Detailed error handling needed
- Existing SOAP infrastructure

**When to Use REST:**
- New implementations
- Performance critical
- Simple CRUD operations
- Modern tool compatibility

---

## Common SOAP Errors

### Invalid Token (401)
```
Error: Invalid fueloauth header
Solution: Refresh OAuth token, verify it in envelope
```

### Property Not Found (400)
```
Error: The property does not exist
Solution: Check ObjectType properties in WSDL
```

### Object Not Found (404)
```
Error: Object ID not found
Solution: Verify ID/Name exists, check filter values
```

### Too Many Results (500)
```
Error: Result set too large
Solution: Add filter to reduce results, implement pagination
```

### Invalid XML Structure (400)
```
Error: Unable to parse XML
Solution: Validate XML syntax, check closing tags
```

---

## Tools & Resources

### SOAP Tools

**SoapUI**
- Specialized SOAP testing tool
- Free open-source and paid Pro versions
- WSDL import and auto-generate requests
- Download: https://www.soapui.org/

**Postman**
- Also supports SOAP (select "raw" body type → XML)
- Enterprise teams prefer REST
- Limited SOAP visualization

**VS Code Extensions**
- XML (RedHat) - XML validation and formatting
- Thunder Client - SOAP request builder
- REST Client - Can send SOAP with raw XML

### Official Resources

- [SFMCE SOAP API Documentation](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/soap_api.html)
- [SFMCE WSDL Reference](https://webservice.s7.exacttarget.com/Service.asmx?wsdl)
- [Marketing Cloud SOAP Developer Guide](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/soap_objects.html)

---

## Migration Path: SOAP to REST

If modernizing from SOAP to REST:

```
SOAP Retrieve          → REST GET (data endpoints)
SOAP Perform (start)   → REST POST (automation fire)
SOAP Execute (complex) → REST POST (data events)
```

See [REST_Examples](../REST_Examples/README.md) for modern REST equivalents.

---

## RETRIEVE DATA EXAMPLES

### Example 1: Get Automation ID by Name

```xml
<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Header>
        <fueloauth xmlms="http://exacttarget.com">{{TOKEN}}</fueloauth>
    </soapenv:Header>
    <soapenv:Body>
        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <RetrieveRequest>
                <ObjectType>Automation</ObjectType>
                <Properties>ProgramID</Properties>
                <Properties>Name</Properties>
                <Properties>CreatedDate</Properties>
                <Filter xsi:type="SimpleFilterPart">
                    <Property>Name</Property>
                    <SimpleOperator>equals</SimpleOperator>
                    <Value>{{Automation Name}}</Value>
                </Filter>
            </RetrieveRequest>
        </RetrieveRequestMsg>
    </soapenv:Body>
</soapenv:Envelope>
```

---

### Example 2: Get Data Extension Records with Filter

```xml
<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Header>
        <fueloauth xmlms="http://exacttarget.com">{{TOKEN}}</fueloauth>
    </soapenv:Header>
    <soapenv:Body>
        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <RetrieveRequest>
                <ObjectType>DataExtensionObject[{{Data Extension Key}}]</ObjectType>
                <Properties>Email</Properties>
                <Properties>FirstName</Properties>
                <Properties>LastName</Properties>
                <Filter xsi:type="SimpleFilterPart">
                    <Property>Email</Property>
                    <SimpleOperator>equals</SimpleOperator>
                    <Value>{{subscriber@example.com}}</Value>
                </Filter>
            </RetrieveRequest>
        </RetrieveRequestMsg>
    </soapenv:Body>
</soapenv:Envelope>
```

---

### Example 3: Query with Complex Filters (AND/OR)

```xml
<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Header>
        <fueloauth xmlms="http://exacttarget.com">{{TOKEN}}</fueloauth>
    </soapenv:Header>
    <soapenv:Body>
        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <RetrieveRequest>
                <ObjectType>DataExtensionObject[{{Data Extension Key}}]</ObjectType>
                <Properties>Email</Properties>
                <Properties>Name</Properties>
                <Properties>Region</Properties>
                <Filter xsi:type="ComplexFilterPart">
                    <LeftOperand xsi:type="SimpleFilterPart">
                        <Property>Status</Property>
                        <SimpleOperator>equals</SimpleOperator>
                        <Value>Active</Value>
                    </LeftOperand>
                    <LogicalOperator>AND</LogicalOperator>
                    <RightOperand xsi:type="SimpleFilterPart">
                        <Property>Region</Property>
                        <SimpleOperator>equals</SimpleOperator>
                        <Value>North America</Value>
                    </RightOperand>
                </Filter>
            </RetrieveRequest>
        </RetrieveRequestMsg>
    </soapenv:Body>
</soapenv:Envelope>
```

---

## PERFORM ACTIONS EXAMPLES

### Example 1: Fire Automation (All Steps)

```xml
<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope"
            xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing"
            xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    <s:Header>
        <a:Action s:mustUnderstand="1">Perform</a:Action>
        <a:To>{{soap-endpoint}}</a:To>
        <fueloauth xmlns="http://exacttarget.com">{{TOKEN}}</fueloauth>
    </s:Header>
    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <PerformRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <Action>start</Action>
            <Definitions>
                <Definition xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="Automation">
                    <ObjectID>{{Automation ID}}</ObjectID>
                </Definition>
            </Definitions>
        </PerformRequestMsg>
    </s:Body>
</s:Envelope>
```

---

### Example 2: Pause Automation

```xml
<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope"
            xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing"
            xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    <s:Header>
        <a:Action s:mustUnderstand="1">Perform</a:Action>
        <a:To>{{soap-endpoint}}</a:To>
        <fueloauth xmlns="http://exacttarget.com">{{TOKEN}}</fueloauth>
    </s:Header>
    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <PerformRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <Action>pause</Action>
            <Definitions>
                <Definition xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="Automation">
                    <ObjectID>{{Automation ID}}</ObjectID>
                </Definition>
            </Definitions>
        </PerformRequestMsg>
    </s:Body>
</s:Envelope>
```

---

### Example 3: Resume Automation

```xml
<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope"
            xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing"
            xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    <s:Header>
        <a:Action s:mustUnderstand="1">Perform</a:Action>
        <a:To>{{soap-endpoint}}</a:To>
        <fueloauth xmlns="http://exacttarget.com">{{TOKEN}}</fueloauth>
    </s:Header>
    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <PerformRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <Action>resume</Action>
            <Definitions>
                <Definition xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="Automation">
                    <ObjectID>{{Automation ID}}</ObjectID>
                </Definition>
            </Definitions>
        </PerformRequestMsg>
    </s:Body>
</s:Envelope>
```

---

### Example 4: Stop Automation

```xml
<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope"
            xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing"
            xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    <s:Header>
        <a:Action s:mustUnderstand="1">Perform</a:Action>
        <a:To>{{soap-endpoint}}</a:To>
        <fueloauth xmlns="http://exacttarget.com">{{TOKEN}}</fueloauth>
    </s:Header>
    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <PerformRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <Action>stop</Action>
            <Definitions>
                <Definition xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="Automation">
                    <ObjectID>{{Automation ID}}</ObjectID>
                </Definition>
            </Definitions>
        </PerformRequestMsg>
    </s:Body>
</s:Envelope>
```

---

## EXECUTE QUERIES EXAMPLES

### Example 1: Count Records Without Retrieval

```xml
<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Header>
        <fueloauth xmlms="http://exacttarget.com">{{TOKEN}}</fueloauth>
    </soapenv:Header>
    <soapenv:Body>
        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <RetrieveRequest>
                <ObjectType>DataExtensionObject[{{Data Extension Key}}]</ObjectType>
                <Filter xsi:type="SimpleFilterPart">
                    <Property>Status</Property>
                    <SimpleOperator>equals</SimpleOperator>
                    <Value>Active</Value>
                </Filter>
            </RetrieveRequest>
        </RetrieveRequestMsg>
    </soapenv:Body>
</soapenv:Envelope>
```

**Tip:** Omitting Properties returns only count. Much faster than retrieving all records.

---

### Example 2: Query with IN Operator (Multiple Values)

```xml
<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Header>
        <fueloauth xmlms="http://exacttarget.com">{{TOKEN}}</fueloauth>
    </soapenv:Header>
    <soapenv:Body>
        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <RetrieveRequest>
                <ObjectType>DataExtensionObject[{{Data Extension Key}}]</ObjectType>
                <Properties>Email</Properties>
                <Properties>Region</Properties>
                <Properties>Status</Properties>
                <Filter xsi:type="SimpleFilterPart">
                    <Property>Region</Property>
                    <SimpleOperator>in</SimpleOperator>
                    <Value>North America</Value>
                    <Value>South America</Value>
                    <Value>Europe</Value>
                </Filter>
            </RetrieveRequest>
        </RetrieveRequestMsg>
    </soapenv:Body>
</soapenv:Envelope>
```

---

### Example 3: Date Range Query (BETWEEN)

```xml
<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Header>
        <fueloauth xmlms="http://exacttarget.com">{{TOKEN}}</fueloauth>
    </soapenv:Header>
    <soapenv:Body>
        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <RetrieveRequest>
                <ObjectType>DataExtensionObject[{{Data Extension Key}}]</ObjectType>
                <Properties>Email</Properties>
                <Properties>FirstName</Properties>
                <Properties>JoinedDate</Properties>
                <Filter xsi:type="ComplexFilterPart">
                    <LeftOperand xsi:type="SimpleFilterPart">
                        <Property>JoinedDate</Property>
                        <SimpleOperator>greaterThan</SimpleOperator>
                        <Value>2024-01-01</Value>
                    </LeftOperand>
                    <LogicalOperator>AND</LogicalOperator>
                    <RightOperand xsi:type="SimpleFilterPart">
                        <Property>JoinedDate</Property>
                        <SimpleOperator>lessThan</SimpleOperator>
                        <Value>2024-12-31</Value>
                    </RightOperand>
                </Filter>
                <Options>
                    <RequestType>Paginated</RequestType>
                </Options>
                <PageSize>500</PageSize>
            </RetrieveRequest>
        </RetrieveRequestMsg>
    </soapenv:Body>
</soapenv:Envelope>
```

---

## Last Updated
December 2025

## Examples Based On
Salesforce Marketing Cloud Engagement (SFMCE) SOAP API v1.0
Legacy and Regional Endpoints
