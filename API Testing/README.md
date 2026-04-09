# API Testing Guide - Postman & OAuth 2.0

This folder contains guidance for API testing workflows, environment management, and authentication for both REST and SOAP integrations. The document is intentionally concise — see individual example folders for runnable requests.

## Table of Contents

1. [API example folders](#api-example-folders)
2. [UAT vs Production Testing](#uat-vs-production-testing)
3. [OAuth 2.0 Setup](#oauth-20-setup)
4. [Postman Setup](#postman-setup)

## API example folders

- REST: Modern HTTP/JSON endpoints for data operations and Journey Builder events. Use REST where official endpoints exist and are documented.
- SOAP: Legacy XML-based API used for features not covered by REST. Critically, Automation Studio automations must be started via the SOAP `Perform` action (Retrieve + Perform); REST attempts to start automations rely on undocumented endpoints and are not supported. See `./SOAP_Examples/README.md` for SOAP automation examples.

## Development, UAT, and Production Testing

- Development: Use a local or dev environment to iterate quickly. Typical practices include testing with synthetic/scrubbed data, using DEV authentication credentials, verifying request/response formats, and debugging error responses.
- UAT: Use a dedicated UAT environment with scrubbed or synthetic data to validate business logic, mappings, and error handling. This environment lets teams test flows and approvals without risk to production data.
- Production: Use production only after UAT validation. Production testing verifies performance, capacity, and real-world integrations. Protect production with strict monitoring, limited access, and rollback plans.

## OAuth 2.0 Setup

- Importance: OAuth 2.0 issues short-lived tokens for secure access. Proper setup is essential to avoid unauthorized access and to support token rotation and auditing.
- Prerequisites: Obtain Client ID and Client Secret for an API integration, determine the token endpoint and API base URL, and ensure the integration has the required scopes/permissions.
- Troubleshooting: `401` commonly indicates expired/invalid tokens—check environment variables, confirm grant type and client credentials, and verify the correct token endpoint/subdomain.

## Postman Setup

- Use separate Postman environments (Dev, UAT, Prod) and store variables like `base_url`, `client_id`, `client_secret`, `auth_token_url`, and `access_token` in the environment.
- Mark sensitive variables as secret and keep credentials in the environment `Current Value` only. Use a collection-level authorization or a pre-request token fetch to ensure requests run with a valid token.
- Never store production secrets in shared collections or commit environment files containing secrets to version control.

---

For Automation Studio firing, see: `./SOAP_Examples/README.md`.

Last updated: 2026-04-09