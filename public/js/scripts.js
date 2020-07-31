document.addEventListener("DOMContentLoaded", function (event) {
    var peer_id;
    var username;
    var conn;
    //Bug fixing
    navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;//Browser patching
    var peer = new Peer();
    var myVideo = document.getElementById('my-camera');
    var peerVideo = document.getElementById('peer-camera');
    var myStream;
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(function (stream) {
        myStream = stream;
        myVideo.srcObject = myStream;
    });
    peer.on('open', function (ShowId) {
        document.getElementById('peer-id-label').innerHTML = 'This is YOUR ID: ' + peer.id;
    });

    peer.on('connection', function (connection) {
        alert('Connected');
        conn = connection;
        peer_id = connection.peer;
        conn.on('data', handleMessage);
        //Disapear peer_id and set incoming id as peer_id value
        document.getElementById('peer_id').className += ' invisible';
        document.getElementById('peer_id').value = peer_id;
        document.getElementById('connected_peer').innerHTML = connection.metadata.username;
        document.getElementById('connector_peer').className = 'badge badge-secondary';
    });
    //Reporting error
    peer.on('error', function (err) {
        alert('Something went wrong: ' + err);
        console.error(err);
    });

    //Recieving end
    peer.on('call', function (call) {
        alert('Incoming call')
        //var acceptCall = confirm('Incoming Call. Accept ?');
        //Answer call with your stream(video/audio)
        call.answer(myStream);
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
        //If message is yours, set text right;
        if (data.from == username) {
            orientation = 'text-right';
        }
        var messageHTML = '<a href="javascript:void(0);" class="list-group-item' + orientation + '">';
        messageHTML += '<h4 class="list-group-item-heading">' + data.from + '</h4>';
        messageHTML += '<p class="list-group-item-text">' + data.text + '</p>';
        messageHTML += '</a>';
        document.getElementById("messages").innerHTML += messageHTML;
    }
    //Send message button
    document.getElementById('send-message').addEventListener('click', function () {
        //Get text;
        var text = document.getElementById('message').value;
        //Preping data
        var data = {
            from: username,
            text: text
        };
        //Peerjs send message
        conn.send(data);

        handleMessage(data);
        document.getElementById("message").value = "";//Go down a line
    }, false);
    //Call button
    document.getElementById("call").addEventListener('click', function () {
        alert('Calling: ' + peer_id);
        var call = peer.call(peer_id, myStream);
        call.on('stream', function (stream) {
            peerVideo.srcObject = stream;
        });
    }, false);
    //Connect button
    document.getElementById('connect-to-peer-btn').addEventListener('click', function () {
        username = document.getElementById('name').value;
        peer_id = document.getElementById('peer_id').value;
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

        document.getElementById('chat').className = "";
        document.getElementById('connection-form').className += " invisible";
    }, false);

}, false);