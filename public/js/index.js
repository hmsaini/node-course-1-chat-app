// var socketr=io();
var socket = io.connect('http://localhost:3000');

socket.on('connect',function (){
console.log('Connected to server');          //prints on developer option

// socket.emit('createMessage',{
//     from:'Harpreet',
//     text:'Yup, that works for me.'
// });
});

socket.on('disconnect',function (){
console.log('Disconnected from server');       //prints on developer option----on refresh
});

socket.on('newMessage',function (message){    //
console.log('newMeassgae',message);

var li=jQuery('<li></li>');
li.text(message.from+":"+message.text);

jQuery('#messages').append(li);
});

// socket.emit('createMessage',{
//     from:'Frank',
//     text:'Hii'
// },function(data){
//     console.log('Got it',data);
// });

jQuery('#message-form').on('submit',function (e){
e.preventDefault();

socket.emit('createMessage',{
from:'User',
text:jQuery('[name=message').val()
},function (){

});
});