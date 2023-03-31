const mailchimp = require("@mailchimp/mailchimp_marketing");
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

const MAPI_KEY = process.env.API_KEY
const MLIST_ID = process.env.LIST_ID
const MAPI_SERVER = process.env.API_SERVER

app.post("/", function(req, res){
    var fName = req.body.fName;
    var lName = req.body.lName;
    var email = req.body.email;

//Setting up MailChimp
    mailchimp.setConfig({
      apiKey: MAPI_KEY,
      server: MAPI_SERVER,
    });
app.post("/failure", function(req,res){
  res.redirect("/");
})
    const list_id = MLIST_ID;
    const run = async () => {
        const response = await mailchimp.lists.batchListMembers(list_id, {
          members: [{
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:fName,
                LNAME:lName
            }
          }],
        });

      }
      function successCallback(result) {
        res.sendFile(__dirname + '/success.html')

    }
    function failureCallback(error) {
        res.sendFile(__dirname + '/failure.html')

    }


    run().then(successCallback, failureCallback);


});

app.listen(process.env.PORT || 3000, function(){
    console.log('server is running at 3000');
});
