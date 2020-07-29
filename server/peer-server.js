var fs = require('fs');
var PeerServer=require('peer').PeerServer;

var server=PeerServer({
    port:9000,
    path:'/peerjs',
    ssl:{
        key: fs.readFileSync('./../certificates/SecureCall.key','utf-8'),
        cert: fs.readFileSync('./../certificates/SecureCall.crt','utf-8')
    }
});