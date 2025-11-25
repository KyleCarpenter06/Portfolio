<script runat="server">

    // load javascript core
    Platform.Load("Core", "1.1.5");

    // global variables
    var clientid = "28051afd130f4dd0ae80635f2f864db0";
    var clientsecret = "Nk7dica67IuggR8Hv6elzbBnm7bNF-ObtyfJTbrahpwV582JVq_0NY34xnhwp1Hw";
    var baseURI = "https://jnj.api.us.nexthink.cloud/api/v1";
    var apiToken;
    var userSIDS = [];
    var outputArr = [];

    // output variables
    var outputResp;
    var outputType;
    var outputCode;
    var outputDate = new Date();

    // set hours to hours +1 to account for CST to EST conversion
    outputDate.setHours(outputDate.getHours() + 1);

    // call initial function
    getAPIToken();

    // call output table function
    outputTable();

    // try/catch function to get API token
    function getAPIToken()
    {
        try
        {
            // setup API token call
            var credentials = clientid + ":" + clientsecret;
            var base64Credentials = Base64Encode(credentials);
            var req = new Script.Util.HttpRequest(baseURI + "/token");
            req.emptyContentHandling = 0;
            req.retries = 2;
            req.continueOnError = true;
            req.setHeader("Authorization", "Basic " + base64Credentials);
            req.method = "POST";
            req.contentType = "application/json";
            req.encoding = "UTF-8";

            // perform API call
            var res = req.send();

            // get API response, set parameters for output
            var string = String(res.content);
            outputResp = apiToken = Platform.Function.ParseJSON(string).access_token;
            outputType = "Token";
            outputCode = res.statusCode;

            // output success log message
            outputLog();

            // call next api function
            getSID();
        }
        catch (err)
        {
            // output log error
            outputResp = err.message;
            outputType = "Token";
            outputCode = "Error";
            outputLog();
        }
    }

    // try/catch function to get SID from email
    function getSID()
    {
        try
        {
            // insert API body (payload)
            var payload = {
                "queryId": "#jjt_communication_1",
                "parameters": {
                    "email": "kcarpen7@its.jnj.com"
                }
            }

            // setup API get SID call
            var req = new Script.Util.HttpRequest(baseURI + "/nql/execute");
            req.emptyContentHandling = 0;
            req.retries = 2;
            req.continueOnError = true;
            req.setHeader("Authorization", "Bearer " + apiToken);
            req.method = "POST";
            req.contentType = "application/json";
            req.encoding = "UTF-8";
            req.postData = Stringify(payload);

            // perform API call
            var res = req.send();

            // get API response, set parameters for output
            outputType = "Get SID";
            outputCode = res.statusCode;

            // get JSON object, for each output place into array
            var string = String(res.content);
            var sidData = Platform.Function.ParseJSON(string);
            for (var i = 0; i < sidData.data.length; i++)
            {
                userSIDS.push(sidData.data[i][1]);
            }
            outputResp = userSIDS;

            // test variable result
            Variable.SetValue("@Result",userSIDS);

            // output success log message
            outputLog();

            // call next api function
            triggerCampaign();
        }
        catch (err)
        {
            // output log error
            outputResp = err.message;
            outputType = "Get SID";
            outputCode = "Error";
            outputLog();
        }
    }

    // try/catch function to get trigger campaign
    function triggerCampaign()
    {
        try
        {
            // insert API body (payload)
            var payload = {
                "campaignNqlId": "#jjt_comm_test_with_params",
                "userSid": userSIDS,
                "expiresInMinutes": 1440,
                "parameters": {
                    "name": "Some value",
                    "content": "In an effort to ensure there are available Zoom licenses for those who regularly use the meeting platform, we have identified a number of accounts that have not logged into or scheduled any virtual meetings through Zoom for 12 months or longer.<b>TEST</b><br><a href='https://click.inform.jnj.com/?qs=48ec61fdd0ce37b678b1d5477ae4ba5854ee65f97b349e26fa93485a119810d933da4c473fb798e51ab25e4d44aaf26f024b1ef6b40c1aa1'>TEST</a>"
                }
            }

            // setup API trigger campaign call
            var req = new Script.Util.HttpRequest(baseURI + "/euf/campaign/trigger");
            req.emptyContentHandling = 0;
            req.retries = 2;
            req.continueOnError = true;
            req.setHeader("Authorization", "Bearer " + apiToken);
            req.method = "POST";
            req.contentType = "application/json";
            req.encoding = "UTF-8";
            req.postData = Stringify(payload);

            // perform API call
            var res = req.send();

            // get API response, set parameters for output
            outputResp = String(res.content);
            outputType = "Campaign";
            outputCode = res.statusCode;

            // output success log message
            outputLog();
        }
        catch (err)
        {
            // output log error
            outputResp = err.message;
            outputType = "Campaign";
            outputCode = "Error";
            outputLog();
        }
    }

    // output console log function
    function outputLog()
    {
        try
        {
            // get DE in SFMC
            var debugDEKey = "C4F23647-FC96-48EC-BAF3-0FDD435C9D51";
            var debugDE = DataExtension.Init(debugDEKey);
            var logtoinsert =
            {
                Response: outputResp,
                Type: outputType,
                Code: outputCode,
                Date: outputDate
            }

            // insert log data into log DE
            var addLog = debugDE.Rows.Add(logtoinsert);

            var tableOutput = "<table>" + "\n";
            tableOutput += "<tr>";
            tableOutput += "<td><abbr title='" + outputResp + "'>" + outputResp + "</abbr></td>";
            tableOutput += "<td>" + outputType + "</td>";
            tableOutput += "<td>" + outputCode + "</td>";
            tableOutput += "<td>" + outputDate + "</td>";
            tableOutput += "</tr>";
            tableOutput += "\n" + "<table>";

            // write HTML in cloud page
            Write(tableOutput);
        }
        catch (err)
        {
            // output table if basic fails
            Write("<table><tr><td>Output DE Log Error</td></tr></table>");
        }
    }

    // output table with values from output array
    function outputTable()
    {
        try
        {
            // loop through array
            for (var i in outputArr)
            {
                if (i = 1)
                {
                    Write("<table>" + "\n");
                }

                Write("<tr><td>" + outputArr[i]["response"] + "</td><td>" + outputArr[i]["type"] + "</td><td>" + outputArr[i]["code"] + "</td><td>" + outputArr[i]["date"] + "</td></tr>" + "\n");

                if (i = outputArr.length)
                {
                    Write("\n" + "</table>");
                }
            }
        }
        catch (err)
        {
            // output table if basic fails
            Write("<table><tr><td>Output HTML Table Error</td></tr></table>");
        }
    }

</script>