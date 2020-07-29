//SecureCall/public/website-server.js

var fs = require('fs');
var http = require('http');
var https = require('https');
var os = require('os');
var path = require('path');
var iface = os.networkInterfaces();

//Self-signed key for https
var privateKey = fs.readFileSync('./../certificates/SecureCall.key', 'utf-8');
var certificates = fs.readFileSync('./../certificates/SecureCall.crt', 'utf-8');

var credentials = {
    key: privateKey,
    cert: certificates
};
var express = require('express');
var app = express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

Object.keys(iface).forEach(function (ifname) {
    var alias = 0;
    iface[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal != false) {
            return;
            //Skip 127.0.0.1 and non ipv4
        }
        console.log("");
        console.log("Welcome to the chat box");
        console.log("");
        console.log("Test chat interface at: ", "https//localhost:8443");
        console.log("");
        if (alias >= 1) {
            console.log("Multiple ipv4 address were found");
            console.log(ifname + ':' + alias, "https://" + iface.address + ":8443")
        } else {
            console.log(ifname, "https://" + iface.address + ":8443");
        }
        alias++;
    });
});


//Allow access from all device of the network
//For http
var LANaccess='0.0.0.0';
httpServer.listen(8080,LANaccess);
//For https
httpsServer.listen(8443,LANaccess);

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.use('/resources',express.static('./source'));