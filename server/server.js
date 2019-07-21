const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const {generateMessage} = require('./utils/message');
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
        let user=users.getUser(socket.id);
        if (user&&isRealString(message)) {
            io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
        }


        try {
            callback();
        } catch (e) {

        }
    });
    socket.on('join', function(params, callback){
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('name and room name are required!')
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit("updateUsersList", users.getUserList(params.room));
        socket.emit("newMessage", generateMessage("Admin", "welcome to chat app"));
        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined the chat`));
    });
    socket.on("disconnect", function() {
        let user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit("updateUsersList", users.getUserList(user.room));
            io.to(user.room).emit("newMessage", generateMessage('Admin', `${user.name} has left the chat`));
        }
    });
    socket.on('updateUsersList', function(users)  {

    })
});
server.listen(process.env.PORT || 3000, function () {
    console.log('listening on', process.env.PORT || 3000);
});