// var socketr=io();
var socket = io.connect('http://localhost:3000');

socket.on('connect',function (){
console.log('Connected to server'); //prints on developer option

// socket.emit('createMessage',{
//     from:'Harpreet',
//     text:'Yup, that works for me.'
// });
});

socket.on('disconnect',function (){
console.log('Disconnected from server');//prints on developer option
});

socket.on('newMessage',function (message){
console.log('newMeassgae',message);
});