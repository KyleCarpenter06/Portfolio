<script runat="server">
  Platform.Load("Core", "1.1.1");

  var subscribers = [
 {
   "Email": "melder@janimm.com",
   "SubscriberKey": "melder@janimm.com"
 },
 {
   "Email": "achand73@its.jnj.com",
   "SubscriberKey": "achand73@its.jnj.com"
 },
 {
   "Email": "wmasinda@its.jnj.com",
   "SubscriberKey": "wmasinda@its.jnj.com"
 },
 {
   "Email": "HAkkaya1@ITS.JNJ.com",
   "SubscriberKey": "HAkkaya1@ITS.JNJ.com"
 }
]
  var status = "Active";

  for (var i = 0; i < subscribers.length; i++) {
    var sub = subscribers[i];
    try {
      var updateSub = {
        "EmailAddress": sub.EmailAddress,
        "SubscriberKey": sub.SubscriberKey,
        "Status": status
      };

      var prox = new Script.Util.WSProxy();
      var response = prox.updateItem("Subscriber", updateSub);

      if (response && response.Status == "OK" && response.Results && response.Results.length > 0 && response.Results[0].StatusCode == "OK") {
        Write("The status of the subscriber with SubscriberKey " + sub.SubscriberKey + " has been updated to " + status + ".<br>");
      } else {
        Write("Error updating the status of the subscriber with SubscriberKey " + sub.SubscriberKey + ".<br>");
      }
    } catch (e) {
      Write("Exception updating the status of the subscriber with SubscriberKey " + sub.SubscriberKey + ": " + e.message + ".<br>");
    }
  }
</script>