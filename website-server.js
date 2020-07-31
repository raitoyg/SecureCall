
//Adding lib for video call and stuff
var fs     = require('fs');
var http   = require('http');
var https   = require('https');
var os     = require('os');
var ifaces = os.networkInterfaces();
var path = require('path');
//Server Lib
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
//https server for localhost testing
// var privateKey  = fs.readFileSync('certificates/SecureCall.key', 'utf8');
// var certificate = fs.readFileSync('certificates/SecureCall.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//http server
var LANtesting='0.0.0.0';
http.createServer(app).listen(PORT,function(){
    console.log('Listening at '+PORT);
});
//https server for localhost testing
// https.createServer(credentials, app).listen(6969,LANtesting,function(){
//     console.log('https server listening at: 6969');
// });

app.use('/resources', express.static('./public'));