# AMPScript Code - Salesforce Marketing Cloud Email Templates

This folder contains production-ready AMPScript code blocks used in Salesforce Marketing Cloud Engagement (SFMCE) email templates. These blocks handle dynamic personalization, multilingual content delivery, data processing, and responsive email rendering.

## Overview

AMPScript is Salesforce Marketing Cloud's proprietary personalization language that allows for dynamic content manipulation within email templates. The blocks in this folder are designed to be modular and reusable across multiple email campaigns.

---

## File Descriptions

### Core Configuration & Settings

| File | Purpose |
|------|---------|
| **ampscript_language_toggle_settings.amp** | Language configuration and initialization block. Manages 22+ language toggles, date formatting, locale-specific settings, and PDF content text. Sets @langShortName, @languageCode, and @languageLocalFormat variables based on subscriber language preference with English fallback. |
| **ampscript_data_block.amp** | Subscriber and campaign data initialization. Retrieves attribute values for first name, device type, wave/stage information, and formats them for use throughout the template. Establishes foundational variables consumed by all other blocks. |

### Content Retrieval & Processing

| File | Purpose |
|------|---------|
| **ampscript_body_blocks_loop.amp** | Campaign path configuration and subject/preheader retrieval. Sets @subPath and @campaignName variables, then retrieves language-specific subject line and preheader content from Content Builder with English fallback mechanism. |
| **ampscript_content_blocks.amp** | Dynamic content block retriever. Loops through numbered P-blocks (1 through @ammountOfBlocks), retrieves language-specific content from Content Builder with automatic English fallback for missing translations. |
| **ampscript_extra_columns_block.amp** | JSON data parser for extra subscriber columns. Parses ExtraColumns attribute containing JSON data, extracts specific fields (SoftphoneNumber, Buddy, Conference), and declares them as variables for use in template. Handles missing fields gracefully. |
| **ampscript_footer_block.amp** | Legal footer content retriever. Retrieves language-specific footer content (legal disclaimers, compliance text) from Content Builder with English fallback. |
| **ampscript_presalutation_block.amp** | Pre-salutation introductory content. Retrieves language-specific pre-salutation content that displays before the main greeting, with English fallback. |

### Personalization & Greetings

| File | Purpose |
|------|---------|
| **ampscript_hi_block_raw.amp** | Simple personalized greeting in plain text. Displays "Hello [First Name]" using raw AMPScript variable substitution without HTML formatting. |
| **ampscript_hi_block.amp** | Formatted personalized greeting block. Displays subscriber name in a responsive HTML table structure with language-specific greeting content from Content Builder, with English fallback. |

### Email Header & Special Handling

| File | Purpose |
|------|---------|
| **ampscript_subject_preheader_block.amp** | Email subject line and preheader initialization. Sets static subject line, preview text (shown in email client preview pane), and banner messaging used in email header. |
| **ampscript_bcc_leaders_block.amp** | Leadership/BCC notification handling. Detects if email type is "bcc" or "leadership", adds subject line prefix, and conditionally displays notice block with management contact information. |

### Language Selection Interface

| File | Purpose |
|------|---------|
| **ampscript_language_toggle_display.amp** | Language selection toggle display. Renders clickable language links for 22+ languages (English, German, French, Spanish, Italian, Portuguese, Japanese, Korean, Chinese Simplified/Traditional, Russian, Dutch, Czech, Greek, Hebrew, Polish, Swedish, Thai, Turkish, Ukrainian, Indonesian, Malay, Vietnamese) with RedirectTo URLs pointing to language-specific PDF files. Uses HTML entities for international character rendering. |

---

## Table of Contents

1. [Language & Localization](#language--localization)
2. [Data & Configuration](#data--configuration)
3. [Content Retrieval](#content-retrieval)
4. [Email Structure & Display](#email-structure--display)

### Language & Localization

- [ampscript_language_toggle_settings.amp](#ampscript_language_toggle_settingsamp) - Language configuration and locale settings
- [ampscript_language_toggle_display.amp](#ampscript_language_toggle_displayamp) - Language selection interface with 22+ languages

### Data & Configuration

- [ampscript_data_block.amp](#ampscript_data_blockamp) - Subscriber attribute initialization
- [ampscript_extra_columns_block.amp](#ampscript_extra_columns_blockamp) - JSON parsing for extra column data
- [ampscript_subject_preheader_block.amp](#ampscript_subject_preheader_blockamp) - Email header metadata

### Content Retrieval

- [ampscript_body_blocks_loop.amp](#ampscript_body_blocks_loopamp) - Campaign path and email header content
- [ampscript_content_blocks.amp](#ampscript_content_blocksamp) - Dynamic content block retrieval
- [ampscript_footer_block.amp](#ampscript_footer_blockamp) - Footer and legal content
- [ampscript_presalutation_block.amp](#ampscript_presalutation_blockamp) - Pre-greeting introduction

### Email Structure & Display

- [ampscript_hi_block.amp](#ampscript_hi_blockamp) - Formatted greeting with HTML structure
- [ampscript_hi_block_raw.amp](#ampscript_hi_block_rawamp) - Simple text greeting
- [ampscript_bcc_leaders_block.amp](#ampscript_bcc_leaders_blockamp) - Leadership notification handling

---

## Key Features

### Multilingual Support
- 22+ supported languages with individual enable/disable flags
- Automatic English fallback for missing translations
- HTML entity encoding for international character compatibility with email service providers
- Locale-specific date formatting for each language region

### Content Builder Integration
- Dynamic content retrieval using folder path structure
- Language-based content organization: `/basePath/subPath/[LanguageCode]/`
- Numbered content blocks (P1, P2, P3, etc.) for campaign-specific messaging
- Flexible content inheritance with fallback mechanisms

### Responsive Design
- HTML tables with proper structure for email client compatibility
- Supported by major ESPs (Salesforce SFMC, HubSpot, Marketo, etc.)
- Mobile-friendly responsive design patterns

### Data Processing
- JSON parsing for complex attribute data
- Subscriber attribute extraction and formatting
- Safe field handling with graceful degradation

---

## Variable Dependencies

### Global Variables (Set in Language Settings)
- `@langShortName` - Language code (EN, DE, FR, ES, IT, PT, JA, KO, ZH, etc.)
- `@languageCode` - Locale code (en-US, de-DE, fr-FR, etc.)
- `@languageLocalFormat` - Language-specific date format pattern

### Global Variables (Set in Data Block)
- `@firstName` - Subscriber first name (formatted with ProperCase)
- `@deviceType` - Type of device/equipment
- `@wave` - Campaign wave/stage information

### Global Variables (Set in Body Blocks Loop)
- `@subPath` - Campaign subfolder path
- `@campaignName` - Campaign identifier
- `@subject` - Email subject line

### Output Variables
- `@preSalutation` - Pre-greeting content
- `@hiContent` - Greeting content
- `@LegalFooter` - Footer/legal content
- `@migrationDate` - Formatted date
- Various language-specific variables for toggles and PDF names

---

## Best Practices

1. **Always Set Variables First** - Ensure language and data blocks execute before content retrieval blocks
2. **Use Fallbacks** - ContentBlockByName always includes English fallback as last parameter
3. **PII Protection** - Replace specific names/emails with generic placeholders in production
4. **Test Locales** - Verify date formatting and special characters render correctly in target email clients
5. **Monitor Performance** - Nested ContentBlockByName calls can impact template rendering time; cache when possible

---

## Last Updated
December 2025