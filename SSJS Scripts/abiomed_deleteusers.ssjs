<script runat="server">

Platform.Load("Core", "1");

var deleteUsersDE = DataExtension.Init("Abiomed_SharedData_DeleteUsers_UAT");
var filter = {Property: "Updated", SimpleOperator: "equals", Value: "false"}
var data = deleteUsersDE.Rows.Retrieve(filter);

for (var i=0; i < data.length; i++) {

    var SiteName = data[i].SiteName;
    var Email = data[i].Email;
    var rowDelete = Platform.Function.DeleteData('Abiomed_SharedData_SiteUsers_UAT',['SiteName', 'Email'],[SiteName, Email]);

    deleteUsersDE.Rows.Update({Updated:'true'}, ['SiteName', 'Email'], [SiteName, Email]);

    Write("Removed: SiteName=" + SiteName + " Email=" + Email + "<br>")
}

</script>