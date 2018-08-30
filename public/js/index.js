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

var formattedTime=moment(message.createdAt).format('h:mm a');

var li=jQuery('<li></li>');
li.text(message.from+"  "+formattedTime+"  "+message.text);

jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function (message){
    var formattedTime=moment(message.createdAt).format('h:mm a');
var li=jQuery('<li></li>');
var a=jQuery('<a target="_blank">My Current Location</a>');

li.text(message.from+" "+formattedTime+" ");
a.attr('href',message.url);  
li.append(a);
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

var messageTextbox=jQuery('[name=message]');

socket.emit('createMessage',{
from:'User',
text:messageTextbox.val()
},function (){
messageTextbox.val('');
});
});

var locationButton=jQuery('#send-location');
locationButton.on('click',function (){
if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser.');
}

locationButton.attr('disabled','disabled').text('Sending location ...');

navigator.geolocation.getCurrentPosition(function (position){  //sucess
// console.log(position);
locationButton.removeAttr('disabled').text('Send location');
socket.emit('createLocationMessage',{
    latitude:position.coords.latitude,
    longitude:position.coords.longitude
});
},function (){               
    locationButton.removeAttr('disabled').text('Send location');                          // failure
    alert('Unable to fetch location.');
});
}); 