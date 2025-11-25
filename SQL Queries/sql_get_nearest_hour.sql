SELECT
AutomationKey,
DataTable,
DATEADD(HOUR, DATEDIFF(HOUR, 0, GETDATE()), 0) AS LastRunDate
FROM AutomationRunHistory
WHERE AutomationKey='PowerAutomate_automation' AND DataTable = 'Click'