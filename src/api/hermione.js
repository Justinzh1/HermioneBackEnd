var express = require('express');
var router = express.Router();
var request = require('request');
var session = require('express-session')

var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

router.get('/', (req, res) => {
    var code = req.query.code;
    var options = {
                    url: 'https://api.box.com/oauth2/token',
                    method: 'POST',
                    headers: headers,
                    form: { 
                            code: code, 
                            grant_type: "authorization_code", 
                            client_id: process.env.BOX_CLIENT_ID, 
                            client_secret: process.env.BOX_CLIENT_SECRET 
                        }
                    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body`
            console.log("Success!");
        } else {
            console.log("Failed");
        }
        console.log(body)
    });
});

module.exports = router;