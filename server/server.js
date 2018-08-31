const path=require('path');  // built-in
const http=require('http');  // built-in
const express=require('express');
const socketIO=require('socket.io');

const {generateMessage,generateLocationMessage}=require('./utils/message');
const {isRealString}=require('./utils/validation');
const   {Users}=require('./utils/users');

const publicPath=path.join(__dirname,'../public');
const port =process.env.PORT || 3000;  //for heroku

var app=express();
var server=http.createServer(app);
var io=socketIO(server);
var users=new  Users();   

app.use(express.static(publicPath));

io.on('connection',(socket)=>{        // shows that user connected when open in chrome tab
console.log('New user connected');

// socket.emit('newMessage',{          // 2nd argu object   // prints in devepoler option
// from:'Admin',
// text:'Welcome to the chat app',    // sends to all including myself
// createdAt:new Date().getTime()
// });

socket.emit('newMessage',generateMessage('Admin','Welcome to the chat App'));

// socket.broadcast.emit('newMessage',{    // sends to all,except myself
// from:'Admin',
// text:'New user joined',
// createdAt:new Date().getTime()
// });

socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'));

// socket.on('createMessage',(message)=>{
// console.log('createMessage',message);
// io.emit('newMessage',{    //sends to all including myself
// from:message.from,
// text:message.text,
// createdAt:new Date().getTime()
// });

socket.on('join',(params,callback)=>{
if(!isRealString(params.name) || !isRealString(params.room)){
return callback('Name and room name are required.');
}

socket.join(params.room);
users.removeUser(socket.id);
users.addUser(socket.id,params.name,params.room);

io.to(params.room).emit('updateUserList',users.getUserList(params.room));

socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin','User'+" "+params.name+" "+'has Joined'));
callback();
});

socket.on('createMessage',(message,callback)=>{
console.log('createMessage',message);
var user=users.getUser(socket.id);

if(user && isRealString(message.text)){
    io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
}

callback();
});

// socket.broadcast.emit('newMessage',{ //sends to all but not myself
// from:message.from,
// text:message.text,
// createdAt:new Date().getTime()
// });
// });

socket.on('createLocationMessage',(coords)=>{
// io.emit('newMessage',generateMessage('Admin',coords.latitude+","+coords.longitude));
var user=users.getUser(socket.id);

if(user){
    io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
}

});

socket.on('disconnect',()=>{   // shows that user disconnected when close in chrome tab
    console.log('User was disconnected');
    var user=users.removeUser(socket.id);

    if(user){
        io.to(user.room).emit('updateUserList',users.getUserList(user.room));
        io.to(user.room).emit('newMessage',generateMessage('Admin',user.name+" "+'has left'));
    }
});
});

server.listen(port,()=>{
console.log('Server is up on port ',port);
});