const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
let express = require('express');
let publicPath = path.join(__dirname, "../public");
let app = express();
let server = http.createServer(app);
let io=socketIo(server);

app.use(express.static(publicPath));
io.on("connection",(socket)=>{
   console.log("new user connected");
    socket.emit("newMessage",{
        from: "Admin",
        text: "welcome to chat room",
        createdAt: new Date().getTime()
    });
    socket.broadcast.emit("newMessage",{
        from:"Admin",
        text:"new user joined",
        createdAt: new Date().getTime()
    });
   socket.on("createMessage",(message)=>{
       console.log(message);

       io.emit("newMessage",{
           from:message.from,
           text:message.text,
           createdAt:new Date().getTime()
       })
       // socket.broadcast.emit("newMessage",{
       //     from:message.from,
       //     text:message.text,
       //     createdAt:new Date().getTime()
       // })
   });
   socket.on("disconnect",()=>{
       console.log("user disconnected");
   });
});
server.listen(process.env.PORT || 3000, function () {
    console.log('listening on', process.env.PORT || 3000);
});