# SecureCall is a P2P video and messaging<br>
<br>
Technology:<br>
+Node.js<br>
+Peer.js<br>
+Angular<br>

Framework: Bootstrap

Run commands:
```bash
git clone https://github.com/technich214/SecureCall.git <name-of-your-app-here>
cd <name-of-your-app-here>
```
Install dependencies
```bash
npm i
```
Start
```bash
npm start
```
It will be hosted on **localhost:5000**


This is a video chat app, that allow 2 people to talk to each other. I buld this to create a more secure channel of communication for other stuffz.<br>
<br>
<br>
Link for the working demo hosted on Heroku: https://securecall.herokuapp.com/

**IMPORTANT**<br>
The peerjs server is the default one so you SHOULD change it to one off your privately owned server.<br>

Go to: /home/raito/Documents/College Shitz/tmp/SecureCall/public/js/scripts.js<br>

var peer = new Peer({<br>
secure: true,<br>
port: 443,<br>
config: {<br>
'iceServers': [<br>
{ url: 'stun:stun.l.google.com:19302' },<br>
{ url: 'stun:stun1.l.google.com:19302' },<br>
{ url: 'stun:stun2.l.google.com:19302' },<br>
{ url: 'stun:stun3.l.google.com:19302' },<br>
{ url: 'stun:stun4.l.google.com:19302' },<br>



Add host:"Yeh Host"<br>
Add key:"Yeh Key"<br>
Above secure:true
