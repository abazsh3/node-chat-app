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
   socket.on("disconnect",()=>{
       console.log("user disconnected");
   });
});
server.listen(process.env.PORT || 3000, function () {
    console.log('listening on', process.env.PORT || 3000);
});