document.addEventListener("DOMContentLoaded", function (event) {
    var peer_id;
    var username;
    var conn;

    var mediaOptions = {
        video: true,
        audio: true
    };

    //Bug fixing
    navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;//Browser patching

    var peer = new Peer({
        key: 'peerjs',
        host: 'scpeerjsserver.herokuapp.com',
        secure: true,
        port: 443,
        config: {
            'iceServers': [
                { url: 'stun:stun.l.google.com:19302' },
                { url: 'stun:stun1.l.google.com:19302' },
                { url: 'stun:stun2.l.google.com:19302' },
                { url: 'stun:stun3.l.google.com:19302' },
                { url: 'stun:stun4.l.google.com:19302' },
                {
                    url: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
                {
                    url: 'turn:192.158.29.39:3478?transport=udp',
                    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    username: '28224511:1379330808'
                },
                {
                    url: 'turn:192.158.29.39:3478?transport=tcp',
                    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    username: '28224511:1379330808'
                }
            ]
        }
    });

    var myVideo = document.getElementById('my-camera');
    var peerVideo = document.getElementById('peer-camera');
    var myStream;
    var peerStream;

    //Getting local Stream
    navigator.mediaDevices.getUserMedia(mediaOptions).then(function (stream) {
        //Store in global refrence for later use
        myStream = stream;
        myVideo.srcObject = myStream;
    });

    //Getting peer id
    peer.on('open', function (ShowId) {
        document.getElementById('peer-id-label').innerHTML = peer.id;
    });

    //Establish connection
    peer.on('connection', function (connection) {
        //Store in global refrence for later use
        conn = connection;
        peer_id = connection.peer;
        var peerName = connection.metadata.username;
        //Alert user upon connection
        alert(peer_id + ' has connected to you!\nPress [Connect to peer] to open 2 way communication');
        //Upon recieve data display it correctly
        conn.on('data', handleMessage);
        //Disapear peer_id and set incoming id as peer_id value
        document.getElementById('peer_id').className += ' invisible';
        document.getElementById('peer_id').value = peer_id;
        document.getElementById('connected_peer_container').className = 'col-lg-5 control-label text-danger';
        //If peerName is Empty replace it with Anonymous
        if (peerName) {
            document.getElementById('connected_peer').innerHTML = peerName;
        } else document.getElementById('connected_peer').innerHTML = 'Anonymous';
    });

    //Recieving end
    peer.on('call', function (call) {
        console.log('Incoming call');
        alert('Incoming call');
        //Answer call with local stream
        call.answer(myStream);
        const endCallBtn = document.querySelector('#endCall');
        endCallBtn.disabled = false;
        //Recive data;
        call.on('stream', function (stream) {
            peerVideo.srcObject = stream;
        });
        //End call
        call.on('close', function (endCall) {
            alert('Call ended');
        });
    });

    //Add received and sent messages to chat box;
    function handleMessage(data) {
        var orientation = "text-left";
        var color = "text-primary";
        //If message is yours, set text right;
        if (data.from == username) {
            orientation = 'text-right';
            var color = "text-info";
        }
        var messageHTML = `<a href="#" class="list-group-item ${orientation} ${color}" style="text-decoration: none;">`;
        if (data.from != '') {
            messageHTML += '<p class="list-group-item-heading">' + data.from + '</p>';
        } else messageHTML += '<p class="list-group-item-heading">' + 'Anonymous' + '</p>';
        messageHTML += '<p class="list-group-item-text display-4">' + data.text + '</p>';
        messageHTML += '</a>';
        document.getElementById("messages").innerHTML += messageHTML;
    }

    //Microphone toggle //NOT WORKING 
    document.getElementById('micToggle').addEventListener('click', function () {
        if (mediaOptions.audio == false) {
            mediaOptions.audio = true;
            document.getElementById('micToggle').innerHTML = 'Mic off';
            console.log('Audio is on');
        } else {
            mediaOptions.audio = false;
            document.getElementById('micToggle').innerHTML = 'Mic on';
            console.log('Audio is off');
        }
    });

    //Send message button
    document.getElementById('send-message').addEventListener('click', function () {
        //Get text;
        var text = document.getElementById('message').value;
        var messageContainer = document.getElementById('messages-container');
        //Preping data
        var data = {
            from: username,
            text: text
        };
        //Peerjs send message
        conn.send(data);
        //Display sended message on screen
        handleMessage(data);
        //Go down a line
        document.getElementById("message").value = "";
        //Scroll the message to the bottom
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }, false);

    //Send message upon pressing Enter
    document.getElementById('message').addEventListener('keyup', function (pressEnter) {
        if (pressEnter.keyCode === 13) {
            pressEnter.preventDefault();
            document.getElementById('send-message').click();
        }
    })

    //Call button
    document.getElementById("call").addEventListener('click', function () {
        alert('Calling: ' + peer_id);
        var call = peer.call(peer_id, myStream);
        call.on('stream', function (stream) {
            //Store in global refrence for later use
            peerStream = stream
            peerVideo.srcObject = peerStream;//Display peer video
            const endCallBtn = document.querySelector('#endCall');
            endCallBtn.disabled = false;
        });
    }, false);


    //Connect button
    document.getElementById('connect-to-peer-btn').addEventListener('click', function () {
        //Store in global refrence for later use
        username = document.getElementById('name').value;
        peer_id = document.getElementById('peer_id').value;
        //If peer_id exist then connect to peer_id while sending Local username
        if (peer_id) {
            conn = peer.connect(peer_id, {
                metadata: {
                    'username': username
                }
            });
            conn.on('data', handleMessage);
        } else {
            alert('Provide a peer to connect');
            return false;
        }
        //Disapearing the peer id box and display message
        document.getElementById('chat').className = "";
        document.getElementById('connection-form').className += " invisible";
        document.getElementById('messages-container').className = "messageBox";
        //Person has joined the chat
    }, false);

    //Reporting error
    peer.on('error', function (err) {
        alert('Something went wrong: ' + err);
        console.error(err);
    });

}, false);