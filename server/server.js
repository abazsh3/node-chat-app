const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const {generateMessage,generateMessage2} = require('./utils/message');
let {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
let express = require('express');
let publicPath = path.join(__dirname, "../public");
let app = express();
let server = http.createServer(app);
let io = socketIo(server);
let users = new Users();

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("new user connected");
    socket.on("createMessage", function(message, callback){

        console.log(message);
        let user=users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
            io.to(user.room).emit("newMessage2", generateMessage(user.name, message.text));
            console.log('message emitted');
        }

        try {
            callback();
        } catch (e) {

        }
    });
    socket.on("createMessage2", function(from,text){

        console.log(from , text);
        let user=users.getUser(socket.id);
        if (user && isRealString(text)) {
            io.to(user.room).emit("newMessage", generateMessage2(user.name, text));
            io.to(user.room).emit("newMessage2", generateMessage2(user.name, text));
            console.log('message emitted');
        }
    });
    socket.on('join', function(params, callback){
        try {
            console.log(JSON.parse(params));
        }catch (e) {

        }

        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('name and room name are required!')
        }
        users.removeUser(socket.id);
        socket.join(params.room);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit("updateUsersList", users.getUserList(params.room));
        socket.emit("newMessage", generateMessage("Admin", "welcome to chat app"));
        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined the chat`));
        socket.emit("newMessage2", generateMessage("Admin", "welcome to chat app"));
        socket.broadcast.to(params.room).emit("newMessage2", generateMessage("Admin", `${params.name} has joined the chat`));
    });
    socket.on('join2', function(userName,roomName){
        users.removeUser(socket.id);
        socket.join(roomName);
        users.addUser(socket.id, userName, roomName);
        io.to(roomName).emit("updateUsersList", users.getUserList(roomName));
        socket.emit("newMessage", generateMessage("Admin", "welcome to chat app"));
        socket.broadcast.to(roomName).emit("newMessage", generateMessage2("Admin", `${userName} has joined the chat`));
        socket.emit("newMessage2", generateMessage("Admin", "welcome to chat app"));
        socket.broadcast.to(roomName).emit("newMessage2", generateMessage2("Admin", `${userName} has joined the chat`));
    });
    socket.on("disconnect", function() {
        let user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit("updateUsersList", users.getUserList(user.room));
            io.to(user.room).emit("newMessage", generateMessage('Admin', `${user.name} has left the chat`));
            io.to(user.room).emit("newMessage2", generateMessage('Admin', `${user.name} has left the chat`));
        }
    });
    socket.on('updateUsersList', function(users)  {

    })
});
server.listen(process.env.PORT || 3000, function () {
    console.log('listening on', process.env.PORT || 3000);
});