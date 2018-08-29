const path=require('path');  // built-in
const http=require('http');  // built-in
const express=require('express');
const socketIO=require('socket.io');

const {generateMessage}=require('./utils/message');

const publicPath=path.join(__dirname,'../public');
const port =process.env.PORT || 3000;  //for heroku

var app=express();
var server=http.createServer(app);
var io=socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{        // shows that user connected when open in chrome tab
console.log('New user connected');

// socket.emit('newMessage',{          // 2nd argu object   // prints in devepoler option
// from:'Admin',
// text:'Welcome to the chat app',    // sends to all including myself
// createdAt:new Date().getTime()
// });

socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));

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

socket.on('createMessage',(message,callback)=>{
console.log('createMessage',message);
io.emit('newMessage',generateMessage(message.from,message.text));
callback('This is from the server');
});

// socket.broadcast.emit('newMessage',{ //sends to all but not myself
// from:message.from,
// text:message.text,
// createdAt:new Date().getTime()
// });
// });

socket.on('disconnect',()=>{   // shows that user disconnected when close in chrome tab
    console.log('User was disconnected');
});
});

server.listen(port,()=>{
console.log('Server is up on port ',port);
});