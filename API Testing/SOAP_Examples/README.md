# Triggering Automation Studio Automations via SOAP API

This README replaces the previous content with a focused, practical guide for reliably starting Automation Studio automations using the Fuel SOAP API. The REST API has no officially supported endpoint for firing Automation Studio automations on demand; any REST-based approach relies on undocumented, community-discovered endpoints that may break without notice. For stable, supported integration (for example, invoking an automation from Power Automate after external processing completes), use the SOAP API.

## Why SOAP is used here

I used the SOAP API to trigger Marketing Cloud automations from Power Automate when a specific task completes outside Marketing Cloud (for example, a file upload to SharePoint). Power Automate runs data cleansing and segmentation, then calls Marketing Cloud to run the automation. The only official and stable method to interact with Automation Studio programmatically is through SOAP's `Perform` action; REST endpoints that attempt the same are undocumented and unsupported.

## The Two-Step SOAP Process to Fire an Automation

Your memory is correct — starting an Automation via the Fuel SOAP API is a two-step process using the `Retrieve` and `Perform` operations. This mirrors clicking "Run Once" in the Automation Studio UI.

### Step 1 — Retrieve the Automation Name/ObjectID

Use a `Retrieve` SOAP call to look up the Automation and return the `ObjectID` (and `Name`) required for the `Perform` call.

```xml
<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                                    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Header>
        <fueloauth xmlns="http://exacttarget.com">YOUR_ACCESS_TOKEN</fueloauth>
    </soapenv:Header>
    <soapenv:Body>
        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <RetrieveRequest>
                <ObjectType>Automation</ObjectType>
                <Properties>Name</Properties>
                <Properties>ObjectID</Properties>
                <Properties>CustomerKey</Properties>
                <Filter xsi:type="SimpleFilterPart">
                    <Property>ObjectID</Property>
                    <SimpleOperator>equals</SimpleOperator>
                    <Value>YOUR-AUTOMATION-ID-HERE</Value>
                </Filter>
            </RetrieveRequest>
        </RetrieveRequestMsg>
    </soapenv:Body>
</soapenv:Envelope>
```

The response will return the `ObjectID` and `Name` used in Step 2.

Note from official docs: if you cannot locate the NewObjectID or need an ID for a UI-created automation, Salesforce recommends contacting Customer Support to retrieve the ID. In practice, the `Retrieve` call above usually returns the necessary values for automations created through the web interface.

### Step 2 — Fire the Automation with Perform

Use the `ObjectID` from Step 1 in a `Perform` SOAP action to start the automation.

```xml
<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                                    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Header>
        <fueloauth xmlns="http://exacttarget.com">YOUR_ACCESS_TOKEN</fueloauth>
    </soapenv:Header>
    <soapenv:Body>
        <PerformRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <Action>start</Action>
            <Definitions>
                <Definition xsi:type="Automation">
                    <ObjectID>YOUR-AUTOMATION-OBJECTID</ObjectID>
                </Definition>
            </Definitions>
        </PerformRequestMsg>
    </soapenv:Body>
</soapenv:Envelope>
```

## Endpoint and SOAPAction

- SOAP endpoint: `https://{{subdomain}}.soap.marketingcloudapis.com/Service.asmx`
- SOAPAction header values:
    - Step 1 (Retrieve): `Retrieve`
    - Step 2 (Perform): `Perform`

Use the OAuth access token in the `fueloauth` SOAP header as shown in the examples above. This two-step pattern is the supported, documented way to programmatically start Automation Studio automations from external systems.

---

## OTHER SOAP API EXAMPLES

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

### Official Resources

- [SFMCE SOAP API Documentation](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/soap_api.html)
- [SFMCE WSDL Reference](https://webservice.s7.exacttarget.com/Service.asmx?wsdl)
- [Marketing Cloud SOAP Developer Guide](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/soap_objects.html)

---

## Last Updated
April 2026

## Examples Based On
Salesforce Marketing Cloud Engagement (SFMCE) SOAP API v1.0
Legacy and Regional Endpoints
