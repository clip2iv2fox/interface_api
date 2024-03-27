var webSocket;
var messageDiv;
var textInput;
var hostURL;
var websocketReadyStateArray;
var connectBtn;
var disconnectBtn;

export function init(){
    messageDiv = document.getElementById("message");
    textInput = document.getElementById("text");
    hostURL = "ws://172.26.48.137:8995";
    websocketReadyStateArray = new Array('Connecting', 'Connected', 'Closing', 'Closed');
    // connectBtn = document.getElementById('connect');
    // disconnectBtn = document.getElementById('disconnect');
    // connectBtn.disabled = false;
    // disconnectBtn.disabled = true;
}

export function connect(){
    let data: any = []
    try{
        webSocket = new WebSocket(hostURL);
        // messageDiv.innerHTML = "<p>Socket status:" + websocketReadyStateArray[webSocket.readyState] + "</p>";
        webSocket.onopen = function(){
            // messageDiv += "<p>Socket status:" + websocketReadyStateArray[webSocket.readyState] + "</p>";
            // connectBtn.disabled = true;
            // disconnectBtn.disabled = false;
            console.log("<p>Socket status:" + websocketReadyStateArray[webSocket.readyState] + "</p>")
        }
        webSocket.onmessage = function(msg){
            // messageDiv.innerHTML += "<p>Server response : " + msg.data + "</p>";
            console.log("<p>Server response : " + msg.data + "</p>")
            data.push(msg.data)
        }
        webSocket.onclose = function(){
            // messageDiv.innerHTML += "<p>Socket status:" + websocketReadyStateArray[webSocket.readyState] + "</p>";
            // connectBtn.disabled = false;
            // disconnectBtn.disabled = true;
            console.log("<p>Socket status:" + websocketReadyStateArray[webSocket.readyState] + "</p>")
        }
    }catch(exception){
            console.log(exception)
            // messageDiv.innerHTML += 'Exception happen, ' + exception;
    }
    return data
}

export function sendMessage(call: string){
    console.log(call, typeof(call))
    webSocket.send(call)
}

export function disconnect(){
    console.log("disconnect")
    webSocket.close();
}