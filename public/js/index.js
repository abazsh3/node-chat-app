let socket = io();
socket.on("connect",function(){
    console.log("connected to server")
});
socket.on("disconnect",function(){
    console.log("disconnected");
});
socket.on("newMessage",function (message) {
    console.log("new message",message);
});


