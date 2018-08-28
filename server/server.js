const path=require('path');  // built-in
const http=require('http');  // built-in
const express=require('express');
const socketIO=require('socket.io');


const publicPath=path.join(__dirname,'../public');
const port =process.env.PORT || 3000;  //for heroku

var app=express();
var server=http.createServer(app);
var io=socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
console.log('New user connected');

socket.emit('newMessage',{          // 2nd argu object
from:'Admin',
text:'Welcome to the chat app',    // sends to all including myself
createdAt:new Date().getTime()
});

socket.broadcast.emit('newMessage',{
from:'Admin',
text:'New user joined',
createdAt:new Date().getTime()
});

socket.on('createMessage',(message)=>{
console.log('createMessage',message);
io.emit('newMessage',{    //sends to all including myself
from:message.from,
text:message.text,
createdAt:new Date().getTime()
});
// socket.broadcast.emit('newMessage',{ //sends to all but not myself
// from:message.from,
// text:message.text,
// createdAt:new Date().getTime()
// });
});

socket.on('disconnect',()=>{
    console.log('User was disconnected');
});
});

server.listen(port,()=>{
console.log('Server is up on port ',port);
});