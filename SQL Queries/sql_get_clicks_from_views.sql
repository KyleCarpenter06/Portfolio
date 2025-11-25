SELECT 
a.PeopleLeaderEmailAddress AS SubscriberKey,
CASE WHEN b.SubscriberKey IS NOT NULL
    THEN 'TRUE'
    ELSE 'FALSE'
END AS IsCompleted
FROM [LES Wave 1 Leaders] a
FULL OUTER JOIN
(

SELECT DISTINCT
[_click].[SubscriberKey],
[_click].[LinkName]
FROM [_click]
WHERE 
([_click].[JobID] = 2422111 AND [_click].[LinkName] = 'confirm button')
OR ([_click].[JobID] = 2422112 AND [_click].[LinkName] = 'confirm button')
OR ([_click].[JobID] = 2435030 AND [_click].[LinkName] = 'confirm button')
GROUP BY [SubscriberKey], [LinkName]

) AS b
ON a.PeopleLeaderEmailAddress = b.SubscriberKey