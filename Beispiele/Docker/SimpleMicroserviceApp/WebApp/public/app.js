$(() => {
    startWebSocket();
    $("#sendBtn").click(sendMessage);

    $("input[name='message']").on('keypress',(e) => {
        // RETURN keycode
        if(e.which == 13) {
            sendMessage();
        }
    });
});

function sendMessage() {
    let nicknameInput = $("input[name='nickname']").first();
    let nickname = nicknameInput.val();

    let messageInput = $("input[name='message']").first();
    let message = messageInput.val();
    messageInput.val("");

    let data = {
        message: message,
        nickname: nickname
    };

    let dataString = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url: "/message",
        data: dataString,
        contentType: "application/json",
      });
}

function startWebSocket() {
    let ws = new WebSocket("ws://localhost:8080/updates");

    ws.onopen = () => console.log("WebSocket connection opened");
    ws.onclose = () => console.log("WebSocket connection closed");
    ws.onerror = () => console.log("WebSocket connection error");
    ws.onmessage = (eventData) => {
        let json = eventData.data;
        console.log("WebSocket Message: " + json);

        let messageObject = JSON.parse(json);
        prependMessage(messageObject);
    };
}


function prependMessage(messageObject) {
    let nickname = messageObject.nickname;
    let message = messageObject.message;

    let nickSpan = $("<span/>");
    nickSpan.append(nickname);
    nickSpan.addClass("nickname");
    
    let msgSpan = $("<span/>");
    msgSpan.append(message);
    msgSpan.addClass("message");

    let divWrapper = $("<div/>");
    divWrapper.addClass("messageWrapper");

    divWrapper.append(nickSpan);
    divWrapper.append(msgSpan);

    $("#messageBox").prepend(divWrapper);
}
