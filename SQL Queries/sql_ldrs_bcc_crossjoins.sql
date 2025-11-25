--make SQL much smaller, remove most columns and multiple cross joins

SELECT DISTINCT
    bccldrs.Email,
	phase.EmailPhase,
	phase.MigrationDate,
	phase.DeviceType,
	phase.ReplacementType,
	phase.CompanyName,
	jnj.FirstName,
	phase.MobileNumber,
	jnj.Language11 AS Language,
	phase.SecondaryEmailAddress,
	phase.JNJEmailAddress,
	phase.ShippingAddress,
	phase.ShipToPreference,
	phase.LocalContactName,
	phase.FacilityName,
	phase.ExtraColumns,
    bccldrs.SendType
FROM 
    (
		SELECT Email, 'BCC' as SendType FROM [Shockwave_DeviceMigration_BCC]
		UNION ALL
		SELECT Email, 'Leadership' as SendType FROM [SFMC_Leadership]
	) as bccldrs
LEFT JOIN
    [Master_JNJ_DL_DataLake_NEW] AS jnj
    ON bccldrs.Email = jnj.Email
CROSS JOIN
    (
		SELECT TOP 1 
			'SHOCK_SchedInvite' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_SchedInvite'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_SchedInvite'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_SchedRemind' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_SchedRemind'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_SchedRemind'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_SchedAuto' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_SchedAuto'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_SchedAuto'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_SchedConfirm' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_SchedConfirm'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_SchedConfirm'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_SchedFixed' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_SchedFixed'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_SchedFixed'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_LastChance' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_LastChance'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_LastChance'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_LegalHold' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_LegalHold'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_LegalHold'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_OneMonth' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_OneMonth'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_OneMonth'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_MigStart' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_MigStart'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_MigStart'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_DevShipped' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_DevShipped'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_DevShipped'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_TPriorStopWork' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_TPriorStopWork'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_TPriorStopWork'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_EmlODComplete' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_EmlODComplete'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_EmlODComplete'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_WelcometoJnJTech' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_WelcometoJnJTech'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_WelcometoJnJTech'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_MigStalled01' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_MigStalled01'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_MigStalled01'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_MigStalled02' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_MigStalled02'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_MigStalled02'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_MigAdminResch' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_MigAdminResch'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_MigAdminResch'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_MigAdminCancel' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_MigAdminCancel'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_MigAdminCancel'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_PostSupport' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_PostSupport'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_PostSupport'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_PostReturnDevice' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_PostReturnDevice'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_PostReturnDevice'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
		
		UNION ALL
		
		SELECT TOP 1 
			'SHOCK_PostFinalReturnDevice' AS EmailPhase,
			jb.MigrationDate,
			jb.DeviceType,
			jb.ReplacementType,
			jb.CompanyName,
			jb.MobileNumber,
			jb.SecondaryEmailAddress,
			jb.JNJEmailAddress,
			jb.ShippingAddress,
			jb.ShipToPreference,
			jb.LocalContactName,
			jb.FacilityName,
			jb.ExtraColumns,
			jb.SendDate
		FROM
			[Shockwave_DeviceMigration_JB] AS jb
		WHERE 
			CONVERT(DATE, jb.SendDate) = CONVERT(DATE, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')
			AND jb.EmailPhase = 'SHOCK_PostFinalReturnDevice'
		AND NOT EXISTS 
		(
			SELECT 1
			FROM [Shockwave_DeviceMigration_JB] AS jb2
			WHERE 
				jb2.EmailPhase = 'SHOCK_PostFinalReturnDevice'
				AND DATEPART(WEEK, jb2.SendDate) = DATEPART(WEEK, jb.SendDate)
				AND DATEPART(YEAR, jb2.SendDate) = DATEPART(YEAR, jb.SendDate)
				AND jb2.SendDate < jb.SendDate
		)
    ) AS phase
WHERE
	jnj.Email IS NOT NULL
	AND bccldrs.Email IS NOT NULL