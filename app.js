
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
const port = process.env.PORT || 3000;

// path required
require("dotenv").config({ path : "vars/.env"})

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))


app.get("/", function(req,res){

    res.sendFile(__dirname + "/signup.html");

})

app.post("/", function(req,res){

    const fName = req.body.nombre;
    const lName = req.body.apellido;
    const email = req.body.email;

    //structure of data to post to mailchimp
    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: fName,
                    LNAME: lName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const listId = process.env.LIST_ID; 
    const apiKey =  process.env.API_KEY

    const url = "https://us21.api.mailchimp.com/3.0/lists/" + listId

    const options = {
        method: "POST",
        auth: apiKey 
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            console.log("success!!")
            //res.send("Successfully subscribed!")
            res.sendFile(__dirname + "/success.html")
        }
        else {
            console.log("Something were wrong!!, statusCode: " + response.statusCode)
            //res.send("Something were wrong, Please try again!")
            res.sendFile(__dirname + "/failure.html")
        }

        // response.on("data", function(data){
        //    //console.log(JSON.parse(data));
        // })

        // console.log(response.statusCode)

    })

    request.write(jsonData)
    request.end()

})

app.post("/failure", function(req,res){
    //console.log(res);
    res.redirect("/")
})

app.listen(port, function(){
    console.log("Server initiated on port " + port);
})

