//SecureCall/public/website-server.js
var path = require('path');
//Self-signed key for https
//var privateKey = fs.readFileSync('certificates/SecureCall.key', 'utf-8');
//var certificates = fs.readFileSync('certificates/SecureCall.crt', 'utf-8');
/*
var credentials = {
    key: privateKey,
    cert: certificates
};*/
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', function (req, res) {
    //res.send(__dirname + '/index.html');
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(PORT,function(){
    console.log('Server started on: '+PORT);
});
//var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);
//Allow access from all device of the network
//For http
//var LANaccess = '0.0.0.0';
//httpServer.listen(PORT,LANaccess);
//For https
//httpsServer.listen(PORT, LANaccess);
app.use('/resources', express.static('./source'));