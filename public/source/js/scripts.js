document.addEventListener("DOMContentLoaded", function (event) {
    var peer_id;
    var username;
    var conn;


    var peer = new Peer({
        host:'peerjs-server.herokuapp.com', 
        secure:true, 
        port:443
        /*host: "localhost",
        port: 9000,
        path: "/peerjs",
        debug: 3,
        config: {
            'iceserver': [
                { url: 'stun:stun1.l.google.com:19302' },
                { url: 'stun:stun2.l.google.com:19302' },
                { url: 'stun:stun3.l.google.com:19302' },
                { url: 'stun:stun4.l.google.com:19302' },
                {
                    url: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                }
            ]
        }*/
    });

    peer.on('open', function (ShowId) {
        document.getElementById('peer-id-label').innerHTML ='This is YOUR ID: ' + peer.id;
    });

    peer.on('connection', function (connection) {
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
        alert('Some thing went wrong: ' + err);
        console.error(err);
    });

    //Recieving end
    peer.on('call', function (call) {
        var acceptCall = confirm('Incoming Call. Accept ?');
        if (acceptCall) {
            //Answer call with your stream(video/audio)
            call.answer(window.localStream);
            //Recive data;
            call.on('stream', function (stream) {
                window.peer_stream = stream;
                //Display stream of other user
                onReceiveStream(stream, 'peer-camera');
            });
            //End call
            call.on('close', function (endCall) {
                alert('Call ended');
            });
        } else {
            console.log('Call denied');
        }
    });
    //Request camera and microphone perm
    function requestLocalVideo(callback) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;//Random sheet for patching stuff Lol
        //Request audio
        navigator.getUserMedia({
            audio: true,
            video: true
        },
            callbacks.success,
            callbacks.error
        );
    }

    //Handle the ReceiveStream

    function onReceiveStream(stream, element_id) {
        var video = document.getElementById(element_id);
        video.src = window.URL.createObjectURL(stream);
        window.peer_stream = stream;
    }

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
        console.log('Calling' + peer_id);
        console.log(peer);

        var call=peer.call(peer_id,window.localStream);

        call.on('stream',function(stream){
            window.peer_stream=stream;
            onReceiveStream(stream,'peer-camera');
        });
    },false);
    //Connect button
    document.getElementById('connect-to-peer-btn').addEventListener('click',function(){
        username=document.getElementById('name').value;
        peer_id=document.getElementById('peer_id').value;
        if(peer_id){
            conn=peer.connect(peer_id,{
                metadata:{
                    'username':username
                }
            });
            
            conn.on('data',handleMessage);
        }else{
            alert('Provide a peer to connect');
            return false;
        }

        document.getElementById('chat').className="";
        document.getElementById('connection-form').className+=" invisible";
    },false);
    //Localhost testing

    requestLocalVideo({
        success: function(stream){
            window.localStream = stream;
            onReceiveStream(stream, 'my-camera');
        },
        error: function(err){
            alert("Cannot get access to your camera and video !");
            console.error(err);
        }
    });

}, false);