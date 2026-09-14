var accountField = ZDK.Page.getField("Account_Name");
var contactField = ZDK.Page.getField("Contact_Name");

var accountValue = accountField ? accountField.getValue() : null;
var contactValue = contactField ? contactField.getValue() : null;

var linkedId = null;
var linkedModule = null;

if (accountValue && accountValue.id) {
    linkedId = accountValue.id;
    linkedModule = "Accounts";
} else if (contactValue && contactValue.id) {
    linkedId = contactValue.id;
    linkedModule = "Contacts";
} else {
    ZDK.Client.showAlert("This Deal has no linked Account or Contact.");
    return false;
}

console.log("Linked ID:", linkedId, "Module:", linkedModule);

//-------------------------------------------------------------------------
// Search customer record by ID in Zoho Books
//-------------------------------------------------------------------------
zrc.get("https://www.zohoapis.com/books/v3/contacts", {
    connection: "zohobooksconnection",
    params: {
        organization_id: "750664475",
        zcrm_account_id: linkedId
    }
}).then(function(response) {
    var contacts = response.data.contacts;

    if (contacts && contacts.length > 0) {
        var customerId = contacts[0].contact_id;

        // Just open the new-quote page — user fills in/reviews the rest manually
        var quoteUrl = "https://books.zoho.com/app/750664475#/quotes/new?contact_id=" + customerId;
        $Client.openURL(quoteUrl);

    } else {
        ZDK.Client.showAlert("No matching customer found in Zoho Books.");
    }
}).catch(function(error) {
    console.log("ZRC error:", error);
    ZDK.Client.showAlert("Something went wrong: " + JSON.stringify(error));
});