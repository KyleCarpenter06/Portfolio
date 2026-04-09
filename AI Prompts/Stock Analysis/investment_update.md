## 📖 Overview

When Kyle uploads or pastes a CSV of investment positions, read it and update matching rows in the All Positions database.

## 📥 Input requirements (CSV)

- The user must provide a CSV file or paste CSV text.
- The user must explicitly state in the text box which account type (Core, Trad IRA, Roth IRA)
    - Accept multiple CSVs in the same input, if there are multiple CSVs, each file needs to be explicitly named, otherwise DO NOT CONTINUE and get additional input from the user, set the account types accordingly based off each file
    - If the input does not include account type, then look at the file name to see which account, if the type of account is not clear, DO NOT CONTINUE
- The CSV must include a column that uniquely identifies a position. The default will be “Symbol” unless the user specifically wants another unique identifier.
    - Preferred: `Symbol`
    - Acceptable fallback: `Name`

## 🔎 Matching logic

1. Load the All Positions database.
2. For each CSV row, find a matching database row:
    - Match on `Symbol` if present.
    - Otherwise match on `Name`.
3. If no match is found for a CSV row, do the following:
    1. Create a new position in the database
    2. Mark status as Active
    3. Research/Determine the name, sector, subsector & holding type from the stock symbol
4. After processing a given account’s CSV, mark any rows in the database with that same **Account Type** that are **NOT present in that CSV** as **Sold** (do not mark rows from other account types as Sold).
5. Map symbols like this:
    - `Symbol` → **Symbol**
    - `Total Cost` → **Cost**
    - `Net Liq` → **Liquidity**
    - `Tech Score` → **Technical Score (if the score is NaN, skip this cell)**

## ✍️ What to update

- Only update fields that are explicitly present in the CSV columns.
- Never blank out an existing Notion value unless the CSV cell is explicitly empty and the user asked to clear fields.
- Allowed fields to update (if present as CSV columns):
    - Symbol
    - Name
    - Status
    - Account Type
    - Holding Type
    - Sector
    - Sub-Sector
    - Cost
    - Liquidity
    - Technical Score
    - AI Score

## ✅ Validation

- For select fields, only write values that exactly match existing options:
    - Status: Active, Considering, Sold
    - Account Type: Core, Trad IRA, Roth IRA
    - Holding Type: Reserve, ETF, Equity
    - Sector: Communication, Technology, Staples, Discretionary, Financials, Healthcare, Utilities, Industrials, Materials, Energy, Bonds, ETF, Money Market
- If a value does not match an option, skip that cell and report it back to user
- For numbers, parse common formats (percent signs for Technical Score, dollar signs/commas for Cost and Liquidity).

## 📤 Output

After processing, respond with:

- Count of rows updated
- List of new additions and subtractions
- List of skipped cells (with reason)

## 🦮 If you are unsure

Ask the user which column should be treated as the unique identifier and which fields they want updated.