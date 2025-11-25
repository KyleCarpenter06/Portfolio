SELECT DISTINCT
    users.Email,
    jnj.FirstName,
    jnj.Region,
    'TO' as SendType,
    jnj.Language11 as Language,
    users.InstallDate as EnableDate,
    CASE 
		WHEN CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time') =
		DATEADD(DAY, -8, users.InstallDate)
        THEN 'T-7'
		WHEN CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time') =
		DATEADD(DAY, -2, users.InstallDate)
		THEN 'T-1'
        ELSE 'Error'
    END as TMinusType,
    DATEADD(DAY, 1, CONVERT(DATETIME, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')) as SendDate
FROM [WinHello_W11_IPUpgrade_API] as users
LEFT JOIN [Master_JNJ_DL_DataLake] as jnj
    ON users.Email = jnj.Email
LEFT JOIN [Ritas_VIP_List] as vip
    ON users.Email = vip.Email
WHERE
    (
        CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time') = DATEADD(DAY, -8, users.InstallDate) OR
		CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time') = DATEADD(DAY, -2, users.InstallDate)
	)
	AND users.Ready = 'True' 
    AND users.Email IS NOT NULL
    AND jnj.Email IS NOT NULL
	AND vip.Email IS NULL
	AND (JobGroup NOT IN ('EC') OR JobGroup IS NULL)